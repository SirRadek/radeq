import { afterEach, describe, expect, it } from 'vitest';
import { reserveQuota, reserveConfirmation, quotaSql } from '../release/atomic-quotas.js';
import { sqliteD1, closeSqliteDbs } from './helpers/sqlite-d1.mjs';
afterEach(closeSqliteDbs);
const lead = {scope:'lead',subject:'192.0.2.1',max:2,windowSeconds:86400};
describe('atomic persistent quota boundary',()=>{
  it('enforces all single budgets and namespace isolation with real SQL',async()=>{
    const db=sqliteD1();
    for(const options of [lead,{...lead,scope:'measure',max:5,windowSeconds:600}]) {
      for(let i=0;i<options.max;i++)expect(await reserveQuota(db,options)).toEqual({status:'allowed'});
      const denied=await reserveQuota(db,options);expect(denied.status).toBe('limited');
      expect(denied.retryAfterSeconds).toBeGreaterThanOrEqual(options.windowSeconds-2);expect(denied.retryAfterSeconds).toBeLessThanOrEqual(options.windowSeconds);
    }
    const keys=db.sqlite.prepare('SELECT quota_key FROM abuse_quotas').all();
    expect(keys).toHaveLength(2);expect(JSON.stringify(keys)).not.toContain('192.0.2.1');
  });
  it('normalizes recipient aliases and reserves both email budgets without losing slots',async()=>{
    const db=sqliteD1();expect(await reserveConfirmation(db,' Alice@Example.test ')).toEqual({status:'allowed'});
    expect((await reserveConfirmation(db,'alice@example.test')).status).toBe('limited');
    expect(db.sqlite.prepare("SELECT count FROM abuse_quotas WHERE quota_key='confirm:global'").get().count).toBe(1);
    for(let i=1;i<50;i++)expect((await reserveConfirmation(db,`p${i}@example.test`)).status).toBe('allowed');
    expect((await reserveConfirmation(db,'last@example.test')).status).toBe('limited');
    expect(db.sqlite.prepare('SELECT count(*) AS n FROM abuse_quotas').get().n).toBe(51);
    expect(JSON.stringify(db.sqlite.prepare('SELECT quota_key FROM abuse_quotas').all())).not.toContain('@');
  });
  it('preserves anchored windows and resets at exact expiry rather than extending on later grants',async()=>{
    const db=sqliteD1();await reserveQuota(db,lead);
    db.sqlite.exec('UPDATE abuse_quotas SET reset_at=unixepoch()+100');
    await reserveQuota(db,lead);expect((await reserveQuota(db,lead)).retryAfterSeconds).toBeLessThanOrEqual(100);
    db.sqlite.exec('UPDATE abuse_quotas SET reset_at=unixepoch()');
    expect((await reserveQuota(db,lead)).status).toBe('allowed');
    const reset=db.sqlite.prepare('SELECT count,reset_at-unixepoch() AS remaining FROM abuse_quotas').get();
    expect(reset.count).toBe(1);expect(reset.remaining).toBeGreaterThanOrEqual(86399);expect(reset.remaining).toBeLessThanOrEqual(86400);
    await reserveConfirmation(db,'a@example.test');db.sqlite.exec('UPDATE abuse_quotas SET reset_at=unixepoch()-1');
    expect((await reserveConfirmation(db,'a@example.test')).status).toBe('allowed');
  });
  it('fails closed on absent schema/storage and malformed grant evidence',async()=>{
    expect(await reserveQuota(undefined,lead)).toEqual({status:'unavailable'});
    expect(await reserveQuota(sqliteD1({migrate:false}),lead)).toEqual({status:'unavailable'});
    for(const result of [{success:false,results:[]},{success:true,results:[{count:1}]},{success:true,results:'wrong'}]){
      const db={prepare(){return {bind(){return this},all:async()=>result}}};
      expect(await reserveQuota(db,lead)).toEqual({status:'unavailable'});
    }
    expect(await reserveConfirmation({batch:async()=>[]},'a@example.test')).toEqual({status:'unavailable'});
  });
  it('rolls back recipient reservation when the global statement fails',async()=>{
    const db=sqliteD1();db.sqlite.exec("CREATE TRIGGER fail_global BEFORE INSERT ON abuse_quotas WHEN NEW.quota_key='confirm:global' BEGIN SELECT RAISE(ABORT,'fixture'); END");
    expect((await reserveConfirmation(db,'a@example.test')).status).toBe('unavailable');
    expect(db.sqlite.prepare('SELECT count(*) AS n FROM abuse_quotas').get().n).toBe(0);
  });
  it('cleans at most100 expired rows and cleanup failure never grants or cancels a reservation',async()=>{
    const db=sqliteD1();const insert=db.sqlite.prepare('INSERT INTO abuse_quotas VALUES (?,1,1,?)');
    for(let i=0;i<130;i++)insert.run(`expired:${i}`,crypto.randomUUID());
    expect((await reserveQuota(db,lead)).status).toBe('allowed');
    expect(db.sqlite.prepare('SELECT count(*) AS n FROM abuse_quotas WHERE reset_at=1').get().n).toBe(30);
    const original=db.prepare;db.prepare=query=>{if(query===quotaSql.cleanup)throw Error('fixture');return original(query)};
    expect((await reserveQuota(db,lead)).status).toBe('allowed');expect((await reserveQuota(db,lead)).status).toBe('limited');
  });
});
