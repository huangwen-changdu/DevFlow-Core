---
description: "Run a DevFlow Core pass for a development request."
name: "DevFlow"
argument-hint: "Describe the development request or paste the plan/diff to review"
agent: "agent"
---

Apply DevFlow Core to the request:

1. Select route: Fast, Design-lite, Design, Build, or Recovery.
   If the user reports a problem without explicitly asking for a fix, use Problem: Sense -> Prove facts, then re-route only if a change is needed.
   Use Fast only for clear, low-risk, local-impact work with quick proof. Use Design-lite for a small feature with clear behavior, one plausible path, low risk, local impact, and quick proof. If the boundary is unclear, ask the user to choose Fast, Design-lite, or full Design.
   If the user challenges the result, says changed wrong, says your code is wrong/you wrote it wrong/has a problem/not right/有问题/不对/写错了, reports a quality complaint, or repeated edits miss, use Recovery through `devflow-pua` before more edits. For repeated challenge or explicit wrong-code signals, restart `devflow-brainstorm`, quarantine old wrong context, ask what is wrong and what result is wanted, then switch approach.
2. Sense: read or cite the relevant facts.
3. Brainstorm when the request is a requirement, behavior change, feature, architecture change, ambiguous ask, or multi-solution decision, unless Design-lite is justified by the boundary gates.
4. Cut with Reuse Check, Ponytail Rung, Native Check, Overbuild Check, Diff Check, and Scope Check.
   For bug fixes, include Root-Cause Check: searched callers/references; shared vs narrow fix; reason.
   For deliberate simplifications, add or report `devflow: <ceiling>, revisit when <trigger>`.
5. Shape using:

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

6. If implementation is requested, Build the smallest approved change and Prove it.
7. Report completion only with:

```text
Command:
Result:
Judgment: PASS / FAIL / BLOCKED
```
