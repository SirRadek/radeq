Return ONLY a valid JSON object (no prose/fences). FINAL STEP B5 of a ground-up
radeq.cz homepage redesign. Design system in src/styles/system.css — REUSE tokens/
primitives (--bg,--surface,--surface-2,--ink,--ink-2,--brand,--brand-tint,--brand-strong,
--line-2,--font-display,--font-mono,--font-body,--r,--r-sm,--r-lg,--r-pill,--sh-1/2,
--section-pad,--ease,.ds-card,.button-primary). You APPEND to system.css. NO JSX/markup
changes in this step — the contact form is a React island whose logic must be preserved;
you only write CSS that restyles it to match the rest of the (already shipped) redesign.

## Context: everything else is already redesigned and coherent (light warm canvas, green
## accent, Plus Jakarta display + Inter body + mono eyebrows, white cards w/ hover lift,
## pill buttons, one dark proof band + dark footer). The CONTACT section still shows the
## OLD dark "terminal" styling from global.css and looks out of place. Make it on-system.

## CONTACT island class map (DOM you are styling; do NOT change it)
section.terminal-section#terminal
  > div  (heading: p.section-code, h2, p (may contain <code>))
  > div.terminal-grid
      > form.terminal-window.brief-form
          > fieldset.brief-form__fieldset
              > legend
              > p.brief-form__note
              > div.brief-form__grid
                  > div.brief-field (and div.brief-field.brief-field--wide for textarea)
                      > label > span + small
                      > input | select | textarea
                      > span.brief-field__error
          > details.brief-optional > summary + div.brief-form__grid
          > div.brief-actions > button[type=submit] + p.terminal-status
      > div.brief-summary  (a recap/aside panel; contains headings + text/list)

## Requirements (agy guardrail: forms must look like obvious, high-contrast forms)
- .terminal-section: light section shell — width min(100% - 2*var(--gutter), var(--maxw));
  margin-inline:auto; padding-block:var(--section-pad); background:var(--bg); color:var(--ink).
  Override any old dark background/overflow. Heading h2 already uses display via global h2 rule.
- .terminal-grid: responsive 2-col (form ~1.4fr + summary ~1fr), gap clamp; stacks <900px.
- form.brief-form / .terminal-window: a clean light .ds-card-like panel (background:var(--surface);
  border:1px solid var(--line-2); border-radius:var(--r-lg); box-shadow:var(--sh-1);
  padding clamp(1.4rem,3vw,2.2rem)). REMOVE old dark/terminal look.
- fieldset.brief-form__fieldset: no border, margin/padding reset; legend → small mono uppercase
  eyebrow style (color var(--brand)); .brief-form__note muted small.
- inputs/select/textarea: WHITE background (var(--surface)); 1px solid var(--line-2);
  border-radius:var(--r-sm); padding .7rem .85rem; font-family:var(--font-body); color:var(--ink);
  font-size:1rem; full width. Focus: border-color var(--brand) + 3px brand focus ring
  (box-shadow 0 0 0 3px color-mix(in srgb,var(--brand) 22%, transparent)); outline:none.
  labels: var(--ink), font-weight 600, small "required" marker muted. textarea min-height ~9rem.
  .brief-field--wide spans full grid width. select shows a custom caret optional.
- .brief-field__error: clear red (use a readable red like #b42318), small.
- details.brief-optional: subtle, summary as a quiet toggle (mono small, brand on hover).
- .brief-actions button[type=submit]: style EXACTLY like .button-primary (green pill, white text,
  padding, font-weight 600, hover var(--brand-strong)); disabled state dimmed. Add a "→" optional.
  .terminal-status: small muted status text, polite.
- .brief-summary: a var(--surface-2) inset card (border 1px var(--line-2), radius var(--r),
  padding) with readable headings (display) + muted body; on-system.
- Keep high contrast & legibility. Responsive, reduced-motion safe, 0 horizontal overflow.

## ALSO: coherence fix for leftover eyebrows
Add a rule making the legacy `.section-code` match the new eyebrow (in case any remain):
mono, .72rem, uppercase, letter-spacing .14em, color var(--brand), with a leading "— " via
::before; margin 0 0 1rem. (This styles the contact section-code + any other leftover.)

## Return JSON EXACTLY these keys
{
 "system_css_append": "CSS to APPEND: /* Contact */ block + /* section-code coherence */ block. Strong selectors to beat old global.css (you may use .terminal-section .brief-field input etc.; avoid !important unless necessary for the dark-bg override).",
 "verify_notes": ["checks after build, incl. form fields look standard/high-contrast and submit works visually"]
}
No JSX changes. No secrets/logs. Must visually match the shipped light/green/Plus-Jakarta system.
