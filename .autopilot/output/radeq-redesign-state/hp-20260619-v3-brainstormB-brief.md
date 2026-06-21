# Brainstorm B (samostatný) — RadeQ.cz V3: animace

Jsi špičkový motion/kreativní programátor. Brainstorming, žádný kód teď. Piš ČESKY, konkrétně,
Markdown. Dej SVŮJ nezávislý pohled. Klíčové omezení vlastníka: animace musí být **LEHKÉ,
RYCHLÉ, KVALITNÍ a PROGRAMOVATELNÉ** — NEgenerovat (žádné těžké video/gif/3D blob); max
naprogramovat ručně podle nějaké vygenerované reference. Cíl: Lighthouse 90+, plynulých 60 fps,
respekt k `prefers-reduced-motion`, no-JS bezpečné.

## Kontext (V2 hotová)
RadeQ.cz „Racionální digitalizace", brand analytik/tester, ivory/grafit/vínová/lime, fonty
Plus Jakarta + Inter + mono. Už máme: scroll-reveal/stagger, magnetic CTA, marquee symptomů,
interaktivní diagnostický panel, blueprint SVG linka. Sekce: hero → marquee → tmavý problem
wall → diagnostický panel → bento služby → jak pracuji (blueprint) → ceník → ukázky → kontakt.

## Zaměření (dej konkrétní, programovatelné nápady)
1. **Inventář vhodných technik** pro tento web: CSS transitions/keyframes, Web Animations API,
   SVG (stroke-draw, morph), Canvas 2D (lehké), IntersectionObserver, scroll-driven animations
   (CSS `animation-timeline: view()/scroll()`), `@property` + `offset-path`. U každé: kdy použít,
   výkonová náročnost, fallback, podpora prohlížečů.
2. **Hero „signature" animace:** lehký, programovatelný pohyb v hero (např. živá vínová/lime
   linka, jemný generativní-vzhled vzor naprogramovaný v SVG/Canvas, parallax textu). Musí být
   lehké a rychlé. 2–3 návrhy s tech detailem a fps dopadem.
3. **Mikrointerakce:** tlačítka (magnetic, ripple), karty (tilt/lift/glow), odkazy (underline
   draw), štítky (pulse). Které stojí za to, které jsou laciné.
4. **Pozadí / atmosféra:** lehká programovaná textura/pohyb na pozadí (grain, jemný gradient
   shift, dot-grid drift) — bez ztráty výkonu, vypnutelné při reduced-motion. Jak na 4K, aby
   to neubíralo fps.
5. **Scroll-driven momenty:** co animovat při scrollu (progress, blueprint draw, sekční
   přechody) přes nativní scroll-timeline (bez JS) + JS fallback.
6. **„Negenerovat, naprogramovat":** jak prakticky využít vygenerovanou referenci (obrázek/
   návrh) a převést ji na lehký KÓD (SVG path, CSS) místo vkládání těžkého assetu.
7. **Mantinely výkonu:** co NIKDY (layout-thrashing vlastnosti, velké canvas particle systémy,
   autoplay video, scrolljacking). Jak měřit (DevTools, Lighthouse, fps).

Na konec: TOP 5 animací s nejvyšším poměrem efekt/výkon, které doporučuješ jako první vlnu.
Bez kódu/secrets/logů.
