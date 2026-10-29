# Převzetí RadeQ — 28. 10. 2026

## Aktuální místní oprava škálování — 28. 10. 2026

Na další zadání vlastníka pracovali builder, kritik a nezávislý ověřovatel. Náhledy nyní zachovávají celé skutečné CZ/EN obrázky; dlaždice přepínají mezi obrázkem vedle textu a nad textem podle vlastní šířky. Sloupce hero/ceníku/formuláře reagují na dostupný prostor po odečtení menu, cenové řádky a patka se přirozeně zalamují. Při nízkém desktopovém okně byla zachycena a opravena další chyba: zděděné flex-wrap přesouvalo jazyky mimo levou lištu. Lišta nyní používá jeden sloupec se svislým posouváním a dostupným fokusem.

Finální manifest `build-1793216670490`, SHA256 `44e870520221ea468d379347753c4b1288fb6874dc0460d7b6c585b187461ecb`.24/24 compiled testů PASS, Astro87souborů/0chyb/0varování/6hints. Všech198zdrojových hashů i oba sestavené výstupy odpovídají manifestu; proti předchozímu návrhu se změnily pouze `studio.css` a `service-stories.css`. Plán, zdrojové review, cílené re-review a vykreslené ověření: `docs/design/2026-10-28-responsive/`. CZ/EN320–1280px včetně skutečného panelu498×562, rozbalení, formuláře, patky, klávesnice a návratů z ukázek PASS. Finální cílený recheck1280×400 potvrzuje přístup k jazykům klávesnicí i svislým posuvem bez vodorovného přetečení. Nativní zoom nebyl dostupný; ekvivalentní reflow je odděleně doložen.

Uživatelův panel `http://127.0.0.1:4395/#sluzby` obnoven na finální sestavení; výchozí4394/radeq také restartován a ověřen. **Bez deploye, commitu/pushe.** Produkce a backend zůstávají ve stavu níže. Předchozí rozměry a QA jsou historické; jejich kontrola pouze globálního přetékání neprokazovala úplnost miniatur.

## Aktuální místní návrh — levé menu a kompaktní dlaždice, 28. 10. 2026

Na pozdější výběr vlastníka je v `app/` připraven směr třetí varianty: levý desktopový index, mobilní nativní menu, seskupená patka a čtyři výchozí zavřené dlaždice skutečných CZ/EN ukázek. Po rozbalení popis, čtyři kroky a samostatný proklik. E-shop se vrací na nový `#sluzba-eshop`. Výška zavřené dlaždice desktop280px; formulář524px místo původních876px. Právní texty zůstaly přesně zachovány, jsou členěné do odstavců, s obsahem a kratším čtecím sloupcem. Favicon má krátký jemný puls s původní statickou světlou/tmavou zálohou; skutečný pohyb v nativní kartě prohlížeče IAB neprokazuje.

Pouze místní implementace: **bez nového deploye, commitu/pushe**. Ostrý web nadále verze `e1793e7a-6884-4fc7-bcb2-c9a693d860c7`; backend/email renderer/wrapper/config souhlasí s předchozími SHA256. Plán a nezávislé review v `docs/superpowers/plans/2026-10-28-studio-index.md` a `docs/design/2026-10-28-layout/`. Finální manifest `build-1793213914531`, úplné ověření zdrojů/artefaktů v `verification.json`.24compiled testůPASS, Astro87souborů/0chyb/0varování. Původní141unitPASS; závěrečné tři fixture soubory narazily při souběhu buildů na timeout a všechny prošly postupným během24/24. Navíc6cílených testů právních stránek a faviconPASS. Vizuální QA: `design-qa.md`.

Pro formulář používej skutečný root build: `./start-preview.ps1 -Port 4395 -Variant root`, CZ `http://127.0.0.1:4395/`, EN `/en/`. Stávající výchozí `./start-preview.ps1` dále ověřuje a servíruje `/radeq/` na4394. Root náhled poslouchá jen na127.0.0.1, je čistě statický a POST vrací405, nemá backend; poptávku neposílat. Turnstile na localhost hlásí nepovolenou doménu110200. Žádné produkční měření/poptávka nebyly tímto testem vytvořeny.


