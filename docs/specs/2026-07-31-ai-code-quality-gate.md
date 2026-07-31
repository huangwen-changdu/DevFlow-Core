# DevFlow-Core AI 代码质量门禁 Spec

Status: draft
Date: 2026-07-31
Source: devflow-core -> Brainstorm Confirmed request (depth A)

## Goal

落地 `docs/2026-07-31-ai-code-quality-engineering.md` 中四个方案：编码规范资产化（A）、Standards Gate（B）、八大原则 slice 自检（C）、Plan 接力增强（D），解决 AI 产出代码质量差、原则守不住、Plan 交接不彻底三个缺口。所有改动保持"硬约束最小化、scan 只报候选、不变成限制 AI 的枷锁"。

## Context

现状事实（2026-07-31 检查确认）：

- `devflow-project-knowledge/SKILL.md` 定义知识包骨架：00-11 固定文件，deep-dive 从 12 开始编号；`AI-START-HERE.md` 是必读入口。
- `scripts/devflow-audit.js` 用 `patternChecks` 数组 + `reuse` 去重扫描输出候选报告，judgment 恒 PASS，`--json` 已支持。
- `skills/devflow-build/SKILL.md` 有 Build Contract（Goal/Will touch/Not doing/Skills loaded/Narrowest verification）与 Implementation Slices，无 `Standards:` 字段，无 slice 自检清单。
- `skills/devflow-plan/references/plan-methods.md` 已有 File Structure、Prewalk（Execution Trace / Current Handoff Facts / Remaining Structured Worklist）、Delegated Execution（只重读锚点、锚点矛盾返回 Core）。
- `scripts/devflow-plan.js` 静态校验 plan：requiredGlobalFields、Status、Prewalk 结构、worklist cap；无 read-basis/live-anchors 字段校验。
- `scripts/capability-eval-scenarios.json` 定义场景数组（id/scenario/layers/expectedRoute/command/evidence/negativeConstraints）。
- 已落地 `docs/plans/2026-07-31-plan-owned-code-quality-gate.md`：Plan Pack File Structure、Prewalk 强制、Delegated Execution、Prove diff-first、禁 style-only blocker。
- 硬约束：零依赖 Node 标准库；不新增目录；不改 AGENTS.md 8KiB 契约；向后兼容 target 运行时 checker；不重复已落地能力。

## Requirements

R1（方案 A）：`devflow-project-knowledge/SKILL.md` 知识包骨架新增固定文件 `12-code-standards.md`（编码规范：分层红线、缓存策略、可读性红线、项目约定）；deep-dive 起始编号从 12 改为 13（结构图 + 阶段二 Step 2 同步）；`AI-START-HERE.md` 生成要求中加入"必读 `12-code-standards.md`"。

R2（方案 B-1）：`skills/devflow-build/SKILL.md` Build Contract 增加可选 `Standards:` 字段，用于声明每个 slice 遵循的 code-standards 条目编号；不强制校验。

R3（方案 B-2）：`scripts/devflow-audit.js` 在 `patternChecks` 增加结构候选扫描，报告候选（judgment 恒 PASS，人工/子代理确认后才 FAIL）：
- `layering`：Controller 类内出现实体字段定义候选（分层倒置提示）
- `megaclass`：单文件超长候选（可读性提示）
- `no-cache`：读方法候选无缓存调用（启发式，仅提示）
每个新检查必须带 tag/message/replacement 且 `--self-test` 覆盖。

R4（方案 C）：`skills/devflow-build/SKILL.md` Implementation Slices 增加八大原则自检清单（最小切片/参考规范/复用/分层/缓存/可读性/副作用隔离/可证明），每 slice 输出后自检。

R5（方案 D-1）：`skills/devflow-plan/references/plan-methods.md` Prewalk 的 Current Handoff Facts 扩展两个字段：`Read-basis (trusted)` 记录已读文件清单（执行者无需重读）与 `Live anchors (verify)` 记录仅需现场确认的锚点；Delegated Execution 段同步说明执行者以此确定"只读锚点、不重读 trusted 清单"。

R6（方案 D-1 checker）：`scripts/devflow-plan.js` 增加字段校验：代码任务 Prewalk 的 Current Handoff Facts 必须含 `Read-basis` 与 `Live anchors`（文档型任务豁免）；`--self-test` 增补缺失这两字段的负例；向后兼容（旧 plan 若缺字段按 FAIL 报缺，由执行者补齐）。

R7（方案 D-2）：`scripts/capability-eval-scenarios.json` 新增场景 `subagent-plan-handoff`：子代理拿已批准 plan 独立执行，只重读 `Live anchors`、不重读 `Read-basis` 清单、锚点矛盾返回 Core。

## Non-goals

- 不自动修复/重构代码，scan 只报候选。
- 不做风格 lint 强制（缩进/命名品味属软约束）。
- 不改 AGENTS.md 8KiB 契约。
- 不新增依赖。
- 不新增目录。
- 不重做已落地的 plan-owned-code-quality-gate 契约（File Structure/Prewalk/委托执行/diff-first）。
- 不做"证据造假"式硬断言（缓存扫描只启发式提示，不宣称一定缺失）。
- 不改变 devflow-audit.js 的 judgment 语义（恒 PASS 保持）。

## Approach

