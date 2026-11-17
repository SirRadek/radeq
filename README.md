# RadeQ — osobní nabídka a ukázky CZ/EN, 17. 11. 2026

Aktuální revize zpřesňuje nabídku pro živnostníky, představuje pilotní program, osobní zkušenost a ceny péče. Interaktivní ukázky zůstávají modelové. GitHub Pages je statický náhled s e-mailovým kontaktem; zveřejnění této revize neznamená nasazení na radeq.cz. [Ověření této revize](docs/verification/2026-11-17-sales-refresh/README.md).

The current revision updates the personal offer, pilot and care plans in Czech and English. The examples are illustrative. GitHub Pages is a static preview; this commit does not deploy radeq.cz.

# Předchozí revize — organická viditelnost, 30. 10. 2026

Revize z 30. 10. obsahovala sjednocenou osobní a firemní identitu, odkazy na profesní profily, popis vlastního projektu, přesnější metadata a minimální měření po souhlasu. [Tehdejší ověření a meze](docs/verification/2026-10-30-organic-foundation/README.md). Publikace zdrojů sama nedokazuje nasazení Cloudflare nebo získání návštěv či zakázek.

## O projektu / About

RadeQ je vlastní projekt Radka Širokého: web nabídky tvorby webů, automatizací, datových řešení a AI pomocníků pro živnostníky, malé firmy a spolky. Produkční web a kontakt: https://radeq.cz/. Zdrojový repozitář a modelové ukázky jsou dokladem vlastní práce, nikoli klientskou referencí.

RadeQ is Radek Široký's own project. The production website is https://radeq.cz/en/. This repository and the model demos document personal work, not client engagements or measured business outcomes.

## Předchozí auditní vydání — historický podklad

Následující doklady a počty patří předchozímu auditnímu vydání. Pro aktuální zdroje a site/ má přednost publication-manifest.json a výše odkazovaný aktuální souhrn.

Aktivní zdroje jsou v kořeni repozitáře (na Windows původně v app/). Auditní revize z 30. 10. obsahovala opravy přístupnosti, aktualizované závislosti a atomické D1 kvóty; její popis cen je historický. [CHANGELOG](CHANGELOG.md) · [Historické předání](docs/handoff/2026-10-30/README.md) · [Prompt do Codexu](docs/handoff/2026-10-30/COPY-PASTE-DO-CODEXU.md) · [Podmínky vydání](docs/deployments/2026-10-30-audit-release/README.md).

[Český Pages náhled](https://sirradek.github.io/radeq/) · [English preview](https://sirradek.github.io/radeq/en/). The October revision included bilingual accessibility repairs, patched tooling, atomic D1 quotas, migration and portable sources. A repository snapshot is not proof that the Cloudflare migration or deployment has run.

## Ověření a obnova

Node **>=22.23.4**, doporučeno Node 24; statický náhled potřebuje Node a Python 3, nikoli npm instalaci. Výchozí větev new je jiná vývojová linie. Starý checkout ani místní práci nepřepisuj/resetuj.

~~~sh
git clone --branch codex/radeq-clean-pages-20261013 --single-branch https://github.com/SirRadek/radeq.git radeq-return-2026-10-30
cd radeq-return-2026-10-30
node tools/verify-publication.mjs
python tools/serve-verified-preview.py --port 4394
~~~

Otevři http://127.0.0.1:4394/radeq/ a /radeq/en/. Na Windows případně py místo python. Server je místní a nepřijímá POST. Vývoj: npm ci, npm run dev -- --host 127.0.0.1. Oba nové buildy, compiled testy a cílené typy: node scripts/verify-themed-demos.mjs. Nový počítač vytváří nový manifest se svými cestami; historické důkazy nepřepisovat. Nespouštět souběžně další fixture buildy.

## Dva cíle

GitHub Pages je statický noindex náhled pod /radeq/, s e-mailovým kontaktem, bez skutečného poptávkového API a volitelného měření. Workflow publikuje přesně site/, nikoli automaticky nově sestavené src/dist. Produkční root pro radeq.cz má formulář, oddělené souhlasy a Worker API. Zachovat tento rozdíl.

release/ obsahuje skutečný backend včetně atomic-quotas.js; migrations/0001_atomic_quotas.sql je předpokladem jeho aktivace na Cloudflare. Na Pages se backend nespouští. Samotný GitHub commit/push nenasadí Cloudflare ani neprovede migraci. Existující LEADS_DB/D1, KV a secrets se zachovávají; podrobné pořadí, přechod kvót a bezpečný návrat jsou v podmínkách vydání. Historické deploy skripty při obnovení nespouštět.

## Identita a doložené kontroly

publication-manifest.json obsahuje relativní hashe 211 zdrojových souborů a 120 souborů webu; node tools/verify-publication.mjs ověří celý publikační balík. Přijatý build je build-1794911230605, SHA256 jeho původního manifestu je 411ab54bd4fd6df4dc8274c0d4a9b6bf8f744d7883b47f13a59b1513d693cb71. [Aktuální ověření](docs/verification/2026-11-17-sales-refresh/README.md) odděluje místní kontroly od nasazení.

Autentizace, zákaznické záznamy, soukromé rollback exporty, auditní baseline, node_modules a cache nejsou součástí veřejného balíčku. Předání z 29. a 30. října zůstávají historická; aktuální stav určuje tento README, CHANGELOG a publikační manifest.
