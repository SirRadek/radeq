Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V2 — Vlna 2b: sekci „Služby"
přetvoř z uniformní mřížky 5 stejných karet na ASYMETRICKÉ BENTO (různě velké dlaždice).
Namespace `rq-`. Zůstává na SVĚTLÉM sunken pruhu (rytmus: po tmavém „Co řeším" zase světlo).
Zachovej „od" ceny, „V ceně" řádky, odkazy. Reduced-motion + 0 overflow, mobil stack.

## Současná sekce (NAHRADÍŠ ji celou)
```
<section id="sluzby" class="rq-section rq-bleed rq-offers">
  <div class="rq-bleed__inner">
    <p class="rq-eyebrow">Služby</p>
    <h2 class="rq-h2">Co vám zjednoduším</h2>
    <div class="rq-offers__grid" data-rq-reveal aria-label="Služby a orientační ceny">
      <article class="rq-card rq-offer">
        <p class="rq-offer__price">od 9 900 Kč</p><h3>Web a redesign</h3>
        <p>Rychlý web, co vysvětlí nabídku a vodí poptávky.</p>
        <p class="rq-offer__incl">V ceně: jednostránkový web, formulář, základní SEO, měření, předání.</p>
        <a class="rq-offer__link" href="#kontakt">Mám zájem</a>
      </article>
      … další: E-shop od 19 900 ("Malý, čistý a vlastněný obchod bez balastu."; V ceně: katalog,
        košík, doprava/platba dle platformy, předání.) · Automatizace procesů od 12 000
        ("Propojím to, co děláte ručně."; V ceně: analýza procesu, jeden funkční tok,
        dokumentace, předání.) · Data a AI pomocníci od 15 000 ("Přehled v datech + AI nasazená
        prakticky."; V ceně: sběr/čištění dat, jednoduchý přehled nebo AI nad schválenými podklady.)
        · Audit webu nebo procesu 4 900 Kč ("Zmapuju, co brzdí; odečtu z realizace."; V ceně:
        technický stav, SEO základ, rychlost, formuláře, seznam priorit.)
    </div>
  </div>
</section>
```

## Cíl (nový vzhled)
- Asymetrické **bento**: dlaždice „Web a redesign" je FEATURED — větší (span 2 sloupce nebo
  2 řádky), výraznější (např. jemné vínové orámování/podkres, větší cena). Ostatní 4 menší
  v různém uspořádání (ne 1:1:1:1 nudně). CSS grid s grid-template-areas/span.
- Dlaždice **„Audit"** dostane lime `.rq-flag` „Nízkorizikový start" (vstupní bod funnelu).
- Zachovej u všech: `.rq-offer__price` (velká vínová cena), h3 název, popis, `.rq-offer__incl`
  „V ceně…", odkaz „Mám zájem" → #kontakt (u featured klidně `.rq-btn rq-btn--primary`).
- Hover lift (.rq-hoverable), reveal (data-rq-reveal + stagger --rq-i na dlaždicích),
  reduced-motion safe. Na mobilu vše do 1 sloupce, featured první.
- Zůstává `rq-bleed` sunken pruh + vnitřní wrapper.

## Vrať JSON PŘESNĚ:
{
 "section_html":"FULL nová <section id=\"sluzby\" …>…</section>",
 "rq_css_append":"CSS pro bento Služby (asymetrie přes grid-areas/span, featured zvýraznění, mobil stack, hover, reveal-friendly, 0 overflow)",
 "verify_notes":["co Opus zkontroluje (asymetrie viditelná, featured Web větší, audit lime štítek, ceny zachované, mobil)"]
}
Bez secrets/logů, žádné staré class names.
