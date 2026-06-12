export interface ChatbotGuideChoice {
  label: string;
  nextId: string;
}

export interface ChatbotGuideResult {
  summary: string;
  handoff: string;
}

export interface ChatbotGuideNode {
  id: string;
  title: string;
  body: string;
  choices: ChatbotGuideChoice[];
  result?: ChatbotGuideResult;
}

export interface ChatbotGuideData {
  title: string;
  subtitle: string;
  disclaimer: string;
  rootId: string;
  resetLabel: string;
  backLabel: string;
  handoffLabel: string;
  handoffCta: string;
  handoffHref: string;
  nodes: ChatbotGuideNode[];
}

export const chatbotGuide: ChatbotGuideData = {
  title: 'Statický průvodce bez klientských dat',
  subtitle:
    'Vyberte jednu z připravených cest. Průvodce jen přepíná schválené odpovědi a nic automaticky neodesílá.',
  disclaimer:
    'Toto je statický rozhodovací strom nad připravenými daty, ne otevřený AI chat. Slouží k bezpečné první orientaci; ochrana dat je součást hranic.',
  rootId: 'start',
  resetLabel: 'Začít znovu',
  backLabel: 'Zpět',
  handoffLabel: 'Ukázat bezpečné předání',
  handoffCta: 'Přejít na poptávku',
  handoffHref: '#terminal',
  nodes: [
    {
      id: 'start',
      title: 'Co chcete návštěvníkům zjednodušit?',
      body: 'Nejprve vyberte situaci. Každá větev je připravená dopředu a drží se bezpečných obecných informací bez klientských dat.',
      choices: [
        { label: 'Opakují se stejné dotazy nebo poptávky', nextId: 'repeat-questions' },
        { label: 'Lidé neví, jakou službu vybrat', nextId: 'offer-choice' },
        { label: 'Poptávky se ručně přepisují a ztrácejí', nextId: 'manual-work' },
      ],
    },
    {
      id: 'repeat-questions',
      title: 'Jaký typ opakování řešíte?',
      body: 'Opakované dotazy se dají často vyřešit přehlednými pravidly, krátkou FAQ cestou nebo předvyplněným shrnutím pro člověka.',
      choices: [
        { label: 'Třídění poptávek a odpovědi', nextId: 'result-chatbot' },
        { label: 'Základní FAQ pro web', nextId: 'result-faq' },
      ],
    },
    {
      id: 'offer-choice',
      title: 'Kde se lidé při výběru zastaví?',
      body: 'Když nabídka není jasná, bezpečný průvodce může vést přes několik volitelných otázek a doporučit další krok bez sběru citlivých údajů.',
      choices: [
        { label: 'Potřebují porovnat varianty', nextId: 'result-offer' },
        { label: 'Neví, jestli chtějí web, audit nebo úpravu', nextId: 'result-chatbot' },
      ],
    },
    {
      id: 'manual-work',
      title: 'Která ruční práce bolí nejvíc?',
      body: 'Ne každá automatizace musí být velký systém. Často stačí bezpečně sjednotit vstupy, kontrolu polí a předání další osobě.',
      choices: [
        { label: 'Kontrola polí a stav poptávky', nextId: 'result-automation' },
        { label: 'Předání člověku s krátkým shrnutím', nextId: 'result-handoff' },
      ],
    },
    {
      id: 'result-chatbot',
      title: 'Pomůže statický chatbot nebo FAQ průvodce',
      body: 'Nejvhodnější je krátký rozhodovací strom: návštěvník vybírá z možností, vidí připravené odpovědi a citlivější věci se předají člověku.',
      choices: [],
      result: {
        summary:
          'Doporučený další krok: sepsat nejčastější dotazy, zakázané vstupy a bezpečné odpovědi, které může web zobrazit bez zásahu člověka.',
        handoff:
          'Když si návštěvník není jistý, předání řeší člověkem zkontrolovaná poptávka. Shrnutí se nikam neposílá automaticky.',
      },
    },
    {
      id: 'result-faq',
      title: 'Stačí rozšířená FAQ cesta',
      body: 'Pokud se dotazy opakují, ale není potřeba větvený dialog, dává smysl statická FAQ sekce s jasnými hranicemi a odkazy na kontakt.',
      choices: [],
      result: {
        summary:
          'Doporučený další krok: vybrat 6-10 dotazů, napsat krátké schválené odpovědi a doplnit, co má řešit až osobní domluva.',
        handoff:
          'Nejasné nebo citlivé případy zůstávají u člověkem řízeného kontaktu. Web pouze pomůže připravit lepší zadání.',
      },
    },
    {
      id: 'result-offer',
      title: 'Pomůže průvodce nabídkou',
      body: 'Pro produkty, balíčky nebo služby se hodí jednoduché porovnání variant a nezávazný poptávkový krok bez prodeje přímo na stránce.',
      choices: [],
      result: {
        summary:
          'Doporučený další krok: vyjasnit varianty, rozdíly, vstupní otázky a text, který zákazník uvidí před poptávkou.',
        handoff:
          'Výběr varianty se předává člověkem kontrolované poptávce. Stránka nesbírá nadbytečné údaje a neuzavírá obchod.',
      },
    },
    {
      id: 'result-automation',
      title: 'Pomůže jednoduchá automatizace poptávek',
      body: 'Pokud se ručně kopírují stejné údaje, první krok je minimální formulář, kontrola polí a přehled stavu pro další zpracování.',
      choices: [],
      result: {
        summary:
          'Doporučený další krok: zmapovat vstupy, povinná pole, chybové stavy a kam má poptávka bezpečně dorazit.',
        handoff:
          'Pravidla mají ruční zálohu. Nejasné případy se zastaví a pokračují člověkem, ne automatickým rozhodnutím.',
      },
    },
    {
      id: 'result-handoff',
      title: 'Pomůže lepší předání dotazu',
      body: 'Někdy není potřeba chatbot ani automatizace. Stačí, aby web návštěvníka navedl k lepšímu zadání a jasně ukázal další krok.',
      choices: [],
      result: {
        summary:
          'Doporučený další krok: upravit kontaktní cestu, povinná pole a texty tak, aby člověk dostal méně neúplných poptávek.',
        handoff:
          'Předání zůstává člověkem řízené. Průvodce jen zmenší počet ručních chyb a zbytečných doplňujících e-mailů.',
      },
    },
  ],
};
