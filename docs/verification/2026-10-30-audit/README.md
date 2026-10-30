# Přenosný souhrn přijatého kandidáta — 30. 10. 2026

Zdrojový běh build-1793375135964, původní manifest SHA256 07e7ea616855edfd1de03859a94b9a4f23ebc7d2fead9ed9311100c8cb581b8a. 206 zdrojů, root 117 a /radeq 117 souborů. Na jiném PC nelze použít původní absolutní cesty; publication-manifest.json přenáší relativní hashe a hotový site/.

- Úplný unit běh 164 PASS/1 skip;28 souborů passed/3 compiled sady skipped. 24 compiled testů ověřeno zvlášť vůči aktuálnímu manifestu.
- Oba buildy PASS; Astro 87 souborů,0 errors/0 warnings/6 existujících hints.
- Npm audit full i omit-dev 0 známých advisory; čistá npm ci zachovala lock, npm ls bez invalid peer stromu. Nejde o záruku neznámých chyb nebo tvrzení o všech živých cestách.
- Skutečný SQLite souběh přes nezávislé connections/threads a lokální Workerd/D1 ověřil limity, expiraci, rollback a fail-closed. Původní executable race vytvořil 2 potvrzení; nový při 2 platných 201 vytvoří 1 návštěvnické potvrzení a 2 interní zprávy. Externí služby byly fixture, ne zákaznické e-maily/PSI.
- Finální Chromium:32 frontend+32 dema+4 Reactguards+16 právních renderů+36 metadata PASS. Root/subpath,CZ/EN,320×740/1280×400. Kontrast servisního panelu 9,2935:1; menu, disclosures a ukázky fungují. Root 18 sitemapURL indexable/selfcanonical/recipročníalternates; subpath noindex/prázdná sitemap. 206 source+234 artifact hashe před/po shodné.
- Nezávislé native review plánu, frontend/dependency změn i finálního kandidáta přijato. Poslední reviewer přepočítal hashe a provedl 30 cílených testů plus SQL sondy, bez blokujícího nálezu.

Toto jsou kontroly přesného lokálního kandidáta před publikací, nikoli čerstvé testy nového klonu či postdeploy. Kontrola přenosných hashů prokazuje pouze stejné bajty. Není doložena skutečná doručitelnost, externí Turnstile/PSI/měření, živé cross-region D1, aktuální GSC index, Safari/Firefox/čtečka/nativnízoom ani provozní retenční či smluvní praxe. Soukromé provozní výstupy, auditní baseline a auth se nepřibalují.
