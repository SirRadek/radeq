import { describe, expect, it, vi } from 'vitest';
import {
  getCfConnectingIp,
  getClientIp,
  readTurnstileToken,
  verifyTurnstile,
} from '../src/lib/requestGuards';

describe('readTurnstileToken', () => {
  it('reads turnstileToken, falls back to cf-turnstile-response, else empty', () => {
    expect(readTurnstileToken({ turnstileToken: 'a' })).toBe('a');
    expect(readTurnstileToken({ 'cf-turnstile-response': 'b' })).toBe('b');
    expect(readTurnstileToken({ turnstileToken: '', 'cf-turnstile-response': 'b' })).toBe('b');
    expect(readTurnstileToken({})).toBe('');
    expect(readTurnstileToken(null)).toBe('');
    expect(readTurnstileToken('x')).toBe('');
  });
});

describe('getClientIp', () => {
  it('prefers cf-connecting-ip, falls back to the first x-forwarded-for hop', () => {
    expect(getClientIp(new Request('https://x', { headers: { 'cf-connecting-ip': '1.2.3.4' } }))).toBe('1.2.3.4');
    expect(getClientIp(new Request('https://x', { headers: { 'x-forwarded-for': '5.6.7.8, 9.9.9.9' } }))).toBe(
      '5.6.7.8',
    );
    expect(getClientIp(new Request('https://x'))).toBe('');
  });
});

describe('getCfConnectingIp', () => {
  it('returns only the Cloudflare edge header and ignores the spoofable x-forwarded-for', () => {
    expect(getCfConnectingIp(new Request('https://x', { headers: { 'cf-connecting-ip': '1.2.3.4' } }))).toBe('1.2.3.4');
    expect(getCfConnectingIp(new Request('https://x', { headers: { 'x-forwarded-for': '9.9.9.9' } }))).toBe('');
    expect(getCfConnectingIp(new Request('https://x'))).toBe('');
  });
});

describe('verifyTurnstile', () => {
  it('returns false for an empty token without calling the network', async () => {
    const fetchMock = vi.fn();
    expect(await verifyTurnstile('secret', '', '', fetchMock as unknown as typeof fetch)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns true when siteverify reports success', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 }));
    expect(await verifyTurnstile('secret', 'tok', '1.2.3.4', fetchMock as unknown as typeof fetch)).toBe(true);
  });

  it('returns false when siteverify reports failure', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: false }), { status: 200 }));
    expect(await verifyTurnstile('secret', 'tok', '', fetchMock as unknown as typeof fetch)).toBe(false);
  });

  it('returns false on a non-ok response', async () => {
    const fetchMock = vi.fn(async () => new Response('nope', { status: 500 }));
    expect(await verifyTurnstile('secret', 'tok', '', fetchMock as unknown as typeof fetch)).toBe(false);
  });

  it('returns false when the request throws', async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error('network');
    });
    expect(await verifyTurnstile('secret', 'tok', '', fetchMock as unknown as typeof fetch)).toBe(false);
  });
});

