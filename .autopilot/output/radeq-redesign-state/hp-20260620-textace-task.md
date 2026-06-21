# RadeQ.cz — textace služeb + kroky (write+build+commit, NEpushuj)

Jsi implementační worker s write právy v repu radeq (Astro + namespace `rq-`). Uprav copy
homepage `src/pages/index.astro`. **Ceny NEMĚŇ** (zůstávají „od …"). Hero, zeď problémů, ceník,
záruku NECHEJ být. Edituj → builduj → commitni. **NEPUSHUJ.**

## TVRDÁ PRAVIDLA
- Jen branch `autopilot/radeq-v1-2026-06-18` (ověř `git branch --show-current`).
- Před commitem: `$env:DEPLOY_TARGET='github-pages'; npm.cmd run build` — commit jen když zelený.
- 0 horizontal overflow, reduced-motion/no-JS safe, WCAG AA. Žádný push, žádný force, žádný main.
- Commit message: `Textace: služby do formátu Výsledek + 3 výstupy, kroky slovesně`.
- Na konci vrať: build výsledek, seznam změněných souborů, krátké shrnutí.

## ZMĚNA 1 — Služby (sekce `#sluzby`, `.rq-services-bento__grid`)
Každá z 5 karet `.rq-offer.rq-service-tile…` má dnes: `<p class="rq-offer__price">`, `<h3>`,
krátký popis `<p>`, a `<p class="rq-offer__incl">V ceně: …</p>`. **Nahraď popis + „V ceně"** za
nový formát: jeden řádek **Výsledek** + odrážkový seznam **3 výstupů**. Ponech `rq-offer__price`,
`<h3>` i případný `<span class="rq-flag">` (u auditu). Použij nové třídy
`.rq-offer__result` (řádek Výsledek, tučnější/akcent) a `.rq-offer__outputs` (`<ul>` 3×`<li>`)
a přidej pro ně do `src/styles/rq.css` střídmé CSS (čitelné odrážky, mezery dle 8pt rytmu, na
tmavém i světlém pozadí čitelné — pozor featured/audit dlaždice).

Přesný obsah (doslova):

**Web a redesign** (od 9 900 Kč, featured)
- Výsledek: web, který návštěvníkovi rychle vysvětlí nabídku a přivádí poptávky.
- rychlý jednostránkový web (Astro) + poptávkový formulář
- základní SEO pro Google i Seznam + měření
- předání tak, že drobnosti zvládnete měnit sami

**E-shop** (od 19 900 Kč)
- Výsledek: malý vlastněný obchod bez zbytečností, který sami utáhnete.
- katalog, košík, varianty
- doprava a platba dle platformy
- předání + krátké zaškolení

**Automatizace procesů** (od 12 000 Kč)
- Výsledek: konec ručního přepisování — co děláte opakovaně, běží samo.
- analýza jednoho procesu od začátku do konce
- jeden funkční automatický tok
- dokumentace + předání

**Data a AI pomocníci** (od 15 000 Kč)
- Výsledek: přehled ve vlastních datech a AI nasazená prakticky a bezpečně.
- sběr a vyčištění dat
- jednoduchý přehled / report
- AI pomocník nad schválenými podklady

**Audit webu nebo procesu** (4 900 Kč, flag „Nízkorizikový start")
- Výsledek: víte, co nejvíc brzdí a co řešit první — cenu odečtu z realizace.
- technický stav, rychlost, SEO základ, formuláře
- seznam problémů podle priority
- doporučení, co hned a co počká

## ZMĚNA 2 — Kroky „Jak pracuji" (sekce `#jak-pracuji`, `.rq-process__steps`)
Dnes 3 `<article class="rq-card rq-step">` s `<span class="rq-step__num">` + `<h3>`. Uprav
nadpisy na slovesný tvar (1. osoba) a přidej krátký podtitulek `<p class="rq-step__sub">`
(přidej pro něj do rq.css decentní styl, menší + sekundární barva):
1. **Pojmenuju problém** — co přesně brzdí a proč.
2. **Vyberu nejmenší funkční řešení** — bez zbytečností.
3. **Postavím, otestuji a předám** — se servisním protokolem.

## Po implementaci: build, commit (NEpushuj), vrať shrnutí.
