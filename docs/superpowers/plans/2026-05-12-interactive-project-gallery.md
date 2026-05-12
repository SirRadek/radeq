# Interactive Project Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the static proof-card section into an interactive project gallery with a shared working mini-site preview and two static demo routes.

**Architecture:** Keep the feature static-first. Store demo metadata in a typed allowlist, render one hydrated React island for the gallery, mount one active mini-site preview at a time, and add two same-origin static demo routes for shareable proof pages.

**Tech Stack:** Astro 6 static output, React 19 islands, TypeScript strict mode, Tailwind 4 via global CSS, Vitest, Playwright, Cloudflare Pages.

---

## Pre-Execution Notes

The worktree already contains uncommitted draft files:

- `src/data/siteContent.ts`
- `src/components/DemoGallery.tsx`
- `src/components/DemoWorkbench.tsx`
- `src/layouts/DemoLayout.astro`
- `src/pages/demos/seo-audit.astro`

Treat those as user/draft work. Do not revert them. Refactor them into the final design.

Do not commit `.superpowers/`; it is visual-companion state.

Do not install AI Elements or Vercel Workflow for this feature. The approved design is static and does not render live AI-generated text or durable server workflows.

## File Structure

Create:

- `src/data/demoPreviews.ts`: typed allowlist for demo ids, features, and routes.
- `src/components/DemoCard.tsx`: accessible project selector card.
- `src/components/DemoGallery.tsx`: section island, active demo state, viewport state.
- `src/components/DemoWorkbench.tsx`: shared preview chrome, controls, result panel.
- `src/components/DemoPreviewRegistry.tsx`: allowlisted id-to-component renderer.
- `src/components/demo-previews/SeoAuditPreview.tsx`
- `src/components/demo-previews/WorkflowPrototypePreview.tsx`
- `src/components/demo-previews/MaintenancePreview.tsx`
- `src/components/demo-previews/AiAssistantPreview.tsx`
- `src/components/demo-previews/DataProcessingPreview.tsx`
- `src/components/demo-previews/DocumentConversionPreview.tsx`
- `src/layouts/DemoRouteLayout.astro`: focused route shell for `/demos/*`.
- `src/pages/demos/workflow-prototype.astro`

Modify:

- `src/data/siteContent.ts`: final demo metadata shape.
- `src/pages/index.astro`: use `DemoGallery` instead of `DemoBlocks`.
- `src/pages/en/index.astro`: use `DemoGallery` instead of `DemoBlocks`.
- `src/pages/demos/seo-audit.astro`: refactor draft route under final layout.
- `src/styles/global.css`: shared gallery, preview, route styles.
- `tests/i18n-content.test.ts`: content contract and privacy tests.
- `tests/smoke.spec.ts`: gallery interaction e2e.
- `tests/i18n.spec.ts`: optional route visibility for English page.

Leave in place unless unused cleanup is explicitly part of a task:

- `src/components/DemoBlocks.astro`

---

### Task 1: Demo Metadata Contract

**Files:**
- Create: `src/data/demoPreviews.ts`
- Modify: `src/data/siteContent.ts`
- Modify: `tests/i18n-content.test.ts`

- [ ] **Step 1: Write failing contract tests**

Add imports to `tests/i18n-content.test.ts`:

```ts
import {
  demoPreviewFeatures,
  demoPreviewIds,
  demoPreviewRoutes,
  type DemoPreviewFeature,
  type DemoPreviewId,
} from '../src/data/demoPreviews';
```

Add these tests at the end of the file:

```ts
it('uses allowlisted interactive demo preview metadata', () => {
  const expectedIds = [...demoPreviewIds];

  for (const locale of supportedLocales) {
    const items = siteContent[locale as Locale].demos.items;
    const ids = items.map((item) => item.id);

    expect(ids).toEqual(expectedIds);
    expect(new Set(ids).size).toBe(items.length);

    for (const item of items) {
      expect(demoPreviewIds).toContain(item.id as DemoPreviewId);
      expect(item.preview.id).toBe(item.id);
      expect(item.preview.urlLabel).toMatch(/^radeq\.cz\//);
      expect(item.result.length).toBeGreaterThan(12);

      for (const feature of item.preview.features) {
        expect(demoPreviewFeatures).toContain(feature as DemoPreviewFeature);
      }

      if (item.route) {
        expect(demoPreviewRoutes).toContain(item.route);
        expect(item.route).toMatch(/^\/demos\/[a-z0-9-]+$/);
      }
    }
  }
});

it('keeps demo ids and route availability aligned across locales', () => {
  const csItems = siteContent.cs.demos.items;
  const enItems = siteContent.en.demos.items;

  expect(enItems.map((item) => item.id)).toEqual(csItems.map((item) => item.id));
  expect(enItems.map((item) => item.route ?? null)).toEqual(csItems.map((item) => item.route ?? null));
});

it('includes interactive demo metadata in the private-string scan', () => {
  const forbiddenPublicStrings = [
    'SirRadek',
    '.codex-run',
    'seo-fix-pack',
    'archviz-workbench',
    'webhook-gateway',
    'scrapeflow',
    'autopilot-orchestration',
    'radeq-website',
  ];

  const publicDemoTextParts: string[] = [];

  for (const locale of supportedLocales) {
    for (const item of siteContent[locale as Locale].demos.items) {
      publicDemoTextParts.push(
        item.id,
        item.name,
        item.metric,
        item.summary,
        item.result,
        item.preview.urlLabel,
        item.route ?? '',
        ...item.events,
        ...item.preview.features,
      );
    }
  }

  const publicDemoText = publicDemoTextParts.join('\n').toLowerCase();

  for (const forbidden of forbiddenPublicStrings) {
    expect(publicDemoText).not.toContain(forbidden.toLowerCase());
  }
});
```

Then update the existing private-string test so the `publicDemoTextParts.push` call includes:

