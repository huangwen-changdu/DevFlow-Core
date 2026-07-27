# Independent Manual Review Skills Spec

## Goal

Provide two independently invocable DevFlow review skills: `devflow-adversarial` for deeper adversarial review and `devflow-find-fault` for identifying omissions, blind spots, and uncertainty.

## Context

DevFlow currently has completion proof, pressure recovery, and repository audit capabilities. None provides a user-invoked review that can run at any task stage without reading, requiring, or changing another skill's state.

## Requirements

1. Add `/devflow-adversarial` and `/devflow-find-fault` commands and matching skills.
2. Both skills must run only when the user explicitly requests them and may run at any task stage.
3. Neither skill may read, require, modify, or route through `devflow-prove`, PUA, Build, Learn, or any completion state.
4. Adversarial review must attack requirement coverage, reachability, boundaries and regressions, evidence strength, and user-visible outcome.
5. Find-fault review must answer the default questions about the largest omission, unrecognized blind spots, and least certain point, while accepting user-supplied follow-up questions; every answer separates facts, inference, unknowns, confidence, and a next step.
6. Both outputs must classify findings as `Critical`, `Important`, or `Observation`, and state evidence, confidence, and context limitations.
7. Trigger wording must support explicit Chinese and English natural-language requests plus the two slash commands.
8. Package manifests, target and user installers, and static validation must ship and verify the new runtime files.

## Non-goals

- Change `devflow-prove`, `devflow-learn`, `devflow-pua`, or their handoffs.
- Automatically execute either review, change code, create a task, or invoke another skill.
- Declare a global task status from either review.
- Add dependencies, hooks, runtime scripts, or persistent review storage.

## Approach

Add two focused `SKILL.md` contracts and two TOML commands. Route explicit requests directly to the matching skill from the shared host surfaces. Reuse the existing manifest, installer, and validation mechanisms to package the new files.

## Impact

- Two skill directories and two command files.
- Shared natural-language routing and host prompts.
- Plugin manifests, target installer, user installer, and their validation assertions.
- Trigger scenarios, framework scenario coverage, and the DevFlow Core feature ledger.

## Acceptance

1. Each command and its explicit natural-language trigger reaches the intended independent skill.
2. Both skills state their independence from lifecycle and completion status.
3. Adversarial review covers all five required attack dimensions.
4. Find-fault review covers all three default questions and user-supplied questions.
5. Outputs expose finding level, evidence, confidence, and limitations without a global completion verdict.
6. Package, host, trigger, installer, and full verification commands pass.

## Verification

- `node scripts/devflow-spec.js docs/specs/2026-07-26-independent-manual-review-skills.md`
- `node scripts/devflow-plan.js docs/plans/2026-07-26-independent-manual-review-skills.md`
- `npm test`
- `npm run trigger:verify`
- `npm run host:verify`
- `npm run install:verify`
- `npm run user:verify`
- `npm run capability:verify`
- `npm run verify:all`

## Code Documentation

None - this change adds declarative Markdown and TOML contracts plus existing-style validation assertions. Do not add comments unless new non-obvious executable logic becomes necessary.

## Open Questions

None.
