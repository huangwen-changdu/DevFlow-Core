# 反 AI 味质量门：prose 25 模式与设计 58 门提炼内嵌

Status: done
Goal: 把 humanizer 的 25 个 AI 写作痕迹模式与 hallmark 的 58 个设计 slop 门及六轴自评蒸馏为 DevFlow 自有的两份质量清单，接进 Build 交付与 Prove 证明的写后检查，让代码、文档与设计产出在交付前过一遍反 AI 味门。
Not doing: 外部 skill 安装；vendor 外部 skill 全文；改 Prove/Build SKILL.md 主体；改 AGENTS.md；新校验脚本；spec/plan 内部文档强制 prose 门；npm publish；bump gemini 版本；六个用户级 home 同步。
Cut: 做 两份蒸馏清单（prose 25 模式 + UI 58 门与六轴自评）+ 四处接线 + 安装器条目 + 版本 bump + 三镜像同步 + 台账与索引 | 不做 外部 skill 安装、vendor 外部 skill 全文、改 Prove/Build SKILL.md 主体、改 AGENTS.md、新校验脚本、spec/plan 内部文档强制 prose 门、npm publish、bump gemini 版本、六个用户级 home 同步 | 复用 既有条件加载锚点、镜像同步脚本与静态机检 | 验证 verify:all + --index + budget + verify-plugin + sync 幂等 | Rejected: ①`npx skills add` 安装外部 skill ②vendor 两仓库全文入库 ③扩 Prove/Build `SKILL.md` 主体（15337 与 15274 贴 15360 上限）④改 `AGENTS.md`（8184 贴 8192 上限）⑤新校验脚本（复用既有机检）⑥spec/plan 内部文档强制 prose 门（只覆盖交付文案与交付文档）⑦npm publish（无 token）⑧bump gemini 0.4.0（无变更面）⑨六 home 同步（用户选择跳过，doctor 4 failed 为既有基线）
Source: 用户请求（2026-09-25 会话确认：提炼内嵌 + 暂不安装 + bump 版本 + 跳过 home 同步）+ 本计划随附 Cut Decision
Execution mode: sequential
Landed: 2026-09-25 · npm run verify:all 退出码 0（18 项全 PASS，budget 165457/280000）；node scripts/devflow-plan.js --index → Problems: none / PASS；verify-plugin 14 skills/5 self-tests PASS；sync-assets 两次 diff 为空（幂等）；npm test → 18 runtime files/29 learning cards PASS；版本 0.7.1 / 0.7.1 / 0.5.1 / 0.11.1

## Recon

- `npm test` → DevFlow validation passed / Checked 18 runtime files, 29 learning cards（改动前基线）
- `npm run verify:all` → 退出码 0，末项 Route consistency check passed（18 项全绿，改动前基线）
- `node scripts/devflow-plan.js --index` → Problems: none / Judgment: PASS
- `node scripts/devflow-budget.js` → Total skills bytes: 165349 (limit 280000) / Judgment: PASS
- `node plugins/devflow/scripts/verify-plugin.js` → Plugin verification passed: 14 skills, 5 checker self-tests
- `npm run trigger:verify` → Packaged asset parity: PASS / Judgment: PASS
- `node scripts/devflow-doctor.js` → DevFlow doctor: 4 homes checked, 4 failed（既有基线，~/.claude 与 ~/.zcode 目录不存在）
- `node scripts/install-devflow-user.js --home ~/.codebuddy --check` → Total files: 55 / Check failed: 54 missing, 1 changed（既有基线）
- `wc -c skills/devflow-prove/SKILL.md skills/devflow-build/SKILL.md skills/devflow-docs-followup/SKILL.md` → 15337 / 15274 / 5660（前两者距 15360 上限余 23 与 86 字节，主体不可再加）
- `node -e "for(const f of ['package.json','plugin.json','gemini-extension.json','plugins/devflow/.codex-plugin/plugin.json','dsh/plugins/dsh-devflow/package.json'])console.log(f,JSON.parse(require('fs').readFileSync(f,'utf8')).version)"` → package.json 0.7.0 / plugin.json 0.7.0 / gemini 0.4.0 / codex 0.5.0 / dsh 0.11.0
- `curl -sL https://api.github.com/repos/Nutlope/hallmark` → `"spdx_id": "MIT"`（humanizer README License 节同为 MIT）
- `grep -n "assertMirrorTree\|assertPackagedAssetParity" scripts/validate-devflow.js scripts/validate-skill-triggers.js` → validate-devflow.js 269/284/292 与 validate-skill-triggers.js 33/307 命中（T1 新文件建好后、T3 镜像同步前 npm test 与 trigger:verify 会失败，属预期）
- `git status --short` → 空输出（工作区干净，最新 commit 1c4e4ec）

