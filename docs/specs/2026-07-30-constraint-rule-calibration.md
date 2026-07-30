# Constraint Rule Calibration

## Goal

收敛 DevFlow runtime skill 中重复、偏好型或无可验证后果的否定式规则，同时保留所有保护安全、数据、用户授权、生命周期 owner、证据与安装边界的硬契约。

## Context

现有 14 个 `SKILL.md` 及其运行时 references 使用大量 `Do not`、`Never`、`Always`、`Must`。其中一部分防止不可逆或跨 owner 的错误，必须保持确定性；另一部分只是代码风格、流程偏好或同一生命周期边界的重复表述。重复会扩大运行时上下文，绝对化偏好会与项目已有约定冲突。

已确认方向不是软化 DevFlow 的安全或流程控制，而是让每条硬约束都可追溯到真实代价或运行时契约；其余内容改为条件化判断或由单一 owner 表达。

## Requirements

1. 保留以下硬契约及其可执行 stop/return 行为：
   - Core 独占后续生命周期选择。
   - Brainstorm、Spec、Cut、Plan、Build、PUA 的 return boundary 与用户确认停点。
   - 新鲜证据与 adversarial review 后才能完成声明。
   - 安全、权限、生产数据、不可逆操作、无证据文档/API/业务事实的保护。
   - 独立审查不自动改文件或改变生命周期。
   - 学习卡 index-first recall、用户确认后的业务知识维护。
2. 将仅表达代码风格或默认偏好的绝对规则改为条件化判断。注释要求必须以非显然决策、业务/安全/兼容性边界、已批准 Spec/Plan，或周边项目约定为触发条件；不得要求每个新文件或函数无条件添加注释。
3. 保留 Build、Prove 与 Learn 的质量/学习责任，但避免重复重述同一注释、完成或恢复语义。每个详细规则只有一个 runtime owner；其他 skill 仅声明触发和 owner reference。
4. 将 Brainstorm、Cut、PUA 中相同的生命周期禁止语义收敛为单个清晰的 output/return boundary，不改变触发条件、输出字段或 Core 路由。
5. 调整 `devflow-prove` 的评论验证，使其验证已批准文档和项目约定要求的评论，而不是将缺少任意函数注释视为自动失败。安全、正确性、数据丢失与未覆盖的真实风险仍保持阻断。
6. 现有用户工作区改动仅作为兼容性事实：不得覆盖 `.codex/devflow-prompt-probe.json`、`skills/devflow-docs-followup/SKILL.md`、`skills/devflow-learn/SKILL.md`、`skills/skill-call-diagram.md` 或其相关触发验证改动。

## Non-goals

- 不删除 Core 路由、Cut、Proof、PUA、Learn 或 Docs-followup 能力。
- 不把硬契约降为“模型自行判断”，也不改变用户确认、权限、安全、数据保护或真实完成证据。
- 不新增配置格式、依赖、host adapter、记忆服务、规则引擎或新的 skill。
- 不修改现有 Docs-followup 自动触发范围的未提交改动。

## Approach

比较方案：

1. 保持全部现状。风险低，但上下文重复和风格强制持续累积。
2. 全面删除否定式语言。文本最短，但会移除高代价边界，不能接受。
3. 采用分级收敛。保留可验证硬契约；把偏好改为“触发条件 -> 判断 -> 证据”；重复规则移至唯一 owner reference。选择此方案。

实施以现有 runtime owner 为边界：

- `devflow-build` 拥有实现期的评论与最小变更判断；Spec 只记录该特性明确需要的文档化约束，Prove 只核验已批准要求。
- `devflow-prove` 拥有完成证据和真实风险阻断；不再重复 Build 的通用注释命令。
- `devflow-brainstorm`、`devflow-cut`、`devflow-pua` 用一个输出/return boundary 表达其禁止跨 owner 的条件，删除同义重复句。
- `devflow-core` 和 host adapters 只保留 route、owner、load/fallback、proof；不承载详细风格规则。

## Impact

- `skills/devflow-build/SKILL.md`、`skills/devflow-prove/SKILL.md`、`skills/devflow-spec/SKILL.md`：校准注释与 Proof 的所有权。
- `skills/devflow-brainstorm/SKILL.md`、`skills/devflow-cut/SKILL.md`、`skills/devflow-pua/SKILL.md` 及其 owner references：压缩重复生命周期禁令，保持相同 return contracts。
- `skills/devflow-core/references/core-methods.md`、`skills/devflow-core/references/skill-guide.md`：仅在需要时更新 owner map/authoring guidance。
- 现有触发与 runtime 验证脚本：仅在当前断言与新的单一 owner 文本不一致时最小更新；不得引入“禁止词计数”或新的规则配置。

## Acceptance

1. 保留的硬约束均能说明其保护的风险、状态边界或可验证输出。
2. 不再存在“每个新文件/函数都必须有注释”或等价的无条件要求。
3. 已批准 Spec/Plan 的 `Code Documentation`、非显然逻辑、业务/安全/兼容性边界，以及项目既有注释约定，仍可在 Build/Prove 阶段强制执行。
4. Brainstorm、Cut、Plan、Build、PUA 的输入、输出与 Core return contract 保持可由现有 trigger/host/self-test 证明。
5. `npm test`、`npm run trigger:verify`、`npm run host:verify`、`npm run learn:verify`、`npm run verify:all` 和 `git diff --check` 通过。
6. 当前未提交的 Docs-followup 相关文件与 `.codex/devflow-prompt-probe.json` 不被本次修改覆盖。

## Verification

1. 阅读变更后每个受影响 owner 的 `SKILL.md` 与直接 reference，逐条检查硬约束是否有风险/边界/证据依据。
2. 运行 `npm test`、`npm run trigger:verify`、`npm run host:verify`、`npm run learn:verify`、`npm run verify:all`。
3. 运行 `git diff --check`，并检查用户已有未提交文件的 diff 未被本次改写。

## Code Documentation

本次主要修改 Markdown runtime contracts。若验证器需要最小调整，新增或实质改变的 Node helper 仅在其保护的 capability 或失败条件不自明时添加 WHY 注释；不引入通用函数注释要求。

## Open Questions

None.