## Aktuální produkce — rekapitulační e-mail, 28. 10. 2026, 19:01 CET

Na výslovné zadání vlastníka proběhly dvě nezávislé kritiky, drobné úpravy anglického úvodu/odkazu a napojení schváleného HTML potvrzení v CZ/EN včetně textové alternativy. Publikováno na `radeq.cz`: Worker verze `e1793e7a-6884-4fc7-bcb2-c9a693d860c7`, deployment `26d991fb-b1b5-478d-b811-be3321932999`, 100 %. Backend je od nynějška úzce změněný pro zákaznický renderer a HTML payload (SHA256 `b1ebe3a35e6de81be9514421512442b4ac9c2bcc18d7cba9a16e645f630dbbc4`); dřívější tvrzení o přesné původní kopii platí historicky. Interní oznámení a ostatní backendové bajty zachovány, nezávisle ověřeno rekonstrukcí původního hashe. D1/KV/secrets/vars/config/wrapper a frontend beze změny. Všechny tři vzdálené moduly odpovídají manifestu, workers.dev a preview nadále vypnuty.

136 unit + 24 compiled testů PASS, Astro 0 chyb/varování; skutečné lokální náhledy obou odchozích šablon 860/320 px PASS. Po nasazení 107 veřejných aktiv, 12 rout, sitemap a bezpečné neplatné API požadavky PASS. Nové doručení/vykreslení ve skutečné schránce nebylo ověřeno, nevznikla falešná poptávka ani konverze. Důkazy `docs/deployments/2026-10-28-email-release/RELEASE.md`; aktuální náhledy `docs/email/2026-10-28-recap/integrated/`. Finální zdrojový manifest `build-1793210094482`, SHA256 `60fdf47443180a84782c88c915588becf0c7a2dfd5c5d03610124354e9762f7c`. Předchozí verzi `e566287d-1c83-4202-990c-c8d26a0274ad` i původní soukromou vratnou verzi zachovat nejméně do 4. 11. 2026; nic nemaž. Bez commitu/pushe.

Následující checkpointy jsou historické; současný stav má přednost.

## Ověření měření po publikaci — 28. 10. 2026, 18:43 CET

Skutečný síťový test na ostrém webu potvrdil načtení GA4 SDK200 a dvě jednotlivá `page_view` HTTP204 pro `G-LGSP8QDS9T` při CZ/EN navigaci. Výchozí odmítnutí, přetrvávající odmítnutí a odvolání souhlasu neposílají měření; samostatný souhlas GA neposílá Seznam; query/hash/referrer v události nejsou. Kód nebyl měněn, žádné nové nasazení nebylo potřeba. Vlastník potvrdil aktivního uživatele vGA4,ale ještě nevidí „akci“:page_view hledat mezi událostmi,generate_lead je až úspěšná poptávka s analytickým souhlasem a klíčovou událost je nutné označit. Nový izolovaný test nad publikovaným artefaktem ověřil právě1generate_lead bez vstupů formuláře;žádná falešná konverze v ostrémGA4. Důkazy `docs/deployments/2026-10-28-ga4-fix/RESULT.md`, `network-verification.json` a `conversion-fixture/result.json`. Vlastník nově potvrdil doručení obou e-mailů a odeslání z EN stránky, takže anglická rekapitulace je správně. Nový návrh vzhledu e-mailu dokončen odděleně v `docs/email/2026-10-28-recap/` (CZ/ENHTML+text+stolní/mobilní náhledy) a dosud není nasazen. Skutečné e-mailové klienty návrh neověřuje.

## Aktuální produkce — 28. 10. 2026, 18:21 CET

