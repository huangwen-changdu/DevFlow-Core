# Plan-Owned Code Quality Gate

Goal: 让批准的 Plan 以责任图与可审计 Prewalk 交接给执行代理，并让 Prove 基于真实差异进行独立质量审查。
Architecture: 保持既有 Markdown Skill、Node 静态校验器和场景验证结构；新增 Plan 方法参考文件，只扩展现有解析、报告和触发检查，不引入依赖或新运行时层。
Tech Stack: Node.js、CommonJS、Markdown Skill references、现有 npm scripts。
Source: docs/specs/2026-07-31-plan-owned-code-quality-gate.md
Spec coverage: File Structure/Prewalk 由 Task 1-2 覆盖；受控执行、diff-first Prove 和恢复由 Task 3-4 覆盖；可发现性由 Task 5 覆盖。
Cut Decision: CUT_PASS；复用现有 `devflow-plan`、`devflow-prove`、`devflow-plan.js`、`validate-skill-triggers.js` 与场景框架；不新增依赖、抽象层、模型调度或全仓审查；验证必须覆盖计划静态校验、自测、触发链检查和项目回归入口。
External Skills: none

## Global Constraints
- `File Structure` 只记录当前职责归属，不按固定类数、层数或模式名强制拆分。
- `Prewalk` 由真实 `Execution Trace`、当前交接事实和剩余结构化工作清单组成；已完成事实与未完成行动不得混写。
- 执行代理仅复读当前工作项锚点及直接变更邻域；事实失配、职责漂移或超出触及集合时返回 `devflow-core`。
- Prove 的代码审查以实际 diff、批准边界、Prewalk 证据和邻近可比实现为输入；未处理 Blocker 或 Warning 不得 PASS。
- 不实现模型切换、隐藏提示、首次编辑闸门、固定回合或自动架构裁决。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `skills/devflow-plan/SKILL.md` / Plan Pack contract | Modify | 要求责任图和任务级 Prewalk，并定义 Build 续接规则。 | 这是 Plan 的公开加载入口。 | 不解析或裁决计划内容。 |
| `skills/devflow-plan/references/plan-methods.md` / new file | Create | 保存模板、真实轨迹规则、最小复读和停止条件。 | 细节不应膨胀入口 Skill。 | 不选择生命周期或执行 Build。 |
| `scripts/devflow-plan.js` / `checkPlan`, `checkTask`, `selfTest` | Modify | 静态校验责任图、真实轨迹、交接事实和有限工作清单。 | 已有 Plan 结构检查与内嵌自测。 | 不推断架构拆分正确性。 |
| `skills/devflow-prove/SKILL.md` / Code Quality Review | Modify | 规定 diff-first 审查顺序、报告字段和未解决发现的 FAIL 行为。 | 这是完成声明前的质量门入口。 | 不自行选择修复生命周期所有者。 |
| `skills/devflow-prove/references/code-review-checklist.md` / How to Use and General Engineering Review | Modify | 将计划边界、Prewalk、实际 diff 与 finding 分类纳入审查输入。 | 已有两层工程质量检查。 | 不以风格偏好阻断小改动。 |
| `skills/devflow-prove/references/proof-recovery-methods.md` / proof recovery | Modify | 规定修复后重审新 diff 与逐项关闭发现。 | 已有 FAIL/恢复证据方法。 | 不把普通审查修复升级成 PUA。 |
| `skills/devflow-prove/references/flow-self-test.md` / scenarios 5A, 5B, 7A | Modify | 固化责任图、Prewalk、diff 阻断、合理偏离和续接回退场景。 | 已有生命周期场景测试集合。 | 不替代可执行脚本验证。 |
| `scripts/validate-skill-triggers.js` / `scenarios` | Modify | 保证 Plan 交接和 Prove diff-first 门可从触发面发现。 | 已有静态触发链断言。 | 不判断实际 diff 的工程质量。 |

