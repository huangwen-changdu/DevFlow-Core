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
2. Map the intended touch set once: list the files and the responsibility each one carries. Reuse existing modules and name the intended file operation.
3. Do the bounded investigation needed to write correct tasks. Keep that evidence in the conversation or in a learning card; it is not a plan field.
4. Split by delivery unit: one task = one independently verifiable deliverable and the smallest unit worth a fresh reviewer's gate — split only where a reviewer could meaningfully reject one task while approving its neighbor, and fold setup, configuration, scaffolding, and documentation into the task whose deliverable needs them. Split whenever `Acceptance` needs `且`/`and` to join two independently verifiable results; keep one task when the same rule mirrors across files — mirrored edits are one delivery unit, not one task per file. Each task carries `Files`, `Change`, `Acceptance`, `Verify`, and `Not doing` so an executor can act on it without reading another task.
5. Write the plan using the required header, task contract, and `## Progress` table below.
6. Self-review Cut fidelity, touch-set coverage, acceptance proof, scope exclusions, and Progress row count against the task count.
7. Run `node scripts/devflow-plan.js <plan-file>` when the project-level checker exists. Otherwise resolve the user-level checker according to `core-methods.md` Script Path Resolution.
8. **STOP — request user review.** On DSH, request review with the structured `ask_user_question` tool (single-select: approve / request changes). Revise and revalidate when requested. On approval, ask execution mode (single-select: `sequential` — the Build agent runs tasks in dependency order / `single-subagent` — the main agent only schedules: one subagent runs tasks one per round in dependency order / `fan-out` — independent tasks run as parallel subagents) and record it as the plan's optional `Execution mode` header. Then perform only a lightweight Cut-consistency review. An approved A/B Plan directly enters `devflow-build`; scope-drift facts return to `devflow-core`.
9. On approval, advance the requirement row in `docs/requirements.md` to `planned` and fill the plan path in its artifact column.

Default landing is `docs/plans/YYYY-MM-DD-<short-kebab-name>.md`, resolved from the target project root. Do not place implementation plans in `docs/features/` or `docs/specs/`.

## Required Plan Header

Structural headers remain English so the checker can parse them; content uses the user's language.

```text
# <Plan title>

Status: draft | approved | in-progress | done | abandoned
Goal: <outcome>
Not doing: <scope excluded>
Cut: 做 <included> | 不做 <excluded> | 复用 <reused capability> | 验证 <verification> | Rejected: <at least one cut candidate, or none plus evidence why nothing could be cut>
Source: <approved design or docs/specs/YYYY-MM-DD-<short-kebab-name>.md> (optional)
Execution mode: sequential | single-subagent | fan-out (optional; ask and record at approval)
Landed: <date and fresh evidence> (completion only)

## Tasks

Task: <short, independently understandable title>
Files:
- Create: <path> | new file | <responsibility>
- Modify: <path> | <symbol or stable anchor> | <responsibility>
- Test: <path> | <symbol or stable anchor> | <behavior proved>  # only when applicable
Change: <what changes and its boundary; add the smallest mechanics (pseudocode, exact replacement, or key fragment) only when the change crosses a module contract, is irreversible, touches security or data boundaries, or the mechanism cannot be inferred from the task's named anchors by a different session or model>
Acceptance: <specific observable condition>
Verify: <exact command or manual scenario, trigger/input, and expected result>
Not doing: <scope excluded by this task>

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | <task title> | todo | - |
```

The v2 header is deliberately slim: the Plan owns ordering and acceptance, while Cut owns the subtraction and Build owns how the change is implemented. `Cut` is one line and must carry a non-empty `Rejected` (or `none` plus evidence), so a plan without a real subtraction is visible instead of silently passing. `## Progress` is the resume and landing record: Build flips one row to `doing` or `done` and fills its evidence, and Prove writes `Landed` on `PASS`. A plan without `## Progress` and with a `Prewalk` block is a legacy plan; `scripts/devflow-plan.js` keeps validating it with the old rules, so existing plans never need migration.

Inherit `External Skills` from the Cut Decision unchanged; the Plan Pack carries the specialist role, expected evidence, and return facts into Build and Prove. When a specialist skill is declared, merge its core quality checks into the affected tasks' `Acceptance` and `Verify` fields — the Plan Pack is the only channel that carries external-skill quality requirements into Build and Prove. A declared skill never widens the Cut scope; if its recommendation exceeds the Cut Decision, return the scope-drift facts to `devflow-core`.

`Execution mode` is not part of Cut scope and does not change the checker. It is asked at approval and recorded so Build knows how to run tasks: sequentially as the Build agent itself, through one delegated subagent while the main agent only schedules, or fan out independent tasks to parallel subagents.

