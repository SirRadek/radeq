Tady je tvůj "reality check". Jako tvůj seniorní ředitel ti tenhle koncept teď s láskou, ale tvrdě rozbiju na kusy, protože mým cílem je, abys za měsíc nespustil překombinované monstrum, které tě sežere na údržbě a odradí ti přesně ty klienty, kteří mají peníze. Koncept má geniální jádro (překladatel, transparentnost, důkaz řemesla), ale obalils ho hrozným množstvím pozlátka, které hrozí, že potopí loď hned v přístavu.Tady je rozbor:### 1. Rozsah vs. realita jednoho člověka (Brutální overkill)
**Kritika:** 5 živých dem a nativní AI agent je pro *v1 jednočlenného studia* naprostá sebevražda. Nejde o to to postavit (to zvládneš), jde o to to **udržovat**. Až Cloudflare změní API Vectorize, až se ti do AI agenta pustí boti, nebo až Astro vydá breaking change, budeš místo klientské (placené) práce ladit svůj vlastní osobní web. Datový filtr nad 5k záznamy je navíc z kontextu osobního portfolia vytržený (proč by tam ta data vůbec byla?).
**Řešení:** V1 snese **maximálně 1 až 2 živé ukázky**. 
**Co vyhodit do v2:** AI agenta (absolutně, sežere ti čas na prompt engineeringu a obraně proti zneužití), Datový filtr, Diagnostický widget v patičce (zajímavé pro tebe, klientovi to nic neřekne).### 2. Přepínač Zákazník/Inženýr (Geniální USP, ale obrovská past)
**Kritika:** Pokud to bude *globální* přepínač, který mění celou stránku, je to UX a SEO noční můra. Znamená to udržovat dva weby v jednom. Navíc hrozí riziko arogance – konzervativní klient si může připadat hloupě ("tady je pohled pro normální lidi a tady pro chytré"). Z pohledu SEO budeš buď kanibalizovat obsah, nebo mít divoké layout shifty.
**Řešení:** Nedělej z toho globální stav webu. Udělej z toho **kontextuální rentgen („Ukaž pod kapotu“)** u konkrétních služeb/komponent. Např. klient čte o automatizaci objednávek. Vidí hezkou byznys value. V rohu je toggle *„Jak to funguje technicky“*. Po kliknutí se blok plynule přetočí a ukáže schéma architektury (Cloudflare Worker -> API -> DB) nebo ukázku čistého kódu ve vínovém syntax highlightingu. Takhle udržíš jedno DOM flow, jedno SEO a nerozbijes IA.### 3. Konverze pro konzervativní SMB (Riziko odstrašení)
**Kritika:** Asynchronní poptávka formou "hlasovky nebo Loomu" je pro SMB (majitel e-shopu, lokální výrobní firma) absolutní *red flag*. Oni nemají čas se natáčet. Chtějí ti napsat mail nebo zavolat. Pokud na ně vybafneš moc "tech" startupových mechanik, utečou k tradičnější (i když horší) agentuře, protože u tebe budou mít pocit, že se s nimi nechceš bavit normálně.
**Největší riziko:** Web bude působit jako hřiště pro vývojáře, nikoliv jako bezpečný přístav pro byznys, který krvácí peníze na špatných procesech.
**Řešení:** Asynchronní Loom poptávku nech jako *alternativní/cool* možnost, ale primární CTA musí být naprosto blbuvzdorné: "Napište mi, co vás pálí" (klasický formulář/mail) nebo "Rezervujte si 15 min hovor" (Calendly).### 4. SEO/výkon (Souboj ega s Core Web Vitals)
**Kritika:** Chceš mít "eat your own dogfood" Lighthouse 100/100, ale zároveň tam chceš narvat 5 interaktivních widgetů a AI agenta. To ti rozbije TBT (Total Blocking Time) a LCP (váha JS bundle). 
**Mitigace:** Astro Islands (Partial Hydration) je tu tvůj zachránce. Všechna dema/rentgeny se musí načítat s `client:visible` (až když k nim uživatel doscrolluje). Inženýrské pohledy nesmí stahovat JS pro syntax highlig
ghting dopředu. Z pohledu SEO musí být text v inženýrském pohledu normálně v DOMu (třeba přes `<details>` tag nebo CSS schovávání), aby ho Google viděl a indexoval, ale aby nenačítal zbytečný bloat.

### 5. Vínová barva (Dávkování prémiovosti)
**Kritika:** Vínová (burgundy) je extrémně silná. Pokud inženýrský pohled znamená, že se celý web ponoří do temně vínové nebo černé s vínovými pruhy, bude to vypadat jako herní doupě, ne jako B2B konzultant.
**Řešení:** Dodržuj striktní proporce. Báze 80 % (slonová kost/písek, působí to čistě, otevřeně, důvěryhodně), 15 % text a struktura (velmi tmavě šedá/grafit), **5 % vínová**. Vínová ať je vyhrazena **pouze** pro: hlavní
í CTA tlačítka, hover efekty, a "lasery" – tj. když uživatel zapne "rentgen", objeví se vínové propojovací linky ve schématu nebo vínový kurzor. Vínová je koření, ne hlavní chod.

### 6. Ta JEDNA věc s nejvyšším pákovým efektem
**Kalkulačka ROI + Před/Po architektura.** 
To je tvoje zabijácké kombo. Když návštěvník uvidí: *„Takhle vypadá chaos (váš současný stav), takhle vypadá čisté řešení ode mě (schéma) a tady si zadejte, kolik hodin měsíčně tím pálíte -> ušetřím vám 30 000 Kč měsíčně
ě.“* Tím získáš klienta. To je dokonalý průsečík tvého positioning ("analytik") a byznys hodnoty.

**3 věci, které bez lítosti z v1 vyhodit:**
1. AI agenta (žrout času, prodejní hodnotu to teď nepřinese).
2. Globální přepínač Zákazník/Inženýr (nahradit lokálními odkrývacími "rentgeny" u služeb).
3. Hlasové/Video poptávky jako primární (nebo dokonce jedinou) cestu kontaktu.

---

### Závěr: Architektura doručení

#### 🏆 DOPORUČENÉ V1 MINIMUM (Silné, ne osekané)
*   **Design:** Slonová kost + čistá typografie + vínové akcenty.
*   **Obsah (SEO struktura z tvého konceptu platí):** Homepage rozcestník + 4 jasné služby + veřejný Ceník (tohle je obrovská výhoda oproti konkurenci!) + O mně / Přístup.
*   **USP(The "Motor"):** Lokální "Ukaž pod kapotu" tlačítka u služeb. Ukážou jednoduché schéma architektury, jak to řešíš (např. Cloudflare Workers + API napojení). 
*   **Interaktivita:** ROI Kalkulačka automatizací. Běží na hraně (Astro komponenta), rychlá, vizuální, ukazuje okamžitý byznys dopad.
*   **Konverze:** Klasický poptávkový form, mail, možnost Calendly. Jasná nabídka auditu jako quick-win.
*   **Výkon:** Astro SSG, nulový zbytečný JS, tvrdých 100/100 na PageSpeed Insights (což můžeš hrdě linkovat z patičky).

#### 🧊 V2 BACKLOG (Až web začne vydělávat)
*   AI Vectorize Agent napojený na tvé články/případovky.
*   Interaktivní živý pohled na metriky tvého webu (ten performance widget).
*   Možnost asynchronní Loom poptávky zabudované přímo do flow.
*   Ukázka napojení na D1 (např. reálný dashboard tvých vlastních statistik).

Postav V1. Získej první dva klienty. V2 postavíš za peníze z jejich faktur. Jdeme na to?