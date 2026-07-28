---
name: devflow-plan
description: "Use after CUT_PASS and an approved design or saved spec to write a reviewed, executable implementation plan before devflow-build."
---

# DevFlow Plan

Turn an approved `devflow-brainstorm` design contract or saved spec into one implementation-ready Plan Pack. This is the only DevFlow plan-generation skill; `/devflow-plan` is its command entry.

## Inputs And Output

- Consumes: `CUT_PASS` (allowed scope, reuse conclusion, exclusions, verification constraints) plus an approved design contract or `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`.
- Produces: one reviewed `docs/plans/YYYY-MM-DD-<short-kebab-name>.md` construction Plan Pack for `devflow-build`.
- Do not generate a plan without `CUT_PASS` or from an unapproved design. Return to the missing approval or Cut gate.

## Authoring Process

1. Read only source material, code, tests, and conventions relevant to the approved scope.
2. Map exact affected file responsibilities before writing tasks. Reuse existing modules and name the intended file operation.
3. Split independent deliverables into small, reviewable tasks. Each task should be understandable without referring to another task.
4. Write the plan using the required header and task contract below.
5. Self-review Cut Decision fidelity, source coverage, file-operation classifications, interface consistency, concrete steps, acceptance proof, and scope exclusions.
6. Run `node scripts/devflow-plan.js <plan-file>` when the project-level checker exists. Otherwise resolve the user-level checker according to `core-methods.md` Script Path Resolution.
7. **STOP — request user review.** Revise and revalidate when requested. After approval, perform only a lightweight Cut-consistency review: hand off to `devflow-build` when tasks remain inside `CUT_PASS`; return to `devflow-cut` only for affected gates when the plan adds scope, dependencies, abstractions, or file responsibilities.

Default landing is `docs/plans/YYYY-MM-DD-<short-kebab-name>.md`, resolved from the target project root. Do not place implementation plans in `docs/features/` or `docs/specs/`.

## Required Plan Header

Structural headers remain English so the checker can parse them; content uses the user's language.

```text
# <Plan title>

Goal: <outcome>
Architecture: <smallest design and boundaries>
Tech Stack: <relevant existing stack>
Source: <approved design or docs/specs/YYYY-MM-DD-<short-kebab-name>.md>
Spec coverage: <requirements mapped to tasks, or design-only>
Cut Decision: <CUT_PASS allowed scope, reuse conclusion, exclusions, verification constraints>

## Global Constraints
- <applicable boundary>
```

## Required Task Contract

```text
Task: <short, independently understandable title>
Files:
- Create: <path> | <responsibility>
- Modify: <path> | <responsibility>
- Test: <path> | <behavior proved>  # only when applicable
Interfaces:
- Consumes: <input, API, module, or explicit documentation-only exception>
- Produces: <output, API, module, or explicit documentation-only exception>
Steps:
- [ ] <concrete file + symbol/behavior/command + expected result>
- [ ] <concrete file + symbol/behavior/command + expected result>
Acceptance: <specific observable condition>
Verify: <exact command or manual scenario>
Comments: <required function/inline comments, or "none — trivial change">
Not doing: <scope excluded>
```

Use only `Create`, `Modify`, and `Test` file-operation labels. A task does not need a test file unless a test is needed for its stated behavior. Every code-changing step names a target file and a symbol, behavior, command, or expected result. Avoid vague work such as generic test additions, unnamed edge cases, cleanup, or cross-task shorthand.

## Boundaries

Plan generation does not repeat Cut, perform Build or Prove, prescribe independent review, test-first workflow, version-control task steps, or execute automatically. It converts `CUT_PASS` into a static construction checklist. The checker validates static structure; it does not judge architecture or lifecycle state.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The implementation can fill in the details." | A task must already name files, contracts, steps, acceptance, and proof. |
| "A task can refer to the previous task." | Repeat the needed detail; each task is reviewable alone. |
| "Every task needs a test file." | Name a test only when its behavior needs one; do not prescribe test-first workflow. |
| "The checker proves the architecture." | It proves structure only; the author must review scope and design consistency. |
| "The plan is approved, so Cut can be skipped." | Plan generation requires an existing `CUT_PASS`; it cannot replace the earlier reuse and scope decision. |
| "The task details can broaden the solution." | If a task exceeds the Cut Decision, return only the affected gates to `devflow-cut` before Build. |

## Verification

Before leaving this skill, confirm:

- [ ] `CUT_PASS` is cited with allowed scope, reuse conclusion, exclusions, and verification constraints.
- [ ] Approved design or saved spec is cited as `Source`.
- [ ] `Spec coverage` maps the source to plan tasks.
- [ ] Header, constraints, file map, interfaces, concrete steps, acceptance, verification, comments, and exclusions are present.
- [ ] Every task is independently understandable and has no unresolved or vague placeholder.
- [ ] The checker passed when available.
- [ ] The user reviewed the written plan.
- [ ] Next: lightweight Cut-consistency review, then `devflow-build`; re-run affected Cut gates only on scope drift.
