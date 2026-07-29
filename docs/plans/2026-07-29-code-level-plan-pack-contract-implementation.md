# Code-Level Plan Pack Contract Implementation

Goal: 让 `devflow-plan` 生成并静态校验可直接施工的代码级 Plan Pack，避免计划退化为重复 Spec 的任务摘要。
Architecture: 在现有 Markdown Plan Pack 合同上增加任务类型、精确位置、行为差异、变更机制和调用影响；复用零依赖 Node 校验器的字段分块、自测与报告结构，只为代码变更任务启用严格规则。
Tech Stack: Markdown、TOML、Node.js 标准库（`fs`、`path`、正则）和现有 npm 验证脚本。
Source: docs/specs/2026-07-29-code-level-plan-pack-contract.md
Spec coverage: R1-6 由 Task 1、Task 2 覆盖；R7 由 Task 2 覆盖；R8 由 Task 1、Task 3 覆盖；R9 由 Task 2、Task 3 覆盖。
Cut Decision: CUT_PASS；复用现有 Plan 字段解析与零依赖 Node 校验器；不新增依赖、目录、路由或历史计划迁移；验证约束为 plan/main/trigger/host 校验及 `git diff --check`。

## Global Constraints
- `devflow-core` 仍是唯一后续生命周期选择者；Plan 只返回 confirmed Plan 和 scope-drift facts。
- `Task type: Documentation-only` 仅适用于无运行时代码变更的文档/规则任务；不得用它规避代码变更任务的严格合同。
- 检查器只验证可机械识别的结构和最低具体性，不评分架构、不执行计划中的代码，也不修改历史 `docs/plans/`。
- 对已有文件，位置必须是符号、Markdown 标题、配置键或稳定文本锚点；对新文件明确写 `new file`。

Task: 定义并同步代码级 Plan Pack 运行时合同
Task type: Documentation-only
Files:
- Modify: skills/devflow-plan/SKILL.md | anchors: `## Required Task Contract`, `## Boundaries`, `## Verification` | 将 Plan 写作合同升级为代码级施工说明
- Modify: commands/devflow-plan.toml | anchor: `Each independently understandable task must contain:` | 将同一任务字段暴露给 `/devflow-plan`
- Modify: skills/devflow-core/references/core-methods.md | anchor: `## Method 10: Spec Document and Plan Pack` | 将代码级任务字段纳入权威方法来源
- Modify: skills/devflow-build/SKILL.md | anchor: `## Plan Pack` | 要求 Build 消费已定义的位置、机制和调用影响而非重新设计
- Modify: README.md | anchors: `node scripts/devflow-plan.js `docs/plans/2026-07-29-code-level-plan-pack-contract-implementation.md``, `devflow-plan`, `npm run plan:verify` | 说明目标运行时的施工边界与校验范围
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Current behavior: 现有任务只要求路径加职责、宽泛接口与具体步骤；Build 只要求任务可验证，仍可能自行推断改动位置和实现机制。
Target behavior: 所有运行时表面将代码变更任务定义为可直接施工的合同：精确位置、Current behavior、Target behavior、Change mechanics、Call impact、精确接口、代码级步骤和带预期的验证；文档任务明确使用轻量例外。
Change mechanics: 将模板替换为以下字段顺序，并在规则段说明 `Task type: Code change | Documentation-only` 的分支约束：
```text
Files:
- Modify: scripts/example.js | function checkTask | validate task fields
Task type: Code change | Documentation-only
Current behavior: existing observable state
Target behavior: required observable outcome
Change mechanics: pseudocode: parse fields, validate task, report failures
Call impact: known callers use the same CLI contract
```
Call impact: `devflow-plan`、`/devflow-plan`、Method 10、Build 和 README 使用相同术语；不改变 Core → Cut → Plan → Core 的控制权边界。
Steps:
- [ ] In `skills/devflow-plan/SKILL.md` at `## Required Task Contract`, replace the generic file/step template with `Task type`, exact `path | symbol or stable anchor | responsibility`, the four behavior/mechanism/impact fields, interface signature requirement, and per-step snippet/pseudocode/exact-replacement rule; state the Documentation-only exception and prohibit using it for code work.
- [ ] In `commands/devflow-plan.toml` at `Each independently understandable task must contain:`, mirror the exact template and require a test or static scenario to state trigger, expected result, and command before the command tells the agent to run `scripts/devflow-plan.js`.
- [ ] In `skills/devflow-core/references/core-methods.md` Method 10, `skills/devflow-build/SKILL.md` Plan Pack section, and the three README anchors, replace generic “concrete steps” wording with the same code-level fields; state that Build follows the recorded mechanism and call impact rather than re-deciding them.
Acceptance: 每个运行时说明面都使用相同字段名和 `Code change` / `Documentation-only` 边界；没有表面仍声称泛化步骤足以作为施工计划。
Verify: Run `node scripts/validate-skill-triggers.js` after Task 3 and search the five files for `Task type: Code change`, `Current behavior:`, `Change mechanics:`, and `Call impact:`; expect every required runtime surface to contain its assigned contract terms.
Comments: none — Markdown/TOML contracts use headings, field definitions, and examples; no runtime code logic changes.
Not doing: 不修改 Core 路由、添加 TDD/worktree/Git 提交步骤，或要求计划粘贴完整生产代码。

