---
name: devflow-prove
description: "Use before saying done, fixed, complete, working, passed, resolved, ready, or candidate_pass; after builds, bug fixes, rule/docs/skill changes, tests, validation, or any PASS/FAIL/BLOCKED claim. Selects a narrow, standard, or full proof tier, runs the narrowest sufficient check, and reports Command/Result/Proof tier/Adversarial review/Judgment."
---

# DevFlow Prove

No matching evidence, no completion.

## Methodology Assets

Context loading is conditional and selected by changed surface.

- Always read `skills/devflow-prove/references/proof-recovery-methods.md`.
- Read `skills/devflow-prove/references/flow-self-test.md` only when the change touches DevFlow runtime rules, skills, commands, host adapters, hooks, validators, scenarios, installers, or harness behavior.
- For `standard` and `full` code changes, read `code-review-checklist.md` and apply General Engineering Review plus the matching language section; run `simplify-pass.md` before the reviews. A `narrow` Small-fix uses the diff review below instead.
- Read `prose-quality-checklist.md` for completion, commit, and PR text; `ui-slop-checklist.md` only for UI output.

## Proof Tiers

| Tier | Use when | Required evidence |
|---|---|---|
| `narrow` | Fast Small-fix: local, reversible, declared post-diagnosis budget, no protected surface, checker `NARROW_OK` | named check, one regression, diff review, one-line strongest challenge, hotfix row for a defect |
| `standard` | Design-lite or Build; local or module behavior | narrow evidence plus Simplify Pass, adversarial checklist, Code Review Report, Learn review |
| `full` | Protected surface, cross-module contract, irreversible effect, security/data/permission risk, or explicit review | standard evidence plus Recall evidence, Coverage, plan and requirement writeback |

A tier may be raised at any point; never lower it to finish faster. `narrow` is unavailable once a protected surface or second module is touched.

## Depth Ledger

Use `skills/devflow-core/references/depth-ledger.md` for any change, fix or feature. After diagnosis or discovery, record blast radius, uncertainty, irreversibility, history, and risk debt; the depth selects `narrow`, `standard`, or `full`. An open decision-impact unknown blocks narrow and Build. Include the ledger line in the completion output. Stop when no decision-impact unknown remains; do not maximize a score.

## Small-fix Gate

After diagnosis, for a Fast Small-fix, run `node scripts/devflow-smallfix.js --check --verify "<command>"`. The checker counts actual changed files and lines, blocks protected paths, deletions, binaries, and manifest changes, and runs the verification itself. Record the post-diagnosis estimate and pass `--declared-files`/`--declared-lines`; actual above the declaration promotes. File and line counts are warnings, not hard caps. Only `NARROW_OK` plus a narrow Depth Ledger permits `Proof tier: narrow`; `PROMOTE`, a missing checker, or a failed run returns standard facts to Core. A narrow claim without the checker receipt is FAIL. The agent never chooses narrow by assertion.

## Process

1. Select the tier and the one command, test, build, lint, validation script, or manual scenario that proves the claim. After diagnosis, for a Fast Small-fix, the checker's `--verify` run is the named check; do not select narrow without `NARROW_OK`.
2. Confirm changed files and plan anchors. For `standard`/`full`, read `.copilot/LEARNING_INDEX.md` and `docs/hotfix-log.md` for matching pitfalls (Method 15) and record `Recall evidence`. For `narrow`, read a prior row only when the symptom directly matches one.
3. Run the check now, then independently inspect the actual implementation diff before interpreting the result.
4. For `standard`/`full` code, run the **Simplify Pass** (`simplify-pass.md`) on the approved diff, then re-run the check after any applied edit.
5. Run adversarial review: `standard`/`full` use the checklist below; `narrow` states the strongest plausible reason the fix is still wrong and disposes of it in one line.
6. For `standard`/`full` code, run the **Code Quality Review** (`code-review-checklist.md`) and generate the **Code Review Report**. Classify findings as Blocker, Warning, or Recommendation; an unresolved Blocker or Warning returns `FAIL`.
7. Read the real output and exit status.
8. If it fails, report `FAIL` facts to `devflow-core`; Core selects Recovery or another owner. If it cannot run, report `BLOCKED` and name the missing condition.
9. On `PASS`, `standard`/`full` load `devflow-learn` for the completion review; `narrow` records the one-line Learning closure instead.
10. On `PASS` with a plan, write `Status: done` and `Landed: <date> · <evidence>`, set the plan index row to `done`, and make the `docs/requirements.md` row terminal. `narrow` has no plan or requirements row; it still appends the hotfix row for a defect.

## Exception Return Boundary

Prove is the terminal direct-success step. `PASS` completes only after the tier's review. `FAIL`, `BLOCKED`, a real adversarial gap, an unresolved Blocker or Warning, or missing recovery evidence return facts to `devflow-core`; Prove does not select the repair or recovery skill.

## Proof Selection

| Work type | Proof |
|---|---|
| Docs/rules/skills | File presence, frontmatter, required wording, command entries, path consistency, scenario checklist. |
| Code | Targeted test, build, lint, typecheck, or runtime scenario; inspect the actual implementation diff against the approved boundary and nearest comparable code; standard/full also run the Code Quality Review. |
| Bug fix | Original symptom reproduction or regression check; verify any documented fix rationale and non-obvious failure condition. |
| Framework design | Native capability coverage, anti-pattern gates, skill behavior, and output contracts. |
| Productized skill pack | `npm test` or equivalent package validation. |

## Adversarial Review

`standard`/`full`: after development work, check the strongest plausible reason the change is still wrong, incomplete, unreachable, over-broad, or under-verified. `narrow`: answer that question in one line and stop if the answer is real.

