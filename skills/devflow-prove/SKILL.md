---
name: devflow-prove
description: "Use before saying done, fixed, complete, working, passed, resolved, ready, or candidate_pass; use after builds, bug fixes, rule/docs/skill changes, tests, validation, and any PASS/FAIL/BLOCKED evidence claim."
---

# DevFlow Prove

No proof, no completion.

## Process

1. Identify the command, test, build, lint, diff check, validation script, or manual scenario that proves the claim.
2. Run the narrowest sufficient check now.
3. Read the real output and exit status.
4. If it fails, report `FAIL` and return to Recovery; use `devflow-pua` when the failure includes user challenge, repeated miss, or changed-wrong behavior.
5. If it cannot run, report `BLOCKED` and name the missing condition.
6. Only then report completion or `candidate_pass`.

## Proof Selection

| Work type | Proof |
|---|---|
| Docs/rules/skills | File presence, frontmatter, required wording, command entries, path consistency, scenario checklist. |
| Code | Targeted test, build, lint, typecheck, or runtime scenario. |
| Bug fix | Original symptom reproduction or regression check. |
| Framework design | Native capability coverage, anti-pattern gates, skill behavior, and output contracts. |
| Productized skill pack | `npm test` or equivalent package validation. |

## Light Quality Gate

After code changes, use the narrowest current quality signal before completion: targeted test, lint/typecheck, build, or a reproducible scenario. Do not run a full review checklist when a focused proof covers the claim.

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
Judgment: PASS / FAIL / BLOCKED
```

Add coverage when useful:

```text
Coverage: <what was verified>
Not covered: <none or explicit gap>
```

## Verifier Lens

When an external verifier, CI, human gate, or benchmark owns final approval:

- You may report `candidate_pass` after local proof.
- Do not write final external `verifier_status=pass`.
- Do not modify tests, scoring, verifier, CI, or hidden assets to make proof pass.

Verifier-style output:

```text
agent_proposed_status: candidate_pass / fail / blocked
final_status_owner: external_verifier_or_human
```

## Learning Check

If the user corrected the result, repeated the same rule, or a non-obvious pitfall appeared, load `devflow-learn` and report:

```text
Learning closure:
- Learning signal: yes/no
- Recall record: none/index/card
- New sediment: none/card/rule/skill
- Next intercept: next time <X>, first do <Y>, do not do <Z>
```

Do not create noisy learning entries for one-off facts.

## Pressure Recovery Check

If proof fails after repeated attempts, or the user says the result is wrong, changed wrong, not what they asked for, or hard to distinguish:

```text
Pressure check: user challenged result / repeated miss / failed proof
Next step: devflow-core -> devflow-pua
```

Do not continue the same approach with only minor wording, parameter, or nearby-file tweaks. `devflow-pua` must stop, restate the goal, ask or infer the desired result, list 3 hypotheses, and choose a materially different approach before the next proof.

## Evidence Rules

- Do not write "should work" as a result.
- Do not hide skipped checks.
- If verification is partial, say exactly what remains unverified.
- Never use old output, "looks good", or a delegated claim without independent verification.
- Running the same successful command twice without changes adds no evidence.

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

## Verification

Before leaving this skill, confirm:

- [ ] Actual command or manual scenario was run.
- [ ] Result summary cites real output.
- [ ] Judgment is `PASS`, `FAIL`, or `BLOCKED`.
- [ ] Coverage and gaps are clear when relevant.
