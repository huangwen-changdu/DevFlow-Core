# DevFlow 可用性重构实施计划（轻仪式 + 可续跑施工单 + 自动沉淀）

Status: done
Goal: 让 DevFlow 默认好用——B 深度计划从约 300 行降到 60 行并可续跑，Cut 留下可见减法，Build 恢复有界实现决策权，完成即自动更新功能条目与计划索引，且 `npm run verify:all` 全绿。
Architecture: 纯声明式契约收敛加既有 Node 校验器扩展。计划 v2 只保留排序与验收字段，Prewalk 三件套删除；Cut 增加四行决策与 `Rejected`；Build 恢复有界读并回写 `## Progress`；Prove 在 PASS 时写 `Status: done` 与 `Landed:`；`devflow-learn` 在收尾时维护 `docs/features/INDEX.md`；索引一致性由既有 `scripts/devflow-plan.js` 的 `--index` 模式校验，不新增脚本、目录或依赖。
Tech Stack: Markdown 技能契约、Node.js 标准库校验器、现有 npm 验证矩阵、现有 plugin 与 DSH asset mirror
Source: docs/specs/2026-09-10-devflow-usability-flow-reconfiguration.md
Spec coverage: R1 与 R2 映射 Task 1；R2 与 R8 映射 Task 2；R4 映射 Task 3；R5 映射 Task 4；R3、R6、R7 映射 Task 5；R6 与 R7 映射 Task 6；R8、R9、R10 映射 Task 7。
Cut Decision: CUT_PASS（ultra）——做：Plan v2 契约、Cut 四行与 `Rejected`、Build 有界 how 与回写、Prove 回写、Learn 功能条目、双索引与 `--index` 机检、断言同步。不做：迁移 26 份旧计划与 18 份旧 spec、改 A/B/C 语义、新增目录或依赖、Web 看板、向量检索、宿主适配器 Sense 同步。复用：既有 `scripts/devflow-plan.js` 的 `--json` 与 `--self-test` 基础设施、既有 Status 机制、`docs/loop/INDEX.md` 索引模式、`sync-assets.js` 打包链路、`devflow-learn` 收尾复盘。验证：`node scripts/devflow-plan.js --self-test`、`npm run index:verify`、`npm run verify:all`、`npm run route:verify`、轻路径演练与索引反向验证。Rejected: 新增独立 `scripts/devflow-index.js`——复用 `scripts/devflow-plan.js` 的 `--index` 模式，少一个分发文件、两处安装器清单、一个 sync-assets 条目与一套重复自测框架；也 Rejected 了把两个 INDEX 改为脚本生成（既有 checker 只读不写，写文件会破坏该约定）。
External Skills: writing-skills; role: 校验 SKILL.md 编辑约定（frontmatter 触发面、结构、验证边界）; expected evidence: Task 1、3、4、5 的技能文本改动遵循技能约定且不破坏触发面; return facts: result / not-applicable / failure
Execution mode: sequential
Landed: 2026-09-10 · npm run verify:all 退出码 0 + node scripts/devflow-plan.js --index PASS + 六个用户级 home --check 通过

