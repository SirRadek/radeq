Hotovo v pracovním stromu na branchi `autopilot/radeq-v1-2026-06-18`.

Build: prošel zeleně  
`DEPLOY_TARGET=github-pages npm.cmd run build`

Overflow ověření: 1280 / 1920 / 2560 px má `horizontalOverflow: 0`.

Commit: neproveden  
Důvod: sandbox nemá write práva do `.git`; `git add/commit` končí na `Unable to create .../.git/index.lock: Permission denied`. Commit hash tedy není k dispozici.

Změněné soubory:
- `src/pages/index.astro`
- `src/components/RqDiagnostic.astro`
- `src/components/RqMotion.astro`
- `src/styles/rq.css`

Shrnutí oprav:
- Marquee přepsané na 2 identické skupiny s oddělovačem po každé položce a JS `requestAnimationFrame` posunem s plynulým hover zpomalením.
- Diagnostika je full-bleed přes viewport, obsah zůstává centrovaný.
- Duplicitní `Rozbor` v tab řádku odstraněn, zůstává jen v output panelu.
- `mask-image` z diagnostického outputu odstraněn, přidaný stránkový edge-fade přes fixed gradienty.
- Karty služeb už nejsou klikací na `#kontakt`; přidané jedno klidné CTA pod gridem.