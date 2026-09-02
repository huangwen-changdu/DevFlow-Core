---
name: devflow-prove
description: "Use before saying done, fixed, complete, working, passed, resolved, ready, or candidate_pass; use after builds, bug fixes, rule/docs/skill changes, tests, validation, and any PASS/FAIL/BLOCKED evidence claim. Runs the narrowest sufficient check, performs adversarial review for development work, and reports Command/Result/Adversarial review/Judgment."
---

# DevFlow Prove

No proof, no completion.

**Violating the letter of the rules is violating the spirit of the rules.**

## Methodology Assets

When this skill activates, read these local references before choosing or running proof scenarios:

- `skills/devflow-prove/references/flow-self-test.md` — end-to-end scenario tests and pressure scenarios for the framework itself.
- `skills/devflow-prove/references/code-review-checklist.md` — language-specific code quality criteria for adversarial code review.

## Process

Load `skills/devflow-prove/references/proof-recovery-methods.md` before selecting proof. It owns the shared proof and recovery method details used by Prove and PUA.

1. Identify the command, test, build, lint, diff check, validation script, or manual scenario that proves the claim.
2. Confirm the exact changed files, approved File Structure/Plan boundary, latest Prewalk Execution Trace and Current Handoff Facts. Read the task's remaining-work completion evidence plus the nearest comparable code.
3. Run the narrowest sufficient check now, then independently inspect the actual implementation diff before interpreting test results.
4. Run adversarial review (对抗式审查) against the approved responsibility boundary, Prewalk facts, direct contracts, nearby convention, and likely regressions.
5. For code changes: run the **Code Quality Review** (General Engineering Review + Language-Specific Checklist from `code-review-checklist.md`), then generate a **Code Review Report** (see format below). Classify each evidence-backed finding as Blocker, Warning, or Recommendation. An unresolved Blocker or Warning returns `FAIL` facts to Core; recommendations do not block an otherwise proven result.
6. Read the real output and exit status.
7. If it fails, report `FAIL` facts to `devflow-core`; Core selects Recovery or another owner. Use `devflow-pua` when the failure includes user challenge, repeated miss, or changed-wrong behavior.
8. If it cannot run, report `BLOCKED` facts to `devflow-core` and name the missing condition.
9. On `PASS`, load `devflow-learn` for its mandatory proactive completion review before final completion reporting. The review may yield a learning card, a project-knowledge candidate pending user confirmation, or no useful record.
10. Only then report completion or `candidate_pass`.

## Exception Return Boundary

Prove is the terminal direct-success step. `PASS` completes only after the Learn review. `FAIL`, `BLOCKED`, an adversarial gap, an unresolved Code Review Blocker/Warning, or a missing recovery-proof field are non-unique facts and return to `devflow-core`; Prove does not select the repair, recovery, or re-clarification skill.

## Proof Selection

| Work type | Proof |
|---|---|
| Docs/rules/skills | File presence, frontmatter, required wording, command entries, path consistency, scenario checklist. |
| Code | Targeted test, build, lint, typecheck, or runtime scenario. **Plus: inspect the actual implementation diff against the approved File Structure/Plan boundary, Prewalk evidence, and nearest comparable code before interpreting test results.** **Plus: comment verification — check requirements recorded by the Spec/Plan or local convention, and any non-obvious decision, business, security, or compatibility boundary.** **Plus: language-specific code quality review — detect language from file extensions, apply the matching checklist in `skills/devflow-prove/references/code-review-checklist.md`, and classify evidence-backed Blockers, Warnings, and Recommendations.** |
| Bug fix | Original symptom reproduction or regression check. **Plus: verify any documented fix rationale and any non-obvious failure condition that needs preservation.** |
| Framework design | Native capability coverage, anti-pattern gates, skill behavior, and output contracts. |
| Productized skill pack | `npm test` or equivalent package validation. |

## Adversarial Review

After development work, adversarial review (对抗式审查) is mandatory before completion: check the strongest plausible reason the change is still wrong, incomplete, unreachable, over-broad, or under-verified. If the adversarial review finds a real gap, report `FAIL` facts to `devflow-core` before claiming completion.

Adversarial review checklist for code changes:

- **Correctness**: Does the code actually solve the stated goal? Are edge cases handled?
- **Regression**: Could this change break sibling callers, shared state, or downstream consumers?
- **Activation path**: Is the new code actually reachable? Can the user/trigger reach it?
- **Scope creep**: Does the diff include unrequested behavior or drive-by refactors?
- **Proof coverage**: Is the verification narrow enough to be meaningful, or is it a rubber-stamp?
- **Code comments**: Are all Spec/Plan/local-convention requirements present? Are non-obvious decisions, business rules, security, or compatibility boundaries documented where needed? A missing triggered comment is an approved-contract gap; absence of untriggered narration is not.
- **Code Quality**: Two-layer review. The adversarial review items above (Correctness, Regression, Activation path, Scope creep) already cover functional correctness. Then run the **General Engineering Review** from `skills/devflow-prove/references/code-review-checklist.md` for the remaining dimensions: requirements understanding, code quality (readability, maintainability, testability), performance, security, error handling. Finally, detect language(s) from file extensions and apply the matching **Language-Specific Checklist**. **Generate a diff-first Code Review Report (see format below) with actual changed-code evidence, Plan boundary, Prewalk evidence, Blockers, Warnings, Recommendations, and Boundary verdict; unresolved Blockers or Warnings block PASS.**

After agent rule, command, prompt, entry, or `SKILL.md` changes, run a Skill Activation Chain Check before completion:

```text
Skill Activation Check: trigger <user words/command/upstream output>; surface <description/command/entry>; action <loads/calls target skill>; evidence <artifact/check/output>
```

Check:

- Trigger: natural user wording, explicit command, or upstream stage output can reach the target skill.
- Surface: the target `description`, command prompt, or entry file contains real trigger wording.
- Runtime action: the rule says to load/call the skill, not only "reference" it.
- Handoff evidence: the downstream skill artifact, check, or output contract is required before completion.
- Breakpoint: if activation is broken, fix the trigger chain before editing skill internals again.

## Required Output

```text
Command: <actual command run>
Result: <key output summary>
Adversarial review: <strongest challenge and disposition, or not applicable for non-development verification>
Judgment: PASS / FAIL / BLOCKED
```

Add coverage when useful:

```text
Coverage: <what was verified>
Not covered: <none or explicit gap>
```

## Code Review Report

For code changes, after running the Code Quality Review (General Engineering Review + Language-Specific Checklist), generate this report before claiming PASS or FAIL. Review the actual diff before relying on test results. A Blocker or unresolved Warning returns `FAIL` facts to Core; Recommendations remain visible but do not independently prevent PASS.

```text
Code Review Report:
- Diff reviewed: [actual changed files/ranges].
- Plan boundary: [approved File Structure row(s) and verdict].
- Prewalk evidence: [Execution Trace, Handoff Facts, remaining-work completion evidence].
- Comparable code: [nearest inspected file/symbol and observed convention].
- Blockers: [count].
  1. [Blocker] [file:line] — [changed-code evidence and concrete risk] → [smallest correction].
- Warnings: [count].
  1. [Warning] [file:line] — [evidence-backed issue] → [required closure].
- Recommendations: [count].
  1. [Recommendation] [file:line] — [contextual improvement] → [optional choice].
- Boundary verdict: [within approved responsibility/touch set or drift facts returned to Core].
- Judgment: PASS (no unresolved Blockers or Warnings) / FAIL (Blocker or Warning remains).
```

Rules:
- Every Blocker or Warning identifies an actual changed-code location, evidence, concrete risk, and smallest correction.
- A pattern preference, function size, class name, dependency count, missing cache, or fixed architectural shape cannot block by itself.
- Re-review the new diff after every quality repair and explicitly close or persist each prior Blocker/Warning.
- **STOP gate**: when a Blocker or Warning remains, do not claim `PASS`; return the facts to Core for the next lifecycle decision. Recommendations remain visible but do not independently stop an otherwise proven result.

## Learning Check

Every `PASS` must load `devflow-learn` before the final completion report. The review actively extracts reusable implementation patterns, constrained decisions, effective proof, conventions, invariants, and business-fact candidates from verified work. A card is conditional on useful future-task value; the review itself is mandatory.

