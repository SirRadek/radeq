import { initialState, transition, summarize, JOBS } from './workshop-state.mjs';
export function mount(root) {
  let state = initialState();
  const q = selector => root.querySelector(selector);
  const doneButton = q('[data-done]');
  const undoButton = q('[data-undo]');
  const render = () => {
    const day = summarize(state);
    q('[data-done-count]').textContent = `${day.done} / ${JOBS.length}`;
    q('[data-remaining]').textContent = day.remaining ? `Zbývá ${day.remaining} ${day.remaining === 1 ? 'zakázka' : 'zakázky'}.` : 'Dnešní seznam je hotový.';
    q('[data-step-label]').textContent = day.current ? 'Právě na stole' : 'Pro dnešek hotovo';
    q('[data-step-number]').textContent = String(Math.min(day.done + 1, JOBS.length)).padStart(2, '0');
    q('[data-current-step]').textContent = day.current?.step ?? 'DEN UZAVŘEN';
    q('[data-current-job]').textContent = day.current ? `${day.current.id} · ${day.current.title.toLocaleLowerCase('cs')}` : 'Všechny tři modelové zakázky jsou dokončené.';
    q('[data-job-status]').textContent = day.current?.detail ?? 'Každé dokončení i materiál můžeš vrátit zpět.';
    doneButton.disabled = !day.current;
    doneButton.dataset.jobId = day.current?.id ?? '';
    doneButton.textContent = day.current ? 'Hotovo → další' : 'Vše hotovo';
    q('[data-completion-note]').textContent = day.current ? `Dokončení odečte ${day.current.boards} ${day.current.boards === 1 ? 'desku' : 'desky'} z modelového skladu.` : 'Spotřeba celkem: 4 desky.';
    undoButton.hidden = day.done === 0;
    q('[data-stock]').textContent = `${day.stock} ${day.stock === 1 ? 'deska' : day.stock > 1 && day.stock < 5 ? 'desky' : 'desek'}`;
    q('[data-material-status]').textContent = `Výchozí zásoba 4 ks · spotřebováno ${day.used} ks.`;
    q('[data-next]').textContent = day.next ? `${day.next.id} · ${day.next.title.toLocaleLowerCase('cs')}` : day.current ? 'Poslední zakázka dne.' : 'Žádná další práce v tomto modelovém dni.';
    root.querySelectorAll('[data-job]').forEach(row => {
      const id = row.dataset.job;
      const completed = state.completed.includes(id);
      const current = id === day.current?.id;
      row.classList.toggle('is-done', completed);
      row.classList.toggle('is-current', current);
      if (current) row.setAttribute('aria-current', 'step'); else row.removeAttribute('aria-current');
      row.querySelector('[data-row-status]').textContent = completed ? 'Hotovo' : current ? 'Na stole' : 'Čeká';
    });
  };
  root.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    const action = { type: button.dataset.action, jobId: button.dataset.jobId };
    const before = summarize(state);
    const previous = state;
    state = transition(state, action);
    render();
    const after = summarize(state);
    if (state === previous) return;
    q('[data-status]').textContent = action.type === 'reset'
      ? 'Pracovní den obnoven: 3 čekající zakázky a 4 desky ve skladu.'
      : action.type === 'undo'
        ? `${after.current.id}: dokončení vráceno, ${after.current.boards} ${after.current.boards === 1 ? 'deska vrácena' : 'desky vráceny'} do skladu. Zbývá ${after.remaining}.`
        : `${before.current.id} dokončena. Ve skladu ${after.stock} ks. ${after.current ? `Následuje ${after.current.id}: ${after.current.step.toLocaleLowerCase('cs')}.` : 'Dnešní seznam je hotový.'}`;
    if (action.type === 'done' && !after.current) undoButton.focus();
    if (action.type === 'undo' || action.type === 'reset') doneButton.focus();
  }));
  root.querySelectorAll('[data-js-action]').forEach(button => button.hidden = false);
  render();
}
