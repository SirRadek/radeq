async function makeFrames(url,doc,win) {
 const img=new win.Image();
 img.src=url;
 await img.decode();
 const canvas=doc.createElement('canvas');canvas.width=64;canvas.height=64;
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('Canvas unavailable');
 return Array.from({length:12},(_,i)=>{
  const pulse=Math.sin(i/11*Math.PI);
  ctx.clearRect(0,0,64,64);ctx.save();ctx.translate(32,32);
  ctx.rotate(pulse*.07);const size=64*(1-.07*pulse);
  ctx.drawImage(img,-size/2,-size/2,size,size);ctx.restore();
  return canvas.toDataURL('image/png');
 });
}
// One quiet pulse on arrival/return. Static light/dark icons remain the fallback.
export function startFaviconMotion(doc=document,win=window,render=makeFrames) {
 const reduce=win.matchMedia('(prefers-reduced-motion: reduce)');
 const dark=win.matchMedia('(prefers-color-scheme: dark)');
 const originals=[...doc.querySelectorAll('link[rel="icon"][type="image/png"]')];
 if(!originals.length)return ()=>{};
 const cache=new Map();let generation=0,timer,icon,disposed=false;
 const stop=()=>{generation++;win.clearTimeout(timer);icon?.remove();icon=undefined;};
 const play=async()=>{
  stop();if(disposed||reduce.matches||doc.hidden)return;
  const own=generation;
  const source=originals.find(link=>dark.matches?link.media.includes('dark'):!link.media)??originals[0];
  try{
   if(!cache.has(source.href))cache.set(source.href,render(source.href,doc,win));
   const frames=await cache.get(source.href);
   if(own!==generation||disposed||reduce.matches||doc.hidden)return;
   icon=doc.createElement('link');icon.rel='icon';icon.type='image/png';doc.head.append(icon);
   let frame=0;
   const tick=()=>{
    if(own!==generation||disposed||doc.hidden||reduce.matches){stop();return;}
    if(frame>=frames.length){stop();return;}
    icon.href=frames[frame++];timer=win.setTimeout(tick,90);
   };tick();
  }catch{if(own===generation)stop();}
 };
 const change=()=>{void play();};
 const dispose=()=>{disposed=true;stop();doc.removeEventListener('visibilitychange',change);reduce.removeEventListener('change',change);dark.removeEventListener('change',change);win.removeEventListener('pagehide',dispose);};
 doc.addEventListener('visibilitychange',change);reduce.addEventListener('change',change);dark.addEventListener('change',change);win.addEventListener('pagehide',dispose);
 void play();return dispose;
}
