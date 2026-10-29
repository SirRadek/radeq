# Builder — responsive scaling, 2026-10-28

Accepted scope: local CSS repair of the selected studio index. Reviewed plan accepted by parent before edits. Baseline: `build-1793213914531`. No build, browser session, deployment or commit performed by builder.

## Cause and changes

- `app/src/styles/service-stories.css`: fixed cover heights and `object-fit:cover` cropped the real PNGs. Parent's owner-panel reproduction measured a 449.6 × 180 image box, with intrinsic PNG ratios that differ from the HTML's common 1120 × 700 attributes. Images now use automatic width/height with maximum width and height, plus containment. Their actual pixels retain the loaded PNG ratio. Cards choose columns from a usable minimum width; a card container query places the whole preview beside the unchanged copy when the card has room. Narrow cards stack naturally. Removed outer overflow clipping; native details/summary, links and content are unchanged.
- `app/src/styles/studio.css`: viewport thresholds ignored the width consumed by the desktop rail. Hero, pricing, author and contact columns now respond to a named content container inside main, leaving the fixed header outside containment. Contact has a sufficiently wide form column before adopting two columns. Workflow and footer navigation use available width. Price rows wrap at their actual column width instead of reserving an unbreakable price beside a severely narrowed label. No font scaling or hidden-overflow workaround was added.

## Evidence and remaining checks

- Before-edit reproduction and measurements: parent-owned `before-owner-images.json` / `before-owner-498.png` in this evidence directory. These establish the crop failure before the patch.
- Executed from `app/`: Node/PostCSS parsed both changed CSS files successfully (63 and 28 top-level nodes respectively). This is a syntax smoke check, not proof of browser layout.
- No new CSS-value assertions added. Parent owns the single required `node scripts/verify-themed-demos.mjs` gate. The independent verifier owns rendered CZ/EN checks at the planned widths, native disclosure/menu/form behavior, all four full-image bounds and narrow local columns. Browser evidence, reflow/zoom limitations and final manifest must be recorded by those roles.
- Builder has not claimed a rendered pass. Remaining uncertainty at handoff: actual horizontal-summary proportions and copy growth at the 24rem card threshold; native CSS container-query cascade in the compiled pages; EN price row and form label wrapping. These need the planned actual-browser verification.

No source outside the two listed stylesheets changed. Backend, email, consent, data, routes, source image files, pricing values and demo behavior were not edited.

## Targeted finding repair

The independent verifier found a local overflow at EN 1280 × 400: the 128px desktop header had scrollWidth 223px, with the language switch outside the rail. Evidence: `after-1280x400-hero-en.jpg` and `verification.json` lowHeightFinding. Source cause: the shared header rule in `minimal-home-preview.css` applies `flex-wrap:wrap`. The desktop studio changes direction to column and constrains height through fixed top/bottom, but had not reset wrapping. At short heights, flex items flowed into another horizontal column. The shared nav also retained wrapping and could shrink vertically as a header flex item.

Targeted repair in `studio.css` only: desktop header and desktop navigation explicitly use `flex-wrap:nowrap`; desktop navigation and language switch retain their natural height (`flex-shrink:0`). Existing header `overflow-y:auto` provides vertical access on short screens. Mobile wrapping and the language switch's static positioning remain unchanged. PostCSS syntax check repeated successfully. Parent owns rebuild; verifier owns the targeted short-rail plus 498px/normal-desktop recheck. No browser/build performed by builder.
