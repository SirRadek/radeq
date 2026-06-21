Zde je konkrétní brainstorm a technický návrh refinementů pro signature hero animaci webu `radeq.cz`.---### 1. Storytelling (Diagnostika → Struktura → Řešení)
Aby animace nebyla jen „pohybem pro oko“, ale vyprávěla příběh racionálního testera a analytika, musíme jasně definovat stavy prvků:
*   **Vstupní chaos (0.0s – 0.6s):** 5 bodů představuje nesourodá testovací data nebo chyby v systému. Nejsou jen statické; jemně pulzují v tlumené šedé barvě s drobným offsetem (každý v jiném rytmu), což vyvolává pocit nestability/šumu.
*   **Diagnostika (0.6s – 2.2s):** Jakmile se začne vykreslovat hlavní vínová křivka (analytická stopa), body, kolem kterých křivka prochází, **„uskromní“ svou pozici (snapping)**. Pomocí CSS `transform: translate()` se přitáhnou na nejbližší souřadnici křivky a změní barvu ze šedé na tmavě vínovou. Tím dáváme najevo: *„Analýza dává chaosu řád.“*
*   **Lime Endpoint (2.2s):** Konec křivky nesmí být náhodný bod. Je to cíl – stabilní stav. V momentě, kdy křivka dorazí na konec, se kromě zvětšení lime kruhu vykreslí jemný nitkový kříž (tenké šedé osy X a Y protínající endpoint) a vedle něj se s drobným delayem objeví miniaturní mono-spaced popisek: `[SYS_OK: 100%]` nebo `[VAL_PASSED]`. To dodává okamžitý kontext IT instrumentace.---### 2. Vizuál (Technické parametry a usazení)
*   **Tvar křivky (Stabilizační křivka):** Zapomeňme na náhodné vlny. Křivka musí vypadat jako reálný graf tlumeného kmitání (tzv. *underdamped response*). Prudký náběh z levého dolního rohu nahoru, mírný překmit nad cílovou hodnotu, jedno malé zhoupnutí pod ni a následné dokonale lineární ustálení na horizontále zakončené lime endpointem. Tím vyjadřujeme proces stabilizace systému.
*   **Mřížka a kontrast:** Mřížka o hustotě 40px (pouze CSS `background-image: linear-gradient`) ve vínovém tónu s opacitou max. 4 %. Tím nekonkuruje textu.
*   **Mobilní chování (Responsivity & Contrast):** 
    *   Na desktopu je graf vpravo vedle textu (50/50).
    *   Na mobilu se graf posouvá **pod text** jako jemný podkres. Aby neutrpěl kontrast textu (Lighthouse přístupnost), celý kontejner grafu dostane na mobilech CSS pravidlo `opacity: 0.25` a ztratí interaktivní hover stavy. Text na popředí tak zůstává 100% čitelný.
*   **Barevný poměr:** 95 % tlumené tóny (vínová, břidlicová šedá, tmavé pozadí) a pouze 5 % lime (konec křivky, popisek stavu a běžící puls). Lime barva tak funguje jako skutečný maják (Call-to-Action).

