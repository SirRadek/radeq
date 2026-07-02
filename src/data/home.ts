import type { Locale } from './locales';

export type ProblemGenreKey = 'western' | 'drama' | 'comedy' | 'horror' | 'silent-film' | 'detective';

export type HomeNavItem = {
  href: string;
  label: string;
};

export type HomeContent = {
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    alternatePath: string;
    alternateLabel: string;
  };
  nav: {
    ariaLabel: string;
    navAriaLabel: string;
    brandAriaLabel: string;
    homeHref: string;
    items: readonly HomeNavItem[];
  };
  hero: {
    eyebrow: string;
    title: string;
    typewriter: {
      prefix: string;
      words: readonly string[];
      sizerWord: string;
      initialWord: string;
      liveText: string;
    };
    lead: string;
    journeyNote: string;
    proofAriaLabel: string;
    proofItems: readonly {
      label: string;
      text: string;
    }[];
    actions: {
      primary: HomeNavItem;
      secondary: HomeNavItem;
      secondaryMicro: string;
      micro: string;
    };
  };
  problems: {
    eyebrow: string;
    title: string;
    lead: string;
    severityLegend: {
      strong: string;
      text: string;
    };
    controlsAriaLabel: string;
    previousLabel: string;
    nextLabel: string;
    carouselAriaLabel: string;
    severitySrPrefix: string;
    severitySrSuffix: string;
    tagline: string;
    findingLabels: {
      problem: string;
      cause: string;
      verify: string;
      step: string;
    };
    ctaLabel: string;
    servicePrefix: string;
    auditPreview: {
      text: string;
      href: string;
      label: string;
    };
    items: readonly {
      id: string;
      role: 'lead' | 'support';
      severity: number;
      genre: string;
      genreKey: ProblemGenreKey;
      genreColor: string;
      hook: string;
      symptom: string;
      problem: string;
      cause: string;
      verify: string;
      step: string;
      service: string;
      primaryServiceId: string;
      relatedServiceIds: readonly string[];
    }[];
  };
  marquee: {
    ariaLabel: string;
    items: readonly string[];
  };
  services: {
    eyebrow: string;
    title: string;
    ariaLabel: string;
    ctaLabel: string;
    liveFallback: string;
    livePrefix: string;
    items: readonly {
      id: string;
      slot: string;
      className?: string;
      featured?: boolean;
      flag?: string;
      price: string;
      title: string;
      result: string;
      outputs: readonly string[];
    }[];
  };
  journey: {
    eyebrow: string;
    title: string;
    timelineText: string;
    timelineNote: string;
    startCap: string;
    endCap: string;
    tablistAriaLabel: string;
    preview: {
      start: {
        eyebrow: string;
        title: string;
        problemLabel: string;
        problem: string;
        stepLabel: string;
        step: string;
        ctaLabel: string;
      };
      end: {
        badge: string;
        kicker: string;
        title: string;
        text: string;
        ctaLabel: string;
      };
    };
    panelLabels: {
      solve: string;
      duration: string;
      process: string;
      benefit: string;
      tagListAriaPrefix: string;
    };
    phases: readonly {
      id: string;
      number: string;
      title: string;
      duration: string;
      solve: string;
      process: string;
      benefit: string;
      tags: readonly {
        label: string;
        value: string;
        strong?: boolean;
      }[];
      final?: boolean;
    }[];
    trustAriaLabel: string;
    trustPoints: readonly string[];
  };
  guarantee: {
    eyebrow: string;
    title: string;
    text: string;
  };
  about: {
    eyebrow: string;
    name: string;
    title: string;
    paragraphs: readonly string[];
    photo: {
      src: string;
      src2x: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    audit: {
      kicker: string;
      title: string;
      price: string;
      creditedLine: string;
      coverage: readonly string[];
      coverageAriaLabel: string;
      scopeAriaLabel: string;
      scope: readonly {
        label: string;
        text: string;
      }[];
      ctaLabel: string;
      measureHref: string;
      measureLabel: string;
    };
    proofStrip: {
      eyebrow: string;
      line: string;
      previewLabel: string;
      paidLabel: string;
    };
    projectTitle: string;
    projectNote: string;
    careTitle: string;
    projectItems: readonly {
      name: string;
      price: string;
    }[];
    ariaLabel: string;
    note: string;
    items: readonly {
      title: string;
      price: string;
      suffix?: string;
      text: string;
      ctaLabel: string;
      featured?: boolean;
      badge?: string;
      automationBadge?: string;
    }[];
  };
  showcase: {
    eyebrow: string;
    title: string;
    items: readonly {
      href: string;
      className: string;
      badge: string;
      kicker: string;
      title: string;
      text: string;
      linkLabel: string;
    }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    fields: {
      name: string;
      email: string;
      projectType: string;
      message: string;
      budget: string;
      deadline: string;
      deadlinePlaceholder: string;
      honeypot: string;
    };
    projectOptions: readonly {
      label: string;
      value: string;
    }[];
    budgetOptions: readonly {
      label: string;
      value: string;
    }[];
    optionalSummary: string;
    submitLabel: string;
    notePrefix: string;
    noteEmail: string;
    notePhone: string;
    status: {
      sending: string;
      success: string;
      failureHtml: string;
      verifyPrompt: string;
    };
    doneLeadHtml: string;
  };
  footer: {
    tagline: string;
    navTitle: string;
    navAriaLabel: string;
    connectionTitle: string;
    connectionLinks: readonly HomeNavItem[];
    legal: string;
    contactEmail: string;
    contactPhone: string;
    mascotEnableLabel?: string;
    mascotDisableLabel?: string;
  };
  guide: {
    toggleLabel: string;
    eyebrow: string;
    title: string;
    closeLabel: string;
    intro: string;
    quickActionsAriaLabel: string;
    initialMessage: string;
    inputLabel: string;
    inputPlaceholder: string;
    sendLabel: string;
    topics: Record<string, {
      chipLabel?: string;
      text: string;
      href: string;
      label: string;
      followups?: readonly {
        key: string;
        label: string;
      }[];
    }>;
    fallback: {
      text: string;
      href: string;
      label: string;
    };
    matchers: Record<string, readonly string[]>;
  };
  schema: {
    description: string;
    url: string;
    areaServed: string;
    founderName: string;
    addressLocality: string;
    addressCountry: string;
    knowsAbout: readonly string[];
  };
};

const problemGenreColors: Record<ProblemGenreKey, string> = {
  western: '#D2B48C',
  drama: '#AAB7B8',
  comedy: '#F4D03F',
  horror: '#C0392B',
  'silent-film': '#7F8C8D',
  detective: '#2E4053',
};

