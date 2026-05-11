import { describe, expect, it } from 'vitest';
import { onRequestPost } from '../functions/api/leads';

const completeLead = {
  name: 'Jan Siroky',
  email: 'siroky@radeq.cz',
  company: 'Radeq.cz',
  project_type: 'Poptávková stránka',
  audience: 'Micro-SaaS founders',
  deadline: 'Q3',
  current_url: 'https://example.com',
  budget_range: '50k-100k CZK',
  message: 'Need fast lead routing.',
  source_path: '/',
  referrer: '',
  locale: 'cs-CZ',
  honeypot: '',
};

describe('lead Pages Function', () => {
  it('stores a valid lead through the D1 binding', async () => {
    const calls: Array<{ query: string; values: unknown[] }> = [];
    const statement = {
      bind: (...values: unknown[]) => {
        calls.push({ query: '', values });
        return statement;
      },
      run: async () => ({ success: true }),
    };
    const env = {
      LEADS_DB: {
        prepare: (query: string) => {
          calls.push({ query, values: [] });
          return statement;
        },
      },
    };

    const response = await onRequestPost({
      request: new Request('https://radeq.cz/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(completeLead),
      }),
      env,
    });

    const body = (await response.json()) as { ok: boolean; leadId?: string };

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.leadId).toMatch(/^lead_/);
    expect(calls[0]?.query).toContain('INSERT INTO leads');
    expect(calls[1]?.values).toContain('siroky@radeq.cz');
  });

  it('returns a setup error when D1 is not bound', async () => {
    const response = await onRequestPost({
      request: new Request('https://radeq.cz/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(completeLead),
      }),
      env: {},
    });

    const body = (await response.json()) as { ok: boolean; error: string };

    expect(response.status).toBe(503);
    expect(body.ok).toBe(false);
    expect(body.error).toContain('LEADS_DB');
  });
});
