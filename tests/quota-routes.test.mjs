import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost as leadSource } from '../functions/api/leads';
import { onRequestPost as measureSource } from '../functions/api/measure';
import worker from '../release/index.js';
import { sqliteD1,closeSqliteDbs } from './helpers/sqlite-d1.mjs';
afterEach(()=>{vi.unstubAllGlobals();closeSqliteDbs()});
const body={name:'Fixture',email:'recipient@example.test',project_type:'General enquiry',message:'Fixture only',locale:'en'};
const request=(route,payload,headers={})=>new Request(`https://radeq.cz/api/${route}`,{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(payload)});
const implementations=[['source',(route,req,env)=>(route==='leads'?leadSource:measureSource)({request:req,env})],['executable',(route,req,env)=>worker.fetch(req,env)]];
for(const [name,call]of implementations)describe(`${name} quota route parity`,()=>{
  it('original trigger stores two legitimate concurrent receipts but sends one confirmation',async()=>{
    const sent=[];const db=sqliteD1();const env={LEADS_DB:db,RESEND_API_KEY:'fixture-only'};
    vi.stubGlobal('fetch',vi.fn(async(url,init)=>{expect(url).toBe('https://api.resend.com/emails');sent.push(JSON.parse(init.body));return Response.json({id:'fixture'})}));
    // Distinct connections to the same real SQLite database are tested separately;
    // this verifies the actual route-to-renderer path with a real SQL transaction.
    // Avoid concurrent BEGIN on a single adapter connection by sharing one serialized D1 batch queue.
    let queue=Promise.resolve();const batch=db.batch;db.batch=statements=>{const current=queue.then(()=>batch(statements));queue=current.catch(()=>{});return current};
    const responses=await Promise.all([call('leads',request('leads',body),env),call('leads',request('leads',body),env)]);
    expect(responses.map(r=>r.status)).toEqual([201,201]);expect(sent.filter(m=>m.to===body.email)).toHaveLength(1);expect(sent.filter(m=>m.to==='siroky@radeq.cz')).toHaveLength(2);
    expect(db.sqlite.prepare('SELECT count(*) AS n FROM leads').get().n).toBe(2);
  });
  it('uses shared unknown bucket rather than spoofed forwarded IP and rejects third lead',async()=>{
    const db=sqliteD1();const fetch=vi.fn(()=>{throw Error('unexpected provider')});vi.stubGlobal('fetch',fetch);
    const statuses=[];for(let i=0;i<3;i++)statuses.push((await call('leads',request('leads',body,{'x-forwarded-for':`192.0.2.${i}`}),{LEADS_DB:db})).status);
    expect(statuses).toEqual([201,201,429]);expect(db.sqlite.prepare('SELECT count(*) AS n FROM leads').get().n).toBe(2);expect(fetch).not.toHaveBeenCalled();
  });
  it('fails closed for absent schema and missing bindings before irreversible effects',async()=>{
    const fetch=vi.fn(()=>{throw Error('unexpected provider')});vi.stubGlobal('fetch',fetch);
    for(const env of [{},{LEADS_DB:sqliteD1({migrate:false})}])for(const route of ['leads','measure']) {
      const r=await call(route,request(route,route==='leads'?body:{url:'https://example.test',locale:'en'}),env);
      expect(r.status).toBe(503);if(route==='measure')expect((await r.json()).status).toBe('psi_error');
    }
    expect(fetch).not.toHaveBeenCalled();
  });
  for(const locale of ['cs','en'])it(`keeps ${locale} stored receipt and owner mail when confirmation transaction fails`,async()=>{
    const db=sqliteD1();db.sqlite.exec("CREATE TRIGGER fail_confirmation BEFORE INSERT ON abuse_quotas WHEN NEW.quota_key='confirm:global' BEGIN SELECT RAISE(ABORT,'fixture'); END");
    const sent=[];vi.stubGlobal('fetch',vi.fn(async(url,init)=>{expect(url).toBe('https://api.resend.com/emails');sent.push(JSON.parse(init.body));return Response.json({id:'fixture'})}));
    const r=await call('leads',request('leads',{...body,locale}),{LEADS_DB:db,RESEND_API_KEY:'fixture-only'});
    expect(r.status).toBe(201);expect(await r.json()).toMatchObject({ok:true,leadId:expect.any(String)});expect(sent.map(m=>m.to)).toEqual(['siroky@radeq.cz']);
  });
  it('skips confirmation reservation with no sender; whitelist never bypasses recipient budget',async()=>{
    const db=sqliteD1();const batch=vi.fn(()=>{throw Error('should not reserve')});const original=db.batch;db.batch=batch;
    expect((await call('leads',request('leads',body),{LEADS_DB:db})).status).toBe(201);expect(batch).not.toHaveBeenCalled();db.batch=original;
    const sent=[];vi.stubGlobal('fetch',vi.fn(async(url,init)=>{expect(url).toBe('https://api.resend.com/emails');sent.push(JSON.parse(init.body));return Response.json({id:'fixture'})}));
    const env={LEADS_DB:db,RESEND_API_KEY:'fixture-only',RATE_LIMIT_WHITELIST:'192.0.2.8'};
    for(let i=0;i<3;i++)expect((await call('leads',request('leads',body,{'cf-connecting-ip':'192.0.2.8'}),env)).status).toBe(201);
    expect(sent.filter(m=>m.to===body.email)).toHaveLength(1);expect(sent.filter(m=>m.to==='siroky@radeq.cz')).toHaveLength(3);
  });
  it('allows five measurements then limits with Retry-After and no sixth PSI call',async()=>{
    const db=sqliteD1();const fetch=vi.fn(async url=>{expect(String(url)).toContain('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?');return Response.json({lighthouseResult:{audits:{}},loadingExperience:{overall_category:'FAST'}})});vi.stubGlobal('fetch',fetch);
    for(let i=0;i<5;i++)expect((await call('measure',request('measure',{url:'https://example.test',locale:'en'},{'x-forwarded-for':`192.0.2.${i}`}),{LEADS_DB:db})).status).toBe(200);
    const denied=await call('measure',request('measure',{url:'https://example.test',locale:'en'}),{LEADS_DB:db});
    expect(denied.status).toBe(429);expect(Number(denied.headers.get('retry-after'))).toBeGreaterThan(0);expect(fetch).toHaveBeenCalledTimes(5);
  });
  it('retains Turnstile alias before quota and denies forged or missing verification',async()=>{
    const db=sqliteD1();const fetch=vi.fn(async(url,init)=>{expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');return Response.json({success:String(init.body).includes('fixture-valid')})});vi.stubGlobal('fetch',fetch);
    const env={LEADS_DB:db,TURNSTILE_SECRET:'fixture-only'};
    expect((await call('leads',request('leads',{...body,'cf-turnstile-response':'fixture-valid'}),env)).status).toBe(201);
    expect((await call('leads',request('leads',{...body,turnstileToken:'forged'}),env)).status).toBe(403);
    expect((await call('leads',request('leads',body),env)).status).toBe(403);
    expect(db.sqlite.prepare('SELECT count(*) AS n FROM leads').get().n).toBe(1);
  });
});
