import {cartSummary, type CoffeeLine} from './coffee-cart';
export type CoffeeOrder = Readonly<{id: string; lines: readonly Readonly<CoffeeLine>[]; count: number; total: number; status: 'received' | 'packing' | 'ready'}>;
export type CoffeeSession = {cart: CoffeeLine[]; order: CoffeeOrder | null; nextOrder: number};
export const initialCoffeeSession = (): CoffeeSession => ({cart: [], order: null, nextOrder: 1});

/** A fixed local demonstration: integer CZK prices, no customer or payment data. */
export function placeCoffeeOrder(session: CoffeeSession): CoffeeSession {
  const {cart} = session;
  if (!cart.length || !Number.isSafeInteger(session.nextOrder) || session.nextOrder < 1 || session.nextOrder >= Number.MAX_SAFE_INTEGER) return session;
  const keys = new Set<string>();
  for (const line of cart) {
    if (typeof line.name !== 'string' || !line.name.trim() || typeof line.weight !== 'string' || !line.weight.trim()
      || line.key !== JSON.stringify([line.name, line.weight]) || keys.has(line.key)
      || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || !Number.isSafeInteger(line.price) || line.price <= 0
      || !Number.isSafeInteger(line.price * line.quantity)) return session;
    keys.add(line.key);
  }
  const summary = cartSummary(cart);
  if (!Number.isSafeInteger(summary.total) || !Number.isSafeInteger(summary.count)) return session;
  const lines = Object.freeze(cart.map(line => Object.freeze({...line})));
  const order: CoffeeOrder = Object.freeze({id: `UM-${String(session.nextOrder).padStart(3, '0')}`, lines, ...summary, status: 'received'});
  return {cart: [], order, nextOrder: session.nextOrder + 1};
}
export function advanceCoffeeOrder(session: CoffeeSession): CoffeeSession {
  const {order} = session;
  if (!order || order.status === 'ready') return session;
  const status = order.status === 'received' ? 'packing' : 'ready';
  return {...session, order: Object.freeze({...order, status})};
}
function csvText(value: string): string {
  // Spreadsheet formula syntax must stay plain text, including after whitespace.
  const guarded = /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${guarded.replaceAll('"', '""')}"`;
}
export function coffeeOrderCsv(order: CoffeeOrder | null, lang: 'cs' | 'en' = 'cs'): string {
  if (!order) return '';
  const header = lang === 'en' ? 'order;status;coffee;pack_size;quantity;unit_price_CZK;total_CZK' : 'objednavka;stav;kava;gramaz;pocet;cena_za_kus_Kc;celkem_Kc';
  const rows = order.lines.map(line => [csvText(order.id), csvText(order.status), csvText(line.name), csvText(line.weight), line.quantity, line.price, line.price * line.quantity].join(';'));
  return [header, ...rows, ''].join('\r\n');
}
