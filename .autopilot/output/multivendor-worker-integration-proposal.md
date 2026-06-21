# Multi-Vendor Worker Integration Proposal

Date: 2026-06-18 (updated: Antigravity rebrand investigation)
Status: draft — advisory only, not approved for implementation  
Author: Supervisor session (Claude Sonnet 4.6)  
Owner decision required before any implementation step.

> **Antigravity update (2026-06-18 final)**: `agy` (Antigravity CLI v1.0.9) is installed via WinGet
> (`Google.AntigravityCLI`). It is a separate Go binary from `gemini` — both co-exist. `agy` uses
> `daily-cloudcode-pa.googleapis.com`, model `Gemini 3.5 Flash (Medium)`. Its `--print` flag runs
> non-interactively but does NOT write to stdout — response is in a SQLite DB at
> `~/.gemini/antigravity-cli/conversations/<conv-id>.db`. Extraction requires reading `type=15` step.
> All `gemini`-based commands in this document remain correct alongside the new `agy` commands.

---

## 0. Scope and Governance Notice

This document proposes how to integrate real Codex CLI (GPT/OpenAI) and Gemini CLI
workers into the Autopilot control plane so that bounded tasks route to those CLIs
rather than to Claude subagents role-playing other vendors.

**This is a design-only document.** No production code has been written or modified.
All implementation requires owner decision, schema ADR, and tests before landing.

Governance hard boundaries from `CLAUDE.md` and `delivery-system-model-policy.md`
apply: no multi-provider gateway, no connector clients, no remote mutation, no secrets
in logs, model output remains advisory until local tests verify it.

---

## 1. CLI Reality Check — What Is On This Machine

### 1.1 Codex CLI (`codex-cli v0.106.0`)

| Property | Value |
|---|---|
| Executable | `C:\Users\sirok\AppData\Roaming\npm\codex.cmd` |
| Version | `codex-cli 0.106.0` |
| Non-interactive command | `codex exec [PROMPT or -]` |
| Structured output to file | `-o, --output-last-message <FILE>` |
| JSON event stream | `--json` (JSONL events to stdout) |
| Structured schema enforcement | `--output-schema <FILE>` (JSON Schema) |
| Model selection | `-m MODEL` (e.g. `-m o4-mini`, `-m o3`) |
| Sandbox | `--sandbox workspace-write` / `read-only` / `danger-full-access` |
| Working dir | `-C, --cd <DIR>` |
| Stdin prompt | pass `-` as PROMPT argument, pipe content |
| Auto-approve | `--full-auto` (low-friction sandboxed automatic execution) |
| Auth model | `codex login` — OpenAI/ChatGPT subscription |
| Auth check | `codex login status` — **owner must run this** (not run here) |

**Confirmed non-interactive round-trip shape:**
```powershell
Get-Content handoff.md -Raw | codex exec `
  --sandbox workspace-write `
  --full-auto `
  --output-schema model-output-evals/worker-output.schema.json `
  -o docs/autopilot/spike-artifacts/hp-XXXXXX-worker.json `
  -
```
Exit code 0 = success. Output file contains structured last message.

### 1.2 Gemini CLI (v0.44.1) — still active alongside agy

| Property | Value |
|---|---|
| Executable | `C:\Users\sirok\AppData\Roaming\npm\gemini.cmd` |
| Version | `0.44.1` |
| Non-interactive flag | `-p, --prompt "..."` (appended to stdin if piped) |
| Output format | `-o, --output-format text\|json\|stream-json` |
| Auto-approve | `--yolo` / `--approval-mode yolo` |
| Model selection | `-m, --model MODEL` |
| Auth model | Google AI subscription or Code Assist license (NOT Gemini API key path) |
| Auth check | **owner must run `gemini` interactively** — not run here |

**Confirmed working (2026-06-18 real run)**:
- `gemini -p "..." --yolo -o json` → exit 0, `{"response":"...","stats":{"models":{"gemini-3-flash-preview":{...}}}}`
- Default model: `gemini-3-flash-preview` via `cloudcode-pa.googleapis.com` (Code Assist OAuth2)
- `-m` flag not needed for default model; avoid `-m gemini-2.0-flash` (ModelNotFoundError)

**Rate limit warning (confirmed)**:
Last run: `totalErrors: 4, totalRequests: 5` (4 × HTTP 429 `MODEL_CAPACITY_EXHAUSTED` before success).
Supervisor retry logic is required, not optional.

**Antigravity rebrand**: As of 2026-06-18, `antigravity` command does not exist.
`@google/antigravity` is not on npm. `gemini` remains the correct command.
Upgrade available: `npm.cmd install -g @google/gemini-cli@latest` (0.44.1 → 0.47.0).

**Note**: even with `--yolo`, Gemini CLI prints ANSI/color warnings to stderr — supervisor must parse stdout only (`2>/dev/null` or PowerShell pipeline).

**Key behavioral difference from Codex CLI**:  
Gemini CLI does not support `--output-schema` or `-o FILE`.  
Structured output must be requested via prompt instructions.  
Supervisor captures stdout, extracts JSON, validates against schema locally.  
Gemini exit code `0` does NOT guarantee a successful model run — stdout must be inspected for error markers.

---

## 2. The Core Gap — Why Multi-Vendor Doesn't Work Today

### 2.1 Current evidence audit (from `subagent-evidence.jsonl`)

Every entry from the last session shows:
```json
{ "agent_id": null, "lock_status": "missing_agent_id",
  "process_anomaly": "agent-tool-spawn-no-hook-fire" }
