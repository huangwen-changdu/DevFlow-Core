# Completion Knowledge Capture

## Goal

After every `devflow-prove` judgment of `PASS`, proactively perform a lightweight knowledge review. `devflow-learn` must summarize and extract useful reusable records from successful work, not only from corrections or pitfalls; business-fact changes become candidates for user-confirmed maintenance by `devflow-project-knowledge`.

## Context

`devflow-learn` currently captures corrections, failures, skipped validation, conventions, and other reusable pitfalls in `.copilot/cards/`. `devflow-project-knowledge` maintains confirmed business-semantic documentation in `docs/project-knowledge/`. `devflow-prove` currently invokes learning only after corrections or non-obvious pitfalls, so it does not require an agent to inspect verified successful work for reusable knowledge.

The two stores answer different questions:

- `.copilot/cards/`: what an agent must do differently next time to avoid a repeatable execution mistake.
- `docs/project-knowledge/`: what the project means, where a task belongs, and which business boundaries must hold.

`PASS` is evidence that the claimed change was verified, and is the required entry point for a proactive review. It is not evidence that a new durable record must exist. The review must always run, then classify and retain only useful knowledge to avoid noise.

## Requirements

1. Treat every `devflow-prove` judgment of `PASS` as a required lightweight completion-review entry point for `devflow-learn` before the final completion report.
2. Keep existing correction, recovery, failure, and explicit "remember/learn" triggers for `devflow-learn`; the `PASS` review supplements rather than replaces them.
3. The completion review must inspect the verified work for reusable knowledge from both success and failure paths, including a useful implementation or reuse pattern, a decision and its constraint, an effective validation method, a non-obvious repository convention, an invariant, or a project-knowledge candidate.
4. During completion review, create or update a learning card when the extracted record can guide a future task and is cross-task reusable, costly if missed, counterintuitive, non-obvious, project-wide, a repeated pattern, or a proven useful practice.
5. Do not create a card for raw implementation narration, one-off facts, already-covered lessons, or a pure code refactor with no reusable insight. Running the review is mandatory; creating a record is conditional on useful extracted knowledge.
6. During completion review, classify a change as a project-knowledge candidate only when confirmed implementation facts add or change business semantics: a business domain, rule, boundary, entity/DTO/enum meaning, API contract, table boundary, module responsibility, job behavior, or task entry point.
7. A project-knowledge candidate must be reported to the user and must not update `docs/project-knowledge/` until the user confirms maintenance.
8. Once confirmed, `devflow-project-knowledge` owns the documentation update. It must write verified project facts, maintain its existing `index.md`, `registry.json`, and change-log obligations, and must not store execution lessons in the knowledge package.
9. Pure refactors, renames, helper extraction, and other changes without business-semantic impact must not trigger project-knowledge maintenance.
10. `devflow-learn` must report the review result in its learning closure: extracted record, project-knowledge candidate pending confirmation, or no useful record after review.
11. `devflow-prove` and `devflow-core` must describe the activation chain so it is explicit: verified completion -> mandatory proactive review -> learning record, project-knowledge candidate, or no record.
12. The boundary must explicitly preserve `graphify-out/` as structural graph data, `.copilot/cards/` as execution experience and proven work patterns, and `docs/project-knowledge/` as curated business facts.

## Non-goals

- Do not create a new skill, directory, command, script, hook, or automated classifier.
- Do not create a learning card or update the knowledge package after every `PASS` merely because the review ran.
- Do not automatically update `docs/project-knowledge/` without user confirmation.
- Do not move graph data, execution lessons, or business documentation into another store.
- Do not change the authority of `devflow-prove` over completion claims.

## Approach

Extend the existing skills rather than adding a completion-knowledge layer:

1. Add a mandatory proactive completion-review section to `devflow-learn` with extraction prompts, classification rules, a decision table, and revised closure output.
2. Update `devflow-prove` so every `PASS` invokes the lightweight review before final completion reporting, while retaining its existing correction/pitfall learning check.
3. Update `devflow-core` dispatch and handoff guidance to make the post-proof route visible and distinguish execution learning from project-fact maintenance.
4. Add an explicit handoff contract to `devflow-project-knowledge`: it accepts only a user-confirmed candidate with code-backed business facts and maintains no execution lessons.

## Impact

- `skills/devflow-learn/SKILL.md`: completion-review trigger, classification criteria, closure output, and verification checklist.
- `skills/devflow-prove/SKILL.md`: `PASS` handoff and activation evidence for the lightweight review.
- `skills/devflow-core/SKILL.md`: capability dispatch and handoff chain for post-proof knowledge classification.
- `skills/devflow-project-knowledge/SKILL.md`: explicit accepted handoff and responsibility boundary.
- `AGENTS.md`: concise runtime trigger and completion-flow reminder if needed to expose the handoff when skill bodies are unavailable.

## Acceptance

1. A verified ordinary refactor produces no learning card and no project-knowledge candidate.
2. A verified change with a proven reusable implementation, decision, validation method, convention, invariant, or costly/counterintuitive execution lesson produces or updates exactly one focused `.copilot/cards/` record through `devflow-learn`, even when no mistake occurred.
3. A verified change that alters business rules, domain semantics, API/table boundaries, module responsibility, or task entry points reports a project-knowledge candidate and waits for user confirmation.
4. After user confirmation, `devflow-project-knowledge` is the sole owner of the corresponding knowledge-package update.
5. The skill text explicitly states that every `PASS` triggers proactive review, but `PASS` alone does not require a new card or documentation update.
6. The trigger chain is discoverable from `devflow-prove`, `devflow-core`, and the relevant skill descriptions or runtime prompt surface.
7. The responsibility boundary is unambiguous: graphify is structural graph data, learning cards are execution experience and reusable work patterns, and project knowledge is curated business fact.

## Verification

- Run `node scripts/devflow-spec.js docs/specs/2026-07-16-completion-knowledge-capture.md`.
- Inspect required wording and cross-skill handoffs in the five impacted skill/runtime files.
- Run a scenario checklist against four cases: ordinary refactor, successful reusable implementation/validation pattern, reusable execution lesson from a pitfall, and business-semantic change pending user confirmation.
- Run the repository's applicable skill/package validation after implementation.

## Open Questions

None.
