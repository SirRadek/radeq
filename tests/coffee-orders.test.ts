import {describe, it, expect} from 'vitest';
import {addCoffee, changeQuantity} from '../src/lib/coffee-cart';
import {initialCoffeeSession, placeCoffeeOrder, advanceCoffeeOrder, coffeeOrderCsv} from '../src/lib/coffee-orders';
const coffee = {name: 'Mlýnské espresso', weight: '250 g', price: 219};
const filled = () => ({...initialCoffeeSession(), cart: addCoffee(addCoffee([], coffee), {...coffee, weight: '500 g', price: 399})});
describe('coffee model orders', () => {
  it('exports English column labels while retaining quoted product data and Czech default headers', () => {
    const order = placeCoffeeOrder({...initialCoffeeSession(),cart:addCoffee([],{name:'=Coffee; "special"',weight:'250 g',price:219})}).order;
    const english = coffeeOrderCsv(order, 'en');
    expect(english.split('\r\n')[0]).toBe('order;status;coffee;pack_size;quantity;unit_price_CZK;total_CZK');
    expect(english).toContain('"\'=Coffee; ""special"""');
    expect(coffeeOrderCsv(order).split('\r\n')[0]).toContain('objednavka;stav;kava');
  });
  it('snapshots quantities and prices, clears the basket, and keeps its source unchanged', () => {
    const source = filled(); source.cart = changeQuantity(source.cart, source.cart[0].key, 1);
    const placed = placeCoffeeOrder(source);
    expect(placed.cart).toEqual([]);
    expect(placed.order).toMatchObject({id: 'UM-001', count: 3, total: 837, status: 'received'});
    expect(source.cart).toHaveLength(2);
    source.cart[0].quantity = 99;
    expect(placed.order?.lines[0].quantity).toBe(2);
    expect(Object.isFrozen(placed.order?.lines[0])).toBe(true);
    const edited = {...placed, cart: addCoffee(placed.cart, coffee)};
    expect(edited.order?.total).toBe(837);
  });
  it('advances only the same order through packing and ready, keeping totals and snapshot intact', () => {
    const placed = placeCoffeeOrder(filled());
    const packing = advanceCoffeeOrder(placed);
    const ready = advanceCoffeeOrder(packing);
    expect(packing.order?.status).toBe('packing');
    expect(ready.order?.status).toBe('ready');
    expect(ready.order?.id).toBe('UM-001');
    expect(ready.order?.total).toBe(618);
    expect(ready.order?.lines).toBe(placed.order?.lines);
    expect(advanceCoffeeOrder(ready)).toBe(ready);
    expect(placed.order?.status).toBe('received');
  });
  it('empty and invalid baskets cannot replace the previous valid order', () => {
    const placed = placeCoffeeOrder(filled());
    expect(placeCoffeeOrder(placed)).toBe(placed);
    for (const patch of [{quantity: 0}, {quantity: 1.5}, {price: NaN}, {price: -5}, {name: ''}, {weight: ''}, {price: Number.MAX_SAFE_INTEGER, quantity: 2}]) {
      expect(placeCoffeeOrder({...placed, cart: [{...filled().cart[0], ...patch}]}).order).toBe(placed.order);
    }
    const duplicated = filled(); duplicated.cart.push({...duplicated.cart[0]});
    expect(placeCoffeeOrder(duplicated)).toBe(duplicated);
    expect(advanceCoffeeOrder(initialCoffeeSession()).order).toBeNull();
  });
  it('numbers new snapshots deterministically and reset restores basket, order and sequence', () => {
    const first = placeCoffeeOrder(filled());
    const second = placeCoffeeOrder({...first, cart: addCoffee([], coffee)});
    expect(second.order?.id).toBe('UM-002');
    expect(first.order?.total).toBe(618);
    const reset = initialCoffeeSession();
    expect(reset).toEqual({cart: [], order: null, nextOrder: 1});
    expect(placeCoffeeOrder({...reset, cart: addCoffee([], coffee)}).order?.id).toBe('UM-001');
  });
  it('CSV exports the current immutable order lines with unit prices, quantities and totals', () => {
    const placed = placeCoffeeOrder(filled());
    expect(coffeeOrderCsv(placed.order)).toBe('objednavka;stav;kava;gramaz;pocet;cena_za_kus_Kc;celkem_Kc\r\n"UM-001";"received";"Mlýnské espresso";"250 g";1;219;219\r\n"UM-001";"received";"Mlýnské espresso";"500 g";1;399;399\r\n');
    expect(coffeeOrderCsv(advanceCoffeeOrder(placed).order)).toContain('"packing"');
    expect(coffeeOrderCsv(null)).toBe('');
  });
  it('quotes separators, quotes and newlines and neutralizes text formula prefixes', () => {
    const placed = placeCoffeeOrder({...initialCoffeeSession(), cart: addCoffee([], {name: '=SUM(1;2)"\nKáva', weight: '\t@250 g', price: 10})});
    expect(coffeeOrderCsv(placed.order)).toContain('"\'=SUM(1;2)""\nKáva";"\'\t@250 g";1;10;10');
  });
});
