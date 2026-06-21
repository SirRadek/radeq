# Nezávislý brainstorm UKÁZEK — OPUS

Princip: ukázka musí dát návštěvníkovi pocit **„tohle je MŮJ web / na tohle se můžu
zeptat"** — sebe-prožitek prodává víc než screenshot. Vínová jen jako akcent.

## 1. Dva ukázkové weby pro živnostníka (záměrně kontrastní)
**A) Kadeřnictví / kosmetika — „rezervace" persona**
- Proč: nejčastější potřeba služeb na čas; ukáže konverzi přes objednání.
- Sekce: hero (H1 „Vlasy, na které se těšíte" + CTA *Rezervovat termín*), služby+ceník,
  galerie práce, online rezervace (jednoduchý booking widget — výběr služby/času), mapa
  + otevírací doba, recenze.
- Předvádí: **rezervační tok, mobile‑first, lokální SEO** (obec + obor).
- Vizuál: teplý, fotografický, měkké tvary, světlá báze.

**B) Truhlář / zakázková výroba — „portfolio + poptávka" persona**
- Proč: řemeslo, kde rozhoduje důkaz práce; ukáže prezentaci realizací + strukturovanou poptávku.
- Sekce: hero (H1 „Nábytek na míru, který přežije generace"), galerie realizací (před/po,
  grid), proces (návrh→výroba→montáž), poptávka s uploadem fotky/rozměrů, reference.
- Předvádí: **portfolio grid, důvěra řemeslem, poptávkový formulář s přílohou**.
- Vizuál: tmavší, dřevo/grafit, robustní typografie, velké fotky.

Rozdíl: A = konverze přes rezervaci (světlý, jemný); B = konverze přes portfolio (tmavý,
hmotný). Na RadeQ webu: „Takhle by mohl vypadat váš web" + cenovka **od 29 000** + odkaz
na živé demo (samostatná podstránka /ukazky/kadernictvi, /ukazky/truhlar — i SEO).

## 2. Jednoduchý vzorový e-shop
- Sortiment: **lokální pražírna kávy** (příběhový, malý katalog ~8 produktů) — důvěryhodné
  pro malého českého prodejce, hezké fotky, jasná hodnota.
- Ukázat: katalog, produktová stránka, košík, **rychlý filtr/hledání** (běží na D1/Worker,
  bleskové). Důvěra: jasná doprava/platba, skladovost.
- NEcpát: účty, složité varianty, slevové enginy, marketing automation (to je „velký e‑shop",
  cenově výš — zmínit v detailu). Záměrně „jednoduchý, ale dotažený".

## 3. Lehký chatbot (ukázka praktické AI)
- Role: **„průvodce webem"** — odpoví na služby, ceník, proces; navede na audit/kontakt.
  NE univerzální asistent.
- Lehký/udržovatelný: malá kurátorovaná znalost = vlastní obsah webu (+ /zápisky), těsný
  system prompt, připravené fallbacky („tohle radši napište do poptávky"), rate‑limit,
  jasně označen „ukázkový průvodce". Cloudflare Workers AI, levné, bez 3rd‑party závislosti.
- Vizuál: vínové, odladěné UI v rohu (ne modrý blob). Důkaz: *„o AI nejen píšu, mám ji
  nasazenou na vlastních datech — totéž umím u vás na manuálech/FAQ."*

## 4. Blog / „Zápisky" — ANO, ale minimalisticky
- Proč: long‑tail SEO + autorita + **krmí chatbota** znalostí. České dotazy: „kolik stojí
  web pro živnostníka", „vlastní e‑shop vs Shoptet", „jak automatizovat fakturaci", „je
  AI chatbot pro malou firmu k něčemu".
- Jak: 5–8 cornerstone článků na startu, kadence ~1/měsíc, Astro content collection
  (žádné CMS). Kvalita > kvantita.

## 5. Ukázka → reference (bez trapnosti)
Jedna mřížka **„Ukázky & realizace"**; každá karta má štítek **„Vzorová ukázka"** vs
**„Realizace u klienta"**. Poctivý rámec: *„Než přijdou veřejné reference, ukazuju přesně,
co umím, na vzorových projektech — můžete si je rozkliknout a vyzkoušet."* Čisté, sebejisté.

## Opus TIP (co má nejvyšší prodejní efekt)
**2 živnostník weby (živé, rozkliknutelné) + chatbot‑průvodce** = nech návštěvníka prožít
výsledek a zeptat se. E‑shop udělat jako **jednu dotaženou ukázku** (ne plný obchod).
Blog spustit s 5 články. Co odložit: velký e‑shop, univerzální AI agent — to je v2.
