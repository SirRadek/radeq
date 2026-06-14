import { createLeadId, validateLeadSubmission } from '../../src/lib/leads';
import { sendLeadNotificationEmail, type SendEmailBinding } from '../../src/lib/leadNotificationEmail';

interface Env {
  LEADS_DB?: D1Database;
  EMAIL?: SendEmailBinding;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<{ success: boolean; error?: string }>;
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

  try {
    await sendLeadNotificationEmail(env.EMAIL, lead, id, createdAt);
  } catch (error) {
    console.error('Lead notification email failed', {
      leadId: id,
      code: getEmailErrorCode(error),
      message: error instanceof Error ? error.message : 'Unknown email error',
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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(),
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
