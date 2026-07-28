# DevFlow Plan Writing-Plan Upgrade Implementation Plan

Goal: 将现有 `/devflow-plan` 升级为唯一的 `devflow-plan` 计划生成能力：提供独立 skill、可执行计划格式和对应校验，同时让 `CUT_PASS` 先裁定范围，再输出施工清单并交给 Build/Prove。
Architecture: `devflow-cut` 先产生范围、复用、排除项和验证约束；`skills/devflow-plan/SKILL.md` 将该 Cut Decision 落为唯一施工清单；Node checker 只校验静态结构和反模式。
Tech Stack: Markdown runtime skills、TOML command prompt、零依赖 Node.js checker、现有 npm 验证与安装器。
Source: Approved user clarification on 2026-07-28: retain `devflow-plan` as the single planning capability; make `Cut → Plan → Build → Prove` the A/B lifecycle; exclude test-first workflow and per-task version-control steps.
Spec coverage: Design-only. Task 1 defines the Cut/Plan/Build handoff; Task 2 synchronizes routes and hosts; Task 3 records the lifecycle and validates activation.
Cut Decision: CUT_PASS for this framework change: reuse existing `devflow-plan`, checker, hosts, and validators; no new skill, dependency, directory, or second lifecycle; verify with scenario, trigger, host, installer, package, and plan-checker commands.

## Global Constraints

- Keep the `/devflow-plan` command name and `scripts/devflow-plan.js` entry path unchanged.
- Add only `devflow-plan`; do not add `devflow-writing-plans` or a reviewer skill.
- Preserve `docs/plans/YYYY-MM-DD-unified-devflow-plan.md` as the plan landing convention.
- Preserve `Source`, `Spec coverage`, `Acceptance`, `Verify`, `Comments`, and `Not doing`.
- Add no dependency, service, generic generator, automatic execution mode, test-first workflow, or per-task version-control step.
- Do not migrate historical plans; this active implementation plan is updated to the upgraded contract.

## File Structure

| File | Responsibility |
| --- | --- |
| `skills/devflow-plan/SKILL.md` | Single runtime contract for high-fidelity implementation plans. |
| `commands/devflow-plan.toml` | Existing `/devflow-plan` entry that delegates to the unified skill. |
| `skills/devflow-core/references/core-methods.md` | Canonical Plan Pack field and task-sizing rules. |
| `skills/devflow-spec/SKILL.md` | Saved-spec handoff into the upgraded contract. |
| `skills/devflow-build/SKILL.md` | Build-side interpretation of the upgraded task contract. |
| `skills/skill-call-diagram.md` | Runtime-chain diagram for the plan skill. |
| `plugin.json`, `gemini-extension.json` | Published runtime skill manifests. |
| `scripts/install-devflow.js`, `scripts/install-devflow-user.js` | Target and user runtime install lists. |
| `scripts/devflow-plan.js` | Static structural plan validation. |
| `scripts/validate-*.js` | Reachability, packaging, and regression proof. |
| `README.md`, `docs/features/*.md` | User-facing contract and capability history. |

---

Task: Reorder Cut, Plan, and Build handoffs
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | route Depth A/B through Cut before Plan
- Modify: skills/devflow-spec/SKILL.md | hand approved specs to Cut before construction planning
- Modify: skills/devflow-cut/SKILL.md | consume approved Design/Spec and emit Cut Decision
- Modify: skills/devflow-plan/SKILL.md | consume CUT_PASS and hand approved construction plans to Build
- Modify: skills/devflow-build/SKILL.md | consume Cut Decision plus Plan Pack for A/B
- Modify: skills/devflow-core/SKILL.md | route A/B through Cut before Plan
- Modify: skills/devflow-core/references/core-methods.md | document Cut Decision as Plan Pack context
Interfaces:
- Consumes: approved Design/Spec and Cut gates
- Produces: `CUT_PASS` Cut Decision, then an approved construction Plan Pack or direct Depth C Build input
Steps:
- [ ] Modify `skills/devflow-cut/SKILL.md` to record allowed scope, reuse conclusion, exclusions, and verification constraints at `CUT_PASS`; expect A/B to hand off to `devflow-plan` and C to `devflow-build`.
- [ ] Modify `skills/devflow-plan/SKILL.md` and `skills/devflow-build/SKILL.md` to require `CUT_PASS` and only a lightweight Cut-consistency review after plan approval; expect scope drift to return only affected Cut gates.
- [ ] Modify `skills/devflow-brainstorm/SKILL.md`, `skills/devflow-spec/SKILL.md`, `skills/devflow-core/SKILL.md`, and `skills/devflow-core/references/core-methods.md`; expect A=`Spec → Cut → Plan → Build`, B=`Cut → Plan → Build`, C=`Cut → Build`.
Acceptance: A/B plans are written only after `CUT_PASS`; plan review cannot silently expand the Cut Decision; C remains plan-free.
Verify: Run `node scripts/validate-skill-triggers.js` and inspect route strings in Brainstorm, Cut, Plan, Build, and core methods.
Comments: none — runtime Markdown contract; no production code functions are added.
Not doing: no second Cut lifecycle, new skill, TDD, per-task commits, reviewer skill, or historical-plan migration.

