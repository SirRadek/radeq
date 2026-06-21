Return ONLY a valid JSON object (no prose/fences). RadeQ.cz V2 — Vlna 1a: barevný + typo
+ motion-CSS systém. POUZE CSS (žádný JS, žádné markup přepisy). Namespace `rq-`. Cíl:
živější, odvážnější vzhled (větší typografie, víc vínové, hloubka), připravit CSS hooky
pro pohyb — bez ztráty SEO/výkonu, reduced-motion safe, 0 horizontal overflow.

## Současné relevantní v rq.css (uprav/rozšiř)
:root tokeny: --rq-bg:#F7F4EE; --rq-bg-sunken:#EFEAE0; --rq-surface:#FFFFFF; --rq-ink:#1C1A17;
--rq-ink-2:#5A554E; --rq-line:#E6E0D4; --rq-burgundy:#7A1F2B; --rq-burgundy-strong:#5E1622;
--rq-burgundy-tint:#F3E7E9; --rq-r:14px; --rq-r-pill:999px; --rq-ease:cubic-bezier(.16,1,.3,1);
--rq-display:"Plus Jakarta Sans"; --rq-body:"Inter"; --rq-mono:"JetBrains Mono".
Třídy: .rq-display { font-size:clamp(2.8rem,6vw,4.8rem) } · .rq-h2 { clamp(2rem,4.4vw,3.3rem) } ·
.rq-eyebrow (mono burgundy) · .rq-lead · .rq-card (hover lift už má) · .rq-btn/--primary/--ghost ·
.rq-offer__price (cena u služeb) · .rq-price-card__price (cena u tarifů).

## Co vytvořit (vrať jako CSS, které se APPENDuje na konec rq.css — nech ho přebít starší pravidla)
1. **Větší, odvážnější typografie:** přebij .rq-display na clamp(3.2rem, 8vw, 8rem),
   line-height .95, letter-spacing -.03em, font-weight 800. .rq-h2 na clamp(2.4rem, 5.5vw, 5rem),
   line-height 1.0, letter-spacing -.02em. Velká čísla cen: .rq-offer__price a
   .rq-price-card__price na font-family var(--rq-display), font-weight 800, font-size
   clamp(2rem, 4vw, 3rem), color var(--rq-burgundy). (reálný text, SEO ok)
2. **Víc vínové (~12 %) + hloubka:** přidej decentní vínové akcenty — např. .rq-eyebrow už je
   vínový; přidej vínový spodní „tick"/podkres k .rq-h2 (např. ::after malá vínová linka),
   vínové hover stavy odkazů, jemný vínový radiální podkres do hero (.rq-hero, velmi rozostřený,
   nízká opacita, pointer-events:none). Nepřehánět, ať to nezačerná.
3. **Diagnostický druhý akcent (token):** přidej --rq-lime:#C7E04A (signální), --rq-lime-ink:#2A3508.
   Připrav util třídu .rq-flag (malý štítek: lime pozadí, tmavý text, mono, uppercase) pro stav
   „nalezen problém"/aktivní bod — zatím nemusí být použitá.
4. **Tmavý statement blok (třída, zatím nepoužitá):** .rq-statement { full-bleed: width:100vw;
   margin-inline:calc(50% - 50vw); background: near-black grafit (#14110F nebo color-mix s vínovou);
   color: var(--rq-bg) }, vnitřní .rq-statement__inner (width min(100%-2rem,var(--rq-maxw));margin auto;
   padding-block velký). Nadpisy v něm světlé, akcenty vínová/lime.
5. **Motion CSS hooky (keyed na data-atributy; JS je dodá ve Vlně 1b):**
   - reveal: `[data-rq-reveal]{opacity:0;transform:translateY(18px)}` a
     `html[data-rq-motion="on"] [data-rq-reveal].is-in{opacity:1;transform:none;transition:opacity .6s var(--rq-ease),transform .6s var(--rq-ease)}`
     (+ volitelný stagger přes `--rq-i` a transition-delay calc).
   - hover-lift util `.rq-hoverable` (translateY(-4px)+shadow na hover).
   - marquee: `.rq-marquee` + `@keyframes rq-marquee` (plynulý posun, pauza na hover, GPU transform).
   - magnetic/count-up nemají CSS, řeší JS.
   - VŠE obal do `@media (prefers-reduced-motion: no-preference)` kde má pohyb běžet; v reduce
     stavu nech vše statické/viditelné. Bez data-rq-motion="on" nech obsah plně viditelný (no-JS safe).

## Vrať JSON PŘESNĚ:
{
 "rq_css_append":"CSS k APPENDU na konec rq.css (vše výše, rq- prefix, reduced-motion + no-JS safe, 0 overflow)",
 "verify_notes":["co Opus zkontroluje (typo velikost, vínová ne moc tmavá, statement kontrast, reveal bez JS viditelný)"]
}
Žádný JS, žádné markup změny, žádné staré class names, bez secrets/logů.
