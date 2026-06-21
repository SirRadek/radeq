Here is the strategic design brainstorm for the radeq.cz redesign, synthesizing lepshee.com's premium confidence with the conversion needs of Czech SMBs.### 1. Hero
**Recommendation:** A centered, highly structured layout with a massive, ultra-bold headline (e.g., 90px+, weight 800). The signature visual anchor should not be an abstract orb, but a **precise, slow-moving geometric wireframe or blueprint graphic** (like a rotating isometric grid or a stylized "cog/node" system) placed symmetrically behind or just below the typography. The CTA should be a large, pill-shaped button with a solid accent color and a subtle magnetic/sliding arrow hover effect, placed dead center directly under a concise, confident subheadline.
**Why:** A centered, structured composition projects authority and "craftsman's precision" to traditional buyers, while the mechanical wireframe anchor signals technical competence and automation without feeling like generic SaaS art.### 2. Color
**Recommendation:** Keep the deep green (`#257a3e`) but pair it with a **warm-light, textural base (e.g., a dusty off-white or pale sand)** for 80% of the site, introducing **one massive dark "statement" block** (a near-black charcoal with a hint of green) specifically for the Pricing and Form sections. Do not switch to terracotta; the deep green projects growth, reliability, and financial safety (green = go/profit), which resonates perfectly with SMBs. 
**Why:** The warm-light base keeps the site approachable and highly legible for older or conservative buyers, while dropping the conversion sections into a dark, premium block gives them massive visual weight and creates the striking contrast lepshee achieves, without sacrificing overall readability.### 3. Typography
**Recommendation:** Use **Plus Jakarta Sans** (weights 800/900) for massive, tightly-tracked display headlines, paired with **Inter** (weight 400/500) for highly legible, airy body copy. 
**Why:** Plus Jakarta Sans is geometric and confident enough to mimic lepshee's bold aesthetic, but its subtle humanist curves prevent it from feeling too cold or aggressive, maintaining the trustworthy tone required for local service businesses.### 4. Motion
**Recommendation:** Implement three quiet motion moments: 
1. **Subtle Y-axis Reveal:** Sections and project cards glide up slightly (20px) and fade in smoothly (0.8s duration) as they enter the viewport via IntersectionObserver.
2. **Tactile Hover States:** Project cards and pricing tiers lift off the canvas slightly with a crisp drop-shadow expansion, avoiding generic scaling. 
3. **Ambient Anchor:** The hero's wireframe/blueprint visual anchor rotates or pulses extremely slowly on an infinite loop, providing a heartbeat without distracting from the copy.
**Why:** These CSS-driven micro-interactions signal that the site is a modern, living digital product engineered with care, proving the "craft" implicitly without overwhelming a conservative buyer with flashy, scroll-hijacked animations.### 5. Section Rhythm
**Recommendation:** To make 8 sections feel like 4, you must group them into **macro-blocks using aggressive padding (e.g., 160px top/bottom) and alternating background floods**. Group the Hero and Audience Band together
r on the warm-white base. Group Services and Showcase onto a pale, barely-there gray/green tint to signify "the work". Finally, group Pricing and the Contact Form into the single, dramatic dark charcoal block to signal "t
the commitment". Use oversized, asymmetrical typography to bridge the transitions.
**Why:** Treating sections as massive, cohesive chapters rather than isolated, stacked boxes creates the generous, uncrowded editorial rhythm of lepshee, forcing the user to breathe and focus on one core message at a tim
me.

### 6. Conversion Guardrails
**Recommendation:**
1. **Do not hide the price:** Avoid "Contact for Quote" or burying tiers; clear, upfront pricing is the ultimate trust signal for budget-conscious SMBs.
2. **Do not obscure the form:** Keep the inquiry form inline and highly visible inside the dark statement block; do not hide it behind a modal, an off-canvas menu, or a clever floating widget.
3. **Do not sacrifice contrast:** Avoid low-contrast gray-on-gray text or ultra-thin font weights in body copy; conservative buyers need immediate, effortless legibility to feel secure in their purchasing decision.

***

### The BoldestSingle Move Shortlist
*   **The Dark Conversion Anchor:** Pushing the entire Pricing + Form interaction into a singular, dramatic dark-mode block at the bottom of the page to instantly elevate the perceived value of the services.
*   **Massive Typography:** Scaling the headline typography up to 90px+ with an 800 weight, forcing you to write shorter, more confident, declarative copy.
*   **The Blueprint Visual:** Replacing generic stock photos or 3D blobs with a highly structured, slow-moving geometric wireframe that visually translates "automation" and "systems" to tradespeople.