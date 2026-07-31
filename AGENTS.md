# DevFlow Core Runtime Prompt

This file is a portable startup interface, not a method reference or README. Load the named owner skill for execution details.

## Start

1. Load `skills/devflow-core/SKILL.md` for development work.
2. Read `skills/devflow-core/references/core-methods.md` before selecting a route.
3. Read only the selected lifecycle reference from Core's loading map.
4. At Sense, read narrow project facts, then selectively recall `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/` when present. Missing recall sources are non-blocking.
5. Scan available skills. A matching external skill may perform bounded specialist work; DevFlow retains route and node ownership.

When skills are unavailable, use the route table and hard boundaries below as the fallback; do not invent lifecycle details.

## Route Interface

| Signal | Owner | Required artifact | Return boundary |
|---|---|---|---|
| any creative work: creating features, building components, adding functionality, modifying behavior, or defining an unapproved problem-directed change | `devflow-core` -> Brainstorm -> user-selected A/B/C | Confirmed request + depth | unique A/B/C success edges direct; other states return Core |
| investigation-only problem report, pure Q&A, lookup, or verification | `devflow-core` -> Prove facts / Fast | verified facts or narrow evidence | Core selects any later change after facts |
| existing low-risk feature change, `implement`, `fix`, `land`, `bug report`, `error`, `failing test`, `broken` with an already approved scope | `devflow-core` -> Cut | approved scope and proof | `CUT_PASS` follows A/B -> Plan or C -> Build; other Cut states return Core |
| `spec`, `spec doc`, `requirements doc`, `design doc` | `devflow-spec` after Core selection | approved A-branch Spec | direct Cut; all non-success states return Core |
| `plan`, `implementation plan`, `task breakdown` | `devflow-plan` after A/B `CUT_PASS` | approved A/B Plan | direct Build; scope drift returns Core |
| `done`, `fixed`, `complete`, `ready`, `passed` | `devflow-prove` | fresh command, result, adversarial review, judgment | PASS enters Learn review |
| repeated same-target miss | `devflow-pua` | recovery facts and `METHOD: {flavor} / {method}` | Core selects changed path |
| explicit deep adversarial review or red-team review | `devflow-adversarial` | independent findings | no lifecycle handoff |
| explicit find faults, biggest omission, blind spot, least certain | `devflow-find-fault` | independent findings | no lifecycle handoff |

## Hard Boundaries

- Read facts before deciding. Search callers before a bug fix. Use First Principles Cut when cause, invariant, or smallest mechanism is unclear.
- Do not add a dependency, abstraction, configuration surface, directory, framework layer, or generic engine without a current accepted need.
- Prefer no change, reuse, available skill, standard library, native platform, installed dependency, direct configuration, then minimum new code.
- Core owns non-unique next-step selection. Direct success edges are A: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove, B: Brainstorm -> Cut -> Plan -> Build -> Prove, and C: Brainstorm -> Cut -> Build -> Prove.
- Brainstorm confirms the request, then presents A/B/C for user selection. `CUT_REDUCE`, `CUT_REUSE`, `CUT_BLOCKED`, scope drift, `BUILD_BLOCKED`, Proof `FAIL` or `BLOCKED`, and PUA recovery return facts to Core.
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
