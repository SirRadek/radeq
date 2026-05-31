import { supportedLocales, type Locale } from './locales';
import type { ModuleId } from './styleMatrix';

export { supportedLocales, type Locale };

export interface SiteContent {
  layout: {
    lang: Locale;
    title: string;
    description: string;
    path: string;
    alternatePath: string;
    alternateLabel: string;
  };
  header: {
    ariaLabel: string;
    brandAria: string;
    navAria: string;
    navItems: { href: string; label: string }[];
    cta: string;
    styleLabel: string;
    themeLabel: string;
    lightTheme: string;
    darkTheme: string;
  };
  hero: {
    metaAria: string;
    meta: string[];
    title: string;
    lead: string;
    proof: { label: string; value: string }[];
    actionsAria: string;
    actions: { href: string; label: string; variant: 'primary' | 'secondary' }[];
    coreAria: string;
    coreCaption: string;
    core: {
      enableLabel: string;
      loadingLabel: string;
      failedLabel: string;
      reducedMotionLabel: string;
    };
  };
  matrix: {
    sectionCode: string;
    title: string;
    lead: string;
    moduleLabel: string;
    moduleAria: string;
    epochLabel: string;
    epochAria: string;
    previewAria: string;
  };
  audience: {
    sectionCode: string;
    title: string;
    items: { title: string; signal: string }[];
  };
  demos: {
    sectionCode: string;
    title: string;
    lead: string;
    items: {
      name: string;
      metric: string;
      summary: string;
      events: string[];
    }[];
  };
  handoff: {
    sectionCode: string;
    title: string;
    lead: string;
    items: string[];
  };
  systems: {
    sectionCode: string;
    title: string;
    lead: string;
    demoLabel: string;
    requestLabel: string;
    items: {
      problem: string;
      system: string;
      output: string;
      demoModule?: ModuleId;
    }[];
  };
  terminal: {
    sectionCode: string;
    title: string;
    leadPrefix: string;
    leadCommand: string;
    leadSuffix: string;
    regionAria: string;
    commandLabel: string;
    summaryAria: string;
    summaryTitle: string;
    runLabel: string;
    waitLabel: string;
    initialHistory: string;
    readyStatus: string;
    sendingStatus: string;
    apiUnavailable: string;
    storedPrefix: string;
    missingRequiredPrefix: string;
    emptyCommand: string;
    unknownCommandPrefix: string;
    unsupportedFieldPrefix: string;
    fieldLabels: Record<string, string>;
    placeholders: Record<string, string>;
    projectOptions: string[];
    optionalTitle: string;
    examples: string[];
  };
}

