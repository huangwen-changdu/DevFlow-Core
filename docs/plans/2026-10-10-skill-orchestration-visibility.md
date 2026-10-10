# 开发流程编排可见性统计与修复方案

Status: done
Goal: 开发过程中能看见适用技能与方法的触发原因、实际动作、结果和证据，能够区分未执行、不适用与已执行。
Not doing: 新增技能、依赖、事件引擎、持久化日志、宿主 UI 或配置；扩大默认审查范围；改变 A/B/C、审批门和节点裁决权；把执行回执写入产品界面、代码注释或 PR 正文。
Landed: 2026-10-10 · npm run verify:all 退出码 0（18 项全 PASS，budget 169148/280000）；trigger:verify 23 场景；capability:eval 13/13 PASS；doctor 六 home 6/6 pass（57 文件/家）；verify-plugin PASS
Cut: 候选边界待评审；做现有 skill 的回执与交接契约补齐 | 不做新增技能、依赖、事件引擎、持久化日志、宿主 UI 或配置；扩大默认审查范围；改变 A/B/C、审批门和节点裁决权；把执行回执写入产品界面、代码注释或 PR 正文 | 复用既有输出、Progress、METHOD/SWITCH、Code Review Report 和 Learning closure | 验证静态契约与真实会话轨迹 | Rejected: 独立状态引擎和每轮全能力打卡没有当前必要性，既有产物可承载证据。
Source: 用户 2026-10-10 请求：以 skills 中开发流程编排为主，统计静默能力并形成修复计划方案。

本文件交付编排可见性的统计与修复方案。运行时修改已按 7 项任务全部实施：生命周期输入为用户指令批准（B 深度 CUT_PASS + Plan 批准），执行与验证证据在 `## Progress` 与头部 `Landed`。

## Recon

- `rg --files skills` → 当前目录含 15 个 SKILL.md、17 份 references、4 份 Loop 模板、1 份技能调用图和 1 个 agents/openai.yaml。
- `rg -n 'Method Lens|First Principles' skills` → core-methods.md 有方法选择表，flow-self-test.md 的 Scenario 1C-A 有完整第一原理输出；reference-projects.md 仍声称 Brainstorm 要求 Method Lens，当前 Brainstorm 的固定输出未要求该字段。
- `rg -n 'External Skills' skills/devflow-cut/SKILL.md skills/devflow-plan/SKILL.md skills/devflow-build/SKILL.md` → Cut 要求携带契约，Plan 第 81 行要求继承，Build 第 24 行要求实际加载和返回结果；Plan Required Plan Header 未列 External Skills。
- `rg -n 'Record the six scores|Quality Gates Before Handoff' skills/devflow-prove/references/ui-slop-checklist.md skills/devflow-build/references/build-methods.md` → UI 清单已有六轴分数写入 proof evidence 的要求，Build 交接仅要求清除命中项。
- `rg -n 'Pressure Recovery Check|Trigger this skill only|The direct' skills/devflow-prove/SKILL.md skills/devflow-pua/SKILL.md` → Prove 对单次用户质疑也给出 PUA 提示，PUA 自动入口限定同一目标的重复不满；显式 /devflow-pua 是立即 opt-in。
- `rg -n 'Completion Output|Handoff:|devflow-docs-followup|devflow-project-knowledge' skills/devflow-learn/SKILL.md skills/devflow-docs-followup/SKILL.md skills/devflow-project-knowledge/SKILL.md` → 三者都有产物或交接规则；Learn 的完成输出没有分别列出两条条件分支的本次处置。
- `git status --short` → 调查开始时仅 .codex/devflow-prompt-probe.json 已修改，该用户改动不属于本方案。
- `node scripts/devflow-plan.js --index` → 写入本草案前输出 Problems: none，Judgment: PASS。

## Scope And Counting

统计对象为 skills/ 中的开发编排契约。实现测试和已有分发副本只作为后续落地验证面，不把安装诊断、宿主钩子、Wiki 或新看板计入本次能力数量。

15 个 skill 分组：

| 分组 | 数量 | Skills |
|---|---:|---|
| 主流程 | 8 | core、brainstorm、spec、cut、plan、build、prove、learn |
| 恢复 | 1 | pua |
| 按请求启动的审查 | 3 | audit、adversarial、find-fault |
| 完成后的条件分支 | 2 | docs-followup、project-knowledge |
| 独立循环协议 | 1 | loop-engineering |

