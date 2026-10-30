# Changelog

## 2026-10-30 — organická viditelnost, místně ověřený kandidát

- CZ/EN metadata a úvod upřesňují nabídku i Radka Širokého; propojená Person/business identita, čtyři profesní/firemní odkazy a stručný vlastní případový doklad. Modelová dema nejsou klientské reference. H1, ceny a vzhled zachovány.
- Jasné odlišení automatické kontroly zdarma a ručního auditu od 3 000 Kč na stránkách služeb.
- Místní GA4 tag G-KEYQT7L6WE, bounded rq_source a contact_intent/form_start/generate_lead pouze po odpovídajícím souhlasu. Úprava CZ/EN soukromí, striktní iframe zprávy, odvolání a deduplikace. Pages providery prázdné; backend a D1 migrace se nemění.
- 16 cílených + 24 compiled testů PASS, oba buildy a typy bez errors/warnings, 6 stávajících hints; nezávislé M3/M4 APPROVE. Místní SDK fixture nedokazuje ostrý přenos ani přijetí zákaznické poptávky. [Podrobnosti](docs/verification/2026-10-30-organic-foundation/README.md).


## 2026-10-30 — audit fixes, patched dependencies and atomic quotas

- **Přístupnost CZ/EN:** servisní CTA má krémový text na existujícím vínovém panelu (naměřeno 9,2935:1), odkaz do češtiny používá cs nezávisle na popisku, ověření má pojmenovanou roli group a kávová ilustrace roli img. Bez redesignu nebo změny cen.
- **Závislosti:** Astro 7.4.4, React integrace 7.1.2, Vitest 4.1.12, Vite 8.3.5 a Sharp 0.35.5; minimální Node 22.23.4. React 19.2.6, Tailwind 4.3.0 a TypeScript 6 zůstávají. parse5 je výslovná testovací závislost. Čistá instalace a oba npm audity bez známých advisory.
- **Kvóty:** sdílený atomic-quotas.js používají TS handlery i skutečný Worker. Atomické D1 rezervace nahrazují závodící KV čítače; společná recipient/global rezervace nevyčerpává rozpočet odmítnutým opakovaným příjemcem. Při chybě úložiště žádný fail-open; již uložená poptávka zachová 201 i při přeskočeném potvrzení. Přidána aditivní migrace a skutečné SQLite/D1 testy.
- **Soukromí:** CZ/EN vysvětluje pseudonymní D1 čítače,24 h/10 min okna a doběh fyzického cleanupu při neaktivním webu. Datum soukromí 30.října; spolupráce 28.října. Ruční zákaznická retence zůstává oddělená.
- **Ověření kandidáta:**164 unit PASS/1 skip,24 compiled PASS, Astro 87 souborů/0 chyb/0 varování/6 hints, source-bound browser 32 frontend+32 dem+4 Reactguards+16 právních renderů+36 metadata. Nezávislé finální review schválilo lokální kandidát; neprohlašuje neprovedené živé testy.
- **Přenos:**206 přesných zdrojů,117 souborů site/, nové předání a veřejný allowlist. Historie/větev/workflow zachovány. Zdroj migrace ani statický GitHub balíček samy o sobě neprokazují provedení Cloudflare deploye. [Aktuální předání](docs/handoff/2026-10-30/README.md).


## 2026-10-29 — publikace GitHub CZ/EN a předání

Na dosavadní publikační historii navazuje kompletní přijatý Windows stav. Přidány aktivní zdroje, aktuální `site/`, release backend/renderer, přenositelné součty/verifikátor/náhled, podrobné předání a historické review/snímky/testy. Stávající větev `codex/radeq-clean-pages-20261013` a workflow zachovány. Výchozí větev `new` a Cloudflare se nemění. Přihlašovací údaje, zákaznická data a soukromé rollback exporty v Git nejsou.

### Zahrnutá práce z 28. 10. 2026

