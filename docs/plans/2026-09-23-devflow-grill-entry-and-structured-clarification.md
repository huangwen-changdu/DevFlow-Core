# DevFlow Grill 直达入口与结构化澄清

Status: done
Goal: 让用户像用 grill-me 一样直呼 "grill me / 拷问我 / 压力测试" 或运行 `/devflow-grill` 直达 `devflow-brainstorm` 澄清，并在支持结构化提问的宿主上以一次一问、带具体选项的弹窗完成澄清，同时保留全部纪律门。
Not doing: SKILL 瘦身或把纪律移入 references；模式命名；独立 grill 技能；宿主 prompt 改动；quick-cmds 按钮；diagram 更新；新校验脚本。
Cut: 做 直呼入口 + 全问题结构化 + 节奏规则 + 激活面描述 + 声明面与镜像同步 | 不做 SKILL 瘦身、模式命名、独立新技能、宿主 prompt、quick-cmds、diagram | 复用 adversarial/find-fault 直达先例 + 既有结构化提问工具与校验器 | 验证 verify:all + 新 trigger 场景 + capability 合同 + 1H 行为走查 + 三镜像逐字节 + 六 home --check + budget | Rejected: ①SKILL 瘦身（卡片：可选格式=行为删除）②模式命名（用户排除）③独立 grill 技能（重复路由）④.claude 命令桥（无先例）⑤宿主 prompt 改动（通用路由已覆盖）⑥quick-cmds 按钮（可选且触发额外发布）⑦diagram 更新（无门禁需求）⑧新校验脚本（复用现有）
Source: Brainstorm Confirmed request（2026-09-23 会话，Depth B）+ 本计划随附 Cut Decision
Execution mode: sequential
Landed: 2026-09-23 · npm run verify:all exit=0；trigger:verify 20 场景 + parity PASS；六 home --check 6/6；Scenario 1H 实走走查完成

## Recon

- `npm test` → DevFlow validation passed / Checked 18 runtime files, 28 learning cards, and selected host and trigger contracts（改动前基线全绿）
- `node scripts/devflow-plan.js --index` → Problems: none / Judgment: PASS
- `node scripts/devflow-budget.js` → 14022 skills/devflow-brainstorm/SKILL.md / Total skills bytes: 164572 (limit 280000) / Judgment: PASS（brainstorm 余 1338 字节）
- `(Get-Item AGENTS.md).Length` → 8147（8 KiB 预算余 45 字节，加法必须先精确替换）
- `(Get-ChildItem commands\*.toml).Count` → 11
- `git status --short` → M AGENTS.md、M plugins/devflow/README.md（用户既有改动，保留）；未跟踪 .graphify_* / .codegraph / .opencode / opencode.json（保留不动）
- `node -e "for(const f of ['package.json','plugin.json','gemini-extension.json','plugins/devflow/.codex-plugin/plugin.json','dsh/plugins/dsh-devflow/package.json'])console.log(f,JSON.parse(require('fs').readFileSync(f,'utf8')).version)"` → package.json 0.6.0 / plugin.json 0.6.0 / gemini-extension.json 0.4.0 / plugins/devflow/.codex-plugin/plugin.json 0.4.0 / dsh/plugins/dsh-devflow/package.json 0.10.0
- `Select-String -Path scripts\validate-skill-triggers.js -Pattern assertPackagedAssetParity` → 命中（T1 后、DSH 同步前 npm test 会失败；完整矩阵放 T4/T5）
- `Test-Path plugins\devflow\scripts\verify-plugin.js` → True（Codex 无同步脚本，T4 手工镜像 5 文件；DSH 用 sync-assets.js）

## Tasks

