# DevFlow Self-Test Scenarios

Use these scenarios to verify the framework from request to landing. A scenario passes only when the expected skill behavior, output contract, and proof are visible.

## Scenario 1: Vague Feature Request

Input:

```text
Add search to the dashboard.
```

Expected behavior:

- Route: Design
- Skill path: `devflow-core -> devflow-brainstorm -> devflow-cut`
- Must read current project context before proposing.
- Must ask or infer goal, constraints, and success criteria.
- Must compare 2-3 approaches.
- Must output the Design output contract.
- Must not implement until shape is clear unless the user explicitly requested implementation and the smallest safe shape is known.

Pass check:

```text
Goal / Smallest useful plan / Not doing / Impact / Verification
```

## Scenario 1A: Problem Investigation

Input:

```text
Problem report: the login flow looks wrong. Check what is wrong, do not fix yet.
```

Expected behavior:

- Route: Problem
- Skill path: `devflow-core -> devflow-prove`
- Must read relevant project facts before naming the problem.
- Must prove the symptom, absence of evidence, or unknowns before editing.
- Must not silently implement a fix.
- If a change is needed, re-route to Design or Build with a clear target.

Pass check:

```text
Route: Problem
Facts: read/confirmed ...
Command/scenario: <actual investigation command or scenario>
Result: <symptom / no evidence / unknowns>
Judgment: PASS / FAIL / BLOCKED
Next step: no change needed / re-route Design / re-route Build
```

## Scenario 1B: Requirement To Implementation

Input:

```text
Requirement: implement CSV export for orders.
```

Expected behavior:

- Route: Build because implementation is requested.
- Skill path: `devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove`
- Brainstorm compares 2-3 approaches, including reuse/no-change when plausible.
- Cut checks existing export helpers, standard library/platform CSV support, dependency need, scope drift, and smallest useful path.
- Build uses slices if the change spans API/UI/tests.
- Prove runs the targeted test/build/manual scenario.

Pass check:

```text
Goal: ...
Approach comparison: A / B / C
Reuse Check: ...
Ponytail Rung: ...
Implementation Slices: ...
Command: <actual verification>
Result: <key output>
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 1C: Bug Report

Input:

```text
Bug report: order totals sometimes render as NaN. Fix the bug.
```

Expected behavior:

- Route: Build
- Skill path: `devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove`
- Must identify likely touched formatter/calculation flow from facts.
- `devflow-cut` must run Root-Cause Check before editing.
- Must search callers/references and choose shared vs narrow fix intentionally.
- Must prove the original symptom or a regression check.

Pass check:

```text
Root-Cause Check: searched <callers/references>; fix location <shared/narrow>; reason <why>
Diff Check: ...
Command: <regression test or reproduction command>
Result: <NaN reproduced then fixed, or BLOCKED with missing repro>
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 1D: Codex Trigger Surface

Input:

```text
Codex sees only AGENTS.md, skill descriptions, and command prompts.
```

Expected behavior:

- `AGENTS.md` contains trigger words for problem reports, requirements, bug reports, user challenge recovery, and completion claims.
- `devflow-core` description includes investigating issues, requirements, bugs, and user challenge recovery.
- `devflow-brainstorm` description includes requirement/feature/behavior/architecture triggers.
- `devflow-pua` description includes changed-wrong and quality complaint triggers.
- `devflow-prove` description includes done/fixed/complete/ready/passed triggers.
- Command prompts repeat Problem, Root-Cause, Pressure Recovery, and proof routing for hosts that use slash commands instead of skill bodies.

Pass check:

```text
Codex Trigger Contract
problem report / requirement / bug report / changed wrong / done
Issue Triage
Pressure Recovery Gate
Root-Cause Check
```

## Scenario 1E: Host Adapter Contract Drift

Input:

```text
Check whether the host adapter files still point to the same DevFlow contract.
```

Expected behavior:

- Route: Fast verification
- Skill path: `devflow-core -> devflow-prove`
- Must check `AGENTS.md`, `CLAUDE.md`, Copilot instructions, VS Code instruction/prompt, CodeBuddy rule, plugin metadata, and Gemini metadata.
- Must confirm platform adapters preserve `Sense -> Brainstorm -> Cut -> Shape -> Build -> Prove`.
- Must confirm plugin metadata includes all shipped skills and commands.
- Must not rewrite adapter rules unless drift is proven.

