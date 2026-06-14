import { defaultLocale, type Locale } from './locales';

export type ModuleId = 'blog-docs' | 'service-landing' | 'admin-dashboard' | 'eshop-offers';
export type EpochId = 'variant-a' | 'variant-b' | 'variant-c' | 'variant-d';
export type Complexity = 'lean' | 'balanced' | 'advanced';

export interface MatrixSelection {
  moduleId: ModuleId;
  epochId: EpochId;
}

export interface MatrixPreset {
  id: string;
  selection: MatrixSelection;
  title: string;
  headline: string;
  lead: string;
  summary: string;
  cta: string;
  complexity: Complexity;
  proofTag: string;
  proofPoints: {
    label: string;
    value: string;
  }[];
  design: {
    name: string;
    layout: 'directory' | 'editorial' | 'hud' | 'workboard' | 'studio';
    rhythm: string;
    details: string[];
  };
  tokens: {
    accent: string;
    accent2: string;
    surface: string;
    border: string;
    fontMode: string;
    motion: string;
    density: string;
  };
}

export interface ModuleOption {
  id: ModuleId;
  label: string;
  benefit: string;
  proofTag: string;
}

export interface EpochOption {
  id: EpochId;
  label: string;
  benefit: string;
}

type ModuleCopy = {
  label: string;
  benefit: string;
  proofTag: string;
  headline: string;
  lead: string;
  summary: string;
  cta: string;
  proofPoints: MatrixPreset['proofPoints'];
};

const moduleCopy: Record<Locale, Record<ModuleId, ModuleCopy>> = {
  cs: {
    'blog-docs': {
      label: 'Blog / poradna',
      benefit: 'Obsah, který lidé rychle pochopí.',
      proofTag: 'Clear content',
      headline: 'Obsahová část, kde lidé rychle najdou odpověď.',
      lead:
        'Návštěvník rychle najde odpověď, vyhledávač pochopí vztahy a tým nepřepisuje stejný obsah pořád dokola.',
      summary: 'Čitelný prostor pro články, návody a dlouhodobé vyhledávání.',
      cta: 'Postavit autoritu',
      proofPoints: [
        { label: 'Co návštěvník pochopí', value: 'Kam patří odpověď a proč má číst dál.' },
        { label: 'Co jde sledovat', value: 'Čtenost, prokliky a slabá místa obsahu.' },
        { label: 'Co klient dostane', value: 'Mapu témat, šablony článků a jasné popisky pro vyhledávání.' },
      ],
    },
    'service-landing': {
      label: 'Poptávková stránka',
      benefit: 'Landing page, která filtruje leady.',
      proofTag: 'Request path',
      headline: 'Nabídka, která během první obrazovky oddělí zájem od náhodné návštěvy.',
      lead:
        'Text, příklady a hlavní tlačítko drží jednu obchodní linku: kdo je správný klient, jaký problém řeší a co má udělat dál.',
      summary:
        'Konverzní stránka s jasným sdělením, rychlým prvním dojmem a měřitelnou cestou k poptávce.',
      cta: 'Poslat poptávku',
      proofPoints: [
        { label: 'Co návštěvník pochopí', value: 'Jestli je služba pro něj a proč má reagovat teď.' },
        { label: 'Co jde sledovat', value: 'Kliknutí, čtenost a kvalitu poptávek.' },
        { label: 'Co klient dostane', value: 'Strukturu stránky, textové bloky a napojení poptávek.' },
      ],
    },
    'admin-dashboard': {
      label: 'Přehled pro tým',
      benefit: 'Provozní panel bez zbytečné složitosti.',
      proofTag: 'Team overview',
      headline: 'Interní rozhraní, které ukáže stav práce dřív, než se z něj stane problém.',
      lead:
        'Dashboard nemá být dekorace. Má zkrátit rozhodnutí, odhalit zpoždění a udržet automatizace pod kontrolou.',
      summary: 'Přehled pro data, automatizace a stav práce bez těžkopádného firemního softwaru.',
      cta: 'Zmapovat proces',
      proofPoints: [
        { label: 'Co návštěvník pochopí', value: 'Kde proces stojí a kdo má další krok.' },
        { label: 'Co jde sledovat', value: 'Stav záznamů, chyby automatizace a reakční časy.' },
        { label: 'Co klient dostane', value: 'Přehled dat, pracovní pohledy a historii změn.' },
      ],
    },
    'eshop-offers': {
      label: 'E-shop / nabídka',
      benefit: 'Nabídka, která zkracuje rozhodnutí.',
      proofTag: 'Clear offer',
      headline: 'Produktová nabídka, která nezahlcuje výběrem a vede k jasné akci.',
      lead:
        'Struktura nabídky sníží tření: menší váhání, rychlejší porovnání a měřitelný signál nákupního záměru.',
      summary: 'Přehledná nabídka pro produkty, balíčky a objednávku s důrazem na rychlé rozhodnutí.',
      cta: 'Zpřesnit nabídku',
      proofPoints: [
        { label: 'Co návštěvník pochopí', value: 'Která volba odpovídá jeho situaci.' },
        { label: 'Co jde sledovat', value: 'Výběr variant, opuštění kroku a zájem o nákup.' },
        { label: 'Co klient dostane', value: 'Strukturu nabídky, objednávkový tok a důležitá měření.' },
      ],
    },
  },
  en: {
    'blog-docs': {
      label: 'Blog / guides',
      benefit: 'Content people understand quickly.',
      proofTag: 'Clear content',
      headline: 'A content base that does not burn authority on weak structure.',
      lead:
        'The visitor finds the answer fast, search engines understand the relationships, and the team stops rewriting the same content.',
      summary: 'A readable space for articles, guides, and durable search traffic.',
      cta: 'Build authority',
      proofPoints: [
        { label: 'What the visitor understands', value: 'Where the answer belongs and why they should keep reading.' },
        { label: 'What can be tracked', value: 'Read depth, internal clicks, and weak content points.' },
        { label: 'What the client gets', value: 'Topic map, article templates, and clear search snippets.' },
      ],
    },
    'service-landing': {
      label: 'Request page',
      benefit: 'A landing page that filters requests.',
      proofTag: 'Request path',
      headline: 'An offer that separates serious interest from casual visits in the first viewport.',
      lead:
        'Copy, examples, and the main button follow one business line: who the right client is, what problem they have, and what they should do next.',
      summary: 'A conversion page with a clear message, fast first impression, and measurable path to a request.',
      cta: 'Send request',
      proofPoints: [
        { label: 'What the visitor understands', value: 'Whether the service fits them and why they should act now.' },
        { label: 'What can be tracked', value: 'Button clicks, reading depth, and request quality.' },
        { label: 'What the client gets', value: 'Page structure, copy blocks, and request-flow connection.' },
      ],
    },
    'admin-dashboard': {
      label: 'Team overview',
      benefit: 'Operations panel without needless complexity.',
      proofTag: 'Team overview',
      headline: 'An internal interface that reveals work status before it turns into a problem.',
      lead:
        'A dashboard should not be decoration. It should shorten decisions, expose delays, and keep automation under control.',
      summary: 'A work overview for data, automation, and status without heavy company software.',
      cta: 'Map process',
      proofPoints: [
        { label: 'What the visitor understands', value: 'Where the process stands and who owns the next step.' },
        { label: 'What can be tracked', value: 'Record states, automation errors, and response times.' },
        { label: 'What the client gets', value: 'Data overview, working views, and change history.' },
      ],
    },
    'eshop-offers': {
      label: 'Shop / offer',
      benefit: 'An offer that shortens the decision.',
      proofTag: 'Clear offer',
      headline: 'A product offer that reduces choice overload and leads to a clear action.',
      lead:
        'The offer structure lowers friction: less hesitation, faster comparison, and a measurable signal of buying interest.',
      summary: 'A clear offer for products, bundles, and ordering focused on faster decisions.',
      cta: 'Sharpen offer',
      proofPoints: [
        { label: 'What the visitor understands', value: 'Which option fits their situation.' },
        { label: 'What can be tracked', value: 'Variant choice, step abandonment, and buying interest.' },
        { label: 'What the client gets', value: 'Offer structure, ordering flow, and important measurements.' },
      ],
    },
  },
};

