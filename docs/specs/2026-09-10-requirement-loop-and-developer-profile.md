# 需求闭环与开发者画像 Spec（需求台账 + 跳过留痕 + 闭环报告 + 偏好卡）

Status: draft
Date: 2026-09-10
Source: devflow-core -> Brainstorm Confirmed request（2026-09-10 会话，depth A）

## Goal

把 DevFlow 从"每个节点各自留痕"升级为"一条需求从确认到落地全程可追溯"的闭环：真实需求默认留下标准化记录，跳过文档必须由用户显式选择并留痕；同时让技能在使用中沉淀开发者偏好，下次直接按偏好工作。

## Context

现状盘点（仓库内可核验）：

- 需求本身没有落点。Brainstorm 的 `Confirmed request` 只存在于对话；B/C 深度不产出 Spec，C 深度不产出 Plan，纯 bugfix 也不产出任何记录。会话中断后需求不可追溯。
- 计划与能力已有落点：`docs/plans/INDEX.md`（27 行，含 Status 与落地证据）、`docs/features/INDEX.md`（8 行，含触发词与来源计划）、`docs/plans/*.md` 的 `## Progress` 表。链路在"需求 → 计划/能力"之间断开。
- 跳过是静默的。`skills/devflow-docs-followup/SKILL.md` 规定沉默或含糊视为未批准，回复 `none` 视为"完成但无文件"；没有任何地方记录谁跳过、为什么跳过，因此无法审计"真需求是否落地"。
- 开发者偏好没有沉淀。`.copilot/LEARNING_INDEX.md` 现有 22 张 `project` 卡与 1 张 `global` 卡；卡片 Scope 支持 `global`，但没有偏好类记录，也没有晋升信号计数。
- 已有可复用机制：索引先行与按需展开（`.copilot/LEARNING_INDEX.md`、`docs/features/INDEX.md`）、`scripts/devflow-plan.js` 的 `--index` 与 `--query`、`docs/loop/INDEX.md` 的摘要行惯例、`devflow-learn` 的晋升阶梯与重复纠正门。
- 硬约束：不新增目录、依赖或第二套生命周期；Prove 验证强度不得放松；文档正文的创建仍需用户确认；改动必须过 `npm run verify:all`。

## Requirements

R1 需求台账：新增单文件 `docs/requirements.md`，一行一条真实需求，列为日期、需求、来源、深度、落地物、状态、证据或跳过、更新日。状态取值为 `open`、`designed`、`planned`、`built`、`landed`、`opt-out`、`dropped`。

R2 建档时机：Brainstorm 输出 `Confirmed request` 时建 `open` 行；Core 判为创造性工作但跳过 Brainstorm 的 Design-lite 路径在建档时同时写深度 `C`。纯问答、纯查询、只读验证不建档。

R3 逐节点推进：Spec 批准写 `designed` 并填 spec 路径；Plan 批准写 `planned` 并填计划路径；Build 完成写 `built`；Prove 判定 `PASS` 写 `landed` 并填命令与关键结果。落地物路径必须真实存在。

R4 跳过留痕：用户在完成阶段显式选择不需要文档时，需求行写 `opt-out` 并填写原因与日期；验证证据仍必须填写。沉默或含糊回复不算跳过，默认记录照常生成。跳过只影响文档正文，不影响验证。

R5 Prove 硬条件：`PASS` 要求对应需求行已到终态（`landed` 或 `opt-out`）。需求行缺失或仍为 `open`、`designed`、`planned`、`built` 时不得判定 `PASS`，改为把事实回报 Core。

R6 闭环报告：`node scripts/devflow-plan.js --loop` 输出需求各状态计数、计划落地率（`done` 计划数除以有 `Status` 的计划数）、能力索引行数，以及按置信度阈值筛出的学习卡晋升候选。命令只读，不写文件。

R7 机检：`node scripts/devflow-plan.js --index` 增加需求台账校验——状态值合法、终态必须有证据、`opt-out` 必须有原因、非空落地物路径必须存在、每行日期与需求非空。校验失败非零退出。

