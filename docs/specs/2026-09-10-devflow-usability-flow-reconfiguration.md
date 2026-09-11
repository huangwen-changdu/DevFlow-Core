# DevFlow 可用性重构 Spec（轻仪式 + 可续跑施工单 + 自动沉淀）

Status: draft
Date: 2026-09-10
Source: devflow-core -> Brainstorm Confirmed request（2026-09-10 会话，depth A）
Note: 2026-09-11——R2/A2 的「5 任务 ≤60 行」硬上限已取消；计划改为按交付单元拆任务（一任务 = 一可独立验收交付单元），总量随交付单元数增长；见 `docs/requirements.md` 2026-09-11 行。

## Goal

让 DevFlow 从"勉强能用"变成"默认好用"。判据是三件可观测的事：小改动的固定成本明显下降、任何时刻中断都能被下一个会话接着干、每完成一个功能就自动多一条 AI 可检索的功能条目。

## Context

现状摩擦（仓库内可核验）：

- 计划是给 checker 写的：`scripts/devflow-plan.js` 对每个 Code change 任务强制 13 字段，外加 `Prewalk` 三件套（`Execution Trace` 5 种行型、`Current Handoff Facts` 8 条、`Remaining Structured Worklist` 每项 3 子字段且上限 12 项）。近三份计划 277-396 行，平均每任务 34 行。
- 断线不能续：26 份计划仅 3 份有 `Status:`，0 份有勾选或证据，`docs/plans/` 无索引。
- 该省力的节点没省力：26 份计划中 0 份记录过真实减法（`CUT_REDUCE`），Cut Decision 恒为一行模板；2026-08-23「零 view」决策写明 *do not re-decide the implementation mechanism in Build*，Build 只剩照抄。
- 完成不落盘：`docs/features/` 只有 2 份巨型台账（`devflow-core.md` 42KB、v1-v52 历史）与 2 行 README 表，没有"有哪些功能、入口在哪、怎么验证"的条目索引；PRD R8 要求功能台账回写，但全仓无技能或脚本拥有该动作。
- 已有可复用先例：`docs/loop/INDEX.md` 是"索引先行 + 摘要行 + 维护机制"的成熟模式；`.copilot/LEARNING_INDEX.md` 是唯一被机检的知识层。

既有约束（决定可改范围）：

- `scripts/capability-eval-scenarios.json` 的负约束明确要求 `Brainstorm must not choose an approach, route, depth, design contract, or handoff`，因此深度必须继续由用户选择，不能改成 Core 自动判定。
- `scripts/validate-skill-triggers.js` 第 190-192 行断言 `skills/devflow-plan/SKILL.md` 含 `## File Structure`、`Execution Trace`、`Remaining Structured Worklist`；第 196 行断言 `scripts/devflow-plan.js` 含 `maximumWorklistItems`。
- `scripts/validate-devflow.js` 第 173-174 行断言 `devflow-cut` 含 "A/B directly enter `devflow-plan`; C directly enters `devflow-build`"，`devflow-plan` 含 "approved A/B Plan directly enters `devflow-build`"，即 B 深度仍必须产出 Plan。
- `skills/devflow-prove/references/flow-self-test.md` 的 Scenario 5C 与接力场景断言 `File Structure` 与 `Prewalk` 证据。
- 硬约束：不新增目录、依赖或第二套生命周期；不拔 Prove 闸门、对抗审查与学习卡机制；改动必须过 `npm run verify:all`；DSH 打包资产由 `dsh/plugins/dsh-devflow/scripts/sync-assets.js` 生成，不手改。

## Requirements

R1 轻仪式：Design-lite 与 C 深度保持不产出 Spec 与 Plan（既有行为）；A/B/C 门改为给出推荐深度与一行理由，用户可用一句话采纳，不再需要自行比较三个深度；B 深度的计划体积受 R2 约束。

