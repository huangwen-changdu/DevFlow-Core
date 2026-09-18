# 计划契约 v2 落地漂移诊断报告

Status: draft
Date: 2026-09-16
Baseline: commit `dbf262c`
Fate: 本文列出的 P0-1、P0-2 与 P1-1 至 P1-8 已在 `docs/plans/2026-09-16-plan-contract-evidence-density.md` 中修正，并由 `scripts/validate-devflow.js` 的活体面旧字段断言锁住复发，`npm run verify:all` 退出码 0。修正过程中该断言还发现两处同族残留（`commands/devflow-spec.toml` 的 v1 计划头部、`skills/devflow-prove/references/flow-self-test.md` 的 legacy 场景行），已一并处理。本报告保留为改动前的诊断记录，第 7 节的对照结论仍是当前判断。
Scope: `devflow-plan` 产出的计划文档（`docs/plans/`）及其全部下游消费面
Method: 只读比对 + 全仓字段扫描。本报告不改动任何技能、脚本、命令或插件副本。
Evidence: `node scripts/validate-devflow.js` 退出码 0；`node scripts/devflow-plan.js --index` PASS

## 1. 结论摘要

1. **契约瘦身本身是成功的，不建议回退。** v2 拿到两样 v1 真缺的东西：可续跑（`Status:` + `## Progress` 带证据）与可见减法（`Cut` 必须带非空 `Rejected`）。旧计划 26 份里只有 3 份有 `Status`、0 份有证据、0 份记录过真实减法。
2. **真正的问题是两类。** 一类是**契约换了、下游消费面没换**：10 处活体引用已删字段，其中 `commands/devflow-plan.toml` 整份仍是 v1 模板，而它是真实触发入口。另一类是**交接密度从结构保证降级为自由裁量规则**——v1 用 `Prewalk` 三件套把锚点证据强制写进计划，v2 把它移出计划、只留一句"机制不可推时附最小改法"，checker 不验，作者可以不写。
3. **现有 18 项机检照不出第一类问题。** 断言只验新契约"存在"，不验旧字段"消失"，因此漂移可以在全绿状态下长期存活。

## 2. 事实基础

契约切换由 commit `e2ade6d`（计划契约瘦身）落地，执行计划 `docs/plans/2026-09-10-devflow-usability-flow-reconfiguration.md`，其 Goal 原文为「B 深度计划从约 300 行降到 60 行并可续跑」。

| 维度 | v1（2026-07-31 → 09-04） | v2（2026-09-10 起） |
|---|---|---|
| 计划体量 | 277–396 行 | 44–75 行 |
| 头部字段 | `Goal`、`Architecture`、`Tech Stack`、`Source`、`Spec coverage`、`Cut Decision`、`External Skills`、`Global Constraints` | `Status`、`Goal`、`Not doing`、`Cut`、`Source`、`Execution mode`、`Landed` |
| 任务字段 | `Task type`、`Files`、`Interfaces`、`Current behavior`、`Target behavior`、`Change mechanics`、`Call impact`、`Steps`、`Acceptance`、`Verify`、`Comments`、`Not doing` | `Task`、`Files`、`Change`、`Acceptance`、`Verify`、`Not doing` |
| 交接证据 | `Prewalk` 三件套（`Execution Trace`、`Current Handoff Facts`、`Remaining Structured Worklist`）、`## File Structure` 职责表 | 无（改为 `Change` 内按需附最小可执行改法） |
| 续跑记录 | 无 | `## Progress` 每任务一行带证据 |

切换期覆盖缺口：09-10 计划的 `## File Structure` 触达表列了 `commands/devflow.toml`，**未列 `commands/devflow-plan.toml`**，也未列 `skills/devflow-spec/references/spec-plan-methods.md`。两者都是计划生成路径上的活体面。

## 3. 分类一：契约-消费面漂移（建议修）

