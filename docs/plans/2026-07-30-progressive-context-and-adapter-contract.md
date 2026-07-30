# Progressive Context And Adapter Contract Implementation

Goal: 将 DevFlow-Core 的运行时上下文从多入口重复的长提示，迁移为宿主启动接口、Core 加载地图和按需 lifecycle reference 三层契约。
Architecture: 入口保留路由与 fallback；`devflow-core` 只加载共享约束和当前 route 的 owner reference；验证器检查能力可达而不是重复句子；学习卡记录可核验来源和失效边界。
Tech Stack: Markdown runtime contracts, Node.js standard library validation and installer scripts, existing package manifests.
Source: docs/specs/2026-07-30-progressive-context-and-adapter-contract.md
Spec coverage: Requirements 1-5 map to Tasks 1-4; Requirements 6-8 map to Tasks 5-7; Requirement 9 maps to Tasks 8-9; Requirement 10 constrains every task.
Cut Decision: CUT_PASS. Allowed scope is existing runtime entries, existing skill directories, existing Node validators, installer manifests, learning-card schema, and supporting documentation. Reuse conclusion: use current Markdown skills, Node `fs`/`path`, existing installer arrays, and existing validation commands. Exclusions: no dependency, service, database, new host, generic workflow engine, or lifecycle-owner change. Verification constraints: host, trigger, learning, target-install, user-install, full matrix, and diff checks must pass.
External Skills: none

## Global Constraints

- `devflow-core` remains the sole lifecycle router after every returned artifact.
- No task may remove explicit safety, user-confirmation, data-protection, Root-Cause, or proof requirements.
- New Markdown references stay inside existing `skills/devflow-*/references/` directories and must be installed wherever their owner skill runs.
- Preserve existing user changes in `.claude/settings.json` and `.codex/devflow-prompt-probe.json`.
- Keep runtime method source outside `docs/`; `docs/` records only this Spec, this Plan, and maintained product documentation.

## Task 1: Split Shared And Route-Specific Method Ownership

Task: Split shared and route-specific method ownership
Task type: Code change
Files:
- Create: skills/devflow-cut/references/cut-methods.md | new file | own Method 5-9 execution details for reuse, native capability, overbuild, root-cause, and debt decisions.
- Create: skills/devflow-spec/references/spec-plan-methods.md | new file | own Method 10-12 design, Plan Pack, minimal change, and slice details.
- Modify: skills/devflow-core/references/core-methods.md | anchor: `## Method 5: Minimal Solution Ladder` | retain Method 0-4, Method 15, shared output contracts, and script resolution; replace migrated method bodies with a route-to-owner loading map.
- Modify: skills/devflow-core/SKILL.md | anchor: `## Context Map` | require the shared core reference first and only the selected lifecycle reference afterwards.
Interfaces:
- Consumes: route: `Fast | Problem | Design-lite | Design | Build | Recovery`, selected owner skill, current project facts.
- Produces: loading map: `{ shared: string[], selected: string[] }` and existing Core route output.
Current behavior: every engineering decision requires reading one `core-methods.md` file containing Method 0 through Method 15.
Target behavior: every route reads the compact shared core source; Cut and Spec/Plan routes additionally load their owner reference before making owner-specific decisions.
Change mechanics: pseudocode: `shared = [core-methods]; selected = route in {Cut} ? [cut-methods] : route in {Spec, Plan} ? [spec-plan-methods] : []; read(shared); read(selected);` Replace Method 5-12 bodies in `core-methods.md` with concise ownership links and map each route to its selected reference while keeping only shared invariants there.
Call impact: all future Core starts consume less baseline context; selected Cut and Spec/Plan paths preserve the same behavior through explicit local references.
Steps:
- [ ] Create `skills/devflow-cut/references/cut-methods.md` and `skills/devflow-spec/references/spec-plan-methods.md` using exact replacement of the migrated Method 5-12 contracts, preserving required gate names, return artifacts, and proof rules.
- [ ] Modify `skills/devflow-core/references/core-methods.md` at `## Method 5: Minimal Solution Ladder` using exact replacement: delete migrated detailed bodies, insert owner links plus a table from route to required reference, and retain shared Method 0-4, Method 15, output contracts, and script path resolution.
- [ ] Modify `skills/devflow-core/SKILL.md` at `## Context Map` using pseudocode: record the shared source in `Methods`, then append only route-selected owner references before route-specific decisions.
- [ ] Run `node scripts/validate-devflow.js`; expect the runtime source and required-file checks to pass after references and Core contracts are synchronized.
Acceptance: Core no longer mandates reading all lifecycle methods, while Cut and Spec/Plan still have one executable, locally installed source for every moved rule.
Verify: Run `node scripts/validate-devflow.js`; expect `DevFlow validation passed` with no missing runtime method source.
Comments: Markdown owner links explain responsibility; no code comments required.
Not doing: moving lifecycle routing out of Core, creating a new top-level framework directory, or changing user-visible route names.