34 项是按节点职责拆分的检查单元，不是 34 个独立功能或 34 个已证实缺陷。同一能力在发现、继承和执行阶段可能分别占一项。

| 分类 | 数量 | 判断边界 |
|---|---:|---|
| A：缺少稳定的结果回执要求 | 3 | 动作有规则，相关运行时段落缺少明确的结果展示要求 |
| B：摘要、载体或交接有缺口 | 9 | 已有规则或输出，但信息在节点间保留、处置或汇总不充分 |
| C：已有明确输出或产物 | 18 | 保留现有格式，补统一引用；不能据规则存在推断历史上实际执行 |
| D：条件启动且已有报告 | 4 | 保持条件启动，不能为了让用户看见而默认强制执行 |

以下事实来自源文件；“容易感知不到”是基于契约的风险判断。未回放历史会话，不能量化实际漏执行率。

## Capability Inventory

| ID | 编排检查单元 | Owner / 入口 | 当前证据 | 分类 | 建议 |
|---|---|---|---|---|---|
| V01 | 路由、风险门和跳过原因 | Core | E01 Activation Evidence 有路线和是否 Brainstorm，缺具体跳过依据摘要 | B | 节点入口说明选路依据，跳过必须有原因 |
| V02 | 偏好、学习卡与业务知识召回 | Core / Sense | E01 记录偏好数量，E02 有 Knowledge recall，未要求指出本次决策受何条记录影响 | B | 引用命中记录和实际应用点，缺失来源不阻断 |
| V03 | Method Lens 与第一原理 | Core / Cut | E02 仅要求在影响判断时选 lens，E15 测试已有事实/约束/不变量/最小机制输出 | A | 将适用输出放入运行时 owner，测试引用同一契约 |
| V04 | 外部技能发现和边界 | Core / Sense | E02 定义 owner、role、expected evidence、return | B | 将发现结果交给 Cut，区分可用、已加载和有返回结果 |
| V05 | 语义回显与理解修订 | Brainstorm | E03 固定五字段、确认门与修订规则 | C | 复用回显，不额外增加一次确认 |
| V06 | Grill 与多角度探索 | Brainstorm | E03 有角度发现、风险与推荐方向固定字段 | C | 引用真实问题和改变的范围，无发现可明确记录 |
| V07 | 用户选择 A/B/C | Brainstorm | E03 有明确用户选择与直接成功边 | C | 入口和交接显示用户所选深度，禁止代选 |
| V08 | 方案比较、设计审批与注释要求 | Spec | E04 Approach、Code Documentation、自审与 Spec Output | C | 引用 Spec 中的决策与审批状态 |
| V09 | Ponytail、复用与原生能力阶梯 | Cut | E05 Required Gates 和 selected rung | C | 保留阶梯结论，指出具体复用项与限制 |
| V10 | 根因追踪、共享或局部修复 | Cut | E05 Root-Cause Check 有调用方、落点、原因 | C | 引用真实调用路径或查找结果 |
| V11 | 惯例、职责、性能与可读性判断 | Cut | E06 Method 8A 有四种结果记录 | C | 沿用记录，优化结论必须有负载或故障依据 |
| V12 | 范围减法与每项改动的目标关系 | Cut | E05 Cut Decision、Rejected、Diff/Scope Check | C | 回执指出本次实际减法，不编造被砍方案 |
| V13 | 有意简化的上限和重做条件 | Cut / Build | E05 devflow: ceiling/revisit 标记 | C | 引用具体标记，不新增自动债务扫描 |
| V14 | Recon、任务验收和 Progress | Plan / Build | E07 明确命令输出、任务字段与进度证据 | C | 任务收尾引用已回写行，避免另建状态台账 |
| V15 | External Skills 从 Cut 传入 Plan | Plan | E07 文字要求继承，必填头部模板未列字段 | B | 明确声明载体和无声明时的处理，保持旧计划兼容 |
| V16 | Build Contract、切片和版本来源核对 | Build | E08 有开工契约、Slices、Source Check | C | 用现有结果说明本次做法和未验证来源 |
| V17 | Karpathy 最小改动与目标映射 | Build | E09 每文件 Goal link/Behavior/Why/Verification | C | 引用实际 diff，品牌名称不代替执行结果 |
| V18 | 外部技能实际执行及结果 | Build | E08 要求实际加载和 return facts，交接 Prove 的固定块未携带此结论 | B | 将专家返回结果或受阻事实传入唯一 Prove 门 |
| V19 | 注释、可读性和 Diff 自检 | Build | E08 Comment Check、Diff Self-Check，E09 Readability Check | C | 保留适用检查结果，避免机械要求额外注释 |
| V20 | 反 AI 味文字检查 | Build / Prove | E09/E10 要求写后修正，E11 有流程但没有固定完成回执 | A | 报检查对象、发现与修正或无命中，引用产物 |
| V21 | UI 六轴和设计门 | Build / Prove | E12 已要求将六轴分数写入 proof evidence，节点固定交接块未引用该记录 | B | 承接既有六轴证据，非视觉任务明确不适用 |
| V22 | 新鲜命令、覆盖边界与最终判断 | Prove | E10 Command/Result/Adversarial review/Judgment | C | 沿用主证据，显示未覆盖项，禁止旧结果充当本次证明 |
| V23 | 常规对抗检查与语言代码审查 | Prove | E10 双层 review 和 Code Review Report | C | 与独立深度审查分开，报告发现及关闭证据 |
| V24 | 技能激活链检查 | Prove | E10 已规定 trigger/surface/action/evidence | C | 规则变更时引用检查结果，不能只查技能名称 |
| V25 | PUA 诊断、METHOD/SWITCH 和恢复证明 | PUA / Prove | E13 固定恢复输出，E10 有 Recovery evidence | C | 保留已有完整回执，单独 METHOD 行不是恢复完成 |
| V26 | 普通纠正与 PUA 自动触发边界 | Core / Prove / PUA | E10 Pressure Recovery Check 与 E13 repeated-only 自动入口措辞不一致 | B | 普通质疑交 Core 判断，重复同目标或显式命令按既有授权进入 PUA |
| V27 | 学习复盘、能力索引和无沉淀结果 | Learn | E14 Always report Learning closure | C | 结果为 no useful record 也显示，避免人为制造学习卡 |
| V28 | 文档询问和业务知识确认分支 | Learn / follow-up owners | E14 条件交接有定义，完成摘要没有两条分支的本次处置项 | B | 显示适用、待用户选择或不适用原因，保留原确认门 |
| V29 | 过度工程 Audit | Audit | E16 有范围、发现、net 和 candidate 边界 | D | 保持请求驱动，不等同常规代码审查或性能优化 |
| V30 | 独立深度对抗审查 | Adversarial | E17 显式请求与五角度报告 | D | 保持独立和显式请求，不并入默认 Prove |
| V31 | 找茬和未确认业务决策检查 | Find Fault | E18 三问题、条件 unease 和必要修复建议 | D | 只在适用时显示报告，不把规则核对伪称业务验收 |
| V32 | 轮次预算、停止条件和收尾审查 | Loop Engine | E19 有状态文件、每轮证据与收尾报告 | D | 保持独立协议，不接入普通 A/B/C 的默认节点 |
| V33 | 交付面与包装终稿检查 | Core / Build / Prove | E01/E09/E10 要求重读最终产物与 wrapper，缺本次检查结果摘要 | A | 在会话回执引用检查面，控制信息不混入交付正文 |
| V34 | 执行模式、子任务返回与统一 Prove | Plan / Build | E07/E08 规定调度和唯一 Prove，Required Plan Header 有 Execution mode 但无统一调度结果摘要 | B | 使用所选模式汇总任务返回；缺工具须报受阻而非静默换模式 |

