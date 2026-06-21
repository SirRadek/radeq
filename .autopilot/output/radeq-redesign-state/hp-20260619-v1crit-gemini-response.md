Tady je kritický a konkrétní pohled z pozice seniorního UX/CRO ředitele. Web pro konzervativní české SMB (živnostníci, malé firmy) nesmí znít jako startupový pitch. Tito klienti hledají jistotu, srozumitelnost a partnera, který je „neodrbe“ a se kterým se dá mluvit lidsky.Zde je seznam konkrétních bodů k doladění V1, seřazený podle priorit v jednotlivých kategoriích:### 1. Konverze: Kde homepage ztrácí a jak ji nakopnout
Tady ztrácíš nejvíc lidí, protože mluvíš jazykem SaaS produktu, ne konzultanta pro živnostníky.
1. **Hero CTA je příliš abstraktní:** „Chci zmapovat problém“ zní pro instalatéra jako práce navíc. Změň to na něco hmatatelného a bezrizikového, např. **„Nezávazná konzultace“** nebo **„Probrat můj web/projekt“**. Sekundární CTA může být „Ukázky práce“ (kotevní odkaz).
2. **Tření v kontaktním formuláři:** Pole „Co dnes používáte“ a „Co potřebujete zjednodušit“ lidi zablokují (neví, jak to popsat, bojí se, že budou vypadat hloupě). **Změna:** Nech jen Jméno, E-mail/Telefon a jedno textové pole „S čím vám mohu pomoci?“.
3. **Absence alternativy k formuláři:** Konzervativní cílovka často radši rovnou volá. Hned vedle (nebo pod) formulář dej velkým písmem: *„Nebo mi rovnou zavolejte: +420 XXX XXX XXX“*.### 2. Důvěra pro konzervativní CZ SMB (Největší slabina)
Pokud je to jednočlenné studio, hraješ hru na osobní brand. Web ale působí anonymně.
1. **Chybí tvář a identita:** „Jeden technik...“ Kdo? Kde je fotka? Přidej do Hero sekce (nebo do „Jak pracuji“) kvalitní civilní fotku tváře. Lidé kupují od lidí.
2. **Klíčové firemní údaje:** Do patičky (footer) okamžitě přidej **celé jméno, IČO a město/region**. Bez IČO působíš jako student, co si přivydělává.
3. **Reference (i když zatím nejsou):** Pokud nemáš klientské citace, nahraď je odznaky technologií, které ovládáš (loga Astro, Shoptet, Cloudflare), nebo silným osobním prohlášením („Tvořím weby s odpovědností, jako by to byl můj vlastní byznys.“).### 3. Sekce „Co řeším“ + „Služby“ (Informační přetížení)
11 karet (6 problémů + 5 služeb) těsně za sebou je kognitivní záhul.
1. **Zpřehlednění problémů:** 6 karet je na hraně. Použij výrazné, ale jednoduché ikony (ideálně vínové v barvě akcentu), aby se daly skenovat očima.
2. **Propojení (Most):** Mezi tyto dvě sekce musíš dát logický přechod. Služby by měly barevně nebo ikonograficky odpovídat problémům nahoře (např. karta problému „přepisování dat“ by měla mít stejnou vizuální nápovědu jako služba „Automatizace“).
3. **Pořadí:** Je logické (Bolest → Lék), ale u Služeb zvaž prohození: Web (nejčastější) → E-shop → Audit (nízká bariéra vstupu) → Data/AI → Automatizace.### 4. SEO: Technický a obsahový základ
Astro je pro SEO skvělé, ale musíš to odpracovat.
1. **Meta tagy a Title (Priorita 1):** Každá stránka (včetně ukázek a zápisků) musí mít unikátní `<title>` (např. `Tvorba webů pro živnostníky | RadeQ.cz`) a `<meta description>`, který obsahuje klíčová slova (tvorba web
bu, automatizace, rychlé weby).
2. **Schema.org (Priorita 2):** Implementuj JSON-LD pro `Person` a `ProfessionalService`. Pomůže to Googlu pochopit, kdo jsi a co nabízíš.
3. **Interní linkbuilding (Priorita 3):** Články v `/zapisky/` nesmí být slepé uličky. Článek „cena webu pro živnostníka“ musí mít jasné CTA a textový odkaz vedoucí zpět na službu „Web od 9 900 Kč“.
4. **Základy (Priorita 4):** Alt texty u všech obrázků a automaticky generovaná `sitemap.xml` (přes `@astrojs/sitemap`).