R8 开发者偏好：`devflow-learn` 在识别到"怎么做"类重复纠正（同一偏好被纠正两次）时，写入一张 `Scope: global` 的偏好卡，内容限于语言、文档详略、是否先设计、验证命令习惯、审阅风格。

R9 偏好应用：Sense 阶段先匹配 `global` 作用域卡片并把已知偏好应用到本轮（不再询问已确认偏好、按偏好决定文档详略）；`devflow-core` 的 Activation Evidence 增加一行 `Preferences applied` 计数。

R10 晋升闭环：学习卡置信度达到 `0.7` 或同一偏好再次被纠正时，`devflow-learn` 提议把它升为规则或技能改动，并**为该提议建一条需求行**，使"学习 → 需求 → 落地"回到 R1 的台账。

R11 自举：本变更自身的需求行在 Build 阶段补录，状态按 R3 推进到 `landed`，作为台账的第一个真实样本。

## Non-goals

- 不为每条需求新建详情文件；大需求已有 Spec 或 Plan，台账只存一行。
- 不新增目录、npm 依赖或独立脚本；报告与校验都扩展现有 `scripts/devflow-plan.js`。
- 不改 Prove 的验证强度与闸门条件；跳过只豁免文档正文，不豁免验证。
- 不自动创建文档正文；正文创建仍走 `devflow-docs-followup` 的用户确认。
- 不做命中计数、自动晋升或运行时遥测；晋升候选只按置信度与重复纠正判定。
- 不把需求台账做成看板或 Web UI。

## Approach

对比的真实选项：

- 选项一，只加需求台账与 Prove 硬条件：闭环主干成立，但没有可见性与偏好沉淀，R6 与 R8 不满足。
- 选项二，把 `docs/plans/INDEX.md` 扩成"工作台账"：复用文件与 checker，但该文件语义是"计划"，塞入无计划的需求行会让状态与校验规则互相纠缠，且 C 深度需求没有计划可挂。
- 选项三，每条需求一个文件（`docs/requirements/` 目录）：可承载细节，但新增目录与逐文件维护面，与"不新增目录"冲突。
- 选项四，单文件台账 + 跳过留痕 + 闭环报告 + 全局偏好卡（选中）：唯一同时满足 R1 至 R11 的组合。代价是新增一个单文件维护面，并要同步技能、入口与校验。

选定设计：

- D1 台账形态：`docs/requirements.md` 单文件，首行用 `> 摘要:` 行说明用途、维护触发与机检命令，随后一张表。列固定为 `日期 | 需求 | 来源 | 深度 | 落地物 | 状态 | 证据或跳过 | 更新日`。
- D2 状态机与写入方：`open` 由 Brainstorm 或 Core 写，`designed` 由 `devflow-spec` 写，`planned` 由 `devflow-plan` 写，`built` 由 `devflow-build` 写，`landed` 由 `devflow-prove` 写，`opt-out` 由 `devflow-docs-followup` 在用户显式跳过时写，`dropped` 由 Core 在需求作废时写。每次只允许推进到下一状态或终态，不回退。
- D3 跳过语义：`opt-out` 是终态，必须同时有证据与原因；没有原因视为校验失败。这样"跳过"是用户的选择，而不是流程的默认。
- D4 报告与校验：`--loop` 只读输出计数与候选；`--index` 承担台账结构校验；两者共用现有参数解析与 `--json` 输出。
- D5 偏好卡：沿用 `.copilot/cards/` 与 `Scope: global`，不新增存储；Sense 按 `global` 优先、`project` 其次的顺序匹配，只读命中卡。
- D6 闭环回流：晋升提议本身写成需求行，复用 R1 台账，不新增队列或待办系统。
- D7 兼容：没有需求台账的项目不报错，Sense 与 Prove 按"缺失不阻塞"处理；已有项目首次运行 `--index` 时若台账不存在，只提示而不失败，直到台账被创建。

## Impact

