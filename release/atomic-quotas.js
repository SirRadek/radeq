// One persistent enforcement boundary for source functions and the deployed executable.
// D1 writes serialize at its primary; never substitute KV or isolate-local counters.
const GLOBAL = 'confirm:global';
const unavailable = () => ({ status: 'unavailable' });

export const quotaSql = {
  reserve: `INSERT INTO abuse_quotas(quota_key,count,reset_at,reservation_token)
    VALUES (?,1,unixepoch()+?,?)
    ON CONFLICT(quota_key) DO UPDATE SET
      count=CASE WHEN abuse_quotas.reset_at<=unixepoch() THEN 1 ELSE abuse_quotas.count+1 END,
      reset_at=CASE WHEN abuse_quotas.reset_at<=unixepoch() THEN excluded.reset_at ELSE abuse_quotas.reset_at END,
      reservation_token=excluded.reservation_token
    WHERE abuse_quotas.reset_at<=unixepoch() OR abuse_quotas.count<?
    RETURNING count,reset_at,reservation_token,unixepoch() AS now`,
  recipient: `INSERT INTO abuse_quotas(quota_key,count,reset_at,reservation_token)
    SELECT ?,1,unixepoch()+86400,? WHERE NOT EXISTS
      (SELECT 1 FROM abuse_quotas WHERE quota_key='confirm:global' AND reset_at>unixepoch() AND count>=50)
    ON CONFLICT(quota_key) DO UPDATE SET count=1,reset_at=excluded.reset_at,reservation_token=excluded.reservation_token
    WHERE abuse_quotas.reset_at<=unixepoch() AND NOT EXISTS
      (SELECT 1 FROM abuse_quotas WHERE quota_key='confirm:global' AND reset_at>unixepoch() AND count>=50)
    RETURNING count,reset_at,reservation_token,unixepoch() AS now`,
  global: `INSERT INTO abuse_quotas(quota_key,count,reset_at,reservation_token)
    SELECT 'confirm:global',1,unixepoch()+86400,? WHERE EXISTS
      (SELECT 1 FROM abuse_quotas WHERE quota_key=? AND reservation_token=?)
    ON CONFLICT(quota_key) DO UPDATE SET
      count=CASE WHEN abuse_quotas.reset_at<=unixepoch() THEN 1 ELSE abuse_quotas.count+1 END,
      reset_at=CASE WHEN abuse_quotas.reset_at<=unixepoch() THEN excluded.reset_at ELSE abuse_quotas.reset_at END,
      reservation_token=excluded.reservation_token
    WHERE abuse_quotas.reset_at<=unixepoch() OR abuse_quotas.count<50
    RETURNING count,reset_at,reservation_token,unixepoch() AS now`,
  cleanup: `DELETE FROM abuse_quotas WHERE quota_key IN
    (SELECT quota_key FROM abuse_quotas WHERE reset_at<=unixepoch() ORDER BY reset_at LIMIT 100)`,
};

async function keyFor(scope, subject) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`radeq-quota-v1\0${scope}\0${subject}`));
  return `${scope}:${Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

function rows(result) {
  if (result?.success !== true || !Array.isArray(result.results)) throw Error('quota_result');
  return result.results;
}

function granted(result, token, max) {
  const values = rows(result);
  if (!values.length) return false;
  if (values.length !== 1) throw Error('quota_rows');
  const row = values[0];
  if (row?.reservation_token !== token || !Number.isSafeInteger(row.count) || row.count < 1 || row.count > max ||
      !Number.isSafeInteger(row.now) || !Number.isSafeInteger(row.reset_at) || row.reset_at <= row.now) throw Error('quota_grant');
  return true;
}

async function limited(db, keys, max) {
  const result = await db.prepare(`SELECT MAX(reset_at) AS reset_at,unixepoch() AS now FROM abuse_quotas
    WHERE quota_key IN (${keys.map(() => '?').join(',')}) AND reset_at>unixepoch()
    AND count>=CASE WHEN quota_key='confirm:global' THEN 50 ELSE ? END`).bind(...keys,max).all();
  const values = rows(result);
  const row = values[0];
  if (values.length !== 1 || !Number.isSafeInteger(row?.now) ||
      !(row.reset_at === null || Number.isSafeInteger(row.reset_at))) throw Error('quota_retry');
  return { status: 'limited', retryAfterSeconds: Math.max(1, (row.reset_at ?? row.now) - row.now) };
}

async function cleanup(db) {
  // Bounded, indexed and best effort. An idle site can retain expired pseudonymous rows.
  // Failure cannot grant quota, cancel a successful reservation or undo a stored lead.
  try { await db.prepare(quotaSql.cleanup).run(); } catch { /* no subject/token logging */ }
}

export async function reserveQuota(db, { scope, subject, max, windowSeconds }) {
  try {
    if (!db || !['lead','measure'].includes(scope) || typeof subject !== 'string' || !subject ||
        !Number.isSafeInteger(max) || max < 1 || !Number.isSafeInteger(windowSeconds) || windowSeconds < 1) return unavailable();
    const key = await keyFor(scope, subject);
    const token = crypto.randomUUID();
    const result = await db.prepare(quotaSql.reserve).bind(key,windowSeconds,token,max).all();
    const outcome = granted(result,token,max) ? { status: 'allowed' } : await limited(db,[key],max);
    await cleanup(db);
    return outcome;
  } catch { return unavailable(); }
}

export async function reserveConfirmation(db, recipient) {
  try {
    if (!db || typeof recipient !== 'string' || !recipient.trim()) return unavailable();
    const key = await keyFor('recipient', recipient.trim().toLowerCase());
    const token = crypto.randomUUID();
    const results = await db.batch([
      db.prepare(quotaSql.recipient).bind(key,token),
      db.prepare(quotaSql.global).bind(token,key,token),
    ]);
    if (!Array.isArray(results) || results.length !== 2) return unavailable();
    const recipientGranted = granted(results[0],token,1);
    const globalGranted = granted(results[1],token,50);
    if (recipientGranted !== globalGranted) return unavailable();
    const outcome = globalGranted ? { status: 'allowed' } : await limited(db,[key,GLOBAL],1);
    await cleanup(db);
    return outcome;
  } catch { return unavailable(); }
}