export const siteContent = {
  cs: {
    layout: {
      lang: 'cs',
      title: 'Radeq.cz | Rychlé weby a poptávkové systémy',
      description:
        'Radeq.cz staví rychlé prezentační weby, landing pages, poptávkové cesty a malé systémy pro foundery, expertní značky a rostoucí firmy.',
      path: '/',
      alternatePath: '/en/',
      alternateLabel: 'EN',
    },
    header: {
      ariaLabel: 'Hlavní navigace',
      brandAria: 'Radeq.cz úvod',
      navAria: 'Hlavní menu',
      navItems: [
        { href: '#services', label: 'Co umíme' },
        { href: '/demo/service-landing/', label: 'Demo' },
        { href: '#handoff', label: 'Průběh' },
        { href: '#terminal', label: 'Poptávka' },
      ],
      cta: 'Nezávazná poptávka',
      styleLabel: 'Přepnout styl webu',
      themeLabel: 'Přepnout barevný režim',
      lightTheme: 'Světlý',
      darkTheme: 'Tmavý',
    },
    hero: {
      metaAria: 'Cíle projektu',
      meta: [],
      title: 'Web, kterému zákazník rozumí na první scroll.',
      lead:
        'Navrhnu jasnou strukturu, texty, rychlost, SEO základ a pohybové detaily tak, aby web působil profesionálně, hravě a vedl k poptávce.',
      proof: [
        { label: 'Návrhy', value: 'A / B / C / D směr před vývojem' },
        { label: 'Pohyb', value: 'cursor a scroll bez ztráty čitelnosti' },
        { label: 'Cíl', value: 'víc kvalitních poptávek' },
      ],
      actionsAria: 'Hlavní akce',
      actions: [
        { href: '#services', label: 'Prohlédnout služby', variant: 'primary' },
        { href: '#terminal', label: 'Poslat poptávku', variant: 'secondary' },
      ],
      coreAria: 'Interaktivní 3D náhled zrzavé kočičky',
      coreCaption: 'Pohyb je doplněk. Hlavní obsah a kontakt fungují i bez něj.',
      core: {
        enableLabel: 'Spustit kočičku',
        loadingLabel: 'Načítám kočičku...',
        failedLabel: 'Kočičku se teď nepodařilo spustit. Zůstává jednoduchý náhled.',
        reducedMotionLabel: 'Pohyb je v prohlížeči omezený, proto zůstává jednoduchý náhled.',
      },
    },
    matrix: {
      sectionCode: '',
      title: 'Interaktivní demo je mimo hlavní stránku.',
      lead:
        'Vlevo přepnete typ ukázky. Styl A, B, C nebo D řídí celý web z horní lišty vedle světlého a tmavého režimu.',
      moduleLabel: 'Jakou ukázku chcete vidět',
      moduleAria: 'Typ webu nebo systému',
      epochLabel: 'Styl webu v horním přepínači',
      epochAria: 'Návrhová varianta webu',
      previewAria: 'Aktuální ukázka webu',
    },
    audience: {
      sectionCode: '',
      title: 'Každý klient potřebuje jinou cestu k rozhodnutí.',
      items: [
        {
          title: 'Micro-SaaS founders',
          signal: 'Landing page s výkonem aplikace, dokumentací, waitlistem a cestou k demu.',
        },
        {
          title: 'Expertní značky',
          signal: 'Jasná prezentace expertízy, nabídky a výsledků bez agenturní vaty.',
        },
        {
          title: 'Inovativní SME',
          signal: 'Náhrada zastaralých procesů lehkým, udržitelným systémem.',
        },
        {
          title: 'Marketingoví architekti',
          signal: 'Opakovatelné poptávkové cesty a jasná měření bez ručního přeposílání.',
        },
      ],
    },
    demos: {
      sectionCode: '',
      title: 'Důkazy z projektů, ne jen seznam služeb.',
      lead:
        'První bloky jsou veřejně bezpečné archetypy z hotových demo projektů. Popisují typ výsledku a kontrolu kvality, ne soukromé repozitáře ani klientský obsah.',
      items: [
        {
          name: 'SEO oprava před a po',
          metric: 'PROOF 01',
          summary:
            'Statická stránka porovnává základní a opravenou verzi: metadata, sitemapu, strukturovaná data a měřitelné HTML kontroly.',
          events: ['Staticky audit', 'Úprava metadat', 'Sitemap / JSON-LD', 'HTML kontrola'],
        },
        {
          name: 'Specializovaný workflow prototyp',
          metric: 'PROOF 02',
          summary:
            'Soukromé zadání se převádí do plánovacích kroků, prompt packu a kontrolních výstupů bez klientských dat a citlivých podkladů.',
          events: ['Mapa workflow', 'Bezpečný brief', 'Kontrolní výstupy', 'Demo artefakty'],
        },
        {
          name: 'Správa a technická podpora',
          metric: '',
          summary:
            'Údržba webu, menší změny, opravy chyb, kontrola rychlosti, zálohy a bezpečnostní minimum bez složitého procesu.',
          events: ['Rychlá oprava', 'Aktualizace obsahu', 'Kontrola rychlosti', 'Základ bezpečnosti'],
        },
        {
          name: 'Lehká AI a chatboti',
          metric: '',
          summary:
            'Cloudový chatbot, jednoduchý asistent, třídění dotazů nebo interní pomocník nad schválenými texty a daty.',
          events: ['Návrh dialogu', 'Napojení zdrojů', 'Ochrana vstupů', 'Test odpovědí'],
        },
        {
          name: 'Data a databáze',
          metric: '',
          summary:
            'Sběr, čištění a filtrování dat z formulářů, tabulek nebo jednoduchých databází. Výstupem je přehled, ne chaos.',
          events: ['Sběr dat', 'Kontrola polí', 'Filtrování', 'Přehled výstupů'],
        },
        {
          name: 'Dokumenty a převody',
          metric: '',
          summary:
            'Převod dokumentů, tabulek a podkladů do webu, databáze, PDF, prezentace nebo přehledného interního výstupu.',
          events: ['Vstupní podklady', 'Čištění obsahu', 'Nový formát', 'Kontrola výsledku'],
        },
      ],
    },
    handoff: {
      sectionCode: '',
      title: 'Klient nedostane jen web. Dostane systém, který lze převzít.',
      lead: 'Výstup je dokumentovaný, měřitelný a připravený na údržbu bez závislosti na jednom dodavateli.',
      items: [
        'Přehled, co kde ve webu najdete a kdo za co odpovídá',
        'Jednotný vizuální styl pro další úpravy',
        'Pravidla pro úpravu obsahu',
        'Jednoduchý postup pro zveřejnění změn',
        'Přehled důležitých měření',
        'Kontrola čitelnosti, rychlosti a přístupnosti',
      ],
    },
    systems: {
      sectionCode: '',
      title: 'Co umíme postavit a vylepšit.',
      lead:
        'Hlavní stránka má zůstat srozumitelná: krátký popis služby, co z ní vznikne, a odkaz na samostatnou ukázku tam, kde dává demo smysl.',
      demoLabel: 'Otevřít demo',
      requestLabel: 'Probrat v poptávce',
      items: [
        {
          problem: 'Potřebujete nový nebo lepší web',
          system: 'Firemní web, portfolio, blog nebo landing page',
          output: 'Jasná struktura, dobrý mobil a jednoduchá cesta ke kontaktu.',
          demoModule: 'service-landing',
        },
        {
          problem: 'Web má být dohledatelný a měřitelný',
          system: 'Základy SEO, marketingu a měření',
          output: 'Poctivé titulky, popisy, interní odkazy, měření akcí a první mailing.',
          demoModule: 'blog-docs',
        },
        {
          problem: 'Chcete méně ruční práce',
          system: 'Poptávkové formuláře, sběr a filtrování dat',
          output: 'Poptávky se ukládají, třídí a posílají tam, kde je tým opravdu řeší.',
          demoModule: 'admin-dashboard',
        },
        {
          problem: 'Máte dokumenty a tabulky všude možně',
          system: 'Převod dokumentů, dat a podkladů',
          output: 'Čistší obsah, použitelné tabulky, PDF, prezentace nebo webový přehled.',
          demoModule: 'blog-docs',
        },
        {
          problem: 'Zákazníci se ptají pořád na stejné věci',
          system: 'Lehký cloudový chatbot nebo asistent',
          output: 'Asistent odpovídá z ověřených podkladů a umí předat složitější dotaz člověku.',
        },
        {
          problem: 'Web potřebuje dlouhodobou péči',
          system: 'Správa, údržba a technická podpora',
          output: 'Menší úpravy, opravy, kontrola rychlosti, bezpečnostní základ a klidnější provoz.',
        },
        {
          problem: 'Potřebujete aplikaci bez App Storu',
          system: 'Mobilní webová aplikace',
          output: 'Použitelný nástroj v prohlížeči, který funguje dobře i na telefonu.',
          demoModule: 'admin-dashboard',
        },
        {
          problem: 'Projekt potřebuje vypadat důvěryhodně',
          system: 'Copy, vizuální detail a prezentační stránka',
          output: 'Srozumitelná nabídka, dobré ukázky a méně slov, kterým zákazník nerozumí.',
          demoModule: 'eshop-offers',
        },
      ],
    },
    terminal: {
      sectionCode: '',
      title: 'Napište pár vět. Zbytek vyjasníme spolu.',
      leadPrefix: 'Stačí vyplnit základní údaje a stručně popsat, co chcete zlepšit. Popište to vlastními slovy.',
      leadCommand: '',
      leadSuffix: '',
      regionAria: 'Jednoduchý poptávkový formulář',
      commandLabel: 'Základní údaje',
      summaryAria: 'Souhrn poptávky',
      summaryTitle: 'Co zatím víme',
      runLabel: 'Odeslat poptávku',
      waitLabel: 'Odesílám...',
      initialHistory: 'Vyplňte jméno, e-mail, typ projektu a krátkou zprávu.',
      readyStatus: 'Vyplňte povinná pole. Volitelné údaje pomůžou lépe odhadnout rozsah.',
      sendingStatus: 'Odesílám poptávku...',
      apiUnavailable: 'Formulář teď v náhledu nejde odeslat. Otevřete produkční verzi nebo napište e-mailem.',
      storedPrefix: 'uloženo',
      missingRequiredPrefix: 'Doplňte prosím',
      emptyCommand: 'Zpráva je prázdná.',
      unknownCommandPrefix: 'Tuhle část neumím uložit',
      unsupportedFieldPrefix: 'Tuhle část neumím uložit',
      fieldLabels: {
        name: 'Jméno',
        email: 'E-mail',
        company: 'Firma',
        project_type: 'Typ projektu',
        audience: 'Publikum',
        deadline: 'Termín',
        current_url: 'Současná URL',
        budget_range: 'Rozpočet',
        message: 'Zpráva',
      },
      placeholders: {
        name: 'Jan Novák',
        email: 'jan@example.cz',
        company: 'Firma nebo značka',
        audience: 'Pro koho má web být?',
        deadline: 'Např. do 6 týdnů',
        current_url: 'https://vas-web.cz',
        budget_range: 'Např. 50-100 tis. Kč',
        message: 'Co potřebujete postavit nebo zlepšit?',
      },
      projectOptions: [
        'Firemní web / portfolio',
        'Landing page',
        'Blog / obsah',
        'Základy SEO a marketingu',
        'Správa a údržba webu',
        'Mailing a technická podpora',
        'Lehká AI / chatbot',
        'Data, databáze a formuláře',
        'Převod dokumentů',
        'Mobilní webová aplikace',
        'E-shop / nabídka',
        'Nevím, potřebuji poradit',
      ],
      optionalTitle: 'Volitelné upřesnění',
      examples: [
        'set name Jan Siroky',
        'set email siroky@radeq.cz',
        'set company Radeq.cz',
        'set project_type Poptávková stránka',
        'set audience Micro-SaaS founders',
        'set deadline Q3',
        'set current_url https://example.com',
        'set budget_range 50k-100k CZK',
        'set message Potřebuji rychlé routování leadů.',
        'summary',
        'submit',
      ],
    },
  },
  en: {
    layout: {
      lang: 'en',
      title: 'Radeq.cz | High-performance web systems',
      description:
        'Radeq.cz builds fast conversion systems, SEO structures, and lead-flow automation for founders, expert brands, SMEs, and marketing architects.',
      path: '/en/',
      alternatePath: '/',
      alternateLabel: 'CZ',
    },
    header: {
      ariaLabel: 'Primary navigation',
      brandAria: 'Radeq.cz home',
      navAria: 'Main menu',
      navItems: [
        { href: '#services', label: 'Services' },
        { href: '/en/demo/service-landing/', label: 'Demo' },
        { href: '#handoff', label: 'Workflow' },
        { href: '#terminal', label: 'Request' },
      ],
      cta: 'Request a quote',
      styleLabel: 'Switch website style',
      themeLabel: 'Switch color mode',
      lightTheme: 'Light',
      darkTheme: 'Dark',
    },
    hero: {
      metaAria: 'Project targets',
      meta: [],
      title: 'A website buyers understand on the first scroll.',
      lead:
        'I shape the structure, copy, speed, SEO basics, and motion details so the website feels professional, playful, and focused on qualified requests.',
      proof: [
        { label: 'Variants', value: 'A / B / C / D direction before build' },
        { label: 'Motion', value: 'cursor and scroll without losing clarity' },
        { label: 'Goal', value: 'more qualified requests' },
      ],
      actionsAria: 'Primary actions',
      actions: [
        { href: '#services', label: 'Browse services', variant: 'primary' },
        { href: '#terminal', label: 'Send a request', variant: 'secondary' },
      ],
      coreAria: 'Interactive 3D ginger cat preview',
      coreCaption: 'Motion is an enhancement. The main content and contact path work without it.',
      core: {
        enableLabel: 'Launch cat',
        loadingLabel: 'Loading cat...',
        failedLabel: 'The cat cannot start here. A simple preview stays visible.',
        reducedMotionLabel: 'Motion is limited in this browser, so a simple preview stays visible.',
      },
    },
    matrix: {
      sectionCode: '',
      title: 'The interactive demo lives outside the main page.',
      lead:
        'Switch the preview type on the left. Style A, B, C, or D controls the whole website from the top bar next to light and dark mode.',
      moduleLabel: 'Choose a preview type',
      moduleAria: 'Website or system type',
      epochLabel: 'Website style in the top switcher',
      epochAria: 'Website proposal variant',
      previewAria: 'Current website preview',
    },
    audience: {
      sectionCode: '',
      title: 'Different clients need different decision paths.',
      items: [
        {
          title: 'Micro-SaaS founders',
          signal: 'A landing page with app-grade performance, docs, waitlist, and demo routing.',
        },
        {
          title: 'Expert brands',
          signal: 'Clear presentation of expertise, offer, and outcomes without agency padding.',
        },
        {
          title: 'Innovative SMEs',
          signal: 'A replacement for stale process flows with lightweight, maintainable systems.',
        },
        {
          title: 'Marketing architects',
          signal: 'Reusable request paths and clear measurement without manual forwarding.',
        },
      ],
    },
    demos: {
      sectionCode: '',
      title: 'Project proof, not just a service list.',
      lead:
        'The first blocks are public-safe archetypes from completed demo projects. They describe the result type and quality checks, not private repositories or client material.',
      items: [
        {
          name: 'SEO repair: before and after',
          metric: 'PROOF 01',
          summary:
            'A static page compares baseline and repaired versions: metadata, sitemap, structured data, and measurable HTML checks.',
          events: ['Static audit', 'Metadata cleanup', 'Sitemap / JSON-LD', 'HTML checks'],
        },
        {
          name: 'Specialist workflow prototype',
          metric: 'PROOF 02',
          summary:
            'A private brief is converted into planning steps, a prompt pack, and verification outputs without client data or sensitive source material.',
          events: ['Workflow map', 'Safe brief', 'Verification outputs', 'Demo artifacts'],
        },
        {
          name: 'Maintenance and support',
          metric: '',
          summary:
            'Website maintenance, small changes, bug fixes, speed checks, backups, and security basics without a heavy process.',
          events: ['Quick fix', 'Content update', 'Speed check', 'Security basics'],
        },
        {
          name: 'Light AI and chatbots',
          metric: '',
          summary:
            'A cloud chatbot, simple assistant, request classifier, or internal helper working with approved text and data.',
          events: ['Dialog design', 'Source connection', 'Input guardrails', 'Answer testing'],
        },
        {
          name: 'Data and databases',
          metric: '',
          summary:
            'Collection, cleanup, and filtering of data from forms, sheets, or small databases. The result is a clear overview, not clutter.',
          events: ['Data intake', 'Field checks', 'Filtering', 'Output overview'],
        },
        {
          name: 'Documents and conversion',
          metric: '',
          summary:
            'Convert documents, sheets, and source material into a website, database, PDF, presentation, or clean internal output.',
          events: ['Source material', 'Content cleanup', 'New format', 'Result check'],
        },
      ],
    },
    handoff: {
      sectionCode: '',
      title: 'The client does not just get a website. They get a system they can take over.',
      lead: 'The output is documented, measurable, and ready for maintenance without being locked to one provider.',
      items: [
        'A clear map of what lives where and who owns it',
        'A consistent visual style for future edits',
        'Content editing rules',
        'A simple publishing and rollback guide',
        'A list of important measurements',
        'Readability, speed, and accessibility checks',
      ],
    },
    systems: {
      sectionCode: '',
      title: 'What we can build and improve.',
      lead:
        'The main page stays easy to scan: a short service description, the expected output, and a link to a separate demo when an interactive example helps.',
      demoLabel: 'Open demo',
      requestLabel: 'Discuss in request',
      items: [
        {
          problem: 'You need a new or better website',
          system: 'Company website, portfolio, blog, or landing page',
          output: 'Clear structure, good mobile behavior, and a simple path to contact.',
          demoModule: 'service-landing',
        },
        {
          problem: 'The website should be findable and measurable',
          system: 'SEO, marketing, and measurement basics',
          output: 'Honest titles, descriptions, internal links, action tracking, and first mailing.',
          demoModule: 'blog-docs',
        },
        {
          problem: 'You want less manual work',
          system: 'Request forms, data collection, and filtering',
          output: 'Requests are stored, sorted, and sent where the team actually handles them.',
          demoModule: 'admin-dashboard',
        },
        {
          problem: 'Your documents and sheets are scattered',
          system: 'Document, data, and source-material conversion',
          output: 'Cleaner content, usable tables, PDFs, presentations, or a web overview.',
          demoModule: 'blog-docs',
        },
        {
          problem: 'Customers ask the same questions repeatedly',
          system: 'Light cloud chatbot or assistant',
          output: 'The assistant answers from approved material and escalates harder questions to a human.',
        },
        {
          problem: 'The website needs long-term care',
          system: 'Maintenance, upkeep, and technical support',
          output: 'Small edits, fixes, speed checks, security basics, and calmer operation.',
        },
        {
          problem: 'You need an app without the App Store',
          system: 'Mobile web application',
          output: 'A useful browser-based tool that works well on phones.',
          demoModule: 'admin-dashboard',
        },
        {
          problem: 'The project needs to feel trustworthy',
          system: 'Copy, visual detail, and presentation page',
          output: 'Clearer offer, better examples, and fewer words customers do not understand.',
          demoModule: 'eshop-offers',
        },
      ],
    },
    terminal: {
      sectionCode: '',
      title: 'Write a few sentences. We can clarify the rest together.',
      leadPrefix: 'Fill in the basics and briefly describe what you want to improve. Use your own words.',
      leadCommand: '',
      leadSuffix: '',
      regionAria: 'Simple request form',
      commandLabel: 'Basic details',
      summaryAria: 'Request summary',
      summaryTitle: 'What we know so far',
      runLabel: 'Send request',
      waitLabel: 'Wait',
      initialHistory: 'Fill name, email, project type, and a short message.',
      readyStatus: 'Fill in the required fields. Optional details help estimate scope.',
      sendingStatus: 'Sending request...',
      apiUnavailable: 'The form cannot be submitted in this preview. Open the production version or write by email.',
      storedPrefix: 'stored',
      missingRequiredPrefix: 'Please add',
      emptyCommand: 'The message is empty.',
      unknownCommandPrefix: 'This part cannot be saved',
      unsupportedFieldPrefix: 'This part cannot be saved',
      fieldLabels: {
        name: 'Name',
        email: 'Email',
        company: 'Company',
        project_type: 'Project',
        audience: 'Audience',
        deadline: 'Deadline',
        current_url: 'Current URL',
        budget_range: 'Budget',
        message: 'Message',
      },
      placeholders: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'Company or brand',
        audience: 'Who is the website for?',
        deadline: 'For example, within 6 weeks',
        current_url: 'https://your-site.com',
        budget_range: 'For example, EUR 2k-5k',
        message: 'What do you need to build or improve?',
      },
      projectOptions: [
        'Company website / portfolio',
        'Landing page',
        'Blog / content',
        'SEO and marketing basics',
        'Website maintenance',
        'Mailing and technical support',
        'Light AI / chatbot',
        'Data, database, and forms',
        'Document conversion',
        'Mobile web app',
        'Shop / offer page',
        'Not sure, need advice',
      ],
      optionalTitle: 'Optional details',
      examples: [
        'set name Jan Siroky',
        'set email siroky@radeq.cz',
        'set company Radeq.cz',
        'set project_type Request page',
        'set audience Micro-SaaS founders',
        'set deadline Q3',
        'set current_url https://example.com',
        'set budget_range 50k-100k CZK',
        'set message Need fast lead routing.',
        'summary',
        'submit',
      ],
    },
  },
} as const satisfies Record<Locale, SiteContent>;
