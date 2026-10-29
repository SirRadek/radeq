# Visual and copy review — 2026-10-28

Scope: both confirmation HTML and plain-text variants; actual pixels in `preview-cs-desktop.png` (860 px) and `preview-en-mobile.png` (320 px). Read-only review of the approved proposal; no redesign or email sending.

## Blocking or material findings

None in the reviewed visual/copy scope. The proposal can proceed to integration with its approved design.

- Clear sequence: receipt → submitted content → next step → personal reply route. The inset recap distinguishes visitor text from the sender’s promises without competing with the heading.
- Cream, wine and ink match the documented website palette. Georgia/Arial and the restrained text mark make a coherent email adaptation; preserve the approved treatment.
- The 320 px English screenshot is readable, with no visible clipping or horizontal overflow. The recap is narrow but its 15 px/24 px text remains comfortable. Main copy is 16 px/25 px. The 12 px footer is visually subordinate and remains legible.
- CZ and EN convey equivalent meaning. Both clearly acknowledge receipt, promise a reply within one working day, and explain the next discussion. Neither claims an accepted order or successful purchase. Both plain-text versions preserve the recap, reply invitation and nonbinding footer.
- Useful accessibility foundations are present: language attributes, ordered H1/H2 headings, presentation tables, live text, and an underlined contact link. Calculated muted-text contrast against cream is above 6:1; wine against cream is above 9:1. Receipt meaning also appears in text, so it does not rely on color.

## Optional refinements

1. Point the English logo link to `https://radeq.cz/en/` instead of the Czech homepage. This is a small language-continuity improvement; use the same fixed locale-specific destination in the actual template/generator.
2. English “your message has arrived” is understandable but slightly mechanical. “I’ve received your message. I’ll take a look and reply within 1 working day.” is more natural. Apply identically to HTML and plain text if adopted.

No further visual changes recommended. “Dobrý den, [name],” avoids guessing Czech name inflection; a generic greeting would be another valid preference, not a defect requiring a change.

## Evidence limits

These are browser-rendered screenshots, not an Outlook/Gmail/Apple Mail compatibility result. Dark mode, screen-reader output and actual mail-client rendering were not exercised in this review. Truthful receipt language depends on integration retaining the successful lead-receipt trigger and functional Reply-To; those transport/backend requirements belong to the parent integration review.
