# DevFlow Spec And Plan Methods

Owner: `devflow-spec` and `devflow-plan`. Load this reference only after Core selects Spec or Plan.

## Method 10: Spec Document And Plan Pack

`devflow-spec` consumes a Confirmed request, compares real no-change/reuse/direct options, writes a reviewable design contract under `docs/specs/`, and waits for user approval. Approval returns the confirmed Spec to Core.

`devflow-plan` consumes Core-selected `CUT_PASS` plus an approved design or confirmed Spec. It creates one implementation plan under `docs/plans/`, then waits for user review. Approval returns the confirmed Plan and any scope-drift facts to Core.

A Spec contains Goal, Context, Requirements, Non-goals, Approach, Impact, Acceptance, Verification, Code Documentation, and Open Questions. A Plan states Source, Spec coverage, Cut Decision, External Skills, exact files or anchors, interfaces, current and target behavior, mechanics, call impact, verification, comments, and exclusions.

## Plan Contract

The static plan checker validates structure, not architecture. A Plan must not expand the Cut Decision; any added dependency, abstraction, file responsibility, or feature returns scope-drift facts to Core.
