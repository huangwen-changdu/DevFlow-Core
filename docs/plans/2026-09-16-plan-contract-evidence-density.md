# 计划契约证据密度重构实施计划

Status: done
Goal: 让计划文档的每条要求都来自可重跑命令或可机械追溯的来源，恢复跨会话与跨模型交接能力，同时清除 10 处 v1 契约漂移使计划生成路径只承载一套契约，并且 `npm run verify:all` 全绿。
Not doing: 不新增独立全局约束小节（复用既有 `Not doing` 字段承载项目级不变量）。不做文件形态的交接载体，不把跨任务通道改回每任务强制。不恢复 v1 的 `Current behavior`、`Target behavior`、`Change mechanics`、`Call impact`、`Steps`、`Comments`、`Task type` 与 `File Structure` 职责表。不改执行层（子代理派发协议、执行者回报状态集、执行前简报与执行后报告的文件机制）。不改 A/B/C 深度语义、路由边与宿主适配文件。不迁移或改写历史计划与历史 spec，不改 `docs/features/devflow-core.md` 的日期化版本历史表。不新增目录、npm 依赖或脚本文件。不让 checker 重跑侦查命令。不执行 `npm publish`。
Cut: 做 计划技能正文的两级证据准入与两处载体规则、计划头部侦查小节（命令加输出，允许 none 加理由）、跨任务通道按执行模式触发、`devflow-plan.js` 的三组新校验与反向用例、`validate-devflow.js` 的活体面旧字段断言、10 处漂移同批修正、零回归对比、副本同步与版本 bump | 不做 新增 `Global Constraints` 独立小节、文件形态交接载体、每任务强制 `Interfaces`、恢复 v1 每任务断言字段、执行层改动、新增脚本或依赖、checker 重跑命令、执行 `npm publish` | 复用 既有头部 `Not doing` 字段、既有 `## Progress` 证据列与 `Landed`、`scripts/devflow-plan.js` 的 v2 分支与 `selfTest` 负例模式、`scripts/validate-devflow.js` 的断言组模式、`sync-assets.js` 与 `verify-plugin.js` 发布链 | 验证 三例反向验证、26 份 legacy 与 4 份 done v2 计划的退出码零回归对比、`npm run verify:all`、`npm run budget:verify`、sync 幂等与逐字节一致、全仓字段扫描 | Rejected: ① 新增 `Global Constraints` 独立小节——改用既有 `Not doing` 字段，4 份 v2 计划已在用它承载项目级不变量（09-14 计划原文列举 5 条），新小节只是重命名同一内容。② 文件形态交接载体——本仓计划仅 44-75 行，计划文件本身就是载体，第二类文档只增加同步面与机检维度。③ 每任务强制 `Interfaces`——`sequential` 模式下执行者持有整个计划，通道没有消费者。④ checker 重跑侦查命令——会把纯静态校验器变成执行器，并与 target 项目拷贝脚本的零副作用约定冲突，改为形态校验加 Prove 抽查。⑤ 把跨任务通道并入既有 `Change` 散文——机检需解析自然语言，判定会漂。⑥ 新增独立校验脚本——沿用既有 checker 的分支模式，避免多一个分发文件与一套重复自测框架。
Source: docs/specs/2026-09-16-plan-contract-evidence-density.md
Execution mode: sequential
Bootstrap: 本计划在新校验落地后就地补齐 `## Recon` 与可追溯的 `Not doing`，成为新契约的首个实例，`scripts/devflow-plan.js` 的新校验对它生效
Landed: 2026-09-16 · `npm run verify:all` 退出码 0（18 项校验）；`devflow-plan.js --self-test` 与 `--index` 退出码 0；32 份计划改动前后退出码差异 0；budget 162919/280000 且 `devflow-prove/SKILL.md` 15337/15360；sync-assets 二次输出相同、DSH 子包自测五场景通过、Codex 插件 14 skills/5 self-tests 通过；版本 0.6.0 / 0.10.0 / 0.4.0（`npm publish` 待用户执行）

