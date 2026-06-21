Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V2 — Vlna 2c: (A) ukázky teaser
→ asymetrické bento (1 velká + 2 malé); (B) ceník → výraznější zvýraznění prostředního tarifu.
Namespace `rq-`. POZOR mantinel: ceník = NULA hravosti/motion gimmicků, jen klidné vizuální
zvýraznění (čitelnost a důvěra). Reduced-motion + 0 overflow, mobil stack.

## (A) Současný ukázky teaser (NAHRADÍŠ tuto sekci)
```
<section class="rq-bleed rq-ukazky-teaser" id="ukazky-teaser" aria-labelledby="ukazky-teaser-title">
  <div class="rq-section rq-ukazky-teaser__inner">
    <p class="rq-eyebrow">Ukázky</p>
    <h2 class="rq-h2" id="ukazky-teaser-title">Co umím postavit</h2>
    <div class="rq-ukazky-grid" data-rq-reveal>
      <a class="rq-card rq-ukazky-card" href={base + "/ukazky/instalater/"}> … „Web pro instalatéra" … </a>
      <a class="rq-card rq-ukazky-card" href={base + "/ukazky/sluzba/"}> … „Web s rezervací" … </a>
      <a class="rq-card rq-ukazky-card" href={base + "/ukazky/eshop/"}> … „Malý e-shop" … </a>
    </div>
  </div>
</section>
```
Obsah karet zachovej (3 ukázky, base-aware odkazy, štítek „VZOROVÝ PROJEKT" pokud tam je).
Cíl: **1 velká featured dlaždice** (Web pro instalatéra — největší, výraznější) + 2 menší
(rezervace, e-shop). Asymetrie přes grid span/areas. Hover lift, reveal stagger, mobil 1 sloupec.

## (B) Ceník — zvýraznit prostřední tarif (jen CSS append, BEZ změny markupu pokud to jde)
Stávající: `.rq-pricing-grid` se 3× `.rq-card.rq-price-card`, prostřední má
`.rq-price-card--featured` + badge „Doporučeno". Zvýrazni featured výrazněji: mírně větší
(scale ~1.04 nebo větší padding), nepatrně nahoru (translateY), silnější vínové orámování +
stín, badge výraznější. Na MOBILU featured plná šířka bez scale (žádné ořezy). Žádný pohyb
ani hover triky na ceníku — klid.

## Vrať JSON PŘESNĚ:
{
 "section_html":"FULL nová <section ... id=\"ukazky-teaser\">…</section> (1 velká + 2 malé)",
 "rq_css_append":"CSS: (a) bento ukázky teaser, (b) zvýraznění .rq-price-card--featured (klidné, mobil-safe). rq- prefix, 0 overflow.",
 "verify_notes":["co Opus zkontroluje (1 velká + 2 malé, featured tarif jasně větší, mobil ok, ceník bez gimmicků)"]
}
Bez secrets/logů, žádné staré class names.
