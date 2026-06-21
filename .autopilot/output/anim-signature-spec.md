# Hero signature animace — SYNTÉZA (Opus z 3 nezávislých hlasů) → spec pro Codex

**Datum:** 2026-06-21 · **Vstupy:** agy (rozvinul svůj koncept), Codex (tech kritika), Opus
(positioning/art-direction). **Shoda všech tří = vysoká jistota.** Implementuje **Codex**.

## Koncept (na čem se shodli všichni tři)
**„Z chaosu nosná linka — ověřeno."** Rozházené datové body (vstupní chaos) → vykreslí se jimi
**stabilizační/best-fit křivka** (analytik dá chaosu řád), body se při průchodu **přitáhnou ke
křivce** (snapping), křivka doteče k **jednomu lime endpointu**, který se „vyřeší" do ověřeného
stavu — drobný **nitkový kříž + mono popisek `[VAL_PASSED]`** (tester/QA záruka). Kóduje radeq =
**analytik + tester**, ne generický „growth chart".

> Opravená výtka (Opus): původní agy „chaos → stoupající vlna" četlo jako growth-chart; snapping +
> best-fit + verified label to překlápí na analytik/tester. agy i Opus k tomu došli nezávisle.

## Pohyb (klid > efekt)
- **Draw JEN jednou** při prvním zobrazení (~1.8–2.2 s), pak **zmrznout**. Žádné věčné smyčky.
- Body **snap** ke křivce jak je míjí (one-shot, `transform: translate`).
- Endpoint: lime bod + kříž + `[VAL_PASSED]` se objeví na konci (jediný lime beat).
- **Puls po dráze: jen scroll-driven** (ne autoplay loop) — a klidně vypustit, pokud přidává šum.
  (Opus: nejradši vypustit; agy/Codex: max 1 řídký průchod. Default = scroll-only, žádný idle loop.)
- **Parallax** max 8–16 px na wrapperu, jen ve viewportu (nebo vypustit).

## Technika (Codex — tvrdá pravidla, shoda agy+Codex+Opus)
1. **Jeden zdroj pravdy pro křivku:** path 1× v `<defs id="rq-hero-path" pathLength="1000">`,
   viditelná stopa přes `<use href="#rq-hero-path">`. **Žádná duplicita** (CSS string × SVG d).
2. **Žádný `offset-path: path()`** (Safari iOS15-, křehké) a **nespoléhat na `animation-timeline`**
   (FF za flagem). Puls umisťovat **JS `getPointAtLength()`** podle scroll progressu; autoplay (když
   vůbec) přes SVG `<animateMotion><mpath href="#rq-hero-path"/>`.
3. **`stroke-dashoffset` draw jen jako one-shot** (paintuje, ne compositor) — po dokončení statické.
   Animovat jen `transform`/`opacity`.
4. **Progressive enhancement:** výchozí (no-JS) = **plně vykreslený statický stav** (křivka, body
   na lince, endpoint, label). Pohyb zapnout až třídou `.rq-motion-ready`, kterou přidá JS po
   kontrole `prefers-reduced-motion` + šířky + viewportu.
5. **IntersectionObserver:** mimo viewport animace/scroll-rAF **zastavit** (baterie). `will-change`
   jen krátkodobě na pohyblivý prvek, ne globálně.
6. **Layout = grid sloupce**, ne `position:absolute` přes hero:
   `grid-template-columns: minmax(0,1fr) minmax(360px,560px); gap: clamp(32px,6vw,96px)`.
   Tablet: vizuál za textem, nízký kontrast, `pointer-events:none`. **Mobil <768px: skrýt.**
   4K: clampnout šířku grafu (neroste donekonečna).
7. **Ořez:** `overflow: clip` (+`overflow-clip-margin`) jen na vizuál wrapper, **NE `overflow:hidden`
   na celý `.rq-hero`** (uřízne focus ring CTA). 0 horizontálního overflow.
8. **a11y:** SVG `aria-hidden="true" focusable="false"`; význam je i v textu. reduced-motion =
   statický stav, žádný puls/parallax.
9. **Barvy:** ~95 % tlumené (vínová/grafit), **lime jen na endpointu** (vzácný maják). Žádný
   glow/drop-shadow (FPS), žádné šipky/rotace/typewriter.
10. **Konverze (Opus):** endpoint zarovnat vertikálně **k řádku CTA** → „řešení" navádí oko na
    „Napsat poptávku".

## Akceptace
Build zelený · 0 overflow (390/1280/2560) · Lighthouse 90+ bez regrese · no-JS plně čitelný ·
reduced-motion statický · žádný idle CPU mimo viewport.

## Varianty v záloze (kdyby owner chtěl jiný charakter)
- **Regression line** (exaktní optimalizace/výkon) · **Dependency/Pipeline** (CI/CD, automatizace
  testů) · **Signal reconstruction** (debugging/refaktor legacy: šum → čistý průběh).

*Opus synthesis z [[agy refine]] + [[Codex critique]] + [[Opus brainstorm]]. Codex implementuje, Opus reviewuje před nahráním.*
