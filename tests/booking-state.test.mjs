import {describe,it,expect} from 'vitest';
import * as booking from '../src/components/themed-demos/booking-state.mjs';
const {initialState,transition,days}=booking;
describe('fixed local booking',()=>{
 it('starts with a complete fictional introductory selection, unconfirmed',()=>{
  expect(initialState()).toEqual({service:'intro',day:'2026-10-09',time:'11:30',confirmed:false});
  expect(days['2026-10-08'].slots).toEqual(['09:00','11:30']);
 });
 it('offers three services with explicit duration and illustrative price',()=>{
  expect(Object.keys(booking.services??{})).toEqual(['intro','followup','consultation']);
  for(const service of Object.values(booking.services??{})){
   expect(service.label).toEqual(expect.any(String));expect(service.description).toEqual(expect.any(String));
   expect(service.duration).toBeGreaterThan(0);expect(service.price).toBeGreaterThan(0);
  }
 });
 it('filters fixed availability by selected service',()=>{
  expect(booking.availableSlots?.({service:'intro',day:'2026-10-09'})).toEqual(['09:00','11:30']);
  expect(booking.availableSlots?.({service:'followup',day:'2026-10-09'})).toEqual(['09:00','11:30','15:00']);
  expect(booking.availableSlots?.({service:'consultation',day:'2026-10-09'})).toEqual(['11:30','15:00']);
 });
 it('changing service clears even a compatible time and prior confirmation',()=>{
  const s=transition(initialState(),{type:'confirm'});
  expect(transition(s,{type:'service',value:'followup'})).toEqual({service:'followup',day:s.day,time:null,confirmed:false});
  expect(s.confirmed).toBe(true);
 });
 it('changing service clears an incompatible afternoon selection',()=>{
  const s={service:'followup',day:'2026-10-09',time:'15:00',confirmed:true};
  expect(transition(s,{type:'service',value:'intro'})).toEqual({service:'intro',day:s.day,time:null,confirmed:false});
 });
 it('changing day clears stale selection and confirmation',()=>{
  const s=transition(initialState(),{type:'confirm'});
  expect(transition(s,{type:'day',value:'2026-10-08'})).toEqual({service:'intro',day:'2026-10-08',time:null,confirmed:false});
 });
 it('rejects foreign slots, malformed actions, services and days without mutation',()=>{
  const s=Object.freeze(initialState());
  for(const a of [null,{}, {type:'time',value:'15:00'},{type:'service',value:'foreign'},{type:'service',value:'toString'},{type:'day',value:'2027-01-01'},{type:'time',value:{}},{type:'unknown'}])expect(transition(s,a)).toBe(s);
 });
 it('empty Monday cannot select or confirm',()=>{
  let s=transition(initialState(),{type:'day',value:'2026-10-12'});
  s=transition(s,{type:'time',value:'11:30'});
  expect(transition(s,{type:'confirm'})).toEqual({service:'intro',day:'2026-10-12',time:null,confirmed:false});
 });
 it('confirms only a valid service, day and compatible time',()=>{
  for(const s of [{...initialState(),service:'foreign'},{...initialState(),day:'foreign'},{...initialState(),time:'15:00'},{...initialState(),time:null}])expect(transition(s,{type:'confirm'})).toBe(s);
  expect(transition(initialState(),{type:'confirm'}).confirmed).toBe(true);
 });
 it('changing time invalidates confirmation, preserving the original state',()=>{
  const s=Object.freeze(transition(initialState(),{type:'confirm'}));
  expect(transition(s,{type:'time',value:'09:00'})).toEqual({...s,time:'09:00',confirmed:false});
  expect(s.confirmed).toBe(true);expect(s.time).toBe('11:30');
 });
 it('same selection and repeat confirmation are idempotent',()=>{
  const s=transition(initialState(),{type:'confirm'});
  for(const a of [{type:'service',value:s.service},{type:'day',value:s.day},{type:'time',value:s.time},{type:'confirm'}])expect(transition(s,a)).toBe(s);
 });
 it('reset restores the complete initial snapshot with independent states',()=>{
  const s=transition(initialState(),{type:'service',value:'consultation'});
  expect(transition(s,{type:'reset'})).toEqual(initialState());expect(initialState()).not.toBe(initialState());
 });
 it('availability and catalogue cannot be mutated',()=>{
  expect(Object.isFrozen(days['2026-10-09'].slots)).toBe(true);
  expect(Object.isFrozen(booking.services?.intro)).toBe(true);
  const slots=booking.availableSlots?.(initialState());slots?.push('18:00');
  expect(booking.availableSlots?.(initialState())).toEqual(['09:00','11:30']);
 });
});
