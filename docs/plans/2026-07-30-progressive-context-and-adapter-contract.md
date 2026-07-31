# Hybrid Core And Skill Lifecycle Flow Implementation

Goal: 保留 `devflow-core` 对非唯一 lifecycle 后继的判断，只让明确的 A/B/C 成功边在当前 skill 内部直接流转。
Architecture: Core 维护轻量 flow map 并选择异常、阻塞、恢复或其它非唯一后继；`depth: A | B | C` 随请求与成功 artifact 传递，Brainstorm、Spec、Cut、Plan 和 Build 仅在后继唯一时直连。
Tech Stack: Existing Markdown runtime contracts, Node.js standard library validators and installers, existing package manifests.
Source: docs/specs/2026-07-31-skill-owned-lifecycle-flow.md
Spec coverage: Requirements 1-2 map to Task 1; Requirements 3-5 map to Task 2; Requirements 6-7 map to Task 3; Requirements 8-9 map to Tasks 4-6; Requirement 10 constrains every task.
Cut Decision: CUT_PASS. Allowed scope is existing runtime entries, existing skill/reference directories, existing Node validators, installer validators, manifests, diagrams, and supporting documentation. Reuse conclusion: use current Markdown contracts, existing A/B/C depth terms, Node `fs`/`path`, installer arrays, and validation commands. Exclusions: no dependency, service, database, new host, generic workflow engine, or independent configuration format. Verification constraints: package, trigger, host, capability, target-install, user-install, full matrix, and diff checks must pass.
External Skills: none

## Global Constraints

- Core keeps a compact map of creative entry, direct A/B/C success edges, return-to-Core statuses, and independent review boundaries; it does not duplicate local skill methods.
- Direct handoff is legal only when status and `depth` uniquely determine one next skill.
- A success chain is `Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove`; B is `Brainstorm -> Cut -> Plan -> Build -> Prove`; C is `Brainstorm -> Cut -> Build -> Prove`.
- `CUT_REDUCE`, `CUT_REUSE`, `CUT_BLOCKED`, Plan scope drift, `BUILD_BLOCKED`, Proof `FAIL` or `BLOCKED`, user corrections, and PUA recovery return facts to Core.
- Preserve the user change in `.codex/devflow-prompt-probe.json`.

## Task 1: Make Core Describe And Route The Hybrid Flow

Task: Make Core describe and route the hybrid flow
Task type: Code change
Files:
- Modify: AGENTS.md | heading ## Route Interface | retain Core route rows for non-unique states and add the compact direct-success map.
- Modify: skills/devflow-core/SKILL.md | heading ## Routes | distinguish Core-selected non-unique next work from direct deterministic success edges.
- Modify: skills/devflow-core/references/core-methods.md | heading ## Method 2: Brainstorm Clarification | define the shared direct-edge test and Core-decision boundary.
- Modify: skills/devflow-core/references/skill-guide.md | heading ## Skill Chain | show Core loops only for non-unique artifacts and direct paths for unique successes.
Interfaces:
- Consumes: request/artifact `{ status, depth, source, scope }`.
- Produces: `directSuccessor` when one successor is implied, otherwise `coreDecision` with returned facts.
Current behavior: Core selects all later lifecycle owners, including already determined successful successors.
Target behavior: Core remains the router for non-unique states and exposes a concise flow map, while identified unique success edges bypass it.
Change mechanics: pseudocode: `if (directSuccessor[status]?.[depth]) return directSuccessor[status][depth]; return core.selectNext(artifactFacts)`; place the mapping in Core and leave each skill's local method detail local.
Call impact: all hosts and skills can use one Core map to distinguish allowed direct handoffs from required Core returns.
Steps:
- [ ] Modify `AGENTS.md`, `skills/devflow-core/SKILL.md`, `skills/devflow-core/references/core-methods.md`, and `skills/devflow-core/references/skill-guide.md` using exact replacement: retain Core routing for non-unique states and add an `A/B/C direct success` map.
- [ ] Run `node scripts/validate-devflow.js` and `node scripts/validate-skill-triggers.js`; expect Core routing evidence to remain for exceptional states and direct-edge evidence to exist for unique successes.
Acceptance: Core still names its routing role, but its map and contracts exclude all direct success edges listed in the Global Constraints.
Verify: Run `node scripts/validate-devflow.js && node scripts/validate-skill-triggers.js`; expect both commands to pass after hybrid-route assertions are implemented.
Comments: Markdown map and state names are self-describing; no code comments required.
Not doing: deleting Core routing, recreating Core as a detailed workflow owner, or adding another router.

