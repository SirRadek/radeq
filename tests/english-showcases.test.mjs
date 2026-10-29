import {describe,it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {documentNodes,attr,text,nodes} from './helpers/compiled-html.mjs';
const manifest=process.env.DEMO_ARTIFACT_MANIFEST ? JSON.parse(readFileSync(process.env.DEMO_ARTIFACT_MANIFEST,'utf8')) : null;
const demos=[['instalater','What needs fixing','web'],['sluzba','What time suits you?','terminy'],['provozni-terminal','DAY SHEET','data'],['eshop','Freshly roasted coffee','eshop']];
const displayText=node=>['script','style'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(displayText).join(' ');
describe.runIf(Boolean(manifest))('English showcase journeys',()=>{
 for(const v of manifest?.variants??[]){
  it(`${v.name}: each English example is a complete localized static document with an English return`,()=>{
   for(const [slug,heading,service] of demos){
    const path=join(v.dist,`en/ukazky/${slug}/index.html`);
    expect(existsSync(path),`missing English route: ${slug}`).toBe(true);
    const all=documentNodes(readFileSync(path,'utf8'));
    expect(attr(all.find(n=>n.tagName==='html'),'lang')).toBe('en');
    expect(text(all.find(n=>n.tagName==='h1'))).toContain(heading);
    const back=all.find(n=>attr(n,'data-service-return')!==undefined);
    expect(attr(nodes(back).find(n=>n.tagName==='a'),'href')).toBe(`${v.base}/en/#sluzba-${service}`);
    expect(all.filter(n=>n.tagName==='meta'&&attr(n,'name')==='robots').some(n=>attr(n,'content')==='noindex,nofollow')).toBe(true);
    const visible=displayText(all.find(n=>n.tagName==='body')).replace(/\s+/g,' ');
    expect(visible).not.toMatch(/Zpět|Vybráno|Připraveno|Fiktivní|Čtvrtek|\bminut\b|Kč|Košík|Dokončení/);
   }
  });
  it(`${v.name}: English home and gallery link to localized examples and English screenshots`,()=>{
   const home=readFileSync(join(v.dist,'en/index.html'),'utf8');
   const gallery=readFileSync(join(v.dist,'en/ukazky/index.html'),'utf8');
   for(const [slug] of demos){
    expect(home).toContain(`href="${v.base}/en/ukazky/${slug}/"`);
    expect(gallery).toContain(`href="${v.base}/en/ukazky/${slug}/"`);
   }
   expect(home+gallery).not.toMatch(/examples are in Czech|demos are in Czech/i);
   for(const name of ['flow-plumber-wide-en.png','booking-wide-en.png','flow-workshop-wide-en.png','flow-shop-en.png']){
    expect(home).toContain(`${v.base}/images/services/${name}`);
    expect(existsSync(join(v.dist,'images/services',name))).toBe(true);
   }
   const cs=readFileSync(join(v.dist,'index.html'),'utf8');
   expect(cs).toContain(`${v.base}/images/services/flow-plumber-wide.png`);
   expect(cs).toContain(`href="${v.base}/ukazky/instalater/"`);
  });
 }
});
