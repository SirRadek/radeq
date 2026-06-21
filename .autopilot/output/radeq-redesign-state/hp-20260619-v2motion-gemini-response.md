Zde je můj nezávislý pohled na redesign RadeQ.cz z pozice UI/motion designéra. Cílem je najít „sweet spot“ mezi hravou dynamikou à la lepshee.com a důvěryhodností potřebnou pro B2B (živnostníci, SMB), a to vše v rámci Astro + Cloudflare bez kompromisů ve výkonu.Zde je konkrétní brainstorming rozdělený podle tvého zadání:## 1. Velikost textu / typografická škála: Odvaha bez ztráty serióznosti
Současný přístup je pravděpodobně příliš zdrženlivý a bezpečný. Konzervativní neznamená nudný.
*   **Hero H1:** Udělej z nadpisu vizuální dominantu celého viewportu (např. `text-6xl` až `text-8xl` na desktopu). Použij **Plus Jakarta Sans** v tučnějším řezu (ExtraBold), s velmi těsným řádkováním (leading-tight nebo leading-none) a jemným negativním trackingem (letter-spacing). Lepshee funguje proto, že písmo samo o sobě slouží jako grafika.
*   **Sekční nadpisy (H2):** Opět masivní, ale pro odlišení od Hero sekce je můžeš zarovnat asymetricky (např. velký nadpis vlevo, úzký blok textu vpravo).
*   **Čísla cen:** Udělej je obrovská a hravá. Cena jako hlavní vizuální prvek karty, u kterého uživatel podvědomě cítí hodnotu.
*   **SEO & Přístupnost:** Obalení obřích nadpisů do sémantických `<h1>` a `<h2>` Astro zvládá bez mrknutí oka. Dokud je text jako text (ne SVG/obrázek), vyhledávače budou nadšené.## 2. Barvy / kontrast: Jak přidat „šťávu“
Kombinace ivory + grafit + 5 % vínové je velmi „čistá“, ale může působit sterilně. Zvýšení vínové je cesta, ale musíme přidat hloubku.
*   **Tmavý „Statement“ blok:** Zhruba v polovině stránky (např. sekce „Co řeším“ nebo „Jak pracuji“) radikálně otoč kontrast. Zcela grafitové (nebo velmi tmavě vínové) pozadí s ivory textem. Tím uživatele vizuálně probudíš.
*   **Vínová na ~15 %:** Přesuň vínovou z pouhých tlačítek i do jemných podkresů, gradientních blobů na pozadí (velmi rozostřených), nebo do interaktivních hover stavů.
*   **Akcentní momenty (Druhý akcent):** Zvaž přidání tlumené, technické barvy – např. *šalvějové (sage green)* nebo *ledově modré* pro štítky (tags) a ikony úspěchu. Rozbije to monopol vínové a přidá testerům/analytikům potřebný element „vše funguje, zelená svítí“.

## 3. Velikosti a rytmus dlaždic: Smrt uniformním mřížkám
Zahoď klasický 3-column grid (karty naskládané jako vejce v platu).
*   **Bento Grid (Asymetrie):** Pro sekci „Co řeším“ vytvoř bento-box. Jedna obří karta (tvůj hlavní use-case), dvě menší vedle ní, pod tím jedna dlouhá široká karta. Oči milují prozkoumávání nestejnoměrných tvarů.
*   **Featured karta:** U „Služeb“ měj tu nejdůležitější službu (např. komplexní audit) výrazně větší, s tmavým pozadím (viz bod 2), zatímco ostatní služby obíhají jako menší světlé dlaždice.
*   **Odlomení okrajů:** Nech některé obrázky nebo ilustrace v dlaždicích „přetékat“ přes okraj karty (overflow-visible). To dává designu 3D hloubku a „živý“ pocit.## 4. Pohyb: 5–8 konkrétních motion momentů
Pohyb musí být *purposeful* (účelný), ne jen pro parádu. Vše realizovatelné via CSS/Framer Motion (v Astro izolované jako React/Preact island pouze tam, kde je potřeba).

1.  **Staggered Text Reveal (Hero):** Místo fade-inu ať slova v H1 „vyjedou“ odzdola nahoru, s mírným zpožděním za sebou (stagger). Udává to tempo čtení.
    *   *Náročnost:* Nízká. *Dopad:* Vysoký "premium" feel.
2.  **Magnetic CTA Buttons:** Primární tlačítka se při přiblížení kurzoru jemně „přitáhnou“ k myši.
    *   *Náročnost:* Střední (lehký JS). *Fallback:* Klasický CSS hover.
3.  **Hover Lift + Glow u Bento karet:** Při najetí myší se karta nepatrně zvedne (transform: translateY) a okraj získá velmi jemný vínový glow (box-shadow).
    *   *Náročnost:* Nízká (čisté CSS).