const epochTokens: Record<EpochId, MatrixPreset['tokens']> = {
  'variant-a': {
    accent: '#d7ff35',
    accent2: '#8ee8ff',
    surface: '#101414',
    border: '#344035',
    fontMode: 'trust',
    motion: 'calm-proof',
    density: 'balanced',
  },
  'variant-b': {
    accent: '#00e5ff',
    accent2: '#d7ff35',
    surface: '#071115',
    border: '#164c58',
    fontMode: 'motion',
    motion: 'cursor-flow',
    density: 'balanced',
  },
  'variant-c': {
    accent: '#ffb020',
    accent2: '#d7ff35',
    surface: '#0d0e0b',
    border: '#41351f',
    fontMode: 'proof',
    motion: 'workflow-pulse',
    density: 'dense',
  },
  'variant-d': {
    accent: '#009c95',
    accent2: '#ff5a48',
    surface: '#f8fbf6',
    border: '#c8ddd7',
    fontMode: 'studio',
    motion: 'decision-map',
    density: 'balanced',
  },
};

const epochDesign: Record<Locale, Record<EpochId, MatrixPreset['design']>> = {
  cs: {
    'variant-a': {
      name: 'A / Klidná důvěra',
      layout: 'editorial',
      rhythm: 'Čitelná nabídka, silná první obrazovka, méně technických slov a jasná cesta ke kontaktu.',
      details: ['jasný claim', 'větší text', 'klidné přechody', 'důvěryhodný formulář'],
    },
    'variant-b': {
      name: 'B / Hravý pohyb',
      layout: 'hud',
      rhythm: 'Cursor, scroll a jemné linky vysvětlují strukturu webu, ale hlavní sdělení zůstává vždy čitelné.',
      details: ['cursor reakce', 'scroll signály', 'živé linky', 'pohyb bez chaosu'],
    },
    'variant-c': {
      name: 'C / Technický důkaz',
      layout: 'workboard',
      rhythm: 'Více důkazů, postup práce a převzetí projektu na jedné pracovní ploše pro zákazníky, kteří chtějí jistotu.',
      details: ['procesní kroky', 'proof bloky', 'přehled stavu', 'předání práce'],
    },
    'variant-d': {
      name: 'D / Studio konfigurátor',
      layout: 'studio',
      rhythm: 'Netechnický výběr potřeb, mapa výsledků a přepínání světlého i tmavého dojmu přímo v návrhu.',
      details: ['výběr potřeby', 'mapa výsledků', 'přátelský jazyk', 'světlý i tmavý režim'],
    },
  },
  en: {
    'variant-a': {
      name: 'A / Calm trust',
      layout: 'editorial',
      rhythm: 'Readable offer, strong first viewport, fewer technical words, and a clear route to contact.',
      details: ['clear claim', 'larger text', 'calm transitions', 'trustworthy form'],
    },
    'variant-b': {
      name: 'B / Playful motion',
      layout: 'hud',
      rhythm: 'Cursor, scroll, and fine lines explain structure while the core offer stays readable.',
      details: ['cursor response', 'scroll signals', 'live routes', 'motion without clutter'],
    },
    'variant-c': {
      name: 'C / Technical proof',
      layout: 'workboard',
      rhythm: 'Proof, process, and project handoff are visible in one work-focused surface for buyers who need certainty.',
      details: ['process steps', 'proof blocks', 'status overview', 'handoff rules'],
    },
    'variant-d': {
      name: 'D / Studio configurator',
      layout: 'studio',
      rhythm: 'A non-technical needs picker, outcome map, and light/dark mood switch inside the proposal.',
      details: ['needs picker', 'outcome map', 'friendly language', 'light and dark mode'],
    },
  },
};