const csProblems: HomeContent['problems']['items'] = [
  {
    id: 'web-poptavky',
    role: 'lead',
    severity: 5,
    genre: 'Komedie',
    genreKey: 'comedy',
    genreColor: problemGenreColors.comedy,
    hook: 'Návštěvník přijde, rozhlédne se a odejde bez jasné cesty ke kontaktu.',
    symptom: 'Web nevede k poptávce',
    problem: 'Web jen existuje, ale návštěvník nedojde ke kontaktu.',
    cause: 'Nejasná nabídka a slabé výzvy k akci; návštěvník neví, co má udělat.',
    verify: 'cestu od příchodu ke kontaktu, srozumitelnost nabídky a jestli se vůbec měří.',
    step: 'krátký audit a úprava struktury + jasné CTA.',
    service: 'Web a redesign / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'data'],
  },
  {
    id: 'nejasny-krok',
    role: 'lead',
    severity: 5,
    genre: 'Komedie',
    genreKey: 'comedy',
    genreColor: problemGenreColors.comedy,
    hook: 'Dobrá služba zůstane bez odezvy, když další krok není vidět na první pohled.',
    symptom: 'Nabídka / další krok není jasný',
    problem: 'Zákazník nerozumí nabídce nebo neví, co udělat dál.',
    cause: 'texty mluví příliš obecně a chybí jasné navedení na další krok.',
    verify: 'srozumitelnost nabídky, text výzvy k akci a cestu k formuláři nebo telefonu.',
    step: 'upravit strukturu stránky tak, aby další krok byl zřejmý bez vysvětlování.',
    service: 'Web a redesign / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'poptavky-email',
    role: 'support',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'Každá zpráva má vlastní dějovou linku a nikdo nevidí, v jaké je scéně.',
    symptom: 'Poptávky se ztrácejí v e-mailech',
    problem: 'Poptávky přijdou, ale další krok se řeší ručně a bez jasného stavu.',
    cause: 'e-maily se zpracovávají ručně a chybí jednotný přehled o stavu poptávek.',
    verify: 'kde se poptávky hromadí a které informace se dohledávají dodatečně.',
    step: 'propojit formulář s jednoduchým přehledem + automatické potvrzení přijetí.',
    service: 'Automatizace procesů',
    primaryServiceId: 'automation',
    relatedServiceIds: ['audit', 'data'],
  },
  {
    id: 'rucni-data',
    role: 'support',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'Stejná data hrají ve více systémech a pokaždé je někdo přepisuje znovu.',
    symptom: 'Data/úkoly přepisujete ručně',
    problem: 'Data přepisujete mezi tabulkami pořád dokola.',
    cause: 'systémy spolu nemluví a data se přenášejí ručně.',
    verify: 'která data se přepisují nejčastěji a kde kvůli ručnímu zadávání hrozí chyby.',
    step: 'automaticky propojit jeden přenos (např. tabulka → fakturace).',
    service: 'Automatizace procesů',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'fakturace-papiry',
    role: 'support',
    severity: 5,
    genre: 'Horor',
    genreKey: 'horror',
    genreColor: problemGenreColors.horror,
    hook: 'Přes den děláte práci pro klienty, večer doháníte administrativu.',
    symptom: 'Fakturace a papírování po večerech',
    problem: 'Doklady, podklady a opakované administrativní kroky se vrací ve chvíli, kdy už má být hotovo.',
    cause: 'proces není poskládaný do jednoduchého toku a část informací se dohledává až při fakturaci.',
    verify: 'jak vzniká zakázka, kde se berou podklady pro fakturu a které kroky se opakují ručně.',
    step: 'srovnat postup od poptávky po doklad a navrhnout malé zjednodušení bez výměny celého systému.',
    service: 'Automatizace procesů / Audit',
    primaryServiceId: 'automation',
    relatedServiceIds: ['audit', 'data'],
  },
  {
    id: 'zacatek-ai',
    role: 'support',
    severity: 4,
    genre: 'Drama',
    genreKey: 'drama',
    genreColor: problemGenreColors.drama,
    hook: 'Trailerů je hodně, ale chybí scénář, kde AI opravdu pomůže vašemu provozu.',
    symptom: 'Nevíte, kde začít / kde dává smysl AI',
    problem: 'Máte víc možností než jistoty a nechcete začít drahým nástrojem naslepo.',
    cause: 'moc možností a žádná priorita.',
    verify: 'současný stav, opakovanou práci a podklady, nad kterými by AI případně dávala smysl.',
    step: 'krátký audit, který dá jasné pořadí kroků a oddělí užitečné nápady od slepých uliček.',
    service: 'Audit / Data a AI pomocníci',
    primaryServiceId: 'audit',
    relatedServiceIds: ['data', 'automation'],
  },
  {
    id: 'mereni-prehled',
    role: 'support',
    severity: 3,
    genre: 'Drama',
    genreKey: 'drama',
    genreColor: problemGenreColors.drama,
    hook: 'Bez přehledu se špatně pozná, která scéna vydělává a která jen zabírá čas.',
    symptom: 'Chybí měření a přehled',
    problem: 'Nevíte, co na webu nebo v procesu měřit.',
    cause: 'chybí jednoduché měření cílů (poptávka, telefon).',
    verify: 'co je vlastně cíl a jestli se dnes sleduje.',
    step: 'nastavit přehledné měření bez přehnané analytiky.',
    service: 'Data a AI / Audit',
    primaryServiceId: 'data',
    relatedServiceIds: ['audit', 'web'],
  },
  {
    id: 'opakujici-dotazy',
    role: 'lead',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'Zákazník se ptá na cenu, termín nebo postup a vy znovu píšete odpověď, kterou už jste psali mnohokrát.',
    symptom: 'Pořád odpovídáte na stejné dotazy',
    problem: 'Opakované dotazy berou čas a každá odpověď vzniká ručně.',
    cause: 'odpovědi nemáte sepsané na jednom místě a každou zprávu tvoříte znovu z hlavy.',
    verify: 'které dotazy se vrací, kde jsou správné odpovědi a co smí asistent pouze navrhnout, ne odeslat.',
    step: 'sepsat časté dotazy, připravit vzorové odpovědi a navrhnout AI pomocníka nad ověřenými podklady.',
    service: 'Data a AI pomocníci / Automatizace',
    primaryServiceId: 'data',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'prvni-kontakt-mimo-pracovni-dobu',
    role: 'lead',
    severity: 5,
    genre: 'Němý film',
    genreKey: 'silent-film',
    genreColor: problemGenreColors['silent-film'],
    hook: 'Poptávka přijde večer, ale první užitečná reakce vznikne až ve chvíli, kdy už řešíte další práci.',
    symptom: 'První kontakt čeká do rána nebo do pondělí',
    problem: 'Zájemce nedostane základní odpověď ani jasný další krok ve chvíli, kdy má zájem.',
    cause: 'chybí automatická odpověď, která potvrdí přijetí, položí doplňující otázky a předá věc dál.',
    verify: 'kdy dotazy chodí, co lze bezpečně odpovědět automaticky a které informace je potřeba získat před osobní odpovědí.',
    step: 'navrhnout první odpověď, sběr základních údajů a předání poptávky do dalšího kroku.',
    service: 'Automatizace procesů / Web',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'web'],
  },
  {
    id: 'poptavka-bez-podkladu',
    role: 'support',
    severity: 4,
    genre: 'Detektivka',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'Zákazník napíše „kolik by to stálo“, ale chybí rozsah, termín, fotky nebo rozhodující detaily.',
    symptom: 'Poptávka přijde bez důležitých podkladů',
    problem: 'Nacenění nebo odpověď se zdržuje, protože informace musíte doptávat ručně.',
    cause: 'Formulář, e-mail nebo první odpověď nevede zákazníka k tomu, aby dodal minimum potřebných údajů.',
    verify: 'jaké podklady potřebujete pro rozhodnutí, co dnes nejčastěji chybí a kde se zákazník zasekne.',
    step: 'upravit sběr poptávky a připravit automatické doptání podle typu požadavku.',
    service: 'Automatizace procesů / Data a AI',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'follow-up-poptavek',
    role: 'lead',
    severity: 4,
    genre: 'Detektivka',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'Nabídka odejde a další připomenutí závisí na tom, jestli si na ni někdo včas vzpomene.',
    symptom: 'Po odeslání nabídky se follow-up ztrácí',
    problem: 'Rozpracované poptávky zůstávají bez dalšího kroku, i když zákazník ještě nerozhodl.',
    cause: 'Chybí stav poptávky, připomínka další akce a jednoduchá šablona navazující zprávy.',
    verify: 'kde dnes evidujete nabídky, kdy se ozýváte znovu a jak poznáte, že je potřeba další krok.',
    step: 'nastavit jednoduchý přehled stavů, připomínky a návrhy navazujících e-mailů.',
    service: 'Automatizace procesů / Data a AI',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'terminy-bez-pripomenuti',
    role: 'support',
    severity: 4,
    genre: 'Němý film',
    genreKey: 'silent-film',
    genreColor: problemGenreColors['silent-film'],
    hook: 'Schůzka je domluvená, ale potvrzení, instrukce a připomenutí pořád držíte v hlavě.',
    symptom: 'Termíny a podklady se musí připomínat ručně',
    problem: 'Klienti zapomínají termíny, chodí nepřipravení nebo posílají podklady na poslední chvíli.',
    cause: 'Potvrzení a připomínky nejsou součástí jednoho postupu po domluvě termínu.',
    verify: 'jak se termíny potvrzují, jaké informace se opakovaně posílají a kde vznikají nedorozumění nebo no-show.',
    step: 'navrhnout automatické potvrzení, připomenutí a seznam toho, co má klient dodat předem.',
    service: 'Automatizace procesů / Web',
    primaryServiceId: 'automation',
    relatedServiceIds: ['web', 'audit'],
  },
  {
    id: 'ukoly-po-schuzce',
    role: 'support',
    severity: 4,
    genre: 'Detektivka',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'Schůzka proběhne dobře, ale zápis, úkoly a další e-mail vznikají až později nebo vůbec.',
    symptom: 'Úkoly po schůzce zůstávají v poznámkách',
    problem: 'Dohodnuté kroky se rozpadnou mezi poznámky, e-mail a paměť lidí.',
    cause: 'Zápis ze schůzky nemá pevný tvar a nepřevádí se rovnou na úkoly, termíny a follow-up.',
    verify: 'jak dnes vzniká zápis, kdo má další krok a kde se hlídají termíny.',
    step: 'připravit šablonu zápisu a tok, který z ní vytvoří úkoly, připomínky a návrh následné zprávy.',
    service: 'Automatizace procesů / Data a AI',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'emaily-bez-priorit',
    role: 'support',
    severity: 3,
    genre: 'Horor',
    genreKey: 'horror',
    genreColor: problemGenreColors.horror,
    hook: 'V jednom proudu leží poptávky, dotazy, urgence, interní věci i zprávy, které počkají.',
    symptom: 'Den začíná tříděním e-mailů a zpráv',
    problem: 'Hodně času padne jen na rozhodování, čemu se věnovat dřív.',
    cause: 'Zprávy nejsou tříděné podle typu, naléhavosti a dalšího kroku.',
    verify: 'odkud zprávy chodí, jaké typy se opakují a podle čeho se pozná priorita.',
    step: 'nastavit základní třídění, štítky, denní přehled a šablony odpovědí pro časté typy zpráv.',
    service: 'Data a AI pomocníci / Automatizace',
    primaryServiceId: 'data',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'stav-zakazek-v-hlave',
    role: 'support',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'Víte, že se na něčem pracuje, ale přesný stav, termín a další krok se musí dohledávat.',
    symptom: 'Stav zakázek a termínů nosíte v hlavě',
    problem: 'Přehled o zakázkách závisí na paměti, e-mailech a jednotlivých tabulkách.',
    cause: 'Chybí jednoduchý provozní přehled, který propojí stav, odpovědnou osobu, termín a poslední komunikaci.',
    verify: 'jaké stavy zakázka prochází, kde vznikají změny a co potřebujete vidět každý den.',
    step: 'navrhnout malý přehled zakázek s připomínkami a návazností na e-mail nebo tabulku.',
    service: 'Data a AI pomocníci / Automatizace',
    primaryServiceId: 'data',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'eshop-pomaly',
    role: 'support',
    severity: 4,
    genre: 'Detektivka',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'Než se produkty vůbec zobrazí, návštěvník ztratí trpělivost a odejde.',
    symptom: 'E-shop se načítá pomalu',
    problem: 'Pomalé načítání odrazuje zákazníky dřív, než vůbec uvidí nabídku.',
    cause: 'nekomprimované obrázky, zbytečné skripty, slabé cacheování a zatížený hosting.',
    verify: 'reálnou rychlost načítání na mobilu, váhu stránky a co ji nejvíc brzdí.',
    step: 'změřit, co web nejvíc brzdí, a odstranit největší brzdu jako první.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'eshop-konverze',
    role: 'support',
    severity: 4,
    genre: 'Drama',
    genreKey: 'drama',
    genreColor: problemGenreColors.drama,
    hook: 'Utrácíte za reklamu na to hlavní, ale objednávky míří na drobnosti s nízkou marží.',
    symptom: 'Lidé kupují jiné zboží, než chcete',
    problem: 'Nejprodávanější zboží nejsou položky, na kterých stojí zisk.',
    cause: 'prémiové produkty nejsou vidět, produktové stránky jsou slabé a nákup nikam nevede.',
    verify: 'strukturu katalogu, produktové stránky s vysokou marží a co se opravdu prodává oproti plánu.',
    step: 'zvýraznění klíčových produktů, silnější produktové stránky a jasná cesta k nákupu.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'eshop-seo',
    role: 'support',
    severity: 4,
    genre: 'Detektivka',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'Zákazník hledá přesně to, co prodáváte — a najde konkurenci, ne vás.',
    symptom: 'E-shop není vidět ve vyhledávání',
    problem: 'Vyhledávače e-shop přehlížejí — chybí mu technický základ a popisky produktů.',
    cause: 'produkty bez unikátních popisů, chybějící struktura, klíčová slova a měření.',
    verify: 'viditelnost ve vyhledávání, stav popisů a struktury produktů a co hledá konkurence.',
    step: 'SEO základ — popisy produktů, struktura a klíčová slova podle toho, co lidé hledají.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'eshop-sprava',
    role: 'support',
    severity: 3,
    genre: 'Komedie',
    genreKey: 'comedy',
    genreColor: problemGenreColors.comedy,
    hook: 'Přidat jeden produkt znamená hodinu opakovaného klikání v administraci.',
    symptom: 'Přidávání produktů je zdlouhavé',
    problem: 'Správa produktů je zbytečně složitá a ruční — každá položka zabere moc času.',
    cause: 'špatně navržený proces — chybí šablony, kopírování produktů i hromadný import.',
    verify: 'kolik kroků a času zabere jeden produkt a kde se práce zbytečně opakuje.',
    step: 'zjednodušení správy — šablony, duplikace, hromadný import, případně vhodnější platforma.',
    service: 'E-shop / Automatizace',
    primaryServiceId: 'web',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'eshop-pluginy',
    role: 'support',
    severity: 3,
    genre: 'Horor',
    genreKey: 'horror',
    genreColor: problemGenreColors.horror,
    hook: 'Chcete jednu funkci nebo změnit text — a buď platíte plugin, nebo čekáte na vývojáře.',
    symptom: 'Drahé pluginy, nic si neupravíte sami',
    problem: 'Provoz prodražují placené doplňky a i drobná úprava čeká na programátora.',
    cause: 'platforma nutí řešit běžné věci placenými rozšířeními; chybí jednoduchý editor.',
    verify: 'roční náklady na pluginy, co reálně dělají a které úpravy byste chtěli zvládnout sami.',
    step: 'audit pluginů, jednodušší editor a vlastní řešení kritických funkcí místo drahých doplňků.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'automation'],
  },
  {
    id: 'eshop-data',
    role: 'support',
    severity: 4,
    genre: 'Detektivka',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'Víte, že se prodává, ale ne komu, odkud přišel ani proč koupil právě u vás.',
    symptom: 'Nevíte, odkud zákazníci přicházejí',
    problem: 'Nemáte přehled, jaké stránky lidé navštěvují a co je vede k nákupu.',
    cause: 'chybí měření objednávek, zdrojů návštěv a jednoduchý přehled.',
    verify: 'co se dnes měří, odkud chodí objednávky a jaká data vám chybí k rozhodování.',
    step: 'nastavení měření a jednoduchý přehled objednávek a zdrojů — ať víte, co funguje.',
    service: 'E-shop / Data',
    primaryServiceId: 'data',
    relatedServiceIds: ['audit', 'shop'],
  },
];

