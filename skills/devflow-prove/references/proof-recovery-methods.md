# DevFlow Proof And Recovery Methods

Owners: `devflow-prove` and `devflow-pua`. Load this reference after completed Build directly enters Prove or when Core selects Proof or Recovery for a non-unique artifact.

## Proof Context Selection

Keep proof context proportional to the change. Always load this reference. Load `flow-self-test.md` only for DevFlow runtime, skill, command, host, hook, validator, scenario, installer, or harness changes; ordinary application changes use the changed file, its direct contract, and the relevant proof command. Load `code-review-checklist.md` for code and apply General Engineering Review plus only language sections matching changed extensions. Narrow context does not weaken diff review, adversarial review, or fresh proof. Load `prose-quality-checklist.md` for completion messages, commit and PR text, and created documents, and load `ui-slop-checklist.md` only when the change emits UI or design output; both are bounded post-write checks inside the existing Prove and Build nodes.

## Method 13: Proof Before Done

Run fresh, narrow evidence before a completion claim. Rules and skills need file, trigger, load, and downstream evidence. Code needs a focused test, build, lint, typecheck, or reproducible scenario. A bug fix needs symptom or regression proof.

```text
Command: <actual command>
Result: <key output>
Adversarial review: <acceptance, regressions, activation, proof coverage>
Judgment: PASS / FAIL / BLOCKED
```

Before the completion report, reread every final artifact and its wrapper — filenames, titles, comments, tags, documents, commit or PR text, metadata, hook rewrites, and the report itself — as a reader without access to this session, and describe only the accepted final state. Recheck after any content change; keep deliberate decision records, safety and compatibility facts, real baseline changes, executed external actions, and pre-existing user changes; keep unrelated changes out of this task's commit, PR, or handoff, and do not add cleanup or no-residue claims.

`PASS` is Prove's terminal success after Learn review. Proof `FAIL`, `BLOCKED`, a real adversarial gap, unresolved Code Review Blocker/Warning, or incomplete PUA recovery evidence returns its facts to `devflow-core`; Core selects the repair, recovery, or re-clarification path. Prove never infers that next owner.

### Quality-Finding Recovery

A Code Review Blocker or Warning requires a Build correction selected by Core. After that correction, Prove reviews the new actual diff against the same plan boundary, `## Recon` evidence, direct contracts, and nearby convention. It explicitly records every prior finding as closed with fresh evidence or still open; stale test output, stale review output, or an implementer claim cannot close it. Ordinary quality repair remains separate from PUA unless the failure also has a user challenge, repeated miss, or changed-wrong signal.

## Method 14: Recovery By Changing Approach

On an unexpected verification failure or repeated user challenge, re-read facts, restate the desired result, list three hypotheses, choose a materially different approach, and rerun proof. PUA additionally loads its methodology router, library, and display protocol before a recovery patch.

Do not retry the same move with superficial wording changes. Reusable lessons go to `devflow-learn` after proof.
