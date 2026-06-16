import { describe, expect, it } from 'vitest';
import { siteContent, supportedLocales, type Locale, type SiteContent } from '../src/data/siteContent';

describe('localized site content', () => {
  it('defines Czech and English content contracts', () => {
    expect(supportedLocales).toEqual(['cs', 'en']);

    for (const locale of supportedLocales) {
      const content = siteContent[locale as Locale];

      expect(content.layout.lang).toBe(locale);
      expect(content.hero.actions).toHaveLength(2);
      expect(content.audience.items).toHaveLength(7);
      expect(content.demos.items).toHaveLength(0);
      expect(content.handoff.items.length).toBeGreaterThan(3);
      expect(content.systems.items).toHaveLength(5);
      expect(content.systems.items.every((item) => item.outputs.length >= 4)).toBe(true);
      expect(content.pricing.process.steps).toHaveLength(3);
      expect(content.pricing.items).toHaveLength(3);
      expect(content.pricing.items.some((item) => 'featured' in item && item.featured)).toBe(true);
      expect(content.terminal.examples).toContain('submit');
    }
  });

  it('keeps the Czech homepage focused on practical IT help', () => {
    expect(siteContent.cs.hero.title).toBe('Weby, formuláře a automatizace pro méně ruční práce.');
    expect(siteContent.cs.hero.actions.map((action) => action.label)).toEqual([
      'Chci zmapovat problém',
      'Co umím zjednodušit',
    ]);
    expect(siteContent.cs.header.navItems.map((item) => item.label)).toEqual([
      'Co řeším',
      'Služby',
      'Jak pracuji',
      'Ceny',
      'Kontakt',
    ]);
    expect(siteContent.cs.terminal.projectOptions).toEqual([
      'Web',
      'E-mail',
      'Tabulky',
      'Formulář',
      'Jiné / kombinace nástrojů',
    ]);
  });

  it('keeps the Czech route Czech and the English route English', () => {
    expect(siteContent.cs.hero.title).toContain('méně ruční práce');
    expect(siteContent.cs.hero.proof.map((item) => item.label)).toEqual([
      'Audit od 2 900 Kč',
      'Web od 25 000 Kč',
      'Výstup s návodem',
    ]);
    expect(siteContent.cs.header.cta).toBe('Chci zmapovat problém');
    expect(siteContent.cs.header.navItems).toHaveLength(5);
    expect(siteContent.cs.header.navItems.map((item) => item.href)).toEqual([
      '#about',
      '#services',
      '#process',
      '#pricing',
      '#terminal',
    ]);
    expect(siteContent.cs.terminal.projectOptions).toEqual(
      [
        'Web',
        'E-mail',
        'Tabulky',
        'Formulář',
        'Jiné / kombinace nástrojů',
      ],
    );
    expect(siteContent.cs.pricing.items[0].name).toBe('Audit webu nebo procesu');
    expect(siteContent.en.hero.title).toContain('less manual work');
    expect(siteContent.en.header.cta).toBe('Map the problem');
    expect(siteContent.en.header.navItems).toHaveLength(5);
    expect(siteContent.en.pricing.items[0].name).toBe('Website or process audit');
  });

  it('keeps homepage copy free of public agent hype and fake guarantees', () => {
    const homepageText = JSON.stringify(siteContent.cs).toLowerCase();

    for (const forbidden of ['agentní', 'autonomní', 'pagespeed 95', 'garantujeme 1,5 s']) {
      expect(homepageText).not.toContain(forbidden.toLowerCase());
    }
  });

  it('keeps homepage examples as a short teaser until full examples are ready', () => {
    for (const locale of supportedLocales) {
      const demos = siteContent[locale as Locale].demos;

      expect(demos.items).toHaveLength(0);
      expect(demos.title.length).toBeGreaterThan(10);
      expect(demos.lead.toLowerCase()).toContain(locale === 'cs' ? 'modelové ukázky' : 'model examples');
    }
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