```ts
publicDemoTextParts.push(
  item.id,
  item.name,
  item.metric,
  item.summary,
  item.result,
  item.preview.urlLabel,
  item.route ?? '',
  ...item.events,
  ...item.preview.features,
);
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test -- tests/i18n-content.test.ts
```

Expected: FAIL because `src/data/demoPreviews.ts` does not exist and the current `SiteContent['demos']['items']` shape still uses draft `demo.source` metadata.

- [ ] **Step 3: Create typed allowlist**

Create `src/data/demoPreviews.ts`:

```ts
export const demoPreviewIds = [
  'seo-audit',
  'workflow-prototype',
  'maintenance',
  'ai-assistant',
  'data-processing',
  'document-conversion',
] as const;

export type DemoPreviewId = (typeof demoPreviewIds)[number];

export const demoPreviewFeatures = ['mobile-toggle', 'logs', 'checks', 'before-after'] as const;

export type DemoPreviewFeature = (typeof demoPreviewFeatures)[number];

export const demoPreviewRoutes = ['/demos/seo-audit', '/demos/workflow-prototype'] as const;

export type DemoPreviewRoute = (typeof demoPreviewRoutes)[number];

export interface DemoPreviewMeta {
  id: DemoPreviewId;
  urlLabel: string;
  features: DemoPreviewFeature[];
}

export function isDemoPreviewId(value: string): value is DemoPreviewId {
  return demoPreviewIds.includes(value as DemoPreviewId);
}
```

- [ ] **Step 4: Replace demo item interface**

In `src/data/siteContent.ts`, add this import after the locales import:

```ts
import type { DemoPreviewFeature, DemoPreviewId, DemoPreviewRoute } from './demoPreviews';
```

Replace the `demos` item type with:

```ts
demos: {
  sectionCode: string;
  title: string;
  lead: string;
  controls: {
    desktopLabel: string;
    mobileLabel: string;
    openRouteLabel: string;
    resultLabel: string;
    eventsLabel: string;
    activatePrefix: string;
    selectedLabel: string;
  };
  items: {
    id: DemoPreviewId;
    name: string;
    metric: string;
    summary: string;
    result: string;
    events: string[];
    preview: {
      id: DemoPreviewId;
      urlLabel: string;
      features: DemoPreviewFeature[];
    };
    route?: DemoPreviewRoute;
  }[];
};
```

- [ ] **Step 5: Replace Czech demo metadata**

For `siteContent.cs.demos`, add:

```ts
controls: {
  desktopLabel: 'Desktop',
  mobileLabel: 'Mobil',
  openRouteLabel: 'Otevřít celé demo',
  resultLabel: 'Výsledek',
  eventsLabel: 'Kontrolní kroky',
  activatePrefix: 'Zobrazit projekt',
  selectedLabel: 'Vybraný projekt',
},
```

Replace each current draft `demo` metadata object with these final fields:

```ts
result: 'Přehled ukazuje rozdíl před a po zásahu a co přesně se kontrolovalo.',
preview: {
  id: 'seo-audit',
  urlLabel: 'radeq.cz/demos/seo-audit',
  features: ['mobile-toggle', 'checks', 'before-after'],
},
route: '/demos/seo-audit',
```

```ts
result: 'Brief se mění na jasný pracovní postup, kontrolní log a předatelný výstup.',
preview: {
  id: 'workflow-prototype',
  urlLabel: 'radeq.cz/demos/workflow-prototype',
  features: ['mobile-toggle', 'logs', 'checks'],
},
route: '/demos/workflow-prototype',
```

```ts
result: 'Ukázka simuluje péči o web: rychlá oprava, kontrola zdraví a stručný předávací záznam.',
preview: {
  id: 'maintenance',
  urlLabel: 'radeq.cz/support/check',
  features: ['mobile-toggle', 'checks', 'logs'],
},
```

```ts
result: 'Bezpečný statický rozhovor ukazuje, jak může asistent třídit dotazy bez živého LLM volání.',
preview: {
  id: 'ai-assistant',
  urlLabel: 'radeq.cz/ai/assistant',
  features: ['mobile-toggle', 'logs'],
},
```

```ts
result: 'Data projdou vstupem, kontrolou polí, filtrem a výstupem, který je čitelný pro rozhodnutí.',
preview: {
  id: 'data-processing',
  urlLabel: 'radeq.cz/data/filter',
  features: ['mobile-toggle', 'checks'],
},
```

```ts
result: 'Ukázka převádí neuspořádaný podklad na čistý výstup s kontrolou výsledku.',
preview: {
  id: 'document-conversion',
  urlLabel: 'radeq.cz/tools/convert',
  features: ['mobile-toggle', 'checks'],
},
```

- [ ] **Step 6: Replace English demo metadata**

For `siteContent.en.demos`, add:

```ts
controls: {
  desktopLabel: 'Desktop',
  mobileLabel: 'Mobile',
  openRouteLabel: 'Open full demo',
  resultLabel: 'Result',
  eventsLabel: 'Verification steps',
  activatePrefix: 'Show project',
  selectedLabel: 'Selected project',
},
```

Replace each current draft `demo` metadata object with these final fields:

```ts
result: 'The view shows the before/after gap and the exact checks that changed the page.',
preview: {
  id: 'seo-audit',
  urlLabel: 'radeq.cz/demos/seo-audit',
  features: ['mobile-toggle', 'checks', 'before-after'],
},
route: '/demos/seo-audit',
```

```ts
result: 'The brief becomes a clear working sequence, verification log, and handoff output.',
preview: {
  id: 'workflow-prototype',
  urlLabel: 'radeq.cz/demos/workflow-prototype',
  features: ['mobile-toggle', 'logs', 'checks'],
},
route: '/demos/workflow-prototype',
```

