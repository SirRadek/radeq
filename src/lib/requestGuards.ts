// Shared request-guard helpers for the public POST endpoints: Cloudflare
// Turnstile verification and a per-IP KV rate limit (with an isolate-local
// memory fallback for local dev where no KV is bound).

export interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface RateLimitOptions {
  max: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

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

const memoryRateLimit = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  kv: KVNamespaceLike | undefined,
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  if (kv) return checkKvRateLimit(kv, key, options);
  return checkMemoryRateLimit(key, options);
}

async function checkKvRateLimit(
  kv: KVNamespaceLike,
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  let current: { count: number; resetAt: number };
  try {
    current = parseRateLimitEntry(await kv.get(key), now, windowMs);
  } catch {
    // KV read failed — fail open. Never drop a real lead because the limiter is down.
    return { allowed: true };
  }

  if (current.count >= options.max) {
    return { allowed: false, retryAfterSeconds: secondsUntil(current.resetAt, now) };
  }

  try {
    await kv.put(
      key,
      JSON.stringify({ count: current.count + 1, resetAt: current.resetAt }),
      { expirationTtl: options.windowSeconds + 60 },
    );
  } catch {
    // KV write failed — allow this request (fail open).
  }

  return { allowed: true };
}

function checkMemoryRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  pruneMemoryRateLimit(now);

  const current = memoryRateLimit.get(key);
  if (!current || current.resetAt <= now) {
    memoryRateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= options.max) {
    return { allowed: false, retryAfterSeconds: secondsUntil(current.resetAt, now) };
  }

  current.count += 1;
  return { allowed: true };
}

function parseRateLimitEntry(
  raw: string | null,
  now: number,
  windowMs: number,
): { count: number; resetAt: number } {
  if (!raw) return { count: 0, resetAt: now + windowMs };

  try {
    const parsed = JSON.parse(raw) as { count?: unknown; resetAt?: unknown };
    const count = typeof parsed.count === 'number' && Number.isFinite(parsed.count) ? parsed.count : 0;
    const resetAt =
      typeof parsed.resetAt === 'number' && parsed.resetAt > now ? parsed.resetAt : now + windowMs;
    return { count, resetAt };
  } catch {
    return { count: 0, resetAt: now + windowMs };
  }
}

function pruneMemoryRateLimit(now: number): void {
  if (memoryRateLimit.size < 1000) return;
  for (const [key, entry] of memoryRateLimit) {
    if (entry.resetAt <= now) memoryRateLimit.delete(key);
  }
}

function secondsUntil(resetAt: number, now: number): number {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}