## Task 2: Make Cut, Spec, And Plan Load Their Local Methods

Task: Make Cut, Spec, and Plan load their local methods
Task type: Code change
Files:
- Modify: skills/devflow-cut/SKILL.md | anchor: `## Context` | load `cut-methods.md` before Required Gates and stop duplicating moved details.
- Modify: skills/devflow-spec/SKILL.md | anchor: `## Process` | load `spec-plan-methods.md` before option comparison and Spec construction.
- Modify: skills/devflow-plan/SKILL.md | anchor: `## Authoring Process` | load `spec-plan-methods.md` before converting a Cut Decision into a Plan Pack.
- Test: scripts/validate-skill-triggers.js | anchor: `const cases` | prove selected lifecycle skills expose their local reference and retain their existing trigger path.
Interfaces:
- Consumes: selected lifecycle skill, approved design or Cut Decision, local Markdown method reference.
- Produces: unchanged `CUT_PASS | CUT_REDUCE | CUT_REUSE | CUT_BLOCKED`, saved Spec, or reviewed Plan return artifact.
Current behavior: Cut, Spec, and Plan carry method details inline or depend on the full global `core-methods.md` document.
Target behavior: each skill names and loads its owner reference before applying its local workflow, while returning the same artifact to Core.
Change mechanics: pseudocode: `load(ownerReference); execute(existingSkillContract); return(existingArtifactToCore);` Replace duplicate detailed sections with short invocation and ownership text only when the full rule is now in the referenced local file.
Call impact: slash commands and direct skill invocation retain their input/output contracts; target and user installers require the new references in Task 7.
Steps:
- [ ] Modify `skills/devflow-cut/SKILL.md`, `skills/devflow-spec/SKILL.md`, and `skills/devflow-plan/SKILL.md` at their named workflow sections using exact replacement: add local-reference load actions and remove only rule text duplicated verbatim in the new owner files.
- [ ] Modify `scripts/validate-skill-triggers.js` at `const cases` using pseudocode: assert each selected lifecycle skill names its local reference and preserve existing route-to-owner checks.
- [ ] Run `node scripts/validate-skill-triggers.js`; expect every existing route scenario and the three local-reference assertions to pass.
Acceptance: a reader of any selected Cut, Spec, or Plan skill can identify its local method owner and its unchanged return artifact without rereading a global method dump.
Verify: Run `node scripts/validate-skill-triggers.js`; expect `Skill Trigger Verification Report` and no missing trigger or local-reference assertion.
Comments: Add function-level comment only if a new trigger-validation helper is introduced; Markdown requires no additional comments.
Not doing: changing Cut intensity policy, Spec approval stop, Plan approval stop, or Core-exclusive routing.

## Task 3: Isolate Build, Prove, And Recovery Method Details

