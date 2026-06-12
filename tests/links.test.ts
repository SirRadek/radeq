import { describe, expect, it } from 'vitest';
import { withBaseHref } from '../src/lib/links';

describe('site href helpers', () => {
  it('keeps hash links local to the current page', () => {
    expect(withBaseHref('#terminal', '/radeq')).toBe('#terminal');
  });

  it('prefixes root-relative links for GitHub Pages builds', () => {
    expect(withBaseHref('/ukazky/', '/radeq')).toBe('/radeq/ukazky/');
    expect(withBaseHref('/#pricing', '/radeq')).toBe('/radeq/#pricing');
  });

  it('leaves root-relative links unchanged on the production domain', () => {
    expect(withBaseHref('/kontakt/', '')).toBe('/kontakt/');
  });
});
