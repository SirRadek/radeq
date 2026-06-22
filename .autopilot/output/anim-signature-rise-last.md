Hotovo v pracovním stromu na `autopilot/anim-signature`, ale commit se nepovedl kvůli sandbox právům k `.git`: `git add` skončil na `Unable to create .../.git/index.lock: Permission denied`. Nepushoval jsem.

Build: `$env:DEPLOY_TARGET='github-pages'; npm.cmd run build` prošel zeleně. Vite jen vypsal stávající warning o chunku >500 kB.

Změněné soubory:
- [src/pages/index.astro](C:/Users/sirok/Documents/Projects/radeq/src/pages/index.astro:63)
- [src/styles/rq.css](C:/Users/sirok/Documents/Projects/radeq/src/styles/rq.css:2266)

Ověření:
- path kontrolní body jsou monotónně vzhůru: OK
- stage body jdou striktně doprava a výš, endpoint je nejvyšší: OK
- Playwright měření `390 / 1280 / 2560`: horizontální overflow `0`
- SVG texty/endpoint jsou uvnitř `viewBox="0 0 600 380"`: OK

Commit message připravená pro shell s právem zápisu do `.git`:
```bash
git add src/pages/index.astro src/styles/rq.css
git commit -m "Refine hero signature: monotonically rising journey curve (each work stage higher, peak = Výsledek)"
```