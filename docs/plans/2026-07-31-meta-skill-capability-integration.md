# Meta-Skill Capability Integration Plan

Goal: 在 Core 明确 DevFlow 是流程元技能、专项 skill 可节点内执行且回到原 owner；仅修正现有 Cut/Plan/Build 交接中的 guidance-only 限制。
Architecture: `AGENTS.md` 保持短启动声明，Core skill 指向共享方法，`core-methods.md` 是唯一完整能力接入契约。Cut、Plan、Build 和 Plan command 只传递该契约需要的角色、预期证据和返回事实。
Tech Stack: 现有 Markdown runtime contracts、TOML command prompt、Node.js package validators；不新增依赖或运行时组件。
Source: `docs/specs/2026-07-31-meta-skill-capability-integration.md`
Spec coverage: Requirements 1-2 map to Task 1; Requirements 3-4 map to Task 2; Requirements 5-6 constrain both tasks and their verification.
Cut Decision: `CUT_PASS`; reuse the existing Core loading map and `External Skills` handoff field. Allowed scope is exactly the seven runtime files below. Exclude other lifecycle skills, diagram, scenario, validator, installer, manifest, dependency, configuration, and generic dispatcher work. Validate existing package behavior without adding a new checker.
External Skills: none

## Global Constraints

- Keep A/B/C direct-success edges, Core-return exceptions, approvals, Cut reuse, and Prove semantics unchanged.
- A specialist may perform bounded work, but no specialist selects lifecycle owner/depth, approves an artifact, expands scope, or announces final status.
- `core-methods.md` owns detailed semantics; local skills record only the existing handoff fields required by their owner.
- Preserve unrelated user modifications in all target files.

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `AGENTS.md` / Start step 5 | Modify | concise startup capability statement | portable entry currently calls specialist skill quality guidance | detailed protocol |
| `skills/devflow-core/SKILL.md` / Context Map and Capability Dispatch | Modify | define Core as route owner with optional specialist engagement | Core owns routing and discovery | local execution mechanics |
| `skills/devflow-core/references/core-methods.md` / Method 1 Context Map | Modify | define canonical capability-call return record and limits | shared Core method reaches selected owners | a dispatcher or live-host guarantee |
| `skills/devflow-cut/SKILL.md` / Minimal Solution Ladder | Modify | remove guidance-only specialist role while preserving reuse/scope authority | Cut already owns `External Skills` and `CUT_REUSE` | delegated `CUT_PASS` |
| `skills/devflow-plan/SKILL.md` / Required Plan Header | Modify | preserve specialist role and returned evidence in the Plan Pack | Plan owns Cut-bounded handoff | broader Plan scope |
| `commands/devflow-plan.toml` / External Skills | Modify | mirror Plan Pack wording in the command entry | command exposes the same Plan contract | second semantics source |
| `skills/devflow-build/SKILL.md` / Plan Review | Modify | receive specialist result, non-applicability, or failure facts before Build continues | Build owns execution and `BUILD_BLOCKED` | delegated completion |

## Task 1: Declare the shared meta-skill capability contract

Task: Replace guidance-only discovery wording with one Core-owned declaration that separates lifecycle control from specialist execution.
Task type: Code change
Files:
- Modify: AGENTS.md | heading Start step 5 | state matched specialist skill may perform bounded work while DevFlow retains route ownership.
- Modify: skills/devflow-core/SKILL.md | heading Context Map | record applicable specialist capability without delegating lifecycle selection.
- Modify: skills/devflow-core/references/core-methods.md | heading Method 1 Context Map | define owner, role, expected evidence, and returned facts.
Interfaces:
- Consumes: available matching specialist skill, current DevFlow owner, approved task scope, and existing lifecycle state.
- Produces: bounded-work record with owner, role, expected evidence, and result/not-applicable/failure facts for the same owner.
Current behavior: AGENTS and Core methods describe external skills as quality guidance; no shared record describes how an execution result returns to the current owner.
Target behavior: Core declares DevFlow as lifecycle meta-skill and records specialist results as input to the same owner’s existing artifact and gate.
Change mechanics:
```text
Owner: current DevFlow node
Role: bounded specialist work
Expected evidence: result needed by that node
Return: result / not-applicable / failure facts

The current owner evaluates the return using its existing gate.
```
Call impact: Every selected owner inherits one shared rule from Core; startup prompt remains concise and no lifecycle state changes.
Steps:
- [ ] Modify AGENTS.md / Start step 5 with exact replacement: change “guides quality” to “may perform bounded specialist work; DevFlow retains route and node ownership”.
- [ ] Modify skills/devflow-core/SKILL.md / Context Map and Capability Dispatch with exact replacement: record matched specialist role and return facts without selecting a new lifecycle owner.
- [ ] Modify skills/devflow-core/references/core-methods.md / Method 1 with exact replacement: insert the four-field capability record and state that results cannot alter depth, approval, direct-success, or Core-return rules.
- [ ] Run `npm test`; expected result: `DevFlow validation passed` with existing hybrid lifecycle assertions intact.
Acceptance: One shared runtime source clearly distinguishes owner control from specialist execution and defines result/failure return facts without new infrastructure.
Verify: Run `npm test`; expected result: aggregate runtime validation passes.
Comments: Markdown field names communicate this rule; no validator helper or code comment is added.
Not doing: No registry, dispatcher, host loader, new runtime file, or lifecycle-edge modification.