R2 施工单：Plan 仍只在 A/B 深度产出；新格式在 5 任务规模下不超过 60 行，任务字段固定为 `Task`、`Files`、`Change`、`Acceptance`、`Verify`、`Not doing`。

R3 可续跑：计划头部含 `Status:`，正文含 `## Progress` 表（每任务一行：编号、任务、状态、证据）；Build 逐任务回写状态与证据，Prove 判定 PASS 时写入 `Status: done` 与 `Landed:`。

R4 Cut 可见减法：Cut 输出固定四行 `做`、`不做`、`复用`、`验证`，外加必填 `Rejected:`（至少一条被砍掉的候选，或 `none` 加证据说明为何无可砍）；有计划文件时写入计划头，无计划文件时进入 Build Contract 消息。

R5 Build 有界 how：Build 可读当前任务 `Files` 锚点与直接邻居并自行决定最小改法；保留不扩范围、不做全仓重新发现、不静默改计划；锚点矛盾或验证失败仍返回 `BUILD_BLOCKED` 事实给 Core。`Change` 只在跨模块契约、不可逆操作、安全或数据边界、用户要求精确改法时附最小改法。

R6 自动沉淀：Prove PASS 后，若本次 diff 改变用户可感知能力或接口契约，`devflow-learn` 必须新增或更新 `docs/features/INDEX.md` 一行；计划批准与完成时更新 `docs/plans/INDEX.md`；可复用教训仍按现有规则写入 `.copilot/cards/`。

R7 第一跳：新会话 Sense 阶段先读 `docs/features/INDEX.md` 与 `docs/plans/INDEX.md`（存在时），缺失不阻塞任务。

R8 机检：`scripts/devflow-plan.js` 校验新契约并自动识别旧格式继续用现有规则校验；新增索引一致性机检覆盖两个 INDEX 与文件系统；两者接入 `npm run verify:all`。

R9 兼容：26 份旧计划与 18 份旧 spec 不迁移、不改写；索引中标记 `legacy`；新规则只对新产出的计划与 spec 生效。

R10 自举：本次变更自身的 Plan 必须按现行 v1 契约产出并通过现行 checker（新 checker 尚未实现），v2 契约从下一个计划起生效。

## Non-goals

- 不迁移、重写或清理历史计划、历史 spec 与历史台账。
- 不新增目录、npm 依赖、第二套生命周期、向量检索或知识图谱。
- 不取消 Prove 闸门、对抗审查、Cut 强制与学习卡机制，不为减仪式感放松强制结构。
- 不把 A/B/C 深度改为自动判定；不改 `AGENTS.md` 的 8 KiB 契约上限。
- 不做 Web UI、看板或状态面板。

## Approach

对比的真实选项：

- 选项一，只删字段：改动最小，但 Cut 仍只盖章、Build 仍只照抄、完成仍不落盘，R4、R5、R6 不满足。
- 选项二，只加索引与落地回写：解决可追踪与沉淀，但计划依旧臃肿、仪式依旧重，R2 不满足。
- 选项三，自动深度：把 A/B/C 改为 Core 按风险与规模计算。与 `capability-eval-scenarios.json` 的负约束直接冲突，且要改 `AGENTS.md`、`CLAUDE.md`、`README.md`、`commands/devflow.toml`、`.github/` 三处、`.claude/`、`.codebuddy/`、`hooks/` 共 9 个入口面与 4 处断言，回归面远大于收益，放弃。
- 选项四，把 Plan 拆成"设计契约 + 任务清单"两份文档：职责更清晰，但新增文档类型与同步负担，违反最小改动，放弃。
- 选项五，轻仪式 + 施工单 + 有界 how + 双索引 + 机检（选中）：唯一同时满足 R1-R10 的组合。代价是必须同时改技能契约、checker、自测、入口说明与 DSH 资产，并处理旧格式兼容。

选定设计：

