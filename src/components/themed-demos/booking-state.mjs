export const days = Object.freeze({
 '2026-10-08':Object.freeze({label:'Čtvrtek 8. října 2026',short:'Čt 8. října',slots:Object.freeze(['09:00','11:30'])}),
 '2026-10-09':Object.freeze({label:'Pátek 9. října 2026',short:'Pá 9. října',slots:Object.freeze(['09:00','11:30','15:00'])}),
 '2026-10-12':Object.freeze({label:'Pondělí 12. října 2026',short:'Po 12. října',slots:Object.freeze([])}),
});
export const services = Object.freeze({
 intro:Object.freeze({label:'Úvodní setkání',description:'Prostor pro rozhovor a společné zmapování pohybových návyků.',duration:60,price:800,times:Object.freeze(['09:00','11:30'])}),
 followup:Object.freeze({label:'Navazující návštěva',description:'Čas pro návaznou práci a projití domluveného pohybového plánu.',duration:50,price:700,times:Object.freeze(['09:00','11:30','15:00'])}),
 consultation:Object.freeze({label:'Pohybová konzultace',description:'Krátké setkání nad pohybem v práci a v běžném dni.',duration:30,price:450,times:Object.freeze(['11:30','15:00'])}),
});
const known=(catalogue,value)=>typeof value==='string'&&Object.hasOwn(catalogue,value);
/** @returns {{service: keyof typeof services, day: keyof typeof days, time: string | null, confirmed: boolean}} */
export const initialState=()=>({service:'intro',day:'2026-10-09',time:'11:30',confirmed:false});
export function availableSlots(state){
 if(!known(days,state.day)||!known(services,state.service))return [];
 return days[state.day].slots.filter(time=>services[state.service].times.includes(time));
}
export function transition(state,action){
 if(!action||typeof action!=='object')return state;
 if(action.type==='reset')return initialState();
 if(action.type==='service'&&known(services,action.value))return action.value===state.service?state:{...state,service:action.value,time:null,confirmed:false};
 if(action.type==='day'&&known(days,action.value))return action.value===state.day?state:{...state,day:action.value,time:null,confirmed:false};
 if(action.type==='time'&&availableSlots(state).includes(action.value))return action.value===state.time?state:{...state,time:action.value,confirmed:false};
 if(action.type==='confirm'&&availableSlots(state).includes(state.time))return state.confirmed?state:{...state,confirmed:true};
 return state;
}
