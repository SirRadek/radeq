# Autopilot Project State

Radeq's autopilot-managed project state — architecture record, work log, and the
project Decision Mesh — kept in the radeq repo per the repository-separation
convention: project state lives in the project repo, not in the autopilot control
plane.

Source: migrated from the autopilot control plane (`SirRadek/autopilot`,
backup branch `backup/local-radeq-artifacts-9c8685e`) on 2026-06-21.

## Not yet migrated (follow-up)

Still in the control plane, pending an owner decision and the gated cleanup pass:

- radeq model-output-eval records (`model-output-evals/records/*radeq*.json`) —
  borderline: control-plane advisory audit evidence vs. radeq decision history.
- radeq design baseline assets (`docs/autopilot/radeq-*`, baseline screenshots,
  concept and mascot images) — binaries.

The control-plane copies are not deleted yet; per the control-plane cleanup
policy, removal is gated on re-validating the cleanup map against the canonical
autopilot repo first.
