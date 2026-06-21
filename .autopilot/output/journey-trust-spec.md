# „Cesta k výsledku" → interaktivní prvek důvěry — SYNTÉZA (3 hlasy) → spec

**Datum:** 2026-06-21 · **Vstupy:** agy (koncept+obsah), Codex (feasibility), Opus (reframe).
**Shoda všech tří = velmi vysoká.** Implementuje Codex po schválení vlastníkem.

## Architektura (na čem se shodli všichni tři) — DVĚ PATRA
1. **HERO = HOOK.** Ponechat vzestupnou křivku, ale: **větší čitelné labely** (sans, ne drobné mono)
   + token **„Řešení"**, který se po načtení **jednou** posune po křivce a **zůstane u „Výsledek ·
   ověřeno"** (žádná věčná smyčka). **Žádné vysvětlovací boxy v hero.** Jeden krátký podtext:
   *„Postup od problému k ověřenému výsledku."* Hero nesmí zavalit H1/CTA.
2. **NOVÁ SEKCE „Cesta k výsledku"** (nahradí/rozšíří „Jak pracuji") = **plná důvěra**. Stejná cesta
   jako páteř + u každého checkpointu **trvale viditelný obsah fáze**. Tady je prostor číst a klikat.

## Interakce (shoda)
- **Desktop:** hover **+ focus** na checkpoint zvýrazní/odhalí detail; klik = „lock" (zůstane).
- **Mobil:** **akordeon**, tap targety ≥48px, první fáze rozbalená. Křivka skrytá (nebo drobná osa).
- **Scroll:** jen jemné zvýraznění průchodu (token stoupá), **ne jediný způsob čtení**.
- **no-JS:** všechny fáze **plně rozbalené** jako statická časová osa (nic skryté). `<details>`/seznam.
- **a11y:** každý checkpoint = reálný `button`/`summary`; focus stejně viditelný jako hover;
  `aria-current="step"`; detail přes `aria-controls`. **Žádná info jen přes hover.** Jen
  `transform`/`opacity`. Token přes `transform`.

## Typografie / vizuál (shoda)
- Labely etap: **sans, střední řez, ~14–18px** (důležité body 16–18). **Konec drobnému mono** jako
  hlavní vrstvě; mono jen pro štítek „ověřeno".
- Aktivní checkpoint: větší tečka, vyšší kontrast, **jemný lime okraj**, semibold label; neaktivní
  čitelné (ne moc šedé, WCAG AA). **Lime jen: token + aktivní bod + finální „Výsledek · ověřeno".**
- Token „Řešení" = malý pevný štítek (ne velká kapsle), na konci splyne s „Výsledek · ověřeno".

## Obsah fází (jádro důvěry) — NÁVRH, délky/sliby POTVRDÍ VLASTNÍK
Formát na fázi: **Co řešíme · Jak dlouho · Jak probíhá · Co z toho máte · (Výstup · Vaše role · Moje role).**

| Fáze | Co řešíme | Jak dlouho* | Co z toho máte | Výstup |
|---|---|---|---|---|
| **Rozbor** | co nefunguje, kdo to používá, kde se ztrácí čas/důvěra | 1–3 dny | jasně pojmenovaný problém + priority bez mlhy | rozbor |
| **Návrh** | co vznikne, pro koho, v jakém pořadí, co se dělat NEbude | 2–5 dní | konkrétní plán + cena/termín předem, méně překvapení | návrh struktury+textů |
| **Stavba** | web/e-shop/automatizace, obsah, mobil, základ SEO | dny (úpravy) až ~2 týdny | viditelný postup na preview, včas zachytíte chyby | funkční řešení |
| **Test** | mobil/prohlížeče, rychlost, formuláře, scénáře | 1–3 dny | méně chyb po spuštění, ověřený výkon | **Protokol o testování (Lighthouse)** |
| **Předání** | spuštění, přístupy, zaškolení, co dál | ~1 den | plnou kontrolu, víte na koho se obrátit | předávací poznámky + návod |
*Celkem: uvést **„typicky 2–4 týdny od poptávky ke spuštění"**.
**DISCLAIMER (owner 2026-06-21):** délky jsou **orientační pro BĚŽNÝ projekt — větší zakázky podle
domluvy.** Tuhle větu zobrazit u timeline, ať to nevypadá jako závazek na velké projekty.

**Trust hooky — POTVRZENO vlastníkem 2026-06-21 (reálné závazky):**
- Rozbor „bez závazků; když se nedomluvíme, rozbor vám zůstává" ✅
- Stavba „platba po částech, druhá až po schválení prototypu" ✅
- Test „**servisní protokol + Lighthouse**" ✅ (už na webu)
- Předání „**po předání dle domluvy: 30 dní podpory, NEBO návod/video**" ✅ (jedno NEBO druhé dle
  domluvy — NEslibovat oboje napevno; formulace „dle domluvy")
- Celek: „**jeden člověk od rozboru po test** — nic se neztratí mezi rolemi", „každá fáze má výstup",
  „test před předáním", „po předání nezmizím". ✅

## Slova POZOR (Codex) — důvěra ano, fanfáry ne
Vyhnout se „garance"/„100% jistota" bez přesné definice. Místo toho: *„Ověřím hlavní scénáře před
spuštěním", „Předám seznam provedených kontrol", „Na známá omezení upozorním předem".* (Stávající
Testerova záruka 15 % + Lighthouse 90+ jsou definované → ty držet.)

## Co NEdělat (shoda)
Plné karty v hero · věčná smyčka tokenu · hover-only · moc lime · „startupový" stepper s ikonami ·
3D/canvas/těžké JS knihovny (GSAP/Framer) · falešné metriky · přehnané délky · mono jako hlavní
vrstva · graf konkurující H1/CTA · korporátní hantýrka (KPI/sprint…).

## Akceptace
Build zelený · 0 overflow 390/1280/2560 · Lighthouse 90+ · no-JS vše čitelné · reduced-motion
statický · mobil akordeon funkční · klávesnice/ARIA OK.

## Otevřené vstupy od vlastníka (než Codex staví)
1. **Délky fází + celkový timeline** — potvrď/uprav čísla výše.
2. **Trust hooky** — řekni, které jsou reálné závazky (zvlášť „30 dní podpory", „platba po částech",
   „rozbor zdarma když se nedomluvíme").
3. **Název sekce:** ✅ POTVRZENO — **„Jak to bude probíhat"**.

## Záložní vizuální koncepty (agy) — kdyby owner chtěl jiný charakter
„Technický výkres" (CAD, kóty — doporučený) · „Klientský deník" (editorial osa) · „Kancelářský
pořadač" (záložky/akordeon).

*Opus synthesis z [[journeybs-agy-fulldoc]] + [[journeybs-codex]] + [[journeybs-opus]]. Codex implementuje, Opus review před nahráním.*