Task: Isolate Build, Prove, and Recovery method details
Task type: Code change
Files:
- Create: skills/devflow-build/references/build-methods.md | new file | own Method 11-12 surgical build and implementation-slice details.
- Create: skills/devflow-prove/references/proof-recovery-methods.md | new file | own Method 13-14 proof, adversarial review, and recovery evidence details shared by Prove and PUA.
- Modify: skills/devflow-build/SKILL.md | anchor: `## Plan Review` | load `build-methods.md` after Plan Review and before implementation slices.
- Modify: skills/devflow-prove/SKILL.md | anchor: `## Process` | load `proof-recovery-methods.md` before selecting proof and adversarial review.
- Modify: skills/devflow-pua/SKILL.md | anchor: `## Process` | load `proof-recovery-methods.md` for the common recovery contract while preserving PUA methodology assets.
Interfaces:
- Consumes: confirmed Plan or Build slice, verification evidence, recovery facts, selected local reference.
- Produces: `BUILD_BLOCKED` facts, Proof judgment, or recovery facts returned to `devflow-core`.
Current behavior: Build, Prove, and PUA repeat or indirectly require detailed global methods in addition to their local workflow sections.
Target behavior: method details are loaded from Build or Proof/Recovery owner references only after the respective lifecycle skill is selected.
Change mechanics: pseudocode: `if skill == Build read(build-methods); if skill in {Prove, PUA} read(proof-recovery-methods); then replace shared Method 11-14 text with owner links and run the existing plan, proof, or recovery contract.` Leave PUA's methodology-router, methodology-library, and flavor-display assets untouched.
Call impact: Build and Prove retain existing stop outputs; PUA retains `METHOD: {flavor} / {method}` and returns recovery facts to Core.
Steps:
- [ ] Create `skills/devflow-build/references/build-methods.md` and `skills/devflow-prove/references/proof-recovery-methods.md` using exact replacement of Method 11-14 details from the shared source, with each reference naming its skill owner and return boundary.
- [ ] Modify `skills/devflow-build/SKILL.md`, `skills/devflow-prove/SKILL.md`, and `skills/devflow-pua/SKILL.md` at their named sections using pseudocode: load the local reference before local execution and remove only duplicated migrated detail.
- [ ] Run `node scripts/validate-devflow.js && node scripts/validate-skill-triggers.js`; expect Build, Proof, and Recovery contract checks to pass with the new reference links.
Acceptance: Build, Prove, and PUA load only the detail needed by their selected phase; no PUA methodology file is removed or moved.
Verify: Run `node scripts/validate-devflow.js && node scripts/validate-skill-triggers.js`; expect both commands to pass and preserve `BUILD_BLOCKED`, Proof, and PUA return contracts.
Comments: Markdown owner links explain scope; no code comments required.
Not doing: changing code-comment policy, proof severity semantics, PUA methodology selection, or user-challenge triggers.

## Task 4: Replace Shared-Host Rule Dumps With Portable Startup Interfaces

