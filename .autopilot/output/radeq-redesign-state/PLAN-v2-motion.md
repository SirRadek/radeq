# RadeQ V2 „živý pracovní stůl analytika" — Codex plán + compare-loop (Opus syntéza)

Vstup: nezávislý brainstorm Gemini (agy) + GPT (codex) + Opus. Směr: víc pohybu, hravosti,
interaktivity à la lepshee — ALE „přesná, diagnostická hravost" (pohyb = důkaz přemýšlení),
zachovat SEO/výkon (Lighthouse 90+) a důvěru CZ SMB. Implementuje výhradně **codex_cli**
přes runCliWorker; Opus = spec/handoff/review/compare/odškrtávání.

## Shoda obou providerů (lock)
- **Typo nahoru:** Hero clamp(56–132px), H2 clamp(42–92px), velká čísla cen; Plus Jakarta
  ExtraBold, těsný leading/tracking; reálný text (SEO). Hero jako „rozbitý display" claim.
- **Barvy + hloubka:** ivory báze, grafit skoro do černa pro statement; vínová z 5 % → ~12 %
  (CTA, ceny, aktivní stavy, klíčové linky); + střídmý druhý „diagnostický" akcent
  (signální lime/zelenožlutá) jen pro stav „nalezen problém"/aktivní bod. 1–2 tmavé
  full-width statement bloky (NE celý dark mode).
- **Dlaždice:** konec uniformních mřížek. „Co řeším" = asymetrický problem wall (1 velká
  featured + menší). Služby = pipeline/step layout (Audit→návrh→implementace→test→provoz).
  Ceny = zvýraznit prostřední („Nejčastější začátek", větší, mírně nahoru) — bez hravosti.
  Ukázky = 1 velká + 2 menší.
- **Motion systém (CSS + IntersectionObserver + max 1–2 Astro islands client:visible; žádný
  GSAP/video/particles):** hero staggered text reveal · magnetic CTA · hover lift+glow ·
  marquee symptomů · count-up čísel · scroll stagger karet · blueprint SVG line-draw ·
  section contrast snap. Vše `prefers-reduced-motion` fallback + statický ekvivalent.
- **Signature interakce (max 2):** „Diagnostický panel: od problému k řešení" (klik na
  problém → příčina / co ověřím / první krok; funguje i bez JS) + „Blueprint Q" (ocásek Q
  kreslí proces Najít→Zjednodušit→Otestovat).
- **Mantinely (nula hravosti):** ceník, kontakt/formulář, dlouhé SEO texty. Žádný
  scrolljacking, žádné loading animace, interaktivita neskrývá SEO obsah ani CTA.

## Codex vlny (každá = bounded handoff; po každé Opus compare-loop)
- **Vlna 1 — Motion & barevný systém (foundation):** rozšířit `rq.css` o větší typo škálu,
  vínová ~12 % + diagnostický lime token, 1 tmavý statement blok, a JS motion island
  (`RqMotion`) řešící reveal/stagger/magnetic/count-up/marquee přes data-atributy +
  reduced-motion. Aplikovat reveal/hover na existující sekce.
- **Vlna 2 — Rytmus dlaždic:** „Co řeším" → problem wall (bento), Služby → pipeline,
  Ceny → zvýraznění prostřední (statické), Ukázky teaser → 1 velká + 2 malé.
- **Vlna 3 — Signature interakce:** „Diagnostický panel od problému k řešení" (Astro island
  + statický fallback) v/pod hero; „Blueprint Q" line-draw v „Jak pracuji".
- **Vlna 4 — Doladění:** marquee symptomů mezi sekcemi, count-up u čísel, jemný section
  contrast snap; finální výkonová kontrola.

## Compare-loop (po KAŽDÉ vlně)
1. **WANT** = tato spec (co chceme).
2. **MĚLO BY VYPADAT** = konkrétní acceptance kritéria v handoffu (rozměry, chování, fallbacky).
3. **VYPADÁ** = Opus pořídí screenshoty (desktop+mobil) z buildu/preview a přečte je (vision).
4. Opus porovná 1↔2↔3, **odškrtne hotové** a **sepíše nedostatky** (textový diff).
5. Nedostatky → vrátit providerům jako vstup („proč výsledek ≠ zadání") → re-brainstorm/oprava.
6. Governance: providerům jen redigovaný kontext (spec, markup/CSS, diff) — žádné raw logy/secrets.
7. Po vlně build zelený + Lighthouse/0-overflow check, commit, (na konci) push → preview.
