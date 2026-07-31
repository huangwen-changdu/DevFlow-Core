# Plan-Owned Code Quality Gate

## Status

Proposed — requires approval before Cut or implementation.

## Context

Current quality guidance states sound engineering principles, but real code generation can still put unrelated behavior into one existing class or `Service`. A model may mention conventions and readability while selecting the shortest local edit, leaving responsibilities, key rules, and side effects mixed together.

The existing Plan Pack proves that a plan names files, locations, mechanics, interfaces, and verification. It does not require the plan to make a testable ownership decision for each changed unit. The existing Prove checklist can report quality concerns, but the lifecycle does not explicitly make unresolved diff-based code-review blockers fail proof and return to Build.

## Goal

For non-trivial code changes, make the implementation plan establish the intended responsibility boundaries before code is written, then make Prove independently review the actual diff against those boundaries, nearby project conventions, and ordinary maintainability expectations.

The gate must improve generated code without prescribing a universal architecture.

## Non-goals

- Do not require a fixed number of layers, files, classes, methods, or lines.
- Do not require `Service`, `Repository`, interface, DTO, cache, or abstraction creation.
- Do not split a coherent business workflow merely because it contains several sequential steps.
- Do not require caching without an identified workload or failure mode.
- Do not replace functional, security, or test proof with subjective style preference.

## Design Principles

1. **Project evidence before general preference.** Inspect the nearest comparable code and follow its active conventions unless a documented deviation improves correctness, local understanding, maintainability, or measured performance.
2. **Ownership by change reason.** A type or module may coordinate related work. It must not silently accumulate behavior with materially different dependencies, lifecycle, or likely reasons to change.
3. **Plans constrain ownership, not shape.** A plan says where behavior belongs and why; it never dictates a pattern solely by name.
4. **Diff is the proof input.** Prove judges the implemented change, not an implementer self-assessment or the plan text alone.
5. **Actionable review only.** A quality finding identifies changed code, observed mixing or ambiguity, concrete risk, and the smallest reasonable correction. Vague preferences are recommendations, not blockers.
6. **No silent bypass.** A real code-review blocker prevents `PASS`, returns to Build, and is re-reviewed after correction.

## Requirements

The ownership contract applies to every `Code change` task in a Plan Pack that creates, modifies, relocates, or extends runtime behavior.

A task may declare the contract `Not applicable` only when all changed runtime behavior is mechanically constrained by an existing accepted interface or generated artifact. The plan must state the reason and identify the constraining contract. Documentation-only tasks remain exempt.

## Plan Contract

### File Structure: the ownership decision

For non-trivial code changes, every approved Plan Pack must place `## File Structure` before its implementation tasks. It is the single responsibility map for the change, rather than repeating architecture prose inside every task.

```text
## File Structure

| File / symbol | Change | Responsibility | Why here | Explicitly not responsible for |
|---|---|---|---|---|
| `src/orders/OrderHistoryQuery.ts` / `OrderHistoryQuery` | Modify | Assemble the order-history read model | Extends the nearest query/read-model boundary | Authorization and cache storage |
| `src/orders/OrderHistoryCache.ts` / `OrderHistoryCache` | Modify | Own and invalidate this query's cached result | Keeps expiry and key behavior with the existing cache owner | Query selection and API mapping |
| `src/api/order-history.ts` / `getOrderHistory` | Modify | Translate request and return the existing response contract | Retains the API boundary | Business selection rules |
```

Each runtime file or symbol touched by the plan must state a concrete responsibility, placement reason based on nearby project evidence, and any meaningful responsibility deliberately left elsewhere. One coherent workflow may remain in one unit; a split is justified only by materially different dependencies, lifecycle, data ownership, or likely change reasons.

### Prewalk: the execution trace and remaining-work handoff

`Prewalk` is the bounded, append-only execution record that makes a Plan executable by another AI without requiring a fresh full-codebase review. It has two inseparable layers:

1. **Execution Trace** records real work already performed: files/symbols actually read, direct paths actually traced, commands actually run and their relevant results, edits already made, and verification already observed. It is evidence, not a proposed exploration list.
2. **Remaining Structured Worklist** turn only unfinished work into a finite, ordered sequence of independently verified actions. An executor continues from these TODOs; it does not repeat completed trace steps unless a current anchor contradicts the recorded fact.

It is independent of model choice: no hidden instruction, first-edit gate, fixed turn count, or model-switch policy is part of this contract.

For each code-change task, Prewalk records:

