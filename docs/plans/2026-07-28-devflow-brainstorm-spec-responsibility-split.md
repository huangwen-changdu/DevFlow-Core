# DevFlow Brainstorm and Spec Responsibility Split Plan

Goal: 恢复 `devflow-brainstorm` 的独立 Understanding Revision Rule，同时让 `devflow-spec` 承担方案比较、设计合同与设计确认，并由 `devflow-core` 在确认需求和确认 Spec 两个边界持续掌握生命周期路由。
Architecture: 不新增 skill、命令或安装机制；Brainstorm 只产出可重新确认的 `Confirmed request`，Core 决定是否进入 Spec，Spec 从已确认需求形成并等待确认设计合同，随后将已确认 Spec 返回 Core，再由 Core 选择 Cut、Plan、Build、Prove。
Tech Stack: 既有 Markdown、TOML、JSON 与零依赖 Node.js 校验脚本。
Source: docs/specs/2026-07-28-devflow-brainstorm-spec-responsibility-split.md
Spec coverage: R1-R3 由 Task 1 覆盖；R4-R6 由 Task 2 覆盖；R7 的运行时与说明入口由 Task 3 和 Task 4 覆盖；R8 的静态、能力、target installer 与 user installer 回归覆盖由 Task 5 覆盖。
Cut Decision: CUT_PASS；允许修改既有职责合同、宿主入口、说明材料和 Node 校验。复用现有 skill、命令、安装清单与验证框架；不新增 skill、依赖、目录、命令、安装复制机制或通用框架。验证约束为覆盖 Brainstorm 理解修正、Spec 设计确认、Core 两个路由边界与两种安装产物。

## Global Constraints
- 仅修改 `d:/Project/Github/DevFlow-Core`，不修改外部仓库。
- `devflow-brainstorm` 不恢复方案比较、设计合同、设计确认、深度选择、路由或下游派发。
- `devflow-spec` 不执行或直接派发 Cut、Plan、Build、Prove、Recovery。
- `devflow-core` 只路由，不代替 Brainstorm 澄清或 Spec 设计执行。
- 保持现有 Node 校验和安装复制清单；仅强化其断言。
- 不改写历史 spec 或历史 plan；产品 ledger 追加本次边界修正记录。

Task: 恢复 Brainstorm 理解修正合同
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | 增加独立 `Understanding Revision Rule`，使理解变化时重新 Echo 并等待确认
- Modify: skills/devflow-brainstorm/references/interview-discipline.md | 明确理解修正中断当前提问链、重新回显和重新确认的访谈纪律
Interfaces:
- Consumes: 用户请求、项目事实、用户确认或纠正
- Produces: 经确认的固定 `Confirmed request`；理解变化时先输出新的 Semantic Echo-Back
Steps:
- [ ] 修改 `skills/devflow-brainstorm/SKILL.md` 的职责、澄清流程、反合理化和验证章节，加入独立的 `Understanding Revision Rule`：答复推翻当前理解时停止原问题链，更新事实、假设和理解缺口，重新 Semantic Echo-Back 并等待确认。
- [ ] 修改 `skills/devflow-brainstorm/references/interview-discipline.md` 的 Clarification Loop、Semantic Echo-Back 和规则，使“更正后重新 Echo”成为显式规则而非隐含一句话。
- [ ] 搜索 `skills/devflow-brainstorm/SKILL.md` 与 `skills/devflow-brainstorm/references/interview-discipline.md`，确认不含 Fast Exit、Depth Selection、Approach comparison、Design Contract 或下游 skill 派发职责。
Acceptance: Brainstorm 有可独立引用的 Understanding Revision Rule；任何改变理解的答复都不能直接进入下一问题或摘要，必须重新回显并获确认；它仍只输出需求确认摘要。
Verify: node scripts/validate-devflow.js && node scripts/validate-skill-triggers.js
Comments: none — Markdown 标题、规则与固定输出合同表达职责。
Not doing: 不将方案选择、设计合同、设计确认或生命周期路由放回 Brainstorm。