---### 3. Choreografie pohybu (Timing & Loop)
Pohyb musí být klidný, aby neodváděl pozornost od čtení headline.
*   **Fáze 1 (0.0s – 0.4s):** Pozvolný fade-in mřížky (`opacity: 0 -> 0.04`).
*   **Fáze 2 (0.3s – 0.8s):** Postupný „pop“ (scale s mírným overshootem `cubic-bezier(0.34, 1.56, 0.64, 1)`) pěti chaotických bodů.
*   **Fáze 3 (0.6s – 2.2s):** Plynulé vykreslení křivky pomocí `stroke-dashoffset`. Jakmile čára mine daný bod, spustí se jeho přitažení (snapping).
*   **Fáze 4 (2.2s –2.5s):** Objevení lime endpointu a nitkového kříže.
*   **Fáze 5 (Idle Loop - nekonečná):** Graf „zamrzne“, aby nerušil. Jediným aktivním prvkem je **Lime puls** (malá svítící kapka), která projde po křivce (`offset-path`) **pouze jednou za 6 sekund**. Průchod trvá 1.5s (
(rychlý start, zpomalení v zatáčkách, splynutí s endpointem), zbylých 4.5s je vizuální ticho.

---

### 4. Scroll chování (Interaktivita bez JS)
Využijeme čisté CSS Scroll-Driven Animations s fallbackem:
*   **Puls navázaný na scroll:** Použitím `@supports (animation-timeline: view())` navážeme pohyb lime pulsu na scroll pozici viewportu. Když uživatel scrolluje dolů, puls se posouvá po křivce kupředu. Pokud se vrátí nah
horu, puls couvá.
*   **Jemný Parallax:** Celý graf (mřížka, křivka, body) se při scrollování posouvá o 10 % pomaleji než zbytek stránky (`transform: translateY(clamp(-30px, scrollY * -0.1, 30px))`). Tento omezený rozsah zabraňuje rozpadu
u layoutu.
*   **Re-trigger při návratu:** Pokud prohlížeč nepodporuje scroll-driven animations, animace se přehraje jednou při načtení a zůstane v idle stavu. Žádné cyklické spouštění celého intra při každém pohnutí myší.

---

### 5. „Instrumentace, ne ornament“ (Co UBRAT)
Abychom si udrželi důvěru konzervativního českého klienta, musíme ořezat jakýkoliv digitální balast:
*   **❌ UBRAT:** Žádný vnější zářící glow efekt (`filter: drop-shadow`) na křivkách. Na slabších mobilech to drasticky snižuje FPS a vypadá to levně („SaaS šablona“).
*   **❌ UBRAT:** Žádné animované šipky ukazující směr růstu grafu.
*   **❌ UBRAT:** Žádné rotující elementy na pozadí mřížky.
*   **❌ UBRAT:** Žádné psací stroje (typewriter efekt) u popisků. Text se prostě plynule zjeví.
*   **Omezení:** Všechny animace budou striktně postavené na `transform` a `opacity`. Žádné animování šířky/výšky nebo barev v reálném čase (redukce CPU/GPU zátěže pro garantovaný Lighthouse 90+).

---

### 6. Alternativní koncepty (Pokud by výchozí neseděl)

#### Varianta A: „Regression Line“ (Datová analýza a optimalizace)
*   **Koncept:** Na gridu je rozprostřeno 12 drobných šedých bodů (rozptyl chyb). Místo křivky se středem propíše dokonale rovná vínová přímka (lineární regrese). Při jejím protnutí se z každého bodu vykreslí tenká svisl
lá úsečka (odchylka) směrem k přímce. Tyto úsečky se následně animací smrští na nulu a body se srovnají přímo na přímku, která na konci zasvítí lime barvou.
*   **Kdy je lepší:** Pokud chce Radek zdůraznit exaktní optimalizaci kódu, výkonnostní testy (kde se snižuje rozptyl latence) a matematickou přesnost.

#### Varianta B: „Dependency Graph / Pipeline“ (CI/CD a QA Flow)
*   **Koncept:** Minimalistický větvený diagram (3 uzly vlevo, které se sbíhají do 1 hlavního testovacího uzlu uprostřed a ten pokračuje do lime „release“ endpointu vpravo). Animace ukazuje tok signálu přes tyto uzly. Po
okud uzel projde testem, změní se z vínové na lime.
*   **Kdy je lepší:** Pokud je hlavní Radkovou prodejní artikulací automatizované testování, stavba CI/CD pipelines a integrace systémů (ukazuje to proces „kód → test → nasazení“).

#### Varianta C: „Signal Reconstruction“ (Od šumu k čistotě)
*   **Koncept:** Graf začíná vlevo jako divoká, roztřesená zubatá čára (šum). V polovině dráhy prochází přes vertikální „filtrační“ osu (vínová linka) a z ní dál doprava už pokračuje jako dokonale vyhlazená, čistá sinuso
oida zakončená lime endpointem.
*   **Kdy je lepší:** Skvělé pro prezentaci debuggingu legacy systémů, refaktorování kódu a odstraňování bottlenecků (přeměna chaosu v hladký běh).

---

### Zhodnocení pro reduced-motion / no-JS
*   **CSS Fallback:** Pro uživatele s `@media (prefers-reduced-motion: reduce)` se animace zcela vypne. Zobrazí se rovnou finální stav: vykreslená křivka, přichycené body a statický lime endpoint bez pulsu.
*   **No-JS:** Vzhledem k tomu, že celá animace (včetně scroll-driven chování) je zapsatelná v čistém CSS, bude plně funkční i s vypnutým JavaScriptem.