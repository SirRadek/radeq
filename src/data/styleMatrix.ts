import { defaultLocale, type Locale } from './locales';

export type ModuleId = 'blog-docs' | 'service-landing' | 'admin-dashboard' | 'eshop-offers';
export type EpochId = 'retro-1996' | 'modern' | 'cyber-2036' | 'industrial';
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
    layout: 'directory' | 'editorial' | 'hud' | 'workboard';
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
  'retro-1996': {
    accent: '#39ff14',
    accent2: '#f4f1de',
    surface: '#050505',
    border: '#39ff14',
    fontMode: 'mono',
    motion: 'terminal-snap',
    density: 'compact',
  },
  modern: {
    accent: '#d7ff44',
    accent2: '#8ee8ff',
    surface: '#101214',
    border: '#303840',
    fontMode: 'sans',
    motion: 'soft-shift',
    density: 'balanced',
  },
  'cyber-2036': {
    accent: '#00e5ff',
    accent2: '#b6ff3d',
    surface: '#081016',
    border: '#174957',
    fontMode: 'tech',
    motion: 'holo-shift',
    density: 'dense',
  },
  industrial: {
    accent: '#d7ff35',
    accent2: '#ffb020',
    surface: '#0a0b0c',
    border: '#2b332c',
    fontMode: 'industrial',
    motion: 'servo-lock',
    density: 'dense',
  },
};

const epochDesign: Record<Locale, Record<EpochId, MatrixPreset['design']>> = {
  cs: {
    'retro-1996': {
      name: 'Adresářový web s výraznou navigací',
      layout: 'directory',
      rhythm: 'Hodně jasných odkazů, tabulkové bloky, jednoduché sekce a rychlé rozhodování.',
      details: ['viditelná navigace', 'hranaté bloky', 'kontrastní výzva', 'minimum efektů'],
    },
    modern: {
      name: 'Vzdušná prezentační stránka',
      layout: 'editorial',
      rhythm: 'Velký prostor, silný úvod, klidné ukázky a obsah, který se dá pohodlně číst.',
      details: ['velká fotka nebo ukázka', 'krátké bloky', 'jemné přechody', 'čistý formulář'],
    },
    'cyber-2036': {
      name: 'Interaktivní systémová ukázka',
      layout: 'hud',
      rhythm: 'Web působí jako živý nástroj: linky, stavy, panely a pohyb, který něco vysvětluje.',
      details: ['živé linky', 'stavové panely', 'rychlé volby', 'animovaný průchod'],
    },
    industrial: {
      name: 'Pracovní provozní deska',
      layout: 'workboard',
      rhythm: 'Hutnější rozložení pro služby, data, procesy a nabídku, která má být čitelná i opakovaně.',
      details: ['procesní kroky', 'checklisty', 'přehled stavu', 'robustní kontrast'],
    },
  },
  en: {
    'retro-1996': {
      name: 'Directory-style website with bold navigation',
      layout: 'directory',
      rhythm: 'Clear links, table-like blocks, simple sections, and quick decisions.',
      details: ['visible navigation', 'square blocks', 'strong call to action', 'minimal effects'],
    },
    modern: {
      name: 'Airy presentation page',
      layout: 'editorial',
      rhythm: 'Generous space, strong opening, calm examples, and content that is easy to read.',
      details: ['large image or preview', 'short blocks', 'soft transitions', 'clean form'],
    },
    'cyber-2036': {
      name: 'Interactive systems demo',
      layout: 'hud',
      rhythm: 'The website feels like a live tool: routes, states, panels, and motion that explains meaning.',
      details: ['live routes', 'status panels', 'quick choices', 'animated walkthrough'],
    },
    industrial: {
      name: 'Operational workboard',
      layout: 'workboard',
      rhythm: 'Denser layout for services, data, process, and an offer people can scan repeatedly.',
      details: ['process steps', 'checklists', 'status overview', 'robust contrast'],
    },
  },
};

const complexityByEpoch: Record<EpochId, Complexity> = {
  'retro-1996': 'lean',
  modern: 'balanced',
  'cyber-2036': 'advanced',
  industrial: 'balanced',
};

const epochCopy: Record<Locale, EpochOption[]> = {
  cs: [
    { id: 'retro-1996', label: 'Hravě retro', benefit: 'Jako rychlý katalog s výraznými odkazy.' },
    { id: 'modern', label: 'Čistý moderní', benefit: 'Vzdušný web s velkým prostorem pro značku.' },
    { id: 'cyber-2036', label: 'Futuristický', benefit: 'Interaktivní ukázka s panely a pohybem.' },
    { id: 'industrial', label: 'Robustní pracovní', benefit: 'Hutnější rozložení pro procesy a data.' },
  ],
  en: [
    { id: 'retro-1996', label: 'Playful retro', benefit: 'A fast catalogue with bold links.' },
    { id: 'modern', label: 'Clean modern', benefit: 'An airy website with room for the brand.' },
    { id: 'cyber-2036', label: 'Future-facing', benefit: 'An interactive preview with panels and motion.' },
    { id: 'industrial', label: 'Robust work-focused', benefit: 'A denser layout for process and data.' },
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
