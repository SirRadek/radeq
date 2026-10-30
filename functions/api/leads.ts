import { reserveQuota, reserveConfirmation, type QuotaDatabase } from '../../release/atomic-quotas.js';
import { createLeadId, validateLeadSubmission } from '../../src/lib/leads';
import {
  sendLeadConfirmationEmail,
  sendLeadNotificationEmail,
} from '../../src/lib/leadNotificationEmail';
import {
  getCfConnectingIp,
  readTurnstileToken,
  verifyTurnstile,
} from '../../src/lib/requestGuards';

const LEAD_RATE_LIMIT_MAX = 2;
const LEAD_RATE_LIMIT_WINDOW_SECONDS = 24 * 60 * 60;

interface Env {
  LEADS_DB?: QuotaDatabase;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  RATE_LIMIT_WHITELIST?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;

  if (!env.LEADS_DB) {
    return jsonResponse(
      {
        ok: false,
        error: 'Lead storage is not configured. Bind a Cloudflare D1 database as LEADS_DB.',
      },
      503,
    );
  }

  if (!isJsonRequest(request)) {
    return jsonResponse({ ok: false, error: 'Expected application/json request body.' }, 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Request body is not valid JSON.' }, 400);
  }

  const result = validateLeadSubmission(body);
  if (!result.ok) {
    return jsonResponse({ ok: false, error: 'Lead validation failed.', details: result.errors }, 400);
  }

  const lead = result.data;
  const clientIp = getCfConnectingIp(request);
  const isEnglish = lead.locale.toLowerCase().startsWith('en');
  const rateLimitExempt =
    clientIp !== '' &&
    (env.RATE_LIMIT_WHITELIST ?? '')
      .split(',')
      .map((entry) => entry.trim())
      .includes(clientIp);

  // Bot gate: require a valid Turnstile token whenever the secret is configured
  // (production). Skipped in dev/tests where no secret is bound.
  const turnstileSecret = env.TURNSTILE_SECRET?.trim();
  if (turnstileSecret) {
    const verified = await verifyTurnstile(turnstileSecret, readTurnstileToken(body), clientIp);
    if (!verified) {
      return jsonResponse(
        {
          ok: false,
          error: isEnglish
            ? 'Verification did not pass. Please confirm you are not a robot and submit again.'
            : 'Ověření neproběhlo. Potvrďte prosím, že nejste robot, a odešlete znovu.',
        },
        403,
      );
    }
  }

  // Volume cap: max LEAD_RATE_LIMIT_MAX submissions per client IP per day (whitelisted IPs exempt).
  const rateLimit = rateLimitExempt
    ? { status: 'allowed' as const }
    : await reserveQuota(env.LEADS_DB, {
        scope: 'lead', subject: clientIp || 'unknown',
        max: LEAD_RATE_LIMIT_MAX,
        windowSeconds: LEAD_RATE_LIMIT_WINDOW_SECONDS,
      });
  if (rateLimit.status === 'unavailable') return jsonResponse({ ok: false, error: isEnglish ? 'The form is temporarily unavailable. Please try later or write by email.' : 'Formulář je dočasně nedostupný. Zkuste to později nebo napište e-mailem.' }, 503);
  if (rateLimit.status === 'limited') {
    return jsonResponse(
      {
        ok: false,
        error: isEnglish
          ? 'Too many requests from this connection. Please try again later or write by email.'
          : 'Z tohoto připojení přišlo příliš mnoho poptávek. Zkuste to prosím později nebo napište e-mailem.',
      },
      429,
      rateLimit.retryAfterSeconds,
    );
  }

  const id = createLeadId();
  const createdAt = new Date().toISOString();

  try {
    const stored = await env.LEADS_DB.prepare(
      `INSERT INTO leads (
        id,
        created_at,
        status,
        name,
        email,
        company,
        project_type,
        audience,
        deadline,
        current_url,
        budget_range,
        message,
        source_path,
        referrer,
        locale
      ) VALUES (?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        createdAt,
        lead.name,
        lead.email,
        lead.company,
        lead.project_type,
        lead.audience,
        lead.deadline,
        lead.current_url,
        lead.budget_range,
        lead.message,
        lead.source_path,
        lead.referrer,
        lead.locale,
      )
      .run();

    if (!stored.success) {
      return jsonResponse({ ok: false, error: 'Lead could not be stored.' }, 500);
    }
  } catch {
    return jsonResponse({ ok: false, error: 'Lead could not be stored.' }, 500);
  }

  // The confirmation goes to a visitor-supplied address, so bound the abuse surface:
  // at most one confirmation per recipient per day, under a global daily ceiling.
  const confirmationAllowed = Boolean(env.RESEND_API_KEY) && (await reserveConfirmation(env.LEADS_DB, lead.email)).status === 'allowed';

  const [notifyResult, confirmResult] = await Promise.allSettled([
    sendLeadNotificationEmail(env.RESEND_API_KEY, lead, id, createdAt),
    confirmationAllowed
      ? sendLeadConfirmationEmail(env.RESEND_API_KEY, lead)
      : Promise.resolve('skipped' as const),
  ]);

  if (notifyResult.status === 'rejected') {
    console.error('Lead notification email failed', {
      leadId: id,
      code: getEmailErrorCode(notifyResult.reason),
      message: notifyResult.reason instanceof Error ? notifyResult.reason.message : 'Unknown email error',
    });
  }

  if (confirmResult.status === 'rejected') {
    console.error('Lead confirmation email failed', {
      leadId: id,
      code: getEmailErrorCode(confirmResult.reason),
      message: confirmResult.reason instanceof Error ? confirmResult.reason.message : 'Unknown email error',
    });
  }

  return jsonResponse({ ok: true, leadId: id }, 201);
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: responseHeaders(),
  });
}

function isJsonRequest(request: Request): boolean {
  return request.headers.get('content-type')?.toLowerCase().includes('application/json') ?? false;
}

function jsonResponse(body: unknown, status = 200, retryAfterSeconds?: number): Response {
  const headers = new Headers(responseHeaders());
  if (retryAfterSeconds) {
    headers.set('retry-after', String(retryAfterSeconds));
  }

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}

function responseHeaders(): HeadersInit {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  };
}

function getEmailErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }

  return 'unknown';
}
