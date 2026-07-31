# DevFlow-Core AI 代码质量工程：问题诊断与解决方案

Status: draft
Date: 2026-07-31
Owner: DevFlow-Core maintainers

本文档针对三个实际痛点做根因分析与方案设计。它是**问题-方案文档**，不是实施计划（实施计划见 `docs/plans/`）；落地任务应作为迭代候选进入 `docs/iteration-plan.md`。

## 0. 现状：与已有计划的关系

三个问题中，**问题 3（Plan 交接）已被 `docs/plans/2026-07-31-plan-owned-code-quality-gate.md` 实施落地**：

| 已落地能力 | 位置 | 状态 |
|---|---|---|
| Plan Pack 强制 `## File Structure`（职责图） | `skills/devflow-plan/SKILL.md` + `plan-methods.md` | done |
| Prewalk：Execution Trace / Handoff Facts / Worklist | `skills/devflow-plan/references/plan-methods.md` | done |
| `devflow-plan.js` 静态校验 Prewalk 结构（42 处匹配） | `scripts/devflow-plan.js` | done |
| 委托执行：只重读锚点 + 直接变更邻域，不重扫全仓 | `plan-methods.md` §Delegated Execution | done |
| 锚点矛盾 → 返回 Core，不硬猜 | `plan-methods.md` §Delegated Execution | done |
| Prove diff-first 质量审查（Blockers/Warnings 不 PASS） | `skills/devflow-prove/` 系列 | done |
| 禁止 style-only blocker、不做自动架构裁决 | prove 契约 Global Constraints | done |

**因此本文档聚焦真实缺口**：问题 1（代码质量基线）、问题 2（原则固化与枷锁平衡）、以及问题 3 的剩余增强（已读面显式清单、跨模型验证）。

## 1. 问题背景（三个痛点）

| # | 痛点 | 表现 |
|---|---|---|
| 1 | AI 产出代码质量差 | 代码写成一坨、实体不区分全堆一个类、不用缓存、不参考项目规范、可读性差 |
| 2 | 原则守不住 | 八大原则 + 最佳实践想坚守但实际不执行；又不想变成限制 AI 的枷锁 |
| 3 | Plan 交接效率低 | 希望 Plan 文档能被其他模型/子代理直接消费，不重新 view 全量代码 |

## 2. 根因分析

### 2.1 根因一：质量基线不在任何门禁判定范围

现有门禁围绕**流程正确性**，不防**代码结构质量**：

| 层 | 现在防什么 | 不防什么 |
|---|---|---|
| `devflow-cut` | 过度工程 | 已有代码的分层、缓存 |
| `devflow-build` | 偏离计划、无效 Diff | "match existing style"是软话术 |
| `devflow-prove` | 未证明就完成 | 结构扫描（分层/缓存）靠人工 diff 审查，无机械检查 |
| `devflow-audit` | reuse/stdlib/yagni 标记 | 结构分析（Controller 直操作实体表等） |

**"实体全塞一个类、不用缓存、不守规范、可读性差"无机械门禁捕获**。Prove 的 diff-first 审查依赖审查者自觉，不保证结构性红线被检查。

### 2.2 根因二：规范没有"可见 + 可校验"形态

- **不可见**：AGENTS.md 限 8KiB，装不下编码规范；`docs/project-knowledge/` 是业务语义，不是编码规范。八大原则无文件固化。
- **不可校验**：规范是自然语言，无机械检查。
- **软约束过多**：Build Contract 无 `Standards:` 字段，靠模型泛化猜项目风格。

### 2.3 根因三：Plan 交接已落地，剩两点增强

`plan-methods.md` 已解决"不重扫全仓"（只重读锚点）。剩余：
1. **无显式"已读面（trusted）/ 未读面（live anchors）"清单**——plan 头部不声明哪些文件执行者完全无需重读。
2. **无跨模型接力验证**——未验证换模型/子代理拿 plan 能独立执行。

## 3. 解决方案总览

| 方案 | 针对痛点 | 约束强度 | 形态 |
|---|---|---|---|
| A. 编码规范资产化 | 1、2 | 硬门禁 | `devflow-project-knowledge` 骨架新增 `NN-code-standards.md` |
| B. Standards Gate（结构扫描候选报告） | 1、2 | 硬门禁（report-only，人工/子代理确认） | Build Contract 增加 `Standards:` 字段 + 结构扫描 |
| C. 八大原则固化 | 2 | 硬（清单）+软（风格） | Build 每 slice 自检清单 |
| D. Plan 接力增强 | 3 | 契约 + 验证 | plan 头部 read-basis + capability:eval 接力场景 |

