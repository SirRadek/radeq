import {describe,it,expect} from 'vitest';
import {legalContent, previewPrivacyContent} from '../src/data/legal';
import {legalParagraphs} from '../src/lib/legal-paragraphs.mjs';
import {readFileSync} from 'node:fs';
import {documentNodes,attr,text,nodes} from './helpers/compiled-html.mjs';
describe('legal reading layout preserves the approved copy',()=>{
 it('retains every word and complete ordered links in both languages',()=>{
  const publicPages = Object.values(legalContent).flatMap(Object.values);
  const pages = [...publicPages, ...Object.values(previewPrivacyContent)];
  for (const page of pages) {
   let divided=0;
   for(const [,body] of page.sections){
    const parts=legalParagraphs(body);
    expect(parts.join(' ')).toBe(body);
    expect(parts.flatMap(p=>[...p.matchAll(/<a href="[^"]+">[^<]+<\/a>/g)].map(m=>m[0]))).toEqual([...body.matchAll(/<a href="[^"]+">[^<]+<\/a>/g)].map(m=>m[0]));
    if(parts.length>1)divided++;
   }
   if (publicPages.includes(page)) expect(divided).toBeGreaterThan(2);
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
   const expectedPage = kind === 'privacy' && variant.name === 'subpath' ? previewPrivacyContent[lang] : legalContent[lang][kind];
   const main = all.find(n => n.tagName === 'main');
   expect(text(nodes(main).find(n => n.tagName === 'h1'))).toBe(expectedPage.title);
   expect(text(nodes(main).find(n => attr(n, 'class') === 'rq-lead'))).toBe(expectedPage.intro);
   const expected=expectedPage.sections;
   const index = nodes(main).find(n => n.tagName === 'nav' && attr(n, 'class')?.split(' ').includes('rq-legal-index'));
   expect(nodes(index).filter(n => n.tagName === 'a').map(n => [attr(n, 'href'), clean(text(n))]))
     .toEqual(expected.map(([title], i) => [`#legal-${i + 1}`, title]));
   expect(sections).toHaveLength(expected.length);
   sections.forEach((section,i)=>{
    const [title,body]=expected[i],source=documentNodes(`<section><h2>${title}</h2><p>${body}</p></section>`).find(n=>n.tagName==='section');
    const reading=root=>nodes(root).filter(n=>['h2','p'].includes(n.tagName)).map(text).join(' ');
    expect(clean(reading(section))).toBe(clean(reading(source)));
    const links=root=>nodes(root).filter(n=>n.tagName==='a').map(n=>[attr(n,'href'),clean(text(n))]);
    expect(links(section)).toEqual(links(source));
    expect(attr(section, 'id')).toBe(`legal-${i + 1}`);
   });
  }
 });
});
