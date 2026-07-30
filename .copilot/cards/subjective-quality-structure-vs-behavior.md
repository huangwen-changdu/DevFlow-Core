# Subjective Quality Requests: Structure vs Behavior

- Trigger: 主观质量诉求改 skill/prompt（"不够灵动"、"不好用"、"感觉差点什么"、"太死板"）；用户已确认处方；把强制格式改为可选
- Lesson: 主观质量诉求先分类是结构问题还是行为/能力问题。用户确认的处方也可能解错问题：把"灵动性"译成放松流程结构（字段按需、格式可选、快速通道），实际缺的是主动义务（多角度分析、找漏洞、给推荐）。对 LLM prompt，可选格式=行为删除；正解是强制结构+自然措辞。验收判据要测默认行为（LLM 实际会怎么做），不是测特性存在（文本里有没有这个机制）。
- Next action: Next time translating a subjective quality complaint into a skill/prompt change, first classify structure-vs-behavior, keep formats mandatory with free wording inside, and write acceptance criteria that test default behavior; do not relax structure as a cure for felt rigidity, and do not add self-selected fast-lane tiers.
- Scope: project
- Related: `skills/devflow-brainstorm/SKILL.md`, `skills/devflow-brainstorm/references/interview-discipline.md`, `scripts/validate-skill-triggers.js`
- Evidence: 2026-07-30 brainstorm 改写 v1（放松结构）被用户判"根本没有灵动性、把流程方案和设计确认搞没了"；v2（结构全恢复强制+主动分析义务化+删 light 档默认 deep）通过用户确认点与 `node scripts/validate-skill-triggers.js`（14 场景 PASS）。
- Invalidation: Revise when a future skill change shows felt rigidity was genuinely caused by process structure rather than missing proactive duties, or when host LLM behavior changes such that optional formats are reliably honored.