## Global Constraints
- 保留 `scripts/validate-devflow.js` 与 `scripts/validate-skill-triggers.js` 依赖的稳定标识：`maximumWorklistItems` 常量保留供 legacy 路径使用。
- 不改 A/B/C 深度语义，`scripts/validate-route-consistency.js` 与 9 个宿主入口面不动。
- 打包副本不手改：只运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 刷新。
- 旧计划与旧 spec 不改写；checker 通过 legacy 分支继续校验旧格式。
- 中文撰写，结构头与字段名保持英文；不新增目录、依赖或脚本文件。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| skills/devflow-plan/SKILL.md | Modify | v2 计划头部与 6 字段任务契约 | 计划生成 owner | 执行期行为 |
| skills/devflow-plan/references/plan-methods.md | Modify | 执行交接与回写纪律 | 计划 owner 引用 | 计划头部字段 |
| skills/devflow-cut/SKILL.md | Modify | 四行 Cut 输出与 `Rejected` 必填 | Cut owner | 计划校验 |
| skills/devflow-build/SKILL.md | Modify | 有界 how 与进度回写 | Build owner | 计划生成 |
| skills/devflow-prove/SKILL.md | Modify | PASS 写 `Status` 与 `Landed` | 完成闸门 owner | 索引内容 |
| skills/devflow-prove/references/flow-self-test.md | Modify | 场景证据更新 | 自测场景 | 运行时 checker |
| skills/devflow-learn/SKILL.md | Modify | 功能条目 delta 与边界表 | 学习 owner | 业务知识包 |
| skills/devflow-core/SKILL.md | Modify | Sense 第一跳 | 路由 owner | 索引内容 |
| skills/devflow-core/references/core-methods.md | Modify | 加载地图第一跳 | Core 引用 | 技能契约细节 |
| AGENTS.md | Modify | Sense 步骤声明 | 便携启动入口 | 方法细节 |
| commands/devflow.toml | Modify | 命令入口第一跳说明 | 命令入口 | 技能内部规则 |
| scripts/devflow-plan.js | Modify | v2 校验、legacy 分派、`--index` 模式 | 既有计划 checker 与分发链路 | 索引内容生成 |
| scripts/validate-devflow.js | Modify | 新契约与索引断言 | 维护者校验器 | 运行时 checker 行为 |
| scripts/validate-skill-triggers.js | Modify | 计划触发场景证据 | 触发链校验器 | 路由边校验 |
| package.json | Modify | `index:verify` 与 `verify:all` | 仓库脚本入口 | 技能契约 |
| docs/plans/INDEX.md | Create | 计划索引 | 用户选定落点 | 计划正文 |
| docs/features/INDEX.md | Create | 功能索引 | 用户选定落点 | 台账历史 |
| docs/features/README.md | Modify | 索引入口指引 | 台账目录说明 | 台账正文 |
| docs/features/devflow-core.md | Modify | 能力台账记录 | 能力历史 | 运行时规则 |
| docs/iteration-plan.md | Modify | 迭代记录 | 长期计划活文档 | 方法细节 |
| README.md | Modify | checker 与流程说明 | 用户文档 | 运行时契约 |

Task: Plan 技能切换 v2 契约
Task type: Documentation-only
Files:
- Modify: skills/devflow-plan/SKILL.md | heading ## Required Plan Header | v2 头部字段
- Modify: skills/devflow-plan/SKILL.md | heading ## Required Task Contract | 6 字段任务契约与 `## Progress`
- Modify: skills/devflow-plan/SKILL.md | heading ## Authoring Process | 删除 Prewalk 生成步骤
- Modify: skills/devflow-plan/SKILL.md | heading ## Boundaries | v2 与 legacy 兼容声明
- Modify: skills/devflow-plan/references/plan-methods.md | heading ## Delegated Execution | 改为 Build 有界执行
- Modify: skills/devflow-plan/references/plan-methods.md | heading ## Plan Contract | 同步 v2
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-plan/SKILL.md` using exact replacement: 把 `## Required Plan Header` 的字段块替换为 v2 头部，保留 `Status`、`Goal`、`Not doing`、`Cut`、可选 `Source`、可选 `Execution mode`、完成后 `Landed`，删除 `Architecture`、`Tech Stack`、`Spec coverage`、`Global Constraints`
- [ ] Modify `skills/devflow-plan/SKILL.md` using exact replacement: 把 `## Required Task Contract` 替换为每任务 5 行 `Task`、`Files`、`Change`、`Acceptance`、`Verify` 加 `## Progress` 表，并写明旧格式计划继续由 checker 的 legacy 分支校验
- [ ] Modify `skills/devflow-plan/references/plan-methods.md` using exact replacement: 把 `## Delegated Execution` 的零 view 段落替换为 Build 有界执行与回写协议，删除 read the latest trace 与 minimally re-read 表述
- [ ] Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-plan/SKILL.md','utf8'); if(!s.includes('## Progress')||!s.includes('Rejected')||s.includes('Prewalk')) process.exit(1)"` expect exit 0
Acceptance: 计划技能声明 v2 契约（5 行任务加 Progress 表加 Cut 四行加 Landed），不再要求 `Prewalk`、`File Structure`、`Architecture`；legacy 兼容声明存在。
Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-plan/SKILL.md','utf8'); if(!s.includes('## Progress')||s.includes('Prewalk')) process.exit(1)"` expect exit 0。
Comments: 在契约段写一句 WHY，说明 Plan 只保留排序与验收、改法归 Build。
Not doing: 不改 checker、不改打包副本、不动 A/B 深度语义