## Tasks

Task: 提炼并新建两份质量清单 reference
Files:
- Create: skills/devflow-prove/references/prose-quality-checklist.md | new file | humanizer 25 模式蒸馏，供交付文案与文档写后自检
- Create: skills/devflow-prove/references/ui-slop-checklist.md | new file | hallmark 58 门与六轴自评蒸馏，供 UI 与设计产出自检
Change: 基于已抓取的 `/tmp/hallmark-slop-test.md`（192 行、58 门、六轴）与 humanizer README 的 25 模式表写入两份新文件。prose 清单按 A-E 五组收录 25 个模式，每条给出编号、名称、识别句与 weak alone 标注，前 5 条标注单条即改，头部添加来源署名（blader/humanizer，MIT；Wikipedia Signs of AI writing）、适用范围（完成消息、commit 与 PR 文案、交付文档）与不发明事实红线（名字、数字、日期、引用只能来自源或写者，缺细节就提问而不是编造）。ui 清单头部添加来源署名（Nutlope/hallmark，MIT）与适用范围（UI、页面、设计产出），先给六轴自评表（A 哲学、B 层级、C 执行、D 具体性、E 克制、F 变化，每轴 1-5 分，任一轴低于 3 先修订再过门），再按域收录 58 个门（视觉、结构、微交互、排版、输入态、对比度、导航页脚、诚实文案、令牌、响应式、移动端），剔除 `.hallmark/log.json`、CSS stamp 与 genre 覆盖这类 hallmark 专属机制，保留可迁移判据。
Acceptance: 两份清单文件存在于 `skills/devflow-prove/references/` 且各携带来源署名、适用范围与 25 模式 / 58 门编号体系
Verify: `node -e "const fs=require('fs');const p=fs.readFileSync('skills/devflow-prove/references/prose-quality-checklist.md','utf8');const u=fs.readFileSync('skills/devflow-prove/references/ui-slop-checklist.md','utf8');if(!/25\s*个模式|25 patterns|## The 25/.test(p))throw new Error('prose missing 25-pattern structure');if(!p.includes('weak alone')||!p.includes('MIT')||!p.includes('invent'))throw new Error('prose missing markers');if(!/58/.test(u)||!u.includes('六轴')||!u.includes('MIT'))throw new Error('ui missing six-axis structure');console.log('checklists PASS')"` 打印 `checklists PASS`（expected）
Not doing: 不搬运安装说明与徽章、不保留 log.json 与 stamp 依赖、不新增校验脚本、不改动任何既有文件。

