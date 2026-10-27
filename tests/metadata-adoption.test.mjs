import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = process.cwd();
function contract(html, base, kind) {
  const canonical = `https://${base ? 'sirradek.github.io' : 'radeq.cz'}${base}/${kind === 'en' ? 'en/' : kind === 'fallback' ? 'fallback/' : ''}`;
  for (const pattern of [/<head(?:\s|>)/g, /<title>/g, /<meta charset=/g, /name="viewport"/g, /name="description"/g, /property="og:url"/g, /rel="canonical"/g]) expect(html.match(pattern)).toHaveLength(1);
  expect(html.indexOf('<meta charset=')).toBeLessThan(1024);
  expect(html).toContain(`rel="canonical" href="${canonical}"`);
  expect(html).toContain(`property="og:url" content="${canonical}"`);
  expect(html).toContain(`property="og:locale" content="${kind === 'en' ? 'en_US' : 'cs_CZ'}"`);
  expect(html).toContain(`property="og:image" content="https://${base ? 'sirradek.github.io' : 'radeq.cz'}${base}/og-default.jpg"`);
  expect(html).toContain(`href="${base}/favicon-dark.png"`);
  expect(html).toContain('media="(prefers-color-scheme: dark)"');
  expect(html.match(/hreflang=/g) ?? []).toHaveLength(['noalternate','fallback','guard'].includes(kind) ? 0 : 3);
  if (kind === 'en' || kind === 'cs') expect(html).toContain(`hreflang="x-default" href="https://${base ? 'sirradek.github.io' : 'radeq.cz'}${base}/"`);
  expect(html).toContain('<main><h1>Fixture</h1></main>');
}
describe('actual RqLayout URL policy and metadata contract', () => {
  it.each(['', '/radeq'])('builds root/subpath %s CS/EN and optional metadata cases; mutations fail', base => {
    const scratch = mkdtempSync(join(root, '.rq-metadata-fixture-'));
    try {
      mkdirSync(join(scratch, 'pages'));
      for (const kind of ['cs','en','noalternate','fallback','guard']) {
        const props = kind === 'fallback' ? '' : `canonicalPath="${kind === 'en' ? '/en/' : '/'}"`;
        const alternates = ['cs','en','guard'].includes(kind) ? `alternatePath="${kind === 'en' ? '/' : '/en/'}" ${kind === 'guard' ? '' : `alternateLang="${kind === 'en' ? 'cs' : 'en'}"`}` : '';
        writeFileSync(join(scratch, `pages/${kind}.astro`), `---\nimport Layout from ${JSON.stringify(resolve(root,'src/layouts/RqLayout.astro'))};\n---\n<Layout title="Fixture title" description="Fixture description" lang="${kind === 'en' ? 'en' : 'cs'}" ${props} ${alternates}><main><h1>Fixture</h1></main></Layout>`);
      }
      writeFileSync(join(scratch,'config.mjs'),`import config from ${JSON.stringify(resolve(root,'astro.config.mjs'))};\nexport default {...config,srcDir:${JSON.stringify(scratch)},outDir:${JSON.stringify(join(scratch,'dist'))},cacheDir:${JSON.stringify(join(scratch,'cache'))}};`);
      const env = {...process.env, NODE_ENV:'production', DEPLOY_TARGET:base ? 'github-pages' : ''}; delete env.BASE_URL;
      execFileSync(process.execPath,['node_modules/astro/bin/astro.mjs','build','--config',relative(root,join(scratch,'config.mjs'))],{cwd:root,env,encoding:'utf8'});
      for (const kind of ['cs','en','noalternate','fallback','guard']) {
        const html = readFileSync(join(scratch,`dist/${kind}/index.html`),'utf8');
        contract(html,base,kind);
        const missing = html.replace(/<meta property="og:url"[^>]*>/,'');
        const duplicated = html.replace('</head>','<meta charset="utf-8"></head>');
        expect(() => contract(missing,base,kind)).toThrow();
        expect(() => contract(duplicated,base,kind)).toThrow();
        console.info(`RED observable omission + duplication rejected; GREEN ${base || '/'} ${kind}`);
      }
    } finally { rmSync(scratch,{recursive:true,force:true}); }
  },60000);
});
