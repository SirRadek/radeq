import { onRequestOptions as onLeadOptions, onRequestPost as onLeadPost } from '../functions/api/leads';
import { onRequestOptions as onMeasureOptions, onRequestPost as onMeasurePost } from '../functions/api/measure';

interface Env {
  ASSETS: AssetsFetcher;
  LEADS_DB?: D1Database;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  PSI_API_KEY?: string;
  MEASURE_RATE_LIMIT?: KVNamespace;
  RATE_LIMIT_WHITELIST?: string;
}

interface AssetsFetcher {
  fetch(request: Request): Promise<Response>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<{ success: boolean; error?: string }>;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/leads') {
      if (request.method === 'POST') {
        return onLeadPost({ request, env });
      }

      if (request.method === 'OPTIONS') {
        return onLeadOptions();
      }

      return methodNotAllowed();
    }

    if (url.pathname === '/api/measure') {
      if (request.method === 'POST') {
        return onMeasurePost({ request, env });
      }

      if (request.method === 'OPTIONS') {
        return onMeasureOptions();
      }

      return methodNotAllowed();
    }

    // RFC 9116 vulnerability-disclosure contact. Served from the Worker (not an
    // Astro/public route) because Vite can drop `.well-known` dot-folders at build.
    if (url.pathname === '/.well-known/security.txt') {
      return new Response(
        [
          'Contact: mailto:siroky@radeq.cz',
          'Expires: 2027-07-01T00:00:00Z',
          'Preferred-Languages: cs, en',
          'Canonical: https://radeq.cz/.well-known/security.txt',
          '',
        ].join('\n'),
        {
          headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'public, max-age=86400',
          },
        },
      );
    }

    return env.ASSETS.fetch(request);
  },
};

function methodNotAllowed(): Response {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: {
      allow: 'POST, OPTIONS',
      'cache-control': 'no-store',
    },
  });
}