If the user corrected the result, repeated the same rule, or a non-obvious pitfall appeared, preserve the existing `devflow-learn` recovery capture in addition to the `PASS` review.

When a review identifies a code-backed business-semantic change, report the candidate and wait for user confirmation before loading `devflow-project-knowledge`. Do not update `docs/project-knowledge/` automatically.

Report:

```text
Learning closure:
- Learning signal: PASS review/correction/pitfall/none
- Recall record: none/index/card
- Review result: learning card/project-knowledge candidate/no useful record
- New sediment: none/card/rule/skill
- Next intercept: next time <X>, first do <Y>, do not do <Z>
```

Do not create noisy learning entries for one-off facts, raw implementation narration, already-covered lessons, or pure refactors without reusable insight.

## Pressure Recovery Check

If proof fails after repeated attempts, or the user says the result is wrong, changed wrong, not what they asked for, or hard to distinguish:

```text
Pressure check: user challenged result / repeated miss / failed proof
Next step: devflow-core -> devflow-pua
```

Do not continue the same approach with only minor wording, parameter, or nearby-file tweaks. `devflow-pua` must stop, restate the goal, ask or infer the desired result, list 3 hypotheses, and choose a materially different approach before the next proof.

## Recovery Proof Contract

After a `devflow-pua` recovery, the first Prove pass must cite the PUA recovery output as evidence that recovery actually ran — triggering the skill alone is not proof. Quote these fields from the PUA output:

```text
Recovery evidence:
- METHOD / SWITCH: <flavor/method and any switch line>
- User-view miss: <classification>
- New success contract: <expected result + verification>
- Changed approach: <old path abandoned; new path>
```

If any field is missing or empty, recovery was not executed. Report `FAIL` facts to `devflow-core`, which may select `devflow-pua`; a bare `METHOD:` line without diagnosis, quarantine, and a changed approach is not recovery.

## Evidence Rules

- Do not write "should work" as a result.
- Do not hide skipped checks.
- If verification is partial, say exactly what remains unverified.
- Never use old output, "looks good", or a delegated claim without independent verification.
- Running the same successful command twice without changes adds no evidence.
- On DeepSeek Harness (DSH), oversized tool results are pruned (default threshold 8192 chars, keeping the head 4096 and tail 1024). Preserve the key command, result excerpt, and judgment rationale in your own context — the completion report or `todo_write` — before a long output is truncated; do not rely on a pruned tool result still holding the evidence.

## Failure Loop

If proof fails:

```text
Judgment: FAIL
Failure facts: ...
Next step: devflow-core Recovery route; use devflow-pua for user challenge, changed-wrong result, repeated miss, or quality complaint
```

Recovery requires re-reading facts, listing 3 hypotheses, and trying a materially different approach.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This is only documentation." | Documentation can still be broken, stale, or uncallable. Validate it. |
| "A partial check is enough." | Partial proof must be labeled partial. |
| "The tool said success." | Tool claims are data. Verify the actual artifact/output. |
| "I am confident." | Confidence is not evidence. |
| "Comments are optional, the code works." | Comments required by the Spec, Plan, project convention, or a non-obvious boundary are implementation requirements; verify them. |
| "The code is self-explanatory." | Clear code can avoid redundant narration, but it cannot waive an approved documentation requirement or an important non-obvious reason. |

## Red Flags — STOP

- About to say "done", "fixed", "complete", or "passed" without running verification
- Using "should work", "probably", or "seems to"
- Trusting a delegated claim without independent verification
- Reusing old output as proof
- Expressing satisfaction before verification runs
- Skipping the Skill Activation Chain Check after rule/skill/command changes
- Claiming PASS when an approved documentation requirement or an important non-obvious boundary is unaddressed

**All of these mean: run the command, read the output, then claim.**

## Verification

Before leaving this skill, confirm:

- [ ] Actual command or manual scenario was run.
- [ ] Result summary cites real output.
- [ ] Judgment is `PASS`, `FAIL`, or `BLOCKED`.
- [ ] Coverage and gaps are clear when relevant.
- [ ] After a `devflow-pua` recovery, the Prove pass cites the Recovery Proof Contract fields (METHOD/SWITCH, User-view miss, New success contract, Changed approach).
