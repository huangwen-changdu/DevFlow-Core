# DevFlow-Core AI 代码质量门禁落地计划

Status: draft
Goal: 落地 docs/specs/2026-07-31-ai-code-quality-gate.md 的全部 7 条需求：编码规范资产化（A）、Standards Gate（B）、八大原则 slice 自检（C）、Plan 接力增强（D），保持硬约束最小化、scan 只报候选、不变成限制 AI 的枷锁
Architecture: 全部复用现有机制做条目级扩展——project-knowledge 骨架加 `12-code-standards.md`、build SKILL 加 `Standards:` 字段与 slice 自检清单、audit.js patternChecks 加 3 个结构候选（文件级启发式）、plan-methods Prewalk 加 `Read-basis`/`Live anchors` 字段、plan.js 校验两字段、capability 场景追加接力验证
Tech Stack: Node.js 标准库（node:fs、node:path）+ Markdown + JSON
Source: docs/specs/2026-07-31-ai-code-quality-gate.md（已批准）
Spec coverage: R1→Task 1；R2+R4→Task 2；R3→Task 3；R5→Task 4；R6→Task 5；R7→Task 6
Cut Decision: CUT_PASS——allowed scope：6 文件条目级扩展；reuse：骨架/patternChecks/Prewalk/场景格式；exclusions：自动修复、style lint、Standards 字段强制校验、deep-dive 文件迁移；verification：audit:verify、plan:verify、capability:verify、verify:all 全绿
External Skills: none

## Global Constraints

- 零依赖 Node 标准库；不新增目录、不新增技能、不改 AGENTS.md 8KiB 契约。
- audit.js 新增检查只报候选，judgment 恒 PASS，不自动判死刑；`no-cache` 仅启发式提示，不构成缺失证据。
- devflow-plan.js 对代码任务 Prewalk 新增必需字段校验；文档型任务豁免；旧 plan 报缺为 FAIL，由执行者补齐，不做静默跳过。
- 不迁移已有 deep-dive 文件（编号约定文本变更，不重命名现存文件）。
- 修改后的 plan.js 自身需通过其 selfTest 与现有 verify:all。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `skills/devflow-project-knowledge/SKILL.md` / 知识包结构图 | Modify | 骨架加 `12-code-standards.md` 条目、deep-dive 从 13 起、AI-START-HERE 必读 | 现有知识包骨架定义处 | 不迁移已有 deep-dive |
| `skills/devflow-build/SKILL.md` / Build Contract + Implementation Slices | Modify | 加 `Standards:` 字段说明与八大原则 slice 自检清单 | 现有 Build 契约与 slice 定义处 | 不引入新 slice 机制 |
| `scripts/devflow-audit.js` / scan + patternChecks | Modify | 加 layering/megaclass/no-cache 文件级候选 + selfTest 断言 | 现有零依赖扫描器 | 不改 judgment 恒 PASS |
| `skills/devflow-plan/references/plan-methods.md` / Prewalk Current Handoff Facts | Modify | 加 `Read-basis`/`Live anchors` 字段说明 | 现有 Prewalk 契约 | 不重写 Prewalk 机制 |
| `scripts/devflow-plan.js` / checkPrewalk + selfTest | Modify | 校验两字段必需 + 缺失负例 | 现有静态 checker | 不改变 CLI 契约 |
| `scripts/capability-eval-scenarios.json` / 场景数组 | Modify | 追加 subagent-plan-handoff 场景 | 现有场景数组 | 不改既有场景 |

Task: 方案 A——编码规范资产化骨架

