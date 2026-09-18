# 计划契约证据密度与可验伪性重构设计契约

Status: draft
Date: 2026-09-16
Source: devflow-core -> Brainstorm Confirmed request（2026-09-16，depth A）

## Goal

让计划文档里每一处被要求写下的内容都能追溯到"已发生的动作"或"已存在的产物"，从而在恢复跨会话、跨模型交接能力的同时，不给 AI 留下伪造事实依据的空间；并清除 10 处 v1 契约残留，使计划生成路径只承载一套契约。

## Context

现状摩擦与约束（仓内可核验，基线 commit `dbf262c`）：

- **契约漂移 10 处，计划生成路径同时收到两套指令。** `commands/devflow-plan.toml:15-53` 整份仍是 v1 模板，第 53 行明文要求 `Current behavior`、`Target behavior`、`Change mechanics`、`Call impact`；`skills/devflow-spec/references/spec-plan-methods.md:13` 仍以 v1 口径描述计划；`skills/devflow-build/SKILL.md:95`、`:131`，`skills/devflow-prove/SKILL.md:27`、`:29`、`:46`、`:63`，`skills/devflow-prove/references/code-review-checklist.md:7`，`skills/devflow-prove/references/proof-recovery-methods.md:26`，`skills/devflow-core/references/reference-projects.md:70`，`README.md:256` 仍在引用已删字段。
- **v1 的交接证据层不可验伪。** `Prewalk` 三件套（`Execution Trace`、`Current Handoff Facts`、`Remaining Structured Worklist`）是自由文本自述，而 checker 只校验形状（行型、条数、上限 12 项）。形状可以满足而无需真实读取，因此结构本身构成伪造诱因；v1 计划实测 277–396 行。
- **v2 保留下来的两处证据恰好都不可伪造。** `## Progress` 的证据列与 `Landed` 都要求"命令加真实结果"；但锚点侦查证据被移出计划后没有落点——规则要求它"留在对话里"或写进学习卡，而对话随会话结束消失、学习卡不收一次性侦查内容。
- **硬预算。** `skills/devflow-prove/SKILL.md` 为 15341/15360 字节（余 19 字节），`AGENTS.md` 为 6960/8192（余 1232 字节），`skills/` 主体合计 160464/280000 字节。
- **机检覆盖不到这类问题。** 现有 18 项校验只断言新契约"存在"，不断言旧字段"消失"，也不测默认行为，因此上述漂移可以在全绿状态下长期存活。

不可改变的前置条件：

- 26 份 legacy 计划与 4 份 `done` v2 计划不迁移、不改写；`scripts/devflow-plan.js` 的 legacy 分支（`requiredTaskFields`、`codeChangeFields`、`prewalkSections`、`checkPrewalk` 及对应自测）必须保留。
- 三份技能副本必须逐字节一致，副本由 `dsh/plugins/dsh-devflow/scripts/sync-assets.js` 生成，不手改。
- 可选字段缺失一律视为 legacy，默认输出保持向后兼容。

## Requirements

R1 **证据准入规则**：计划中任何被要求的证据项必须能归入两级之一——L1 可重跑命令加其真实输出；L2 从既有产物机械复制（路径真实存在，或字符串在来源文档中确实出现）。不接受"指向存在的路径或符号"作为唯一证据（它只证明存在、不证明被使用），也不接受无引证的自由文本断言。

R2 **头部全局不变量**：计划头部恢复一节项目级不变量，每行一条，从 Spec 的 Non-goals 或 Cut Decision 逐字复制，对全部任务隐式生效。

R3 **命令式侦查载体**：计划恢复一节锚点侦查记录，每行的形态必须是"命令加该命令当时的输出"，而不是读取自述。确实没有侦查需求时，显式写 none 并给出理由。

R4 **跨任务交接通道按机械事实触发**：仅当计划头部的执行模式为 `single-subagent` 或 `fan-out` 时，才要求计划携带跨任务的名称与类型通道；`sequential` 不要求。

R5 **强制而非可选**：R2 至 R4 由 checker 强制，判定条件必须取自计划头部可读字段，不使用需要判断的"按需"。理由：对 LLM prompt，可选格式等于行为删除；只有可机检的触发条件才能保住强制。

