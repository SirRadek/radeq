import { describe, expect, it } from 'vitest';
import { siteContent, supportedLocales, type Locale, type SiteContent } from '../src/data/siteContent';

describe('localized site content', () => {
  it('defines Czech and English content contracts', () => {
    expect(supportedLocales).toEqual(['cs', 'en']);

    for (const locale of supportedLocales) {
      const content = siteContent[locale as Locale];

      expect(content.layout.lang).toBe(locale);
      expect(content.hero.actions).toHaveLength(0);
      expect(content.audience.items).toHaveLength(4);
      expect(content.demos.items).toHaveLength(6);
      expect(content.handoff.items.length).toBeGreaterThan(3);
      expect(content.systems.items).toHaveLength(5);
      expect(content.systems.items.every((item) => item.outputs.length >= 5)).toBe(true);
      expect(content.pricing.process.steps).toHaveLength(3);
      expect(content.pricing.items).toHaveLength(5);
      expect(content.pricing.items.some((item) => 'featured' in item && item.featured)).toBe(true);
      expect(content.terminal.examples).toContain('submit');
    }
  });

  it('keeps the Czech homepage focused on practical IT help', () => {
    expect(siteContent.cs.hero.title).toBe('Praktická IT pomoc pro lidi a firmy, které chtějí méně ruční práce.');
    expect(siteContent.cs.hero.actions).toEqual([]);
    expect(siteContent.cs.header.navItems.map((item) => item.label)).toEqual([
      'Úvod',
      'Co řeším',
      'Služby',
      'Jak pracuji',
      'Ceník',
      'Ukázky',
    ]);
    expect(siteContent.cs.terminal.projectOptions).toEqual([
      'Automatizace rutinní práce',
      'AI pomocník nebo chatbot',
      'Databáze, evidence a přehled',
      'Web nebo formulářová cesta',
      'Audit webu nebo procesu s plánem',
      'Rychlá oprava webu nebo nástroje',
      'Nejsem si jistý, potřebuji poradit',
    ]);
  });

  it('keeps the Czech route Czech and the English route English', () => {
    expect(siteContent.cs.hero.title).toContain('méně ruční práce');
    expect(siteContent.cs.hero.proof.map((item) => item.label)).toEqual(['Automatizace', 'Data a AI', 'Weby']);
    expect(siteContent.cs.header.cta).toBe('Popsat situaci');
    expect(siteContent.cs.header.navItems).toHaveLength(6);
    expect(siteContent.cs.header.navItems.some((item) => item.href === '#demos' && item.label === 'Ukázky')).toBe(true);
    expect(siteContent.cs.header.navItems.map((item) => item.href)).not.toContain('#terminal');
    expect(siteContent.cs.terminal.projectOptions).toEqual(
      [
        'Automatizace rutinní práce',
        'AI pomocník nebo chatbot',
        'Databáze, evidence a přehled',
        'Web nebo formulářová cesta',
        'Audit webu nebo procesu s plánem',
        'Rychlá oprava webu nebo nástroje',
        'Nejsem si jistý, potřebuji poradit',
      ],
    );
    expect(siteContent.cs.pricing.items[0].name).toBe('Audit webu nebo procesu s plánem');
    expect(siteContent.en.hero.title).toContain('less manual work');
    expect(siteContent.en.header.cta).toBe('Describe situation');
    expect(siteContent.en.header.navItems).toHaveLength(6);
    expect(siteContent.en.pricing.items[0].name).toBe('Website or process audit with a plan');
  });

  it('keeps homepage copy free of public agent hype and fake guarantees', () => {
    const homepageText = JSON.stringify(siteContent.cs).toLowerCase();

    for (const forbidden of ['agentní', 'autonomní', 'pagespeed 95', 'garantujeme 1,5 s']) {
      expect(homepageText).not.toContain(forbidden.toLowerCase());
    }
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