Task type: Documentation-only
Files:
- Modify: skills/devflow-project-knowledge/SKILL.md | 知识包结构图 + 阶段一 Step 2/4 | 骨架加 `12-code-standards.md` 条目、deep-dive 从 13 起编号、AI-START-HERE 必读包含 code-standards
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-project-knowledge/SKILL.md` 知识包结构图：在 `11-change-log.md` 行后新增 `├── 12-code-standards.md ← 编码规范（分层红线 / 缓存策略 / 可读性红线 / 项目约定）`，并将末行 `└── {NN}-{domain}-deep-dive.md ← 业务域深挖（按需追加，从 12 开始编号）` 改为 `从 13 开始编号`
- [ ] Modify `skills/devflow-project-knowledge/SKILL.md` 阶段一 Step 2 生成顺序：在第 7 项 `08-reuse-extension-map.md` 后插入 `8. 12-code-standards.md — 编码规范（分层红线、缓存策略、可读性红线、项目约定）`，后续序号顺延
- [ ] Modify `skills/devflow-project-knowledge/SKILL.md` 阶段一 Step 4 AI-START-HERE 生成要求：在"第一次进入仓库的阅读顺序（必读 + 按任务类型追加）"后新增条目 `12-code-standards.md 为必读——进入任务前先确认项目编码规范（分层/缓存/可读性红线）`
- [ ] Run `node scripts/validate-devflow.js` and expect validation passed
Acceptance: SKILL.md 结构图含 `12-code-standards.md` 条目、deep-dive 从 13 编号、Step 2 与 Step 4 均有对应新增说明
Verify: Run `node scripts/validate-devflow.js`; expect validation passed
Comments: 编号变更只改文档文本，不迁移已有 deep-dive 文件；`12-code-standards.md` 为固定编号，深挖文件从 13 起
Not doing: 不迁移已有 deep-dive 文件、不创建真实 code-standards 内容（内容由 target 项目初始化时生成）

Task: 方案 B-1 + C——Build Contract Standards 字段与八大原则 slice 自检

Task type: Documentation-only
Files:
- Modify: skills/devflow-build/SKILL.md | Build Contract 字段说明 | 增加可选 `Standards:` 字段，声明每个 slice 遵循的 code-standards 条目编号
- Modify: skills/devflow-build/SKILL.md | Implementation Slices 规则 | 增加八大原则 slice 自检清单
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-build/SKILL.md` Build Contract 文本块，在 `Narrowest verification:` 行后增加 `Standards: 可选——引用 code-standards 条目编号`，并注明"用于声明本 slice 遵循的项目编码规范条目；不强制校验"
- [ ] Modify `skills/devflow-build/SKILL.md` Implementation Slices 规则段，在 Rules 后新增 Slice 自检清单：最小切片 / 参考项目规范 / 复用现有能力 / 分层清晰 / 缓存语义正确 / 可读性 / 副作用隔离 / 可证明，每 slice 输出后逐项自检
- [ ] Run `node scripts/validate-devflow.js` and expect validation passed
Acceptance: Build Contract 含 `Standards:` 字段说明；Implementation Slices 含八项自检清单
Verify: Run `node scripts/validate-devflow.js`; expect validation passed
Comments: `Standards:` 为可选软声明，不强制校验——避免旧任务批量 FAIL 成为枷锁；自检清单随 slice 输出，不新增校验器
Not doing: 不强制校验 Standards 字段、不引入新 slice 机制

Task: 方案 B-2——audit 结构候选扫描