Pozdější výslovné zadání vlastníka nahradilo původní zákaz publikace. Nový minimalistický CZ/EN web je zveřejněn na https://radeq.cz přes původní Worker `radeq`. Verze `e566287d-1c83-4202-990c-c8d26a0274ad`, deployment `b038c4e5-9a9c-478e-a212-1f59f217fbdf`, 100 % provozu. Backend je přesná původní kopie SHA-256 `c80dd654a4775cc1a49a84ec8de4b8b24b643377574cb789caeaaec4379dd67a`; D1/KV/secrets/provozní proměnné zachovány. Veřejné workers.dev a verze náhledů vypnuty, vlastní doména dále HTTP200. Soukromou vratnou verzi `8f661eab-32da-47b3-b4a9-f55926c7b425` zachovat minimálně do 4. 11. 2026; nyní nic nemaž.

GA4 `G-LGSP8QDS9T` a SEM `hnmz6knxzn0cjegwwy74qv0z` jsou zapojeny odděleně po souhlasu. Seznam Webmaster je podle vlastníka ověřen přes DNS. Nové CZ/EN soukromí a spolupráce, upravený formulář, SEO a anglické miniatury jsou v produkci. Nejde o právní certifikaci. Šestiměsíční retence neúspěšných poptávek vyžaduje ruční měsíční postup, automatický výmaz neexistuje.

Finální manifest `app/docs/audits/2026-10-09-themed-demos/build-1793207924432/artifact-manifest.json`, SHA-256 `8bcbf09d2a50dabd633d64b744d1e4878830ac9c3e2031415ff61e6cb645598d`. Po doplnění skutečného GA ID: 24 compiled testů, Astro87 souborů/0chyb/0varování/6hints, izolované browser fixture PASS. Ostrá doména:107 souborů souhlasí po přesném odečtení identifikované Cloudflare bezpečnostní injekce,12 indexovatelných rout,18 URL v sitemapě,2 bezpečná odmítnutí neplatného JSON bez zápisu. Příjem událostí v účtu GA4 a pozitivní ostrá poptávka/e-mail nebyly potvrzeny. Bez commitu/pushe. Podrobnosti: `docs/deployments/2026-10-28-cloudflare/RELEASE.md`.

Následující oddíly jsou historické checkpointy před touto publikací; jejich dřívější tvrzení „neproběhl deploy“ se vztahují pouze k danému kroku.

Balíček z `D:\radeq-predani-2026-10-28\radeq-predani-2026-10-28.zip` je rozbalen v tomto pracovním prostoru do samostatné složky `radeq-predani-2026-10-28/`. Originál na D: je zachován. Soubory webu nebyly při převzetí upraveny.

## Identita a přijatý stav

- SHA-256 ZIPu: `8bd3adf7d275b9045180705bfc2763771a97114f78d483290b8c97aec287667c`; shoduje se s přiloženým kontrolním součtem.
- `verify-package.py`: **384 souborů odpovídá SHA-256**, ověřeno na tomto Windows PC.
- Předávací checkpoint uvádí poslední ověřenou publikaci `d862c63a3bfdf99fc37409a5d7b499f4affd32b4`, větev `codex/radeq-clean-pages-20261013`. Aktuální vzdálený stav při převzetí nebyl nově ověřován.
- Lokální build v předání: `build-1793119257179`, pět zdrojových souborů s již zapracovanými nepublikovanými změnami. Seznam a otisky jsou v `STATE.json`.
- Zachovat schválený minimalistický vzhled V3/Stopa, logo, typografii, CZ/EN obsah, ceny, oddělení placeného auditu od automatické kontroly a přesné významy fází ukázek.
- Návrhová položka pro certifikáty nepředstavuje skutečné doklady. Před budoucí publikací vynechat nebo naplnit skutečnými doklady podle rozhodnutí vlastníka.

## Dokončená lokalizace po převzetí

Vlastník následně zadal anglické miniatury i celé interaktivní ukázky. Aktivním projektem je nyní `app/`, kopie předaných zdrojů bez `site/`; původní předávací balíček zůstává nedotčený. Čtyři EN adresy jsou `/radeq/en/ukazky/instalater/`, `sluzba/`, `provozni-terminal/` a `eshop/`. Přeloženy jsou také dynamické stavy, dostupnost termínů, souhrny, košík, objednávky, ovládání a exportní hlavičky. CZK ceny a původní české verze jsou zachovány. Tři obrazové miniatury pocházejí ze skutečně vykreslených anglických ukázek.

