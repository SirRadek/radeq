Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V3 — Vlna 5b: 2 chování.
Vracíš edits {file, find, replace} (přesné shody) + případně CSS. reduced-motion + no-JS safe.

## FIX #1 — Marquee: NEzastavovat na hover, jen ZPOMALIT + nekonečný seamless
Současné CSS v src/styles/rq.css:
```
  html[data-rq-motion="on"] .rq-marquee__track {
    animation: rq-marquee var(--rq-marquee-duration, 24s) linear infinite;
  }

  html[data-rq-motion="on"] .rq-marquee:hover .rq-marquee__track,
  html[data-rq-motion="on"] .rq-marquee:focus-within .rq-marquee__track {
    animation-play-state: paused;
  }
```
Změň pravidlo hover/focus tak, aby se marquee NEZASTAVIL, ale ZPOMALIL (plynule pokračuje,
jen pomaleji) — např. na hover/focus výrazně delší `animation-duration` (cca 3×, tj. ~72s),
animace běží dál (`animation-play-state: running`). Ať přechod rychlost→pomalu nevypadá jako
skok (ideálně přes `transition` na vlastnosti, kterou lze animovat, nebo `@property`-řízenou
rychlost; pokud to nejde hladce, prostě delší duration je OK). Loop MUSÍ být nekonečný a
SEAMLESS (bez prázdného místa/skoku) — pokud track není duplikovaný 2×, zajisti duplikaci
obsahu (aria-hidden na duplikátu), ať `-50%` posun navazuje plynule.

## FIX #2 — Diagnostický panel: sjednotit výšku textu při kliknutí + edge fade
Struktura (src/components/RqDiagnostic.astro):
- `<div class="rq-diagnostic__output" aria-live="polite">` obsahuje N×
  `<article class="rq-diagnostic__panel" ... role="tabpanel" data-rq-diagnostic-panel>`.
- V „enhanced" stavu je vidět jen aktivní panel (ostatní `[hidden]`); JS přepíná podle tabu.
Požadavky vlastníka:
1. **Sjednotit, jak vysoko se text zobrazí** — při přepnutí tabu nesmí layout poskakovat ani
   nesmí být vidět kus předchozího panelu. Dej `.rq-diagnostic__output` STABILNÍ výšku
   (např. `min-height` dle nejvyššího panelu nebo rozumná pevná min-height; aktivní panel
   zarovnaný od shora). Přepnutí = obsah se vymění na stejném místě, žádný posun stránky.
2. **Reset na vrch při přepnutí** — když je panel scrollovatelný, po přepnutí tabu nastav
   `scrollTop = 0` aktivního panelu (uprav existující JS v RqDiagnostic, kde se přepínají
   panely — najdi blok s `data-rq-diagnostic-tab`/`data-rq-diagnostic-panel`).
3. **Edge fade při scrollu** — pokud obsah panelu přetéká a scrolluje, přidej na okraje
   (nahoře+dole) rozmazaný/fade efekt přes `mask-image: linear-gradient(...)` na
   `.rq-diagnostic__output` (nebo panelu), ať „odjíždějící" text na okrajích jemně mizí.
   Reduced-motion to neovlivní (mask je statická).

## Vrať JSON PŘESNĚ:
{
 "edits":[{"file":"...","find":"...","replace":"..."}, …],
 "rq_css_append":"(volitelné) CSS append pro marquee slowdown / diagnostic output min-height + mask edge fade, pokud to nelze čistě udělat editem",
 "verify_notes":["co Opus zkontroluje (marquee zpomalí ne zastaví + seamless; panel nepřeskakuje, reset scrollu, edge fade)"]
}
Pozn.: pokud edity v scoped <style> RqDiagnostic.astro nejdou přesně, vrať místo nich
rq_css_append s globálními `.rq-diagnostic__*` pravidly. Bez secrets/logů, žádné staré class names.
