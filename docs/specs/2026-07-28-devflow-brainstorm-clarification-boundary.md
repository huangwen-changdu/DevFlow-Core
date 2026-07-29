# DevFlow Brainstorm Clarification Boundary

## Goal

将 `devflow-brainstorm` 收窄为单一的需求澄清 skill：只确认用户要做什么，不决定怎么做，也不编排后续生命周期。

## Context

当前 `devflow-brainstorm` 同时包含需求澄清、Fast Exit、A/B/C 深度选择、方案比较、设计合同、Spec/Plan/Cut/Build/Prove 交接、恢复、文档和视觉表达规则。这使其从澄清器膨胀为设计与流程控制器。

已确认的目标边界是：该 skill 读取必要事实后，用语义回显和一次一个问题的方式确认目标、范围、不包含项、约束与验收；随后输出固定摘要并停止。`devflow-core` 和各专属 skill 保持后续路由、设计、实施、验证、恢复与文档职责。

本 spec 取代先前 brainstorm specs 中关于该 skill 负责 A/B/C、设计合同和下游交接的现行约束；旧 spec 保留为历史记录，不重写。

## Requirements

1. 将 `skills/devflow-brainstorm/SKILL.md` 的定位、入口条件、流程、输出与验证收敛为需求澄清：
   - 读取完成澄清所需的最小项目事实。
   - 首个用户交互为包含事实、假设与理解缺口的 Semantic Echo-Back，并等待确认或纠正。
   - 以一次一个问题的方式，只补齐目标、范围、不包含项、约束和验收中的真实缺口。
   - 事实可回答的问题直接陈述；业务意图和有歧义的边界必须确认。
   - 理解被纠正时重新回显；确认完成后输出固定摘要并停止。
2. 固定终态摘要必须使用以下字段和语义，不得包含实现方案或流程派发：
   ```text
   Confirmed request:
   - Goal:
   - Scope:
   - Out of scope:
   - Constraints:
   - Acceptance:
   - Open questions:
   - Status: clarified
   ```
3. 从 Brainstorm 本体及其直接引用中移除下列职责的执行规则、强制门禁、输出合同与交接说明：
   - Fast Exit、Path Selection、A/B/C Depth Selection。
   - 方案比较、Method Lens、第一性原理方案选择、设计分段确认、设计合同和设计自审。
   - `devflow-spec`、`devflow-plan`、`devflow-cut`、`devflow-build`、`devflow-prove` 的派发或生命周期链路。
   - PUA 恢复载荷、Coverage Map、旧方案切换规则。
   - ADR、文档落盘和视觉表达编排。
4. 保留并收窄 `references/interview-discipline.md`：它只能说明语义回显、澄清问题优先级、一次一个问题、理解修订和固定摘要格式；不得复制全生命周期或引入设计、文档、恢复职责。
5. 将生命周期所有权明确归回 `devflow-core`：
   - `devflow-core` 消费已澄清需求，依据任务事实和用户明确请求决定是否调用 `devflow-spec`、`devflow-cut`、`devflow-plan`、`devflow-build` 与 `devflow-prove`。
   - 从 `devflow-pua` 返回时，Brainstorm 只按普通澄清流程重新确认目标；恢复诊断、方法切换和覆盖判断保留在 `devflow-pua`。
6. 同步所有实际运行时入口、宿主适配规则、命令说明、安装传播源、README 和校验说明，避免任何现行材料要求 Brainstorm 承担已移出的职责。
7. 扩展现有静态校验和场景覆盖，使其验证：
   - Brainstorm 必须包含 Semantic Echo-Back、一次一个问题和固定 `Confirmed request` 终态摘要。
   - Brainstorm 不得重新出现上述设计、路由、交接、恢复、文档或视觉职责的章节、强制流程或输出合同。
   - `devflow-core` 明确是澄清完成后的后续路由所有者。
   - 安装器与宿主适配产物继续从仓库源文件同步改后的 skill、引用、命令和规则。

## Non-goals

- 不修改 `D:\Project\Github\superpowers`���它只作为对照来源。
- 不新增第二个澄清 skill、框架层、依赖、目录、命令或安装机制。
- 不改变各专属 skill 的内部职责和输出合同。
- 不删除 Semantic Echo-Back、事实优先或一次一个问题的澄清纪律。
- 不重写历史 spec；由本 spec 记录新的现行边界。
- 不在本改动中实现任何业务功能。