```ts
result: 'The demo simulates website care: a quick fix, health check, and short handoff note.',
preview: {
  id: 'maintenance',
  urlLabel: 'radeq.cz/support/check',
  features: ['mobile-toggle', 'checks', 'logs'],
},
```

```ts
result: 'A safe static conversation shows how an assistant can triage requests without a live LLM call.',
preview: {
  id: 'ai-assistant',
  urlLabel: 'radeq.cz/ai/assistant',
  features: ['mobile-toggle', 'logs'],
},
```

```ts
result: 'Data moves through intake, field checks, filtering, and an output that is ready to read.',
preview: {
  id: 'data-processing',
  urlLabel: 'radeq.cz/data/filter',
  features: ['mobile-toggle', 'checks'],
},
```

```ts
result: 'The demo turns messy source material into a clean output with visible result checks.',
preview: {
  id: 'document-conversion',
  urlLabel: 'radeq.cz/tools/convert',
  features: ['mobile-toggle', 'checks'],
},
```

- [ ] **Step 7: Run contract tests**

Run:

```bash
npm run test -- tests/i18n-content.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/data/demoPreviews.ts src/data/siteContent.ts tests/i18n-content.test.ts
git commit -m "feat: add interactive demo metadata contract"
```

---

### Task 2: Shared Interactive Gallery

**Files:**
- Create: `src/components/DemoCard.tsx`
- Create: `src/components/DemoPreviewRegistry.tsx`
- Create: `src/components/demo-previews/SeoAuditPreview.tsx`
- Create: `src/components/demo-previews/WorkflowPrototypePreview.tsx`
- Create: `src/components/demo-previews/MaintenancePreview.tsx`
- Create: `src/components/demo-previews/AiAssistantPreview.tsx`
- Create: `src/components/demo-previews/DataProcessingPreview.tsx`
- Create: `src/components/demo-previews/DocumentConversionPreview.tsx`
- Modify: `src/components/DemoGallery.tsx`
- Modify: `src/components/DemoWorkbench.tsx`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `tests/smoke.spec.ts`

- [ ] **Step 1: Write failing Playwright test for gallery behavior**

Add this test to `tests/smoke.spec.ts` after `homepage core flow works`:

```ts
test('interactive project gallery switches one shared working preview', async ({ page }) => {
  await page.goto('/');

  const gallery = page.locator('#demos');
  await expect(gallery).toHaveAttribute('data-hydrated', 'true');
  await expect(gallery.getByRole('heading', { name: 'Důkazy z projektů, ne jen seznam služeb.' })).toBeVisible();

  const seoTab = gallery.getByRole('tab', { name: /SEO oprava před a po/ });
  const workflowTab = gallery.getByRole('tab', { name: /Specializovaný workflow prototyp/ });

  await expect(seoTab).toHaveAttribute('aria-selected', 'true');
  await expect(gallery.locator('[data-demo-workbench]')).toHaveAttribute('data-active-demo', 'seo-audit');
  await expect(gallery.getByText('SEO_AUDIT_REPORT_V1')).toBeVisible();
  await expect(gallery.getByText('BASELINE')).toBeVisible();
  await expect(gallery.getByText('OPTIMIZED')).toBeVisible();

  await workflowTab.click();
  await expect(workflowTab).toHaveAttribute('aria-selected', 'true');
  await expect(gallery.locator('[data-demo-workbench]')).toHaveAttribute('data-active-demo', 'workflow-prototype');
  await expect(gallery.getByText('WORKFLOW_PIPELINE_V1')).toBeVisible();
  await expect(gallery.getByText('Brief intake')).toBeVisible();
  await expect(gallery.locator('[data-demo-preview]')).toHaveCount(1);

  await gallery.getByRole('button', { name: 'Mobil' }).click();
  await expect(gallery.locator('[data-demo-workbench]')).toHaveAttribute('data-viewport', 'mobile');

  await gallery.getByRole('link', { name: 'Otevřít celé demo' }).click();
  await expect(page).toHaveURL(/\/demos\/workflow-prototype$/);
});
```

Add this keyboard test:

```ts
test('interactive project gallery is keyboard operable', async ({ page }) => {
  await page.goto('/');

  const gallery = page.locator('#demos');
  await gallery.getByRole('tab', { name: /SEO oprava před a po/ }).focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(gallery.getByRole('tab', { name: /Specializovaný workflow prototyp/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(gallery.locator('[data-demo-workbench]')).toHaveAttribute('data-active-demo', 'workflow-prototype');
});
```

- [ ] **Step 2: Run e2e test to verify failure**

Run:

```bash
npm run test:e2e -- tests/smoke.spec.ts
```

Expected: FAIL because the current pages still render `DemoBlocks.astro` and no hydrated `#demos[data-hydrated="true"]` exists.

- [ ] **Step 3: Implement `DemoCard.tsx`**

Create `src/components/DemoCard.tsx`:

```tsx
import type { KeyboardEvent } from 'react';
import type { SiteContent } from '../data/siteContent';

type DemoItem = SiteContent['demos']['items'][number];

interface Props {
  demo: DemoItem;
  index: number;
  isActive: boolean;
  controls: SiteContent['demos']['controls'];
  panelId: string;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onActivate: (id: DemoItem['id']) => void;
  onMove: (direction: -1 | 1) => void;
}

export default function DemoCard({ demo, index, isActive, controls, panelId, buttonRef, onActivate, onMove }: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      onMove(1);
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      onMove(-1);
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      id={`demo-tab-${demo.id}`}
      className={`demo-selector${isActive ? ' is-active' : ''}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      data-cat-platform={`demo-card-${index + 1}`}
      onClick={() => onActivate(demo.id)}
      onKeyDown={handleKeyDown}
    >
      <span className="demo-selector__meta">{demo.metric || `${index + 1}`}</span>
      <span className="demo-selector__title">{demo.name}</span>
      <span className="demo-selector__summary">{demo.summary}</span>
      <span className="demo-selector__state">{isActive ? controls.selectedLabel : `${controls.activatePrefix}`}</span>
    </button>
  );
}
```

- [ ] **Step 4: Implement preview components**

Create `src/components/demo-previews/SeoAuditPreview.tsx`:

```tsx
export default function SeoAuditPreview() {
  return (
    <div className="mini-site mini-site--seo" data-demo-preview="seo-audit">
      <header className="mini-site__header">
        <p>SEO_AUDIT_REPORT_V1</p>
        <h3>Metadata repair, structured data, and measurable checks.</h3>
      </header>
      <div className="mini-compare">
        <section>
          <strong>BASELINE</strong>
          <dl>
            <div><dt>Title</dt><dd>Generic home label</dd></div>
            <div><dt>Description</dt><dd>Missing</dd></div>
            <div><dt>H1</dt><dd>Duplicated</dd></div>
            <div><dt>SEO score</dt><dd>64/100</dd></div>
          </dl>
        </section>
        <section>
          <strong>OPTIMIZED</strong>
          <dl>
            <div><dt>Title</dt><dd>Offer-led search title</dd></div>
            <div><dt>Description</dt><dd>155 chars</dd></div>
            <div><dt>Schema</dt><dd>Service JSON-LD</dd></div>
            <div><dt>SEO score</dt><dd>100/100</dd></div>
          </dl>
        </section>
      </div>
      <ul className="mini-checks">
        <li>canonical.check: OK</li>
        <li>sitemap.xml: OK</li>
        <li>og:image: OK</li>
        <li>robots.txt: OK</li>
      </ul>
    </div>
  );
}
```

Create `src/components/demo-previews/WorkflowPrototypePreview.tsx`:

```tsx
export default function WorkflowPrototypePreview() {
  return (
    <div className="mini-site mini-site--workflow" data-demo-preview="workflow-prototype">
      <header className="mini-site__header">
        <p>WORKFLOW_PIPELINE_V1</p>
        <h3>Private brief converted into a safe execution packet.</h3>
      </header>
      <ol className="mini-pipeline">
        <li><span>01</span><strong>Brief intake</strong><small>Scope, risk, and public-safe material separated.</small></li>
        <li><span>02</span><strong>Plan build</strong><small>Tasks, acceptance checks, and owner boundaries defined.</small></li>
        <li><span>03</span><strong>Verification</strong><small>Tests and screenshots attached to the handoff.</small></li>
        <li><span>04</span><strong>Delivery</strong><small>Readable output without private source exposure.</small></li>
      </ol>
      <div className="mini-log" aria-label="Workflow log">
        <p>[09:12] brief.sanitized = true</p>
        <p>[09:14] prompt_pack.generated = true</p>
        <p>[09:19] checks.passed = 8</p>
      </div>
    </div>
  );
}
```

Create `src/components/demo-previews/MaintenancePreview.tsx`:

```tsx
export default function MaintenancePreview() {
  return (
    <div className="mini-site mini-site--maintenance" data-demo-preview="maintenance">
      <header className="mini-site__header">
        <p>CARE_QUEUE</p>
        <h3>Small fixes, health checks, and handoff notes in one view.</h3>
      </header>
      <div className="mini-status-grid">
        <article><strong>Speed</strong><span>Stable</span></article>
        <article><strong>Content</strong><span>Updated</span></article>
        <article><strong>Backup</strong><span>Fresh</span></article>
      </div>
      <ul className="mini-checks">
        <li>Broken link repaired</li>
        <li>Hero copy updated</li>
        <li>Image size checked</li>
        <li>Security baseline reviewed</li>
      </ul>
    </div>
  );
}
```

Create `src/components/demo-previews/AiAssistantPreview.tsx`:

```tsx
export default function AiAssistantPreview() {
  return (
    <div className="mini-site mini-site--assistant" data-demo-preview="ai-assistant">
      <header className="mini-site__header">
        <p>SAFE_ASSISTANT_FLOW</p>
        <h3>Static assistant demo with approved responses only.</h3>
      </header>
      <div className="mini-chat">
        <p><strong>Visitor</strong><span>Need a request page for a new service.</span></p>
        <p><strong>Assistant</strong><span>I can classify this as a landing page with lead capture and proof blocks.</span></p>
        <p><strong>System</strong><span>Route: quote form · Risk: low · Human follow-up: yes</span></p>
      </div>
    </div>
  );
}
```

Create `src/components/demo-previews/DataProcessingPreview.tsx`:

```tsx
export default function DataProcessingPreview() {
  return (
    <div className="mini-site mini-site--data" data-demo-preview="data-processing">
      <header className="mini-site__header">
        <p>DATA_FILTER_VIEW</p>
        <h3>Raw form entries become a usable decision table.</h3>
      </header>
      <table className="mini-table">
        <thead><tr><th>Lead</th><th>Status</th><th>Next step</th></tr></thead>
        <tbody>
          <tr><td>Studio</td><td>Valid</td><td>Quote</td></tr>
          <tr><td>Retail</td><td>Needs URL</td><td>Clarify</td></tr>
          <tr><td>SaaS</td><td>High fit</td><td>Demo call</td></tr>
        </tbody>
      </table>
    </div>
  );
}
```

Create `src/components/demo-previews/DocumentConversionPreview.tsx`:

```tsx
export default function DocumentConversionPreview() {
  return (
    <div className="mini-site mini-site--documents" data-demo-preview="document-conversion">
      <header className="mini-site__header">
        <p>CONVERSION_PREVIEW</p>
        <h3>Source material transformed into a structured web-ready output.</h3>
      </header>
      <div className="mini-conversion">
        <section><strong>Input</strong><p>Notes, tables, screenshots, inconsistent headings.</p></section>
        <section><strong>Output</strong><p>Clean page sections, table schema, PDF-ready summary.</p></section>
      </div>
      <ul className="mini-checks">
        <li>Headings normalized</li>
        <li>Fields checked</li>
        <li>Output reviewed</li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 5: Implement `DemoPreviewRegistry.tsx`**

Create `src/components/DemoPreviewRegistry.tsx`:

```tsx
import type { DemoPreviewId } from '../data/demoPreviews';
import AiAssistantPreview from './demo-previews/AiAssistantPreview';
import DataProcessingPreview from './demo-previews/DataProcessingPreview';
import DocumentConversionPreview from './demo-previews/DocumentConversionPreview';
import MaintenancePreview from './demo-previews/MaintenancePreview';
import SeoAuditPreview from './demo-previews/SeoAuditPreview';
import WorkflowPrototypePreview from './demo-previews/WorkflowPrototypePreview';

interface Props {
  id: DemoPreviewId;
}

export default function DemoPreviewRegistry({ id }: Props) {
  switch (id) {
    case 'seo-audit':
      return <SeoAuditPreview />;
    case 'workflow-prototype':
      return <WorkflowPrototypePreview />;
    case 'maintenance':
      return <MaintenancePreview />;
    case 'ai-assistant':
      return <AiAssistantPreview />;
    case 'data-processing':
      return <DataProcessingPreview />;
    case 'document-conversion':
      return <DocumentConversionPreview />;
  }
}
```

- [ ] **Step 6: Implement shared workbench**

Replace `src/components/DemoWorkbench.tsx` with:

```tsx
import type { SiteContent } from '../data/siteContent';
import DemoPreviewRegistry from './DemoPreviewRegistry';

type DemoItem = SiteContent['demos']['items'][number];
type Viewport = 'desktop' | 'mobile';

interface Props {
  demo: DemoItem;
  viewport: Viewport;
  controls: SiteContent['demos']['controls'];
  panelId: string;
  onViewportChange: (viewport: Viewport) => void;
}

export default function DemoWorkbench({ demo, viewport, controls, panelId, onViewportChange }: Props) {
  return (
    <article
      id={panelId}
      className="demo-workbench"
      role="tabpanel"
      aria-labelledby={`demo-tab-${demo.id}`}
      aria-live="polite"
      data-demo-workbench
      data-active-demo={demo.id}
      data-viewport={viewport}
      data-cat-platform="demo-workbench"
    >
      <div className="demo-browser-bar">
        <div className="demo-browser-bar__url">
          <span aria-hidden="true"></span>
          <strong>{demo.preview.urlLabel}</strong>
        </div>
        <div className="demo-browser-bar__actions" aria-label="Preview viewport">
          {demo.preview.features.includes('mobile-toggle') ? (
            <>
              <button
                type="button"
                className={viewport === 'desktop' ? 'is-active' : ''}
                aria-pressed={viewport === 'desktop'}
                onClick={() => onViewportChange('desktop')}
              >
                {controls.desktopLabel}
              </button>
              <button
                type="button"
                className={viewport === 'mobile' ? 'is-active' : ''}
                aria-pressed={viewport === 'mobile'}
                onClick={() => onViewportChange('mobile')}
              >
                {controls.mobileLabel}
              </button>
            </>
          ) : null}
          {demo.route ? <a href={demo.route}>{controls.openRouteLabel}</a> : null}
        </div>
      </div>

      <div className="demo-viewport-shell">
        <div className="demo-viewport">
          <DemoPreviewRegistry id={demo.preview.id} />
        </div>
      </div>

      <div className="demo-result-grid">
        <section>
          <h3>{controls.resultLabel}</h3>
          <p>{demo.result}</p>
        </section>
        <section>
          <h3>{controls.eventsLabel}</h3>
          <ol>
            {demo.events.map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
```

- [ ] **Step 7: Implement `DemoGallery.tsx`**

Replace `src/components/DemoGallery.tsx` with:

```tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SiteContent } from '../data/siteContent';
import DemoCard from './DemoCard';
import DemoWorkbench from './DemoWorkbench';

interface Props {
  content: SiteContent['demos'];
}

type DemoId = SiteContent['demos']['items'][number]['id'];
type Viewport = 'desktop' | 'mobile';

export default function DemoGallery({ content }: Props) {
  const firstDemo = content.items[0];
  const [activeDemoId, setActiveDemoId] = useState<DemoId>(firstDemo.id);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [hydrated, setHydrated] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = 'demo-workbench-panel';

  useEffect(() => {
    setHydrated(true);
  }, []);

  const activeIndex = Math.max(
    0,
    content.items.findIndex((item) => item.id === activeDemoId),
  );

  const activeDemo = useMemo(() => content.items[activeIndex] ?? firstDemo, [activeIndex, content.items, firstDemo]);

  function activateDemo(id: DemoId) {
    setActiveDemoId(id);
  }

  function moveSelection(direction: -1 | 1) {
    const nextIndex = (activeIndex + direction + content.items.length) % content.items.length;
    const nextDemo = content.items[nextIndex];
    setActiveDemoId(nextDemo.id);
    requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  }

  return (
    <section className="demo-section demo-section--interactive" id="demos" aria-labelledby="demo-title" data-hydrated={hydrated ? 'true' : 'false'}>
      <div className="section-heading">
        {content.sectionCode ? <p className="section-code">{content.sectionCode}</p> : null}
        <h2 id="demo-title">{content.title}</h2>
        <p>{content.lead}</p>
      </div>

      <div className="demo-gallery">
        <div className="demo-selector-list" role="tablist" aria-label={content.title}>
          {content.items.map((demo, index) => (
            <DemoCard
              key={demo.id}
              demo={demo}
              index={index}
              isActive={activeDemo.id === demo.id}
              controls={content.controls}
              panelId={panelId}
              buttonRef={(node) => {
                tabRefs.current[index] = node;
              }}
              onActivate={activateDemo}
              onMove={moveSelection}
            />
          ))}
        </div>

        <DemoWorkbench
          demo={activeDemo}
          viewport={viewport}
          controls={content.controls}
          panelId={panelId}
          onViewportChange={setViewport}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Integrate in Astro pages**

In `src/pages/index.astro`, replace:

```astro
import DemoBlocks from '../components/DemoBlocks.astro';
```

with:

```astro
import DemoGallery from '../components/DemoGallery';
```

Replace:

```astro
<DemoBlocks content={content.demos} />
```

with:

```astro
<DemoGallery content={content.demos} client:visible={{ rootMargin: '200px' }} />
```

In `src/pages/en/index.astro`, replace:

```astro
import DemoBlocks from '../../components/DemoBlocks.astro';
```

with:

```astro
import DemoGallery from '../../components/DemoGallery';
```

Replace:

```astro
<DemoBlocks content={content.demos} />
```

with:

```astro
<DemoGallery content={content.demos} client:visible={{ rootMargin: '200px' }} />
```

- [ ] **Step 9: Run targeted typecheck and e2e**

Run:

```bash
npm run typecheck
npm run test:e2e -- tests/smoke.spec.ts
```

Expected after implementation: both commands PASS. If the gallery does not hydrate before assertion, scroll `#demos` into view in the test before expecting `data-hydrated="true"`.

- [ ] **Step 10: Commit**

```bash
git add src/components/DemoCard.tsx src/components/DemoGallery.tsx src/components/DemoWorkbench.tsx src/components/DemoPreviewRegistry.tsx src/components/demo-previews src/pages/index.astro src/pages/en/index.astro tests/smoke.spec.ts
git commit -m "feat: add shared interactive demo gallery"
```

---

### Task 3: Static Demo Routes

**Files:**
- Create: `src/layouts/DemoRouteLayout.astro`
- Modify: `src/pages/demos/seo-audit.astro`
- Create: `src/pages/demos/workflow-prototype.astro`
- Modify: `tests/smoke.spec.ts`

- [ ] **Step 1: Write failing e2e route test**

Add this test to `tests/smoke.spec.ts`:

```ts
test('static demo routes render shareable proof pages', async ({ page }) => {
  await page.goto('/demos/seo-audit');
  await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
  await expect(page.getByRole('heading', { name: /SEO_AUDIT_REPORT_V1/ })).toBeVisible();
  await expect(page.getByText('BASELINE')).toBeVisible();
  await expect(page.getByText('OPTIMIZED')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');

  await page.goto('/demos/workflow-prototype');
  await expect(page.getByRole('heading', { name: /WORKFLOW_PIPELINE_V1/ })).toBeVisible();
  await expect(page.getByText('Brief intake')).toBeVisible();
  await expect(page.getByText('Delivery')).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm run test:e2e -- tests/smoke.spec.ts
```

Expected: FAIL because `/demos/workflow-prototype` does not exist and `/demos/seo-audit` is still draft-shaped.

- [ ] **Step 3: Create route layout**

Create `src/layouts/DemoRouteLayout.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  lang?: 'cs' | 'en';
}

const { title, description, lang = 'cs' } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | Radeq.cz demo</title>
    <meta name="description" content={description} />
    <meta name="robots" content="noindex, nofollow" />
  </head>
  <body>
    <main class="demo-route-shell">
      <a class="demo-route-back" href="/#demos">Zpět na projekty</a>
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 4: Refactor SEO route**

Replace `src/pages/demos/seo-audit.astro` with:

```astro
---
import SeoAuditPreview from '../../components/demo-previews/SeoAuditPreview';
import DemoRouteLayout from '../../layouts/DemoRouteLayout.astro';
---

<DemoRouteLayout
  title="SEO audit before and after"
  description="Synthetic Radeq.cz proof demo showing SEO baseline and optimized checks."
>
  <section class="demo-route-panel" aria-labelledby="seo-demo-title">
    <p class="section-code">PROOF 01</p>
    <h1 id="seo-demo-title">SEO_AUDIT_REPORT_V1</h1>
    <p>Static synthetic demo. No client data, no private repositories, no live external calls.</p>
    <SeoAuditPreview />
  </section>
</DemoRouteLayout>
```

- [ ] **Step 5: Add workflow route**

Create `src/pages/demos/workflow-prototype.astro`:

```astro
---
import WorkflowPrototypePreview from '../../components/demo-previews/WorkflowPrototypePreview';
import DemoRouteLayout from '../../layouts/DemoRouteLayout.astro';
---

<DemoRouteLayout
  title="Workflow prototype demo"
  description="Synthetic Radeq.cz proof demo showing a safe brief-to-handoff workflow prototype."
>
  <section class="demo-route-panel" aria-labelledby="workflow-demo-title">
    <p class="section-code">PROOF 02</p>
    <h1 id="workflow-demo-title">WORKFLOW_PIPELINE_V1</h1>
    <p>Static synthetic demo. It shows the shape of the process without exposing private source material.</p>
    <WorkflowPrototypePreview />
  </section>
</DemoRouteLayout>
```

- [ ] **Step 6: Run route tests**

Run:

```bash
npm run typecheck
npm run test:e2e -- tests/smoke.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/DemoRouteLayout.astro src/pages/demos/seo-audit.astro src/pages/demos/workflow-prototype.astro tests/smoke.spec.ts
git commit -m "feat: add static proof demo routes"
```

---

### Task 4: Gallery Styling and Responsive Polish

**Files:**
- Modify: `src/styles/global.css`
- Modify: `tests/smoke.spec.ts`

- [ ] **Step 1: Add smoke assertions for layout and reduced motion**

Add this test to `tests/smoke.spec.ts`:

```ts
test('interactive demo gallery remains usable on mobile and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#demos').scrollIntoViewIfNeeded();

  const gallery = page.locator('#demos');
  await expect(gallery).toHaveAttribute('data-hydrated', 'true');
  await expect(gallery.locator('.demo-gallery')).toHaveCSS('grid-template-columns', /390px|358px|1fr/);
  await gallery.getByRole('tab', { name: /Specializovaný workflow prototyp/ }).click();
  await gallery.getByRole('button', { name: 'Mobil' }).click();
  await expect(gallery.locator('[data-demo-workbench]')).toHaveAttribute('data-viewport', 'mobile');
  await expect(gallery.getByText('WORKFLOW_PIPELINE_V1')).toBeVisible();
});
```

If the exact CSS assertion is unstable across Chromium versions, replace it with:

```ts
const box = await gallery.locator('.demo-workbench').boundingBox();
expect(box?.width).toBeLessThanOrEqual(390);
```

- [ ] **Step 2: Run test to verify failure or weak layout**

Run:

```bash
npm run test:e2e -- tests/smoke.spec.ts
```

Expected before styling: FAIL or show cramped/unstyled elements.

- [ ] **Step 3: Add CSS for gallery**

Append this block near the existing `.demo-grid` styles in `src/styles/global.css`:

```css
.demo-section--interactive {
  display: grid;
  gap: clamp(1.2rem, 2vw, 1.8rem);
}

