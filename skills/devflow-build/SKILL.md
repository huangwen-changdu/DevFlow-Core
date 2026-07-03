---
name: devflow-build
description: "Use when implementing an approved plan, applying Karpathy-style minimal changes, fixing code, refactoring narrowly, creating implementation slices, touching files surgically, or keeping every diff tied to the user goal. Implements only the selected smallest useful solution."
---

# DevFlow Build

Implement only the selected smallest useful solution.

## Context

Receives `CUT_PASS` from `devflow-cut`. Input may be a Plan Pack (Depth A/B: `docs/plans/<name>.md`) or an approved design contract (Depth C: no plan file). When no plan file exists, the design contract is the plan — skip `devflow-plan.js` check and use its fields as the Build Contract basis.

## Build Contract

Before editing, state:

```text
Goal: ...
Will touch: <files/modules>
Not doing: ...
Narrowest verification: ...
```

If work touches more than one file or one logical step, create Implementation Slices.

## Plan Pack

When saving a plan file, use `docs/plans/<short-kebab-name>.md` by default unless the target project already documents another plan/spec path. Do not save implementation plans under `docs/features/`; that directory is for feature ledgers.

For multi-step work, tasks must cite the approved source and be small and verifiable:

```text
Source: <docs/specs/<name>.md or approved design>
Spec coverage: <which requirement(s) this plan covers, or design-only>
Task: <short title>
Files: <exact files likely touched>
Acceptance: <specific condition>
Verify: <exact command or manual scenario>
Not doing: <scope removed>
```

No unresolved markers. No "add tests" without naming the behavior. No "handle edge cases" without naming the edge case. No "similar to Task N" shortcuts; repeat enough detail for each task to stand alone.

Before Build, run `node scripts/devflow-plan.js <plan-file>` when a plan is saved to a file.

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

## Handoff Gate

Do not say done. Hand off to `devflow-prove` with:

```text
Proof target: ...
Suggested command/scenario: ...
Known unverified: ...
```

## Verification

Before leaving this skill, confirm:

- [ ] Build contract exists.
- [ ] Cut gates passed or were run.
- [ ] Slices exist when work is multi-step.
- [ ] Diff self-check is complete.
- [ ] Proof command/scenario is ready for `devflow-prove`.