```text
Prewalk:

Execution Trace:
- Read: [actual file/symbol/range] → [observed fact relevant to the task].
- Traced: [actual caller, entry point, collaborator, contract, or test] → [observed path/constraint].
- Ran: [actual command or scenario] → [relevant result, including failure when applicable].
- Edited: [actual file/symbol and change] → [reason; or “none yet”].
- Verified: [actual check] → [observed result; or “none yet”].

Current Handoff Facts:
- Target anchors: [the current file, symbol, or range the next executor must minimally re-read].
- Nearby convention: [comparable file/symbol actually inspected and observed convention, or “no comparable code found”].
- Direct path: [actually traced callers/entry points, collaborators or data boundary, affected tests; or “none”].
- Current constraints: [observed contract, order, error behavior, compatibility; or “none”].
- Planned touch set: [remaining expected files/symbols and reason].
- Risks / stop conditions: [facts requiring replan; or “none beyond ordinary Plan drift”].

Remaining Structured Worklist:
- [ ] [one independently completable remaining action, with file/symbol and expected outcome].
  Anchors: [minimum anchors for this remaining action].
  Verify: [command, test, call-path check, or observable result].
  Done when: [fact proving this action is complete].
```

Every Execution Trace entry must describe an action actually performed and an observed result; it cannot be a future-tense instruction, generic claim, or empty ceremony. A remaining TODO must be ordered, small enough to verify independently, and directly tied to the approved File Structure and planned touch set. `Verify` and `Done when` cannot be omitted or replaced by a generic claim such as “check the code.” The planner caps a task's remaining TODO list at 12 items; if more are needed, it groups mechanical substeps under one independently verifiable outcome or returns a scope-splitting fact to Core.

Prewalk is not a full repository reread, a second design phase, or permission to broaden scope. Its trace/exploration budget is limited to changed targets, their direct callers or entry points, the nearest comparable implementation, relevant tests, and only contracts/configuration/data paths indicated by those facts.

### Plan author behavior

Before finalizing `File Structure` and a task's `Prewalk`, the planner must inspect the named anchors and decide whether requested behavior belongs in an existing coherent unit, a different existing specialized target, or a new target. The decision uses current project structure, dependencies, lifecycle, data ownership, and likely change reason. It must not infer that any `Service` is automatically wrong or that every technical concern needs its own type.

Tasks remain Superpowers-style execution instructions: name exact files/symbols, describe the ordered change mechanics, interfaces/contract effects, acceptance, and verification. They refer to the File Structure row and their Prewalk evidence; they do not repeat a generic responsibility form.

### Build handoff and agent control

Build treats the approved Plan, its File Structure, and the task's Prewalk Execution Trace plus Remaining Structured Worklist as the construction contract. It first reviews the latest trace to determine completed evidence and unfinished work. Before a remaining TODO starts, the executor re-reads only that TODO's `Anchors` plus any directly changed neighbor. It then completes one remaining TODO at a time, appends the real read/trace/run/edit/verification result to Execution Trace, and marks the TODO complete only when its `Done when` fact holds. It does not restart broad exploration or re-decide the ownership map by default.

Build may continue when the minimally reread anchors match the latest Execution Trace/Current Handoff Facts and the newly appended verification evidence supports each completed remaining TODO. It must stop and return scope-drift facts to Core rather than silently redesign or expand the change when it finds any of the following:

- a target anchor, caller, contract, or active convention materially differs from the Prewalk record;
- an unrecorded direct dependency, side effect, compatibility constraint, or affected test changes the chosen placement;
- a required remaining-TODO verification fails and the smallest correction is not already covered by the same File Structure responsibility and planned touch set;
- required behavior cannot fit the approved File Structure without assigning a materially distinct responsibility to an existing target; or
- the expected touch set must expand beyond a directly necessary correction.

The return records the observed mismatch, affected anchor, failed remaining-TODO verification when applicable, invalidated trace/handoff fact, and smallest replan decision needed. Build may correct an obvious stale line reference or mechanical location change without returning only when the symbol, contract, responsibility, and remaining-TODO outcome remain unchanged.

Build's existing readability check remains a local implementation check. It does not replace the independent Prove gate.

## Plan Validator Behavior

`scripts/devflow-plan.js` must validate the presence and substantive content of `## File Structure`, `Prewalk`, a real `Execution Trace`, and a finite `Remaining Structured Worklist` list when work remains for each code-change task. The checker validates the handoff contract, not architecture quality.

It must reject at least:

- a missing File Structure responsibility map for a non-trivial runtime plan;
- a runtime target without a concrete responsibility, placement reason, or explicit boundary where one is meaningful;
- a code-change task without actual trace evidence or without target anchors, nearby convention, direct path, current constraints, planned touch set, or risk/stop-condition evidence;
- a trace item that is future-tense, lacks an observed result, or falsely presents planned work as completed;
- remaining work without a finite `Remaining Structured Worklist` list;
- a remaining TODO without an explicit action, anchors, verification, or fact-based completion condition;
- more than 12 remaining TODOs in one task without a Core-approved scope split;
- unresolved placeholders or generic claims such as “follow best practices”; and
- a target or Prewalk reference that does not identify an actual file/symbol or an explicit evidence-based exception.

It must not infer whether the chosen file split is correct from text alone, nor require a fixed pattern. That judgment belongs to the Prewalk-informed, diff-based Prove review.

The checker's self-test must include:

- a passing File Structure plus real Execution Trace and bounded remaining TODOs for coherent orchestration;
- a failing plan without the File Structure map;
- a failing generic, incomplete, or future-tense Execution Trace/remaining TODO;
- a failing task whose remaining TODO count exceeds the cap without an approved split;
- a passing execution task that reuses its relevant File Structure row and appends trace evidence; and
- preservation of the documentation-only exception.

## Prove Diff-Based Code Review Gate

### Required input

For each code-change task, Prove reviews:

1. the approved `File Structure` row, task `Prewalk` Execution Trace, Current Handoff Facts, and remaining TODO completion evidence;
2. the actual working diff for the task, including relevant caller changes; and
3. the nearest comparable project code named by Prewalk, or a newly discovered more relevant comparison with the reason recorded.

### Required report

Prove emits a `Code Review Report` before a final proof judgment:

```text
Code Review Report:
- Diff reviewed: [路径或 revision 范围]
- Plan boundary: [File Structure 中的职责和明确边界]
- Prewalk evidence: [真实 Execution Trace、当前锚点/直接路径/约束、剩余 TODO 的完成证据与预期变更集合]。
- Blockers: [无或编号问题列表]。
- Warnings: [无或带已接受权衡的编号问题列表]。
- Recommendations: [无或编号的非阻塞改进]。
- Boundary verdict: aligned / deviated with accepted proof / violated
```

Each blocker and warning must include:

```text
Finding [编号]：
- Location: [变更文件与符号/行范围]。
- Observation: [diff 的实际行为]。
- Why it matters: [具体的职责、惯例、可读性、正确性、一致性或性能风险]。
- Required correction or accepted trade-off: [最小合理后续动作]。
```

### Blocker criteria

A `Blocker` exists when the actual diff has evidence of one or more of the following:

- **Responsibility violation:** a changed unit combines behavior with materially distinct dependencies, lifecycle, data ownership, or change reasons, and no approved boundary or coherent orchestration rationale supports it.
- **Opaque business logic:** a key rule, status transition, or failure decision cannot be understood from local names and structure without tracing unrelated implementation details.
- **Hidden high-impact side effect:** authorization, persistence, cache mutation/invalidation, remote call, transaction, or response mapping is hidden in an opaque block such that ordering, failure behavior, or ownership is unclear.
- **Unjustified convention break:** the diff materially conflicts with a nearby active project convention and lacks a concrete reason, impact, and proof.
- **Unsound performance behavior:** a chosen cache, optimization, or concurrency mechanism lacks the required ownership/invalidation/consistency behavior, or the diff introduces repeated expensive work on an identified hot path without a valid reason.
- **Unresolved plan deviation:** implementation changed a planned responsibility boundary without returning through the required replanning path.

A large class, a long method, a `Service` name, use of several dependencies, or absence of a cache is not independently a blocker. It becomes one only with the evidence above.

### Warning criteria

A `Warning` identifies a maintainability concern that has a bounded current impact: weak but understandable naming, local duplication without present reuse evidence, or a small convention deviation with a recorded trade-off. Warnings require an explicit correction or acceptance rationale before `PASS`.

Recommendations are optional improvements that do not affect the proof judgment.

### Gate and recovery

- `Blockers != none` → `Judgment: FAIL`; return to Build with the report. No completion claim.
- `Warnings` lacking a correction or explicit accepted trade-off → `Judgment: FAIL`; return to Build.
- Build correction → Prove must review the new diff and report which findings are resolved, retained, or newly introduced.
- Only a fresh report with no unresolved blockers and no unaccounted warnings may proceed to functional proof and final `PASS`.

## Prove Skill and Checklist Changes

The Prove instruction and review checklist must state that code review is an independent, diff-first gate. Existing general review sections should be reorganized around:

- plan-boundary alignment;
- responsibility and side-effect clarity;
- local understandability of business rules and failure paths;
- nearby project convention alignment;
- evidence-based performance and cache safety; and
- actionable blocker/warning/recommendation classification.