Task: Define Plan responsibility and Prewalk handoff guidance
Task type: Documentation-only
Files:
- Modify: skills/devflow-plan/SKILL.md | Plan Pack contract and Authoring Process | require File Structure and Prewalk handoff
- Create: skills/devflow-plan/references/plan-methods.md | new file | store templates and execution-continuation methods
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-plan/SKILL.md` at `Authoring Process`, `Required Plan Header`, `Required Task Contract`, `Boundaries`, and `Verification` using exact replacement rules: require one global File Structure before tasks; require each Code change task to include actual Execution Trace, Current Handoff Facts, and a bounded Remaining Structured Worklist; retain the documentation-only exception.
- [ ] Create `skills/devflow-plan/references/plan-methods.md` using a Markdown template for File Structure and Prewalk; define actual-versus-planned trace evidence, a twelve-item worklist cap, minimum anchor reread, per-item trace append, and Core-return conditions.
- [ ] Run `node scripts/devflow-plan.js docs/plans/2026-07-31-plan-owned-code-quality-gate.md`; expect the Plan Pack remains structurally valid before extending the validator.
Acceptance: Plan authors receive one unambiguous template that distinguishes completed evidence from remaining execution and does not prescribe model behavior or a fixed architecture.
Verify: Run `node scripts/devflow-plan.js docs/plans/2026-07-31-plan-owned-code-quality-gate.md`; expect `Judgment: PASS` after the completed Plan Pack conforms to the existing static contract.
Comments: `skills/devflow-plan/references/plan-methods.md` explains contract rationale and stop conditions; no narration comments are added elsewhere.
Not doing: changing Build code, adding a model-switch protocol, or inferring responsibility boundaries automatically.

Prewalk:

Execution Trace:
- Read: `skills/devflow-plan/SKILL.md` → current task contract already supplies Files, Interfaces, behavior, mechanics, steps, acceptance, verification and exclusions, but has no File Structure or continuation trace.
- Read: `skills/devflow-spec/references/spec-plan-methods.md` → it establishes that Plan consumes A/B CUT_PASS and outputs one reviewed Plan Pack, while static validation does not judge architecture.
- Traced: `scripts/validate-skill-triggers.js` plan-construction scenario → the activation chain currently cites the Plan Skill and shared spec/plan reference only.
- Ran: no Plan implementation command → no Plan guidance implementation exists yet.
- Edited: none → guidance change remains pending.
- Verified: approved source `docs/specs/2026-07-31-plan-owned-code-quality-gate.md` records File Structure and Prewalk requirements → task scope matches the approved design.

Current Handoff Facts:
- Target anchors: `skills/devflow-plan/SKILL.md` sections `Authoring Process`, `Required Plan Header`, `Required Task Contract`, `Boundaries`, and `Verification`.
- Nearby convention: `skills/devflow-spec/references/spec-plan-methods.md` separates stable shared methods from concise owner Skill entry guidance.
- Direct path: `devflow-plan` produces saved Plan Packs, then approved A/B Plans directly enter `devflow-build`.
- Current constraints: Plan does not repeat Cut, Build or Prove; scope drift returns facts to `devflow-core`.
- Planned touch set: the Plan Skill and a new local `plan-methods.md` reference file only.
- Risks / stop conditions: if required fields cannot coexist with existing checker parsing, stop this task and return parser-boundary facts to Core.

Remaining Structured Worklist:
- [ ] Add the Plan Skill handoff requirements.
  Anchors: `skills/devflow-plan/SKILL.md` Plan Pack contract sections.
  Verify: inspect each required contract section for File Structure and Prewalk terms.
  Done when: all public Plan authoring and verification instructions consistently require the new handoff.
- [ ] Add the local Plan methods reference.
  Anchors: new `skills/devflow-plan/references/plan-methods.md`.
  Verify: read the template and confirm it separates Execution Trace from Remaining Structured Worklist.
  Done when: the file provides templates, cap, minimum reread and return conditions without lifecycle selection.

Task: Enforce Plan responsibility and Prewalk structure
Task type: Code change
Files:
- Modify: scripts/devflow-plan.js | `fieldBlock`, `checkTask`, `checkPlan`, `report`, `selfTest` | parse and statically validate the new Plan contract
Interfaces:
- Consumes: `checkPlan(body: string)` where Plan Markdown includes File Structure and task Prewalk sections
- Produces: existing report output and exit code, extended with responsibility-map, trace, handoff-fact, and remaining-worklist failures
Current behavior: the checker validates header and task fields, file rows, behavior/mechanics, steps and verification but does not parse File Structure or Prewalk substructures.
Target behavior: non-trivial Code change plans require substantive File Structure rows plus actual Execution Trace, Current Handoff Facts and bounded Remaining Structured Worklist entries; documentation-only tasks retain the existing exemption.
Change mechanics: pseudocode: add explicit section delimiters for `## File Structure` and task-level `Prewalk`; parse pipe-table rows and required subheadings; validate actual-action plus observed-result trace rows, concrete handoff facts, worklist item anchors/verify/done conditions, and the twelve-item maximum; join these issue arrays into existing `checkPlan`/`report` results; construct passing and failing in-memory plans in `selfTest`.
Call impact: `node scripts/devflow-plan.js [plan-file] [--self-test]` remains the CLI contract, while saved Code change Plan Packs receive additional failure diagnostics.
Steps:
- [ ] Modify `scripts/devflow-plan.js` functions `fieldBlock`, `checkTask`, and `checkPlan` using pseudocode: bound nested Prewalk blocks without corrupting existing task fields; parse File Structure rows; link each Code change task target to a responsibility row; collect explicit validation failures rather than throw on malformed Markdown.
- [ ] Modify `scripts/devflow-plan.js` function `report` using exact replacement rules: print responsibility-map and Prewalk failure details alongside current global and per-task diagnostics; preserve plan-landing and documentation-only messages.
- [ ] Modify `scripts/devflow-plan.js` function `selfTest` using pseudocode: add passing real-trace/remaining-worklist input plus failures for missing File Structure, future-tense or result-free trace, incomplete work item, over-cap worklist, and retain documentation-only passing coverage.
- [ ] Run `node scripts/devflow-plan.js --self-test`; expect `DevFlow plan self-test passed` and zero thrown self-test errors.
Acceptance: the validator rejects boilerplate or incomplete execution handoffs while continuing to validate existing Plan Pack fundamentals and without claiming to judge architectural quality.
Verify: Run `node scripts/devflow-plan.js --self-test`; expect `DevFlow plan self-test passed`. Run `node scripts/devflow-plan.js docs/plans/2026-07-31-plan-owned-code-quality-gate.md`; expect `Judgment: PASS` after this Plan Pack is updated to the enforced structure.
Comments: add or update function comments only for parsing boundaries and validation responsibilities that are not evident from the function names.
Not doing: reading repository source files to infer whether a proposed file split is architecturally correct, changing CLI arguments, or adding parsing dependencies.