## Task 2: Restore A/B/C And Direct Only Unique Success Edges

Task: Restore A/B/C and direct only unique success edges
Task type: Code change
Files:
- Modify: skills/devflow-brainstorm/SKILL.md | heading ## Entry And Stop Condition | present user-selected A/B/C after Confirmed request and directly start the selected branch.
- Modify: skills/devflow-brainstorm/references/interview-discipline.md | heading ## Fixed Summary | record the selected depth after clarification without weakening its confirmation rules.
- Modify: skills/devflow-spec/SKILL.md | heading ## Process | make an approved A-branch Spec enter Cut directly.
- Modify: skills/devflow-spec/references/spec-plan-methods.md | heading ## Method 10: Spec Document And Plan Pack | define approved A-branch Spec as a direct Cut input.
- Modify: skills/devflow-cut/SKILL.md | heading ## Handoff | send `CUT_PASS` to Plan for A/B and Build for C while returning all other Cut statuses to Core.
- Modify: skills/devflow-plan/SKILL.md | heading ## Inputs And Output | make an approved A/B Plan enter Build directly while retaining scope-drift return facts.
- Modify: skills/devflow-build/SKILL.md | heading ## Context | state that a completed Build enters Prove directly and preserve its existing blocked return contract.
Interfaces:
- Consumes: `Confirmed request` plus user-selected `{ depth: "A" | "B" | "C" }`, then approved or successful artifacts carrying the same depth.
- Produces: `Spec`, `Cut`, `Plan`, `Build`, or `Prove` as the sole direct success successor for the matching state and depth.
Current behavior: Brainstorm has no A/B/C selection and Core mediates every success artifact.
Target behavior: Brainstorm owns explicit A/B/C selection; only the approved and `CUT_PASS` edges listed in the Global Constraints bypass Core.
Change mechanics: pseudocode: `A: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove; B: Brainstorm -> Cut -> Plan -> Build -> Prove; C: Brainstorm -> Cut -> Build -> Prove`; return all statuses other than the named success state to Core.
Call impact: branch state survives from Brainstorm to Build, so each direct handoff is deterministic and no skill reinterprets user intent.
Steps:
- [ ] Modify `skills/devflow-brainstorm/SKILL.md` and `skills/devflow-brainstorm/references/interview-discipline.md` using exact replacement: add a post-confirmation A/B/C user gate and persist its selected depth.
- [ ] Modify `skills/devflow-spec/SKILL.md`, `skills/devflow-spec/references/spec-plan-methods.md`, `skills/devflow-cut/SKILL.md`, `skills/devflow-plan/SKILL.md`, and `skills/devflow-build/SKILL.md` using pseudocode: direct only approved or `CUT_PASS` artifacts with a unique next skill.
- [ ] Run `node scripts/validate-skill-triggers.js`; expect A, B, and C cases to prove user-owned selection and every defined direct success edge.
Acceptance: each listed success edge has one direct successor, while a missing depth or non-success artifact still reaches Core.
Verify: Run `node scripts/validate-skill-triggers.js`; expect all direct-edge and existing clarification scenarios to pass.
Comments: Markdown branch tables are self-describing; no code comments required.
Not doing: allowing Brainstorm to choose A/B/C, skipping Spec or Plan approval, or changing Cut result names.