- **Recall check**: for `standard`/`full`, name trigger-matched learning cards and `docs/hotfix-log.md` rows with one line each: prevented, considered-and-rejected, or not-applicable. Emit `Recall evidence` with one `Read` line per file (Method 15); a missing read is a rubber-stamp. A card that would have prevented a defect this diff introduced is a Blocker.
- **Correctness**: does the code solve the stated goal and handle edge cases?
- **Regression**: could it break sibling callers, shared state, or downstream consumers?
- **Activation path**: is the new code reachable?
- **Scope creep**: does the diff include unrequested behavior or drive-by refactors?
- **Proof coverage**: is the check narrow enough to be meaningful?
- **Comments**: are required or non-obvious boundaries documented?

After agent rule, command, prompt, entry, or `SKILL.md` changes, run a Skill Activation Chain Check before completion:

```text
Skill Activation Check: trigger <user words/command/upstream output>; surface <description/command/entry>; action <loads/calls target skill>; evidence <artifact/check/output>
```

Check trigger, surface, runtime action, handoff evidence, and breakpoint. If activation is broken, fix the trigger chain before editing skill internals again.

## Required Output

```text
Command: <actual command run>
Result: <key output summary>
Proof tier: narrow / standard / full
Depth ledger: blast=... uncertainty=... irreversibility=... history=... risk_debt=... depth=...
Small-fix gate: <NARROW_OK files=... lines=... declared=.../... protected=none verify=exit:0 warn=... | n/a>
Adversarial review: <strongest challenge and disposition, or the one-line challenge for narrow>
Judgment: PASS / FAIL / BLOCKED
```

Add `Coverage` when useful: `<B IDs → evidence; every baseline B mapped>` and `Not covered: <missing B IDs or none>`. `standard`/`full` cite the Simplify pass receipt and the Code Review Report; `narrow` cites the diff review line. When Build ran prose or UI gates, cite their receipts.

## Code Review Report

`standard`/`full` only. Review the actual diff before relying on test results. A Blocker or unresolved Warning returns `FAIL`; Recommendations do not block.

```text
Code Review Report:
- Diff reviewed: [changed files/ranges]
- Plan boundary: [approved Files rows and verdict]
- Progress evidence: [Progress rows and recorded command/result]
- Comparable code: [nearest inspected file/symbol]
- Blockers: [count]
- Warnings: [count]
- Recommendations: [count]
- Boundary verdict: [within approved touch set or drift facts]
- Judgment: PASS / FAIL
```

Every Blocker or Warning names the changed location, evidence, risk, and smallest correction. A pattern preference or size alone cannot block. Re-review after every repair and close or persist each prior finding.

## Learning Check

`standard`/`full` PASS loads `devflow-learn`; `narrow` PASS records:

```text
Learning closure: narrow · card none · next intercept none
```

When the change repaired a defect, append one `docs/hotfix-log.md` row: symptom, root cause, change points, modules, verify command, card yes/no. A defect fix without its row is incomplete. A card is created only for reusable, evidence-backed experience; `narrow` defaults to none unless the same problem recurs.

## Pressure Recovery

A single ordinary correction returns failure facts to `devflow-core`; only repeated same-target dissatisfaction in one lifecycle, or the explicit `/devflow-pua` command, enters PUA.

```text
Pressure check: user challenged result / repeated miss / failed proof
Single correction: failure facts -> devflow-core; no automatic PUA
Repeated same target or explicit command: devflow-core -> devflow-pua
```

Do not continue with only wording, parameter, or nearby-file tweaks. PUA must restate the goal, list 3 hypotheses, and choose a materially different approach before the next proof.

## Recovery Proof Contract

After a PUA recovery, the first Prove pass cites:

```text
Recovery evidence:
- METHOD / SWITCH: <flavor/method and switch line>
- User-view miss: <classification>
- New success contract: <expected result + verification>
- Changed approach: <old path abandoned; new path>
```

A missing field means recovery did not run; return `FAIL` facts to Core.

## Evidence Rules

- Never write "should work" as a result; never hide a skipped check. A self-reported "small" is not evidence; cite the checker `NARROW_OK` line with declared and actual counts and the Depth Ledger factors. Do not maximize a score; stop when no decision-impact unknown remains.
- If verification is partial, say exactly what remains unverified.
- Never reuse old output or a delegated claim without independent verification.
- Running the same successful command twice without changes adds no evidence.
- On DSH, oversized tool results are pruned; keep the command, result excerpt, and judgment in context before truncation.

## Failure Loop

If proof fails:

```text
Judgment: FAIL
Failure facts: ...
Next step: devflow-core Recovery route; use devflow-pua for user challenge, changed-wrong result, repeated miss, or quality complaint
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This is only documentation." | Documentation can be broken, stale, or uncallable. Validate it. |
| "A partial check is enough." | Partial proof must be labeled partial. |
| "The tool said success." | Tool claims are data; verify the artifact. |
| "I am confident." | Confidence is not evidence. |

## Red Flags — STOP

- About to say "done", "fixed", "complete", or "passed" without running verification
- "Should work", "probably", or "seems to"
- Trusting a delegated claim without independent verification
- Reusing old output as proof
- Claiming PASS when a tier requirement or documented boundary is unresolved

## Verification

- [ ] Actual command or manual scenario was run.
- [ ] Result cites real output.
- [ ] Proof tier is stated and its evidence is complete; a narrow claim cites checker `NARROW_OK`.
- [ ] Judgment is `PASS`, `FAIL`, or `BLOCKED`.
- [ ] Coverage and gaps are clear when relevant.
- [ ] After PUA, the Recovery Proof Contract fields are cited.
