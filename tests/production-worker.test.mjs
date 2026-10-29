import {it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import backend from '../release/production-backend.js';import worker from '../release/index.js';
it('retains the original production executable privately',()=>expect(createHash('sha256').update(readFileSync(new URL('../../docs/deployments/2026-10-28-cloudflare/worker-before/modules/index.js',import.meta.url))).digest('hex')).toBe('c80dd654a4775cc1a49a84ec8de4b8b24b643377574cb789caeaaec4379dd67a'));
it('preview cannot invoke APIs, storage or email; static response is noindex',async()=>{
 const prepare=vi.fn(()=>{throw Error('production DB touched')});const env={LEADS_DB:{prepare},ASSETS:{fetch:vi.fn(()=>new Response('preview'))}};
 expect((await worker.fetch(new Request('https://version.example.workers.dev/api/leads',{method:'POST'}),env)).status).toBe(403);
 expect(prepare).not.toHaveBeenCalled();expect(env.ASSETS.fetch).not.toHaveBeenCalled();
 const r=await worker.fetch(new Request('https://version.example.workers.dev/en/'),env);expect(r.headers.get('x-robots-tag')).toBe('noindex, nofollow');
});
it('production API routes use preserved backend, without asset collision',async()=>{
 const env={LEADS_DB:{},ASSETS:{fetch:vi.fn()}};
 expect((await worker.fetch(new Request('https://radeq.cz/api/leads',{method:'POST'}),env)).status).toBe(415);expect(env.ASSETS.fetch).not.toHaveBeenCalled();
});
it('production executable accepts generic category, stores receipt even without email service',async()=>{
 const rows=[];const statement={bind(...v){rows.push(v);return this},async run(){return {success:true}}};
 const env={LEADS_DB:{prepare:()=>statement}};
 const fetch=vi.fn(()=>{throw Error('external network')});vi.stubGlobal('fetch',fetch);const log=vi.spyOn(console,'error').mockImplementation(()=>{});
 try{const r=await backend.fetch(new Request('https://radeq.cz/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Fixture',email:'owner@example.test',message:'Test only',project_type:'General enquiry'})}),env);expect(r.status).toBe(201);expect(await r.json()).toMatchObject({ok:true});expect(rows).toHaveLength(1);expect(fetch).not.toHaveBeenCalled()}finally{vi.unstubAllGlobals();log.mockRestore()}
});
