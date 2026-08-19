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

## Build Comments

The approved Spec/Plan and local project convention define required code comments. Add a comment when it records a protected contract, failure condition, business rule, compatibility boundary, or other non-obvious reason; inline comments explain reasons, not syntax. Markdown runtime contracts use headings and fixed output shapes rather than narrative comments.
