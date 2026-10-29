import {describe,it,expect} from 'vitest';
import {legalContent} from '../src/data/legal';
import {legalParagraphs} from '../src/lib/legal-paragraphs.mjs';
import {readFileSync} from 'node:fs';
import {documentNodes,attr,text,nodes} from './helpers/compiled-html.mjs';
describe('legal reading layout preserves the approved copy',()=>{
 it('retains every word and complete ordered links in both languages',()=>{
  for(const locale of Object.values(legalContent)) for(const page of Object.values(locale)) {
   let divided=0;
   for(const [,body] of page.sections){
    const parts=legalParagraphs(body);
    expect(parts.join(' ')).toBe(body);
    expect(parts.flatMap(p=>[...p.matchAll(/<a href="[^"]+">[^<]+<\/a>/g)].map(m=>m[0]))).toEqual([...body.matchAll(/<a href="[^"]+">[^<]+<\/a>/g)].map(m=>m[0]));
    if(parts.length>1)divided++;
   }
   expect(divided).toBeGreaterThan(2);
  }
 });
});
const manifest=process.env.DEMO_ARTIFACT_MANIFEST?JSON.parse(readFileSync(process.env.DEMO_ARTIFACT_MANIFEST,'utf8')):null;
describe.runIf(Boolean(manifest))('compiled legal pages',()=>{
 it('preserves exact section text and ordered links with a working contents index',()=>{
  const clean=s=>s.replace(/\s+/g,' ').trim();
  for(const variant of manifest.variants) for(const lang of ['cs','en']) for(const kind of ['privacy','cooperation']){
   const slug=kind==='privacy'?'soukromi':'spoluprace';
   const all=documentNodes(readFileSync(`${variant.dist}/${lang==='en'?'en/':''}${slug}/index.html`,'utf8'));
   const sections=all.filter(n=>n.tagName==='section'&&attr(n,'id')?.startsWith('legal-'));
   const expected=legalContent[lang][kind].sections;
   expect(sections).toHaveLength(expected.length);
   sections.forEach((section,i)=>{
    const [title,body]=expected[i],source=documentNodes(`<section><h2>${title}</h2><p>${body}</p></section>`).find(n=>n.tagName==='section');
    const reading=root=>nodes(root).filter(n=>['h2','p'].includes(n.tagName)).map(text).join(' ');
    expect(clean(reading(section))).toBe(clean(reading(source)));
    const links=root=>nodes(root).filter(n=>n.tagName==='a').map(n=>[attr(n,'href'),clean(text(n))]);
    expect(links(section)).toEqual(links(source));
    expect(all.some(n=>n.tagName==='a'&&attr(n,'href')===`#legal-${i+1}`)).toBe(true);
   });
  }
 });
});