```

**Root cause**: The current evidence model (`subagent-evidence-operating-model.md`)
relies on Codex hook events `SubagentStart` / `SubagentStop` that fire when the
**Claude Code Agent tool** spawns a Codex subagent. These hooks:
- Capture the native Codex runtime `agent_id`
- Write `worker.lock` keyed on `agent_id`
- Write `agent-registry.jsonl`

But when a worker is an **external CLI process spawned via Bash** (e.g., `codex exec`
or `gemini -p`), the Codex Agent tool is never called → hooks never fire → `agent_id`
is always `null` → `lock_status: "missing_agent_id"`.

### 2.2 What must change

| Layer | Current (Claude-only) | Required for CLI workers |
|---|---|---|
| Worker spawn | Agent tool → Codex subagent | Bash → `codex exec` / `gemini -p` |
| Identity source | Codex hook `agent_id` | Supervisor-generated `worker_run_id` |
| Lock write | Hook at `SubagentStart` | Supervisor before spawn |
| Lock release | Hook at `SubagentStop` | Supervisor after process exits |
| Registry write | Hook writes `agent-registry.jsonl` | Supervisor writes synthetic entries |
| Output capture | Task output file via Codex runtime | `-o FILE` (Codex) / stdout capture (Gemini) |
| Schema worker_id | `openai_gpt`, `qwen_local` only | Add `codex_cli`, `gemini_cli` |

---

## 3. Proposed Architecture

### 3.1 Identity Model for External CLI Workers

Since hooks never fire for CLI workers, the supervisor generates IDs deterministically
before spawn. The naming convention aligns with the existing `agent_id` format:

```
cli-codex-<handoff_slug>-<yyyymmddTHHMMSS>
cli-gemini-<handoff_slug>-<yyyymmddTHHMMSS>
```

Examples:
- `cli-codex-hp-20260618-impl-test-20260618T120000`
- `cli-gemini-hp-20260618-ux-analysis-20260618T130000`

These IDs are supervisor-assigned (`lock_source: "supervisor_spawn"`) rather than
runtime-assigned (`lock_source: "hook_fire"`). The existing `buildSubagentTree()`
logic still works because it joins on `agent_id` across the three evidence files —
the source of the ID doesn't affect the join.

### 3.2 worker.lock for CLI Workers

Current `worker.lock` is written by `autopilot-hook.mjs` at `SubagentStart`.  
For CLI workers, the supervisor writes it **before** spawning the process:

```json
{
  "schema_version": "v1",
  "worker_run_id": "cli-codex-hp-20260618-impl-test-20260618T120000",
  "handoff_id": "hp-20260618-impl-test",
  "vendor": "codex_cli",
  "model": "o4-mini",
  "pid": null,
  "started_at": "2026-06-18T12:00:00.000Z",
  "lock_source": "supervisor_spawn",
  "ttl_minutes": 30
}
```

The `pid` field is filled after the process starts (if the supervisor can capture it).
`ttl_minutes` enables stale-lock detection: if the lock is older than TTL and the PID
is not running, the lock is considered stale and may be cleared.

**Serial enforcement**: Before writing the lock, supervisor checks if the file exists.
If it does and is not stale → wait or fail. This is the same serial guarantee as the
hook-based approach, but implemented supervisor-side rather than hook-side.

### 3.3 Handoff Packet Delivery

**Codex CLI (preferred):**
```powershell
# Stdin delivery — avoids temp file, no credentials in handoff
$packet = Get-Content "docs/autopilot/spike-artifacts/hp-XXXXXX-handoff.md" -Raw
$packet | codex exec `
  -m o4-mini `
  --sandbox workspace-write `
  --full-auto `
  --output-schema "model-output-evals/worker-output.schema.json" `
  -o "docs/autopilot/spike-artifacts/hp-XXXXXX-worker.json" `
  -
