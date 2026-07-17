---
description: "Run a DevFlow Core pass for a development request."
name: "DevFlow"
argument-hint: "Describe the development request or paste the plan/diff to review"
agent: "agent"
---

Apply DevFlow Core to the request:

1. Select route: Fast, Design-lite, Design, Build, or Recovery.
   If the user reports a problem without explicitly asking for a fix, use Problem: Sense -> Prove facts, then re-route only if a change is needed.
   Use Fast for pure Q&A, fact lookup, verification, or trivial code change (one line, no logic change, no risk). Use Design-lite for a small change to an existing feature with clear behavior, one plausible path, low risk, local impact, and quick proof — not for new requirements. If the boundary is unclear, ask the user to choose Fast, Design-lite, or full Design.
   If the user challenges the result, says changed wrong, says your code is wrong/you wrote it wrong/has a problem/not right/missing/incomplete/still missing/有问题/不对/写错了/少了/少个/缺少/缺漏/遗漏/漏了, reports a quality complaint, or repeated edits miss, use Recovery through `devflow-pua` before more edits. For repeated challenge, explicit wrong-code signals, or repeated missing-piece complaints, read local methodology-router/methodology-library/flavor-display references, restart `devflow-brainstorm`, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `METHOD: {flavor} / {method}`, ask what is wrong and what result is wanted, then switch to a different/opposite method when the prior method failed.
   For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.
2. Sense: read or cite the relevant facts. Probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`; progressively load only matched cards or navigation-selected knowledge documents. Missing knowledge is non-blocking and does not create storage.
3. Brainstorm for requirements, behavior changes, features, architecture changes, ambiguous asks, or multi-solution decisions. The brainstorming skill enforces its own HARD-GATE — Design-lite cannot bypass it for new features.
4. Cut with Required Gates: Reuse, Ponytail Rung, Root-Cause Check (for bug fixes), Native, Overbuild, Diff, Scope.
   Output CUT_PASS / CUT_REDUCE / CUT_REUSE / CUT_BLOCKED. CUT_REDUCE/CUT_REUSE: STOP for user confirmation. CUT_BLOCKED: return to devflow-brainstorm.
   For deliberate simplifications, add or report `devflow: <ceiling>, revisit when <trigger>`.
5. Present design contract (brainstorm STOP), then spec or /devflow-plan (STOP), using:

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

6. If implementation is requested, Build the smallest change and Prove it. For development work, Prove must include adversarial review; a real gap means `FAIL` or continued work before completion. If the miss is reusable, load `devflow-learn`.
7. Report completion only with:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```