- **Převzetí:** zachováno pět již aplikovaných změn předání: drobné EN texty, audit pod mobilními akcemi, rozbalovací předání/ověření výsledku/zkušenosti. Starý patch neaplikovat znovu. [Historie](PREVZETI.md).
- **EN miniatury a celé ukázky:** instalatér, rezervace, dílenský terminál, e-shop; včetně interakcí, prázdných/chybových stavů, termínů, souhrnů, košíku, objednávek a exportních hlaviček. Ceny stále CZK, návraty respektují jazyk. [Důkazy](docs/verification/2026-10-28-english-showcases.md).
- **Srovnání tří verzí:** tehdejší místní/GitHub/radeq.cz, vizuál, detaily, texty a chyby. Gemini/Sol/Terra/Luna podklady dokončeny; Sonnet a Opus v AGY nedokončeny kvůli kvótě, vlastník schválil uzavření s omezením. Historické vady později nahrazené produkce nejsou současný stav. [Srovnání](docs/audits/2026-10-28-three-way/SROVNANI.md).
- **Cloudflare náhrada webu:** 28.10.nasazen minimalistický root web CZ/EN přes původní Worker, při zachování backendu/D1/KV/secrets a soukromého návratu. Formulář, metadata/canonical/hreflang/strukturovaná data, sitemap, soukromí a spolupráce v obou jazycích. Návrhové certifikáty nebyly vydávány za doklady. [Release](docs/deployments/2026-10-28-cloudflare/RELEASE.md).
- **Právní rozhodnutí:** zákazníci podnikatelé i spotřebitelé, neplátce DPH, neúspěšné poptávky6měsíců od posledního kontaktu, bez newsletteru. Retence je ruční měsíční postup, automatický výmaz neexistuje; nejde o právní certifikaci. [Retence](docs/deployments/2026-10-28-cloudflare/retention-procedure.md).
- **Měření:** GA4 `G-LGSP8QDS9T`, Seznam SEM/Sklik `hnmz6knxzn0cjegwwy74qv0z`, odděleně až po souhlasu. Search Console existuje; Seznam Webmaster ověřen přes DNS podle vlastníka. Skutečné `page_view` HTTP204 potvrzeno, odmítnutí/odvolání bez volitelného přenosu. `generate_lead` až po úspěšné poptávce s analytickým souhlasem, bez hodnot polí; nevytvářena falešná ostrá konverze. [Síťový test](docs/deployments/2026-10-28-ga4-fix/RESULT.md).
- **Rekapitulační e-mail:** schválený krémový/vínový HTML a text CZ/EN, dvě kritiky, escapování a sdílený renderer. Jazyk odpovídá formuláři; EN rekapitulace po EN odeslání je správně. Interní oznámení zůstalo původní. Úzká změna backendu pro renderer/import/html payload nasazena28.10.19:01CET. [Release a součty](docs/deployments/2026-10-28-email-release/RELEASE.md).
- **Levý index a kompaktní design:** vybrán třetí koncept s levým desktopovým menu a seskupenou patkou, nativní mobilní menu, menší formulář, čtyři rozbalovací dlaždice se skutečnými ukázkami a popisem/postupem. E-shop vlastní dlaždice/návrat `#sluzba-eshop`. Právní texty beze změny obsahu, členěné odstavce/obsah/kratší řádek. Favicon krátce pulzuje se statickou zálohou a reduced-motion/lifecycle podporou. [Design](docs/design/2026-10-28-layout/ROZBOR.md).
- **Škálování:** celé obrázky bez cover ořezu, kompozice podle šířky karty, sloupce podle prostoru po odečtení menu, přirozené zalamování cen a patky. Zachycena a opravena další chyba: nízká lišta zalamovala jazyky mimo svůj sloupec; nyní dostupné svisle i klávesnicí. [Finální ověření](docs/design/2026-10-28-responsive/verification.md).

### Ověření a hranice

Přijatý runtime:198zdrojů, dva výstupy,24compiled PASS, Astro87souborů/0chyb/0varování/6existujících hints. Skutečné vykreslení39stavů CZ/EN a7cílených kontrol lišty,320–1280px včetně498×562panelu. Původní unit běhy a sériově opravené fixture timeouty zůstávají doložené v QA; nejde o nové testy29.10. Toto vydání znovu ověřuje přesné bajty a veřejnou publikaci.

Nativezoom nebyl dostupný,125/200%ekvivalentní reflow jej nenahrazuje. IAB neprokazuje animaci favicon v nativní liště. Nový e-mail ověřen renderem/mock transportem; nové skutečné Gmail/Outlook/dark-mode doručení po změně nebylo testováno. Root localhost bez API, Turnstile110200 je známé omezení. [Úplné předání](docs/handoff/2026-10-29/README.md).

## 2026-10-27 — předchozí publikace

`d862c63a3bfdf99fc37409a5d7b499f4affd32b4`: reviewed bilingual copy and contextual audit entry. Zachována v historii.