R6 **机检测默认行为**：新增校验必须包含反向用例——故意写入一条无命令的散文证据、故意在活体面插回一个 v1 已删字段，两种情况均须非零退出；只断言机制存在的校验不算满足本要求。

R7 **清除契约漂移**：Context 列出的 10 处活体面引用与契约改动同批修正，使计划生成路径只承载一套契约。

R8 **零回归**：26 份 legacy 计划与 4 份 `done` v2 计划在改动前后退出码一致；新增失败规则按记录的 `Status` 门控，`done` 与 legacy 记录不重判。

R9 **预算**：改动后 `npm run verify:all` 与 `npm run budget:verify` 均退出码 0，且 `devflow-prove/SKILL.md` 主体不超过 15 KiB——该文件新增的规则文本必须以等量删减腾出空间。

## Non-goals

- 不迁移、不改写历史计划与历史 spec，不引入新的计划格式版本号。
- 不恢复 v1 的每任务断言字段（`Current behavior`、`Target behavior`、`Call impact`、`Steps`、`Comments`、`Task type`），也不恢复 `## File Structure` 职责表。
- 不采用步骤内嵌完整代码的计划形态。
- 不改执行层：子代理派发协议、执行者回报状态集、执行前简报与执行后报告的文件机制不在本次范围。
- 不改 A/B/C 深度语义与路由边；不新增目录、npm 依赖或脚本文件。

## Approach

对比的真实选项：

- **选项一，只修漂移、契约不动**：风险最低、成本最小，但锚点侦查证据仍然没有落点，交接能力不恢复。不满足 R1 与 R3。
- **选项二，全量恢复 v1 契约**：交接密度最足，但会把已诊断过的摩擦一并请回——平均每任务 34 行的体量、以 checker 礼仪为主的字段集、以及"改法已被计划预先决定、Build 只照抄"的状态；同时违反 R1，因为其中多数字段是自由文本断言。
- **选项三，照搬外部零上下文方案**：交接最不依赖执行者能力，但计划回到千行量级，markdown 与实现形成双份维护；其前提是"无技能、无仓库的零上下文执行者"，与本仓执行者契约（可加载技能、可读仓库锚点）不符。
- **选项四，按证据等级重划字段（选中）**：保留 v2 六字段与两处既成功证据，按 R1 的两级准入恢复头部不变量与命令式侦查载体，跨任务通道由 R4 的机械事实触发，新增校验按 R6 测默认行为。它是唯一同时满足 R1 至 R9 的组合。

选定设计：

- **D1 证据分级作为唯一准入判据**，写入计划技能正文，并作为今后任何字段增删的判据。R1 的两级定义是规则文本的核心，措辞需说明"可重跑"与"可复制"各自防的是什么。
- **D2 头部全局不变量**：形态为逐行复制，来源为 Spec 的 Non-goals 或 Cut Decision；checker 断言每行内容能在来源文档中找到，从而把该节从断言降为复制。
- **D3 命令式侦查载体**：形态为命令加输出；checker 断言每行含可执行命令与其结果，并允许显式 none 加理由。该节承载锚点定位、基线数值、已知风险与停点，取代 v1 的自述式三件套。
- **D4 跨任务通道按执行模式触发**：`single-subagent` 与 `fan-out` 必填，`sequential` 不要求；判定只读计划头部字段，不做语义推断。
- **D5 漂移清理与契约改动同批落地**，避免两套指令再次并存；技能正文中说明"某字段不在当前契约内"的段落属于合法提及，不列入旧字段断言范围。
- **D6 机检三组新增**：活体面旧字段断言、侦查行形态断言、按执行模式的必填断言；每组配反向用例，满足 R6。
- **D7 副本与版本**：改动后运行 sync-assets 刷新两份副本，按既有发布链 bump 插件版本，保持逐字节一致。

## Impact