Task: 计划 checker 增加 v2 校验与 `--index` 模式
Task type: Code change
Files:
- Modify: scripts/devflow-plan.js | symbol: `requiredTaskFields` | v2 任务字段集与 legacy 字段集分离
- Modify: scripts/devflow-plan.js | symbol: `checkTask` | v2 任务校验分支
- Modify: scripts/devflow-plan.js | symbol: `checkPlan` | v2 与 legacy 分派
- Modify: scripts/devflow-plan.js | symbol: `usage` | `--index` 用法说明
- Modify: scripts/devflow-plan.js | symbol: `readInput` | `--index` 入口分支
- Modify: scripts/devflow-plan.js | symbol: `report` | 索引结果输出
- Modify: scripts/devflow-plan.js | symbol: `selfTest` | v2、legacy、索引不一致负例
- Test: scripts/devflow-plan.js | symbol: `selfTest` | v2 通过、legacy 通过、索引不一致非零退出
Interfaces:
- Consumes: 计划文件文本、`docs/plans/INDEX.md` 与 `docs/features/INDEX.md` 文本
- Produces: 退出码、`--json` 摘要字段（status、judgment、tasks、index、legacy）
Current behavior: `checkPlan` 只识别 v1 契约；`checkPrewalk` 对所有 Code change 任务强制三件套；脚本无索引一致性模式。
Target behavior: 计划含 `## Progress` 且不含 `Prewalk` 时走 v2 校验（5 字段任务、`Rejected` 必填、Progress 行数与任务数一致、`done` 行必须有证据）；否则走 legacy 校验并保留 `maximumWorklistItems`；`--index` 校验两个 INDEX 与文件系统一致并支持 `--json`。
Change mechanics: pseudocode
```text
detectV2(body) = body.includes("## Progress") && !body.includes("Prewalk")
if args.includes("--index"): run checkIndexes(repoRoot) and exit 1 on any mismatch
checkPlan(body): if detectV2(body) then checkPlanV2(body) else checkPlanLegacy(body)
checkPlanV2: requiredGlobalFields = [Status, Goal, Not doing, Cut]; requiredTaskFields = [Task, Files, Change, Acceptance, Verify]
checkIndexes: for each plan file require exactly one INDEX row; row Status equals file Status; done row requires non-empty evidence; feature row files and source plan must exist
```
Call impact: `devflow-build` 在 Build 前调用的 checker 对新旧两种格式都返回 PASS；`npm run verify:all` 新增 `index:verify`；`selfTest` 增加三种负例。
Steps:
- [ ] Modify `scripts/devflow-plan.js` using exact replacement: 在 `requiredTaskFields` 之后新增 `v2GlobalFields` 与 `v2TaskFields` 常量，保留 legacy 常量与 `maximumWorklistItems`
- [ ] Modify `scripts/devflow-plan.js` using exact replacement: 在 `checkPlan` 顶部加 `detectV2` 分派，v2 分支校验 `Rejected` 非空、`## Progress` 行数与任务数一致、`done` 行必须有证据
- [ ] Modify `scripts/devflow-plan.js` using exact replacement: 新增 `checkIndexes(root)` 函数并在 `readInput` 中接 `--index` 分支，索引不一致时返回退出码 1
- [ ] Modify `scripts/devflow-plan.js` using exact replacement: 在 `selfTest` 中新增 v2 通过、legacy 通过、索引漏行三种断言
- [ ] Verify: run `node scripts/devflow-plan.js --self-test` expect exit 0，run `node scripts/devflow-plan.js docs/plans/2026-09-04-model-context-tightening.md` expect Judgment PASS 走 legacy 分支
Acceptance: v2 计划通过校验；旧格式计划仍通过；索引漏行、状态不符、`done` 无证据三种不一致均非零退出。
Verify: run `node scripts/devflow-plan.js --self-test` expect exit 0，再 run `npm run index:verify` expect 与当前索引一致时退出码 0。
Comments: 在 `detectV2` 与 `checkIndexes` 上方注释说明判定条件、四种失败模式与退出码，因为它们是外部契约。
Not doing: 不改 `checkPrewalk` 的 legacy 语义、不写索引文件、不改计划落地路径校验

