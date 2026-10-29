# Targeted re-review — low-height desktop rail

Date: 2026-10-28. Reviewer: critic, native gpt-6.1-sol, medium.

Reviewed studio.css SHA-256 (verified): `a270fa0d34584b6f4dea139e3b34f16dc180b7858a3eb07293631663660d02a0`. Scope limited to the reported 1280×400 EN rail overflow and its three desktop-rule changes. No app edits, build or browser actions performed.

Verdict: **PROCEED to targeted rendered recheck; no blocking source finding.**

The cause is supported by source. `minimal-home-preview.css:15–16` applies `flex-wrap:wrap` to the header and navigation. The desktop rule changes the header to a constrained-height column; without a wrap override, lack of vertical space can create another flex column, moving the language switch outside its 8rem rail. The nav has the same latent wrap setting.

`studio.css:71–75` now explicitly makes both desktop columns nowrap and prevents the nav and language row from shrinking. The logo already has `flex-shrink:0` in `minimal-home-preview.css:20`. Consequently the desktop rail retains its children's natural vertical requirements and uses its existing `overflow-y:auto` when height is insufficient. The language row's automatic top margin can use spare height; it does not require hiding overflow when spare height is exhausted. No horizontal clipping rule was introduced.

The selector specificity exceeds the generic header/nav rules. Changes are confined to the ≥1100px desktop media block, retaining mobile header wrapping. All four navigation links and both locale items retain their existing 44px target rules. Native focus, links and markup are unchanged.

The verifier must now confirm actual vertical scroll reachability and keyboard focus of the last navigation link and language switch at 1280×400 EN, together with rail scrollWidth versus clientWidth. Source review establishes the intended mechanism, not that browser geometry passes. Repeat the reported failing case and one tall desktop comparison; no fresh full audit is warranted.
