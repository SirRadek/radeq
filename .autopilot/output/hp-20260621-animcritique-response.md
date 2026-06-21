## Verdikt

Směr je stavitelný, ale současná varianta je zbytečně křehká: kombinuje CSS Motion Path, scroll timelines, JS fallback, duplicitu křivky a několik souběžných animací. Udělal bych statický SVG jako základ a motion jako progressive enhancement.

## 1. `offset-path: path()`

- CSS Motion Path je dnes v moderních browserech použitelný, včetně Safari 16+, ale starší Safari/iOS 15 to nedá. `animation-timeline: view()` je slabší bod: Firefox ji má pořád za flagem a Safari až nově, takže fallback je povinný.
- Nepoužíval bych `offset-path: path(...)` jako hlavní mechanismus pro kritický efekt. Když selže, pulse zůstane špatně umístěný nebo zmizí.
- Nejspolehlivější varianta pro scroll-synced pulse: SVG path jako jediný zdroj pravdy + JS přes `getTotalLength()` / `getPointAtLength()`.

```js
const length = path.getTotalLength()

function placePulse(progress) {
  const p = Math.max(0, Math.min(1, progress))
  const point = path.getPointAtLength(p * length)
  pulse.setAttribute('transform', `translate(${point.x} ${point.y})`)
}
```

- Pokud má pulse jen autonomně běžet po křivce, použil bych SVG `<animateMotion>` + `<mpath href="#rq-hero-path">`. To zároveň řeší duplicitu path.
- Doporučení: scroll progress dělat JS path samplerem; autoplay loop dělat `<animateMotion>` jen pokud není potřeba scroll vazba.

## 2. Výkon A Paint

- `stroke-dashoffset` na SVG cestě není compositor-only efekt. Typicky přepočítává/paintuje stroke. Jako jednorázový draw efekt při vstupu do hero je v pořádku; jako loop ne.
- `transform` a `opacity` jsou bezpečnější animační vlastnosti. Track draw, grid, circles a stroke efekty bych držel statické po dokončení úvodního reveal.
- `will-change` nedávat globálně na `.rq-hero__visual` ani na celý SVG. Maximálně krátkodobě na wrapper s parallax transformem nebo pulse, a jen při viditelnosti.
- Současně neběhat: draw track + pulse po cestě + pulse ring + parallax. Prakticky stačí:
  - track draw jednou,
  - pulse pohyb jen ve viewportu,
  - ring buď 2-3 cykly po dokončení, nebo vůbec.
- Infinite ring/parallax v idle stavu je zbytečná baterka. IntersectionObserver má přidat třídu `is-active`; mimo viewport se animace zastaví.

## 3. Duplicita Path

Nedefinovat křivku v CSS stringu i v SVG `d`. To se časem rozjede.

Lepší struktura:

```html
<svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
  <defs>
    <path id="rq-hero-path" d="M..." pathLength="1000" />
  </defs>

  <use href="#rq-hero-path" class="rq-track-bg" />
  <use href="#rq-hero-path" class="rq-track" />
  <g class="rq-pulse"><circle r="5" /></g>
</svg>
```

- Viditelná stopa je `<use>`.
- Pulse bere body z `#rq-hero-path`.
- Když se změní tvar, mění se jen jedno `d`.

## 4. Text A Responzivita

- `position:absolute` graf přes hero je riziko mezi 1024-1440 px: text se může potkat s grafem, hlavně při delším copy, větším fontu nebo lokalizaci.
- Preferoval bych normální grid sloupce:

```css
.rq-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 560px);
  gap: clamp(32px, 6vw, 96px);
}
```

- Pokud má být tabletový podkres, musí být za textem, nízký kontrast, `pointer-events: none`, a text musí mít vlastní čitelný background/vrstvu.
- `overflow: hidden` nedávat na celý `.rq-hero`, může uříznout focus ring CTA nebo pulse ring. Ořez patří na vizuální wrapper, případně použít `overflow: clip` + `overflow-clip-margin`.
- Na 4K clampnout šířku hero i grafu. SVG může škálovat, ale kompozice nemá růst donekonečna.

## 5. A11y, No-JS, Reduced Motion

- SVG je dekorace: `aria-hidden="true" focusable="false"`. Pokud graf nese význam, ten význam musí být i v textu.
- No-JS základ musí být hotový statický stav: track vykreslený, endpoint viditelný, žádný element nesmí zůstat schovaný kvůli neaktivované JS třídě.
- Animace zapínat až třídou typu `.rq-motion-ready`, kterou přidá JS po kontrole viewportu, šířky a `prefers-reduced-motion`.
- Reduced motion: žádný parallax, žádný pulse po cestě, track okamžitě dokreslený, endpoint statický.
- Scroll fallback: passive listener, jeden rAF, běžet jen když je hero ve viewportu, vypnout na mobilu, reduced-motion a po opuštění viewportu.

## 6. Co Bych Udělal Jinak

- Vyhodil bych CSS `offset-path: path(...)`.
- Nechal bych jeden inline SVG path jako source of truth.
- Pulse bych umisťoval JS přes `getPointAtLength()` pouze při scrollu a pouze ve viewportu.
- Track draw bych spustil jednou při prvním zobrazení.
- Ring bych buď odstranil, nebo pustil krátce po dosažení endpointu.
- Parallax bych omezil na `transform` wrapperu v rozsahu třeba 8-16 px, ne jako další výrazný efekt.

Over-engineering je tady kombinace `animation-timeline`, JS scroll fallbacku, CSS motion path, SVG path a nekonečného ringu pro dekorativní hero. Efekt bude působit stejně dobře s jedním SVG, jednou křivkou a jedním pohybujícím se bodem.

## Zdroje

- [MDN: `offset-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/offset-path)
- [MDN: `<animateMotion>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateMotion)
- [MDN: `getPointAtLength()`](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement/getPointAtLength)
- [web.dev: High-performance CSS animations](https://web.dev/articles/animations-guide)
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)