Prewalk:

Execution Trace:
- Read: `scripts/devflow-plan.js` → `requiredTaskFields`、`codeChangeFields`、`checkTask`、`checkPlan`、`readInput`、`report`、`selfTest` 构成现行 v1 校验面，`maximumWorklistItems` 被触发校验器断言。
- Traced: `scripts/validate-skill-triggers.js` → 第 190 至 196 行断言该技能文件的 `## File Structure`、`Execution Trace`、`Remaining Structured Worklist` 与 checker 的 `maximumWorklistItems`。
- Traced: `scripts/install-devflow.js` 与 `scripts/install-devflow-user.js` → 脚本以显式清单分发，新增脚本会多出分发与安装器改动，故改用 `--index` 模式。
- Ran: `node scripts/devflow-spec.js docs/specs/2026-09-10-devflow-usability-flow-reconfiguration.md` → Judgment PASS，设计契约已批准。
- Ran: `npm test` → 通过，18 runtime files 与 22 learning cards 校验正常。
- Edited: none → no file edited yet.
- Verified: none → no verification run yet.

Current Handoff Facts:
- Target anchors: `scripts/devflow-plan.js` 的 `requiredTaskFields`、`checkTask`、`checkPlan`、`readInput`、`report`、`selfTest`。
- Nearby convention: 同文件既有 `--json`、`--self-test` 与 `Status` legacy 兼容写法可复用，无需新依赖。
- Direct path: `devflow-build` 在 Build 前调用该 checker；`package.json` 的 `verify:all` 串联全部校验器。
- Current constraints: `maximumWorklistItems` 必须保留；checker 只读不写；退出码 1 表示失败。
- Planned touch set: `scripts/devflow-plan.js`、`package.json`、`scripts/validate-skill-triggers.js`、`scripts/validate-devflow.js`。
- Risks / stop conditions: v2 判定条件若与旧计划文本冲突，会把旧计划误判为 v2；出现该情况按 `BUILD_BLOCKED` 回报事实。
- Read-basis: `scripts/devflow-plan.js`、`scripts/validate-skill-triggers.js`、`scripts/install-devflow.js`、`scripts/install-devflow-user.js` 已读。
- Live anchors: `checkPlan`、`checkIndexes` 新增函数的实际位置需在编辑时确认。

Remaining Structured Worklist:
- [ ] 在 `scripts/devflow-plan.js` 输出 v2 校验与 `--index` 模式并补自测
  Anchors: `requiredTaskFields`、`checkPlan`、`readInput`、`report`、`selfTest`
  Verify: `node scripts/devflow-plan.js --self-test`
  Done when: 自测覆盖 v2 通过、legacy 通过、索引不一致非零退出三种情况