.demo-gallery {
  display: grid;
  grid-template-columns: minmax(240px, 0.58fr) minmax(0, 1.42fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;
}

.demo-selector-list {
  display: grid;
  gap: 0.75rem;
}

.demo-selector {
  width: 100%;
  min-height: 128px;
  border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
  border-radius: 8px;
  padding: 1rem;
  color: var(--text-main);
  text-align: left;
  background:
    linear-gradient(145deg, rgb(215 255 53 / 0.045), transparent 58%),
    rgb(5 8 7 / 0.94);
  cursor: pointer;
}

.demo-selector:hover,
.demo-selector:focus-visible,
.demo-selector.is-active {
  border-color: var(--accent);
  outline: none;
}

.demo-selector.is-active {
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--accent) 10%, transparent), transparent 54%),
    rgb(6 12 9 / 0.96);
}

.demo-selector__meta,
.demo-selector__state {
  display: block;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.demo-selector__title {
  display: block;
  margin-top: 0.55rem;
  font-size: 1rem;
  font-weight: 700;
}

.demo-selector__summary {
  display: block;
  margin-top: 0.45rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.demo-selector__state {
  margin-top: 0.85rem;
  color: var(--accent-2);
}

.demo-workbench {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--accent) 34%, var(--line));
  border-radius: 8px;
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 46%),
    #030504;
}

