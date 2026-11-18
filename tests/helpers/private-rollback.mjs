import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const localSnapshot = new URL('../../../docs/deployments/2026-10-28-cloudflare/worker-before/modules/index.js', import.meta.url);
const suppliedSnapshot = process.env.RADEQ_ROLLBACK_WORKER;

// Public checkouts omit this private executable. An explicitly supplied path must pass the checks.
export const rollbackWorker = suppliedSnapshot
  ? resolve(suppliedSnapshot)
  : existsSync(localSnapshot) ? localSnapshot : undefined;