```

Key properties:
- `--output-schema`: forces structured output matching `worker-output.schema.json`
- `-o FILE`: last agent message written to file — supervisor reads this
- `--sandbox workspace-write`: Codex may edit files in working directory only
- `-m o4-mini`: bounded reasoning model for implementation tasks
- Prompt from stdin (`-`): handoff packet is passed verbatim

**Gemini CLI (advisory only, no file edits):**
```powershell
# Gemini receives redacted advisory packet; returns structured JSON on stdout
$packet = Get-Content "docs/autopilot/spike-artifacts/hp-XXXXXX-handoff.md" -Raw
$jsonOutput = $packet | gemini --yolo -o json -p @"
Role: bounded advisory analyst.
Return ONLY valid JSON matching this schema:
{
  "findings": [...],
  "risks": [...],
  "recommendations": [...],
  "verification_needed": [...]
}
Do not include any text outside the JSON.
"@
```

Key properties:
- `-o json`: requests JSON output format
- `-p "..."`: appended to stdin content
- `--yolo`: auto-approve all tool calls
- Supervisor captures `$jsonOutput`, strips ANSI codes, parses as JSON
- **No `-o FILE`**: Gemini CLI does not support writing output to a specific file path;
  supervisor must capture stdout from the pipeline

### 3.4 Output Schema and Validation

**Codex worker** (`worker-output.schema.json`):

The schema currently only allows `worker_id: "openai_gpt" | "qwen_local"`.  
For Codex CLI workers, `worker_id` must be `"codex_cli"`.  
**Required change**: extend the enum.

Proposed addition to `model-output-evals/worker-output.schema.json`:
```json
"worker_id": {
  "type": "string",
  "enum": ["openai_gpt", "qwen_local", "codex_cli", "gemini_cli"]
}
```

This is a breaking schema change that requires:
1. Owner approval (ADR or ledger entry)
2. `npm.cmd run pdos:validate` update if any existing records use the schema
3. Version bump if the schema carries a version field

**Gemini advisory output** does not map directly to `worker-output.schema.json`
(Gemini is advisory, not an implementation worker). The advisory output schema should
be a lighter structure — proposal: `docs/contracts/advisory-output.schema.json`
(new file, separate ADR required).

### 3.5 Evidence Integration — Synthetic Records Without Hooks

For CLI workers, the supervisor writes all three evidence files directly after the
process completes. Hook-based records are replaced by supervisor-generated synthetics.

**agent-registry.jsonl** (synthetic `SubagentStart` + `SubagentStop`):
```json
{
  "schema_version": "v1",
  "event": "subagent_start",
  "agent_id": "cli-codex-hp-20260618-impl-test-20260618T120000",
  "agent_type": "codex-cli-external",
  "parent_session_hash": "<supervisor_session_hash>",
  "parent_turn_hash": "<current_turn_hash>",
  "started_at": "2026-06-18T12:00:00.000Z",
  "source": "supervisor_spawn"
}
```
```json
{
  "schema_version": "v1",
  "event": "subagent_stop",
  "agent_id": "cli-codex-hp-20260618-impl-test-20260618T120000",
  "stopped_at": "2026-06-18T12:03:42.000Z",
  "exit_code": 0,
  "source": "supervisor_spawn"
}
```

**agent-handoff-index.jsonl** (unchanged format):
```json
{
  "schema_version": "v1",
  "agent_id": "cli-codex-hp-20260618-impl-test-20260618T120000",
  "handoff_id": "hp-20260618-impl-test",
  "correlated_at": "2026-06-18T12:00:00.100Z",
  "source": "supervisor_assignment"
}
```

**subagent-evidence.jsonl** (extended with CLI-specific fields):
```json
{
  "schema_version": "v1",
  "handoff_id": "hp-20260618-impl-test",
  "agent_id": "cli-codex-hp-20260618-impl-test-20260618T120000",
  "agent_type": "codex-cli-external",
  "parent_session_hash": "<supervisor_session_hash>",
  "started_at": "2026-06-18T12:00:00.000Z",
  "stopped_at": "2026-06-18T12:03:42.000Z",
  "duration_seconds": 222,
  "artifacts": {
    "handoff_packet": "docs/autopilot/spike-artifacts/hp-20260618-impl-test-handoff.md",
    "worker_output": "docs/autopilot/spike-artifacts/hp-20260618-impl-test-worker.json",
    "reviewer_output": null
  },
  "lock_status": "acquired_supervisor_spawn",
  "exit_code": 0,
  "vendor": "codex_cli",
  "model": "o4-mini",
  "verified": false,
  "recorded_at": "2026-06-18T12:03:45.000Z"
}
```

New fields vs. current schema: `exit_code`, `vendor`, `model`, `lock_status` value
`"acquired_supervisor_spawn"`.

`buildSubagentTree(supervisorSessionHash)` continues to work unchanged: it joins
`agent-registry.jsonl` (where `parent_session_hash` matches) → `agent-handoff-index.jsonl`
(where `agent_id` matches) → `subagent-evidence.jsonl` (where `handoff_id` matches).
The `source: "supervisor_spawn"` field is additive, not a breaking join change.

### 3.6 Serial Execution and Rate Limit Handling

**Serial enforcement (both vendors)**:
```
1. Check: does worker.lock exist AND is it not stale (TTL < 30 min)?
   → Yes: supervisor waits or returns `worker_busy`
   → No: proceed