const enProblems: HomeContent['problems']['items'] = [
  {
    id: 'web-poptavky',
    role: 'lead',
    severity: 5,
    genre: 'Comedy',
    genreKey: 'comedy',
    genreColor: problemGenreColors.comedy,
    hook: 'Visitors arrive, look around, and leave without a clear route to contact.',
    symptom: 'The website does not create enquiries',
    problem: 'The website exists, but visitors do not reach the contact step.',
    cause: 'The offer is unclear and the calls to action are weak; visitors do not know what to do next.',
    verify: 'the path from arrival to contact, clarity of the offer, and whether the key steps are measured at all.',
    step: 'a short audit, structure cleanup, and clear calls to action.',
    service: 'Website and redesign / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'data'],
  },
  {
    id: 'nejasny-krok',
    role: 'lead',
    severity: 5,
    genre: 'Comedy',
    genreKey: 'comedy',
    genreColor: problemGenreColors.comedy,
    hook: 'A good service gets no response when the next step is not visible at first glance.',
    symptom: 'The offer / next step is not clear',
    problem: 'Customers do not understand the offer or do not know where to continue.',
    cause: 'The offer is unclear and the calls to action are weak; visitors do not know what to do next.',
    verify: 'offer clarity, call-to-action wording, and the route to the form or phone.',
    step: 'adjust the page structure so the next step is obvious without explanation.',
    service: 'Website and redesign / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'poptavky-email',
    role: 'support',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'Every message has its own plotline and nobody can see which scene it is in.',
    symptom: 'Enquiries get lost in email',
    problem: 'Enquiries arrive, but the next step is handled manually and without a clear status.',
    cause: 'disconnected tools - email, sheets, and forms.',
    verify: 'where manual work appears and how much time it takes.',
    step: 'design the smallest useful automation for one flow.',
    service: 'Process automation',
    primaryServiceId: 'automation',
    relatedServiceIds: ['audit', 'data'],
  },
  {
    id: 'rucni-data',
    role: 'support',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'The same data appears in several systems and someone retypes it every time.',
    symptom: 'You retype data/tasks manually',
    problem: 'You keep moving data between spreadsheets by hand.',
    cause: 'disconnected tools - email, sheets, and forms.',
    verify: 'where manual work appears and how much time it takes.',
    step: 'design the smallest useful automation for one flow.',
    service: 'Process automation',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'fakturace-papiry',
    role: 'support',
    severity: 5,
    genre: 'Horror',
    genreKey: 'horror',
    genreColor: problemGenreColors.horror,
    hook: 'You do client work during the day and catch up with admin in the evening.',
    symptom: 'Invoicing and paperwork take evenings',
    problem: 'Documents, source material, and repeated admin steps come back when the work should already be done.',
    cause: 'the process is not arranged into a simple flow and some information is only hunted down during invoicing.',
    verify: 'how a job starts, where invoice source data comes from, and which steps are repeated manually.',
    step: 'line up the process from enquiry to document and propose a small simplification without replacing the whole system.',
    service: 'Process automation / Audit',
    primaryServiceId: 'automation',
    relatedServiceIds: ['audit', 'data'],
  },
  {
    id: 'zacatek-ai',
    role: 'support',
    severity: 4,
    genre: 'Drama',
    genreKey: 'drama',
    genreColor: problemGenreColors.drama,
    hook: 'There are many trailers, but no script for where AI would actually help your operation.',
    symptom: 'I do not know where to start / where AI makes sense',
    problem: 'You have more options than certainty and do not want to start with an expensive tool blindly.',
    cause: 'too many options and no priority.',
    verify: 'the current state, repeated work, and source material where AI could realistically help.',
    step: 'a short audit that orders the steps and separates useful ideas from dead ends.',
    service: 'Audit / Data and AI assistants',
    primaryServiceId: 'audit',
    relatedServiceIds: ['data', 'automation'],
  },
  {
    id: 'mereni-prehled',
    role: 'support',
    severity: 3,
    genre: 'Drama',
    genreKey: 'drama',
    genreColor: problemGenreColors.drama,
    hook: 'Without a clear view, it is hard to tell which scene earns money and which only takes time.',
    symptom: 'Measurement and overview are missing',
    problem: 'You do not know what to measure on the website or in the process.',
    cause: 'simple goal measurement is missing (enquiry, phone call).',
    verify: 'what the real goal is and whether it is tracked today.',
    step: 'set up clear measurement without unnecessary analytics overhead.',
    service: 'Data and AI / Audit',
    primaryServiceId: 'data',
    relatedServiceIds: ['audit', 'web'],
  },
  {
    id: 'opakujici-dotazy',
    role: 'lead',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'A customer asks about price, timing, or process and you write the same answer you have written many times before.',
    symptom: 'You keep answering the same questions',
    problem: 'Repeated questions consume time and every answer is written manually.',
    cause: 'Answers are not prepared as approved source material, so an AI assistant has nothing safe to draft from.',
    verify: 'which questions return, where the correct answers live, and what an assistant may only draft, not send.',
    step: 'list frequent questions, prepare model answers, and design an AI assistant over verified material.',
    service: 'Data and AI assistants / Automation',
    primaryServiceId: 'data',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'prvni-kontakt-mimo-pracovni-dobu',
    role: 'lead',
    severity: 5,
    genre: 'Silent film',
    genreKey: 'silent-film',
    genreColor: problemGenreColors['silent-film'],
    hook: 'An enquiry arrives in the evening, but the first useful response happens only when you are already handling other work.',
    symptom: 'First contact waits until morning or Monday',
    problem: 'The prospect does not get a basic answer or a clear next step while their interest is fresh.',
    cause: 'There is no simple automated first contact that confirms receipt, asks follow-up questions, and passes the matter on.',
    verify: 'when enquiries arrive, what can be answered safely automatically, and which details are needed before a personal reply.',
    step: 'design the first response, basic data collection, and handoff of the enquiry to the next step.',
    service: 'Process automation / Website',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'web'],
  },
  {
    id: 'poptavka-bez-podkladu',
    role: 'support',
    severity: 4,
    genre: 'Detective',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'A customer writes "how much would it cost", but scope, timing, photos, or deciding details are missing.',
    symptom: 'Enquiries arrive without important details',
    problem: 'Pricing or answering is delayed because you have to ask for missing information manually.',
    cause: 'The form, email, or first response does not guide the customer to provide the minimum useful details.',
    verify: 'which details you need for a decision, what is missing most often today, and where the customer gets stuck.',
    step: 'adjust enquiry intake and prepare automated follow-up questions by request type.',
    service: 'Process automation / Data and AI',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'follow-up-poptavek',
    role: 'lead',
    severity: 4,
    genre: 'Detective',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'The offer is sent, and the next reminder depends on whether someone remembers it in time.',
    symptom: 'Follow-up gets lost after an offer is sent',
    problem: 'Open enquiries remain without a next step even though the customer has not decided yet.',
    cause: 'There is no enquiry status, next-action reminder, or simple follow-up message template.',
    verify: 'where offers are tracked today, when you contact people again, and how you know a next step is needed.',
    step: 'set up a simple status overview, reminders, and suggested follow-up emails.',
    service: 'Process automation / Data and AI',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'terminy-bez-pripomenuti',
    role: 'support',
    severity: 4,
    genre: 'Silent film',
    genreKey: 'silent-film',
    genreColor: problemGenreColors['silent-film'],
    hook: 'The appointment is agreed, but confirmation, instructions, and reminders still live in your head.',
    symptom: 'Appointments and materials need manual reminders',
    problem: 'Clients forget appointments, arrive unprepared, or send materials at the last minute.',
    cause: 'Confirmation and reminders are not part of one flow after an appointment is agreed.',
    verify: 'how appointments are confirmed, which information is repeatedly sent, and where misunderstandings or no-shows appear.',
    step: 'design automated confirmation, reminders, and a list of what the client should send in advance.',
    service: 'Process automation / Website',
    primaryServiceId: 'automation',
    relatedServiceIds: ['web', 'audit'],
  },
  {
    id: 'ukoly-po-schuzce',
    role: 'support',
    severity: 4,
    genre: 'Detective',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'The meeting goes well, but notes, tasks, and the next email are created later or not at all.',
    symptom: 'Post-meeting tasks stay in notes',
    problem: 'Agreed next steps fall apart between notes, email, and people’s memory.',
    cause: 'Meeting notes do not have a fixed shape and are not turned directly into tasks, deadlines, and follow-up.',
    verify: 'how notes are created today, who owns the next step, and where deadlines are tracked.',
    step: 'prepare a meeting-note template and a flow that turns it into tasks, reminders, and a follow-up draft.',
    service: 'Process automation / Data and AI',
    primaryServiceId: 'automation',
    relatedServiceIds: ['data', 'audit'],
  },
  {
    id: 'emaily-bez-priorit',
    role: 'support',
    severity: 3,
    genre: 'Horror',
    genreKey: 'horror',
    genreColor: problemGenreColors.horror,
    hook: 'Enquiries, questions, urgent messages, internal matters, and things that can wait all sit in one stream.',
    symptom: 'The day starts by sorting email and messages',
    problem: 'A lot of time is spent only deciding what deserves attention first.',
    cause: 'Messages are not sorted by type, urgency, and next step.',
    verify: 'where messages come from, which types repeat, and how priority can be recognized.',
    step: 'set up basic classification, labels, a daily overview, and reply templates for common message types.',
    service: 'Data and AI assistants / Automation',
    primaryServiceId: 'data',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'stav-zakazek-v-hlave',
    role: 'support',
    severity: 4,
    genre: 'Western',
    genreKey: 'western',
    genreColor: problemGenreColors.western,
    hook: 'You know something is being worked on, but the exact status, deadline, and next step have to be searched for.',
    symptom: 'Job status and deadlines live in your head',
    problem: 'The overview of jobs depends on memory, emails, and separate spreadsheets.',
    cause: 'There is no lightweight operations overview that connects status, owner, deadline, and last communication.',
    verify: 'which states a job moves through, where changes happen, and what you need to see every day.',
    step: 'design a small job overview with reminders and a connection to email or a spreadsheet.',
    service: 'Data and AI assistants / Automation',
    primaryServiceId: 'data',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'eshop-pomaly',
    role: 'support',
    severity: 4,
    genre: 'Detective',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'Before the products even appear, the visitor loses patience and leaves.',
    symptom: 'The e-shop loads slowly',
    problem: 'Slow loading drives customers away before they even see the offer.',
    cause: 'uncompressed images, unnecessary scripts, weak caching, and an overloaded host.',
    verify: 'the real loading speed on mobile, the page weight, and what slows it down most.',
    step: 'optimising images and scripts, caching, and a faster host if needed.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'eshop-konverze',
    role: 'support',
    severity: 4,
    genre: 'Drama',
    genreKey: 'drama',
    genreColor: problemGenreColors.drama,
    hook: 'You spend on ads for the flagship, but orders go to low-margin small stuff.',
    symptom: 'People buy different items than you want',
    problem: 'The best-sellers are not the items your profit relies on.',
    cause: 'premium products are not visible, product pages are weak, and the purchase leads nowhere.',
    verify: 'the catalogue structure, the high-margin product pages, and what actually sells versus the plan.',
    step: 'highlighting key products, stronger product pages, and a clear path to purchase.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'eshop-seo',
    role: 'support',
    severity: 4,
    genre: 'Detective',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'A customer searches for exactly what you sell — and finds a competitor, not you.',
    symptom: 'The e-shop is invisible in search',
    problem: 'The e-shop is missing from organic search because it has no SEO foundation.',
    cause: 'products without unique descriptions, missing structure, keywords, and measurement.',
    verify: 'search visibility, the state of product descriptions and structure, and what competitors target.',
    step: 'an SEO foundation — product descriptions, structure, and keywords based on what people search for.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'shop'],
  },
  {
    id: 'eshop-sprava',
    role: 'support',
    severity: 3,
    genre: 'Comedy',
    genreKey: 'comedy',
    genreColor: problemGenreColors.comedy,
    hook: 'Adding one product means an hour of repetitive clicking in the admin.',
    symptom: 'Adding products is tedious',
    problem: 'Managing products is needlessly complex and manual; each item takes too long.',
    cause: 'a poorly designed process, no templates, duplication, or bulk import.',
    verify: 'how many steps and how much time one product takes and where work is needlessly repeated.',
    step: 'simplifying management — templates, duplication, bulk import, or a better-suited platform.',
    service: 'E-shop / Automation',
    primaryServiceId: 'web',
    relatedServiceIds: ['automation', 'audit'],
  },
  {
    id: 'eshop-pluginy',
    role: 'support',
    severity: 3,
    genre: 'Horror',
    genreKey: 'horror',
    genreColor: problemGenreColors.horror,
    hook: 'You want one feature or a text change — and you either pay for a plugin or wait for a developer.',
    symptom: 'Expensive plugins, I cannot edit anything myself',
    problem: 'The shop runs on expensive plugins, and even a small edit needs a technician.',
    cause: 'the platform forces you to solve common things with paid add-ons; a simple editor is missing.',
    verify: 'the yearly plugin cost, what they actually do, and which edits you would want to handle yourself.',
    step: 'a plugin audit, a simpler editor, and custom solutions for critical features instead of pricey add-ons.',
    service: 'E-shop / Audit',
    primaryServiceId: 'web',
    relatedServiceIds: ['audit', 'automation'],
  },
  {
    id: 'eshop-data',
    role: 'support',
    severity: 4,
    genre: 'Detective',
    genreKey: 'detective',
    genreColor: problemGenreColors.detective,
    hook: 'You know sales happen, but not to whom, where they came from, or why they bought from you.',
    symptom: 'You do not know who your customers are',
    problem: 'You have little data about customers and their journey, so decisions are guesswork.',
    cause: 'no measurement of orders, traffic sources, or a simple overview.',
    verify: 'what is measured today, where orders come from, and what data you are missing to decide.',
    step: 'setting up measurement and a simple overview of orders and sources — so you know what works.',
    service: 'E-shop / Data',
    primaryServiceId: 'data',
    relatedServiceIds: ['audit', 'shop'],
  },
];