Task: Replace shared-host rule dumps with portable startup interfaces
Task type: Code change
Files:
- Modify: AGENTS.md | anchor: `## Engineering Principles` | replace repeated process prose with a compact route table, owner links, hard boundaries, STOP rules, and no-skill fallback.
- Modify: CLAUDE.md | anchor: `# DevFlow Core v2` | retain Claude-specific bootstrap and point to the shared startup contract instead of restating every lifecycle step.
- Modify: .claude/commands/devflow-core.md | anchor: `# DevFlow Core` | retain direct command loading instructions and route-to-owner behavior only.
- Modify: hooks/devflow-session-start.js | anchor: `hookSpecificOutput.additionalContext` | emit a short activation reminder that points to the startup contract rather than a full lifecycle narrative.
Interfaces:
- Consumes: user request text, host capability `skills available | skills unavailable`, project rule path.
- Produces: owner lookup action, minimal fallback route, and completion proof requirement.
Current behavior: shared host files repeat broad Brainstorm, Cut, Prove, recovery, external-skill, and lifecycle explanations.
Target behavior: every shared host file supplies only the host activation interface and an authoritative owner path; `AGENTS.md` remains executable when skills are unavailable and is no larger than 8 KiB.
Change mechanics: exact replacement: use a single compact row format `signal -> owner -> required artifact -> return boundary`; retain direct fallback rules only in `AGENTS.md`; replace repeated explanatory paragraphs in Claude command and hook payload with links and load actions.
Call impact: Codex/shared and Claude Code continue to route all existing request shapes; session-start context becomes smaller without losing its direct route to Core.
Steps:
- [ ] Modify `AGENTS.md` at `## Engineering Principles` using exact replacement: retain hard safety/proof rules, ASCII trigger families, owner paths, STOP rules, and the no-skill fallback; remove duplicated skill internals and enforce an 8 KiB UTF-8 budget.
- [ ] Modify `CLAUDE.md`, `.claude/commands/devflow-core.md`, and `hooks/devflow-session-start.js` at their named anchors using exact replacement: keep host-specific loading mechanics and replace repeated lifecycle content with route-to-owner links.
- [ ] Run `node scripts/validate-host-adapters.js`; expect Codex/shared, Claude command, and hook startup contracts to remain reachable without requiring duplicate prose.
Acceptance: `AGENTS.md` is no larger than 8 KiB and every shared-host entry identifies a route owner, a fallback/load action, and the proof exit without reproducing the whole lifecycle.
Verify: Run `node scripts/validate-host-adapters.js`; expect `Host Adapter Verification Report` with all shared-host contracts passing.
Comments: Add an inline JavaScript comment only if the hook distinguishes an unavailable-skill fallback; Markdown needs no comments.
Not doing: modifying `.claude/settings.json`, adding a host, removing project-level `AGENTS.md`, or changing hook registration.

## Task 5: Shrink Copilot, VS Code, And CodeBuddy Adapters

Task: Shrink Copilot, VS Code, and CodeBuddy adapters
Task type: Code change
Files:
- Modify: .github/copilot-instructions.md | anchor: `# DevFlow Core v2 Copilot Instructions` | reduce to Copilot capability assumptions, Core owner path, and proof exit.
- Modify: .github/instructions/devflow.instructions.md | anchor: `# DevFlow Authoring Instructions` | retain workspace-scoped instruction behavior and link to owner skills.
- Modify: .github/prompts/devflow.prompt.md | anchor: `Select route` | retain manual prompt entry behavior and compact route interface.
- Modify: .codebuddy/rules/devflow-core/RULE.mdc | anchor: `# DevFlow Core v2` | retain provider metadata and CodeBuddy-specific load/fallback behavior only.
Interfaces:
- Consumes: host-specific instruction or prompt invocation and recognized request signal.
- Produces: `devflow-core` load action, direct manual-review owner when explicitly requested, and proof exit requirement.
Current behavior: the four adapters independently repeat substantial lifecycle and recovery explanations.
Target behavior: each adapter contains a short host-specific interface and links to the shared or selected owner; the same semantic rule has one runtime owner.
Change mechanics: exact replacement: replace prose blocks with `signal -> owner -> required output` rows, preserve explicit independent-review routes, and use links for Brainstorm, Cut, Prove, PUA, and Learn details.
Call impact: Copilot, VS Code, and CodeBuddy retain all existing user-facing activation paths while reducing context and eliminating drift-prone duplicated text.
Steps:
- [ ] Modify `.github/copilot-instructions.md`, `.github/instructions/devflow.instructions.md`, `.github/prompts/devflow.prompt.md`, and `.codebuddy/rules/devflow-core/RULE.mdc` using exact replacement: preserve only host behavior, signal routing, independent manual-review entry, fallback/load action, and proof requirement.
- [ ] Run `node scripts/validate-host-adapters.js`; expect all four adapter capability contracts to pass without checking copied full-lifecycle sentences.
Acceptance: no non-shared adapter contains a complete restatement of the lifecycle, yet each can locate Core or an explicitly requested manual-review skill from its supported host surface.
Verify: Run `node scripts/validate-host-adapters.js`; expect the Copilot, VS Code instruction, VS Code prompt, and CodeBuddy entries to pass.
Comments: Frontmatter and route rows are self-describing; no code comments required.
Not doing: changing GitHub extension configuration, adding Copilot agents, or introducing a new prompt format.