2. Write worker.lock with worker_run_id, handoff_id, vendor, started_at, ttl
3. Spawn CLI process (synchronous Bash call)
4. Process exits → capture output
5. Validate output
6. Delete worker.lock
7. Write evidence records
```

**Rate limit detection for Gemini CLI**:
Gemini CLI exits with code `0` on model errors (confirmed above).
Supervisor must scan stdout for error markers after every run:

| Error pattern | Meaning | Action |
|---|---|---|
| `ModelNotFoundError` | Wrong model ID or subscription mismatch | Block, owner action required |
| `RESOURCE_EXHAUSTED` | Daily/minute quota hit | Wait 60s, retry once; second fail → blocked |
| `Error when talking to Gemini API` | Auth failure or service error | Block, check subscription |
| `RATE_LIMIT_EXCEEDED` | Per-minute limit | Wait 30s, retry once |
| Output is empty or not valid JSON | Parse/model failure | Block, log as `verify_result: fail` |

**Rate limit detection for Codex CLI**:
With `--json` flag, Codex outputs JSONL events. Supervisor scans for:

| Event / pattern | Meaning | Action |
|---|---|---|
| `error` event with `429` in payload | OpenAI rate limit | Wait 60s, retry once |
| `error` event with `401` / `auth` | Subscription/auth issue | Block, `codex login status` |
| No `-o FILE` output but exit 0 | Agent produced no output | Treat as `verify_result: fail` |

**Tier fallback policy** (from `delivery-system-model-policy.md`):
```
codex_cli (o4-mini) → on limit: try o3-mini → block, owner decision
gemini_cli (default model) → on limit or ModelNotFound: block, owner decision
```
Do not silently fall back to Claude-only worker — the whole point is real vendor diversity.

---

## 4. Execution Flow Diagram

```
Supervisor (Claude Code session)
│
├─ Read handoff packet (handoff.md)
├─ Redact: strip secrets, credentials, raw logs
├─ Generate worker_run_id = "cli-codex-<slug>-<ts>"
├─ CHECK: worker.lock exists? → if yes: wait/fail
├─ WRITE: worker.lock { worker_run_id, handoff_id, vendor, started_at, ttl }
│
│  [Bash spawn: codex exec / gemini -p]
│  ┌─────────────────────────────────────────────────┐
│  │  External CLI Process (separate OS process)     │
│  │  - Codex hooks DO NOT fire in parent session    │
│  │  - Runs on OpenAI/Google subscription           │
│  │  - Writes -o FILE (Codex) or stdout (Gemini)   │
│  └─────────────────────────────────────────────────┘
│
├─ Capture exit_code and output
├─ Parse output / detect error patterns in stdout
├─ DELETE: worker.lock
│
├─ Validate output against worker-output.schema.json
│   └─ fail: write evidence with verify_result: fail, notify owner
│
├─ WRITE: agent-registry.jsonl (synthetic start + stop entries)
├─ WRITE: agent-handoff-index.jsonl (agent_id ↔ handoff_id)
├─ WRITE: subagent-evidence.jsonl (full evidence record)
│
└─ Return to supervisor loop: review output, run npm tests, decide next step
```

---

## 5. Required Schema and Code Changes

| Artifact | Change | Type | Requires |
|---|---|---|---|
| `model-output-evals/worker-output.schema.json` | Add `"codex_cli"`, `"gemini_cli"` to `worker_id` enum | Schema change | ADR / owner approval |
| `docs/contracts/` | New `advisory-output.schema.json` for Gemini advisory output | New schema | ADR |
| `docs/autopilot/subagent-evidence-operating-model.md` | Add §CLI Workers section: synthetic IDs, `lock_source: "supervisor_spawn"`, new `agent_type` values | Docs update | Owner review |
| `worker.lock` | Add fields: `lock_source`, `vendor`, `model`, `pid`, `ttl_minutes` | Schema extension | Tests |
| `subagent-evidence.jsonl` record | Add fields: `exit_code`, `vendor`, `model`; new `lock_status` value `"acquired_supervisor_spawn"` | Data extension | Tests |
| `agent-registry.jsonl` entries | Add `source: "supervisor_spawn"` for CLI workers | Data extension | Tests |
| Supervisor orchestration script | New PowerShell/JS function: `Invoke-CliWorker` or `runCliWorker.ts` | New code | Tests, ADR |
| Prompt library | Add redacted handoff template for CLI delivery (`prompt-library/08-codex-cli/`) | New prompt | Eval record |

---

## 6. What Changes About `buildSubagentTree()`

**Nothing structural changes.** The three-file join logic is identical:
1. `agent-registry.jsonl` where `parent_session_hash == supervisorSessionHash` → get `agent_id`s
2. `agent-handoff-index.jsonl` where `agent_id` matches → get `handoff_id`s
3. `subagent-evidence.jsonl` where `handoff_id` matches → get artifacts + status

The only addition: synthetic entries carry `source: "supervisor_spawn"` (additive field).
The function can optionally filter or annotate by `source` for audit purposes.

**What does change**: the function currently expects `agent_type: "codex"` for all
subagents. It needs to handle `"codex-cli-external"` and `"gemini-cli-external"` without
crashing. This is a minor defensive update (likely an `if` check or enum extension in the
TypeScript type).

---

## 7. Phased POC Plan

### Phase 0 — Owner Pre-flight (must complete before any code)

| # | Check | Who | Expected output |
|---|---|---|---|
| 0.1 | Run `codex login status` in terminal | Owner | Shows logged-in account, subscription tier |
| 0.2 | Run `gemini` interactively, verify login | Owner | Interactive session starts, no auth error |
| 0.3 | Run `gemini -p "hello" --yolo` (no `-m` flag) | Owner | Successful response, note the default model used |
| 0.4 | Identify working Gemini model ID for `-m` | Owner | Record model string (e.g., `gemini-2.5-pro`) |
| 0.5 | Confirm Codex subscription allows `o4-mini` | Owner | `codex exec -m o4-mini --sandbox read-only "list files"` succeeds |
| 0.6 | Owner approves schema change: add `codex_cli` to `worker_id` enum | Owner | Ledger entry |

### Phase 1 — POC: One Real Codex CLI Worker (trivial bounded task)

**Goal**: prove the full round-trip — supervisor → `codex exec` → structured output →
evidence records — without any hooks and without Claude role-playing GPT.

**Task**: pick the smallest possible bounded task from the backlog. Suggested:
add a single TypeScript type alias or update a doc comment in an isolated file.
The output should produce a non-empty `files_changed` array.

**Steps**:
1. Write minimal handoff packet following `agent-handoff-packet-template.md`
2. Manually run the Bash command pattern from §3.3 above
3. Inspect output file — does it contain valid JSON matching `worker-output.schema.json`?
4. Manually write the three evidence files (supervisor step; TypeScript functions come later)
5. Run `npm.cmd run typecheck` and `npm.cmd test -- subagent-evidence`
6. Confirm `buildSubagentTree()` returns the new entry

**Success criteria**:
- `worker_id: "codex_cli"` in output (after schema change)
- `agent_id` is not null in subagent-evidence.jsonl
- `lock_status: "acquired_supervisor_spawn"`
- Tests pass, typecheck passes
- Output diff reviewed by supervisor (Claude), not auto-approved

**Failure mode**: if Codex CLI produces non-JSON output or fails to follow the schema,
the POC is `verify_result: fail`. Do not try to fix it by loosening the schema.

### Phase 2 — Gemini Advisory Analyst

**Prerequisite**: Phase 0 owner checks for Gemini completed (§0.2–0.4 above).

**Goal**: route one bounded advisory task (e.g., critique a proposal doc) to real Gemini
CLI rather than Claude role-playing Gemini.

**Task**: take an existing redacted proposal (e.g., a mesh node or a design doc) and
request advisory critique via Gemini CLI. No file edits — advisory output only.

**Steps**:
1. Extract a redacted advisory packet (no secrets, no raw logs, no customer data)
2. Run `cat advisory-packet.md | gemini --yolo -o json -p "Return JSON critique..."`
3. Inspect stdout — is it valid JSON? Does it contain the expected keys?
4. Record as `agent_type: "gemini-cli-external"` in evidence
5. Label output as advisory (not source of truth); verify any factual claims locally

**Fallback**: if Gemini returns ModelNotFoundError or rate-limit, record as `blocked_items`
in the evidence and ask owner for the correct model ID.

### Phase 3 — Supervisor Automation (TypeScript `runCliWorker`)

Only after Phase 1 and 2 succeed manually:
- Extract the spawn + lock + evidence write into a TypeScript function `runCliWorker()`
- Add to `src/data/delivery-system/` alongside `subagentEvidence.ts`
- Full test suite, typecheck, `npm.cmd run verify`
- ADR entry for production CLI worker path

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Gemini `ModelNotFoundError` blocks Phase 2 | High (already observed) | Medium | Phase 0.3–0.4 owner step mandatory; no Phase 2 without it |
| Codex CLI internally spawns subagents → hooks fire in parent session, polluting agent-registry | Medium | Medium | Run Phase 1 POC with `--json` and inspect for unexpected `SubagentStart` events |
| `worker-output.schema.json` enum change breaks existing eval records | Low | Low | Check existing eval records for `worker_id` values before changing |
| Rate limits hit mid-run: Gemini exit 0 masks the error | High (Gemini) | Medium | Mandatory stdout error-pattern scan (§3.6) |
| Handoff packet contains redactable data | Medium | High | Redaction checklist before every CLI spawn; no secrets, no raw logs, no customer data |
| `worker.lock` TTL stale after supervisor crash | Low | Medium | TTL check + PID existence check at lock acquisition |
| Codex CLI runs in `workspace-write` mode and makes unintended edits | Low | High | Review every diff before accepting; use `read-only` sandbox for analysis tasks |
| `buildSubagentTree()` type error on `"codex-cli-external"` agent_type | High (TypeScript type narrowing) | Low | Minor defensive change in the TypeScript type — required before Phase 1 evidence writes |

---

## 9. Owner Decision Checklist

**Completed in POC (2026-06-18)**:
- [x] `codex login status` → `Logged in using ChatGPT`, v0.141.0, model `gpt-5.5` working
- [x] `agy` auth → `silent auth succeeded`, `buddy.thz@gmail.com`, model `Gemini 3.5 Flash (Medium)`
- [x] `gemini` auth → Code Assist OAuth2, model `gemini-3-flash-preview`
- [x] Schema change applied: `codex_cli`, `agy_cli` added to `worker_id` enum

**Still requires owner decision before production implementation**:
- [ ] **agy SQLite extraction**: approve protobuf string extraction as the output capture method, or wait for a future `agy` version with `--output-file` / `--format json`
- [ ] **Advisory schema**: decide if `agy` advisory output needs `advisory-output.schema.json` or lighter envelope
- [ ] **Codex sandbox policy**: confirm `--sandbox workspace-write` for implementation workers
- [ ] **Serial-only policy**: confirm one CLI worker at a time (no parallel spawns)
- [ ] **Redaction checklist**: approve handoff packet redaction requirements for CLI delivery
- [ ] **`npm.cmd test` after schema change**: run tests to confirm `worker_id` enum change doesn't break existing eval records

---

## 10. What Does NOT Change

- All governance gates (no self-approval, no secrets in logs, no source-of-truth from model output)
- `buildSubagentTree()` join logic (additive `source` field only)
- The three evidence files (`agent-registry.jsonl`, `agent-handoff-index.jsonl`, `subagent-evidence.jsonl`) remain the single evidence layer
- Handoff packet format (`agent-handoff-packet-template.md`)
- Serial execution policy — one worker at a time
- Verification requirement — every worker output reviewed by supervisor before `verified: true`
- `delivery-system-model-policy.md` advisory weight order: local repo facts > Claude subscription > GPT > Gemini > Qwen/DeepSeek

---

*This document is advisory. It does not constitute an approved architecture decision.
Proceed to implementation only after owner completes the checklist in §9.*
