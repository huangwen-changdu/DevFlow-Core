# DevFlow Core

Use DevFlow Core for this request.

First read `AGENTS.md`. If skill files are available, also read `skills/devflow-core/SKILL.md` before routing.
At Sense, probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`. Load only index-matched learning cards or navigation-selected business knowledge documents; absence is non-blocking and does not create storage. **Also scan available skills in the current environment** (platform skill registry, `use_skill` listing, local skill directories). When a non-devflow skill (e.g., `frontend-design`, `pdf`, `understand`, `data-analysis`) matches the task, suggest loading it alongside the devflow route — external skills guide execution quality, devflow manages scope and risk.

Route as Problem, Fast, Design-lite, Design, Build, or Recovery.

Hard trigger rules:

- If the request mentions requirement, feature, UI, page, behavior, architecture, ambiguity, multiple options, unclear distinction, prompt, quick question, service/server implementation, or says something is hard to distinguish, load `skills/devflow-brainstorm/SKILL.md` before coding.
- For non-trivial Brainstorm, load `skills/devflow-brainstorm/SKILL.md` plus `skills/devflow-brainstorm/references/interview-discipline.md`; read facts, send Semantic Echo-Back, apply the Understanding Revision Rule when a correction changes the request, ask one question at a time with a recommended answer only for real request gaps, then output `Confirmed request` and `Status: clarified`. Brainstorm stops there. `devflow-core` consumes the summary and decides whether Spec design work is required; after Spec comparison and design approval, the confirmed Spec returns to Core for lifecycle routing. Continue through Build/Prove when implementation is requested.
- Requirements and feature requests load devflow-brainstorm before any code. The brainstorming skill enforces its own HARD-GATE.
- If the user asks to implement, adjust, update, fix, build, or land the change, continue through Build and Prove. Steps scale to task size — Cut and Prove are never skipped, but Brainstorm/Plan may be skipped when already completed or when the task is trivial enough for Fast/Design-lite.
- If the request reports a problem without asking for a fix, run Problem: Sense -> Prove facts first.
- If the request includes bug, error, failing test, broken, or regression, include Root-Cause Check before editing.
- For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.
- If the user repeatedly points out that the same function, result, or requested capability has a problem in one task lifecycle, then load `skills/devflow-pua/SKILL.md`; read `skills/devflow-pua/references/methodology-router.md`, `skills/devflow-pua/references/methodology-library.md`, and `skills/devflow-pua/references/flavor-display.md`, stop the current approach, quarantine old wrong context, classify User-view miss and Satisfaction gap, display `METHOD: {flavor} / {method}`, return recovery facts to `devflow-core`, and switch to a different/opposite method when the prior method failed. Core decides whether `skills/devflow-brainstorm/SKILL.md` must re-confirm the request and selects later lifecycle work.
- If the user explicitly requests independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load `skills/devflow-adversarial/SKILL.md` directly. If the user explicitly requests find-fault review, biggest omission, blind spot, least-certain point, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握, load `skills/devflow-find-fault/SKILL.md` directly. Both are manual at any stage and do not read, require, modify, or hand off to lifecycle skills or completion state.

For Brainstorm:

- Use `skills/devflow-brainstorm/references/interview-discipline.md` to send a Semantic Echo-Back, then clarify one real request gap at a time.
- Record only goal, scope, out-of-scope boundary, constraints, acceptance, and open questions in `Confirmed request` with `Status: clarified`.
- Stop after the fixed summary. `devflow-core` selects any later lifecycle skill.
- If project facts establish an answer, state that fact rather than asking.

For requests like "the page cannot clearly distinguish prompts from quick questions", treat the visual distinction as a product/UX ambiguity. Enter Brainstorm, confirm the user-visible distinction, and stop after the fixed summary so Core can route the next work.

Before implementation, run Cut with Required Gates: Reuse, Ponytail Rung, Root-Cause (for bug fixes), Native, Overbuild, Diff, Scope. Return all Cut results to Core: `CUT_PASS` lets Core select Plan, Build, Prove, or no further work; `CUT_REDUCE`/`CUT_REUSE` STOP for user confirmation, then Core routes; `CUT_BLOCKED` returns blocking facts so Core decides whether Brainstorm is needed. If the miss is reusable, load `devflow-learn`.

Completion proof must include:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```
