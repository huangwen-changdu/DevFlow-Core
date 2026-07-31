# Hybrid Core And Skill Lifecycle Flow

## Goal

保留 `devflow-core` 对需要判断的 lifecycle 路由职责，只将 artifact 和 A/B/C 状态足以唯一决定后继的少数成功边交给当前 skill 内部直连。`devflow-brainstorm` 在完成意图理解和确认后恢复用户选择的 A/B/C 深度分流。

## Context

当前运行时由 Core 在每个 lifecycle artifact 后选择下一 skill。实践表明，这对明确成功后继造成多余模型判断；但 Core 对异常、阻塞、scope 变化、恢复和其它非唯一后继仍有必要。旧版 Brainstorm 曾提供用户选择的 A/B/C，之后被移除。

本次变更不是移除 Core router。目标是把固定成功边从 Core 中拿掉，同时让 Core 保留一份轻量 flow map，说明入口、直接边、返回 Core 的状态和相应的判断责任。

## Requirements

1. `devflow-core` 保留 lifecycle router 职责，负责选择任何非唯一后继，包括 `CUT_REDUCE`、`CUT_REUSE`、`CUT_BLOCKED`、Plan scope drift、`BUILD_BLOCKED`、Prove `FAIL` 或 `BLOCKED`、PUA recovery 和用户意图变化后的下一 owner。
2. Core 维护轻量 flow map，说明创意请求入口、A/B/C 直接成功边、返回 Core 的状态和独立 review 边界；该 map 不得复制各 skill 的详细执行方法。
3. 创意或行为变更请求经 Core 进入 `devflow-brainstorm`。Semantic Echo-Back、请求确认和固定 `Confirmed request` 完成后，Brainstorm 必须展示 A/B/C，由用户选择深度，不能自行推断。
4. 以下成功边由当前 skill 直接进入唯一后继：A 分支 `Brainstorm -> Spec`，B/C 分支 `Brainstorm -> Cut`，A 分支 `Spec -> Cut`，`CUT_PASS` 的 A/B 分支 `Cut -> Plan`，`CUT_PASS` 的 C 分支 `Cut -> Build`，已批准 Plan 的 A/B 分支 `Plan -> Build`，以及完成 Build 的 `Build -> Prove`。
5. A/B/C 是请求携带的流程状态。Spec、Cut、Plan、Build 和 Prove 必须使用该状态判断已定义的直接成功边，不能重新解释用户意图。
6. `CUT_REDUCE`、`CUT_REUSE`、`CUT_BLOCKED`、Plan scope drift、`BUILD_BLOCKED`、Prove `FAIL` 或 `BLOCKED`、PUA recovery 和用户意图变化必须带着事实返回 Core；Core 保留选择重入 Brainstorm、Cut、Plan、Build、Prove、PUA 或停止的职责。
7. Proof 的新鲜证据与对抗性检查、Cut 的缩减或复用确认、Spec 与 Plan 的用户批准、Build Plan Review、PUA 同目标重复失败门槛、Learn 的证据和失效边界均不得弱化。
8. Host adapters、commands、runtime skill contracts、流程图、validators、capability scenarios、installer validators 和长期文档必须同时描述直接成功边与 Core 决策边。
9. 验证应断言 A/B/C 直接成功边、分支状态保持、返回 Core 的异常状态和 Core flow map。验证应拒绝 Core 介入已定义的直接成功边，也应拒绝 skill 擅自处理需要 Core 判断的状态。
10. 不新增运行时依赖、数据库、服务、通用工作流引擎、宿主支持层或独立配置格式。

## Non-goals

- 不移除 Core router 或把所有 lifecycle 流转迁入 skill。
- 不让 Brainstorm 设计实现方案、跳过 Semantic Echo-Back，或选择 A/B/C。
- 不让异常状态自动推进到 Build 或 Prove。
- 不修改与 lifecycle owner 无关的产品能力、安装目标边界或外部 skill 发现机制。

## Approach

比较过的方案：

