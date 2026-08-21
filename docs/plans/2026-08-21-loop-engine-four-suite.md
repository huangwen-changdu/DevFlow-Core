# Loop Engine 四件套落地实现计划

Goal: 把「规划-执行-验证-沉淀」四件套落地进 loop-engine 协议与模板，且把决策权还给模型——人在循环中只写循环定义与打断，定义内的一切决策（规模评级、子目标拆分与改链、路线图制订与修订、对抗轮、失败卡沉淀与召回、受阻换策略）由模型自主完成，只有触及定义边界（目标/范围/停止条件/预算变化）才停下来问人。

Architecture: 纯协议与模板演进——SKILL.md 扩展协议节（自主性边界/分级与路线图/子目标链/收尾对抗轮/失败卡/受阻换策略 + 反规避表）、三个模板加规模评级与中大区块示例、README 说明四件套与 loop/learned/；不动组合文件、persona 锚定与插件分发结构；失败卡自动层落在工作区 loop/learned/（协议约定路径，不预建目录）。

Tech Stack: DSH skill（Markdown + YAML frontmatter）+ 模板 Markdown；校验用 pwsh 文本检查与真实会话验收。

Source: Brainstorm Confirmed request（本会话 2026-08-21 四件套落地，无 spec 文件）+ 计划审阅修订（决策权还给模型，取消三处人工确认门）

Spec coverage: 自主性边界 由 Task 1 覆盖；子目标分解+路线图+受阻换策略 由 Task 1 与 Task 2 覆盖；收尾对抗轮 由 Task 1 覆盖；失败卡自写自召回 由 Task 1 与 Task 3 覆盖；分级自判 由 Task 1 与 Task 2 覆盖。

Cut Decision: CUT_PASS——允许范围：skills/loop-engineering/SKILL.md、templates 三文件、dsh/agent-presets/loop-engine/README.md、协议约定路径 loop/learned/（不预建）；复用结论：SKILL.md 现有结构与节、.copilot 卡格式（失败卡自动层格式参照）、devflow 对抗审查精神（不复制内容）、existing 草拟确认流程（确认只发生在循环定义本身）；裁剪：不预建 loop/learned/ 空目录、不做并行扇出（受阻换策略为单模型多候选，非多代理）、不动 .copilot 结构、不加新插件与组合行、取消链变更/升权/提纯三处人工确认门（决策权还给模型）；排除：组合/persona/插件分发改动、.copilot 体系结构改动；验证约束：文本检查 + 真实会话验收（中大任务四件套自主闭环 + 小任务轻量）+ 全链同步（sync-assets + 运行时 + 哈希）。

External Skills: writing-skills; role: skill 修改的 TDD 与 CSO 规范（RED baseline 证据、description 只写触发条件、反规避表、红旗清单）; expected evidence: 协议修改针对 baseline 失败（三次入口失败 + 绿但错实证 + 教训未跨循环召回）且 description 收敛为纯触发条件; return facts: 规范应用结果或偏离说明

Execution mode: sequential

## Global Constraints

