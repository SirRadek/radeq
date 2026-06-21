# Brainstorming: Interaktivní prvek důvěry „Cesta k výsledku“ (RadeQ.cz)

Tento dokument obsahuje detailní návrh a rozbor pro redesign hero sekce a interaktivní cesty projektu RadeQ.cz. Cílem je zvýšit důvěru u konzervativní české cílové skupiny (živnostníci, malé firmy, spolky) prostřednictvím konkrétnosti, věcnosti a srozumitelnosti.

---

## 1. Task Understanding (Pochopení úkolu)
*   **Cílová skupina:** Konzervativní čeští klienti (ŽL, rodinné firmy, spolky), kteří neslyší na moderní marketingový hype a potřebují vidět jasná fakta, proces, časový rámec a co přesně za své peníze dostanou.
*   **Role RadeQ:** Solo analytik a tester. Proces musí demonstrovat jeho osobní zapojení, preciznost a fakt, že klient jedná přímo s autorem, ne s anonymní agenturou.
*   **Technické limity:** Rychlost (Lighthouse 90+), nulový horizontální přetékání (0 overflow), bezbariérovost (přístupnost, reduced-motion), spolehlivý no-JS fallback a čistá mobilní verze.

---

## 2. Idea Cards (Koncepty řešení)

Představujeme 3 specifické koncepty, které se liší vizuální metaforou i celkovým pojetím cesty. Každý staví na vyváženém poměru designu a SEO (profil `balanced`).

### Concept 1: „Technický výkres“ (The CAD Blueprint)
*   **Theme Crossing (Kombinace témat):** Chill/calm/calculated minimalism + modern retro + proof-led deliverables.
*   **Kompozice prvního screenu (Viewport):** Čistá typografie na levé straně (H1 + CTA). Vpravo je přesná technická SVG schéma (připomínající technický výkres nebo CAD schéma), kde jsou jednotlivé checkpointy označené přesnými kótami a čísly (např. `01 / ROZBOR`).
*   **Strategie důkazů (Proof):** Kliknutí na uzel zobrazí reálný příklad dokumentu v miniaturním rámečku (např. rozmazaný náhled reálného testovacího protokolu nebo schématu).
*   **Role pohybu/maskota:** Žádný maskot. Token „Řešení“ je reprezentován jako jemný zaměřovací kříž (+), který se při scrollu plynule posouvá po kótovací čáře.
*   **SEO / Přístupnost / Rychlost:** SVG schéma je pro čtečky skryté (`aria-hidden="true"`). Veškeré texty etap jsou pod schématem v klasickém HTML textu.
*   **Rozdíl oproti baseline A/B/C/D:** Vyhýbá se hravosti (Cat Concierge) i korporátnímu stylu (Guided Offer Map). Staví na inženýrské estetice (analytik + tester).
*   **Hlavní riziko:** Může působit příliš chladně pro lokální spolky či ne-technické živnostníky.

### Concept 2: „Klientský deník“ (The Transparent Ledger)
*   **Theme Crossing (Kombinace témat):** Chill/calm/calculated minimalism + written/editorial craft + handoff evidence.
*   **Kompozice prvního screenu (Viewport):** Asymetrický layout. Textový obsah plyne vertikálně. Cesta není křivka, ale svislé pravítko/osa na boku stránky, která provází čtenáře při čtení.
*   **Strategie důkazů (Proof):** U každé fáze je uveden přímý citát („Radek říká: ...“) a odkaz na konkrétní výstup, který klient fyzicky obdrží (např. PDF příručka k webu).
*   **Role pohybu/maskota:** Osa se při scrollu postupně vybarvuje lime barvou.
*   **SEO / Přístupnost / Rychlost:** 100% nativní HTML layout. Skvělá čitelnost pro vyhledávače i čtečky bez nutnosti JS.
*   **Rozdíl oproti baseline A/B/C/D:** Zcela opouští horizontální křivky a složité interakce. Funguje jako klasický, vysoce čitelný článek/deník.
*   **Hlavní riziko:** Méně výrazný vizuální „wow efekt“ v prvním okamžiku.

