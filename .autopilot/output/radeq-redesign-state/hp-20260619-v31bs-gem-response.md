I will list my available permissions to understand the workspace structure and make sure I comply with all rules and customization files.
I will list the contents of the workspace directory `C:\Programování\Codex` to locate any relevant codebase files and project configs.
I will view `AGENTS.md` to check the details of the Autopilot Decision Mesh rules and understand if there are specific requirements for this task.
I will list the contents of the `src` directory to see what components, pages, or layouts already exist in the website repository.
I will list the contents of the `src/pages` directory to see what pages are present in this Astro project.
I will list the contents of the `src/data` directory to see what data files define the content or structure of the website.
I will list the contents of the `product-design-os` directory to see if there are any specific guidelines, templates, or rules for frontend/UX design that I should apply to this brainstorm.
I will view `product-design-os/README.md` to check the design system guidelines and rules.
I will list the contents of the `docs` directory to see if there are any specific files, specifications, or documents detailing the radeq project.
I will list the contents of the `docs/projects` directory to check if there is a directory for RadeQ or a related project.
I will list the contents of the `docs/projects/radeq` directory to see what documentation exists for this website project.
I will view the `docs/projects/radeq/architecture.md` file to understand the architecture, stack, existing decisions, and project-specific guidelines for RadeQ.
I will search for "marquee" in the project codebase using `grep_search` to see if there's an existing marquee implementation.
I will search for the word "Rozbor" in `src` using `grep_search` to see where the duplicate "Rozbor" flag resides.
I will search for the word "Rozbor" across the entire workspace to locate any occurrences.
I will list the contents of `C:\Programování\Codex\output\radeq-redesign-state` to see the existing brainstorm/redesign files.
I will view the `hp-20260619-v31bs-prompt.md` file using `view_file` to see the details of the prompt.
I will view `hp-20260619-v3bsa-gemini-response.md` using `view_file` to see the previously generated suggestions and ensure this brainstorm remains independent, sharp, and highly specific.
I will view the `hp-20260619-v31bs-gpt-response.md` file using `view_file` to review the other model's output for V3.1. This allows me to provide an independent, critical, and highly specific critique or alternative set of solutions that are truly optimal and concrete for the client.
I will view the next lines of the `hp-20260619-v31bs-gpt-response.md` file to see how the other questions were answered (sections 3, 4, 5, and the copywriting and animation parts).
I will view the contents of the `hp-20260619-v31bs-gpt-response.md` file from lines 100 to 454 to see the full content of the other model's draft.
Zde je nezávislý a technicky konkrétní brainstorm pro verzi **RadeQ.cz V3.1** připravený s ohledem na specifika české cílové skupiny (konzervativní živnostníci, malé firmy, spolky). ---## ČÁST 1 — Nejlepší řešení 5 vad### 1. Marquee (pás symptomů) bez skoku
*   **Proč dochází ke skoku:** Změna `animation-duration` na `:hover` v CSS přiměje prohlížeč přepočítat celou časovou osu animace vůči novému trvání. Protože se interní fáze (procento dokončení) přepočítává za běhu, poz
zice okamžitě skočí.
*   **Řešení (JS rAF Interpolace +IntersectionObserver):** 
    Pro plynulé zpomalení bez skoku řídíme posun programově pomocí `requestAnimationFrame` a lineární interpolace (lerp) rychlosti. Animace se vypne, pokud je prvek mimo viewport, což šetří CPU.
*   **Identické mezery a oddělovače:**
    Aby byl přechod mezi duplikovaným a původním obsahem pixelově dokonalý, nepoužíváme `gap` na flexboxu (prohlížeče občas špatně zaokrouhlují šířku mezer při zoomu). Místo toho má každý prvek i tečka pevný horizontální
í padding. Tečka (`•`) musí být součástí každé položky jako její přirozený konec.

