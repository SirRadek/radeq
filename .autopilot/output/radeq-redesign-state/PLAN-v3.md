# RadeQ V3 plán — barvy, textace, 4K, animace (Opus syntéza 2 kol Gemini+GPT)

Implementuje výhradně **codex_cli**; Opus = spec/review/compare-loop. Po každé vlně:
WANT (spec) ↔ MĚLO BY (acceptance) ↔ VYPADÁ (Opus screenshot/eval) → odškrtnout + sběr
nedostatků → vrátit providerům. reduced-motion + no-JS safe, Lighthouse 90+, 0 overflow.

## Shoda kol (lock)
### Barvy/kontrast
- Grafit #1C1A17 na ivory = AAA (drž). Sekundární text na světlé: tmavší bezpečný rozsah
  #4F4942–#544E46 (ne >#776F65). **Vínovou ubrat ~12 % → ~8–9 %**, používat ROZHODNĚ jen na
  konverzi (CTA, odkazy, čísla, aktivní stav, doporučený tarif). **Lime jen diagnostický
  marker, VŽDY s grafitovým textem uvnitř** (nikdy bílý/světlý text na lime). Tmavý wall =
  teplý uhlík (#1A1611/#1D1915, karty #242018), text #F1EDE4 / sekundár #C9BFB1, lime akcenty.
  Definovat explicitní light/dark/lime kontrastní tokeny.
### Textace/formát
- Věcný, konkrétní SMB jazyk; H2 krátké (bolest/výsledek), odstavce ≤2–3 věty, odrážky (mono).
  Služba: název + 1 věta výsledku + 3 konkrétní výstupy. Kroky: sloveso (Zmapuji/Ověřím/Předám).
  Ceník: hranice rozsahu, co NENÍ v ceně, míň marketingu.
### Velikost/zalamování/spacing
- Body 18px (klíč), hero zkrátit + ruční zlomy + clamp cap ~6rem desktop, H2 clamp 40–56,
  eyebrow 13px, ceny 44–56. Globálně `h1..h4{text-wrap:balance}`, `p{text-wrap:pretty;
  max-width:~62ch}`. 8pt spacing, sekce ~96–128px desktop / 56–88 mobil.
### 4K (1080p→4K)
- Max-width dle typu sekce: text ~1240, bento/ceník ~1440, full-bleed vnitřek ~1520.
  Display clamp s vyšším 4K stropem, body jen mírně (≤~19–20px). **Mírný root-rem scale
  >1920px** (html ~112,5 %) aby web nebyl „nudle v prázdnu". Container queries pro karty/panel.
  Full-bleed tmavé bloky/marquee vždy 100vw, obsah centrovaný.
### Animace („instrumentace, ne ornament")
- Hero **diagnostická SVG linka** (stroke-draw + signal, IO/no-JS/reduced-motion safe) = signature.
- Underline-draw u odkazů + focus motion; magnetic CTA (omezený); karty lift 2–4px (bez tiltu
  mimo ukázky); diagnostický panel **measure-pulse** po interakci; jemný **audit dot-grid**
  (transform drift, <30 prvků); blueprint **scroll-draw** přes `animation-timeline: view()`
  (@supports + IO fallback); **statický** grain. Pouze transform/opacity. Ceník/formulář bez motion.

## Vlny (Codex)
- **Vlna 5 — 5 konkrétních fixů** (viz FIX-LIST-v3): marquee slow-on-hover+infinite; sjednotit
  výšku textu při kliku v diagnostickém panelu + edge fade; CTA rename+dedupe; odebrat header
  „Konzultace zdarma"; šipky DOLŮ (↓) u in-page CTA.
- **Vlna 6 — barvy/kontrast** tokeny (vínová dolů, lime grafit-text, tmavý wall teplý, sekundár tmavší).
- **Vlna 7 — typografie/zalamování/spacing** (18px body, hero zkrátit+cap+zlomy, balance/pretty/62ch, rytmus).
- **Vlna 8 — 4K** (max-width dle sekce, clamp cap, root-scale >1920, container queries, full-bleed bg).
- **Vlna 9 — animace** (hero SVG linka, underline/focus, measure-pulse, audit-grid, scroll-draw blueprint, grain).

## CTA schéma (Opus, dedupe — řeší fix #3/#5)
- Header: bez CTA tlačítka (jen nav). Hero: primární „Napsat poptávku ↓" (#kontakt) + sekundární
  „Ukázky práce". Služby: ZRUŠIT 5× „Mám zájem" → celá karta klik na #kontakt (jemné „↓"/„více").
  Diagnostický panel: „Probrat to" → „Napsat poptávku ↓"; lime „Diagnóza" → „Rozbor".
  Ceník: tarify ponechat 1 CTA/tarif, ale ne všechny stejné slovo. Šipky u in-page-dolů = ↓.
