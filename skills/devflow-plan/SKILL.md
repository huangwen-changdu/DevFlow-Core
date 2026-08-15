---
name: devflow-plan
description: "Use after A/B CUT_PASS and an approved design or saved spec to write a reviewed, executable implementation plan that directly enters devflow-build after user approval; scope drift returns facts to devflow-core."
---

# DevFlow Plan

Turn an A/B `CUT_PASS`-bounded approved design or confirmed Spec into one reviewed Plan Pack. This is the only DevFlow plan-generation skill; `/devflow-plan` is its command entry.

## Inputs And Output

- Consumes: an A/B `CUT_PASS` (allowed scope, reuse conclusion, exclusions, verification constraints) plus an approved design or `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`.
- Produces: one reviewed `docs/plans/YYYY-MM-DD-<short-kebab-name>.md` construction Plan Pack, then directly enters `devflow-build` after approval.
- Do not generate a plan without A/B depth, `CUT_PASS`, or approved source material. Return the missing fact to Core.

## Authoring Process

1. Read only source material, code, tests, and conventions relevant to the approved scope. Load `skills/devflow-spec/references/spec-plan-methods.md` and `skills/devflow-plan/references/plan-methods.md` before applying Plan Pack mechanics.
2. Map exact affected file responsibilities once in `## File Structure` before writing tasks. Reuse existing modules and name the intended file operation.
3. Perform bounded real investigation and record it as task-level `Prewalk`: actual `Execution Trace`, Current Handoff Facts, and only the unfinished `Remaining Structured Worklist`.
4. Split independent deliverables into small, reviewable tasks. Each task should be understandable without referring to another task.
5. Write the plan using the required header and task contract below.
6. Self-review Cut Decision fidelity, source coverage, File Structure, Prewalk evidence, file-operation classifications, interface consistency, concrete steps, acceptance proof, and scope exclusions.
7. Run `node scripts/devflow-plan.js <plan-file>` when the project-level checker exists. Otherwise resolve the user-level checker according to `core-methods.md` Script Path Resolution.
8. **STOP — request user review.** On DSH, request review with the structured `ask_user_question` tool (single-select: approve / request changes). Revise and revalidate when requested. On approval, ask execution mode (single-select: `sequential` — one Build agent runs tasks in dependency order / `fan-out` — independent tasks run as parallel subagents) and record it as the plan's optional `Execution mode` header. Then perform only a lightweight Cut-consistency review. An approved A/B Plan directly enters `devflow-build`; scope-drift facts return to `devflow-core`.

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
External Skills: <skill-name>; role: <bounded specialist work>; expected evidence: <result needed by that node>; return facts: <result / not-applicable / failure> / none
Execution mode: sequential | fan-out (optional; ask and record at approval)

## Global Constraints
- <applicable boundary>

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| <path and stable anchor> | Create / Modify / Test | <one responsibility> | <placement rationale> | <explicit boundary> |
```

Inherit `External Skills` from the Cut Decision unchanged; the Plan Pack carries the specialist role, expected evidence, and return facts into Build and Prove. When a specialist skill is declared, merge its core quality checks into the affected tasks' `Acceptance` and `Verify` fields — the Plan Pack is the only channel that carries external-skill quality requirements into Build and Prove. A declared skill never widens the Cut scope; if its recommendation exceeds the Cut Decision, return the scope-drift facts to `devflow-core`.

`Execution mode` is not part of Cut scope and does not change the checker. It is asked at approval and recorded so Build knows whether to run tasks sequentially or fan out independent tasks to subagents.

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
Comments: <locations and reasons required by Code Documentation, project convention, or non-obvious boundaries; or "none — trivial change">
Not doing: <scope excluded>

Prewalk:

Execution Trace:
- Read: <actual file/symbol/range> → <observed fact relevant to this task>.
- Traced: <actual caller, entry point, collaborator, contract, or test> → <observed path or constraint>.
- Ran: <actual command or scenario> → <relevant result, including a failure when applicable>.
- Edited: <actual file/symbol and change> → <reason; or "none yet">.
- Verified: <actual check> → <observed result; or "none yet">.

Current Handoff Facts:
- Target anchors: <current file, symbol, or range that Build minimally re-reads>.
- Nearby convention: <comparable inspected code and observed convention; or "no comparable code found">.
- Direct path: <traced callers, collaborators, boundaries, affected tests; or "none">.
- Current constraints: <observed contract, ordering, errors, compatibility; or "none">.
- Planned touch set: <remaining expected files/symbols and reason>.
- Risks / stop conditions: <facts requiring Core replan; or "none beyond ordinary Plan drift">.

Remaining Structured Worklist:
- [ ] <one independently completable remaining action with file/symbol and expected outcome>.
  Anchors: <minimum current anchors>.
  Verify: <command, test, call-path check, or observable result>.
  Done when: <fact proving this action is complete>.
```

`File Structure` is one responsibility map, not a fixed architecture rule. For every non-trivial Code change, every task must carry a `Prewalk`. Each trace row records an action actually performed and its observed result; it cannot describe planned work. `Remaining Structured Worklist` contains only unfinished actions. Each item needs `Anchors`, `Verify`, and `Done when`; cap one task at 12 items. Build reads the latest trace first, minimally re-reads the current item's anchors and directly changed neighbor, appends actual evidence after the item, and returns facts to `devflow-core` if anchors, contracts, conventions, direct dependencies, responsibility, or directly necessary touch set contradict the handoff. Documentation-only tasks retain their existing exception.

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
| "The task details can broaden the solution." | If a task exceeds the Cut Decision, return the scope-drift facts to `devflow-core`; do not directly enter Build. |

## Verification

Before leaving this skill, confirm:

- [ ] `CUT_PASS` is cited with allowed scope, reuse conclusion, exclusions, and verification constraints.
- [ ] `External Skills` is inherited from the Cut Decision; declared skills' quality checks are merged into task `Acceptance`/`Verify`.
- [ ] Execution mode was asked at approval and recorded as the optional `Execution mode` header.
- [ ] Approved design or saved spec is cited as `Source`.
- [ ] `Spec coverage` maps the source to plan tasks.
- [ ] Header, constraints, File Structure, interfaces, concrete steps, acceptance, verification, context-specific comments, exclusions, and task-level Prewalk records are present.
- [ ] Each trace entry is an observed past action/result; each remaining worklist item is bounded, verified, and fact-complete.
- [ ] Every task is independently understandable, requires only minimal anchor reread, and has no unresolved or vague placeholder.
- [ ] The checker passed when available.
- [ ] The user reviewed the written plan.
- [ ] An approved A/B Plan entered `devflow-build`; any scope-drift facts returned to `devflow-core`.
