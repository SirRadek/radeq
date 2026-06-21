Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V2 — Vlna 3b: „Blueprint Q" —
SVG linka, která kreslí proces přes 3 kroky v sekci „Jak pracuji". Brandový, lehký prvek.
Namespace `rq-`. Vrátíš náhradu sekce #jak-pracuji + CSS append. SVG stroke-draw, vínová.
Reduced-motion + NO-JS safe (linka se ukáže plně), 0 horizontal overflow, mobil ok.

## Současná sekce (NAHRADÍŠ ji celou)
```
<section id="jak-pracuji" class="rq-section rq-process">
  <p class="rq-eyebrow">Jak pracuji</p>
  <h2 class="rq-h2">Nejdřív měřím, pak stavím.</h2>
  <div class="rq-process__steps" aria-label="Postup spolupráce">
    <article class="rq-card rq-step"><span class="rq-step__num">1</span><h3>Pojmenujeme problém</h3></article>
    <article class="rq-card rq-step"><span class="rq-step__num">2</span><h3>Vybereme nejmenší funkční řešení</h3></article>
    <article class="rq-card rq-step"><span class="rq-step__num">3</span><h3>Postavím, otestuji a předám</h3></article>
  </div>
  <article class="rq-guarantee"> … „Servisní protokol & Testerova záruka" blok (ZACHOVEJ beze změny obsahu) … </article>
</section>
```
(Guarantee blok obsah zachovej: eyebrow „Servisní protokol & Testerova záruka", h3 „Každá
zakázka má jasný výstup a ověřený výkon.", odstavec o servisním protokolu a Lighthouse 90+/15 %.)

## Cíl „Blueprint Q"
- Přidej **inline SVG linku**, která vizuálně PROPOJUJE 3 kroky (např. vodorovně na desktopu
  skrz/pod čísly kroků; lehké zakřivení, ať to evokuje „ocásek Q"/blueprint, ne rovné pravítko).
  Vínová barva (var(--rq-burgundy)), tenký stroke, dekorativní (aria-hidden).
- **Stroke-draw animace:** linka se „nakreslí" (stroke-dasharray/offset z plné délky na 0) až
  když sekce vstoupí do viewportu. REUSE existující mechaniku: na obalující prvek dej
  `data-rq-reveal` (RqMotion island přidá `.is-in`), a v CSS: když je `.is-in`, animuj stroke.
  pathLength="1" usnadní výpočet.
- **No-JS / reduced-motion:** bez `html[data-rq-motion="on"]` nebo při prefers-reduced-motion
  ať je linka rovnou plně vykreslená (stroke-dashoffset:0) — nikdy neviditelná.
- Kroky 1–3 zachovej (čísla, nadpisy). Na mobilu linka buď svislá nebo se elegantně skryje
  (display:none pod ~700px je OK, kroky se stackují). Žádné překrytí textu.
- Guarantee blok pod tím beze změny.

## Vrať JSON PŘESNĚ:
{
 "section_html":"FULL nová <section id=\"jak-pracuji\" …>…</section> (kroky + inline SVG linka + guarantee blok)",
 "rq_css_append":"CSS pro blueprint linku (stroke-draw přes .is-in, vínová, no-JS/reduced-motion = plná linka, mobil, 0 overflow)",
 "verify_notes":["co Opus zkontroluje (linka propojuje kroky, kreslí se na reveal, no-JS plná, mobil bez překrytí)"]
}
Bez secrets/logů, žádné staré class names.