Task: 扩展 Plan Pack 静态校验与自测
Task type: Code change
Files:
- Modify: scripts/devflow-plan.js | symbols: `requiredTaskFields`, `fieldBlock`, `checkTask`, `report`, `selfTest` | 解析任务类型和新增字段，并拒绝代码计划的规格式描述
Interfaces:
- Consumes: Plan Markdown task blocks with `Task type`, file operation entries, behavior/mechanism/impact fields, interfaces, steps, and verification text
- Produces: `{ ok, missing, invalidFiles, ... }` task diagnostics plus `Judgment: PASS / FAIL`; `--self-test` covers accepted and rejected code-level contracts
Current behavior: `checkTask` 仅要求旧字段、分类文件行、Consumes/Produces、至少两条含宽泛关键词的步骤；只要步骤提到文件或函数，缺少精确位置、行为/机制/影响和预期仍会通过。
Target behavior: `checkTask` 区分 `Code change` 与 `Documentation-only`；代码任务必须具备全部新增字段、可辨别的稳定文件位置、包含实际操作的最小改法、逐代码步骤的改法和可验证预期，文档任务只允许显式无运行时接口和非代码说明。
Change mechanics: 保持 `fieldBlock` 和 `checkPlan` 的分块模型，增加字段列表及小型谓词函数，而不是引入 Markdown 解析依赖。核心判定遵循：
```js
const isCodeChange = taskType === "Code change";
if (isCodeChange) requireFields(["Current behavior", "Target behavior", "Change mechanics", "Call impact"]);
if (isCodeChange) requireLocatedFileEntries(files); // `new file` 或可辨别 symbol/anchor
if (isCodeChange) requireImplementationMechanics(changeMechanics); // marker + executable operation
if (isCodeChange) requireMechanicsForEachCodeStep(steps); // 每个代码编辑步骤含 snippet、pseudocode 或 exact replacement
requireVerificationExpectation(verify, steps); // trigger + expected result + runnable command/scenario
```
并将失败收集到 `report`，输出具体缺失字段、无效位置、空泛机制、缺少改法的代码步骤或不完整验证，不只给出通用失败。
Call impact: `node scripts/devflow-plan.js `docs/plans/2026-07-29-code-level-plan-pack-contract-implementation.md`` 和 `npm run plan:verify` 的 CLI 入口保持不变；新的结构要求会拒绝未来不完整的代码计划，历史计划不迁移也不作为批量输入。
Steps:
- [ ] In `scripts/devflow-plan.js` around `requiredTaskFields` and `fieldBlock`, pseudocode: add parseable `Task type`, `Current behavior`, `Target behavior`, `Change mechanics`, and `Call impact` fields; validate task type and document helper failure semantics.
- [ ] In `scripts/devflow-plan.js` `checkTask`, pseudocode: replace the broad `concreteStepPattern`-only condition with predicates for `new file`/recognizable symbol-or-anchor locations, mechanics markers with executable operations, and a per-code-step snippet/pseudocode/exact-replacement rule; apply them only to `Task type: Code change`.
- [ ] In `scripts/devflow-plan.js` `report` and `selfTest`, pseudocode: append diagnostics for invalid locations, generic mechanics, and code steps without mechanics; add isolated negative samples for each plus the existing field, verification, and Documentation-only failures.
Acceptance: `node scripts/devflow-plan.js --self-test` passes only when the complete code-level sample passes and every specified malformed variant fails; diagnostics identify the violated contract class.
Verify: Run `node scripts/devflow-plan.js --self-test`; expect `DevFlow plan self-test passed` and output naming code-level fields, precise file locations, mechanics evidence, verification expectations, documentation-only exception, and legacy plan landing guidance.
Comments: Add function-level comments for new parsing/validation helpers; add inline WHY comments only at the Documentation-only exception and code-mechanics recognition branches.
Not doing: 不引入第三方 Markdown 解析器，不检查真实源文件是否存在，不执行计划命令，也不将检查器变为架构评分器。

