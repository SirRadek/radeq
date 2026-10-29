import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
const manifestPath=process.env.DEMO_ARTIFACT_MANIFEST;
const routes=['instalater','sluzba','provozni-terminal','eshop'];
describe.runIf(Boolean(manifestPath))('four curated compiled showcases',()=>{
 const manifest=manifestPath?JSON.parse(readFileSync(manifestPath,'utf8')):null;
 for(const v of manifest?.variants??[]){
  it(`${v.name} main gallery exposes exactly four distinct stories`,()=>{
   const html=readFileSync(v.dist+'/ukazky/index.html','utf8');
   const portals=[...html.matchAll(/<a\b[^>]*class="rq-minimal-preview__portal"[^>]*href="([^"]+)"/g)].map(x=>x[1]);
   expect(portals).toEqual(routes.map(route=>`${v.base}/ukazky/${route}/`));
   expect(html).not.toContain('Jedenáct');
  });
  it(`${v.name} homes expose four service-linked stories`,()=>{
   for(const path of ['index.html','en/index.html']){
    const html=readFileSync(`${v.dist}/${path}`,'utf8');
    const portals=[...html.matchAll(/<a\b[^>]*class="(?:flow-example|secondary-example)"[^>]*href="([^"]+)"/g)].map(x=>x[1]);
    expect(portals).toEqual(routes.map(route=>`${v.base}/${path.startsWith('en/')?'en/':''}ukazky/${route}/`));
   }
  });
  it(`${v.name} canonical demos retain harmless complete document boundaries`,()=>{
   for(const route of [...routes.map(r=>'ukazky/'+r),...routes.slice(0,3).map(r=>'minimalni-navrh/ukazky/'+r)]){
    const html=readFileSync(`${v.dist}/${route}/index.html`,'utf8');
    expect(html.match(/<html\b/g)).toHaveLength(1);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('noindex,nofollow');
    expect(html).not.toMatch(/<form\b|tel:|mailto:|astro-island|fonts.googleapis.com/);
    expect(html).toContain(`${v.base}/ukazky/`);
    expect(html).toContain(`${v.base}/favicon.${route.endsWith('eshop')?'svg':'png'}`);
   }
  });
 }
});