Prewalk:

Execution Trace:
- Read: `scripts/devflow-plan.js` → current `checkPlan` delegates flat task fields to `checkTask`; `fieldBlock` ends only at known flat fields; `selfTest` is in-memory.
- Read: `scripts/devflow-plan.js` → unresolved marker handling rejects the literal word `Worklist`, so the approved specification uses `Remaining Structured Worklist` as the equivalent field name.
- Traced: `report` → it already aggregates issue arrays and preserves a single CLI exit-code contract.
- Ran: `node scripts/devflow-spec.js docs/specs/2026-07-31-plan-owned-code-quality-gate.md` → returned FAIL after the semantic edit; exact diagnostic was unavailable.
- Edited: none → parser and tests remain unchanged.
- Verified: existing `selfTest` covers valid Code change and Documentation-only plans plus malformed task variants → extension can reuse the current test harness.

Current Handoff Facts:
- Target anchors: `scripts/devflow-plan.js` functions `fieldBlock`, `checkTask`, `checkPlan`, `report`, `selfTest`.
- Nearby convention: existing helpers return issue arrays and aggregate booleans rather than terminating inside parsing helpers.
- Direct path: CLI invokes `selfTest` for `--self-test`; otherwise `report(readInput(args), targetArg)` determines exit code.
- Current constraints: unresolved placeholders remain rejected; Documentation-only tasks require documentation-only interfaces and cannot include runtime files.
- Planned touch set: `scripts/devflow-plan.js` only.
- Risks / stop conditions: if a nested Prewalk heading makes `splitTasks` or `fieldBlock` misattribute a legacy field, stop and return a minimal parsing counterexample before broad refactoring.

