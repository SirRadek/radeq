## ČÁST 1 — Nejlepší řešení 5 vad

### 1. Marquee bez skoku

Nejčistší řešení: neřešit hover změnou `animation-duration`. To restartuje CSS animaci a proto pás skočí. Použít JS řízení přes `requestAnimationFrame`, kde se nemění animace, ale rychlost posunu.

Princip:

```ts
let x = 0
let speed = 38
let targetSpeed = 38
let last = performance.now()

function tick(now: number) {
  const dt = (now - last) / 1000
  last = now

  speed += (targetSpeed - speed) * 0.08
  x = (x + speed * dt) % halfTrackWidth

  track.style.transform = `translate3d(${-x}px,0,0)`
  requestAnimationFrame(tick)
}

root.addEventListener("mouseenter", () => targetSpeed = 12)
root.addEventListener("mouseleave", () => targetSpeed = 38)
```

HTML/CSS struktura:

```html
<div class="rq-marquee" data-marquee>
  <div class="rq-marquee__track">
    <span class="rq-marquee__group">
      <span>Účetní chaos</span><span class="rq-dot">•</span>
      <span>Pomalý web</span><span class="rq-dot">•</span>
      <span>Nejasná nabídka</span><span class="rq-dot">•</span>
    </span>
    <span class="rq-marquee__group" aria-hidden="true">...</span>
  </div>
</div>
```

```css
.rq-marquee {
  overflow: hidden;
}

.rq-marquee__track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.rq-marquee__group {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding-right: 1rem;
  white-space: nowrap;
}

.rq-dot {
  color: var(--rq-muted);
}
```

Důležité: tečka musí být součástí opakované skupiny i za posledním prvkem. Pak je mezera mezi posledním a prvním prvkem stejná jako uvnitř seznamu. Měřit šířku jen první skupiny, druhá je přesná kopie.

Fallback bez JS: obyčejná CSS animace s pevnou rychlostí, hover jen `animation-play-state: paused`, ne zpomalení.

### 2. Full-bleed pozadí sekcí

Každá sekce s vlastním pozadím má být full-bleed wrapper, ne pozadí na vnitřním containeru.

```css
.rq-section {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
}

.rq-section__inner {
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}
```

Použití:

```html
<section class="rq-section rq-diagnostics">
  <div class="rq-section__inner">
    ...
  </div>
</section>
```

Pozor na horizontální scrollbar: `100vw` zahrnuje scrollbar, takže na některých systémech může vzniknout 1 scrollbar navíc. Prakticky dát na root:

```css
html {
  overflow-x: clip;
}
```

Nedávat `overflow-x: hidden` na komponenty, které mají sticky/fixed/mask efekty. `clip` je čistší, ale pokud by starší browser zlobil, fallback může být `hidden`.

### 3. Duplicitní „Rozbor“ flag

Nechat jen v output tabuli.

Důvod: tab už říká, v jakém režimu uživatel je. Druhý štítek „Rozbor“ v řádku tabu přidává vizuální šum a nepřináší informaci. V tabuli má smysl, protože tam označuje typ výsledku nebo výstupu. V navigaci je to duplicita, v obsahu je to metadata.

Doporučení:

- tab: jen název, např. `Rozbor webu`
- tabule: flag `Rozbor`
- pokud je potřeba zvýraznit aktivní tab, použít stav tab tlačítka, ne další badge

### 4. Edge-fade přes celou stránku

Nejčistší varianta: fixed overlay přes viewport, pod headerem a nad patičkou, bez blokování kliků.

```html
<div class="rq-page-fade" aria-hidden="true"></div>
```

```css
.rq-page-fade {
  position: fixed;
  inset: var(--rq-header-height, 72px) 0 0 0;
  pointer-events: none;
  z-index: 40;
}

.rq-page-fade::before,
.rq-page-fade::after {
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  height: 42px;
  pointer-events: none;
}

.rq-page-fade::before {
  top: var(--rq-header-height, 72px);
  background: linear-gradient(to bottom, var(--rq-bg), transparent);
}

.rq-page-fade::after {
  bottom: 0;
  background: linear-gradient(to top, var(--rq-bg), transparent);
}
```

Doporučení: použít velmi jemný fade, ne blur. Blur přes celou stránku bývá drahý a může zhoršit čitelnost. Gradient je stabilní, rychlý a predictable.

