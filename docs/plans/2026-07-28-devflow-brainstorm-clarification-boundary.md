# DevFlow Brainstorm Clarification Boundary Plan

Goal: 将 `devflow-brainstorm` 收窄为只确认做什么的需求澄清 skill，并让全部运行时入口、文档、安装验证和防回归校验遵守同一边界。
Architecture: Brainstorm 读取事实、语义回显、逐项澄清并输出固定 `Confirmed request` 摘要后停止；`devflow-core` 保有后续路由，其他专属 skill 保有设计、Cut、Spec、Plan、Build、Prove、恢复和文档职责。
Tech Stack: Markdown、TOML、JSON、现有零依赖 Node.js 校验脚本。
Source: docs/specs/2026-07-28-devflow-brainstorm-clarification-boundary.md
Spec coverage: R1-R4 由 Task 1 覆盖；R5 由 Task 2 覆盖；R6 由 Task 3 与 Task 4 覆盖；R7 由 Task 4 与 Task 5 覆盖。
Cut Decision: CUT_PASS。允许修改现有 skill、引用、运行时入口、产品说明与现有校验；复用既有安装清单和 Node 校验框架；不新增 skill、依赖、目录、命令或通用框架；验证必须覆盖职责收窄、触发、宿主适配及两种安装路径。

## Global Constraints
- 仅修改 `d:/Project/Github/DevFlow-Core`；不修改 `D:/Project/Github/superpowers`。
- 保留 Semantic Echo-Back、事实优先、一次一个问题和理解修订。
- Brainstorm 结束时只能输出固定摘要，不得决定方案、路径、深度或下游 handoff。
- `devflow-core` 负责在澄清完成后按任务事实和用户请求选择生命周期 skill。
- 不新增依赖、命令、目录、安装机制或第二个澄清 skill。

Task: 收窄 Brainstorm 主 skill 与访谈引用
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | 以单一澄清流程、停止条件和固定摘要替代设计与生命周期控制内容
- Modify: skills/devflow-brainstorm/references/interview-discipline.md | 保留访谈纪律并删除设计、文档、恢复和交接职责
Interfaces:
- Consumes: 用户请求、必要项目事实与用户对语义回显的确认或纠正
- Produces: 固定 `Confirmed request` 摘要及 `Status: clarified` 终态
Steps:
- [ ] 修改 `skills/devflow-brainstorm/SKILL.md` 的 frontmatter、流程、输出、反合理化和验证章节，使其只覆盖事实读取、语义回显、目标/范围/不包含项/约束/验收澄清、理解修订及摘要后停止。
- [ ] 修改 `skills/devflow-brainstorm/references/interview-discipline.md` 的问题优先级、提问规则和输出合同，使其只支撑主 skill 的一次一个问题与固定摘要。
- [ ] 搜索两个文件中的 Fast Exit、A/B/C、方案比较、设计合同、下游 skill、PUA、ADR、文档和视觉编排术语，确认不存在活动职责说明。
Acceptance: 两个文件都保留语义回显和一次一个问题；主 skill 包含全部固定摘要字段，且不再承担设计或生命周期编排。
Verify: node scripts/validate-devflow.js && node scripts/validate-skill-triggers.js
Comments: none — Markdown 职责合同使用标题和固定输出块表达意图。
Not doing: 不改动 `devflow-spec`、`devflow-plan`、`devflow-cut`、`devflow-build`、`devflow-prove` 或 `devflow-pua` 的内部职责。

