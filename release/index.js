import production from './production-backend.js';
// The API executable is an exact production snapshot. Only the frontend and host gate change.
export default {async fetch(request,env){
 const url=new URL(request.url);const live=url.hostname==='radeq.cz';
 if(!live&&url.pathname.startsWith('/api/'))return new Response('Preview APIs are disabled',{status:403,headers:{'cache-control':'no-store','x-robots-tag':'noindex, nofollow'}});
 const response=await production.fetch(request,env);
 const result=new Response(response.body,response);
 if(!live)result.headers.set('x-robots-tag','noindex, nofollow');
 if(url.pathname.startsWith('/measurement/')){result.headers.set('x-frame-options','SAMEORIGIN');result.headers.set('referrer-policy','no-referrer');result.headers.set('x-robots-tag','noindex, nofollow')}
 return result;
}};
