# Independent Sol audit: GitHub, local source, public deployments

Read-only review, 28 October 2026. Requested reviewer: gpt-6.1-sol / medium. No source edits, commits, pushes, builds, dependency installs, deployments, browser actions or submissions. Only this report and the adjacent `github/` evidence tree were created. This worker reviewed provenance and source/HTML differences; the parent owns visual verification. Severity describes remediation priority, including future publication risks, and does not authorize a fix or release.

## Exact provenance

The connected GitHub repository is public `SirRadek/radeq` (repository ID1235949423). The default branch is `new`, currently **827388a33555db811251a6a8190af7997a916129**. The publication branch `codex/radeq-clean-pages-20261013` is still **d862c63a3bfdf99fc37409a5d7b499f4affd32b4**. These are separately verified identities, not interchangeable meanings of “GitHub version.” Connector results are preserved in `github/repository.json`, `branches.json`, `workflow-runs.json`, and `workflow-jobs.json`.

The current successful GitHub Pages deployment has direct platform evidence: deployment **7363829524**, SHA **d862c63a…**, ref **codex/radeq-clean-pages-20261013**. Its status is `success`, dated **2026-10-27T16:13:30Z**, and explicitly identifies **https://sirradek.github.io/radeq/**. Workflow run **40538735313**, job **122310994729**, succeeded and contains the upload/deploy steps. See `github/deployments.json` and `deployment-statuses.json`; [workflow run](https://github.com/SirRadek/radeq/actions/runs/40538735313). The connector does not allow Pages/deployment endpoints; public read-only REST HTTP supplied those records. Public Pages settings returned404, so environment restrictions and account settings remain unverified.

Immutable source archives are extracted at:

- `github/radeq-d862c63a3bfdf99fc37409a5d7b499f4affd32b4/` — publication source **and** checked-in `site/`.
- `github/radeq-827388a33555db811251a6a8190af7997a916129/` — default branch source.

Archives and SHA-256 digests are recorded in `github/provenance.json`. The active local source is `app/`, without an attributable current Git commit; its accepted build is `app/docs/audits/2026-10-09-themed-demos/build-1793195077266/artifact-manifest.json`. The transferred historical worktree HEAD is historical evidence, not the current local identity.

The fetched Pages CZ and EN homepages are **byte-for-byte equal** to the pinned publication `site/index.html` and `site/en/index.html`, respectively. SHA-256: CZ `847dd84617b4153a43d099cbca72a6dd6c8c8e0212804d028fcdd61a846dabb7`; EN `34d9574ee6608c2943da1a512ad61aafc8878bf1e27049f3025bbfbd7d90aec2`. Thus both platform metadata and actual served bytes agree. Their HTML differs from the current local build. See `github/comparison.json` and `pages-{cz,en}.html`.

Both **https://radeq.cz/** and **https://radeq.cz/en/** returned200. Their saved HTML differs from Pages and local output. Their current commit/deployment identity is **unknown**; matching copy, canonical URLs or shared assets cannot establish a commit. HTTP response captures, timestamps, headers and bodies are retained in `github/live-*`.

## Findings

### P1 — Default branch retains an independent path that could replace the reviewed Pages snapshot

