# DevFlow Spec And Plan Methods

Owner: `devflow-spec` and `devflow-plan`. Load this reference only after Core selects Spec or Plan.

## Method 10: Spec Document And Plan Pack

`devflow-spec` consumes an A-branch Confirmed request, compares real no-change/reuse/direct options, writes a reviewable design contract under `docs/specs/`, and waits for user approval. An approved A-branch Spec directly enters Cut; non-success facts return to Core.

`devflow-plan` consumes A/B `CUT_PASS` plus an approved design or confirmed Spec. It creates one implementation plan under `docs/plans/`, then waits for user review. An approved A/B Plan directly enters Build; scope-drift facts return to Core.

A Spec contains Goal, Context, Requirements, Non-goals, Approach, Impact, Acceptance, Verification, Code Documentation, and Open Questions. A Plan states Source, Spec coverage, Cut Decision, External Skills, exact files or anchors, interfaces, current and target behavior, mechanics, call impact, verification, comments, and exclusions.

## Plan Contract

The static plan checker validates structure, not architecture. A Plan must not expand the Cut Decision; any added dependency, abstraction, file responsibility, or feature returns scope-drift facts to Core.
