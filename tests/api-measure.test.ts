import { sqliteD1, closeSqliteDbs } from './helpers/sqlite-d1.mjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost } from '../functions/api/measure';

const validMeasureBody = {
  url: 'https://example.com/',
  locale: 'en',
};

describe('measure Pages Function Turnstile gate', () => {
  afterEach(() => {
    vi.unstubAllGlobals(); closeSqliteDbs();
  });

  it('keeps measurement inert when TURNSTILE_SECRET is absent', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(createPsiResponse()));
    vi.stubGlobal('fetch', fetchMock);

    const response = await onRequestPost({
      request: createMeasureRequest(validMeasureBody),
      env: { LEADS_DB: sqliteD1() },
    });
    const body = (await response.json()) as { status: string };

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('pagespeedonline');
  });

  it('rejects missing verification before rate limiting when TURNSTILE_SECRET is present', async () => {
    const fetchMock = vi.fn();
    const prepare = vi.fn(() => { throw Error('quota accessed before verification'); });
    vi.stubGlobal('fetch', fetchMock);

    const response = await onRequestPost({
      request: createMeasureRequest(validMeasureBody),
      env: {
        TURNSTILE_SECRET: 'secret',
        LEADS_DB: { prepare },
      },
    });
    const body = (await response.json()) as { status: string };

    expect(response.status).toBe(403);
    expect(body.status).toBe('verification_failed');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(prepare).not.toHaveBeenCalled();
  });

  it('verifies the Turnstile token before measuring when TURNSTILE_SECRET is present', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ success: true }))
      .mockResolvedValueOnce(jsonResponse(createPsiResponse()));
    vi.stubGlobal('fetch', fetchMock);

    const response = await onRequestPost({
      request: createMeasureRequest(
        {
          ...validMeasureBody,
          turnstileToken: 'token_123',
        },
        {
          'cf-connecting-ip': '203.0.113.10',
        },
      ),
      env: {
        TURNSTILE_SECRET: 'secret', LEADS_DB: sqliteD1(),
      },
    });
    const body = (await response.json()) as { status: string };
    const siteverifyBody = fetchMock.mock.calls[0]?.[1]?.body;

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(siteverifyBody?.toString()).toContain('secret=secret');
    expect(siteverifyBody?.toString()).toContain('response=token_123');
    expect(siteverifyBody?.toString()).toContain('remoteip=203.0.113.10');
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('pagespeedonline');
  });
});

function createMeasureRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request('https://radeq.cz/api/measure', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });
}

function createPsiResponse() {
  return {
    loadingExperience: {
      overall_category: 'FAST',
    },
    lighthouseResult: {
      categories: {
        performance: {
          score: 0.92,
        },
      },
      audits: {
        viewport: { score: 1 },
        'document-title': { score: 1 },
        'meta-description': { score: 1 },
        'is-crawlable': { score: 1 },
        'image-alt': { score: 1 },
        'is-on-https': { score: 1 },
        'redirects-http': { score: 1 },
      },
    },
  };
}
