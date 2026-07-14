# DevFlow Core

Use DevFlow Core for this request.

First read `AGENTS.md`. If skill files are available, also read `skills/devflow-core/SKILL.md` before routing.

Route as Problem, Fast, Design-lite, Design, Build, or Recovery.

Hard trigger rules:

- If the request mentions requirement, feature, UI, page, behavior, architecture, ambiguity, multiple options, unclear distinction, prompt, quick question, service/server implementation, or says something is hard to distinguish, load `skills/devflow-brainstorm/SKILL.md` before coding.
- For non-trivial Brainstorm, load `skills/devflow-brainstorm/SKILL.md` plus `skills/devflow-brainstorm/references/interview-discipline.md`; ask one question at a time with a recommended answer, read facts instead of asking when possible. Brainstorm has a Depth Selection Gate (A/B/C): A → devflow-spec → /devflow-plan (3 confirmations), B → /devflow-plan (2 confirmations), C → devflow-cut directly (1 confirmation). Core Clarification 3 questions are required for all depths. Continue through the selected depth path, then Cut/Build/Prove.
- Requirements and feature requests load devflow-brainstorm before any code. The brainstorming skill enforces its own HARD-GATE.
- If the user asks to implement, adjust, update, fix, build, or land the change, continue through Build and Prove. Steps scale to task size — Cut and Prove are never skipped, but Brainstorm/Plan may be skipped when already completed or when the task is trivial enough for Fast/Design-lite.
- If the request reports a problem without asking for a fix, run Problem: Sense -> Prove facts first.
- If the request includes bug, error, failing test, broken, or regression, include Root-Cause Check before editing.
- For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.
- If the user says wrong, not like that, changed wrong, your code is wrong, you wrote it wrong, has a problem, not right, missing, incomplete, still missing, quality complaint, user dissatisfied, 有问题, 不对, 写错了, 改歪了, 没改对, 不是我要的, 理解错了, 少了, 少个, 缺少, 缺漏, 遗漏, 漏了, or 改了几次, load `skills/devflow-pua/SKILL.md`. For repeated challenge, explicit wrong-code signals, or repeated missing-piece complaints, also read `skills/devflow-pua/references/methodology-router.md`, `skills/devflow-pua/references/methodology-library.md`, and `skills/devflow-pua/references/flavor-display.md`; stop the current approach, quarantine old wrong context, classify User-view miss and Satisfaction gap, display `METHOD: {flavor} / {method}`, restart `skills/devflow-brainstorm/SKILL.md`, ask what is wrong and what result is wanted when not inferable, switch to a different/opposite method when the prior method failed, then Prove and Learn when reusable.

For Brainstorm:

- Clarify goal, constraints, acceptance, and hidden assumptions.
- Compare 2-3 approaches. Design-lite is for existing features only, not new requirements.
- Ask exactly one smallest blocking question when a business/product decision cannot be inferred from project facts.
- If the answer can be inferred from code, backend implementation, existing UI, or docs, state the inference with evidence instead of asking.

For requests like "the page cannot clearly distinguish prompts from quick questions", treat the visual distinction as a product/UX ambiguity. Enter Brainstorm and decide whether to ask one blocking question or propose the smallest inferable distinction from existing UI/backend facts.

Before implementation, run Cut with Required Gates: Reuse, Ponytail Rung, Root-Cause (for bug fixes), Native, Overbuild, Diff, Scope. Output CUT_PASS / CUT_REDUCE / CUT_REUSE / CUT_BLOCKED. CUT_REDUCE/CUT_REUSE: STOP for user confirmation. CUT_BLOCKED: return to devflow-brainstorm. If the miss is reusable, load `devflow-learn`.

Completion proof must include:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```
