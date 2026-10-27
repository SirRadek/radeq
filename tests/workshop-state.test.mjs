import { describe, it, expect } from 'vitest';
import { initialState, transition, summarize } from '../src/components/themed-demos/workshop-state.mjs';

const complete = (state, jobId) => transition(state, { type: 'done', jobId });
describe('modelový pracovní den — zakázky a materiál', () => {
  it('starts with three jobs, four boards and a clear current and next job', () => {
    const s = initialState();
    expect(summarize(s)).toMatchObject({ done: 0, remaining: 3, stock: 4, used: 0, current: { id: 'D-024' }, next: { id: 'D-025' } });
  });
  it('completion is immutable and repeated same-job events cannot complete the next job', () => {
    const s = initialState();
    Object.freeze(s.completed); Object.freeze(s);
    const done = complete(s, 'D-024');
    expect(done.completed).toEqual(['D-024']);
    expect(s.completed).toEqual([]);
    expect(summarize(done)).toMatchObject({ done: 1, remaining: 2, stock: 3, used: 1, current: { id: 'D-025' } });
    expect(complete(done, 'D-024')).toBe(done);
  });
  it('keeps job-specific consumption consistent through the whole day and clamps at zero', () => {
    let s = initialState();
    s = complete(s, 'D-024'); s = complete(s, 'D-025');
    expect(summarize(s)).toMatchObject({ done: 2, remaining: 1, stock: 1, used: 3, current: { id: 'D-026' }, next: null });
    s = complete(s, 'D-026');
    expect(summarize(s)).toMatchObject({ done: 3, remaining: 0, stock: 0, used: 4, current: null, next: null });
    for (let i = 0; i < 6; i++) expect(complete(s, 'D-026')).toBe(s);
    expect(summarize(s).stock).toBe(0);
  });
  it('undo restores the latest job and its exact material; repeated undo stops at the initial state', () => {
    const all = ['D-024', 'D-025', 'D-026'].reduce(complete, initialState());
    let s = transition(all, { type: 'undo' });
    expect(summarize(s)).toMatchObject({ done: 2, stock: 1, current: { id: 'D-026' } });
    expect(all.completed).toHaveLength(3);
    s = transition(s, { type: 'undo' });
    expect(summarize(s)).toMatchObject({ done: 1, stock: 3, current: { id: 'D-025' } });
    s = transition(s, { type: 'undo' });
    expect(s).toEqual(initialState());
    expect(transition(s, { type: 'undo' })).toBe(s);
  });
  it('reset restores all counts and stock and returns independent clean state', () => {
    const done = complete(initialState(), 'D-024');
    const reset = transition(done, { type: 'reset' });
    expect(reset).toEqual(initialState());
    expect(summarize(reset)).toMatchObject({ done: 0, stock: 4, used: 0 });
    expect(reset.completed).not.toBe(initialState().completed);
    expect(done.completed).toEqual(['D-024']);
  });
  it('invalid, missing and out-of-order actions do not mutate the day', () => {
    const s = initialState();
    for (const action of [null, undefined, {}, { type: 'invalid' }, { type: 'done' }, { type: 'done', jobId: 'D-025' }, { type: 'done', jobId: '<script>' }, { type: 'done', jobId: 24 }, { type: 'consume' }]) {
      expect(transition(s, action)).toBe(s);
    }
  });
});