Remaining Structured Worklist:
- [ ] Modify `scripts/devflow-plan.js` parsing to add bounded sections and table parsing for File Structure and Prewalk.
  Anchors: `scripts/devflow-plan.js` `fieldBlock`, `checkPlan`.
  Verify: self-test plans with valid and missing sections produce the expected boolean result.
  Done when: parser extracts only the intended global map and each task's nested handoff sections.
- [ ] Modify `scripts/devflow-plan.js` semantic validators to emit explicit Prewalk diagnostics.
  Anchors: `scripts/devflow-plan.js` `checkTask`, `report`.
  Verify: each invalid trace, fact and worklist fixture yields a named report issue.
  Done when: generic, future-tense and unbounded handoffs fail with actionable messages.
- [ ] Modify `scripts/devflow-plan.js` self-test to add boundary regression coverage.
  Anchors: `scripts/devflow-plan.js` `selfTest`.
  Verify: run the self-test command.
  Done when: valid continuation and documentation-only fixtures pass; all new malformed fixtures fail.

Task: Make Prove a diff-first quality gate
Task type: Documentation-only
Files:
- Modify: skills/devflow-prove/SKILL.md | Process, Code Review Report, STOP gate | require actual-diff review and blocker/warning closure
- Modify: skills/devflow-prove/references/code-review-checklist.md | How to Use and General Engineering Review | define mandatory review inputs and evidence-based findings
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | Method 13 and recovery guidance | require new-diff re-review after quality failures
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-prove/SKILL.md` at `Process`, `Adversarial Review`, and `Code Review Report` using exact replacement rules: run independent diff-first review against File Structure, Prewalk evidence and comparable code before final proof; report Diff reviewed, Plan boundary, Prewalk evidence, Blockers, Warnings, Recommendations and Boundary verdict; unaddressed Blockers or Warnings yield FAIL facts for Core.
- [ ] Modify `skills/devflow-prove/references/code-review-checklist.md` using pseudocode: require approval-boundary, trace/handoff, actual-diff and comparable-code inputs; classify findings only from changed-code evidence and concrete risk; prohibit function size, class name, dependency count, cache absence or pattern preference as standalone blockers.
- [ ] Modify `skills/devflow-prove/references/proof-recovery-methods.md` using exact replacement rules: a quality finding requires Build correction, review of the new diff, and explicit closure or persistence of each prior finding; keep lifecycle selection owned by Core and keep normal review repair separate from PUA.
- [ ] Run `node scripts/validate-skill-triggers.js`; expect the existing trigger scenarios pass before adding the new trigger scenario in the later task.
Acceptance: Prove cannot use tests or an implementer claim to bypass independent actual-diff review, while recommendations and justified local deviations remain non-blocking.
Verify: Run `node scripts/validate-skill-triggers.js`; expect `Skill Trigger Verification Report` and `Judgment: PASS` after the trigger scenario update is applied. Manually inspect the report template to confirm all required diff-first fields are present.
Comments: explain only the non-obvious distinction between evidence-based Blocker, resolvable Warning and non-blocking Recommendation.
Not doing: adding a new review skill, automating architectural decisions, or routing repair directly without Core.

Prewalk:

Execution Trace:
- Read: `skills/devflow-prove/SKILL.md` → it already requires Code Quality Review and a Code Review Report, but uses blockers, approved-contract gaps and recommendations instead of the approved diff-first finding contract.
- Read: `skills/devflow-prove/references/code-review-checklist.md` → it already covers readability, responsibility, local convention, performance, cache safety, security and errors as contextual checks.
- Read: `skills/devflow-prove/references/proof-recovery-methods.md` → it already returns FAIL/BLOCKED facts to Core but does not require new-diff re-review after a quality finding.
- Traced: `skills/devflow-prove/SKILL.md` STOP gate → a blocker or contract gap already prevents PASS, so the smallest change extends the report inputs and finding terminology rather than adding another gate.
- Ran: no Prove implementation validation command → documentation behavior remains unchanged.
- Edited: none → review contract changes remain pending.
- Verified: `skills/devflow-prove/references/flow-self-test.md` has existing quality and adversarial scenarios that can receive narrow additions.

Current Handoff Facts:
- Target anchors: `skills/devflow-prove/SKILL.md` sections `Process`, `Adversarial Review`, `Code Review Report`; checklist `How to Use`; recovery methods `Method 13`.
- Nearby convention: current Prove separates general and language-specific review and records explicit completion evidence.
- Direct path: completed Build enters Prove; FAIL/BLOCKED returns facts to `devflow-core`; only PASS continues through Learn.
- Current constraints: ordinary recommendations must remain visible but cannot block an otherwise proven result; Core owns repair-owner selection.
- Planned touch set: the Prove Skill, checklist and proof-recovery reference files only.
- Risks / stop conditions: if changing report terminology would alter Core's required FAIL return format, stop and return the conflicting output-contract evidence to Core.

Remaining Structured Worklist:
- [ ] Define the diff-first review contract and report fields.
  Anchors: `skills/devflow-prove/SKILL.md` Process and Code Review Report.
  Verify: inspect that the required inputs and six report sections are explicit.
  Done when: unresolved Blockers or Warnings prevent PASS and return actionable facts through Core.
- [ ] Make review findings contextual and evidence-based.
  Anchors: `code-review-checklist.md` How to Use and General Engineering Review.
  Verify: inspect explicit prohibition of style-only blockers and requirement for changed-code evidence.
  Done when: justified local deviations can pass while concrete boundary, side-effect, convention and cache risks remain reviewable.
- [ ] Add quality-failure recovery evidence.
  Anchors: `proof-recovery-methods.md` Method 13 and recovery guidance.
  Verify: inspect new-diff and finding-closure requirements.
  Done when: a repaired implementation cannot regain PASS from stale tests or a stale review report.

Task: Add executable scenario coverage for handoff and diff review
Task type: Documentation-only
Files:
- Modify: skills/devflow-prove/references/flow-self-test.md | scenarios 5A, 5B, and 7A | add Plan handoff and Prove quality-gate scenarios
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-prove/references/flow-self-test.md` near `Scenario 5A: Plan Pack Check` using exact replacement rules: require File Structure, actual Execution Trace, Current Handoff Facts and Remaining Structured Worklist, and reject plans missing concrete handoff evidence without requiring architecture inference.
- [ ] Modify `skills/devflow-prove/references/flow-self-test.md` near `Scenario 5B: Contextual Engineering Quality` using pseudocode: add a coherent orchestration pass, a responsibility/sid-effect diff blocker, and a justified convention deviation pass based on actual evidence.
- [ ] Modify `skills/devflow-prove/references/flow-self-test.md` near `Scenario 7A` using exact replacement rules: add Build continuation from latest trace and a stop/replan outcome for a minimally reread anchor that contradicts recorded facts.
- [ ] Run `node scripts/validate-skill-triggers.js`; expect it continues to pass after scenario text gains the required discoverability terms.
Acceptance: the framework documents both the allowed continuation path and the required return path without treating tests as a substitute for diff review.
Verify: Run `node scripts/validate-skill-triggers.js`; expect `Judgment: PASS`. Inspect each added scenario for a concrete input, expected behavior and pass check.
Comments: scenario text explains observable behavior only; no implementation narration is added.
Not doing: creating a new executable scenario framework or defining a universal layering rule.