const csServices: HomeContent['services']['items'] = [
  {
    id: 'web',
    slot: 'web',
    featured: true,
    price: 'od 10 000 Kč',
    title: 'Jednostránkový web',
    result: 'Výsledek: jednostránkový web, který návštěvníkovi rychle vysvětlí nabídku a přivádí poptávky.',
    outputs: [
      'rychlý jednostránkový web + poptávkový formulář',
      'základní SEO pro Google i Seznam + měření',
      'předání tak, že drobnosti zvládnete měnit sami',
    ],
  },
  {
    id: 'shop',
    slot: 'shop',
    className: 'rq-service-tile--shop',
    price: 'od 20 000 Kč',
    title: 'E-shop',
    result: 'Výsledek: malý e-shop bez zbytečností, který zvládnete sami spravovat.',
    outputs: [
      'katalog, košík, varianty',
      'doprava a platba dle platformy',
      'předání + krátké zaškolení',
    ],
  },
  {
    id: 'automation',
    slot: 'automation',
    className: 'rq-service-tile--automation',
    price: 'od 12 000 Kč',
    title: 'Automatizace procesů',
    result: 'První krok: zmapovaný proces a funkční tok na vašich reálných datech.',
    outputs: [
      'analýza jednoho procesu od začátku do konce',
      'jeden funkční automatický tok',
      'dokumentace + předání',
    ],
  },
  {
    id: 'data',
    slot: 'data',
    className: 'rq-service-tile--data',
    price: 'od 15 000 Kč',
    title: 'Data a AI pomocníci',
    result: 'První krok: vyčištěná ukázka dat, jednoduchý přehled a návrh bezpečné AI vrstvy.',
    outputs: [
      'sběr a vyčištění dat',
      'jednoduchý přehled / report',
      'AI pomocník nad schválenými podklady',
    ],
  },
  {
    id: 'audit',
    slot: 'audit',
    className: 'rq-service-tile--audit',
    flag: 'Doporučený start',
    price: 'od 3 000 Kč',
    title: 'Audit webu nebo procesu',
    result: 'Výsledek: víte, co nejvíc brzdí a co řešit první — cenu odečtu z realizace.',
    outputs: [
      'technický stav, rychlost, SEO základ, formuláře',
      'seznam problémů podle priority',
      'doporučení, co hned a co počká',
    ],
  },
];

const enServices: HomeContent['services']['items'] = [
  {
    id: 'web',
    slot: 'web',
    featured: true,
    price: 'from CZK 10,000',
    title: 'One-page website',
    result: 'Result: a one-page website that explains the offer quickly and brings in measurable enquiries.',
    outputs: [
      'fast one-page website + enquiry form',
      'SEO basics for Google and Seznam + measurement',
      'handoff so you can change small things yourself',
    ],
  },
  {
    id: 'shop',
    slot: 'shop',
    className: 'rq-service-tile--shop',
    price: 'from CZK 20,000',
    title: 'E-shop',
    result: 'Result: a small e-shop without unnecessary complexity that you can easily manage yourselves.',
    outputs: [
      'catalogue, cart, variants',
      'shipping and payment according to the platform',
      'handoff + short training',
    ],
  },
  {
    id: 'automation',
    slot: 'automation',
    className: 'rq-service-tile--automation',
    price: 'from CZK 12,000',
    title: 'Process automation',
    result: 'First step: a mapped process and a working flow on your real data.',
    outputs: [
      'analysis of one process from start to finish',
      'one working automated flow',
      'documentation + handoff',
    ],
  },
  {
    id: 'data',
    slot: 'data',
    className: 'rq-service-tile--data',
    price: 'from CZK 15,000',
    title: 'Data and AI assistants',
    result: 'First step: cleaned sample data, a simple overview, and a safe AI layer proposal.',
    outputs: [
      'data collection and cleanup',
      'simple overview / report',
      'AI assistant over approved source material',
    ],
  },
  {
    id: 'audit',
    slot: 'audit',
    className: 'rq-service-tile--audit',
    flag: 'Recommended start',
    price: 'from CZK 3,000',
    title: 'Website or process audit',
    result: 'Result: you know what slows things down most and what to fix first - the audit is deducted from implementation.',
    outputs: [
      'technical state, speed, SEO basics, forms',
      'problem list by priority',
      'recommendations for what to fix now and what can wait',
    ],
  },
];