## Task 3: Preserve Core Decisions For Non-Unique And Failure States

Task: Preserve Core decisions for non-unique and failure states
Task type: Code change
Files:
- Modify: skills/devflow-cut/SKILL.md | heading ## Cut Result | keep `CUT_REDUCE`, `CUT_REUSE`, and `CUT_BLOCKED` as Core-return artifacts after their existing user-stop requirements.
- Modify: skills/devflow-plan/SKILL.md | heading ## Authoring Process | retain Plan scope-drift facts for Core rather than direct Build.
- Modify: skills/devflow-build/SKILL.md | heading ## Plan Review | retain `BUILD_BLOCKED` return facts for Core.
- Modify: skills/devflow-prove/SKILL.md | heading ## Process | retain Proof `FAIL` and `BLOCKED` facts for Core while keeping fresh evidence and adversarial review.
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | heading ## Proof Before Done | document Proof's Core-return exception boundary.
- Modify: skills/devflow-pua/SKILL.md | heading ## Process | retain recovery facts and re-confirmation need for Core selection.
Interfaces:
- Consumes: `{ status, reason, depth, scope, evidence }` from Cut, Plan, Build, Prove, or PUA.
- Produces: unchanged non-success facts returned to Core for an explicit next-step decision or user-facing stop.
Current behavior: all artifacts return to Core, so direct successes are unnecessarily mediated.
Target behavior: Core receives only the non-success, non-unique, scope-change, recovery, or changed-intent artifacts it must judge.
Change mechanics: pseudocode: `if (status in { CUT_REDUCE, CUT_REUSE, CUT_BLOCKED, scopeDrift, BUILD_BLOCKED, FAIL, BLOCKED, recovery }) return Core.withFacts(status); else follow directSuccessor[depth]`.
Call impact: existing protection gates and user confirmation remain unchanged; Core retains enough facts to choose re-entry safely.
Steps:
- [ ] Modify `skills/devflow-cut/SKILL.md`, `skills/devflow-plan/SKILL.md`, and `skills/devflow-build/SKILL.md` using exact replacement: distinguish their direct success artifact from each existing Core-return status.
- [ ] Modify `skills/devflow-prove/SKILL.md`, `skills/devflow-prove/references/proof-recovery-methods.md`, and `skills/devflow-pua/SKILL.md` using pseudocode: preserve evidence, PUA threshold, and Core decision ownership for failure or recovery.
- [ ] Run `node scripts/validate-skill-triggers.js` and `node scripts/capability-eval.js --self-test`; expect Cut non-PASS, scope drift, Build block, Proof failure, and recovery cases to require Core.
Acceptance: no failure path can silently reach Build or Prove, and no direct-success route removes a required Core judgment.
Verify: Run `node scripts/validate-skill-triggers.js && node scripts/capability-eval.js --self-test`; expect hybrid exception ownership to pass.
Comments: Markdown exception tables are self-describing; no code comments required.
Not doing: treating a first isolated failure as PUA, auto-approving Cut reductions, or weakening Proof.

## Task 4: Align Host Adapters, Commands, And Flow Diagram

