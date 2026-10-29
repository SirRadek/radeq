import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
// A missing preview-channel branch, blocked robots crawl, leaked sitemap URLs,
// or a Czech gallery/header link on an English page must fail these contracts.
describe('compiled preview indexing and English gallery boundaries', () => {
  it.each([false, true])('renders the actual wrappers and endpoints; GitHub preview=%s', preview => {
    const scratch = mkdtempSync(join(root, '.rq-channel-fixture-'));
    const base = preview ? '/radeq' : '';
    try {
      mkdirSync(join(scratch, 'pages/en'), { recursive: true });
      const wrappers = {
        minimal: 'src/layouts/RqLayout.astro',
        customer: 'src/layouts/CustomerDemoDocument.astro',
        coffee: 'src/components/showcases/CoffeeDemoDocument.astro',
        themed: 'src/components/themed-demos/DemoThemeDocument.astro',
      };
      for (const [name, path] of Object.entries(wrappers)) {
        writeFileSync(join(scratch, `pages/${name}.astro`), `---\nimport Layout from ${JSON.stringify(resolve(root, path))};\n---\n<Layout title="Fixture" description="Fixture" lang="cs" preview={false} theme="plumber" mode="local-only"><main>Fixture</main></Layout>`);
      }
      writeFileSync(join(scratch, 'pages/en/gallery.astro'), `---\nimport Gallery from ${JSON.stringify(resolve(root, 'src/components/MinimalGallery.astro'))};\nimport Header from ${JSON.stringify(resolve(root, 'src/components/RqHeader.astro'))};\n---\n<Header alternateLabel="CS" alternatePath="/ukazky/" /><Gallery lang="en" />`);
      writeFileSync(join(scratch, 'pages/en/home.astro'), `---\nimport Home from ${JSON.stringify(resolve(root, 'src/components/MinimalHomePage.astro'))};\n---\n<Home lang="en" />`);
      mkdirSync(join(scratch, 'pages/en/ukazky'), { recursive: true });
      const route = readFileSync(join(root, 'src/pages/en/ukazky/index.astro'), 'utf8').replace(/from '([^']+)'/g, (_, path) => `from ${JSON.stringify(resolve(root, 'src/pages/en/ukazky', path))}`);
      writeFileSync(join(scratch, 'pages/en/ukazky/index.astro'), route);
      for (const endpoint of ['robots.txt', 'sitemap.xml']) writeFileSync(join(scratch, `pages/${endpoint}.ts`), `export { GET } from ${JSON.stringify(resolve(root, `src/pages/${endpoint}.ts`))};`);
      writeFileSync(join(scratch, 'config.mjs'), `import config from ${JSON.stringify(resolve(root, 'astro.config.mjs'))};\nexport default {...config,srcDir:${JSON.stringify(scratch)},outDir:${JSON.stringify(join(scratch, 'dist'))},cacheDir:${JSON.stringify(join(scratch, 'cache'))}};`);
      const env = { ...process.env, NODE_ENV: 'production', DEPLOY_TARGET: preview ? 'github-pages' : '' };
      delete env.BASE_URL; // Vitest supplies '/', which must not override the real Astro base.
      execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--config', relative(root, join(scratch, 'config.mjs'))], { cwd: root, env, encoding: 'utf8' });
      for (const name of Object.keys(wrappers)) {
        const html = readFileSync(join(scratch, `dist/${name}/index.html`), 'utf8');
        const noindex = html.match(/<meta name="robots" content="noindex,nofollow"/g) ?? [];
        expect(noindex, name).toHaveLength(preview || ['coffee', 'themed'].includes(name) ? 1 : 0);
      }
      const robots = readFileSync(join(scratch, 'dist/robots.txt'), 'utf8');
      expect(robots).toContain('Allow: /');
      expect(robots).not.toContain('Disallow:');
      expect(robots.includes('Sitemap:')).toBe(!preview);
      const sitemap = readFileSync(join(scratch, 'dist/sitemap.xml'), 'utf8');
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(sitemap.includes('<loc>')).toBe(!preview);
      const gallery = readFileSync(join(scratch, 'dist/en/gallery/index.html'), 'utf8');
      expect(gallery).toContain(`href="${base}/en/#sluzby"`);
      expect(gallery).toContain(`href="${base}/ukazky/" lang="cs"`);
      expect(gallery).not.toMatch(/demos? (?:are|remain) in Czech/i);
      for (const slug of ['instalater', 'sluzba', 'provozni-terminal', 'eshop']) expect(gallery).toContain(`href="${base}/en/ukazky/${slug}/"`);
      expect(gallery).toContain(`href="${base}/en/#kontakt"`);
      const page = readFileSync(join(scratch, 'dist/en/ukazky/index.html'), 'utf8');
      expect(page).toContain('<html lang="en"');
      expect(page).toContain(`hreflang="cs" href="https://${preview ? 'sirradek.github.io' : 'radeq.cz'}${base}/ukazky/"`);
      expect(page).toContain(`hreflang="en" href="https://${preview ? 'sirradek.github.io' : 'radeq.cz'}${base}/en/ukazky/"`);
      expect((page.match(/name="robots"/g) ?? []).length).toBe(preview ? 1 : 0);
      const home = readFileSync(join(scratch, 'dist/en/home/index.html'), 'utf8');
      expect(home).toContain(`href="${base}/en/ukazky/instalater/"`);
      expect(home).not.toContain('Interactive examples are in Czech.');
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  }, 90000);
});
