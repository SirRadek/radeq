import { supportedLocales, type Locale } from './locales';
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
      doorLabel: string;
      enableLabel: string;
      enableShortLabel: string;
      disableLabel: string;
      disableShortLabel: string;
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
    mapAria: string;
    items: {
      title: string;
      text: string;
      outputs: string[];
      fit: string;
      examples: string[];
    }[];
  };
  pricing: {
    sectionCode: string;
    title: string;
    lead: string;
    process: {
      eyebrow: string;
      title: string;
      text: string;
      steps: { label: string; value: string }[];
    };
    note: string;
    items: {
      name: string;
      price: string;
      text: string;
      includes: string[];
      output: string;
      featured?: boolean;
    }[];
  };
  about: {
    sectionCode: string;
    title: string;
    lead: string;
    profileTitle: string;
    profileText: string;
    principles: {
      label: string;
      value: string;
    }[];
    bridgeTitle: string;
    bridgeText: string;
    note: string;
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
    requiredNote: string;
    requiredLabel: string;
    optionalLabel: string;
    requiredError: string;
    invalidFieldsPrefix: string;
    invalidEmailError: string;
    invalidUrlError: string;
    selectPlaceholder: string;
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
      title: 'Radeq.cz | Praktická IT pomoc bez technické mlhy',
      description:
        'Radeq.cz pomáhá živnostníkům, jednotlivcům, malým firmám a týmům s automatizací, AI, databázemi, weby a jednodušším provozem.',
      path: '/',
      alternatePath: '/en/',
      alternateLabel: 'EN',
    },
    header: {
      ariaLabel: 'Hlavní navigace',
      brandAria: 'Radeq.cz úvod',
      navAria: 'Hlavní menu',
      navItems: [
        { href: '#about', label: 'Co řeším' },
        { href: '#services', label: 'Služby' },
        { href: '#process', label: 'Jak pracuji' },
        { href: '#pricing', label: 'Ceny' },
        { href: '#terminal', label: 'Kontakt' },
      ],
      cta: 'Chci zmapovat problém',
      styleLabel: 'Téma',
      themeLabel: 'Přepnout barevný režim',
      lightTheme: 'Světlý',
      darkTheme: 'Tmavý',
    },
    hero: {
      metaAria: 'Směr návrhu',
      meta: [],
      title: 'Weby, formuláře a automatizace pro méně ruční práce.',
      lead:
        'Tvořím jednoduché weby, formuláře, evidence, automatizace a AI pomocníky pro živnostníky, malé firmy a týmy, které chtějí mít víc přehledu a méně přepisování.',
      proof: [
        { label: 'Audit od 2 900 Kč', value: 'rychle zjistíme, co brzdí práci' },
        { label: 'Web od 25 000 Kč', value: 'jasná nabídka, formulář a základní nastavení' },
        { label: 'Výstup s návodem', value: 'předání bez závislosti na dodavateli' },
      ],
      actionsAria: 'Hlavní akce',
      actions: [
        { href: '#terminal', label: 'Chci zmapovat problém', variant: 'primary' },
        { href: '#services', label: 'Co umím zjednodušit', variant: 'secondary' },
      ],
      coreAria: 'Interaktivní 3D náhled zrzavé kočičky',
      coreCaption: 'Volitelný pohyb. Web funguje i bez něj.',
      core: {
        doorLabel: 'Kočka',
        enableLabel: 'Otevřít kočičí vstup',
        enableShortLabel: 'Zapnout',
        disableLabel: 'Zavřít kočičí vstup',
        disableShortLabel: 'Vypnout',
        loadingLabel: 'Otevírám...',
        failedLabel: 'Vstup teď nejde otevřít.',
        reducedMotionLabel: 'Pohyb je vypnutý.',
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
      sectionCode: 'Co řeším',
      title: 'Kdy to dává smysl',
      items: [
        {
          title: 'Hodí se, když:',
          signal: '',
        },
        {
          title: '',
          signal: 'poptávky chodí různě a ztrácí se v e-mailech',
        },
        {
          title: '',
          signal: 'ručně přepisujete data mezi tabulkami, formuláři a zprávami',
        },
        {
          title: '',
          signal: 'web nevysvětluje jasně nabídku',
        },
        {
          title: '',
          signal: 'potřebujete jednoduchou evidenci nebo přehled',
        },
        {
          title: '',
          signal: 'chcete využít AI prakticky a bezpečně',
        },
        {
          title: '',
          signal: 'nevíte, kde začít, ale víte, že současný stav brzdí práci',
        },
      ],
    },
    demos: {
      sectionCode: '',
      title: 'Připravované ukázky řešení',
      lead:
        'Postupně doplním jednoduché modelové ukázky: chatbot, poptávkový web, e-shopová nabídka, automatizace procesu, práce s daty, SEO a digitalizace.',
      items: [],
    },
    handoff: {
      sectionCode: '',
      title: 'Důkazem není jen vzhled. Důkazem je i předání.',
      lead: 'Bez velkého veřejného portfolia musí být vidět, jak práce vzniká a jak se ověřuje. Proto je součástí webu i předávací a kontrolní vrstva.',
      items: [
        'Mapa stránek, sekcí a hlavní cesty ke kontaktu',
        'Texty a nadpisy napsané tak, aby jim rozuměl netechnický zákazník',
        'Kontrola mobilního zobrazení, rychlosti, formuláře a základní přístupnosti',
        'SEO základ: titulky, popisy, sitemap, indexovatelný obsah a interní odkazy',
        'Přehled, kde se upravují texty, odkazy, měření a kontaktní údaje',
        'Jasně označené věci mimo rozsah, aby nevznikala falešná očekávání',
      ],
    },
    systems: {
      sectionCode: 'Služby',
      title: 'Co vám můžu zjednodušit',
      lead:
        'Nejdřív řeším výsledek pro práci, až potom technologii. Web, formulář, tabulka nebo AI pomocník má zjednodušit konkrétní problém a jít předat.',
      mapAria: 'Katalog praktické IT pomoci',
      items: [
        {
          title: 'Web, který jasně vysvětlí nabídku',
          text:
            'Pro jednoduché weby, landing pages, redesigny a poptávkové stránky, které mají návštěvníka dovést ke konkrétnímu kroku.',
          outputs: [
            'struktura stránky',
            'textové vedení nabídky',
            'poptávkový formulář',
            'mobilní i desktopová verze',
            'základní technické nastavení',
          ],
          fit: 'Když lidé nerozumí nabídce nebo web nepřivádí použitelné kontakty.',
          examples: [],
        },
        {
          title: 'Formuláře a poptávky bez chaosu',
          text:
            'Pro sběr údajů, kontrolu povinných polí, pořádek v poptávkách a jasnější první kontakt.',
          outputs: [
            'jednoduchý formulář',
            'povinná pole a kontrola vstupů',
            'přehled poptávek',
            'e-mailové potvrzení nebo upozornění',
          ],
          fit: 'Když poptávky chodí různě a nejde rychle poznat, co je potřeba řešit.',
          examples: [],
        },
        {
          title: 'Automatizace opakované práce',
          text:
            'Pro přepisování dat, e-maily, stavy, evidence a reporty, které se dnes dělají pořád dokola.',
          outputs: [
            'návrh jednoduššího toku práce',
            'propojení formulářů, tabulek a e-mailů',
            'hlídání stavů nebo opakujících se úkolů',
            'předání postupu',
          ],
          fit: 'Když lidé ztrácí čas kopírováním, přepisováním nebo dohledáváním stavu.',
          examples: [],
        },
        {
          title: 'Přehledy, data a AI pomocníci',
          text:
            'Pro dokumenty, tabulky, pravidla, veřejná data, jednoduché analýzy a pomocníky s jasným účelem.',
          outputs: [
            'sběr a čištění dat',
            'data z webu do přehledné tabulky',
            'jednoduchý přehled nebo evidence',
            'AI pomocník nad schválenými podklady',
          ],
          fit: 'Když potřebujete lepší kontrolu nad daty a chcete AI použít prakticky a bezpečně.',
          examples: [],
        },
        {
          title: 'Digitalizace provozu',
          text:
            'Pro postupy v hlavě, papírech, poznámkách a roztříštěných tabulkách, které brzdí každodenní práci.',
          outputs: [
            'srovnání současného postupu',
            'jednoduchá evidence nebo databáze',
            'jasná pravidla pro práci s údaji',
            'doporučení další péče',
          ],
          fit: 'Když současný provoz stojí na paměti lidí a nejde snadno předat.',
          examples: [],
        },
      ],
    },
    pricing: {
      sectionCode: 'Orientační ceny',
      title: 'Orientační ceny bez překvapení.',
      lead:
        'Nejdřív si ujasníme rozsah, výstup a další postup. Přesnou cenu dávám po krátkém zadání nebo auditu.',
      process: {
        eyebrow: 'Jak pracuji',
        title: 'Nejdřív pochopím provoz. Pak navrhnu nejjednodušší řešení.',
        text:
          'Cílem je méně chyb, méně ručního přepisování a lepší kontrola nad daty. Ne vždy je potřeba velký systém.',
        steps: [
          { label: 'Pojmenujeme problém', value: 'co se dnes dělá ručně, pomalu, opakovaně nebo chaoticky' },
          { label: 'Vybereme nejmenší funkční řešení', value: 'někdy stačí formulář, tabulka nebo úprava webu' },
          { label: 'Postavím, otestuji a předám', value: 'výsledek s vysvětlením, základním návodem a doporučením další péče' },
        ],
      },
      note:
        'Audit lze odečíst z následné realizace, pokud spolu navážeme na web, automatizaci, evidenci nebo práci s daty.',
      items: [
        {
          name: 'Audit webu nebo procesu',
          price: '2 900–4 900 Kč',
          text: 'Pro situace, kdy něco nefunguje, ale není jasné, co opravit jako první.',
          includes: ['zmapování problému', 'priority', 'doporučený postup', 'odhad další práce'],
          output: 'Audit lze odečíst z následné realizace.',
          featured: true,
        },
        {
          name: 'Startovací web / landing page',
          price: 'od 25 000 Kč',
          text: 'Pro jednoduchou prezentaci služby, nabídky nebo produktu.',
          includes: ['struktura stránky', 'textové vedení', 'responzivní web', 'formulář', 'základní technické nastavení'],
          output: 'Výstup: stránka, která vysvětluje nabídku a sbírá použitelné kontakty.',
        },
        {
          name: 'Automatizace, evidence a práce s daty',
          price: 'od 8 000 Kč',
          text: 'Pro ruční přepisování, nepropojené tabulky, formuláře, e-maily nebo jednoduché evidence.',
          includes: ['určení nejmenšího řešení', 'formulář, evidence nebo propojení', 'kontrola vstupů', 'předání postupu'],
          output: 'Nejdřív určíme, jestli stačí malá úprava, formulář, evidence nebo větší řešení.',
        },
      ],
    },
    about: {
      sectionCode: 'O RadeQ',
      title: 'Jeden technický partner pro obsah, data i klidné vysvětlení.',
      lead:
        'Za RadeQ stojí přímá domluva pro jednotlivce, živnostníky, malé firmy a týmy bez vlastního IT člověka. Probereme situaci, srovnáme podklady, vybereme přiměřené řešení a výsledek vysvětlím tak, abyste mu rozuměli i po předání.',
      profileTitle: 'Jak spolupráce vypadá',
      profileText:
        'Opírám se o zkušenost z aplikační analýzy, správy databází, webů, SEO a copywritingu. Nejdřív překládám problém do srozumitelných rozhodnutí, až potom vybírám technologii a stavím.',
      principles: [
        {
          label: 'Jeden kontakt',
          value: 'Od prvního rozhovoru po předání víte, s kým mluvíte.',
        },
        {
          label: 'Srozumitelně',
          value: 'Rozhodnutí vysvětlím lidsky, ne seznamem technických zkratek.',
        },
        {
          label: 'Přiměřený rozsah',
          value: 'Malá oprava zůstane malá. Větší systém dostane jasné etapy.',
        },
        {
          label: 'Předání',
          value: 'Dostanete přehled, co vzniklo, kde se to upravuje a co zůstává mimo rozsah.',
        },
      ],
      bridgeTitle: 'Web není konec řešení, ale vstup do systému.',
      bridgeText:
        'Cílem je méně ruční práce, méně chaosu a více přehledu. Služby se proto dají skládat dohromady: web, formulář, data, automatizace, měření i jednoduchá AI podpora.',
      note: 'Cílem není dodat co nejvíc techniky. Cílem je, aby web a navazující nástroje přestaly překážet a začaly se dát normálně používat.',
    },
    terminal: {
      sectionCode: '',
      title: 'Chci zmapovat problém',
      leadPrefix: 'Stručně napište, co chcete zjednodušit. Ozvu se a společně vybereme nejmenší smysluplný krok.',
      leadCommand: '',
      leadSuffix: '',
      regionAria: 'Jednoduchý poptávkový formulář',
      commandLabel: 'Krátká poptávka',
      summaryAria: 'Souhrn poptávky',
      summaryTitle: 'Co zatím víme',
      runLabel: 'Odeslat',
      waitLabel: 'Odesílám…',
      initialHistory: 'Popište problém, současné nástroje a kontakt.',
      readyStatus: 'Vyplňte stručný popis, současné nástroje a kontakt.',
      sendingStatus: 'Odesílám poptávku…',
      apiUnavailable: 'Formulář se nepodařilo odeslat. Zkuste to prosím později nebo napište e-mailem.',
      storedPrefix: 'Poptávka uložena',
      missingRequiredPrefix: 'Doplňte prosím',
      requiredNote: 'Stačí stručně. Podrobnosti můžeme doplnit později.',
      requiredLabel: 'Povinné',
      optionalLabel: 'Volitelné',
      requiredError: 'Doplňte toto pole.',
      invalidFieldsPrefix: 'Zkontrolujte prosím',
      invalidEmailError: 'Zadejte platnou e-mailovou adresu.',
      invalidUrlError: 'Adresa musí začínat http:// nebo https://.',
      selectPlaceholder: 'Vyberte možnost',
      emptyCommand: 'Zpráva je prázdná.',
      unknownCommandPrefix: 'Tuhle část neumím uložit',
      unsupportedFieldPrefix: 'Tuhle část neumím uložit',
      fieldLabels: {
        name: 'Jméno',
        email: 'Kontakt',
        company: 'Firma',
        project_type: 'Co dnes používáte?',
        audience: 'Publikum',
        deadline: 'Termín',
        current_url: 'Současná URL',
        budget_range: 'Rozpočet',
        message: 'Co potřebujete zjednodušit?',
      },
      placeholders: {
        name: 'Např. Jan Novák…',
        email: 'Např. jan@example.cz…',
        company: 'Firma nebo značka…',
        audience: 'Pro koho je web určený…',
        deadline: 'Např. během 4-8 týdnů…',
        current_url: 'Např. https://vas-web.cz…',
        budget_range: 'Např. 25-50 tis. Kč…',
        message: 'Např. poptávky se ztrácí v e-mailech a ručně je přepisuji do tabulky…',
      },
      projectOptions: [
        'Web',
        'E-mail',
        'Tabulky',
        'Formulář',
        'Jiné / kombinace nástrojů',
      ],
      optionalTitle: 'Volitelné upřesnění',
      examples: [
        'set name Jan Siroky',
        'set email siroky@radeq.cz',
        'set company Radeq.cz',
        'set project_type Tabulky',
        'set audience majitelé menších firem',
        'set deadline do 8 týdnů',
        'set current_url https://example.com',
        'set budget_range 25k-50k CZK',
        'set message Potřebuji zjednodušit poptávky a méně je přepisovat ručně.',
        'summary',
        'submit',
      ],
    },
  },
  en: {
    layout: {
      lang: 'en',
      title: 'Radeq.cz | Practical IT help without technical fog',
      description:
        'Radeq.cz helps individuals, sole traders, small businesses, and teams with automation, AI, databases, websites, and simpler operations.',
      path: '/en/',
      alternatePath: '/',
      alternateLabel: 'CZ',
    },
    header: {
      ariaLabel: 'Primary navigation',
      brandAria: 'Radeq.cz home',
      navAria: 'Main menu',
      navItems: [
        { href: '#about', label: 'What I solve' },
        { href: '#services', label: 'Services' },
        { href: '#process', label: 'How I work' },
        { href: '#pricing', label: 'Prices' },
        { href: '#terminal', label: 'Contact' },
      ],
      cta: 'Map the problem',
      styleLabel: 'Themes',
      themeLabel: 'Switch color mode',
      lightTheme: 'Light',
      darkTheme: 'Dark',
    },
    hero: {
      metaAria: 'Design direction',
      meta: [],
      title: 'Websites, forms, and automation for less manual work.',
      lead:
        'I build simple websites, forms, records, automations, and AI helpers for sole traders, small companies, and teams that want more overview and less retyping.',
      proof: [
        { label: 'Audit from CZK 2,900', value: 'we quickly find what slows work down' },
        { label: 'Website from CZK 25,000', value: 'clear offer, form, and basic setup' },
        { label: 'Output with instructions', value: 'handoff without supplier lock-in' },
      ],
      actionsAria: 'Primary actions',
      actions: [
        { href: '#terminal', label: 'Map the problem', variant: 'primary' },
        { href: '#services', label: 'What I can simplify', variant: 'secondary' },
      ],
      coreAria: 'Interactive 3D ginger cat preview',
      coreCaption: 'Optional motion. The website works without it.',
      core: {
        doorLabel: 'Cat',
        enableLabel: 'Open cat entrance',
        enableShortLabel: 'On',
        disableLabel: 'Close cat entrance',
        disableShortLabel: 'Off',
        loadingLabel: 'Loading cat...',
        failedLabel: 'The entrance cannot open right now.',
        reducedMotionLabel: 'Motion is disabled.',
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
      sectionCode: 'What I solve',
      title: 'When this makes sense',
      items: [
        {
          title: 'Useful when:',
          signal: '',
        },
        {
          title: '',
          signal: 'requests arrive through different channels and disappear in email',
        },
        {
          title: '',
          signal: 'data is copied by hand between sheets, forms, and messages',
        },
        {
          title: '',
          signal: 'the website does not explain the offer clearly',
        },
        {
          title: '',
          signal: 'you need a simple record or overview',
        },
        {
          title: '',
          signal: 'you want to use AI practically and safely',
        },
        {
          title: '',
          signal: 'you do not know where to start, but the current state slows work down',
        },
      ],
    },
    demos: {
      sectionCode: '',
      title: 'Planned solution examples',
      lead:
        'I will gradually add simple model examples: chatbot, request website, e-shop offer, process automation, data work, SEO, and digitization.',
      items: [],
    },
    handoff: {
      sectionCode: '',
      title: 'The proof is not only the look. The proof is also the handoff.',
      lead: 'Without a large public portfolio, the work must show how it is made and checked. That is why the website includes a clear handoff and quality layer.',
      items: [
        'A map of pages, sections, and the main contact path',
        'Copy and headings written for non-technical customers',
        'Checks for mobile layout, speed, form behavior, and basic accessibility',
        'SEO basics: titles, descriptions, sitemap, indexable content, and internal links',
        'Notes on where copy, links, measurement, and contact details are maintained',
        'Clear out-of-scope notes so expectations stay realistic',
      ],
    },
    systems: {
      sectionCode: 'Services',
      title: 'What I can simplify for you',
      lead:
        'I start with the work outcome, then choose the technology. A website, form, sheet, or AI helper should solve a concrete problem and be easy to hand over.',
      mapAria: 'Catalog of practical IT help',
      items: [
        {
          title: 'A website that clearly explains the offer',
          text:
            'For simple websites, landing pages, redesigns, and request pages that should move visitors toward a concrete next step.',
          outputs: ['page structure', 'offer-guiding copy', 'request form', 'mobile and desktop version', 'basic technical setup'],
          fit: 'When people do not understand the offer or the website does not bring usable contacts.',
          examples: [],
        },
        {
          title: 'Forms and requests without chaos',
          text: 'For collecting details, checking required fields, keeping requests in order, and making first contact clearer.',
          outputs: ['simple form', 'required fields and input checks', 'request overview', 'email confirmation or alert'],
          fit: 'When requests arrive in different places and it is hard to see what needs action.',
          examples: [],
        },
        {
          title: 'Automation of repeated work',
          text: 'For copied data, emails, statuses, records, and reports that are handled again and again.',
          outputs: ['simpler work flow', 'forms, sheets, and email connections', 'status or repeated-task checks', 'handoff notes'],
          fit: 'When people lose time copying, retyping, or searching for status.',
          examples: [],
        },
        {
          title: 'Overviews, data, and AI helpers',
          text: 'For documents, spreadsheets, rules, public data, simple analysis, and helpers with a clear job.',
          outputs: ['data collection and cleanup', 'public-source data into a clear sheet', 'simple overview or records', 'AI helper over approved material'],
          fit: 'When you need better control over data and want practical, safe AI.',
          examples: [],
        },
        {
          title: 'Operational digitization',
          text:
            'For procedures living in people’s heads, paper, notes, and scattered sheets that slow down daily work.',
          outputs: ['current-process cleanup', 'simple records or database', 'clear rules for working with data', 'care recommendations'],
          fit: 'When the current operation depends on memory and is hard to hand over.',
          examples: [],
        },
      ],
    },
    pricing: {
      sectionCode: 'Indicative pricing',
      title: 'Indicative prices without surprises.',
      lead:
        'First we clarify scope, output, and next steps. The exact price follows a short brief or audit.',
      process: {
        eyebrow: 'How I work',
        title: 'First I understand the operation. Then I suggest the simplest solution.',
        text:
          'The goal is fewer mistakes, less manual retyping, and better control over data. A large system is not always needed.',
        steps: [
          { label: 'Name the problem', value: 'what is manual, slow, repeated, or messy today' },
          { label: 'Choose the smallest useful solution', value: 'sometimes a form, sheet, or website adjustment is enough' },
          { label: 'Build, test, and hand over', value: 'the result includes explanation, basic instructions, and care recommendations' },
        ],
      },
      note:
        'The audit can be deducted from the follow-up implementation when we continue with a website, automation, records, or data work.',
      items: [
        {
          name: 'Website or process audit',
          price: 'CZK 2,900–4,900',
          text: 'For situations where something does not work, but the first fix is not clear.',
          includes: ['problem mapping', 'priorities', 'recommended next steps', 'next-work estimate'],
          output: 'The audit can be deducted from follow-up implementation.',
          featured: true,
        },
        {
          name: 'Starter website / landing page',
          price: 'from CZK 25,000',
          text: 'For a simple presentation of a service, offer, or product.',
          includes: ['page structure', 'visitor guidance copy', 'responsive website', 'form', 'basic technical setup'],
          output: 'Output: a page that explains the offer and collects usable contacts.',
        },
        {
          name: 'Automation, records, and data work',
          price: 'from CZK 8,000',
          text: 'For copied data, disconnected sheets, forms, emails, or simple records.',
          includes: ['smallest-solution decision', 'form, records, or connection', 'input checks', 'handoff notes'],
          output: 'First we decide whether a small adjustment, form, records, or a larger solution makes sense.',
        },
      ],
    },
    about: {
      sectionCode: 'About RadeQ',
      title: 'One technical partner for content, data, and plain explanation.',
      lead:
        'RadeQ is direct collaboration for individuals, sole traders, small businesses, and teams without an in-house IT person. I clarify the situation, organize the source material, choose a fitting solution, and hand over work you can understand after launch.',
      profileTitle: 'How the collaboration works',
      profileText:
        'The work draws on application analysis, database administration, website operations, SEO, and copywriting. First I translate the problem into clear decisions, then I choose the technology and build.',
      principles: [
        {
          label: 'One contact',
          value: 'From the first conversation to handoff, you know who you are speaking with.',
        },
        {
          label: 'Plain language',
          value: 'Decisions are explained clearly, not hidden behind technical abbreviations.',
        },
        {
          label: 'Right-sized scope',
          value: 'A small repair stays small. A larger system gets clear stages.',
        },
        {
          label: 'Handoff',
          value: 'You get a plain overview of what was built, where to edit it, and what remains outside the scope.',
        },
      ],
      bridgeTitle: 'A website is not the end of the solution. It is an entry point into a system.',
      bridgeText:
        'The goal is less manual work, less chaos, and more overview. Services can be combined: website, form, data, automation, measurement, and simple AI support.',
      note:
        'The goal is not to deliver the most technology. The goal is for the website and related tools to stop getting in the way and start being usable.',
    },
    terminal: {
      sectionCode: '',
      title: 'Map the problem',
      leadPrefix: 'Briefly describe what you want to simplify. I will reply and we will choose the smallest useful next step.',
      leadCommand: '',
      leadSuffix: '',
      regionAria: 'Simple request form',
      commandLabel: 'Short request',
      summaryAria: 'Request summary',
      summaryTitle: 'What we know so far',
      runLabel: 'Send',
      waitLabel: 'Sending…',
      initialHistory: 'Describe the problem, current tools, and contact.',
      readyStatus: 'Fill in a short description, current tools, and contact.',
      sendingStatus: 'Sending request…',
      apiUnavailable: 'The form could not be submitted. Please try again later or write by email.',
      storedPrefix: 'Request stored',
      missingRequiredPrefix: 'Please add',
      requiredNote: 'Keep it short. Details can be added later.',
      requiredLabel: 'Required',
      optionalLabel: 'Optional',
      requiredError: 'Complete this field.',
      invalidFieldsPrefix: 'Please check',
      invalidEmailError: 'Enter a valid email address.',
      invalidUrlError: 'The address must start with http:// or https://.',
      selectPlaceholder: 'Choose an option',
      emptyCommand: 'The message is empty.',
      unknownCommandPrefix: 'This part cannot be saved',
      unsupportedFieldPrefix: 'This part cannot be saved',
      fieldLabels: {
        name: 'Name',
        email: 'Contact',
        company: 'Company',
        project_type: 'What do you use today?',
        audience: 'Audience',
        deadline: 'Deadline',
        current_url: 'Current URL',
        budget_range: 'Budget',
        message: 'What do you need to simplify?',
      },
      placeholders: {
        name: 'For example, Jane Smith…',
        email: 'For example, jane@example.com…',
        company: 'Company or brand…',
        audience: 'Who is the website for…',
        deadline: 'For example, within 4-8 weeks…',
        current_url: 'For example, https://your-site.com…',
        budget_range: 'For example, CZK 25k-50k…',
        message: 'For example, requests get lost in email and are copied into a sheet by hand…',
      },
      projectOptions: [
        'Website',
        'Email',
        'Spreadsheets',
        'Form',
        'Other / combined tools',
      ],
      optionalTitle: 'Optional details',
      examples: [
        'set name Jan Siroky',
        'set email siroky@radeq.cz',
        'set company Radeq.cz',
        'set project_type Spreadsheets',
        'set audience small business owners',
        'set deadline within 8 weeks',
        'set current_url https://example.com',
        'set budget_range 25k-50k CZK',
        'set message Need to simplify incoming requests and copy less data by hand.',
        'summary',
        'submit',
      ],
    },
  },
} as const satisfies Record<Locale, SiteContent>;
