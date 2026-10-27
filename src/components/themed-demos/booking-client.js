import {days,services,availableSlots,initialState,transition} from './booking-state.mjs';
export function mount(root){
 let state=initialState();const q=s=>root.querySelector(s);
 const update=()=>{
  const slots=availableSlots(state),service=services[state.service];
  root.querySelectorAll('[name=service], [name=day]').forEach(input=>{input.disabled=false;input.checked=input.value===state[input.name];});
  root.querySelectorAll('[data-slot]').forEach(label=>{const input=label.querySelector('input');label.hidden=!slots.includes(input.value);input.disabled=label.hidden;input.checked=input.value===state.time;});
  q('[data-time-heading]').textContent=days[state.day].label;
  q('[data-empty]').hidden=slots.length>0;
  q('[data-summary-day]').textContent=days[state.day].label;
  q('[data-summary-time]').textContent=state.time??'Vyberte čas';
  q('[data-summary-service]').textContent=service.label;
  q('[data-summary-details]').textContent=`${service.duration} minut · ${service.price} Kč`;
  q('[data-confirm]').disabled=!slots.includes(state.time)||state.confirmed;
  q('[data-confirm]').textContent=state.confirmed?'Modelově potvrzeno':'Potvrdit modelový výběr';
  q('[data-status]').textContent=state.confirmed?`${service.label} · ${days[state.day].label} v ${state.time}. Modelový výběr potvrzen pouze zde; rezervace se neodeslala.`:(!slots.length?'Pro tuto službu nejsou v modelovém dni žádné termíny. Zvolte jiný den.':state.time?'Vybráno. Zatím nepotvrzeno.':'Vyberte čas pro zvolenou službu a den.');
 };
 root.addEventListener('change',event=>{const input=event.target;if(input instanceof HTMLInputElement&&['service','day','time'].includes(input.name)){state=transition(state,{type:input.name,value:input.value});update();}});
 q('[data-confirm]').addEventListener('click',()=>{state=transition(state,{type:'confirm'});update();});
 q('[data-reset]').addEventListener('click',()=>{state=transition(state,{type:'reset'});update();});
 update();root.querySelectorAll('[data-js-action]').forEach(el=>el.hidden=false);
}