Prewalk:

Execution Trace:
- Read: `skills/devflow-prove/references/flow-self-test.md` scenarios 5A, 5B and 7A → they currently cover static Plan Pack checks, contextual quality and the rule that unit tests do not by themselves authorize completion.
- Traced: scenario 5A → it already establishes Plan-to-Build lifecycle edges and static checker limits, making it the nearest location for Plan handoff scenarios.
- Traced: scenario 5B → it already allows contextual design instead of mandatory Service/interface/cache patterns, making it the nearest location for evidence-backed deviations.
- Ran: no dedicated Prove self-test command exists → scenario documentation must be validated through the trigger checker and later manual contract review.
- Edited: none → no scenario behavior has been added.
- Verified: the approved spec explicitly names delegated execution, scope drift and diff-review cases → additions map directly to approved requirements.

Current Handoff Facts:
- Target anchors: scenario headings `5A`, `5B`, and `7A` in `skills/devflow-prove/references/flow-self-test.md`.
- Nearby convention: every current scenario uses Input, Expected behavior and Pass check sections.
- Direct path: Prove loads this reference before selecting framework proof scenarios.
- Current constraints: this is a scenario document, not an automated test runner; it must not assert fixed architecture patterns.
- Planned touch set: `flow-self-test.md` only.
- Risks / stop conditions: if scenario numbering or existing 7A semantics conflict with a new continuation case, preserve existing scenario behavior and return a placement fact instead of renumbering unrelated scenarios.

