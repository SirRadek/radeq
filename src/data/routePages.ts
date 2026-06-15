export const routePages = {
  kontakt: {
    path: '/kontakt/',
    title: 'Kontakt | Radeq.cz',
    description:
      'Pošlete stručnou poptávku na automatizaci, AI pomocníka, databázi, web, audit nebo rychlou IT opravu. Bez telefonu a bez závazku.',
    eyebrow: 'Radeq.cz / Kontakt',
    h1: 'Kontakt',
    lead:
      'Napište pár vět. Stačí popsat, co dnes zabírá čas, kde jsou data nebo jaký web či nástroj chcete zlepšit. Odpověď půjde přes e-mail, ne přes veřejný telefon.',
    primaryCta: 'Probrat můj problém',
    secondaryCta: 'Zobrazit ukázky práce',
    secondaryHref: '/ukazky/',
    points: ['odpověď bez technické mlhy', 'jasný další krok', 'žádný závazek bez domluvy'],
    sections: [
      {
        title: 'Co poslat',
        text: 'Popište, jestli řešíte automatizaci, AI, data, nový web, redesign, audit nebo rychlou opravu. Odkaz na současný web pomůže, ale není povinný.',
      },
      {
        title: 'Kam poptávky chodí',
        text: 'Formulář je určený pro pracovní poptávky a návaznou domluvu. Citlivé údaje, hesla ani interní dokumenty do něj nepatří.',
      },
      {
        title: 'E-mail',
        text: 'Pro přímý kontakt používejte info@radeq.cz nebo poptavky@radeq.cz. Telefon v této vlně nezveřejňuji.',
      },
    ],
  },
  sluzby: {
    path: '/sluzby/',
    title: 'Služby | Radeq.cz',
    description: 'Automatizace, AI pomocníci, databáze, formuláře, weby, audity a praktická IT péče pro jednotlivce, živnostníky a malé firmy.',
    eyebrow: 'Radeq.cz / Služby',
    h1: 'Služby',
    lead:
      'Hlavní nabídka zůstává jednoduchá: najít ruční nebo nepřehledné místo, navrhnout přiměřené řešení a postavit první funkční verzi bez zbytečné technické mlhy.',
    primaryCta: 'Probrat můj problém',
    secondaryCta: 'Zobrazit ceny',
    secondaryHref: '/#pricing',
    points: ['automatizace rutiny', 'AI pomocníci', 'data a databáze', 'weby a formuláře'],
    sections: [
      {
        title: 'Automatizace, data a AI',
        text: 'Nejdřív zjistíme, co se dnes dělá ručně, kde vznikají chyby a která data potřebují pořádek. Teprve potom dává smysl vybírat nástroj.',
      },
      {
        title: 'Weby a formuláře',
        text: 'Web, landing page nebo formulář má vysvětlit nabídku a poslat použitelné podklady dál. Není to jen vzhled, ale začátek procesu.',
      },
      {
        title: 'Audit, opravy a péče',
        text: 'Když není jasné, čím začít, začneme krátkým auditem a prioritami podle dopadu. Po předání může následovat drobný rozvoj a kontrola provozu.',
      },
    ],
  },
  portfolio: {
    path: '/portfolio/',
    title: 'Ukázky práce | Radeq.cz',
    description: 'Veřejně bezpečné ukázky práce a konceptů bez soukromých klientských dat.',
    eyebrow: 'Radeq.cz / Ukázky',
    h1: 'Ukázky práce',
    lead:
      'Místo vymyšlených referencí ukazuji typ výsledku, kontrolu kvality a cestu ke kontaktu. Staré demo routy zůstávají oddělené.',
    primaryCta: 'Probrat můj problém',
    secondaryCta: 'Otevřít veřejné ukázky',
    secondaryHref: '/ukazky/',
    points: ['pravidlový chatbot bez LLM', 'automatizace poptávek', 'nabídka bez checkoutu', 'anatomie tohoto webu'],
    sections: [
      {
        title: 'Bez soukromých dat',
        text: 'Veřejné ukázky popisují archetypy práce a bezpečné koncepty. Neobsahují klientské repozitáře, interní podklady ani privátní měření.',
      },
      {
        title: 'Ukázky jsou statické',
        text: 'Chatbot v ukázkách není LLM, RAG, model ani API. Je to pravidlový průvodce nad připravenými daty a rozhodovacím stromem.',
      },
      {
        title: 'Co ukázky dokazují',
        text: 'Důležitý je postup, srozumitelnost, ochrana dat, méně ručních chyb a jasné hranice mezi poptávkou a platbou.',
      },
    ],
  },
  soukromi: {
    path: '/soukromi/',
    title: 'Soukromí a poptávky | Radeq.cz',
    description: 'Jak Radeq.cz zachází s údaji z kontaktního formuláře a měřením webu.',
    eyebrow: 'Radeq.cz / Soukromí',
    h1: 'Soukromí a poptávky',
    lead:
      'Formulář sbírá jen údaje potřebné k odpovědi na poptávku. Měření v první implementaci nesmí posílat osobní údaje ani obsah zpráv.',
    primaryCta: 'Probrat můj problém',
    secondaryCta: 'Zpět na služby',
    secondaryHref: '/sluzby/',
    points: ['poptávky jsou dobrovolné', 'měření je bez osobních údajů', 'citlivé údaje do formuláře nepatří'],
    sections: [
      {
        title: 'Údaje z formuláře',
        text: 'Používají se k odpovědi na poptávku a domluvě dalšího kroku. Neposílejte hesla, platební údaje ani interní dokumenty.',
      },
      {
        title: 'Měření webu',
        text: 'První implementace přidává jen no-network událostní kontrakt. Cloudflare Web Analytics přijde později až po samostatném schválení.',
      },
      {
        title: 'Předání člověku',
        text: 'Poptávka nekončí automatickým rozhodnutím. Nejasné nebo citlivé věci se řeší ručně a s jasnými hranicemi.',
      },
    ],
  },
  podminky: {
    path: '/podminky/',
    title: 'Podmínky spolupráce | Radeq.cz',
    description: 'Základní podmínky poptávky, domluvy rozsahu, cenového odhadu a předání práce na Radeq.cz.',
    eyebrow: 'Radeq.cz / Podmínky',
    h1: 'Podmínky spolupráce',
    lead:
      'Stránka shrnuje praktická pravidla pro první kontakt a orientační domluvu. Konkrétní rozsah, cena, termín a odpovědnost se potvrzují až v nabídce nebo samostatné dohodě.',
    primaryCta: 'Napsat e-mail',
    primaryHref: 'mailto:info@radeq.cz',
    secondaryCta: 'Zpět na úvod',
    secondaryHref: '/',
    points: ['nezávazná poptávka', 'rozsah až po domluvě', 'předání bez skrytých slibů'],
    sections: [
      {
        title: 'Poptávka není objednávka',
        text: 'Odeslání formuláře nebo e-mailu slouží k prvnímu posouzení situace. Práce začíná až po společném potvrzení rozsahu, ceny a termínu.',
      },
      {
        title: 'Odhady a ceny',
        text: 'Ceny na webu jsou orientační. Přesná cena závisí na podkladech, technickém stavu, termínu, potřebných integracích a rozsahu předání.',
      },
      {
        title: 'Podklady a přístupy',
        text: 'Hesla, citlivé dokumenty a interní údaje neposílejte přes veřejný formulář. Pokud budou potřeba, domluví se bezpečnější způsob předání.',
      },
    ],
  },
  gdpr: {
    path: '/gdpr/',
    title: 'GDPR a osobní údaje | Radeq.cz',
    description: 'Informace o správci, účelu, rozsahu a uchování osobních údajů z poptávkového formuláře Radeq.cz.',
    eyebrow: 'Radeq.cz / GDPR',
    h1: 'GDPR a osobní údaje',
    lead:
      'Správcem údajů pro poptávky z tohoto webu je Radeq.cz. Pro dotazy k osobním údajům pište na info@radeq.cz. Formulář má sbírat jen údaje nutné k odpovědi na poptávku.',
    primaryCta: 'Napsat správci',
    primaryHref: 'mailto:info@radeq.cz',
    secondaryCta: 'Soukromí a poptávky',
    secondaryHref: '/soukromi/',
    points: ['účel: odpověď na poptávku', 'rozsah: údaje z formuláře', 'kontakt: info@radeq.cz'],
    sections: [
      {
        title: 'Jaké údaje',
        text: 'Typicky jde o jméno, e-mail, firmu nebo značku, typ projektu, zprávu a dobrovolné upřesnění. Do formuláře nepatří hesla, platební údaje ani interní dokumenty.',
      },
      {
        title: 'Proč a jak dlouho',
        text: 'Údaje slouží k odpovědi, přípravě nabídky a návazné domluvě. Nevyužité poptávky se mají držet jen po přiměřenou dobu pro vyřízení komunikace a obranu oprávněných nároků.',
      },
      {
        title: 'Práva a kontakt',
        text: 'Můžete požádat o přístup, opravu, výmaz, omezení zpracování nebo vysvětlení. Pokud máte pochybnosti, můžete se obrátit také na Úřad pro ochranu osobních údajů.',
      },
    ],
  },
  cookies: {
    path: '/cookies/',
    title: 'Cookies a měření | Radeq.cz',
    description: 'Jak Radeq.cz přistupuje ke cookies, technickému ukládání a budoucímu měření návštěvnosti.',
    eyebrow: 'Radeq.cz / Cookies',
    h1: 'Cookies a měření',
    lead:
      'Aktuální implementace počítá s lokálním nastavením vzhledu a technickými funkcemi webu. Měření návštěvnosti nebo marketingové cookies se mají zapnout až po samostatném schválení a odpovídajícím souhlasu.',
    primaryCta: 'Napsat dotaz',
    primaryHref: 'mailto:info@radeq.cz',
    secondaryCta: 'GDPR informace',
    secondaryHref: '/gdpr/',
    points: ['technické ukládání', 'bez marketingu v první vlně', 'souhlas až pro netechnické cookies'],
    sections: [
      {
        title: 'Technické nastavení',
        text: 'Web může v prohlížeči ukládat volbu světlého nebo tmavého režimu a podobná nastavení, která slouží k fungování rozhraní.',
      },
      {
        title: 'Měření návštěvnosti',
        text: 'Pokud se později zapne analytika, nesmí se do ní posílat obsah formuláře ani osobní údaje. Netechnické měření má mít jasný popis a odpovídající možnost souhlasu.',
      },
      {
        title: 'Změna souhlasu',
        text: 'Pokud bude web používat volitelné cookies, doplní se ovládání souhlasu. Do té doby tato stránka slouží jako průběžné vysvětlení aktuálního stavu.',
      },
    ],
  },
} as const;

export type RoutePageKey = keyof typeof routePages;
