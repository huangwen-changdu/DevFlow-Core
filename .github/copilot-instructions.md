# DevFlow Core v2 Copilot Instructions

Follow [AGENTS.md](../AGENTS.md) as the shared project rule source.

Default workflow:

1. Sense: read project facts before deciding.
2. Brainstorm: for requirements, behavior changes, features, architecture, ambiguity, or multiple options, compare 2-3 approaches and recommend the smallest useful path. Use Design-lite only for a small feature with clear behavior, one plausible path, low risk, local impact, and quick proof.
3. Cut: apply the Ponytail Ladder and anti-overengineering gates before new code or structure.
4. Shape: output goal, smallest useful plan, not doing, impact, and verification.
5. Build: make the smallest necessary change only.
6. Prove: run verification and report real evidence.

If the user challenges the result, says it was changed wrong, says your code is wrong/you wrote it wrong/has a problem/not right/missing/incomplete/still missing/有问题/不对/写错了/少了/少个/缺少/缺漏/遗漏/漏了, or repeated edits miss the target, enter pressure recovery: stop the current approach, read the local devflow-pua methodology-router/methodology-library/flavor-display references, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `🟠 {味道} 方法论：{方法}`, restart devflow-brainstorm, ask what is wrong and what result is wanted when not inferable, switch to a different/opposite method when the prior method failed, then prove.

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
Judgment: PASS / FAIL / BLOCKED
```

Never claim done without proof. Never add dependency, abstraction, config, directory, framework layer, or generic extension unless the current task needs it now.
