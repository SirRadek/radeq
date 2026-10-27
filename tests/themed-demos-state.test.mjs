import {describe,it,expect} from 'vitest';
import {createInitialState,transition} from '../src/components/themed-demos/plumber-state.mjs';
describe('plumber local state',()=>{
 it('contact needs no inputs and toggles independently',()=>{const s=createInitialState();const next=transition(s,{type:'contact'});expect(next).toEqual({problem:null,description:'',contactOpen:true});expect(s.contactOpen).toBe(false);expect(transition(next,{type:'contact'}).contactOpen).toBe(false);});
 it('reset clears selection, optional user text and open contact',()=>{let s=transition(createInitialState(),{type:'problem',value:'water'});s=transition(s,{type:'description',value:'<img src=x onerror=alert(1)>'});s=transition(s,{type:'contact'});expect(transition(s,{type:'reset'})).toEqual(createInitialState());});
 it('invalid actions preserve state',()=>{const s=createInitialState();for(const a of [{type:'other'},{type:'problem',value:'bad'},{type:'description',value:12},{type:'problem',value:{toString:()=> 'water'}}])expect(transition(s,a)).toBe(s);});
});