Reduced motion tady není kritický, protože nejde o pohyb. Pokud by fade reagoval na scroll, pak vypnout dynamiku přes `prefers-reduced-motion`.

### 5. Karty služeb nemají vést na `#kontakt`

Doporučení: karty služeb nechat neklikací a přidat samostatné CTA pod skupinu.

Pro tuhle cílovku je matoucí, když klik na službu skočí do kontaktu. Působí to jako prodejní trik. Konzervativní malý klient chce nejdřív pochopit, co dostane.

Struktura:

- karta = informační blok
- uvnitř max odkaz `Ukázat příklad` nebo `Co z toho dostanete`
- pod sekcí jeden klidný CTA: `Domluvit nezávazný rozbor`

Pokud existují detailní ukázky, nejlepší je karta → relevantní detail/ukázka. Pokud neexistují, karta nemá být klikací.

## ČÁST 2 — Textace

### Hero

Aktuální směr bych zostřil na „srozumitelnost, pořádek, měřitelný výstup“.

Návrh:

```md
# Web a texty, které lidem rychle vysvětlí, proč se ozvat

Pomáhám živnostníkům, malým firmám a spolkům dát do pořádku web, nabídku a základní prezentaci. Bez velkých řečí. S jasným výstupem, co upravit a proč.
```

CTA:

```md
Chci rozbor webu
Podívat se na služby
```

Důvěryhodná linka pod hero:

```md
Vhodné pro řemeslníky, poradce, lokální služby, menší e-shopy a neziskové projekty.
```

### Problem wall

Místo obecných bolestí konkrétní formulace:

```md
Návštěvník nepozná do 10 sekund, co nabízíte.
Služby jsou popsané podle vás, ne podle rozhodování zákazníka.
Web vypadá hotově, ale nevede k poptávce.
Texty jsou dlouhé, opatrné a bez jasného dalšího kroku.
Reference, cena a kontakt jsou schované moc hluboko.
```

Krátký závěr sekce:

```md
Většinou není potřeba nový web. Nejdřív je potřeba udělat pořádek v tom, co má web říct.
```

### Služby

Formát: název + výsledek + 3 výstupy.

```md
## Rozbor webu

Výsledek: víte, co na webu brzdí důvěru a poptávky.

- seznam konkrétních problémů podle důležitosti
- návrh úprav textů, struktury a CTA
- doporučení, co řešit hned a co počká
```

```md
## Úprava textů

Výsledek: návštěvník rychle pochopí nabídku a další krok.

- nový hero a hlavní sdělení
- přepsané služby do srozumitelné podoby
- kratší texty pro kontakt, ceník a reference
```

```md
## Jednoduchý web

Výsledek: přehledná prezentace, kterou lze dlouhodobě udržovat.

- návrh struktury stránky
- statický rychlý web bez zbytečností
- základní technické SEO a měření
```

```md
## Konzultace nabídky

Výsledek: nabídka je čitelná pro člověka, který vás ještě nezná.

- pojmenování hlavních služeb
- rozlišení levnějších a dražších variant
- doporučení, co dát na web a co řešit až v hovoru
```

### Jak pracuji

Slovesně, bez procesního balastu:

```md
## Jak pracuji

1. Projdu web, nabídku a hlavní rozhodovací místa.
2. Sepíšu, kde lidé ztrácí jistotu nebo důvod pokračovat.
3. Navrhnu kratší strukturu, texty a další kroky.
4. Upravím web nebo předám zadání pro vašeho vývojáře.
5. Ověřím, že stránka drží pohromadě na mobilu i desktopu.
```

### Ceník

Pro konzervativní klienty je lepší rozpětí + co je v ceně.

```md
## Ceník

### Rychlý rozbor webu
od 3 500 Kč

Pro menší web, kde potřebujete vědět, co upravit jako první. Dostanete konkrétní seznam problémů a doporučení.

### Texty a struktura stránky
od 8 000 Kč

Pro web, který už existuje, ale nepůsobí dost jasně. Přepíšu hlavní sdělení, služby, CTA a důležité části stránky.

### Jednoduchý prezentační web
od 18 000 Kč

Pro živnostníka, službu nebo spolek, který potřebuje rychlý, přehledný a udržitelný web.

Předem řeknu rozsah, cenu a co přesně dostanete. Bez hodinové mlhy.
```