#### HTML struktura:
```html
<div class="rq-marquee" data-marquee>
  <div class="rq-marquee__track" data-marquee-track>
    <div class="rq-marquee__group" data-marquee-group>
      <span class="rq-marquee__item">Účetní chaos</span><span class="rq-marquee__sep">•</span>
      <span class="rq-marquee__item">Pomalý web</span><span class="rq-marquee__sep">•</span>
      <span class="rq-marquee__item">Složitá administrace</span><span class="rq-marquee__sep">•</span>
    </div>
    <!-- Identický duplikát pro seamless efekt -->
    <div class="rq-marquee__group" aria-hidden="true">
      <span class="rq-marquee__item">Účetní chaos</span><span class="rq-marquee__sep">•</span>
      <span class="rq-marquee__item">Pomalý web</span><span class="rq-marquee__sep">•</span>
      <span class="rq-marquee__item">Složitá administrace</span><span class="rq-marquee__sep">•</span>
    </div>
  </div>
</div>
```

#### CSS:
```css
.rq-marquee {
  overflow: hidden;
  width: 100%;
}
.rq-marquee__track {
display: flex;
  width: max-content;
  will-change: transform;
}
.rq-marquee__group {
  display: flex;
  align-items: center;
}
.rq-marquee__item {
  padding: 0 1.5rem; /* Přesně definovaný prostor */
  white-space: nowrap;
}
.rq-marquee__sep {
  color: var(--rq-lime, #c7e04a);
  user-select: none;
}
```

#### JS Implementace:
```javascript
const track = document.querySelector('[data-marquee-track]');
const group = document.querySelector('[data-marquee-group]');

let x = 0;
let currentSpeed = 1.2; // Rychlost v pixelech na snímek
let targetSpeed = 1.2;
let isIntersecting = false;

// Aktivace pouze ve viewportu
const observer = new IntersectionObserver(([entry]) => {
  isIntersecting = entry.isIntersecting;
  if (isIntersecting) requestAnimationFrame(tick);
});
observer.observe(track);

track.addEventListener('mouseenter', () => targetSpeed = 0.2); // Zpomalení
track.addEventListener('mouseleave', () => targetSpeed = 1.2); // Návrat k normálu

function tick() {
  if (!isIntersecting) return;

  // Hladký lerp rychlosti
  currentSpeed += (targetSpeed - currentSpeed) * 0.08;
  const limit = group.offsetWidth;

  x += currentSpeed;
  if (x >= limit) {
    x -= limit; // Bezchybný reset na začátekduplicitního tracku
  }

  track.style.transform = `translate3d(${-x}px, 0, 0)`;
  requestAnimationFrame(tick);
}
```
*   **CSS-only Fallback (No-JS):** Pokud selže JS, marquee se pohybuje standardní CSS animací a na hover se pouze zastaví pomocí `animation-play-state: paused;` (což je nativní vlastnost, která neskáče).

---

### 2. Full-bleed pozadí sekce
*   **Technika breakout:** Použití `width: 100vw; margin-inline: calc(50% - 50vw);` funguje, ale na systémech s klasickým scrollbarem (Windows/Chrome) generuje nechtěný horizontální scrollbar o šířce ~15px a následný lay
yout shift.
*   **Doporučení:**
    1.  **Strukturální přístup (Nejčistší):** Vyhněte se breakout technice v CSS. Obalte každou sekci vnějším wrapperem, který má plnou šířku (`width: 100%`) a pozadí, a teprve do něj vložte centrovaný kontejner.
        ```html
        <section class="rq-section-diagnostics bg-graphite"> <!-- Pozadí přes celou šířku -->
 <div class="max-w-7xl mx-auto px-4 md:px-8"> <!-- Omezený obsah -->
          <!-- Obsah sekce -->
          </div>
        </section>
   ```
    2.  **CSS Fix s `overflow-x: clip`:** Pokud musíte z důvodu layoutu použít breakout, nastavte na `html, body` pravidlo:
        ```css
        html, body {
 overflow-x: clip;
        }
        ```
        *Pozor:* Použijte zásadně `clip`, nikoliv `hidden`. Vlastnost `overflow-x: hidden` ničí funkčnost `position: sticky` u všech potomků, zatímco modernější `overflow-x: clip` ji zachovává.