## Evidence Map

各锚点均为当前本地文件内容；后续修改可移动行号，优先按命名锚点查找。

| 编号 | 文件与锚点 |
|---|---|
| E01 | `skills/devflow-core/SKILL.md` / Activation Evidence、Delivery Surfaces、Routes |
| E02 | `skills/devflow-core/references/core-methods.md` / Method 0、Method 1、Method 4 |
| E03 | `skills/devflow-brainstorm/SKILL.md` / Fixed Output Contract、Understanding Revision Rule、A/B/C Gate；`references/interview-discipline.md` / Multi-Angle Checklist |
| E04 | `skills/devflow-spec/SKILL.md` / Process、Output；`references/spec-plan-methods.md` / Method 10 |
| E05 | `skills/devflow-cut/SKILL.md` / Required Gates、Intentional Simplification Marker、Cut Result、Handoff |
| E06 | `skills/devflow-cut/references/cut-methods.md` / Method 8A: Contextual Design Quality Check |
| E07 | `skills/devflow-plan/SKILL.md` / Required Plan Header、External Skills 继承段、Required Task Contract；`references/plan-methods.md` / Execution Handoff |
| E08 | `skills/devflow-build/SKILL.md` / Direct Execution、Build Contract、Execution Mode、Source Check、Comment output check、Handoff Gate |
| E09 | `skills/devflow-build/references/build-methods.md` / Method 11、Readability Outcome Check、Quality Gates Before Handoff |
| E10 | `skills/devflow-prove/SKILL.md` / Required Output、Code Review Report、Pressure Recovery Check、Recovery Proof Contract；`references/proof-recovery-methods.md` / Method 13 |
| E11 | `skills/devflow-prove/references/prose-quality-checklist.md` / Scope、How to run、Exit check |
| E12 | `skills/devflow-prove/references/ui-slop-checklist.md` / Scope、Six-axis self-critique、Record the six scores |
| E13 | `skills/devflow-pua/SKILL.md` / Repeated Same-Function Trigger、Required Output、Handoff Gate；`references/methodology-router.md`、`methodology-library.md`、`flavor-display.md` |
| E14 | `skills/devflow-learn/SKILL.md` / Knowledge Boundaries、Completion Output；`skills/devflow-docs-followup/SKILL.md` / Entry Gate、Completion Output；`skills/devflow-project-knowledge/SKILL.md` / 渐进披露与落地边界、完成钩子 |
| E15 | `skills/devflow-prove/references/flow-self-test.md` / Scenario 1C-A: First Principles Cut；`skills/devflow-core/references/reference-projects.md` / PUA-Driven Spec Engineering |
| E16 | `skills/devflow-audit/SKILL.md` / Process、Output、Boundaries |
| E17 | `skills/devflow-adversarial/SKILL.md` / Entry Gate、Five-Angle Review、Required Output |
| E18 | `skills/devflow-find-fault/SKILL.md` / Post-Implementation Unease Check、Required Output |
| E19 | `skills/loop-engineering/SKILL.md` / 每轮流程、收尾对抗轮、收尾报告、失败卡 |