- D1 保留用户手选 A/B/C，只降低选择成本。Brainstorm 的门在三个深度上标注推荐项与一行理由，用户回一句采纳即可；Design-lite 与 C 继续不产出 Spec 与 Plan。B 仍必须产出 Plan，以满足 `validate-devflow.js` 的既有断言。
- D2 计划 v2 契约。头部为 `Status`、`Goal`、`Not doing`、`Cut`、可选 `Source`、可选 `Execution mode`、完成后 `Landed`；`## Tasks` 每任务 5 行（`Task`、`Files`、`Change`、`Acceptance`、`Verify`）；`## Progress` 表每任务一行。删除 `Prewalk` 三件套、`Current behavior`、`Target behavior`、`Call impact`、`Interfaces`、`Comments`、`Task type`、`File Structure`、`Global Constraints`、`Architecture`、`Tech Stack`、`Spec coverage`。`Task type` 由 `Files` 路径后缀自动判定（`.md`、`.mdc`、`.toml`、`.txt` 视为文档型）；`Comments` 归入 Build 的 Code Documentation 纪律；`External Skills` 并入 Cut 决策。
- D3 回写协议。Build 每完成一个任务把对应 Progress 行改为 `doing` 或 `done` 并填入证据（命令与关键结果）；Prove 判定 PASS 且存在计划文件时写 `Status: done` 与 `Landed: 日期 · 证据`；FAIL 或 BLOCKED 不改计划 `Status`，只回报事实。
- D4 索引格式。`docs/plans/INDEX.md` 列：日期、计划、Status、来源、落地证据、功能条目。`docs/features/INDEX.md` 列：功能、一句话、入口、Status、验证、关键文件、来源计划、更新日。两者首行使用 `> 摘要:` 行说明用途、维护触发与机检命令；首次需要时懒创建，缺失不阻塞。
- D5 机检。`scripts/devflow-plan.js` 增加 v2 校验与旧格式自动识别（含 `Prewalk:` 或缺 `## Progress` 视为旧格式）；新增 `scripts/devflow-index.js` 校验索引与文件系统一致（每个计划文件有且仅有一行、行内 Status 与文件头一致、`done` 行必须有落地证据、功能行引用的关键文件与来源计划存在、计数一致），支持 `--json` 与 `--self-test`；`package.json` 增加 `index:verify` 并接入 `verify:all`；`scripts/validate-devflow.js` 与 `scripts/validate-skill-triggers.js` 的既有断言同步更新为新契约证据。
- D6 自动沉淀归属。`devflow-prove` 在 PASS 时提供"是否改变用户可感知能力或接口契约"的判定事实；`devflow-learn` 在收尾复盘中据此新增或更新功能条目，并把无变化显式记为 `no-change`。
- D7 第一跳入口。`AGENTS.md` 的 Sense 步骤与 `skills/devflow-core/references/core-methods.md` 加载地图增加"先读两个 INDEX"；命令与宿主入口同步一行说明。
- D8 兼容与分发。旧计划与旧 spec 不改写，索引中标 `legacy`；若新增 `devflow-index.js`，同步加入 `sync-assets.js` 复制组、两个安装器清单与打包校验。

## Impact

- 技能契约：`devflow-core`（Sense 第一跳）、`devflow-brainstorm`（门内推荐项）、`devflow-cut`（四行输出与 `Rejected` 必填）、`devflow-plan`（v2 契约）、`devflow-build`（有界 how 与回写）、`devflow-prove`（PASS 回写与 Scenario 5C 证据）、`devflow-learn`（功能条目 delta）、`devflow-spec` 与 `devflow-docs-followup`（边界不变）。
- 校验与分发：`scripts/devflow-plan.js`、新增 `scripts/devflow-index.js`、`package.json`、`scripts/validate-devflow.js`、`scripts/validate-skill-triggers.js`、`skills/devflow-prove/references/flow-self-test.md`、`dsh/plugins/dsh-devflow/scripts/sync-assets.js` 与打包资产。
- 入口：`AGENTS.md`、`commands/*.toml`、`.github/`、`.claude/`、`.codebuddy/`、`hooks/`、`dsh/agent-presets/` 的 Sense 说明；A/B/C 语义不变，`scripts/validate-route-consistency.js` 不受影响。
- 文档：新增 `docs/plans/INDEX.md` 与 `docs/features/INDEX.md`，更新 `docs/features/README.md`、`docs/features/devflow-core.md`、`docs/iteration-plan.md`、`README.md`。
- 兼容：旧计划与旧 spec 不改写，仅由索引标记 `legacy`；本次变更的 Plan 仍用 v1 契约。