Task: Align host adapters, commands, and flow diagram
Task type: Code change
Files:
- Modify: CLAUDE.md | heading # DevFlow Core Runtime Prompt | retain Core's hybrid routing description and link creative flow to Brainstorm A/B/C.
- Modify: .claude/commands/devflow-core.md | heading # DevFlow Core | expose Core flow map, direct successes, and Core-return exceptions.
- Modify: .github/copilot-instructions.md | heading # DevFlow Core v2 Copilot Instructions | preserve host bootstrap and hybrid routing contract.
- Modify: .github/instructions/devflow.instructions.md | heading # DevFlow Authoring Instructions | preserve workspace loading and distinguish direct versus Core-selected transitions.
- Modify: .github/prompts/devflow.prompt.md | heading ## Lifecycle | state A/B/C direct successes and Core-return statuses.
- Modify: .codebuddy/rules/devflow-core/RULE.mdc | heading # DevFlow Core v2 | preserve provider metadata and hybrid owner paths.
- Modify: commands/devflow.toml | key prompt | replace all-Core success routing with the Core map and direct-success rules.
- Modify: commands/devflow-spec.toml | key prompt | make only approved A-branch Spec enter Cut directly.
- Modify: commands/devflow-plan.toml | key prompt | make only approved A/B Plan enter Build directly.
- Modify: hooks/devflow-session-start.js | const context | emit compact hybrid-flow startup guidance.
- Modify: skills/skill-call-diagram.md | heading ## Runtime Chain | render Core loops for exceptional states and direct A/B/C success edges.
Interfaces:
- Consumes: host prompt or command invocation plus request/artifact state.
- Produces: a consistent hybrid flow map across supported hosts and the runtime diagram.
Current behavior: all adapters and commands prescribe Core mediation for all lifecycle artifacts.
Target behavior: every supported entry describes Brainstorm-first creative intake, direct unique successes, and returned Core decisions.
Change mechanics: exact replacement: insert `directSuccessor` rows for the approved states, preserve `return Core` rows for all other states, and keep independent reviews outside lifecycle routing.
Call impact: Codex, Claude, Copilot, VS Code, CodeBuddy, command, and hook consumers receive the same lifecycle boundary.
Steps:
- [ ] Modify host Markdown, command TOML, and `hooks/devflow-session-start.js` using exact replacement: preserve compact Core routing while adding A/B/C direct-success and exception-return rules.
- [ ] Modify `skills/skill-call-diagram.md` Mermaid graph and Runtime Chain using exact replacement: draw direct A/B/C success arrows and Core loops only for non-unique artifacts.
- [ ] Run `node scripts/validate-host-adapters.js`; expect every adapter to expose a Core flow map, direct creative entry, and Proof exit.
Acceptance: no supported prompt surface describes all artifacts as direct or all artifacts as Core-mediated.
Verify: Run `node scripts/validate-host-adapters.js`; expect host capability contracts to pass with both direct and Core-return evidence.
Comments: Add a JavaScript comment only if the hook distinguishes a direct-success state from a Core-return state; Markdown and TOML need no comments.
Not doing: adding a host, changing plugin discovery, or turning independent reviews into lifecycle steps.

## Task 5: Prove The Hybrid Contract In Validators And Scenarios

Task: Prove the hybrid contract in validators and scenarios
Task type: Code change
Files:
- Modify: scripts/validate-devflow.js | function assertions after const core | require Core flow map, direct-success rules, and retained Core exception ownership.
- Modify: scripts/validate-skill-triggers.js | const scenarios | add A/B/C direct-success cases and Core-return exception cases.
- Modify: scripts/validate-host-adapters.js | const adapters | require hybrid route, owner, fallback, proof, direct-edge, and Core-return capability evidence.
- Modify: scripts/capability-eval-scenarios.json | key vague-design-route | replace all-Core negative constraints with hybrid branch-state and Core-decision evidence.
- Modify: skills/devflow-prove/references/flow-self-test.md | heading ## Scenario 1 | reject illegal Core mediation of direct successes and illegal skill handling of Core-return states.
Interfaces:
- Consumes: runtime file bodies, host contracts, scenario text, and flow-self-test assertions.
- Produces: deterministic failures for missing direct edge, missing Core decision, lost depth, or inconsistent host contract.
Current behavior: validators require every artifact to return Core and reject direct handoffs.
Target behavior: validators allow only the direct edges from Task 2 and require Core routing for Task 3 states.
Change mechanics: pseudocode: `require(directEdge[depth][success]); require(coreReturn[exception]); require(core.flowMap); reject(directEdge[exception]); reject(coreRoute[uniqueSuccess])`.
Call impact: package and capability reports catch either under-migration or over-migration of lifecycle routing.
Steps:
- [ ] Modify `scripts/validate-devflow.js`, `scripts/validate-skill-triggers.js`, and `scripts/validate-host-adapters.js` using pseudocode: assert direct success, Core-return exception, branch depth, and flow-map evidence with function comments on new helpers.
- [ ] Modify `scripts/capability-eval-scenarios.json` and `skills/devflow-prove/references/flow-self-test.md` using exact replacement: cover A/B/C, Cut non-PASS, Plan scope drift, Build block, Proof failure, PUA recovery, and changed intent.
- [ ] Run `npm test`, `npm run trigger:verify`, `npm run host:verify`, `npm run capability:verify`, and `npm run capability:eval`; expect all reports to pass and hybrid negative cases to fail in self-test coverage.
Acceptance: a required direct success routed through Core fails, and a required Core decision handled directly by a skill fails.
Verify: Run `npm test && npm run trigger:verify && npm run host:verify && npm run capability:verify && npm run capability:eval`; expect each report to pass.
Comments: New or changed validator helpers require function comments that name their protected direct or Core-return boundary.
Not doing: natural-language semantic parsing, a new JSON/YAML contract file, or model-behavior benchmarking.