17 份 references 中，native-capability-checklist.md 与 code-review-checklist.md 提供判定细项，skill-guide.md 提供技能结构约定；它们不增加独立编排节点。4 个 Loop 模板是协议输入模板，不计为 4 个新能力。运行时判据以 owner skill 为准，调用图和吸收说明只作导航。

## Repair Proposal

### 统一回执，复用既有产物

在 core-methods.md 定义一份短回执契约，其余 owner 引用，不复制成新的方法体系：

```text
执行回执: <节点/适用方法> | <已加载/已执行/不适用/受阻/未执行>
依据与动作: <触发依据；本次具体动作>
结果与证据: <发现/修正/无发现/待验证；实际命令结果、diff、产物片段或人工检查观察>
交接: <既有直接后继，或交 Core 的原因；相关结果的既有载体>
```

节点开始可只显示第一行和触发依据，结果在节点交接时补齐。已完整输出的 Cut、METHOD/SWITCH、Code Review Report、Learning closure 等直接充当回执，统一摘要引用它们，不再生成重复表单。

规则：

- 已读取文件或加载技能只能记已加载；有实际动作和结果才记已执行。执行完成不等于业务验收通过，判断仍属于原 owner。
- 有命令时记录当次输出和退出码；人工审查记录检查对象、观察和判断依据，明确其人工性质，不宣称可机械证明。
- 不适用必须给触发条件未满足的原因。触发条件已满足而没有执行，必须显示未执行或受阻，不能改记不适用。
- 节点启动、交接、异常或关键决策改变时展示，普通中间读取不重复播报。小任务通常每个相关节点 1-3 行，不逐轮列出 34 项。
- 在完成摘要中列出本次适用且有实质作用的能力和证据，以及受阻/未执行项。按请求启动的独立审查、Audit 和 Loop 无需每轮重复列出未触发。
- 控制信息留在会话回执、既有 Progress 或 proof evidence；提交说明、产品界面和文档正文继续描述最终结果。
- 既有生命周期结果、审批门、独立审查边界、PUA 触发和业务知识确认门继续有效，回执本身无裁决权。

### 修复优先级