4.  **Infinite Marquee (Logo strip / Tagy):** Plynule běžící pás s technologiemi, které používáš, nebo jmény klientů. Zastaví se při hoveru.
    *   *Náročnost:* Nízká (čisté CSS `@keyframes`). *Výkon:* 100 %, akcelerováno GPU.
5.  **Count-up na číslech:** V sekci s ceníkem nebo metrikami neukazuj čísla hned. Až při do-scrollování naběhnou z 0 na finální hodnotu (např. počet odhalených chyb).
    *   *Náročnost:* Střední (malý JS IntersectionObserver).
6.  **Progressive Scroll Fill (Odrážky):** Jak uživatel scrolluje dlouhým seznamem (např. „Proces“), text odrážek postupně mění barvu z poloprůhledné na plně neprůhlednou (nebo z grafitu na vínovou).
    *   *Náročnost:* Střední.
7.  **Subtle Background Parallax:** Jemné, pomalé plavání abstraktních vínových tvarů v pozadí při rolování.
    *   *Zásadní omezení pro SMB:* Rychlost. Pokud by to ohrozilo FPS, rovnou vyřadit. Jinak v CSS přes `transform: translateZ`.

*Redukce pohybu:* U všeho bez výjimky použij `@media (prefers-reduced-motion)`. Pro výkon aplikuj vlastnost `will-change: transform` pouze lokálně, aby Lighthouse zůstal 90+.

## 5. Interaktivní hravý prvek (Signature moment)
Musí komunikovat tvoji hodnotu (Analytik/Tester dělá z chaosu pořádek). Zde jsou dva nápady na lehký Astro Island:

*   **Nápad A: „X-Ray / Lupa odhalující chyby“ (Nejlepší pro Lepshee wow efekt):**
    V Hero sekci nebo u Služeb máš statický blok kódu, wireframe, nebo zmatečný text. Uživatel myší pohybuje pomyslným kruhem (lupou / baterkou). Uvnitř kruhu se chaos vizuálně mění na úhledný, srovnaný a „zelený“ výsled
dek. Ukazuje to, že RadeQ posvítí na problémy a opraví je.
    *   *Tech:* CSS mask-image ovládané souřadnicemi myši v React/Preact islandu. Velmi lehké.

*   **Nápad B: „Přepínač chaosu“:**
    U služby testování je velký přepínač (Toggle). V poloze „Bez RadeQ“ dlaždice kolem vibrují, texty jsou lehce rozostřené, tlačítka uskakují. Po kliknutí na „S RadeQ“ vše hladce zaklapne do perfektního layoutu, objeví 
 se fajfky a barvy se uklidní. Osahej si svou přidanou hodnotu.

## 6. Rovnováha: Kde hravost pomáhá a kde by uškodila
SMB a B2B potřebují hlavně důvěru.
***KDE POMÁHÁ:** Hero sekce, navigace, představení služeb. Ukazuje to technologickou vyspělost, detail a to, že "neděláš weby v roce 2012".
*   **KDE ŠKODÍ (Mantinely):**
    1.  **Ceník a konverzní cesty (Formuláře):** Zde nula hravosti. Musí to být neprůstřelné, statické, absolutně přehledné. Zmatek nad ceníkem = ztráta klienta.
    2.  **Scrolljacking:** Nikdy neupravuj přirozenou rychlost nebo fyziku rolování myši/touchpadu. To starší byznysmeny extrémně irituje.
    3.  **Loading states:** Žádné pětivteřinové animace před načtením webu. Web musí naběhnout ihned, pohyb se děje až jako následná reakce.

---

## 🎯 TOP 5 změn pro 1. vlnu (Nejvyšší efekt / Nejnižší riziko)
Pokud bys měl zítra otevřít kód, udělej toto:

1.  **Zvětšit typografii (H1/H2) a utáhnout leading:** Čisté CSS. Výkon i SEO zůstávají na 100 %, vizuální dopad je okamžitý a masivní.
2.  **Přepracovat klasický grid na asymetrický Bento grid u sekce Služby/Řešení:** Změna layoutu (CSS Grid). Dodá to onen moderní "startup/appka" pocit.
3.  **Vytvořit jeden tmavý / inverzní blok uprostřed stránky:** Vizuální odpočinek a dramatický kontrast s minimem práce (změna barvy pozadí a textu v jednom kontejneru).
4.  **Přidat Magnetic Buttons a Hover Lifts na karty:** Oživení UI interakcí. Dává to pocit, že na uživatele web reaguje (pocit "drahého" webu).
5.  **Staggered Text Reveal v Hero sekci:** Lehké obohacení prvního dojmu, když uživatel načte stránku, oddělí tě to od statické konkurence.

To vše lze postavit nad aktuálním Astro stackem bez přidávání těžkých knihoven, s zachováním špičkového výkonu. Teprve do 2. vlny bych přidal složitější interaktivní signature prvky (Lupu / X-ray).