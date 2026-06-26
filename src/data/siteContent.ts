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
    guide: {
      eyebrow: string;
      title: string;
      text: string;
      steps: { label: string; value: string }[];
    };
    requestLabel: string;
    secondaryTitle: string;
    secondaryLead: string;
    items: {
      problem: string;
      system: string;
      output: string;
      demoModule?: ModuleId;
    }[];
  };
  pricing: {
    sectionCode: string;
    title: string;
    lead: string;
    note: string;
    items: {
      name: string;
      price: string;
      text: string;
      includes: string[];
      cta: string;
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
    servicesTitle: string;
    items: {
      label: string;
      title: string;
      text: string;
    }[];
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
      title: 'Radeq.cz | Weby pro malé firmy bez technické mlhy',
      description:
        'Radeq.cz navrhuje a staví firemní weby, redesigny a webovou péči pro živnostníky a malé firmy bez vlastního IT člověka.',
      path: '/',
      alternatePath: '/en/',
      alternateLabel: 'EN',
    },
    header: {
      ariaLabel: 'Hlavní navigace',
      brandAria: 'Radeq.cz úvod',
      navAria: 'Hlavní menu',
      navItems: [
        { href: '#services', label: 'Weby' },
        { href: '/ukazky/', label: 'Ukázky' },
        { href: '#pricing', label: 'Ceny' },
        { href: '#about', label: 'O nás' },
        { href: '#terminal', label: 'Poptávka' },
      ],
      cta: 'Probrat web',
      styleLabel: 'Téma',
      themeLabel: 'Přepnout barevný režim',
      lightTheme: 'Světlý',
      darkTheme: 'Tmavý',
    },
    hero: {
      metaAria: 'Směr návrhu',
      meta: ['Nový web', 'Redesign', 'Předání bez chaosu'],
      title: 'Web pro malé firmy, kterému rozumíte vy i vaši zákazníci.',
      lead:
        'Navrhnu, napíšu a postavím firemní web nebo redesign tak, aby jasně vysvětlil vaši nabídku, fungoval na mobilu, šel dohledat a dal se po předání normálně spravovat.',
      proof: [
        { label: 'Kompletně', value: 'struktura, texty, design, technika a základní SEO v jednom procesu' },
        { label: 'Srozumitelně', value: 'přímá domluva s jedním člověkem bez zbytečných zkratek' },
        { label: 'Předání', value: 'checklist, měření, formulář a návod, co kde ve webu najdete' },
      ],
      actionsAria: 'Hlavní akce',
      actions: [
        { href: '#terminal', label: 'Chci probrat web', variant: 'primary' },
        { href: '/ukazky/', label: 'Ukázky práce', variant: 'secondary' },
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
      sectionCode: '',
      title: 'Každý klient potřebuje jinou cestu k rozhodnutí.',
      items: [
        {
          title: 'Živnostníci',
          signal: 'Jednoduchý web, jasná nabídka, dobrý mobil a snadný kontakt.',
        },
        {
          title: 'Malé firmy',
          signal: 'Firemní web, který vysvětlí služby, ukáže důvěryhodnost a půjde předat.',
        },
        {
          title: 'Majitelé bez IT člověka',
          signal: 'Klidné vysvětlení, přiměřený rozsah a jasné rozhodnutí bez technické mlhy.',
        },
        {
          title: 'Firmy se starším webem',
          signal: 'Redesign, audit nebo opravy podle toho, co je levnější a jistější.',
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
      sectionCode: '',
      title: 'Nejdřív vybereme správnou cestu k webu.',
      lead:
        'Nabídka nezačíná technologií ani platformou. Začíná tím, co má web vyřešit pro vaši firmu a co musí pochopit zákazník.',
      mapAria: 'Cesty k novému webu nebo redesignu',
      guide: {
        eyebrow: 'Postup bez zkratek',
        title: 'Nejdřív cíl. Potom struktura. Až pak stavba.',
        text:
          'Každý krok musí být čitelný i pro člověka, který nechce řešit technické detaily. Proto oddělujeme rozhodnutí, obsah, stavbu a předání.',
        steps: [
          { label: '01', value: 'pojmenujeme, co má web zákazníkovi vysvětlit' },
          { label: '02', value: 'připravíme strukturu, texty a důvěryhodnou cestu ke kontaktu' },
          { label: '03', value: 'web otestujeme, předáme a domluvíme další péči' },
        ],
      },
      requestLabel: 'Probrat postup',
      secondaryTitle: 'Doplňkově pomohu i s provozem okolo webu.',
      secondaryLead:
        'Tyto věci dávají smysl až po základním rozhodnutí, jestli řešíme nový web, redesign, nebo audit. Nejsou hlavní slib homepage, ale praktické navazující práce.',
      items: [
        {
          problem: 'Nemáte web nebo působí zastarale',
          system: 'Nový firemní web',
          output: 'Jasná nabídka, srozumitelné texty, mobilní zobrazení, kontakt a základní SEO.',
        },
        {
          problem: 'Stávající web už nepomáhá',
          system: 'Redesign staršího webu',
          output: 'Zachováme, co funguje, a přestavíme obsah, vzhled, mobil, rychlost a poptávkovou cestu.',
        },
        {
          problem: 'Nevíte, čím začít',
          system: 'Audit webu s plánem',
          output: 'Dostanete konkrétní seznam slabých míst, priorit a odhad, jestli stačí oprava nebo nový základ.',
        },
        {
          problem: 'Po spuštění nechcete zůstat sami',
          system: 'Webová péče a rozvoj',
          output: 'Drobné úpravy, nové sekce, kontrola formulářů, SEO doporučení a technická podpora podle domluvy.',
        },
        {
          problem: 'Web funguje, ale má slabá místa',
          system: 'Rychlá pomoc s webem',
          output: 'Formuláře, měření, metadata, mobil, rychlost nebo drobné opravy ve WordPressu, Shoptetu, Shopify a dalších systémech.',
        },
        {
          problem: 'Poptávky a podklady se řeší ručně',
          system: 'Formuláře, data a jednoduchá automatizace',
          output: 'Poptávky se ukládají, třídí a posílají tam, kde je skutečně řešíte.',
        },
        {
          problem: 'Prodáváte produkty, balíčky nebo služby',
          system: 'Přehlednější nabídka nebo e-shop úprava',
          output: 'Produktové stránky, porovnání variant, měření zájmu a kratší cesta k objednávce nebo poptávce.',
        },
        {
          problem: 'Potřebujete pořádek i mimo web',
          system: 'Digitální pořádek, dokumenty a AI pomocníci',
          output: 'Praktické nastavení nástrojů, převody podkladů, jednoduché AI pomocníky nebo zaučení bez módních slibů.',
        },
      ],
    },
    pricing: {
      sectionCode: 'Orientační ceny',
      title: 'Ceny ukazuji dopředu, aby bylo jasné, o jakém rozsahu se bavíme.',
      lead:
        'Každý web má jiný rozsah, ale malá firma potřebuje rámec dřív, než pošle poptávku. Přesnou cenu dávám po krátkém zadání nebo auditu.',
      note:
        'Audit lze odečíst z následné realizace, pokud spolu navážeme na nový web, redesign nebo větší opravy.',
      items: [
        {
          name: 'Audit webu s plánem',
          price: 'od 4 900 Kč',
          text: 'Pro firmy, které nevědí, jestli web opravit, předělat, nebo postavit znovu.',
          includes: ['slabá místa webu', 'prioritní plán', 'odhad další práce'],
          cta: 'Začít auditem',
          featured: true,
        },
        {
          name: 'Jednostránkový web',
          price: 'od 9 900 Kč',
          text: 'Jedna stránka s jasnou nabídkou a poptávkovým formulářem pro rychlý start.',
          includes: ['1 strana', 'poptávkový formulář', 'základní SEO'],
          cta: 'Probrat jednostránkový web',
        },
        {
          name: 'Startovací firemní web',
          price: 'od 25 000 Kč',
          text: 'Jednodušší web pro živnostníka nebo malou firmu s jasnou nabídkou a kontaktem.',
          includes: ['1-5 podstránek', 'textová struktura', 'SEO základ a formulář'],
          cta: 'Probrat nový web',
        },
        {
          name: 'Redesign staršího webu',
          price: '35 000-75 000 Kč',
          text: 'Přestavba existujícího webu, který potřebuje lepší obsah, mobil, rychlost a důvěryhodnost.',
          includes: ['audit současného webu', 'nová struktura a texty', 'kontrola před spuštěním'],
          cta: 'Chci zlepšit web',
        },
        {
          name: 'Webová péče',
          price: 'od 2 500 Kč / měsíc',
          text: 'Drobné úpravy, kontrola funkčnosti, obsahové konzultace a technická podpora po spuštění.',
          includes: ['úpravy obsahu', 'kontrola formulářů', 'SEO a provozní doporučení'],
          cta: 'Domluvit péči',
        },
      ],
    },
    about: {
      sectionCode: 'O RadeQ',
      title: 'Jeden člověk pro obsah, techniku i klidné vysvětlení.',
      lead:
        'Za RadeQ stojí přímá domluva. Probereme cíl, srovnáme obsah, vybereme přiměřené řešení a dostanete web, kterému rozumíte i po předání.',
      profileTitle: 'Jak spolupráce vypadá',
      profileText:
        'Opírám se o zkušenost z aplikační analýzy, správy databází, webů, SEO a copywritingu. Nejdřív překládám problém do srozumitelných rozhodnutí, až potom stavím.',
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
      ],
      servicesTitle: 'S čím pomohu kromě nového webu',
      items: [
        {
          label: 'Optimalizace',
          title: 'Rychlost, SEO a měření',
          text: 'Zrychlení webu, základní dohledatelnost, titulky, odkazy, měření akcí a oprava slabých míst.',
        },
        {
          label: 'Opravy',
          title: 'Rychlá pomoc se starším webem',
          text: 'Formuláře, metadata, měření, drobné chyby a úpravy ve WordPressu, Shoptetu, Shopify, Webnode, Wix nebo vlastním webu.',
        },
        {
          label: 'Automatizace',
          title: 'Formuláře, data a jednoduché AI pomocníky',
          text: 'Sběr poptávek, třídění dat, převody dokumentů a malé pomocníky, kteří šetří ruční práci bez velkých slibů.',
        },
        {
          label: 'Konzultace',
          title: 'PC, software a digitální pořádek',
          text: 'Praktické vysvětlení, nastavení nástrojů a postupy pro firmy, které nemají vlastního IT člověka.',
        },
      ],
      note: 'Cílem není dodat co nejvíc techniky. Cílem je, aby web a navazující nástroje přestaly překážet a začaly se dát normálně používat.',
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
      waitLabel: 'Odesílám…',
      initialHistory: 'Vyplňte jméno, e-mail, typ projektu a krátkou zprávu.',
      readyStatus: 'Vyplňte povinná pole. Volitelné údaje pomůžou lépe odhadnout rozsah.',
      sendingStatus: 'Odesílám poptávku…',
      apiUnavailable: 'Formulář se nepodařilo odeslat. Zkuste to prosím později nebo napište e-mailem.',
      storedPrefix: 'Poptávka uložena',
      missingRequiredPrefix: 'Doplňte prosím',
      requiredNote: 'Pole označená jako povinná je potřeba vyplnit. Ostatní údaje můžete doplnit později.',
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
        name: 'Např. Jan Novák…',
        email: 'Např. jan@example.cz…',
        company: 'Firma nebo značka…',
        audience: 'Pro koho je web určený…',
        deadline: 'Např. během 4-8 týdnů…',
        current_url: 'Např. https://vas-web.cz…',
        budget_range: 'Např. 25-50 tis. Kč…',
        message: 'Co potřebujete postavit nebo zlepšit…',
      },
      projectOptions: [
        'Nový firemní web',
        'Redesign staršího webu',
        'Audit webu s plánem',
        'Rychlá oprava webu',
        'Webová péče a rozvoj',
        'Nejsem si jistý, potřebuji poradit',
      ],
      optionalTitle: 'Volitelné upřesnění',
      examples: [
        'set name Jan Siroky',
        'set email siroky@radeq.cz',
        'set company Radeq.cz',
        'set project_type Redesign staršího webu',
        'set audience majitelé menších firem',
        'set deadline do 8 týdnů',
        'set current_url https://example.com',
        'set budget_range 25k-50k CZK',
        'set message Potřebuji předělat starší web a lépe vysvětlit nabídku.',
        'summary',
        'submit',
      ],
    },
  },
  en: {
    layout: {
      lang: 'en',
      title: 'Radeq.cz | Websites for small businesses without technical fog',
      description:
        'Radeq.cz designs and builds company websites, redesigns, and website care for small businesses without an in-house IT person.',
      path: '/en/',
      alternatePath: '/',
      alternateLabel: 'CZ',
    },
    header: {
      ariaLabel: 'Primary navigation',
      brandAria: 'Radeq.cz home',
      navAria: 'Main menu',
      navItems: [
        { href: '#services', label: 'Websites' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#about', label: 'About' },
        { href: '#terminal', label: 'Request' },
      ],
      cta: 'Discuss website',
      styleLabel: 'Themes',
      themeLabel: 'Switch color mode',
      lightTheme: 'Light',
      darkTheme: 'Dark',
    },
    hero: {
      metaAria: 'Design direction',
      meta: ['New website', 'Redesign', 'Clear handoff'],
      title: 'A website small businesses can understand and customers can trust.',
      lead:
        'I design, write, and build company websites or redesigns that explain your offer clearly, work well on mobile, are findable, and can be handed over without technical fog.',
      proof: [
        { label: 'Complete', value: 'structure, copy, design, implementation, and SEO basics in one process' },
        { label: 'Plain', value: 'direct communication with one person and no needless acronyms' },
        { label: 'Handoff', value: 'checklist, measurement, form path, and ownership notes' },
      ],
      actionsAria: 'Primary actions',
      actions: [
        { href: '#terminal', label: 'Discuss a website', variant: 'primary' },
        { href: '/ukazky/', label: 'Work examples', variant: 'secondary' },
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
      sectionCode: '',
      title: 'Different clients need different decision paths.',
      items: [
        {
          title: 'Sole traders',
          signal: 'A simple website, clear offer, good mobile layout, and easy contact.',
        },
        {
          title: 'Small companies',
          signal: 'A company website that explains services, builds trust, and can be handed over.',
        },
        {
          title: 'Owners without an IT person',
          signal: 'Plain explanation, right-sized scope, and decisions without technical fog.',
        },
        {
          title: 'Companies with an older website',
          signal: 'Redesign, audit, or fixes depending on what is cheaper and safer.',
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
      sectionCode: '',
      title: 'First we choose the right path for the website.',
      lead:
        'The offer does not start with a platform or technical vocabulary. It starts with what the website should solve and what customers need to understand.',
      mapAria: 'Paths to a new website or redesign',
      guide: {
        eyebrow: 'Plain process',
        title: 'Goal first. Structure second. Build last.',
        text:
          'Each step must be clear even when you do not want to handle technical details. Decisions, content, build, and handoff are separated.',
        steps: [
          { label: '01', value: 'define what the website must explain to customers' },
          { label: '02', value: 'prepare structure, copy, and a trustworthy contact path' },
          { label: '03', value: 'test, hand off, and decide whether ongoing care makes sense' },
        ],
      },
      requestLabel: 'Discuss approach',
      secondaryTitle: 'I can also help with the operating layer around the website.',
      secondaryLead:
        'These items make sense after the first decision: new website, redesign, or audit. They are not the main homepage promise, but practical follow-up work.',
      items: [
        {
          problem: 'You have no website or the current one feels outdated',
          system: 'New company website',
          output: 'Clear offer, understandable copy, mobile layout, contact path, and SEO basics.',
        },
        {
          problem: 'The current website no longer helps',
          system: 'Website redesign',
          output: 'Keep what works and rebuild content, visuals, mobile behavior, speed, and the request path.',
        },
        {
          problem: 'You are not sure where to start',
          system: 'Website audit with a plan',
          output: 'A concrete list of weak spots, priorities, and whether repair or a new base is the better move.',
        },
        {
          problem: 'You do not want to be alone after launch',
          system: 'Website care and development',
          output: 'Small changes, new sections, form checks, SEO recommendations, and technical support by agreement.',
        },
        {
          problem: 'The website works but has weak spots',
          system: 'Quick website help',
          output: 'Forms, measurement, metadata, mobile, speed, or small fixes across WordPress, Shoptet, Shopify, and other systems.',
        },
        {
          problem: 'Requests and source material are handled manually',
          system: 'Forms, data, and light automation',
          output: 'Requests are stored, sorted, and sent to the place where you actually handle them.',
        },
        {
          problem: 'You sell products, packages, or services',
          system: 'Clearer offer or shop adjustment',
          output: 'Product pages, variant comparison, interest measurement, and a shorter path to an order or request.',
        },
        {
          problem: 'You need order beyond the website',
          system: 'Digital order, documents, and AI helpers',
          output: 'Practical tool setup, source-material conversion, simple AI helpers, or onboarding without hype.',
        },
      ],
    },
    pricing: {
      sectionCode: 'Indicative pricing',
      title: 'Pricing is visible early, so the scope is not a mystery.',
      lead:
        'Every website has a different scope, but a small business needs a realistic range before sending a request. The exact price follows a short brief or audit.',
      note:
        'The audit can be deducted from the follow-up implementation when we continue with a new website, redesign, or larger fixes.',
      items: [
        {
          name: 'Website audit with a plan',
          price: 'from CZK 4,900',
          text: 'For companies unsure whether to repair, redesign, or rebuild the website from a cleaner base.',
          includes: ['weak spots', 'priority plan', 'next-work estimate'],
          cta: 'Start with audit',
          featured: true,
        },
        {
          name: 'One-page website',
          price: 'from CZK 9,900',
          text: 'One page with a clear offer and enquiry form for a quick start.',
          includes: ['1 page', 'enquiry form', 'SEO basics'],
          cta: 'Discuss a one-page website',
        },
        {
          name: 'Starter company website',
          price: 'from CZK 25,000',
          text: 'A simpler website for a sole trader or small company with a clear offer and contact path.',
          includes: ['1-5 pages', 'copy structure', 'SEO basics and form'],
          cta: 'Discuss a new website',
        },
        {
          name: 'Website redesign',
          price: 'CZK 35,000-75,000',
          text: 'Rebuilding an existing website that needs clearer content, mobile behavior, speed, and trust.',
          includes: ['current-site audit', 'new structure and copy', 'pre-launch check'],
          cta: 'Improve my website',
        },
        {
          name: 'Website care',
          price: 'from CZK 2,500 / month',
          text: 'Small updates, functionality checks, content consulting, and technical support after launch.',
          includes: ['content changes', 'form checks', 'SEO and operation notes'],
          cta: 'Discuss care',
        },
      ],
    },
    about: {
      sectionCode: 'About RadeQ',
      title: 'One person for content, technical work, and plain explanation.',
      lead:
        'RadeQ is direct collaboration. We clarify the goal, organize the content, choose a fitting solution, and hand over a website you can understand after launch.',
      profileTitle: 'How the collaboration works',
      profileText:
        'The work draws on application analysis, database administration, website operations, SEO, and copywriting. First I translate the problem into clear decisions, then I build.',
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
      ],
      servicesTitle: 'What I can help with beyond a new website',
      items: [
        {
          label: 'Optimization',
          title: 'Speed, SEO, and measurement',
          text: 'Site speed, findability basics, titles, links, action tracking, and weak-spot cleanup.',
        },
        {
          label: 'Fixes',
          title: 'Quick help with an existing website',
          text: 'Forms, metadata, measurement, small errors, and edits in WordPress, Shoptet, Shopify, Webnode, Wix, or custom websites.',
        },
        {
          label: 'Automation',
          title: 'Forms, data, and simple AI helpers',
          text: 'Request intake, data sorting, document conversion, and small helpers that reduce manual work without overblown promises.',
        },
        {
          label: 'Consulting',
          title: 'PC, software, and digital order',
          text: 'Practical explanation, tool setup, and workflows for companies without their own IT person.',
        },
      ],
      note:
        'The goal is not to deliver the most technology. The goal is for the website and related tools to stop getting in the way and start being usable.',
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
      waitLabel: 'Sending…',
      initialHistory: 'Fill name, email, project type, and a short message.',
      readyStatus: 'Fill in the required fields. Optional details help estimate scope.',
      sendingStatus: 'Sending request…',
      apiUnavailable: 'The form could not be submitted. Please try again later or write by email.',
      storedPrefix: 'Request stored',
      missingRequiredPrefix: 'Please add',
      requiredNote: 'Fields marked as required must be completed. The remaining details can be added later.',
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
        name: 'For example, Jane Smith…',
        email: 'For example, jane@example.com…',
        company: 'Company or brand…',
        audience: 'Who is the website for…',
        deadline: 'For example, within 4-8 weeks…',
        current_url: 'For example, https://your-site.com…',
        budget_range: 'For example, CZK 25k-50k…',
        message: 'What do you need to build or improve…',
      },
      projectOptions: [
        'New company website',
        'Website redesign',
        'Website audit with a plan',
        'Quick website fix',
        'Website care and development',
        'Not sure, need advice',
      ],
      optionalTitle: 'Optional details',
      examples: [
        'set name Jan Siroky',
        'set email siroky@radeq.cz',
        'set company Radeq.cz',
        'set project_type Website redesign',
        'set audience small business owners',
        'set deadline within 8 weeks',
        'set current_url https://example.com',
        'set budget_range 25k-50k CZK',
        'set message Need to redesign an older website and explain the offer better.',
        'summary',
        'submit',
      ],
    },
  },
} as const satisfies Record<Locale, SiteContent>;
