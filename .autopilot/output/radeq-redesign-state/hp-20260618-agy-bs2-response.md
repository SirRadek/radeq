Skvělý směr. Přepínám do role produktového a technického stratéga. Máme před sebou RadeQ.cz – butikové studio, které dýchá technologickou precizností, ale komunikuje lidsky a hravě. V tomto kole proměníme koncept v tvrdý byznys model, ukážeme "flex" přes reálné funkce a nastavíme SEO strukturu, která bude sbírat český B2B/SMB traffic.Zde je strategický plán pro **Kolo 2**.---### 1. Monetizace (Prodej hodnoty, ne jen kódu)České SMB (malé a střední firmy) mají často strach z „černé díry na peníze“, kterou webaři a IT konzultanti někdy představují. Naše cenotvorba bude transparentní, předvídatelná a zaměřená na návratnost (ROI).#### A. Měsíční předplatné (Od „udělal web“ k „drží mi záda“)
Místo předávání hotového webu a sbohem, prodáváte *partnerství*. SMB majitel si kupuje klid.*   **Tarif: ÚDRŽBA A KLID (cca 2 500 Kč / měsíc)**
    *   *Co obsahuje:* Garance funkčnosti, technický monitoring (uptime), bezpečnostní záplaty, hlídání expirace domén/certifikátů a 1 hodina měsíčně na drobné úpravy (změna textu, přidání reference).
    *   *Proč funguje:* Zákazník ví, že když něco „spadne“, má komu zavolat. Hodina úprav motivuje k občasné komunikaci.
*   **Tarif: OPTIMALIZACE A DATA (cca 6 000 Kč / měsíc)**
    *   *Co obsahuje:* Vše ze základu + aktivní hlídání SEO pozic (Ahrefs/Seznam), kontrola broken links, základní měsíční report s doporučením („Tento článek má návštěvnost, dejme tam CTA“) a **3 hodiny** vývojového času.
    *   *Proč funguje:* Posun od údržby k reálnému posouvání byznysu. Zákazník vidí, že na něj myslíte i tehdy, když on řeší operativu.
*   **Tarif: AUTOMATIZACE A AI PARTNER (cca 15 000 Kč / měsíc)**
    *   *Co obsahuje:* Dedikovaný R&D partner. Neustálé vylepšování procesů. Vytěžení dat z e-shopu, iterace AI agenta na supportu, propojování nových API, **10 hodin** vývoje/konzultací.
    *   *Proč funguje:* Toto je pro klienty, kterým už RadeQ ušetřil čas nebo vydělal peníze a chtějí škálovat bez najímání interního CTO.#### B. Balíčky hodin (Regresivní sazba)
Pro klienty, kteří nechtějí paušál, ale potřebují občasný vývoj. Základní sazbu (např. 1 300 Kč/h) mírně ohneme, abychom motivovali k větším závazkům, ale zachovali prémiovost.*   **1. Rozjezdový blok (5 hodin) – 6 500 Kč** *(1 300 Kč/h)*. Ideální na vstupní audity, rychlé opravy chyb nebo menší nastavení analytiky.
*   **2. Akcelerační blok (15 hodin) – 18 000 Kč** *(1 200 Kč/h)*. Vhodné pro nasazení nové funkce (např. parametrické filtrování, integrace mailingového nástroje).
*   **3. Transformační blok (40 hodin) – 44 000 Kč** *(1 100 Kč/h)*. Větší projekty (nový webový modul, tvorba interního dashboardu, stavba AI agenta).
*   *Psychologický prodej:* Na webu to komunikujte takto: *"Čím větší blok času mi svěříte, tím více se mohu ponořit do hloubky vašeho byznysu bez administrativního přepínání. Tuto úsporu času promítám do vaší ceny."* Ne
ení to sleva za objem, je to odměna za efektivní spolupráci. Platnost bloku např. 6 měsíců.

