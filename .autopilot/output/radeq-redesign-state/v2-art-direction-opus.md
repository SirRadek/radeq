# radeq.cz v2 — Full design system (Opus art direction)

Ground-up redesign of the WHOLE homepage into one coherent system. Not a CSS patch.
Authoritative new stylesheet `src/styles/system.css` (loaded after global.css) +
real markup/layout restructuring per section + new Footer. Keep green identity,
keep pricing visible + form functional. Light theme is the canvas.

## 1. Design tokens (the DNA)

### Color (light canvas, green identity)
- --bg:            #F6F4EE   (warm off-white — warmer/more intentional than old #f7f9f4)
- --bg-sunken:     #EEEAE0   (alternating section background)
- --surface:       #FFFFFF   (cards/panels)
- --surface-2:     #FBFAF6   (inset within cards)
- --ink:           #16201A   (near-black, green-tinted) — headings/body
- --ink-2:         #515B53   (muted text)
- --line:          #E3DED2   (hairlines on warm bg)
- --line-2:        #D2DBCE
- --brand:         #1E7A41   (the green — primary actions, accents)
- --brand-strong:  #155C31   (hover / emphasis)
- --brand-tint:    #E7F1E8   (soft brand background)
- --ink-block:     #112019   (dark statement/footer charcoal-green)
- --on-dark:       #EEF4EA
- --on-dark-muted: #9FB0A2
- --lime:          #CDEE6B   (HIGH-contrast CTA/highlight ON DARK ONLY; never green text on dark)

### Type
- --font-display: "Plus Jakarta Sans" (700/800) — H1, H2, big numerals
- --font-body:    "Inter" (400/500/600) — body, UI
- --font-mono:    "JetBrains Mono" (500) — eyebrows/kickers/labels/price (keeps the
  "technical craft" signature; this is radeq's character, not generic)
- Scale: display clamp(2.9rem,6vw,5rem)/0.98 · h2 clamp(2.1rem,4vw,3.4rem)/1.04 ·
  h3 1.25rem · lead clamp(1.05rem,1.6vw,1.25rem)/1.55 · body 1rem/1.65 ·
  small .875rem · eyebrow .72rem upper, letter-spacing .14em
- Display weight 800, tracking -0.02em. Body tracking 0.

### Spacing / radius / shadow / motion
- space scale: 4,8,12,16,24,32,48,64,96,128 (rem-based vars --s-1..--s-10)
- --section-pad: clamp(4.5rem, 9vw, 9rem) block
- --gutter: clamp(1rem, 4vw, 2rem)
- --maxw: 1140px (content), --maxw-wide: 1280px
- radius: --r-sm 10px · --r 16px · --r-lg 24px · --r-pill 999px
- shadow: --sh-1 0 1px 2px rgba(20,30,22,.06), 0 8px 24px -12px rgba(20,30,22,.12);
  --sh-2 0 2px 4px rgba(20,30,22,.06), 0 24px 48px -20px rgba(20,30,22,.20)
- motion: --t-fast 180ms · --t 320ms · --t-slow 640ms · --ease cubic-bezier(0.16,1,0.3,1)
- reveal via existing html[data-motion-ready="true"] switch; reduced-motion safe;
  hover lift translateY(-4px). 0 horizontal overflow (overflow-x:clip guard).

## 2. Component language (applied to EVERY section)
- **Section shell:** centered --maxw, --section-pad block. Each section opens with an
  EYEBROW (mono, --brand, uppercase, leading "— " tick) → display H2 → lead (max ~52ch).
  Alternate --bg / --bg-sunken between sections for rhythm.
- **Card:** --surface, 1px --line, --r, padding clamp(1.4rem,2vw,2rem), --sh-1; hover
  → --sh-2 + translateY(-4px) + border brand-tint. Oversized faint brand numeral marker.
- **Button:** pill. primary = --brand fill, white text, mono label + sliding "→".
  secondary = transparent, 1px --line, --ink text. on-dark CTA = --lime fill, --ink-block text.
- **Nav (CommandHeader):** slim sticky bar, translucent --bg backdrop-blur, bottom hairline.
  brand-mark (pulse dot + wordmark, display) · centered/!right nav links (mono, small) ·
  pill CTA. Keep theme/style toggles but make them quiet/icon-like.
- **Footer (NEW):** full-bleed --ink-block band. 3–4 columns: brand + short line, nav,
  services, contact (email). Fine print row (© + IČO/legal links). --on-dark text,
  --lime accents. This is the page's dark anchor.
- **Hero:** left-aligned display H1 (max ~12ch), lead, proof-rail (3 stats, hairline-top),
  primary+secondary CTA. Right: the CoreIsland panel framed as a "blueprint" card with a
  faint CSS grid motif + slow ambient drift (motion-ready gated). No url() images.
- **Pricing:** 3 cards, middle featured (brand-tinted, scaled, "Doporučeno" ribbon).
  Price in mono display size. Includes list with brand check marks. Stays on LIGHT.
- **Contact/terminal:** keep form + logic; restyle to card system, brand focus rings,
  pill submit. Summary panel as surface-2 inset.

## 3. Coherence rules (review gate)
- No section may keep the old look. No mixing old terminal-dark panels with new light cards.
- Exactly one type scale, one button system, one card system across all sections.
- Green is the only chromatic accent on light; lime only on dark.
- Mobile: single column, fluid type, comfortable tap targets, 0 horizontal overflow.

## 4. LOCKED after real agy critique (Gemini 3.1 Pro High) — overrides above where conflicting
- PRICE numerals → bold --font-display (Plus Jakarta), NOT mono. Mono ONLY for
  uppercase eyebrows + micro-labels (e.g. "[ 01 ] AUTOMATIZACE"). Keeps technical
  signature without making prices look like code.
- Use --ink ASSERTIVELY: huge H2s in near-black --ink, card borders a touch more
  defined (--line-2), green stays a TRUE accent (buttons/active/arrows only). Prevents
  the beige+green "organic food brand" flatness.
- ONE mid-page DARK climax block + the dark footer (two dark moments, well separated).
  Section order reworked for narrative + rhythm:
    1 Hero (bg) → 2 Services (bg-sunken) → 3 About/approach (bg) →
    4 Proof/Handoff = DARK climax (--ink-block, lime accents) →
    5 Pricing (bg, ultra-clear, stays LIGHT) → 6 Contact (bg) → 7 Footer (DARK).
  Pricing moved AFTER trust-building; pricing + form never go dark.
- Hero panel = tasteful "precision" not literal blueprint: fine 1px borders + a very
  faint 4px DOT-grid inside the panel only, high-end dashboard feel. No blue, no
  measuring-tape/CAD tropes.
- Anti-generic highest-leverage move: EXTREME scale contrast — push display H1/H2
  large + tight tracking (-0.02em), body 1–1.125rem with generous 1.6–1.65 line-height.
- Form fields: standard, high-contrast, white bg, clear 1px borders, Inter input text,
  brand focus ring. Never minimalist/floating/mono inputs.
- Foundation must NEUTRALIZE the old busy animated body gradients (body, body::before,
  body::after pink/purple/cyan layers) → calm warm --bg canvas.

## 5. Build order (Codex implements, Opus reviews each + build + screenshot)
B1 chrome+foundation · B2 hero+fit · B3 services+about · B4 proof(dark)+pricing · B5 contact+footer+polish.