1. 保留所有 Core 路由。优点是统一；缺点是明确成功后继仍需重复判断，无法解决稳定性问题。
2. 移除所有 Core 路由。优点是规则短；缺点是异常、阻塞和范围变化失去必要的判断 owner。
3. 采用 hybrid flow。Core 维护简短路线图并选择不唯一的下一步；skill 只在成功 artifact 与 A/B/C 使后继唯一时直连。该方案消除多余中转，保留异常和恢复的统一判断，选用此方案。

设计边界：

```text
Core -> Brainstorm -> user-selected A/B/C
A direct success: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove
B direct success: Brainstorm -> Cut -> Plan -> Build -> Prove
C direct success: Brainstorm -> Cut -> Build -> Prove

CUT_REDUCE, CUT_REUSE, CUT_BLOCKED -> Core
Plan scope drift, BUILD_BLOCKED, Proof FAIL or BLOCKED -> Core
PUA recovery and changed intent -> Core
```

Core 的 flow map 只列出上述入口、直接成功边和返回状态。各 skill 保留自己的 gate、artifact、用户确认和详细方法，不在 Core 重复。

## Impact

- `AGENTS.md`、`CLAUDE.md`、`.claude/commands/devflow-core.md`、`.github/`、`.codebuddy/`、`.codex/`、`.workbuddy/`、`commands/` 与 session hook：保留 Core 路由说明，增加直接成功边和返回 Core 状态。
- `skills/devflow-core/`：保留共享启动、方法资料、轻量 flow map 和非唯一后继的选择责任。
- `skills/devflow-brainstorm/`：恢复 Confirmed request 后的 A/B/C 用户选择和分支首站直连。
- `skills/devflow-spec/`、`skills/devflow-cut/`、`skills/devflow-plan/`、`skills/devflow-build/`：将要求 4 的成功边改为直接 handoff，同时保留其它 artifact 返回 Core。
- `skills/devflow-prove/`、`skills/devflow-pua/`、`skills/devflow-learn/`：保留现有 Proof、Recovery 和 Learn 责任，并明确其异常返回 Core 边界。
- `skills/skill-call-diagram.md`、`scripts/validate-devflow.js`、`scripts/validate-skill-triggers.js`、`scripts/validate-host-adapters.js`、`scripts/capability-eval-scenarios.json`、`scripts/validate-installer.js`、`scripts/validate-user-installer.js`：验证 hybrid contract 和安装后可达性。
- `docs/plans/2026-07-30-progressive-context-and-adapter-contract.md`、`docs/PRD.md`、`docs/features/`、`README.md`、`docs/platform-setup.md`：替换 Core-exclusive lifecycle routing 的计划、说明与版本记录。

## Acceptance

1. Core 的可追踪 flow map 同时列出创意请求入口、A/B/C 直接成功边、返回 Core 的异常状态和独立 review 边界。
2. A、B、C 在要求 4 定义的每个成功阶段直接进入唯一后继，状态在链路中保持一致。
3. 非成功或非唯一状态由对应 skill 返回事实给 Core，且 Core 仍可选择下一 owner 或停止。
4. 任一有效文档、skill、adapter、diagram、scenario 或 validator 都不会要求 Core 中转要求 4 的直接成功边，或允许 skill 绕过要求 6 的 Core 判断。
5. 现有 target 和 user 安装验证证明安装树仍包含每个被运行时引用的文件。
6. `npm test`、`npm run trigger:verify`、`npm run host:verify`、`npm run install:verify`、`npm run user:verify`、`npm run capability:verify`、`npm run capability:eval` 和 `git diff --check` 通过。

## Verification

1. 为 A、B、C 直接成功边、Core flow map、Cut 非 PASS、Plan scope drift、Build block、Proof failure、PUA recovery 和用户意图变化更新静态场景断言。
2. 在 package、host、trigger、capability、target-install 与 user-install 验证器中运行相应的现有命令。
3. 用 `node scripts/devflow-spec.js docs/specs/2026-07-31-skill-owned-lifecycle-flow.md` 验证本 Spec。
4. 用 `git diff --check` 检查 Markdown、JSON 与脚本变更的空白错误。

## Code Documentation

为修改过的 validator helper 添加函数级注释，说明它保护的 direct-success 或 Core-decision transition 及其失败条件。Markdown runtime contracts 以流程表、状态名和 owner 名自描述，无需重复性注释。

## Open Questions

None.