.demo-browser-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid color-mix(in srgb, var(--accent) 18%, var(--line));
  padding: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
}

.demo-browser-bar__url {
  display: inline-flex;
  min-width: 0;
  gap: 0.45rem;
  align-items: center;
  color: var(--text-muted);
}

.demo-browser-bar__url span {
  width: 0.52rem;
  height: 0.52rem;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 44%, transparent);
}

.demo-browser-bar__url strong {
  overflow-wrap: anywhere;
  color: var(--text-main);
  font-weight: 500;
}

.demo-browser-bar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.demo-browser-bar__actions button,
.demo-browser-bar__actions a {
  min-height: 32px;
  border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--line));
  border-radius: 6px;
  padding: 0.35rem 0.58rem;
  color: var(--text-main);
  font: inherit;
  text-decoration: none;
  background: rgb(8 12 10 / 0.9);
}

.demo-browser-bar__actions button.is-active,
.demo-browser-bar__actions a:hover,
.demo-browser-bar__actions button:hover,
.demo-browser-bar__actions button:focus-visible,
.demo-browser-bar__actions a:focus-visible {
  border-color: var(--accent);
  color: #081000;
  background: var(--accent);
  outline: none;
}

.demo-viewport-shell {
  display: grid;
  place-items: start center;
  padding: clamp(0.85rem, 2vw, 1.25rem);
}

