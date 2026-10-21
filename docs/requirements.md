# 需求台账（Requirements）

> 摘要: 用途=一条需求从确认到落地的唯一记录，补上 Spec/Plan/能力行之间缺失的那一环 | 维护=各生命周期节点推进状态，Prove 写终态 | 机检=node scripts/devflow-plan.js --index | 更新日=2026-10-16

## 状态机

```text
open -> designed -> planned -> built -> landed
任一非终态 -> opt-out（用户显式跳过文档）或 dropped（需求作废）
```

| 状态 | 含义 | 写入方 |
|---|---|---|
| `open` | 需求已确认，尚未设计 | `devflow-brainstorm` 或 `devflow-core` |
| `designed` | Spec 已批准 | `devflow-spec` |
| `planned` | Plan 已批准 | `devflow-plan` |
| `built` | 构建完成 | `devflow-build` |
| `landed` | 验证通过并落地 | `devflow-prove` |
| `opt-out` | 验证通过，但用户显式跳过文档 | `devflow-docs-followup` |
| `dropped` | 需求作废 | `devflow-core` |

## 台账

| 日期 | 需求 | 来源 | 深度 | 落地物 | 状态 | 证据或跳过 | 更新日 |
|---|---|---|---|---|---|---|---|
| 2026-09-10 | 需求闭环与开发者画像：需求台账 + 跳过留痕 + 闭环报告 + 偏好卡 | 用户请求 | A | docs/specs/2026-09-10-requirement-loop-and-developer-profile.md, docs/plans/2026-09-10-requirement-loop-and-developer-profile.md | landed | npm run verify:all 退出码 0；--index PASS；--loop 输出计数 | 2026-09-10 |
| 2026-09-10 | GitHub Wiki 作为文档知识沉淀出口：repo 为源、单向派生发布 | 用户请求 | B | docs/plans/2026-09-10-wiki-single-way-publish.md | landed | npm run verify:all 退出码 0；wiki:check 无克隆 exit 0；--self-test PASS | 2026-09-10 |
| 2026-09-11 | 计划任务粒度收紧：一任务 = 一可独立验收交付单元（指南判据 + checker 保守子集；取消 60 行硬上限） | 用户请求 | C | - | landed | npm run verify:all 退出码 0；自测覆盖多结果 FAIL/done 容忍/代码片段分号；粗/细 E2E exit 1/0；4 份既有 v2 计划零回归；镜像哈希一致 | 2026-09-11 |
| 2026-09-11 | 计划跨会话/跨模型可执行：吸收 right-sizing 判据 + how 非显然任务附最小可执行改法 | 用户请求 | C | - | landed | npm run verify:all 退出码 0；断言锁 right-sizing/锚点不可推短语；历史 v2 计划 exit 0；镜像哈希一致；budget PASS；插件版本随本轮发布 bump：框架 0.4.0 / dsh-devflow 0.7.0 / Codex 0.2.0（npm publish 待用户执行）；六个用户级 home 同步 --check 全通过（54 文件/家） | 2026-09-11 |
| 2026-09-14 | 交付面规则补充原版操作细节：标签与文件名枚举、三问逐面判断、正向重生成、无关改动边界、外部操作与技术事实保留、写后重检、不加清理声明 | 用户请求 | C | - | landed | npm run verify:all 退出码 0（budget 总 160464/280000，AGENTS.md 6960/8192）；六处标记 6/6；DSH sync 幂等+子包自测 PASS；Codex 副本逐字节一致+verify-plugin PASS；版本保持 0.5.0/0.9.0/0.3.0（npm publish 待用户执行） | 2026-09-14 |
| 2026-09-14 | 交付面残留治理（吸收 no-negative-echo）：AGENTS.md 与 devflow-core/Spec/Plan/Build/Prove 嵌入规则与收口检查；DSH/Codex 插件副本与说明同步发布 | 用户请求 | A | docs/specs/2026-09-14-delivery-residue-hygiene.md, docs/plans/2026-09-14-delivery-residue-hygiene.md | landed | npm run verify:all 退出码 0（18 项校验全 PASS）；六处 accepted final state 标记 6/6；DSH sync 幂等+自测 PASS（0.9.0）；Codex 逐字节一致+verify-plugin PASS（0.3.0）；根版本 0.5.0；npm publish 待用户执行（无 token） | 2026-09-14 |
| 2026-09-14 | devflow-2 预设 persona 补齐 AGENTS.md 中无 skill 承接的两节：独立判断与兜底输出契约 | 用户请求 | C | dsh/agent-presets/devflow-2/agent.cordis.yml | landed | npm run verify:all 退出码 0（18 项，含 user/route/budget/learn）；源+插件资产+用户级三副本 sha256 一致 530854695c；YAML 解析与 prefix 契约 14/14 PASS；插件 sync 自测 PASS；devflow: 标记 status ok | 2026-09-14 |
| 2026-09-16 | 计划契约密度回归：按"可否验伪"重划计划字段——恢复可追溯的头部全局不变量与命令式侦查载体，跨任务交接通道仅在子代理执行模式下要求，并清除 10 处 v1 契约漂移 | 用户请求 | A | docs/specs/2026-09-16-plan-contract-evidence-density.md, docs/plans/2026-09-16-plan-contract-evidence-density.md | landed | npm run verify:all 退出码 0（18 项）；plan --self-test 与 --index 退出码 0；32 份计划改动前后退出码差异 0；budget 162919/280000 且 prove 15337/15360；sync 幂等 + DSH 子包自测 + Codex 插件 14 skills/5 self-tests 通过；版本 0.6.0/0.10.0/0.4.0（npm publish 待用户执行） | 2026-09-16 |
| 2026-09-17 | devflow-find-fault 检查完成后输出必要调整修复列表：逐项给出严重度、证据、为何必要、建议最小改法与验收方式，且只源自已报告 finding/unease decision | 用户请求 | C | - | landed | npm run verify:all 退出码 0（18 项）；capability:eval Scenario 1G `independent-manual-find-fault-review` PASS 且 Gaps: none（新增 scenarioEvidence 与 flow-self-test 1G 同步）；trigger:verify 新增场景 `find-fault necessary adjustments and fixes` PASS（19 场景，资产对等 PASS）；find-fault 三副本 md5 d4fb6602、命令两副本 07fa8fef、flow-self-test 三副本 b6a1562d 一致；budget 164572/280000 且 find-fault 11093/15360；DSH 插件 sync 自测 PASS；六个用户级 home（.claude/.codebuddy/.codex/.workbuddy/.zcode/.dsh）同步前 3 changed/家（-find-fault 技能与命令、flow-self-test），`--write --force` 后 `--check` 6/6 exit 0（54 文件/家），3 文件 × 6 家 md5 与工作区一致；版本保持 0.6.0/0.10.0/0.4.0（npm publish 待用户执行） | 2026-09-17 |
| 2026-09-18 | 规则补充第一原理说明、按现实需求控制扩展点、可回滚改动与破坏性修改确认门槛 | 用户请求 | C | - | landed | `node scripts/devflow-plan.js --index` PASS；`npm test` PASS；AGENTS.md 规则段落与主机适配器约束核对通过 | 2026-09-18 |
| 2026-09-23 | grill-me 式直达与结构化澄清体验：devflow-brainstorm 吸收直呼入口、全问题结构化弹窗、节奏规则与激活面描述（保留全部纪律门） | 用户请求 | B | docs/plans/2026-09-23-devflow-grill-entry-and-structured-clarification.md | landed | npm run verify:all exit=0；trigger:verify 20 场景 + parity PASS；六 home（55 文件/家）--check 6/6；Scenario 1H 实走走查；版本 0.7.0/0.11.0/0.5.0（npm publish 待用户执行） | 2026-09-23 |
| 2026-09-25 | 反 AI 味质量门：humanizer 25 写作模式 + hallmark 58 设计门与六轴自评蒸馏内嵌，接进 Build 交付与 Prove 证明写后检查 | 用户请求 | B | docs/plans/2026-09-25-anti-slop-prose-design-quality.md | landed | npm run verify:all 退出码 0（18 项全 PASS，budget 165457/280000）；--index PASS；verify-plugin 14 skills/5 self-tests；sync-assets 幂等；两清单 + 四处接线 + 双安装器条目 + 版本 0.7.1 / 0.7.1 / 0.5.1 / 0.11.1（npm publish 待用户执行） | 2026-09-25 |
| 2026-10-10 | 开发流程编排可见性：统一执行回执契约（已加载/已执行/不适用/受阻/未执行）+ 各节点回执与外部技能交接补齐 + 单次纠正/重复恢复边界对齐 + 正反例验证面扩展 + 运行时副本同步 | 用户请求 | B | docs/plans/2026-10-10-skill-orchestration-visibility.md | landed | npm run verify:all 退出码 0（18 项全 PASS，budget 169148/280000）；trigger:verify 23 场景含 3 新场景；capability:eval 13/13 PASS；plan:verify 增 External Skills 条件校验；doctor 六 home 6/6 pass（57 文件/家）；verify-plugin 14 skills/5 self-tests PASS；版本保持不变（npm publish 待用户执行） | 2026-10-10 |
| 2026-10-16 | 评审环节接入代码简化门与可读性门：蒸馏 ce-simplify-code 与 Anthropic code-simplifier 为 Prove 的 simplify-pass 参考（五视角、AI 式超长命名与冗余备注治理、行为不变、只剪枝本次改动引入的测试与注释、改后重跑证明并重审），新增 code-readability-checklist 七维可读性门（流程/决策就近/命名与备注/类型与取值/失败与副作用/邻居一致/测试与 diff 叙事，含首读测试与执行回执），Build 写后检查、Simplify 修复候选、评审按改动行证据分级三层接通，新增 `/devflow-simplify` 直达入口，双安装器与 DSH/Codex 副本同步 | 用户请求 | C | - | landed | npm run verify:all 退出码 0（18 项全 PASS，budget 169395/280000 且 prove 15303/15360）；trigger:verify 25 场景（含 simplify 与 readability 两场景锁定命名/备注/七维门槛）+ 6 条命令覆盖 + 资产对等 PASS；npm test 与 route/host/install/user/learn/index 各 verify exit 0；verify-plugin 14 skills/5 self-tests PASS；DSH sync 自测 PASS 且源/插件/资产/六 home 副本 md5 一致；六 home `--write --force` 后 `--check` 6/6 exit 0；版本 0.8.0 / 0.8.0 / 0.6.0 / 0.12.0，npm publish 0.12.0 已完成（2026-10-16，shasum 09bbf137，gitHead d4bf4d9） | 2026-10-16 |
| 2026-10-19 | 独立审查技能移除子代理派发：`devflow-adversarial` 与 `devflow-find-fault` 保留分轮执行，但每一轮由技能自身在当轮完成，不再派发 fresh subagent 或经 `send_message` 续轮 | 用户请求 | C | - | landed | npm run verify:all 退出码 0（18 项全 PASS，budget 168222/280000）；capability:eval 13/13 场景 PASS、Judgment PASS，含改写后的 Scenario 1F/1G 证据行；trigger:verify 25 场景 + 资产对等 PASS；verify-plugin 14 skills/5 self-tests PASS；DSH sync 二次输出一致；版本 0.8.1 / 0.8.1 / 0.6.1 / 0.12.1（npm publish 待用户执行） | 2026-10-19 |
| 2026-10-21 | AGENTS.md 重规划为流程内核：七阶段（Sense/Route/Gate/Contract/Change/Prove/Record，各带退出产物）+ 六路由表 + 技能与脚本解析顺序 + 无 skill 完整回退 + graphify 条件化；方法深度仍留 skills，触发短语逐字保留以复用既有校验面 | 用户请求 | A | - | landed | npm run verify:all 退出码 0（18 项全 PASS，含新增阶段顺序断言）；route:verify 四表面 PASS；host:verify 8 适配器 PASS；trigger:verify 25 场景 PASS；AGENTS.md 7951/8192 字节；补回执段、global 卡优先、重复纠正建卡与专家返回契约，并恢复 spec/plan 归属映射、完整最小方案阶梯与第一原理说明措辞；`commands/devflow.toml` 由 6357 收敛为 1934 字节（AGENTS.md 指针 + 七阶段回退 + 直达入口 + 输出契约），DSH 资产已同步；补命令来源规则（manifest/脚本/README/CI/playbook，找不到即具名未知）、知识包必填验证命令清单、Sense 点名 `AI-START-HERE.md`；知识包闭环：首次落地创建最小包（3 文件）、每次落地自动刷新代码支撑的结构事实并追加 change-log、业务语义仍需用户确认（新增 `references/auto-loop.md` 与校验断言，AGENTS.md 8100/8192）；按讲义 03/04/06 做全新会话测试并刷新 `AI-START-HERE.md`（15 技能、13 命令、18 项验证、启动就绪清单、进度入口、知识包闭环规则）；新增 `docs/INDEX.md` 文档地图（五问直达 + 目录台账 + 快照规则 + 更新契约），并把根文档/specs 登记与路径存在性校验挂进 `npm test`，AI-START-HERE 阅读顺序指向它；新增 `scripts/devflow-docs.js`（`--status` 盘点 9 项产物并给出缺失项命令、`--init` 生成、`--check` 校验、`--self-test`，随双安装器分发，`verify:all` 增至 19 项），知识包闭环在首次落地时初始化文档地图、每次文档增删后校验；`AGENTS.md` Sense 点名 `docs/INDEX.md` 与 `AI-START-HERE.md`（8116/8192）；分发面（8 项目副本）已一致：verify-plugin PASS、trigger 资产对等 PASS、DSH sync 幂等；用户级同步完成：`.codex`/`.codebuddy`/`.workbuddy` 三份 AGENTS.md 换为新七阶段契约（`.codex` 保留 CODEGRAPH/GRAPHIFY/caveman 全局块，旧文件留 `bak-before-sync-20261021-175456`），六个 home `--write --force` 后 `--check` 6/6 exit 0（62 文件/家）、doctor 6/6 pass、user:verify PASS；双安装器补齐 `skills/devflow-project-knowledge/references/auto-loop.md` 分发（此前仅 SKILL.md 引用但未安装）；verify:all 19 项退出码 0；README 新增“Project Artifact Onboarding Workflow”（status → install → init → check → index）与 docs:verify 说明 | 2026-10-21 |
## 维护机制

- **建档**：Brainstorm 输出 `Confirmed request`，或 Core 判为创造性工作（Design / Build 路由）时，立即写 `open` 行；纯问答、纯查询、只读验证不建档。
- **推进**：每个节点只把状态推进一格，不回退；「落地物」列填 spec 或计划路径，路径必须真实存在。
- **终态**：`landed` 与 `opt-out` 都必须填证据；`opt-out` 还必须写原因（谁在何时选择跳过哪类文档）。
- **跳过权在用户**：沉默或含糊回复不算跳过，默认记录照常生成；只有用户显式说不需要文档才写 `opt-out`。跳过只豁免文档正文，不豁免验证。
- **机检**：`node scripts/devflow-plan.js --index` 校验状态白名单、终态证据、`opt-out` 原因与落地物路径；`node scripts/devflow-plan.js --loop` 输出各状态计数、计划落地率与晋升候选。
