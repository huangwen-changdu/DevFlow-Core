# DevFlow-Core 文档地图

> 用途：新会话用最少的读取定位权威文档。只做路由，不复述正文。
> 机检：`npm test` 断言本页覆盖 `docs/*.md` 与 `docs/specs/*.md`，且所列路径真实存在。

## 五问直达

| 问题 | 权威文件 | 类型 |
|---|---|---|
| 这是什么产品 | `README.md`、`PRD.md` | 活 |
| 怎么组织 | `project-knowledge/AI-START-HERE.md` | 活 |
| 怎么跑、怎么验证 | `README.md` + `package.json` 脚本 | 活 |
| 现在做到哪 | `requirements.md` | 活 |
| 某个能力现状 | `features/INDEX.md` | 活 |
| 某项设计为什么这样 | `specs/`、`plans/` | 快照 |
| 踩过什么坑 | `../.copilot/LEARNING_INDEX.md` | 活 |

## 目录台账

| 路径 | 用途 | 类型 | 更新触发 |
|---|---|---|---|
| `../AGENTS.md` | 可移植流程契约（七阶段、门、输出） | 活 | 生命周期规则变化 |
| `../README.md` | 产品定位、安装、验证命令 | 活 | 安装面或验证命令变化 |
| `project-knowledge/AI-START-HERE.md` | 项目执行心智、启动就绪 | 活 | 结构、命令数、技能数变化 |
| `requirements.md` | 需求台账与状态机（唯一进度真相） | 活 | 每次需求推进 |
| `features/INDEX.md` | 能力现状与触发词 | 活 | 能力新增或行为变化 |
| `plans/INDEX.md` | 计划状态与落地率 | 活 | 计划新建或落地 |
| `specs/` | 设计契约快照 | 快照 | 新建 spec 时在本页登记 |
| `plans/` | 实施计划快照 | 快照 | 由 `plans/INDEX.md` 维护 |
| `loop/INDEX.md` | 循环工程与沉淀 | 活 | 循环任务变化 |
| `iteration-plan.md` | 阶段排期 | 活 | 排期调整 |
| `platform-setup.md`、`dsh-plugins-guide.md` | 平台与插件接入 | 参考 | 宿主能力变化 |
| `../.copilot/LEARNING_INDEX.md` | 学习卡与开发者偏好 | 活 | 复盘产出 |
| `../skills/*/references/` | 运行时方法 | 活 | 方法变化 |

## 根文档

- `PRD.md` — 产品方向与边界
- `requirements.md` — 需求台账
- `iteration-plan.md` — 阶段排期
- `platform-setup.md` — 各宿主安装与配置
- `dsh-plugins-guide.md` — DSH 插件包开发与发布
- `2026-07-31-ai-code-quality-engineering.md` — 历史评审快照
- `2026-07-31-harness-flow-review.md` — 历史评审快照
- `2026-09-16-plan-contract-v2-drift-review.md` — 历史漂移审查快照

## 设计契约快照（`specs/`）

- 路由与生命周期：`2026-07-31-skill-owned-lifecycle-flow.md`、`2026-09-10-devflow-usability-flow-reconfiguration.md`、`2026-07-30-constraint-rule-calibration.md`
- 澄清与技能协作：`2026-07-17-devflow-brainstorm-superpowers-interaction.md`、`2026-07-22-devflow-brainstorm-semantic-echo-back.md`、`2026-07-28-devflow-brainstorm-clarification-boundary.md`、`2026-07-28-devflow-brainstorm-spec-responsibility-split.md`、`2026-07-31-meta-skill-capability-integration.md`
- 计划与质量门：`2026-07-29-code-level-plan-pack-contract.md`、`2026-07-31-plan-owned-code-quality-gate.md`、`2026-07-31-ai-code-quality-gate.md`、`2026-09-16-plan-contract-evidence-density.md`
- 上下文与知识：`2026-07-17-knowledge-recall-chain.md`、`2026-07-30-progressive-context-and-adapter-contract.md`、`2026-07-16-completion-knowledge-capture.md`、`2026-07-24-local-capability-evaluation.md`
- 交付与评审：`2026-09-14-delivery-residue-hygiene.md`、`2026-07-26-independent-manual-review-skills.md`
- 需求闭环与观测：`2026-09-10-requirement-loop-and-developer-profile.md`、`2026-07-14-codex-devflow-observability.md`
- 外部能力接入：`2026-07-20-query-kibana-logs-skill.md`
- 循环工程：`2026-08-21-loop-engineering-preset.md`

## 快照规则

- `specs/`、`plans/` 与三份根目录评审文档是历史快照：记录当时的决定，不是当前事实。
- 当前事实只看活文档：`requirements.md` 看进度，`features/INDEX.md` 看能力，`AGENTS.md` 看规则。
- 引用快照时写明"当时"，不得把快照当规范。

## 更新契约

- 新增任意根文档或 `specs/` 快照：在本页对应清单加一行；漏登记会让 `npm test` 失败。
- 能力行为变化：更新 `features/INDEX.md` 与 `requirements.md`。
- 安装或命令变化：更新 `README.md` 与 `project-knowledge/AI-START-HERE.md` 的启动就绪清单。
- 计划推进：更新 `plans/INDEX.md` 与 `requirements.md`。