Each task's `Files`, `Change`, `Acceptance`, `Verify`, and `Not doing` form the execution basis（执行规范）handed to the executor. Build may read the current task's named anchors and a directly changed neighbor to choose the smallest implementation; it must not broadly rediscover the repository, redesign outside the task boundary, silently repair the plan, or expand the touch set. A real anchor mismatch or verification failure returns `BUILD_BLOCKED` facts to `devflow-core` instead of a guessed edit.

## Required Task Contract

```text
Task: <short, independently understandable title>
Files:
- Create: <path> | new file | <responsibility>
- Modify: <path> | <symbol or stable anchor> | <responsibility>
- Test: <path> | <symbol or stable anchor> | <behavior proved>  # only when applicable
Change: <what changes and its boundary; exact mechanics (pseudocode, exact replacement, or key fragment) only when the change crosses a module contract, is irreversible, touches security or data boundaries, or the mechanism cannot be inferred from the task's named anchors by a different session or model>
Acceptance: <specific observable condition>
Verify: <exact command or manual scenario, trigger/input, and expected result>
Not doing: <scope excluded by this task>
```

Use only `Create`, `Modify`, and `Test` file-operation labels. `Create` rows use `new file`; every other row names a symbol or stable anchor. `Change` states the executable intent and its boundary in one or two lines; it does not restate current behavior, target behavior, call impact, or interfaces unless the task changes a cross-module contract. When the mechanism cannot be inferred from the task's named anchors — the common case when a different session or model executes the plan — `Change` carries the smallest runnable mechanics (pseudocode, exact replacement, or key fragment) so the executor acts without the author's session context. The Plan no longer classifies tasks by `Task type`: a task whose files are all documentation paths is documentation-only, and the checker treats it that way.

Six fields per task is the whole contract: ordering, the touch set, the intent, the acceptance condition, the proof command, and the exclusion. `Acceptance` states one observable result; a `；`/`;`-joined multi-result acceptance is a split signal and the checker fails it while the plan is active. Plan length has no fixed total line cap: it grows with the number of delivery units while every task keeps the six-field, one-result shape. Investigation traces, handoff facts, per-task worklists, architecture, tech stack, spec coverage, and comment locations are owned by other nodes or stay in the conversation. `Prewalk`, `File Structure`, `Interfaces`, `Current behavior`, `Target behavior`, `Change mechanics`, `Call impact`, and `Comments` are not part of the v2 contract; a plan that still carries them is treated as legacy.

Keep one task understandable on its own. Do not use cross-task shorthand, generic test additions, unnamed edge cases, or cleanup entries. Name a test file only when the stated behavior needs one.

## Boundaries

Plan generation does not repeat Cut, perform Build or Prove, prescribe independent review, test-first workflow, version-control task steps, or execute automatically. It converts `CUT_PASS` into a slim construction checklist plus a Progress record. The checker validates static structure; it does not judge architecture or lifecycle state. The v2 contract applies to new plans only; legacy plans keep the old validation rules and are never migrated or rewritten.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The implementation can fill in the details." | A task must already name files, contracts, steps, acceptance, and proof. |
| "A task can refer to the previous task." | Repeat the needed detail; each task is reviewable alone. |
| "Every task needs a test file." | Name a test only when its behavior needs one; do not prescribe test-first workflow. |
| "The checker proves the architecture." | It proves structure only; the author must review scope and design consistency. |
| "The plan is approved, so Cut can be skipped." | Plan generation requires an existing `CUT_PASS`; it cannot replace the earlier reuse and scope decision. |
| "The task details can broaden the solution." | If a task exceeds the Cut Decision, return the scope-drift facts to `devflow-core`; do not directly enter Build. |
| "Two results can share one task when they ship together." | Two independently verifiable results are two delivery units; split the task or reduce `Acceptance` to one observable result. |
| "A different session or model will figure out the how." | If the mechanism cannot be inferred from the task's named anchors, `Change` must carry the smallest runnable mechanics; otherwise the handoff stalls. |

## Verification

Before leaving this skill, confirm:

- [ ] `Cut` is one line with 做 / 不做 / 复用 / 验证 and a non-empty `Rejected`.
- [ ] `External Skills` is inherited from the Cut Decision; declared skills' quality checks are merged into task `Acceptance`/`Verify`.
- [ ] Execution mode was asked at approval and recorded as the optional `Execution mode` header.
- [ ] Approved design or saved spec is cited as optional `Source`.
- [ ] Header, tasks, and `## Progress` match the v2 contract; each task has six fields and no legacy field.
- [ ] Every task is independently understandable and has no unresolved or vague placeholder.
- [ ] Each task is exactly one delivery unit: no `；`/`;`-joined `Acceptance`, and a mirrored rule was not split per file.
- [ ] Every task is executable by a different session or model from its six fields plus named anchors: a non-inferable mechanism carries the smallest runnable mechanics.
- [ ] Progress row count equals task count; every `done` row carries evidence.
- [ ] The checker passed when available.
- [ ] The user reviewed the written plan.
- [ ] An approved A/B Plan entered `devflow-build`; any scope-drift facts returned to `devflow-core`.
