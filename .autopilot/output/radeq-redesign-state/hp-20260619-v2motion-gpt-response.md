Použité rámce: Decision Mesh pro UX routing nenašel stop condition; beru to jako textový brainstorm bez implementace. Lepshee jsem bral jako inspirační referenci: velký hero claim, loader, výrazné sekce služeb, hravější tón a silný proof blok. Zdroj: https://lepshee.com/

**Nezávislý pohled**
V1 zní důvěryhodně, ale až moc „tiše“. Pro RadeQ bych nešel do čistě kreativního studia jako Lepshee. RadeQ není „showman agentura“, ale analytik/tester, který umí z chaosu udělat funkční systém. Hravost tedy musí být přesná, diagnostická, trochu technická: pohyb jako důkaz přemýšlení, ne dekorace.

Směr: **živý pracovní stůl analytika**. Velká typografie, tmavé statement bloky, interaktivní diagnostické prvky, asymetrické dlaždice, ale pořád rychlé HTML, čitelný obsah a jasná CTA.

**1. Typografie**
Ano, současná typografie je pravděpodobně moc krotká. Plus Jakarta Sans + Inter může zůstat, ale musí dostat výraznější měřítko.

Navržená škála:

- Body: `17–18 px`, line-height `1.55`
- Menší UI text/eyebrow: `12–13 px`, mono, uppercase, širší tracking
- H3/karty: `22–28 px`
- H2 sekce: `clamp(42px, 7vw, 92px)`, velmi krátké nadpisy
- Hero H1: `clamp(56px, 10vw, 132px)`, line-height `0.9–1.0`
- Velká čísla cen: `clamp(48px, 8vw, 104px)`

Důležité: H1/H2 zůstanou reálný text, ne canvas. SEO neutrpí. Dramatizace by měla být hlavně v hierarchii: například hero ne „Racionální digitalizace pro malé firmy“, ale rozbitý display:

```text
Racionální
digitalizace.
Bez divadla.
```

Pod tím normální, velmi čitelný odstavec pro SMB. Tím se oddělí emoční první dojem od praktického vysvětlení.

**2. Barvy / Kontrast**
Jeden konkrétní směr: **ivory + grafit + hluboká vínová + ostrý signální lime/žlutozelený mikroakcent**.

- Ivory zůstává jako důvěryhodná základna.
- Grafit posílit skoro do černé pro statement bloky.
- Vínovou zvednout z 5 % na cca 10–12 %, ale ne všude. CTA, ceny, aktivní stavy, klíčové linky.
- Přidat druhý akcent jen pro „diagnostiku“: limetkově žlutá/zelená, velmi střídmě. Například stav „nalezen problém“, aktivní bod v blueprintu, malý cursor dot, highlight v interaktivním demu.
- Jedna až dvě tmavé sekce přes celou šířku: hero konec / proof / „Jak pracuju“. Ne celý dark mode.

Kontrastní moment: po světlém hero přijde tmavý blok „Co se typicky pokazí“ s velkou typografií a živým diagnostickým prvkem. To dodá šťávu bez toho, aby celý web působil jako startupová diskotéka.

**3. Dlaždice a rytmus**
Uniformní mřížky jsou největší brzda živosti. Ne všechno musí být bento, ale některé sekce si o asymetrii říkají.

Kde bych změnil rytmus:

- **Co řeším:** místo 6 stejných karet udělat „problem wall“. Jedna velká featured dlaždice přes 2 sloupce: „Web nevydělává, jen existuje“. Vedle menší rychlé symptomy.
- **Služby:** ne 5 karet stejné váhy, ale diagonální/step layout: Audit → návrh → implementace → testování → provoz. Vizuálně jako pracovní pipeline.
- **Ceny:** zvýraznit doporučenou střední variantu výrazně větší typografií a mírným posunem nahoru. Ne přehnané SaaS „Most popular“, spíš „Nejčastější začátek“.
- **Ukázky:** jedna velká interaktivní case dlaždice, dvě menší podpůrné. Uživatel má hned cítit, že jedna věc je hlavní.