## Task 6: Preserve Installed Reachability And Update Product Documentation

Task: Preserve installed reachability and update product documentation
Task type: Code change
Files:
- Modify: scripts/validate-installer.js | function assertInstalledRuntimeContract | require installed Core map plus all existing owner references and hybrid transition evidence.
- Modify: scripts/validate-user-installer.js | function assertInstalledRuntimeContract | require user runtime Core and branch owners without installing project AGENTS.md.
- Modify: docs/PRD.md | heading ### R2. Lifecycle Router | replace all-Core routing statements with the hybrid contract.
- Modify: docs/features/devflow-core.md | heading ## Version History | record direct-success exceptions to retained Core routing.
- Modify: README.md | heading Native Capabilities Integrated | describe hybrid Core routing and direct deterministic edges.
- Modify: docs/platform-setup.md | heading ## Codex | document Brainstorm A/B/C and Core-return exceptions.
Interfaces:
- Consumes: installed target/user runtime trees and public DevFlow lifecycle documentation.
- Produces: installation checks and public docs consistent with the hybrid contract.
Current behavior: installer validation and documentation require every lifecycle artifact to return Core.
Target behavior: installed trees prove Core map and owner references are reachable, and docs distinguish direct success from Core decision states.
Change mechanics: pseudocode: `for owner in installedOwners require(fileExists(owner)); require(core.flowMap); require(directSuccessEvidence); require(coreExceptionEvidence)`; replace documentation-only all-Core wording with the hybrid map.
Call impact: target and user installs preserve the current file boundary while delivering the hybrid contract.
Steps:
- [ ] Modify `scripts/validate-installer.js` and `scripts/validate-user-installer.js` using pseudocode: retain manifest, dry-run, create, check, skip, and force coverage while requiring installed hybrid-flow evidence.
- [ ] Modify `docs/PRD.md`, `docs/features/devflow-core.md`, `README.md`, and `docs/platform-setup.md` using exact replacement: document Core routing for non-unique states and direct routing for named successes.
- [ ] Run `npm run install:verify`, `npm run user:verify`, `npm run verify:all`, and `git diff --check`; expect installer checks, full matrix, and whitespace validation to pass.
Acceptance: clean target and user installs contain every required skill/reference, describe Core's hybrid role, and preserve direct-success behavior.
Verify: Run `npm run install:verify && npm run user:verify && npm run verify:all && git diff --check`; expect every command to pass.
Comments: Installer validator helpers need function comments for installed hybrid-contract checks; public Markdown needs no inline comments.
Not doing: changing installer write, dry-run, force-overwrite, or user-home semantics.
