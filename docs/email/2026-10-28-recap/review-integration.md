# Independent integration review — 2026-10-28

Scope: visitor confirmation presentation in `app/src/lib/leadNotificationEmail.ts` and the deployed Worker snapshot `app/release/production-backend.js`; proposal renderer and delivery configuration. This review does not authorize broader backend changes and did not access secrets, send email, write production data or deploy.

## Decision before implementation

The proposed narrow integration is sound: one pure renderer, imported by both source TypeScript and the release JavaScript snapshot; visitor confirmation gains HTML and retains an explicit equivalent text alternative. Existing owner notification and transport identity must stay unchanged. No blocking design flaw found in the proposal's escaping or fixed links. Final approval requires checking the actual patch and the guards below.

The [official Resend Send Email reference](https://resend.com/docs/api-reference/emails/send-email), checked today, documents `html` as the HTML body and `text` as the plain text body. Send both explicitly. Mock payload verification establishes the API request, not the provider-generated MIME or inbox rendering.

## Material risks and precise guards

1. **Snapshot drift outside the authorized change.** Preserve the original snapshot at `docs/deployments/2026-10-28-cloudflare/worker-before/modules/index.js` with SHA-256 `c80dd654a4775cc1a49a84ec8de4b8b24b643377574cb789caeaaec4379dd67a`. Replace the old current-file whole-hash assertion with a guard that proves removal of exactly the approved import, optional HTML payload line and visitor factory replacement reconstructs those original bytes. Also retain and check the original file's hash. Do not silently update the accepted hash. This protects validation, Turnstile, D1 insert, KV limits, storage-before-email, concurrent sends, 201 response on email failure and all measurement behavior.

2. **Owner notification changes through shared transport.** Add `html?: string` and serialize the optional field without changing existing JSON key order/values. Compare captured owner JSON byte-for-byte with the original implementation for the same normalized lead, ID and timestamp. Preserve owner `from`, `to`, visitor `reply_to`, subject cleaning and all text fields. Confirmation must preserve its existing `from`, visitor `to` and owner `reply_to`.

3. **Untrusted HTML or link injection.** Escape `& < > " '` in name, project and message before newline-to-`<br>` conversion. Test values containing closing table tags, `img onerror`, `script`, quotes, `&lt;`, URL-shaped text and all three newline forms. Assert their decoded visible text matches the input while HTML has no injected elements or attributes. Dynamic values belong only in text nodes. Links remain fixed `https://radeq.cz/` and `mailto:siroky@radeq.cz`; no image, external font, script, pixel, CSS URL or query-tracking additions. Provider/domain tracking settings are not established by template inspection and must not be described as verified.

4. **Source/release divergence or missing module.** Import the same dependency-free renderer in both implementations. Existing `no_bundle: true` plus `ESModule` rule for `**/*.js` is compatible in principle; verify a Wrangler dry run actually includes `confirmation-email.js` and produces a loadable Worker without changing D1/KV/secrets/vars or host gating. Compare captured source and release confirmation payloads for CZ and EN.

5. **Locale and content drift.** Keep exactly `lead.locale.toLowerCase().startsWith('en')`; test `en`, `en-GB`, `EN`, `cs`, empty and unrelated locale. Fixed subjects avoid header injection. Preserve visitor wording verbatim in the rekapitulation, without automatic translation. Test Czech diacritics, HTML metacharacters, name 90, project 120, message 1200 and a long unbroken message. Empty project fallback can be tested at renderer level; the existing API requires project type and must continue rejecting its absence.

6. **Boundary mismatch in specimens.** Existing `sanitizeField` normalizes control characters and whitespace, including message newlines, before persistence and sending. The isolated proposal's multiline fixture does not prove multiline preservation through the actual API. Leave that normalization unchanged and verify the renderer receives the same normalized data that is stored. Do not expand this presentation task to changing data semantics.

7. **Failure and abuse regressions.** Exercise skipped email when no key, a rejected/non-2xx confirmation request after successful insert, recipient confirmation suppression and ordinary rate limiting against the release Worker with mocked transport/storage/KV. A rendering/transport failure must retain existing stored-lead and HTTP behavior. Invalid JSON, validation and failed verification must not reach storage/email.

## Evidence boundary

Browser previews are useful for 320px overflow, links, table structure and content, but do not establish Outlook/Gmail/Apple Mail rendering, dark mode, generated multipart MIME or deliverability. No inbox verification has been performed by this review. A live positive enquiry should not be created solely for a smoke test unless separately within the owner's authorized test scope; nonmutating public-page checks and invalid-request rejection checks can verify the release without creating a lead.

## Final delta review

**Accepted for the authorized presentation release; no material finding.** Inspected the actual shared renderer, source transport/factory, complete snapshot diff and affected tests. The only executable snapshot changes are the import, optional HTML member and visitor factory replacement. Owner identity/content, validation, Turnstile, D1/KV, rate limits, error handling and measurement remain unchanged. Localized fixed homepage links are safe.

An independent Node assertion replaced the exact five-line new factory with the original factory block and removed only the exact import/payload additions: reconstructed bytes match the original SHA-256. Additional assertions passed for all five escaped characters, HTML injection, three newline forms, six locale values and the two allowed links. No network or email was used.

The committed normalization guard ignores the whole visitor-factory region; it is an outside-region equality guard, not by itself an exact reconstruction proof. Current actual bytes were independently checked as above; pinning that region would strengthen future regression coverage. Source/release parity tests and recorded four browser checks support this release. Build/deploy/bindings verification remains with the releasing agent; inbox/MIME limitations still apply.

Reviewed SHA-256: `confirmation-email.js` = `aabb0bf5df2b275834d973c032c5f618db441f440e4a194edcfc0c22d3f626ea`; `production-backend.js` = `b1ebe3a35e6de81be9514421512442b4ac9c2bcc18d7cba9a16e645f630dbbc4`.