### 3.1 方案 A：编码规范资产化

- **位置**：`devflow-project-knowledge` 骨架新增 `NN-code-standards.md`（实体分层、缓存策略、可读性红线、项目约定）。
- **可见性**：写入 `AI-START-HERE.md` 必读清单，每个会话 Sense 阶段强制可见。
- **内容模板**：
  - 分层红线：实体/仓储/服务/控制器各自职责，禁止实体字段直通 Controller；
  - 缓存策略：读频繁路径必须查缓存（缓存-旁路模式），写路径失效缓存；
  - 可读性红线：方法 < 50 行、类职责单一、命名表意；
  - 项目约定：本仓库目录结构、命名、已用技术栈。

### 3.2 方案 B：Standards Gate

- Build Contract 增加 `Standards: <引用规范清单>` 字段，每个 slice 声明遵循哪些规范条目。
- `devflow-prove` 前加 standards gate：复用 `devflow-audit` 模式做结构扫描——Controller 直操作实体表、高频读路径无缓存、新文件未引用规范 = **FAIL 候选**。
- **平衡点（不成为枷锁）**：扫描只 report 候选，不自动判死刑；人工/子代理确认后才 FAIL。硬约束只留"会造成技术债"的 5 类（分层、缓存语义、规范引用、可读性红线、锚点契约）；风格偏好一律软引导。

### 3.3 方案 C：八大原则固化

八大原则作为固定 preamble 进 Build 的每 slice 输出，做成 slice 自检清单项：

```
Slice 自检：
1. 最小切片（一次只改一件事）
2. 参考项目规范（引用方案 A 条目）
3. 复用现有能力（不重复造轮子）
4. 分层清晰（实体/服务/控制分离）
5. 缓存语义正确（读缓存、写失效）
6. 可读性（短方法、表意命名）
7. 副作用隔离
8. 可证明（本 slice 可验证）
```

### 3.4 方案 D：Plan 接力增强（基于已落地能力）

1. **plan 头部声明已读面/未读面**（扩展 Prewalk，新增两字段）：
   ```
   Read-basis (trusted): <已读文件清单——执行者无需重读>
   Live anchors (verify): <仅需现场确认的锚点——执行者只读这些>
   ```
2. **capability:eval 增加接力场景**：验证"另一模型/子代理拿 plan 能独立执行且只重读锚点"。

## 4. 为什么这样做"不是枷锁"

- **硬约束最小化**：只有 5 类进门禁；其余全部软引导。
- **门禁可申诉**：standards gate 只报候选，FAIL 需人工/子代理确认，AI 可自辩。
- **规范是项目资产不是 prompt 教条**：`code-standards.md` 由项目方维护。
- **流程纪律与编码规范分离**：流程（现有）管"别乱写"，规范（新增）管"按项目写好"。

## 5. 落地路径（进入迭代候选，不在本文档实施）

| 优先级 | 候选 | 依赖 | 说明 |
|---|---|---|---|
| P1 | 方案 A：`code-standards.md` 骨架 + AI-START-HERE 必读 | 无 | 最小改动，立即可见 |
| P1 | 方案 D-1：plan 头部 read-basis/live-anchors 字段 | devflow-plan.js 校验扩展 | 基于已落地 Prewalk 契约 |
| P2 | 方案 B：Build Contract Standards 字段 + 结构扫描 | 方案 A 落地后 | 扫描器先 report-only |
| P2 | 方案 C：slice 自检清单 | Build 契约 | 低风险 |
| P3 | 方案 D-2：capability:eval 接力场景 | 方案 D-1 落地 | 验证跨模型 |

## 6. Not doing（当前明确不做）

- 不做自动修复/自动重构（只报告候选）；
- 不做代码风格 lint 强制（缩进/命名品味属软约束）；
- 不改 AGENTS.md 现有 8KiB 契约；
- 不新增依赖（沿用零依赖 Node 标准库模式）；
- 不重复实现 plan-owned-code-quality-gate 已落地的 Prewalk/diff-first 契约。

## 7. 验证方式

- 方案 A/C：文档 + Build 契约改动，`npm run verify:all` 全绿；
- 方案 B：`node scripts/devflow-audit.js --json` 扩展后输出候选报告；
- 方案 D：`node scripts/devflow-plan.js <plan>` 校验 read-basis 字段 + capability:eval 接力场景 PASS。
