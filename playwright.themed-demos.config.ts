import { defineConfig } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash, randomUUID } from 'node:crypto';

const manifestPath = process.env.DEMO_ARTIFACT_MANIFEST;
if (!manifestPath) throw new Error('DEMO_ARTIFACT_MANIFEST required');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
  root: string;
  source_hashes?: Record<string, string>;
  variants: {
    name: string;
    base: string;
    port: number;
    config: string;
    dist: string;
    config_hash: string;
    html_hash: string;
    artifact_hashes?: Record<string, string>;
  }[];
};

const plumberPath = 'minimalni-navrh/ukazky/instalater/';
function verify(file: string, expected: string) {
  const actual = createHash('sha256').update(readFileSync(file)).digest('hex');
  if (actual !== expected) throw new Error(`Manifest hash mismatch for ${file}`);
}

for (const [file, expected] of Object.entries(manifest.source_hashes ?? {})) verify(file, expected);
for (const variant of manifest.variants) {
  for (const [file, expected] of Object.entries(variant.artifact_hashes ?? {})) verify(file, expected);
  verify(variant.config, variant.config_hash);
  verify(join(variant.dist, plumberPath, 'index.html'), variant.html_hash);
}

function baseURL(variant: (typeof manifest.variants)[number]) {
  return `http://127.0.0.1:${variant.port}${variant.base}/`;
}

export default defineConfig({
  testDir: './tests',
  testMatch: 'themed-demos.spec.ts',
  workers: 1,
  reporter: 'list',
  outputDir: join(tmpdir(), `radeq-themed-demos-${randomUUID()}`),
  use: {
    serviceWorkers: 'block',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
  },
  webServer: manifest.variants.map(variant => ({
    command: `npm run preview -- --ignore-lock --config "${relative(manifest.root, variant.config)}" --host 127.0.0.1 --port ${variant.port}`,
    cwd: manifest.root,
    url: baseURL(variant) + plumberPath,
    reuseExistingServer: false,
    env: { DEPLOY_TARGET: variant.base ? 'github-pages' : '' },
    timeout: 120_000,
  })),
  projects: manifest.variants.map(variant => ({ name: variant.name, use: { baseURL: baseURL(variant) } })),
});
