# 功能索引（INDEX）

> 摘要: 用途=AI 进入仓库的第一跳，一行一路由：有什么功能、触发词是什么、入口在哪、怎么验证 | 维护=Prove PASS 后由 devflow-learn 新增或更新行 | 机检=node scripts/devflow-plan.js --index | 更新日=2026-09-25

## 检索方式（给 AI 的用法）

1. 新会话 Sense 阶段用任务关键词匹配本表「触发词」列，**只读命中行**的「入口」文件或对应台账段；不要批量打开能力文档。
2. 索引超过 40 行时用 `node scripts/devflow-plan.js --index --query 关键词` 过滤，避免整表读；无命中退出码仍为 0。
3. 用「验证」列的命令拿到新鲜证据，不要凭记忆断言功能可用。
4. 本表只做路由，不存正文：细节永远在被指向的 SKILL.md、脚本或台账里。
5. Status 取值：`active` 已上线、`planned` 已批准未落地、`legacy` 历史能力、`retired` 已退役。

## 索引

| 功能 | 一句话 | 触发词 | 入口 | Status | 验证 | 关键文件 | 来源计划 | 更新日 |
|---|---|---|---|---|---|---|---|---|
| DevFlow 生命周期路由 | 把请求路由到 Problem/Fast/Design-lite/Design/Build/Recovery，并守住风险门与证明门 | 路由, 请求分类, 风险门, Brainstorm, Design-lite, Fast, Problem, Recovery, 生命周期 | `AGENTS.md` + `skills/devflow-core/SKILL.md` + `/devflow` | active | `npm run route:verify` | AGENTS.md, skills/devflow-core/SKILL.md | - | 2026-09-10 |
| DevFlow 计划生成与落地 | 把 CUT_PASS 变成按交付单元拆分、跨会话/跨模型可执行的施工单；证据按"可重跑命令 / 可机械追溯"两级准入，`## Recon` 记录锚点侦查，Build 回写进度、Prove 回写 Status 与 Landed | 计划, plan, 任务拆解, 任务粒度, 交付单元, 拆分, 跨会话, 跨模型, right-sizing, 施工单, Progress, 落地, Landed, 计划校验, 侦查记录, Recon, 证据准入, 全局不变量, 跨任务通道 | `/devflow-plan` | active | `node scripts/devflow-plan.js plan-file` | skills/devflow-plan/SKILL.md, scripts/devflow-plan.js | 2026-09-10-devflow-usability-flow-reconfiguration.md | 2026-09-16 |
| DevFlow 功能索引 | 一行一路由：是什么、触发词、入口在哪、怎么验证、来自哪份计划 | 功能索引, INDEX, 有哪些功能, 入口定位, 渐进加载, 触发词, 查询模式 | `docs/features/INDEX.md` | active | `node scripts/devflow-plan.js --index` | docs/features/INDEX.md, skills/devflow-learn/SKILL.md | 2026-09-10-feature-index-progressive-loading.md | 2026-09-10 |
| DevFlow 验证矩阵 | 17 项校验把框架规则变成可执行证据，防止规则与实现漂移 | 校验, verify, 测试, CI, 断言, 打包一致性, budget, 验证矩阵 | `npm run verify:all` | active | `npm run verify:all` | package.json, scripts/validate-devflow.js | 2026-07-31-devflow-harness-iteration.md | 2026-09-10 |
| DevFlow 学习闭环 | 把用户纠正与踩坑沉淀成可召回的索引卡片，PASS 后强制复盘 | 学习, 沉淀, 学习卡, 纠正, 踩坑, 召回, learn | `/devflow-learn` | active | `npm run learn:verify` | skills/devflow-learn/SKILL.md, .copilot/LEARNING_INDEX.md | 2026-07-16-completion-knowledge-capture.md | 2026-09-10 |
| DevFlow 需求闭环 | 一条需求从确认到落地的台账；跳过文档必须由用户显式选择并留痕 | 需求台账, 闭环, 落地, 跳过留痕, opt-out, 落地率, loop | `docs/requirements.md` | active | `node scripts/devflow-plan.js --index` | docs/requirements.md, skills/devflow-prove/SKILL.md | 2026-09-10-requirement-loop-and-developer-profile.md | 2026-09-10 |
| DevFlow 独立评审 | 用户显式请求的对抗审查与找茬，独立于生命周期之外 | 对抗审查, 找茬, 红队, 最大遗漏, 盲点, 不安感, 独立评审 | `/devflow-adversarial` + `/devflow-find-fault` | active | `npm run trigger:verify` | skills/devflow-adversarial/SKILL.md, skills/devflow-find-fault/SKILL.md | 2026-07-26-independent-manual-review-skills.md | 2026-09-10 |
| DSH 分发与预设 | 把技能、命令、脚本打包成 DSH 插件与预设，源与副本逐字节一致 | DSH, 插件, 预设, preset, 分发, 同步资产, 打包 | `dsh/plugins/dsh-devflow` | active | `npm test` | dsh/plugins/dsh-devflow/scripts/sync-assets.js, dsh/agent-presets/devflow-2 | 2026-08-19-devflow-dsh-plugin-pack.md | 2026-09-10 |
| 循环工程 | Loop Engine 预设与独立分发插件，支撑模型自主闭环 | 循环, loop, 轮次, 失败卡, 状态文件, 循环工程 | `skills/loop-engineering` + `dsh/agent-presets/loop-engine` | active | `npm test` | skills/loop-engineering/SKILL.md, dsh/plugins/dsh-loop-engine/package.json | 2026-08-21-loop-engineering-preset.md | 2026-09-10 |
| Wiki 单向发布 | 从仓库文档生成 GitHub Wiki 页面；repo 是源，wiki 是派生只读视图 | wiki, 发布, 派生视图, Home, Sidebar, wiki:check | `scripts/devflow-wiki.js` | active | `npm run wiki:check` | scripts/devflow-wiki.js, docs/features/INDEX.md | 2026-09-10-wiki-single-way-publish.md | 2026-09-10 |
| 交付面残留治理 | 最终产物只描述已采纳最终状态，不回放被否方案、会话纠正与否定指令 | 交付残留, 负向回声, 会话残留, 此地无银, commit 文案, PR 标题, 交付说明, 终稿检查 | `AGENTS.md` + `skills/devflow-core/SKILL.md` + 4 个节点 references（Build/Prove/Spec-Plan/Docs） | active | `npm run verify:all` | AGENTS.md, skills/devflow-core/SKILL.md, scripts/validate-devflow.js | 2026-09-14-delivery-residue-hygiene.md | 2026-09-14 |
| DevFlow 拷问直达 | 用户直呼 grill me / 拷问我 / 压力测试 或运行 `/devflow-grill` 直达 `devflow-brainstorm` 结构化澄清（纪律门不降） | grill me, 拷问我, 压力测试, 拷问, 直达澄清, grill | `/devflow-grill` | active | `npm run trigger:verify` | skills/devflow-brainstorm/SKILL.md, commands/devflow-grill.toml | 2026-09-23-devflow-grill-entry-and-structured-clarification.md | 2026-09-23 |
| 反 AI 味质量门 | 把 humanizer 25 写作模式与 hallmark 58 设计门蒸馏成两份清单，接进 Build 与 Prove 的写后检查 | AI味, slop, humanizer, hallmark, 文案质量, 设计门, 六轴, 25 模式, 58 门, prose check | `skills/devflow-prove/references/prose-quality-checklist.md` | active | `npm test` | skills/devflow-prove/references/prose-quality-checklist.md, skills/devflow-prove/references/ui-slop-checklist.md | 2026-09-25-anti-slop-prose-design-quality.md | 2026-09-25 |

## 维护机制

- **Prove PASS 后**：本次 diff 若改变用户可感知能力或接口契约，`devflow-learn` 必须新增或更新一行（含触发词）；无变化显式记为 `no-change`。
- **触发词是路由键**：写用户会说的词，不写内部符号名；触发词缺失或空洞等于该功能检索不到。
- **入口或验证命令变化时**：同步更新该行，避免 AI 按过期入口行动。
- **退役能力**：Status 改 `retired`，不要删除行；删除会让来源计划失去落点。
- 行内「关键文件」与「来源计划」必须真实存在，否则 `node scripts/devflow-plan.js --index` 非零退出。
