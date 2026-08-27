# 计划执行零 view 调整

Goal: 计划文档执行阶段零 view：执行者（含子代理）拿到任务执行规范后直接改代码，不再重读计划文档或代码做执行前复核；计划文档自带完整执行规范，任何模型读到即可直接执行。
Architecture: 纯声明式文本改造。devflow-plan 强调执行规范前置（任务自含 Files/精确改动/Steps/Verify）；plan-methods 把 Delegated Execution 重写为零 view 执行纪律与 DSH 一任务一轮 bounded dispatch；devflow-build 删除编辑前 Plan Review，改为直接执行并在失败时回报差异；打包副本由现有 sync-assets.js 生成刷新。
Tech Stack: Markdown 技能契约、Node.js 校验脚本（全部现有机制，零新依赖）
Source: Brainstorm Confirmed request（2026-08-23 会话）+ 本计划随附 Cut Decision（B 深度）
Spec coverage: Confirmed request 的 Goal/Scope/Out of scope/Constraints/Acceptance 映射到 Task 1-4；无独立 spec 文档
Cut Decision: CUT_PASS（B 深度）——允许范围 = 本计划文档 docs/plans/2026-08-23-plan-zero-view-execution.md、skills/devflow-plan/SKILL.md、skills/devflow-plan/references/plan-methods.md、skills/devflow-build/SKILL.md、sync-assets.js 自动刷新的打包副本；复用结论 = 任务契约既有字段（Files/Steps/Acceptance/Verify）即执行规范、adversarial/find-fault 的 DSH bounded-rounds 先例、dsh/plugins/dsh-devflow/scripts/sync-assets.js 现有同步机制（Minimal Solution Ladder 第 3 rung）；排除 = 不新增文件、不改 scripts/devflow-plan.js 解析规则、不改 commands/devflow-*.toml、不动生命周期路由与三种执行模式语义、不改其他 skill 文件、不规定强弱模型分工、不做真实 DSH 端到端演示；验证 = 本计划与现有计划均通过 plan checker，npm test 与 trigger:verify 全绿。
External Skills: writing-skills; role: bounded specialist work — 校验 SKILL.md 编辑约定（frontmatter 触发规则、结构、验证边界，description 只写触发条件不写工作流总结）; expected evidence: Task 1、3 的编辑遵循技能约定且不破坏触发面; return facts: result / not-applicable / failure
Execution mode: sequential

## Global Constraints
- 保留校验脚本硬断言串：devflow-plan SKILL.md 保留 ## File Structure、Execution Trace、Remaining Structured Worklist、approved A/B Plan、spec-plan-methods.md、scope-drift facts return to devflow-core；devflow-build SKILL.md 保留 build-methods.md、return BUILD_BLOCKED with the facts to devflow-core、completed Build directly enters devflow-prove。
- 不改 scripts/devflow-plan.js 解析规则；Prewalk 的 Read-basis / Live anchors 字段保留（checker 必需），语义改为计划作者的证据簿记，不再是指示执行者重读的指令。
- 打包副本不手改：只运行 node dsh/plugins/dsh-devflow/scripts/sync-assets.js 刷新。
- 中文撰写；结构头与字段名保持英文；不新增文件、不新增依赖。
- 编辑用 exact replacement 逐段替换，不整篇重写。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| skills/devflow-plan/SKILL.md / ## Inputs And Output 与 ## Authoring Process 与 ## Required Plan Header 与 ## Boundaries | Modify | 执行规范前置声明与零 view 边界 | 计划生成端定义执行依据 | 执行阶段 dispatch 细节 |
| skills/devflow-plan/references/plan-methods.md / ## Delegated Execution 与 ### Fan-out 与 ### Single-subagent | Modify | 零 view 执行纪律与 DSH bounded dispatch | 执行交接规则所在地 | 计划头部结构 |
| skills/devflow-build/SKILL.md / ## Direct Execution 与 ## Execution Mode 与 ## Stop Protocol 与 ## Anti-Rationalization 与 ## Verification | Modify | 删除执行前复核，直接执行 | Build 是执行行为发生地 | 计划生成与校验 |
| dsh/plugins/dsh-devflow/assets/skills/devflow-plan/ 与 devflow-build/ 对应副本 | Modify | 与源逐字节一致的生成副本 | 打包分发一致性 | 手改资产内容 |