Task: Cut 输出四行决策与 `Rejected`
Task type: Documentation-only
Files:
- Modify: skills/devflow-cut/SKILL.md | heading ## Cut Result | 四行输出与 `Rejected` 必填
- Modify: skills/devflow-cut/SKILL.md | heading ## Handoff | 计划头与 Build Contract 落点
- Modify: skills/devflow-cut/references/cut-methods.md | heading ## Method 8: Anti-Overengineering Gate | 记录被砍候选
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-cut/SKILL.md` using exact replacement: 把 `## Cut Result` 的四种结果块补充为固定四行 `做`、`不做`、`复用`、`验证` 加必填 `Rejected`，写明 `none` 必须附证据
- [ ] Modify `skills/devflow-cut/SKILL.md` using exact replacement: 在 `## Handoff` 写明四行决策在有计划文件时写入计划头、无计划文件时进入 Build Contract 消息
- [ ] Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-cut/SKILL.md','utf8'); if(!s.includes('Rejected')) process.exit(1)"` expect exit 0
Acceptance: Cut 输出固定四行加必填 `Rejected`，并写明两种落点。
Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-cut/SKILL.md','utf8'); if(!s.includes('Rejected')) process.exit(1)"` expect exit 0。
Comments: 在 `Rejected` 段写一句 WHY，说明没有减法记录时 Cut 退化为盖章。
Not doing: 不改 Cut 的四种结果状态名、不改风险门条件、不动 `CUT_REDUCE` 用户确认门

Task: Build 恢复有界 how 与进度回写
Task type: Documentation-only
Files:
- Modify: skills/devflow-build/SKILL.md | heading ## Direct Execution | 有界读与最小改法决策
- Modify: skills/devflow-build/SKILL.md | heading ## Plan Pack | 进度回写协议
- Modify: skills/devflow-build/SKILL.md | heading ## Anti-Rationalization | 更新零 view 相关条目
- Modify: skills/devflow-build/references/build-methods.md | heading ## Method | 回写与有界读纪律
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-build/SKILL.md` using exact replacement: 把 `## Direct Execution` 中禁止 Build 决定实现机制的段落替换为有界读与最小改法决策，保留不扩范围、不做全仓重新发现、不静默改计划
- [ ] Modify `skills/devflow-build/SKILL.md` using exact replacement: 在 `## Plan Pack` 增加回写协议，每任务完成把 `## Progress` 行改为 `doing` 或 `done` 并填证据
- [ ] Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-build/SKILL.md','utf8'); if(!s.includes('## Progress')||!s.includes('bounded')) process.exit(1)"` expect exit 0
Acceptance: Build 可读当前任务锚点与直接邻居并自行决定最小改法；完成一个任务后回写 Progress 行状态与证据。
Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-build/SKILL.md','utf8'); if(!s.includes('## Progress')) process.exit(1)"` expect exit 0。
Comments: 写一句 WHY，说明零 view 把实现决策压给 Plan 是计划臃肿的根因之一。
Not doing: 不改 Build Contract 的 Goal 与 Not doing 字段、不动 Stop Protocol 的 `BUILD_BLOCKED` 回报

