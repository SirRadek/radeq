import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const headers = readFileSync('public/_headers', 'utf8');

describe('Cloudflare static headers', () => {
  it('caches hashed Astro assets for one year', () => {
    expect(headers).toContain('/_astro/*');
    expect(headers).toContain('Cache-Control: public, max-age=31536000, immutable');
  });

  it('caches static model and public reference assets for one year', () => {
    expect(headers).toContain('/models/*');
    expect(headers).toContain('/reference/*');
  });
});
