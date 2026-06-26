# DevFlow Core

Use DevFlow Core for this request.

First read `AGENTS.md`. If skill files are available, also read `skills/devflow-core/SKILL.md` before routing.

Route as Problem, Fast, Design-lite, Design, Build, or Recovery.

Hard trigger rules:

- If the request mentions requirement, feature, UI, page, behavior, architecture, ambiguity, multiple options, unclear distinction, prompt, quick question, service/server implementation, or says something is hard to distinguish, load `skills/devflow-brainstorm/SKILL.md` before coding.
- If the user asks to implement, adjust, update, fix, build, or land the change, do not stop at design; continue through Cut, Build, and Prove after Brainstorm.
- If the request reports a problem without asking for a fix, run Problem: Sense -> Prove facts first.
- If the request includes bug, error, failing test, broken, or regression, include Root-Cause Check before editing.
- If the user says wrong, not like that, changed wrong, your code is wrong, you wrote it wrong, has a problem, not right, quality complaint, user dissatisfied, 有问题, 不对, 写错了, 改歪了, 没改对, 不是我要的, 理解错了, or 改了几次, load `skills/devflow-pua/SKILL.md`. For repeated challenge or explicit wrong-code signals, stop the current approach, quarantine old wrong context, restart `skills/devflow-brainstorm/SKILL.md`, ask what is wrong and what result is wanted when not inferable, switch approach, then Prove and Learn when reusable.

For Brainstorm:

- Clarify goal, constraints, acceptance, and hidden assumptions.
- Compare 2-3 approaches unless Design-lite is justified by facts.
- Ask exactly one smallest blocking question when a business/product decision cannot be inferred from project facts.
- If the answer can be inferred from code, backend implementation, existing UI, or docs, state the inference with evidence instead of asking.

For requests like "the page cannot clearly distinguish prompts from quick questions", treat the visual distinction as a product/UX ambiguity. Enter Brainstorm and decide whether to ask one blocking question or propose the smallest inferable distinction from existing UI/backend facts.

Before implementation, run Cut with Reuse, Native, Overbuild, Diff, and Scope checks.

Completion proof must include:

```text
Command:
Result:
Judgment: PASS / FAIL / BLOCKED
```
