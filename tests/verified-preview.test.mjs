import { expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const verifier = fileURLToPath(new URL('../scripts/verify-themed-demos.mjs', import.meta.url));

it.each(['compiled', 'types'])('keeps the last verified preview when %s checks fail', stage => {
  const root = mkdtempSync(join(tmpdir(), 'radeq-preview-check-'));
  const write = (name, data) => {
    const path = join(root, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, data);
    return path;
  };
  try {
    for (const dir of ['src', 'functions', 'tests', 'public', 'scripts', 'release', 'migrations']) {
      mkdirSync(join(root, dir));
    }
    for (const file of ['astro.config.mjs', 'tsconfig.json', 'package.json', 'package-lock.json', 'playwright.config.ts', 'playwright.themed-demos.config.ts', 'vitest.config.ts', 'wrangler.jsonc']) {
      write(file, '{}');
    }
    const pointer = write('docs/audits/2026-10-09-themed-demos/latest-manifest.txt', 'previous-build');
    write('node_modules/astro/bin/astro.mjs', `
      import { mkdirSync, writeFileSync } from 'node:fs';
      import { dirname, join } from 'node:path';
      if (process.argv[2] === 'check') process.exit(process.env.FAIL_STAGE === 'types' ? 1 : 0);
      const target = join(dirname(process.argv.at(-1)), 'dist/minimalni-navrh/ukazky/instalater');
      mkdirSync(target, { recursive: true });
      writeFileSync(join(target, 'index.html'), 'fixture');
    `);
    write('node_modules/vitest/vitest.mjs', "process.exit(process.env.FAIL_STAGE === 'compiled' ? 1 : 0)");
    const result = spawnSync(process.execPath, [verifier], {
      cwd: root, env: { ...process.env, FAIL_STAGE: stage }, encoding: 'utf8',
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(stage === 'compiled' ? 'compiled tests failed' : 'scoped typecheck failed');
    expect(readFileSync(pointer, 'utf8')).toBe('previous-build');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
