export type ShowcaseSlug = 'automatizace' | 'nabidka-eshop';

// TODO(owner): Add 1-2 real automation case studies before strengthening automation outcome claims.

export interface ShowcaseLink {
  label: string;
  href: string;
}

export interface ShowcaseSection {
  title: string;
  body: string;
  points: string[];
}

export interface ShowcaseExample {
  slug: ShowcaseSlug;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  summary: string;
  promise: string;
  primaryCta: ShowcaseLink;
  secondaryCta?: ShowcaseLink;
  sections: ShowcaseSection[];
  safetyNotes: string[];
  outOfScope: string[];
  proofTags: string[];
}

export const showcaseHub = {
  slug: 'ukazky',
  title: 'Ukázky praktických řešení | Radeq.cz',
  description:
    'Veřejně bezpečné ukázky chatbotu, automatizace a zpřehlednění nabídky bez klientských dat, plateb a skrytého zpracování.',
  h1: 'Ukázky praktických řešení pro web, poptávky a ruční práci',
  summary:
    'Tyto ukázky nejsou klientské case studies. Jsou to statické scénáře, které ukazují, jak se dá šetřit čas, peníze a provozní riziko bez zbytečného sběru dat.',
} as const;

export const showcaseExamples = [
  {
    slug: 'automatizace',
    title: 'Automatizace poptávek a ruční práce | Radeq.cz',
    description:
      'Ukázka jednoduché automatizace poptávek: sběr, kontrola, třídění a předání bez skrytého posílání dat třetím stranám.',
    h1: 'Automatizace, která ubere ruční přepisování',
    eyebrow: 'Poptávky a data',
    summary:
      'Ukázka popisuje cestu od formuláře přes kontrolu polí až po přehledný stav. Cílem není autonomní systém, ale méně ztracených dotazů, méně chyb a lepší kontrola nad daty.',
    promise: 'Méně ručního kopírování, rychlejší reakce a jasnější odpovědnost za další krok.',
    primaryCta: { label: 'Zmapovat ruční práci', href: '#terminal' },
    secondaryCta: { label: 'Zpět na ukázky', href: '/ukazky/' },
    sections: [
      {
        title: 'Co ukázka řeší',
        body: 'Poptávky často končí v e-mailu, tabulce a poznámkách současně. Automatizace má sjednotit příjem a ukázat, kde je další krok.',
        points: ['kontrola povinných polí', 'třídění podle typu práce', 'přehled stavu bez těžkého systému'],
      },
      {
        title: 'Bezpečný průběh',
        body: 'Ukázka pracuje s minimem údajů a popisuje, co se má předávat až při osobní domluvě.',
        points: ['volitelná doplňující pole', 'žádné přístupy ve formuláři', 'ruční kontrola citlivých případů'],
      },
      {
        title: 'Kde šetří čas a peníze',
        body: 'Menší firma často nepotřebuje nový systém. Stačí odstranit opakované přepisování, ztracené zprávy a nejasné další kroky.',
        points: ['méně ručních chyb', 'rychlejší třídění', 'levnější provoz než velký interní systém'],
      },
      {
        title: 'Co se ověřuje před spuštěním',
        body: 'Nejdřív se mapuje proces, chybové stavy a ruční záloha. Automatizovat slepě je drahé a rizikové.',
        points: ['vstupy a výstupy', 'chybové cesty', 'ruční override'],
      },
    ],
    safetyNotes: [
      'Demo samo neposílá data třetím stranám.',
      'Citlivé údaje patří až do bezpečné domluvy, ne do veřejné ukázky.',
      'Automatizace musí mít viditelnou ruční zálohu, když pravidlo nestačí.',
    ],
    outOfScope: ['skryté profilování návštěvníků', 'odesílání bez potvrzení', 'převzetí odpovědnosti za odborná rozhodnutí'],
    proofTags: ['kontrola polí', 'méně ručních chyb', 'úspora peněz', 'ochrana dat'],
  },
  {
    slug: 'nabidka-eshop',
    title: 'Nabídka a e-shop bez zbytečného tření | Radeq.cz',
    description:
      'Ukázka zpřehlednění produktů, balíčků nebo služeb bez plateb, závazné objednávky a falešných obchodních slibů.',
    h1: 'Nabídka, která zkracuje rozhodování',
    eyebrow: 'Nabídka / e-shop',
    summary:
      'Ukázka vysvětluje, jak srovnat produkty, balíčky nebo služby tak, aby zákazník rychle pochopil rozdíl a bezpečně přešel k poptávce. Není to prodejní ani objednávkový systém.',
    promise: 'Jasnější výběr, méně dotazů na základní rozdíly a kratší cesta k poptávce.',
    primaryCta: { label: 'Zpřehlednit nabídku', href: '#terminal' },
    secondaryCta: { label: 'Otevřít starší demo nabídky', href: '/demo/eshop-offers/' },
    sections: [
      {
        title: 'Co ukázka řeší',
        body: 'Když nabídka vypadá stejně nebo zahlceně, zákazník odkládá rozhodnutí. Struktura mu má ukázat rozdíl mezi variantami.',
        points: ['méně zahlcení', 'jasné porovnání', 'viditelná další akce'],
      },
      {
        title: 'Bezpečný rozsah',
        body: 'Tato ukázka nic neprodává, nepočítá dopravu a nepřijímá platební údaje. Slouží k návrhu poptávkové cesty.',
        points: ['bez platby', 'bez závazné objednávky', 'bez fakturačních údajů'],
      },
      {
        title: 'Kde šetří čas a peníze',
        body: 'Srozumitelná nabídka snižuje počet vysvětlujících e-mailů a pomáhá poznat, o jakou variantu má zákazník zájem.',
        points: ['méně opakovaných dotazů', 'rychlejší výběr varianty', 'lepší zadání pro poptávku'],
      },
      {
        title: 'Co se dá měřit opatrně',
        body: 'Měření má pomáhat zlepšit nabídku, ne sbírat zbytečná osobní data.',
        points: ['zájem o varianty', 'slabá místa nabídky', 'opatrné vyhodnocení bez obsahu zpráv'],
      },
    ],
    safetyNotes: [
      'Ukázka není závazná objednávka.',
      'Nezadávají se platební, doručovací ani fakturační údaje.',
      'Poptávka se řeší až vědomým kontaktem přes formulář.',
    ],
    outOfScope: ['platební brána', 'skladové napojení', 'slib prodeje'],
    proofTags: ['jasná nabídka', 'bez platby', 'úspora času', 'bez klientských dat'],
  },
] as const satisfies ShowcaseExample[];

export function getShowcaseExample(slug: ShowcaseSlug): ShowcaseExample | undefined {
  return showcaseExamples.find((example) => example.slug === slug);
}