---

### 3. Duplicitní„Rozbor“ flag
*   **Řešení:** Flag ponechat výhradně v **output tabuli** (výstupní kartě).
*   **Zdůvodnění:** Tab v navigaci / přepínači už sám o sobě funguje jako popisek stavu (např. „Rozbor webu“). Pokud vedle něj svítí stejný štítek „Rozbor“, jedná se o vizuální redundanci. V output tabuli má flag smysl, 
 protože slouží jakoformální označení typu dokumentu/výstupu (metadata). Odstraněním z tabů snížíme kognitivní zátěž a zjednodušíme navigaci.

---

### 4. Edge-fade (rozmazání na okrajích) přes celou stránku
*   **Doporučená varianta:** Dva fixně umístěné pruhy s gradientem na pozadí, umístěné na začátek a konec viewportu, kryjící rolovací obsah.
*   **Proč ne blur:** Vlastnost `backdrop-filter: blur()` je extrémně náročná na procesor a GPU při každém posunu stránky (vyvolává neustálé překreslování). Gradient je levný a spolehlivý.
*   **pointer-events:** Musí být nastaveno `pointer-events: none`, aby bylo možné klikat na odkazy a prvky, které se pod gradient právě zasunuly.

#### CSS:
```css
.rq-viewport-fade {
  position: fixed;
  left: 0;
  right:0;
  pointer-events: none;
  z-index: 40;
  height: 32px;
}
.rq-viewport-fade--top {
  top: var(--rq-header-height, 72px); /* Těsně pod fixním headerem */
  background: linear-gradient(to bottom, var(--rq-bg-ivory, #f7f4ee), transparent);
}
.rq-viewport-fade--bottom {
  bottom: 0;
  background: linear-gradient(to top, var(--rq-bg-ivory, #f7f4ee), transparent);
}
```

---

### 5. Karty služeb a odkazování na `#kontakt`
*   **Doporučení:** Karty služeb udělejte **neklikací**.
*   **Zdůvodnění:** Pro konzervativní cílovou skupinu (malé firmy, živnostníci) je matoucí a frustrující, když kliknou na službu v očekávání detailních informací a web je přesměruje rovnou na kontaktní formulář. Působí t
to jako agresivní marketingová past.
*   **UX struktura:**
    1.  Karty slouží jako čistě strukturovaný informační přehled.
    2.  Pokud chcete nabídnout detail, vložte na konec každé karty nenápadný odkaz: *„Ukázat vzorový výstup (PDF)“* nebo *„Zobrazit ukázku rozboru“*.
    3.  Pod celý grid karet umístěte jedno výrazné, klidné a transparentní CTA tlačítko: *„Chci nezávazně zkonzultovat můj web“* odkazující na `#kontakt`.

---

## ČÁST 2 — Textace

Cílem je odstranit marketingový balast („digitální transformace“, „inovativní řešení“) a nahradit ho věcným jazykem, který mluví přímo k podnikateli.

### Hero sekce
> **Stávající/běžný styl:** Vytváříme moderní weby s pokročilou optimalizací a digitální strategií pro váš úspěch.
>
> **Nový návrh:**
> # Web a texty, které vaši zákazníci pochopí za 10 sekund
> Stavím a opravuji prezentace pro řemeslníky, malé firmy a spolky. Bez složitých pojmů a prázdných slibů.
>
> *CTA tlačítko:* [Chci rozbor stávajícího webu] [Prohlédnout služby]

---

### Problem wall (Zeď problémů)
Místo abstraktních frází popíšeme situace, které majitelé firem reálně zažívají:
> *   Lidé z vašeho webu odcházejí, protože do 10 sekund nezjistí, co přesně nabízíte.
> *   Nabídka služeb je popsaná odborným žargonem, kterému rozumíte jen vy, ne váš zákazník.
> *   Web sice vypadá hezky, ale nikdo z něj neposílá poptávky ani nevolá.
> *   Telefonní číslo, e-mail a ceník jsou schované hluboko v textu.

---

