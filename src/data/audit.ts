import type { Locale } from './locales';

export interface AuditContent {
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    alternatePath: string;
  };
  page: {
    title: string;
    lead: string;
    points: readonly string[];
  };
  tool: {
    formAriaLabel: string;
    inputLabel: string;
    inputPlaceholder: string;
    consent: string;
    verificationLabel: string;
    verificationPrompt: string;
    submitLabel: string;
    loadingLabel: string;
    measuredLabel: string;
    resultNote: string;
    ctaLabel: string;
    signalLabel: string;
    meaningLabel: string;
    verifyLabel: string;
    automationQuestion: string;
    automationYes: string;
    automationNo: string;
    auditProjectType: string;
    automationProjectType: string;
    statusLabels: Record<string, string>;
    apiUnavailableFinding: {
      signal: string;
      meaning: string;
      verify: string;
    };
  };
}

export const auditContent = {
  cs: {
    seo: {
      title: 'Audit webu přes Google PSI | RadeQ.cz',
      description:
        'Strojový náhled webu přes Google PageSpeed Insights bez číselného hodnocení. Výsledek slouží jako vstup k lidskému auditu od 3 000 Kč.',
      canonicalPath: '/audit/',
      alternatePath: '/en/audit/',
    },
    page: {
      title: 'Změřte web bez falešného verdiktu.',
      lead:
        'Krátký PSI náhled ukáže několik signálů k prověření. Není to verdikt ani slib výsledku; závěr dělám až v placeném lidském auditu.',
      points: ['jen oficiální Google PSI', 'bez ukládání měření do D1', 'jen kvalitativní signály'],
    },
    tool: {
      formAriaLabel: 'Měření webu přes Google PageSpeed Insights',
      inputLabel: 'Adresa webu',
      inputPlaceholder: 'např. vas-web.cz',
      consent: 'Změřím jen adresu, kterou zadáte, přes oficiální Google API.',
      verificationLabel: 'Ověření, že nejste robot',
      verificationPrompt: 'Potvrďte prosím, že nejste robot.',
      submitLabel: 'Změřit web',
      loadingLabel: 'měřím… (Google PSI)',
      measuredLabel: 'Měřená adresa',
      resultNote:
        'Tohle je jen strojový náhled, ne verdikt. V placeném auditu (od 3 000 Kč) projdu web nebo proces ručně, dám plán a cenu odečtu z realizace — uvidím i to, co stroj nezměří: cestu k poptávce, texty, navazující komunikaci a ruční kroky.',
      ctaLabel: 'Chci lidský audit od 3 000 Kč',
      signalLabel: 'Signál',
      meaningLabel: 'Co to znamená',
      verifyLabel: 'Co bych prověřil',
      automationQuestion: 'Přepisujete objednávky/poptávky ručně?',
      automationYes: 'ano',
      automationNo: 'ne',
      auditProjectType: 'Audit webu nebo procesu (od 3 000 Kč)',
      automationProjectType: 'Automatizace procesů',
      statusLabels: {
        ok: 'PSI vrátilo kvalitativní náhled.',
        no_field_data: 'Chybí reálná data návštěvníků, proto beru jen laboratorní signály.',
        unreachable: 'Google PSI web nenačetl.',
        psi_error: 'Google PSI teď nevrátilo použitelný výsledek.',
        rate_limited: 'Měření je dočasně omezené.',
        invalid_url: 'Zadejte veřejnou http/https adresu webu.',
        verification_failed: 'Ověření návštěvníka neproběhlo.',
      },
      apiUnavailableFinding: {
        signal: 'Měření teď nejde spustit',
        meaning: 'Strojový náhled se nepodařilo načíst, takže nebudu předstírat výsledek.',
        verify: 'Adresu pošlete do poptávky; v lidském auditu ji projdu ručně.',
      },
    },
  },
  en: {
    seo: {
      title: 'Website audit through Google PSI | RadeQ.cz',
      description:
        'A machine preview through Google PageSpeed Insights without a numeric verdict. The output is a starting point for a human audit from CZK 3,000.',
      canonicalPath: '/en/audit/',
      alternatePath: '/audit/',
    },
    page: {
      title: 'Measure your website without a fake verdict.',
      lead:
        'A short PSI preview shows a few signals worth checking. It is not a verdict or a promise; the conclusion comes from the paid human audit.',
      points: ['official Google PSI only', 'measurement is not written to D1', 'qualitative signals only'],
    },
    tool: {
      formAriaLabel: 'Website measurement through Google PageSpeed Insights',
      inputLabel: 'Website address',
      inputPlaceholder: 'for example, your-site.com',
      consent: 'I measure only the address you enter, through the official Google API.',
      verificationLabel: 'Verification that you are not a robot',
      verificationPrompt: 'Please confirm that you are not a robot.',
      submitLabel: 'Measure website',
      loadingLabel: 'measuring… (Google PSI)',
      measuredLabel: 'Measured address',
      resultNote:
        'This is only a machine preview, not a verdict. In the paid audit (from CZK 3,000) I go through the website or process manually, give you a plan, and deduct the price from implementation — I can also see what the machine cannot measure: enquiry path, copy, follow-up, and manual steps.',
      ctaLabel: 'I want a human audit from CZK 3,000',
      signalLabel: 'Signal',
      meaningLabel: 'What it means',
      verifyLabel: 'What I would verify',
      automationQuestion: 'Do you manually retype orders/enquiries?',
      automationYes: 'yes',
      automationNo: 'no',
      auditProjectType: 'Website or process audit (from CZK 3,000)',
      automationProjectType: 'Process automation',
      statusLabels: {
        ok: 'PSI returned a qualitative preview.',
        no_field_data: 'Real visitor data is missing, so this uses lab signals only.',
        unreachable: 'Google PSI could not load the website.',
        psi_error: 'Google PSI did not return a usable result.',
        rate_limited: 'Measurement is temporarily limited.',
        invalid_url: 'Enter a public http/https website address.',
        verification_failed: 'Visitor verification did not pass.',
      },
      apiUnavailableFinding: {
        signal: 'Measurement cannot run right now',
        meaning: 'The machine preview could not be loaded, so I will not pretend there is a result.',
        verify: 'Send the address in the enquiry; I will check it manually in the human audit.',
      },
    },
  },
} as const satisfies Record<Locale, AuditContent>;
