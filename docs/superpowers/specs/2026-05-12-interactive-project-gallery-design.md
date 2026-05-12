# Interactive Project Gallery Design

## Goal

Build an interactive project-proof section where visitors can click project cards and see working mini website examples inside the Radeq.cz homepage, with two lightweight shareable demo pages for the strongest examples.

## Decision

Use the approved **A + little B** direction.

- **A:** A homepage project gallery with one shared live workbench. Cards switch the active preview.
- **Little B:** Add full static demo routes for the first two strongest proof items: SEO repair and workflow prototype.

This keeps the site static-first, fast, and Cloudflare Pages friendly while making the portfolio feel working rather than decorative.

## Current Context

The current site is an Astro static site with React islands and bilingual Czech/English routes:

- `src/pages/index.astro`
- `src/pages/en/index.astro`
- `src/components/DemoBlocks.astro`
- `src/data/siteContent.ts`
- `src/styles/global.css`

There is also draft work in the tree:

- `src/components/DemoGallery.tsx`
- `src/components/DemoWorkbench.tsx`
- `src/layouts/DemoLayout.astro`
- `src/pages/demos/seo-audit.astro`

Those files are useful as a seed, but they are not the final design. The final design should keep the idea of demo metadata and a viewport toggle, but replace per-card iframe behavior with one shared preview and accessible controls.

## User Experience

The `#demos` section becomes an interactive proof workbench.

On desktop:

- Left side: project cards as keyboard-accessible buttons or tabs.
- Right side: one shared preview frame showing the selected mini-site.
- Top of preview: compact browser bar with label, desktop/mobile toggle, and link to full demo route when available.
- Bottom or side: proof checklist, event steps, and result summary.

On mobile:

- Cards become a horizontal or stacked selector.
- Preview appears below the selected card.
- Mobile toggle changes the embedded mini-site width without breaking the parent layout.

The section must still work without JavaScript: visitors see static proof cards and links to demo routes.

## Demo Types

### Component Mini-Sites

Default preview type. These are React components rendered inside the shared workbench, not external iframes.

Benefits:

- Faster than iframes.
- Inherits theme safely.
- Easier to test.
- No frame policy changes needed for most demos.

Initial component demos:

- `SeoAuditDemo`
- `WorkflowPrototypeDemo`
- `MaintenanceDemo`
- `AiAssistantDemo`
- `DataProcessingDemo`
- `DocumentConversionDemo`

### Static Demo Routes

Only the first two demos get full routes in the first build:

- `/demos/seo-audit`
- `/demos/workflow-prototype`

These routes are same-origin, synthetic, public-safe, and optionally `noindex` if the content should not rank separately.

They should use a focused demo layout, not the full marketing page shell.

## Architecture

### Data Model

Extend the demo item contract in `src/data/siteContent.ts` with typed fields:

- `id`: stable demo id.
- `name`: localized title.
- `metric`: optional proof label.
- `summary`: localized summary.
- `events`: localized proof steps.
- `result`: localized concise outcome.
- `preview`: typed preview metadata.
- `route`: optional full static demo route.

Preview metadata must use an allowlist. Do not store arbitrary component names or arbitrary iframe URLs in content.

Recommended shape:

```ts
type DemoPreviewId =
  | 'seo-audit'
  | 'workflow-prototype'
  | 'maintenance'
  | 'ai-assistant'
  | 'data-processing'
  | 'document-conversion';

interface DemoPreviewMeta {
  id: DemoPreviewId;
  urlLabel: string;
  features: Array<'mobile-toggle' | 'logs' | 'checks' | 'before-after'>;
}
```

### Components

Create or refactor into these units:

- `DemoGallery.tsx`: owns active demo id and viewport state.
- `DemoCard.tsx`: accessible card button/tab.
- `DemoWorkbench.tsx`: shared preview shell, browser bar, viewport controls, and result panel.
- `DemoPreviewRegistry.tsx`: maps allowed preview ids to preview components.
- `demo-previews/*.tsx`: one focused component per mini-site.
- `DemoRouteLayout.astro`: static route shell for full demo pages.

Keep `DemoBlocks.astro` only as a no-JS fallback or replace it with a wrapper that renders fallback markup plus hydrates the React gallery.

### Page Integration

Both localized routes use the same gallery component:

- `src/pages/index.astro`
- `src/pages/en/index.astro`

