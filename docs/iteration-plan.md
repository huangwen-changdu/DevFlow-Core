# DevFlow-Core 长期迭代计划

本文档是 DevFlow-Core 框架自身的长期迭代计划活文档（living document）：记录已落地的架构改进、后续迭代候选，以及**如何更新本文档**。运行时方法与流程规则仍在 `skills/*/references/*`，本文档只记录方向与状态，不复制流程内容。

## 目的与范围

- 目的：让框架的架构改进（CI、预算、一致性校验、状态字段、机器化输出、可观测性、规模治理）有可追踪的落地记录和明确的演进方向。
- 范围：DevFlow-Core 仓库自身的维护与迭代；不包含具体业务项目的使用方式（见 README）。
- 原则：遵循项目硬边界——不新增无当前需要的依赖/抽象/配置表面/目录；改动必须通过 `npm run verify:all`。

## 如何更新本文档

**触发时机**（满足任一即可更新）：

1. 一批架构改进完成落地（如 P0/P1/P2 批次）；
2. 每次发布新版本（version bump）；
3. 用户或维护者提出新的迭代候选；
4. 约束或阈值被校准（如 budget 上限调整、路由表面变更）。

**更新步骤**：

1. 在「已落地清单」追加或更新条目：内容、位置、验证命令、状态（done / partial）；
2. 在「后续迭代候选」修订候选清单：优先级、触发条件、被采纳后移入已落地清单；
3. 在「历史记录」追加一行：日期、批次、变更摘要、关联 Plan 文件；
4. 运行 `npm run verify:all`，确认全绿；
5. 提交并注明本文档变更。

**负责人**：DevFlow-Core maintainers。任何批次完成时由执行者同步更新；候选清单的优先级调整需在提交说明中写明理由。

**验证门禁**：文档本身不进入运行时校验面，但其引用的脚本路径与命令必须以 `npm run verify:all` 实际通过为准。

## 已落地清单

| 日期 | 条目 | 位置 | 验证命令 | 状态 |
|---|---|---|---|---|
| 2026-07-31 | P0-1 CI：push/PR 自动跑完整校验 | `.github/workflows/ci.yml` | 仓库 push 后查看 Actions | done |
| 2026-07-31 | P0-2 + P2-7 skill 预算门禁：单 SKILL.md ≤15 KiB、skills/ 总量 ≤280 KB | `scripts/devflow-budget.js` + `package.json`（budget:verify） | `npm run budget:verify` | done |
| 2026-07-31 | P0-3 路由一致性校验：3 成功边 + 7 异常返回边覆盖 AGENTS.md / core SKILL.md / README / skill-call-diagram | `scripts/validate-route-consistency.js` + `package.json`（route:verify） | `npm run route:verify` | done |
| 2026-07-31 | P1-4 生命周期状态字段：spec/plan 可选 `Status: draft\|approved\|in-progress\|done`，缺失=legacy | `scripts/devflow-spec.js`、`scripts/devflow-plan.js` | `node scripts/devflow-plan.js --self-test` | done |
| 2026-07-31 | P1-5a checker 机器化输出：全部运行时 checker 支持 `--json` | `scripts/devflow-{spec,plan,review,debt,audit}.js` | 任一 checker `--json` 输出可解析 | done |
| 2026-07-31 | P1-5b 安装升级路径：`--write` 记录 `.devflow-manifest.json`（版本+sha256），`--check` 报版本差 | `scripts/install-devflow.js` | `npm run install:verify` | done |
| 2026-07-31 | P2-6 本地可观测性：`DEVFLOW_OBSERVE=1` 时项目根追加会话日志，默认关闭 | `hooks/devflow-session-start.js` + `.gitignore` | 见该 hook 的验证场景 | done |
| 2026-07-31 | 本迭代文档 | `docs/iteration-plan.md` | 本文档自身 | done |

批次执行依据：`docs/plans/2026-07-31-devflow-harness-iteration.md`（Status: approved → in-progress → done 的迁移即本表状态来源）。

## 后续迭代候选

| 优先级 | 候选 | 触发条件 | 说明 |
|---|---|---|---|
| P1 | 跨会话状态自动恢复：Core 路由时读取 plan/spec 的 `Status` 字段决定续作路径 | 出现跨会话/跨 agent 恢复任务的真实需求 | 复用现有产物字段，不新增目录；字段校验已就绪 |
| P1 | checker 输出消费方：把 `--json` 接入 CI 摘要或 harness 门禁 | 有真实消费者（CI 注解、外部工具） | 避免为输出而输出 |
| P2 | 观测数据驱动约束校准：汇总 `.devflow-observe.log` 与 gate 失败统计，校准 budget 阈值与约束 | 日志积累到可统计量（如 ≥20 条会话） | 无网络上报，纯本地分析 |
| P2 | budget 阈值演进：15 KiB 单文件/280 KB 总量上限随 skill 增长复核 | 任一 skill 逼近 15 KiB（当前最近 14,715） | 复核时更新 `scripts/devflow-budget.js` 注释依据 |
| P2 | 升级路径细化：`--check` 报告文件级 diff 摘要替代全量 `--force` | 下游用户提出升级困惑 | manifest 已有 sha256 基础 |
| P3 | 规模治理指标化：技能总数/总 token 进入发布 gate 报告 | 发布流程成型后 | 当前由 budget:verify 覆盖主体部分 |

## 历史记录

| 日期 | 变更 | 关联文件 |
|---|---|---|
| 2026-07-31 | 建立本文档；落地 P0/P1/P2 共 7 条架构改进 | `docs/plans/2026-07-31-devflow-harness-iteration.md` |
