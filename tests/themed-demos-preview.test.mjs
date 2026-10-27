import {it,expect} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';
const file='src/pages/minimalni-navrh/ukazky/instalater.astro';
it('isolated plumber route exists',()=>expect(existsSync(file)).toBe(true));
it('compiled root/subpath are harmless and return to the canonical modern site',()=>{if(!process.env.DEMO_ARTIFACT_MANIFEST)return;const m=JSON.parse(readFileSync(process.env.DEMO_ARTIFACT_MANIFEST));for(const v of m.variants){const html=readFileSync(v.dist+'/minimalni-navrh/ukazky/instalater/index.html','utf8');expect(html).toContain('noindex,nofollow');expect(html).toContain(`href="${v.base}/">Zpět na RadeQ`);expect(html).toContain(`href="${v.base}/ukazky/"`);expect(html).not.toMatch(/astro-island|rel="canonical"|<form|tel:|mailto:|fonts.googleapis.com/);expect(html.match(/<h1\b/g)).toHaveLength(1);expect(html).toContain('Fiktivní údaje. Nic se neodesílá.');}});