| 优先级 | 内容 | 对应检查单元 | 必要性 |
|---|---|---|---|
| P1 | 区分加载与执行，明确证据性质与受阻状态 | V04、V18、V20、V21、V22 | 防止仅出现技能名就宣称执行 |
| P1 | 外部技能继承、结果传递与唯一 Prove 门 | V15、V18、V34 | 防止 Plan/Build/Prove 之间丢失已约定质量要求 |
| P1 | 普通反馈和 PUA 自动触发一致 | V26 | 防止单次反馈被误报成已经恢复，或重复失败仍未恢复 |
| P2 | 方法选择、召回与风险门的决策摘要 | V01、V02、V03 | 让方法怎样改变判断可见 |
| P2 | 反 AI 味与交付面结果引用 | V20、V21、V33 | 让写后检查有本次对象与结果 |
| P2 | 完成后的条件分支处置 | V27、V28 | 区分已复盘、无需沉淀、待确认和不适用 |
| 保留 | 已有输出与条件启动能力 | C、D 类 | 补引用即可，避免重复门控和默认扩大工作 |

## Tasks

Task: 定义节点回执与决策摘要契约
Files:
- Modify: skills/devflow-core/references/core-methods.md | `Shared Output Contracts`, `Method 4: Method Lens` | 单一共享回执契约和适用的第一原理结果
- Modify: skills/devflow-core/SKILL.md | `Activation Evidence`, `Context Map` | 用回执解释本次路线、偏好应用与召回
- Modify: skills/devflow-core/references/reference-projects.md | `PUA-Driven Spec Engineering` | 使方法所属节点说明与运行时 owner 一致
Change: 添加共享回执及证据边界，内容按 Repair Proposal；普通方法仅在影响判断时展示；沿用 Scenario 1C-A 的第一原理字段，并将测试中的机制选择限制在正确 owner 内。说明来源缺失为非阻断事实，不能虚报已召回或执行。覆盖 V01-V04。
Acceptance: 从一次路线选择到节点交接，可以追溯适用方法的本次动作和证据。
Verify: `npm run route:verify` expected 退出码 0；人工走查“清晰局部修改”和“约束不明的架构请求”，前者有简短选路依据，后者在正确节点输出第一原理事实与约束。
Not doing: 新增技能、依赖、事件引擎、持久化日志、宿主 UI 或配置；改变 A/B/C、审批门和节点裁决权。

Task: 补齐已有节点产物与外部技能交接
Files:
- Modify: skills/devflow-cut/SKILL.md | `Required Gates`, `Handoff` | 将已有结论作为回执传出
- Modify: skills/devflow-plan/SKILL.md | `Required Plan Header`, `Inherit` | 明确 External Skills 的载体和质量要求
- Modify: skills/devflow-plan/references/plan-methods.md | `Execution Handoff` | 保留跨任务执行所需证据
- Modify: skills/devflow-build/SKILL.md | `Direct Execution`, `Execution Mode`, `Handoff Gate` | 接收外部技能契约并将结果交唯一 Prove 门
- Modify: skills/skill-call-diagram.md | `External Skills`, `Short Rules` | 展示有返回结果的技能协作
Change: 复用 Cut/Plan/Build 既有输出，声明继承字段及条件；专家任务必须传递 owner、role、expected evidence 和 return facts，质量要求进入任务 Acceptance/Verify，Depth C 则进入 Build Contract。执行模式依照用户选择，工具缺失返回受阻。覆盖 V04、V09-V19、V34，不新增逐项重复回执。
Acceptance: A/B 与 C 路径上的外部技能结果均能到达同一个 Prove 交接。
Verify: `npm run plan:verify`、`npm run route:verify` expected 退出码 0；人工分别走查 A/B 有 Plan 和 C 无 Plan 的专家技能任务，输入与返回结果可追溯，加载无返回时不得宣称已执行完成。
Not doing: 改变 A/B/C、审批门和节点裁决权；新增事件引擎或持久化日志。