The recovery reference must make unresolved code-review blockers a `FAIL` return to Build rather than a comment that can coexist with `PASS`.

## Verification Scenarios

### Scenario A: Plan rejects unowned pile-up

Input plan task adds validation, database update, outbound notification, caching, and response mapping to a generic `OrderService` without comparable-code evidence or placement reasons.

Expected:

- Plan validator rejects the missing or generic File Structure/Prewalk evidence.
- It does not demand a predetermined number of replacement types.

### Scenario B: Coherent orchestration remains allowed

Input plan task extends an existing application command handler that validates input, invokes existing policy/repository/gateway collaborators, persists through an existing unit of work, and maps the known command result.

Expected:

- Plan validator accepts its File Structure row and Prewalk if the handler's orchestration role and existing conventions justify the interactions.
- Prove does not flag the class merely for using several collaborators.

### Scenario C: Diff catches boundary violation

Approved plan keeps cache invalidation in an existing cache adapter. Actual diff places cache key construction, cache writes, expiry selection, authorization checks, SQL selection, and API DTO mapping in `OrderService`.

Expected:

- Prove reports a responsibility/hidden-side-effect blocker with exact changed locations.
- Final proof is `FAIL` and returns to Build until the diff or plan boundary is corrected.

### Scenario D: Diff allows justified deviation

Actual diff differs from a nearby pattern because that pattern has a measured N+1 query issue. The diff uses a simpler batch query, preserves contracts, and records benchmark/test proof.

Expected:

- Prove records the deliberate convention deviation with reason, impact, and proof.
- No blocker is created solely because the local pattern differs.

### Scenario E: Prewalk controls delegated execution

Approved Plan has an Execution Trace that records reading `OrderHistoryQuery`, tracing its API handler, and observing no cache owner change; it has three ordered remaining TODOs with anchor, verification, and completion facts. Before editing, a Build subagent re-reads only the first remaining TODO's anchors and discovers the handler now delegates through a newly added authorization policy whose denial behavior changes the placement of the requested eligibility rule.

Expected:

- Build does not restart broad repository exploration, skip remaining-TODO verification, or silently place the rule in the easiest existing file.
- Build returns scope-drift facts: the observed policy, affected anchor, invalidated Execution Trace/Handoff Fact, blocked remaining-TODO verification, and smallest replan decision.
- After the Plan/Prewalk is corrected, the delegated Build task re-reads its updated remaining-TODO anchors, appends each real verification result to Execution Trace, and continues within the revised touch set.

## Impact

| File | Change |
|---|---|
| `skills/devflow-plan/SKILL.md` | Require an approved File Structure and bounded task Prewalk before runtime-code implementation; prohibit silent ownership or scope drift during Build handoff. |
| `skills/devflow-plan/references/plan-methods.md` | Define File Structure, Prewalk workflow, execution task template, examples, bounded reread rules, and stop/replan behavior. |
| `scripts/devflow-plan.js` | Parse and validate substantive File Structure and Prewalk fields for code-change tasks; extend self-tests. |
| `skills/devflow-prove/SKILL.md` | Require diff-first independent code review and make unresolved quality blockers fail proof. |
| `skills/devflow-prove/references/code-review-checklist.md` | Replace checklist-only quality language with plan/diff/comparable-code inputs, findings taxonomy, and blocker criteria. |
| `skills/devflow-prove/references/proof-recovery-methods.md` | Define Build return and re-review recovery for code-review failure. |
| `skills/devflow-prove/references/flow-self-test.md` | Add the four quality-gate behavior scenarios. |
| `scripts/validate-skill-triggers.js` | Add discoverability evidence for plan-owned responsibility and Prove diff review; it does not claim semantic code quality validation. |

## Acceptance