Task: 直达入口声明与命令
Files:
- Create: commands/devflow-grill.toml | new file | 直达拷问命令，加载 devflow-brainstorm 并声明全部门不降
- Modify: commands/devflow.toml | `or any completion state.` | 其后补显式 grill 直达句
- Modify: AGENTS.md | `creative work with ambiguity or material risk` | Signal 单元追加显式 grill/stress-test 信号
- Modify: skills/devflow-core/SKILL.md | `Capability Dispatch` | 列表末尾补显式 grill 直达条目
- Modify: skills/devflow-core/references/core-methods.md | `Method 2` | 首句替换补显式 grill 接收语义
Change: 替换与追加内容如下。AGENTS.md 精确替换 `creative work with ambiguity or material risk: new behavior` 为 `creative work with ambiguity, material risk, or explicit grill/stress-test request: new behavior`（+34 字节，不得再动其它字符）。core-methods.md 精确替换 `Evaluate this order: explicit independent review -> investigation/pure inquiry -> approved scope -> risk gate -> route owner. Keywords are signals, not decisions.` 为 `Evaluate this order: explicit independent review or explicit grill/stress-test request -> investigation/pure inquiry -> approved scope -> risk gate -> route owner. An explicit grill/stress-test request counts as user-selected Brainstorm clarification and still runs every clarification duty. Keywords are signals, not decisions.` core SKILL.md 追加 bullet：`- Explicit grill/stress-test request: select \`devflow-brainstorm\` directly; the explicit request is user intent, not keyword-only routing. The Semantic Echo-Back, the fixed Confirmed request, and the user-selected A/B/C gate all still apply.` commands/devflow.toml 在 `or any completion state.` 段后追加一段：`If the user explicitly asks to be grilled, stress-tested, says 拷问我, or says 压力测试 about a request or plan, load \`skills/devflow-brainstorm/SKILL.md\` directly and start clarification. The explicit request does not skip the Semantic Echo-Back, the fixed Confirmed request, or the user's A/B/C choice.` 新命令全文：description 为 `Grill the user's request or plan with one-question-at-a-time stress testing before committing to a design.`；prompt 依次包含：`Run DevFlow Grill.`；加载 `skills/devflow-brainstorm/SKILL.md` 并在用户显式要求 grilled/stress-tested/拷问我/压力测试 时开始澄清；显式请求不跳过 Semantic Echo-Back、fixed `Confirmed request`、A/B/C；支持结构化提问工具时每题用 2-4 具体选项 + Other，否则用文本块；每答 1-2 句确认即下一问；不产出设计/计划/实现，以固定 `Confirmed request` 与 A/B/C 门收尾。
Acceptance: 显式 grill/stress-test 请求已在全部运行时声明面直达 `devflow-brainstorm`，且 AGENTS.md 仍保持在 8 KiB 预算内。
Verify: `node -e "const fs=require('fs');const checks=[['AGENTS.md','explicit grill/stress-test request'],['skills/devflow-core/SKILL.md','Explicit grill/stress-test request'],['skills/devflow-core/references/core-methods.md','counts as user-selected Brainstorm clarification'],['commands/devflow.toml','拷问我'],['commands/devflow-grill.toml','Run DevFlow Grill']];for(const[f,s]of checks){if(!fs.readFileSync(f,'utf8').includes(s))throw new Error(f+' missing '+s)}const n=Buffer.byteLength(fs.readFileSync('AGENTS.md'),'utf8');if(n>8192)throw new Error('AGENTS.md '+n+' bytes');console.log('grill entry surfaces PASS; AGENTS.md '+n+' bytes')"` 打印 `grill entry surfaces PASS`（expected）且字节数 ≤ 8192，随后 `node scripts/validate-route-consistency.js` 退出码 0（expected PASS）。
Not doing: 不改动 AGENTS.md graphify 块与既有硬边界文字，不新增路由边或改变 A/B/C 语义。

