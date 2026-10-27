# RadeQ — web a ověřený GitHub Pages náhled

Astro, CS/EN, varianta Stopa s ukázkami přímo u služeb, ceníkem, rozsahem předání a reakční dobou. Mobilní miniatury mají čitelný průběh a krátkou animaci kurzoru; podporují klávesnici a omezení pohybu.

Node24. `npm ci`, `npm run dev`, `npm test`, `npm run build`. Kořenové a GitHub sestavení s cílenou typovou kontrolou: `node scripts/verify-themed-demos.mjs`. Obecný `npm run typecheck` zahrnuje i pracovní výstupy; doložená cílená kontrola se vztahuje na src/functions. Pro GitHub: `DEPLOY_TARGET=github-pages npm run build`.

GitHub Pages běží na https://sirradek.github.io/radeq/ se základem/radeq a noindex. Kontakt zde vede přímo na e-mail; není zde formulář ani backend pro poptávky. Homepage nenačítá nevyužité sledování kliknutí. Produkční form/backend kód zůstává zachován pro oddělené nasazení s existující Cloudflare konfigurací. Toto vydání nemění radeq.cz.

Přesné sestavení je vsite/, součty vpublication-manifest.json. Stávající clean-pages.yml publikuje site zcodex/radeq-clean-pages-20261013. Pracovní audity, lokální prototypy, závislosti a přihlašovací údaje se nepublikují.
