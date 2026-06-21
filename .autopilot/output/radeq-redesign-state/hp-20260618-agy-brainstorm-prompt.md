# Brainstorm: radeq.cz homepage redesign direction

You are a senior brand/UX design strategist. Brainstorm only — no code. Output
structured prose. Be specific and opinionated; this feeds a design synthesis.

## Context

**radeq.cz** is a Czech one-person digital studio selling websites + automation
to Czech SMBs (small businesses, e.g. tradespeople, local services). The homepage
MUST convert: it shows transparent **pricing** and a structured **inquiry form**.
Audience is conservative Czech SMB buyers — trust and clarity matter more than
avant-garde. Current stack: Astro + React islands + Cloudflare. Current homepage
looks generic/templated (default neutral palette, timid headings, compressed
spacing). Sections today: hero, audience band, services, selected systems,
showcase, pricing, about/proof, contact terminal.

**lepshee.com** is the aspirational reference: black canvas, one huge confident
headline, ultra-bold geometric type (~100px, weight 800–900), a single vivid
accent (neon green + a purple/magenta gradient orb), generous whitespace, subtle
scroll-triggered motion, project cards with real UI screenshots, confident
brand-centric copy (statements not questions), only ~4 sections. It can afford
zero pricing/zero form because it sells inspiration, not conversion.

## The tension to solve

How do we transplant lepshee's **professional craft, playful confidence, and
"made by a real craftsperson" feeling** onto radeq — WITHOUT losing conversion
(must keep visible pricing + inquiry form + outcome-focused SMB copy + Czech-
conservative trust signals)? The result must be a clear, striking leap from
today's generic feel, while staying "řemeslná preciznost" (craftsman's precision):
structured, precise, airy, quietly confident.

## Brainstorm these, concretely

1. **Hero**: layout (left vs centered), headline scale/weight, what the single
   "signature visual anchor" should be for radeq (NOT a copy of lepshee's orb),
   and how to keep a CTA above the fold without it feeling templated.
2. **Color**: should radeq stay warm-light (sand/beige) or introduce one dark
   "statement" block? Pick ONE accent strategy. Owner currently has a green
   palette (#257a3e) on the live `new` branch — argue keep-green vs a warmer
   craft accent (e.g. terracotta), and why, for THIS audience.
3. **Typography**: one display-font direction that signals craft + confidence
   but stays legible for conservative SMB readers (free/Google fonts only).
4. **Motion**: 2–3 specific, restrained motion moments that read as "alive and
   crafted" not "flashy", implementable with CSS + IntersectionObserver.
5. **Section rhythm**: how to make ~6–8 conversion sections feel as intentional
   and uncrowded as lepshee's 4, via spacing/alternating backgrounds/anchors.
6. **Conversion guardrails**: name 3 things we must NOT break from lepshee-envy
   (where chasing the aesthetic would hurt SMB conversion).

## Output format

Markdown with the 6 numbered headings above. Under each, give a concrete
recommendation + one sentence of WHY for this specific audience. End with a
3-bullet "boldest single move" shortlist. No secrets, no code, no logs.
