# 需求台账（Requirements）

> 摘要: 用途=一条需求从确认到落地的唯一记录，补上 Spec/Plan/能力行之间缺失的那一环 | 维护=各生命周期节点推进状态，Prove 写终态 | 机检=node scripts/devflow-plan.js --index | 更新日=2026-09-10

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
## 维护机制

- **建档**：Brainstorm 输出 `Confirmed request`，或 Core 判为创造性工作（Design / Build 路由）时，立即写 `open` 行；纯问答、纯查询、只读验证不建档。
- **推进**：每个节点只把状态推进一格，不回退；「落地物」列填 spec 或计划路径，路径必须真实存在。
- **终态**：`landed` 与 `opt-out` 都必须填证据；`opt-out` 还必须写原因（谁在何时选择跳过哪类文档）。
- **跳过权在用户**：沉默或含糊回复不算跳过，默认记录照常生成；只有用户显式说不需要文档才写 `opt-out`。跳过只豁免文档正文，不豁免验证。
- **机检**：`node scripts/devflow-plan.js --index` 校验状态白名单、终态证据、`opt-out` 原因与落地物路径；`node scripts/devflow-plan.js --loop` 输出各状态计数、计划落地率与晋升候选。