Task: Prove 回写与 Learn 功能条目，Core 与 AGENTS 第一跳
Task type: Documentation-only
Files:
- Modify: skills/devflow-prove/SKILL.md | heading ## Completion | PASS 写 `Status` 与 `Landed`
- Modify: skills/devflow-prove/references/flow-self-test.md | heading ## Scenario 5C | 证据来源更新
- Modify: skills/devflow-learn/SKILL.md | heading ## Completion Review | 功能条目 delta
- Modify: skills/devflow-learn/SKILL.md | heading ## Knowledge Boundaries | 增加 `docs/features/` 归属行
- Modify: skills/devflow-core/SKILL.md | heading ## Context Map | Sense 第一跳
- Modify: skills/devflow-core/references/core-methods.md | heading ## Method 0 | 加载地图第一跳
- Modify: AGENTS.md | heading ## Start | Sense 第一跳步骤
- Modify: commands/devflow.toml | key description | 命令入口第一跳说明
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify `skills/devflow-prove/SKILL.md` using exact replacement: 在完成段增加 PASS 且存在计划文件时写 `Status: done` 与 `Landed: 日期 · 证据`，FAIL 或 BLOCKED 不改 `Status`
- [ ] Modify `skills/devflow-prove/references/flow-self-test.md` using exact replacement: 把 Scenario 5C 与接力场景中的 `File Structure` 与 `Prewalk` 证据替换为 v2 契约证据
- [ ] Modify `skills/devflow-learn/SKILL.md` using exact replacement: 在收尾复盘增加功能条目 delta 判定，并在边界表增加 `docs/features/` 行
- [ ] Modify `AGENTS.md` using exact replacement: 在 Sense 步骤增加先读 `docs/features/INDEX.md` 与 `docs/plans/INDEX.md`，缺失不阻塞
- [ ] Verify: run `node -e "const s=require('fs').readFileSync('AGENTS.md','utf8'); if(!s.includes('docs/features/INDEX.md')) process.exit(1)"` expect exit 0
Acceptance: Prove 在 PASS 时回写计划状态与落地证据；Learn 在能力或接口变更时更新功能条目；Sense 第一跳读取两个索引且缺失不阻塞。
Verify: run `node -e "const s=require('fs').readFileSync('skills/devflow-learn/SKILL.md','utf8'); if(!s.includes('docs/features/INDEX.md')) process.exit(1)"` expect exit 0。
Comments: 在 Prove 回写段写一句 WHY，说明完成证据归 Prove 持有，故由它写 `Landed`。
Not doing: 不改 Prove 闸门判定标准、不改 Learn 学习卡格式、不改业务知识包维护边界

Task: 建立双索引与文档记录
Task type: Documentation-only
Files:
- Create: docs/plans/INDEX.md | new file | 计划索引
- Create: docs/features/INDEX.md | new file | 功能索引
- Modify: docs/features/README.md | heading | 索引入口指引
- Modify: docs/features/devflow-core.md | heading ## Version History | 本次能力记录
- Modify: docs/iteration-plan.md | heading ## 已落地清单 | 本次迭代记录
- Modify: README.md | heading ## Verification | checker 与索引说明
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Create `docs/plans/INDEX.md` using exact replacement: 写入 `> 摘要:` 行与表格头，列为日期、计划、Status、来源、落地证据、功能条目，并把 26 份既有计划标为 legacy
- [ ] Create `docs/features/INDEX.md` using exact replacement: 写入 `> 摘要:` 行与表格头，列为功能、一句话、入口、Status、验证、关键文件、来源计划、更新日，先登记 DevFlow 运行时、验证矩阵、循环工程、DSH 预设与插件五条能力
- [ ] Modify `README.md` using exact replacement: 在验证章节补充 `node scripts/devflow-plan.js --index` 与 `npm run index:verify` 的用途
- [ ] Verify: run `npm run index:verify` expect exit 0
Acceptance: 两个索引存在且与文件系统一致；既有计划标为 legacy；功能索引登记至少 5 条能力。
Verify: run `npm run index:verify` expect exit 0。
Comments: 索引首行沿用 `docs/loop/INDEX.md` 的 `> 摘要:` 惯例，说明用途、维护触发与机检命令。
Not doing: 不迁移旧计划正文、不写台账版本历史细节、不新增目录