.demo-viewport {
  width: 100%;
  max-width: 920px;
  transition: max-width 220ms ease, transform 220ms ease;
}

.demo-workbench[data-viewport='mobile'] .demo-viewport {
  max-width: 390px;
}

.mini-site {
  min-height: 360px;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--line));
  border-radius: 8px;
  padding: clamp(0.9rem, 2vw, 1.25rem);
  background: #060807;
}

.mini-site__header p {
  margin-bottom: 0.45rem;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.74rem;
}

.mini-site__header h3 {
  max-width: 36rem;
  font-size: clamp(1.2rem, 2.4vw, 1.8rem);
}

.mini-compare,
.mini-conversion,
.mini-status-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.mini-compare section,
.mini-conversion section,
.mini-status-grid article,
.mini-log,
.mini-chat p,
.mini-table,
.mini-checks li {
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--line));
  border-radius: 7px;
  background: rgb(10 14 12 / 0.88);
}

.mini-compare section,
.mini-conversion section,
.mini-status-grid article,
.mini-log,
.mini-chat p {
  padding: 0.85rem;
}

.mini-compare dl {
  display: grid;
  gap: 0.55rem;
  margin: 0.85rem 0 0;
}

.mini-compare dl div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgb(255 255 255 / 0.08);
  padding-top: 0.55rem;
}

.mini-checks,
.mini-pipeline {
  display: grid;
  gap: 0.55rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.mini-checks li,
.mini-pipeline li {
  padding: 0.75rem;
}

.mini-pipeline li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25rem 0.75rem;
}

.mini-pipeline span {
  grid-row: span 2;
  color: var(--accent);
  font-family: var(--font-mono);
}

.mini-pipeline small,
.mini-chat span,
.mini-conversion p,
.demo-result-grid p,
.demo-result-grid li {
  color: var(--text-muted);
}

