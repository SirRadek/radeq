# RadeQ — aktuální web a ověřený GitHub Pages náhled

Minimalistický web v Astro, CS/EN, se schválenou variantou V3 Stopa. Tři služby obsahují modelový průběh a přímé prokliky na čtyři interaktivní ukázky. Miniatury mají krátkou animaci kurzoru při najetí nebo zaměření klávesnicí; respektují omezení pohybu.

## Vývoj

Node 24. `npm ci`, `npm run dev`, `npm test`, `npm run build`.
Pro root a GitHub sestavení a kontrolu skutečných zdrojů: `node scripts/verify-themed-demos.mjs`. Tento skript vytvoří dočasné ověřovací výstupy pod docs/audits; nepublikují se. Obecné `npm run typecheck` zahrnuje i pracovní výstupy, proto je pro tento snapshot doložena cílená kontrola src/functions.

Pro GitHub sestavení použijte `DEPLOY_TARGET=github-pages npm run build`; výsledkem je základ /radeq/. Publikovaný přesný výstup je ve složce site, jeho součty v publication-manifest.json. Workflow clean-pages.yml publikuje tento výstup z větve codex/radeq-clean-pages-20261013.

GitHub Pages je statický veřejný náhled na https://sirradek.github.io/radeq/, s noindex. Formulář a měření zde nemají backend. Produkční kód Functions je zachován; nasazení na radeq.cz vyžaduje existující Cloudflare konfiguraci (wrangler.example.toml), D1 a neveřejné proměnné. Žádné klíče ani lokální pracovní podklady nejsou součástí snapshotu.