## Recon

- `node scripts/validate-devflow.js` → DevFlow validation passed；Checked 18 runtime files, 27 learning cards, and selected host and trigger contracts
- `node scripts/devflow-plan.js --index` → Judgment: PASS；Problems: none
- `node scripts/devflow-budget.js` → skills/devflow-prove/SKILL.md 15341 bytes of 15360；Total skills bytes 160464 (limit 280000)
- `node -e "console.log(require('fs').readFileSync('commands/devflow-plan.toml','utf8').includes('Current behavior: '))"` → true，命令模板仍要求 v1 字段
- `node -e "const s=require('fs').readFileSync('scripts/devflow-plan.js','utf8');const m=s.match(/const locationPattern[\s\S]{0,220}/)[0];console.log(m.includes('heading'), m.includes('symbol'), /\\d/.test(m))"` → true true false，锚点接受 `symbol` 与 `heading` 前缀，没有行号分支

## Tasks

Task: 计划技能正文改为按证据等级准入

Files:
- Modify: skills/devflow-plan/SKILL.md | heading ## Required Plan Header | 新增侦查小节与来源可追溯的全局不变量
- Modify: skills/devflow-plan/SKILL.md | heading ## Required Task Contract | 六字段保留与按模式触发的跨任务通道
- Modify: skills/devflow-plan/references/plan-methods.md | heading ## Task Rows | 证据两级准入与模式触发规则

Change: 替换计划头部契约的字段说明，增加侦查小节，规定每行形态为反引号命令加该命令当时的输出，允许在确无侦查需求时写 none 并给出理由。明确项目级不变量由既有 `Not doing` 字段承载，每句须能在 `Source` 指向的 spec 的 Non-goals 或 Cut 行中找到来源，不新增独立小节。任务契约保留六字段，跨任务通道仅在 `Execution mode` 为 `single-subagent` 或 `fan-out` 时必填，语义限定为消费与产出两行。写入证据两级准入定义并说明各级防什么，一级防凭空断言，二级防指向存在但未被使用的路径。该文件当前 12614 字节，单文件上限 15360。

Acceptance: 计划技能同时声明证据两级准入、侦查小节形态与按模式触发的跨任务通道三处规则
Verify: run `node -e "const fs=require('fs');const s=fs.readFileSync('skills/devflow-plan/SKILL.md','utf8')+fs.readFileSync('skills/devflow-plan/references/plan-methods.md','utf8');const need=['侦查','Not doing','single-subagent','fan-out'];const miss=need.filter(k=>!s.includes(k));if(miss.length)throw new Error('missing '+miss);console.log('plan contract updated')"` expect output plan contract updated and exit 0
Not doing: 不改 checker、不改命令模板、不改两份分发副本

Task: 计划 checker 增加三组校验与反向用例

Files:
- Modify: scripts/devflow-plan.js | symbol: `checkPlan` | v2 分支新增三组校验
- Modify: scripts/devflow-plan.js | symbol: `selfTest` | 三例反向用例

Change: 在 v2 校验分支内增加三组判定——侦查小节每行须含反引号命令与其结果，或为 none 加理由；`Execution mode` 为 `single-subagent` 或 `fan-out` 时跨任务通道必填而 `sequential` 不要求；头部 `Not doing` 的每句须能在 `Source` 指向的 spec 的 Non-goals 或 Cut 行中找到来源，两者冲突时以 Cut 行为准。legacy 分支与其既有必填字段集保持不变。`selfTest` 增加三例反向用例：无命令的散文证据须失败、扇出缺通道须失败、顺序执行缺通道须通过。

Acceptance: `node scripts/devflow-plan.js --self-test` 覆盖三例反向用例并通过
Verify: run `node scripts/devflow-plan.js --self-test` expect DevFlow plan self-test passed and exit 0; then run `npm test` expect exit 0
Not doing: 不改默认输出格式、不改退出码语义、不重跑侦查命令、不改 legacy 必填字段集

Task: 活体面旧字段断言与十处漂移修正

