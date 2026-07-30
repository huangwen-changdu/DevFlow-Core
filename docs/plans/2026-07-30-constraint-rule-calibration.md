# Constraint Rule Calibration Implementation

Goal: 将 DevFlow skill 中仅代表默认偏好或重复表达的绝对规则收敛为条件化判断和单一 runtime owner，同时保留安全、数据、授权、生命周期、用户确认与完成证据的硬契约。
Architecture: 复用已有的 Spec -> Cut -> Plan -> Build -> Prove owner 链。`devflow-spec`/`devflow-plan` 记录当前任务真正需要的文档化约束，`devflow-build` 消费该约束，`devflow-prove` 仅验证已批准要求和可识别的真实风险；Core 继续是唯一的后续生命周期选择者。
Tech Stack: 现有 Markdown runtime contracts、Node.js 校验脚本与 npm 验证命令；不新增依赖、配置、目录或抽象。
Source: docs/specs/2026-07-30-constraint-rule-calibration.md
Spec coverage: R1/R4 由 Task 3 覆盖；R2/R3 由 Task 1 覆盖；R5 由 Task 2 覆盖；R6 由全部 Task 的排除项与验证覆盖。
Cut Decision: CUT_PASS；复用已有 Skill owner、Plan Pack 字段、Markdown 文档结构和验证命令。允许范围仅为下列 runtime Markdown 合同及在现有验证断言确有冲突时的最小修正；不新增文件以外的实现能力。验证约束为 `npm test`、`npm run trigger:verify`、`npm run host:verify`、`npm run learn:verify`、`npm run verify:all` 与 `git diff --check`。
External Skills: none

## Global Constraints

- Core 仍是唯一后续生命周期选择者；Brainstorm、Spec、Cut、Plan、Build、PUA 均保留既有 stop/return contract 与用户确认点。
- 不弱化安全、权限、生产数据、不可逆操作、业务事实、完成证据或独立审查不修改工作区的硬约束。
- 注释只在已批准 Spec/Plan、非显而易见决策、业务/安全/兼容性边界或项目既有约定要求时成为强制项；不得恢复“每个新文件或函数必须注释”的无条件规则。
- 保留当前用户未提交的 `.codex/devflow-prompt-probe.json`、`scripts/validate-skill-triggers.js`、`skills/devflow-docs-followup/SKILL.md`、`skills/devflow-learn/SKILL.md`、`skills/skill-call-diagram.md` 改动；本计划不覆盖或回退它们。
- 不加入“禁止词计数”、新规则配置或新的强制检查框架；只维持现有 runtime contract 必需的稳定断言。

Task: 收敛注释要求到上下文判断与既有 owner
Task type: Documentation-only
Files:
- Modify: skills/devflow-spec/SKILL.md | anchors: `Code Documentation`, `Anti-Rationalization`, `Verification` | 将 Code Documentation 定义为按已批准需求记录的条件化约束
- Modify: skills/devflow-plan/SKILL.md | anchors: `Comments:`, `Verification` | 让 Plan 的 Comments 字段承接 Spec/任务上下文，而非预设所有函数都需要注释
- Modify: skills/devflow-build/SKILL.md | anchors: `## Code Comment Discipline`, `### Comment output check`, `Anti-Rationalization`, `Verification` | 用触发条件替代新文件/新函数的无条件注释表
- Modify: skills/devflow-build/references/build-methods.md | anchor: `## Build Comments` | 与 Build 的条件化评论 owner 保持一致
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Current behavior: Spec、Plan、Build 与 Build Methods 同时包含“所有新文件/函数需要注释”或等价语义，且 Build 的表格和输出检查会把缺少任意函数说明视为不完整。
Target behavior: 只有已批准 Spec/Plan、非显而易见理由、业务/安全/兼容性边界或项目约定触发的注释被记录、实现和验证；简单或自解释的变更可明确记录为无额外注释要求。
Change mechanics: 将无条件 `Always` 表格行和“缺少注释必然不完整”话术替换为 `触发条件 -> 所需说明 -> 验证证据`；保持 `WHY, not WHAT`、项目既有风格、更新已存在说明与非显而易见边界的要求。Plan 继续有 `Comments` 字段，但其值必须引用当前任务实际条件或 `none — trivial change`。
Call impact: Spec 继续生成可解析的 `Code Documentation` 章节，Plan 继续传递 `Comments` 字段，Build 继续进行 Comment Check；仅删除把每个新增符号都当作硬失败的推论，不影响 Core 路由或任何 npm 命令入口。
Steps:
- [ ] 在 `skills/devflow-spec/SKILL.md` 的 `Code Documentation` 说明与反合理化段落中，将“哪些文件/函数都需要”改为按已批准需求、已有约定和非显而易见边界记录；保留必需章节和 `none — trivial change` 的可解析写法。
- [ ] 在 `skills/devflow-plan/SKILL.md` 的 `Comments:` 模板和检查项中，规定注释字段写明当前任务的触发条件、所需位置或 `none — trivial change`，不要求通用函数级模板。
- [ ] 在 `skills/devflow-build/SKILL.md` 和 `skills/devflow-build/references/build-methods.md` 的 Code Comment Discipline 中，用同一触发判断替代新文件/新函数 `Always`；将 Comment Check 改为只核验被触发/计划要求的位置，并保留项目风格和 WHY 说明。
- [ ] 搜索四个 owner 文件的 `Always`、`new function`、`missing comments` 和 `self-explanatory` 相关文字；确认没有等价的“每个新增文件或函数”绝对注释要求残留。
Acceptance: 四个 owner 对注释强制条件一致；Spec 与 Plan 的静态字段仍可被现有 checker 识别；Build 不会把未触发的文件/函数注释当成自动失败。
Verify: Run `node scripts/devflow-spec.js docs/specs/2026-07-30-constraint-rule-calibration.md` and `node scripts/devflow-plan.js docs/plans/2026-07-30-constraint-rule-calibration.md`; search the four files for unconditional new-file/new-function comment requirements. Expect both static checkers to pass and no equivalent unconditional rule.
Comments: none — Markdown runtime contracts use headings, fixed fields, and explicit trigger conditions rather than source-code comments.
Not doing: 不删除 Code Documentation 或 Comments 字段，不改变项目既有语言/注释风格约定，也不取消对非显而易见、安全、业务和兼容性原因的说明。

