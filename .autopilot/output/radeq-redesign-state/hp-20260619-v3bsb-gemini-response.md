Tady je tvůj nezávislý motion/kreativní brainstorming. Přistupuji k tomu jako frontend architekt zaměřený na výkon: naším cílem je „prémiový pocit fyziky a matematiky“ (racionální digitalizace), který se opírá o GPU akceleraci a čistý prohlížečový render. Žádný moloch, jen chytrý kód.---# Brainstorm B: RadeQ.cz V3 – Architektura pohybu## 1. Inventář vhodných technik*   **CSS Transitions / Keyframes (`transform`, `opacity`):**
    *   *Kdy použít:* Mikrointerakce (hover, focus), jednoduché state-changes.
    *   *Výkon:* Absolutní špička (GPU compositor).
    *   *Fallback/Podpora:* Změna stavu bez přechodu / 100 %.
*   **CSS Scroll-driven Animations (`animation-timeline: view()`):**
    *   *Kdy použít:* Parallax, odkrývání sekcí, progress indikátory vázané striktně na scroll.
    *   *Výkon:* Extrémně vysoký (běží mimo hlavní vlákno).
    *   *Fallback/Podpora:* IntersectionObserver pro Chromium nepodporující prohlížeče (Safari, starší Firefox). JS přidá třídy pro klasický CSS transition reveal.
*   **Web Animations API (WAAPI):**
    *   *Kdy použít:* Komplexní sekvence (staggering), které by v CSS vyžadovaly hromadu zpoždění a těžko by se řídily, případně orchestrace pohybu na základě uživatelského vstupu.
    *   *Výkon:* Stejný jako CSS (využívá stejný engine pod kapotou), ale s kontrolou z JS.
*   **SVG (Stroke-draw, Morphing):**
    *   *Kdy použít:* Vykreslování „blueprint“ linek, ikon, loga.
    *   *Výkon:* Dobrý, ale běží na CPU (rasterizace). Pozor na morphing příliš složitých tvarů (vysoký počet uzlů = frame drop).
*   **Canvas 2D (Lehký):**
    *   *Kdy použít:* Generativní pozadí, interaktivní mřížky, částicové systémy s > 100 elementy (kde by DOM/SVG už krvácel).
    *   *Výkon:* Excelentní pro vykreslování mnoha objektů, pokud se držíš čisté matematiky bez složitého antialiasingu a stínování.
*   **CSS `@property` + animace proměnných:**
    *   *Kdy použít:* Hladké přechody přechodů (gradientů) např. na kartách služeb.## 2. Hero „Signature“ Animace (2–3 návrhy)

Cílem je prodat analytické myšlení („tester/architekt“) spojené s elegancí a energií (vínová/lime).

*   **Koncept A: Oživlý blueprint (SVG)**
    *   *Myšlenka:* Na pozadí nebo kolem nadpisu se ze šedé struktury (grafit) postupně vykresluje (stroke-draw) přesná technická linka. V momentě načtení prolítne linkou signál (lime/vínová barva jako `stroke-dashoffset
t` animace), který "nastartuje" web.
    *   *Výkon:* Velmi lehký (animace dasharray/dashoffset). ~0 fps drop.
*   **Koncept B: Racionální mřížka (Canvas 2D)**
    *   *Myšlenka:* Canvas pozadí s velmi jemnou tečkovanou mřížkou (intersekce bodů). Při pohybu myší se tečky v okolí kurzoru jemně matematicky prohnou/zvětší a probarví do lime barvy (simulace datového uzlu).
    *   *Výkon:* Zanedbatelný, pokud počítáme vzdálenost (Pythagorova věta) jen pro tečky v okruhu kurzoru. ~60 fps stabilně i ve 4K (vykreslují se jen malé `fillRect` nebo `arc`).
*   **Koncept C: Typografický "Dekódovací" Reveal**
    *   *Myšlenka:* Nadpis (Plus Jakarta) nefade-inuje obyčejně, ale písmena proběhnou rychlým cyklem "šumu/kódu" (0101 -> náhodné znaky -> finální znak), než se usadí, s jemným pohybem nahoru.
    *   *Výkon:* Vysoký, běží jednorázově na začátku přes JS nebo WAAPI s malým počtem DOM uzlů.

## 3. Mikrointerakce: Prémiovost vs. Lacinost

*   **Zlatý standard (Prémiové):**
    *   *Magnetic CTA:* Tlačítko (a případně i jeho vnitřní text) jemně následuje kurzor (s omezeným radiusem a pružinou). Působí hmatatelně.
    *   *Directional Underline:* Podtržení odkazů, které se vykreslí ze strany, ze které kurzor přijel, a zmizí tam, kam kurzor odjel.
    *   *Subtle Lift & Tilt:* Karty v diagnostickém panelu se při najetí lehce zvednou (transform: translateY) a vrhnou ostřejší stín, případně se velmi jemně natočí za myší (3D tilt max 2-3 stupně).
