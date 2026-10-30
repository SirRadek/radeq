import { parentPort, workerData } from 'node:worker_threads';
import { reserveQuota, reserveConfirmation } from '../../release/atomic-quotas.js';
import { sqliteD1, closeSqliteDbs } from './sqlite-d1.mjs';
const db=sqliteD1({filename:workerData.filename,migrate:false,leads:false});
const outcomes=[];
try {
  for(let i=0;i<workerData.attempts;i++) {
    outcomes.push(workerData.mode==='confirmation'
      ? await reserveConfirmation(db,workerData.sameRecipient?'same@example.test':`recipient-${workerData.worker}-${i}@example.test`)
      : await reserveQuota(db,{scope:workerData.mode,subject:'192.0.2.10',max:workerData.mode==='lead'?2:5,windowSeconds:workerData.mode==='lead'?86400:600}));
  }
} finally { closeSqliteDbs(); }
parentPort.postMessage(outcomes);