Files:
- Modify: scripts/validate-devflow.js | symbol: `assert` | 活体面旧字段断言组
- Modify: commands/devflow-plan.toml | symbol: `prompt` | 头部与任务模板改为 v2 契约
- Modify: skills/devflow-spec/references/spec-plan-methods.md | heading ## Method 10: Spec Document And Plan Pack | Spec 与 Plan 描述改 v2 口径
- Modify: skills/devflow-build/SKILL.md | heading ### Fan-out dispatch | 并行判据措辞
- Modify: skills/devflow-build/SKILL.md | heading ## Code Comment Discipline | 注释纪律措辞
- Modify: skills/devflow-prove/SKILL.md | heading ## Process | 证据来源措辞改为计划任务与 Progress 证据
- Modify: skills/devflow-prove/SKILL.md | heading ## Proof Selection | 代码类证据基准措辞
- Modify: skills/devflow-prove/SKILL.md | heading ## Adversarial Review | 对抗审查基准措辞
- Modify: skills/devflow-prove/references/code-review-checklist.md | heading ## How to Use | 审阅输入措辞
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | heading ### Quality-Finding Recovery | 复审基准措辞
- Modify: skills/devflow-core/references/reference-projects.md | symbol: `devflow-plan` | 去掉已删字段
- Modify: README.md | heading ## Native Capabilities Integrated | 能力对比行去 `Spec coverage`
- Modify: docs/features/devflow-core.md | symbol: `devflow-plan` | 能力说明段去 v1 字段描述

Change: 替换十处活体面的旧字段表述为 v2 口径，涉及跨任务通道的地方改用执行模式触发的表述。`skills/devflow-prove/SKILL.md` 的四处改动一律以替换同义表述的方式落地，不得净增字节，该文件当前 15341 字节而单文件上限 15360。`docs/features/devflow-core.md` 只改能力说明段，日期化版本历史表不动。新增断言组扫描 `skills` 正文、`commands` 模板、`AGENTS.md` 与 `README.md` 四个面，检查并拒绝列出永久移除的字段名：`Prewalk`、`Current behavior`、`Target behavior`、`Change mechanics`、`Call impact`、`Task type`、`File Structure`、`Spec coverage`，并豁免技能正文中说明某字段不在当前契约内的段落。

Acceptance: 活体面旧字段断言在 skills、commands、AGENTS.md、README.md 四个面上全部通过
Verify: run `npm test` expect exit 0; then run `node scripts/devflow-budget.js` expect exit 0 and devflow-prove under 15360 bytes
Not doing: 不改历史计划与历史 spec、不改版本历史表、不把 `Interfaces` 列入永久移除清单、不做无关措辞润色

Task: 零回归对比

Files:
- Test: scripts/devflow-plan.js | symbol: `checkPlan` | 26 份 legacy 与 4 份 done v2 计划的退出码一致性

Change: 验证零回归基线——用 `git show HEAD:scripts/devflow-plan.js` 取出改动前的脚本，对 `docs/plans/` 下全部计划逐份比较改动前后的退出码，确认差异为 0。该检查必须在契约改动提交之前运行，否则 HEAD 已含新脚本而失去基线。

Acceptance: 全部计划的改动前后退出码差异为 0
Verify: run `node -e "const {execFileSync}=require('child_process'),fs=require('fs'),os=require('os'),path=require('path');const orig=path.join(os.tmpdir(),'orig-devflow-plan.js');fs.writeFileSync(orig,execFileSync('git',['show','HEAD:scripts/devflow-plan.js']));const files=fs.readdirSync('docs/plans').filter(f=>f.endsWith('.md')&&f!=='INDEX.md').map(f=>path.join('docs/plans',f));const run=(js,f)=>{try{execFileSync(process.execPath,[js,f],{stdio:'ignore'});return 0}catch(e){return e.status||1}};const bad=files.filter(f=>run(orig,f)!==run('scripts/devflow-plan.js',f));console.log('plans',files.length,'exit-code diffs',bad.length);if(bad.length)throw new Error('regression: '+bad.join(','))"` expect output exit-code diffs 0 and exit 0
Not doing: 不修改历史计划使其通过、不放宽既有校验