## Task 6: Validate Capability Contracts Instead Of Phrase Duplication

Task: Validate capability contracts instead of phrase duplication
Task type: Code change
Files:
- Modify: scripts/validate-host-adapters.js | anchor: `const adapters` | replace per-file prose term lists with one capability contract per host.
- Modify: scripts/validate-skill-triggers.js | anchor: `const cases` | keep user-input route scenarios while moving owner-reference checks to the selected skill rather than every adapter.
- Modify: scripts/validate-devflow.js | anchor: `const agentsBody` | enforce UTF-8 byte budget, forbid full Method 0-15 mandatory loading, and verify required owner references and fallback markers.
Interfaces:
- Consumes: runtime file bodies, host capability contract `{ route, owner, fallback, proof }`, trigger scenarios.
- Produces: assertion failures naming the missing capability or owner and zero exit status for a conforming package.
Current behavior: host validation asserts many duplicated literal phrases across eight files; `AGENTS.md` is bounded by line count but not UTF-8 payload; the full method document is universally mandatory.
Target behavior: validation asserts capability reachability, host-specific fallback, unique owner links, byte budget, and preserved scenario behavior without forcing prose duplication.
Change mechanics: pseudocode: `for contract in hosts: require(contract.routeSignal); require(contract.ownerLink); require(contract.loadOrFallback); require(contract.proofExit);` Replace broad `assertTerms` arrays with this shape, compute `Buffer.byteLength(agentsBody, "utf8")`, and reject the legacy universal Method 0-15 load wording.
Call impact: package commands keep their names and output reports; future lifecycle changes update one host contract entry instead of eight copies of a sentence.
Steps:
- [ ] Modify `scripts/validate-host-adapters.js` at `const adapters` using pseudocode: define `routeSignal`, `ownerLink`, `loadOrFallback`, and `proofExit` per host, then assert each field at that host's actual entry path.
- [ ] Modify `scripts/validate-skill-triggers.js` at `const cases` using exact replacement: keep input-to-route assertions and assert local references only on the skill that owns them.
- [ ] Modify `scripts/validate-devflow.js` at `const agentsBody` using pseudocode: replace line-only sizing with `Buffer.byteLength`, require 8 KiB or less, reject universal full-method loading, and assert each required new reference is present.
- [ ] Run `node scripts/validate-host-adapters.js && node scripts/validate-skill-triggers.js && node scripts/validate-devflow.js`; expect all contract reports to pass without copied full-lifecycle phrases.
Acceptance: a removed duplicate paragraph cannot fail validation when its host interface remains reachable, but a missing route, owner link, fallback, proof exit, local reference, or oversized `AGENTS.md` fails deterministically.
Verify: Run `node scripts/validate-host-adapters.js && node scripts/validate-skill-triggers.js && node scripts/validate-devflow.js`; expect three passing reports and no legacy phrase-duplication assertion.
Comments: New or modified validator helpers require function comments that state the protected capability and failure condition; add inline comment only for intentional host capability differences.
Not doing: benchmarking model quality or real IDE loading, parsing natural language semantically, or adding a JSON/YAML contract file.

## Task 7: Ship Every New Runtime Reference Through Existing Installers