## Acceptance

- A1 轻仪式演练：一个真实的小改动走 C 或 Design-lite 路径，用户确认次数不超过 1 次，不产出 Spec 与 Plan，产出必要的功能条目或 `no-change` 记录。
- A2 新格式 5 任务计划不超过 60 行，`node scripts/devflow-plan.js` 判定 PASS；同一 checker 对旧格式计划仍判定 PASS。
- A3 回写生效：Build 后 `## Progress` 对应行含 `done` 与证据；Prove PASS 后计划头含 `Status: done` 与 `Landed:`。
- A4 索引机检有效：人为制造漏行、状态不符、`done` 无证据三种不一致时 `npm run index:verify` 非零退出；修复后退出码为零。
- A5 `npm run verify:all` 全绿，且 `npm run route:verify` 仍通过。
- A6 第一跳可用：新会话只读 `docs/features/INDEX.md` 就能答出至少 3 个功能及其入口与验证命令。
- A7 Cut 可见减法：新产出的计划头含非空 `Rejected:`，且四行决策齐全。
- A8 自举：本次变更的 Plan 通过现行 v1 checker，未被 v2 规则破坏。

## Verification

- `node scripts/devflow-spec.js docs/specs/2026-09-10-devflow-usability-flow-reconfiguration.md`
- `node scripts/devflow-plan.js --self-test` 与 `node scripts/devflow-index.js --self-test`
- `npm run verify:all` 与 `npm run route:verify`
- 轻路径真机演练：用一个真实小改动记录用户确认次数、计划行数与产物清单
- 反向验证：故意制造索引漏行、状态不符、`done` 无证据，确认机检报错
- `git diff --check`

## Code Documentation

- `scripts/devflow-plan.js`：v2 字段清单、旧格式判定条件、退出码与 `--json` 字段含义需要注释，因为它们是外部契约。
- `scripts/devflow-index.js`：索引与文件系统的对应关系、四种失败模式（漏行、多行、状态不符、证据缺失）与退出码需要注释。
- 技能文件：`devflow-cut` 的 `Rejected` 必填理由、`devflow-plan` 为何只保留这 6 个字段、`devflow-build` 有界 how 的边界、`devflow-prove` 的回写协议，各写一句 WHY，避免只留规则。
- `skills/devflow-prove/references/flow-self-test.md`：更新后的 Scenario 5C 与接力场景要说明新证据来源，避免读者按旧 `Prewalk` 理解。
- `dsh/plugins/dsh-devflow/scripts/sync-assets.js`：若新增复制项，注释说明来源与用途。
- 索引文件、README、迭代计划为文档型改动，沿用仓库现有中英混排与摘要行惯例。

## Open Questions

- Q1 索引校验放新脚本 `scripts/devflow-index.js` 还是并入 `scripts/devflow-plan.js --index`？建议新脚本（关注点分离、可独立自测）；由 Cut 决定。
- Q2 功能条目粒度：框架仓库取技能或命令级，业务项目取用户可感知功能级；是否需要项目级配置？建议不配置，按仓库是否存在 `skills/` 自动判定。
- Q3 计划 `Status: done` 由 Prove 写还是 Build 写？建议 Prove，因为它持有新鲜完成证据。
- Q4 旧计划是否在索引中保留 `legacy` 行？建议保留，便于一次性总览。