Task: devflow-plan 执行规范前置
Task type: Documentation-only
Files:
- Modify: skills/devflow-plan/SKILL.md | heading ## Authoring Process step 4 | 写明任务自带完整执行规范、执行者无需回读
- Modify: skills/devflow-plan/SKILL.md | heading ## Required Plan Header 之后一段 | 补充执行规范是唯一执行依据
- Modify: skills/devflow-plan/SKILL.md | heading ## Boundaries | 增加零 view 边界声明
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify skills/devflow-plan/SKILL.md using exact replacement: 在 Authoring Process 第 4 条末尾追加一条说明，任务自含 Files/精确改动/Steps/Verify 的完整执行规范，执行者无需回读计划文档或代码即可直接执行
- [ ] Modify skills/devflow-plan/SKILL.md using exact replacement: 在 Execution mode 说明段之后插入一段，写明每个任务的 Files、Change mechanics、Steps、Verify 组成唯一执行依据，dispatch 时只传这些字段，执行者不做执行前 view
- [ ] Modify skills/devflow-plan/SKILL.md using exact replacement: 在 ## Boundaries 段追加一条，计划生成只写执行规范，执行阶段的零 view 纪律归 devflow-build 与 plan-methods 所有，计划不得写执行期复核指令
Acceptance: devflow-plan 明确执行规范前置与零 view 边界；Global Constraints 列出的 devflow-plan 断言串全部保留
Verify: Run node -e "const s=require('fs').readFileSync('skills/devflow-plan/SKILL.md','utf8'); if(!s.includes('执行规范')||!s.includes('零 view')||!s.includes('## File Structure')) process.exit(1)" expect exit 0 且断言串保留
Comments: 不动 task contract 字段本身，只补声明与边界；按仓库惯例中英混排
Not doing: 改 task contract 字段；改 scripts/devflow-plan.js；动打包副本

Task: plan-methods 零 view 执行纪律
Task type: Documentation-only
Files:
- Modify: skills/devflow-plan/references/plan-methods.md | heading ## Delegated Execution | 重写为直接执行纪律
- Modify: skills/devflow-plan/references/plan-methods.md | heading ### Fan-out | 子代理按任务执行规范直接执行
- Modify: skills/devflow-plan/references/plan-methods.md | heading ### Single-subagent | 一任务一轮 bounded dispatch
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Replace the whole ## Delegated Execution section in skills/devflow-plan/references/plan-methods.md using exact replacement with the zero-view paragraph: 执行者不读最新 trace、不重读锚点、不 view 目标与代码，只按当前任务的 Files、Steps、Verify 直接执行并跑 Verify，返回实际证据或失败事实；Read-basis 与 Live anchors 保留为计划作者的证据簿记而非执行者重读指令
- [ ] Replace the ### Fan-out paragraph in skills/devflow-plan/references/plan-methods.md using exact replacement: 删除 read the latest trace 与 minimally re-read 表述，改为每个子代理只收到自己任务的执行规范并直接执行，并行判定规则不变
- [ ] Replace the ### Single-subagent paragraph in skills/devflow-plan/references/plan-methods.md using exact replacement: 主代理每次只派发一个任务的执行规范，子代理直接执行并回报证据，DSH 上一任务一轮，下一任务用 send_message 交接，超时或截断只重试该任务一次
Acceptance: plan-methods 不再出现 read the latest trace 或 minimally re-read 的执行指令；零 view 纪律与 DSH bounded dispatch 表述完整
Verify: Run node -e "const s=require('fs').readFileSync('skills/devflow-plan/references/plan-methods.md','utf8'); if(/read the latest trace|minimally re-read/.test(s)) process.exit(1)" expect exit 0 无残留重读指令
Comments: 保留 Trace Rules 与 Worklist Rules 小节不动（它们是计划作者写计划时的纪律，不是执行者动作）
Not doing: 删 Prewalk 结构；改 checker 对 Read-basis / Live anchors 的要求

