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

  it('sends an owner notification and a visitor confirmation through Resend', async () => {
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
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const call of calls) {
      expect(call.url).toBe('https://api.resend.com/emails');
      expect(call.init.method).toBe('POST');
      expect((call.init.headers as Record<string, string>).authorization).toBe('Bearer test_key');
    }

    const payloads = calls.map((call) => JSON.parse(call.init.body as string) as Record<string, unknown>);
    const notify = payloads.find((p) => String(p.subject).includes('Nová poptávka'));
    const confirm = payloads.find((p) => String(p.subject).includes('Děkujeme'));

    expect(notify).toMatchObject({
      to: 'siroky@radeq.cz',
      from: 'Radeq.cz poptávky <siroky@radeq.cz>',
      reply_to: 'siroky@radeq.cz',
    });
    expect(String(notify?.text)).toContain('Need fast lead routing.');

    expect(confirm).toBeDefined();
    expect(confirm).toMatchObject({
      to: 'siroky@radeq.cz',
      from: 'Radeq.cz <siroky@radeq.cz>',
    });
    expect(String(confirm?.text)).toContain('Jan Siroky');

    vi.unstubAllGlobals();
  });

  it('localizes the visitor confirmation to English for en locales', async () => {
    const calls: Array<{ init: RequestInit }> = [];
    const fetchMock = vi.fn(async (_url: unknown, init: RequestInit) => {
      calls.push({ init });
      return new Response(JSON.stringify({ id: 'email_123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { env } = createLeadEnv({ RESEND_API_KEY: 'test_key' });

    await onRequestPost({
      request: new Request('https://radeq.cz/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...completeLead, locale: 'en-US' }),
      }),
      env,
    });

    const payloads = calls.map((call) => JSON.parse(call.init.body as string) as Record<string, unknown>);
    const confirm = payloads.find((p) => String(p.subject).includes('Thanks for your inquiry'));
    expect(confirm).toBeDefined();
    expect(String(confirm?.text)).toContain('Hi Jan Siroky');

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

  it('rejects a submission without a valid Turnstile token when the secret is set', async () => {
    const { env } = createLeadEnv({ TURNSTILE_SECRET: 'test-secret' });

    const response = await onRequestPost({
      request: new Request('https://radeq.cz/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(completeLead),
      }),
      env,
    });

    const body = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(403);
    expect(body.ok).toBe(false);
  });

  it('accepts a submission with a valid Turnstile token', async () => {
    const fetchMock = vi.fn(
      async (_url: unknown) =>
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const { env } = createLeadEnv({ TURNSTILE_SECRET: 'test-secret' });

    const response = await onRequestPost({
      request: new Request('https://radeq.cz/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...completeLead, turnstileToken: 'valid-token' }),
      }),
      env,
    });

    const body = (await response.json()) as { ok: boolean };

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');

    vi.unstubAllGlobals();
  });

  it('rate-limits after 2 submissions from the same IP', async () => {
    const { env } = createLeadEnv();
    const submit = () =>
      onRequestPost({
        request: new Request('https://radeq.cz/api/leads', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7' },
          body: JSON.stringify(completeLead),
        }),
        env,
      });

    expect((await submit()).status).toBe(201);
    expect((await submit()).status).toBe(201);

    const third = await submit();
    const body = (await third.json()) as { ok: boolean };
    expect(third.status).toBe(429);
    expect(body.ok).toBe(false);
    expect(third.headers.get('retry-after')).toBeTruthy();
  });

  it('suppresses a second visitor confirmation to the same address within a day', async () => {
    const calls: Array<{ init: RequestInit }> = [];
    const fetchMock = vi.fn(async (_url: unknown, init: RequestInit) => {
      calls.push({ init });
      return new Response(JSON.stringify({ id: 'email_123' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { env } = createLeadEnv({ RESEND_API_KEY: 'test_key' });

    const submit = () =>
      onRequestPost({
        request: new Request('https://radeq.cz/api/leads', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(completeLead),
        }),
        env,
      });

    expect((await submit()).status).toBe(201);
    expect((await submit()).status).toBe(201);

    const subjects = calls.map((call) =>
      String((JSON.parse(call.init.body as string) as Record<string, unknown>).subject),
    );
    expect(subjects.filter((s) => s.includes('Nová poptávka'))).toHaveLength(2);
    expect(subjects.filter((s) => s.includes('Děkujeme'))).toHaveLength(1);

    vi.unstubAllGlobals();
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
  const kvStore = new Map<string, string>();
  const env = {
    LEADS_DB: {
      prepare: (query: string) => {
        calls.push({ query, values: [] });
        return statement;
      },
    },
    MEASURE_RATE_LIMIT: {
      get: async (key: string) => kvStore.get(key) ?? null,
      put: async (key: string, value: string) => {
        kvStore.set(key, value);
      },
    },
    ...extra,
  };

  return { env, calls };
}
