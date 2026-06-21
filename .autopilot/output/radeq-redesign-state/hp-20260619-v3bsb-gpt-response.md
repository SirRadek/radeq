**Rychlý rámec**

Nezávislý pohled: RadeQ V3 by neměl „přidat víc animací“. Měl by získat jeden zapamatovatelný motion systém: analytická linka, měření, diagnostika, rozpad chaosu do struktury. Všechno lehké, parametrické, vypnutelné a čitelné i bez JS.

Decision Mesh navíc správně tlačí na: žádné dekorativní 3D, žádný canvas pro SEO obsah, povinný reduced-motion fallback, mobilní fallback a výkonový budget.

## 1. Inventář Technik

| Technika | Kdy použít | Výkon | Fallback / poznámka | Podpora |
|---|---:|---:|---|---|
| CSS `transition` | hover, focus, tlačítka, karty, odkazy | výborný, pokud jen `transform`, `opacity`, barvy opatrně | bez JS funguje vždy | široká |
| CSS `keyframes` | jemné ambientní pohyby, linka, shimmer, pulse | výborný při `transform/opacity`; horší při `filter/box-shadow` | `prefers-reduced-motion` vypnout | široká |
| Web Animations API | řízené animace po interakci, restart, sekvence | dobrý, ale JS závislost | bez JS statický stav | široce dostupné; MDN uvádí plnou podporu hlavních browserů od Chrome 75, Edge 79, Firefox 48 |
| SVG stroke-draw | blueprint linky, diagnostické trasy, podpisová čára | velmi dobrý u pár cest | statická SVG linka | `stroke-dasharray` široce podporované |
| SVG morph | jen malé, kontrolované tvary | střední; riziko janku u složitých path | raději crossfade / stroke místo morph | browserově a implementačně méně čisté |
| Canvas 2D | lehká textura, dot grid, šum, generativní vzor | dobrý, pokud nízké rozlišení a nízké FPS | statický PNG/CSS background nebo vypnout | canvas je široce podporovaný |
| IntersectionObserver | reveal, lazy start/stop animací, sekční aktivace | velmi dobrý | bez JS prvky viditelné | široká podpora od starších moderních browserů |
| CSS scroll-driven `animation-timeline` | progress, blueprint draw, sekční přechody bez JS | velmi dobrý, nativní | `@supports` + IntersectionObserver fallback | limitovaná dostupnost; Chrome/Edge ano, Firefox zatím problém, Safari novější/beta podle verze |
| `@property` | plynulé animace CSS proměnných, gradient angle, progress | dobrý | obyčejná custom property bez animace | dnes solidní: Chrome/Edge 85+, Firefox 128+, Safari 16.4+ |
| `offset-path` | malý „audit cursor“ po SVG trase | dobrý u 1-3 prvků | transform keyframes nebo žádný cursor | moderní podpora lepší, ale testovat Safari/iOS; nepoužívat jako kritickou funkci |

Zdroje k aktuální podpoře: MDN pro [`animation-timeline`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline), [`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40property), [`offset-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/offset-path), [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), [SVG `stroke-dasharray`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-dasharray).

## 2. Hero „Signature“ Animace

### A. Diagnostická Živá Linka

Nejsilnější volba. V hero běží tenká vínová/lime SVG linka jako „měřicí signál“, která propojuje claim, CTA a malý audit panel. Není to dekorace, ale vizuální metafora: chaos → měření → rozhodnutí.

Technicky: inline SVG, 2-4 path, `stroke-dashoffset`, drobný moving highlight přes gradient nebo masku. Aktivní jen v hero viewportu přes IntersectionObserver. Bez JS linka zůstane staticky vykreslená. Reduced motion: žádné kreslení, jen finální stav.

Dopad: prakticky nulový, pokud se neanimují filtry. 60 fps reálné i na mobilu.

### B. Programovaný Audit Grid

Hero pozadí má jemný ivory/grafit grid, ve kterém se občas rozsvítí body, krátké segmenty nebo „testovací pulzy“. Působí jako analytický nástroj, ne jako sci-fi dashboard.

Technicky: CSS/SVG grid, 12-24 bodů, animace přes `opacity` a `transform`. Lze generovat deterministicky ze seedů v CSS custom properties. Žádný velký canvas particle systém.

Dopad: velmi nízký. Pozor na mnoho současných animací; držet pod cca 30 animovaných elementů.

### C. Mikro-Parallax Typografie

Hero text, CTA a diagnostická mini-vrstva mají velmi jemný pohyb podle scrollu. Ne podle myši na mobilu. Cílem je pocit hloubky, ne „wow efekt“.

Technicky: CSS scroll-timeline tam, kde je podpora; fallback na žádný parallax nebo IntersectionObserver class. Pohyb max 8-16 px. Reduced motion vypnout.

Dopad: nízký, ale jen při `transform`. Nepoužívat `top/left`, blur, velké shadow.

Moje doporučení: A + velmi střídmě B. C jen pokud hero po A nepůsobí dost živě.

## 3. Mikrointerakce

**Stojí za to**

- CTA magnetic: ponechat, ale omezit radius a sílu. Mělo by působit přesně, ne gumově.
- Underline draw u odkazů: výborný poměr efekt/výkon. Hodí se k „racionální digitalizaci“.
- Karty lift: 2-4 px translate, jemná změna borderu, žádný dramatický tilt.
- Diagnostické prvky: přepínače, výsledky, body v panelu mohou mít krátké „measure pulse“ po změně.
- Focus states: motion i pro klávesnici, ne jen hover.

**Opatrně**

