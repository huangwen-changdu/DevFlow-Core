# 功能索引（INDEX）

> 摘要: 用途=AI 进入仓库的第一跳，一行看清「有哪些功能、入口在哪、怎么验证」 | 维护=Prove PASS 后由 devflow-learn 新增或更新行 | 机检=node scripts/devflow-plan.js --index | 更新日=2026-09-10

## 检索方式（给 AI 的用法）

1. 新会话 Sense 阶段先读本表，定位与任务相关的功能行。
2. 用「入口」列找到 owner 技能、命令或文件，再读对应 SKILL.md 或代码；本表不替代正文。
3. 用「验证」列的命令拿到新鲜证据，不要凭记忆断言功能可用。
4. Status 取值：`active` 已上线、`planned` 已批准未落地、`legacy` 历史能力、`retired` 已退役。

## 索引

| 功能 | 一句话 | 入口 | Status | 验证 | 关键文件 | 来源计划 | 更新日 |
|---|---|---|---|---|---|---|---|
| DevFlow 生命周期路由 | 把请求路由到 Problem/Fast/Design-lite/Design/Build/Recovery，并守住风险门与证明门 | `AGENTS.md` + `skills/devflow-core/SKILL.md` + `/devflow` | active | `npm run route:verify` | AGENTS.md, skills/devflow-core/SKILL.md | - | 2026-09-10 |
| DevFlow 计划生成与落地 | 把 CUT_PASS 变成可续跑施工单，Build 回写进度、Prove 回写 Status 与 Landed | `/devflow-plan` | active | `node scripts/devflow-plan.js <plan-file>` | skills/devflow-plan/SKILL.md, scripts/devflow-plan.js | 2026-09-10-devflow-usability-flow-reconfiguration.md | 2026-09-10 |
| DevFlow 功能索引 | 一行一功能：是什么、入口在哪、怎么验证、来自哪份计划 | `docs/features/INDEX.md` | active | `node scripts/devflow-plan.js --index` | docs/features/INDEX.md, skills/devflow-learn/SKILL.md | 2026-09-10-devflow-usability-flow-reconfiguration.md | 2026-09-10 |
| DevFlow 验证矩阵 | 17 项校验把框架规则变成可执行证据，防止规则与实现漂移 | `npm run verify:all` | active | `npm run verify:all` | package.json, scripts/validate-devflow.js | 2026-07-31-devflow-harness-iteration.md | 2026-09-10 |
| DevFlow 学习闭环 | 把用户纠正与踩坑沉淀成可召回的索引卡片，PASS 后强制复盘 | `/devflow-learn` | active | `npm run learn:verify` | skills/devflow-learn/SKILL.md, .copilot/LEARNING_INDEX.md | 2026-07-16-completion-knowledge-capture.md | 2026-09-10 |
| DevFlow 独立评审 | 用户显式请求的对抗审查与找茬，独立于生命周期之外 | `/devflow-adversarial` + `/devflow-find-fault` | active | `npm run trigger:verify` | skills/devflow-adversarial/SKILL.md, skills/devflow-find-fault/SKILL.md | 2026-07-26-independent-manual-review-skills.md | 2026-09-10 |
| DSH 分发与预设 | 把技能、命令、脚本打包成 DSH 插件与预设，源与副本逐字节一致 | `dsh/plugins/dsh-devflow` | active | `npm test` | dsh/plugins/dsh-devflow/scripts/sync-assets.js, dsh/agent-presets/devflow-2 | 2026-08-19-devflow-dsh-plugin-pack.md | 2026-09-10 |
| 循环工程 | Loop Engine 预设与独立分发插件，支撑模型自主闭环 | `skills/loop-engineering` + `dsh/agent-presets/loop-engine` | active | `npm test` | skills/loop-engineering/SKILL.md, dsh/plugins/dsh-loop-engine/package.json | 2026-08-21-loop-engineering-preset.md | 2026-09-10 |

## 维护机制

- **Prove PASS 后**：本次 diff 若改变用户可感知能力或接口契约，`devflow-learn` 必须新增或更新一行；无变化显式记为 `no-change`。
- **入口或验证命令变化时**：同步更新该行，避免 AI 按过期入口行动。
- **退役能力**：Status 改 `retired`，不要删除行；删除会让来源计划失去落点。
- 行内「关键文件」与「来源计划」必须真实存在，否则 `node scripts/devflow-plan.js --index` 非零退出。