- 技能：`devflow-core`（建档、偏好应用与 Activation Evidence）、`devflow-brainstorm`（确认后建档）、`devflow-spec`（写 `designed`）、`devflow-plan`（写 `planned`）、`devflow-build`（写 `built`）、`devflow-prove`（终态硬条件与写 `landed`）、`devflow-docs-followup`（跳过留痕）、`devflow-learn`（偏好卡与晋升回流）。
- 校验与分发：`scripts/devflow-plan.js`（`--loop` 与台账校验）、`scripts/validate-devflow.js`（断言）、`package.json`（如新增 npm 脚本）、DSH 资产与 Codex 插件镜像由 `sync-assets.js` 刷新。
- 文档：新增 `docs/requirements.md`；更新 `docs/features/INDEX.md`（新增"需求闭环"能力行）、`README.md`、`docs/features/devflow-core.md`、`docs/iteration-plan.md`。
- 入口：`AGENTS.md`、`skills/devflow-core/references/core-methods.md`、`commands/devflow.toml` 增加台账与偏好说明；路由与 A/B/C 语义不变。
- 兼容：无台账的项目不报错；旧计划与旧 spec 不迁移。

## Acceptance

- A1 全链路：一个真实需求从建档到 `landed`，需求行按 `open`、`designed`、`planned`、`built`、`landed` 顺序推进，落地物路径可打开。
- A2 跳过留痕：用户显式说不需要文档时，需求行变 `opt-out` 且含原因与证据；沉默或含糊回复不产生 `opt-out`。
- A3 Prove 硬条件：需求行缺失或非终态时 `devflow-prove` 判定失败并回报事实，不出现 `PASS`。
- A4 机检有效：状态非法、终态缺证据、`opt-out` 缺原因、落地物路径不存在四类问题都让 `node scripts/devflow-plan.js --index` 非零退出。
- A5 闭环报告：`node scripts/devflow-plan.js --loop` 打印各状态计数、计划落地率、能力行数与晋升候选，退出码为零。
- A6 偏好生效：同一"怎么做"的纠正出现两次后产生一张 `global` 偏好卡；下一次 Sense 应用该偏好并在 Activation Evidence 显示非零计数。
- A7 闭环回流：置信度达到阈值的卡片产生一条晋升需求行，该行出现在台账中。
- A8 `npm run verify:all` 全绿，`npm run route:verify` 仍通过。

## Verification

- `node scripts/devflow-spec.js docs/specs/2026-09-10-requirement-loop-and-developer-profile.md`
- `node scripts/devflow-plan.js --index` 与 `node scripts/devflow-plan.js --loop`
- 反向验证：故意制造状态非法、终态缺证据、`opt-out` 缺原因、落地物路径不存在四类问题，确认非零退出
- `npm run verify:all` 与 `npm run route:verify`
- 轻路径演练：一个真实小需求走 C 深度，确认建档、推进到 `landed`、能力行与偏好卡按需生成
- `git diff --check`

## Code Documentation

- `scripts/devflow-plan.js`：需求台账的列名映射、状态白名单、终态校验规则与 `--loop` 输出字段需要注释，因为它们是外部契约。
- 技能文件：`devflow-prove` 的终态硬条件、`devflow-docs-followup` 的跳过留痕、`devflow-learn` 的偏好卡与回流规则，各写一句 WHY，避免只留规则。
- `docs/requirements.md` 的摘要行说明用途、维护触发与机检命令，沿用 `docs/loop/INDEX.md` 惯例。
- 其余为文档型改动。

## Open Questions

- Q1 台账路径用 `docs/requirements.md` 还是并入计划索引？建议独立单文件，语义清晰且 C 深度需求也有落点。
- Q2 `--loop` 作为新参数还是 `--index --loop`？建议同一脚本的新参数，保持一个入口。
- Q3 偏好卡的加载顺序先 `global` 还是先 `project`？建议先 `global`，数量少且跨项目复用。
- Q4 需求行标识用日期加短名还是递增编号？建议日期加短名，与 spec、plan 命名一致。