.mini-log,
.mini-table {
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
}

.mini-chat {
  display: grid;
  gap: 0.7rem;
}

.mini-chat p {
  display: grid;
  gap: 0.35rem;
  margin: 0;
}

.mini-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
}

.mini-table th,
.mini-table td {
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
  padding: 0.7rem;
  text-align: left;
}

.demo-result-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: 1rem;
  border-top: 1px solid color-mix(in srgb, var(--accent) 18%, var(--line));
  padding: 1rem;
}

.demo-result-grid ol {
  margin: 0;
  padding-left: 1.2rem;
  line-height: 1.7;
}
```

- [ ] **Step 4: Add route CSS**

Append this block in `src/styles/global.css` near the gallery styles:

```css
.demo-route-shell {
  width: min(100% - 2rem, 1040px);
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 3rem) 0;
}

.demo-route-back {
  display: inline-flex;
  margin-bottom: 1rem;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  text-decoration: none;
}

.demo-route-back:hover,
.demo-route-back:focus-visible {
  text-decoration: underline;
  outline: none;
}

.demo-route-panel {
  display: grid;
  gap: 1rem;
}

.demo-route-panel h1 {
  max-width: 18ch;
  font-size: clamp(2rem, 6vw, 4rem);
}
```

- [ ] **Step 5: Add responsive and reduced-motion CSS**

Add inside the existing `@media (max-width: 920px)` block:

```css
.demo-gallery,
.demo-result-grid {
  grid-template-columns: 1fr;
}

.demo-selector-list {
  grid-template-columns: 1fr;
}
```

Add inside the existing `@media (max-width: 560px)` block:

```css
.demo-browser-bar,
.demo-browser-bar__actions {
  align-items: stretch;
  flex-direction: column;
}

.demo-browser-bar__actions button,
.demo-browser-bar__actions a {
  justify-content: center;
  text-align: center;
}

.mini-compare,
.mini-conversion,
.mini-status-grid {
  grid-template-columns: 1fr;
}
```

Add inside the existing `@media (prefers-reduced-motion: reduce)` block:

```css
.demo-viewport {
  transition: none !important;
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm run test:e2e -- tests/smoke.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css tests/smoke.spec.ts
git commit -m "style: polish interactive demo gallery"
```

---

### Task 5: Final Verification and Quality Gates

**Files:**
- Modify only if a verification failure points to a concrete issue.

- [ ] **Step 1: Run unit tests**

Run:

```bash
npm run test
```

Expected: all Vitest files pass.

- [ ] **Step 2: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: Astro check returns 0 errors, 0 warnings, 0 hints.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: build completes. Existing large Three.js chunk warning may remain; do not hide it by raising the warning limit unless the implementation added a new large eager chunk.

- [ ] **Step 4: Run e2e**

Run:

```bash
npm run test:e2e
```

Expected: all Playwright tests pass.

- [ ] **Step 5: Scan built output for private identifiers**

Run:

```powershell
$patterns = @('SirRadek', '.codex-run', 'seo-fix-pack', 'archviz-workbench', 'webhook-gateway', 'scrapeflow', 'autopilot-orchestration', 'radeq-website')
$files = Get-ChildItem -Path dist -Recurse -File
$matches = foreach ($pattern in $patterns) {
  Select-String -Path $files.FullName -Pattern $pattern -SimpleMatch -ErrorAction SilentlyContinue
}
if ($matches) {
  $matches | Select-Object Path, LineNumber, Pattern, Line
  exit 1
}
'No forbidden private identifiers found in dist output.'
```

Expected: `No forbidden private identifiers found in dist output.`

- [ ] **Step 6: Inspect git status**

Run:

```bash
git status --short --branch
git log --oneline -5
```

Expected: branch contains task commits and no unintended `.superpowers/` files staged.

- [ ] **Step 7: Push branch**

Run:

```bash
git push origin v2
```

Expected: branch `v2` updated on `SirRadek/radeq`.

- [ ] **Step 8: Deploy preview after push**

Run:

```powershell
$hash = git rev-parse HEAD
$message = git log -1 --pretty=%s
npx wrangler pages deploy dist --project-name=radeq-cz --branch=v2 --commit-hash=$hash --commit-message="$message"
```

Expected: Cloudflare Pages returns a preview URL and `https://v2.radeq-cz.pages.dev` updates.

- [ ] **Step 9: Live smoke check**

Run:

```powershell
$home = Invoke-WebRequest -Uri https://v2.radeq-cz.pages.dev/ -UseBasicParsing
$seo = Invoke-WebRequest -Uri https://v2.radeq-cz.pages.dev/demos/seo-audit -UseBasicParsing
$workflow = Invoke-WebRequest -Uri https://v2.radeq-cz.pages.dev/demos/workflow-prototype -UseBasicParsing
[PSCustomObject]@{
  HomeStatus = $home.StatusCode
  HomeHasGallery = $home.Content -match 'demo-section'
  SeoStatus = $seo.StatusCode
  SeoHasContent = $seo.Content -match 'SEO_AUDIT_REPORT_V1'
  WorkflowStatus = $workflow.StatusCode
  WorkflowHasContent = $workflow.Content -match 'WORKFLOW_PIPELINE_V1'
}
```

Expected: all statuses are `200`; content checks are `True`.

---

## Review Gates

Use subagent-driven development for implementation:

1. Implement Task 1.
2. Spec compliance review.
3. Code quality review.
4. Implement Task 2.
5. Spec compliance review.
6. Code quality review.
7. Continue through Task 5.
8. Final whole-branch code review.

Reviewers must check:

- Approved A + little B scope.
- No arbitrary iframe URLs.
- One shared active preview, not one iframe per card.
- Keyboard access for cards.
- Bilingual metadata stays aligned.
- Synthetic public-safe demo content only.
- Cloudflare Pages static compatibility.
