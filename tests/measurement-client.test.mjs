import {describe,it,expect,vi} from 'vitest';
import {categorizeReferrer,createMeasurementChannel} from '../src/lib/measurement-client.mjs';
import {createConsentController} from '../src/lib/consent-core.mjs';
import {createSubmissionController} from '../src/lib/contact-client.mjs';

function host(){
 const listeners=new Map(),frames=[],sent=[];
 const window={location:{origin:'https://radeq.cz',pathname:'/en/'},addEventListener:(n,fn)=>listeners.set(n,fn),removeEventListener:(n)=>listeners.delete(n)};
 let referrerReads=0;
 const document={get referrer(){referrerReads++;return 'https://chatgpt.com/?email=private@example.test#secret'},
  createElement:()=>({contentWindow:{postMessage:(d,o)=>sent.push({d,o})},remove:vi.fn()}),
  body:{append:f=>frames.push(f)}};
 return {window,document,frames,sent,reads:()=>referrerReads,message:data=>listeners.get('message')?.({origin:window.location.origin,source:frames.at(-1)?.contentWindow,data})};
}
describe('consented parent measurement channel',()=>{
 it('does not read referrer, load a frame or replay interactions before consent; purposes stay separate',()=>{
  const h=host(),storage={setItem:vi.fn()},c=createConsentController({storage,start:purpose=>createMeasurementChannel({...h,purpose,frameUrl:'/measurement/'})});
  c.event('contact_intent');c.event('lead_received');c.choose({analytics:false,marketing:false});
  expect(h.frames).toHaveLength(0);expect(h.reads()).toBe(0);
  c.choose({analytics:true,marketing:false});expect(h.frames).toHaveLength(1);
  expect(h.reads()).toBe(1);h.message({type:'radeq:measurement-ready'});h.message({type:'radeq:measurement-loaded'});
  expect(h.sent.map(s=>s.d.type)).toEqual(['radeq:measurement-init']);
  c.event('contact_intent');c.event('contact_intent');c.event('form_start');c.event('lead_received');c.event('lead_received');
  expect(h.sent.slice(1).map(s=>s.d.name)).toEqual(['contact_intent','form_start','generate_lead']);
  expect(JSON.stringify(h.sent)).not.toContain('private');expect(JSON.stringify(h.sent)).not.toContain('email=');
 });
 it('queues bounded events while loading, clears pending work on withdrawal and ignores late frame replies',()=>{
  const h=host(),seen=new Set(),c=createMeasurementChannel({...h,purpose:'analytics',frameUrl:'/measurement/',seen});
  c.event('form_start');c.event('form_start');expect(h.sent).toHaveLength(0);
  h.message({type:'radeq:measurement-ready'});h.message({type:'radeq:measurement-loaded'});
  expect(h.sent.map(s=>s.d.name).filter(Boolean)).toEqual(['form_start']);
  c.stop();c.event('lead_received');h.message({type:'radeq:measurement-loaded'});
  expect(h.frames[0].remove).toHaveBeenCalledOnce();expect(h.sent).toHaveLength(2);
  const pending=host(),p=createMeasurementChannel({...pending,purpose:'analytics',frameUrl:'/measurement/'});
  p.event('lead_received');p.stop();pending.message({type:'radeq:measurement-loaded'});expect(pending.sent).toEqual([]);
 });
 it('restores denial from another tab, stops its frame, and cannot revive a stale queued lead',()=>{
  const h=host();let saved;const storage={setItem:(_,v)=>saved=v,getItem:()=>saved};
  const c=createConsentController({storage,start:purpose=>createMeasurementChannel({...h,purpose,frameUrl:'/measurement/'})});
  c.choose({analytics:true,marketing:false});c.event('lead_received');
  saved=JSON.stringify({v:1,at:Date.now(),analytics:false,marketing:false});c.restore();
  h.message({type:'radeq:measurement-loaded'});expect(h.frames[0].remove).toHaveBeenCalledOnce();expect(h.sent).toEqual([]);
 });
 it('keeps one per-page event across revoke/regrant and does not send funnel steps to marketing',()=>{
  const h=host(),seen=new Set();let c=createMeasurementChannel({...h,purpose:'analytics',frameUrl:'/measurement/',seen});
  h.message({type:'radeq:measurement-ready'});h.message({type:'radeq:measurement-loaded'});c.event('lead_received');c.stop();
  c=createMeasurementChannel({...h,purpose:'analytics',frameUrl:'/measurement/',seen});
  h.message({type:'radeq:measurement-ready'});h.message({type:'radeq:measurement-loaded'});c.event('lead_received');
  expect(h.sent.filter(s=>s.d.name==='generate_lead')).toHaveLength(1);
  const m=host(),marketing=createMeasurementChannel({...m,purpose:'marketing',frameUrl:'/measurement/'});
  marketing.event('contact_intent');marketing.event('form_start');m.message({type:'radeq:measurement-ready'});m.message({type:'radeq:measurement-loaded'});marketing.event('lead_received');marketing.event('lead_received');
  expect(m.reads()).toBe(0);expect(m.sent.map(s=>s.d.name).filter(Boolean)).toEqual(['generate_lead']);
 });
 it('emits one lead only after the actual contact controller accepts a valid receipt, including a failed retry and delayed SDK',async()=>{
  const h=host(),channel=createMeasurementChannel({...h,purpose:'analytics',frameUrl:'/measurement/'});
  const fetch=vi.fn(),submission=createSubmissionController({fetch,onSuccess:()=>channel.event('lead_received')});
  fetch.mockResolvedValueOnce(new Response('{"ok":true}',{status:201,headers:{'content-type':'application/json'}}));
  expect(await submission.submit('/api/leads',{})).toBe('failed');
  expect(h.sent.filter(s=>s.d.name==='generate_lead')).toHaveLength(0);
  fetch.mockResolvedValueOnce(new Response('{"ok":true,"leadId":"fixture-only"}',{status:201,headers:{'content-type':'application/json'}}));
  expect(await submission.submit('/api/leads',{})).toBe('received');
  expect(await submission.submit('/api/leads',{})).toBe('busy');
  expect(h.sent.filter(s=>s.d.name==='generate_lead')).toHaveLength(0);
  h.message({type:'radeq:measurement-ready'});h.message({type:'radeq:measurement-loaded'});
  expect(h.sent.filter(s=>s.d.name==='generate_lead')).toHaveLength(1);expect(fetch).toHaveBeenCalledTimes(2);
 });
});
describe('bounded observed referrer categories',()=>{
 it('recognizes known services without returning URL, path, query, fragments, labels or credentials',()=>{
  for(const [url,category] of [['https://www.google.cz/search?q=private','google'],['https://gemini.google.com/app/private','gemini'],['https://search.seznam.cz/?q=private','seznam'],['https://www.bing.com/search?q=private','bing'],['https://chatgpt.com/c/private','chatgpt'],['https://www.perplexity.ai/search/private','perplexity'],['https://claude.ai/chat/private','claude'],['https://copilot.microsoft.com/?q=private','copilot'],['https://www.linkedin.com/feed/','linkedin'],['https://www.firmy.cz/detail/x','firmy']])expect(categorizeReferrer(url)).toBe(category);
  for(const url of ['', 'bad', 'https://google.com.evil.test/', 'https://google.com@evil.test/', 'https://unknown.test/?email=private@example.test', 'javascript:alert(1)', 'https://radeq.cz/en/'])expect(categorizeReferrer(url)).toBe('unknown');
 });
});
