import { afterEach, expect, it } from 'vitest';
import { Worker } from 'node:worker_threads';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sqliteD1,closeSqliteDbs } from './helpers/sqlite-d1.mjs';
const scratch=[];
afterEach(()=>{closeSqliteDbs();for(const p of scratch.splice(0))rmSync(p,{recursive:true,force:true})});
for(const [mode,sameRecipient,expected]of [['lead',false,2],['measure',false,5],['confirmation',true,1],['confirmation',false,50]]) {
  it(`serializes ${mode} ${sameRecipient?'same recipient':'shared budget'} across six real SQLite connections`,async()=>{
    const dir=mkdtempSync(join(tmpdir(),'radeq-quotas-'));scratch.push(dir);const filename=join(dir,'fixture.sqlite');
    sqliteD1({filename,leads:false});closeSqliteDbs();
    const results=await Promise.all(Array.from({length:6},(_,worker)=>new Promise((resolve,reject)=>{
      const thread=new Worker(new URL('./helpers/quota-worker.mjs',import.meta.url),{workerData:{filename,mode,sameRecipient,worker,attempts:12}});
      thread.once('message',resolve);thread.once('error',reject);thread.once('exit',code=>{if(code)reject(Error(`worker exit ${code}`))});
    })));
    expect(results.flat().filter(x=>x.status==='allowed')).toHaveLength(expected);
    expect(results.flat().filter(x=>x.status==='unavailable')).toHaveLength(0);
  },30000);
}