Task type: Code change
Files:
- Modify: scripts/devflow-audit.js | function scan | 文件级结构候选：layering/megaclass/no-cache
- Modify: scripts/devflow-audit.js | function selfTest | 断言三个新 tag 均被检出
Interfaces:
- Consumes: scan(root: string) → 现有 walk/readFileSync 逐文件扫描；findings 数组项为 { rel, line, tag, message, replacement }
- Produces: findings 增加 tag 为 layering / megaclass / no-cache 的候选项；judgment 保持 "PASS"
Current behavior: scan 仅逐行测试 patternChecks 正则与跨文件重名声明检测；无文件级结构候选
Target behavior: scan 对每个文本文件追加文件级结构候选（layering 倒置、megaclass 超长、no-cache 无缓存读方法），judgment 恒 PASS
Change mechanics: exact replacement 规则——在 scan(root) 中 lines 读取后、逐行循环前新增文件级检查——layering：`new RegExp("\\bclass\\s+\\w*Controller\\b")` 与 `\\bclass\\s+\\w*(Entity|Model|Dto|DTO)\\b` 同时命中时 push { rel, line: 1, tag: "layering", message: "Controller 与实体同文件候选", replacement: "检查 Controller 是否直接持有实体/模型定义；建议分层。" }；megaclass：lines.length 大于 400 时 push { rel, line: 1, tag: "megaclass", message: "单文件超长候选", replacement: "检查是否需要拆分。" }；no-cache：`/\\b(?:get|fetch|find|list|query)\\w*\\s*\\(/` 命中且全文无 `/\\bcache\\b/` 时 push { rel, line: 1, tag: "no-cache", message: "读路径无缓存候选（启发式）", replacement: "检查高频读路径是否应查缓存；仅提示不构成缺失证据。" }；三处均在 push 前先收集文件全文行以支持正则
Call impact: node scripts/devflow-audit.js 保持同一 CLI 契约；--json 输出 findings 数量增加但字段结构不变；selfTest 新增断言不改变退出码约定
Steps:
- [ ] Modify `scripts/devflow-audit.js` function scan 在逐行循环前插入文件级检查块，使用 exact replacement 规则：在 `const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);` 之后、`lines.forEach` 之前插入上述 layering/megaclass/no-cache 三段 push 逻辑
- [ ] Modify `scripts/devflow-audit.js` function selfTest 的 sample.ts，exact replacement：追加 `class ReportController { entityId = 1; }` 与 `class OrderEntity {}` 两行以命中 layering，并将 tag 断言循环扩展为 `["reuse", "stdlib", "native", "yagni", "delete", "layering", "megaclass", "no-cache"]`
- [ ] Run `node scripts/devflow-audit.js --self-test` and expect DevFlow audit self-test passed
- [ ] Run `node scripts/devflow-audit.js . --json` and expect JSON 输出含 judgment PASS 与新增 tag
Acceptance: --self-test 通过并断言 8 个 tag；--json 报告 judgment 恒 PASS、含新 tag 候选
Verify: Run `node scripts/devflow-audit.js --self-test`; expect DevFlow audit self-test passed
Comments: 三处候选均在代码内注释"仅启发式候选，人工确认后编辑"；no-cache 注释声明不构成缺失证据；megaclass 阈值 400 行为硬编码并注明
Not doing: 不自动修复、不改 judgment 语义、不做数据流级缓存分析

Prewalk:

Execution Trace:
- Read: `scripts/devflow-audit.js` / patternChecks（L42-67）→ 现有 4 个行级正则候选；scan（L107-161）逐行测试 patternChecks 并做跨文件重名检测。
- Traced: `report`（L163-184）→ judgment 恒 "PASS"，--json 输出 { checker, findings, count, judgment }。
- Read: `scripts/devflow-audit.js` / selfTest（L186-215）→ 现断言 5 个 tag（reuse/stdlib/native/yagni/delete），sample.ts 无 Controller/Entity 行。
- Ran: `node scripts/devflow-audit.js --self-test` → 基线通过。
- Edited: none yet → 结构候选改动待执行。
- Verified: `verify:all` 全绿 → audit 基线可用。
Current Handoff Facts:
- Target anchors: `scripts/devflow-audit.js` / function scan 中 `const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);`。
- Nearby convention: `patternChecks` 项均为 { tag, pattern, message, replacement }；report 逐条打印 `${rel}:L${line}: ${tag}: ${message} ${replacement}`。
- Direct path: CLI `node scripts/devflow-audit.js [dir] [--self-test] [--json]` → report → scan。
- Current constraints: 文件级检查需在逐行循环外执行；line 字段可复用 1；不能破坏 ignoreDirs/textExtensions 过滤。
- Planned touch set: `scripts/devflow-audit.js` / scan 与 selfTest。
- Risks / stop conditions: 若结构检查误报过多导致自测不稳，返回 Core 调整阈值或降为 dry-report。
- Read-basis: `scripts/devflow-audit.js` 全文、`docs/specs/2026-07-31-ai-code-quality-gate.md` R3。
- Live anchors: `scripts/devflow-audit.js` L107-161 scan 函数体、L186-215 selfTest 函数体。
Remaining Structured Worklist:
- [ ] Modify `scripts/devflow-audit.js` scan 添加三文件级候选块。
  Anchors: `scripts/devflow-audit.js` scan 中 lines 读取行。
  Verify: Run `node scripts/devflow-audit.js --self-test`; expect DevFlow audit self-test passed。
  Done when: 8 个 tag 均在自测中检出。