| # | 位置 | 行 | 仍引用的已删内容 | 后果 | 建议修法 |
|---|---|---|---|---|---|
| P0-1 | `commands/devflow-plan.toml` | 15–53 | 整份 v1：头部 `Architecture` / `Tech Stack` / `Spec coverage` / `Cut Decision` / `External Skills`；任务模板 `Task type` / `Interfaces` / `Current behavior` / `Target behavior` / `Change mechanics` / `Call impact` / `Steps` / `Comments`；L53 明文 `Require Current behavior, Target behavior, Change mechanics, and Call impact` | `/devflow-plan` 是真实触发入口，加载它会把模型拉回 v1 契约，产出 v1/v2 混杂计划 | 改写为 v2 头部 + 六字段任务模板 + `## Progress` 表，并保留一句 legacy 说明 |
| P0-2 | `skills/devflow-spec/references/spec-plan-methods.md` | 13 | 「A Plan states Source, **Spec coverage**, Cut Decision, External Skills, exact files or anchors, **interfaces, current and target behavior, mechanics, call impact, verification, comments**, and exclusions」 | 该文件是 `devflow-plan/SKILL.md:18` 明文加载的参考，计划生成路径直接读到 v1 定义 | 该句改为 v2 头部 + 六字段表述；本节 Spec 段落不变 |
| P1-1 | `skills/devflow-build/SKILL.md` | 95 | 「neither `Interfaces` consumes a symbol the other `Produces`」 | fan-out 的并行安全判据不可执行——v2 没有 `Interfaces`，无法判断两任务是否互相消费 | 改为按 `Files` 的 file/symbol 集合是否相交 + 一个任务的 `Change` 是否消费另一个任务的产出判定 |
| P1-2 | `skills/devflow-build/SKILL.md` | 131 | 「the plan's `Comments` field define what needs documentation」 | 注释纪律失去计划侧输入源 | 改为「the Spec's Code Documentation section and project convention」，必要时加 Cut/`Not doing` |
| P1-3 | `skills/devflow-prove/SKILL.md` | 27 | 「approved **File Structure**/Plan boundary, latest **Prewalk Execution Trace** and **Current Handoff Facts**」 | Prove 第 2 步指向不存在的物 | 改为「approved plan task `Files` rows and `## Progress` evidence」；`104`/`105` 已有 legacy 兜底措辞，可照抄其写法 |
| P1-4 | `skills/devflow-prove/SKILL.md` | 29、46、63 | `Prewalk` facts（29）、`File Structure`/`Prewalk` evidence（46、63） | 对抗审查、Proof Selection、Code Review Report 三处锚点失效 | 三处统一改为 task `Files`/`Change` 边界 + Progress 证据 + 已批准 Spec/设计契约 |
| P1-5 | `skills/devflow-prove/references/code-review-checklist.md` | 7 | 「approved File Structure/Plan boundary, latest Prewalk Execution Trace, Current Handoff Facts」 | 审阅第一步读空 | 同 P1-3 措辞，保留一句 legacy 说明 |
| P1-6 | `skills/devflow-prove/references/proof-recovery-methods.md` | 26 | 「the same File Structure boundary, Prewalk evidence」 | 复审基准失效 | 同上 |
| P1-7 | `skills/devflow-core/references/reference-projects.md` | 70 | 「`devflow-plan` and Plan Pack now require `Source:` and **`Spec coverage:`**」 | 声称 v2 仍要求一个已删字段 | 删去 `Spec coverage`，保留 `Source` |
| P1-8 | `README.md` | 256 | DevFlow 的 Superpowers 能力行仍宣称「**`Source` / `Spec coverage`** tracing」 | 用户文档宣称一项 v2 已删的字段 | 该行改为 v2 实际保留的 `Source` 追溯；同时复核同行的 `bite-sized tasks` 表述（v2 已改为按交付单元拆分） |

**副本面**：以上 9 条在 `plugins/devflow/skills/...` 与 `dsh/plugins/dsh-devflow/assets/skills/...` 各有一份同形副本（行号相同）。改完根 `skills/` 后必须运行 `node dsh/plugins/dsh-devflow/scripts/sync-assets.js`（幂等）刷新，再运行 `node plugins/devflow/scripts/verify-plugin.js` 校验逐字节一致。

## 4. 分类二：刻意的取舍（不建议回退，但落点缺失）

v2 删除 `Prewalk` 三件套、`Interfaces`、`Current behavior`、`Target behavior`、`Change mechanics`、`Call impact`、`File Structure`、`Global Constraints`、`Steps`、`Comments`、`Task type` 是设计决定，`skills/devflow-plan/SKILL.md:88` 与 `references/plan-methods.md:9` 都写明了理由：Plan 只保留排序与验收，改法归 Build。

**代价在于补偿机制的性质**：v1 的 `Prewalk` 是**结构化强制**——checker 会因缺失而失败；v2 的替代是「`Change` 在机制不可推时附最小可执行改法」，这是**自由裁量规则**，checker 不验，作者可以合法地不写。计划交接密度因此从结构保证降级为作者自觉。

计划规则把侦查证据的去处写成「留在对话里，或写进 `.copilot/cards/`」。两个落点都不稳：对话随会话结束消失；一次性侦查（某文件某一行的符号位置、某次统计的基线数值）不可复用，也不满足 learning card 的收录条件——现有 26 张卡中没有一张是这类内容。**结果是它既没进计划，也没进卡片。**

这一条与 v2 自己声明的能力目标（「跨会话/跨模型可执行」，见 `docs/features/INDEX.md` 的 DevFlow 计划生成与落地行）存在张力。是否补落点、补在哪里，属于设计决策，不在本报告结论内。