Task: Brainstorm 结构化提问与节奏规则
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | `description:`, `Entry And Stop Condition`, `Clarification Process` | 补显式 grill 触发信号、结构化提问与节奏规则
- Modify: skills/devflow-brainstorm/references/interview-discipline.md | `Clarification Loop`, `Semantic Echo-Back`, `One-Question Discipline`, `Verification` | 规则细化
Change: 替换 description 首句 `Use when devflow-core sends ambiguous or materially risky creative work for clarification — creating features` 为 `Use when devflow-core sends ambiguous or materially risky creative work for clarification, or when the user explicitly asks to stress-test, grill, 拷问, or 压力测试 a request or plan — creating features`。Entry 段末追加：`Or when the user explicitly requests to be grilled or stress-tested: the explicit request counts as user-selected Brainstorm clarification and still runs every duty below.` 步骤 4 块后追加：`When the host provides a structured question tool (for example DSH \`ask_user_question\` or opencode \`question\`), ask every clarification question through it with 2-4 concrete options representing the most likely answers plus an Other field, and use it for the echo-back confirm question (Correct / Mostly correct / Let me correct something). When no such tool exists, keep the text block unchanged. After each answer, acknowledge it in one or two sentences, then immediately ask the next question. After the echo-back is confirmed, start the clarification loop directly.` reference 同步：Clarification Loop 增加结构化提问与确认节奏两行；Semantic Echo-Back rules 增加 `- Ask the confirm-or-correct question through the structured question tool when the host provides one (Correct / Mostly correct / Let me correct something + Other); the five fields stay visible in the message.`；One-Question Discipline 增加 `- When using the structured tool, give 2-4 concrete options that represent realistic answers, keep the recommended answer visible, and never replace the answer with a generic Yes/No unless the question is genuinely binary.`；Verification 增加两条 checkbox：结构化工具每题 2-4 具体选项 + Other、每答 1-2 句确认后立即下一问。
Acceptance: brainstorm 技能与 reference 携带结构化提问与节奏规则，且全部既有强制格式仍在、技能仍在 15 KiB 单技能预算内。
Verify: `node -e "const fs=require('fs');const s=fs.readFileSync('skills/devflow-brainstorm/SKILL.md','utf8');const d=fs.readFileSync('skills/devflow-brainstorm/references/interview-discipline.md','utf8');for(const x of ['or when the user explicitly asks to stress-test','structured question tool','immediately ask the next question'])if(!s.includes(x))throw new Error('skill missing '+x);for(const x of ['structured question tool','Let me correct something','immediately ask the next question'])if(!d.includes(x))throw new Error('discipline missing '+x);console.log('structured clarification rules PASS')"` 打印 `structured clarification rules PASS`（expected），随后 `node scripts/devflow-budget.js` 打印 brainstorm 字节数 ≤ 15360 且 `Judgment: PASS`（expected）。
Not doing: 不删除或改写任何既有强制结构、不引入可选格式、不改 compact/standard/deep 语义与 A/B/C 门。

Task: 校验器与行为场景
Files:
- Modify: scripts/validate-devflow.js | `assertBrainstormSelectionContract` | 其后添加 `assertGrillEntryContract()` 正/负断言并调用
- Modify: scripts/validate-skill-triggers.js | `scenarios` | 数组末尾添加 `explicit grill entry` 场景
- Modify: scripts/capability-eval-scenarios.json | `explicit-grill-entry` | 数组末尾添加合同条目
- Modify: skills/devflow-prove/references/flow-self-test.md | `Scenario 1G` | 其后添加 Scenario 1H
Change: 添加 `assertGrillEntryContract()`，对以下证据逐条断言：`["AGENTS.md","explicit grill/stress-test request"]`、`["skills/devflow-core/SKILL.md","Explicit grill/stress-test request"]`、`["skills/devflow-core/references/core-methods.md","counts as user-selected Brainstorm clarification"]`、`["skills/devflow-brainstorm/SKILL.md","or when the user explicitly asks to stress-test"]`、`["skills/devflow-brainstorm/SKILL.md","structured question tool"]`、`["skills/devflow-brainstorm/SKILL.md","immediately ask the next question"]`、`["commands/devflow-grill.toml","Run DevFlow Grill"]`、`["commands/devflow.toml","拷问我"]`，并断言 brainstorm 仍含 `## A/B/C Gate`。validate-skill-triggers.js 添加场景对象：name `explicit grill entry`、route `Design`、input `Grill me on this plan before I commit to it.`、evidence 使用与上面相同的文件-短语对，末条为 `["skills/devflow-prove/references/flow-self-test.md","Scenario 1H"]`。capability JSON 添加条目：id `explicit-grill-entry`、scenario `Scenario 1H: Explicit Grill Entry And Structured Clarification`、layers `["Prompt Surface","Harness/Validation","Context","Eval/Verifier"]`、expectedRoute `Design`、command `trigger:verify`、scenarioEvidence 取 1H 正文原句（`Route: Design.`、`explicit user request -> \`devflow-brainstorm\``、`Must send the Semantic Echo-Back first`、`2-4 concrete options plus an Other field`、`immediately ask the next question`）、commandEvidence `["explicit grill entry: Design"]`、negativeConstraints `["Must not skip the Semantic Echo-Back.","Must not select A/B/C for the user."]`。flow-self-test 添加 `## Scenario 1H: Explicit Grill Entry And Structured Clarification`，按 1F/1G 格式写 Input、Expected behavior（Route: Design；explicit user request -> `devflow-brainstorm`；首消息必须是完整语义回显；一次一问且支持结构化工具时用 2-4 具体选项 + Other、否则文本块；每答 1-2 句确认后立即下一问；保留固定 `Confirmed request` 与用户自选 A/B/C；不得替用户选 A/B/C；不得跳过语义回显；不得产出设计/计划/实现）与 Pass check 块。
Acceptance: 新 trigger 场景、capability 合同与 1H 场景文本互相引用一致，定向断言通过。
Verify: `node -e "const fs=require('fs');JSON.parse(fs.readFileSync('scripts/capability-eval-scenarios.json','utf8'));if(!fs.readFileSync('scripts/validate-skill-triggers.js','utf8').includes('explicit grill entry'))throw new Error('trigger scenario missing');if(!fs.readFileSync('skills/devflow-prove/references/flow-self-test.md','utf8').includes('Scenario 1H: Explicit Grill Entry And Structured Clarification'))throw new Error('1H missing');console.log('grill validators and scenario PASS')"` 打印 `grill validators and scenario PASS`（expected）。
Not doing: 不新增校验脚本、不改既有场景断言与 capability 条目。