#### C. Dlouhodobá spolupráce (Mechanika „Noha ve dveřích“)
Konzervativního majitele firmy, který se bojí velkých investic, nezískáte nabídkou "AI automatizace za 100 tisíc". Získáte ho postupně:
1.  **Sonda(Audit za fix):** Např. SEO a rychlostní audit za 4 000 Kč (který se odečte, pokud dojde k realizaci oprav). Zákazník dostane konkrétní hodnotu s nízkým rizikem.
2.  **Rychlá výhra (Quick Win):** Opravíte to, co audit našel. Zrychlíte e-shop, nastavíte zahozený košík. Stálo ho to 15 000 Kč, ale za měsíc mu to přineslo 30 000 Kč. Důvěra je vybudována.
3.  **Škálování:** "Vidíte, že to funguje. Pojďme se teď podívat na to, kolik hodin trávíte přepisováním faktur..." Nyní vám svěří projekt za 80 000 Kč bez mrknutí oka.

#### D. Prezentace cen na webu
Vytvořte dedikovanou stránku `/cenik`. Je to obrovské SEO plus (dotazy typu *„tvorba webu cena 2024“*). Neukrývejte se za „cena na vyžádání“. Napište:
*   *„Jednoduchý prezentační web na špičkových technologiích typicky začíná na 35 000 Kč.“*
*   *„Automatizace běžného procesu (např. e-shop -> fakturace -> e-mail) obvykle vychází na 10 až 25 000 Kč.“*
Tím filtrujete klienty s rozpočtem 5 tisíc a těm relevantním dáváte transparentní mantinely.

---

###2. Mechanika: Web = Ukázky → Později reference

Váš web postavený na Astro +Cloudflare musí fungovat jako „showroom“. Dema nesmí být simulace, musí to být reálný kód bežící v prohlížeči a na Cloudflare Edge/D1 databázi.

*   **Demo 1: Bleskový datový filtr (Ukázka Data & Rychlost)**
    *   *Kde je:* V sekci zaměřené na e-shopy a zpracování dat.
    *   *Co dělá:* Interaktivní tabulka s 5 000 fiktivními produkty nebo záznamy. Uživatel do vyhledávání začne psát a výsledky se filtrují v řádu milisekund, bez znovunačtení stránky.
    *   *Technicky:* Astro stahuje JSON/SQLite (D1) data přes Cloudflare Worker na hranu sítě blízko k uživateli. Klient-side (např. Alpine.js nebo čistý JS) to jen filtruje.
    *   *Důkaz:* „Přesně takhle rychle může zákazník najít produkt na vašem e-shopu.“
*   **Demo 2: Nativní AI Chat/Asistent RadeQ (Ukázka AI agentů)**
    *   *Kde je:* Vznáší se v rohu, ale s vínovým, odladěným UI (žádný výchozí modrý blob).
    *   *Co dělá:* Zná celý váš web. Uživatel se může zeptat: „Kolik si Radek účtuje za SEO audit?“ a agent odpoví s odkazem na ceník.
    *   *Technicky:* Cloudflare Workers AI + Vectorize (vektorová databáze vašich textů z webu). Extrémně levné, rychlé, bez závislosti na drahých řešeních třetích stran.
    *   *Důkaz:* „Nejenže o AI píšu, já ji sám efektivně používám. Stejného agenta vytrénuji na vašich interních datech nebo manuálech pro zákazníky.“
*   **Demo 3: Živá diagnostika na pozadí (Ukázka analytiky)**
    *   *Kde je:* Malý nenápadný widget v patičce.
    *   *Co dělá:* Ukazuje uživateli: *„Tato stránka se u vás načetla za 45 ms. Vygenerováno z uzlu: Praha (PRG). Váš prohlížeč blokuje X trackerů. My na RadeQ.cz trackery nepoužíváme.“*
    *   *Technicky:* Sběr dat z `window.performance` API a hlaviček Cloudflare (tzv. `cf-ray`, `cf-ipcountry`).
    *   *Důkaz:* Buduje to auru absolutního technologického přehledu.

**Přerod v reference:**
Sekci nazvěte **„Laboratoř & Realizace“**. Na začátku v ní budou převážně tyto tři hračky (Laboratoř). Jakmile získáte reálný projekt, přidáte kartu (Realizace): *„Jak jsme princip bleskového filtru z naší laboratoře nas
sadili u Klienta X a zvýšili prodeje o 15 %.“* Budou žít vedle sebe – teorie (demo) a praxe (klient).