旁证（说明收紧曾过头）：09-10 Spec 原 R2 的「5 任务 ≤60 行」硬上限在 09-11 被自行取消；09-11 另立两条 C 深度需求补 right-sizing 判据与最小改法。

## 5. 分类三：非缺陷（已正确处理，不要误改）

| 位置 | 为什么正确 |
|---|---|
| `scripts/devflow-plan.js`（含 `plugins/devflow`、`dsh` 两份副本）的 `requiredTaskFields`、`codeChangeFields`、`prewalkSections`、`checkPrewalk` 与 L950–1037 自测 | 这是**有意的 legacy 校验分支**。L43 注释写明「含 `## Progress` 且不含 `Prewalk` 视为 v2；否则走 legacy 分支，旧计划无需迁移」。删掉它会破坏 26 份旧计划的校验 |
| `README.md:88` | 已正确描述 v2 六字段 + `Cut`/`Rejected` + `## Progress`，并说明「Legacy plans that still carry `Task type`, `Interfaces`, `Change mechanics`, `Steps`, and `Prewalk` keep validating under the legacy rules」 |
| `skills/devflow-plan/SKILL.md:64、86、88`；`references/plan-methods.md:9` | 有意说明"这些字段不在 v2 契约内"，是规则正文而非残留 |
| `skills/devflow-prove/SKILL.md:104、105` | 已带 legacy 兜底措辞；可作为 P1-3 至 P1-6 的措辞模板 |
| `skills/devflow-prove/references/flow-self-test.md:419、691、696、699`；`scripts/capability-eval-scenarios.json:179` | 场景 7B 在输入里明确限定「an approved **legacy** Plan」，`419` 行也写明「A legacy plan that still carries `File Structure` and `Prewalk` remains valid under the legacy rules」。措辞正确 |
| `docs/2026-07-31-ai-code-quality-engineering.md`、`docs/2026-07-31-harness-flow-review.md`、`docs/specs/`、`docs/plans/` 历史文件 | 历史记录，按 R9「不迁移、不改写」原则保留 |

## 6. 覆盖缺口（不是漂移，但同类风险）

1. **接力场景只有 legacy 版本。** `flow-self-test.md` Scenarios 7B 与 `capability-eval-scenarios.json` 的 `subagent-plan-handoff` 都以 legacy 计划的 `Execution Trace` 为输入，没有 v2 计划的等价场景（v2 靠 `## Progress` 证据 + `Change` 边界接力）。这是**新契约未被独立场景覆盖**，不是残留。
2. **机检缺"旧字段不得出现在活体面"这一维。** 现有断言只覆盖新契约存在性。加这条断言需要注意误报——`SKILL.md:88`、`plan-methods.md:9`、`prove/SKILL.md:104-105`、`flow-self-test.md:419` 都是**合法**的 legacy 提及，简单关键词黑名单会误杀；可行形态是按"字段名 + 冒号 + 值"的模板形态匹配（如 `^Current behavior:`），并限定扫描面为 `commands/*.toml` 与 `skills/devflow-*/SKILL.md`。

## 7. 外部对照：Superpowers 6.3.0（同一问题的另一条路线）

本地克隆：`D:\Project\Github\superpowers`，v6.3.0。其 `skills/writing-plans`、`skills/executing-plans`、`skills/subagent-driven-development` 与本仓库计划契约回答同一个问题——**执行者看不到作者会话上下文时，计划要携带什么**——但结论相反。

| 轴 | Superpowers 6.3.0 | DevFlow 计划 v2 |
|---|---|---|
| 计划体量 | 实测真实计划 1096 行（`docs/plans/2025-11-22-opencode-support-implementation.md`）；写作口径是"假设执行者零上下文、品味可疑" | 44–75 行；"计划不再预先决定每一处编辑" |
| 执行者权限 | `executing-plans`：`Follow each step exactly` | Build 在任务边界内自选最小实现 |
| 跨任务名称与类型 | `Interfaces: Consumes / Produces`，原文理由："A task's implementer sees only their own task; this block is how they learn the names and types neighboring tasks use" | 已删除 |
| 全局约束 | `## Global Constraints`，从 Spec 逐字抄录，对每个任务隐式生效 | 已删除 |
| 侦查证据 | `Modify: exact/path/existing.py:123-145`、`Reference: <file> (lines 40-74)`、步骤内嵌完整代码 | 已删除，规则要求"留在对话里" |
| 交接载体 | **文件**：`scripts/task-brief PLAN_FILE N` 抽出 `task-N-brief.md`，执行者回写 `task-N-report.md`。原文理由："Everything you paste into a dispatch prompt stays resident in your context for the rest of the session and is re-read on every later turn. Hand artifacts over as files." | 计划内联六字段，无独立交接文件 |
| 并行 | "Never dispatch multiple implementation subagents in parallel (conflicts)" | 提供 `fan-out` 模式 |
| 任务级闸门 | 每任务必派 reviewer 子代理（spec 合规与质量两个判决都必需）＋结束时一次全分支 review | 结束时单次 Prove（含对抗审查与代码质量审查） |
| 执行者回报状态 | `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED` | `BUILD_BLOCKED` 单一状态 |

