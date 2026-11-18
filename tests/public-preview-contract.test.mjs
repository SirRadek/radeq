import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {documentNodes,nodes,attr,hasAttr,text} from './helpers/compiled-html.mjs';
const file=process.env.DEMO_ARTIFACT_MANIFEST;
const m=file?JSON.parse(readFileSync(file,'utf8')):null;
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
describe.runIf(Boolean(m))('whole public preview contract',()=>{
 for(const v of m?.variants??[]){
  it(`${v.name}: trust details are optional, draft certificates are absent and both audit entries lead to paid scope`,()=>{
   for(const locale of ['cs','en']){
    const home=readFileSync(join(v.dist,locale==='en'?'en/index.html':'index.html'),'utf8');
    const all=documentNodes(home);
    const summaries=locale==='en'?['What you receive','How we check the result','Experience behind the work']:['Co přesně převezmete','Jak ověříme výsledek','Zkušenosti za mou prací'];
    for(const [i,id] of ['predani-podrobnosti','overeni-podrobnosti','zkusenosti-podrobnosti'].entries()){
     const disclosure=all.find(n=>attr(n,'id')===id);
     expect(disclosure?.tagName,id).toBe('details');
     expect(attr(disclosure,'open'),id).toBeUndefined();
     const summary=nodes(disclosure).find(n=>n.tagName==='summary');
     expect(text(summary),id).toContain(summaries[i]);
    }
    const experience=all.find(n=>attr(n,'id')==='zkusenosti-podrobnosti');
    expect(text(experience)).toContain('2019');expect(text(experience)).toContain('2025');
    expect(all.find(n=>attr(n,'id')==='certifikaty')).toBeUndefined();
    const compactAudit=all.find(n=>(attr(n,'class')??'').split(' ').includes('rq-home-audit'));
    expect(compactAudit?.tagName).toBe('a');expect(attr(compactAudit,'href')).toBe('#audit');
    expect(text(compactAudit)).toContain(locale==='en'?'from CZK 3,000':'od 3 000 Kč');
    expect(all.find(n=>attr(n,'id')==='audit')?.tagName).toBe('h3');
   }
  });
  it(`${v.name}: service journeys are readable in both locales and link to working demos`,()=>{
   for(const locale of ['cs','en']){
    const home=readFileSync(join(v.dist,locale==='en'?'en/index.html':'index.html'),'utf8');
    expect((home.match(/class="flow-node"/g)??[])).toHaveLength(16);
    expect((home.match(/class="demo-cursor"/g)??[])).toHaveLength(0);
    expect(home).not.toContain('id="ukazky"');
    expect(home).not.toContain('preview-tools');
    expect(home).toContain('id="ceny"');
    const all=documentNodes(home);
    const starts=all.find(n=>n.tagName==='nav'&&(attr(n,'class')??'').split(' ').includes('rq-starts'));
    expect(starts).toBeDefined();
    const auditJump=nodes(starts).find(n=>n.tagName==='a'&&attr(n,'href')==='#audit');
    expect(auditJump).toBeDefined();
    expect(text(auditJump)).toContain(locale==='en'?'from CZK 3,000':'od 3 000 Kč');
    const paidAudit=all.find(n=>(attr(n,'class')??'').split(' ').includes('rq-pricing__audit'));
    const auditHeading=all.find(n=>attr(n,'id')==='audit');
    expect(auditHeading?.tagName).toBe('h3');
    expect(nodes(paidAudit)).toContain(auditHeading);
    expect(text(auditHeading)).toBe(locale==='en'?'Website or process audit':'Audit webu nebo procesu');
    expect(home).not.toContain('astro-island');
    expect(home).toContain(locale==='en'?'One-page website':'Jednostránkový web');
    expect(home).toContain(locale==='en'?'one working day':'1 pracovního dne');
    for(const slug of ['instalater','sluzba','provozni-terminal','eshop']){
     expect(home).toContain(`href="${v.base}/${locale==='en'?'en/':''}ukazky/${slug}/"`);
     const demo=readFileSync(join(v.dist,`${locale==='en'?'en/':''}ukazky/${slug}/index.html`),'utf8');
     expect(demo).toContain('data-service-return');
    }
    for(const image of locale==='en'?['flow-plumber-wide-en.png','booking-wide-en.png','flow-workshop-wide-en.png']:['flow-plumber-wide.png','booking-wide.png','flow-workshop-wide.png'])expect(home).toContain(`${v.base}/images/services/${image}`);
    expect(home).toContain(locale==='en'?'Illustrative journey · nothing is sent.':'Poptávka dorazila');
    expect(home).toContain(locale==='en'?'Work logged':'Práce zapsaná');
    expect(home).toContain(locale==='en'?'Enquiry received':'Poptávka dorazila');
   }
  });
  it(`${v.name}: English entry retains language through all four localized demos`,()=>{
   const home=readFileSync(join(v.dist,'en/index.html'),'utf8');
   expect(home).toContain(`href="${v.base}/en/ukazky/"`);
   const gallery=readFileSync(join(v.dist,'en/ukazky/index.html'),'utf8');
   expect(gallery).toContain('lang="en"');expect(gallery).not.toMatch(/demos are in Czech/);
   for(const r of ['instalater','sluzba','provozni-terminal','eshop'])expect(gallery).toContain(`href="${v.base}/en/ukazky/${r}/"`);
  });
  it(`${v.name}: production form and measurement contracts remain present`,()=>{
   const home=readFileSync(join(v.dist,'index.html'),'utf8');
   if(v.name==='subpath'){ expect(home).not.toContain('/api/leads'); expect(home).not.toContain('loadTurnstile'); expect(home).toContain('Napsat e-mail'); }
   else expect(home).toContain('action="/api/leads"');
  });
  it(`${v.name}: contact guidance describes the available channel in both languages`,()=>{
   for(const locale of ['cs','en']){
    const html=readFileSync(join(v.dist,`${locale==='en'?'en/':''}kontakt/index.html`),'utf8');
    const pageText=text(documentNodes(html).find(n=>n.tagName==='main'));
    const preview=locale==='en'?'Email is for work enquiries':'E-mail je určen pro pracovní poptávky';
    const production=locale==='en'?'The form is for work enquiries':'Formulář je pro pracovní poptávky';
    expect(pageText).toContain(v.name==='subpath'?preview:production);
    expect(pageText).not.toContain(v.name==='subpath'?production:preview);
   }
  });
  it(`${v.name}: audit route matches its channel in Czech and English`,()=>{
   for(const locale of ['cs','en']){
    const html=readFileSync(join(v.dist,`${locale==='en'?'en/':''}audit/index.html`),'utf8');
    const all=documentNodes(html),auditIsland=all.find(n=>n.tagName==='astro-island'&&(attr(n,'component-url')??'').includes('/AuditTool.'));
    const form=all.find(n=>n.tagName==='form'&&(attr(n,'class')??'').split(' ').includes('audit-tool__form'));
    if(v.name==='subpath'){
     const preview=all.find(n=>hasAttr(n,'data-rq-audit-preview'));
     expect(preview).toBeDefined();
     expect(text(preview)).toContain(locale==='en'?'Static website audit preview':'Statická ukázka auditu webu');
     expect(text(preview)).toContain(locale==='en'?'does not send a website address':'se adresa webu neodesílá');
     expect(html).not.toContain('/api/measure');
     expect(auditIsland).toBeUndefined();
     expect(form).toBeUndefined();
    }else{
     expect(html).toContain(`${v.base}/api/measure`);
     expect(auditIsland).toBeDefined();
     expect(form).toBeDefined();
     const heading=all.find(n=>n.tagName==='h1'&&attr(n,'id')==='rq-audit-title');
     expect(text(heading)).toBe(locale==='en'?'Measure your website without a fake verdict.':'Změřte web bez falešného verdiktu.');
    }
    const canonical=all.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical');
    const robots=all.find(n=>n.tagName==='meta'&&attr(n,'name')==='robots');
    expect(new URL(attr(canonical,'href')).pathname).toBe(`${v.base}/${locale==='en'?'en/':''}audit/`.replace('//','/'));
    if(v.name==='subpath')expect(attr(robots,'content')).toBe('noindex,nofollow');
    else expect(robots).toBeUndefined();
   }
  });
  it(`${v.name}: privacy body uses the correct channel while SEO metadata stays production-owned`,()=>{
   for(const locale of ['cs','en']){
    const route=locale==='en'?'en/soukromi/index.html':'soukromi/index.html';
    const html=readFileSync(join(v.dist,route),'utf8'),all=documentNodes(html),pageText=text(all.find(n=>n.tagName==='main'));
    const canonical=all.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical');
    const description=all.find(n=>n.tagName==='meta'&&attr(n,'name')==='description');
    const title=text(all.find(n=>n.tagName==='title')).trim();
    expect(new URL(attr(canonical,'href')).pathname).toBe(`${v.base}/${locale==='en'?'en/':''}soukromi/`.replace('//','/'));
    expect(attr(description,'content')).toBe(locale==='en'?'How I handle enquiries, technical information and optional measurement.':'Jak zacházím s poptávkami, technickými údaji a volitelným měřením.');
    expect(title).toBe(locale==='en'?'Privacy and cookies | RadeQ.cz':'Soukromí a cookies | RadeQ.cz');
    expect(pageText).toContain(locale==='en'?'6 months after the last substantive contact':'po 6 měsících od posledního věcného kontaktu');
    expect(all.some(n=>n.tagName==='a'&&attr(n,'href')==='mailto:siroky@radeq.cz')).toBe(true);
    if(v.name==='subpath'){
     expect(pageText).toContain('GitHub Pages');
     expect(pageText).toContain(locale==='en'?'IP address':'IP adresu');
     expect(pageText).toContain(locale==='en'?'does not load optional analytics or advertising':'nenačítá volitelnou analytiku ani reklamu');
     expect(pageText).not.toContain('Cloudflare D1');
     expect(pageText).not.toContain('Google Analytics');
     expect(html).not.toContain('/api/measure');
     expect(all.some(n=>n.tagName==='meta'&&attr(n,'name')==='robots'&&attr(n,'content')==='noindex,nofollow')).toBe(true);
    }else{
     expect(pageText).toContain('Cloudflare');
     expect(pageText).toContain('Google Analytics');
     expect(pageText).not.toContain('GitHub Pages');
     expect(all.some(n=>n.tagName==='meta'&&attr(n,'name')==='robots')).toBe(false);
    }
    const alternates=all.filter(n=>n.tagName==='link'&&attr(n,'rel')==='alternate'&&attr(n,'hreflang'));
    expect(alternates.map(n=>[attr(n,'hreflang'),new URL(attr(n,'href')).pathname])).toEqual([
     [locale,`${v.base}/${locale==='en'?'en/':''}soukromi/`.replace('//','/')],
     [locale==='en'?'cs':'en',`${v.base}/${locale==='en'?'':'en/'}soukromi/`.replace('//','/')],
     ['x-default',`${v.base}/soukromi/`.replace('//','/')],
    ]);
   }
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
