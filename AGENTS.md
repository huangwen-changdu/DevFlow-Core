# DevFlow Core Runtime Prompt

This file is a portable startup interface, not a method reference or README. Load the named owner skill for execution details.

## Start

1. Load `skills/devflow-core/SKILL.md` for development work.
2. Read `skills/devflow-core/references/core-methods.md` before selecting a route.
3. Read only the selected lifecycle reference from Core's loading map.
4. At Sense, read narrow project facts, then selectively recall `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/` when present. Missing recall sources are non-blocking.
5. Scan available skills. A matching external skill guides quality but does not replace the DevFlow route.

When skills are unavailable, use the route table and hard boundaries below as the fallback; do not invent lifecycle details.

## Route Interface

| Signal | Owner | Required artifact | Return boundary |
|---|---|---|---|
| `problem report`, `investigate`, `check what is wrong`, `why broken` | `devflow-core` -> Prove facts | verified symptom and unknowns | Core selects any change only after facts |
| pure Q&A, lookup, verification, trivial local change | `devflow-core` Fast | narrow evidence | completion requires proof |
| existing low-risk feature change | `devflow-core` -> Cut | goal, acceptance, exclusions | Cut returns to Core |
| `requirement`, `feature request`, behavior or architecture change, ambiguity | `devflow-core` -> Brainstorm | Confirmed request | Core selects next work |
| `implement`, `fix`, `land`, `bug report`, `error`, `failing test`, `broken` | `devflow-core` -> Cut -> Build | approved scope and proof | every artifact returns to Core |
| `spec`, `spec doc`, `requirements doc`, `design doc` | `devflow-spec` after Core selection | approved Spec | confirmed Spec returns to Core |
| `plan`, `implementation plan`, `task breakdown` | `devflow-plan` after `CUT_PASS` | approved Plan | confirmed Plan returns to Core |
| `done`, `fixed`, `complete`, `ready`, `passed` | `devflow-prove` | fresh command, result, adversarial review, judgment | PASS enters Learn review |
| repeated same-target miss | `devflow-pua` | recovery facts and `METHOD: {flavor} / {method}` | Core selects changed path |
| explicit deep adversarial review or red-team review | `devflow-adversarial` | independent findings | no lifecycle handoff |
| explicit find faults, biggest omission, blind spot, least certain | `devflow-find-fault` | independent findings | no lifecycle handoff |

## Hard Boundaries

- Read facts before deciding. Search callers before a bug fix. Use First Principles Cut when cause, invariant, or smallest mechanism is unclear.
- Do not add a dependency, abstraction, configuration surface, directory, framework layer, or generic engine without a current accepted need.
- Prefer no change, reuse, available skill, standard library, native platform, installed dependency, direct configuration, then minimum new code.
- Brainstorm confirms request only. Spec, Cut, Plan, Build, and PUA return artifacts or facts only. Core alone selects the next lifecycle step.
- STOP for Brainstorm confirmation, Spec approval, Plan approval, and `CUT_REDUCE` or `CUT_REUSE` confirmation.
- Do not claim completion without fresh proof. A real adversarial gap is FAIL or continued work.
- `devflow-learn` records only reusable evidence-backed experience; business knowledge requires user confirmation before maintenance.

## Fallback Outputs

```text
Design:
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

```text
Completion:
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```
