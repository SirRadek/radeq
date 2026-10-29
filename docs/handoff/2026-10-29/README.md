# Předání zpět na první PC — 29. 10. 2026

Toto předání a [CHANGELOG](../../../CHANGELOG.md) mají přednost před historickým [PREVZETI](../../../PREVZETI.md). [Prompt do nového Codexu](COPY-PASTE-DO-CODEXU.md). Všechny aktivní zdroje jsou v Git, nikoli pouze sestavený web.

## Obnova

Starý rozpracovaný checkout ponech. Klonuj novou složku podle kořenového README, výslovně větev `codex/radeq-clean-pages-20261013`; výchozí `new` není aktuální publikace. Zdroj byl na Windows v `app/`, zde je v kořeni. Starý patch již aplikován, neaplikuj znovu.

```sh
node tools/verify-publication.mjs
python tools/serve-verified-preview.py --port 4394
```

Otevři `http://127.0.0.1:4394/radeq/` a `/radeq/en/`. Pro statický náhled není třeba npm. Vývoj: Node24, `npm ci`, `npm run dev -- --host 127.0.0.1`. Nové ověření/build: `node scripts/verify-themed-demos.mjs` (nový manifest na tomto PC). Souběžné fixture buildy nespouštěj. Nejdřív obnovit a potvrdit stav, další změny či publikace až podle dalšího zadání.

Runtime převzat z `build-1793216670490`, manifest SHA256 `44e870520221ea468d379347753c4b1288fb6874dc0460d7b6c585b187461ecb`. Před balením ověřeno198zdrojů a oba výstupy. `site/` je přesný subpath výstup116souborů. Nový `publication-manifest.json` má relativní cesty; staré absolutní Windows lokátory v důkazech jsou historické, nepřepisovat.

## Rozdíl nasazení

| Cíl | Stav |
|---|---|
| GitHub CZ/EN | Nový levý index a opravené škálování; statický noindex náhled pod/radeq, e-mailový kontakt, bez formuláře/API/volitelného měření. Workflow publikuje site/, nikoli automaticky nové src/dist. Přesný commit: git rev-parse HEAD a postrelease receipt u ZIP. |
| radeq.cz CZ/EN | Poslední doložený Worker e1793e7a-6884-4fc7-bcb2-c9a693d860c7 z28.10.2026 19:01CET: minimalistický web a nový zákaznický e-mail. Pozdější levý index/škálování tímto krokem na Cloudflare nasazen nebyl. Vzdálené API nebylo29.10.znovu kontrolováno. |
| Root vývojový build | Aktuální design i formulář/consent, vzniká bez DEPLOY_TARGET. Statický localhost nemá Worker API; Turnstile110200 na nepovoleném localhost je známé omezení, neodesílat. |

`release/` obsahuje skutečné produkční moduly; na Pages se nespouštějí. Backend SHA256 `b1ebe3a35e6de81be9514421512442b4ac9c2bcc18d7cba9a16e645f630dbbc4`; renderer `aabb0bf5df2b275834d973c032c5f618db441f440e4a194edcfc0c22d3f626ea`; wrapper `8fdf733f6868c2b73328cc5db45ea452addd417108de8b5ca47a1940b1ee7c79`. Souhlas s HTML e-mailem povolil úzkou změnu renderer/import/html payload, ostatní backend zachovat.

Předchozí Worker `e566287d-1c83-4202-990c-c8d26a0274ad` a soukromou vratnou verzi `8f661eab-32da-47b3-b4a9-f55926c7b425` uchovat alespoň do4.11.2026. Soukromé exporty zůstávají v původním Windows docs/deployments mimo Git/ZIP, nic nebylo smazáno; nejde o databázovou zálohu. Před případným dalším deployem nově ověř vzdálený stav/bindings, zachovej D1/KV/secrets. Historické release skripty při obnovení nepouštěj.

## Rozhodnutí vlastníka a zbývající práce

- Design třetí varianty: levé menu a skupinová patka, služby menší, dlaždice skutečných ukázek, popis/postup po rozbalení. Celý obraz vedle textu nebo nad textem podle šířky. Právní odstavce/kratší řádky, nikoli nové patkové písmo. Favicon krátký puls se statickou zálohou.
- Produkční poptávka na siroky@radeq.cz plus potvrzení návštěvníkovi; jazyk podle formuláře. Nové CZ/EN HTML+text potvrzení schváleno, kritizováno, napojeno a nasazeno. Interní oznámení se neměnilo.
- GA4 `G-LGSP8QDS9T`, Seznam SEM/Sklik `hnmz6knxzn0cjegwwy74qv0z`: veřejné měřicí identifikátory, oddělený souhlas. Search Console existuje, Seznam Webmaster dle vlastníka ověřen DNS. generate_lead pouze po úspěchu a se souhlasem; v GA4 případně označit klíčovou událost. Bez hodnot polí/osobních údajů, bez newsletteru.
- Podnikatelé i spotřebitelé, neplátce DPH, neúspěšné poptávky6měsíců od posledního kontaktu. Ruční měsíční retence není automatické mazání. [Postup](../../deployments/2026-10-28-cloudflare/retention-procedure.md). Právní texty nejsou certifikace právníkem.
- Zachovat ceny web od10000Kč, audit od3000Kč s odečtem navazující realizace, péče2500/6000/15000Kč; odpověď do1pracovního dne. Žádné smyšlené certifikáty, klienti či metriky.
- AGY přihlášení se nepřenáší. Sonnet/Opus review kvůli tehdejší kvótě nedokončeny, vlastník schválil uzavření s omezením; netvrdit šest úspěšných recenzí ani automaticky kupovat API/měnit účet.
- Nativezoom zůstává neověřený (pouze ekvivalentní reflow), IAB neprokazuje animaci favicon v nativní kartě. Nový e-mail po změně nebyl znovu ověřen ve skutečné schránce/Gmail/Outlook/dark mode; render/mock payload prošly, starší skutečné doručení obou zpráv potvrdil vlastník.
- Na cílovém PC přihlášení GitHub/Cloudflare běžným provider loginem. Tokeny/cookies/úložiště přihlášení se nekopírovaly. Autopilot logování/lifecycle/Context Manager na Windows odloženy; při obnovení neaktivovat.

## Důkazy

[EN](../../verification/2026-10-28-english-showcases.md), [srovnání](../../audits/2026-10-28-three-way/SROVNANI.md), [Cloudflare](../../deployments/2026-10-28-cloudflare/RELEASE.md), [GA4](../../deployments/2026-10-28-ga4-fix/RESULT.md), [e-mail](../../deployments/2026-10-28-email-release/RELEASE.md), [layout](../../design/2026-10-28-layout/ROZBOR.md), [responzivita](../../design/2026-10-28-responsive/verification.md), [plány/review](../../superpowers/plans/).

Přijaté kontroly28.10.:24compiled PASS, Astro87souborů/0chyb/0varování/6hints;39vykreslených stavů+7cílených kontrol lišty. Historické unit běhy a sériové opravy timeoutů jsou přiloženy. Na novém PC nejsou automaticky čerstvými výsledky. Podrobné logy finálního sestavení: ../../verification/accepted-build-2026-10-28/.

Veřejná distribuce obsahuje úplný aktivní vývojový podklad a vybrané důkazy, nikoli node_modules/cache/soukromé provozní exporty/zákaznické záznamy/autentizaci. Původní archiv naD: zůstává samostatný a nedotčený; není třeba jej znovu aplikovat.
