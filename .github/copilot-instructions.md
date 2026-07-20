# DevFlow Core v2 Copilot Instructions

Follow [AGENTS.md](../AGENTS.md) as the shared project rule source.

Default workflow:

1. Sense: read project facts before deciding. Probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`, then progressively read only index-matched cards or navigation-selected knowledge documents; absence is non-blocking and does not create storage.
2. Brainstorm: for requirements, behavior changes, features, architecture, ambiguity, or multiple options, compare 2-3 approaches and recommend the smallest useful path. Use Design-lite only for a small change to an existing feature with clear behavior, one plausible path, low risk, local impact, and quick proof — not for new requirements. The brainstorming skill enforces its own HARD-GATE and ends at the Depth Selection Gate: the user picks A/B/C (option semantics live in `skills/devflow-brainstorm/SKILL.md`); depth is user-chosen, not LLM-asserted.
3. Spec or Plan: `devflow-spec` saves a requirements spec under `docs/specs/`; `/devflow-plan` creates an implementation Plan Pack. Depth C skips both and goes directly to Cut. Both spec and plan have a STOP gate for user review.
4. Cut: apply Required Gates (Reuse, Ponytail, Root-Cause, Native, Overbuild, Diff, Scope) before new code or structure. Output CUT_PASS / CUT_REDUCE / CUT_REUSE / CUT_BLOCKED.
5. Build: make the smallest necessary change only.
6. Prove: run verification and report real evidence. For development work, perform adversarial review against acceptance criteria, touched files, likely regressions, activation paths, and proof coverage; a real gap means `FAIL` or continued work before completion.

For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear. Reduce to facts, constraints, and invariants before selecting a solution.

If the user challenges the result, says it was changed wrong, says your code is wrong/you wrote it wrong/has a problem/not right/missing/incomplete/still missing/有问题/不对/写错了/少了/少个/缺少/缺漏/遗漏/漏了, or repeated edits miss the target, enter pressure recovery: stop the current approach, read the local devflow-pua methodology-router/methodology-library/flavor-display references, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `METHOD: {flavor} / {method}`, restart devflow-brainstorm, ask what is wrong and what result is wanted when not inferable, switch to a different/opposite method when the prior method failed, then prove. If the miss is reusable, load `devflow-learn`.

For bug fixes, search callers/references before editing and choose shared vs narrow fix intentionally. Mark deliberate simplifications with `devflow: <ceiling>, revisit when <trigger>` so `/devflow-debt` can harvest them.

When the user reports a problem without explicitly asking for a fix, prove the facts first and re-route only after the needed change is known.

If a request might be Fast, Design-lite, or full Design and facts do not decide it, ask the user to choose the route instead of guessing.

Design output:

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

Completion proof:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```

Never claim done without proof. Never add dependency, abstraction, config, directory, framework layer, or generic extension unless the current task needs it now. User instructions say WHAT, not HOW — skills enforce their own gates.
