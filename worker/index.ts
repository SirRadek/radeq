import { onRequestOptions, onRequestPost } from '../functions/api/leads';

interface Env {
  ASSETS: AssetsFetcher;
  LEADS_DB?: D1Database;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/leads') {
      if (request.method === 'POST') {
        return onRequestPost({ request, env });
      }

      if (request.method === 'OPTIONS') {
        return onRequestOptions();
      }

      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          allow: 'POST, OPTIONS',
          'cache-control': 'no-store',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
