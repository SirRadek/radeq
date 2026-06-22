Hotovo na branchi `autopilot/anim-signature`, bez push.

Build gate prošel: `$env:DEPLOY_TARGET='github-pages'; npm.cmd run build` skončil zeleně. Vite jen vypsal chunk-size warning.

Změněné soubory:
- [src/pages/index.astro](C:/Users/sirok/Documents/Projects/radeq/src/pages/index.astro:71)
- [src/styles/rq.css](C:/Users/sirok/Documents/Projects/radeq/src/styles/rq.css:2178)
- [src/components/RqMotion.astro](C:/Users/sirok/Documents/Projects/radeq/src/components/RqMotion.astro:58)

Čitelnost/no-JS/overflow:
- Etapy jsou 6 jemných mono popisků, cca 11px, tlumené přes `--rq-ink-2`; start je o trochu výraznější, lime zůstává jen endpoint `Výsledek · ověřeno`.
- No-JS stav je statický, bez `.rq-motion-ready`; browser check potvrdil 6 labelů a endpoint text.
- Overflow browser check pro `/radeq/`: 390/1280/2560 px všude `overflow=0`; na 390 px je hero visual skrytý.

Commit jsem nemohl vytvořit, protože sandbox odmítá zápis do `.git`: `Unable to create '.git/index.lock': Permission denied`. Změny jsou připravené v pracovním stromu, ale nejdou z aktuálních oprávnění stagovat ani commitnout.