import {describe,it,expect} from 'vitest';
import {createInitialState,transition,getProblemSummary,getContactSummary} from '../src/components/themed-demos/plumber-state.mjs';

describe('plumber need summary',()=>{
 it('starts with useful general guidance and no invented selection',()=>{
  const state=createInitialState();
  expect(getProblemSummary(state)).toMatchObject({title:'Nejprve upřesnit závadu'});
  expect(getContactSummary(state)).toBe('Typ problému zatím nevybrán.');
  expect(state.problem).toBeNull();
 });
 it.each([
  ['water','Netěsnosti a odpady','kde voda teče'],
  ['connect','Montáž a výměna','co potřebujete připojit'],
  ['other','Oprava podle domluvy','co nefunguje'],
 ])('connects %s to relevant help and preparation', (problem,title,detail)=>{
  const state=transition(createInitialState(),{type:'problem',value:problem});
  expect(getProblemSummary(state).title).toBe(title);
  expect(getProblemSummary(state).detail).toContain(detail);
  expect(getContactSummary(state)).toContain(title);
 });
 it('changes selected help while preserving optional text and independently open contact',()=>{
  let state=transition(createInitialState(),{type:'problem',value:'water'});
  state=transition(state,{type:'description',value:'Pod dřezem kape spoj.'});
  state=transition(state,{type:'contact'});
  const next=transition(state,{type:'problem',value:'connect'});
  expect(getContactSummary(next)).toBe('Montáž a výměna · Pod dřezem kape spoj.');
  expect(next.contactOpen).toBe(true);
  expect(getProblemSummary(state).title).toBe('Netěsnosti a odpady');
 });
 it('keeps optional text as plain data, never markup, and excludes whitespace-only notes',()=>{
  const text='<img src=x onerror=alert(1)>';
  const state=transition(createInitialState(),{type:'description',value:text});
  expect(getContactSummary(state)).toBe(`Typ problému zatím nevybrán. · ${text}`);
  expect(state.description).toBe(text);
  expect(getContactSummary(transition(state,{type:'description',value:'  '}))).toBe('Typ problému zatím nevybrán.');
 });
 it('reset clears the need, text and explanation without mutating the old state',()=>{
  let state=transition(createInitialState(),{type:'problem',value:'other'});
  state=transition(state,{type:'description',value:'Výměna ventilu'});
  state=transition(state,{type:'contact'});
  const next=transition(state,{type:'reset'});
  expect(next).toEqual(createInitialState());
  expect(getContactSummary(next)).toBe('Typ problému zatím nevybrán.');
  expect(state.contactOpen).toBe(true);
 });
});