Task: 四处条件加载接线
Files:
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | `Proof Context Selection` | 段末添加两清单条件加载句
- Modify: skills/devflow-build/references/build-methods.md | `## Readability Outcome Check` | 其后添加交付前质量门段
- Modify: skills/devflow-docs-followup/SKILL.md | `Do not invent code paths` | 其后添加 prose 写后自检句
- Modify: skills/devflow-spec/references/spec-plan-methods.md | `## Method 10` | 添加 prose 门覆盖边界句
Change: 精确改法如下。proof-recovery-methods 的 Proof Context Selection 段末追加 `Load prose-quality-checklist.md for completion messages, commit and PR text, and created documents, and load ui-slop-checklist.md only when the change emits UI or design output; both are bounded post-write checks inside the existing Prove and Build nodes.`。build-methods 在 `## Readability Outcome Check` 段之后、`## Build Comments` 之前添加新段 `## Quality Gates Before Handoff`，说明交付文案与文档过 prose-quality-checklist.md、UI 与设计产出过 ui-slop-checklist.md，两者与 Readability Outcome Check 并列执行，任一门不过就修正后重跑。docs-followup 在 `Do not invent code paths` 句之后添加写后自检句：交付前按 prose-quality-checklist.md 过一遍文档正文并就地修正命中的模式。spec-plan-methods 在 Method 10 内添加覆盖边界句，声明 prose 门只覆盖交付文案与交付文档、Spec 与 Plan 内部契约文档豁免。
Acceptance: 四个文件各携带新增的加载、自检或边界句且既有断言短语 Proof Context Selection、Readability Outcome Check、accepted final state、opt-out 全部保留
Verify: `node -e "const fs=require('fs');const adds=[['skills/devflow-prove/references/proof-recovery-methods.md','ui-slop-checklist.md'],['skills/devflow-build/references/build-methods.md','Quality Gates Before Handoff'],['skills/devflow-docs-followup/SKILL.md','prose-quality-checklist.md'],['skills/devflow-spec/references/spec-plan-methods.md','豁免']];for(const[f,s]of adds){if(!fs.readFileSync(f,'utf8').includes(s))throw new Error(f+' missing '+s)}const anchors=[['skills/devflow-prove/references/proof-recovery-methods.md','Narrow context does not weaken diff review'],['skills/devflow-prove/references/proof-recovery-methods.md','accepted final state'],['skills/devflow-build/references/build-methods.md','Readability Outcome Check'],['skills/devflow-build/references/build-methods.md','accepted final state'],['skills/devflow-docs-followup/SKILL.md','opt-out'],['skills/devflow-docs-followup/SKILL.md','accepted final state'],['skills/devflow-spec/references/spec-plan-methods.md','Spec Document And Plan Pack']];for(const[f,s]of anchors){if(!fs.readFileSync(f,'utf8').includes(s))throw new Error(f+' lost '+s)}console.log('wiring PASS')"` 打印 `wiring PASS`（expected）
Not doing: 不改 Prove 与 Build 的 SKILL.md 主体（15337 与 15274 贴 15360 上限）、不删既有断言短语、不改 AGENTS.md 与 commands、不新增校验脚本。

