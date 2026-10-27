import { test, expect, beforeAll, afterAll, vi } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, cpSync, mkdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { assertContactContract, archiveCompiled } from './helpers/compiled-html.mjs';
import { createEmptyLeadSubmission, validateLeadSubmission, normalizeLeadSubmission, getMissingLeadFields } from '../src/lib/leads';
import { onRequestPost } from '../functions/api/leads';

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
  const rows = []; const kv = new Map();
  const statement = { bind(...values) { rows.push(values); return this; }, async run() { return { success: true }; } };
  const env = { LEADS_DB: { prepare: () => statement }, MEASURE_RATE_LIMIT: { async get(key) { return kv.get(key) ?? null; }, async put(key, value) { kv.set(key, value); } } };
  // D1/KV are fixture-only; provider fetch is blocked even if the production branch changes.
  const fetchMock = vi.fn(async () => { throw new Error('Unexpected provider fetch in keyless fixture'); });
  vi.stubGlobal('fetch', fetchMock);
  try {
    const response = await onRequestPost({ request: new Request('https://fixture.example.test/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(valid) }), env });
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ ok: true });
    expect(rows).toHaveLength(1); expect(rows[0][5]).toBe('');
    expect(fetchMock).not.toHaveBeenCalled();
  } finally { vi.unstubAllGlobals(); }
});

const root = process.cwd(); const fixtures = [];
beforeAll(() => {
  for (const base of ['/', '/preview/']) {
    const scratch = mkdtempSync(join(root, '.rq-optionality-fixture-')); const dist = join(scratch, 'dist');
    fixtures.push({ scratch, dist, base });
    writeFileSync(join(scratch, 'config.mjs'), `import config from ${JSON.stringify(resolve(root, 'astro.config.mjs'))};\nexport default {...config,base:${JSON.stringify(base)},outDir:${JSON.stringify(dist)},cacheDir:${JSON.stringify(join(scratch, 'cache'))}};`);
    const env = { ...process.env, NODE_ENV: 'production' }; delete env.DEPLOY_TARGET; delete env.BASE_URL;
    const log = execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--config', relative(root, join(scratch, 'config.mjs'))], { cwd: root, env, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    console.info(log);
    archiveCompiled(dist, join(root, 'docs/audits/2026-10-13-preview-fixes-cleanup/test-output/raw-contact', base === '/' ? 'root' : 'preview'), log);
  }
}, 120000);
afterAll(() => { for (const { scratch } of fixtures) rmSync(scratch, { recursive: true, force: true }); });
const oldOptions = {
  cs: ['Web', 'E-shop', 'Automatizace procesů', 'Data a AI', 'Audit webu nebo procesu (od 3 000 Kč)', 'Jiné'],
  en: ['Website', 'E-shop', 'Process automation', 'Data and AI', 'Website or process audit (from CZK 3,000)', 'Other'],
};
// A missing blank first choice, required category or disturbed existing choices breaks rendered output.
for (const base of ['/', '/preview/']) for (const locale of ['cs', 'en']) for (const page of ['home', 'contact']) {
  test(`compiled ${locale} ${page} has optional category at ${base}`, () => {
    const { dist } = fixtures.find(f => f.base === base);
    const path = locale === 'cs' ? (page === 'home' ? 'index.html' : 'kontakt/index.html') : (page === 'home' ? 'en/index.html' : 'en/kontakt/index.html');
    const html = readFileSync(join(dist, path), 'utf8');
    assertContactContract(html, locale, oldOptions[locale]);
  });
}

test('contact semantic contract rejects removed blank choice and weakened required fields', () => {
  const html = readFileSync(join(fixtures[0].dist, 'kontakt/index.html'), 'utf8');
  expect(() => assertContactContract(html.replace(/<option value(?:=\"\")?[^>]*>Bez výběru<\/option>/, ''), 'cs', oldOptions.cs)).toThrow();
  expect(() => assertContactContract(html.replace('name=\"project_type\"', 'name=\"project_type\" required'), 'cs', oldOptions.cs)).toThrow();
  expect(() => assertContactContract(html.replace(/(<input[^>]*name=\"name\"[^>]*?) required/, '$1'), 'cs', oldOptions.cs)).toThrow();
});
