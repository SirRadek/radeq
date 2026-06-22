# RadeQ.cz — ANIMACE BAKE-OFF brief (identický pro oba providery)

Implementuj **jednu signature animaci pro HERO** + jemné navázání, podle níže. Cíl bake-offu:
porovnat KVALITU a FEEL provedení mezi providery. Drž se design-locku — soudí se **feel a výkon**,
ne korektnost (korektnost je povinná pro oba).

## Identita, kterou má animace nést
radeq = „analytik a tester, který problém rozebere na data a složí řešení". Hero animace má
**vizuálně vyprávět „diagnostika → struktura → řešení"** — klidně, technicky, sebejistě. Ne ozdoba.

## Co implementovat (1 signature + navázání)
1. **Hero signature** (hlavní): do hero sekce přidej **diagnostickou SVG linku/stopu**, která se
   při načtení **vykreslí (stroke-draw)** a při scrollu jemně reaguje (parallax/posun bodu po
   křivce nebo „signal" puls). Má působit jako rozbor/měření, ne dekorace. Umísti tak, aby
   nekolidovala s textem (např. za/vedle hero copy, decentní).
2. **Navázání:** sjednoť hero reveal (eyebrow→H1→lead→proof→CTA) do jedné klidné vstupní sekvence
   (translateY malý + opacity, stagger). Žádné bounce/scale/blur.

## TVRDÁ akceptační kritéria (identická, povinná pro oba)
- Jen `transform` / `opacity` (žádná animace width/height/top/left, žádný `filter: blur` na scroll).
- Scroll-driven přes `animation-timeline: view()` s `@supports` + **IntersectionObserver fallback**.
- `prefers-reduced-motion: reduce` → animace vypnuté, obsah plně viditelný.
- **No-JS safe:** bez JS je hero plně čitelný (výchozí stav `opacity:1`), SVG statické.
- **0 horizontálního overflow** (1280/390). Lighthouse/CWV bez regrese (cíl 90+).
- Namespace `rq-`. Žádné nové fonty, žádné těžké knihovny, žádný autoplay video/canvas.

## Rozsah souborů
`src/pages/index.astro` (hero markup + SVG), `src/styles/rq.css` (animace), případně
`src/components/RqMotion.astro` (JS fallback/scrub). Nic mimo hero nerozbít.

## Výstup
Implementuj, spusť `DEPLOY_TARGET=github-pages npm.cmd run build` (musí projít), a stručně popiš:
co jsi udělal, jaký je perf dopad, jak řešíš reduced-motion/no-JS. (Commit/push řeší review gate.)