Task: Ship every new runtime reference through existing installers
Task type: Code change
Files:
- Modify: scripts/install-devflow.js | anchor: `const runtimeEntries` | include every new owner reference in target-project sync.
- Modify: scripts/install-devflow-user.js | anchor: `const userEntries` | include every reference required by user-level skills.
- Modify: scripts/validate-installer.js | anchor: `assertInstalledResponsibilitySplitContract` | assert target installation contains and reaches new references.
- Modify: scripts/validate-user-installer.js | anchor: `assertInstalledResponsibilitySplitContract` | assert user installation contains and reaches new references without project rule files.
- Modify: plugin.json | anchor: `skills` | list newly addressable runtime references only where plugin discovery needs direct exposure.
Interfaces:
- Consumes: installer entry arrays, installed target directory, installed user runtime directory, plugin skill manifest.
- Produces: copied reference files and self-contained installer verification result.
Current behavior: installer arrays only list the existing core and skill references, so newly introduced local owner references would not necessarily reach installed environments.
Target behavior: every selected skill can load its declared owner reference after target or user installation; manifest exposure remains limited to references that a host must discover directly.
Change mechanics: pseudocode: `const ownerReferences = [cutMethods, specPlanMethods, buildMethods, proofRecoveryMethods]; entries.push(...ownerReferences); assertInstalledFiles(ownerReferences);` Update plugin skills only for a real discovery requirement; do not add a second manifest format.
Call impact: `install:target`, `install:user`, `install:verify`, and `user:verify` keep their CLI contracts and gain self-containment coverage for the new files.
Steps:
- [ ] Modify `scripts/install-devflow.js` and `scripts/install-devflow-user.js` at their entry arrays using exact replacement: append the four local references required by their installed skill sets.
- [ ] Modify `scripts/validate-installer.js` and `scripts/validate-user-installer.js` at `assertInstalledResponsibilitySplitContract` using pseudocode: assert each installed skill's local reference exists and each owner link resolves in the installed tree.
- [ ] Modify `plugin.json` at `skills` using exact replacement only when an added reference is a host-discoverable runtime entry; otherwise preserve the existing manifest boundary and rely on installer arrays.
- [ ] Run `node scripts/validate-installer.js && node scripts/validate-user-installer.js`; expect both install smoke suites to pass with the newly required references present.
Acceptance: a clean target and a clean user runtime contain every local reference named by their installed skills; no project-only `AGENTS.md` enters the user installer.
Verify: Run `node scripts/validate-installer.js && node scripts/validate-user-installer.js`; expect both commands to report their installer validation passed.
Comments: New installer assertion helpers require function comments explaining the installed-runtime boundary they protect.
Not doing: changing dry-run, force-overwrite, user-home resolution, or generic merge behavior.

## Task 8: Add Evidence And Invalidation To Learning-Card Contracts

Task: Add evidence and invalidation to learning-card contracts
Task type: Code change
Files:
- Modify: skills/devflow-learn/SKILL.md | anchor: `## Card Format` | require evidence source and invalidation condition for newly created or updated cards.
- Modify: scripts/validate-learning-loop.js | anchor: `parseLearningCards` | require the two fields on the scenario-matched card and verify unmatched cards are not selected.
- Modify: scripts/validate-devflow.js | anchor: `const learningIndex` | require the two fields for every linked learning card.
- Modify: .copilot/LEARNING_INDEX.md | anchor: `# Learning Index` | document that the index selects cards by trigger and scope while evidence and invalidation remain in the card body.
Interfaces:
- Consumes: learning signal, index table row `{ card, trigger, scope, confidence }`, selected card body.
- Produces: learning card with `Trigger`, `Lesson`, `Next action`, `Scope`, `Related`, `Evidence`, and `Invalidation` fields.
Current behavior: learning cards have no consistent provenance or expiry boundary; validation checks only the original five fields.
Target behavior: only matched cards are read, and each active card identifies the evidence that supports it plus the concrete condition that should retire or rewrite it.
Change mechanics: pseudocode: `requiredFields = [...existingFields, "- Evidence:", "- Invalidation:"]; assert(card.includes(field));` Keep matching keyed by index trigger and scope; do not add card-body scanning before selection.
Call impact: existing recall remains selective and non-blocking; future `devflow-learn` writes contain two additional short fields.
Steps:
- [ ] Modify `skills/devflow-learn/SKILL.md` at `## Card Format` using exact replacement: define concise `Evidence` and `Invalidation` semantics and require them only for qualifying cards.
- [ ] Modify `scripts/validate-learning-loop.js` at `parseLearningCards` and `scripts/validate-devflow.js` at `const learningIndex` using pseudocode: reject linked cards missing either field and retain trigger/scope-first selection.
- [ ] Modify `.copilot/LEARNING_INDEX.md` at `# Learning Index` using exact replacement: state that evidence and invalidation live in selected cards, not in always-loaded index rows.
- [ ] Run `node scripts/validate-learning-loop.js && node scripts/validate-devflow.js`; expect learning schema checks and progressive recall scenarios to pass.
Acceptance: every linked learning card has evidence and an invalidation condition, while a task with no matching index row does not load any card body.
Verify: Run `node scripts/validate-learning-loop.js && node scripts/validate-devflow.js`; expect learning-loop validation and DevFlow validation to pass.
Comments: New validation helpers require function comments explaining why card-body fields are checked only after index selection.
Not doing: storing chat transcripts, automatic summaries, business facts, or new memory infrastructure.

