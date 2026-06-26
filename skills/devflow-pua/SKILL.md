---
name: devflow-pua
description: "Use when the user challenges the result, says wrong/not like that/changed wrong/quality complaint/user dissatisfied/your code is wrong/you wrote it wrong/has a problem/not right/有问题/不对/写错了/改歪了/没改对/不是我要的/理解错了/改了几次, when repeated fixes miss the target, or when Recovery needs pressure to stop the current approach, restart devflow-brainstorm, ask what is wrong and what result is wanted, then realign before more edits."
---

# DevFlow PUA

Apply pressure as accountability: stop the wrong path, quarantine the wrong working context, restart `devflow-brainstorm`, ask what is wrong and what result is wanted, switch approach, and prove the next result. Do not use persona theater or insults.

## Process

1. **Stop the current path**: do not keep editing with the same assumption after a challenge, repeated miss, failed proof, or quality complaint.
2. **Name the pressure signal**: user challenge, changed wrong, repeated miss, explicit wrong-code signal, failed proof, vague target, or giving-up impulse.
3. **Quarantine wrong context**: keep only verified facts and user-stated constraints; discard the previous solution hypothesis, implementation path, and "almost fixed" assumptions.
4. **Restart `devflow-brainstorm`**: for multiple challenges or explicit "you wrote it wrong / 有问题 / 不对", do not continue editing before a fresh Brainstorm pass.
5. **Ask what is wrong and what result is wanted**: ask the smallest concrete set when the answer is not already explicit.
6. **Restate the goal**: say what you now believe the user wants and what result they should see.
7. **List 3 hypotheses**: include at least one hypothesis that the previous approach was solving the wrong problem.
8. **Change approach**: name the old approach being abandoned and the materially different path now chosen.
9. **Continue through DevFlow**: after Brainstorm realignment, route to `devflow-cut`, `devflow-build`, and `devflow-prove` as needed.
10. **Close learning**: if the miss is reusable, load `devflow-learn` before claiming completion.

## Hard Restart Rule

Trigger this rule when any of these appear:

- the user challenges the result twice in one task lifecycle
- the user says "your code is wrong", "you wrote it wrong", "has a problem", "not right", or "not what I wanted"
- the user says "有问题", "不对", "写错了", "改歪了", "没改对", "不是我要的", "理解错了", or "改了几次"
- the agent has already modified once and the user says the result is still wrong

Required behavior:

```text
Restart Brainstorm: yes
Discarded context: <old assumption / old implementation path / old proof claim>
Keep only verified facts: <facts still safe to use>
Ask user: where is it wrong; what result do you want; what must stay unchanged; how should we verify it
Next skill: devflow-brainstorm
```

Do not reuse the previous erroneous context to repeat the same modification. Use the old attempt only as failure evidence.

## Pointed Questions

Use the smallest blocking set. Prefer these shapes:

```text
1. Where exactly is the current result wrong?
2. What exact result should the user see after this is fixed?
3. What must stay unchanged?
4. What proof would make you say this is corrected?
```

If code, backend behavior, existing UI, docs, or prior messages answer the question, state the inference with evidence instead of asking.

## Required Output

```text
Pressure check: <signal and why normal Recovery is not enough>
Restart Brainstorm: <yes/no; yes for repeated challenge or explicit wrong-code signal>
Discarded context: <old assumption/path not reused>
Keep only verified facts: <facts retained from prior work>
User goal restated: <current understanding>
Desired result: <visible/file/behavior outcome>
Blocking questions: <none, inferred from facts, or 2-4 pointed questions>
Hypotheses: 1 / 2 / 3
Changed approach: <old path abandoned; new path>
Verification: <command or scenario to prove the new path>
Learning closure: <none or devflow-learn handoff>
```

## Escalation Rules

- After two corrected, challenged, or failed attempts in one task lifecycle, stop editing and restart `devflow-brainstorm`; ask the pointed questions unless the answers are directly inferable from facts.
- If the user says "your code is wrong", "you wrote it wrong", "有问题", "不对", "写错了", "改歪了", "没改对", "不是我要的", "理解错了", or "改了几次", treat it as a hard Recovery signal and restart Brainstorm.
- If the same proof fails twice, do not rerun it unchanged; change the hypothesis or implementation path first.
- If the previous approach only changed wording, parameters, or nearby files, that is not a materially different approach.
- Do not use previous erroneous context as the basis for the next patch. Use it only to identify what failed.
- If the user explicitly tells you the goal and safe next action, use it and continue; do not stall with ritual questions.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "I'll just tweak it once more." | Repeated tweaks are the failure pattern. Stop and re-align. |
| "The user is unhappy, so I should rush." | Pressure means more facts and sharper questions, not faster guessing. |
| "I changed something, so the approach changed." | A new approach changes the hypothesis, target, or proof path. |
| "The old context is probably close." | The old context produced the wrong result. Quarantine it and restart Brainstorm. |
| "Learning can wait." | Reusable misses must become a next-time intercept before completion. |

## Handoff Gate

After pressure recovery:

```text
Next skill: devflow-brainstorm / devflow-cut / devflow-build / devflow-prove / devflow-learn
Reason: <why this is now the right next move>
```

## Verification

Before leaving this skill, confirm:

- [ ] The previous path was stopped or explicitly kept with evidence.
- [ ] Repeated challenge or explicit wrong-code signal restarted `devflow-brainstorm`.
- [ ] Previous erroneous context was quarantined and not reused as the next solution basis.
- [ ] Goal and desired result were restated.
- [ ] Blocking questions were asked only when facts could not answer them.
- [ ] Three hypotheses were listed.
- [ ] The changed approach is materially different.
- [ ] A proof command or scenario is named.
- [ ] Learning handoff is made when the miss is reusable.