const csJourney: HomeContent['journey']['phases'] = [
  {
    id: 'rozbor',
    number: '01',
    title: 'Rozbor',
    duration: '1–3 dny',
    solve: 'co nefunguje, kdo to používá, kde se ztrácí čas a důvěra.',
    process: 'krátký hovor, projdu web/proces, doptám se na cíl.',
    benefit: 'jasně pojmenovaný problém a priority bez mlhy.',
    tags: [
      { label: 'Výstup', value: 'rozbor' },
      { label: 'Vaše role', value: 'dáte přístup/podklady.' },
      { label: 'Moje role', value: 'rozeberu a změřím.' },
      { label: 'Jistota', value: 'bez závazků — když se nedomluvíme, rozbor vám zůstává.' },
    ],
  },
  {
    id: 'navrh',
    number: '02',
    title: 'Návrh',
    duration: '2–5 dní',
    solve: 'co vznikne, pro koho, v jakém pořadí a co se dělat NEbude.',
    process: 'připravím strukturu + texty, projdeme a schválíte.',
    benefit: 'konkrétní plán, cenu a termín předem — méně překvapení.',
    tags: [
      { label: 'Výstup', value: 'návrh' },
      { label: 'Vaše role', value: 'potvrdíte směr.' },
      { label: 'Moje role', value: 'navrhnu.' },
    ],
  },
  {
    id: 'stavba',
    number: '03',
    title: 'Stavba',
    duration: 'dny (úpravy) až ~2 týdny',
    solve: 'web / e-shop / automatizace, obsah, mobil, základ SEO.',
    process: 'stavím po částech, průběžně ukazuju na preview — žádná černá skříňka.',
    benefit: 'funkční řešení k vyzkoušení, chyby se zachytí včas.',
    tags: [
      { label: 'Výstup', value: 'funkční řešení' },
      { label: 'Vaše role', value: 'připomínkujete.' },
      { label: 'Moje role', value: 'postavím.' },
      { label: 'Jistota', value: 'platba po částech — druhá až po schválení prototypu.' },
    ],
  },
  {
    id: 'test',
    number: '04',
    title: 'Test',
    duration: '1-3 dny',
    solve: 'mobil/prohlížeče, rychlost, formuláře, reálné scénáře.',
    process: 'projedu testovací checklist, ověřím výkon a funkčnost.',
    benefit: 'méně chyb po spuštění, ověřený výkon.',
    tags: [
      { label: 'Výstup', value: 'Protokol o testování (rychlost, mobil, formuláře).', strong: true },
      { label: 'Vaše role', value: 'potvrdíte hlavní scénáře.' },
      { label: 'Moje role', value: 'testuji.' },
    ],
  },
  {
    id: 'predani',
    number: '05',
    title: 'Předání',
    duration: '~1 den',
    solve: 'spuštění, přístupy, zaškolení, co dál.',
    process: 'nasadím na vaši doménu, předám návod.',
    benefit: 'plná kontrola a víte, na koho se obrátit.',
    tags: [
      { label: 'Výstup', value: 'předávací poznámky + návod' },
      { label: 'Vaše role', value: 'převezmete přístupy.' },
      { label: 'Moje role', value: 'nasadím a předám.' },
      { label: 'Jistota', value: 'po předání dle domluvy: 30 dní podpory, nebo návod/video.' },
    ],
    final: true,
  },
];

const enJourney: HomeContent['journey']['phases'] = [
  {
    id: 'rozbor',
    number: '01',
    title: 'Diagnosis',
    duration: '1-3 days',
    solve: 'what is not working, who uses it, and where time and trust are lost.',
    process: 'a short call, I review the website/process, and clarify the goal.',
    benefit: 'a clearly named problem and priorities without fog.',
    tags: [
      { label: 'Output', value: 'diagnosis' },
      { label: 'Your role', value: 'provide access/source material.' },
      { label: 'My role', value: 'analyse and measure.' },
      { label: 'Trust', value: 'no obligation - if we do not continue, the diagnosis stays yours.' },
    ],
  },
  {
    id: 'navrh',
    number: '02',
    title: 'Proposal',
    duration: '2-5 days',
    solve: 'what will be created, for whom, in which order, and what will NOT be done.',
    process: 'I prepare the structure + copy, then we review and approve it.',
    benefit: 'a concrete plan, price, and timing upfront - fewer surprises.',
    tags: [
      { label: 'Output', value: 'proposal' },
      { label: 'Your role', value: 'confirm the direction.' },
      { label: 'My role', value: 'design the approach.' },
    ],
  },
  {
    id: 'stavba',
    number: '03',
    title: 'Build',
    duration: 'days (small changes) to about 2 weeks',
    solve: 'website / e-shop / automation, content, mobile, SEO basics.',
    process: 'I build in parts and show preview work as we go - no black box.',
    benefit: 'a working solution to try, with issues caught early.',
    tags: [
      { label: 'Output', value: 'working solution' },
      { label: 'Your role', value: 'give feedback.' },
      { label: 'My role', value: 'build it.' },
      { label: 'Trust', value: 'staged payment - the second part follows prototype approval.' },
    ],
  },
  {
    id: 'test',
    number: '04',
    title: 'Test',
    duration: '1-3 days',
    solve: 'mobile/browsers, speed, forms, real scenarios.',
    process: 'I run through the test checklist and verify performance and function.',
    benefit: 'fewer launch issues and verified performance.',
    tags: [
      { label: 'Output', value: 'Test report (speed, mobile, forms).', strong: true },
      { label: 'Your role', value: 'confirm the main scenarios.' },
      { label: 'My role', value: 'test.' },
    ],
  },
  {
    id: 'predani',
    number: '05',
    title: 'Handoff',
    duration: 'about 1 day',
    solve: 'launch, access, training, and what comes next.',
    process: 'I deploy to your domain and hand over instructions.',
    benefit: 'full control and clarity on who to contact.',
    tags: [
      { label: 'Output', value: 'handoff notes + guide' },
      { label: 'Your role', value: 'take over access.' },
      { label: 'My role', value: 'deploy and hand off.' },
      { label: 'Trust', value: 'after handoff by agreement: 30 days of support, or a guide/video.' },
    ],
    final: true,
  },
];