**比较的真实选项**：
1. no-change/reuse：直接复用现有机制——方案 A 复用知识包骨架，方案 B 复用 audit patternChecks，方案 C 复用 slice 结构，方案 D-1 复用 plan-methods Prewalk，方案 D-2 复用 capability 场景格式。
2. direct implementation：在上述复用点上做最小扩展（SKILL 文档增字段 + audit.js 加检查项 + plan.js 加校验 + 场景追加）。
3. 被拒选项：
   - 新建独立 `code-standards` 技能：违反"不新增目录/技能"，且与现有 project-knowledge 维护者角色冲突。
   - Standards Gate 挂进 `devflow-prove` 做硬 FAIL：违反"scan 只报候选、不自动判死刑"，会成为枷锁。
   - 在 plan.js 强校验 `Standards:` 字段（R2 强制化）：已批准旧 plan 会批量 FAIL，破坏兼容。
   - 自动缓存分析（数据流分析）：需要依赖解析，违反零依赖约束，且易误报。

**选定设计**：
- A：知识包骨架加 `12-code-standards.md`（固定编号），deep-dive 从 13 开始；AI-START-HERE 必读。选此因：骨架机制已存在，最小扩展即立即可见。
- B：Build Contract 加可选 `Standards:` 字段（软声明）+ audit.js `patternChecks` 加 3 个结构候选（report-only）。选此因：保持"可见可校验但可申诉"的平衡，judgment 恒 PASS 不变。
- C：slice 自检清单并入 Build 现有 slice 流程。选此因：零新机制，纯文档强化。
- D-1：plan-methods Prewalk 加 `Read-basis`/`Live anchors` 字段 + plan.js 校验。选此因：复用已落地 Prewalk 契约，接力执行者可据此减少重读。
- D-2：capability 场景追加接力验证。选此因：复用现有场景格式，闭环验证跨模型执行。

**边界**：
- A 的编号变更会触发现有 deep-dive 文件名约定（12→13 起），需同步 SKILL.md 两处文本；不迁移已有 deep-dive 文件。
- B 的 3 个新检查仅启发式，`no-cache` 明确不宣称证据。
- D-1 校验对旧 plan 报缺字段为 FAIL（执行者补齐），不做静默跳过。

## Impact

- `skills/devflow-project-knowledge/SKILL.md`：结构图 + Step 2 编号 + AI-START-HERE 生成要求。
- `skills/devflow-build/SKILL.md`：Build Contract + Implementation Slices。
- `skills/devflow-plan/references/plan-methods.md`：Prewalk Current Handoff Facts + Delegated Execution。
- `scripts/devflow-audit.js`：patternChecks 加 3 项 + selfTest 断言。
- `scripts/devflow-plan.js`：Prewalk handoff facts 校验 + selfTest 负例。
- `scripts/capability-eval-scenarios.json`：追加 1 场景。
- 影响面：verify:all 中 `audit:verify`、`plan:verify`（self-test）、`capability:verify` 需重新通过；`route:verify` 若 README/AGENTS 提到 Prewalk 字段则需同步（本次不改路由面文本，预期无触发）。
- 兼容性：audit.js 与 plan.js 均向后兼容 CLI 契约；audit judgment 恒 PASS 不变。

## Acceptance

- A：`devflow-project-knowledge/SKILL.md` 含 `12-code-standards.md` 条目、deep-dive 从 13 编号、AI-START-HERE 必读含 code-standards。
- B-1：`devflow-build/SKILL.md` Build Contract 含 `Standards:` 字段说明。
- B-2：`devflow-audit.js` 含 `layering`/`megaclass`/`no-cache` 检查项，`--self-test` 通过，judgment 恒 PASS。
- C：`devflow-build/SKILL.md` Implementation Slices 含八大原则自检清单。
- D-1：`plan-methods.md` 含 `Read-basis`/`Live anchors`；`devflow-plan.js` 校验两字段且 `--self-test` 含缺失负例并通过。
- D-2：`capability-eval-scenarios.json` 含 `subagent-plan-handoff` 场景，`npm run capability:verify` 通过。
- 全量 `npm run verify:all` 全绿。

## Verification

- `node scripts/devflow-audit.js --self-test`：3 个新 tag 均被断言且通过。
- `node scripts/devflow-plan.js --self-test`：Read-basis/Live anchors 缺失负例 FAIL，完整正例 PASS。
- `node scripts/devflow-spec.js docs/specs/2026-07-31-ai-code-quality-gate.md`：本 spec 自校验 PASS。
- `npm run capability:verify`：场景覆盖含 subagent-plan-handoff 且无 gaps。
- `npm run verify:all`：16 项全绿。

## Code Documentation

- `scripts/devflow-audit.js`：3 个新 patternChecks 条目需注释说明启发式性质（尤其 `no-cache` 声明"仅提示，不构成缺失证据"）与 tag 语义。
- `scripts/devflow-plan.js`：新增的 Read-basis/Live anchors 校验函数需注释：校验契约（Code change 任务必含、文档型豁免）与向后兼容行为（旧 plan 报缺为 FAIL）。
- `skills/devflow-project-knowledge/SKILL.md`：`12-code-standards.md` 条目注释说明固定编号、deep-dive 从 13 起的迁移约定。
- `skills/devflow-build/SKILL.md` 与 `skills/devflow-plan/references/plan-methods.md`：字段说明本身即文档，无额外代码注释要求。
- 遵循现有注释规范：解释 WHY 不解释 WHAT，中文注释保持中文。

## Open Questions

- none（方案优先级、约束强度、字段命名已在 Brainstorm 与本文档确认）