Task: 分发同步与版本 bump

Files:
- Modify: dsh/plugins/dsh-devflow/assets | symbol: `assets/skills` | skills 与 scripts 副本刷新
- Modify: plugins/devflow/skills | symbol: `plugins/devflow/skills` | devflow 技能副本刷新
- Modify: dsh/plugins/dsh-devflow/package.json | symbol: `version` | 随本轮 bump
- Modify: plugins/devflow/.codex-plugin/plugin.json | symbol: `version` | 随本轮 bump
- Modify: package.json | symbol: `version` | 随本轮 bump
- Modify: plugin.json | symbol: `version` | 随本轮 bump

Change: 检查两份副本后刷新——运行 sync-assets 刷新 DSH 插件资产，以根目录内容替换 Codex 插件内的技能与脚本副本使其逐字节一致，并把根清单、DSH 子包与 Codex 插件的版本替换为本轮次。

Acceptance: 两份副本与根目录技能逐字节一致
Verify: run `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` twice expect identical output lines; then run `node plugins/devflow/scripts/verify-plugin.js` expect passed; then run `npm run verify:all` expect exit 0
Not doing: 不执行 `npm publish`、不手改副本、不改发布目录结构

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 计划技能正文改为按证据等级准入 | done | 关键词断言输出 `plan contract updated`；`skills/devflow-plan/SKILL.md` 15073 字节、`references/plan-methods.md` 8058 字节；`node scripts/devflow-budget.js` PASS（单文件余 287 字节）。实现偏差记录：初稿写为英文导致 Verify 的 `侦查` 关键词缺失，按仓库既有括号释义惯例补中文对照（`## Recon` (侦查记录)）后单文件超限 413 字节，收紧新加段落并删两行冗余反合理化条目腾出空间 |
| 2 | 计划 checker 增加三组校验与反向用例 | done | `node scripts/devflow-plan.js --self-test` 输出 DevFlow plan self-test passed；新增 7 例（顺序执行不要求通道、扇出缺通道失败、扇出带通道通过、缺 Recon 失败、散文侦查行失败、none 加理由通过、Not doing 无来源失败）。实现中发现并修复一处真实缺陷：`Interfaces` 未参与字段边界判定，导致 `Files` 块吞掉接口行（真实计划同样会踩），已加 `v2ConditionalFields` 参与边界 |
| 3 | 活体面旧字段断言与十处漂移修正 | done | `npm test` 输出 DevFlow validation passed；`node scripts/devflow-budget.js` PASS，`devflow-prove/SKILL.md` 由 15341 降至 15337 字节；`node plugins/devflow/scripts/verify-plugin.js` 通过（14 skills / 5 self-tests）。断言落在 `scripts/validate-devflow.js` 的 `liveContractSurfaces`：skills 全部 md、commands 全部 toml、AGENTS.md、README.md，命中即失败，除非该行同时含 legacy 语境词。契约外发现两处同族残留并同批修正：`commands/devflow-spec.toml:43-46` 整段描述 v1 计划头部、`skills/devflow-prove/references/flow-self-test.md:699` 的 legacy 场景行未写明 legacy。Codex 插件副本无同步脚本，以按交集镜像的方式刷新 10 个文件 |
| 4 | 零回归对比 | done | `plans 32 exit-code diffs 0`；用 `git show HEAD:scripts/devflow-plan.js` 取改动前脚本对 32 份计划逐份比较退出码 |
| 5 | 分发同步与版本 bump | done | sync-assets 连续两次输出逐行相同（1/14/11/6）；`node dsh/plugins/dsh-devflow/test/sync.test.js` 通过五场景；`node plugins/devflow/scripts/verify-plugin.js` 通过（14 skills / 5 self-tests）；版本 bump：根 0.6.0、dsh-devflow 0.10.0、Codex 0.4.0；`npm run verify:all` 退出码 0 |
