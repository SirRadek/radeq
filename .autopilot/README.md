# Autopilot Project State

Radeq's autopilot-managed project state — architecture record, work log, and the
project Decision Mesh — kept in the radeq repo per the repository-separation
convention: project state lives in the project repo, not in the autopilot control
plane.

Source: migrated from the autopilot control plane (`SirRadek/autopilot`,
backup branch `backup/local-radeq-artifacts-9c8685e`) on 2026-06-21.

## Contents

- `architecture.md`, `work-log.md` — radeq architecture record and work log.
- `decision-mesh/` — radeq project Decision Mesh (edges, rules, nodes).
- `model-output-evals/records/` — radeq advisory model-output eval records.
- `design/` — radeq design history: baseline screenshots, concept and mascot
  images, matrix/cyber prototypes, motion preview, and the visual-pro mission.

## Control-plane cleanup

The control-plane copies in `SirRadek/autopilot` are removed once this import is
merged and the cleanup map is re-validated against the canonical autopilot repo.