Task: 方案 D-1——plan-methods Prewalk 交接字段

Task type: Documentation-only
Files:
- Modify: skills/devflow-plan/references/plan-methods.md | Prewalk Current Handoff Facts 模板 | 增加 `Read-basis`/`Live anchors` 字段说明
- Modify: skills/devflow-plan/references/plan-methods.md | Delegated Execution 段 | 说明执行者以两字段确定只读锚点
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-plan/references/plan-methods.md` Prewalk 的 Current Handoff Facts 模板，在 `Risks / stop conditions:` 行后新增 `- Read-basis: [已读文件清单——执行者无需重读]` 与 `- Live anchors: [仅需现场确认的锚点——执行者只读这些]`
- [ ] Modify `skills/devflow-plan/references/plan-methods.md` Delegated Execution 段，在"执行者读取最新 trace 后，最小重读当前工作项锚点"说明后追加"执行者据此确定只读集合：不重读 `Read-basis` 清单，仅现场确认 `Live anchors`；锚点矛盾仍返回 Core"
- [ ] Run `node scripts/validate-devflow.js` and expect validation passed
Acceptance: plan-methods.md 的 Prewalk 模板含两字段；Delegated Execution 段说明只读集合规则
Verify: Run `node scripts/validate-devflow.js`; expect validation passed
Comments: 字段说明本身即契约文档，无额外代码注释；两字段为可选模板注释，实际校验由 Task 5 的 checker 实施
Not doing: 不重写 Prewalk 机制、不改变 Delegated Execution 的返回 Core 语义

Task: 方案 D-1 checker——plan.js 校验 Read-basis/Live anchors

Task type: Code change
Files:
- Modify: scripts/devflow-plan.js | function checkPrewalk | 代码任务 Prewalk 必含两字段，文档型豁免
- Modify: scripts/devflow-plan.js | function selfTest | validPlan 正例加两字段；新增缺失两字段负例
Interfaces:
- Consumes: checkPrewalk(task: { body: string }) → 现有 handoffFactNames 检查逻辑
- Produces: checkPrewalk 返回 missingFacts 扩展两字段；selfTest 断言新增负例 FAIL
Current behavior: checkPrewalk 仅检查 6 个标准 handoff fact（Target anchors/Nearby convention/Direct path/Current constraints/Planned touch set/Risks / stop conditions）
Target behavior: checkPrewalk 对 Code change 任务额外要求 `Read-basis` 与 `Live anchors` 两字段非空；Documentation-only 任务豁免
Change mechanics: exact replacement 规则——在 checkPrewalk 中新增 `const handoffExtraFactNames = ["Read-basis", "Live anchors"];`，missingFacts 计算改为 `handoffFactNames.concat(handoffExtraFactNames).filter((name) => !new RegExp(`^\\s*-\\s*${name}:\\s+\\S`, "im").test(facts))`；selfTest 的 validPlan Current Handoff Facts 追加 `- Read-basis: scripts/devflow-plan.js.` 与 `- Live anchors: scripts/devflow-plan.js / checkPrewalk.`；新增 missingReadBasisPlan = validPlan.replace("- Read-basis: scripts/devflow-plan.js.\n", "") 与 missingLiveAnchorsPlan 类似，并断言 `checkPlan(missingReadBasisPlan).ok` 为 false、`checkPlan(missingLiveAnchorsPlan).ok` 为 false
Call impact: CLI 契约不变；对现存 plan 文档重新校验时因缺新字段报 FAIL（执行者补齐），不破坏 verify:all 的 plan:verify（仅跑 selfTest）
Steps:
- [ ] Modify `scripts/devflow-plan.js` checkPrewalk 增加 handoffExtraFactNames 常量与 missingFacts 扩展，使用 exact replacement：将 `const missingFacts = handoffFactNames.filter(` 替换为基于 concat 的两字段版本
- [ ] Modify `scripts/devflow-plan.js` function selfTest 的 validPlan，exact replacement：增补 `- Read-basis: scripts/devflow-plan.js.` 与 `- Live anchors: scripts/devflow-plan.js / checkPrewalk.` 两行，并新增 missingReadBasisPlan 与 missingLiveAnchorsPlan 两个负例断言
- [ ] Run `node scripts/devflow-plan.js --self-test` and expect DevFlow plan self-test passed
- [ ] Run `node scripts/devflow-plan.js docs/plans/2026-07-31-ai-code-quality-gate.md` and expect Judgment PASS（本计划已含两字段）
Acceptance: --self-test 通过；缺失任一新字段的计划判 FAIL；含两字段计划判 PASS
Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed
Comments: 新增校验在代码注释说明"Read-basis/Live anchors 为接力执行减少重读的必需交接字段，文档型任务豁免"；对旧 plan 报缺为 FAIL 而非静默跳过
Not doing: 不改变 CLI 契约、不校验 Read-basis 内容真实性（只校验非空）

Prewalk:

Execution Trace:
- Read: `scripts/devflow-plan.js` / handoffFactNames（L32）→ 6 个标准 fact 名；checkPrewalk（L132-180）→ missingFacts 基于 handoffFactNames 检查 `^\s*-\s*${name}:\s+\S`。
- Traced: `checkTask`（L236-310）→ isCodeChange 时调用 checkPrewalk 且 prewalk.ok 并入 task.ok；Documentation-only 走 checkPrewalk 之外的分支。
- Ran: `node scripts/devflow-plan.js --self-test` → 基线通过（含 missingFieldPlan 等 25 个断言）。
- Edited: none yet → 字段校验改动待执行。
- Verified: `verify:all` 全绿 → plan 校验基线可用。
Current Handoff Facts:
- Target anchors: `scripts/devflow-plan.js` / checkPrewalk 中 `const missingFacts = handoffFactNames.filter(`（L147）。
- Nearby convention: missingFacts 用正则 `^\\s*-\\s*${name}:\\s+\\S` 校验非空；report 将 missingFacts 输出为 `Prewalk missing handoff fact`。
- Direct path: CLI → report → checkPlan → checkTask → checkPrewalk。
- Current constraints: handoffExtraFactNames 仅对 Code change 生效；selfTest 的 validPlan 与负例需同步更新，避免回归。
- Planned touch set: `scripts/devflow-plan.js` / checkPrewalk 与 selfTest。
- Risks / stop conditions: 若现有 17 个 plan 文档批量重校验会 FAIL，需确认 verify:all 不扫描 docs/plans 全量（plan:verify 仅 selfTest）。
- Read-basis: `scripts/devflow-plan.js` 全文、`docs/specs/2026-07-31-ai-code-quality-gate.md` R6、本 Plan Pack Task 5 上下文。
- Live anchors: `scripts/devflow-plan.js` L147 missingFacts 行、L444-617 selfTest。
Remaining Structured Worklist:
- [ ] Modify `scripts/devflow-plan.js` checkPrewalk 增加两字段必查。
  Anchors: `scripts/devflow-plan.js` L147 missingFacts 计算行。
  Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed。
  Done when: 缺失任一新字段的计划判 FAIL。

Task: 方案 D-2——capability 接力场景

Task type: Code change
Files:
- Modify: scripts/capability-eval-scenarios.json | `场景数组末尾元素` | 追加 subagent-plan-handoff 场景
Interfaces:
- Consumes: 场景对象结构 { id, scenario, layers, expectedRoute, command, scenarioEvidence, commandEvidence, negativeConstraints }
- Produces: 追加 1 场景，数组长度 10 → 11；capability:verify 场景覆盖含新场景
Current behavior: 场景数组含 10 个场景（vague-design-route / first-principles-cut / host-adapter-drift / independent-manual-adversarial-review / independent-manual-find-fault-review / learning-closure / pressure-recovery / completion-proof / adversarial-proof-rejection / target-install-check），无接力场景
Target behavior: 追加 subagent-plan-handoff 场景，验证子代理拿已批准 plan 独立执行、只重读 Live anchors、锚点矛盾返回 Core
Change mechanics: exact replacement 规则——将数组末尾 `  }\n]` 替换为 `  },\n  { "id": "subagent-plan-handoff", "scenario": "Scenario 10: Subagent Plan Handoff", "layers": ["Harness/Validation", "Context", "Orchestration/Slices", "Eval/Verifier"], "expectedRoute": "Build", "command": "plan:verify", "scenarioEvidence": ["`devflow-build` reads the approved plan Pack and its Prewalk", "executor re-reads only `Live anchors`, never re-reads `Read-basis` list", "anchor contradiction returns facts to `devflow-core`"], "commandEvidence": ["Plan verification passed", "handoff facts honor Read-basis / Live anchors"], "negativeConstraints": ["Must not broadly reread the repository by default", "anchor mismatch returns to `devflow-core` instead of guessing"] }\n]`
Call impact: capability-eval 读取数组长度变化，覆盖层增加；不改变既有 10 场景字段与顺序
Steps:
- [ ] Modify `scripts/capability-eval-scenarios.json` 按 exact replacement 在数组末尾追加 subagent-plan-handoff 场景对象
- [ ] Run `node -e "JSON.parse(require('node:fs').readFileSync('scripts/capability-eval-scenarios.json','utf8')); console.log('json ok')"` and expect json ok
- [ ] Run `npm run capability:verify` and expect 场景覆盖报告含 subagent-plan-handoff 且无 gaps
Acceptance: 场景数组含 11 项、JSON 合法、capability:verify 通过
Verify: Run `npm run capability:verify`; expect 场景覆盖含 subagent-plan-handoff 且无 gaps
Comments: 场景证据引用 plan-methods 的 Read-basis/Live anchors 约定；negativeConstraints 固化"禁止默认全仓重读"与"锚点矛盾返回 Core"
Not doing: 不改既有 10 场景、不做真实换模型执行（场景仅验证本地契约与覆盖）

Prewalk:

Execution Trace:
- Read: `scripts/capability-eval-scenarios.json`（全文）→ 10 个场景对象，字段为 id/scenario/layers/expectedRoute/command/scenarioEvidence/commandEvidence/negativeConstraints。
- Traced: `validate-skill-triggers.js` 或 capability 场景消费方 → 场景数组以 JSON.parse 读取并遍历，无 id 唯一性以外的约束。
- Ran: `npm run capability:verify` → 基线通过，6 层全覆盖无 gaps。
- Edited: none yet → 场景追加待执行。
- Verified: `verify:all` 全绿 → capability 基线可用。
Current Handoff Facts:
- Target anchors: `scripts/capability-eval-scenarios.json` 数组末尾 `  }\n]`。
- Nearby convention: 每个场景含 layers 数组与 2-3 条 negativeConstraints；scenarioEvidence 引用既有契约文本。
- Direct path: `npm run capability:verify` → JSON.parse 场景数组 → 覆盖报告。
- Current constraints: 新场景字段须与既有结构完全一致；JSON 必须合法；id 不得与现有重复。
- Planned touch set: `scripts/capability-eval-scenarios.json`。
- Risks / stop conditions: 若 capability:verify 对新增场景有额外结构断言失败，返回 Core 对齐字段约定。
- Read-basis: `scripts/capability-eval-scenarios.json` 全文、`docs/specs/2026-07-31-ai-code-quality-gate.md` R7。
- Live anchors: `scripts/capability-eval-scenarios.json` 数组末尾行。
Remaining Structured Worklist:
- [ ] Modify `scripts/capability-eval-scenarios.json` 添加 subagent-plan-handoff 场景。
  Anchors: `scripts/capability-eval-scenarios.json` 数组末尾。
  Verify: Run `npm run capability:verify`; expect 场景覆盖含 subagent-plan-handoff 且无 gaps。
  Done when: 场景数组 11 项且 capability:verify 通过。

## 批次与验证

| 批次 | 任务 | 批后验证 |
|---|---|---|
| 文档契约 | Task 1、Task 2、Task 4（SKILL 与 plan-methods 文本） | node scripts/validate-devflow.js 全绿 |
| 校验器与扫描 | Task 3（audit.js）、Task 5（plan.js）、Task 6（capability 场景） | audit:verify / plan:verify / capability:verify 单项通过 |
| 收尾 | 全部 6 任务 | npm run verify:all 16 项全绿 |