Schválený plán a jeho nezávislé review: `docs/superpowers/plans/2026-10-28-english-showcases.md` a sousední `-review.md`. Nové zadání povolilo tuto místní obsahovou změnu; neproběhl commit, push, deploy ani zásah do radeq.cz.

Aktuální důkazy Windows: `docs/verification/2026-10-28-english-showcases.md`. Unit testy **120/120**, compiled testy **24/24**, Astro **79 souborů, 0 chyb, 0 varování, 6 existujících hints**. Root i `/radeq` build obsahují po 42 stránkách. Finální manifest: `app/docs/audits/2026-10-09-themed-demos/build-1793195077266/artifact-manifest.json`. Kontroly prohlížečem zahrnuly anglické interakce všech čtyř ukázek, desktop a 320px mobilní zobrazení. Reduced-motion CSS zůstalo zachováno; runtime emulace reduced-motion, 200% zoom a backend nebyly nově ověřeny.

## Aktuální náhled na tomto PC

`start-preview.ps1` nyní spouští `serve-app-preview.py` pro ověřené sestavení z `app/`. Skript před spuštěním kontroluje SHA-256 zdrojů i výstupů podle posledního manifestu. Po změně zdrojů je nutné nové sestavení pomocí `node scripts/verify-themed-demos.mjs` v `app/`. Náhled poslouchá pouze na `127.0.0.1`.

- CZ: http://127.0.0.1:4394/radeq/
- EN: http://127.0.0.1:4394/radeq/en/
- Spuštění z tohoto adresáře: `& .\start-preview.ps1`; jiný port: `& .\start-preview.ps1 -Port 4395`. V popředí se ukončuje Ctrl+C.

## Historický záznam prvotního převzetí

Spuštěn přibalený `serve-preview.py` přes Python z Codex runtime; poslouchá pouze na `127.0.0.1:4394`. Při převzetí PID `10848` (jen historický údaj; před ukončením procesu vždy znovu ověř jeho identitu).

- CZ: http://127.0.0.1:4394/radeq/
- EN: http://127.0.0.1:4394/radeq/en/
- Opětovné spuštění v PowerShellu z tohoto adresáře: `& .\start-preview.ps1`.
- Port lze změnit: `& .\start-preview.ps1 -Port 4395`.
- Náhled spuštěný skriptem v popředí se ukončuje Ctrl+C.

Na tomto PC bylo v in-app prohlížeči ověřeno načtení české i anglické stránky, přepnutí CZ → EN a rozbalení detailu předání v obou jazycích. Anglický rozbalený detail byl zkontrolován také snímkem obrazovky. Selektor Playwright role=button nenašel nativní summary; kliknutí přes přístupný strom fungovalo. Nejde o doloženou závadu webu.

Při tomto převzetí nebyly opakovány build, unit/compiled testy, mobilní kontrola, reduced-motion, 200% zoom ani backend. Historické výsledky 119 unit + 20 compiled a Astro 0 chyb/varování zůstávají důkazy původního PC.

## Původní hranice před novým zadáním

Aktuálně dokončený krok: přenos, kontrola integrity, orientace v podkladech a obnovení místního náhledu. Další obsahové úpravy podle předávacího checkpointu čekají na zadání vlastníka. Publikace vyžaduje nové výslovné zadání; při převzetí neproběhl commit, push, deploy ani zásah do radeq.cz.

Vývojovým základem je `project/src/`, nikoli ruční editace sestaveného `project/site/`. Před implementací číst projektová pravidla a požadované review plánu. Závislosti npm zatím nebyly instalovány; Python náhled je nepotřebuje.

Dotaz autopilot-mesh se scope `project`, project_root tohoto snapshotu a slug `radeq` vrátil `unavailable / project_mesh_missing`. Mesh hash/revize nejsou dostupné. Převzetí se opírá o přibalená pravidla a checkpoint. Nepřipojovat jiný projektový Mesh a neaktivovat odložené runtime systémy.