Task: 分发面条目、版本 bump 与三镜像同步
Files:
- Modify: scripts/install-devflow.js | `runtimeEntries` | code-review-checklist 条目后添加两条清单
- Modify: scripts/install-devflow-user.js | `userEntries` | code-review-checklist 条目后添加两条清单
- Modify: package.json、plugin.json、plugins/devflow/.codex-plugin/plugin.json、dsh/plugins/dsh-devflow/package.json | `version` | patch bump 0.7.1 / 0.5.1 / 0.11.1
- Modify: plugins/devflow/skills | `plugins/devflow/skills` | 逐字节镜像 6 个改动文件
- Modify: dsh/plugins/dsh-devflow/assets | `sync-assets.js` | 运行同步脚本两次生成 DSH 副本
Change: 在两个安装器的 `"skills/devflow-prove/references/code-review-checklist.md",` 之后各添加 `"skills/devflow-prove/references/prose-quality-checklist.md",` 与 `"skills/devflow-prove/references/ui-slop-checklist.md",`。版本按仓库惯例 patch bump：package.json 与 plugin.json 0.7.0 改 0.7.1，Codex plugin 0.5.0 改 0.5.1，dsh 子包 0.11.0 改 0.11.1，gemini-extension.json 保持 0.4.0。用 `cp` 把 6 个文件（两份新清单、proof-recovery-methods.md、build-methods.md、spec-plan-methods.md、docs-followup SKILL.md）覆盖到 `plugins/devflow/skills/` 对应路径，再运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 两次并比较两次输出确认幂等。
Acceptance: 两个安装器各含两条新条目、四版本号为 0.7.1 / 0.7.1 / 0.5.1 / 0.11.1 且 Codex 与 DSH 镜像与工作区逐字节一致
Verify: `node -e "const fs=require('fs');for(const f of ['scripts/install-devflow.js','scripts/install-devflow-user.js']){const s=fs.readFileSync(f,'utf8');if(!s.includes('prose-quality-checklist.md')||!s.includes('ui-slop-checklist.md'))throw new Error(f+' missing entries')}for(const[f,w]of [['package.json','0.7.1'],['plugin.json','0.7.1'],['plugins/devflow/.codex-plugin/plugin.json','0.5.1'],['dsh/plugins/dsh-devflow/package.json','0.11.1']]){const v=JSON.parse(fs.readFileSync(f,'utf8')).version;if(v!==w)throw new Error(f+' has '+v)}const pairs=[['skills/devflow-prove/references/prose-quality-checklist.md','plugins/devflow/skills/devflow-prove/references/prose-quality-checklist.md'],['skills/devflow-prove/references/ui-slop-checklist.md','plugins/devflow/skills/devflow-prove/references/ui-slop-checklist.md'],['skills/devflow-prove/references/proof-recovery-methods.md','plugins/devflow/skills/devflow-prove/references/proof-recovery-methods.md'],['skills/devflow-build/references/build-methods.md','plugins/devflow/skills/devflow-build/references/build-methods.md'],['skills/devflow-spec/references/spec-plan-methods.md','plugins/devflow/skills/devflow-spec/references/spec-plan-methods.md'],['skills/devflow-docs-followup/SKILL.md','plugins/devflow/skills/devflow-docs-followup/SKILL.md']];for(const[a,b]of pairs){if(fs.readFileSync(a,'utf8')!==fs.readFileSync(b,'utf8'))throw new Error('mirror drift '+b)}console.log('distribution PASS')"` 打印 `distribution PASS`（expected），`node plugins/devflow/scripts/verify-plugin.js` expected 输出 `Plugin verification passed`，`node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 第二次运行输出与第一次相同（expected 幂等），`npm test` expected 退出码 0。
Not doing: 不 bump gemini-extension.json、不 npm publish、不改 commands 与 plugin.json 的 commands 数组、不手改 `dsh/plugins/dsh-devflow/assets/**`。

Task: 功能索引与需求台账推进
Files:
- Modify: docs/features/INDEX.md | `DevFlow 拷问直达` | 表末添加反 AI 味质量门行
- Modify: docs/plans/INDEX.md | `2026-09-25-anti-slop-prose-design-quality` | 功能条目列由 - 改为功能名
- Modify: docs/requirements.md | `反 AI 味质量门` | 状态由 planned 推进 built
- Modify: docs/features/devflow-core.md | `Current Version: v56` | 更新头部并添加 v57 行与 Key Decisions 条目
Change: features INDEX 在最后一行之后添加一行：功能 `反 AI 味质量门`、一句话 `把 humanizer 25 写作模式与 hallmark 58 设计门蒸馏成两份清单，接进 Build 与 Prove 的写后检查`、触发词 `AI味, slop, humanizer, hallmark, 文案质量, 设计门, 六轴, 25 模式, 58 门, prose check`、入口 `skills/devflow-prove/references/prose-quality-checklist.md`、Status `active`、验证 `npm test`、关键文件 `skills/devflow-prove/references/prose-quality-checklist.md, skills/devflow-prove/references/ui-slop-checklist.md`、来源计划 `2026-09-25-anti-slop-prose-design-quality.md`、更新日 `2026-09-25`，并把头部 更新日 改为 2026-09-25。plans INDEX 把本计划行的功能条目由 `-` 改为 `反 AI 味质量门`。requirements 把本计划对应行的状态由 `planned` 推进 `built`。devflow-core.md 头部 Current Version 改 v57、Last Change 改 anti-slop-quality-gates，Version History 表在 v56 之上添加 v57 行，Key Decisions 添加一条蒸馏内嵌而非安装外部 skill 的决策。
Acceptance: 功能索引新行的关键文件全部存在、plans INDEX 功能条目与 requirements 状态推进后 `node scripts/devflow-plan.js --index` 仍 PASS
Verify: `node scripts/devflow-plan.js --index` expected 输出 `Judgment: PASS`，`node -e "const fs=require('fs');for(const f of ['skills/devflow-prove/references/prose-quality-checklist.md','skills/devflow-prove/references/ui-slop-checklist.md','docs/plans/2026-09-25-anti-slop-prose-design-quality.md']){if(!fs.existsSync(f))throw new Error('missing '+f)}console.log('index rows PASS')"` 打印 `index rows PASS`（expected）
Not doing: 不改既有索引行与其它需求行状态、不新建索引文件、不改运行时文件。

Task: 全量验证与收口
Files:
- Modify: docs/plans/2026-09-25-anti-slop-prose-design-quality.md | `## Progress` | 五行回写证据并收口 Status 与 Landed
- Modify: docs/plans/INDEX.md | `2026-09-25-anti-slop-prose-design-quality` | Status 改 done 并填落地证据
- Modify: docs/requirements.md | `反 AI 味质量门` | 状态推进 landed 并填证据
Change: 前四任务完成后先跑 `npm run verify:all` 记录退出码与结果，然后把计划 `## Progress` 五行置 `done` 并逐行写入命令与关键结果，把 `Status` 改为 `done`、添加 `Landed:` 行记录日期与 verify:all、--index、budget、verify-plugin 关键结果，同步把 plans INDEX 本计划行 Status 改 `done` 并填落地证据、requirements 本行状态推进 `landed` 并填证据，最后重跑 `node scripts/devflow-plan.js --index` 与 `npm run verify:all` 确认三处状态一致且机检全绿。不执行六 home 同步。
Acceptance: 收口后 Status、plans INDEX、requirements 三处状态一致且 `npm run verify:all` 与 `node scripts/devflow-plan.js --index` 全部通过
Verify: `npm run verify:all` expected 退出码 0，`node scripts/devflow-plan.js --index` expected 输出 `Judgment: PASS`，`node scripts/devflow-budget.js` expected 输出 `Judgment: PASS`
Not doing: 不做六 home 同步（用户已选择跳过）、不 npm publish、不改运行时文件与镜像。

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 提炼并新建两份质量清单 reference | done | `node -e "..."`（prose/ui markers 校验）→ checklists PASS；两文件 `skills/devflow-prove/references/{prose-quality-checklist.md,ui-slop-checklist.md}` 已创建 |
| 2 | 四处条件加载接线 | done | `node -e "..."`（adds + anchors 校验）→ wiring PASS；4 文件新增句、7 个既有断言短语全部保留 |
| 3 | 分发面条目、版本 bump 与三镜像同步 | done | `node -e "..."` → distribution PASS；`node plugins/devflow/scripts/verify-plugin.js` → 14 skills/5 self-tests PASS；`sync-assets.js` 两次 diff 为空（IDEMPOTENT）；`npm test` 退出码 0 |
| 4 | 功能索引与需求台账推进 | done | `node scripts/devflow-plan.js --index` → Problems: none / PASS；`node -e "..."` → index rows PASS（features 行 + plans 功能条目 + requirements built + devflow-core v57） |
| 5 | 全量验证与收口 | done | `npm run verify:all` → 退出码 0（18 项含 budget 165457/280000、route consistency 全绿）；`node scripts/devflow-plan.js --index` → PASS；`node scripts/devflow-budget.js` → PASS |