The component receives localized content from `siteContent`.

### Full Demo Routes

Create:

- `src/pages/demos/seo-audit.astro`
- `src/pages/demos/workflow-prototype.astro`

The routes should render the same underlying mini-site content as the homepage preview where practical, so visual behavior does not drift.

## Security and Privacy

All demos must be synthetic and public-safe.

Do not include:

- Private repository names.
- Local file paths.
- Real customer data.
- API keys, tokens, account ids, or database ids.
- Live logs or live admin data.

Avoid arbitrary iframe sources. The first implementation should not need external iframes.

If iframe demos are added later:

- Use only same-origin allowlisted routes.
- Mount only one active frame.
- Use `loading="lazy"`.
- Use a minimal `sandbox`.
- Do not combine `allow-scripts` and `allow-same-origin` unless the route is fully trusted and reviewed.
- Split frame headers so the parent site remains protected from external embedding.

## Cloudflare Fit

The feature must remain compatible with Cloudflare Pages static output.

The initial build should not require Workers, Durable Objects, Vercel Workflow, or server-side AI. Those are useful future tools, but this feature is a portfolio surface and should stay static.

Cloudflare Pages Functions for `/api/leads` remain unchanged.

## Accessibility

Cards must be keyboard reachable and activatable.

Requirements:

- Use `<button>` or tab semantics for interactive card selectors.
- Expose the active demo with `aria-selected` or equivalent state.
- Use `aria-live="polite"` for preview title/status changes.
- Keep visible focus states.
- Do not require hover for essential information.
- Respect `prefers-reduced-motion`.
- Ensure mobile/desktop toggle has accessible labels in Czech and English.

## Performance

The gallery should hydrate one React island, not one island per card.

Requirements:

- Mount only one active mini-site preview.
- Avoid loading Three.js or other heavy assets for this section.
- Use CSS and small React components for mini-sites.
- Avoid external network calls from demo previews.
- Keep full demo routes static.
- Avoid layout shift by using fixed aspect ratios and responsive constraints.

## Visual Direction

Use the existing Radeq.cz industrial interface language:

- Dense but readable cards.
- Dark surfaces with restrained accent color.
- Browser/workbench chrome as functional UI, not heavy decoration.
- Cards at 8px radius or less.
- No marketing hero treatment inside the gallery.
- Mini-sites should look like working pages/tools, not skeleton mockups.

Examples:

- SEO repair: before/after audit page with real-looking metadata checks.
- Workflow prototype: multi-step brief-to-handoff pipeline with status log.
- Maintenance: patch queue, health checks, update history.
- AI assistant: safe canned conversation, no live LLM call.
- Data processing: filterable table or import-clean-output flow.
- Document conversion: document-to-output transformation preview.

## Testing

Add tests before implementation.

Unit/content tests:

- Every demo id is unique per locale.
- Czech and English demo ids match.
- Preview ids are allowlisted.
- Route links are same-origin relative paths.
- Private identifier scan includes demo metadata and route labels.

Component behavior tests where practical:

- Default active demo is SEO repair.
- Activating a card changes the preview.
- Mobile toggle changes viewport state.
- Only one preview is active at a time.

Playwright tests:

- `#demos` hydrates.
- Cards are keyboard operable.
- Clicking SEO repair shows working preview.
- Full demo route link opens `/demos/seo-audit`.
- `/demos/seo-audit` and `/demos/workflow-prototype` return visible demo content.
- No console errors on homepage or demo routes.
- Reduced-motion mode still shows usable previews.

Verification commands:

- `npm run test`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`

## Implementation Notes

The current draft `DemoWorkbench.tsx` uses clickable `<article>` elements and per-card iframes. Replace that with accessible card controls and one shared workbench.

The current draft `siteContent.ts` stores `demo.source` as a string. Replace this with an allowlisted preview id and optional route path.

The current draft `src/pages/demos/seo-audit.astro` can be reused as content inspiration, but it should be brought under the final route layout and shared demo component approach.

## Out of Scope for First Build

- Live AI chat.
- Vercel Workflow or durable orchestration.
- Cloudflare Workers changes beyond existing Pages behavior.
- Real external iframe embeds.
- Admin dashboards with real data.
- More than two full demo routes.
- Production route promotion.

## Approval State

The user approved the direction as: **A + little B**.
