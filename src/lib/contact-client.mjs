// Client adapter for the unchanged production Worker contract.
export function buildLeadPayload(fields,{locale,path,referrer,currentUrl}) {
 const cleanUrl=value=>{try{const u=new URL(value);return /^https?:$/.test(u.protocol)&&!u.username&&!u.password?u.origin+u.pathname:''}catch{return ''}};
 let origin='';try{origin=new URL(referrer).origin}catch{}
 return {name:fields.get('name')||'',email:fields.get('email')||'',message:fields.get('message')||'',
 project_type:fields.get('project_type')||(locale==='en'?'General enquiry':'Obecná poptávka'),
 company:'',audience:'',deadline:fields.get('deadline')||'',budget_range:fields.get('budget_range')||'',
 current_url:cleanUrl(currentUrl),honeypot:'',source_path:path.split(/[?#]/)[0],referrer:origin,locale};
}
export function createSubmissionController({fetch,onSuccess}) {
 let busy=false,received=false;
 return {async submit(url,payload){
  if(busy||received)return 'busy';busy=true;
  try {
   const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
   if(r.status!==201||!r.headers.get('content-type')?.includes('application/json'))return 'failed';
   const data=await r.json();if(data.ok!==true||typeof data.leadId!=='string'||!data.leadId)return 'failed';
   received=true;onSuccess();return 'received';
  } catch{return 'failed'}finally{busy=false}
 }};
}