### Concept 3: „Kancelářský pořadač“ (Physical Folder Map)
*   **Theme Crossing (Kombinace témat):** Modern retro / pixel vibe + calm trust + static demo links.
*   **Kompozice prvního screenu (Viewport):** Checkpointy jsou stylizované jako záložky kartotéky nebo fyzických složek vedle sebe.
*   **Strategie důkazů (Proof):** Otevřená složka ukazuje tabulku: „Co potřebuji od vás“ vs. „Co dodám já“ a „Časová náročnost“.
*   **Role pohybu/maskota:** Token „Řešení“ je animovaná kancelářská svorka (paperclip), která přeskočí na aktivní záložku.
*   **SEO / Přístupnost / Rychlost:** Záložky fungují jako přístupná tlačítka (`<button>`) s ARIA stavy. Na mobilu se skládají pod sebe jako akordeon.
*   **Rozdíl oproti baseline A/B/C/D:** Používá známou fyzickou metaforu pořadače namísto abstraktních křivek.
*   **Hlavní riziko:** Náročnější na přesné nastylování, aby to nevypadalo levně.

---

## 3. Best Hybrid (Doporučené řešení)

Doporučujeme kombinaci konceptu **„Technického výkresu“** s rozložením typu **„Hero jako Hook, Sekce jako detail“**.

### A. Umístění: Hero vs. Samostatná sekce (Osa A)
*   **Hero (Hook):** V hero sekci zůstává pouze zjednodušená, čistě vizuální SVG křivka s velkými textovými popisky etap bez jakýchkoliv interaktivních textů. Křivka se jednou vykreslí a puls projde po trase. To slouží jako vizuální kotva, která nezahltí H1 ani hlavní CTA tlačítko.
*   **Samostatná sekce (Detail):** Plně interaktivní vysvětlovač se přesouvá níže na stránku (nahrazuje/rozšiřuje sekci „Jak pracuji“). Zde má uživatel dostatek prostoru se soustředit, číst a klikat.

### B. Interakční model (Osa B)
*   **Desktop:** Scroll-driven autoplay (při dosrolování k sekci se token automaticky posune na první fázi). Uživatel může na jednotlivé checkpointy najet myší (hover = zobrazení informací) nebo kliknout (lock stav = informace zůstanou otevřené a token se tam přesune). Klávesnice podporuje Tab pro procházení a Enter pro uzamknutí.
*   **Mobil:** Křivka se skryje (případně se zobrazí jen jako drobná svislá čára). Celá sekce se transformuje do **akordeonu** (rozbalovací seznam). Každá fáze je velký tap target (min. 48px na výšku). Výchozí stav má první fázi rozbalenou.
*   **No-JS Fallback:** Všechny fáze jsou plně vykreslené a rozbalené pod sebou jako statický, přehledný seznam. Žádný text nezůstane skrytý.

### C. Typografie a vizuální styl (Osa E)
*   **Písmo:** Konec malému mono písmu. Použijeme čistý, středně tučný bezpatkový font (např. *Outfit* nebo *Inter*) o velikosti `1.1rem` až `1.2rem` (cca 18–20px) pro názvy etap, aby byly okamžitě čitelné.
*   **Zvýraznění aktivního stavu:** Aktivní fáze má 100% opacitu, sytou barvu a jemné orámování. Neaktivní fáze jsou utlumené na `opacitu 0.55` (stále však splňují WCAG AA kontrast vůči pozadí), což vizuálně navádí oko na aktuální krok.
*   **Použití lime barvy:** Lime zelená se používá výhradně jako akcent: svítící token „Řešení“ a finální uzel „Výsledek · ověřeno“. Zbytek cesty používá konzervativní barvy (např. tmavou antracitovou, břidlicovou nebo tlumenou modrou).

---

## 4. Obsah fází a trust prvky (Osy C a D)

Texty jsou psány přímočarým, věcným tónem bez prázdných frází. Zaměřují se na to, co z toho klient reálně má a jak probíhá spolupráce.

### Fáze 1: Rozbor (Analýza)
*   **Co se řeší:** Vaše představa, cíle webu, analýza konkurence a potřeby vašich zákazníků. Žádná zbytečná teorie.
*   **Jak dlouho:** 3 až 7 dní.
*   **Jak probíhá:** Krátce si zavoláme nebo se potkáme u kávy. Vy mi popíšete své podnikání, já se podívám na konkurenci a sepíšu jednoduché, srozumitelné zadání v češtině.
*   **Co z toho máte:** Jistotu, že nestavíme zbytečnosti. Máte v ruce jasný plán a víte přesně, za co platíte.
*   **Trust prvek:** Spolupráci začínáme bez závazků. Pokud se po analýze nedomluvíme, analýza vám zůstává a neplatíte nic navíc.