Task: 断言同步与打包刷新
Task type: Code change
Files:
- Modify: scripts/validate-devflow.js | symbol: `assert` | 计划契约与索引断言
- Modify: scripts/validate-skill-triggers.js | symbol: `scenarios` | 计划触发证据更新
- Modify: package.json | symbol: `scripts` | `index:verify` 与 `verify:all`
Interfaces:
- Consumes: 技能文本、索引文件、checker 退出码
- Produces: `npm test` 与 `npm run verify:all` 的通过或失败退出码
Current behavior: `validate-skill-triggers.js` 第 190 至 196 行断言计划技能含 `## File Structure`、`Execution Trace`、`Remaining Structured Worklist` 与 checker 含 `maximumWorklistItems`；`package.json` 无 `index:verify`。
Target behavior: 计划触发场景断言改为 v2 证据（`## Progress`、`Rejected`、`--index`）并保留 `maximumWorklistItems`；`package.json` 增加 `index:verify` 并接入 `verify:all`。
Change mechanics: pseudocode
```text
scenarios[plan-owned handoff]: evidence = [SKILL.md "## Progress", SKILL.md "Rejected", SKILL.md "spec-plan-methods.md", plan.js "maximumWorklistItems", plan.js "--index"]
package.json scripts: "index:verify": "node scripts/devflow-plan.js --index", verify:all += " && npm run index:verify"
validate-devflow.js: assert plan skill contains "## Progress" and "Rejected"; assert both INDEX files exist
```
Call impact: `npm test` 与 `npm run verify:all` 依赖这些断言；`index:verify` 成为 verify:all 的新成员。
Steps:
- [ ] Modify `scripts/validate-skill-triggers.js` using exact replacement: 把计划触发场景的 `## File Structure`、`Execution Trace`、`Remaining Structured Worklist` 三条证据替换为 `## Progress`、`Rejected`、`--index`，保留 `maximumWorklistItems`
- [ ] Modify `scripts/validate-devflow.js` using exact replacement: 新增计划 v2 契约断言与两个 INDEX 存在性断言
- [ ] Modify `package.json` using exact replacement: 增加 `"index:verify": "node scripts/devflow-plan.js --index"` 并把 `npm run index:verify` 追加到 `verify:all`
- [ ] Modify `dsh/plugins/dsh-devflow/scripts/sync-assets.js` using exact replacement: 无新增脚本，确认 `checkerScripts` 不变后运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 刷新打包副本
- [ ] Verify: run `npm run verify:all` expect 全绿，run `npm run route:verify` expect 通过
Acceptance: `npm run verify:all` 全绿；`npm run index:verify` 接入验证矩阵；打包副本与源一致。
Verify: run `npm run verify:all` expect exit 0，run `npm run route:verify` expect PASS。
Comments: 在 `sync-assets.js` 改动处注释说明复制组来源与用途；若确认无改动则记录 no-change。
Not doing: 不改路由边断言、不改安装器清单、不新增脚本文件

Prewalk:

Execution Trace:
- Read: `scripts/validate-skill-triggers.js` → plan 触发场景证据包含 `## File Structure`、`Execution Trace`、`Remaining Structured Worklist` 与 `maximumWorklistItems`。
- Read: `scripts/validate-devflow.js` → 第 173 与 174 行断言 Cut 与 Plan 的成功边措辞，本次不改这些措辞。
- Read: `package.json` → `verify:all` 串联 17 项校验，`index:verify` 尚未存在。
- Traced: `dsh/plugins/dsh-devflow/scripts/sync-assets.js` → `checkerScripts` 显式列出分发的 checker 文件，本次不新增脚本故无需新增条目。
- Ran: `npm test` → 通过，可作为断言同步后的对照基线。
- Ran: `node scripts/devflow-plan.js docs/plans/2026-09-04-model-context-tightening.md` → Judgment FAIL，该历史文件本身缺 v1 必填字段，证明 legacy 分支必须宽容且不阻断历史文件。
- Edited: none → no file edited yet.
- Verified: none → no verification run yet.