*   **Laciné (Vyhnout se):**
*   Přeplácané "Glow" efekty, které dýchají (pulse) neustále dokola (ruší při čtení, žerou baterii).
    *   Rubber-band efekty na tlačítkách (působí dětsky, ne analyticky).
    *   Všechno, co nemá fyzikální opodstatnění.

## 4. Pozadí / Atmosféra

*   **Grain (Zrnitost):** Generovaný statický šum přes SVG `<feTurbulence>` aplikovaný jako fixní `background-image` s nízkou opacitou na `:before` elementu s `pointer-events: none`. Neanimovat ho! Statický šum dodá text
turu, oko si pohyb domyslí, ale ušetříš 100 % CPU cyklů potřebných pro animaci šumu.
*   **Gradient Shift:** Pro jemný posun stínů/světel použij velký rozmazaný `div` (přes CSS `filter: blur`) s barvou (např. velmi tmavá vínová), který se animuje pouze přes `transform: translate()` nebo `rotate()`. Tím s
se vyhneš animaci `background-position`, která na 4K displejích způsobuje brutální repaints a zabíjí fps.

## 5. Scroll-driven momenty

*   **Sekční prolnutí:** Místo tvrdých čar použít CSS `animation-timeline: view()` k plynulému ztmavnutí/zesvětlení pozadí (`background-color`), když hero sekce opouští viewport a "Problem wall" (tmavá sekce) přichází.
*   **Blueprint Draw:** Jak scrolluješ sekcí "Jak pracuji", SVG linka se přirozeně vykresluje dopředu a maže dozadu (přesně vázáno na procento scrollu).
*   **Fallback:** Uživatelé bez podpory (nebo s `prefers-reduced-motion`) uvidí sekce rovnou se správným pozadím a blueprint linku celou vykreslenou.

## 6. „Negenerovat, naprogramovat“ (Workflow)

Jak použít vygenerovanou referenci bez použití těžkého videa/GIFu:
1. Vygeneruješ (např. v Midjourney/DALL-E) abstraktní "lime/vínový wireframe tvar".
2. Vezmeš obrázek, protáhneš ho vektorizátorem nebo obkreslíš hlavní křivky ve Figmě do SVG cesty.
3. Výsledný SVG kód (desítky bajtů) vložíš do HTML.
4. Přes CSS nebo WAAPI mu nadefinuješ `stroke-dasharray` a necháš ten "výsledný pocit" z obrázku ožít čistým kódem. Výsledek? Značka RadeQ má originální grafiku, ale stránka se stáhne za 20 milisekund a je ostrá jako bři
itva na každém DPI.

## 7. Mantinely výkonu (Strict No-Go)

*   **Layout Thrashing:** NIKDY neanimovat vlastnosti, které mění geometrii stránky (`width`, `height`, `margin`, `padding`, `top`, `left`). Vždy používat `transform` (`translate`, `scale`) a `opacity`.
*   **Box-shadow animace:** Animovat velký rozmazaný `box-shadow` nebo `filter: drop-shadow` je drahé. Místo toho animuj `opacity` pseudo-elementu, který už statický stín má.
*   **Scrolljacking:** Žádné přepisování nativního chování scrollbaru.
*   **Měření:** V Chrome DevTools -> Rendering -> zapnout "Paint flashing" (musí zůstat tmavé, nesmí to blikat při běžném pohybu/scrollu, s výjimkou scrollbaru).

---

## 🏆 TOP 5 Doporučených animací (První vlna)

Pro nejvyšší poměr prémiového efektu / nulové penalizace Lighthouse skóre:

1.  **Magnetic CTA tlačítka:** Relativně jednoduchá matematika, absolutně mění dojem z interakce s webem směrem k high-end pocitu.
2.  **Scroll-Driven Blueprint Draw (SVG):** Vykreslování linky "Jak pracuji" podle scrollu. Bez JS na moderních prohlížečích, čisté a vizuálně chytlavé.
3.  **Dekódovací Hero Typography:** Drobný detail při načtení, který okamžitě nastavuje tón "racionální/tech" brandu bez jakékoliv zátěže po skončení animace.
4.  **Directional Underline (Odkazy v textu/menu):** Extrémně lehký CSS efekt, který ukazuje smysl pro detail.
5.  **Subtle Gradient Drift (Pozadí):** Jeden obří rozmazaný flek (lime nebo vínový v tmavé sekci), který se nepozorovaně a velmi pomalu pohybuje (`transform: translate`) v pozadí, dodává "hloubku" a život statickému gra
afitu.