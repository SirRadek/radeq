import {describe,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {createLeadConfirmationEmail,createLeadNotificationEmail} from '../src/lib/leadNotificationEmail';
import backend from '../release/production-backend.js';
import {validateLeadSubmission} from '../src/lib/leads';
import {sqliteD1,closeSqliteDbs} from './helpers/sqlite-d1.mjs';

const lead={name:'Jana <img src=x onerror=alert(1)>',email:'owner@example.test',project_type:'Web & <script>bad</script>',message:'Hello <b>unsafe</b>\r\nSecond line',locale:'cs-CZ',company:'',audience:'',deadline:'',current_url:'',budget_range:'',source_path:'/',referrer:'',honeypot:''};
describe('visitor confirmation presentation',()=>{
 for(const locale of ['cs-CZ','en-GB'])it(`sends safe HTML and equivalent text in ${locale}`,()=>{
  const m=createLeadConfirmationEmail({...lead,locale});
  expect(m).toMatchObject({to:lead.email,from:'Radeq.cz <siroky@radeq.cz>',replyTo:'siroky@radeq.cz'});
  expect(m.subject).toBe(locale.startsWith('en')?'Enquiry received — RadeQ.cz':'Poptávka dorazila — RadeQ.cz');
  expect(m.html).toContain(locale.startsWith('en')?'<html lang="en">':'<html lang="cs">');
  expect(m.html).toContain('&lt;img');expect(m.html).toContain('&lt;script&gt;');expect(m.html).toContain('&lt;b&gt;unsafe&lt;/b&gt;<br>Second line');
  expect(m.html).not.toMatch(/<(?:img|script|iframe|form)\b|<[^>]+\bonerror\s*=/i);
  expect(m.text).toContain(lead.message);expect(m.text).toContain(lead.project_type);
 });
 it('owner notification remains plaintext and locale independent',()=>{
  const cs=createLeadNotificationEmail(lead,'lead_fixture','2026-10-28T00:00:00Z');const en=createLeadNotificationEmail({...lead,locale:'en'},'lead_fixture','2026-10-28T00:00:00Z');
  expect(cs).toEqual(en);expect(cs).not.toHaveProperty('html');expect(cs.replyTo).toBe(lead.email);
 });
 it('preserves production backend outside the authorized email and quota deltas',()=>{
  const old=readFileSync(new URL('../../docs/deployments/2026-10-28-cloudflare/worker-before/modules/index.js',import.meta.url),'utf8');
  const current=readFileSync(new URL('../release/production-backend.js',import.meta.url),'utf8');
  const normalize=(input:string)=>{
   let s=input.replace(/\r\n/g,'\n').replace(/^import .*;\n/gm,'').replace(/^\/\/# sourceMappingURL=.*\n?/gm,'');
   s=s.replace(/      text: message\.text,?\n(?:      \.\.\.\(message\.html \? \{ html: message\.html \} : \{\}\)\n)?/,'      text: message.text\n').replace(/function createLeadConfirmationEmail\(lead\) \{[\s\S]*?\nfunction optionalLine\(/,'EMAIL_FACTORY\nfunction optionalLine(');
   s=s.replace(/var memoryRateLimit =[\s\S]*?(?=\/\/ functions\/api\/leads.ts)/,'').replace(/var CONFIRMATION_GLOBAL_DAILY_MAX = 50;\n/,'');
   s=s.replace(/  const rateLimit = rateLimitExempt[\s\S]*?(?=  const id =)/,'  LEAD_QUOTA\n').replace(/  const confirmationAllowed = [^\n]+/,'  CONFIRMATION_QUOTA');
   s=s.replace(/async function allowConfirmationEmail\([\s\S]*?(?=function getEmailErrorCode)/,'');
   s=s.replace(/var RATE_LIMIT_WINDOW_MS =[^\n]+\nvar memoryRateLimit2 =[^\n]+\n/,'');
   s=s.replace(/  const rateLimit = (?:await checkRateLimit2|await reserveQuota)[\s\S]*?(?=  let psiResponse;)/,'  MEASURE_QUOTA\n');
   s=s.replace(/async function checkRateLimit2\([\s\S]*?(?=async function verifyTurnstile2)/,'').replace(/getCfConnectingIp2\(request\)/g,'getCfConnectingIp(request)');
   return s;
  };
  expect(normalize(current)).toBe(normalize(old));
  expect(normalize(current.replace('https://api.resend.com/emails','https://wrong.example/'))).not.toBe(normalize(old));
 });
 for(const locale of ['cs-CZ','en-GB'])it(`deployed worker emits owner and visitor payloads with source parity: ${locale}`,async()=>{
  const payloads:any[]=[];const env={LEADS_DB:sqliteD1(),RESEND_API_KEY:'fixture-only'};
  vi.stubGlobal('fetch',vi.fn(async(url:any,init:any)=>{expect(url).toBe('https://api.resend.com/emails');payloads.push(JSON.parse(init.body));return new Response('{"id":"fixture"}') }));
  try{
   const safe={...lead,name:'Fixture owner',project_type:'Website',message:'Hello <b>world</b>\nLine two',locale};
   const r=await backend.fetch(new Request('https://radeq.cz/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(safe)}),env);
   expect(r.status).toBe(201);const receipt=await r.json();expect(receipt.ok).toBe(true);expect(payloads).toHaveLength(2);
   const validated=validateLeadSubmission(safe);expect(validated.ok).toBe(true);if(!validated.ok)throw Error('Invalid fixture');
   const owner=payloads.find(p=>p.to==='siroky@radeq.cz');const createdAt=/Čas: ([^\n]+)/.exec(owner.text)![1];const notification=createLeadNotificationEmail(validated.data,receipt.leadId,createdAt);
   expect(owner).toEqual({from:notification.from,to:notification.to,reply_to:notification.replyTo,subject:notification.subject,text:notification.text});
   const visitor=payloads.find(p=>p.to===safe.email);const m=createLeadConfirmationEmail(validated.data);
   expect(visitor.html).toEqual(expect.stringContaining('<html lang='));
   expect(visitor).toEqual({from:m.from,to:m.to,reply_to:m.replyTo,subject:m.subject,text:m.text,html:m.html});
  }finally{vi.unstubAllGlobals();closeSqliteDbs()}
 });
});
