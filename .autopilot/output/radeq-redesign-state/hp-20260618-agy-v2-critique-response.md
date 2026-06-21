Here is your design director critique. Let’s stress-test this system against your goal: selling high-ticket websites and automation to conservative Czech SMBs. ### 1. Coherence: The Three-Typeface Stack
**Critique:** Mixing Plus Jakarta (geometric/display), Inter (neutral/UI), and JetBrains Mono (technical) is a tightrope walk. If used loosely, it *will* look like an unfinished tech template or a developer’s personal blog. Plus Jakarta and Inter pair beautifully, but the Mono introduces a third voice. 
**The Fix:** Keep the Mono, but put it in a typographic straitjacket. Use it **strictly** as a structural wayfinding element—for uppercase section eyebrows (e.g., `[ 01 ] AUTOMATION`), micro-labels, and metadata. **Drop it for pricing.** A conservative SMB buyer needs to see the price in a clear, bold, undeniable sans-serif (Plus Jakarta), not a terminal font that makes `50.000 Kč` look like a code snippet.### 2. Color: The Monotone Risk
**Critique:** A warm canvas (#F6F4EE) with only green (#1E7A41) as an accent risks feeling like an organic food brand or a generic sustainability consultancy, not a sharp technical studio. It lacks "bite."
**One Concrete Suggestion:** Introduce a heavy, premium "Ink" or "Charcoal" (e.g., `#1A1A1A` with a subtle green undertone) as your primary structural color. Use this for your massive H2s, card borders, and primary text. Let the #1E7A41 green be a true *accent*—used only for primary buttons, active states, and sliding arrows. This grounds the warm canvas and gives the design a confident, premium edge.### 3. The Single Dark Anchor
**Critique:** Having only the footer in dark charcoal-green is a missed opportunity. A long, purely light scroll can feel lightweight, editorial, and monotonous. You need a "rhythm break" to reset the user's attention.
**The Fix:** Introduce exactly **one mid-page dark block** to serve as the narrative climax. The "Automation/Process" section or the "Pricing" section is the perfect candidate. A dark section mid-scroll immediately commands attention, elevates the perceived value of what's inside it, and creates a highly premium staging area for your lime green (#CDEE6B) accents.### 4. Conversion: The SMB Risk
**Critique:** The biggest risk here lies in "cleverness." Conservative SMB buyers don't care about your design system; they care about clarity and trust. 
**The Biggest Risk:** The Contact Form restyled to the "card system." If your form inputs lose their obvious affordance (e.g., you remove standard borders for a minimalist "floating" look, or you use mono-font for user input), conversion will drop. SMBs need forms to look like forms. Keep the inputs high-contrast, with clear white backgrounds, distinct borders, and bold, readable Inter text. Don't let aesthetic system-rules ruin your primary conversion mechanism.### 5. Hero "Blueprint" Panel
**Critique:** A "blueprint" aesthetic is a great signal of technical craft, but it walks a razor-thin line between "tasteful engineering" and "tacky 90s CAD gimmick."
**How to keep it tasteful:** Do not use literal blueprint tropes (no blue backgrounds, no heavy grid lines, no measuring tape graphics). Instead, signal "blueprint" through *structure and precision*. Use fine 1px structural borders, a very faint 4px dot-grid background just inside that specific panel, and precise alignment. It should feel like a high-end dashboard interface, not a construction site.### 6. The Generic Trap
**Critique:** The single most likely way this still looks generic is if it feels like a $49 Framer template. Templates have to be safe; they use standard typographic scales and predictable spacing so anyone can use them.
**The Highest-Leverage Move:** **Extreme scale contrast.** Push the Plus Jakarta Sans H2s to be uncomfortably large and tightly tracked, paired with Inter body copy that is slightly smaller than expected (e.g., 16px/18px
x) but with highly generous line height (160%). It’s this extreme tension between massive, confident display type and airy, breathable body copy that creates the "lepshee.com" vibe. Safe sizing equals generic design.

***

### KEEP / CHANGE Verdict List

Lock these in before you write a single line of CSS:

*   **CHANGE:** Drop JetBrains Mono for the price numerals. Keep it strictly for uppercase section eyebrows and micro-labels. Prices must be in bold Plus Jakarta.
*   **CHANGE:** Add a dark Charcoal/Ink as your primary text/border color to prevent the green/beige from feeling like a health-food brand.
*   **CHANGE:** Add one mid-page dark-mode section (Pricing or Automation) to break the light-scroll monotony and create a premium climax.
*   **KEEP:** The light warm canvas vs. sunken background rhythm for the rest of the body. It’s elegant and defines space without relying on heavy lines.
*   **KEEP:** The green pill buttons with sliding arrows. It’s exactly the right amount of restrained, premium motion.
*   **KEEP:** Standard, high-contrast, obvious form fields. Do not sacrifice the inquiry form's usability to the altar of the design system.