Task: devflow-build 直接执行
Task type: Documentation-only
Files:
- Modify: skills/devflow-build/SKILL.md | heading ## Direct Execution | 直接执行段
- Modify: skills/devflow-build/SKILL.md | heading ## Execution Mode | 子代理按任务执行规范直接执行与 DSH bounded rounds
- Modify: skills/devflow-build/SKILL.md | heading ## Stop Protocol 与 ## Anti-Rationalization 与 ## Verification | 同步删除执行前复核措辞
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Replace the ## Direct Execution section in skills/devflow-build/SKILL.md using exact replacement with: 无编辑前计划或代码复核，执行者读当前任务的 Files、Change mechanics、Steps、Verify 后直接改，跑 Verify 并追加实际证据，实际改不动或验证失败时 return BUILD_BLOCKED with the facts to devflow-core；External Skills 加载规则原样保留；Depth C 把已批准设计契约当作执行规范，同样不做单独复核
- [ ] Replace the Single-subagent 与 Fan-out bullets 及结尾 scheduling-only 行 in skills/devflow-build/SKILL.md using exact replacement: 主代理只派发当前任务的执行规范而非整份计划，子代理直接改并回报证据或 BUILD_BLOCKED facts，DSH 一任务一轮加 send_message 交接，超时或截断重试该任务一次，结尾行删除 Plan Review 措辞
- [ ] Replace the ## Stop Protocol 第一条、## Anti-Rationalization 的 Plan Review comes first 行、## Verification 第一条 in skills/devflow-build/SKILL.md using exact replacement: 改为执行规范直接适用、实际编辑或验证失败才返回 BUILD_BLOCKED facts
Acceptance: devflow-build 不再包含 Before editing, reconcile；新增 Direct Execution 段；Global Constraints 列出的 devflow-build 断言串全部保留
Verify: Run node -e "const s=require('fs').readFileSync('skills/devflow-build/SKILL.md','utf8'); if(!s.includes('Direct Execution')||s.includes('Before editing, reconcile')||!s.includes('return `BUILD_BLOCKED` with the facts to `devflow-core`')) process.exit(1)" expect exit 0 且断言串保留
Comments: build-methods.md 的加载位置与内容不动；External Skills 加载不是执行前 view，必须保留
Not doing: 改 build-methods.md；改 Implementation Slices 与自检清单

Task: 打包同步与全量校验
Task type: Documentation-only
Files:
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-plan/SKILL.md | generated copy | 与源逐字节一致
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-plan/references/plan-methods.md | generated copy | 与源逐字节一致
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-build/SKILL.md | generated copy | 与源逐字节一致
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Run node dsh/plugins/dsh-devflow/scripts/sync-assets.js expect 打包副本刷新为与源逐字节一致且无报错
- [ ] Run npm run trigger:verify expect Judgment: PASS 含打包一致性断言
- [ ] Run npm test expect DevFlow validation passed
- [ ] Run node scripts/devflow-plan.js docs/plans/2026-08-23-plan-zero-view-execution.md expect Judgment: PASS
- [ ] Run node scripts/devflow-plan.js docs/plans/2026-08-21-loop-engineering-preset.md expect Judgment: PASS 现有计划仍通过
Acceptance: trigger:verify 与 npm test 全绿；本计划与现有计划均通过 plan checker；打包副本无 drift
Verify: Run npm run trigger:verify 与 npm test expect 两者均 PASS
Comments: 打包副本是生成物，只由 sync-assets.js 刷新，不手改
Not doing: 改校验脚本断言；跑 verify:all 之外的演示