- 不动 agent.cordis.yml、插件 cordis.patch.yml、persona 锚定与分发结构。
- 自主性边界：循环定义（目标/停止条件/预算/产出物/检查点）一经确认，定义内一切决策归模型（规模自判、子目标自拆自改、路线图自订自修、对抗轮、失败卡、受阻换策略）；只有触及定义边界（目标/范围/停止条件/预算变化）才停下来问人。
- 分级自判：轮次预算为线索，模型自判规模并决定是否启用路线图与子目标分解，自判依据写入状态文件；不设人工升权确认。
- 对抗轮为必过门槛；失败卡自动层 loop/learned/（自写自召回），收尾报告可列「建议提升 .copilot」由人可选确认（非门槛）。
- description 按 writing-skills CSO 收敛为纯触发条件（含中大任务触发词），不写流程总结。
- 改动后全链同步：sync-assets + 运行时两处 + 哈希验证 + standingKeyFor（组合未动，仅同步 skill 与 README）。

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `skills/loop-engineering/SKILL.md` / section 自主性边界 | Modify | 四件套协议扩展（自主性边界/分级/路线图/子目标/对抗轮/失败卡/受阻换策略/反规避） | 协议唯一权威源 | 不改 persona 与组合 |
| `skills/loop-engineering/templates/fix-bug-to-green.md` / section 字段 | Modify | 规模评级字段与中大区块示例 | 内置模板 | 无 |
| `skills/loop-engineering/templates/implement-feature-to-green.md` / section 字段 | Modify | 规模评级字段与中大区块示例 | 内置模板 | 无 |
| `skills/loop-engineering/templates/generic-task.md` / section 字段 | Modify | 规模评级字段与中大区块示例 | 内置模板 | 无 |
| `dsh/agent-presets/loop-engine/README.md` / section What it is | Modify | 四件套与 loop/learned/ 说明 | 用户入口文档 | 无 |

Task: SKILL.md 四件套协议扩展

Task type: Documentation-only

Files:
- Modify: skills/loop-engineering/SKILL.md | section 自主性边界 | 新增四件套协议节与反规避表，收敛 description

Interfaces:
- Consumes: documentation-only
- Produces: documentation-only

Steps:
- [ ] Modify `skills/loop-engineering/SKILL.md` frontmatter description 收敛为纯触发条件（保留「Use when the human hands you a loop definition, a requirement, a problem, or a question in a Loop Engine session」并补「or when a loop task spans multiple files, several steps, or a large round budget」，删除流程总结句）。
- [ ] Modify `skills/loop-engineering/SKILL.md` 新增「自主性边界」节：循环定义确认后，定义内一切决策归模型自决（规模、拆分、路线、验证、沉淀、换策略）；只有目标/范围/停止条件/预算需要变化时才停下来问人；自决依据写入状态文件。
- [ ] Modify `skills/loop-engineering/SKILL.md` 新增「分级与路线图」节：以轮次预算为线索自判规模（小任务免路线图与子目标分解，自判依据记录在案）；中大任务先写路线图（预期步骤 + 每步验证点），每轮对照纠偏，偏差允许模型自行修订路线图。
- [ ] Modify `skills/loop-engineering/SKILL.md` 新增「子目标链」节：中大任务由模型自行拆成子目标链（每个子目标自带停止条件与预算），逐段跑小循环；链的插删改由模型自决（记录理由）；某子目标 blocked 时模型自行评估继续或改链，只有超出定义范围才问人。
- [ ] Modify `skills/loop-engineering/SKILL.md` 新增「收尾对抗轮」节：停止条件通过后换批评者角色审一轮，强制产出「最可能错的地方 + 证据」与已检查项（断言覆盖、副作用、更小改法）；发现真问题追加修复轮；通过才判达成。
- [ ] Modify `skills/loop-engineering/SKILL.md` 新增「失败卡」节：收尾由模型自动写 loop/learned/ 根因-修复模式卡（触发/根因/修复/防复发），同模式更新不新建；每个循环开头先扫 loop/learned/ 召回适用卡；收尾报告可列「建议提升 .copilot」由人可选确认。
- [ ] Modify `skills/loop-engineering/SKILL.md` 新增「受阻换策略」节：连续轮次受阻或证据矛盾时，模型自行生成两个以上候选策略、预估风险并择一继续，把弃选理由写入决策日志；不得用「再试一次同样动作」充当换策略。
- [ ] Modify `skills/loop-engineering/SKILL.md` 新增「反规避表与红旗」节：列出已知逃逸（跳过对抗轮、拿小预算偷懒、路线图只写不照、卡不落盘、受阻不换策略、擅自扩大定义范围）与对应拦截。