### Služby (Formát: Název + 1 Výsledek + 3 Výstupy)

#### 1. Rozbor webu
*   **Výsledek:** Přesně víte, proč lidé z vašeho webu odcházejí bez objednávky.
*   **Výstupy:**
    *   Audit použitelnosti (PDF): Seznam 5 největších chyb, které na vašem webu brzdí poptávky.
    *   Návrh úprav: Konkrétní doporučení, co přepsat, smazat nebo přesunout.
    *   30minutová konzultace: Společně projdeme doporučení po telefonu nebo na videu.

#### 2. Úprava textů (Copywriting)
*   **Výsledek:** Srozumitelná nabídka, kterou si rád přečte i váš nejméně technický zákazník.
*   **Výstupy:**
    *   Nový obsah pro hlavní stránku a přehled služeb.
    *   Zkrácení dlouhých textů do jasných a snadno čitelných odrážek.
    *   Nastavení srozumitelných výzev k akci (např. u kontaktního formuláře).

#### 3. Jednoduchý web na klíč
*   **Výsledek:** Rychlá a bezúdržbová vizitka, která správně funguje na každém mobilním telefonu.
*   **Výstupy:**
    *   Statický web (technologie Astro) s bleskovým načítáním a nulovým rizikem napadení hackery.
    *   Optimalizace pro vyhledávače Google a Seznam (SEO) pro lokální dotazy.
    *   Základní formulář pro sběr poptávek napojený na váš e-mail.

---

### Jak pracuji (Slovesný tvar)
1.  **Analyzuji:** Projdu váš stávající web a podívám se, jak nabízíte své služby.
2.  **Navrhnu:** Připravím zjednodušenou strukturu stránek a napíšu nové texty.
3.  **Naprogramuji:** Vytvořím rychlý statický kód bez těžkopádných redakčních systémů.
4.  **Otestuji:** Prověřím rychlost na mobilních sítích a zkontroluji čitelnost textů.
5.  **Předám:** Spustím web na vaší doméně a vysvětlím vám, jak v budoucnu snadno upravíte telefonní číslo nebo otevírací dobu.

---

### Ceník
Zde funguje naprostá transparentnost. Žádné „cena dohodou“ bez záchytného bodu.
> *   **Rozbor webu:** 4 500 Kč *(Jednorázová platba, dodání do 5 pracovních dnů)*
> *   **Úprava textů a struktury:** od 12 000 Kč *(Konečnou cenu schválíme před zahájením prací)*
> *   **Prezentační web na klíč:** od 24 000 Kč *(Návrh, texty, kódování, spuštění a registrace do vyhledávačů)*
>
> *Poznámka pro plátce:* Nejsem plátce DPH. Neplatíte žádné skryté měsíční paušály za provoz systému.

---

## ČÁST 3 — Signature animace

Pravidlo: **Pouze CSS transformace a opacity.** Žádné animace rozměrů (šířka, výška) a žádné filtry, které zatěžují vykreslovací vlákno (Main Thread). Všechny animace respektují `prefers-reduced-motion`.

### 1. Hero: Klidné sestavení textu (Vstupní sekvence)
*   **Kde:** Nadpis, podnadpis a CTA v hero sekci.
*   **Co:** Prvky se postupně objeví a jemně se posunou nahoru o 12px.
*   **Jak (CSS):**
    ```css
    .rq-hero-reveal {
      opacity: 0;
      transform: translateY(12px);
      animation: rqReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .rq-hero-reveal--1 { animation-delay: 80ms; }
    .rq-hero-reveal--2 { animation-delay: 160ms; }
    .rq-hero-reveal--3 { animation-delay: 240ms; }

    @keyframes rqReveal {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    ```
*   **Perf dopad:** Nulový. Proběhne pouze jednou při načtení stránky na Compositor threadu.

---

