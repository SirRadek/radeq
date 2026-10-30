import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../src/pages/measurement/index.astro',import.meta.url),'utf8');
const code=source.match(/<script is:inline define:vars=[^>]+>([\s\S]*?)<\/script>/)[1];
const sources=['unknown','google','seznam','bing','chatgpt','perplexity','claude','gemini','copilot','linkedin','github','firmy','zivefirmy'];
function frame(){
 const scripts=[],messages=[],listeners={},origin='https://radeq.cz',parent={postMessage:d=>messages.push(d)};
 const location={origin,pathname:'/measurement/'};
 const env={config:{ga4:'G-TEST123',sem:''},sourceCategories:sources,parent,location,
  document:{title:'Measurement',head:{append:s=>scripts.push(s)},createElement:()=>({})},
  history:{replaceState:(_,__,p)=>{location.pathname=p}},Date,
  addEventListener:(n,fn)=>listeners[n]=fn};
 env.window=env;vm.runInNewContext(code,env);
 return {scripts,messages,env,message:(data,options={})=>listeners.message({data,source:parent,origin,...options}),
  events:()=>Array.from(env.dataLayer??[]).map(a=>Array.from(a)).filter(a=>a[0]==='event')};
}
const init={type:'radeq:measurement-init',purpose:'analytics',path:'/en/',source:'chatgpt'};

describe('actual measurement iframe boundary',()=>{
 it('sends only a bounded source with clean locations after valid initialization',()=>{
  const f=frame();expect(f.scripts).toHaveLength(0);f.message(init);f.scripts[0].onload();
  expect(f.events()).toEqual([['event','page_view',{page_location:'https://radeq.cz/en/',page_referrer:'',rq_source:'chatgpt'}]]);
 });
 it('allows fixed funnel events once, queues nothing in the child before readiness, and never emits a second lead',()=>{
  const f=frame();f.message(init);
  f.message({type:'radeq:measurement-event',name:'generate_lead'});expect(f.events()).toEqual([]);
  f.scripts[0].onload();
  for(const name of ['contact_intent','form_start','generate_lead'])for(let i=0;i<2;i++)f.message({type:'radeq:measurement-event',name});
  expect(f.events().map(e=>e[1])).toEqual(['page_view','contact_intent','form_start','generate_lead']);
 });
 it('rejects foreign sender/origin, dirty paths, arbitrary sources and extra init data before loading a provider',()=>{
  for(const [data,options] of [[init,{source:{}}],[init,{origin:'https://evil.test'}],[{...init,path:'/en/?email=secret'},{}],[{...init,source:'private@example.test'},{}],[{...init,email:'private@example.test'},{}]]){
   const f=frame();f.message(data,options);expect(f.scripts).toHaveLength(0);
  }
 });
 it('does not forward arbitrary event names or event properties',()=>{
  const f=frame();f.message(init);f.scripts[0].onload();
  f.message({type:'radeq:measurement-event',name:'private@example.test'});
  f.message({type:'radeq:measurement-event',name:'generate_lead',email:'private@example.test'});
  f.message({type:'radeq:measurement-event',name:'generate_lead'},{source:{}});
  expect(f.events().map(e=>e[1])).toEqual(['page_view']);
 });
});