Current Handoff Facts:
- Target anchors: `scripts/validate-skill-triggers.js` 的 `scenarios`、`scripts/validate-devflow.js` 的 `assert`、`package.json` 的 `scripts`。
- Nearby convention: `verify:all` 以 `&&` 串联脚本，新脚本沿用同一写法。
- Direct path: `npm test` 调用 `validate-devflow.js`；`verify:all` 调用全部校验器；`sync-assets.js` 生成 DSH 打包副本。
- Current constraints: `maximumWorklistItems` 断言必须保留；路由边断言不得改动；安装器清单本次不动。
- Planned touch set: `scripts/validate-skill-triggers.js`、`scripts/validate-devflow.js`、`package.json`、`dsh/plugins/dsh-devflow/assets/`。
- Risks / stop conditions: 打包副本若与源不一致，`assertPackagedAssetParity` 会失败；出现该情况按 `BUILD_BLOCKED` 回报事实。
- Read-basis: `scripts/validate-skill-triggers.js`、`scripts/validate-devflow.js`、`package.json`、`dsh/plugins/dsh-devflow/scripts/sync-assets.js` 已读。
- Live anchors: `assert` 新增断言的实际插入点与 `verify:all` 字符串位置需在编辑时确认。

Remaining Structured Worklist:
- [ ] 在 `scripts/validate-skill-triggers.js`、`scripts/validate-devflow.js` 与 `package.json` 输出 v2 断言与 `index:verify` 脚本
  Anchors: `scenarios`、`assert`、`scripts`
  Verify: `npm run verify:all`
  Done when: `verify:all` 全绿且 `route:verify` 通过
- [ ] 运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 刷新打包副本并验证一致性
  Anchors: `checkerScripts`
  Verify: `npm test`
  Done when: 打包资产与源逐字节一致且校验通过

## Execution Evidence

Legacy v1 plan: evidence is recorded here instead of a `## Progress` table.

- T1 Plan 技能 v2 契约：`skills/devflow-plan/SKILL.md` 含 `## Progress`、`Rejected`、`Six fields per task`、`Landed:`；`plan-methods.md` 重写为 Touch Set / Task Rows / Progress Table / Execution Handoff。证据：`node -e` 断言与 `npm test` 通过。
- T2 checker v2 + `--index`：`node scripts/devflow-plan.js --self-test` 通过（v2 通过、legacy 通过、Rejected 缺失失败、done 无证据失败、Progress 行数不匹配失败）；5 任务 v2 样例 59 行 PASS；`--index` 初始报出 `done plan needs landing evidence`，补齐后 PASS。**无回归证据**：用 `git show HEAD:scripts/devflow-plan.js` 取原脚本，对 27 份计划逐份比较退出码，差异 0（11 PASS / 16 历史 FAIL 在改动前后一致）。
- T3 Cut 四行 + `Rejected`：`skills/devflow-cut/SKILL.md` 增加四行决策与必填 `Rejected`，`cut-methods.md` Method 8 增加 `Rejected` 记录项。
- T4 Build 有界 how + 回写：`skills/devflow-build/SKILL.md` 改为有界读与最小改法决策，`## Plan Pack` 增加 Progress 回写协议；`build-methods.md` Method 12 同步。
- T5 Prove 回写 + Learn 功能条目 + Core/AGENTS 第一跳：`devflow-prove` 增加 PASS 回写、`flow-self-test.md` 场景证据更新；`devflow-learn` 增加功能条目 delta 与边界表行；`AGENTS.md`、`devflow-core`、`core-methods.md`、`commands/devflow.toml` 增加双索引第一跳。
- T6 双索引与文档：`docs/plans/INDEX.md`（27 行）、`docs/features/INDEX.md`（8 行）、`docs/features/README.md`、`docs/features/devflow-core.md`（v53）、`docs/iteration-plan.md`、`README.md` 已更新；`node scripts/devflow-plan.js --index` PASS。
- T7 断言与打包：`validate-skill-triggers.js` 计划场景证据改为 v2；`validate-devflow.js` 增加 v2/索引断言；`package.json` 增加 `index:verify` 并接入 `verify:all`；`sync-assets.js` 刷新 DSH 资产；`plugins/devflow` Codex 镜像同步。证据：`npm run verify:all` 退出码 0、`npm run route:verify` 通过、`node plugins/devflow/scripts/verify-plugin.js` 通过。