三条可考虑的吸收项（按价值排序），逐条对应第 4、6 节留下的洞：

1. **交接载体用文件，而不是靠"留在对话里"。** 这正好补第 4 节的洞：v2 把侦查证据移出计划后没有落点。Superpowers 的答案不是把证据塞回计划（计划会重新臃肿），而是给交接一个独立磁盘载体，并写明成本理由（贴进 dispatch 的内容会长期驻留上下文并被反复重读）。这与 v2 瘦身目标不冲突——计划不增长，交接有落点。DevFlow 现有的 `## Progress` 证据列只覆盖完成回写，没有执行前简报的对应物。
2. **`Interfaces` 承担的职责真实存在，而 DevFlow 删了字段却留下了它的消费方。** Superpowers 把理由写得很直白：每个任务只看得见自己，跨任务的名称与类型必须由计划承载。`devflow-build/SKILL.md:95` 的 fan-out 判据正是这条需求留下的化石。所以 P1-1 的修法不应只是删句：要么恢复一个最小接口通道，要么明确禁止共享符号的任务进入 fan-out（现有文本只说 `disjoint file/symbol sets`，方向对但缺接口层）。
3. **`NEEDS_CONTEXT` 与 `BLOCKED` 分离。** DevFlow 执行者只有 `BUILD_BLOCKED` 一个出口，而"缺信息"与"卡住了"的处理路径不同（前者补上下文重派，后者升级模型或拆任务）。状态成本极低，诊断价值明确。

不建议吸收：计划内嵌完整代码会让 markdown 与实现形成双份维护，DevFlow 已有 18 项机检，再加一维"计划内代码与实现一致"不划算。Superpowers 的实现者自身也具备仓库读取能力，内嵌代码相对其执行者是过度规定。

**边界**：只读比对，未运行其测试；真实计划样本仅 1 份，格式以 `writing-plans/SKILL.md` 为准。

## 8. 修复顺序（供排期）

| 批次 | 内容 | 改后验证 |
|---|---|---|
| 1 契约面自洽 | P0-1、P0-2、P1-1、P1-2 | `npm run trigger:verify`、`npm run verify:all` |
| 2 Prove 链路 | P1-3、P1-4、P1-5、P1-6、P1-7、P1-8 | `npm run verify:all`；人工确认 Prove 报告格式段与 `104`/`105` 措辞一致 |
| 3 防复发（可选） | 给 `scripts/validate-devflow.js` 加活体面旧字段断言；补一个 v2 计划的接力场景 | `npm test`；反向验证（故意在 `commands/devflow-plan.toml` 插回一个 v1 字段，断言须失败） |
| 4 分发同步 | `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` + 版本 bump + 刷新 Codex 副本 | `node plugins/devflow/scripts/verify-plugin.js`；`sync-assets.js` 二次运行幂等 |

批次 1–2 完成后，需同步更新 `skills/devflow-prove/references/flow-self-test.md` 中受影响的断言文本，并重跑 `npm run verify:all`。

## 9. 事实边界

- **未验证**：没有 v2 计划在跨会话/跨模型执行中失败的实际案例。第 4 节的判断是结构分析，不是故障复现结论。
- **样本量**：v2 计划只有 4 份，任务数 1–7，体量 44–75 行。`44-75 行` 这一档从未在大型计划（10 任务以上）上检验，"跨会话可执行"在该规模下是否成立未知。
- **行号基线**：本文所有 `file:line` 对应 commit `dbf262c`；基线之后的任何改动都会使行号漂移，以字段名与段落标题作为稳定锚点重定位。
- **本轮已核验的绿灯**：`node scripts/validate-devflow.js` 退出码 0（18 个运行时文件、27 张学习卡、宿主与触发契约）；`node scripts/devflow-plan.js --index` 判定 PASS（两个索引与文件系统一致）。
- **外部对照的边界**：第 7 节基于本地只读克隆 `D:\Project\Github\superpowers` v6.3.0，未运行其测试或安装流程；其真实计划样本仅 1 份，格式判据以 `skills/writing-plans/SKILL.md` 为准，不代表其全部版本或分支。
- **本次未做的事**：没有修改任何技能、脚本、命令、插件副本或索引；没有建立需求台账行。选定修复方案后再按常规生命周期建档。
