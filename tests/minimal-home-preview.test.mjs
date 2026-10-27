import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { documentNodes, attr, text } from './helpers/compiled-html.mjs';

const root = process.cwd();
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const stories = ['instalater', 'eshop', 'sluzba', 'provozni-terminal'];

describe('unified minimalist homepage and local design route', () => {
  it.each(['', '/radeq'])('compiles current public content, metadata and four portals under base %s', base => {
    const scratch = mkdtempSync(join(root, '.rq-minimal-fixture-'));
    try {
      mkdirSync(join(scratch, 'pages'));
      // Compile actual current route sources in a narrow fixture, rather than the whole site.
      for (const route of ['index', 'minimalni-navrh']) {
        const source = readFileSync(join(root, `src/pages/${route}.astro`), 'utf8').replaceAll("'../", "'" + resolve(root, 'src') + '/');
        writeFileSync(join(scratch, `pages/${route}.astro`), source);
      }
      writeFileSync(join(scratch, 'config.mjs'), `import config from ${JSON.stringify(resolve(root, 'astro.config.mjs'))};\nexport default {...config,srcDir:${JSON.stringify(scratch)},outDir:${JSON.stringify(join(scratch, 'dist'))},cacheDir:${JSON.stringify(join(scratch, 'cache'))}};`);
      const env = { ...process.env, NODE_ENV: 'production', DEPLOY_TARGET: base ? 'github-pages' : '', PUBLIC_TURNSTILE_SITE_KEY: 'fixture-public-key' };
      delete env.BASE_URL;
      execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build', '--config', relative(root, join(scratch, 'config.mjs'))], { cwd: root, env, encoding: 'utf8', stdio: 'pipe' });
      for (const route of ['index.html', 'minimalni-navrh/index.html']) {
        const html = readFileSync(join(scratch, 'dist', route), 'utf8');
        const all = documentNodes(html);
        const tags = name => all.filter(node => node.tagName === name);
        for (const tag of ['html', 'body', 'header', 'main', 'h1', 'footer']) expect(tags(tag), tag).toHaveLength(1);
        expect(tags('nav')).toHaveLength(2); // Main and footer navigation are both intentional.
        expect(attr(tags('html')[0], 'lang')).toBe('cs');
        expect(text(tags('h1')[0])).toBe('Weby a automatizace, které usnadňují podnikání.');
        expect(tags('h2').map(text)).toEqual(['Služby', 'Ceny a rozsah', 'Přístup', 'Kdo za tím stojí', 'Pojďme probrat váš záměr']);
        expect(tags('h3').map(text)).toEqual(['Web a viditelnost', 'Termíny a rezervace', 'Data a návaznost práce', 'Audit webu nebo procesu', 'Projektové realizace']);
        expect(html).not.toContain('Lokální náhled');
        const prices = all.find(n => n.tagName === 'section' && attr(n,'id') === 'ceny');
        expect(prices).toBeDefined();
        expect(all.indexOf(prices)).toBeLessThan(all.findIndex(n => attr(n,'id') === 'kontakt'));
        for (const price of ['od 10 000 Kč','od 20 000 Kč','od 12 000 Kč','od 15 000 Kč','od 25 000 Kč','od 3 000 Kč','2 500 Kč']) expect(text(prices)).toContain(price);
        expect(html).toContain('1 pracovního dne');
        expect(html).toContain('zdrojový kód');
        expect(html).toContain('zaškolení');
        expect(tags('astro-island')).toHaveLength(0);
        const audience = all.find(node => attr(node, 'data-minimal-audience') !== undefined);
        expect(audience).toBeDefined();
        expect(attr(audience, 'data-words')).toBe('živnostníky|salony|malé firmy|lokální služby');
        expect(text(audience)).toContain('Pro živnostníky, salony, malé firmy a lokální služby.');
        // Pause is integrated into the audience visual; there is no separate visible pause control.
        expect(tags('button').map(text).some(label => /Pozastavit střídání|Pokračovat ve střídání/.test(label))).toBe(false);
        const portals = tags('a').filter(node => (attr(node, 'class') || '').split(' ').some(c => ['flow-example','secondary-example'].includes(c)));
        expect(portals.map(node => attr(node, 'href'))).toEqual(stories.map(slug => `${base}/ukazky/${slug}/`));
        for (const portal of portals) expect(text(portal).trim().length).toBeGreaterThan(20);
        expect(all.filter(n => attr(n, 'class') === 'flow-node')).toHaveLength(12);
        expect(tags('svg')).toHaveLength(3);
        expect(all.some(n => attr(n, 'id') === 'ukazky')).toBe(false);
        for (const img of tags('img')) expect(attr(img, 'src')).toMatch(new RegExp('^' + base + '/images/services/'));
        const links = tags('a').map(node => [text(node).trim(), attr(node, 'href')]);
        for (const pair of [['Služby', `${base}/#sluzby`], ['Přístup', `${base}/#pristup`], ['Ceny', `${base}/#ceny`], ['Ukázky', `${base}/ukazky/`], ['Kontakt', `${base}/#kontakt`], ['Probrat projekt', '#kontakt'], ['Soukromí', `${base}/soukromi/`]]) expect(links).toContainEqual(pair);
        const origin = base ? 'https://sirradek.github.io' : 'https://radeq.cz';
        expect(all.filter(node => attr(node, 'rel') === 'canonical').map(node => attr(node, 'href'))).toEqual([`${origin}${base}/`]);
        expect(all.filter(node => attr(node, 'hreflang')).map(node => [attr(node, 'hreflang'), attr(node, 'href')])).toEqual([['cs', `${origin}${base}/`], ['en', `${origin}${base}/en/`], ['x-default', `${origin}${base}/`]]);
        expect(all.filter(node => node.tagName === 'meta' && attr(node, 'name') === 'robots').map(node => attr(node, 'content'))).toEqual(base || route.startsWith('minimalni') ? ['noindex,nofollow'] : []);
        expect(all.filter(node => attr(node, 'property') === 'og:url').map(node => attr(node, 'content'))).toEqual([`${origin}${base}/`]);
        expect(tags('form')).toHaveLength(base ? 0 : 1);
        if (base) {
          expect(html).not.toContain('/api/leads');
          expect(html).not.toContain('loadTurnstile');
          expect(html).not.toContain('fixture-public-key');
          expect(html).toContain('Napsat e-mail');
        } else {
          expect(attr(tags('form')[0], 'action')).toBe('/api/leads');
          expect(html).toContain('fixture-public-key');
          expect(html).toContain('loadTurnstile');
          for (const name of ['name', 'email', 'message']) expect(all.find(node => attr(node, 'name') === name).attrs.some(item => item.name === 'required')).toBe(true);
          expect(all.find(node => attr(node, 'name') === 'project_type').attrs.some(item => item.name === 'required')).toBe(false);
        }
        expect(tags('canvas')).toHaveLength(0);
        expect(tags('iframe')).toHaveLength(0);
        expect(html).toContain(`${base}/brand/radeq-logo-b-mask.png`);
        for (const font of ['chillax', 'cabinet-grotesk']) {
          expect(html).toContain(`${base}/fonts/radeq/${font}.woff2`);
          expect(digest(join(scratch, `dist/fonts/radeq/${font}.woff2`))).toBe(digest(join(root, `public/fonts/radeq/${font}.woff2`)));
        }
      }
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  }, 60000);
});
