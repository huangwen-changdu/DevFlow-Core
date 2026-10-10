# DevFlow Build Methods

Owner: `devflow-build`. Load this reference after C `CUT_PASS`, an approved A/B Plan, or Core selects Build for a non-unique artifact.

## Method 11: Karpathy Minimal Change

Touch only files necessary for the approved goal. Match project style, preserve contracts, avoid one-caller helpers and speculative options, and remove only code introduced by the current change when it becomes unused.

For each changed file record:

```text
Goal link:
Behavior changed:
Why this file:
Verification:
```

## Method 12: Implementation Slices

Split multi-step work into one to five testable slices. Each slice names files, user-visible or contract behavior, verification, and comment requirements. Verify a slice before moving on whenever a focused check exists.

Build owns how. A v2 plan task gives `Files`, `Change`, `Acceptance`, `Verify`, and `Not doing`; the executor reads the named anchors plus one directly changed neighbor, chooses the smallest implementation inside that boundary, and records the choice in the task's `## Progress` evidence. It does not wait for Plan to pre-decide the edit, and it does not widen the boundary. Legacy plans that prescribe `Change mechanics` are followed as written.

After a slice passes its verification, write back the plan's `## Progress` row: `doing` while in flight, `done` with the command and key result when verified. On a legacy plan without a Progress table, report the same evidence in the completion message.

## Readability Outcome Check

Before handoff, review changed code from the perspective of a maintainer familiar with the project but not this change. Use names, structure, extraction, comments, and tests as appropriate; do not apply any technique mechanically.

```text
Readability Check:
- Intent: each changed unit has a business-purpose name or locally clear role
- Rules: important conditions use domain terms or small named predicates
- Failure paths: invalid, exceptional, and boundary behavior is locally visible
- Side effects: authorization, persistence, cache changes, remote calls, and response mapping are not hidden in an opaque block
- Convention: naming, layering, errors, logging, cache, and tests follow the nearest comparable project code, or the deviation is recorded
- Trade-off: <none or concise reason why this is the clearest safe option>
```

A function may contain several steps when they form one coherent business narrative. Extract or split only when doing so makes responsibility, testing, reuse, or local understanding materially better.

## Quality Gates Before Handoff

Run the anti-AI-voice quality gates alongside the Readability Outcome Check before handoff. Load `prose-quality-checklist.md` and clear every flagged pattern for completion messages, commit and PR text, and created documents; load `ui-slop-checklist.md` and clear all six-axis scores and gates when the change emits UI or design output. Fix every hit and rerun the check; an unfixed hit stays in Build rather than reaching Prove.

Close the gates with the shared execution receipt (`core-methods.md`): name the checked objects — which message, commit text, document, or UI output — the hits found and fixed or 无命中, and cite the existing artifact (for UI output the recorded six-axis scores ride in proof evidence). A non-visual task records the visual check 不适用 with that reason; a gate whose condition held but did not run stays 未执行 or 受阻 in the receipt.

The same receipt discipline covers dispatch and specialists: when the plan's execution mode cannot run — the subagent tool or a declared specialist is unavailable — record 受阻 with the missing capability and the facts it would have produced. Silently switching modes, or claiming subagent output without a returned result, is 未执行; a specialist that cannot run records 受阻, not 不适用 or a silent skip. Neither is ever relabeled into a completed task.

## Build Comments

The approved Spec/Plan and local project convention define required code comments. Add a comment when it records a protected contract, failure condition, business rule, compatibility boundary, or other non-obvious reason; inline comments explain reasons, not syntax. Markdown runtime contracts use headings and fixed output shapes rather than narrative comments.

When a comment describes behavior, write it from the accepted final state. Regenerate it from the final behavior instead of editing rejected wording; comments never narrate rejected alternatives, session corrections, intermediate attempts, or why-not-X reasoning, and keep only the non-obvious reasons a future maintainer needs.