Remaining Structured Worklist:
- [ ] Extend Plan Pack scenario evidence.
  Anchors: `Scenario 5A`.
  Verify: each new handoff field appears in expected behavior and pass check.
  Done when: a missing map, trace or bounded worklist has a stated rejection outcome.
- [ ] Add quality-gate examples.
  Anchors: `Scenario 5B`.
  Verify: read the three outcomes for coherent orchestration, boundary violation and justified deviation.
  Done when: scenarios distinguish evidence-backed findings from style preferences.
- [ ] Add continuation mismatch scenario.
  Anchors: `Scenario 7A`.
  Verify: scenario records a narrow anchor reread, fact mismatch and Core return.
  Done when: it prohibits a fresh full-repository review and silent scope expansion.

Task: Expose responsibility handoff and diff review through trigger checks
Task type: Code change
Files:
- Modify: scripts/validate-skill-triggers.js | `scenarios` | assert static discoverability of Plan handoff and Prove diff-first review
Interfaces:
- Consumes: `scenarios`: records with `name`, `route`, `input`, and `evidence` pairs
- Produces: existing trigger verification report and process exit code
Current behavior: the trigger verifier checks creative work, planning after Cut, contextual engineering quality, completion and recovery but has no scenario asserting the new Plan handoff or diff-first Prove contract.
Target behavior: trigger verification fails if a future edit removes required File Structure/Prewalk continuation guidance or removes the Prove actual-diff quality gate from the discoverable path.
Change mechanics: pseudocode: append one Plan-owned responsibility/Prewalk scenario with evidence terms from the Plan Skill, new plan-methods reference and self-test; append one Prove diff-first scenario with evidence terms from the Prove Skill, review checklist, proof recovery method and self-test; preserve the existing `assertScenario` and output loop.
Call impact: `node scripts/validate-skill-triggers.js` and `npm run trigger:verify` retain their current command contract and gain two scenario cases.
Steps:
- [ ] Modify `scripts/validate-skill-triggers.js` constant `scenarios` using pseudocode: append a Plan handoff case that requires File Structure, Execution Trace, Remaining Structured Worklist and scope-drift return evidence across the three relevant artifacts.
- [ ] Modify `scripts/validate-skill-triggers.js` constant `scenarios` using pseudocode: append a Prove diff-first case that requires actual diff, Code Review Report, Blocker/Warning closure and re-review evidence across owner and reference files.
- [ ] Run `node scripts/validate-skill-triggers.js`; expect all scenario evidence resolves and the report ends with `Judgment: PASS`.
- [ ] Run `npm test`; expect the project regression suite exits with code 0.
Acceptance: static trigger checks prove that the new Plan and Prove contracts remain discoverable, without pretending to validate responsibility quality or actual diff review automatically.
Verify: Run `node scripts/validate-skill-triggers.js`; expect `Scenario cases` includes the two appended cases and `Judgment: PASS`. Run `npm test`; expect exit code 0.
Comments: `scenarios` entries remain self-describing; no helper abstraction is added for two static cases.
Not doing: parsing Plan files, reviewing implementation diffs, or changing command ownership.