Task: 让 Spec 承接设计合同并回流 Core
Files:
- Modify: skills/devflow-spec/SKILL.md | 从 `Confirmed request` 生成方案比较和可审阅设计合同，确认后返回 Core
- Modify: skills/devflow-core/SKILL.md | 在确认需求后决定是否进 Spec，并在确认 Spec 后选择 Cut、Plan、Build、Prove
- Modify: skills/devflow-core/references/core-methods.md | 更新 Brainstorm Clarification、Spec Document 与 Plan Pack 的职责和回流边界
- Modify: commands/devflow.toml | 同步通用命令的 Brainstorm、Core 与 Spec 链路
- Modify: commands/devflow-spec.toml | 同步 Spec 的方案比较、设计确认和返回 Core 停止条件
Interfaces:
- Consumes: Brainstorm 的 `Confirmed request`、必要项目事实与用户对 Spec 的审阅结论
- Produces: 已确认 Spec 返回 `devflow-core`；Core 选择的后续生命周期入口
Steps:
- [ ] 修改 `skills/devflow-spec/SKILL.md` 的输入、流程、输出、反合理化和验证，要求比较直接实现及复用/不变更等真实方案，写明权衡，形成包含固定章节的设计合同/Spec，并在用户确认前停止。
- [ ] 修改 `skills/devflow-core/SKILL.md` 与 `skills/devflow-core/references/core-methods.md` 的 Route、Capability Dispatch、Method 2 和 Method 10，使 Core 在 `Confirmed request` 后决定是否调用 Spec，并在“已确认 Spec”后决定 Cut、Plan、Build、Prove。
- [ ] 修改 `commands/devflow.toml` 与 `commands/devflow-spec.toml`，使命令入口不再假设 Brainstorm 交付已批准设计，也不让 Spec 直接 handoff 到 Cut。
Acceptance: Spec 明确消费已确认需求、比较方案、生成并等待确认设计合同；用户确认后，只有 Core 能选择后续生命周期 skill。
Verify: node scripts/devflow-spec.js docs/specs/2026-07-28-devflow-brainstorm-spec-responsibility-split.md && node scripts/validate-devflow.js && node scripts/validate-skill-triggers.js
Comments: none — 现有 Markdown 合同通过章节、固定输出和停止条件表意。
Not doing: 不让 Spec 重问已确认的请求字段；不让 Spec 执行 Cut、Plan、Build、Prove 或 Recovery。

Task: 同步所有宿主运行时入口
Files:
- Modify: AGENTS.md | 更新共享路由、Skill 边界和停止门禁
- Modify: CLAUDE.md | 同步轻量 Claude 入口的三方职责
- Modify: .codebuddy/rules/devflow-core/RULE.mdc | 同步 CodeBuddy 生命周期与 STOP 门禁
- Modify: .github/copilot-instructions.md | 同步 Copilot 的确认需求、Spec 设计和 Core 路由说明
- Modify: .github/instructions/devflow.instructions.md | 同步作者规则中的职责合同
- Modify: .github/prompts/devflow.prompt.md | 同步 DevFlow Prompt 的阶段与回流点
- Modify: .claude/commands/devflow-core.md | 同步 Claude 命令的 Brainstorm、Spec 与 Core 责任
- Modify: hooks/devflow-session-start.js | 注入确认需求后由 Core 决定 Spec、以及确认 Spec 后回 Core 的简短上下文
- Modify: skills/skill-call-diagram.md | 更新 Mermaid 图、Runtime Chain 与短规则的两个 Core 回流点
Interfaces:
- Consumes: 统一的 Brainstorm、Spec、Core 责任合同
- Produces: 各宿主可见的相同路由与停止条件
Steps:
- [ ] 修改 `AGENTS.md`、`CLAUDE.md`、`.codebuddy/rules/devflow-core/RULE.mdc`、`.github/copilot-instructions.md`、`.github/instructions/devflow.instructions.md` 与 `.github/prompts/devflow.prompt.md`，将 Brainstorm 描述为“确认需求和理解修正”，Spec 描述为“方案比较、设计合同与设计确认”，并保留 Core 的两个路由点。
- [ ] 修改 `.claude/commands/devflow-core.md`、`hooks/devflow-session-start.js` 与 `skills/skill-call-diagram.md`，使 Runtime Chain 显示 `Confirmed request -> Core -> Spec -> confirmed Spec -> Core`，且 Spec 不直接连到 Cut。
- [ ] 搜索所有上述入口的 `Confirmed request`、`devflow-spec`、`devflow-cut` 和 `Core` 描述，排除“Brainstorm 已产出设计”“Spec 直接 handoff Cut”及不一致的旧职责链。
Acceptance: 每个运行时入口都可看出 Brainstorm 的理解修正、Spec 的设计确认和 Core 的两个路由边界；没有入口赋予 Brainstorm 设计/路由权或赋予 Spec 后续派发权。
Verify: node scripts/validate-host-adapters.js && node scripts/validate-skill-triggers.js
Comments: `hooks/devflow-session-start.js` 保留数组结构；不增加无必要代码注释。
Not doing: 不增加新 host、hook、命令或安装入口。