Prewalk:

Execution Trace:
- Read: AGENTS.md / Start step 5 → matching external skill is limited to “guides quality”.
- Read: skills/devflow-core/SKILL.md / Context Map and skills/devflow-core/references/core-methods.md / Method 1 → Core discovers matching guidance but has no execution-return record.
- Traced: AGENTS.md startup rule → devflow-core → shared Core methods → selected lifecycle owner.
- Ran: `rtk npm test` → `DevFlow validation passed` before this Plan executes.
- Verified: `node scripts/devflow-spec.js docs/specs/2026-07-31-meta-skill-capability-integration.md` → revised minimal Spec passed.

Current Handoff Facts:
- Target anchors: AGENTS.md / Start step 5; skills/devflow-core/SKILL.md / Context Map and Capability Dispatch; skills/devflow-core/references/core-methods.md / Method 1.
- Nearby convention: AGENTS stays a startup interface and `core-methods.md` owns shared runtime semantics.
- Direct path: startup entry → Core discovery → selected owner’s existing artifact/gate.
- Current constraints: only deterministic A/B/C successes bypass Core; no static text proves live-host skill loading.
- Planned touch set: the three Task 1 runtime files and no new reference file.
- Risks / stop conditions: a need for host-specific loading behavior, a new configuration surface, or a new route returns scope-drift facts to Core.

Remaining Structured Worklist:
- [ ] replace AGENTS.md and skills/devflow-core/SKILL.md guidance-only text with bounded specialist-work plus unchanged owner language.
  Anchors: AGENTS.md / Start step 5; skills/devflow-core/SKILL.md / Context Map.
  Verify: `rg -n -i "guides quality|bounded specialist work" AGENTS.md skills/devflow-core/SKILL.md`; expected result: bounded-work wording exists and route ownership remains explicit.
  Done when: startup and Core both identify DevFlow as owner and specialist skill as bounded capability.
- [ ] replace skills/devflow-core/references/core-methods.md Method 1 text with the four-field return record and immutable lifecycle boundaries.
  Anchors: skills/devflow-core/references/core-methods.md / Method 1 Context Map.
  Verify: `npm test`; expected result: package validation passes with all existing hybrid-flow requirements.
  Done when: one shared section names owner, role, expected evidence, and result/not-applicable/failure return facts.

## Task 2: Relax only existing specialist handoff restrictions

Task: Upgrade Cut, Plan, Build and Plan command `External Skills` wording from guidance-only to role/evidence/return facts without changing their lifecycle authority.
Task type: Code change
Files:
- Modify: skills/devflow-cut/SKILL.md | heading Minimal Solution Ladder | keep specialist reuse logic but record executable bounded role and scope-limited return.
- Modify: skills/devflow-plan/SKILL.md | heading Required Plan Header | carry specialist role, expected evidence, and returned facts into the approved Plan Pack.
- Modify: commands/devflow-plan.toml | heading External Skills | mirror the Plan header contract.
- Modify: skills/devflow-build/SKILL.md | heading Plan Review | require returned specialist evidence, inapplicability, or failure facts before Build continues or blocks.
Interfaces:
- Consumes: Core capability record, Cut Decision `External Skills`, approved Plan Pack, and current owner scope.
- Produces: same Cut Decision/Plan/Build artifact plus specialist role, expected evidence, and result/not-applicable/failure facts.
Current behavior: Cut, Plan, Build and Plan command fix the specialist role to `guides execution` or quality guidance; Build records loading or inapplicability but not a returned work result.
Target behavior: These four local contracts accept bounded specialist execution and pass back result facts while Cut still owns reuse/scope, Plan still owns handoff, and Build still owns execution/blocking.
Change mechanics:
```text
Exact replacement: `External Skills: skill name; role; expected evidence; return facts`

Cut/Plan/Build keep their existing decision and stop rules.
Specialist output never widens the approved scope.
```
Call impact: A/B/C chain and Core-return states remain unchanged; only data carried within existing owner artifacts becomes result-bearing.
Steps:
- [ ] Modify skills/devflow-cut/SKILL.md / Minimal Solution Ladder, Required Gates, and Handoff with exact replacement: retain `CUT_REUSE` and Cut priority while changing `External Skills` from guidance-only to role/expected-evidence/return-facts.
- [ ] Modify skills/devflow-plan/SKILL.md and commands/devflow-plan.toml / External Skills with exact replacement: inherit the expanded record unchanged and keep scope-drift behavior.
- [ ] Modify skills/devflow-build/SKILL.md / Plan Review, Plan Pack, and Stop Protocol with exact replacement: record specialist result, not-applicable, or failure facts; use existing `BUILD_BLOCKED` only when that fact blocks approved work.
- [ ] Run `npm test`, `npm run trigger:verify`, and `npm run host:verify`; expected result: all existing validators pass and direct-success/Core-return wording remains present.
- [ ] Run `git diff --check`; expected result: no whitespace error.
Acceptance: All currently restrictive handoff surfaces allow real specialist work and retain result facts, yet no specialist receives Cut, Plan, Build, or Proof authority.
Verify: Run `npm test && npm run trigger:verify && npm run host:verify`; expected result: all three commands return PASS reports.
Comments: Existing named states and explicit field labels are sufficient; no new code comments are needed.
Not doing: No edits to other lifecycle skills, diagram, capability manifest, validators, installer, manifest, or Plan parser.