- Ripple: často působí material-designově a mimo brand. Pokud ano, tak jen jako velmi suchý „ink scan“, ne vodní kruh.
- Glow: vínová/lime glow může rychle vypadat levně. Raději border highlight než aura.
- Tilt karty: pro B2B analytika snadno moc hravé. Max u ukázek, ne u ceníku/služeb.
- Pulse štítků: používat jen pro aktivní diagnostické signály, ne pro každou badge.

**Laciné pro tento brand**

- Nekonečné bouncing šipky.
- Neonové glow kolem CTA.
- Velké elastic easing.
- Hover efekty, které mění layout.
- Marquee všude.

## 4. Pozadí / Atmosféra

Nejlepší atmosféra pro RadeQ: statická preciznost + minimální známky měření.

**Grain**

Použít jako statický pseudo-element nebo malý opakovaný asset, ne animovaný 4K šum. Animovaný grain je drahý a často kazí textovou čistotu. Pokud pohyb, tak změna opacity jednou za několik sekund, ne 60 fps.

**Gradient shift**

Pouze velmi jemný, velká plocha, nízká saturace. Animovat custom property nebo background-position opatrně. Na 4K může repaint velké plochy stát víc, než vypadá. Lepší: statický gradient + lokální SVG linka.

**Dot-grid drift**

Dobrý kandidát. Udělat grid jako CSS radial-gradient nebo SVG pattern. Pohyb maximálně 1-2 vrstvy přes `transform`, ne přepočet backgroundu. Na 4K držet textury jednoduché, žádný blur přes celou obrazovku.

Pro 4K: neanimovat full-screen `filter`, `backdrop-filter`, `box-shadow`, velké gradient repainty. Když už ambientní vrstva, dát ji do samostatné fixed/absolute vrstvy s `contain`, nízkou opacitou a bez interakce.

## 5. Scroll-Driven Momenty

**Progress rail**

Tenká vertikální nebo horizontální linka, která ukazuje postup stránkou. Ne jako blog progress bar, spíš jako audit line: „diagnóza postupuje“. CSS scroll-timeline; fallback statická linka.

**Blueprint draw**

Stávající blueprint SVG je ideální kandidát. Kreslit linku při vstupu sekce do viewportu. Nativně přes `view-timeline`, fallback přes IntersectionObserver, no-JS finální linka.

**Sekční přechody**

Ne animovat celé sekce. Lepší: při vstupu sekce se objeví malý měřicí marker, linka, číselný detail, aktivní bod. Zachovat rychlost čtení.

**Problem wall**

Symptomy mohou při scrollu přecházet z „chaos“ stavu do seskupených kategorií. Ale pozor: žádné scrolljacking. Jen opacity/translate a možná zvýraznění aktivního clusteru.

**Ceník**

Bez efektních animací. U ceníku je důvěra důležitější než motion. Stačí focus/hover clarity.

## 6. „Negenerovat, Naprogramovat“

Vygenerovanou referenci bych použil jako mood/kompozici, ne jako asset.

Praktický postup:

1. Vygenerovat 1-2 statické reference pro „analytická linka / audit grid / blueprint motion“.
2. Ručně z nich vytáhnout princip: počet linií, rytmus, hustota bodů, kontrast, směr pohybu.
3. Převést do SVG: pár path, pattern, maska, gradient stroke.
4. Parametrizovat: délka, rychlost, delay, barvy, intenzita, density.
5. Ověřit v no-JS stavu: reference nesmí být nutná pro pochopení obsahu.
6. Z reference nevkládat bitmapu, pokud není statická a silně optimalizovaná.

Nejlepší výsledek bude, když reference slouží jako storyboard pro ručně psaný motion systém.

## 7. Mantinely Výkonu

**Nikdy**

- Autoplay video/GIF pro hero motion.
- WebGL/3D blob jako dekorace.
- Velké canvas particle systémy.
- Scrolljacking.
- Animace `top`, `left`, `width`, `height`, `margin`, `padding`.
- Fullscreen blur, backdrop-filter nebo animované stíny.
- Mnoho `box-shadow` glow efektů.
- Animovaný grain přes celý viewport při 60 fps.
- JS scroll listener bez throttlingu/RAF.
- Animace, které nesou obsah důležitý pro SEO nebo porozumění.

**Měřit**

- Chrome DevTools Performance: frame time pod 16.7 ms, minimální long tasks.
- Rendering panel: paint flashing, layout shift, compositing.
- Lighthouse: Performance 90+, CLS nízko, žádné zbytečné JS.
- Web Vitals: LCP hero nesmí trpět kvůli animaci.
- Mobilní test: low/mid Android throttling, ne jen desktop.
- Reduced motion test: všechno zásadní zůstává čitelné.
- No-JS test: stránka pořád funguje a obsah je vidět.

## TOP 5 První Vlna

1. **Hero diagnostická SVG linka**  
   Nejlepší signature efekt. Brandově přesná, lehká, programovatelná.

2. **Blueprint scroll-draw**  
   Navazuje na existující V2 a posílí „jak pracuji“ bez nového vizuálního systému.

3. **Underline draw + focus motion pro odkazy/CTA**  
   Malý detail, vysoká kvalita pocitu, minimální výkonový dopad.

4. **Diagnostický panel: měřicí pulse po interakci**  
   Motion přímo podporuje hlavní metaforu webu. Lepší než obecné hover efekty.

5. **Jemný audit grid v hero/problem wall**  
   Atmosféra bez těžkého assetu. Držet velmi střídmě a vypnout při reduced motion.

Můj verdikt: V3 animace by měly být „instrumentace“, ne ornament. Všechno, co vypadá jako měření, audit, trasa, signál nebo strukturování chaosu, sedí. Všechno, co vypadá jako generická agenturní paráda, bych vyhodil.