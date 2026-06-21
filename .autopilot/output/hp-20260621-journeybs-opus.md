# Opus — nezávislý brainstorm: hero cesta → interaktivní prvek důvěry (3. hlas)

Role: art-direction + positioning + konverzní UX + meta-rozhodnutí. Píšu nezávisle, i proti zadání.

## 0. Hlavní reframe (moje #1)
To, co vlastník chce (větší labely + token „Řešení" přes checkpointy + interaktivní texty fází:
co/jak dlouho/jak probíhá), je **feature-creep na hero**. Hero má jeden úkol: přečíst H1 a kliknout
CTA v prvních 3 s. Tooltipy/expandy s délkami fází v hero z toho udělají **přeplácanou infografiku**,
co odsune CTA. → **Rozdělit na dvě patra:**
- **Hero = HOOK:** vzestupná cesta s **většími, čitelnými labely** (Váš problém → … → Výsledek ·
  ověřeno) + token, který **stoupá při scrollu**. ŽÁDNÉ tooltipy. Podřízené H1/CTA.
- **Nová sekce „Jak to probíhá / Cesta k výsledku" = DŮVĚRA:** stejná cesta jako páteř, každý
  checkpoint je **trvale viditelná karta** s obsahem fáze. Tady patří interaktivita i čtení.
  Nahradí / spojí se s dnešním „Jak pracuji" (3 kroky).

Tím má vlastník VŠECHNO, co chce, ale na správném místě (hero nekonvertuje hůř, důvěra se buduje
tam, kde se čte).

## 1. Token „Řešení" — zpřesnit význam
Silnější příběh než „label Řešení jezdí po křivce": **start = „váš problém", a tentýž token se
cestou MĚNÍ na „výsledek"** (problém → … → řešení). Jedna entita, kterou radeq nese k cíli =
doslova „neseme to za vás, nezůstanete sami". Na scroll stoupá = „kde na cestě jsme". Žádná věčná
smyčka.

## 2. Interakční model — pro konzervativce a mobil POVINNĚ bez hoveru
Hover tooltipy = na dotyku nefungují a nikdo je nenajde. → **Obsah fází je TRVALE VIDITELNÝ**
(karty u checkpointů), ne schovaný za hover. „Interaktivita" = jen progressive enhancement:
aktivní checkpoint se zvýrazní při scrollu, token stoupá. **No-JS:** vše čitelné staticky.
Klávesnice/ARIA: pokud budou klik-expandy, tak jako `<details>`/přístupné tlačítko, ne hover.

## 3. Obsah fází (jádro důvěry) — můj návrh (DÉLKY musí potvrdit vlastník)
Formát na fázi: **co se řeší · jak dlouho · jak probíhá · co dostanete · kdo co dělá.**
- **Rozbor** — co: najdu, co na webu/procesu brzdí. *jak dlouho:* 2–3 dny. *jak probíhá:* dáte
  přístup, proměřím, sepíšu. *co dostanete:* seznam priorit + co řešit hned a co počká. *kdo:*
  měřím já, vy jen dodáte přístup.
- **Návrh** — co: struktura, texty, řešení. *2–5 dní.* *projdeme společně, schválíte.* *co
  dostanete:* jasný plán + cenu a termín předem. *kdo:* navrhnu já, schválíte vy.
- **Stavba** — co: postavím web/e-shop/automatizaci. *1–2 týdny dle rozsahu.* *stavím po částech,
  průběžně ukazuju na preview.* *co dostanete:* funkční řešení k vyzkoušení. *kdo:* stavím já,
  připomínkujete vy.
- **Test** — co: formuláře, mobil, rychlost, SEO základ. *1–2 dny.* *projedu testovací checklist.*
  *co dostanete:* ověřený výkon (Lighthouse 90+) zapsaný v protokolu. *kdo:* testuji já.
- **Předání** — co: spuštění + přístupy + dokumentace. *cca 1 den.* *nasadím a zaškolím.* *co
  dostanete:* web + **servisní protokol** + „nezůstanete sami". *kdo:* předám já, přebíráte vy —
  bez závislosti na dodavateli.
- **Souhrn:** „Typicky **2–4 týdny** od poptávky ke spuštění (dle rozsahu)." ← top nákupní otázka.

## 4. Trust prvky navíc
Délky (očekávání) · konkrétní deliverable u každé fáze · „co děláte VY vs JÁ" (ukazuje malou
zátěž pro klienta + že těžkou práci nesu já) · servisní protokol + záruka jako kapstone u Předání ·
celkový timeline. Bez prázdných slibů — jen co vlastník dodrží.

## 5. Typografie/vizuál
Hero labely zvětšit na ≥14px (teď ~11px mono drobné), čitelné, ale sekundární k H1. V sekci plné
nadpisy. „Aktuální" checkpoint: lime tečka/kroužek (lime stále jen vzácně — aktivní bod + cíl).

## 6. Co NEdělat
Tooltipy v hero · skrývat trust obsah za hover/klik (konzervativec ho nehledá — dej ho na světlo) ·
udělat z hero infografiku · věčná smyčka tokenu · vymyšlené délky (vlastník musí čísla potvrdit).

## Verdikt
Hero = jednoduchý hook (větší labely + stoupající token). Plný interaktivní vysvětlovač = vlastní
sekce „Jak to probíhá" se **trvale viditelným** obsahem fází (co/jak dlouho/jak probíhá/co
dostanete/kdo). To buduje důvěru poctivě a neubližuje konverzi. Délky fází potvrdí vlastník.