## Approach

在现有文件上做最小的职责迁移，而非新增替代机制。

1. 以 `SKILL.md` 作为 Brainstorm 行为的唯一权威来源，删除设计和编排章节，并以澄清输入、澄清循环、停止条件和固定摘要替换。
2. 将引用文件压缩为可复用的访谈纪律，去除流程图、下游交接、设计确认、文档和恢复内容。
3. 将被移出职责的说明迁移到现有所有者：路由和后续链路放在 `devflow-core` 及其运行时入口；恢复规则保留 `devflow-pua`；具体实施、验证与文档仍由其专属 skill 负责。
4. 沿现有安装与宿主适配管线更新源材料，不复制安装产物或引入新的同步路径。
5. 在现有验证脚本中增加聚焦的正向和负向断言，并更新场景覆盖，使旧职责不能因文字或入口漂移而回归。

## Impact

预计修改以下现行表面：

- `skills/devflow-brainstorm/SKILL.md`
- `skills/devflow-brainstorm/references/interview-discipline.md`
- `skills/devflow-core/SKILL.md` 与 `skills/devflow-core/references/core-methods.md`
- `AGENTS.md`、`CLAUDE.md`、宿主规则和 `/devflow` 命令定义中描述 Brainstorm 的部分
- README、运行时调用图及其他面向用户的现行流程说明
- `scripts/validate-devflow.js`、触发验证、场景覆盖和安装器验证中与旧 Brainstorm 责任相关的断言
- 安装器的源清单或映射仅在现有同步机制需要同步这些文件时更新

历史 specs 仅作为背景保留，不在影响范围内。`D:\Project\Github\superpowers` 不受影响。

## Acceptance

1. 调用 `devflow-brainstorm` 时，agent 的行为只能是读取相关事实、回显理解、逐项澄清和输出固定摘要；摘要后不继续决定方案、路径、深度或后续 skill。
2. `Confirmed request` 摘要完整包含 Goal、Scope、Out of scope、Constraints、Acceptance、Open questions 和 `Status: clarified`。
3. Brainstorm 的主 skill 与访谈引用不再含有 Fast Exit、A/B/C、方案比较、Method Lens、设计合同、设计分段确认、下游 handoff、PUA 恢复、文档或视觉编排的活动规则。
4. `devflow-core` 明确承担消费 `Confirmed request` 并路由到专属 lifecycle skill 的责任；它不要求 Brainstorm 选择路径或产生设计方案。
5. 现行规则、命令、README、宿主适配与安装源对 Brainstorm 的描述一致，不会通过任一入口重新要求其越界。
6. 静态校验能够阻止固定摘要缺失、核心澄清纪律缺失以及已移出职责回归。
7. 全仓库相关验证、安装验证和场景覆盖通过；验证不依赖修改外部 Superpowers 仓库。

## Verification

1. 运行 `node scripts/devflow-spec.js docs/specs/2026-07-28-devflow-brainstorm-clarification-boundary.md`。
2. 运行聚焦的 Brainstorm 责任验证、触发验证、场景覆盖、宿主适配验证和安装器验证。
3. 运行 `npm run verify:all`，或在现有验证链不可用时报告具体阻塞项及已执行的等价子集。
4. 对 `devflow-brainstorm` 执行静态正负向检查：确认固定摘要和澄清纪律存在，确认越界章节、强制门禁、设计合同与 handoff 规则不存在。
5. 人工走查两个场景：模糊需求必须先回显再逐项澄清；已充分明确的请求必须直接产出固定摘要并停止。
6. 对比安装目标与用户安装流程的输入清单，确认改后的 skill、引用、规则和命令仍会由既有安装管线传播。

## Code Documentation

- `skills/devflow-brainstorm/SKILL.md` 和 `references/interview-discipline.md` 使用清晰标题、固定输出代码块和职责边界文字，无需新增解释性代码注释。
- 修改校验脚本时，为新增的边界校验函数添加函数级注释，说明它保护 Brainstorm 单一澄清职责及其失败条件。
- 仅对无法从断言名称直接看出意图的负向关键字集合添加行内原因注释；不添加重复实现描述。

## Open Questions

None.
