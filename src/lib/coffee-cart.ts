export type Coffee = {name:string;weight:string;price:number};
export type CoffeeLine = Coffee & {key:string;quantity:number};
export function addCoffee(cart:CoffeeLine[],item:Coffee):CoffeeLine[]{
 const key=JSON.stringify([item.name,item.weight]);
 return cart.some(line=>line.key===key)?cart.map(line=>line.key===key?{...line,quantity:line.quantity+1}:line):[...cart,{...item,key,quantity:1}];
}
export function changeQuantity(cart:CoffeeLine[],key:string,delta:number):CoffeeLine[]{
 if(!Number.isInteger(delta))return cart;
 return cart.map(line=>line.key===key?{...line,quantity:Math.max(1,line.quantity+delta)}:line);
}
export function removeCoffee(cart:CoffeeLine[],key:string):CoffeeLine[]{return cart.filter(line=>line.key!==key);}
export function cartSummary(cart:CoffeeLine[]):{count:number;total:number}{return cart.reduce((summary,line)=>({count:summary.count+line.quantity,total:summary.total+line.price*line.quantity}),{count:0,total:0});}
