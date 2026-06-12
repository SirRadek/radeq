import { describe, expect, it } from 'vitest';
import { siteContent, supportedLocales, type Locale, type SiteContent } from '../src/data/siteContent';

describe('localized site content', () => {
  it('defines Czech and English content contracts', () => {
    expect(supportedLocales).toEqual(['cs', 'en']);

    for (const locale of supportedLocales) {
      const content = siteContent[locale as Locale];

      expect(content.layout.lang).toBe(locale);
      expect(content.hero.actions).toHaveLength(2);
      expect(content.audience.items).toHaveLength(4);
      expect(content.demos.items).toHaveLength(6);
      expect(content.handoff.items.length).toBeGreaterThan(3);
      expect(content.systems.items).toHaveLength(8);
      expect(content.systems.secondaryTitle).toBeTruthy();
      expect(content.systems.items.some((item) => 'demoModule' in item)).toBe(false);
      expect(content.pricing.items).toHaveLength(4);
      expect(content.pricing.items.some((item) => 'featured' in item && item.featured)).toBe(true);
      expect(content.terminal.examples).toContain('submit');
    }
  });

  it('keeps the Czech route Czech and the English route English', () => {
    expect(siteContent.cs.hero.title).toContain('malé firmy');
    expect(siteContent.cs.hero.proof.map((item) => item.label)).toEqual(['Kompletně', 'Srozumitelně', 'Předání']);
    expect(siteContent.cs.header.cta).toBe('Probrat web');
    expect(siteContent.cs.header.navItems).toHaveLength(5);
    expect(siteContent.cs.header.navItems.some((item) => item.href === '/ukazky/' && item.label === 'Ukázky')).toBe(true);
    expect(siteContent.cs.terminal.projectOptions).toEqual(
      expect.arrayContaining([
        'Jednoduchý chatbot / průvodce',
        'Automatizace poptávek',
        'Nabídka / e-shop úprava',
      ]),
    );
    expect(siteContent.cs.pricing.items[0].name).toBe('Audit webu s plánem');
    expect(siteContent.en.hero.title).toContain('small businesses');
    expect(siteContent.en.header.cta).toBe('Discuss website');
    expect(siteContent.en.header.navItems).toHaveLength(4);
    expect(siteContent.en.pricing.items[0].name).toBe('Website audit with a plan');
  });
  it('surfaces sanitized project proof before generic service offers', () => {
    for (const locale of supportedLocales) {
      const proofCards = siteContent[locale as Locale].demos.items.slice(0, 2);

      expect(proofCards.map((item) => item.metric)).toEqual(['PROOF 01', 'PROOF 02']);
    }

    expect(siteContent.cs.demos.items[0].events).toContain('Staticky audit');
    expect(siteContent.cs.demos.items[1].events).toContain('Mapa workflow');
    expect(siteContent.en.demos.items[0].events).toContain('Static audit');
    expect(siteContent.en.demos.items[1].events).toContain('Workflow map');
  });

  it('keeps private repository identifiers out of public demo content', () => {
    const forbiddenPublicStrings = [
      'SirRadek',
      '.codex-run',
      'seo-fix-pack',
      'archviz-workbench',
      'webhook-gateway',
      'scrapeflow',
      'autopilot-orchestration',
      'radeq-website',
    ];

    const publicDemoTextParts: string[] = [];

    for (const locale of supportedLocales) {
      const items = siteContent[locale as Locale].demos.items as SiteContent['demos']['items'];

      for (const item of items) {
        publicDemoTextParts.push(item.name, item.metric, item.summary, ...item.events);
      }
    }

    const publicDemoText = publicDemoTextParts.join('\n').toLowerCase();

    for (const forbidden of forbiddenPublicStrings) {
      expect(publicDemoText).not.toContain(forbidden.toLowerCase());
    }
  });
});