### Fáze 2: Návrh (Struktura & Texty)
*   **Co se řeší:** Rozvržení stránek (drátěný model) a příprava textů, které vaši zákazníci pochopí na první dobrou.
*   **Jak dlouho:** 5 až 10 dní.
*   **Jak probíhá:** Navrhnu strukturu webu a napíšu texty. Vše si projdeme a upravíme tak, aby to přesně odpovídalo realitě.
*   **Co z toho máte:** Uvidíte budoucí web ještě předtím, než se začne programovat. Můžete cokoliv změnit bez vícenákladů.
*   **Trust prvek:** Žádné generické šablony. Každý text píšu na míru vašim zákazníkům.

### Fáze 3: Stavba (Vývoj)
*   **Co se řeší:** Rychlý a čistý kód, přizpůsobení pro mobily, základní nastavení pro vyhledávače (SEO).
*   **Jak dlouho:** 2 až 4 týdny (podle složitosti).
*   **Jak probíhá:** Web stavím na testovací adrese. Dostanete odkaz a můžete sledovat, jak web pod rukama roste. Žádná černá skříňka.
*   **Co z toho máte:** Bleskově rychlý web, který se zákazníkům načte i na slabém mobilním signálu.
*   **Trust prvek:** Platba je rozdělena na části. Druhou část platíte až po schválení funkčního prototypu.

### Fáze 4: Test (Ověření a ladění)
*   **Co se řeší:** Hledání chyb, testování rychlosti, kontrola formulářů a zobrazení na 10+ typech mobilů a tabletů.
*   **Jak dlouho:** 3 až 5 dní.
*   **Jak probíhá:** Jako tester procházím web krok po kroku a simuluji chování uživatelů. Prověřuji zabezpečení a rychlost načítání.
*   **Co z toho máte:** Web bez chyb a nefunkčních tlačítek. Nepřijdete o žádného zákazníka kvůli tomu, že by nefungoval formulář.
*   **Trust prvek (Klíčový):** Ke každému webu přikládám oficiální **Protokol o testování** s výsledky měření rychlosti (Lighthouse) a zárukou bezchybnosti.

### Fáze 5: Předání (Nasazení & Návod)
*   **Co se řeší:** Spuštění webu na vaší doméně, nastavení e-mailů, zabezpečení (HTTPS) a předání správy.
*   **Jak dlouho:** 1 až 2 dny.
*   **Jak probíhá:** Web přesunu na váš hosting. Natočím vám krátké (5minutové) video na míru, kde vám ukážu, jak si sami snadno přepíšete cenu nebo změníte fotku.
*   **Co z toho máte:** Plnou kontrolu nad webem. Nejste závislí na programátorovi kvůli každé drobnosti.
*   **Trust prvek:** Po předání ode mě máte **30 dní technické podpory zdarma**. Pokud si s něčím nebudete vědět rady, pomohu vám.

---

## 5. Reject (Co rozhodně nedělat - Osa F)

Abychom zachovali rychlost, čistotu a důvěru u konzervativního publika, vyhneme se těmto prvkům:
*   **Těžké JS knihovny:** Žádné GSAP, Framer Motion ani zbytečné JS pluginy. Vystačíme si s CSS transition/transform a lehkým Intersection Observerem pro spuštění animace.
*   **Složité 3D prvky / WebGL:** Žádné otáčející se 3D modely na pozadí, které by zasekávaly starší mobilní telefony živnostníků.
*   **Bento grid a moderní SaaS šablony:** Cílová skupina potřebuje jasné svislé nebo vodorovné čtení, ne chaotickou mozaiku boxů.
*   **Cizí slova a korporátní hantýrka:** Žádné výrazy jako *„agilní sprint“*, *„end-to-end integrace“*, *„user story“* nebo *„KPI“*. Nahrazujeme je slovy: *„společný postup“*, *„kompletní spuštění“*, *„potřeby zákazníků“* a *„výsledky“*.
*   **Hover-only ovládání:** Žádné důležité informace nesmí být dostupné pouze najetím myši. Na mobilu by byly zcela nedostupné.

---

## 6. Verification Needed (K ověření)

Před samotnou implementací je nutné prověřit následující body:
1.  **Kontrast barev:** Ověřit, zda utlumené stavy neaktivních uzlů (s navrženou opacitou 0.55) splňují kontrastní poměr minimálně 4.5:1 (WCAG AA) vůči zvolenému pozadí webu.
2.  **Rychlost načítání (Lighthouse):** Otestovat dopad inline SVG křivky a případného minimalizovaného JS na výkon mobilního zařízení na slabém 3G připojení.
3.  **Dostupné fonty:** Ověřit v repozitáři projektu RadeQ, jaké bezpatkové fonty jsou již nastavené, abychom zbytečně nenačítali další webové písmo z Google Fonts.