## Task 9: Migrate Existing Learning Cards And Runtime Documentation

Task: Migrate existing learning cards and runtime documentation
Task type: Documentation-only
Files:
- Modify: .copilot/cards/agents-runtime-prompt-boundary.md | section `# AGENTS Runtime Prompt Boundary` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/devflow-runtime-references.md | section `# DevFlow Runtime References` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/skill-description-trigger-surface.md | section `# Skill Description Trigger Surface` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/skill-sync-after-update.md | section `# Skill Sync After Update` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/global-agents-sync-preservation.md | section `# Global AGENTS Sync Preservation` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/rule-doc-merge-sync.md | section `# Rule Documentation Merge Sync` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/reference-project-absorption-proof.md | section `# Reference Project Absorption Proof` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/problem-reports-need-triage.md | section `# Problem Reports Need Triage` | add concrete source evidence and invalidation condition.
- Modify: .copilot/cards/pua-same-target-trigger.md | section `# PUA Same-Target Trigger` | add concrete source evidence and invalidation condition.
- Modify: README.md | section `Native Capabilities Integrated` | explain the startup-interface and selected-reference loading boundary.
- Modify: docs/platform-setup.md | section `## Codex` | document minimal fallback for hosts without automatic skill loading.
- Modify: skills/devflow-core/references/project-structure.md | section `## Public Entry Points` | document owner references as installed runtime artifacts.
- Modify: docs/features/devflow-core.md | section `## Version History` | record this context-contract change and its lasting constraints.
Interfaces:
- Consumes: documentation-only
- Produces: documentation-only
Steps:
- [ ] Modify all listed `.copilot/cards/*.md` using exact replacement: append `Evidence` naming the checked runtime source or validation command and `Invalidation` naming the changed contract or failed verification that requires review.
- [ ] Modify `README.md`, `docs/platform-setup.md`, `skills/devflow-core/references/project-structure.md`, and `docs/features/devflow-core.md` using exact replacement: describe startup interfaces, selected local references, installer reachability, and the decision not to duplicate runtime methods in host adapters.
- [ ] Run `node scripts/validate-learning-loop.js && node scripts/validate-devflow.js`; expect card schema and documentation-linked runtime checks to pass.
Acceptance: all pre-existing cards gain evidence and invalidation without growing the index into a memory dump; public documentation accurately explains the newly installed three-layer contract.
Verify: Run `node scripts/validate-learning-loop.js && node scripts/validate-devflow.js`; expect both commands to pass and report no missing card fields.
Comments: none - documentation-only change.
Not doing: converting cards to project knowledge, adding a new documentation hierarchy, or recording unrelated product history.
