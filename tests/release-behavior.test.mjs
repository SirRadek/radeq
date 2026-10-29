import {describe,it,expect,vi} from 'vitest';
import {readConsent,createConsentController} from '../src/lib/consent-core.mjs';
import {createSubmissionController,buildLeadPayload} from '../src/lib/contact-client.mjs';

describe('optional measurement',()=>{
 it('denies absent, malformed, expired, future or unreadable storage',()=>{
  for(const raw of [null,'oops','{}',JSON.stringify({v:1,at:0,analytics:true,marketing:true}),JSON.stringify({v:1,at:Date.now()+86400000,analytics:true,marketing:true})])expect(readConsent({getItem:()=>raw})).toBe(null);
  expect(readConsent({getItem(){throw Error('blocked')}})).toBe(null);
 });
 it('keeps rejection and purposes independent, revokes pending and initialized SDK contexts',()=>{
  let saved; const storage={setItem:(_,s)=>saved=s,getItem:()=>saved}; const stops=[]; const calls=[];
  const c=createConsentController({storage,start:(p)=>{calls.push(p);return {stop:()=>stops.push(p),event:vi.fn()}}});
  c.choose({analytics:false,marketing:false});expect(calls).toEqual([]);expect(readConsent(storage)).toMatchObject({analytics:false,marketing:false});
  c.choose({analytics:true,marketing:false});expect(calls).toEqual(['analytics']);
  c.choose({analytics:false,marketing:true});expect(stops).toEqual(['analytics']);expect(calls).toEqual(['analytics','marketing']);
  c.choose({analytics:false,marketing:false});expect(stops).toEqual(['analytics','marketing']);
 });
 it('does not activate when saving the preference fails',()=>{
  const start=vi.fn(); const c=createConsentController({storage:{setItem(){throw Error('blocked')}},start});
  expect(c.choose({analytics:true,marketing:true})).toBe(false);expect(start).not.toHaveBeenCalled();
 });
});

describe('production contact contract',()=>{
 it('uses a disclosed generic category while removing query/referrer details',()=>{
  const payload=buildLeadPayload(new Map([['name','Tester'],['email','owner@example.test'],['message','Hello']]),{locale:'en',path:'/en/?email=secret#x',referrer:'https://search.test/?q=private',currentUrl:'https://site.test/?token=private#secret'});
  expect(payload.project_type).toBe('General enquiry');expect(payload.source_path).toBe('/en/');expect(payload.referrer).toBe('https://search.test');expect(payload.current_url).toBe('https://site.test/');expect(JSON.stringify(payload)).not.toContain('private');
 });
 it('locks delayed submissions, accepts stored receipt without promising email and emits once',async()=>{
  let finish; const fetch=vi.fn(()=>new Promise(r=>finish=r));const success=vi.fn();const c=createSubmissionController({fetch,onSuccess:success});
  const first=c.submit('/api/leads',{});expect(await c.submit('/api/leads',{})).toBe('busy');expect(fetch).toHaveBeenCalledTimes(1);
  finish(new Response(JSON.stringify({ok:true,leadId:'lead_fixture'}),{status:201,headers:{'content-type':'application/json'}}));
  expect(await first).toBe('received');expect(success).toHaveBeenCalledTimes(1);
 });
 it('retains retry after errors, non-JSON, malformed data and missing receipt',async()=>{
  const success=vi.fn(); const fetch=vi.fn();const c=createSubmissionController({fetch,onSuccess:success});
  for(const response of [new Response('{}',{status:500}),new Response('html'),new Response('{',{headers:{'content-type':'application/json'}}),new Response('{"ok":true}',{status:201,headers:{'content-type':'application/json'}})]){
   fetch.mockResolvedValueOnce(response);expect(await c.submit('/api/leads',{})).toBe('failed');
  }
  expect(success).not.toHaveBeenCalled();
 });
});
