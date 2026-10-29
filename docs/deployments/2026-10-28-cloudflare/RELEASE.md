# RadeQ — zveřejnění 28. 10. 2026

Nový CZ/EN web je na https://radeq.cz. Nasazení proběhlo18:21:52CET na původním Cloudflare Workeru `radeq`. Aktivní verze `e566287d-1c83-4202-990c-c8d26a0274ad`, deployment `b038c4e5-9a9c-478e-a212-1f59f217fbdf`,100% provozu. Souhlas vlastníka k publikaci byl udělen předem. Bez commitu/pushe.

## Změny

Nový design a původní formulář s opraveným odesíláním, blokováním opakovaného požadavku, zachováním vstupu při chybě a přesným potvrzením přijetí serverem. Původní API, D1/KV, tajné klíče a provozní proměnné jsou zachovány. Příjem201 znamená uložení poptávky, nikoli zaručené doručení e-mailu. Bez nové databázové migrace či výmazu.

Anglické miniatury a všechny čtyři interaktivní ukázky; opravený překryv titulku miniatury. Návrh certifikátů odstraněn. Canonical/hreflang/strukturované údaje, sitemap18 skutečných indexovatelných URL. Nové sdílené CZ/EN soukromí a podmínky spolupráce pro podnikatele i spotřebitele, neplátce DPH, nezávazná poptávka.

GA4 `G-LGSP8QDS9T`, Sklik SEM `hnmz6knxzn0cjegwwy74qv0z`: samostatné účely, výchozí odmítnutí, rovné přijetí/odmítnutí, změna v patičce. `page_view` a `generate_lead` až po analytickém souhlasu, SEMPageView/Lead až po reklamním. Lead až po skutečném potvrzení serverem. Automatické Enhanced Measurement volby v GA4 mají být vypnuté včetně změn historie; načítání stránek je šedá povinná volba a automatické odeslání configem vypíná kód. Automatický scroll/odchozí klik/formulář/video/download nejsou implementovány na hlavní stránce a neslibují se. SDK běží v odděleném odstranitelném dokumentu; jde o řízení životního cyklu, nikoli bezpečnostní sandbox proti nepřátelskému poskytovateli.

Seznam Webmaster je podle vlastníka ověřen přes DNS. Google Search Console zůstává samostatná služba; GA4 ID neověřuje vlastnictví domény. API klíč webmasteru nebyl vyžádán ani vložen.

## Důkazy

- `release-manifest.json`:108 souborů včetně `_headers`,107 veřejných aktiv, otisky backendu/wrapperu/configu. Zdrojový manifest `build-1793207924432`, SHA256 `8bcbf09d2a50dabd633d64b744d1e4878830ac9c3e2031415ff61e6cb645598d`.
- Finální sestavení:45 stránek root a45 subpath;24 compiled testů PASS,Astro87 souborů0chyb/0varování/6existujících hints. Full unit130PASS před změnou samotného veřejného GA ID. `final-ga4-build.log` a manifestové green/typecheck logy. Primární a cílené nezávislé review v `final-review.md`.
- `browser/result.json`:PASS izolovaných testů souhlasů, odvolání během/po načtení, oddělených účelů, soukromých vstupů, chyby/retry/opakovaného odesílání, jednoho přijetí, audit CAPTCHA widgetu a320/390px. Veškeré externí SDK/CAPTCHA/API v testu jsou inertní mocky; neprokazuje reálné přijetí událostí či e-mailu.
- `preview-upload-verification.json`:vzdálené moduly identické,bindings/secrets/provozní vars zachované;`preview-http-verification.json`:107 identických souborů a6 API403 bez přístupu k backendu.
- `production-http-verification.json`:107 aktiv odpovídá otiskům, u HTML se přesně odečítá identifikovaná Cloudflare JavaScript detection injekce;12 indexovatelných rout,18 URL sitemap,platné measurement hlavičky/ID,2 bezpečné400 při syntakticky neplatném JSON před zápisy/rate-limit/CAPTCHA/e-mailem. Bez vypínání ochrany Cloudflare.
- `production-control-after-cleanup.json`:aktivní verze100%,původní vlastní doména a bindings,vratná159 stále dostupná. `preview-cleanup-http.json`:radeq.cz200,obě verze náhledů a main workers.dev404. Veřejné staré vstupy uzavřené.
- `browser/production-cz.png`, `production-en-services-mobile.png`:skutečná ostrá doména v CUA;CZ/EN a390px kontrola. Analytics-only volba vytvořila očekávaný rámec; skutečné přijetí Googlem zatím neověřeno.

## Zbývající provozní kroky vlastníka

1. V GA4 otevřít Přehled v reálném čase, navštívit web a přes Nastavení cookies povolit analytiku. Ověřit `page_view`. Příjem dat v GA4 účtu nebyl agentem potvrzen.
2. Ručně odeslat skutečnou testovací poptávku na vlastní adresu s lidským dokončením CAPTCHA, ověřit přijetí a doručení. Agent reálnou pozitivní poptávku ani e-mail neposílal. Po prvním přijetí označit `generate_lead` jako klíčovou událost; nepřidávat další pravidlo podle kliknutí a nezdvojovat značku dalším vloženým skriptem.
3. V Google Search Console a Seznam Webmaster zkontrolovat sitemap `https://radeq.cz/sitemap.xml`; odeslání přes účty nebylo provedeno. GSC Wizard je kvůli ukončenému předplatnému nedostupný a nebyl placeně obnoven.
4. Provádět `retention-procedure.md`:neúspěšné poptávky6měsíců od posledního kontaktu,ruční měsíční kontrola D1/mail/exportů a skutečné retence účtů/záloh. Automatický výmaz není zaveden. Veřejné právní informace nenahrazují konkrétní předsmluvní spotřebitelské poučení a formulář před skutečnou zakázkou; nejde o právní certifikaci.

## Návrat a další vydání

Soukromou původní verzi `8f661eab-32da-47b3-b4a9-f55926c7b425` s aktivy zachovat minimálně7dní, tedy do4.11.2026. Neodstraňovat jedinou vratnou zálohu. Z `app/` lze obnovit100% provozu příkazem `node <cached-wrangler>/bin/wrangler.js versions deploy 8f661eab-32da-47b3-b4a9-f55926c7b425@100% --config wrangler.jsonc --yes`. Cesta použitého oficiálního Wrangleru4.90.1 je v deploy logu/postupu; nejde o veřejný vstup ke starému webu. Historická data se při návratu nesmějí obnovit starším dumpem ani mazat.

Aktuální neversionované nastavení Workers subdomain:enabled=false,previews_enabled=false. Případné budoucí dočasné náhledy musí zachovat gate zakazující jejich API a po vydání se znovu vypnout. Použité `versions upload` podporuje `keep_vars:true` v configu, nepodporuje CLI `--keep-vars`;neopakovat neplatnou variantu z původního návrhu plánu. OAuth při expiraci obnoví běžný Wrangler příkaz,tokeny se nikam nevypisují. Starý Pages projekt `radeq-cz` neobsluhuje doménu a zůstává mimo toto nasazení.
