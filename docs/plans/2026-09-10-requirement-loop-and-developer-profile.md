# 需求闭环与开发者画像（需求台账 + 跳过留痕 + 闭环报告 + 偏好卡）

Status: done
Goal: 一条需求从确认到落地全程可追溯；真实需求默认留标准记录，跳过文档必须用户显式选择并留痕；技能在使用中沉淀开发者偏好并在下一轮应用。
Not doing: per-requirement 详情文件；新目录、依赖或脚本；改 Prove 验证强度；自动写文档正文；命中计数或遥测；Web 看板；旧 spec 与旧计划迁移。
Cut: 做 需求台账 + 逐节点推进 + opt-out 留痕 + Prove 终态硬条件 + `--loop` 报告 + `--index` 台账校验 + global 偏好卡与 Sense 应用 + 晋升回流需求行 | 不做 per-requirement 文件、新目录依赖脚本、改验证强度、自动写正文、命中计数遥测 | 复用 双索引模式、`--index`/`--query` 解析、`Scope: global` 卡、`docs/loop` 摘要行、现有节点回写职责 | 验证 `npm run verify:all`、`--index` 正负例、`--loop`、`npm run route:verify`、轻路径演练 | Rejected: 把 plans 索引扩成工作台账（语义纠缠，C 深度需求无计划可挂）；per-requirement 目录（违反不新增目录）；独立 `devflow-requirements.js`（复用 `--index`/`--loop` 模式）
Source: docs/specs/2026-09-10-requirement-loop-and-developer-profile.md
Execution mode: sequential
Landed: 2026-09-10 · npm run verify:all 退出码 0 + --index PASS + --loop 输出计数

## Tasks

Task: 建立需求台账文件
Files:
- Create: docs/requirements.md | new file | 需求台账表与摘要行
Change: 增加 8 列表头与 `> 摘要:` 行，并登记本变更自身为首行，状态从 `open` 起步
Acceptance: 文件存在；表头含日期、需求、来源、深度、落地物、状态、证据或跳过、更新日；摘要行含用途、维护触发与机检命令
Verify: run `node scripts/devflow-plan.js --index` expect exit 0
Not doing: 不建 per-requirement 详情文件
Task: 七个节点写明台账写入职责
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | symbol: `## Fixed Output Contract` | 确认后建 open 行
- Modify: skills/devflow-core/SKILL.md | symbol: `## Routes` | Design-lite 建档并记深度 C
- Modify: skills/devflow-spec/SKILL.md | symbol: `## Process` | 批准写 designed 与 spec 路径
- Modify: skills/devflow-plan/SKILL.md | symbol: `## Authoring Process` | 批准写 planned 与计划路径
- Modify: skills/devflow-build/SKILL.md | symbol: `## Plan Pack` | 任务全部完成写 built
- Modify: skills/devflow-prove/SKILL.md | symbol: `## Required Output` | 终态硬条件并写 landed
- Modify: skills/devflow-docs-followup/SKILL.md | symbol: `## Inquiry` | 用户显式跳过写 opt-out 与原因
Change: 七个技能各增加一句写入职责与对应状态，状态只前进不回退；Prove 在需求行非终态时不得判定 PASS
Acceptance: 七个技能均写明对应状态与落地物字段；跳过只豁免文档正文不豁免验证
Verify: run `npm run trigger:verify` expect exit 0
Not doing: 不改路由表、A/B/C 语义与宿主适配器
Task: checker 增加 --loop 报告与台账校验
Files:
- Modify: scripts/devflow-plan.js | symbol: `checkIndexes` | 增加需求台账结构校验
- Modify: scripts/devflow-plan.js | symbol: `runIndexCheck` | 增加 --loop 报告分支
- Modify: scripts/devflow-plan.js | symbol: `usage` | 说明 --loop
- Modify: scripts/devflow-plan.js | symbol: `selfTest` | 台账与 --loop 正负例
Change: 增加 `--loop` 只读报告（需求状态计数、计划落地率、能力行数、晋升候选）；`--index` 校验状态白名单、终态证据、opt-out 原因、落地物路径存在，四类问题非零退出
Acceptance: 四类台账问题均非零退出；`--loop` 输出计数且退出码为零；台账缺失时不报错
Verify: run `node scripts/devflow-plan.js --loop` expect 计数输出且 exit 0
Not doing: 不改 `--query` 与全量校验既有行为
Task: 偏好卡与 Sense 应用
Files:
- Modify: skills/devflow-learn/SKILL.md | symbol: `## Completion Review` | 偏好卡与晋升回流
- Modify: skills/devflow-core/SKILL.md | symbol: `## Activation Evidence` | 增加 Preferences applied 行
- Modify: skills/devflow-core/references/core-methods.md | symbol: `## Method 1: Context Map` | global 卡优先匹配
- Modify: AGENTS.md | symbol: `## Start` | 偏好应用说明
- Modify: commands/devflow.toml | symbol: `prompt` | 同步偏好说明
Change: Learn 在同类"怎么做"纠正重复两次后增加 `Scope: global` 偏好卡，达置信度阈值时提议升规则并为该提议建需求行；Sense 先匹配 global 卡、按偏好决定文档详略并输出应用数量
Acceptance: Learn 写明偏好卡触发与回流；四处写明 global 优先与计数；不新增存储
Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-learn/SKILL.md','utf8'); if(!s.includes('global')||!s.includes('偏好')) process.exit(1)"` expect exit 0
Not doing: 不做命中计数、自动晋升或遥测
Task: 文档、断言与打包刷新
Files:
- Modify: docs/features/INDEX.md | symbol: `## 索引` | 新增需求闭环能力行
- Modify: README.md | symbol: `## Verification` | 补 `--loop` 与台账说明
- Modify: docs/features/devflow-core.md | symbol: `## Version History` | 记录 v54
- Modify: docs/iteration-plan.md | symbol: `## 已落地清单` | 追加本次迭代行
- Modify: scripts/validate-devflow.js | symbol: `assert` | 台账与 `--loop` 断言
Change: 增加能力行、文档与断言；随后运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 刷新 DSH 资产并同步 Codex 镜像
Acceptance: `npm test` 通过；README 含 `--loop` 说明；能力索引含需求闭环行
Verify: run `npm test` expect 通过
Not doing: 不改安装器清单与 `verify:all` 项数

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 建立需求台账文件 | done | `node scripts/devflow-plan.js --index` PASS；8 列加摘要行；首行登记本需求（建档时已过 Spec 与 Plan，故入 planned） |
| 2 | 七个节点写明台账写入职责 | done | `npm run trigger:verify` exit 0；七处含状态与落地物字段 |
| 3 | checker 增加 --loop 报告与台账校验 | done | `--self-test` PASS（状态非法、终态无证据、opt-out 无原因、落地物缺失四类负例）；`--loop` 输出计数 exit 0；`--index` 台账校验 PASS |
| 4 | 偏好卡与 Sense 应用 | done | `node -e` 断言 exit 0；global 优先与 Preferences applied 四处同步 |
| 5 | 文档、断言与打包刷新 | done | `npm test` PASS；`npm run verify:all` exit 0；能力索引含需求闭环行 |