Task: 使 Prove 和代码审查将偏好与真实风险分级
Task type: Documentation-only
Files:
- Modify: skills/devflow-prove/SKILL.md | anchors: `## Process`, `## Proof Selection`, `## Adversarial Review`, `## Code Review Report`, `Anti-Rationalization`, `Red Flags` | 只把实际缺口或已批准要求视为阻断项
- Modify: skills/devflow-prove/references/code-review-checklist.md | anchors: `## How to Use`, `## General Engineering Review`, `## Language-Specific Checklists` | 将通用框架/风格偏好改为适用性判断，保留安全硬规则
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Current behavior: Prove 重复要求每个新/改函数和 bug 修复点必须有注释，并要求任何代码审查发现都等待用户确认后再修正；审查清单将 DI、配置抽取、OCP、复杂度阈值及各语言惯例一律当作 hard gate。
Target behavior: Prove 检查已批准的注释要求和非显而易见的真实边界；审查区分阻断风险、已批准契约缺失和可选改进。安全、权限、数据丢失、错误处理、真实性能瓶颈与行为正确性仍保持阻断。
Change mechanics: 删除 Prove 中重复的通用注释命令；将 Code Review Report 结论定义为由未满足 acceptance/硬安全边界/真实回归风险决定。清单新增“适用条件与证据”前置原则，并把 DI、配置、抽象、复杂度、性能及框架偏好改为在当前项目约定或可证明问题存在时才标记；保持 SQL 注入、XSS、授权、敏感数据和资源安全等硬性项目。
Call impact: `devflow-prove` 仍执行新鲜证据、对抗审查、Code Review Report、Skill Activation Chain Check 和 PASS 后 Learn review；不改变 `PASS`/`FAIL`/`BLOCKED` 输出形状或 Recovery/PUA 入口。
Steps:
- [ ] 在 `skills/devflow-prove/SKILL.md` 的 Process、Proof Selection、Adversarial Review 和 Red Flags 中，替换“所有函数/修复点的注释”检查为“被 Spec/Plan/既有约定或非显而易见边界触发”的检查，并合并重复的“发现问题后停止”描述。
- [ ] 在 `skills/devflow-prove/SKILL.md` 的 Code Review Report 定义中，明确只有阻断性发现才需要 FAIL/用户确认；可选改进不能单独阻止与验收标准相符的 PASS。
- [ ] 在 `skills/devflow-prove/references/code-review-checklist.md` 的通用与语言专项清单中，为偏好型条目加入项目约定、当前复杂度、实际扩展需求或已测量风险的适用条件；保留安全、权限、数据保护、注入防护和资源泄漏的硬风险检查。
- [ ] 搜索 Prove 与 checklist，确认“每个函数需注释”“所有发现都是不通过”“通用 DI/OCP/配置抽取”不再作为无条件 hard gate，同时安全硬规则没有被降级。
Acceptance: Prove 的可执行证明、对抗审查、报告和 Learn handoff 不变；缺失批准注释或真实风险仍会被阻断，纯代码风格偏好不会伪装成生产故障。
Verify: Run `npm test`, `npm run trigger:verify`, and `npm run review:verify`; inspect the changed Prove/checklist contract. Expect all commands to pass and retained hard-risk checks to remain explicit.
Comments: none — 改动仅限 Markdown proof/review contracts。
Not doing: 不取消对抗审查、Code Review Report、FAIL/Recovery 路径或用户对阻断问题的决定权；不将安全、授权、数据与不可逆风险降为建议。

