import {describe,it,expect,vi,afterEach} from 'vitest';
import {startFaviconMotion} from '../src/lib/favicon-motion.mjs';
const fixture=()=>{
 const doc=new EventTarget(),win=new EventTarget(),reduce=new EventTarget(),dark=new EventTarget();
 doc.hidden=false;reduce.matches=false;dark.matches=false;
 const added=[];doc.head={append:node=>added.push(node)};
 doc.createElement=()=>({remove:vi.fn()});
 doc.querySelectorAll=()=>[{href:'/favicon.png',media:''},{href:'/favicon-dark.png',media:'(prefers-color-scheme: dark)'}];
 win.matchMedia=q=>q.includes('reduced-motion')?reduce:dark;
 win.setTimeout=setTimeout;win.clearTimeout=clearTimeout;
 return {doc,win,reduce,dark,added};
};
afterEach(()=>vi.useRealTimers());
describe('favicon motion lifecycle',()=>{
 it('runs once, restores static icons, reuses cached local frames',async()=>{
  vi.useFakeTimers();const f=fixture(),render=vi.fn(async()=>['first','last']);
  const dispose=startFaviconMotion(f.doc,f.win,render);await Promise.resolve();
  expect(f.added[0].href).toBe('first');await vi.runAllTimersAsync();
  expect(f.added[0].remove).toHaveBeenCalledOnce();expect(vi.getTimerCount()).toBe(0);
  f.doc.dispatchEvent(new Event('visibilitychange'));await Promise.resolve();
  expect(render).toHaveBeenCalledOnce();dispose();expect(vi.getTimerCount()).toBe(0);
 });
 it('never starts for reduced motion or a hidden page',async()=>{
  const f=fixture();f.reduce.matches=true;const render=vi.fn();
  const dispose=startFaviconMotion(f.doc,f.win,render);await Promise.resolve();
  expect(render).not.toHaveBeenCalled();f.reduce.matches=false;f.doc.hidden=true;
  f.doc.dispatchEvent(new Event('visibilitychange'));expect(render).not.toHaveBeenCalled();dispose();
 });
 it('cancels pending decoding on pagehide and does not insert a late icon',async()=>{
  const f=fixture();let ready;const render=()=>new Promise(resolve=>{ready=resolve;});
  startFaviconMotion(f.doc,f.win,render);f.win.dispatchEvent(new Event('pagehide'));
  ready(['late']);await Promise.resolve();expect(f.added).toHaveLength(0);
 });
 it('stops immediately on reduced motion and falls back after decode failure',async()=>{
  vi.useFakeTimers();const f=fixture();const dispose=startFaviconMotion(f.doc,f.win,async()=>['a','b']);await Promise.resolve();
  f.reduce.matches=true;f.reduce.dispatchEvent(new Event('change'));
  expect(f.added[0].remove).toHaveBeenCalledOnce();expect(vi.getTimerCount()).toBe(0);dispose();
  const failed=fixture();const clean=startFaviconMotion(failed.doc,failed.win,async()=>{throw Error('decode');});await Promise.resolve();await Promise.resolve();expect(failed.added).toHaveLength(0);clean();
 });
});