Task: 为写后质量检查补齐本次结果
Files:
- Modify: skills/devflow-build/references/build-methods.md | `Quality Gates Before Handoff` | 输出文字、视觉和交付面检查摘要
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | `Proof Context Selection`, `Method 13: Proof Before Done` | 消费 Build 的质量检查证据并复核最终产物
- Modify: skills/devflow-prove/references/prose-quality-checklist.md | `How to run`, `Exit check` | 明确文字检查对象和结果
- Modify: skills/devflow-prove/references/ui-slop-checklist.md | `Six-axis self-critique` | 将已有六轴证据接入共享回执
- Modify: skills/devflow-prove/SKILL.md | `Required Output` | 引用质量检查结果及未执行项
Change: 补文字检查与交付面回执，引用 UI 现有六轴分数及修正观察。复查最终修改后的产物，旧稿检查不能覆盖新稿。非视觉任务跳过视觉检查，Spec/Plan 内部契约仍按现有豁免执行。覆盖 V20-V24、V33。
Acceptance: 完成交接能定位本次适用写后检查的对象和结果。
Verify: `npm test` expected 退出码 0；人工走查“文字有命中”“文字无命中”“UI 输出”“纯后端修改”和“检查后改稿”，仅 UI 输出要求视觉证据，改稿必须重查。
Not doing: 扩大默认审查范围；把执行回执写入产品界面、代码注释或 PR 正文；改变节点裁决权。

Task: 对齐纠正与恢复的触发和返回事实
Files:
- Modify: skills/devflow-prove/SKILL.md | `Pressure Recovery Check`, `Recovery Proof Contract` | 区分普通失败事实与 PUA 自动入口
- Modify: skills/devflow-core/SKILL.md | `Recovery`, `Capability Dispatch` | 根据重复同目标证据或显式 opt-in 选择恢复
- Modify: skills/devflow-pua/SKILL.md | `Repeated Same-Function Trigger`, `Handoff Gate` | 记录目标、触发依据与完整恢复回执
Change: 让普通单次反馈先返回 Core 判断；重复同目标和显式 /devflow-pua 仍按现有入口处理。沿用 METHOD/SWITCH、诊断和改变方法的事实，禁止仅输出方法名称就声称恢复。覆盖 V25-V26。
Acceptance: 同一组反馈在 Core、Prove 和 PUA 上得到一致的恢复触发解释。
Verify: `npm run route:verify`、`npm run trigger:verify` expected 退出码 0；人工走查单次纠正、重复同目标、不同目标的多次反馈、显式命令及普通代码审查失败，只有满足既有入口条件的轨迹进入 PUA。
Not doing: 改变 A/B/C、审批门和节点裁决权；扩大默认审查范围。

Task: 汇总学习闭环与条件交接处置
Files:
- Modify: skills/devflow-learn/SKILL.md | `Knowledge Boundaries`, `Completion Output` | 汇总复盘结果和两条后续分支的本次处置
- Modify: skills/devflow-docs-followup/SKILL.md | `Entry Gate`, `Completion Output` | 沿用适用性与用户选择结果
- Modify: skills/devflow-project-knowledge/SKILL.md | `完成复盘交接`, `完成钩子` | 引用业务事实确认与维护结果
Change: Learn 的结束回执注明文档和业务知识分支为适用、待选择或不适用，并引用已有输出；无需沉淀仍报告已复盘。静默或模糊回答不得转成 opt-out，业务事实未经确认不得维护。覆盖 V27-V28，D 类旁路保留既有边界。
Acceptance: 每次完成复盘都能解释后续条件分支的处置。
Verify: `npm run learn:verify` expected 退出码 0；人工走查功能实现、规则修改、纯验证、无可沉淀经验、有业务事实候选、用户静默和明确拒绝文档，输出与写入边界符合现有契约。
Not doing: 扩大默认审查范围；新增技能或持久化日志；改变审批门和节点裁决权。

Task: 建立编排可见性的正反例验证
Files:
- Modify: skills/devflow-prove/references/flow-self-test.md | `Scenario 1C-A: First Principles Cut` | 可回放的行为验收轨迹
- Modify: scripts/validate-devflow.js | `assertCapabilityContract` | 校验共享规则及 owner 引用
- Modify: scripts/validate-skill-triggers.js | `scenarios`, `assertScenario` | 校验入口到 owner 的关联
- Modify: scripts/capability-eval-scenarios.json | `scenarioEvidence` | 为新增场景声明验证边界
- Modify: scripts/devflow-plan.js | `checkPlanV2`, `selfTest` | 仅按需要补 External Skills 声明的条件结构验证
Change: 扩展现有验证面，不创建新 checker。静态断言只声明覆盖格式和连线，真实会话轨迹检查执行行为；纳入 Verification Matrix 的负例。新 Plan 的声明规则不迁移旧计划，不把仅出现关键词当作方法已执行。
Acceptance: 验证报告能够区分契约检查通过与真实会话行为验证通过。
Verify: `npm run plan:verify`、`npm run trigger:verify`、`npm run capability:verify`、`npm run capability:eval` expected 退出码 0；按 Verification Matrix 保留会话输出、调用结果和逐例判断，人工负例能判出仅加载无执行及触发后漏执行。
Not doing: 新增事件引擎、持久化日志、依赖或配置；扩大默认审查范围；改变 A/B/C、审批门和节点裁决权。