export const homeContent = {
  cs: {
    seo: {
      title: 'RadeQ.cz - Racionální digitalizace',
      description: 'Weby, data a automatizace pro živnostníky, malé firmy a spolky.',
      canonicalPath: '/',
      alternatePath: '/en/',
      alternateLabel: 'EN',
    },
    nav: {
      ariaLabel: 'Hlavní navigace',
      navAriaLabel: 'Hlavní navigace',
      brandAriaLabel: 'RadeQ.cz',
      homeHref: '/',
      items: [
        { href: '#co-resim', label: 'Co řeším' },
        { href: '#sluzby', label: 'Služby' },
        { href: '#jak-pracuji', label: 'Jak pracuji' },
        { href: '#ceny', label: 'Ceny' },        { href: '#kontakt', label: 'Kontakt' },
      ],
    },
    hero: {
      eyebrow: 'Racionální digitalizace',
      title: 'Weby, data a automatizace, které vám uvolní ruce.',
      typewriter: {
        prefix: 'Pro\u00a0',
        words: ['živnostníky', 'salony', 'malé firmy', 'lokální služby'],
        sizerWord: 'lokální služby',
        initialWord: 'živnostníky',
        liveText: 'Pro živnostníky, salony, malé firmy a lokální služby.',
      },
      lead: 'Pomůžu vám zjednodušit web, poptávky, evidenci nebo ruční práci v tabulkách. Navrhnu řešení, postavím ho, ověřím v praxi a předám tak, abyste ho zvládli používat bez závislosti na dodavateli.',
      journeyNote: 'Postup od problému k ověřenému výsledku.',
      proofAriaLabel: 'Důkazy a orientační ceny',
      proofItems: [
        { label: 'Jednostránkový web od 10 000 Kč', text: '1 strana + kontaktní formulář, spuštění za pár dní' },
        { label: 'Audit webu nebo procesu', text: 'zjistíte, co brzdí web nebo proces; audit odečtu z realizace' },
        { label: 'Postavím · změřím · předám', text: 'bez závislosti na dodavateli' },
      ],
      actions: {
        primary: { href: '#kontakt', label: 'Napsat poptávku' },
        secondary: { href: '/audit/', label: 'Zkusit strojový náhled webu' },
        secondaryMicro: 'Náhled zdarma, ne verdikt.',
        micro: 'Nezávazně. Ozvu se do 1 pracovního dne.',
      },
    },
    problems: {
      eyebrow: 'Co řeším',
      title: 'Poznáváte některý z těchto problémů?',
      lead: 'Vyberte signál, který sedí nejvíc. Ukážu pravděpodobnou příčinu, co prověřím a první rozumný krok.',
      severityLegend: {
        strong: 'Dopad na provoz',
        text: 'Štítek u problému ukazuje, jak moc brzdí poptávky, čas nebo přehled.',
      },
      controlsAriaLabel: 'Posun karuselu',
      previousLabel: 'Předchozí problém',
      nextLabel: 'Další problém',
      carouselAriaLabel: 'Karusel s typickými signály problémů',
      severitySrPrefix: 'Dopad na provoz:',
      severitySrSuffix: 'z 5 hvězd.',
      tagline: 'Vyberte, co vás brzdí. Navrhnu nejmenší krok, který má smysl.',
      findingLabels: {
        problem: 'Co se děje',
        cause: 'Kde bývá příčina',
        verify: 'Co prověřím',
        step: 'První krok',
      },
      ctaLabel: 'Napsat poptávku',
      servicePrefix: 'Typicky souvisí:',
      auditPreview: {
        text: 'Většina těchhle signálů u webu jde orientačně změřit za pár vteřin.',
        href: '/audit/',
        label: 'Strojový náhled (ne verdikt)',
      },
      items: csProblems,
    },
    marquee: {
      ariaLabel: 'Typické symptomy před úpravou webu a procesů',
      items: [
        'pomalý web',
        'poptávky se ztrácí v mailu',
        'ruční přepisování do Excelu',
        'nejasné CTA',
        'web nevodí zákazníky',
        'žádné měření',
        'chaos v nástrojích',
      ],
    },
    services: {
      eyebrow: 'Služby',
      title: 'Co vám zjednoduším',
      ariaLabel: 'Služby a orientační ceny',
      ctaLabel: 'Domluvit nezávazný rozbor',
      liveFallback: 'služba',
      livePrefix: 'Zvýrazněno:',
      items: csServices,
    },
    journey: {
      eyebrow: 'Postup',
      title: 'Jak to bude probíhat',
      timelineText: 'Typicky 2–4 týdny od poptávky ke spuštění.',
      timelineNote: 'Orientačně pro běžný projekt — větší zakázky podle domluvy.',
      startCap: 'Váš problém',
      endCap: 'Výsledek · ověřeno',
      tablistAriaLabel: 'Fáze spolupráce',
      preview: {
        start: {
          eyebrow: 'Problém',
          title: 'Web nevede k poptávce',
          problemLabel: 'Co se děje',
          problem: 'Web jen existuje, ale návštěvník nedojde ke kontaktu.',
          stepLabel: 'První krok',
          step: 'krátký audit a úprava struktury + jasné CTA.',
          ctaLabel: 'Otevřít diagnostiku',
        },
        end: {
          badge: 'VZOROVÝ PROJEKT',
          kicker: 'Řemeslo a lokální služby',
          title: 'Web pro instalatéra',
          text: 'Přehled služeb, důvěryhodná prezentace a rychlý kontakt pro zákazníky, kteří potřebují pomoct hned.',
          ctaLabel: 'Zobrazit ukázky',
        },
      },
      panelLabels: {
        solve: 'Co řešíme',
        duration: 'Jak dlouho',
        process: 'Jak probíhá',
        benefit: 'Co z toho máte',
        tagListAriaPrefix: 'Výstupy a role:',
      },
      phases: csJourney,
      trustAriaLabel: 'Důležité jistoty procesu',
      trustPoints: [
        'Jeden člověk od rozboru po test — nic se neztratí mezi rolemi.',
        'Každá fáze má hmatatelný výstup.',
        'Test je před předáním, ne až po stížnosti.',
      ],
    },
    guarantee: {
      eyebrow: 'Servisní protokol & záruka',
      title: 'Každá zakázka má jasný výstup a ověřený výkon.',
      text: 'U každé zakázky dostanete servisní protokol — co jsem udělal, co se změnilo a co dál (i co nemá smysl řešit). Před předáním web otestuji: formuláře, mobil, rychlost, základní SEO i měření. Hlídám rychlé načítání. Domluvené kritérium kvality zapíšu do protokolu předem — když ho při předání nesplním, vrátím 15 % z ceny práce, nebo to bez příplatku doladím.',
    },
    about: {
      eyebrow: 'Kdo jsem',
      name: 'Radek Široký',
      title: 'RadeQ vedu sám — a na větší projekty mám tým.',
      paragraphs: [
        'Jsem Radek Široký a RadeQ vedu sám — návrh, realizaci i předání máte v jedné ruce, takže víte, s kým mluvíte a kdo za výsledek ručí. Na větší projekty přibírám zkušené programátory a designéry, kteří se rádi zapojí — společně zvládneme i větší projekty.',
        'Webům, e-shopům, SEO, marketingu a supportu se věnuju od roku 2019 — a už tehdy jsem si začal automatizovat opakovanou kancelářskou práci. Od roku 2025 k tomu přidávám analýzu, testování a práci s daty (databáze, procesy, logika, metodika, bezpečnost).',
        'K technice mám blízko od střední — 3D a počítače. Programovat jsem začal u pětiosého frézovacího centra; tam mi došlo, že mě baví věci řídit, přizpůsobit a opravit — a postupně jsem to přetavil do vývoje softwaru.',
        'Nejde mi o efekt, ale o to, aby web přiváděl poptávky a ubylo vám ruční práce. Předávám hotové a otestované, abyste drobnosti zvládli sami — bez závislosti na dodavateli.',
      ],
      photo: {
        src: '/brand/founder-about.webp',
        src2x: '/brand/founder-about@2x.webp',
        alt: 'Radek Široký, zakladatel RadeQ',
        width: 640,
        height: 800,
      },
    },
    pricing: {
      eyebrow: 'Ceny',
      title: 'Orientační ceny bez překvapení.',
      lead: 'Realizace a péče jsou dvě různé služby: jednorázové orientační ceny projektů a měsíční paušály péče po spuštění.',
      audit: {
        kicker: 'Vstupní krok',
        title: 'Audit webu nebo procesu',
        price: 'od 3 000 Kč',
        creditedLine: 'Projdu web nebo proces a řeknu, co ho nejvíc brzdí a co řešit první. Cenu auditu vám celou odečtu z realizace — když se domluvíme, audit vás nestojí nic navíc.',
        coverage: ['technický stav', 'rychlost', 'SEO základ', 'formuláře', 'ruční kroky v procesu'],
        coverageAriaLabel: 'Co audit pokrývá',
        scopeAriaLabel: 'Rozsah auditu',
        scope: [
          { label: 'Co auditujeme', text: 'web · proces · nebo obojí' },
          {
            label: 'Co dostanete (výstup)',
            text: 'seznam priorit (co řešit první) · odhad rozsahu a ceny realizace · co má a nemá smysl řešit',
          },
          {
            label: 'Proč „od“',
            text: 'U malého webu platí základní cena. Větší web nebo proces — víc stránek, víc kroků — upřesníme po krátké nezávazné domluvě. Vždy je to audit a cenu celou odečtu z realizace.',
          },
        ],
        ctaLabel: 'Chci audit od 3 000 Kč',
        measureHref: '/audit/',
        measureLabel: 'Nebo si web nejdřív orientačně změřte',
      },
      proofStrip: {
        eyebrow: 'VYZKOUŠEJTE',
        line: 'Strojový náhled webu zdarma — ukáže signály k prověření, ne verdikt.',
        previewLabel: 'Strojový náhled zdarma',
        paidLabel: 'Nebo rovnou lidský audit od 3 000 Kč (odečtu z realizace)',
      },
      projectTitle: 'Projektové realizace',
      projectNote: 'Realizace navazuje na audit — ceny jsou orientační (od).',
      careTitle: 'Péče po spuštění',
      projectItems: [
        { name: 'Automatizace procesů', price: 'od 12 000 Kč' },
        { name: 'Data a AI pomocníci', price: 'od 15 000 Kč' },
        { name: 'Firemní web (1–5 stran)', price: 'od 25 000 Kč' },
        { name: 'E-shop', price: 'od 20 000 Kč' },
        { name: 'Jednostránkový web', price: 'od 10 000 Kč' },
        { name: 'Redesign staršího webu', price: 'od 10 000 Kč' },
      ],
      ariaLabel: 'Tarify péče po spuštění',
      note: 'Nechcete paušál? Bloky hodin 5/15/40 h (od 1 100 Kč/h). Nejsem plátce DPH — ceny jsou konečné.',
      items: [
        { title: 'Partner', price: '15 000 Kč', suffix: '/měs.', text: 'mapování procesů + prototypy automatizace/AI, 10 h, prioritní podpora + vše z Růstu', ctaLabel: 'Chci být partner', automationBadge: 'Automatizace' },
        { title: 'Růst', price: '6 000 Kč', suffix: '/měs.', text: 'vše z Klidu + SEO/výkon hlídání, měsíční report, 3 h vývoje', ctaLabel: 'Chci společně růst', featured: true, badge: 'Doporučeno' },
        { title: 'Klid', price: '2 500 Kč', suffix: '/měs.', text: 'provoz, zálohy, drobné úpravy (1 h), máte komu zavolat', ctaLabel: 'Chci mít klid' },
      ],
    },
    showcase: {
      eyebrow: 'Ukázky',
      title: 'Co umím postavit',
      items: [
        {
          href: '/ukazky/instalater/',
          className: 'rq-ukazky-bento-card--featured',
          badge: 'VZOROVÝ PROJEKT',
          kicker: 'Řemeslo a lokální služby',
          title: 'Web pro instalatéra',
          text: 'Přehled služeb, důvěryhodná prezentace a rychlý kontakt pro zákazníky, kteří potřebují pomoct hned.',
          linkLabel: 'Zobrazit ukázku',
        },
        {
          href: '/ukazky/sluzba/',
          className: 'rq-ukazky-bento-card--booking',
          badge: 'VZOROVÝ PROJEKT',
          kicker: 'Služby s termíny',
          title: 'Web s rezervací',
          text: 'Jednoduchá prezentace služby s jasnou cestou k objednání.',
          linkLabel: 'Zobrazit ukázku',
        },
        {
          href: '/ukazky/eshop/',
          className: 'rq-ukazky-bento-card--shop',
          badge: 'VZOROVÝ PROJEKT',
          kicker: 'Prodej a katalog',
          title: 'Malý e-shop',
          text: 'Produktová nabídka, košík a nákupní tok pro menší sortiment.',
          linkLabel: 'Zobrazit ukázku',
        },
      ],
    },
    contact: {
      eyebrow: 'Kontakt',
      title: 'Napište mi, s čím můžu pomoct',
      lead: 'Stačí stručně popsat, co chcete zjednodušit — ozvu se a doptám se. Odpovídám do 1 pracovního dne.',
      doneLeadHtml: 'Zapomněli jste na něco nebo chcete změnit zadání? Napište mi na <a href="mailto:siroky@radeq.cz">siroky@radeq.cz</a> nebo zavolejte na <a href="tel:+420730634439">+420 730 634 439</a>.',
      fields: {
        name: 'Jméno',
        email: 'E-mail',
        projectType: 'O jaký projekt jde?',
        message: 'Co potřebujete zjednodušit?',
        budget: 'Orientační rozpočet',
        deadline: 'Termín',
        deadlinePlaceholder: 'Např. do 2 měsíců',
        honeypot: 'Toto pole nevyplňujte',
      },
      projectOptions: [
        { label: 'Web', value: 'Web' },
        { label: 'E-shop', value: 'E-shop' },
        { label: 'Automatizace procesů', value: 'Automatizace procesů' },
        { label: 'Data a AI', value: 'Data a AI' },
        { label: 'Audit webu nebo procesu (od 3 000 Kč)', value: 'Audit webu nebo procesu (od 3 000 Kč)' },
        { label: 'Jiné', value: 'Jiné' },
      ],
      budgetOptions: [
        { label: 'Nechám otevřené', value: '' },
        { label: 'Do 10 000 Kč', value: 'Do 10 000 Kč' },
        { label: '10 000-30 000 Kč', value: '10 000-30 000 Kč' },
        { label: '30 000-60 000 Kč', value: '30 000-60 000 Kč' },
        { label: '60 000 Kč+', value: '60 000 Kč+' },
      ],
      optionalSummary: 'Doplňující detaily (nepovinné)',
      submitLabel: 'Odeslat poptávku',
      notePrefix: 'Nebo napište přímo na',
      noteEmail: 'siroky@radeq.cz',
      notePhone: '+420 730 634 439',
      status: {
        sending: 'Odesílám…',
        success: 'Ozvu se co nejdřív. Těším se na naši spolupráci.',
        failureHtml: 'Odeslání teď neproběhlo. Napište prosím na <a href="mailto:siroky@radeq.cz">siroky@radeq.cz</a>.',
        verifyPrompt: 'Potvrďte prosím, že nejste robot, a odešlete znovu.',
      },
    },
    footer: {
      tagline: 'Racionální digitalizace pro živnostníky, malé firmy a spolky. Weby, data a automatizace bez zbytečné složitosti.',
      navTitle: 'Navigace',
      navAriaLabel: 'Navigace v patičce',
      connectionTitle: 'Spojení',
      connectionLinks: [
        { href: '/#kontakt', label: 'Napsat poptávku' },
        { href: '/#ceny', label: 'Ceny' },
      ],
      legal: '© 2026 Radek Široký — RadeQ.cz · IČO 08748811 · Praha · celá ČR',
      contactEmail: 'siroky@radeq.cz',
      contactPhone: '+420 730 634 439',
      mascotEnableLabel: '◍ Zapnout maskota',
      mascotDisableLabel: '◍ Vypnout maskota',
    },
    guide: {
      toggleLabel: 'Rychlá navigace',
      eyebrow: 'RadeQ',
      title: 'Rychlá navigace',
      closeLabel: 'Zavřít',
      intro: 'Pomůžu vám najít, co potřebujete. Vyberte téma:',
      quickActionsAriaLabel: 'Rychlá témata',
      initialMessage: 'Vyberte téma nebo napište krátký dotaz.',
      inputLabel: 'Váš dotaz',
      inputPlaceholder: 'Např. cena webu',
      sendLabel: 'Odeslat',
      topics: {
        ceny: {
          chipLabel: 'Kolik to stojí',
          text: 'Orientačně: web od 10 000 Kč, audit webu nebo procesu od 3 000 Kč. Kompletní přehled máte v sekci Ceny níž — přesnou cenu doladíme po krátké domluvě.',
          href: '#ceny',
          label: 'Přejít na ceny',
          followups: [
            { key: 'kontakt', label: 'Chci poptávku' },
            { key: 'sluzby', label: 'Služby' },
          ],
        },
        sluzby: {
          chipLabel: 'Jaké služby nabízíte',
          text: 'Weby a redesign, e-shopy, automatizace procesů, práce s daty a AI, audit.',
          href: '#sluzby',
          label: 'Přejít na služby',
          followups: [
            { key: 'ceny', label: 'Ceny' },
            { key: 'spoluprace', label: 'Jak pracuji' },
          ],
        },
        spoluprace: {
          chipLabel: 'Jak probíhá spolupráce',
          text: 'Pojmenujeme problém → nejmenší funkční řešení → postavím, otestuji a předám (se servisním protokolem).',
          href: '#jak-pracuji',
          label: 'Jak pracuji',
          followups: [
            { key: 'kontakt', label: 'Chci poptávku' },
            { key: 'ceny', label: 'Ceny' },
          ],
        },
        kontakt: {
          chipLabel: 'Chci poptávku',
          text: 'Napište pár vět, co řešíte. Ozvat se můžete i na siroky@radeq.cz.',
          href: '#kontakt',
          label: 'Přejít na kontakt',
          followups: [
            { key: 'sluzby', label: 'Služby' },
            { key: 'spoluprace', label: 'Jak pracuji' },
          ],
        },
      },
      fallback: {
        text: 'Tohle bude lepší poslat jako poptávku — Radek se doptá a odpoví konkrétně.',
        href: '#kontakt',
        label: 'Napsat poptávku',
      },
      matchers: {
        ceny: ['cen', 'cena', 'ceny', 'kolik', 'stoj', 'rozpocet', 'audit', 'sprava', 'eshop', 'e-shop', 'web'],
        sluzby: ['sluz', 'nabiz', 'delate', 'redesign', 'automatiz', 'data', 'ai', 'eshop', 'e-shop'],
        spoluprace: ['jak', 'postup', 'spoluprac', 'probiha', 'predani', 'test', 'reseni'],
        kontakt: ['kontakt', 'poptav', 'napsat', 'email', 'mail', 'info'],
      },
    },
    schema: {
      description: 'Weby, e-shopy, automatizace procesů a práce s daty pro živnostníky a malé firmy.',
      url: 'https://radeq.cz',
      areaServed: 'CZ',
      founderName: 'Radek Široký',
      addressLocality: 'Praha',
      addressCountry: 'CZ',
      knowsAbout: ['tvorba webů', 'e-shopy', 'automatizace procesů', 'práce s daty', 'AI pomocníci', 'SEO'],
    },
  },
  en: {
    seo: {
      title: 'RadeQ.cz - Rational digitalization',
      description: 'Websites, data, and automation for sole traders, small businesses, and associations.',
      canonicalPath: '/en/',
      alternatePath: '/',
      alternateLabel: 'CZ',
    },
    nav: {
      ariaLabel: 'Primary navigation',
      navAriaLabel: 'Primary navigation',
      brandAriaLabel: 'RadeQ.cz',
      homeHref: '/en/',
      items: [
        { href: '#co-resim', label: 'What I solve' },
        { href: '#sluzby', label: 'Services' },
        { href: '#jak-pracuji', label: 'How I work' },
        { href: '#ceny', label: 'Pricing' },        { href: '#kontakt', label: 'Contact' },
      ],
    },
    hero: {
      eyebrow: 'Rational digitalization',
      title: 'Websites, data, and automation that free your hands.',
      typewriter: {
        prefix: 'For\u00a0',
        words: ['sole traders', 'studios', 'small businesses', 'local services'],
        sizerWord: 'small businesses',
        initialWord: 'sole traders',
        liveText: 'For sole traders, studios, small businesses, and local services.',
      },
      lead: 'I help simplify your website, enquiries, records, or manual spreadsheet work. I design the solution, build it, verify it in practice, and hand it over so you can use it without depending on a supplier.',
      journeyNote: 'A path from problem to verified result.',
      proofAriaLabel: 'Proof points and indicative prices',
      proofItems: [
        { label: 'One-page website from CZK 10,000', text: '1 page + contact form, live in a few days' },
        { label: 'Website or process audit', text: 'find what slows the website or process; audit deducted from implementation' },
        { label: 'Build · measure · hand off', text: 'without supplier lock-in' },
      ],
      actions: {
        primary: { href: '#kontakt', label: 'Send an enquiry' },
        secondary: { href: '/en/audit/', label: 'Try the machine website preview' },
        secondaryMicro: 'Free preview, not a verdict.',
        micro: 'No obligation. I reply within 1 business day.',
      },
    },
    problems: {
      eyebrow: 'What I solve',
      title: 'Do any of these problems look familiar?',
      lead: 'Choose the signal that fits best. I will show the likely cause, what I would verify, and the first sensible step.',
      severityLegend: {
        strong: 'Operational impact',
        text: 'The tag next to a problem shows how much it slows enquiries, time, or visibility.',
      },
      controlsAriaLabel: 'Carousel controls',
      previousLabel: 'Previous problem',
      nextLabel: 'Next problem',
      carouselAriaLabel: 'Carousel with typical problem signals',
      severitySrPrefix: 'Operational impact:',
      severitySrSuffix: 'out of 5 stars.',
      tagline: 'Choose what holds you back. I will suggest the smallest step that makes sense.',
      findingLabels: {
        problem: 'What is happening',
        cause: 'Where the cause lies',
        verify: 'What I will verify',
        step: 'First step',
      },
      ctaLabel: 'Send an enquiry',
      servicePrefix: 'Typically related:',
      auditPreview: {
        text: 'Most of these website signals can be roughly checked in a few seconds.',
        href: '/en/audit/',
        label: 'Machine preview (not a verdict)',
      },
      items: enProblems,
    },
    marquee: {
      ariaLabel: 'Typical symptoms before improving a website and processes',
      items: [
        'slow website',
        'enquiries get lost in email',
        'manual retyping into Excel',
        'unclear CTA',
        'website does not guide customers',
        'no measurement',
        'tool chaos',
      ],
    },
    services: {
      eyebrow: 'Services',
      title: 'What I can simplify for you',
      ariaLabel: 'Services and indicative prices',
      ctaLabel: 'Book a no-obligation diagnosis',
      liveFallback: 'service',
      livePrefix: 'Highlighted:',
      items: enServices,
    },
    journey: {
      eyebrow: 'Process',
      title: 'How the work runs',
      timelineText: 'Typically 2-4 weeks from enquiry to launch.',
      timelineNote: 'Indicative for a standard project - larger work by agreement.',
      startCap: 'Your problem',
      endCap: 'Result · verified',
      tablistAriaLabel: 'Collaboration phases',
      preview: {
        start: {
          eyebrow: 'Problem',
          title: 'The website does not create enquiries',
          problemLabel: 'What is happening',
          problem: 'The website exists, but visitors do not reach the contact step.',
          stepLabel: 'First step',
          step: 'a short audit, structure cleanup, and clear calls to action.',
          ctaLabel: 'Open diagnostics',
        },
        end: {
          badge: 'SAMPLE PROJECT',
          kicker: 'Trades and local services',
          title: 'Website for a plumber',
          text: 'A clear service overview, trustworthy presentation, and fast contact for customers who need help now.',
          ctaLabel: 'Show examples',
        },
      },
      panelLabels: {
        solve: 'What we solve',
        duration: 'How long',
        process: 'How it works',
        benefit: 'What you get',
        tagListAriaPrefix: 'Outputs and roles:',
      },
      phases: enJourney,
      trustAriaLabel: 'Important process assurances',
      trustPoints: [
        'One person from diagnosis to testing - nothing gets lost between roles.',
        'Every phase has a tangible output.',
        'Testing happens before handoff, not after complaints.',
      ],
    },
    guarantee: {
      eyebrow: 'Service protocol & guarantee',
      title: 'Every project has a clear output and verified performance.',
      text: 'For every project, you receive a service protocol - what I did, what changed, and what comes next (including what is not worth solving). Before handoff, I test the website: forms, mobile, speed, SEO basics, and measurement. I watch fast loading and write the agreed qualitative criterion into the protocol upfront - if I do not meet it at handoff, I return 15% of the labour price or fine-tune it without extra charge.',
    },
    about: {
      eyebrow: 'About me',
      name: 'Radek Široký',
      title: 'I run RadeQ myself — with a team for bigger projects.',
      paragraphs: [
        "I'm Radek Široký and I run RadeQ myself — design, build, and handover are all in one pair of hands, so you know who you're talking to and who stands behind the result. For bigger projects I bring in experienced developers and designers who are glad to join — so scope is not a limit.",
        "I've worked with websites, e-shops, SEO, marketing, and support since 2019 — and even back then I started automating repetitive office work. Since 2025 I've added analysis, testing, and data work (databases, processes, logic, methodology, security).",
        "I've been close to tech since high school — 3D and computers. I started programming on a five-axis milling machine; that's where I realized I enjoy controlling, adapting, and fixing things — and gradually turned it into software development.",
        "I'm not after flashy effects, but a website that brings in enquiries and cuts your manual work. I hand over finished and tested, so you can manage the small things yourself — without supplier lock-in.",
      ],
      photo: {
        src: '/brand/founder-about.webp',
        src2x: '/brand/founder-about@2x.webp',
        alt: 'Radek Široký, founder of RadeQ',
        width: 640,
        height: 800,
      },
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'Indicative prices without surprises.',
      lead: 'Project delivery and care are separate services: one-off indicative project prices and monthly post-launch care plans.',
      audit: {
        kicker: 'First step',
        title: 'Website or process audit',
        price: 'from CZK 3,000',
        creditedLine: 'I go through the website or process and tell you what slows it down most and what to solve first. I deduct the full audit price from implementation — if we agree to continue, the audit costs you nothing extra.',
        coverage: ['technical state', 'speed', 'SEO basics', 'forms', 'manual process steps'],
        coverageAriaLabel: 'What the audit covers',
        scopeAriaLabel: 'Audit scope',
        scope: [
          { label: 'What I audit', text: 'website · process · or both' },
          {
            label: 'What you get (output)',
            text: 'priority list (what to solve first) · implementation scope and price estimate · what is and is not worth solving',
          },
          {
            label: 'Why “from”',
            text: 'For a small website the base price applies. A larger website or process — more pages, more steps — is clarified after a short no-obligation call. It is always an audit and I deduct the full price from implementation.',
          },
        ],
        ctaLabel: 'I want an audit from CZK 3,000',
        measureHref: '/en/audit/',
        measureLabel: 'Or measure your website roughly first',
      },
      proofStrip: {
        eyebrow: 'TRY IT',
        line: 'Free machine website preview — it shows signals to check, not a verdict.',
        previewLabel: 'Free machine preview',
        paidLabel: 'Or go straight to a human audit from CZK 3,000 (deducted from implementation)',
      },
      projectTitle: 'Project work',
      projectNote: 'Project delivery follows the audit — prices are indicative (from).',
      careTitle: 'Post-launch care',
      projectItems: [
        { name: 'Process automation', price: 'from CZK 12,000' },
        { name: 'Data & AI assistants', price: 'from CZK 15,000' },
        { name: 'Company website (1–5 pages)', price: 'from CZK 25,000' },
        { name: 'E-shop', price: 'from CZK 20,000' },
        { name: 'One-page website', price: 'from CZK 10,000' },
        { name: 'Redesign of an older site', price: 'from CZK 10,000' },
      ],
      ariaLabel: 'Post-launch care plans',
      note: 'Do not want a retainer? Hour blocks 5/15/40 h (from CZK 1,100/h). I am not a VAT payer - prices are final.',
      items: [
        { title: 'Partner', price: 'CZK 15,000', suffix: '/mo.', text: 'process mapping + automation/AI prototypes, 10 h, priority support + everything in Growth', ctaLabel: 'I want to be a partner', automationBadge: 'Automation' },
        { title: 'Growth', price: 'CZK 6,000', suffix: '/mo.', text: 'everything in Calm + SEO/performance monitoring, monthly report, 3 h of development', ctaLabel: 'I want to grow together', featured: true, badge: 'Recommended' },
        { title: 'Calm', price: 'CZK 2,500', suffix: '/mo.', text: 'operation, backups, small edits (1 h), someone to call', ctaLabel: 'I want peace of mind' },
      ],
    },
    showcase: {
      eyebrow: 'Examples',
      title: 'What I can build',
      items: [
        {
          href: '/ukazky/instalater/',
          className: 'rq-ukazky-bento-card--featured',
          badge: 'SAMPLE PROJECT',
          kicker: 'Trades and local services',
          title: 'Website for a plumber',
          text: 'A clear service overview, trustworthy presentation, and fast contact for customers who need help now.',
          linkLabel: 'View example',
        },
        {
          href: '/ukazky/sluzba/',
          className: 'rq-ukazky-bento-card--booking',
          badge: 'SAMPLE PROJECT',
          kicker: 'Appointment-based services',
          title: 'Website with booking',
          text: 'A simple service presentation with a clear path to booking.',
          linkLabel: 'View example',
        },
        {
          href: '/ukazky/eshop/',
          className: 'rq-ukazky-bento-card--shop',
          badge: 'SAMPLE PROJECT',
          kicker: 'Sales and catalogue',
          title: 'Small e-shop',
          text: 'Product offer, cart, and purchase flow for a smaller catalogue.',
          linkLabel: 'View example',
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Tell me what I can help with',
      lead: 'Briefly describe what you want to simplify - I will reply and ask follow-up questions. I answer within 1 business day.',
      doneLeadHtml: 'Did you forget something or want to change the brief? Write to me at <a href="mailto:siroky@radeq.cz">siroky@radeq.cz</a> or call <a href="tel:+420730634439">+420 730 634 439</a>.',
      fields: {
        name: 'Name',
        email: 'Email',
        projectType: 'What kind of project is it?',
        message: 'What do you need to simplify?',
        budget: 'Indicative budget',
        deadline: 'Deadline',
        deadlinePlaceholder: 'For example, within 2 months',
        honeypot: 'Do not fill this field',
      },
      projectOptions: [
        { label: 'Website', value: 'Website' },
        { label: 'E-shop', value: 'E-shop' },
        { label: 'Process automation', value: 'Process automation' },
        { label: 'Data and AI', value: 'Data and AI' },
        { label: 'Website or process audit (from CZK 3,000)', value: 'Website or process audit (from CZK 3,000)' },
        { label: 'Other', value: 'Other' },
      ],
      budgetOptions: [
        { label: 'Leave open', value: '' },
        { label: 'Up to CZK 10,000', value: 'Up to CZK 10,000' },
        { label: 'CZK 10,000-30,000', value: 'CZK 10,000-30,000' },
        { label: 'CZK 30,000-60,000', value: 'CZK 30,000-60,000' },
        { label: 'CZK 60,000+', value: 'CZK 60,000+' },
      ],
      optionalSummary: 'Additional details (optional)',
      submitLabel: 'Send enquiry',
      notePrefix: 'Or write directly to',
      noteEmail: 'siroky@radeq.cz',
      notePhone: '+420 730 634 439',
      status: {
        sending: 'Sending…',
        success: 'I will get back to you as soon as possible. I look forward to working with you.',
        failureHtml: 'Sending did not work right now. Please write to <a href="mailto:siroky@radeq.cz">siroky@radeq.cz</a>.',
        verifyPrompt: 'Please confirm you are not a robot and submit again.',
      },
    },
    footer: {
      tagline: 'Rational digitalization for sole traders, small businesses, and associations. Websites, data, and automation without unnecessary complexity.',
      navTitle: 'Navigation',
      navAriaLabel: 'Footer navigation',
      connectionTitle: 'Contact',
      connectionLinks: [
        { href: '/en/#kontakt', label: 'Send an enquiry' },
        { href: '/en/#ceny', label: 'Pricing' },
      ],
      legal: '© 2026 Radek Široký — RadeQ.cz · ID No. 08748811 · Prague · Czech Republic',
      contactEmail: 'siroky@radeq.cz',
      contactPhone: '+420 730 634 439',
      mascotEnableLabel: '◍ Turn on mascot',
      mascotDisableLabel: '◍ Turn off mascot',
    },
    guide: {
      toggleLabel: 'Quick navigation',
      eyebrow: 'RadeQ',
      title: 'Quick navigation',
      closeLabel: 'Close',
      intro: 'I can help you find what you need. Choose a topic:',
      quickActionsAriaLabel: 'Quick topics',
      initialMessage: 'Choose a topic or write a short question.',
      inputLabel: 'Your question',
      inputPlaceholder: 'For example, website price',
      sendLabel: 'Send',
      topics: {
        ceny: {
          chipLabel: 'How much does it cost',
          text: 'Roughly: website from CZK 10,000, website or process audit from CZK 3,000. The full price list is in the Pricing section below — exact pricing follows a short discussion.',
          href: '#ceny',
          label: 'Go to pricing',
          followups: [
            { key: 'kontakt', label: 'Send enquiry' },
            { key: 'sluzby', label: 'Services' },
          ],
        },
        sluzby: {
          chipLabel: 'What services do you offer',
          text: 'Websites and redesigns, e-shops, process automation, data and AI work, and audits.',
          href: '#sluzby',
          label: 'Go to services',
          followups: [
            { key: 'ceny', label: 'Pricing' },
            { key: 'spoluprace', label: 'How I work' },
          ],
        },
        spoluprace: {
          chipLabel: 'How collaboration works',
          text: 'We name the problem → choose the smallest working solution → I build, test, and hand it over with a service protocol.',
          href: '#jak-pracuji',
          label: 'How I work',
          followups: [
            { key: 'kontakt', label: 'Send enquiry' },
            { key: 'ceny', label: 'Pricing' },
          ],
        },
        kontakt: {
          chipLabel: 'I want to enquire',
          text: 'Write a few sentences about what you are solving. You can also email siroky@radeq.cz.',
          href: '#kontakt',
          label: 'Go to contact',
          followups: [
            { key: 'sluzby', label: 'Services' },
            { key: 'spoluprace', label: 'How I work' },
          ],
        },
      },
      fallback: {
        text: 'That is better sent as an enquiry - Radek will answer precisely.',
        href: '#kontakt',
        label: 'Send an enquiry',
      },
      matchers: {
        ceny: ['price', 'pricing', 'cost', 'budget', 'audit', 'care', 'website', 'web', 'eshop', 'e-shop', 'shop'],
        sluzby: ['service', 'services', 'offer', 'redesign', 'automation', 'data', 'ai', 'website', 'web', 'eshop', 'e-shop'],
        spoluprace: ['how', 'process', 'collaboration', 'handoff', 'test', 'testing', 'result'],
        kontakt: ['contact', 'enquiry', 'request', 'email', 'mail', 'info'],
      },
    },
    schema: {
      description: 'Websites, e-shops, process automation, and data work for sole traders and small businesses.',
      url: 'https://radeq.cz/en/',
      areaServed: 'CZ',
      founderName: 'Radek Široký',
      addressLocality: 'Prague',
      addressCountry: 'CZ',
      knowsAbout: ['websites', 'e-shops', 'process automation', 'data work', 'AI assistants', 'SEO'],
    },
  },
} as const satisfies Record<Locale, HomeContent>;
