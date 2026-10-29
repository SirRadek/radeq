# Nasazení zákaznické rekapitulace CZ/EN

Publikováno 28. 10. 2026 v 19:01:38 CET na Cloudflare Worker `radeq`, https://radeq.cz. Verze `e1793e7a-6884-4fc7-bcb2-c9a693d860c7`, deployment `26d991fb-b1b5-478d-b811-be3321932999`, 100 % provozu. Vlastník výslovně schválil návrh, dvě kritiky, napojení a publikaci. Bez commitu/pushe.

## Výsledek

Zákaznické potvrzení nyní posílá schválený krémový/vínový HTML návrh a rovnocennou textovou variantu. Jazyk se řídí formulářem: `en…` anglicky, ostatní česky; vlastní obsah návštěvníka se nepřekládá. Anglický úvod upřesněn a logo odkazuje na `/en/`. Pevné předměty: „Poptávka dorazila — RadeQ.cz“ / „Enquiry received — RadeQ.cz“. Příjemce, odesílatel a Reply-To zachovány. Interní oznámení majiteli zůstává původní textové.

Sdílený čistý renderer je `app/release/confirmation-email.js`; používá jej zdrojová TypeScript továrna i skutečný release backend. Všechny proměnné HTML escapovány, odkazy pevné, žádné obrázky, externí fonty, skripty ani měřicí pixely šablony. Stávající validace formuláře slučuje bílé znaky zprávy; tento release ji nemění. Zpracování poptávky, D1/KV, CAPTCHA, limity, deduplikace, pořadí odesílání a chybové větve zachovány. Změna backendu omezená na import rendereru, zákaznickou továrnu a volitelné `html` v Resend payloadu. Dřívější požadavek absolutně stejného backendu pro tento rozsah nahradilo pozdější výslovné zadání vlastníka.

## Ověření a review

- Dvě nezávislé kritiky: [vizuál a text](../../email/2026-10-28-recap/review-visual.md), [technické napojení a závěrečné review](../../email/2026-10-28-recap/review-integration.md). Bez zásadních výhrad. Technik nezávisle přesnou rekonstrukcí obnovil původní SHA backendu a potvrdil rozsah změny, escaping a locale. Normalizační test sám nepokrývá libovolnou změnu uvnitř továrny; aktuální přesné bajty jsou navíc pokryty tímto nezávislým review a níže uvedenými hashi.
- `unit.log`: 136/136 unit testů. `green-test.log`: 20 cílených testů, včetně skutečného release API s mock Resend/D1/KV a úplné shody obou odchozích payloadů se zdrojovými továrnami pro CZ/EN. Žádný skutečný e-mail či zápis do produkce. Existující chybějící archivní sourcemap vypisuje nezávazné upozornění.
- `build.log` a zdrojový manifest: 24 compiled testů, Astro 87 souborů, 0 chyb/varování, 6 existujících hints; root/subpath po 45 stránkách. Manifest `build-1793210094482`, SHA256 `60fdf47443180a84782c88c915588becf0c7a2dfd5c5d03610124354e9762f7c`.
- `docs/email/2026-10-28-recap/integrated/`: HTML/text zachycené ze skutečného release handleru přes lokální mock transport. Čtyři skutečné Chromium náhledy 860/320 px bez vodorovného přetoku, bezpečnostní fixture a pevné odkazy PASS; síť blokována. Podrobnosti v `verification.json` a `payloads.json`.
- Wrangler dry-run správně přibaluje tři moduly; `upload.log` potvrzuje žádné nové frontendové soubory. `release-manifest.json`: 108 fyzických souborů včetně `_headers`, frontend/config/wrapper přesně stejné jako předchozí vydání.
- `uploaded-check.json` před přepnutím a `production-check.json` po přepnutí: všechny tři vzdálené moduly přesně odpovídají otiskům, veškeré bindings/secrets/provozní proměnné shodné, kompatibilita i pořadí Worker/Assets zachováno. Vlastní doména aktivní, workers.dev i preview verze nadále vypnuté. Předchozí verze dostupná pro návrat.
- `production-http-verification.json`: 107 veřejných aktiv odpovídá SHA (u HTML přesně odečtena známá bezpečnostní injekce Cloudflare), 12 indexovatelných rout HTTP200, 18 URL v sitemapě, správné GA4/SEM identifikátory a measurement hlavičky. Dvě syntakticky neplatné API zprávy odmítnuty 400 před vedlejšími účinky.

Ověřeno sestavení a odchozí payload, nikoli nové skutečné doručení či vykreslení v Gmail/Outlook/Apple Mail a dark mode. Předchozí skutečné doručení obou zpráv potvrdil vlastník před touto změnou. Konečný výsledek doručení závisí na poskytovateli; odpověď API 201 stále znamená uloženou poptávku. Nebyla vytvořena falešná poptávka ani analytická konverze.

## Otisky a návrat

| Modul | SHA256 |
| --- | --- |
| confirmation-email.js | aabb0bf5df2b275834d973c032c5f618db441f440e4a194edcfc0c22d3f626ea |
| production-backend.js | b1ebe3a35e6de81be9514421512442b4ac9c2bcc18d7cba9a16e645f630dbbc4 |
| index.js | 8fdf733f6868c2b73328cc5db45ea452addd417108de8b5ca47a1940b1ee7c79 |

Předchozí verzi `e566287d-1c83-4202-990c-c8d26a0274ad` uchovat nejméně do 4. 11. 2026. Návrat z `app/`: `node C:/Users/sirok/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/bin/wrangler.js versions deploy e566287d-1c83-4202-990c-c8d26a0274ad@100% --config wrangler.jsonc --yes`. Neobnovovat starší databázový dump ani mazat data. Původní snapshot c80dd… a původní soukromá verze `8f661eab-32da-47b3-b4a9-f55926c7b425` zůstávají zachovány. Starý Pages projekt se tohoto vydání neúčastní.
