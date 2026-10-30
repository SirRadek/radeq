export const sourceCategories = Object.freeze(['unknown','google','seznam','bing','chatgpt','perplexity','claude','gemini','copilot','linkedin','github','firmy','zivefirmy']);
const domains = [
 ['gemini.google.com','gemini'],['copilot.microsoft.com','copilot'],['chatgpt.com','chatgpt'],['chat.openai.com','chatgpt'],
 ['perplexity.ai','perplexity'],['claude.ai','claude'],['google.com','google'],['google.cz','google'],
 ['seznam.cz','seznam'],['bing.com','bing'],['linkedin.com','linkedin'],['github.com','github'],['firmy.cz','firmy'],['zivefirmy.cz','zivefirmy'],
];
export function categorizeReferrer(value){
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'&&url.protocol!=='http:')return 'unknown';
  const host=url.hostname.toLowerCase();
  return domains.find(([domain])=>host===domain||host.endsWith('.'+domain))?.[1]??'unknown';
 }catch{return 'unknown'}
}
export function createMeasurementChannel({purpose,frameUrl,seen=new Set(),window:host=window,document:doc=document}){
 const frame=doc.createElement('iframe');
 frame.hidden=true;frame.title=purpose==='analytics'?'Google Analytics':'Seznam Sklik';
 frame.referrerPolicy='no-referrer';frame.src=frameUrl;
 // This function is called only by an active consent purpose. Never persist the raw referrer.
 const source=purpose==='analytics'?categorizeReferrer(doc.referrer):'unknown';
 const path=host.location.pathname,origin=host.location.origin;
 let alive=true,ready=false;
 const pending=new Set();
 const send=name=>{if(alive&&ready)frame.contentWindow?.postMessage({type:'radeq:measurement-event',name},origin)};
 const listen=e=>{
  if(!alive||e.origin!==origin||e.source!==frame.contentWindow)return;
  if(e.data?.type==='radeq:measurement-ready')frame.contentWindow?.postMessage({type:'radeq:measurement-init',purpose,path,source},origin);
  if(e.data?.type==='radeq:measurement-loaded'){ready=true;for(const name of pending)send(name);pending.clear()}
 };
 host.addEventListener('message',listen);doc.body.append(frame);
 return {
  event(name){
   if(!alive)return;
   const event=name==='lead_received'?'generate_lead':name;
   if(!['contact_intent','form_start','generate_lead'].includes(event)||purpose==='marketing'&&event!=='generate_lead'||seen.has(event))return;
   seen.add(event);
   if(ready)send(event);else pending.add(event);
  },
  stop(){alive=false;pending.clear();host.removeEventListener('message',listen);frame.remove()},
 };
}
