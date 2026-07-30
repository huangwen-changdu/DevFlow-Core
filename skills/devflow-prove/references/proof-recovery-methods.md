# DevFlow Proof And Recovery Methods

Owners: `devflow-prove` and `devflow-pua`. Load this reference only after Core selects Proof or Recovery.

## Method 13: Proof Before Done

Run fresh, narrow evidence before a completion claim. Rules and skills need file, trigger, load, and downstream evidence. Code needs a focused test, build, lint, typecheck, or reproducible scenario. A bug fix needs symptom or regression proof.

```text
Command: <actual command>
Result: <key output>
Adversarial review: <acceptance, regressions, activation, proof coverage>
Judgment: PASS / FAIL / BLOCKED
```

## Method 14: Recovery By Changing Approach

On an unexpected verification failure or repeated user challenge, re-read facts, restate the desired result, list three hypotheses, choose a materially different approach, and rerun proof. PUA additionally loads its methodology router, library, and display protocol before a recovery patch.

Do not retry the same move with superficial wording changes. Reusable lessons go to `devflow-learn` after proof.