Prewalk:

Execution Trace:
- Read: skills/devflow-cut/SKILL.md / Minimal Solution Ladder, Required Gates, Handoff → `External Skills` fixes the role to “guides execution” and preserves Cut scope.
- Read: skills/devflow-plan/SKILL.md / Required Plan Header and commands/devflow-plan.toml / External Skills → Plan transmits only guidance-quality requirements.
- Read: skills/devflow-build/SKILL.md / Plan Review, Plan Pack, Stop Protocol → Build loads declared skills or records inapplicability, but does not require a specialist result record.
- Traced: Core Skill Discovery → Cut Decision `External Skills` → A/B Plan Pack or C Build → Build evidence and existing Proof.
- Ran: `rg -n -i "guidance skill|guides execution"` → restrictive wording exists only in the four files targeted by this task after Core changes are separated.

Current Handoff Facts:
- Target anchors: skills/devflow-cut/SKILL.md / Minimal Solution Ladder and Required Gates; skills/devflow-plan/SKILL.md / Required Plan Header; commands/devflow-plan.toml / External Skills; skills/devflow-build/SKILL.md / Plan Review.
- Nearby convention: existing `External Skills` field already crosses Cut, Plan, and Build, so no parser or new field is required.
- Direct path: Core capability discovery → Cut record → Plan header or Build → owner’s existing result and Proof route.
- Current constraints: Cut scope outranks external recommendation; `CUT_REUSE` is no-code only; Build returns `BUILD_BLOCKED`; Prove independently verifies claims.
- Planned touch set: exactly the four local runtime files named above.
- Risks / stop conditions: a needed extra field, a plan parser update, a diagram route, or another lifecycle owner update returns scope-drift facts to Core.

Remaining Structured Worklist:
- [ ] replace skills/devflow-cut/SKILL.md External Skills wording with role, expected evidence, return facts, unchanged scope priority, and existing CUT_REUSE rule.
  Anchors: skills/devflow-cut/SKILL.md / Minimal Solution Ladder, Required Gates, Handoff.
  Verify: `rg -n -i "guides execution|External Skills" skills/devflow-cut/SKILL.md`; expected result: expanded record appears and CUT_REUSE no-code rule remains.
  Done when: Cut can record executed specialist work without delegating scope or `CUT_PASS`.
- [ ] replace skills/devflow-plan/SKILL.md and commands/devflow-plan.toml External Skills wording with the Core record fields and unchanged inheritance/scope-drift behavior.
  Anchors: skills/devflow-plan/SKILL.md / Required Plan Header; commands/devflow-plan.toml / External Skills.
  Verify: `rg -n -i "guides execution|External Skills" skills/devflow-plan/SKILL.md commands/devflow-plan.toml`; expected result: no fixed guidance-only role remains.
  Done when: Plan Pack and command use the same role/evidence/return record without changing parser fields.
- [ ] replace skills/devflow-build/SKILL.md Plan Review and Stop Protocol wording with result/not-applicable/failure fact handling under existing BUILD_BLOCKED rules.
  Anchors: skills/devflow-build/SKILL.md / Plan Review, Plan Pack, Stop Protocol.
  Verify: `npm test && npm run trigger:verify && npm run host:verify`; expected result: validators pass and existing lifecycle routes remain discoverable.
  Done when: Build does not treat loading as completion and records a blocker only under existing owner rules.
