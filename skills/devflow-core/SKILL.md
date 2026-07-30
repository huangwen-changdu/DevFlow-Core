---
name: devflow-core
description: "Use when starting development work, routing Problem, Fast, Design-lite, Design, Build, or Recovery work, investigating issues, handling requirements or bugs, or deciding which DevFlow skill owns the next lifecycle step."
---

# DevFlow Core

Route work through the smallest reliable lifecycle. Core owns every next-step selection; specialist skills return artifacts or facts to Core.

## Activation Evidence

```text
Skill Activation: devflow-core
Trigger: <user words or task shape>
Route: Problem / Fast / Design-lite / Design / Build / Recovery
Next skill: <skill name or none>
```

## Context Map

Read `skills/devflow-core/references/core-methods.md` before route selection. It supplies Method 0, shared route rules, and the owner map. Do not load all lifecycle references by default.

Read the narrowest relevant project facts, then progressively recall learning and project knowledge. Scan available skills and record a matching external guidance skill when one applies.

Before a route-specific decision, load only the selected owner reference:

| Selected work | Required reference |
|---|---|
| Cut | `skills/devflow-cut/references/cut-methods.md` |
| Spec or Plan | `skills/devflow-spec/references/spec-plan-methods.md` |
| Build | `skills/devflow-build/references/build-methods.md` |
| Prove or PUA | `skills/devflow-prove/references/proof-recovery-methods.md` |
| Learn | `skills/devflow-learn/SKILL.md` |

```text
Facts: read/confirmed <files or commands>
Methods: read/confirmed core-methods.md; selected owner references <paths or none>
Knowledge recall: none / learning index + matched card / project knowledge entry + matched docs
Skill Discovery: none / <skill-name> (matched: <why>)
Unknowns: <none or specific unknown>
```

## Routes

| Route | Use when | Core action |
|---|---|---|
| Problem | A reported problem has no explicit fix request. | Prove facts first, then select later work only if a change is known. |
| Fast | Pure answer, lookup, verification, or one local low-risk change. | Sense, then narrow proof. |
| Design-lite | Existing feature, one clear low-risk path, quick proof. | State goal, acceptance, exclusions; select Cut before Build. |
| Design | New requirement, behavior or architecture change, ambiguity, or multiple options. | Select Brainstorm, consume Confirmed request, then select the smallest next work. |
| Build | User asks to implement, fix, build, or land an approved change. | Select Cut, then Plan when construction needs several steps, then Build and Prove. |
| Recovery | Same target remains wrong after correction or proof failure. | Select PUA, consume recovery facts, then choose a different path. |

## Core Return Boundaries

- Brainstorm returns `Confirmed request` and `Status: clarified`.
- Spec returns a confirmed Spec after user approval.
- Cut returns `CUT_PASS`, `CUT_REDUCE`, `CUT_REUSE`, or `CUT_BLOCKED`.
- Plan returns a confirmed Plan and scope-drift facts after user review.
- Build returns `BUILD_BLOCKED` facts when its Plan Review or execution is blocked.
- PUA returns recovery facts after its method switch.
- Prove returns PASS, FAIL, or BLOCKED and invokes Learn after PASS.

Only Core selects what happens next. `CUT_REDUCE` and `CUT_REUSE` stop for user confirmation. Independent `devflow-adversarial` and `devflow-find-fault` review current material only and do not enter lifecycle routing.

## Capability Dispatch

- Unclear requirement, new feature, behavior change, or multiple options: select `devflow-brainstorm` for Semantic Echo-Back and a fixed Confirmed request.
- Explicit spec or design document: select `devflow-spec` after confirmed request.
- New structure, dependency, abstraction, configuration, folder, or generic capability: select `devflow-cut`.
- Approved construction work: select `devflow-build` only after Cut and any Core-selected Plan.
- Completion claim: select `devflow-prove` and require fresh evidence plus adversarial review.
- Repeated same-target correction: select `devflow-pua`, then re-read facts and switch approach.
- Reusable correction or verified PASS: select `devflow-learn` for a selective review.

## Verification

Before leaving Core, confirm that shared methods were read, only needed owner references were loaded, the route matches facts, and every selected skill has a return artifact or stop condition.
