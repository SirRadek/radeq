export const consentKey='radeq.consent.v1';
export const consentAge=180*24*60*60*1000;
export function readConsent(storage,now=Date.now()){
 try{const c=JSON.parse(storage.getItem(consentKey));return c?.v===1&&Number.isFinite(c.at)&&c.at<=now&&now-c.at<consentAge&&typeof c.analytics==='boolean'&&typeof c.marketing==='boolean'?c:null}catch{return null}
}
export function createConsentController({storage,start,now=()=>Date.now()}){
 const active=new Map();let choice={analytics:false,marketing:false};
 function apply(next){
  for(const purpose of ['analytics','marketing']){
   if(!next[purpose]&&active.has(purpose)){active.get(purpose).stop();active.delete(purpose)}
   if(next[purpose]&&!active.has(purpose))active.set(purpose,start(purpose));
  }
  choice=next;
 }
 return {restore(){const c=readConsent(storage,now());if(c)apply(c);return c},choose(next){
  const c={v:1,at:now(),analytics:next.analytics===true,marketing:next.marketing===true};
  try{storage.setItem(consentKey,JSON.stringify(c))}catch{apply({analytics:false,marketing:false});return false}
  apply(c);return true;
 },event(name){if(name!=='lead_received')return;for(const channel of active.values())channel.event(name)},get choice(){return choice}};
}