**Location:** [default-branch workflow, immutable lines3–6 and24–38](https://github.com/SirRadek/radeq/blob/827388a33555db811251a6a8190af7997a916129/.github/workflows/deploy.yml#L3). The `new` branch workflow triggers on push or manual dispatch, builds through `withastro/action@v6` with `DEPLOY_TARGET=github-pages`, and deploys to the same `github-pages` environment. The reviewed publication branch has a different workflow and different content.

**Observed:** `new/src/pages/index.astro:2,17` imports and renders the old `RqHomePage`; publication `src/pages/index.astro` uses the minimalist implementation. The byte comparison records112 changed/added/removed paths across `src`, `public` and `.github` between default and publication, including83 source paths. The publication branch contains only `clean-pages.yml`; the default branch contains its own deploy workflow. The latest successful deployment is the publication snapshot, so no rollback is observed.

**Impact/inference:** A later permitted default-branch run has code that would upload and deploy older/different content to the same Pages environment. Actual ability to execute unattended depends on environment protections we could not read. This is a release-control risk, not a current local UI defect.

**Proposed fix:** Before any future publication, choose one authoritative release branch/workflow, remove or gate the stale path, and require approval plus a pinned artifact identity. Do not simply merge or deploy `new`. **Confidence:** high in code path/content divergence, medium in unattended exploitability because environment protections are unknown.

### P2 — Publishing source alone does not publish the current validated local build

**Location:** [publication clean-pages.yml:21–29](https://github.com/SirRadek/radeq/blob/d862c63a3bfdf99fc37409a5d7b499f4affd32b4/.github/workflows/clean-pages.yml#L21); identical local `app/.github/workflows/clean-pages.yml`. The upload path is **`site`** at line26. There is no source build, compiled-test run or source/artifact-manifest comparison in that workflow.

**Observed:** Current local verification produces root/subpath artifacts under the manifest's build directory. It does not update the immutable publication `site/`. Pages still serves the prior checked-in `site/` exactly. The mechanical comparison finds30 differing/new paths among selected local `src`, `public`, `scripts`, `tests` and `.github`; these include the already authorized English localization and five earlier local improvements, not unexplained changes. The report does not label the approved local divergence a regression.

**Impact/inference:** A future push of changed `src/` with unchanged `site/` would redeploy stale bytes. Fresh local tests do not by themselves prove the bytes that this workflow uploads. No present source-to-site drift *inside the pinned publication* was established, because that snapshot was not rebuilt.

**Proposed fix:** At the next authorized release, explicitly promote the approved manifest-bound subpath build to `site/` and verify hashes before upload, or replace the release process with a build/test/upload pipeline using one bound artifact. Preserve the current no-publication boundary. **Confidence:** high.

### P2 — Public Pages still has Czech interactive examples behind its English homepage

**Locations:** publication `src/components/ServiceStories.astro:37,63`; [immutable source](https://github.com/SirRadek/radeq/blob/d862c63a3bfdf99fc37409a5d7b499f4affd32b4/src/components/ServiceStories.astro#L37). English links intentionally point to `/radeq/ukazky/<slug>/?from=en`; the page warns “Interactive examples are in Czech.” Direct current GETs of `/radeq/en/ukazky/{instalater,sluzba,provozni-terminal,eshop}/` all returned404.

**Observed versus local:** `app/src/pages/en/ukazky/[demo].astro:2–12` implements all four English pages; `app/src/components/ServiceReturn.astro:7` generates language-aware return navigation. New English images and localized state/client files are among the exact source differences. This is an expected unpublished improvement, not a broken link from the existing Pages homepage and not a current local localization failure. Prior Windows tests remain the parent's source-bound evidence; none were rerun here.

**Proposed fix:** Include all four route outputs, client assets and English thumbnails in the same explicitly authorized future artifact promotion. Do not alter public links to nonexistent English paths first. **Confidence:** high.

### P2 — Local certificate placement draft remains a publication decision

**Location:** `app/src/components/MinimalHomePage.astro:80–84` displays a “Learning and certificates / Placement preview” disclosure, explicitly stating that certificates have not been added and proposing space for3–8 documents. This is absent from the pinned publication homepage and is documented as deliberate local draft content.

**Impact:** It does not fabricate a qualification, but releasing the local artifact unchanged would expose authoring guidance on a customer-facing homepage. The handover explicitly requires deciding to omit it or replace it with real documents before publication.

**Proposed fix:** Resolve that owner decision in the eventual release scope. No edit performed. **Confidence:** high.

## Three-way content and metadata assessment

`github/html-summary.json` extracts headings and audit links without treating hidden HTML as proof of visual prominence. Live radeq.cz retains the broader old page: problem diagnostic, services, protocol/guarantee, process, pricing, showcase and contact material. The public Pages homepage is the accepted minimalist landing page with contextual examples; current local adds the approved disclosures, audit placement and English examples. Shared prices and text are content evidence, not proof that live radeq.cz equals default-branch commit827388a.

Pages CZ/EN have correct `lang="cs"`/`lang="en"`, self-canonicals on the Pages origin and `noindex,nofollow`. That is intentional preview isolation, not an SEO defect. Live CZ/EN have correct language declarations and self-canonicals on radeq.cz; their homepage HTML has no robots meta. Absence of a meta tag alone is not a full indexing assessment. Local `astro.config.mjs` explicitly switches site/base and preview channel using `DEPLOY_TARGET`; `src/layouts/RqLayout.astro:51` applies preview noindex. A production release must use the correct root variant; the `/radeq` artifact is for Pages.

No evidence here establishes broken production forms, backend functionality, measurement, bot verification, performance scores, visual mobile overflow or accessibility failures. Those require their respective authorized checks. No source modifications or fixes are proposed as already completed.

## Evidence limits and reproduction

`github/compare.cjs` compares file bytes and binds served homepages to pinned site output; `github/finalize.cjs` writes compact provenance and semantic summaries. Both use Node built-ins only. Snapshots were retrieved by immutable SHA, not a moving branch archive. Raw public HTTP responses and deployment status support the report; archived branch metadata is a point-in-time observation. `github/comparison.json` enumerates exact differing file hashes. `src` versus `site` reproducibility remains unverified without rebuilding the old snapshot. Only two served Pages homepages were byte-matched; do not generalize that match to every asset or route. No dependency installation or old-snapshot build was necessary to establish the reported deployment identity and workflow risks.
