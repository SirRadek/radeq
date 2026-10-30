import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

const open = new Set();
export function closeSqliteDbs() { for (const db of open) db.close(); open.clear(); }
export function sqliteD1({ filename = ':memory:', migrate = true, leads = true, onQuery = () => {} } = {}) {
  const sqlite = new DatabaseSync(filename);
  open.add(sqlite);
  sqlite.exec('PRAGMA busy_timeout=10000');
  if (migrate) sqlite.exec(readFileSync(new URL('../../migrations/0001_atomic_quotas.sql', import.meta.url),'utf8'));
  if (leads) sqlite.exec(`CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY,created_at TEXT,status TEXT,name TEXT,email TEXT,company TEXT,project_type TEXT,audience TEXT,deadline TEXT,current_url TEXT,budget_range TEXT,message TEXT,source_path TEXT,referrer TEXT,locale TEXT)`);
  const db = {
    sqlite,
    prepare(query) {
      // All SQL is executed by SQLite; unknown or malformed statements throw.
      const prepared = sqlite.prepare(query);
      const wrap = values => ({
        query, values,
        bind(...bound) { return wrap(bound); },
        async all() { onQuery(query,values); return {success:true,results:prepared.all(...values)}; },
        async run() { onQuery(query,values); prepared.run(...values); return {success:true}; },
      });
      return wrap([]);
    },
    async batch(statements) {
      sqlite.exec('BEGIN IMMEDIATE');
      try { const results=[]; for (const statement of statements) results.push(await statement.all()); sqlite.exec('COMMIT'); return results; }
      catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
  return db;
}
