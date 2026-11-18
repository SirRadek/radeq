import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { assertContactContract, documentNodes, attr } from './helpers/compiled-html.mjs';
import { createEmptyLeadSubmission, validateLeadSubmission, normalizeLeadSubmission, getMissingLeadFields } from '../src/lib/leads';
import { onRequestPost } from '../functions/api/leads';
import { sqliteD1, closeSqliteDbs } from './helpers/sqlite-d1.mjs';

const valid = { name: 'Fixture visitor', email: 'fixture@example.test', message: 'Please simplify our workflow.' };
// A required category, fabricated fallback or weakened retained guard breaks these cases.
for (const [description, category] of [['omitted', undefined], ['blank', ''], ['whitespace', ' \t\n ']]) {
  test(`accepts ${description} category without inventing one`, () => {
    const result = validateLeadSubmission({ ...valid, ...(category === undefined ? {} : { project_type: category }) });
    expect(result).toEqual({ ok: true, data: { ...createEmptyLeadSubmission(), ...valid } });
  });
}
test('missing-field gate requires only the three core fields', () => {
  const input = { ...createEmptyLeadSubmission(), ...valid };
  expect(getMissingLeadFields(input)).toEqual([]);
  for (const field of ['name', 'email', 'message']) {
    expect(getMissingLeadFields({ ...input, [field]: ' ' })).toEqual([field]);
    expect(validateLeadSubmission({ ...input, [field]: '' }).ok).toBe(false);
  }
});
test('preserves arbitrary legacy category normalization and length limit', () => {
  expect(normalizeLeadSubmission({ ...valid, project_type: '  Legacy\tcustom\ncategory  ' }).project_type).toBe('Legacy custom category');
  const result = validateLeadSubmission({ ...valid, project_type: 'x'.repeat(121) });
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.data.project_type).toBe('x'.repeat(120));
});
for (const [description, patch] of [
  ['malformed email', { email: 'invalid' }], ['honeypot', { honeypot: 'bot' }],
  ['private URL', { current_url: 'http://localhost/' }], ['credential URL', { current_url: 'https://user:pass@example.test/' }],
  ['non-http URL', { current_url: 'file:///tmp/file' }],
]) test(`retains rejection of ${description}`, () => expect(validateLeadSubmission({ ...valid, project_type: 'Web', ...patch }).ok).toBe(false));

test('keyless API stores empty category for an omitted category', async () => {
  const rows = [];
  const env = { LEADS_DB: sqliteD1({onQuery:(q,v)=>{if(q.includes('INSERT INTO leads'))rows.push(v)}}) };
  // Real fixture-only SQLite; provider fetch remains blocked.
  const fetchMock = vi.fn(async () => { throw new Error('Unexpected provider fetch in keyless fixture'); });
  vi.stubGlobal('fetch', fetchMock);
  try {
    const response = await onRequestPost({ request: new Request('https://fixture.example.test/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(valid) }), env });
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true });
    expect(rows).toHaveLength(1); expect(rows[0][5]).toBe('');
    expect(fetchMock).not.toHaveBeenCalled();
  } finally { vi.unstubAllGlobals(); closeSqliteDbs(); }
});

const root = process.cwd();
const categoryOptions = {
  cs: ['Web', 'E-shop', 'Automatizace procesů', 'Data a AI', 'Audit webu nebo procesu (od 3 000 Kč)', 'Jiné'],
  en: ['Website', 'E-shop', 'Process automation', 'Data and AI', 'Website or process audit (from CZK 3,000)', 'Other'],
};

const routes = {
  cs: ['index.html', 'kontakt/index.html'],
  en: ['en/index.html', 'en/kontakt/index.html'],
};
const bases = ['/', '/preview/'];

describe('rendered contact forms', () => {
  const fixtures = new Map();
  beforeAll(() => {
    for (const base of bases) {
      const scratch = mkdtempSync(join(root, '.rq-optionality-fixture-'));
      const dist = join(scratch, 'dist');
      fixtures.set(base, { scratch, dist });

      // Compile the four actual route entry points and their dependency trees.
      for (const htmlPath of Object.values(routes).flat()) {
        const file = htmlPath.replace('.html', '.astro');
        const original = join(root, 'src/pages', file);
        const target = join(scratch, 'pages', file);
        mkdirSync(dirname(target), { recursive: true });
        const content = readFileSync(original, 'utf8').replace(
          /from ['"](\.\.?\/[^'"]+)['"]/g,
          (_, specifier) => 'from ' + JSON.stringify(resolve(dirname(original), specifier).replaceAll('\\', '/')),
        );
        writeFileSync(target, content);
      }

      const config = join(scratch, 'config.mjs');
      const appConfig = pathToFileURL(resolve(root, 'astro.config.mjs')).href;
      writeFileSync(config, `import appConfig from ${JSON.stringify(appConfig)};
export default {...appConfig, base:${JSON.stringify(base)}, srcDir:${JSON.stringify(scratch)}, outDir:${JSON.stringify(dist)}, cacheDir:${JSON.stringify(join(scratch, 'cache'))}};`);
      const env = { ...process.env, NODE_ENV: 'production', DEPLOY_TARGET: '' };
      delete env.BASE_URL;
      execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--config', relative(root, config)], {
        cwd: root, env, encoding: 'utf8', timeout: 90_000,
      });
    }
  }, 200_000);

  afterAll(() => {
    for (const { scratch } of fixtures.values()) rmSync(scratch, { recursive: true, force: true });
  });

  for (const base of bases) for (const [locale, paths] of Object.entries(routes)) for (const path of paths) {
    test(`${locale} ${path} has an optional category at ${base}`, () => {
      const html = readFileSync(join(fixtures.get(base).dist, path), 'utf8');
      assertContactContract(html, locale, categoryOptions[locale]);
      const form = documentNodes(html).find(node => attr(node, 'id') === 'rq-lead-form');
      expect(attr(form, 'action')).toBe(base + 'api/leads');
      expect(attr(form, 'method')).toBe('post');
    });
  }

  test('rejects removed blank choice, required category and weakened required fields', () => {
    const html = readFileSync(join(fixtures.get('/').dist, 'kontakt/index.html'), 'utf8');
    expect(() => assertContactContract(html.replace(/<option value(?:="")?[^>]*>Bez výběru<\/option>/, ''), 'cs', categoryOptions.cs)).toThrow();
    expect(() => assertContactContract(html.replace('name="project_type"', 'name="project_type" required'), 'cs', categoryOptions.cs)).toThrow();
    expect(() => assertContactContract(html.replace(/(<input[^>]*name="name"[^>]*?) required/, '$1'), 'cs', categoryOptions.cs)).toThrow();
  });
});
