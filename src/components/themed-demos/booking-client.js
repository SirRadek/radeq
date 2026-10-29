import {demoText, demoMoney} from './demo-i18n.mjs';
import {days,services,availableSlots,initialState,transition} from './booking-state.mjs';
export function mount(root){
 const lang=root.dataset.lang==='en'?'en':'cs',en=lang==='en',t=value=>demoText(lang,value);
 let state=initialState();const q=s=>root.querySelector(s);
 const update=()=>{
  const slots=availableSlots(state),service=services[state.service];
  root.querySelectorAll('[name=service], [name=day]').forEach(input=>{input.disabled=false;input.checked=input.value===state[input.name];});
  root.querySelectorAll('[data-slot]').forEach(label=>{const input=label.querySelector('input');label.hidden=!slots.includes(input.value);input.disabled=label.hidden;input.checked=input.value===state.time;});
  q('[data-time-heading]').textContent=t(days[state.day].label);
  q('[data-empty]').hidden=slots.length>0;
  q('[data-summary-day]').textContent=t(days[state.day].label);
  q('[data-summary-time]').textContent=state.time??t("Vyberte čas");
  q('[data-summary-service]').textContent=t(service.label);
  q('[data-summary-details]').textContent=`${service.duration} ${t("minut")} · ${demoMoney(lang,service.price)}`;
  q('[data-confirm]').disabled=!slots.includes(state.time)||state.confirmed;
  q('[data-confirm]').textContent=state.confirmed?t("Modelově potvrzeno"):t("Potvrdit modelový výběr");
  q('[data-status]').textContent=state.confirmed?(en ? `${t(service.label)} · ${t(days[state.day].label)} at ${state.time}. Demo selection confirmed only here; no booking was sent.` : `${service.label} · ${days[state.day].label} v ${state.time}. Modelový výběr potvrzen pouze zde; rezervace se neodeslala.`):(!slots.length?t("Pro tuto službu nejsou v modelovém dni žádné termíny. Zvolte jiný den."):state.time?t("Vybráno. Zatím nepotvrzeno."):t("Vyberte čas pro zvolenou službu a den."));
 };
 root.addEventListener('change',event=>{const input=event.target;if(input instanceof HTMLInputElement&&['service','day','time'].includes(input.name)){state=transition(state,{type:input.name,value:input.value});update();}});
 q('[data-confirm]').addEventListener('click',()=>{state=transition(state,{type:'confirm'});update();});
 q('[data-reset]').addEventListener('click',()=>{state=transition(state,{type:'reset'});update();});
 update();root.querySelectorAll('[data-js-action]').forEach(el=>el.hidden=false);
}
