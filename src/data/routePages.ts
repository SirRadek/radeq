export const routePages = {
  kontakt: {
    path: '/kontakt/',
    title: 'Kontakt | Radeq.cz',
    description:
      'Pošlete stručnou poptávku na nový web, redesign, audit nebo rychlou opravu webu. Bez závazku.',
    eyebrow: 'Radeq.cz / Kontakt',
    h1: 'Kontakt',
    lead:
      'Napište pár vět. Stačí typ webu, současný stav a co se má zlepšit. Ozvu se e-mailem, nebo zavolejte na +420 730 634 439.',
    primaryCta: 'Chci probrat web',
    secondaryCta: 'Zobrazit ukázky práce',
    secondaryHref: '/ukazky/',
    points: ['odpověď bez technické mlhy', 'jasný další krok', 'žádný závazek bez domluvy'],
    sections: [
      {
        title: 'Co poslat',
        text: 'Popište, jestli řešíte nový web, redesign, audit nebo rychlou opravu. Odkaz na současný web pomůže, ale není povinný.',
      },
      {
        title: 'Kam poptávky chodí',
        text: 'Formulář je určený pro pracovní poptávky a návaznou domluvu. Citlivé údaje, hesla ani interní dokumenty do něj nepatří.',
      },
      {
        title: 'E-mail',
        text: 'Pro přímý kontakt používejte info@radeq.cz nebo poptavky@radeq.cz. Nebo zavolejte na +420 730 634 439.',
      },
    ],
  },
  sluzby: {
    path: '/sluzby/',
    title: 'Služby | Radeq.cz',
    description: 'Nové firemní weby, redesigny, audity, rychlé opravy a webová péče pro malé firmy.',
    eyebrow: 'Radeq.cz / Služby',
    h1: 'Služby',
    lead:
      'Hlavní nabídka zůstává jednoduchá: nový web, redesign, audit, rychlá oprava a navazující péče. Doplňky řešíme až podle cíle webu.',
    primaryCta: 'Chci probrat web',
    secondaryCta: 'Zobrazit ceny',
    secondaryHref: '/#pricing',
    points: ['nový firemní web', 'redesign staršího webu', 'audit webu s plánem', 'rychlá oprava'],
    sections: [
      {
        title: 'Nový web a redesign',
        text: 'Nejdřív srovnáme nabídku, strukturu a texty. Teprve potom dává smysl řešit vzhled, techniku a spuštění.',
      },
      {
        title: 'Audit a opravy',
        text: 'Když není jasné, jestli web opravit nebo přestavět, začneme krátkým auditem a prioritami podle dopadu.',
      },
      {
        title: 'Péče po spuštění',
        text: 'Po předání může následovat drobný rozvoj, kontrola formulářů, SEO doporučení a bezpečný provozní pořádek.',
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
    primaryCta: 'Chci probrat web',
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
    primaryCta: 'Chci probrat web',
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
