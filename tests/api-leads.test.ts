import { describe, expect, it, vi } from 'vitest';
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
    const { env, calls } = createLeadEnv();

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

  it('sends a lead notification email through Resend after storage succeeds', async () => {
    const calls: Array<{ url: unknown; init: RequestInit }> = [];
    const fetchMock = vi.fn(async (url: unknown, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: 'email_123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { env } = createLeadEnv({ RESEND_API_KEY: 'test_key' });

    const response = await onRequestPost({
      request: new Request('https://radeq.cz/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(completeLead),
      }),
      env,
    });

    expect(response.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(calls[0]?.url).toBe('https://api.resend.com/emails');
    expect(calls[0]?.init.method).toBe('POST');
    const headers = calls[0]?.init.headers as Record<string, string>;
    expect(headers.authorization).toBe('Bearer test_key');
    const payload = JSON.parse(calls[0]?.init.body as string) as Record<string, unknown>;
    expect(payload).toMatchObject({
      to: 'siroky@radeq.cz',
      from: 'Radeq.cz poptávky <siroky@radeq.cz>',
      reply_to: 'siroky@radeq.cz',
    });
    expect(payload.subject).toContain('Nová poptávka');
    expect(payload.text).toContain('Need fast lead routing.');

    vi.unstubAllGlobals();
  });

  it('keeps the stored lead response when email notification fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn(async () => {
      throw new Error('email service unavailable');
    });
    vi.stubGlobal('fetch', fetchMock);
    const { env } = createLeadEnv({ RESEND_API_KEY: 'test_key' });

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
    expect(consoleError).toHaveBeenCalledWith('Lead notification email failed', {
      code: 'unknown',
      leadId: expect.stringMatching(/^lead_/),
      message: 'email service unavailable',
    });

    consoleError.mockRestore();
    vi.unstubAllGlobals();
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

function createLeadEnv(extra: Record<string, unknown> = {}) {
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
    ...extra,
  };

  return { env, calls };
}
