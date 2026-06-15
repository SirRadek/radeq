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
} as const;

export type RoutePageKey = keyof typeof routePages;
