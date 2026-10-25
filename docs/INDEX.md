# DevFlow-Core 文档地图

> 用途：新会话用最少的读取定位权威文档。只做路由，不复述正文。
> 机检：`npm test` 断言本页覆盖根文档与分类索引，`docs/specs/INDEX.md` 覆盖每份 spec，且所列路径真实存在。

## 五问直达

| 问题 | 权威文件 | 类型 |
|---|---|---|
| 这是什么产品 | `README.md`、`PRD.md` | 活 |
| 怎么组织 | `project-knowledge/AI-START-HERE.md` | 活 |
| 怎么跑、怎么验证 | `README.md` + `package.json` 脚本 | 活 |
| 现在做到哪 | `requirements.md` | 活 |
| 某个能力现状 | `docs/features/INDEX.md` | 活 |
| 某项设计为什么这样 | `docs/specs/INDEX.md`、`docs/plans/INDEX.md` | 快照 |
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
| `specs/` | 设计契约快照 | 快照 | 由 `specs/INDEX.md` 维护 |
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

## 分类索引

- 设计契约：`docs/specs/INDEX.md`（派生，按年分组，`node scripts/devflow-docs.js --refresh` 重建）
- 实施计划：`docs/plans/INDEX.md`
- 能力现状：`docs/features/INDEX.md`

## 快照规则

- `specs/`、`plans/` 与三份根目录评审文档是历史快照：记录当时的决定，不是当前事实。
- 当前事实只看活文档：`requirements.md` 看进度，`features/INDEX.md` 看能力，`AGENTS.md` 看规则。
- 引用快照时写明"当时"，不得把快照当规范。

## 更新契约

- 新增任意根文档：在本页登记；漏登记会让 `npm test` 失败。
- 新增 spec：运行 `node scripts/devflow-docs.js --refresh` 重建 `specs/INDEX.md`；主地图不逐条登记。
- 能力行为变化：更新 `features/INDEX.md` 与 `requirements.md`。
- 安装或命令变化：更新 `README.md` 与 `project-knowledge/AI-START-HERE.md` 的启动就绪清单。
- 计划推进：更新 `plans/INDEX.md` 与 `requirements.md`。

## 记录规范

新数据按下表落位；字段与状态机以各文件表头为准。机检：`node scripts/devflow-plan.js --index`、`node scripts/devflow-docs.js --check`、`npm test`。

| 事件 | 落位 | 必填 | 机检 |
|---|---|---|---|
| 需求确认 → Spec → Plan → 构建 → 落地 | `docs/requirements.md` 同一行逐格推进 | 状态、落地物路径、终态证据（逐项摘要，非仅整体退出码）；`opt-out` 写原因 | index |
| 计划新建或完成 | `docs/plans/INDEX.md` 一行 + 计划头 `Status` | Status 与文件头一致；done 有落地证据 | index |
| 新增 spec | 跑 `--refresh` 重建 `docs/specs/INDEX.md` | 派生索引覆盖全部 spec，不手写 | check |
| 能力或接口契约变化 | `docs/features/INDEX.md` 一行 | 触发词、入口、验证命令、关键文件、来源计划 | index |
| 每次落地 | 项目根 PROGRESS.md 摘要；`docs/project-knowledge/` change-log | 日期、变更、涉及模块；业务语义待确认 | 无 |
| 新根文档 | 本页「根文档」区登记 | 路径真实存在 | check |
| 可复用经验 | `.copilot/cards/*.md` + `../.copilot/LEARNING_INDEX.md` | Trigger、Lesson、Next action、Evidence | learn |

终态证据写逐项摘要（`verify:all: test PASS / learn PASS / …`），不写"退出码 0"。汇总数字只能证明整体通过，逐项摘要才能回答"哪一项曾经拦下过问题"。

需求状态机：`open -> designed -> planned -> built -> landed`；非终态可转 `opt-out` 或 `dropped`。
