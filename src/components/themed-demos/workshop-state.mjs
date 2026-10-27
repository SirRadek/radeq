// A fixed fictional day. The completion ledger is the single source for stock.
export const JOBS = Object.freeze([
  Object.freeze({ id: 'D-024', title: 'DUBOVÁ POLICE', step: 'ZABROUSIT HRANY', detail: 'Zarovnat hrany a dokončit povrch.', boards: 1 }),
  Object.freeze({ id: 'D-025', title: 'DVOJICE POLIC', step: 'NAŘEZAT DÍLCE', detail: 'Připravit dva dílce podle modelového rozměru.', boards: 2 }),
  Object.freeze({ id: 'D-026', title: 'MALÝ ODKLÁDACÍ STOLEK', step: 'PŘIPRAVIT DESKU', detail: 'Srovnat desku před následnou montáží.', boards: 1 }),
]);
export const INITIAL_STOCK = 4;
export const initialState = () => ({ completed: [] });
export function summarize(state) {
  const done = state.completed.length;
  const used = JOBS.filter(job => state.completed.includes(job.id)).reduce((sum, job) => sum + job.boards, 0);
  return { done, remaining: JOBS.length - done, used, stock: Math.max(0, INITIAL_STOCK - used), current: JOBS[done] ?? null, next: JOBS[done + 1] ?? null };
}
export function transition(state, action) {
  switch (action?.type) {
    case 'done': {
      const { current, stock } = summarize(state);
      // Bind each click to its job: duplicate/stale events cannot skip the queue.
      if (!current || action.jobId !== current.id || stock < current.boards) return state;
      return { completed: [...state.completed, current.id] };
    }
    case 'undo': return state.completed.length ? { completed: state.completed.slice(0, -1) } : state;
    case 'reset': return initialState();
    default: return state;
  }
}