Acceptance: 七个新增节齐备且语义与修订后 Confirmed request 一致（决策权归模型、定义外才问人）；description 无流程总结、含中大任务触发词；反规避表覆盖已知逃逸。

Verify: Run `pwsh -Command "Select-String -Path skills/loop-engineering/SKILL.md -Pattern '自主性边界','分级与路线图','子目标链','收尾对抗轮','失败卡','受阻换策略','反规避'"`; expect returns 七行命中；Run `pwsh -Command "Select-String -Path skills/loop-engineering/SKILL.md -Pattern 'spans multiple files'"`; expect returns 命中。

Comments: 协议即文档，节标题自解释；不另加注释。

Not doing: 不动组合与 persona；不改触发节与草拟确认节之外的既有节；不预建 loop/learned/ 目录；不做多代理并行扇出。

Task: 三个模板加规模评级与中大区块

Task type: Documentation-only

Files:
- Modify: skills/loop-engineering/templates/fix-bug-to-green.md | section 字段 | 加规模评级字段与示例
- Modify: skills/loop-engineering/templates/implement-feature-to-green.md | section 字段 | 加规模评级字段与示例
- Modify: skills/loop-engineering/templates/generic-task.md | section 字段 | 加规模评级字段与示例

Interfaces:
- Consumes: documentation-only
- Produces: documentation-only

Steps:
- [ ] Modify `skills/loop-engineering/templates/fix-bug-to-green.md` 字段块加「规模评级: 模型自判（预算为线索）」一行，并附中大任务区块示例（子目标链 + 路线图占位）。
- [ ] Modify `skills/loop-engineering/templates/implement-feature-to-green.md` 字段块加「规模评级: 模型自判（预算为线索）」一行与示例（中大任务草拟时附子目标链与路线图）。
- [ ] Modify `skills/loop-engineering/templates/generic-task.md` 字段块加「规模评级: 模型自判」一行与说明（中大任务附子目标链与路线图）。
- [ ] Run `pwsh -Command "(Get-ChildItem skills/loop-engineering/templates -Filter *.md | ForEach-Object { Select-String -Path $_.FullName -Pattern '规模评级' })"`; expect returns 三行命中。

Acceptance: 三个模板均含「规模评级」字段且中大区块示例与 SKILL.md 分级规则一致（模型自判，无人工确认）。

Verify: Run `pwsh -Command "Select-String -Path skills/loop-engineering/templates/fix-bug-to-green.md,skills/loop-engineering/templates/implement-feature-to-green.md,skills/loop-engineering/templates/generic-task.md -Pattern '规模评级'"`; expect returns 三行命中。

Comments: 模板字段自带说明（沿用现有格式）。

Not doing: 不改模板的规则节；不新增模板文件。

Task: README 四件套说明

Task type: Documentation-only

Files:
- Modify: dsh/agent-presets/loop-engine/README.md | section What it is | 补四件套与 loop/learned/ 说明

Interfaces:
- Consumes: documentation-only
- Produces: documentation-only

Steps:
- [ ] Modify `dsh/agent-presets/loop-engine/README.md` What it is 节补 bullet：模型自主闭环（规划-执行-验证-沉淀四件套：子目标分解/路线图/收尾对抗轮/失败卡，定义内决策全归模型，定义外才问人）。
- [ ] Modify `dsh/agent-presets/loop-engine/README.md` Caveats 节补 loop/learned/ 失败卡目录说明（模型自动沉淀、随项目 git 提交）。
- [ ] Run `pwsh -Command "Select-String -Path dsh/agent-presets/loop-engine/README.md -Pattern '四件套','loop/learned'"`; expect returns 命中。

Acceptance: README 可见四件套与失败卡目录说明，与协议一致。

Verify: Run `pwsh -Command "Select-String -Path dsh/agent-presets/loop-engine/README.md -Pattern '四件套'"`; expect returns 命中。

Comments: README 是用户入口文档。

Not doing: 不改 Install/Use/Caveats 其余内容；不动插件 README。
