Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V2 — Vlna 1b: MOTION ISLAND +
zapojení na homepage. Aktivuje CSS hooky z Vlny 1a (které čekají na html[data-rq-motion="on"]
a třídu .is-in na [data-rq-reveal]). Vanilla JS, žádný framework. Přístupné, reduced-motion
safe, no-JS safe (bez JS musí být obsah plně viditelný — což CSS z 1a zajišťuje).

## Existující fakta (homepage src/pages/index.astro)
- Hero: `<section class="rq-section rq-hero" id="top" ...>` → `<div class="rq-hero__copy">`
  obsahuje `<p class="rq-eyebrow">Racionální digitalizace</p>`, `<h1 class="rq-display">…</h1>`,
  `<p class="rq-lead">…</p>`; pak `<div class="rq-proof-rail" …>` a `<div class="rq-hero__actions" …>`
  se dvěma odkazy: `<a class="rq-btn rq-btn--primary" href="#kontakt">Domluvit 15min konzultaci</a>`
  a `<a class="rq-btn rq-btn--ghost" href="#sluzby">Podívat se na ukázky</a>`.
- Sekce mají vzor `<p class="rq-eyebrow">…</p>` + `<h2 class="rq-h2" …>…</h2>`.
- Karty jsou `<article class="rq-card …">` v mřížkách (.rq-pain__grid, .rq-offers__grid,
  .rq-pricing-grid, .rq-ukazky-grid/teaser).
- CSS z 1a: `[data-rq-reveal]{opacity:0;transform:translateY(18px)}`,
  `html[data-rq-motion="on"] [data-rq-reveal].is-in{opacity:1;transform:none;transition:…}`,
  stagger přes inline `style="--rq-i:N"`.

## 1) `src/components/RqMotion.astro`
Astro komponenta s `<script>` (běží na stránce, žádný React). Logika:
- Pokud `matchMedia('(prefers-reduced-motion: reduce)').matches` → NIC nedělej (obsah zůstane
  viditelný; data-rq-motion se nenastaví).
- Jinak: `document.documentElement.dataset.rqMotion = 'on';`
- IntersectionObserver nad `[data-rq-reveal]`: při vstupu do viewportu přidej třídu `is-in`
  (jednou, pak unobserve). threshold ~0.15, rootMargin třeba '0px 0px -8% 0px'.
- Magnetic: pro každý `[data-rq-magnetic]` na pointer zařízeních (matchMedia '(pointer:fine)')
  na `pointermove` jemně posuň prvek k kurzoru (max ±6px) přes transform, na `pointerleave`
  reset. Nepoužívej na touch.
- Count-up: pro každý `[data-rq-count]` (atribut = cílové číslo) při prvním vstupu do viewportu
  animuj z 0 na cílovou hodnotu (~900ms, requestAnimationFrame), zachovej případnou příponu
  v textu. (Zatím nemusí mít cíle — jen schopnost.)
- Vše idempotentní, bez chyb když prvky nejsou.

## 2) Zapojení — vrať `index_edits` jako pole {find, replace} (přesné shody, Opus aplikuje)
Přidej:
- import + `<RqMotion />` na homepage (např. vedle `<RqGuide />`).
- `data-rq-reveal` + `style="--rq-i:0|1|2|3"` na hero prvky: eyebrow, h1, lead, proof-rail, actions
  (postupný stagger). (Pozor: hero h1 je `<h1 class="rq-display">` — najdi přesně.)
- `data-rq-reveal` na nadpisové bloky sekcí (eyebrow nebo h2 každé sekce) — co řeším, služby,
  jak pracuji, ceny, ukázky, kontakt.
- `data-rq-reveal` na mřížky karet (.rq-pain__grid, .rq-offers__grid, .rq-pricing-grid a teaser),
  ať se obsah objeví při doscrollování.
- `data-rq-magnetic` na hero `.rq-btn--primary`.
Najdi konkrétní stávající řetězce (uveď je ve `find` přesně tak, jak jsou v markupu výše) a do
`replace` přidej atributy. Drž počet edits rozumný (~10–14).

## Vrať JSON PŘESNĚ:
{
 "rqmotion_astro":"FULL src/components/RqMotion.astro",
 "index_include":{"find":"…existující řetězec…","replace":"…+ import a <RqMotion/>…"},
 "index_edits":[{"find":"…","replace":"…"}, …],
 "verify_notes":["co Opus zkontroluje (reveal naskočí, magnetic na CTA, no-JS/reduced-motion viditelné)"]
}
Vanilla JS, no-JS + reduced-motion safe, bez secrets/logů, žádné staré class names.
