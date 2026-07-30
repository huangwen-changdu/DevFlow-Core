---
name: devflow-plan
description: "Use after Core-selected CUT_PASS and an approved design or saved spec to write a reviewed, executable implementation plan that returns to devflow-core."
---

# DevFlow Plan

Turn a `devflow-core`-selected, `CUT_PASS`-bounded approved design or confirmed Spec into one reviewed Plan Pack. This is the only DevFlow plan-generation skill; `/devflow-plan` is its command entry.

## Inputs And Output

- Consumes: a Core-selected `CUT_PASS` (allowed scope, reuse conclusion, exclusions, verification constraints) plus an approved design or `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`.
- Produces: one reviewed `docs/plans/YYYY-MM-DD-<short-kebab-name>.md` construction Plan Pack, then returns the confirmed Plan to `devflow-core`.
- Do not generate a plan without Core selection, `CUT_PASS`, or approved source material. Return the missing fact to Core.

## Authoring Process

1. Read only source material, code, tests, and conventions relevant to the approved scope. Load `skills/devflow-spec/references/spec-plan-methods.md` before applying Plan Pack mechanics.
2. Map exact affected file responsibilities before writing tasks. Reuse existing modules and name the intended file operation.
3. Split independent deliverables into small, reviewable tasks. Each task should be understandable without referring to another task.
4. Write the plan using the required header and task contract below.
5. Self-review Cut Decision fidelity, source coverage, file-operation classifications, interface consistency, concrete steps, acceptance proof, and scope exclusions.
6. Run `node scripts/devflow-plan.js <plan-file>` when the project-level checker exists. Otherwise resolve the user-level checker according to `core-methods.md` Script Path Resolution.
7. **STOP — request user review.** Revise and revalidate when requested. After approval, perform only a lightweight Cut-consistency review. Return the confirmed Plan and any scope-drift facts to `devflow-core`; only Core selects `devflow-build` or any other later lifecycle work.

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
External Skills: <skill-name> (role: guides execution) / none

## Global Constraints
- <applicable boundary>
```

Inherit `External Skills` from the Cut Decision unchanged. When a guidance skill is declared, merge its core quality checks into the affected tasks' `Acceptance` and `Verify` fields — the Plan Pack is the only channel that carries external-skill quality requirements into Build and Prove. A declared skill never widens the Cut scope; if its recommendation exceeds the Cut Decision, return the scope-drift facts to `devflow-core`.

## Required Task Contract

```text
Task: <short, independently understandable title>
Task type: Code change | Documentation-only
Files:
- Create: <path> | new file | <responsibility>
- Modify: <path> | <symbol or stable anchor> | <responsibility>
- Test: <path> | <test symbol or stable anchor> | <behavior proved>  # only when applicable
Interfaces:
- Consumes: <exact symbol/API input and type/shape, or documentation-only exception>
- Produces: <exact symbol/API output and type/shape, or documentation-only exception>
Current behavior: <observable current state>  # Code change only
Target behavior: <observable outcome>  # Code change only
Change mechanics: <minimal code snippet, pseudocode, or exact replacement rule>  # Code change only
Call impact: <known callers/downstream effect, or no runtime impact>  # Code change only
Steps:
- [ ] <one file + symbol/anchor + executable action; include the relevant snippet, pseudocode, or exact replacement for code logic>
- [ ] <one verification action with trigger/input, expected result, and command or manual scenario>
Acceptance: <specific observable condition>
Verify: <exact command or manual scenario, trigger/input, and expected result>
Comments: <required function/inline comments, or "none — trivial change">
Not doing: <scope excluded>
```

Use only `Create`, `Modify`, and `Test` file-operation labels. For a `Code change`, every existing-file row must name a symbol or stable anchor; `Create` rows use `new file`. `Current behavior`, `Target behavior`, `Change mechanics`, and `Call impact` are mandatory. `Change mechanics` must contain the smallest code snippet, pseudocode, or exact replacement rule that removes implementation inference. Interfaces name exact symbols and input/output shape. The verification step and `Verify` field name the trigger/input, expected result, and runnable command or manual scenario.

`Documentation-only` is allowed only when no runtime code changes. Its `Consumes` and `Produces` entries explicitly say `documentation-only`; it cannot label a task that changes a code file. A task does not need a test file unless a test is needed for its stated behavior. Avoid vague work such as generic test additions, unnamed edge cases, cleanup, or cross-task shorthand.

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
| "The task details can broaden the solution." | If a task exceeds the Cut Decision, return the scope-drift facts to `devflow-core`; only Core decides whether affected Cut gates must run before any later lifecycle work. |

## Verification

Before leaving this skill, confirm:

- [ ] `CUT_PASS` is cited with allowed scope, reuse conclusion, exclusions, and verification constraints.
- [ ] `External Skills` is inherited from the Cut Decision; declared skills' quality checks are merged into task `Acceptance`/`Verify`.
- [ ] Approved design or saved spec is cited as `Source`.
- [ ] `Spec coverage` maps the source to plan tasks.
- [ ] Header, constraints, file map, interfaces, concrete steps, acceptance, verification, comments, and exclusions are present.
- [ ] Every task is independently understandable and has no unresolved or vague placeholder.
- [ ] The checker passed when available.
- [ ] The user reviewed the written plan.
- [ ] The confirmed Plan and any scope-drift facts return to `devflow-core`; Plan did not select Build or another lifecycle skill.
