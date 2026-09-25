# DevFlow Spec And Plan Methods

Owner: `devflow-spec` and `devflow-plan`. Load this reference only after Core selects Spec or Plan.

## Method 10: Spec Document And Plan Pack

`devflow-spec` consumes an A-branch Confirmed request, compares real no-change/reuse/direct options, writes a reviewable design contract under `docs/specs/`, and waits for user approval. An approved A-branch Spec directly enters Cut; non-success facts return to Core.

`devflow-plan` consumes A/B `CUT_PASS` plus an approved design or confirmed Spec. It creates one implementation plan under `docs/plans/`, then waits for user review. An approved A/B Plan directly enters Build; scope-drift facts return to Core.

Spec and Plan names, titles, and framing describe the accepted final state, regenerated from the positive target rather than edited from rejected wording. Keep Non-goals and Rejected as deliberate decision records; keep unrelated changes, comparisons, quotations, audits, or migration notes out unless the user asked or the document requires them.

A Spec contains Goal, Context, Requirements, Non-goals, Approach, Impact, Acceptance, Verification, Code Documentation, and Open Questions. A Plan states Status, Goal, Not doing, Cut, and Source, then per-task Files, Change, Acceptance, Verify, and Not doing, plus a `## Recon` record of the bounded read and a `## Progress` table. Its cross-task interface block appears only under a subagent execution mode.

The prose quality gate covers delivered prose only — completion messages, commit and PR text, and created documents. Spec, Plan, and requirements internal contract documents are exempt (豁免) from that gate; their own static checks apply instead.

## Plan Contract

The static plan checker validates structure, not architecture. A Plan must not expand the Cut Decision; any added dependency, abstraction, file responsibility, or feature returns scope-drift facts to Core.