- **技能契约**：`devflow-plan` 契约正文与 `references/plan-methods.md`；`devflow-build` 的执行交接与注释纪律措辞；`devflow-prove` 的报告与证据措辞（受 19 字节预算约束，须以替换而非追加的方式落地）；`devflow-spec/references/spec-plan-methods.md`；`devflow-core/references/reference-projects.md`。
- **命令与校验**：`commands/devflow-plan.toml` 命令模板；`scripts/devflow-plan.js` 的 v2 校验分支与自测；`scripts/validate-devflow.js` 断言组。
- **分发面**：`plugins/devflow` 与 `dsh/plugins/dsh-devflow/assets` 两份副本、插件版本清单、`README.md` 的能力对比行。
- **文档与台账**：两份 INDEX、`docs/requirements.md`。
- **不涉及**：宿主适配文件、路由边与 A/B/C 语义、执行层派发协议、历史计划与 spec 正文。

## Acceptance

- A1 新产出的计划其侦查载体的每一行都是命令加真实输出，不含读取自述；无侦查需求时显式为 none 并附理由。
- A2 反向验证：故意写入一条无命令的散文证据时 checker 非零退出；故意在命令模板或技能正文插回一个 v1 已删字段时 checker 也非零退出。
- A3 反向验证：执行模式为 `fan-out` 而缺少跨任务通道时校验必须失败；`sequential` 时不因缺少而失败。
- A4 零回归：26 份 legacy 计划与 4 份 `done` v2 计划在改动前后退出码一致。
- A5 `npm run verify:all` 与 `npm run budget:verify` 退出码 0，且 `devflow-prove/SKILL.md` 主体不超过 15 KiB。
- A6 两份副本与根技能逐字节一致，`sync-assets.js` 二次运行输出相同，插件自测通过。
- A7 活体面不再出现 v1 已删字段，10 处漂移全部清除。

## Verification

- `node scripts/devflow-spec.js docs/specs/2026-09-16-plan-contract-evidence-density.md`
- `node scripts/devflow-plan.js --self-test`、`node scripts/validate-devflow.js`、`npm run verify:all`
- 反向验证三例：缺命令的散文证据样本、`fan-out` 缺通道样本、活体面插回旧字段样本，三者均须非零退出
- 零回归对比：用 `git show HEAD:scripts/devflow-plan.js` 取出原脚本，对 26 份 legacy 与 4 份 `done` v2 计划比较改动前后的退出码
- 预算：`npm run budget:verify` 输出 `devflow-prove` 主体字节数与总量，确认不超 15 KiB 上限
- 分发：`node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 连续运行两次比对输出，再运行 `node plugins/devflow/scripts/verify-plugin.js`
- 全仓字段扫描：确认活体面无 v1 已删字段残留，并核对技能正文中合法的 legacy 提及未被误报

## Code Documentation

- `scripts/devflow-plan.js`：证据分级断言、侦查行形态判定、按执行模式的必填判定三处的判定条件与退出码含义需要注释，因为它们是外部契约。
- `scripts/validate-devflow.js`：活体面旧字段断言需要一行说明，写明它防的是契约漂移复发，并列明允许的合法 legacy 提及位置（技能正文中说明某字段不在当前契约内的段落）。
- 技能文件：`devflow-plan` 需为"为何只保留两级证据"与"为何按执行模式触发跨任务通道"各写一句 WHY；`devflow-prove` 因字节受限，新增措辞须替换既有同义表述而非追加。
- 副本以 sync-assets 生成为准，不手改，无需注释。

## Open Questions

- Q1 侦查载体的命令是否由 checker 重跑校验，还是只校验形态、把抽查交给 Prove？建议只校验形态加人工抽查：重跑会把 checker 变成执行器，并扩大退出码语义。由 Cut 决定。
- Q2 全局不变量一节的来源优先级：Spec 的 Non-goals 与 Cut Decision 同时存在时以哪个为准？建议以 Cut Decision 为准并注明来源，因为它是计划前最后一道范围决定。由 Cut 决定。
- Q3 活体面旧字段断言是否需要覆盖 `docs/features/` 与 `README.md`？建议覆盖 `README.md` 的能力对比行，不覆盖 `docs/features/` 的历史台账段。由 Cut 决定。
