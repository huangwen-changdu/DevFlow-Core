# DevFlow Code-Level Plan Pack Contract

## Goal

将 `devflow-plan` 产出的 `docs/plans/` 文档从“可读的规格摘要”升级为可直接施工的实现计划：实施者无需再次自行推断改动位置、代码机制、接口变化、调用影响或验证细节。

## Context

当前 Plan Pack 已要求 `Files`、`Interfaces`、`Steps`、`Acceptance`、`Verify`、`Comments` 和 `Not doing`。但 `Files` 只写路径和职责，`Steps` 允许“修改某文件以实现某行为”这类描述；`scripts/devflow-plan.js` 也只用宽泛关键词判断步骤是否具体。因此历史计划可以通过校验，却仍需要 Build 阶段重新定位符号、推导代码改法和补全测试场景，计划与 Spec 的职责边界不够明确。

参考 `D:/Project/Github/superpowers/skills/writing-plans/SKILL.md` 后，保留其有价值的落地原则：精确文件位置、接口签名、代码级步骤、具体测试与预期结果、无占位符和独立可实施任务。不引入其 TDD、逐步提交、worktree、子代理执行、计划目录或执行交接机制。

## Requirements

1. `devflow-plan` 必须把 Plan Pack 定义为施工文档，而不是重复设计 Spec：Spec 保留方案比较和设计决策，Plan 只将已批准范围转化为精确改动指令。
2. 每个代码变更任务的 `Files` 必须为每个 `Create`、`Modify` 或 `Test` 条目注明精确目标位置：新文件明确 `new file`；已有文件至少给出符号名或稳定锚点，能确定改动区域。
3. 每个代码变更任务必须声明 `Current behavior`、`Target behavior`、`Change mechanics` 和 `Call impact`：说明当前实现、完成后的可观察行为、实现机制以及调用者/下游影响或明确无影响。
4. `Interfaces` 必须为代码接口写出精确符号及其输入和输出；仅文档或纯规则文本任务可声明无运行时接口。
5. `Steps` 中每一项只描述一个可执行动作；涉及代码逻辑的步骤必须给出最小代码片段、伪代码或精确的替换规则，不能仅重复目标行为。
6. 每个测试步骤必须写明测试文件或场景、输入/触发、期望结果和可运行的验证命令；无需自动化测试时必须说明使用何种手工或静态验证及其预期结果。
7. 静态校验器必须拒绝缺少上述代码级字段的代码变更任务，并拒绝没有符号/锚点、没有代码级改法或没有可验证预期的任务；同时保留对文档/规则任务的合理例外。
8. `devflow-build`、`core-methods.md`、命令入口和 README 必须使用同一 Plan Pack 合同，避免 Build 重新把计划降级为泛化任务列表。
9. 校验器自测与项目验证器必须覆盖完整通过样例及各类关键缺失样例，防止合同回退。

## Non-goals

- 不修改 `devflow-core` 的唯一路由、`CUT_PASS` 边界或 Plan 返回 Core 的合同。
- 不强制 TDD、每步 Git 提交、worktree、子代理执行或 Superpowers 的计划目录。
- 不要求在 Markdown 计划中粘贴完整生产代码；代码片段或伪代码只需消除关键实现推断。
- 不重写历史 `docs/plans/` 文档。
- 不将静态检查器升级为架构评分器、代码生成器或实际代码执行器。

## Approach

比较的方案：

1. 不变更：保持现有字段和宽松校验。优点是零成本；缺点是无法阻止“规格文档伪装成实施计划”，不满足目标。
2. 仅强化 `devflow-plan` 和命令提示词。优点是改动最小；缺点是生成质量无法自动约束，未来提示词回退不会被发现。
3. 强化运行时合同，并以零依赖 Node 校验器验证可机械识别的落地字段和反模式；同时同步 Build、方法参考、README 和回归验证。优点是将关键施工信息变成可验证契约，同时不新增依赖或生命周期。缺点是校验器只能验证结构与最低具体性，仍不能代替人工设计审查。

选择方案 3。任务按实施切片组织；每个任务只处理一个可独立验证的合同层，精确位置要求使用 `path | symbol or anchor | responsibility` 格式。对已有代码文件，计划必须命名函数、类、配置键、Markdown 标题或稳定文本锚点；对新文件使用 `new file`。`Change mechanics` 用最小片段、伪代码或替换规则表达关键机制；`Call impact` 将修改限制在已知调用路径，或明确没有运行时调用影响。

## Impact

- `skills/devflow-plan/SKILL.md`：定义代码级 Plan Pack 字段、任务粒度和无占位符规则。
- `commands/devflow-plan.toml`：把同一字段和写作要求暴露给 `/devflow-plan`。
- `skills/devflow-core/references/core-methods.md`：将代码级施工合同纳入 Method 10。
- `skills/devflow-build/SKILL.md`：要求 Build 消费位置、行为、机制和调用影响，不重新设计。
- `scripts/devflow-plan.js`：解析并验证新增字段、位置格式、代码级步骤和测试预期；扩展自测。
- `scripts/validate-devflow.js`、`scripts/validate-skill-triggers.js`：断言运行时合同和命令触发面不会回退。
- `README.md`：说明 Plan Pack 的代码级施工边界与检查器覆盖。

## Acceptance

1. 新生成的代码变更计划中，每个文件条目均可定位到新文件、符号或稳定锚点。
2. 每个代码变更任务均包含 `Current behavior`、`Target behavior`、`Change mechanics` 和 `Call impact`，并可从单个任务理解为什么、在哪里和怎样修改。
3. 每个代码逻辑步骤提供最小代码片段、伪代码或精确替换规则；泛化“修改 X 以实现 Y”不能通过校验。
4. 测试或静态验证步骤包含触发条件、预期结果及精确命令/场景。
5. 文档或规则文本任务可以通过明确的无运行时接口和非代码变更说明保留轻量写法。
6. `node scripts/devflow-plan.js --self-test` 覆盖完整计划、缺位置、缺行为/机制/调用影响、泛化代码步骤和不完整验证等正反例。
7. `npm run plan:verify`、`npm test`、`npm run trigger:verify` 与 `npm run host:verify` 通过。

## Verification

1. 运行 `node scripts/devflow-plan.js --self-test`，确认新合同的正反例均按预期判定。
2. 运行 `node scripts/validate-devflow.js`，确认主运行时合同和校验器要求同步。
3. 运行 `node scripts/validate-skill-triggers.js`，确认 `/devflow-plan` 命令提示词包含代码级施工要求。
4. 运行 `node scripts/validate-host-adapters.js`，确认改动未破坏已安装运行时的适配合同。
5. 运行 `git diff --check`，确认补丁格式无误。

## Code Documentation

- `scripts/devflow-plan.js` 中新增或实质修改的解析/校验函数需要函数级注释，说明其保护的计划合同和失败语义。
- 仅在位置解析、代码块识别或文档任务例外的判断不显然时添加简短行内注释，解释例外原因。
- Markdown skill、命令和 README 使用章节、字段定义与示例表达合同，无需额外代码注释。

## Open Questions

None.
