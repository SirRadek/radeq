import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { closeSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const sourceDirectories = ['src', 'functions', 'tests', 'public', 'scripts', 'release', 'migrations'];
const configFiles = [
  'astro.config.mjs', 'tsconfig.json', 'package.json', 'package-lock.json', 'playwright.config.ts',
  'playwright.themed-demos.config.ts', 'vitest.config.ts', 'wrangler.jsonc',
];
const compiledTests = [
  'tests/themed-demos-state.test.mjs', 'tests/themed-demos-preview.test.mjs',
  'tests/four-showcases-preview.test.mjs', 'tests/public-preview-contract.test.mjs', 'tests/english-showcases.test.mjs',
];
const root = process.cwd();
const astro = resolve('node_modules/astro/bin/astro.mjs');
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function hashes(files) {
  return Object.fromEntries(files.sort().map(file => [file, hash(file)]));
}

function sourceHashes() {
  return hashes([...sourceDirectories.flatMap(dir => walk(resolve(dir))), ...configFiles.map(file => resolve(file))]);
}

function seal(manifest, sources) {
  const revision = spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { encoding: 'utf8' });
  manifest.revision = revision.status === 0 ? revision.stdout.trim() : null;
  manifest.source_directories = sourceDirectories;
  manifest.source_hashes = sources;
  for (const variant of manifest.variants) variant.artifact_hashes = hashes(walk(variant.dist));
  return manifest;
}

function runNode(args, env, directory, stdout, stderr, failure) {
  const out = openSync(join(directory, stdout), 'w');
  try {
    const err = openSync(join(directory, stderr), 'w');
    try {
      const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: ['ignore', out, err] });
      if (result.error) throw result.error;
      if (result.status !== 0) throw new Error(`${failure}. See ${join(directory, stdout)} and ${stderr}`);
    } finally {
      closeSync(err);
    }
  } finally {
    closeSync(out);
  }
}

if (process.argv[2] === '--seal') {
  const file = process.argv[3];
  const retained = JSON.parse(readFileSync(file, 'utf8'));
  writeFileSync(file, JSON.stringify(seal(retained, sourceHashes()), null, 2));
  console.log('retained sources and compiled artifacts sealed; no rebuild');
  process.exit(0);
}

const history = resolve('docs/audits/2026-10-09-themed-demos');
const run = join(history, `build-${Date.now()}`);
mkdirSync(history, { recursive: true });
mkdirSync(run);
const inputs = sourceHashes();
const variants = [];
for (const [name, base, port] of [['root', '', 4213], ['subpath', '/radeq', 4214]]) {
  const directory = join(run, name);
  mkdirSync(directory);
  const config = join(directory, 'astro.config.mjs');
  const dist = join(directory, 'dist');
  const configUrl = pathToFileURL(resolve('astro.config.mjs')).href;
  const overrides = { root, base: base || '/', outDir: dist, cacheDir: join(directory, 'cache') };
  writeFileSync(config, `import original from ${JSON.stringify(configUrl)};export default {...original,...${JSON.stringify(overrides)}};`);
  const env = { ...process.env };
  if (base) env.DEPLOY_TARGET = 'github-pages';
  else delete env.DEPLOY_TARGET;
  runNode([astro, 'build', '--config', relative(root, config)], env, directory, 'build.log', 'error.log', 'build failed');
  const html = join(dist, 'minimalni-navrh/ukazky/instalater/index.html');
  variants.push({ name, base, port, config, dist, config_hash: hash(config), html_hash: hash(html) });
}
const manifest = join(run, 'artifact-manifest.json');
writeFileSync(manifest, JSON.stringify(seal({ root, variants }, inputs), null, 2));
runNode([resolve('node_modules/vitest/vitest.mjs'), 'run', ...compiledTests],
  { ...process.env, DEMO_ARTIFACT_MANIFEST: manifest }, run, 'green.log', 'green-error.log', 'compiled tests failed');
runNode([astro, 'check', '--tsconfig', 'tsconfig.json'],
  process.env, run, 'typecheck.log', 'typecheck-error.log', 'scoped typecheck failed');

if (JSON.stringify(sourceHashes()) !== JSON.stringify(inputs)) {
  throw new Error('Sources changed during verification. Rebuild before previewing.');
}
// A failed or interrupted build must leave the previous preview pointer intact.
const nextPointer = join(run, 'latest-manifest.tmp');
writeFileSync(nextPointer, manifest);
renameSync(nextPointer, join(history, 'latest-manifest.txt'));
console.log(manifest);
