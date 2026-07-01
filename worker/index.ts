import { onRequestOptions as onLeadOptions, onRequestPost as onLeadPost } from '../functions/api/leads';
import { onRequestOptions as onMeasureOptions, onRequestPost as onMeasurePost } from '../functions/api/measure';

interface Env {
  ASSETS: AssetsFetcher;
  LEADS_DB?: D1Database;
  RESEND_API_KEY?: string;
  PSI_API_KEY?: string;
  MEASURE_RATE_LIMIT?: KVNamespace;
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
