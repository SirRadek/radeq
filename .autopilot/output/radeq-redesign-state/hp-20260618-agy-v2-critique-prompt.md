# Critique a design system before full build (radeq.cz)

You are a senior design director reviewing a design system spec before a full
homepage rebuild. Be critical and specific. No code. Goal: catch incoherence,
weak spots, and conversion risks BEFORE implementation.

## Context
radeq.cz = Czech one-person studio selling websites + automation to conservative
Czech SMBs. Homepage must convert (visible pricing + working inquiry form).
Reference vibe: lepshee.com (confident, bold type, generous space, restrained
motion) but adapted for SMB trust. Current site looks generic/templated and mixes
an old "terminal/mono dark" look inconsistently. We keep the GREEN brand color.

## The proposed system (summarize of decisions)
- Light warm canvas (#F6F4EE), alternating with sunken (#EEEAE0); white cards.
- Green #1E7A41 is the only light-mode accent; lime #CDEE6B only on dark blocks.
- One dark charcoal-green band = the FOOTER (full-bleed), as the page's dark anchor.
- Type: Plus Jakarta Sans 800 display + Inter body + JetBrains Mono for eyebrows/
  kickers/labels/price (kept deliberately as the "technical craft" signature).
- Components unified: section shell with mono eyebrow → big display H2 → lead;
  white cards with hover lift + oversized faint brand numeral; pill buttons
  (green primary w/ sliding arrow, outline secondary); slim sticky translucent nav;
  hero left-aligned with a "blueprint" framed CoreIsland panel; pricing 3 cards
  (middle featured), price in mono; contact form restyled to the card system.
- Section rhythm: alternate bg light/sunken + one dark footer anchor.

## Critique these, concretely (markdown, numbered)
1. Coherence: does mono-for-labels + Plus Jakarta display + Inter body hold together
   as ONE confident system, or does mono read as leftover "techy template"? Keep or drop mono?
2. Color: is green-only-on-light + lime-only-on-dark enough contrast/interest, or does
   it risk feeling flat/monotone across 7 sections? One concrete suggestion.
3. The single dark anchor = footer only: is that enough drama, or does the body risk
   feeling like an endless light scroll? Should there be a 2nd dark/tinted moment, where?
4. Conversion: any risk in this system to pricing clarity or form completion for
   conservative SMB buyers? Name the biggest one.
5. Hero "blueprint framed panel": good signal of craft/automation, or gimmick? How to
   keep it tasteful.
6. The single most likely way this rebuild ends up STILL looking generic — and the one
   highest-leverage move to prevent it.

End with: "KEEP / CHANGE" verdict list — 4-6 punchy items I should lock before building.
