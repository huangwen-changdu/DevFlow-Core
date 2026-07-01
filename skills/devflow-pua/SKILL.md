---
name: devflow-pua
description: "Use when the user challenges the result, says wrong/not like that/changed wrong/quality complaint/user dissatisfied/your code is wrong/you wrote it wrong/has a problem/not right/missing/incomplete/still missing/有问题/不对/写错了/改歪了/没改对/不是我要的/理解错了/改了几次/少了/少个/缺少/缺漏/遗漏/漏了, when repeated fixes miss the target, when the user keeps adding missing pieces, or when Recovery needs pressure to stop the current approach, restart devflow-brainstorm, diagnose the user-view miss, switch to a different/opposite method if needed, and realign before more edits."
---

# DevFlow PUA

Apply pressure as accountability: stop the wrong path, quarantine the wrong working context, diagnose why the user thinks the result is wrong, load the local methodology router, display the active flavor/method, restart `devflow-brainstorm`, ask what is wrong and what result is wanted, switch method when the current one failed, and prove the next result. Do not use persona theater or insults.

## Methodology Assets

When this skill activates, read these local references before choosing or switching method:

- `skills/devflow-pua/references/methodology-router.md`
- `skills/devflow-pua/references/methodology-library.md`
- `skills/devflow-pua/references/flavor-display.md`

These files are the runtime method source. Do not link out to the original PUA project at runtime.

## Process

1. **Stop the current path**: do not keep editing with the same assumption after a challenge, repeated miss, failed proof, or quality complaint.
2. **Name the pressure signal**: user challenge, changed wrong, repeated miss, explicit wrong-code signal, missing-piece complaint, repeated "少了这个/少个那个" feedback, failed proof, vague target, or giving-up impulse.
3. **Quarantine wrong context**: keep only verified facts and user-stated constraints; discard the previous solution hypothesis, implementation path, and "almost fixed" assumptions.
4. **Load methodology**: read `references/methodology-router.md`, `references/methodology-library.md`, and `references/flavor-display.md`.
5. **Route flavor/method**: choose the starting or switched flavor from the pressure signal and failure pattern.
6. **Display method**: output one compact visible line: `METHOD: {flavor} / {method}`. If the method changed, add one `SWITCH:` line.
7. **Diagnose the user-view miss**: classify why the user would still feel unsatisfied before proposing another patch.
8. **Restart `devflow-brainstorm`**: for multiple challenges, repeated missing-piece complaints, or explicit "you wrote it wrong / 有问题 / 不对", do not continue editing before a fresh Brainstorm pass.
9. **Ask what is wrong and what result is wanted**: ask the smallest concrete set when the answer is not already explicit.
10. **Restate the goal**: say what you now believe the user wants and what result they should see.
11. **List 3 hypotheses**: include at least one hypothesis that the previous approach was solving the wrong problem.
12. **Switch method if needed**: if the last guiding method still missed, mark it failed, choose a different or opposite method lens, and restart checks from facts before editing again.
13. **Change approach**: name the old approach being abandoned and the materially different path now chosen.
14. **Continue through DevFlow**: after Brainstorm realignment, route to `devflow-cut`, `devflow-build`, and `devflow-prove` as needed.
15. **Close learning**: if the miss is reusable, load `devflow-learn` before claiming completion.

## Guiding Principles

- **Customer Backwards**: start from the result the user expected to see, not from why the old patch seemed reasonable.
- **Miss Taxonomy**: identify the satisfaction gap before choosing the next fix.
- **Owner/RCA Discipline**: own the outcome, inspect facts, find the root cause, and do not push discoverable work back to the user.
- **Blue-Team + Evidence Loop**: attack the new plan from the user's point of view, then prove the corrected result with evidence.

The user wants a corrected outcome, not an explanation that the previous attempt was "almost right". Every recovery must produce a new success contract: expected result, not-doing boundary, changed approach, and proof.

## Why User Thinks It Is Wrong

Classify the miss before changing files:

| Miss | Meaning | Recovery bias |
|---|---|---|
| Goal mismatch | The agent solved a different problem than the user cared about. | Customer Backwards; re-ask or infer the desired result. |
| Artifact mismatch | The agent changed the wrong file, page, skill, command, docs location, or install scope. | Trace the artifact owner and target surface before editing. |
| Behavior gap | The visible behavior did not change, or only wording changed. | Reproduce behavior and pick a behavior-changing path. |
| Missing coverage | The agent fixed one part but missed entrypoints, commands, validation, docs, user-level sync, or sibling flows. | Coverage Map; enumerate required surfaces before Build. |
| Proof gap | Verification was absent or did not cover the user's scenario. | Evidence Loop; define proof from the user's acceptance scenario. |
| UX/result gap | The result works technically but is unclear, hard to distinguish, incomplete, or not satisfying. | Customer Backwards + Blue-Team user review. |

Treat repeated "少了/少个/缺少/缺漏/遗漏/漏了/still missing/incomplete" as a pressure signal. It usually means Missing coverage or UX/result gap, not a normal feature add.

## Repeated Missing-Piece Trigger

Do not treat repeated "this feature is missing X / missing Y" feedback as ordinary incremental scope until recovery proves it is new scope.

Trigger `devflow-pua` checks when any of these happen:

- the user points out two missing pieces in one task lifecycle
- the user says the same problem is still unresolved after a fix
- the user says "少了这个", "少个那个", "还有缺漏", "遗漏了", or similar wording after a prior attempt