### 5. „RadeQ průvodce“ a Testerova záruka
1. **Testerova záruka (Riziko nepochopení):** „Výkon 90+/100“ klientovi nic neřekne. Může si myslet, že mu garantuješ 90 prodejů. **Doladění:** Přelož to do byznysu: *„Garantuji bleskově rychlý web. Pokud nesplní přísné 
 technické normy Googlu pro rychlost, vracím vám 15 % z ceny.“*
2. **RadeQ průvodce (Riziko otravnosti):** Plovoucí prvky na mobilech často překrývají obsah (nebo nativní UI prohlížeče). **Doladění:** Pokud je to FAB (Floating Action Button), schovej ho při scrollování dolů a ukaž př
ři scrollování nahoru. Alternativně ho úplně zruš a nech jen lepivou (sticky) hlavičku s tlačítkem „Kontakt“.

### 6. Vizuální/UX detaily
1. **Oddělení sekcí:** Ivory báze vs bílé/vínové karty je super, ale dej pozor, aby sekce „Služby“ (sunken pruh) měla dostatečný vertikální padding (alespoň `py-16` nebo `py-24` v Tailwindu), ať web dýchá.
2. **Typografická hierarchie:** Plus Jakarta a Inter si jsou dost podobné. Důsledně drž Plus Jakartu POUZE pro nadpisy (tučné, velký kontrast) a Inter POUZE pro odstavce.
3. **Mobilní UX karet:** Ujisti se, že 3 tarify předplatného a 3 kroky spolupráce se na mobilu nepromění v nekonečnou nudli k scrollování. Pomáhá vizuální odlišení prostřední/hlavní karty (např. ten Růst tarif mít s víno
ovým okrajem).
4. **Zalamování nadpisů (Orphans):** Na mobilech zkontroluj, ať v H1 a H2 nezůstávají jednopísmenné předložky na konci řádku (použij `&nbsp;` nebo CSS `text-wrap: balance`).
5. **Banner na ukázkách:** Živé ukázky (např. instalatér) musí mít naprosto jasný, fixní pruh nahoře: *„Toto je vzorový projekt od RadeQ.cz“* s tlačítkem *„Zpět na nabídku služeb“*. Jinak klient odejde s pocitem, že je n
na webu instalatéra, a zavře panel.

### 7. Navigace „Ukázky“
Pokud `/ukazky/` vede na starou/nehotovou stránku, je to zabiják konverze.
**Čisté řešení:** V navigaci změň odkaz z `/ukazky` na kotvu `/#ukazky-prace` (ID sekce č. 6 na homepage). Po kliknutí plynule odscrollovat na 3 karty vzorových projektů. Nehotové stránky na V1 nemají co dělat.

---

### 🔥 TOP 5 úprav HNED (Nejvyšší dopad, práce na 30 minut)

1. **Odhal identitu:** Do patičky přidej Jméno, Příjmení, IČO. Do Hero (nebo o mně) dej svou civilní fotku. (Základní pilíř důvěry).
2. **Zjednoduš formulář + přidej telefon:** Vyhoď zbytečná pole z formuláře, nechej jen vzkaz a kontakt. Hned vedle napiš velkým písmem své telefonní číslo.
3. **Změň Hero CTA:** Přepiš abstraktní tlačítko na „Nezávazná konzultace“ (nebo „Probrat projekt“).
4. **Změň odkaz v navigaci:** Tlačítko/odkaz „Ukázky“ namiř na kotvu na homepage, starou URL schovej.
5. **Přepiš „Záruku“ do lidštiny:** Místo „výkon 90/100“ mluv o „bleskovém načítání a technické bezchybnosti podle metrik Googlu“.