1. 非平凡运行时代码 Plan Pack 必须有具体的 `File Structure` 责任图，以及每个代码任务的有界 `Prewalk`：真实 `Execution Trace`、当前交接事实和有限、可验证的剩余 TODO；文档任务保留现有豁免。
2. Execution Trace 逐条记录已实际发生的读取、追踪、运行、编辑或验证及观察结果；每项剩余 TODO 指出最小锚点、动作、验证与基于事实的完成条件。单任务超过 12 项时必须归并可验证结果或返回 Core 拆分范围。
3. Plan 说明要求先基于邻近代码完成职责归属和 Prewalk 取证，不强制任何固定架构模式。
4. 执行代理先读取 Execution Trace 后按剩余 TODO 单项推进，仅复核该项锚点和直接变更邻域；每项完成后追加真实轨迹。事实失配、验证失败且超出既定职责、未记录依赖或职责漂移时必须返回重规划，不能静默扩展或从零广泛探索。
5. Prove 对代码变更必须以实际 diff、批准的 File Structure/Prewalk 和可比代码作为审查输入。
6. Prove 输出可操作的 blocker/warning/recommendation，存在未解决 blocker 或未交代 warning 时不得 `PASS`。
7. 审查分类阻止已证实的职责混杂、不透明关键规则/副作用、无理由惯例偏离和不健全性能行为；不以类大小或模式偏好单独拦截。
8. 系统包含未归属堆叠拒绝、连贯编排允许、diff 拒绝、合理偏离及 Prewalk 事实失配返回的自测覆盖。
9. 既有生命周期 STOP gate、Core 路由及列出文件之外的用户改动保持不变。

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Plans become boilerplate. | Validator requires specific File Structure targets/reasons, real trace evidence, and bounded remaining TODOs; Prove judges the actual diff independently. |
| Review becomes subjective architecture policing. | Blockers need observable changed-code evidence, concrete risk, and smallest correction; pattern names and size alone cannot block. |
| Implementer ignores plan or re-explores without limit. | Build reads the latest trace, performs a narrow remaining-TODO anchor reread, and returns responsibility/scope drift or trace-fact mismatch to Core/replanning. |
| Prewalk becomes a costly second discovery phase. | It records already completed bounded work; further exploration is limited to named targets, direct paths, nearest comparable code, relevant tests, and already indicated contracts. |
| Remaining TODOs become a long mechanical checklist. | Each item must end in an independent verified outcome; cap one task at 12 items and return scope-splitting facts instead of splitting into dozens of microsteps. |
| Stronger simpler solution is suppressed. | Explicit justified-deviation path accepts a better solution with reason, impact, and fresh proof. |
| Static scripts overclaim semantic enforcement. | Scripts validate handoff completeness and scenario discoverability only; Prove performs semantic review on real diff. |

## Approach

以 `File Structure` 作为一次性的职责决策，以任务级 `Prewalk` 作为真实执行轨迹、当前交接事实和带验证的剩余 TODO；任意执行代理先续接轨迹、只复核指定锚点、逐项验证并追加事实，失配时停止重规划；Prove 再用真实 diff 独立审查。模型切换、隐藏提示词、固定回合和首次编辑闸门不属于此流程契约。

比较过的方案：

- 维持现有任务字段，仅强化原则提示：改动最小，但不能提供可控代理交接，拒绝。
- 每个任务填完整职责表单：可验证字段更多，但重复、官僚化且容易产生模板话，拒绝。
- 固定分层或类数量：容易静态检查，但限制项目惯例与连贯编排，拒绝。
- `File Structure` + 有界 `Prewalk`（真实执行轨迹 + 剩余验证 TODO）+ diff-first Prove：在不指定架构形态或模型切换策略的前提下，分别锁定职责、已完成事实/剩余进度和交付审查，采用。
- 前沿模型先编辑后切换、隐藏提示词或固定回合闸门：属于模型调度策略，不能提升 Plan 的跨代理可执行性，拒绝。

权衡：Plan 比原来增加小范围走查和交接内容；换来执行代理无需全仓重读，并能在事实失配时停止而非静默偏离。

## Verification

- 运行 `node scripts/devflow-spec.js docs/specs/2026-07-31-plan-owned-code-quality-gate.md`。
- 实现后运行 `node scripts/devflow-plan.js --self-test`，覆盖 File Structure、Execution Trace 的真实动作/观察结果、剩余 TODO 的锚点/验证/完成条件、TODO 上限、文档豁免及泛化输入拒绝。
- 运行 Prove 流程自测，覆盖连贯编排允许、职责混杂拒绝、合理偏离允许，以及代理续接 Execution Trace 时 Prewalk 事实失配返回重规划。
- 对实现 diff 做独立 Code Review Report，确认未解决 blocker 或 warning 不产生 `PASS`。

## Code Documentation

- `skills/devflow-plan/references/plan-methods.md`：解释 `Prewalk` 的真实执行轨迹、剩余验证 TODO、最小复核及停止条件，防止它被误用为全仓重读或模型调度策略。
- `scripts/devflow-plan.js`：在校验函数旁说明它只校验交接内容完整性，不裁定架构优劣。
- `skills/devflow-prove/references/code-review-checklist.md`：解释 File Structure/Prewalk 是 diff 审查基线，避免将类大小或模式名称作为独立 blocker。

## Open Questions

none

## Approval Request

Approve this specification to proceed to Cut. After approval, the next stage will reduce scope and verify that the existing Plan Pack checker and Prove recovery path are the smallest viable enforcement points.
