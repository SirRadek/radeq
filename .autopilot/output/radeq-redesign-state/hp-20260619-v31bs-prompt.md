RadeQ.cz V3.1 — nezávislý brainstorm. Web: redesign radeq.cz (Astro static + React islands +
Tailwind, namespace `rq-`, GitHub Pages PREVIEW, NE produkce). Cílovka: konzervativní české
ŽL / malé firmy / spolky. Tón: racionální, důvěryhodný, žádný hype. Vlastník našel 5 vad a chce
textaci + animace. Brainstormuj NEZÁVISLE a KONKRÉTNĚ (ne obecné rady). Vrať čistý markdown (ne JSON).

## ČÁST 1 — Nejlepší řešení 5 vad
1. **Marquee (pás symptomů) není seamless.** Na hover zpomalí, ale SKOČÍ zpět na začátek
   (ošklivé). Chybí oddělovací „•" a stejná mezera mezi posledním a prvním prvkem.
   → Jak udělat TRULY nekonečný seamless CSS marquee, kde hover PLYNULE ZPOMALÍ bez skoku na
   start, s konzistentními oddělovači (• tečka) a stejnými mezerami? Pozor: track má translateX
   -50% + duplikaci; změna `animation-duration` na hover restartuje pozici (proto ten skok).
   Navrhni řešení bez skoku (např. JS scrub přes requestAnimationFrame, nebo `@property`-řízená
   rychlost, nebo dvojitý track + transition na rychlost) + jak zajistit identický oddělovač/gap.
2. **Full-bleed pozadí.** Pozadí sekce (diagnostika) jde jen do ~1280px → viditelný box se švy.
   → Jak zajistit, aby KAŽDÁ sekce s vlastním pozadím šla přes celou šířku (100vw), jen obsah
   omezený? Technika `margin-inline: calc(50% - 50vw)` / `width:100vw`; na co pozor u
   `overflow-x: clip` a scrollbaru.
3. **Duplicitní „Rozbor" flag** (v řádku tabu i v output tabuli) → nechat jen v tabuli; proč.
4. **Edge-fade „rozmazání na okrajích při scrollu" patří na CELOU STRÁNKU**, ne na 1 komponentu.
   → Jak elegantně? (fixed gradient overlay nahoře/dole přes celý viewport pod headerem/nad
   patičkou; nebo mask na obsahový wrapper.) Pozor: nesmí blokovat klik (pointer-events:none),
   reduced-motion, a nesmí zakrýt obsah. Doporuč nejčistší variantu.
5. **Karty služeb nemají odkazovat na #kontakt** (matoucí). → Co s nimi: neklikací info karta,
   nebo odkaz na relevantní ukázku/detail? Doporuč a zdůvodni.

## ČÁST 2 — Textace (OBSAH, ne formát)
Jak zostřit/zkrátit copy homepage radeq: hero, problem wall, služby (zkus formát
„služba = název + 1 výsledek + 3 výstupy/odrážky"), kroky „Jak pracuji" slovesně, ceník.
Dej KONKRÉTNÍ příklady přepsaných textů (česky, pro konzervativní malé klienty, bez hype).

## ČÁST 3 — Animace (lehké, rychlé, kvalitní, PROGRAMOVATELNÉ — NEgenerované)
Navrhni KONKRÉTNÍ malou „signature" sadu (4–6 momentů) k implementaci — toto je podklad pro
porovnání providerů. Pravidla: jen transform/opacity, scroll-driven (`animation-timeline: view()`
+ IntersectionObserver fallback), reduced-motion safe, no-JS safe, 0 overflow, Lighthouse 90+.
„Instrumentace, ne ornament." Pro každou animaci: kde, co přesně, jak naprogramovat, perf dopad.

Stručně a konkrétně. Žádné secrets.
