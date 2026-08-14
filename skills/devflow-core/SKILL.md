---
name: devflow-core
description: "Use when starting development work, routing Problem, Fast, Design-lite, Design, Build, or Recovery work, investigating issues, handling requirements or bugs, or deciding which DevFlow skill owns the next lifecycle step. Before any creative work — creating features, building components, adding functionality, modifying behavior, or defining an unapproved problem-directed change — select devflow-brainstorm for a Confirmed request; pure Q&A, lookup, verification, and investigation-only reports remain exceptions."
---

# DevFlow Core

Route work through the smallest reliable lifecycle. Core owns next-step selection only when an artifact has no unique successor; skills directly execute the A/B/C success edges defined below.

## Activation Evidence

```text
Skill Activation: devflow-core
Trigger: <user words or task shape>
Route: Problem / Fast / Design-lite / Design / Build / Recovery
Next skill: <skill name or none>
Status: [DevFlow: <node> -> <next> | awaiting approval / in progress]
```

While a DevFlow lifecycle node is active, end each user-facing message with one status line: `[DevFlow: <node> -> <next> | awaiting approval / in progress]`. It reflects the current node without reloading the owner skill.

## Context Map

Read `skills/devflow-core/references/core-methods.md` before route selection. It supplies Method 0, shared route rules, and the owner map. Do not load all lifecycle references by default.

Read the narrowest relevant project facts, then progressively recall learning and project knowledge. Scan available skills and record a matching external specialist skill; a specialist may perform bounded specialist work inside the current node while DevFlow retains route and node ownership.

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
| Design | New requirement, behavior or architecture change, ambiguity, or multiple options. | Select Brainstorm; after confirmation its user-selected A/B/C path directly starts Spec or Cut. |
| Build | User asks to implement, fix, build, or land an approved change. | Select Cut, then Plan when construction needs several steps, then Build and Prove. |
| Recovery | Same target remains wrong after correction or proof failure. | Select PUA, consume recovery facts, then choose a different path. |

## Core Flow Map

```text
A direct success: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove
B direct success: Brainstorm -> Cut -> Plan -> Build -> Prove
C direct success: Brainstorm -> Cut -> Build -> Prove

CUT_REDUCE, CUT_REUSE, CUT_BLOCKED, scope drift, BUILD_BLOCKED,
Proof FAIL or BLOCKED, and PUA recovery -> Core selects the next owner or stop.
```

## Core Return Boundaries

- Brainstorm returns only clarification or missing-depth facts; a selected depth directly starts A -> Spec or B/C -> Cut.
- Spec directly sends an approved A-branch Spec to Cut; a non-success result returns facts to Core.
- Cut directly sends `CUT_PASS` A/B to Plan or C to Build; `CUT_REDUCE`, `CUT_REUSE`, and `CUT_BLOCKED` return facts to Core.
- Plan directly sends an approved A/B Plan to Build; scope-drift facts return to Core.
- Build returns `BUILD_BLOCKED` facts when its Plan Review or execution is blocked.
- PUA returns recovery facts after its method switch.
- Prove returns PASS, FAIL, or BLOCKED and invokes Learn after PASS.

Core selects only after a returned non-unique artifact. `CUT_REDUCE` and `CUT_REUSE` stop for user confirmation. Independent `devflow-adversarial` and `devflow-find-fault` review current material only and do not enter lifecycle routing.

## Capability Dispatch

- Unclear requirement, new feature, behavior change, or multiple options: select `devflow-brainstorm` for Semantic Echo-Back and a fixed Confirmed request.
- Explicit spec or design document: select `devflow-spec` after confirmed request.
- New structure, dependency, abstraction, configuration, folder, or generic capability: select `devflow-cut`.
- Approved construction work: select `devflow-build` when Core receives a non-unique construction artifact; A/B approved Plans and C `CUT_PASS` enter Build directly.
- Completion claim: select `devflow-prove` and require fresh evidence plus adversarial review.
- Repeated same-target correction: select `devflow-pua`, then re-read facts and switch approach.
- Reusable correction or verified PASS: select `devflow-learn` for a selective review.
- Matched external specialist: perform bounded work inside the current owner's node and return result, not-applicable, or failure facts; a specialist never selects a lifecycle owner, depth, or final status.

## Verification

Before leaving Core, confirm that shared methods were read, only needed owner references were loaded, the route matches facts, and every selected skill has a return artifact or stop condition.