const complexityByEpoch: Record<EpochId, Complexity> = {
  'variant-a': 'lean',
  'variant-b': 'balanced',
  'variant-c': 'advanced',
  'variant-d': 'balanced',
};

const epochCopy: Record<Locale, EpochOption[]> = {
  cs: [
    { id: 'variant-a', label: 'A / Jasná mapa', benefit: 'Klidná a nejčitelnější cesta nabídkou.' },
    { id: 'variant-b', label: 'B / Kočičí průvodce', benefit: 'Hravější směr s maskotem a živým pohybem.' },
    { id: 'variant-c', label: 'C / Studio důkazů', benefit: 'Výstupy, proces a předání práce na prvním místě.' },
    { id: 'variant-d', label: 'D / Demo světy', benefit: 'Výraznější výběr podle situace návštěvníka.' },
  ],
  en: [
    { id: 'variant-a', label: 'A / Clear Map', benefit: 'The calmest and clearest route through the offer.' },
    { id: 'variant-b', label: 'B / Cat Guide', benefit: 'A playful direction with the mascot and live motion.' },
    { id: 'variant-c', label: 'C / Proof Studio', benefit: 'Outputs, process, and handoff take priority.' },
    { id: 'variant-d', label: 'D / Demo Worlds', benefit: 'A bolder choice organized by visitor situation.' },
  ],
};

export function buildMatrixPresets(locale: Locale = defaultLocale): MatrixPreset[] {
  const copy = moduleCopy[locale];

  return (Object.keys(copy) as ModuleId[]).flatMap((moduleId) =>
    (Object.keys(epochTokens) as EpochId[]).map((epochId) => ({
      id: `${moduleId}-${epochId}`,
      selection: { moduleId, epochId },
      title: copy[moduleId].label,
      headline: copy[moduleId].headline,
      lead: copy[moduleId].lead,
      summary: copy[moduleId].summary,
      cta: copy[moduleId].cta,
      complexity: complexityByEpoch[epochId],
      proofTag: copy[moduleId].proofTag,
      proofPoints: copy[moduleId].proofPoints,
      design: epochDesign[locale][epochId],
      tokens: epochTokens[epochId],
    })),
  );
}

export function getModuleOptions(locale: Locale = defaultLocale): ModuleOption[] {
  const copy = moduleCopy[locale];

  return (Object.keys(copy) as ModuleId[]).map((id) => ({
    id,
    label: copy[id].label,
    benefit: copy[id].benefit,
    proofTag: copy[id].proofTag,
  }));
}

export function getEpochOptions(locale: Locale = defaultLocale): EpochOption[] {
  return epochCopy[locale];
}

export const matrixPresets = buildMatrixPresets(defaultLocale);
export const moduleOptions = getModuleOptions(defaultLocale);
export const epochOptions = getEpochOptions(defaultLocale);
