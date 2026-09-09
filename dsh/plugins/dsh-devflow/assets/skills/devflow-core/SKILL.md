---
name: devflow-core
description: "Use when starting development work, routing Problem, Fast, Design-lite, Design, Build, or Recovery work, investigating issues, handling requirements or bugs, or deciding which DevFlow skill owns the next lifecycle step. Apply Core's risk gate before selecting Brainstorm or Cut; clear low-risk existing behavior may skip Brainstorm but never Cut or Prove."
---

# DevFlow Core

Route work through the smallest reliable lifecycle. Core owns next-step selection only when an artifact has no unique successor; skills directly execute the A/B/C success edges defined below.

## Activation Evidence

```text
Skill Activation: devflow-core
Trigger: <user words or task shape>
Route: Problem / Fast / Design-lite / Design / Build / Recovery
Brainstorm required: yes/no
Depth hint: skip / compact / standard / deep / none
Next skill: <skill name or none>
Status: [DevFlow: <node> -> <next> | awaiting approval / in progress]
```

While a DevFlow lifecycle node is active, end each user-facing message with one status line: `[DevFlow: <node> -> <next> | awaiting approval / in progress]`. It reflects the current node without reloading the owner skill. Keep progress visible in the persistent UI: maintain a `todo_write` list with one item per active work unit (lifecycle node, background job, or subagent), marking it `completed` the moment it settles, and use `create_goal` for the session's long-running objective.

## Context Map

Read `skills/devflow-core/references/core-methods.md` before route selection. It supplies Method 0, shared route rules, and the owner map. Do not load all lifecycle references by default.

Read the narrowest relevant project facts, then read `docs/features/INDEX.md` and `docs/plans/INDEX.md` when present — one hop to see which capabilities already exist, where their entry points are, and which plans landed. Then progressively recall learning and project knowledge. Scan available skills and record a matching external specialist skill; a specialist may perform bounded specialist work inside the current node while DevFlow retains route and node ownership.

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

Apply this precedence before choosing a route: explicit independent review -> investigation or pure inquiry -> approved scope -> risk gate -> lifecycle owner. Do not route from keywords alone.
Investigation-only reports remain a Problem exception and do not enter Brainstorm.

Brainstorm is required when any material risk or decision-impact uncertainty exists. A request may bypass Brainstorm only when all of these are true: clear goal, existing local behavior, one plausible path, local impact, reversible change, no security/data-loss/permission/contract risk, and quick proof. Any unknown or failed factor keeps Brainstorm. Skipping Brainstorm compresses analysis only; it never skips Cut or Prove. Unapproved edits never use Fast.

| Route | Use when | Core action |
|---|---|---|
| Problem | A reported problem has no explicit fix request. | Prove facts first, then select later work only if a change is known. |
| Fast | Pure answer, lookup, verification, or an already approved trivial change. | Sense, then narrow proof. |
| Design-lite | Existing feature, all seven low-risk conditions hold. | Record `Brainstorm required: no` and `Depth hint: skip`; state goal, acceptance, exclusions; select Cut with Depth C, then Build. |
| Design | New requirement, behavior or architecture change, ambiguity, or multiple options. | Select Brainstorm; after confirmation its user-selected A/B/C path directly starts Spec or Cut. |
| Build | User asks to implement, fix, build, or land an approved change. | Select Cut, then Plan when construction needs several steps, then Build and Prove. |
| Recovery | Same target remains wrong after correction or proof failure. | Select PUA, consume recovery facts, then choose a different path. |

## Core Flow Map

```text
Skip-Brainstorm Design-lite success: Cut -> Build -> Prove
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

- Clear low-risk existing behavior with one plausible local path and quick proof: record skip depth, select `devflow-cut` directly with a Design-lite contract and Depth C; `CUT_PASS` enters Build. Keep the Cut and Prove gates.
- An unapproved problem-directed change enters the risk gate; material risk or ambiguity selects `devflow-brainstorm`.
- Unclear requirement, new feature, materially risky behavior change, cross-module impact, or multiple options: select `devflow-brainstorm` for Semantic Echo-Back and a fixed Confirmed request. Record `Brainstorm required: yes` and a depth hint: `compact` when goal, scope, and acceptance are already clear and one named residual risk remains that is not security, data-loss, permission, contract, or irreversible; `deep` for ambiguity or those protected risks; otherwise `standard`.
- Explicit spec or design document: select `devflow-spec` after confirmed request.
- New structure, dependency, abstraction, configuration, folder, or generic capability: select `devflow-cut`.
- Approved construction work: select `devflow-build` when Core receives a non-unique construction artifact; A/B approved Plans and C `CUT_PASS` enter Build directly.
- Completion claim: select `devflow-prove` and require fresh evidence plus adversarial review.
- Repeated same-target correction: select `devflow-pua`, then re-read facts and switch approach.
- Reusable correction or verified PASS: select `devflow-learn` for a selective review.
- Matched external specialist: perform bounded work inside the current owner's node and return result, not-applicable, or failure facts; a specialist never selects a lifecycle owner, depth, or final status.

## Verification

Before leaving Core, confirm that shared methods were read, only needed owner references were loaded, the route matches facts, and every selected skill has a return artifact or stop condition.