Required action: classify whether the miss is Missing coverage, Goal mismatch, Artifact mismatch, or UX/result gap; build a Coverage Map of expected surfaces; then restart `devflow-brainstorm` with a new success contract.

## Method Switch Rule

If one guiding method was already used and the user still says the result is wrong, incomplete, or missing pieces, do not repeat that method unchanged. The next recovery must automatically switch to a different or opposite method and restart checking from facts.

Switch by failure pattern:

- Goal, artifact, or UX miss -> **Customer Backwards**.
- Missing pieces, missing sync, missing command/entry/validation coverage -> **Coverage Map**.
- Bug, proof failure, or behavior still unchanged -> **Owner/RCA Discipline**.
- Repeated tweaks, same hypothesis, or "almost fixed" thinking -> **Blue-Team Opposite Hypothesis**.

Opposite method switching:

| Failed method | Switch to | Why |
|---|---|---|
| Customer Backwards still misses details | Coverage Map | The desired result may be right, but the surfaces were incomplete. |
| Coverage Map still misses the result | Customer Backwards | The list may be complete but aimed at the wrong user-visible outcome. |
| Owner/RCA still leaves behavior unchanged | Blue-Team Opposite Hypothesis | The root cause hypothesis may be wrong. Attack it directly. |
| Blue-Team still produces no fix | Owner/RCA Discipline | Stop debating the plan and trace facts, callers, and proof. |

Before visible output, decide whether the prior method is still valid or must switch to Customer Backwards, Coverage Map, Owner-RCA, or Blue-Team Opposite Hypothesis. Do not expose that decision as extra output fields unless the user asks for full diagnostics. When the method changes, use only this visible line:

```text
SWITCH: <old flavor>/<old method> -> <new flavor>/<new method>: <reason>
```

If the switched method also fails once, stop editing and ask the user to confirm the new success contract before another patch. If it fails twice, record the reusable miss through `devflow-learn`.

## Hard Restart Rule

Trigger this rule when any of these appear:

- the user challenges the result twice in one task lifecycle
- the user says "your code is wrong", "you wrote it wrong", "has a problem", "not right", or "not what I wanted"
- the user says "missing", "incomplete", "still missing", "有问题", "不对", "写错了", "改歪了", "没改对", "不是我要的", "理解错了", "改了几次", "少了", "少个", "缺少", "缺漏", "遗漏", or "漏了"
- the user repeatedly says the work is missing this or missing that
- the agent has already modified once and the user says the result is still wrong

Required behavior:

```text
Restart Brainstorm: yes
Discarded context: <old assumption / old implementation path / old proof claim>
Keep only verified facts: <facts still safe to use>
Ask user: where is it wrong; what result do you want; what must stay unchanged; how should we verify it
User-view miss: <miss category from taxonomy>
New success contract: <expected result + proof + not-doing>
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
METHOD: {flavor} / {method}
SWITCH: <none or old flavor/method -> new flavor/method: reason>
User-view miss: <Goal mismatch / Artifact mismatch / Behavior gap / Missing coverage / Proof gap / UX-result gap>
Satisfaction gap: <why the user would still say this is not enough>
User goal restated: <current understanding>
Desired result: <visible/file/behavior outcome>
Blocking questions: <none, inferred from facts, or 2-4 pointed questions>
Hypotheses: 1 / 2 / 3
Blue-team attack: <how the new plan could still fail from the user's point of view>
New success contract: <expected result + affected surfaces + verification + not-doing>
Changed approach: <old path abandoned; new path>
Verification: <command or scenario to prove the new path>
Learning closure: <none or devflow-learn handoff>
```

## Escalation Rules

- After two corrected, challenged, or failed attempts in one task lifecycle, stop editing and restart `devflow-brainstorm`; ask the pointed questions unless the answers are directly inferable from facts.
- If the user says "your code is wrong", "you wrote it wrong", "missing", "incomplete", "still missing", "有问题", "不对", "写错了", "改歪了", "没改对", "不是我要的", "理解错了", "改了几次", "少了", "少个", "缺少", "缺漏", "遗漏", or "漏了", treat it as a hard Recovery signal and restart Brainstorm.
- If the user repeatedly adds "this is missing / that is missing", run Missing coverage diagnosis and Coverage Map before Build.
- If the selected guiding method still fails once, switch to a different or opposite method and restart the checks from facts; if it fails twice, stop and ask the user to confirm the new success contract before editing.
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
| "The user is just adding scope." | Repeated "missing" feedback is a satisfaction gap until coverage and goal are rechecked. |
| "The same method should work if I try harder." | If the method already failed, switch method or prove why it still fits. |
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
- [ ] Local methodology references were read before selecting method.
- [ ] The compact methodology line `METHOD: {flavor} / {method}` was output.
- [ ] A concise `SWITCH:` line was output when the method changed.
- [ ] User-view miss and satisfaction gap were classified.
- [ ] A guiding method was selected, or switched if the prior method failed.
- [ ] Missing-piece feedback triggered coverage mapping.
- [ ] The new plan was blue-team attacked from the user's point of view.
- [ ] New success contract is explicit.
- [ ] Goal and desired result were restated.
- [ ] Blocking questions were asked only when facts could not answer them.
- [ ] Three hypotheses were listed.
- [ ] The changed approach is materially different.
- [ ] A proof command or scenario is named.
- [ ] Learning handoff is made when the miss is reusable.