**4. Motion momenty**
| Moment | Kde | Efekt | Náročnost | Reduced motion | Výkon |
|---|---|---|---:|---|---|
| Hero text reveal | Hero | Slova přijedou po řádcích, lehký stagger, bez blur přehánění | nízká | text rovnou viditelný | CSS transform/opacity |
| Magnetická CTA | Hero + bottom CTA | CTA jemně reaguje na kurzor, šipka ujede doprava | střední | statický hover | malý JS island |
| Diagnostic cursor dot | Hero / demo | Malý vínový/lime bod sleduje interaktivní oblast, ne celý web | střední | vypnout | requestAnimationFrame jen v islandu |
| Scroll stagger karet | služby/problémy | Karty vstupují v nepravidelném rytmu, ne všechny stejně | nízká | bez animace | IntersectionObserver |
| Marquee symptomů | mezi sekcemi | Pomalý textový pás: „pomalý web / nejasné CTA / ruční Excel…“ | nízká | zastavený seznam | CSS, žádné obrázky |
| Count-up u čísel | proof/ceny | Čísla jemně doběhnou při vstupu | nízká | finální hodnota | malý JS |
| Blueprint line draw | „Jak pracuju“ | SVG čára propojuje kroky auditu/testu | střední | statická linka | SVG stroke, lehké |
| Section snap contrast | přechody | Světlá → tmavá sekce s textem, který se „přepne“ kontrastem | nízká | bez pohybu | CSS |

Lighthouse 90+ je realistické, pokud se nebude tahat GSAP pro všechno. Doporučení: CSS + IntersectionObserver + 1–2 Astro Islands `client:visible`. Žádné video backgroundy, žádné velké particle canvas, žádná animace layoutových vlastností.

**5. Signature interakce**
První návrh: **„Diagnostický panel: od problému k řešení“**

V hero nebo hned pod ním je velká interaktivní dlaždice. Vlevo jsou 3–4 běžné problémy:

- „Lidi píšou, ale nekupují“
- „Web je pomalý“
- „Nevím, co měřit“
- „Všechno řeším ručně“

Po hoveru/kliknutí se vpravo přepne jednoduchý výstup: „pravděpodobná příčina“, „co ověřím“, „první praktický krok“. Je to hravé, ale přímo podporuje positioning analytik/tester. Funguje i bez JS jako statické bloky.

Druhý návrh: **„Blueprint Q“**

Ocásek Q z loga se stane linkou, která při scrollu kreslí cestu přes 3 kroky: Najít → Zjednodušit → Otestovat. Může to být SVG v sekci „Jak pracuju“. Zapamatovatelné, brandové, lehké. Ne jako dekorace, ale jako vizuální metafora procesu.

**6. Rovnováha**
Kde hravost pomáhá:

- Hero: ukáže, že studio není zatuhlý dodavatel šablon.
- Diagnostické části: interakce vysvětluje hodnotu služby rychleji než odstavec.
- Proof/case studies: jemný motion zvýší důvěru, pokud zvýrazní konkrétní výsledek.

Kde by škodila:

- Ceník: žádné přeskakující ceny, rotující kartičky, schované podmínky. Tady má být klid.
- Kontakt/formulář: co nejméně efektů, okamžitá srozumitelnost.
- Dlouhé SEO texty: animovat jen vstup sekce, ne každý řádek.

Mantinely:

- Max 2 signature efekty na homepage.
- Každá animace musí mít statický ekvivalent.
- Interaktivita nesmí skrývat hlavní SEO obsah ani CTA.

**TOP 5 první vlna**
1. Zvětšit hero a H2 škálu: největší vizuální dopad, nízké riziko.
2. Přidat jeden tmavý statement blok s velkým textem: okamžitý kontrast a „V2“ pocit.
3. Přestavět „Co řeším“ z uniformní mřížky na asymetrický problem wall.
4. Přidat diagnostickou interaktivní dlaždici jako signature moment.
5. Zavést jednotný motion systém: reveal, hover, marquee, count-up, blueprint line, vše s reduced-motion fallbackem.