Task: 同步产品文档和能力历史
Files:
- Modify: README.md | 更新默认流程、Core Skills、Brainstorm 说明和 Copyable Workflow
- Modify: docs/PRD.md | 更新产品意图、R3 生命周期要求与相关验收
- Modify: docs/features/devflow-core.md | 更新当前能力、Key Decisions、Known Constraints 和新增版本记录
- Modify: docs/features/validation-harness.md | 更新当前验证覆盖和新增版本记录
- Modify: skills/devflow-prove/references/flow-self-test.md | 在需求、Spec、架构和 Recovery 场景声明理解修正、Spec 设计确认与两次 Core 路由
- Modify: scripts/capability-eval-scenarios.json | 将能力场景证据映射至更新后的自测用语
Interfaces:
- Consumes: 已批准 Spec 和统一运行时合同
- Produces: 与运行时及验证一致的用户说明、产品记录和能力场景
Steps:
- [ ] 修改 `README.md`、`docs/PRD.md` 和 `docs/features/devflow-core.md`，删除“Brainstorm 产出方案选项”的描述，明确 Spec 的方案比较/设计确认责任与 Core 的路由回流。
- [ ] 修改 `docs/features/validation-harness.md`，说明新的静态与安装断言保护理解修正、Spec 设计合同和 Core 路由，而不是仅保护 Brainstorm 职责删减。
- [ ] 修改 `skills/devflow-prove/references/flow-self-test.md` 和 `scripts/capability-eval-scenarios.json`，使场景证据要求：用户纠正理解时重 Echo，需设计的已确认需求交 Core 选择 Spec，确认 Spec 后回 Core。
Acceptance: README、PRD、两个 feature ledger、自测和能力场景不再将“职责分摊”表述为 Brainstorm 能力删减，且所有叙述均与运行时链路一致。
Verify: node scripts/report-scenario-coverage.js && node scripts/capability-eval.js
Comments: none — 文档标题、表格和版本历史表达变更原因。
Not doing: 不移动 runtime 方法来源到 `docs/`，不改写旧的历史 Spec 或 Plan。

Task: 扩展职责边界与安装产物防回归
Files:
- Modify: scripts/validate-devflow.js | 保护 Understanding Revision Rule、Spec 方案比较/设计确认、Core 两次路由和负向职责边界
- Modify: scripts/validate-skill-triggers.js | 更新需求、Spec、架构和 Recovery 的路径与可见触发证据
- Modify: scripts/validate-host-adapters.js | 校验宿主入口及 SessionStart 载荷的双回流职责合同
- Modify: scripts/validate-installer.js | 校验 target 安装的 Brainstorm、Spec、Core 合同
- Modify: scripts/validate-user-installer.js | 校验 user 安装的同一职责合同
Interfaces:
- Consumes: 源仓库与临时 target/user 安装产物中的 Markdown、命令与 hook 文本
- Produces: 缺失理解修正、错误责任回归或安装传播漂移时的明确失败信号
Steps:
- [ ] 修改 `scripts/validate-devflow.js` 的 Brainstorm 边界函数并保留函数级注释，要求独立 `Understanding Revision Rule` 与重 Echo/确认语义；增加 Spec 方案比较、设计合同、用户确认和返回 Core 的正向断言，以及 Brainstorm/Spec 越界职责的负向断言。
- [ ] 修改 `scripts/validate-skill-triggers.js`、`scripts/validate-host-adapters.js`，使样例路径与 hook 断言明确覆盖 `Confirmed request -> Core -> Spec -> confirmed Spec -> Core`。
- [ ] 修改 `scripts/validate-installer.js` 与 `scripts/validate-user-installer.js` 的安装合同函数，要求安装产物含 Brainstorm 理解修正与 Spec/Core 设计路由合同，仍拒绝 Brainstorm 重获设计/路由职责。
Acceptance: 删除 Understanding Revision Rule、删除 Spec 方案比较/确认、让 Spec 直接进 Cut、让 Brainstorm 重获设计/路由任一项，都会令至少一个现有验证命令失败；target 与 user 安装均验证同一合同。
Verify: npm test && npm run trigger:verify && npm run host:verify && npm run install:verify && npm run user:verify && npm run capability:eval
Comments: 新增或实质改动的 Node 校验函数保留函数级注释；只为不直观的负向术语集合保留行内原因注释。
Not doing: 不新增测试框架、fixture、依赖、安装清单项、模型模拟或外部服务。