---

### 3. Informační architektura (IA) + SEO

Architektura musí být logická, mělká (max 2 kliky k cíli) a mapovat se na reálné hledané dotazy (search intent).

*   **`/` (Homepage)**
*   *H1 směr:* „Weby, data a automatizace, které vašemu byznysu uvolní ruce.“
    *  *Cíl:* Hub. Představit osobnost (jsem Radek), technologický přesah (nejsem jen kodér, vidím do byznysu) a rozcestník na hlavní 4 pilíře.
*   **`/tvorba-webu-a-eshopu`**
    **H1 směr:* „Tvorba rychlých webů a e-shopů na míru. Bez balastu.“
    *   *SEO Intent:* tvorba webu ceník, vývoj webových aplikací, programátor na volné noze.
    *   *Obsah:* Proč Astro, proč Cloudflare, zaměření na rychlost (Vitals) a konverzi.
*   **`/automatizace-procesu`**
    *   *H1 směr:* „Automatizace firemních procesů. Propojím to, co drhnete ručně.“
    *   *SEO Intent:* automatizace eshopu, napojení API, propojení systémů, optimalizace procesů.
    *   *Obsah:* Ukázky úspor času (faktury, maily, CRM). Konkrétní scénáře.
*   **`/ai-agenti-a-data`**
    *   *H1 směr:* „AI agenti a zpracování dat pro firmy.“
    *   *SEO Intent:* ai pro firmy, chatbot na web, implementace umělé inteligence, zpracování dat v pythonu.
*   *Obsah:* Vysvětlení, že AI nejsou jen hračky, ale nástroje pro support, klasifikaci dat a analýzu trhu.
*   **`/technicke-seo-a-optimalizace`**
*   *H1 směr:* „Technické SEO a zrychlení webu, které přinese zákazníky.“
    **SEO Intent:* technické seo, seo audit, zrychlení wordpressu, core web vitals optimalizace.
    *   *Obsah:* Ne sliby prvních pozic do týdne, ale tvrdá práce s daty, strukturou, rychlostí a architekturou.
*   **`/cenik`** (viz výše).
*   **`/zapisky` (Blog)** – Místo pro odborné články cílené na long-tail klíčová slova („Jak napojit Shoptet na Make“, „Proč je Astro lepší než WordPress pro firemní web“).

---

### 🚀 3 Nejsilnější „AHA“ mechaniky na konec (Co odliší RadeQ od běžného freelancera)

1.  **Asynchronní „Netlačící“ poptávka:** Místo formuláře, který křičí „Odešlete a já vám hned zavolám“ (čehož se B2B klienti děsí, nemají čas na hodinové calls), nabídněte: *„Poptávku mi můžete poslat textem, nebo mi na
atočte krátké video přes Loom / hlasovku s vaším problémem. Do 24 hodin se na to podívám a pošlu vám zpět video s mým pohledem a návrhem řešení. Žádné zbytečné schůzky, dokud nevíme, že si sedneme.“* To křičí moderní a ef
fektivní přístup.
2.  **Kalkulačka ROI u každé automatizace:** Na stránce Služeb u automatizace nebude jen text, ale interaktivní slider. Uživatel zadá: *„Tato činnost mi zabere [10] hodin týdně.“* a *„Hodina mého zaměstnance stojí [500] 
 Kč.“* Kalkulačka hned ukáže (díky Alpine.js/Astru): *„Tato agenda vás stojí 20 000 Kč měsíčně. Naše průměrná automatizace tohoto typu stojí 15 000 Kč. Zaplatí se vám za necelý měsíc a pak už jen šetří.“* Překlopíte konve
erzaci z „nákladu“ na „investici“.
3.  **Audit na vlastní kůži (The "Eat Your Own Dog Food" princip):** Na stránce o SEO a optimalizaci nebudete jen říkat, že umíte zrychlit web. Bude tam vložený reálný, klikatelný Lighthouse report přímo domény RadeQ.cz 
 se skóre 100/100/100/100 s textem: *„Nenabízím nic, co nemám zmáknuté u sebe doma. Tohle je aktuální výkon mého webu. Chcete stejný pro váš byznys?“*