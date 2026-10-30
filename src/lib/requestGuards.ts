// Shared request-guard helpers for the public POST endpoints: Cloudflare
// Turnstile verification. Persistent quotas live in release/atomic-quotas.js.

interface TurnstileVerifyResponse {
  success?: boolean;
  'error-codes'?: string[];
}

const TURNSTILE_SITEVERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip')?.trim();
  if (cfIp) return cfIp;
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
}

// Trust ONLY the Cloudflare edge header for security keys (rate-limit buckets).
// Never derive an abuse key from the client-supplied x-forwarded-for, which is spoofable.
export function getCfConnectingIp(request: Request): string {
  return request.headers.get('cf-connecting-ip')?.trim() ?? '';
}

export function readTurnstileToken(input: unknown): string {
  if (typeof input !== 'object' || input === null) return '';
  const record = input as Record<string, unknown>;
  const primary = record.turnstileToken;
  if (typeof primary === 'string' && primary) return primary;
  const fallback = record['cf-turnstile-response'];
  return typeof fallback === 'string' ? fallback : '';
}

export async function verifyTurnstile(
  secret: string,
  token: string,
  remoteip: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const trimmedToken = token.trim();
  if (!trimmedToken || trimmedToken.length > 2048) return false;

  const payload = new URLSearchParams({ secret, response: trimmedToken });
  if (remoteip) payload.set('remoteip', remoteip);

  try {
    const response = await fetchImpl(TURNSTILE_SITEVERIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: payload,
    });

    if (!response.ok) return false;

    const body = (await response.json()) as TurnstileVerifyResponse;
    return body.success === true;
  } catch {
    return false;
  }
}