Task: 锁定跨运行时合同与回归验证
Task type: Code change
Files:
- Modify: scripts/validate-devflow.js | anchors: `planScriptBody`, `assertResponsibilitySplitContract` | 断言核心运行时和计划校验器不会退回旧合同
- Modify: scripts/validate-skill-triggers.js | anchors: `plan command`, `files.plan`, `files.build` | 断言 `/devflow-plan` 和 Build 的可发现字段
- Modify: scripts/validate-host-adapters.js | anchors: `adapters`, `assertTerms` | 仅在需要时断言宿主入口保留 Plan → Core 返回边界，不复制任务模板
Interfaces:
- Consumes: 修改后的 Plan Skill、命令、Build、Method 10、README 和 `scripts/devflow-plan.js` 自测输出/静态文本
- Produces: maintainer validation failures that name遗漏的代码级合同词或回归的 Core 返回边界
Current behavior: 验证器只检查“concrete checkbox steps”“Interfaces”等旧合同词；命令触发自测不会阻止 `/devflow-plan` 被降级为泛化任务说明。
Target behavior: 主验证与触发验证能检测新增的代码级字段、严格校验器特征和 Build 消费语义，同时宿主适配验证继续只验证路由边界，避免将详细模板扩散到每个宿主提示文件。
Change mechanics: 在现有 `assert(body.includes(term))` 模式中添加最小、稳定的合同词检查，而不增加新的扫描框架：
```js
assert(plan.includes("Current behavior:"), "...");
assert(planCommand.includes("Change mechanics:"), "...");
assert(planScriptBody.includes("Documentation-only"), "...");
assert(build.includes("Call impact:"), "...");
```
为 `--self-test` 的新摘要词添加同类断言；若适配器不需要模板变更，则只保持已有“confirmed Plan ... to Core”检查。
Call impact: `npm test`、`npm run trigger:verify`、`npm run host:verify` 的命令及输出协议保持不变；它们将更早发现 Plan 合同文本或检查器自测回退。
Steps:
- [ ] In `scripts/validate-devflow.js` at `planScriptBody` and the Plan responsibility checks, pseudocode: append assertions for code-level fields, `Documentation-only`, precise-location/mechanics/verification self-test terms, and Build’s `Current behavior`, `Change mechanics`, `Call impact` consumption.
- [ ] In `scripts/validate-skill-triggers.js` in the `plan command` case, pseudocode: append assertions that `commands/devflow-plan.toml` and `skills/devflow-plan/SKILL.md` expose task type, current/target behavior, mechanics, call impact, and verification expectations; keep Core-return assertions.
- [ ] In `scripts/validate-host-adapters.js`, pseudocode: retain existing `confirmed Plan ... to Core` assertions without adding detailed Plan-template assertions, then run the command matrix and fix only contract-drift failures.
Acceptance: 删除任何一个新增的关键字段、静态校验规则或触发面术语都会使相应 maintainer validator 失败；宿主验证不获得重复的任务模板负担。
Verify: Run `npm run plan:verify && npm test && npm run trigger:verify && npm run host:verify && git diff --check`; expect all validators to pass and `git diff --check` to print no whitespace errors.
Comments: Keep existing validator comments; only add a brief comment when a new assertion protects the Documentation-only exception or prevents host-template duplication.
Not doing: 不更改 `package.json` 脚本、插件清单、安装器文件、历史计划文件或任何宿主入口的完整 Plan 模板。
