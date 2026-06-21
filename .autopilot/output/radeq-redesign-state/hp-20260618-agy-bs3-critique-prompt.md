# Brainstorm — radeq.cz, KOLO 3: tvrdá KRITIKA syntézy

Jsi seniorní design/produktový ředitel + technický lead. Tvým úkolem je ROZBÍT níže
uvedený syntetizovaný koncept (vznikl spojením dvou předchozích kol). Buď kritický a
konkrétní. Piš česky. Cíl: ochránit majitele (jednočlenné studio!) před přepálením
rozsahu, konverzními a SEO riziky, a doporučit, co reálně postavit do silného v1.

## Syntetizovaný koncept „RadeQ — Transparentní motor" (k rozboru)
- **Positioning:** „Nejsem jen kodér — jsem analytik a tester, který vám problém rozebere
  na data a složí z něj řešení, jemuž budete rozumět i po předání." (překladatel mezi
  byznysem a technologií).
- **Vlajkový vizuální nápad:** přepínač **„Pohled zákazníka / Pohled inženýra"**. Defaultně
  čistý světlý web; po přepnutí se odkryje „motor" pod povrchem (struktura, schéma dat,
  kód) a rozsvítí se ve **vínové** (burgundy). Web sám = důkaz řemesla.
- **Vínová:** světlá báze (slonová kost/písek), vínová jako zvýrazňovač + jádro
  „inženýrského" pohledu; pevná CTA.
- **Živá dema (běží reálně na Astro + Cloudflare):** (1) bleskový datový filtr nad 5 000
  záznamy (D1/Worker), (2) nativní vínový AI agent webu (Workers AI + Vectorize), (3)
  diagnostický widget v patičce (performance API + cf hlavičky), (4) ROI kalkulačka u
  automatizací, (5) živý Lighthouse 100/100 vlastního webu.
- **Monetizace:** 3 měsíční tarify (2 500 / 6 000 / 15 000 Kč), regresivní bloky hodin
  (5/15/40 h za 1300/1200/1100 Kč/h), „noha ve dveřích" (audit za fix → quick win →
  škálování). Veřejný indexovatelný /cenik.
- **IA/SEO:** homepage‑hub + podstránky /tvorba-webu-a-eshopu, /automatizace-procesu,
  /ai-agenti-a-data, /technicke-seo-a-optimalizace, /cenik, /zapisky (blog).
- **„Aha" mechaniky:** netlačící asynchronní poptávka (text/Loom/hlasovka, odpověď do 24 h
  videem), ROI kalkulačka, „eat your own dogfood" Lighthouse.

## Zkritizuj konkrétně (číslovaně)
1. **Rozsah vs. realita jednoho člověka:** co je z toho v1 přepálené? Co reálně udržet a
   provozovat sám (zejména AI agent + 5 dem)? Co odložit do v2?
2. **Přepínač Zákazník/Inženýr:** je to geniální USP, nebo past (matoucí pro konzervativní
   SMB, dvojí údržba obsahu, riziko, že „inženýrský" pohled je samoúčelný)? Jak ho udělat
   tak, aby NEohrozil konverzi ani SEO (indexace, přístupnost, layout shift).
3. **Konverze pro konzervativní SMB:** kde koncept riskuje, že odradí (moc „tech", moc
   hravosti, netradiční poptávka)? Největší jedno riziko.
4. **SEO/výkon:** kde se kreativita pere se SEO/Core Web Vitals (JS váha dem, AI widget,
   přepínač)? Konkrétní mitigace.
5. **Vínová:** kde hrozí, že bude působit těžce/temně místo prémiově? Jak ji dávkovat.
6. **Co je ta JEDNA věc s nejvyšším pákovým efektem**, kterou když uděláme perfektně,
   web vyhraje — a 2–3 věci, které bez lítosti vyhodit z v1.

Na konec: doporučené **v1 minimum (silné, ne osekané)** vs. **v2 backlog**. Bez kódu/secrets/logů.
