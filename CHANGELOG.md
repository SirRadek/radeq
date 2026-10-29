# Changelog

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