Pass check:

```text
Host Adapter Verification Report
AGENTS / CLAUDE / Copilot / VS Code / CodeBuddy / plugin manifest / Gemini metadata
Command: npm run host:verify
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 2: Small Clear Change

Input:

```text
In README, rename "Proof Gate" to "Proof Before Done".
```

Expected behavior:

- Route: Build because implementation is requested and scope is clear.
- Still run a lightweight Sense and Cut.
- Touch only the requested file.
- Verify with text search.

Pass check:

```text
Reuse Check: ...
Diff Check: README only
Command: <search command>
Result: old phrase absent/new phrase present
Judgment: PASS
```

## Scenario 3: Dependency Proposal

Input:

```text
Install a date picker package for a basic birthday field.
```

Expected behavior:

- `devflow-cut` blocks the new dependency unless a current limitation is proven.
- Native Check considers `<input type="date">`.
- Output says what was cut.

Pass check:

```text
Native Check: checked Browser And HTML; native option used
Overbuild Check: new dependency rejected
CUT_REDUCE or CUT_REUSE
```

## Scenario 4: Existing Capability

Input:

```text
Add a UUID helper.
```

Expected behavior:

- Search existing helpers.
- Check runtime standard library.
- Prefer `crypto.randomUUID()` where available.
- Do not create a helper unless a current compatibility reason exists.

Pass check:

```text
Ponytail Rung: stdlib/native
Not doing: new helper wrapper
```

## Scenario 5: Multi-File Feature

Input:

```text
Implement the approved notification preference feature.
```

Expected behavior:

- Route: Build
- `devflow-build` creates Implementation Slices.
- Each slice has files, change, and verification.
- `devflow-prove` runs final verification.

Pass check:

```text
Implementation Slices:
- Slice 1: files / change / per-slice verification
- Slice 2: files / change / per-slice verification
Command: ...
Result: ...
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 5A: Plan Pack Check

Input:

```text
Create implementation slices from this approved design and check the plan before coding.
```

Expected behavior:

- Route: Build planning before implementation.
- Skill path: `devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove`
- Must create a Plan Pack with Task, Files, Acceptance, Verify, and Not doing fields.
- Saved plan files default to `docs/plans/<short-kebab-name>.md`.
- Must not save implementation plans under `docs/features/`; that directory is for feature ledgers.
- Must run `node scripts/devflow-plan.js <plan-file>` when the plan is saved to a file.
- Must fail or revise the plan if fields are missing, unresolved, vague, or placed under `docs/features/`.
- Must not treat the checker as architecture approval; it only proves the plan is executable.

Pass check:

```text
Command: node scripts/devflow-plan.js docs/plans/<short-kebab-name>.md
Result: DevFlow plan pack report; Plan landing: ok docs/plans/<name>.md; Judgment: PASS
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 6: Repeated Failure Or User Correction

Input:

```text
Not like that. You missed the actual skill behavior.
```

Expected behavior:

- Route: Recovery
- Re-read facts.
- List 3 hypotheses.
- Pick a different approach.
- Load `devflow-learn` when the correction or pitfall is reusable.

Pass check:

```text
Failure/correction: ...
Facts reread: ...
Hypotheses: 1 / 2 / 3
Changed approach: ...
Learning closure: ...
```

## Scenario 6A: Repeated Correction Learning Closure

Input:

```text
Not again: AGENTS.md is a runtime prompt. You put README-style explanation in the wrong place.
```

Expected behavior:

- Route: Recovery
- Load `devflow-learn` because this is a repeated correction and misplaced content signal.
- Read `.copilot/LEARNING_INDEX.md`.
- Read only the matched card, such as `agents-runtime-prompt-boundary.md`.
- Create or update one focused card when the correction is not already covered.
- Update `.copilot/LEARNING_INDEX.md` when trigger words change.
- Report learning closure before claiming completion.

Pass check:

```text
Repeat Correction Gate
wrong place / misplaced content / repeated correction
.copilot/LEARNING_INDEX.md
Read `.copilot/LEARNING_INDEX.md`
Read only the matched card
Report learning closure before claiming completion
Next action: Next time editing AGENTS.md ...
```

## Scenario 6B: New Reusable Pitfall Card

Input:

```text
Remember this: when a validation script only checks file presence, next time make it check executable behavior too.
```

Expected behavior:

- Route: Recovery or Fast learning capture, depending on whether the request follows a failure.
- Skill path: `devflow-core -> devflow-prove -> devflow-learn`
- Read `.copilot/LEARNING_INDEX.md`.
- Read only matched cards; do not load all cards.
- If no matched card already covers the lesson, create one focused card with Trigger, Lesson, Next action, Scope, and Related.
- Update `.copilot/LEARNING_INDEX.md` with the new card and trigger words.
- Report learning closure before claiming completion.
- Use `npm run learn:verify` as no-mutation proof that the learning-loop contract still works.

Pass check:

```text
devflow-learn
LEARNING_INDEX
matched card
Next action
learning closure
Command: npm run learn:verify
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 6C: User Challenge Pressure Recovery

