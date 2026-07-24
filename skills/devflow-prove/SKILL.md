---
name: devflow-prove
description: "Use before saying done, fixed, complete, working, passed, resolved, ready, or candidate_pass; use after builds, bug fixes, rule/docs/skill changes, tests, validation, and any PASS/FAIL/BLOCKED evidence claim. Runs the narrowest sufficient check, performs adversarial review for development work, and reports Command/Result/Adversarial review/Judgment."
---

# DevFlow Prove

No proof, no completion.

**Violating the letter of the rules is violating the spirit of the rules.**

## Methodology Assets

When this skill activates, read this local reference before choosing or running proof scenarios:

- `skills/devflow-prove/references/flow-self-test.md`

This file contains end-to-end scenario tests and pressure scenarios for the framework itself.

## Process

1. Identify the command, test, build, lint, diff check, validation script, or manual scenario that proves the claim.
2. Run the narrowest sufficient check now.
3. Run adversarial review (对抗式审查) before completion for development work: try to disprove the result from the user's acceptance criteria, touched files, likely regressions, missing activation path, and skipped proof.
4. Read the real output and exit status.
5. If it fails, report `FAIL` and return to Recovery; use `devflow-pua` when the failure includes user challenge, repeated miss, or changed-wrong behavior.
6. If it cannot run, report `BLOCKED` and name the missing condition.
7. On `PASS`, load `devflow-learn` for its mandatory proactive completion review before final completion reporting. The review may yield a learning card, a project-knowledge candidate pending user confirmation, or no useful record.
8. Only then report completion or `candidate_pass`.

## Proof Selection

| Work type | Proof |
|---|---|
| Docs/rules/skills | File presence, frontmatter, required wording, command entries, path consistency, scenario checklist. |
| Code | Targeted test, build, lint, typecheck, or runtime scenario. **Plus: comment verification — check that new/changed functions have comments explaining WHY, non-obvious logic has inline comments, and comment style matches the project.** |
| Bug fix | Original symptom reproduction or regression check. **Plus: the fix location has a comment explaining what was broken and what the fix does.** |
| Framework design | Native capability coverage, anti-pattern gates, skill behavior, and output contracts. |
| Productized skill pack | `npm test` or equivalent package validation. |

## Light Quality Gate

After code changes, use the narrowest current quality signal before completion: targeted test, lint/typecheck, build, or a reproducible scenario. Do not run a full review checklist when a focused proof covers the claim.

After development work, adversarial review (对抗式审查) is mandatory before completion: check the strongest plausible reason the change is still wrong, incomplete, unreachable, over-broad, or under-verified. If the adversarial review finds a real gap, report `FAIL` or continue the appropriate DevFlow route before claiming completion.

Adversarial review checklist for code changes:

- **Correctness**: Does the code actually solve the stated goal? Are edge cases handled?
- **Regression**: Could this change break sibling callers, shared state, or downstream consumers?
- **Activation path**: Is the new code actually reachable? Can the user/trigger reach it?
- **Scope creep**: Does the diff include unrequested behavior or drive-by refactors?
- **Proof coverage**: Is the verification narrow enough to be meaningful, or is it a rubber-stamp?
- **Code comments**: Do new/changed functions have comments explaining WHY? Is non-obvious logic documented? Is the fix location commented for bug fixes? If comments are missing, the implementation is incomplete — report `FAIL` or add comments before claiming `PASS`.

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
| "Comments are optional, the code works." | Code without comments is incomplete implementation. The spec/plan defined what needs comments — verify they exist. |
| "The code is self-explanatory." | If the spec or plan required comments, they are not optional. If the logic is non-obvious, it needs a comment regardless of spec. |

## Red Flags — STOP

- About to say "done", "fixed", "complete", or "passed" without running verification
- Using "should work", "probably", or "seems to"
- Trusting a delegated claim without independent verification
- Reusing old output as proof
- Expressing satisfaction before verification runs
- Skipping the Skill Activation Chain Check after rule/skill/command changes
- Claiming PASS when new/changed functions have no comments and the spec/plan required them
- Claiming PASS when non-obvious logic has no inline comments

**All of these mean: run the command, read the output, then claim.**

## Verification

Before leaving this skill, confirm:

- [ ] Actual command or manual scenario was run.
- [ ] Result summary cites real output.
- [ ] Judgment is `PASS`, `FAIL`, or `BLOCKED`.B 的 CLI 探针已执行，但 `codex exec` 的初始提示没有触发 `UserPromptSubmit`，标记文件未生成。它只能证明非交互 CLI 不触发该事件，不能证明 Codex Desktop 不支持。

临时 Hook 注册、探针脚本和标记文件均已清理，没有残留配置改动。

Command: `codex exec --sandbox read-only --ephemeral "Respond with exactly: PONG"`  
Result: 会话正常返回 `PONG`，但未生成事件标记。  
Adversarial review: 不把 CLI 未触发误判为 Desktop 不支持，也不基于未证实事件进入实现。  
Judgment: BLOCKED

继续需要你选择：
- A. 改为基于已证实的 `PreToolUse`，实现“最近实际观察到的阶段/验证结果”。
- B. 进行 Desktop 交互探针：我重新临时注册 Hook，你在 DevFlow-Core 新开 Codex 会话并发送一条普通提示，随后我读取标记。推荐。
- [ ] Coverage and gaps are clear when relevant.
