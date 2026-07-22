# DevFlow Brainstorm Semantic Echo-Back

## Goal

修复 `devflow-brainstorm` "先问流程、后懂需求" 的交互顺序问题：在任何流程门禁（Depth Selection Gate A/B/C、spec、plan）之前，先向用户回显对需求的理解并获得确认，使语义误读在进入流程前被拦截。

## Context

原 `skills/devflow-brainstorm/SKILL.md` 的第一个用户交互是 Depth Selection Gate（流程问题），`Frame the goal` 仅为内部动作、从不与用户确认。用户反馈：skill 不会先理解需求的语义就直接按流程提问。

对比 Superpowers `skills/brainstorming/SKILL.md`：其首个用户交互即围绕 purpose/constraints/success criteria 的澄清提问，不存在任何流程门禁排在语义澄清之前，语义在提问中自然被确认。

本改动取代 `docs/specs/2026-07-17-devflow-brainstorm-superpowers-interaction.md` 中"Depth Selection Gate 在澄清之前"的顺序决策（该 spec 需求 1.3 与验收 1 仅就顺序而言被取代，其余要求仍然有效）。

## Requirements

1. 在 Process 中新增第 3 步 `STOP — Confirm understanding`：读事实、框定目标之后，必须先把理解回显给用户确认，然后才能检查 Small Request Boundary、展示 Depth Selection Gate。
2. 回显即第一个澄清问题，不增加交互轮次。输出格式：
   ```text
   My understanding:
   - Problem to solve: 一句话，用用户的业务语言
   - Known facts/constraints: 从代码、文档、提交记录读到的事实
   - NOT what you want: 被排除的误读方向
   Is this right? (correct me / confirm)
   ```
   清晰的小请求可缩至 1-2 行。
3. 需求存在两种以上合理解读时，回显必须是解读之间的消歧选择题，禁止猜测。
4. 从代码/文档/提交读到的事实直接陈述、不提问；业务意图必须确认、不推断。
5. HARD-GATE 同步改为：语义理解必须先回显并经用户确认，然后才展示 Depth Selection Gate。
6. 护栏补充：Anti-Rationalization 新增"请求很清晰可跳过回显"借口行；Red Flags 新增"语义未确认先问流程问题"；Verification 清单新增语义回显确认项。
7. `references/interview-discipline.md` 的 Development Flow 与 Interview Behavior 同步插入语义回显步骤。
8. 顺手去重：删除与编号列表重复的 dot Process Flow 图、与 Depth Flow Table 重复的深度 ASCII 流程图，保持 SKILL.md 精简（长度是影响遵守率的因素）。
9. 不改动 A/B/C 深度语义、交接链（A→spec→plan→cut / B→plan→cut / C→cut）、Core Clarification 3 问、分节确认等既有机制。

## Non-goals

- 不删除或弱化 Depth Selection Gate 本身，用户仍显式选择 A/B/C。
- 不为回显新增独立的额外交互轮次（它与第一个澄清问题合并）。
- 不改动 `devflow-cut`、`devflow-build`、`devflow-prove`、`devflow-pua` 等其他 skill。
- 不修改 2026-07-17 的旧 spec（历史快照保留，以本 spec 记录取代关系）。
- 不引入新的脚本、依赖或生成物。

## Approach

在原 skill 上就地修改：

1. 调序：语义确认成为第一个用户 STOP 点，Depth Gate 后移至语义确认与 Small Request Boundary 之后。
2. 新增 `Semantic Echo-Back` 章节定义回显格式与规则。
3. 以删除重复图表抵消新增内容，保持文件总长度不膨胀。
4. 通过 `node scripts/validate-devflow.js` 校验。

## Impact

- `skills/devflow-brainstorm/SKILL.md`：Process 步骤重编号、HARD-GATE 措辞、新增 Semantic Echo-Back 章节、删除两处重复图表、三处护栏补充、Verification 清单新增一项。
- `skills/devflow-brainstorm/references/interview-discipline.md`：Development Flow 与 Interview Behavior 同步。

## Acceptance

1. 对一个模糊需求，skill 的第一轮输出是理解回显（或消歧选择题），而不是 Depth Selection Gate。
2. 对一个清晰小需求，回显为 1-2 行，随后正常进入 Small Request Boundary 与 A/B/C 选择。
3. A/B/C 深度语义、确认次数（3/2/1）与交接链保持不变。
4. `node scripts/validate-devflow.js` 通过。

## Verification

- 运行 `node scripts/devflow-spec.js docs/specs/2026-07-22-devflow-brainstorm-semantic-echo-back.md` 校验本 spec 结构。
- 运行 `node scripts/validate-devflow.js` 校验 skill 文件。
- 检查 `skills/devflow-brainstorm/SKILL.md` 的 Process 顺序：Confirm understanding（第 3 步）→ Small Request Boundary（第 4 步）→ Depth Selection Gate（第 5 步）。
- 场景验证：模糊需求首轮输出为回显/消歧；清晰需求回显简短。
- 搜索确认 Red Flags、Anti-Rationalization、Verification 清单均含语义回显相关条目。

## Open Questions

None.
