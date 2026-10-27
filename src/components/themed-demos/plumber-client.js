import {createInitialState,transition,getProblemSummary,getContactSummary} from './plumber-state.mjs';
const mounted=new WeakMap();
/** @param {HTMLElement} root @returns {()=>void} */
export function mount(root){
 if(mounted.has(root))return mounted.get(root);
 let state=createInitialState();
 const contact=root.querySelector('[data-contact]');
 const explanation=root.querySelector('[data-contact-explanation]');
 const status=root.querySelector('[data-status]');
 const description=root.querySelector('textarea');
 const title=root.querySelector('[data-help-title]');
 const detail=root.querySelector('[data-help-detail]');
 const summary=root.querySelector('[data-contact-summary]');
 const radios=[...root.querySelectorAll('input[type=radio]')];
 function render(){
  radios.forEach(r=>r.checked=r.value===state.problem);
  if(description.value!==state.description)description.value=state.description;
  const help=getProblemSummary(state);
  title.textContent=help.title;
  detail.textContent=help.detail;
  summary.textContent=getContactSummary(state);
  contact.setAttribute('aria-expanded',String(state.contactOpen));
  explanation.hidden=!state.contactOpen;
 }
 function click(event){
  if(!(event.target instanceof Element))return;
  const target=event.target.closest('button');
  if(!target||!root.contains(target))return;
  if(target.matches('[data-contact]')){
   state=transition(state,{type:'contact'});
   status.textContent=state.contactOpen?'Kontakt v ukázce otevřen. Nic se neodesílá.':'Kontakt v ukázce zavřen.';
  }else if(target.matches('[data-reset]')){
   state=transition(state,{type:'reset'});
   status.textContent='Ukázka vrácena do výchozího stavu.';
  }
  render();
 }
 function change(event){
  if(event.target instanceof HTMLInputElement&&event.target.matches('input[type=radio]')){
   state=transition(state,{type:'problem',value:event.target.value});
   render();
  }
 }
 function input(event){
  if(event.target===description){
   state=transition(state,{type:'description',value:description.value});
   // User text is rendered only as text, including strings that look like HTML.
   summary.textContent=getContactSummary(state);
  }
 }
 root.addEventListener('click',click);root.addEventListener('change',change);root.addEventListener('input',input);
 render();root.querySelectorAll('[data-js-action]').forEach(el=>el.hidden=false);
 const cleanup=()=>{
  root.removeEventListener('click',click);root.removeEventListener('change',change);root.removeEventListener('input',input);
  root.querySelectorAll('[data-js-action]').forEach(el=>el.hidden=true);
  explanation.hidden=false;mounted.delete(root);
 };
 mounted.set(root,cleanup);return cleanup;
}
