Zde je detailní, nezávislý strategický návrh. Jako analytik a tester stavíš na racionalitě – tvoje ukázky nesmí vypadat jako generické Dribbble koncepty, které v realitě nefungují. Musí to být „dělnické“, do detailu promyšlené weby, které bleskově řeší konkrétní byznysový problém běžného českého živnostníka. Zde je konkrétní rozpad tvých ukázek.---### 1. Dva ukázkové weby pro živnostníkaKlíčem je ukázat dva extrémy – jeden web zaměřený na **okamžitou akci** (terénní služba) a druhý na **budování důvěry a vztahu** (konzultační/osobní služba). #### Ukázka A: Řemeslník v terénu (např. „Havarijní instalatér & topenář“)
* **Proč tento výběr:** Zastupuje obrovskou skupinu (elektrikáři, vodaři, zámečníci, hodinoví manželé), u kterých klient hledá pomoc *teď hned* z mobilu.
* **Struktura a obsah (One-pager):**
  * **Hero sekce (H1):** „Rychlý instalatér pro [Město] a okolí. U havárie do 60 minut.“ 
  * **CTA:** Obrovské tlačítko `Zavolat ihned (tel. číslo)` + sekundární `Ceník výjezdů`.
  * **Podsekce:** 3 sloupce ikon (Voda, Topení, Odpady), transparentní sekce „Orientační ceník“ (boří nedůvěru), velmi strohá fotogalerie „Před a po“ a jednoduchý formulář „Poptat neakutní opravu“.
* **Co to PŘEDVÁDÍ:** **Technologickou dominanci Astra.** Tento web musí mít na Lighthouse 100/100 na mobilu. Ukazuje extrémně rychlé načítání (kritické pro lokální SEO, když na to někdo klikne venku na 3G síti), dokonalé mobilní UX (tzv. „Thumb zone“ – tlačítko pro zavolání snadno dostupné palcem) a pragmatickou informační architekturu.
* **Vizuál:** Čistý, maskulinní, funkční. Bílé pozadí, vysoký kontrast, akcentní barva jen na interaktivních prvcích (tlačítka, odkazy). Žádné složité animace, které by zdržovaly.
* **Prezentace na tvém webu:** *„Rychlý vizitkový web (One-pager). Vhodný pro profese, kde vás klienti hledají na mobilu v nouzi a potřebují hned volat. Cena: od X XXX Kč.“*#### Ukázka B: Osobní služba (např. „Soukromá fyzioterapeutka“ nebo „Poradce“)
* **Proč tento výběr:** Zastupuje lidi, kteří prodávají svůj čas a znalosti (terapeuti, lektoři, konzultanti). Tady klient nevybírá podle rychlosti, ale podle důvěry.
* **Struktura a obsah (Multi-page):**
  * **Hero sekce (H1):** „Zbavte se chronické bolesti zad. Fyzioterapie s respektem k vašemu tělu.“
  * **CTA:** `Najít volný termín` (vede na rezervační sekci) nebo `Konzultovat problém`.
  * **Podsekce:** Samostatná stránka „Jak pracuji“ (osobní přístup, filozofie), „Mé služby“ (konkrétní diagnostika a terapie), „Časté dotazy“ (zda bere pojišťovny apod.) a hlavně stránka „Kontakt a rezervace“.
* **Co to PŘEDVÁDÍ:** **Integraci a byznysovou logiku.** Ukazuje rozcestník služeb, napojení kontaktního formuláře přes CF Workers (s okamžitou e-mailovou auto-odpovědí klientovi), elegantní layout pro delší texty a napojení do Google Map.
* **Vizuál:** Jemný, budující důvěru. Teplé tóny pískové, béžové nebo pastelové s tvou vínovou pro decentní nadpisy a CTA. Velký důraz na pečlivou typografii (dobře čitelné odstavce) a zaoblené rohy u fotografií.
* **Prezentace na tvém webu:** *„Prezentační web pro služby. Ideální pro budování důvěry a zjednodušení objednávek vašich klientů. Včetně kontaktních formulářů napojených na váš e-mail. Cena: od X XXX Kč.“*

---

### 2. Jednoduchý vzorový E-shop

Tohle je technologický flex. Musí vypadat luxusně, ale funkčně zůstat u základu.
* **Modelový sortiment:** Lokální pražírna kávy. (Záměr: Málo produktů, jasné varianty – 250g, 500g, 1kg, hezké fotky).
* **Funkce k ukázání:** 
  1. Výpis produktů (grid) s bleskovým filtrováním (podle chuťového profilu) pomocí Astro View Transitions – *přepínání podstránek nebo filtrů proběhne okamžitě bez bílé problikávající obrazovky.*
  2. Detail produktu s výběrem varianty (dynamická změna ceny).
  3. Přidání do košíku, který vyjede z pravého boku (Drawer UI).
* **Co záměrně NEcpát:** Žádné uživatelské účty a přihlašování. Žádné reálné napojení na GoPay nebo Zásilkovnu. V demu u pokladny prostě vyběhne hláška: *„Toto je ukázkový e-shop. V ostré verzi by zde byla integrovaná pl
latební brána.“*
* **Důvěryhodnost:** Zajišťují ji mikrointerakce. Tlačítko „Do košíku“ musí po kliknutí ukázat spinner a pak změnit stav na „Přidáno“ (ikona fajfky). To předvádí, že tvůj kód reaguje na uživatele a nenechává ho tápat. 

