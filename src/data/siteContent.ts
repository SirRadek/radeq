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
        { href: '#top', label: 'Úvod' },
        { href: '#services', label: 'IT pomoc' },
        { href: '/ukazky/', label: 'Ukázky' },
        { href: '#about', label: 'O mně' },
        { href: '#pricing', label: 'Ceny' },
        { href: '#terminal', label: 'Poptávka' },
      ],
      cta: 'Popsat situaci',
      styleLabel: 'Téma',
      themeLabel: 'Přepnout barevný režim',
      lightTheme: 'Světlý',
      darkTheme: 'Tmavý',
    },
    hero: {
      metaAria: 'Směr návrhu',
      meta: [],
      title: 'Praktická IT pomoc pro lidi a firmy, které chtějí méně ruční práce.',
      lead:
        'Pomáhám živnostníkům, jednotlivcům, malým firmám a týmům s automatizací, AI, databázemi, weby, formuláři a propojením nástrojů tak, aby práce dávala větší smysl a méně se opakovala.',
      proof: [
        { label: 'Automatizace', value: 'opakované úkoly, formuláře a přepisování dat dostanou jednodušší tok' },
        { label: 'Data a AI', value: 'evidence, databáze a pomocníci mají jasný účel, ne jen módní nálepku' },
        { label: 'Weby', value: 'web nebo formulář beru jako vstup do systému, ne jako konec řešení' },
      ],
      actionsAria: 'Hlavní akce',
      actions: [],
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
      title: 'Nejdřív hledám místo, kde se práce zbytečně opakuje.',
      lead:
        'Nabídka nezačíná technologií ani platformou. Začíná tím, co vás brzdí: ruční přepisování, nepořádek v datech, nepropojené nástroje nebo web bez návaznosti.',
      mapAria: 'Cesty k praktičtější IT pomoci',
      guide: {
        eyebrow: 'Postup bez zkratek',
        title: 'Nejdřív provoz. Potom nástroj. Až pak stavba.',
        text:
          'Každý krok musí být čitelný i pro člověka, který nechce řešit technické detaily. Proto oddělujeme pochopení problému, návrh jednoduchého řešení, stavbu a předání.',
        steps: [
          { label: '01', value: 'pojmenujeme, co se dnes dělá ručně, pomalu nebo opakovaně' },
          { label: '02', value: 'vybereme nejjednodušší řešení: formulář, evidenci, automatizaci, web nebo AI pomocníka' },
          { label: '03', value: 'výsledek otestujeme, vysvětlíme a domluvíme další péči jen tam, kde dává smysl' },
        ],
      },
      requestLabel: 'Probrat situaci',
      secondaryTitle: 'Web může být začátek. Ne konec řešení.',
      secondaryLead:
        'Když web, formulář nebo nabídka sbírá poptávky, musí navazovat na další práci. Proto řeším i provozní vrstvy okolo: měření, data, opravy, obsah a přehlednější předání.',
      items: [
        {
          problem: 'Přepisujete stejné věci pořád dokola',
          system: 'Automatizace rutinní práce',
          output: 'Formuláře, tabulky, e-maily a opakované kroky dostanou jednodušší tok, který šetří čas i chyby.',
        },
        {
          problem: 'Chcete použít AI, ale nevíte kde',
          system: 'AI pomocníci s jasným účelem',
          output: 'Navrhnu malé pomocníky pro třídění dotazů, přípravu odpovědí, práci s texty nebo interní rozhodování.',
        },
        {
          problem: 'Data jsou v tabulkách, e-mailech a hlavách lidí',
          system: 'Databáze, evidence a přehledy',
          output: 'Srovnáme vstupy, pole, stavy a výstupy tak, aby bylo jasné, co se děje a kdo má udělat další krok.',
        },
        {
          problem: 'Nástroje spolu nemluví',
          system: 'Propojení systémů a formulářů',
          output: 'Poptávky, objednávky nebo podklady se pošlou tam, kde se opravdu řeší, místo aby se ručně kopírovaly.',
        },
        {
          problem: 'Web nebo formulář nesbírá použitelné podklady',
          system: 'Web jako vstup do systému',
          output: 'Web, redesign nebo formulář navrhnu tak, aby vysvětlil nabídku a zároveň poslal správná data dál.',
        },
        {
          problem: 'Stávající web má slabá místa',
          system: 'Rychlá webová oprava, SEO a měření',
          output: 'Formuláře, metadata, mobil, rychlost nebo drobné opravy ve WordPressu, Shoptetu, Shopify a dalších systémech.',
        },
        {
          problem: 'Prodáváte produkty, balíčky nebo služby',
          system: 'Přehlednější nabídka nebo e-shop úprava',
          output: 'Produktové stránky, porovnání variant, měření zájmu a kratší cesta k objednávce nebo poptávce.',
        },
        {
          problem: 'Potřebujete pořádek i mimo web',
          system: 'Digitální pořádek, software a AI pomocníci',
          output: 'Praktické nastavení nástrojů, převody podkladů, jednoduché AI pomocníky nebo zaučení bez módních slibů.',
        },
      ],
    },
    pricing: {
      sectionCode: 'Orientační ceny',
      title: 'Ceny ukazuji dopředu, aby bylo jasné, o jakém rozsahu se bavíme.',
      lead:
        'Každý web, automatizace nebo datové řešení má jiný rozsah, ale živnostník i malá firma potřebují rámec dřív, než pošlou poptávku. Přesnou cenu dávám po krátkém zadání nebo auditu.',
      note:
        'Audit lze odečíst z následné realizace, pokud spolu navážeme na web, automatizaci, datový pořádek nebo větší opravy.',
      items: [
        {
          name: 'Audit webu nebo procesu s plánem',
          price: '2 900-4 900 Kč',
          text: 'Pro jednotlivce, živnostníky nebo firmy, které nevědí, jestli opravit web, formulář, data nebo ruční postup.',
          includes: ['slabá místa webu nebo procesu', 'prioritní plán', 'odhad další práce'],
          cta: 'Začít auditem',
          featured: true,
        },
        {
          name: 'Startovací web nebo formulářová cesta',
          price: 'od 25 000 Kč',
          text: 'Jednodušší web, landing page nebo formulář pro člověka či malý tým, který potřebuje jasnou nabídku a použitelné podklady.',
          includes: ['1-5 podstránek nebo toků', 'textová struktura', 'SEO základ a formulář'],
          cta: 'Probrat start',
        },
        {
          name: 'Redesign nebo provozní zjednodušení',
          price: '35 000-75 000 Kč',
          text: 'Větší úprava existujícího webu, formulářů, evidence nebo ručního workflow, které už brzdí další práci.',
          includes: ['audit současného stavu', 'nová struktura a postup', 'kontrola před spuštěním'],
          cta: 'Chci zlepšit provoz',
        },
        {
          name: 'Průběžná IT a webová péče',
          price: 'od 2 500 Kč / měsíc',
          text: 'Drobné úpravy, kontrola funkčnosti, obsahové konzultace, formuláře, data a technická podpora po spuštění.',
          includes: ['úpravy obsahu', 'kontrola formulářů a dat', 'SEO a provozní doporučení'],
          cta: 'Domluvit péči',
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
      servicesTitle: 'S čím pomohu vedle samotného webu',
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
          text: 'Praktické vysvětlení, nastavení nástrojů a postupy pro lidi a firmy, které nemají vlastního IT člověka.',
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
        'Automatizace rutinní práce',
        'AI pomocník nebo chatbot',
        'Databáze, evidence a přehled',
        'Web nebo formulářová cesta',
        'Audit webu nebo procesu s plánem',
        'Rychlá oprava webu nebo nástroje',
        'Nejsem si jistý, potřebuji poradit',
      ],
      optionalTitle: 'Volitelné upřesnění',
      examples: [
        'set name Jan Siroky',
        'set email siroky@radeq.cz',
        'set company Radeq.cz',
        'set project_type Audit webu nebo procesu s plánem',
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
        { href: '#top', label: 'Home' },
        { href: '#services', label: 'IT help' },
        { href: '/ukazky/', label: 'Work' },
        { href: '#about', label: 'About' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#terminal', label: 'Request' },
      ],
      cta: 'Describe situation',
      styleLabel: 'Themes',
      themeLabel: 'Switch color mode',
      lightTheme: 'Light',
      darkTheme: 'Dark',
    },
    hero: {
      metaAria: 'Design direction',
      meta: [],
      title: 'Practical IT help for people and teams that want less manual work.',
      lead:
        'I help individuals, sole traders, small businesses, and teams with automation, AI, databases, websites, forms, and connected tools so work makes more sense and repeats less.',
      proof: [
        { label: 'Automation', value: 'repetitive tasks, forms, and copied data get a simpler path' },
        { label: 'Data and AI', value: 'records, databases, and helpers need a clear job, not just a trendy label' },
        { label: 'Websites', value: 'a website or form is an entry point into a system, not the end of the work' },
      ],
      actionsAria: 'Primary actions',
      actions: [],
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
      title: 'First I look for the place where work repeats for no good reason.',
      lead:
        'The offer does not start with a platform or technical vocabulary. It starts with what slows you down: copied data, messy records, disconnected tools, or a website with no follow-up process.',
      mapAria: 'Paths to practical IT help',
      guide: {
        eyebrow: 'Plain process',
        title: 'Operation first. Tool second. Build last.',
        text:
          'Each step must be clear even when you do not want to handle technical details. Problem understanding, a simple solution, build, and handoff are separated.',
        steps: [
          { label: '01', value: 'name what is manual, slow, or repeated today' },
          { label: '02', value: 'choose the simplest useful path: form, records, automation, website, or AI helper' },
          { label: '03', value: 'test, explain, and keep ongoing care only where it makes sense' },
        ],
      },
      requestLabel: 'Discuss situation',
      secondaryTitle: 'A website can be the start. Not the whole solution.',
      secondaryLead:
        'When a website, form, or offer collects requests, it should connect to the next step. That is why I also handle measurement, data, fixes, content, and handoff around the public page.',
      items: [
        {
          problem: 'You copy the same information again and again',
          system: 'Automation for repeated work',
          output: 'Forms, sheets, emails, and repeated steps get a simpler path that saves time and reduces mistakes.',
        },
        {
          problem: 'You want to use AI but do not know where it helps',
          system: 'AI helpers with a clear purpose',
          output: 'Small helpers for sorting requests, preparing replies, working with text, or supporting internal decisions.',
        },
        {
          problem: 'Data lives in sheets, emails, and people’s heads',
          system: 'Databases, records, and overviews',
          output: 'Inputs, fields, states, and outputs are organized so the next step and owner are visible.',
        },
        {
          problem: 'Your tools do not talk to each other',
          system: 'Connected systems and forms',
          output: 'Requests, orders, or source material move to the place where the work actually happens instead of being copied manually.',
        },
        {
          problem: 'The website or form does not collect useful information',
          system: 'Website as a system entry point',
          output: 'A new website, redesign, or form explains the offer and sends useful data to the next workflow.',
        },
        {
          problem: 'The existing website has weak spots',
          system: 'Quick website fixes, SEO, and measurement',
          output: 'Forms, measurement, metadata, mobile, speed, or small fixes across WordPress, Shoptet, Shopify, and other systems.',
        },
        {
          problem: 'You sell products, packages, or services',
          system: 'Clearer offer or shop adjustment',
          output: 'Product pages, variant comparison, interest measurement, and a shorter path to an order or request.',
        },
        {
          problem: 'You need order beyond the website',
          system: 'Digital order, software, and AI helpers',
          output: 'Practical tool setup, source-material conversion, simple AI helpers, or onboarding without hype.',
        },
      ],
    },
    pricing: {
      sectionCode: 'Indicative pricing',
      title: 'Pricing is visible early, so the scope is not a mystery.',
      lead:
        'Every website, automation, or data cleanup has a different scope, but an individual or small business needs a realistic range before sending a request. The exact price follows a short brief or audit.',
      note:
        'The audit can be deducted from the follow-up implementation when we continue with a website, automation, data cleanup, or larger fixes.',
      items: [
        {
          name: 'Website or process audit with a plan',
          price: 'CZK 2,900-4,900',
          text: 'For individuals, sole traders, or companies unsure whether to fix a website, form, data flow, or manual process.',
          includes: ['website or process weak spots', 'priority plan', 'next-work estimate'],
          cta: 'Start with audit',
          featured: true,
        },
        {
          name: 'Starter website or form path',
          price: 'from CZK 25,000',
          text: 'A simpler website, landing page, or form for a person or small team that needs a clear offer and useful source material.',
          includes: ['1-5 pages or flows', 'copy structure', 'SEO basics and form'],
          cta: 'Discuss a start',
        },
        {
          name: 'Redesign or operations cleanup',
          price: 'CZK 35,000-75,000',
          text: 'A larger improvement to an existing website, form flow, record system, or manual workflow that now slows work down.',
          includes: ['current-state audit', 'new structure and process', 'pre-launch check'],
          cta: 'Improve operations',
        },
        {
          name: 'Ongoing IT and website care',
          price: 'from CZK 2,500 / month',
          text: 'Small updates, functionality checks, content consulting, forms, data, and technical support after launch.',
          includes: ['content changes', 'form and data checks', 'SEO and operation notes'],
          cta: 'Discuss care',
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
      servicesTitle: 'What I can help with beyond the website itself',
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
          text: 'Practical explanation, tool setup, and workflows for people and companies without their own IT person.',
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
        'Automation for repeated work',
        'AI helper or chatbot',
        'Database, records, or overview',
        'Website or form path',
        'Website or process audit with a plan',
        'Quick website or tool fix',
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
