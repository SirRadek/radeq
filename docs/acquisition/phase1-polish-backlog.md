# radeq — Phase 1 polish backlog (owner review 2026-07-01)

Owner-reported visual issues from the localhost review. Logged for a later polish pass (owner said: fix later,
proceed to Phase 2 = the measurement tool). None are blockers; all are spacing/layout polish.

## 1. Pricing amounts wrap onto two lines — HIGH (looks broken)
On the "Péče po spuštění" pricing cards the amount breaks so the currency drops to a second line
("2 500" / "Kč /měs."). The number + "Kč" + "/měs." must stay on one line.
- Likely cause: the price element allows wrapping; at the scale-up (viewport >1920 → root 2×) the amount grows and
  wraps inside the card. Check BOTH normal (≤1920) and scaled-up sizes.
- Fix: `white-space: nowrap` on the amount (number+Kč), keep "/měs." as a small inline suffix that does not force a
  break; verify the card min-width accommodates the largest price ("15 000 Kč") at 2× scale without overflow.
- Files: the pricing card component/section + its CSS in `src/styles/rq.css` (grep the price/`měs` classes).

## 2. Two black strips on the sides of the "Co řeším" problem carousel — MEDIUM
In the dark diagnostic section, the horizontal tab strip shows partially-cut tabs at the left/right edges
(tab 01 cut on the left, tab 05 cut on the right), reading as two black strips/bleeds on the sides.
- Likely cause: `.diag-tabs` horizontal-scroll container shows adjacent tabs bleeding past the content edges with
  no edge treatment; the dark full-bleed background makes the cut tabs read as strips.
- Fix options: add an edge fade/mask (mask-image linear-gradient) on the tab strip, OR clip the strip to the
  content width with padding so partial tabs don't show, OR snap so a tab isn't cut. Investigate `.diag-tabs` /
  the diagnostic tablist overflow in `RqProblemDiagnostic.astro` + `rq.css`.

## 3. Footer is too wide (>half the display) — MEDIUM
The footer content/links block spans over half the display width; narrow it.
- Fix: cap the footer inner content with a sensible `max-width` (rem-based so it still scales) and center it, so it
  reads as a contained block, not a full-width sprawl. Files: `RqFooter.astro` + footer rules in `rq.css`.

## 4. Excessive vertical whitespace above pricing + around the service-protocol (guarantee) — MEDIUM
Too much empty space above the pricing block, and around the "servisní protokol / Testerova záruka" section.
- Fix: tighten the section top/bottom padding/margin for those two sections (the spacing tokens/section rhythm);
  check it at both normal and scaled sizes. Files: `rq.css` section spacing for the pricing + guarantee sections.

---
Note: items 1 and 4 may be partly scale-up interactions (the >1920 2× root) — verify at a normal 1440px viewport
too, not only on a large monitor, before deciding the fix magnitude.
