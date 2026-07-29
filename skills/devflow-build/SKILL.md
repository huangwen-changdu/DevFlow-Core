---
name: devflow-build
description: "Use when implementing an approved plan, applying Karpathy-style minimal changes, fixing code, refactoring narrowly, creating implementation slices, touching files surgically, or keeping every diff tied to the user goal. Implements only the selected smallest useful solution."
---

# DevFlow Build

Implement only the selected smallest useful solution.

## Context

Receives a `CUT_PASS` Cut Decision from `devflow-cut`.

- Depth A/B input: `CUT_PASS` plus a user-approved Plan Pack at `docs/plans/YYYY-MM-DD-<short-kebab-name>.md`. Confirm the plan stays within the recorded Cut scope; re-run only affected Cut gates if the plan introduces scope, dependency, abstraction, or file-responsibility drift.
- Depth C input: `CUT_PASS` plus the approved design contract; no Plan Pack is required.

When no plan file exists, the approved design and Cut Decision form the Build Contract basis; skip the plan checker.
## Plan Review

Before editing, reconcile the plan against the current codebase — executability review, not redesign:

1. Anchors: every `Modify` symbol/anchor and interface in the plan still exists and matches.
2. Behavior: each task's `Current behavior` still describes the code.
3. Steps: unambiguous, with verification commands that can run in this environment.
4. Skills: every skill declared in `External Skills` (Cut Decision or plan header) is actually loaded through the platform's skill mechanism, or the reason it does not apply is recorded.

Any failed check, unclear instruction, or critical gap: stop and return `BUILD_BLOCKED` with the facts to `devflow-core`. Do not guess, do not silently repair the plan. Reviewing fidelity is not re-deciding the mechanism.

For Depth C (no Plan Pack), run the same review against the approved design contract: confirm the symbols and behaviors it names still exist. Depth C keeps Build freedom inside the Cut Decision; it does not skip this review or the Stop Protocol.

## Build Contract

Before editing, state:

```text
Goal: ...
Will touch: <files/modules>
Not doing: ...
Skills loaded: <skill-name> / none
Narrowest verification: ...
```

If work touches more than one file or one logical step, create Implementation Slices.

## Plan Pack

When saving a plan file, use `docs/plans/YYYY-MM-DD-<short-kebab-name>.md`, resolved from the current target project's root, unless that project already documents another plan/spec path. Do not save implementation plans under `docs/features/`; that directory is for feature ledgers.

For multi-step work, tasks must cite the approved source and be small and verifiable:

```text
Goal: <outcome>
Architecture: <smallest design and boundaries>
Tech Stack: <relevant existing stack>
Source: <docs/specs/YYYY-MM-DD-<short-kebab-name>.md or approved design>
Spec coverage: <which requirement(s) this plan covers, or design-only>
Cut Decision: <CUT_PASS allowed scope, reuse conclusion, exclusions, verification constraints>
External Skills: <skill-name> (role: guides execution) / none
Task: <short title>
Task type: Code change | Documentation-only
Files:
- Create: <path> | new file | <responsibility>
- Modify: <path> | <symbol or stable anchor> | <responsibility>
- Test: <path> | <test symbol or stable anchor> | <behavior proved>  # only when applicable
Interfaces:
- Consumes: <exact symbol/API input and type/shape, or documentation-only exception>
- Produces: <exact symbol/API output and type/shape, or documentation-only exception>
Current behavior: <observable current state>  # Code change only
Target behavior: <observable outcome>  # Code change only
Change mechanics: <minimal code snippet, pseudocode, or exact replacement rule>  # Code change only
Call impact: <known callers/downstream effect, or no runtime impact>  # Code change only
Steps:
- [ ] <one file + symbol/anchor + executable action; include code snippet, pseudocode, or exact replacement for code logic>
- [ ] <one verification action with trigger/input, expected result, and command or manual scenario>
Acceptance: <specific condition>
Verify: <exact command or manual scenario, trigger/input, and expected result>
Comments: <what code comments are required — which functions need function-level comments, which non-obvious logic needs inline comments explaining WHY; or "none — trivial change">
Not doing: <scope removed>
```

No unresolved markers. For `Code change`, follow the recorded file symbol/anchor, `Current behavior`, `Target behavior`, `Change mechanics`, and `Call impact`; do not re-decide the implementation mechanism in Build. The verification step must retain its trigger/input, expected result, and command or manual scenario. `Documentation-only` applies only to tasks with no runtime code files and explicit `documentation-only` interfaces. No "add tests" without naming the behavior. No "handle edge cases" without naming the edge case. No "similar to Task N" shortcuts; repeat enough detail for each task to stand alone.

Before Build, run `node scripts/devflow-plan.js <plan-file>` when a plan is saved to a file. If not found at `scripts/devflow-plan.js` (project-level), try `~/.codex/scripts/devflow-plan.js` or `~/.claude/scripts/devflow-plan.js` (user-level). Do NOT look under `skills/scripts/`. See `core-methods.md` Script Path Resolution.

## Implementation Slices

```text
Implementation Slices:
- Slice 1: files / change / per-slice verification
- Slice 2: files / change / per-slice verification
```

Rules:

- Keep each slice independently understandable.
- Prefer a slice that can run a focused check before the next slice.
- Merge slices that cannot be verified separately.
- Do not add work removed by `devflow-cut`.

## Source Check

When correctness depends on a framework/library/API version:

1. Detect the stack/version from dependency files.
2. Prefer official docs or local project docs.
3. If official/current docs cannot be checked, mark the pattern as unverified.
4. If docs conflict with existing project style, surface the conflict.

Output:

```text
Source Check: <version/source checked or unverified>; decision <why>
```