Input:

```text
你改的还是不对，有缺漏，少了这个少个那个，用户看起来还是不满意。
```

Expected behavior:

- Route: Recovery
- Skill path: `devflow-core -> devflow-pua -> devflow-brainstorm -> devflow-prove -> devflow-learn`
- Must stop the current approach before more edits.
- Must set `Restart Brainstorm: yes` for explicit wrong-code signals such as "有问题" and "不对".
- Must treat repeated "少了/少个/缺漏/遗漏/漏了" feedback as pressure recovery, not normal incremental scope.
- Must discard the prior wrong assumption/path/proof claim and keep only verified facts.
- Must classify `User-view miss` and `Satisfaction gap` before choosing the next fix.
- Must display the selected recovery method as `METHOD: {flavor} / {method}`.
- Must switch guiding method when the previously used method still failed.
- Must switch to a different/opposite method and restart checks from facts when the first recovery method still misses.
- Must restart `devflow-brainstorm` before changing files again.
- Must re-read facts from the user challenge, prior edits, proof output, and relevant project files.
- Must ask where it is wrong, what result is wanted, what must stay unchanged, and how to verify when those answers cannot be inferred.
- Must list 3 hypotheses, including that the prior approach solved the wrong problem.
- Must blue-team attack the new plan from the user's point of view.
- Must define a `New success contract` instead of continuing the old context.
- Must choose a materially different approach.
- Must prove with command/result/judgment.
- Must hand off to `devflow-learn` when the repeated miss is reusable.

Pass check:

```text
Pressure check: user challenge / explicit wrong-code signal / repeated miss
Restart Brainstorm: yes
Discarded context: ...
Keep only verified facts: ...
User-view miss: ...
Satisfaction gap: ...
METHOD: {flavor} / {method}
SWITCH: none / old flavor/method -> new flavor/method: reason
User goal restated: ...
Desired result: ...
Blocking questions: none / inferred / 2-4 pointed questions
Hypotheses: 1 / 2 / 3
Blue-team attack: ...
New success contract: ...
Changed approach: ...
Command: <actual proof>
Result: <key output>
Judgment: PASS / FAIL / BLOCKED
Learning closure: ...
```

## Scenario 7: Completion Claim

Input:

```text
Are we done?
```

Expected behavior:

- `devflow-prove` runs or cites a fresh verification command.
- If no proof can run, report `BLOCKED`.
- Do not say "done" before command/result/judgment.

Pass check:

```text
Command: <actual command>
Result: <real output summary>
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 8: Skill Pack Validation

Input:

```text
Validate DevFlow-Core itself.
```

Expected behavior:

- Run `npm test`.
- Validate required files, frontmatter, commands, output contracts, and required method terms.

Pass check:

```text
Command: npm test
Result: DevFlow validation passed
Judgment: PASS
```

## Scenario 9: Target Project Install Check

Input:

```text
Install DevFlow into a target project and verify the installed runtime did not drift.
```

Expected behavior:

- Route: Fast verification after the install target is known.
- Skill path: `devflow-core -> devflow-prove`
- Must run the dry-run before write mode when demonstrating a first install.
- Must use `npm run install:target -- <target> --write` to copy runtime files.
- Must use `npm run install:target -- <target> --check` after install.
- Must report `ok`, `missing`, or `changed` file state from check mode.
- Must not copy product docs, source-only reference docs, or validation harness files into the target project.
- If check mode fails, report `FAIL` and name whether the target has missing or changed runtime files.

Pass check:

```text
Command: npm run install:target -- <target> --check
Result: Check passed: installed runtime matches this package.
Judgment: PASS
```
