# DevFlow PUA Methodology Library

This is the local method library used by `devflow-pua`. It extracts the practical execution parts of the original PUA methodology files into DevFlow-Core runtime form.

Read this after `methodology-router.md` chooses a flavor.

## Alibaba: Closure Method

Use when feedback says the work is incomplete, missing surfaces, or not closed.

Steps:

1. Define the exact goal and visible result.
2. Build a Coverage Map: files, commands, skills, docs, install sync, UI/backend behavior, validation.
3. Track each surface to proof.
4. Deliver result evidence.
5. Retrospect and capture learning if repeatable.

Evidence:

```text
Coverage Map: <surface -> status -> proof>
Closure proof: <command/scenario>
```

## Huawei: RCA + Blue-Team

Use when behavior is still wrong, bug/proof failed, or a root cause is unclear.

Steps:

1. State the symptom in the user's words.
2. Run 5-Why or equivalent root-cause tracing.
3. Search callers/references and sibling entrypoints.
4. Blue-team attack the proposed fix before editing.
5. Prove the original symptom no longer reproduces.

Evidence:

```text
RCA: symptom -> cause chain -> selected fix point
Blue-team attack: <how this could still fail>
Proof: <original symptom command/scenario>
```

## Amazon: Customer Backwards

Use when user-visible result, UX, API, workflow, or acceptance is mismatched.

Steps:

1. Write the customer-visible success result first.
2. Define what the user should see, do, or distinguish.
3. Identify internal surfaces needed to create that result.
4. Dive deep into facts instead of explaining old work.
5. Prove with the user's acceptance scenario.

Evidence:

```text
Customer result: <visible outcome>
Acceptance proof: <scenario>
```

## Musk: The Algorithm

Use when the previous work may be solving the wrong requirement or overbuilding.

Steps:

1. Question whether the requirement or artifact is correct.
2. Delete unnecessary scope.
3. Simplify the remaining path.
4. Accelerate implementation only after simplification.
5. Automate only when the manual path is proven.

Evidence:

```text
Deleted scope: <what was cut>
Simplified path: <why this is smaller>
```

## Jobs: Subtraction + Highest Standard

Use when the result technically works but is unclear, ugly, hard to distinguish, or unsatisfying.

Steps:

1. Define the visible quality bar.
2. Remove confusing or unnecessary elements.
3. Make the primary result unmistakable.
4. Keep one DRI-owned path.
5. Inspect the final artifact from the user's eye level.

Evidence:

```text
Quality bar: <what must be visibly true>
User-eye review: <what changed>
```

## Baidu: Search First

Use when the agent guessed from memory, missed docs, or facts may be stale.

Steps:

1. Search local source/docs before deciding.
2. Prefer primary/local source over explanation.
3. Record what was found and what is still unknown.
4. Choose the simplest reliable option.

Evidence:

```text
Source facts: <files/docs/commands checked>
Unknowns: <none or remaining>
```

## ByteDance: Data/Proof

Use when verification is weak, metrics matter, or confidence is replacing evidence.

Steps:

1. Define the proof metric or scenario before editing.
2. Run the smallest meaningful check.
3. Compare output to acceptance.
4. Report PASS/FAIL/BLOCKED without hiding gaps.

Evidence:

```text
Proof metric: <what proves it>
Result: <actual output>
```

## Microsoft: Learning Loop

Use when the same hypothesis keeps repeating or the agent did not change action after failure.

Steps:

1. Name the failed assumption.
2. Gather new evidence.
3. State the changed action.
4. Verify impact.
5. Capture next-time intercept if reusable.

Evidence:

```text
Failed assumption: <old belief>
Changed action: <new behavior>
Verified impact: <proof>
```

## Pinduoduo: Cut Middle Layers

Use when process, abstraction, or intermediate artifacts are blocking result.

Steps:

1. List the current chain of steps.
2. Remove every middle layer not required for the user-visible result.
3. Keep the shortest decision chain.
4. Deliver the result path, not methodology theater.

Evidence:

```text
Removed middle layers: <items>
Shortest path: <remaining path>
```

## JD: Frontline Result

Use when remote guessing, install/runtime mismatch, or real user environment is the risk.

Steps:

1. Inspect the actual runtime/install surface.
2. Verify where the user will experience the result.
3. Push decision to frontline evidence.
4. Report only what real environment proof supports.

Evidence:

```text
Frontline surface: <runtime/project/user-level surface>
Environment proof: <command/scenario>
```
