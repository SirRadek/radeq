import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const file=process.env.DEMO_ARTIFACT_MANIFEST;
const m=file?JSON.parse(readFileSync(file,'utf8')):null;
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
describe.runIf(Boolean(m))('whole public preview contract',()=>{
 for(const v of m?.variants??[]){
  it(`${v.name}: service journeys are readable in both locales and link to working demos`,()=>{
   for(const locale of ['cs','en']){
    const home=readFileSync(join(v.dist,locale==='en'?'en/index.html':'index.html'),'utf8');
    expect((home.match(/class="flow-node"/g)??[])).toHaveLength(12);
    expect((home.match(/class="demo-cursor"/g)??[])).toHaveLength(3);
    expect(home).not.toContain('id="ukazky"');
    expect(home).not.toContain('preview-tools');
    expect(home).toContain('id="ceny"');
    expect(home).not.toContain('astro-island');
    expect(home).toContain(locale==='en'?'One-page website':'Jednostránkový web');
    expect(home).toContain(locale==='en'?'one working day':'1 pracovního dne');
    for(const slug of ['instalater','sluzba','provozni-terminal','eshop']){
     expect(home).toContain(`href="${v.base}/ukazky/${slug}/${locale==='en'?'?from=en':''}"`);
     const demo=readFileSync(join(v.dist,`ukazky/${slug}/index.html`),'utf8');
     expect(demo).toContain('data-service-return');
    }
    for(const image of ['flow-plumber.jpg','booking-desktop.png','flow-workshop.jpg'])expect(home).toContain(`${v.base}/images/services/${image}`);
    expect(home).toContain(locale==='en'?'Interactive examples are in Czech.':'Zakázka získána');
    expect(home).toContain(locale==='en'?'Work recorded':'Práce v evidenci');
   }
  });
  it(`${v.name}: English entry retains language and discloses Czech demos`,()=>{
   const home=readFileSync(join(v.dist,'en/index.html'),'utf8');
   expect(home).toContain(`href="${v.base}/en/ukazky/"`);
   const gallery=readFileSync(join(v.dist,'en/ukazky/index.html'),'utf8');
   expect(gallery).toContain('lang="en"');expect(gallery).toMatch(/Czech/);
   expect(gallery).toContain(`href="${v.base}/ukazky/"`);
   for(const r of ['instalater','sluzba','provozni-terminal','eshop'])expect(gallery).toContain(`href="${v.base}/ukazky/${r}/"`);
  });
  it(`${v.name}: production form and measurement contracts remain present`,()=>{
   const home=readFileSync(join(v.dist,'index.html'),'utf8');
   if(v.name==='subpath'){ expect(home).not.toContain('/api/leads'); expect(home).not.toContain('loadTurnstile'); expect(home).toContain('Napsat e-mail'); }
   else expect(home).toContain('action="/api/leads"');
   expect(readFileSync(join(v.dist,'audit/index.html'),'utf8')).toContain(`${v.base}/api/measure`);
  });
  if(v.name==='subpath')it('every deployed HTML explicitly blocks indexing while crawl remains possible',()=>{
   for(const p of walk(v.dist).filter(p=>p.endsWith('.html'))){
    const tags=readFileSync(p,'utf8').match(/<meta\b[^>]*>/g)??[];
    expect(tags.some(t=>/name="robots"/.test(t)&&/content="noindex(?:,nofollow)?"/.test(t)),p).toBe(true);
   }
   const robots=readFileSync(join(v.dist,'robots.txt'),'utf8');expect(robots).toContain('Allow: /');expect(robots).not.toContain('Sitemap:');
   expect(readFileSync(join(v.dist,'sitemap.xml'),'utf8')).not.toContain('<loc>');
  });
 }
});