---

Task: Synchronize command and host entry routes
Files:
- Modify: AGENTS.md | publish Cut-before-Plan fallback routing
- Modify: CLAUDE.md | state Cut as the planning boundary
- Modify: commands/devflow.toml | make CUT_PASS the A/B plan input
- Modify: commands/devflow-spec.toml | hand saved specs to Cut first
- Modify: commands/devflow-plan.toml | require CUT_PASS and Build handoff
- Modify: .codebuddy/rules/devflow-core/RULE.mdc | synchronize default route
- Modify: .github/copilot-instructions.md | synchronize lifecycle stages
- Modify: .github/instructions/devflow.instructions.md | preserve cross-host contract
- Modify: .github/prompts/devflow.prompt.md | order Cut before Plan
- Modify: .claude/commands/devflow-core.md | route A/B through Cut
- Modify: hooks/devflow-session-start.js | inject Cut-before-Plan reminder
Interfaces:
- Consumes: runtime Cut/Plan contract
- Produces: consistent host-visible A/B/C lifecycle guidance
Steps:
- [ ] Modify each host entry to state A=`Spec → Cut → Plan`, B=`Cut → Plan`, and C=`Cut → Build`; expect no entry to declare `Plan → Cut`.
- [ ] Modify `commands/devflow-plan.toml` to require `CUT_PASS` and an approved plan review before Build; expect only scope drift to return to Cut.
- [ ] Modify `hooks/devflow-session-start.js` to mention that A/B plans require `CUT_PASS`; expect host verification to inspect the injected context.
Acceptance: runtime entry points retain one lifecycle without a Plan-before-Cut fallback.
Verify: Run `node scripts/validate-host-adapters.js` and search route surfaces for the deprecated order.
Comments: preserve existing JavaScript comment style; no new helper boundaries.
Not doing: no manifest, installer, dependency, or hook-registration change.

---

Task: Update flow artifacts and lifecycle evidence
Files:
- Modify: skills/skill-call-diagram.md | redraw Cut-before-Plan edges
- Modify: skills/devflow-prove/references/flow-self-test.md | add Cut-before-Plan scenario assertions
- Modify: scripts/validate-devflow.js | require scenario and Cut Decision evidence
- Modify: scripts/validate-skill-triggers.js | assert A/B route sequence and plan input
- Modify: scripts/validate-host-adapters.js | assert hosts and SessionStart context preserve order
- Modify: README.md | document the new default flow and skill handoff
- Modify: docs/features/devflow-core.md | record lifecycle version and decision
- Modify: docs/features/validation-harness.md | record validation coverage and boundary
Interfaces:
- Consumes: finalized runtime handoff and host routes
- Produces: scenario, validator, documentation, and feature-ledger evidence
Steps:
- [ ] Modify `skills/skill-call-diagram.md` and `skills/devflow-prove/references/flow-self-test.md`; expect A/B Cut-before-Plan and plan consistency review to be visible.
- [ ] Modify validators to require `CUT_PASS`, Build handoff, host ordering, and the scenario text; expect a stale `Plan → Cut` route to fail static checks.
- [ ] Modify README and feature ledgers to describe Plan as a Cut-bounded construction checklist and Prove as final validation plus code review.
Acceptance: documentation, scenario text, and validators agree with runtime skills; static plan checker remains structure-only and historical plans remain compatible.
Verify: Run `node scripts/validate-devflow.js`, `node scripts/validate-skill-triggers.js`, `node scripts/validate-host-adapters.js`, and `node scripts/devflow-plan.js --self-test`.
Comments: function comments remain on existing Node helpers; no new non-obvious code path is introduced.
Not doing: no static lifecycle-state checker, architecture scoring, external host simulation, release, or commit.
