import {describe,it,expect} from 'vitest';
import {addCoffee,changeQuantity,removeCoffee,cartSummary} from '../src/lib/coffee-cart';
const coffee={name:'Brazílie',weight:'250 g',price:220};
describe('coffee cart',()=>{
 it('aggregates repeated variants without mutating input',()=>{const first=addCoffee([],coffee);const next=addCoffee(first,coffee);expect(first[0].quantity).toBe(1);expect(next).toHaveLength(1);expect(next[0].quantity).toBe(2);expect(cartSummary(next)).toEqual({count:2,total:440});});
 it('keeps weights separate and updates their totals',()=>{const cart=addCoffee(addCoffee([],coffee),{...coffee,weight:'1 kg',price:750});const next=changeQuantity(cart,cart[1].key,1);expect(cartSummary(next)).toEqual({count:3,total:1720});expect(cart[1].quantity).toBe(1);});
 it('clamps decrement to one and ignores unknown keys or invalid delta',()=>{const cart=addCoffee([],coffee);expect(changeQuantity(cart,cart[0].key,-5)[0].quantity).toBe(1);expect(changeQuantity(cart,'missing',1)).toEqual(cart);expect(changeQuantity(cart,cart[0].key,NaN)).toEqual(cart);});
 it('removes a variant and returns empty totals',()=>{const cart=addCoffee([],coffee);expect(cartSummary(removeCoffee(cart,cart[0].key))).toEqual({count:0,total:0});expect(cart).toHaveLength(1);});
});