Task: 将澄清后的路由所有权归回 Core 与宿主入口
Files:
- Modify: skills/devflow-core/SKILL.md | 将 Brainstorm 定义为澄清节点，并由 Core 消费摘要后选择后续生命周期
- Modify: skills/devflow-core/references/core-methods.md | 将 Brainstorm First 的方法合同收窄为需求确认
- Modify: AGENTS.md | 更新短运行时路由、停止门禁与 Brainstorm 描述
- Modify: CLAUDE.md | 更新 Claude 入口中的 Brainstorm 责任和停止门禁
- Modify: .codebuddy/rules/devflow-core/RULE.mdc | 更新 CodeBuddy 运行时链路与 Brainstorm 规则
- Modify: .github/copilot-instructions.md | 更新 Copilot 的澄清和后续路由说明
- Modify: .github/instructions/devflow.instructions.md | 更新 VS Code 作者规则中的职责边界
- Modify: .github/prompts/devflow.prompt.md | 更新 `/devflow` 风格提示中的流程步骤
- Modify: .claude/commands/devflow-core.md | 更新 Claude 命令中的 Brainstorm 触发与澄清终态
- Modify: commands/devflow.toml | 更新通用命令中的 Brainstorm 触发、终态和 Core 路由职责
- Modify: hooks/devflow-session-start.js | 更新会话注入内容，使其提示澄清后由 Core 路由
Interfaces:
- Consumes: `Confirmed request` 摘要、路由事实与用户明确要求
- Produces: Core 选择的 Spec、Cut、Plan、Build、Prove 或 Recovery 后续入口
Steps:
- [ ] 修改 `skills/devflow-core/SKILL.md` 和 `skills/devflow-core/references/core-methods.md` 的路由、Capability Dispatch、Method 2 与交接说明，使 Core 而非 Brainstorm 决定后续生命周期。
- [ ] 修改 `AGENTS.md`、`CLAUDE.md`、`.codebuddy/rules/devflow-core/RULE.mdc`、`.github/copilot-instructions.md`、`.github/instructions/devflow.instructions.md`、`.github/prompts/devflow.prompt.md`、`.claude/commands/devflow-core.md`、`commands/devflow.toml` 与 `hooks/devflow-session-start.js`，删除将 A/B/C、方案设计或 handoff 赋予 Brainstorm 的文案。
- [ ] 修改 `AGENTS.md`、`CLAUDE.md`、`.codebuddy/rules/devflow-core/RULE.mdc`、`.github/copilot-instructions.md`、`.github/instructions/devflow.instructions.md`、`.github/prompts/devflow.prompt.md`、`.claude/commands/devflow-core.md`、`commands/devflow.toml` 与 `hooks/devflow-session-start.js`，保留 Fast、Design-lite、Design、Build、Recovery、Cut、Prove 规则，并明确预期结果为 Core 在 Brainstorm 摘要后路由。
Acceptance: 所有宿主入口均将 Brainstorm 描述为需求澄清器，且没有入口要求 Brainstorm 选择深度、生成设计合同或派发下游 skill。
Verify: node scripts/validate-host-adapters.js && node scripts/validate-skill-triggers.js
Comments: `hooks/devflow-session-start.js` 保留现有 context 数组结构；仅在新增难以直观理解的校验条件时添加原因注释。
Not doing: 不改变 Fast、Design-lite、Cut、Build、Prove 或 PUA 的触发词与安全门禁。

Task: 同步调用图、README 和产品记录
Files:
- Modify: skills/skill-call-diagram.md | 使图和文本链路显示 Brainstorm 摘要返回 Core 后再路由
- Modify: README.md | 更新默认流程、核心 skill 表、示例工作流与 Brainstorm 章节
- Modify: docs/PRD.md | 更新 Brainstorm 产品要求与运行时路径描述
- Modify: docs/features/devflow-core.md | 记录新的当前能力、关键决定、约束与版本历史
- Modify: docs/features/validation-harness.md | 记录职责边界验证覆盖与版本历史
Interfaces:
- Consumes: 已批准 Spec 与 Core 的最终路由职责
- Produces: 与实际运行时一致的架构图、用户说明和产品历史
Steps:
- [ ] 修改 `skills/skill-call-diagram.md` 的 Mermaid 图、Runtime Chain 与短规则，使 Brainstorm 的输出先回到 Core，不再分支到 Fast Exit 或 A/B/C。
- [ ] 修改 `README.md`、`docs/PRD.md` 和 `docs/features/devflow-core.md` 的流程、能力表、验收和历史，使其不再把方案比较、深度或设计合同归给 Brainstorm。
- [ ] 修改 `docs/features/validation-harness.md` 的当前覆盖和版本历史，说明固定摘要、负向职责检查和安装传播验证由既有脚本覆盖。
Acceptance: 架构图、README、PRD 和 feature ledgers 对 Brainstorm 的职责及 Core 的路由所有权没有矛盾。
Verify: node scripts/validate-devflow.js && node scripts/report-scenario-coverage.js
Comments: none — 文档的标题、表格和版本历史足以说明变更原因。
Not doing: 不重写或删除历史 specs；不把运行时方法论迁入 `docs/`。