## Surgical Rules

- Touch only files required by the user goal.
- Match the existing project style.
- Do not refactor unrelated code.
- Do not add speculative flexibility.
- Do not add a new abstraction for one caller.
- Remove only unused code created by your own change.
- Keep each change small enough to verify.
- If a changed line cannot be tied to the user goal, remove it.
- For bug fixes, prefer the shared root-cause fix after caller/reference search; do not patch only the named symptom when sibling callers remain broken.
- If you keep an intentional simplification with a known ceiling, add `devflow: <ceiling>, revisit when <trigger>` near the shortcut.

## Code Comment Discipline

Comments are part of the implementation, not an afterthought. The spec's Code Documentation section and the plan's Comments field define what needs documentation — this section enforces it during Build.

### What needs comments

| Code element | When | What to write |
|---|---|---|
| New file | Always | File-level comment: what this file does, key exports, why it exists |
| New function/method | Always | Function comment: purpose, params, return value, side effects, exceptions |
| Changed function (logic change) | When logic changes | Update existing comment or add one; explain what changed and why |
| Non-obvious logic | When the WHY is not clear from the code | Inline comment: explain the reasoning, not the mechanics |
| Business rule in code | When code encodes a domain rule | Inline comment: which business rule, who defined it, link to spec if possible |
| Workaround/fix | When fixing a bug or working around a limitation | Inline comment: what was broken, what the fix does, link to issue if possible |
| Config/constant | When value is non-obvious | Inline comment: why this value, what it controls |

### Comment rules

- **Explain WHY, not WHAT.** `// increment counter` is noise. `// retry counter: stop after 3 to avoid locking the account` is useful.
- **Match the project's existing comment style and language.** If the project uses JSDoc, use JSDoc. If comments are in Chinese, write in Chinese.
- **Comments must survive code reading.** A developer or LLM reading the code 6 months later should understand the decision from the comment alone.
- **Do not comment obvious code.** `let x = 1` does not need a comment. But `let x = 1 // start from 1, not 0, because the API is 1-indexed` is useful if the 1-indexing is non-obvious.
- **Update comments when you change the code they describe.** Stale comments are worse than no comments — but missing comments are worse than stale ones.

### Comment output check

After implementation, before Diff Self-Check, verify:

```text
Comment Check:
- New files: <list, or none>
  - File-level comment: <yes/no>
- New/changed functions: <list, or none>
  - Function comment: <yes/no per function>
- Non-obvious logic: <list, or none>
  - Inline comment: <yes/no per location>
- Comment style: matches project / N/A
```

If any required comment is missing, add it before proceeding to Diff Self-Check.

## Testing Rule

- Behavior-changing code: prefer a focused test or reproducible scenario.
- Bug fix: prove the original symptom or add a regression check when feasible.
- Docs/rules/skills: validate required wording, frontmatter, links/paths, and scenarios.
- Static text-only changes can use search-based verification.

## Diff Self-Check

After editing, run:

```text
Diff Check: Does each change directly serve the goal? Per file: Goal link / Behavior changed / Why this file / Verification.
Style Check: Does it match existing style?
Scope Check: Does it include unrequested behavior or drive-by refactor?
Verification Check: Is there a narrow runnable proof?
```

If any file has no goal link, remove that change.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "I'll clean this nearby thing too." | Note it separately; do not mix it into this diff. |
| "A helper makes it nicer." | One caller is not enough unless local convention requires it. |
| "We'll verify everything at the end." | Verify slices when focused checks exist. |
| "Docs changes do not need proof." | Docs/rules/skills need validation just like code. |
| "The issue only mentions one caller." | Check sibling callers before choosing the fix location. |
| "The plan is approved, so I just execute." | Plan Review comes first: stale anchors or unclear steps return `BUILD_BLOCKED` to Core. |
| "I'll infer the missing step." | Guessing past a gap is forbidden; unclear instructions return `BUILD_BLOCKED` facts. |
| "The code is self-explanatory." | Code tells you WHAT it does. Comments tell you WHY. Future developers and LLMs need the WHY. |
| "Comments will get stale." | Stale comments are a maintenance issue. Missing comments are worse. Write them now, update them when code changes. |
| "I'll add comments after it works." | Comments are part of the implementation. If the code works but has no comments, the implementation is incomplete. |
| "The function name is clear enough." | Names describe WHAT. Comments capture WHY — the decision, the constraint, the business rule. |

## Stop Protocol

Stop executing immediately and return `BUILD_BLOCKED` with the blocking facts to `devflow-core` when:

- a Plan Review check fails (dead anchor, stale behavior, missing interface, unclear step)
- a dependency, tool, or declared external skill is missing and the task depends on it
- verification fails repeatedly for the same task
- the plan has a critical gap that prevents starting or continuing

Do not guess, do not force through blockers, and do not broaden scope to escape. Core decides whether to revise the plan, re-clarify with `devflow-brainstorm`, or enter `devflow-pua`.

## Handoff Gate

Do not say done. Hand off to `devflow-prove` with:

```text
Proof target: ...
Suggested command/scenario: ...
Known unverified: ...
```

## Verification

Before leaving this skill, confirm:

- [ ] Plan Review passed or concerns were returned to `devflow-core` as `BUILD_BLOCKED`.
- [ ] Declared external skills were loaded, or the exception reason was recorded in `Skills loaded`.
- [ ] Build contract exists.
- [ ] Cut gates passed or were run.
- [ ] Slices exist when work is multi-step.
- [ ] Code Comment Discipline check is complete — required comments exist for new files, new/changed functions, and non-obvious logic.
- [ ] Diff self-check is complete.
- [ ] Proof command/scenario is ready for `devflow-prove`.
