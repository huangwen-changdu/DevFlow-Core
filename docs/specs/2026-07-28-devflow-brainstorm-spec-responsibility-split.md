# DevFlow Brainstorm and Spec Responsibility Split

## Goal

恢复 `devflow-brainstorm` 的完整需求确认与理解修正能力，并将方案比较、设计合同和设计确认明确交由 `devflow-spec` 负责；`devflow-core` 在每个阶段边界保持生命周期路由权。

## Context

现行 `docs/specs/2026-07-28-devflow-brainstorm-clarification-boundary.md` 将 Brainstorm 收窄为确认需求后立即停止，并同时从其运行时合同中移除了独立的 `Understanding Revision Rule`。这使“职责分摊”变成了能力删减。

已确认的目标职责链为：

```text
用户请求
-> devflow-brainstorm：确认需求、理解修正、Confirmed request
-> devflow-core：决定是否需要 devflow-spec
-> devflow-spec：方案比较、设计合同、设计确认、保存 Spec
-> devflow-core：根据已确认 Spec 决定 Cut、Plan、Build、Prove
```

Brainstorm 不选择路径、深度或下游 skill；Spec 不接管生命周期路由；Core 不替代专属 skill 的内部执行。

## Requirements

1. `devflow-brainstorm` 保留需求澄清职责：最小事实读取、Semantic Echo-Back、一次一个问题、固定 `Confirmed request` 摘要和摘要后停止。
2. `devflow-brainstorm` 必须恢复独立的 `Understanding Revision Rule`：用户对澄清问题的答复若推翻或改变当前理解，必须停止当前问题链，发送更新后的 Semantic Echo-Back（含更新后的假设和理解缺口），等待确认后才继续。
3. `devflow-brainstorm` 不得执行方案比较、设计合同、设计确认、Fast/Design-lite/Design 路由、Depth A/B/C 选择、或下游 skill 派发。
4. `devflow-core` 消费 `Confirmed request`，根据用户请求、风险和任务事实决定是否进入 `devflow-spec`；它保留 Spec 完成后的 Cut、Plan、Build、Prove 路由权。
5. `devflow-spec` 由已确认需求驱动，而非假定 Brainstorm 已产生设计。对需要 Spec 的任务，它必须：
   - 读取已确认需求和完成设计所需的项目事实；
   - 不重新询问已确认的目标、范围、排除项、约束或验收，除非发现与事实冲突或有明确阻塞；
   - 比较至少直接实现、复用/不变更等两个真实可行方案；每个方案写明做什么、不做什么、权衡、影响和验证；
   - 选定最小可用方案，形成包含 `Goal`、`Context`、`Requirements`、`Non-goals`、`Approach`、`Impact`、`Acceptance`、`Verification`、`Code Documentation`、`Open Questions` 的设计合同/Spec；
   - 将 Spec 落盘并请求用户审阅确认。
6. 用户确认 Spec 后，`devflow-spec` 返回“已确认 Spec”给 `devflow-core`；它不得自行派发 Cut、Plan、Build 或 Prove。
7. `devflow-core`、所有宿主入口、命令、会话注入、调用图、README、PRD、feature ledger、self-test、能力场景和静态校验必须描述同一职责链。
8. 静态校验必须同时保护：
   - Brainstorm 的独立理解修正规则与固定澄清摘要；
   - Brainstorm 不重新获得路由和设计职责；
   - Spec 包含方案比较、设计合同和用户设计确认；
   - Core 在 `Confirmed request` 之后和已确认 Spec 之后保留路由权；
   - target/user 安装产物保留上述合同。

## Non-goals

- 不恢复 Brainstorm 的 Fast Exit、A/B/C、路径选择、方案推荐、设计合同、或任何下游 skill 派发。
- 不让 `devflow-spec` 执行 Cut、Plan、Build、Prove 或 Recovery。
- 不新增 skill、依赖、目录、命令、安装机制或第二个设计 skill。
- 不修改外部 `D:\Project\Github\superpowers` 仓库。
- 不修改业务功能。

## Approach

在现有责任所有者之间迁移现有能力，不新增框架层：

1. 在 `devflow-brainstorm` 主 skill 与访谈引用中恢复独立理解修正规则，并保留需求澄清终态。
2. 改造 `devflow-spec` 的输入和流程：从 `Confirmed request` 设计出可审阅 Spec，承接原来被错误删除的方案比较、设计合同和设计确认。
3. 改造 Core 与所有适配入口：明确两个回流点——澄清后回 Core、Spec 确认后也回 Core。
4. 用现有 Node 静态验证和安装验证覆盖新合同；不改安装复制机制。

## Impact

- `skills/devflow-brainstorm/SKILL.md`
- `skills/devflow-brainstorm/references/interview-discipline.md`
- `skills/devflow-spec/SKILL.md`
- `skills/devflow-core/SKILL.md`
- `skills/devflow-core/references/core-methods.md`
- `AGENTS.md`、`CLAUDE.md`、`.codebuddy/rules/devflow-core/RULE.mdc`
- `.github/copilot-instructions.md`、`.github/instructions/devflow.instructions.md`、`.github/prompts/devflow.prompt.md`
- `.claude/commands/devflow-core.md`、`commands/devflow.toml`、`hooks/devflow-session-start.js`
- `skills/skill-call-diagram.md`、`README.md`、`docs/PRD.md`、相关 feature ledger
- `skills/devflow-prove/references/flow-self-test.md`、`scripts/capability-eval-scenarios.json`
- `scripts/validate-devflow.js`、`scripts/validate-skill-triggers.js`、`scripts/validate-host-adapters.js`
- `scripts/validate-installer.js`、`scripts/validate-user-installer.js`

## Acceptance

1. Brainstorm 的运行时合同存在独立 `Understanding Revision Rule`，明确要求理解变化时重新 Echo 并等待确认。
2. Brainstorm 输出完整 `Confirmed request` 后停止，不包含方案比较、设计合同或下游派发。
3. Core 明确在 `Confirmed request` 后决定是否调用 Spec，且在确认 Spec 后继续决定 Cut、Plan、Build、Prove。
4. Spec 明确消费 `Confirmed request`，比较真实方案、选定方案、写入完整 Spec/设计合同，并在用户审阅确认前停止。
5. Spec 确认后不直接 handoff 到 Cut，而是返回 Core。
6. 所有运行时入口和说明材料均与该职责链一致。
7. 删除理解修正规则、让 Brainstorm 恢复设计/路由职责、删除 Spec 的方案比较/设计确认、或让 Spec 直接派发 Cut，都会被至少一个自动校验拦截。
8. 全量本地验证、target installer 验证、user installer 验证和能力场景验证通过。

## Verification

1. `node scripts/devflow-spec.js docs/specs/2026-07-28-devflow-brainstorm-spec-responsibility-split.md`
2. `node scripts/validate-devflow.js`
3. `node scripts/validate-skill-triggers.js`
4. `node scripts/validate-host-adapters.js`
5. `node scripts/validate-installer.js`
6. `node scripts/validate-user-installer.js`
7. `node scripts/capability-eval.js`
8. `npm run verify:all`

## Code Documentation

- Markdown skill、引用和宿主规则通过清晰章节与固定合同表达职责，无需代码注释。
- 新增或实质改变的 Node 校验函数必须有函数级注释，说明它保护的职责边界及失败条件。
- 仅为不直观的负向断言集合添加行内原因注释；避免重复解释断言名称。

## Open Questions

None.