## ČÁST 3 — Signature animace

### 1. Hero: klidné složení argumentu

Kde: hero nadpis, podnadpis, CTA.

Co: tři vrstvy vstoupí s malým posunem `translateY(8px)` a `opacity`. Žádné bounce, žádné scale.

Jak:

```css
.rq-reveal {
  opacity: 0;
  transform: translateY(8px);
  animation: rq-reveal 420ms ease-out forwards;
}

.rq-reveal:nth-child(2) { animation-delay: 80ms; }
.rq-reveal:nth-child(3) { animation-delay: 140ms; }

@keyframes rq-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Perf dopad: minimální, jen transform/opacity, jednou po načtení.

### 2. Problem wall: řádky se „zaostří“

Kde: seznam problémů.

Co: při vstupu do viewportu každý řádek přejde z `opacity: .45` na `1` a `translateX(-6px)` na `0`.

Jak: `animation-timeline: view()` pro moderní browser, IntersectionObserver fallback přidá `.is-visible`.

```css
.rq-problem {
  opacity: .45;
  transform: translateX(-6px);
  animation: rq-focus linear both;
  animation-timeline: view();
  animation-range: entry 15% cover 35%;
}
```

Perf dopad: nízký. Žádné měření layoutu, žádný overflow.

### 3. Diagnostika: tabule se skládá jako pracovní výstup

Kde: output tabule / rozbor.

Co: řádky tabule se ukážou postupně, jako checklist. Pouze `opacity` a `translateY(4px)`.

Jak: třída `.rq-row-reveal`, delay přes CSS variable `--i`.

```css
.rq-row-reveal {
  opacity: 0;
  transform: translateY(4px);
}

.rq-row-reveal.is-visible {
  animation: rq-row-in 220ms ease-out forwards;
  animation-delay: calc(var(--i) * 45ms);
}
```

Perf dopad: nízký. Funguje dobře i v React islandu, protože stav stačí přidat na root.

### 4. Služby: žádné létající karty, jen přesné zvýraznění

Kde: karty služeb.

Co: při hover/focus se zvedne jen horní linka nebo malý status prvek, karta samotná zůstane stabilní. Žádné poskakování layoutu.

```css
.rq-service::before {
  transform: scaleX(.18);
  transform-origin: left;
  transition: transform 160ms ease-out;
}

.rq-service:hover::before,
.rq-service:focus-within::before {
  transform: scaleX(1);
}
```

Perf dopad: minimální. Působí jako instrumentace, ne dekorace.

### 5. Marquee: zpomalení jako kontrolovaný signál

Kde: pás symptomů.

Co: hover nezastaví pás, jen plynule zpomalí. To říká „můžete číst“, ale nerozbije rytmus stránky.

Jak: rAF scrub popsaný v části 1, rychlost interpolovat. Reduced motion: marquee vypnout a zobrazit statický zalomený seznam.

```css
@media (prefers-reduced-motion: reduce) {
  .rq-marquee__track {
    transform: none !important;
  }

  .rq-marquee {
    overflow: visible;
  }

  .rq-marquee__group[aria-hidden="true"] {
    display: none;
  }
}
```

Perf dopad: jeden rAF jen pro viditelnou komponentu. Přes IntersectionObserver rAF spouštět pouze když je marquee ve viewportu.

### 6. CTA sekce: jemné potvrzení rozhodnutí

Kde: finální kontakt / poptávka.

Co: tlačítko po vstupu do viewportu dostane krátký `opacity` reveal a linka pod textem se roztáhne zleva doprava.

Jak:

```css
.rq-cta-line {
  transform: scaleX(0);
  transform-origin: left;
}

.rq-cta.is-visible .rq-cta-line {
  transition: transform 260ms ease-out 120ms;
  transform: scaleX(1);
}
```

Perf dopad: minimální. Žádný layout shift, žádné měření.

## Implementační pravidla pro animace

- default stav musí být použitelný i bez JS
- JS pouze přidává `.is-visible`, nikdy nesmí skrýt obsah natrvalo
- `prefers-reduced-motion: reduce` vypne marquee pohyb a reveal animace
- žádný `filter: blur()` na scrollovaných velkých plochách
- žádný `height`, `width`, `top`, `left` animation
- všechny animované prvky musí mít stabilní rozměr před animací
- overflow řešit lokálně, ne maskovat rozbitý layout globálně