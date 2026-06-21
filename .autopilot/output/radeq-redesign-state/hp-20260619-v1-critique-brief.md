# Kritické kolo nad hotovou V1 radeq.cz — najdi, co doladit

Jsi seniorní design/UX/konverzní + SEO ředitel. Hotová V1 webu RadeQ.cz je popsaná níže
(nemáš přístup k webu, hodnoť z popisu). Buď konkrétní a kritický. Piš česky. Cíl: seznam
KONKRÉTNÍCH vylepšení k doladění (ne přepis) — seřazený dle dopadu, proveditelný.

## Co je RadeQ.cz V1 (Astro + Cloudflare, statický, vínová ~5 % akcent, ivory báze, Plus
Jakarta + Inter + mono eyebrows; jednočlenné studio, cílovka konzervativní CZ SMB)

### Homepage (pořadí sekcí)
1. HERO: eyebrow „Racionální digitalizace"; H1 „Weby, data a automatizace, které vám uvolní
   ruce."; lead „Jeden technik s okem analytika a precizností testera. Navrhnu, postavím,
   otestuji a předám tak, že v tom nezůstanete sami."; proof rail (Web od 9 900 Kč / Audit
   od 4 900 Kč / Postavím·změřím·předám); CTA „Chci zmapovat problém" + „Co umím zjednodušit".
2. CO ŘEŠÍM: H2 „Poznáte se v některém z těchto bodů?" + 6 karet příznaků (poptávky v mailu,
   web nevodí zákazníky, přepisování dat, evidence, AI prakticky, nevím kde začít), každá
   odkaz „Pojďme to probrat".
3. SLUŽBY (sunken pruh): H2 „Co vám zjednoduším" + 5 karet s cenou „od" (Web od 9 900,
   E-shop od 19 900, Automatizace od 12 000, Data/AI od 15 000, Audit 4 900) + pozn.
   „od = funkční minimum; rozsah a složitost cenu zvyšují" + „Mám zájem".
4. JAK PRACUJI: H2 „Nejdřív měřím, pak stavím." + 3 kroky + tmavý vínový blok „Servisní
   protokol & Testerova záruka" (servisní protokol u zakázky; výkon 90+/100 nebo 15 % zpět).
5. CENY: 3 tarify předplatného (Klid 2 500 / Růst 6 000 featured / Partner 15 000) + pozn.
   o blocích hodin + odečtu auditu.
6. UKÁZKY teaser: 3 karty (Web pro instalatéra / Web s rezervací / Malý e-shop) se štítkem
   „VZOROVÝ PROJEKT" → odkazy na živé ukázkové stránky.
7. KONTAKT: formulář (jméno, e-mail, „co dnes používáte", „co potřebujete zjednodušit") na
   /api/leads + mailto fallback.
+ Plovoucí lehký „RadeQ průvodce" (vínový, rychlá tlačítka ceny/služby/postup/poptávka).
+ Footer (tmavý, logo, navigace).
+ /zapisky/ : 3 evergreen články (cena webu pro živnostníka; vlastní e-shop vs Shoptet;
  péče po předání).

### 3 živé vzorové ukázky (každá vlastní vizuál + demo banner zpět na RadeQ)
- /ukazky/instalater (one-pager instalatéra, ocelově modrá, telefon CTA, lokální SEO, ceník od)
- /ukazky/sluzba (fyzioterapie, šalvějová, rezervační UI mock, recenze)
- /ukazky/eshop (pražírna kávy, kávové tóny, katalog+filtr+drawer košík, hláška „ukázkový")

## Zkritizuj a dej KONKRÉTNÍ doladění (číslovaně, dle dopadu)
1. Konverze: kde homepage ztrácí (hero→akce, ceny, formulář)? 3 nejúčinnější mikro-úpravy.
2. Důvěra pro konzervativní CZ SMB: co chybí (kontakt, IČO, reálná tvář/jméno, telefon,
   reference)? Co přidat hned.
3. Sekce „Co řeším" + „Služby": je 6+5 karet moc/málo? Pořadí? Jak je propojit s cenami/ukázkami.
4. SEO: chybějící prvky (meta description per page, nadpisová hierarchie, schema.org
   LocalBusiness/FAQ, alt texty, sitemap, interní prolinkování ukázek/zápisků)? Priorita.
5. „RadeQ průvodce" a Testerova záruka „15 % zpět": riziko/přínos, jak doladit formulaci.
6. Vizuální/UX detaily: spacing, velikost/zalamování nadpisů, konzistence ukázek vs hlavní
   web, mobilní specifika — 5 konkrétních dolaďovacích bodů.
7. Nav „Ukázky" vede na /ukazky/ (zatím stará stránka) — jak vyřešit čistě.

Na konec: TOP 5 úprav, které udělat HNED před předložením vlastníkovi (nejvyšší dopad/cena).
Bez kódu/secrets/logů.