Task: 以单一 return contract 压缩重复的生命周期禁止语义
Task type: Documentation-only
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | anchors: `## Responsibility Boundary`, `## Entry And Stop Condition`, `## Fixed Output Contract`, `Red Flags` | 只保留 Confirmed request -> Core 的单一边界表述
- Modify: skills/devflow-cut/SKILL.md | anchors: `## Context`, `## Cut Result`, `## Handoff` | 只保留 Cut Decision -> Core 与 CUT_REDUCE/CUT_REUSE 用户确认的单一可执行表述
- Modify: skills/devflow-pua/SKILL.md | anchors: `## Process`, `## Handoff Gate`, `Verification` | 只保留 recovery facts -> Core 的单一表述
- Modify: skills/devflow-core/references/core-methods.md | anchor: `## Method 15: Skill As Executable Contract` | 仅在需要时澄清详细规则应归单一 owner，避免跨 skill 重复全文
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Current behavior: Brainstorm、Cut 与 PUA 多处重复“不得选择后续技能/仅 Core 选择”的同义禁止；不同段落重复相同 stop/handoff 事实，增加上下文而不增加执行信息。
Target behavior: 每个 owner 用一个固定 output/return contract 表达其边界，仍保留所有必要用户确认点、输出字段和 Core 路由术语。
Change mechanics: 合并同义禁止句到各 Skill 的 output/handoff 位置；保留触发条件、`Confirmed request`、四种 Cut 结果、`CUT_REDUCE`/`CUT_REUSE` STOP、PUA recovery facts、`METHOD`/`SWITCH`、Core-only selection 等验证所依赖的稳定词，不迁移职责到新的文件。
Call impact: `validate-skill-triggers.js`、`validate-host-adapters.js`、flow self-test 和 installer 验证继续可从相同输出/owner 术语判断生命周期边界；仅当现有断言依赖删除的重复词时，才对该断言作最小等价更新。
Steps:
- [ ] 在 `skills/devflow-brainstorm/SKILL.md` 的责任、停止、输出和 Red Flags 段落，将同义禁止合并到固定 `Confirmed request` 输出与返回 Core 的一句边界；保留一问一答、事实先读和确认后停止等高代价流程要求。
- [ ] 在 `skills/devflow-cut/SKILL.md` 的 Context、Cut Result 与 Handoff 中，将多处 Core 选择者说明合并为一个结果表和一个用户确认门；保留 Reuse/Reduce 的 STOP 与四种固定结果。
- [ ] 在 `skills/devflow-pua/SKILL.md` 的 Process、Handoff Gate 和验证段落，将多处下游路由禁止合并为 recovery facts 返回 Core 的单一约束；保留重复同目标触发、方法切换、重新确认和学习闭环。
- [ ] 审查 `skills/devflow-core/references/core-methods.md` Method 15；只有在它不能清楚表达“详细规则唯一 owner”时做最小文本同步。运行现有 host/trigger/self-test 命令，若稳定术语断言失败，只恢复等义 contract 词，不扩散重复清单。
Acceptance: Brainstorm、Cut、PUA 的输入、输出、Core return contract、用户确认点和现有测试可见稳定术语不变；每个同义生命周期禁止只在其 owner 的固定 boundary 处保留一次。
Verify: Run `npm run trigger:verify`, `npm run host:verify`, `npm run learn:verify`, `npm run verify:all`, and `git diff --check`; expect lifecycle validators and aggregate verification to pass with no whitespace errors.
Comments: none — 改动仅限 Markdown lifecycle contracts。
Not doing: 不更改 Core 路由、Cut 四种结果、PUA 方法输出、任何确认 STOP，或用户当前未提交的 Docs-followup/Learn/trigger/probe 改动。
