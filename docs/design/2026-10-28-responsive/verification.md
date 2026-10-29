# Independent rendered verification — 28 October 2026

Verdict: **PASS after one targeted repair**. App sources were read-only for the verifier. No deploy, form submission, CAPTCHA interaction or optional measurement acceptance occurred.

The initial rendered matrix binds to `build-1793216043446`, manifest SHA256 `02b5d0d62aa21756f0cb7076190f2dadf107bd71eb27647b645087a99e1a161a`. Final targeted acceptance binds to `build-1793216670490`, manifest SHA256 `44e870520221ea468d379347753c4b1288fb6874dc0460d7b6c585b187461ecb`. The parent gate receipts and complete source/artifact comparisons are in `parent-checks.json`; the verifier independently checked the manifest and changed stylesheet hashes.

## Evidence and coverage

`verification.json` records 39 initial rendered states: CS/EN homes at requested widths 320, 390, 498, 601, 768, 900, 1024, 1099, 1100 and 1280; nine disclosures open at 320/498/900/1280 in both languages; CS/EN privacy shell at 320/768/1100; open mobile menu; 1280×400 low height; 1024×640 and 640×400 equivalent 125%/200% reflow. A duplicate initial owner-sized sample is retained. Requested 601 measured 602 CSS pixels; other widths matched. Every sample records measured innerWidth and document client/scroll widths. Native browser zoom is unsupported by the exposed API and was not tested.

All eight real CS/EN thumbnails loaded with nonzero intrinsic dimensions, `object-fit:contain`, natural proportions and rendered boxes fitting their covers. At 498×562 they now show the complete image beside the title; at 320 they stack naturally. No document horizontal overflow appeared. Visible text/control scans found no local overflow; the CS 1px screen-reader-only audience label is an intentional exception. Main section boxes do not overlap. Direct visual inspection covered owner-sized cards, desktop opened cards, 320px opened card, form, footer, privacy and menu, and low-height/reflow hero. The final screenshot is `after-final-498-services.jpg`.

All nine home disclosures were actually opened in each language, including optional form details and care pricing. Visible form fields, native summaries and send button measured at least 44px high; the pre-existing CS audience animation pause button is smaller. Enter opened and closed native menu and a service disclosure; visible focus is captured in `after-320-menu-en.jpg`. The coffee-shop demo link opened the EN demo, and its return link navigated to `/en/#sluzba-eshop`, reopening the matching card. Cookie settings showed both optional choices unchecked; **Reject optional** was clicked. No enquiry was entered or sent.

## Finding, correction and targeted acceptance

The initial 1280×400 screenshot exposed a material local overflow missed by document-only checks: the 128px left header had scrollWidth223, with the language switch at x248 outside its x72–200 rail. This is preserved in `lowHeightFinding` and `after-1280x400-hero-en.jpg`. The parent/builder corrected desktop flex wrapping; the verifier did not edit app CSS.

After the final build and preview restart, the page was reloaded. Seven targeted measurements cover CS/EN 1280×400, 1280×800, 1100×400, and keyboard reach of the language switch. At low height, header clientWidth113 equals scrollWidth113; scrollHeight440 exceeds clientHeight400 vertically. Tab from Contact focused CZ and scrolled the rail by40px, placing the entire 44px focus target within the viewport at y324–368. `after-repair-1280x400-en.jpg` captures the result. A final 498×562 menu open/close and owner-view screenshot passed.

The broad matrix was intentionally retained rather than repeated: the final delta only changes desktop header/navigation wrapping and shrink behavior at widths≥1100. The targeted recheck covers that boundary and mobile smoke. Backend, legal copy and other non-style source integrity are evidenced by the parent's unchanged-source comparison; this browser verification makes no backend-delivery claim.

The temporary viewport override was reset, QA tab1 marked for handoff in the verifier's separate IAB context, and exclusive CUA ownership explicitly returned to the parent. The user's original tab was untouched.
