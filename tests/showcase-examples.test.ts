import { describe, expect, it } from 'vitest';
import { getShowcaseExample, showcaseExamples, showcaseHub } from '../src/data/showcaseExamples';

const expectedSlugs = ['automatizace', 'nabidka-eshop'];
const forbiddenClaimFragments = [
  'llm',
  'rag',
  'model api',
  'učí se z vašich dat',
  'analyzuje soukromé dokumenty',
  'garantuje',
  'checkout',
  'objednávka je závazná',
  'heslo',
  'api klíč',
  'rodné číslo',
  'platební karta',
];

describe('showcase examples', () => {
  it('defines the first Czech showcase wave', () => {
    expect(showcaseHub.slug).toBe('ukazky');
    expect(showcaseExamples.map((example) => example.slug)).toEqual(expectedSlugs);
    expect(getShowcaseExample('automatizace')?.slug).toBe('automatizace');
  });

  it('keeps each example SEO-readable and action-oriented', () => {
    for (const example of showcaseExamples) {
      expect(example.title.length).toBeGreaterThan(12);
      expect(example.description.length).toBeGreaterThan(60);
      expect(example.h1.length).toBeGreaterThan(12);
      expect(example.summary.length).toBeGreaterThan(80);
      expect(example.primaryCta.href).toBe('#terminal');
      expect(example.sections.length).toBeGreaterThanOrEqual(4);
      expect(example.safetyNotes.length).toBeGreaterThanOrEqual(3);
      expect(example.outOfScope.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('uses public-safe copy without fake client evidence or overclaims', () => {
    const publicText = JSON.stringify({ showcaseHub, showcaseExamples }).toLowerCase();

    for (const fragment of forbiddenClaimFragments) {
      expect(publicText).not.toContain(fragment.toLowerCase());
    }

    expect(publicText).toContain('statick');
    expect(publicText).toContain('bez klientských dat');
    expect(publicText).toContain('úspora času');
    expect(publicText).toContain('ochrana dat');
  });
});
