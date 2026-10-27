/** @typedef {{problem:null|'water'|'connect'|'other',description:string,contactOpen:boolean}} State */
/** @returns {State} */
export const createInitialState=()=>({problem:null,description:'',contactOpen:false});
/** @param {State} state @param {{type:string,value?:unknown}} action @returns {State} */
export function transition(state,action){
 switch(action.type){
 case 'problem':return typeof action.value==='string'&&['water','connect','other'].includes(action.value)?{...state,problem:/** @type {State['problem']} */(action.value)}:state;
 case 'description':return typeof action.value==='string'?{...state,description:action.value}:state;
 case 'contact':return {...state,contactOpen:!state.contactOpen};
 case 'reset':return createInitialState();
 default:return state;
 }
}

const HELP = Object.freeze({
 water:Object.freeze({title:'Netěsnosti a odpady',detail:'Připravte si, kde voda teče nebo odpad neodtéká a od kdy problém trvá. Typicky jde o spoj, baterii nebo WC.'}),
 connect:Object.freeze({title:'Montáž a výměna',detail:'Upřesněte, co potřebujete připojit nebo vyměnit: baterii, WC či bojler. Pro domluvu pomůže typ zařízení a stav přívodů.'}),
 other:Object.freeze({title:'Oprava podle domluvy',detail:'Popište, co nefunguje a kde: v koupelně, kuchyni nebo u topení. Rozsah práce i vhodný termín se upřesní při domluvě.'}),
 initial:Object.freeze({title:'Nejprve upřesnit závadu',detail:'Pro domluvu se hodí vědět, co nefunguje, kde a od kdy. Výběr problému ukáže, které informace si připravit.'}),
});
/** @param {State} state */
export function getProblemSummary(state){return state.problem ? HELP[state.problem] : HELP.initial;}
/** @param {State} state @returns {string} */
export function getContactSummary(state){
 const need=state.problem ? getProblemSummary(state).title : 'Typ problému zatím nevybrán.';
 const description=state.description.trim();
 return description ? `${need} · ${description}` : need;
}
