# Opus — nezávislý brainstorm nad agy hero animací (třetí strana)

Role: art-direction + radeq positioning analytik. Píšu NEZÁVISLE (ne syntézu) — i proti agy konceptu.

## 0. Meta-otázka, kterou musím položit první
Potřebuje hero vůbec signature SVG animaci, nebo si ji „obhajujeme" zpětně? Současný živý hero
(bez SVG) je čistý a konvertuje na copy + CTA. Přidání grafu je sázka, že „feel/odlišení" zvedne
důvěru, **aniž ublíží čtení H1 a kliknutí na CTA** (to jsou konverzní prvky #1). → Animaci beru
JEN když splní 3 podmínky: (a) zůstane **podřízená** textu, (b) nese **příběh analytik+tester**
(ne generický graf), (c) **jednorázový pohyb** (ne věčná smyčka). Když ne → signature radši nechat
na existující „Blueprint" lince v „Jak pracuji" a hero nechat klidný.

## 1. Storytelling — největší slabina agy konceptu
„Rozházené body → plynulá stoupající křivka" čte jako **generický line-chart / „growth analytics"**.
radeq se ale liší slovem **TESTER** (QA, měření, ověření), ne „data". Stoupající křivka říká „růst",
ne „rozbor". Návrh, jak to ukotvit pravdivě:
- **Best-fit / regrese (můj favorit):** body se NEjen objeví — **proloží se jimi linka** (analytik
  najde v chaosu signál) a doteče do lime bodu = „odpověď". To je doslova radeq příběh: *„z vašeho
  bordelu vytáhnu nosnou linku."* Méně pohybu, silnější význam.
- **Verified tick:** lime endpoint se na konci „zaklapne" do drobného **✓ / PASS** — kóduje
  testerskou záruku (Lighthouse 90+, servisní protokol). Odlišuje od všech grafů na trhu.

## 2. „Instrumentace, ne ornament" — agy koncept je na hraně ornamentu
Má hodně dějů najednou: mřížka + 5 bodů pop + draw + endpoint scale + **ring loop** + **puls běžící
po dráze** + scroll parallax. To **soupeří s H1** během čtení. Tvrdě bych ŘEZAL:
- **Pryč věčné smyčky** (ring pulse loop, traveling pulse loop) — táhnou oko při čtení. Pohyb, který
  **doběhne a zastaví**, respektuje čtení.
- Vzorec: **„změř jednou → zůstaň v klidu → při scrollu znovu změř"** (re-trigger při vstupu do
  viewportu), ne nepřetržitě animovat.

## 3. Barevná disciplína (design-lock: lime = ~1% pop, jen diagnostické markery)
agy dává lime na endpoint + prstenec + běžící puls = **víc lime než 1%** a věčný lime puls lime
zlevňuje. → **Lime JEN na jediném vyřešeném endpointu** (jeden bod/✓), žádný trvalý lime puls.
Lime zůstane vzácná a on-spec.

## 4. Hierarchie / umístění — udělat z toho navádění oka
Graf ať je opticky „pod" obsahem (nízký kontrast, skoro pozadí), **jediný jasný beat = lime
endpoint**. Umístit endpoint **vertikálně k řádku CTA** → „řešení" doslova ukáže oko k tlačítku
„Napsat poptávku". Animace pak nejen zdobí, ale **pracuje pro konverzi**.

## 5. Výkon/přístupnost (sedí na řez smyček)
Pro Lighthouse 90+ a konzervativní cílovku (starší HW/mobil) je **trvalý pohyb battery/jank riziko**.
Konečný draw je levnější a klidnější. reduced-motion: statický proložený stav (linka + body + ✓).
no-JS: plně viditelné. Mobil: skrýt (jak agy navrhl) — souhlas.

## 6. Mé varianty (nezávislé)
1. **Best-fit/regrese** (doporučuji) — chaos body → proložená nosná linka → lime ✓. Příběh
   analytika, minimální pohyb.
2. **Noise → stable** — zašuměná linka se usadí do čisté monotónní (chaos → řád), jednorázově.
3. **EKG/monitoring** — NE do hera (moc medicínské/generické); hodilo by se leda k sekci **péče**
   (Klid/Růst/Partner) jako „hlídám váš web". Hero ne.

## 7. Verdikt nezávislé strany
agy koncept má skvělé řemeslo, ale **významově míří na „growth chart", ne na „analytik+tester"**, a
**přepohybovává**. Doporučuji: vzít agy provedení (SVG/draw je dobré), ale **(a)** překlopit význam
na **best-fit + verified ✓**, **(b)** zabít věčné smyčky (draw once + scroll re-trigger), **(c)**
lime jen na endpoint, **(d)** endpoint zarovnat k CTA. Pokud to po těchto řezech nebude působit
sebejistě‑klidně, jsem pro **žádnou hero animaci** a signature nechat v „Jak pracuji".