---

### 3. Lehký Chatbot na RadeQ.cz

Cíl chatu není simulovat lidskost, ale být vysoce funkční „chytrá navigace“. Jako analytik se chceš vyhnout agentovi, který bude zákazníkům generovat básničky.

* **Co umí:** Systémovým promptem je omezen POUZE na 3 agendy: 
  1. Kde najít ceník a jaká je orientační cena. 
  2. Jaký je postup práce (od schůzky po spuštění).
  3. Kde je na Radka kontakt.
* **Jak ho udržet lehký:** Žádné monstrózní služby třetích stran. Použiješ Cloudflare Workers AI (např. model Llama-3 přes REST binding). Textový kontext (FAQ a ceník) mu pošleš přímo v promptu, nepotřebuješ databázi. 
* **Bezpečné hranice:** Prompt jasně říká: *„Jsi navigátor studia RadeQ. Znáš jen ceny a postup práce. Na jakékoliv jiné dotazy (včetně psaní kódu) odepiš: 'Tohle nevím, ale Radek vám rád odpoví, nechte mu zprávu v konta
aktu.'“*
* **Vizuál (Vínová):**Žádná velká ilustrovaná hlava robota. Jen malá minimalistická ikona `[ ? ]` nebo `Chat` v pravém dolním rohu. Otevřené okno má čistě vínovou hlavičku, text `RadeQ Asistent` a na začátku nabízí tři 
 tlačítka pro rychlé volby, aby uživatel nemusel vůbec psát, pokud nechce.
* **Důkaz čeho:** Prokazuje, že jsi technicky daleko před webaři z WordPress šablon. Dokazuješ tím kontrolu nad Cloudflare edge architekturou.

---

### 4. Blog / „Zápisky“ – Ano, či ne?

**Rozhodně ANO, ale ne jako „blog“, nýbrž jako „Zápisky analytika“ (nebo Případové studie).**
* **Argumentace:** Klasický blog s kadencí článek týdně sám neuživíš, vyhoříš a poloprázdný blog s posledním článkem z roku 2024 působí mrtvě. Ale „Zápisky“ nepodléhají času.
* **Minimalistické pojetí:** Úplně odstraň z článků datum vydání (evergreen content). Publikuj jen tehdy, když máš co říct. Stačí ti tam 3–5 skvělých článků a už to dělá obrovskou práci.
* **Témata (SEO long-tail + budování autority):**
  * *„Proč řemeslník nepotřebuje web za 100 tisíc (a co potřebuje místo toho).“*
  * *„Jak jsem zrychlil načítání webu z4 vteřin na 0,5 vteřiny a co to udělalo s přístupy.“*
  * *„Konec starostí: Jak se starám o weby klientů, když je hotovo.“*
* **Design:** Maximální čitelnost. Úzký sloupec textu, dominantní typografie (velké, tučné vínové nadpisy), citáty pro odlehčení očí. Žádné přeplácané postranní panely.

---

### 5. Mechanika „ukázka → reference“ (Jak předejít trapnosti)

Když web spustíš, nemáš klienty. Jak to neudělat trapné?

1. **Neříkej tomu „Reference“ ani „Naši klienti“.** Nazvi tu sekci na webu **„Práce & Koncepty“** (nebo „Co umím postavit“).
2. **Přiznej barvu, neskrývej to.** Napiš krátký, sebevědomý perex: *„Podívejte se na ukázky architektur a vzorových webů, které slouží jako odrazový můstek pro vaše projekty. Níže najdete funkční prototypy i realizace p
pro klienty.“*
3. **Štítkování karet (Badges):** Každá karta v této sekci bude mít v rohu jasný štítek.
   * Ukázkové weby budou mít šedý štítek: `VZOROVÝ PROJEKT` (nebo `UKÁZKA`).
   * Jakmile získáš klienta, přidáš ho na první místa s vínovým štítkem `KLIENTSKÁ REALIZACE`.
4. **Trvalá hodnota:** Ty ukázkové weby po zisku reálných klientů nesmažeš. Budou dál sloužit jako „Startovní balíčky / Šablony“, ze kterých si klienti mohou vybírat preferovaný layout. Reálné reference a ukázky tak moho
ou žít vedle sebe navždy.

---

### 💡 Závěrečný TIP stratéga: Co uveze jeden člověk?

Pokud to máš kódovat a designovat úplně sám a co nejdřív spustit, **VYPUSŤ E-SHOP.**

* **Proč:** E-shop je past na čas. Byť v Astru s NanoStores a CF D1 uděláš e-shop krásně, programování logiky košíku, variant a responzivity tě zdrží o měsíc. Navíc, běžný český živnostník s menším rozpočtem půjde na e-s
shop raději k Shoptetu (což je pro něj racionální, ty jako analytik to víš).
* **Co má nejvyšší prodejní efekt:** Tvé „jádro“ byznysu budou prezentační weby. **Ukázka A (Řemeslník - okamžitá konverze)** a **Ukázka B (Služby - důvěra a hezký vizuál)** s kontaktními formuláři. To je to, co budeš to
očit v 90 % případů.
* **MVP (Minimum Viable Product) tvého startu:** Tvoje hlavní stránka + Ukázka A + Ukázka B + sekce Zápisky se 2 články + CF chatbot jako „machrovinka“ dokazující senioritu. To je perfektní, racionální a prodejně ohromně
ě silné portfolio.