Task: 分发面与激活文档
Files:
- Modify: scripts/install-devflow.js | `runtimeEntries` | 命令清单末尾添加 `commands/devflow-grill.toml`
- Modify: scripts/install-devflow-user.js | `userEntries` | 命令清单末尾添加 `commands/devflow-grill.toml`
- Modify: plugin.json | `commands` | 添加新命令
- Modify: README.md | `/devflow-audit` | 其后添加 `/devflow-grill` 行
- Modify: docs/features/devflow-core.md | `Version History` | 追加 v56 行与 Key Decisions 条目
- Modify: plugins/devflow/skills | `plugins/devflow/skills` | 逐字节镜像 5 个改动文件
- Modify: dsh/plugins/dsh-devflow/assets | `sync-assets.js` | 运行同步脚本生成 DSH 副本
- Modify: package.json、plugins/devflow/.codex-plugin/plugin.json、dsh/plugins/dsh-devflow/package.json | `version` | bump 0.7.0 / 0.5.0 / 0.11.0
Change: 添加 `"commands/devflow-grill.toml",` 到两个安装器的命令段末尾（`commands/devflow-audit.toml` 之后）与 plugin.json 的 commands 数组，plugin.json 同时 bump version 0.7.0。README slash 命令清单在 `/devflow-audit` 行后添加 `/devflow-grill    stress-test / 拷问 a request or plan with one-question clarification`。devflow-core.md 按表内既有格式追加一行 v56（`explicit-grill-entry`，routing entry，2026-09-23，active，摘要：新增显式 grill/stress-test 直达 `devflow-brainstorm` 入口、`/devflow-grill` 命令、结构化提问与确认节奏规则，全部门不变）并在 Key Decisions 追加一条同日决策。Codex 镜像用工作区源文件覆盖 5 个副本：`plugins/devflow/skills/devflow-brainstorm/SKILL.md`、`plugins/devflow/skills/devflow-brainstorm/references/interview-discipline.md`、`plugins/devflow/skills/devflow-core/SKILL.md`、`plugins/devflow/skills/devflow-core/references/core-methods.md`、`plugins/devflow/skills/devflow-prove/references/flow-self-test.md`；DSH 运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 两次（第二次幂等）。版本 bump：`package.json` 0.6.0→0.7.0、根 `plugin.json` 0.6.0→0.7.0、`plugins/devflow/.codex-plugin/plugin.json` 0.4.0→0.5.0、`dsh/plugins/dsh-devflow/package.json` 0.10.0→0.11.0、`gemini-extension.json` 保持 0.4.0。
Acceptance: 安装器、插件清单、README 与新命令一致，Codex 与 DSH 分发副本逐字节同步，版本按既定惯例 bump。
Verify: `node plugins/devflow/scripts/verify-plugin.js` expected 输出 `Plugin verification passed: 14 skills, 5 checker self-tests`；`node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 二次运行 expected 输出不变（幂等）；`npm run trigger:verify` expected 20 个场景与 `Packaged asset parity: PASS`；`npm test` expected 退出码 0。
Not doing: 不做 npm publish；不手改 `dsh/plugins/dsh-devflow/assets/**`；不动 quick-cmds-static 与用户未提交改动。

Task: 全量验证与六 home 同步
Files:
- Modify: 六个用户级 home | `~/.dsh`, `~/.codex`, `~/.claude`, `~/.codebuddy`, `~/.workbuddy`, `~/.zcode` | overlay 同步 skills/commands/scripts
Change: 检查 `npm run verify:all` 全绿后，对六个 home 依次执行 `npm run install:user -- --home ~/.codex --write --force` 形式的同步（逐家替换为实际 home 路径）并复核；不删除目标独有文件。
Acceptance: 仓库全量验证矩阵通过，六个用户级 home 的 `--check` 全部通过。
Verify: `npm run verify:all` expected 退出码 0；对每个 home 执行 `node scripts/install-devflow-user.js --home ~/.codex --check` 形式的复核 expected `Check passed`（6/6）；`node scripts/devflow-doctor.js` expected 无 missing/changed。
Not doing: 不安装 `AGENTS.md`/`CLAUDE.md`/宿主规则到用户级 home（安装器本身排除）；不做外部发布。

Task: Scenario 1H 行为走查
Files:
- Test: skills/devflow-prove/references/flow-self-test.md | `Scenario 1H` | 按其 Input 与 Expected behavior 逐条走查
Change: 检查改动后的运行时在 1H 输入下的一条完整澄清链：首条消息为全字段语义回显、逐问一次一个、支持结构化工具的宿主使用 2-4 具体选项 + Other、每个回答后 1-2 句确认并立即进入下一问、结尾为固定 `Confirmed request` 并停在 A/B/C 等待用户选择、无设计/计划/实现产出。
Acceptance: 走查记录逐条满足 Scenario 1H 的 Expected behavior 与 Pass check。
Verify: 按 `Scenario 1H` 输入走查，expected 逐条满足 Expected behavior 与 Pass check，并把消息样例与逐条对照写入 `## Progress` 证据列。
Not doing: 不做采用率或模型基准声明（仓库非目标）；不修改运行时。

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 直达入口声明与命令 | done | `node -e` 5 面断言 PASS（AGENTS.md 8184 bytes ≤ 8192）；`node scripts/validate-route-consistency.js` PASS |
| 2 | Brainstorm 结构化提问与节奏规则 | done | `node -e` 规则断言 PASS；`node scripts/devflow-budget.js` PASS（brainstorm 14877/15360，总 165669/280000） |
| 3 | 校验器与行为场景 | done | `node -e` capability 合同 ↔ 1H 正文 ↔ trigger 场景互证 PASS（evidence/negativeConstraints 全部命中） |
| 4 | 分发面与激活文档 | done | `verify-plugin` PASS（14 skills/5 self-tests）；sync-assets 二次幂等；`trigger:verify` PASS（20 场景，parity PASS）；`npm test` PASS。含旧 trigger 场景 AGENTS 锚点同步 1 处（T1 短语替换的连带修正） |
| 5 | 全量验证与六 home 同步 | done | `npm run verify:all` exit=0；六 home（.dsh/.codex/.claude/.codebuddy/.workbuddy/.zcode）各 55 文件 `--write --force` 后 `--check` 6/6 `Check passed`；`devflow-doctor` 6 homes 0 failed |
| 6 | Scenario 1H 行为走查 | done | 实走样例（CSV 导出）：5 字段回显 → 结构化确认（确认无误）→ Q1 导出范围（当前筛选全部行）→ Q2 列集合（当前可见列）→ 固定摘要 → A/B/C 门（用户选 C，仅记录）。全问均 2-4 具体选项 + Other，答后 1-2 句即下一问，未替选深度、未产出设计/计划。边界：作者本会话实走（opencode `question` 工具），未做宿主重启后自激活加载实测 |
