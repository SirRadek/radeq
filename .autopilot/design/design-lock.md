# RadeQ.cz — DESIGN LOCK

**Status:** v1 lock · **Datum:** 2026-06-21 · **Vlastník artefaktu:** Opus (architekt/supervisor)
**Účel:** jediný zdroj pravdy pro zamčená designová rozhodnutí. **Zamčené = neměnné** bez
explicitního owner unlocku (viz Escape hatch). Brainstorm/kritika smí vyplňovat jen *otevřené sloty*
níže, ne re-otevírat zamčené. Provedení uvnitř vlny zůstává kreativně volné — **zamyká se
rozhodnutí, ne ruka** (sedí na „proces, ne šablona").

> Tento lock kodifikuje **současný živý směr** (V1→V3.1, nasazený na GitHub Pages preview), aby se
> přestal re-otevírat. Kde rethink (`opus-rethink-radeq-redesign.md`) navrhoval alternativu
> (terakota), je to vedeno jako **otevřené owner rozhodnutí**, ne automatická změna.

---

## 1. LOCKED — Positioning
- **Kdo:** solo dodavatel, „analytik a tester" — navrhne, postaví, otestuje, předá bez závislosti
  na dodavateli. Cílovka: konzervativní ČR živnostníci / malé firmy / spolky.
- **Hero H1 (živé):** „Weby, data a automatizace, které vám uvolní ruce."
- **Tón:** racionální, věcný, důvěryhodný, žádný hype.

## 2. LOCKED — Paleta (tokeny = aktuální `rq.css :root`)
```
--rq-bg #F7F4EE (ivory báze) · --rq-bg-sunken #EFEAE0 · --rq-surface #FFFFFF
--rq-ink #1C1A17 (grafit, AAA) · --rq-ink-2 #4F4942 (sekundár, AA+)
--rq-burgundy #7A1F2B (akcent: CTA/odkazy/ceny/aktivní) · --rq-burgundy-strong #5E1622
--rq-lime #C7E04A (pop, jen diagnostické markery, VŽDY grafit text --rq-lime-ink #2A3508)
--rq-carbon #1A1611 / -2 #242018 (tmavé „climax" sekce) · --rq-on-dark #F1EDE4 / -2 #C9BFB1
--rq-line #E6E0D4
```
Princip: ivory báze + grafit + **jeden** sebejistý akcent (vínová) + **jeden** pop (lime, ~1 %)
+ jeden tmavý band. Lime nikdy jako světlý text. Kontrast min. WCAG AA (lead 8:1, dark 16:1 ověřeno).

## 3. LOCKED — Typografie
- Display/nadpisy: **Plus Jakarta Sans** 700–800; `.rq-display` clamp cap ~6 rem; H2 clamp ~2.1–3.4 rem.
- Body: **Inter ~18 px** (`clamp(1.0625rem, .35vw+1rem, 1.1875rem)`), line-height 1.6.
- Eyebrow: **JetBrains Mono** 13 px, letter-spacing .12em.
- `text-wrap: balance` (h1–h4) + `pretty` (p) + čtecí odstavce `max-width: 62ch`.

## 4. LOCKED — Prostor / responzivita
- 8pt rytmus; sekce `--rq-pad` clamp(4–8 rem); `--rq-maxw 1280` (text) / `--rq-maxw-wide 1440` (bento).
- 4K: root-rem scale 106.25 % @2200px, 112.5 % @3200px. **0 horizontálního overflow** do 3840px.
- `overflow-x: clip` na html (ne hidden). Tmavé sekce + marquee **full-bleed (100vw)**.

## 5. LOCKED — Motion (instrumentace, ne ornament)
- Jen `transform`/`opacity`; `prefers-reduced-motion` + no-JS safe; Lighthouse 90+; 0 overflow.
- Zamčené mechaniky: scroll-reveal (fade+rise), **marquee = rAF scrub** (hover plynule zpomalí, ne
  stop; seamless, • oddělovače), diagnostický panel (stabilní výška, scroll-reset), **stránkový
  edge-fade** přes `body::before/::after` (gradient, ne blur). Ceník a formulář bez motion.
- **Signature animace = OPEN** (viz §8 — řeší animace bake-off, jen 1 signature pro v1).
- Odsunuto (NE v1): ROI kalkulačka, „rentgen" toggle → až web vydělá.

## 6. LOCKED — Struktura homepage (pořadí sekcí)
Header (wordmark + nav, **bez CTA tlačítka**) → Hero (H1 + 2 CTA „Napsat poptávku ↓" / „Ukázky
práce" + proof rail) → marquee symptomů → „Co řeším" (tmavý problem wall, bento + lime flags) →
Diagnostický panel → Služby (bento, karta = **Výsledek + 3 výstupy**, ceny „od", neklikací + 1 CTA
pod gridem) → Jak pracuji (3 kroky slovesně + Blueprint SVG + Servisní protokol/Testerova záruka) →
Ceník (3 tarify) → Ukázky teaser → Kontakt (env-aware: prod `/api/leads`, preview mailto) → Footer.

## 7. LOCKED — Workflow (jak se na tom pracuje)
- 1 projekt = 1 repo; artefakty v `repo/.autopilot/`; control-plane jen meta. (viz canonical-clone memory)
- Implementace = **Codex-writer** (`codex exec --sandbox workspace-write`, edituje+builduje), **Opus
  reviewuje diff+preview PŘED nahráním**, pak push → GitHub Pages preview.
- Bounded waves = **vertikální řezy** (celá sekce), build-gate, preview URL před další vlnou.
- Compare-loop: WANT ↔ MĚLO BY ↔ VYPADÁ (IS z live `?v=<commit>` preview).

---

## 8. OPEN — Rozhodnutí čekající na vlastníka (NEzamčeno)
| # | Otázka | Default dokud nerozhodneš |
|---|---|---|
| O1 | **Placeholdery** „Radek [PŘÍJMENÍ]", „[DOPLNIT TELEFON]", „IČO", „[MĚSTO]" — **P0, blokuje produkci** | čeká na reálné údaje |
| O2 | **Ceník** „od 9 900" (současné) vs „typicky od–do" + audit jako vstup (§7.5) | zůstává „od" (tvá dřívější volba) |
| O3 | **Akcent** vínová (locked) vs terakota A/B (rethink §2.2) | vínová (nepřeotvírat bez tvého slova) |
| O4 | **`/en/`** ponechat vs zrušit (CZ cílovka) | čeká — doporučení: zrušit bez důkazu poptávky |
| O5 | **Signature animace** — bake-off (Codex vs Antigravity), 1 vítěz pro v1 | čeká (task #48) |
| O6 | **Production cutover** — kdy/podle čeho redesign přejde z preview na ostrou radeq.cz | čeká — bez plánu = „věčné preview" |

## 9. Escape hatch (jak se LOCKED smí znovu otevřít)
Zamčené rozhodnutí lze otevřít **jen** když: (a) měření nebo test se 3 lidmi z cílovky ukáže
problém, **nebo** (b) explicitní owner unlock. Vendor návrh na re-otevření zámku = **stop + dotaz
vlastníka**, ne automatické přijetí. Každá změna locku = append-only záznam (datum + důvod) níže.

## 10. Definition of Done (celý redesign — z §7.8)
Jasná první akce + záložní kontakt · všechny CTA fungují prod i preview · **lead notifikace dorazí
se správným reply-to** · Search Console/Seznam/sitemap/robots · mobil/klávesnice/kontrast/reduced-
motion/200% zoom · Lighthouse/CWV bez regrese · 404/canonical/OG/metadata · právní minimum + retence
leadů · obsah má vlastníka + datum revize · **owner umí říct, podle čeho za 8 týdnů pozná úspěch**
(kvalita poptávek, ne návštěvnost).

---
*Lock v1. Změny jen append-only s důvodem. Otevřené sloty §8 řeší vlastník; zamčené §1–7 se
nepřegenerovávají.*