Prewalk:

Execution Trace:
- Read: `scripts/validate-skill-triggers.js` → `assertScenario` validates static evidence term presence and a `scenarios` array drives the report.
- Read: `scripts/validate-skill-triggers.js` → current entries cover planning after Cut and contextual engineering quality, but no entry cites File Structure, Execution Trace, Remaining Structured Worklist or actual-diff review.
- Traced: `assertScenario` → it reads only repository-relative artifacts and throws a message naming the missing term, so new cases need no helper or command changes.
- Ran: no trigger verification command in this planning pass → the existing command is reserved for implementation proof.
- Edited: none → trigger cases remain pending.
- Verified: existing report prints scenario count, each scenario name/route and final `Judgment: PASS` → acceptance can remain observable without new output design.

Current Handoff Facts:
- Target anchors: `scripts/validate-skill-triggers.js` `scenarios`, `assertScenario`, and report output loop.
- Nearby convention: existing scenario records use a user-like input plus exact `[file, term]` evidence pairs.
- Direct path: package scripts expose this check as `npm run trigger:verify`; Prove requires activation chain checks after rule, command, prompt, entry or Skill changes.
- Current constraints: static discoverability does not validate Plan content or code-review quality; those responsibilities remain with the Plan validator and Prove.
- Planned touch set: `scripts/validate-skill-triggers.js` only.
- Risks / stop conditions: if a required evidence term is not stable owner-facing wording, select a stable documented term from the approved contract rather than asserting an incidental implementation phrase.

Remaining Structured Worklist:
- [ ] Modify `scripts/validate-skill-triggers.js` to add Plan handoff trigger evidence.
  Anchors: `scripts/validate-skill-triggers.js` `scenarios`.
  Verify: trigger checker finds each cited term in its owner files.
  Done when: removal of Plan responsibility or Prewalk continuation wording fails static verification.
- [ ] Modify `scripts/validate-skill-triggers.js` to add diff-first Prove trigger evidence.
  Anchors: `scripts/validate-skill-triggers.js` `scenarios`.
  Verify: trigger checker finds each cited Prove review and recovery term.
  Done when: removal of the independent actual-diff gate fails static verification.
- [ ] Run `node scripts/validate-skill-triggers.js` and `npm test` for targeted and project verification.
  Anchors: `scripts/validate-skill-triggers.js` CLI and package test script.
  Verify: execute the specified Node command and `npm test`.
  Done when: both commands exit successfully with their expected summary.

## Completion Evidence

- `node scripts/devflow-plan.js --self-test` passes after validator changes.
- `node scripts/devflow-plan.js docs/plans/2026-07-31-plan-owned-code-quality-gate.md` passes after this Plan Pack conforms to the new static contract.
- `node scripts/validate-skill-triggers.js` passes with Plan handoff and diff-first Prove cases.
- `npm test` passes.
- `git diff --check` reports no whitespace errors for every touched file.
- Prove reviews the actual implementation diff against this Plan's File Structure and task Prewalk records before any completion claim.

## Out Of Scope

- Model choice or switching, hidden prompts, fixed turn limits and first-edit gates.
- A full repository reread by delegated execution agents.
- A generic architecture linter, fixed class/layer/function-size rules or automatic file-split decisions.
- New packages, framework layers, external services or command-line interfaces.