Task: 更新场景、触发与宿主防回归校验
Files:
- Modify: skills/devflow-prove/references/flow-self-test.md | 用澄清摘要和 Core 路由场景替换旧 Brainstorm 设计职责断言
- Modify: scripts/capability-eval-scenarios.json | 映射更新后的 self-test 证据与负向约束
- Modify: scripts/validate-devflow.js | 添加主 skill 的固定摘要正向断言与越界职责负向断言
- Modify: scripts/validate-skill-triggers.js | 更新需求、Spec、架构、Bug 和 Recovery 场景的 Brainstorm 触发证据
- Modify: scripts/validate-host-adapters.js | 更新跨宿主契约与会话注入断言，确保后续路由归 Core
Interfaces:
- Consumes: 运行时 Markdown、TOML、JSON 与 scenario 自测源
- Produces: 对摘要存在、越界职责缺失和 Core 路由所有权的可执行失败信号
Steps:
- [ ] 修改 `skills/devflow-prove/references/flow-self-test.md`，为模糊需求、明确请求、Spec 请求、架构问题和 PUA 重启场景指定 `Confirmed request` 与 Core 路由行为。
- [ ] 修改 `scripts/validate-devflow.js`，新增带函数级原因注释的 Brainstorm 边界校验：要求固定摘要字段与澄清纪律，拒绝 Fast Exit、A/B/C、设计合同、方案比较、PUA 载荷、文档和视觉职责回归。
- [ ] 修改 `scripts/validate-skill-triggers.js`、`scripts/validate-host-adapters.js` 与 `scripts/capability-eval-scenarios.json`，使静态触发、宿主契约和能力场景引用新的摘要终态与 Core 路由。
Acceptance: 删除固定摘要或重新写入任一越界职责会使至少一个现有验证命令失败；更新后的场景不再要求 Brainstorm 比较方案或控制生命周期。
Verify: node scripts/validate-devflow.js && node scripts/validate-skill-triggers.js && node scripts/validate-host-adapters.js && node scripts/capability-eval.js
Comments: 新增 Node 校验函数必须有函数级注释；负向关键字集合只对不直观的职责边界添加行内原因注释。
Not doing: 不新增测试框架、快照、外部服务或模型行为模拟。

Task: 验证两种安装路径传播澄清边界
Files:
- Modify: scripts/validate-installer.js | 在临时目标安装后断言安装的 Brainstorm skill 与引用保留固定摘要和无越界职责
- Modify: scripts/validate-user-installer.js | 在临时用户安装后断言用户运行时保留相同 Brainstorm 合同
Interfaces:
- Consumes: 既有 target 与 user installer 的临时安装目录
- Produces: 已安装运行时包含新 Brainstorm 合同的验证证据
Steps:
- [ ] 修改 `scripts/validate-installer.js`，在现有 create/check 流程中读取已安装 Brainstorm skill 与访谈引用，断言固定摘要字段、语义回显和无旧职责术语。
- [ ] 修改 `scripts/validate-user-installer.js`，在现有 create/check 流程中对用户级安装执行同等的 Brainstorm 合同断言。
- [ ] 保持 `scripts/install-devflow.js` 与 `scripts/install-devflow-user.js` 的现有清单不变，因为它们已经安装主 skill 与访谈引用；通过更新后的验证证明传播而非复制新的安装机制。
Acceptance: target 和 user 安装验证都会在安装产物缺少固定摘要或含已移除职责时失败；安装器文件清单不因本需求新增条目。
Verify: node scripts/validate-installer.js && node scripts/validate-user-installer.js
Comments: 新增安装断言函数使用函数级注释，解释其校验已安装的单一澄清合同。
Not doing: 不修改安装器复制算法、默认覆盖策略、目标路径或用户级范围。