Task: 同步运行时副本并验证落地
Files:
- Modify: plugins/devflow/skills | `devflow-core/SKILL.md` | 同步既有 Codex 分发副本中实际变更的技能
- Modify: plugins/devflow/scripts | `devflow-plan.js` | 同步实际变更的现有 checker
- Modify: dsh/plugins/dsh-devflow/assets | `skills/devflow-core/SKILL.md` | 用 scripts/sync-assets.js 同步生成的实际变更副本
- Modify: docs/features/INDEX.md | `## 索引` | 让本次行为变化可检索
- Modify: docs/plans/INDEX.md | `2026-10-10-skill-orchestration-visibility` | 记录审批和落地证据
- Modify: docs/requirements.md | `## 台账` | 在现有台账追加确认后的需求行并按实际生命周期推进
Change: 按现有分发方式同步实际改动，验证副本一致；本机既有用户级运行时按仓库规则同步并检查，报告成功、失败与未运行。版本仅按既有分发要求调整。回写 Progress 和终态必须以实际验证为依据。
Acceptance: 已部署的运行时副本与本次通过验证的技能源一致。
Verify: `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 后 `node plugins/devflow/scripts/verify-plugin.js` 和 `npm run verify:all` expected 退出码 0；按现有用户级安装方式同步后 `node scripts/devflow-doctor.js` expected 无 missing/changed；重跑 Verification Matrix 中的真实会话抽样，确认加载源属于已同步版本。
Not doing: 新增宿主 UI、持久化日志或配置；改变 A/B/C、审批门和节点裁决权。

## Verification Matrix

静态检查验证文件、格式和引用关系。真实会话走查需保留实际输出和调用证据，不能用脚本中的输入字符串或 expected 文本冒充已发生行为。场景按相关路径分组执行，不在单次用户任务里强制跑全套。

| 场景 | 应观察到的行为 | 必须能识别的负例 |
|---|---|---|
| 简单已有功能修改 | 简短风险选路、Cut/Build/Prove 原有证据 | 跳过 Cut 或只用状态行代替实际结果 |
| 原因/约束不明 | 正确节点展示第一原理事实、约束与机制 | 只打印方法名称，或 Brainstorm 越权决定实现 |
| 历史经验或偏好命中/无命中 | 引用命中项及应用点，或明确无相关记录 | 未读卡却声称已应用，缺索引就新建空存储 |
| A/B 与 C 的外部技能 | 发现、声明、加载、执行返回、最终证明连续可追溯 | 有技能名无返回；专家失败被记为不适用 |
| 所选执行模式工具不可用 | 返回受阻与所缺事实 | 静默改模式或宣称已运行子任务 |
| 文字和 UI 输出 | 文字发现/修正；UI 既有六轴证据可追溯 | 复用旧稿检查；无 UI 也强制视觉打分 |
| 单次反馈与重复同目标失败 | 与既有 PUA 入口一致；恢复必须有完整事实 | 单次质疑自动宣称 PUA；只有 METHOD 行 |
| Learn 有/无记录、文档/知识分支 | 显示本次分支处置，保留用户确认 | 无经验也造卡；把静默当 opt-out；自动维护业务事实 |
| 无独立审查请求 | 正常 Prove 的内置检查即可 | 自动加载独立 adversarial/find-fault、Audit 或 Loop |
| 受阻、失败或未执行 | 回执保留真实状态并交原 owner 判断 | 将漏执行改写为不适用，统一摘要覆盖原失败 |

## Progress

| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | 定义节点回执与决策摘要契约 | done | `npm run route:verify` 退出码 0；core-methods.md 增共享执行回执契约与 Method 4 owner 归属；core SKILL.md Activation Evidence 增 Route basis、Context Map 增召回回执与缺失非阻断；reference-projects.md 方法 owner 与运行时一致 |
| 2 | 补齐已有节点产物与外部技能交接 | done | `npm run plan:verify` 退出码 0；`npm run route:verify` 退出码 0；Cut Required Gates/Handoff 声明回执性质，Plan 头部模板增 External Skills 行并明确无声明兼容，plan-methods Execution Handoff 携带返回事实，Build Direct Execution/Execution Mode/Handoff Gate 传结果入唯一 Prove 门，skill-call-diagram 展示返回流 |
| 3 | 为写后质量检查补齐本次结果 | done | `npm test` 退出码 0（validate-devflow 全 PASS，budget build 15347/15360）；build-methods Quality Gates 增回执收口与受阻调度规则；proof-recovery-methods 增回执引用与改稿重查；prose 清单 How to run/Exit check 增对象与结果记录；ui-slop 六轴接入回执；Prove Required Output 引用回执；镜像与 DSH 资产同步后 PASS |
| 4 | 对齐纠正与恢复的触发和返回事实 | done | `npm run route:verify` 退出码 0；`npm run trigger:verify` 退出码 0（20 场景，资产对等 PASS）；`npm run learn:verify` 退出码 0；Prove Pressure Recovery Check 区分单次纠正与重复同目标并增 Method 13B（proof-recovery-methods 承载边界）；Recovery Proof Contract 增普通纠正非恢复证据；Core Capability Dispatch 改单次纠正回 Core；PUA Repeated Same-Function Trigger 记录目标与触发依据 |
| 5 | 汇总学习闭环与条件交接处置 | done | `npm run learn:verify` 退出码 0；Learn Completion Output 增文档/业务知识两条分支处置行与静默不转 opt-out 规则；docs-followup Completion Output 增 Pending 行并声明回执性质；project-knowledge 完成钩子增业务事实确认状态行（14991/15360） |
| 6 | 建立编排可见性的正反例验证 | done | `npm run plan:verify` 0；`npm run trigger:verify` 0（23 场景，新增 external skill result continuity / single correction versus repeated recovery / post-write quality receipt）；`npm run capability:verify` 0；`npm run capability:eval` 0（13/13 PASS，Gaps: none，first-principles-cut 增 owner 归属与负例声明）；validate-devflow assertCapabilityContract 增回执契约与 9 处 owner 引用断言；devflow-plan.js 增 External Skills 条件结构校验与 4 组 self-test 用例；Scenario 1C-A 增 owner 边界、回执轨迹与负例 |
| 7 | 同步运行时副本并验证落地 | done | `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` 退出码 0；`node plugins/devflow/scripts/verify-plugin.js` PASS（14 skills/5 self-tests）；`npm run verify:all` 退出码 0；`node scripts/install-devflow-user.js --write --force` 六 home 各 57 文件后 `node scripts/devflow-doctor.js` 6/6 pass 退出码 0；Codex 插件副本 robocopy /MIR 逐字节一致 |

## Review Notes

- 统计与修复均已实施：34 个检查单元的分类保留为决策记录，Progress 表按任务回写证据。
- UI 清单本来就要求记录六轴分数，修复是接通证据和摘要，不重新发明评分机制。
- C 类已存在执行契约，优先复用其结果。D 类有报告且按条件启动，保留该边界。
- 最大风险是"统一回执"变成新的散文自述或重复表单。验收必须抽查实际动作与返回结果，静态检查不宣称验证了模型行为。
- 实施按 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 顺序执行（Build 代理自身顺序执行，未委派）。

## Draft Verification

- Command: `node scripts/devflow-plan.js docs/plans/2026-10-10-skill-orchestration-visibility.md`
- Result: v2，Status: draft，7 tasks / 7 Progress rows，Judgment: PASS。
- Command: `node scripts/devflow-plan.js --index`
- Result: Problems: none，Judgment: PASS。
- Command: `git diff --check`
- Result: 无空白错误。
- Manual/structured review: 34 个唯一 ID，分类 A=3/B=9/C=18/D=4；7 项任务全部保持 todo；47 个任务锚点逐项对照当前文件或目录。
- Adversarial review: 核对已有六轴记录、独立审查和 Loop 的条件边界、原审批门、仅加载无结果、失败与不适用的区别；方案复用原证据载体，并将真实会话正反例单独列为实施验收。
- Judgment: PASS，仅指统计一致性、源码锚点与方案草案结构。运行时修复和真实会话效果尚未验证。
- Learning review: 本轮方案验证未新增可独立证明的执行经验；不新建学习卡，不更新业务知识包。
