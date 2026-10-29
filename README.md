# RadeQ — CZ/EN vydání a návrat na první PC

**29. 10. 2026.** Kompletní aktivní zdroje z Windows, nový levý index, responzivní ukázky a podrobné předání. Zdroj je zde přímo v kořeni; na Windows byl v `app/`.

- [Český náhled](https://sirradek.github.io/radeq/) · [English preview](https://sirradek.github.io/radeq/en/)
- [CHANGELOG](CHANGELOG.md) · [Předání na první PC](docs/handoff/2026-10-29/README.md) · [Prompt do Codexu](docs/handoff/2026-10-29/COPY-PASTE-DO-CODEXU.md)
- [Design QA](design-qa.md) · [Nezávislé ověření škálování](docs/design/2026-10-28-responsive/verification.md)

## Obnova bez přepsání staré práce

Node >=22.12, doporučeno Node24; pro statický náhled Python3. Výchozí větev `new` není aktuální publikace. Starý checkout se svými změnami zachovej.

```sh
git clone --branch codex/radeq-clean-pages-20261013 --single-branch https://github.com/SirRadek/radeq.git radeq-return-2026-10-29
cd radeq-return-2026-10-29
node tools/verify-publication.mjs
python tools/serve-verified-preview.py --port 4394
```

Otevři `http://127.0.0.1:4394/radeq/` a `/radeq/en/`. Na Windows případně `py` místo `python`. Server má správné mapování prefixu, poslouchá pouze místně a nepřijímá POST. Npm není pro tento náhled potřeba.

Pro vývoj: `npm ci`, `npm run dev -- --host 127.0.0.1`. Pro nové root i GitHub sestavení, compiled testy a cílený Astro check: `node scripts/verify-themed-demos.mjs`. Nový manifest patří novému PC, historické nepřepisuj. Nespouštěj souběžně další fixture buildy. Samostatný GitHub build potřebuje `DEPLOY_TARGET=github-pages`; v PowerShell nastav `$env:DEPLOY_TARGET='github-pages'`. Bez této proměnné vzniká root varianta. Workflow samo nesestavuje: publikuje pouze `site/`.

## Dva různé cíle

GitHub Pages je statický **noindex** náhled pod `/radeq/`, s e-mailovým kontaktem, bez poptávkového formuláře/API a volitelného měření. Root sestavení pro radeq.cz má formulář, oddělené souhlasy, GA4 a Sklik. Zachovej tento záměrný rozdíl. `release/` obsahuje skutečný backend a renderer pro přenos; na Pages se nespouštějí.

Toto vydání **nemění Cloudflare**. Poslední doložená produkce: Worker `e1793e7a-6884-4fc7-bcb2-c9a693d860c7` z28.10.2026 19:01CET s novým CZ/EN e-mailem. Pozdější levý index a škálování se nyní publikují jen na GitHub. Před dalším nasazením znovu ověř vzdálený stav, zachovej D1/KV/secrets a soukromé vratné verze. Historické release skripty nespouštěj při obnovení.

## Integrita a důkazy

`publication-manifest.json` používá relativní cesty a ověřuje zdroje, `site/` i přiložené dokumenty. `node tools/verify-publication.mjs --site-only` ověří pouze veřejný web. Runtime byl přijat jako `build-1793216670490`, původní manifest SHA256 `44e870520221ea468d379347753c4b1288fb6874dc0460d7b6c585b187461ecb`. Testy28.10.jsou jasně odděleny od nové kontroly integrity/publikace29.10.

Podrobnosti v changelogu a předání. Absolutní Windows cesty a stará tvrzení „bez publikace“ v historických důkazech platí k jejich datu. Soukromé provozní exporty, autentizace, zákaznické záznamy, závislosti/cache a původní celý archiv nejsou veřejnou součástí; na Windows zůstávají zachovány.