### 2. Problem wall: „Ostření“ řádků při scrollu
*   **Kde:** Seznam problémů (řádky pod sebou).
*   **Co:** Řádek je zpočátku šedý a málo kontrastní. Jakmile se při scrollu dostane do zorného pole, rozsvítí se do plné barvy.
*   **Jak:** Využívá Scroll-Driven CSS s fallbackem na IntersectionObserver.
    ```css
    .rq-problem-row {
      opacity: 0.3;
      transition: opacity 0.3s ease;
    }
    @supports (animation-timeline: view()) {
      .rq-problem-row {
        animation: rqFocus linear both;
        animation-timeline: view();
        animation-range: entry 15% exit 80%;
      }
    }
    @keyframes rqFocus {
      0%, 100% { opacity: 0.3; }
      40%, 60% { opacity: 1; }
    }
    ```
*   **Perf dopad:** Velmi nízký. Výpočet animace deleguje prohlížeč mimo hlavní JS vlákno.

---

### 3. Služby: Vizuální aktivace karty na hover (Mikro-interakce)
*   **Kde:** Bento karty služeb.
*   **Co:** Karta zůstává fyzicky na svém místě (žádné poskakování layoutu). Pouze se zviditelní tenká linka na horní hraně karty (rozvine se zleva doprava) a ikonka šipky v rohu se jemně posune o 3px šikmo nahoru.      
*   **Jak (CSS Transition):**
    ```css
    .rq-service-card {
      position: relative;
    }
    .rq-service-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background-color: var(--rq-lime, #c7e04a);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .rq-service-card:hover::before {
      transform: scaleX(1);
    }
    .rq-service-card__icon {
      transition: transform 0.2s ease;
    }
    .rq-service-card:hover .rq-service-card__icon {
      transform: translate(3px, -3px);
    }
    ```
*   **Perf dopad:** Zanedbatelný, plně akcelerovaný přes GPU.

---

### 4. Jak pracuji: Progresivní rozsvěcování kroků
*   **Kde:** Číslované kroky postupu práce.
*   **Co:** Jakmile uživatel posouvá stránku dolů, aktivní krok získá plný kontrast, zatímco ostatní jsou mírně utlumené.
*   **Jak:** Scroll-driven CSS animace mapovaná na střed obrazovky.
    ```css
    .rq-work-step {
      opacity: 0.4;
      transform: scale(0.98);
      transition: opacity 0.3s, transform 0.3s;
    }
    @supports (animation-timeline: view()) {
      .rq-work-step {
        animation: rqStepActive linear both;
        animation-timeline: view();
        animation-range: entry 25% exit 75%;
      }
    }
    @keyframes rqStepActive {
      0%, 100% { opacity: 0.4; transform: scale(0.98); }
      40%, 60% { opacity: 1; transform: scale(1); }
    }
    ```

---

### Bezpečná pravidla pro animace (A přístupnost)
1.  **Reduced Motion:** Všechny pohybové efekty musí být vypnuty pro uživatele, kteří mají v systému aktivovaný režim omezení pohybu.
    ```css
    @media (prefers-reduced-motion: reduce) {
      .rq-hero-reveal,
      .rq-problem-row,
      .rq-service-card::before,
      .rq-service-card__icon,
      .rq-work-step {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
    ```
2.  **No-JS:** Všechny výchozí stavy elementů mají plnou viditelnost (`opacity: 1`) a správný layout. Teprve JS (nebo `@supports` direktivy pro moderní CSS) aplikuje výchozí skrytí a následné animační třídy. Pokud uživat
tel vypne JS, web zůstane 100% čitelný a přístupný.

---

## Přehled související projektové dokumentace
Pro detailnější pohled na nastavené standardy a vývoj webu můžete nahlédnout do:
*   [docs/projects/radeq/architecture.md](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/architecture.md) — Definice architektury, datových toků a integračních hranic projektu.
*   [docs/projects/radeq/work-log.md](file:///C:/Programov%C3%A1n%C3%AD/Codex/docs/projects/radeq/work-log.md) — Kompletní přehled dokončených změn a plánovaných milníků.
*   [AGENTS.md](file:///C:/Programov%C3%A1n%C3%AD/Codex/AGENTS.md) — Globální pravidla pro rozhodovací procesy a front-end governance.