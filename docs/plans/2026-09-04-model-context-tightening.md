# Strong-Model Context And Routing Tightening

Goal: 让强模型在低风险任务中直接理解并推进，在高风险或真正不确定的任务中保留 Brainstorm 与用户确认，同时降低无关 skill 上下文和执行前重复读取。
Architecture: 保留现有 Core、Brainstorm、Cut、Plan、Build、Prove 生命周期和五个路由名；新增风险自适应决策规则作为 Core 的路由前置判断，不新增引擎、状态服务、依赖或模型专用 persona。
Tech Stack: Markdown runtime contracts、Node.js 标准库校验器、现有 npm 验证矩阵、现有 plugin/DSH asset mirror。
Source: Confirmed request and CUT_PASS from the current task conversation.
Spec coverage: design-only; confirmed requirements map to Tasks 1-4.
Cut Decision: CUT_PASS; allowed scope is route priority/risk policy, Brainstorm activation depth, conditional Prove references, local-anchor execution wording, direct command/host contract synchronization, and packaged mirror propagation. Reuse existing skills, commands, validators, scenarios, and sync paths. Exclude live model trace evaluation, DSH bootstrap changes, plugin architecture changes, new dependencies, new routes, and host-level engines.
External Skills: none
Execution mode: sequential

## Global Constraints

- Keep the five existing route names: Problem, Fast, Design-lite, Design, and Build/Recovery handling as currently defined.
- Low-risk autonomy may skip Brainstorm only when impact, risk, uncertainty, reversibility, and proof are all small and the requested behavior is clear; it must still run Cut and Prove.
- Medium/high-risk, ambiguous, cross-module, externally visible, irreversible, security-sensitive, data-loss-sensitive, or contract-changing work enters Brainstorm and keeps the user confirmation gate.
- Approved scope remains a direct Build exception. Explicit independent reviews remain outside lifecycle routing.
- Prove must always run the narrowest sufficient proof and adversarial review for development work; conditional loading only removes unrelated framework self-test context.
- Plan/Build may read current task anchors and directly changed neighbors before editing; they must not restart broad repository discovery or silently redesign the approved scope.
- Root `skills/` remains authoritative. Plugin and DSH skill mirrors must be byte-identical after synchronization.
- Do not change `.codex/devflow-prompt-probe.json`, which contains unrelated user worktree changes.

## File Structure

| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| `AGENTS.md` route table and hard boundaries | Modify | Always-visible route precedence and risk-adaptive Brainstorm rule | Portable startup contract is visible to every host | Detailed lifecycle mechanics or model-specific behavior |
| `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/devflow.instructions.md`, `.claude/commands/devflow-core.md`, `.codebuddy/rules/devflow-core/RULE.mdc` | Modify | Thin host statements aligned with the Core risk policy | Host adapters are current prompt surfaces and must not drift | Duplicated lifecycle internals |
| `skills/devflow-core/SKILL.md`, `skills/devflow-core/references/core-methods.md` | Modify | Route precedence, risk gate, and autonomy boundary | Core owns shared selection and non-unique returns | Implementation mechanics owned by lifecycle skills |
| `skills/devflow-brainstorm/SKILL.md`, `skills/devflow-brainstorm/references/interview-discipline.md` | Modify | Brainstorm activation conditions and adaptive clarification depth | Brainstorm owns clarification when Core sends it | Core route selection or solution design |
| `skills/devflow-prove/SKILL.md`, `skills/devflow-prove/references/proof-recovery-methods.md`, `commands/devflow-prove.toml` | Modify | Conditional framework-reference loading without weakening proof | Prove owns proof selection and completion boundary | General routing or model benchmarks |
| `skills/devflow-plan/SKILL.md`, `skills/devflow-plan/references/plan-methods.md`, `skills/devflow-build/SKILL.md` | Modify | Replace absolute zero-view wording with bounded local-anchor reread | Plan/Build own handoff and execution behavior | Broad repository re-discovery or scope changes |
| `commands/devflow.toml`, `skills/skill-call-diagram.md` | Modify | Generic command and route diagram contract | Non-native command hosts need the same route semantics | Host-specific lifecycle internals |
| `scripts/validate-devflow.js`, `scripts/validate-host-adapters.js`, `scripts/validate-skill-triggers.js`, `scripts/validate-route-consistency.js`, `scripts/capability-eval-scenarios.json`, `skills/devflow-prove/references/flow-self-test.md` | Modify | Validate new risk routing and local-anchor behavior | Existing static harness must prove the changed contract | Live model-quality benchmarking |
| `plugins/devflow/skills/devflow-*`, `dsh/plugins/dsh-devflow/assets/skills/devflow-*` | Modify | Propagate authoritative skill changes to packaged mirrors | Existing distribution contract requires parity | New packaging or synchronization architecture |
| `docs/features/devflow-core.md` | Modify | Record accepted runtime change and evidence boundary | Existing runtime feature ledger owns lifecycle history | Implementation source or live model benchmark |

## Task 1: Establish risk-adaptive Core routing

Task: Establish risk-adaptive Core routing

Task type: Code change

Files:
- Modify: AGENTS.md | `Route Interface` | portable route precedence and risk gate
- Modify: skills/devflow-core/SKILL.md | `Routes` | shared Core decision contract
- Modify: skills/devflow-core/references/core-methods.md | `Method 3` | risk classification and autonomy rules
- Modify: commands/devflow.toml | `main prompt` | generic host route instructions
- Modify: skills/skill-call-diagram.md | `lifecycle diagram` | visible route documentation

Interfaces:
- Consumes: user request, confirmed/approved scope if present, project facts, impact/risk/uncertainty/reversibility/proof observations
- Produces: one route decision among Problem, Fast, Design-lite, Design, Build, or Recovery plus `Brainstorm required: yes/no` and the existing downstream artifact contract

Current behavior: all unapproved creative work is described as entering Brainstorm; `commands/devflow.toml` separately describes Fast and Design-lite exceptions, creating precedence ambiguity for clear low-risk behavior changes.
Target behavior: Core evaluates explicit review/recovery and inquiry exceptions first, then approved scope, then risk. Clear low-risk reversible work with quick proof can enter Cut/Build without Brainstorm; ambiguous or materially risky work enters Brainstorm and retains A/B/C; the existing route names and return edges remain unchanged.
Change mechanics: exact replacement: add a compact precedence list and decision table; define low-risk criteria as all of `clear goal`, `existing local behavior`, `one plausible path`, `local impact`, `reversible`, `no security/data-loss/permission/contract risk`, and `quick proof`; define any missing criterion or high-impact property as Brainstorm/controlled. Update all route statements to use the same order and prohibit a route choice based on keywords alone.
Call impact: every host and command that delegates to Core receives the same risk policy; low-risk requests bypass only Brainstorm, never Cut or Prove; validators and scenarios must change from universal creative-work Brainstorm claims to risk-qualified claims.

Steps:
- [ ] Modify AGENTS.md, skills/devflow-core/SKILL.md, and skills/devflow-core/references/core-methods.md using exact replacement rules to add route precedence and the six-factor low-risk gate; retain existing A/B/C direct-success and exception-return wording.
- [ ] Modify commands/devflow.toml and skills/skill-call-diagram.md using exact replacement rules so generic command text and diagram state that risk determines Brainstorm entry, while approved work, pure inquiry, and explicit reviews retain their exceptions.
- [ ] Modify the five thin host adapters using exact replacement rules to reference risk-adaptive Core behavior without copying the decision table; keep their owner/load/fallback/proof responsibilities only.
- [ ] Run `npm run trigger:verify`, `npm run host:verify`, and `npm run route:verify`; expect route surfaces to agree and old universal-Brainstorm assertions to be replaced by risk-qualified assertions.

Acceptance: the same precedence and low-risk criteria are visible in `AGENTS.md`, Core, generic command, diagram, and host adapter contracts; no new route or lifecycle edge exists.
Verify: run `npm run trigger:verify`, `npm run host:verify`, and `npm run route:verify`; expected result is exit 0 with PASS reports and scenarios for both low-risk direct entry and high-risk Brainstorm entry.
Comments: document why low-risk autonomy still requires Cut and Prove; no comments needed for thin adapter wording.
Not doing: no new `Autopilot` route, no automatic implementation without Cut/Prove, no live model benchmark.

Prewalk:

Execution Trace:
- Read: `AGENTS.md:L17-L40` and `skills/devflow-core/SKILL.md:Routes` → universal creative-work Brainstorm wording coexists with approved-change and Design-lite exceptions.
- Traced: `commands/devflow.toml`, host adapters, `scripts/validate-host-adapters.js`, and `scripts/validate-skill-triggers.js` → route wording is repeated across command and host verification surfaces.
- Ran: `npm run verify:all` → existing static contract matrix passed before this change.
- Edited: none yet → route contract change is pending.
- Verified: current route/host/trigger checks → they encode the old universal-Brainstorm assumption and need targeted updates.

Current Handoff Facts:
- Target anchors: `AGENTS.md` route table; Core `Routes`/`Capability Dispatch`; `commands/devflow.toml`; host adapter route paragraphs; route/trigger/host validator cases.
- Nearby convention: thin hosts point to AGENTS/Core; `validate-route-consistency.js` checks shared success/return edges instead of duplicating lifecycle internals.
- Direct path: host entry -> Core -> risk gate -> Brainstorm or Cut/Build -> Prove.
- Current constraints: retain five route names, A/B/C success edges, Core return ownership, explicit review independence, and portable no-skill fallback.
- Planned touch set: route contract surfaces plus their static validator/scenario evidence.
- Risks / stop conditions: if a host cannot express risk policy without duplicated lifecycle prose, keep only a Core reference and return scope-drift facts rather than expanding the adapter.
- Read-basis: AGENTS.md, Core route files, command prompt, host adapters, and route validators were inspected for the current contract.
- Live anchors: AGENTS.md `Route Interface`; skills/devflow-core/SKILL.md `Routes`; commands/devflow.toml `main prompt`.

Remaining Structured Worklist:
- [ ] modify AGENTS.md and skills/devflow-core/SKILL.md, then check the risk-precedence contract across all route surfaces.
  Anchors: `AGENTS.md` Route Interface; `skills/devflow-core/SKILL.md` Routes; `commands/devflow.toml` route paragraphs.
  Verify: `npm run trigger:verify && npm run host:verify && npm run route:verify`.
  Done when: risk-qualified low-risk and high-risk route scenarios pass with all direct/return edges intact.

## Task 2: Make Brainstorm clarification adaptive

Task: Make Brainstorm clarification adaptive

Task type: Code change

Files:
- Modify: skills/devflow-brainstorm/SKILL.md | `Clarification Depth` | conditional clarification behavior
- Modify: skills/devflow-brainstorm/references/interview-discipline.md | `Clarification Loop` | matching reference contract
- Modify: scripts/validate-devflow.js | `Brainstorm contract assertions` | static protection for new boundary
- Modify: scripts/validate-skill-triggers.js | `creative and low-risk scenario evidence` | activation coverage
- Modify: skills/devflow-prove/references/flow-self-test.md | `Scenario 1` | executable scenario contract

Interfaces:
- Consumes: Core-selected Brainstorm request with risk classification and minimum relevant facts
- Produces: either a compact `Confirmed request` for a clear medium/high-risk request followed by A/B/C, or clarification questions only for decision-impact gaps; it never handles a request Core did not send

Current behavior: Brainstorm is mandatory for every creative request, defaults to deep multi-angle exploration, and has no fast lane even when no decision-impact gap exists.
Target behavior: Brainstorm remains controlled for ambiguous/material-risk work but supports `compact` clarification when Core has already established clear goal/scope/acceptance; it asks no question when no decision-impact gap remains, runs only risk-relevant angles, and preserves full deep exploration for ambiguous/high-risk work.
Change mechanics: exact replacement: replace universal MUST wording with Core-selected entry conditions; define `compact` as echo-back plus risk/edge/acceptance check and fixed summary, `standard` as fitting angles, and `deep` as full checklist; keep the confirmation and user-selected A/B/C gate for every request that actually enters Brainstorm. Do not let Brainstorm choose Core route or depth.
Call impact: low-risk requests no longer activate Brainstorm; requests that do activate it have fewer unnecessary turns but retain explicit confirmation and branch selection; descriptions and static assertions must reflect conditional activation.

Steps:
- [ ] Modify skills/devflow-brainstorm/SKILL.md using exact replacement rules to state Core-selected risk entry, compact/standard/deep clarification, and “no question when no decision-impact gap” while retaining understanding revision and A/B/C stop behavior.
- [ ] Modify skills/devflow-brainstorm/references/interview-discipline.md using exact replacement rules with the same loop and remove “no fast lane” language; ensure compact mode still records facts, risks, acceptance, and open questions.
- [ ] Modify scripts/validate-devflow.js and self-test scenarios using exact replacement rules so vague/high-risk requests still require Brainstorm/A-B-C, while clear low-risk existing-feature changes use the direct Cut path.
- [ ] Run `npm test` and `npm run trigger:verify`; expect frontmatter, boundaries, triggers, and scenario evidence to pass.

Acceptance: Brainstorm no longer claims universal activation or mandatory deep analysis, but any request entering Brainstorm still produces the fixed summary, respects correction restart, and waits for explicit A/B/C selection.
Verify: run `npm test` and `npm run trigger:verify`; expected result is `DevFlow validation passed`, `Skill Trigger Verification Report`, and PASS cases for risk-qualified Brainstorm entry and low-risk bypass.
Comments: keep a short comment or rule explaining that compact mode is analysis compression, not permission to skip confirmation.
Not doing: no removal of Brainstorm for ambiguous/high-risk work; no automatic A/B/C choice; no change to Spec/Cut/Plan/Build ownership.

Prewalk:

Execution Trace:
- Read: `skills/devflow-brainstorm/SKILL.md:L26-L41` and `references/interview-discipline.md:L20-L32` → deep is default and no fast lane is explicitly enforced.
- Traced: `scripts/validate-devflow.js` Brainstorm assertions and `flow-self-test.md` Scenarios 1/2 → static harness assumes vague feature requests enter Brainstorm but has a small-change scenario available for direct behavior.
- Ran: `npm test` → current Brainstorm contract validation passed before changes.
- Edited: none yet → adaptive clarification is pending.
- Verified: current trigger cases → they cover vague/high-risk and approved paths but do not assert a risk-qualified low-risk bypass.

Current Handoff Facts:
- Target anchors: Brainstorm frontmatter, Entry/Depth/Process/A-B/C sections, interview reference depth table, validator assertion functions, Scenarios 1 and 2.
- Nearby convention: fixed output contracts and user gates are preserved even when route selection changes; Core remains the sole non-unique router.
- Direct path: Core risk gate -> optional Brainstorm -> Confirmed request -> user-selected A/B/C -> named direct success edge.
- Current constraints: no silent user-intent inference, no implementation design in Brainstorm, no branch before explicit selection when Brainstorm is active.
- Planned touch set: two Brainstorm files, validator/scenario evidence, and no downstream lifecycle implementation files.
- Risks / stop conditions: if compact mode starts deciding technical approach or suppresses a real decision-impact question, return to Core with a boundary failure rather than weakening the gate further.
- Read-basis: Brainstorm skill, interview reference, trigger assertions, and Scenarios 1/2 were inspected for current activation and clarification behavior.
- Live anchors: skills/devflow-brainstorm/SKILL.md `Clarification Depth`; skills/devflow-brainstorm/references/interview-discipline.md `Clarification Loop`.

Remaining Structured Worklist:
- [ ] modify skills/devflow-brainstorm/SKILL.md adaptive modes and check static scenario/trigger assertions.
  Anchors: `skills/devflow-brainstorm/SKILL.md` `Clarification Depth`; `skills/devflow-brainstorm/references/interview-discipline.md` `Clarification Loop`.
  Verify: `npm test && npm run trigger:verify`.
  Done when: high-risk Brainstorm and low-risk bypass scenarios both pass without universal activation assertions.

## Task 3: Tighten Prove context and relax zero-view only to local facts

Task: Tighten Prove context and relax zero-view only to local facts

Task type: Code change

Files:
- Modify: skills/devflow-prove/SKILL.md | `Methodology Assets` | conditional reference loading
- Modify: skills/devflow-prove/references/proof-recovery-methods.md | `proof selection/loading guidance` | proof context boundary
- Modify: commands/devflow-prove.toml | `proof command prompt` | host command parity
- Modify: skills/devflow-plan/SKILL.md | `authoring` | plan handoff wording
- Modify: skills/devflow-plan/references/plan-methods.md | `Delegated Execution` | local-anchor reread policy
- Modify: skills/devflow-build/SKILL.md | `execution and current-facts boundary` | build behavior
- Modify: scripts/validate-skill-triggers.js | `plan-owned handoff evidence` | static handoff coverage
- Modify: skills/devflow-prove/references/flow-self-test.md | `Scenario 7B` | scenario contract

Interfaces:
- Consumes: changed file types, task/plan anchors, actual diff, proof target, current neighbor facts, command result
- Produces: narrow proof selection plus local-anchor reread behavior; `Command / Result / Adversarial review / Judgment` remains unchanged

Current behavior: Prove tells every activation to read the full framework self-test and code checklist; Plan/Build wording says executors must not reread code, anchors, or plan for a pre-edit view, even though Scenario 7B requires current-anchor rereading.
Target behavior: Prove reads `proof-recovery-methods.md` always, reads language-specific checklist sections matching changed files, and reads `flow-self-test.md` only for DevFlow runtime/skill/command/host/harness changes. Plan/Build may read the current task anchor and directly changed neighbor to detect drift, but never broad-rescan or redesign outside approved scope.
Change mechanics: exact replacement: add a conditional loading table to Prove; replace “no pre-edit read/zero view” with “no broad rediscovery” and explicit local-anchor rules in Plan, plan-methods, and Build; preserve stale-anchor failure handling, scope-drift return, diff-first review, and proof-before-done.
Call impact: normal application code verification consumes less unrelated context; framework changes still load self-tests; delegated executors can detect changed authorization/contracts before editing and return `BUILD_BLOCKED`/scope drift.

Steps:
- [ ] Modify skills/devflow-prove/SKILL.md and skills/devflow-prove/references/proof-recovery-methods.md using exact replacement rules with conditional loading keyed by change surface, plus explicit language-checklist selection by extension.
- [ ] Modify skills/devflow-plan/SKILL.md, skills/devflow-plan/references/plan-methods.md, and skills/devflow-build/SKILL.md using exact replacement rules so local current-anchor/neighbor reads are allowed and required when needed, while broad repository rediscovery, silent plan repair, and scope expansion remain prohibited.
- [ ] Modify commands/devflow-prove.toml and Scenario 7B/trigger evidence using exact replacement rules to match the new context boundary; retain completion output and adversarial review requirements.
- [ ] Run `npm run plan:verify`, `npm run trigger:verify`, and `npm test`; expect plan structure, handoff evidence, and proof contracts to pass.

Acceptance: ordinary application Prove has an explicit small context load; framework changes still get framework self-tests; Plan/Build local-anchor reread is permitted and scope drift still blocks.
Verify: run `npm run plan:verify`, `npm run trigger:verify`, and `npm test`; expected result is all exit 0 with Scenario 7B requiring local-anchor reread and no broad rediscovery.
Comments: preserve a short rationale that local reread protects against stale contracts while broad rediscovery is the expensive behavior being removed.
Not doing: no removal of diff review, adversarial review, language checklist, recovery evidence, or proof failure routing.

Prewalk:

Execution Trace:
- Read: `skills/devflow-prove/SKILL.md:L12-L27` → every Prove activation loads both framework self-test and code review references.
- Read: `skills/devflow-plan/references/plan-methods.md:L62-L74` and `skills/devflow-build/SKILL.md:L20-L26` → absolute no-reread wording conflicts with Scenario 7B's required local-anchor reread.
- Traced: `skills/devflow-prove/references/flow-self-test.md:681-703` → changed authorization behavior must invalidate the plan and return facts before Build continues.
- Ran: `npm run plan:verify` and `npm run verify:all` → current static handoff and full matrix pass before this change.
- Edited: none yet → context-boundary wording is pending.
- Verified: current Scenario 7B → it already expresses desired local-anchor behavior, but skill wording can cause an executor to skip it.

Current Handoff Facts:
- Target anchors: Prove Methodology Assets/Process; Plan execution-basis/boundaries; `plan-methods.md` Delegated Execution; Build execution boundary; Scenario 7B.
- Nearby convention: proof output and failure facts are fixed contracts; context references are selected by owner skill.
- Direct path: Plan task -> Build local anchor/neighbor read -> edit -> focused Verify -> Prove diff/adversarial review.
- Current constraints: no guessed edits, no silent repair, no broad scan, no weakened completion proof.
- Planned touch set: three lifecycle skills, two references, one command, validator/scenario evidence.
- Risks / stop conditions: if the narrower Prove load omits a required proof method for a changed surface, preserve the reference and classify the task as framework-sensitive rather than relying on intuition.
- Read-basis: Prove, Plan, Build, proof reference, plan methods, command prompt, and Scenario 7B were inspected for loading and handoff behavior.
- Live anchors: skills/devflow-prove/SKILL.md `Methodology Assets`; skills/devflow-plan/references/plan-methods.md `Delegated Execution`.

Remaining Structured Worklist:
- [ ] modify conditional Prove loading and local-anchor execution wording, then validate plan/proof contracts.
  Anchors: `skills/devflow-prove/SKILL.md` `Methodology Assets`; `skills/devflow-plan/references/plan-methods.md` `Delegated Execution`.
  Verify: `npm run plan:verify && npm run trigger:verify && npm test`.
  Done when: framework self-test is conditional, local-anchor reread is explicit, and all static contracts pass.

## Task 4: Update validators, self-tests, documentation, and packaged mirrors

Task: Update validators, self-tests, documentation, and packaged mirrors

Task type: Code change

Files:
- Modify: scripts/validate-devflow.js | `route assertions` | package-level contract checks
- Modify: scripts/validate-host-adapters.js | `host capability evidence` | host parity checks
- Modify: scripts/validate-skill-triggers.js | `scenario evidence and trigger cases` | prompt-to-skill coverage
- Modify: scripts/validate-route-consistency.js | `route surface assertions` | route parity
- Modify: scripts/capability-eval-scenarios.json | `risk-adaptive and local-anchor entries` | capability report coverage
- Modify: skills/devflow-prove/references/flow-self-test.md | `Scenarios 1, 2, and 7B` | executable self-test source
- Modify: docs/features/devflow-core.md | `Current State` | product/runtime memory
- Modify: plugins/devflow/skills/devflow-* | `copied changed skill trees` | Codex package parity
- Modify: dsh/plugins/dsh-devflow/assets/skills/devflow-* | `copied changed skill trees` | DSH package parity

Interfaces:
- Consumes: authoritative root runtime files and scenario definitions
- Produces: static PASS/FAIL reports, capability scenario coverage, and byte-identical packaged skill mirrors

Current behavior: validators assert universal creative-work Brainstorm, old zero-view language, and existing scenario evidence; mirrors are checked for parity but do not update automatically.
Target behavior: validators assert risk-qualified route selection, adaptive Brainstorm, conditional Prove context, local-anchor reread, and mirror parity without pretending to benchmark live model quality.
Change mechanics: exact replacement: update only assertions/evidence that changed behavior; add at least one direct low-risk scenario and one high-risk/ambiguous Brainstorm scenario; add conditional-context and local-anchor evidence; synchronize root skill trees into both existing package locations and verify hashes.
Call impact: `npm run verify:all` becomes the release gate for the new static contract; no runtime product code outside prompt/skill assets changes.

Steps:
- [ ] Modify validator fixtures/assertions and capability scenarios using exact replacement rules for low-risk direct entry, high-risk Brainstorm, conditional Prove loading, and local-anchor handoff.
- [ ] Modify docs/features/devflow-core.md using exact replacement rules to record the accepted runtime change and its known evidence boundary: static validation still does not measure live model quality.
- [ ] Modify packaged mirror trees using exact replacement rules to synchronize changed root skill files into plugins/devflow/skills and dsh/plugins/dsh-devflow/assets/skills; compare every changed source/destination file byte-for-byte.
- [ ] Run `npm run verify:all` and inspect `npm run capability:eval`; expect all static checks PASS, scenario coverage to include the new behaviors, and no mirror drift.

Acceptance: the full existing verification matrix passes, reports new risk/context scenarios, and both packaged mirrors match root skill sources exactly.
Verify: run `npm run verify:all`; expected result is exit 0, `Judgment: PASS`, packaged asset parity PASS, and capability report with no gaps.
Comments: ledger entry must state static-evidence limits; no runtime comments required in copied assets.
Not doing: no live model invocation, benchmark scoreboard, DSH bootstrap change, plugin sync mechanism, or new dependency.

Prewalk:

Execution Trace:
- Read: `scripts/validate-devflow.js`, `scripts/validate-host-adapters.js`, `scripts/validate-skill-triggers.js`, and `scripts/capability-eval-scenarios.json` → current assertions encode the old universal-Brainstorm and zero-view contracts.
- Traced: `scripts/validate-skill-triggers.js` packaged parity check → root `skills/devflow-*` changes must be mirrored into DSH assets; Codex plugin mirrors are separately byte-compared in the current distribution contract.
- Ran: `npm run verify:all` → all current static checks passed before contract changes.
- Edited: none yet → validator/scenario/ledger/mirror updates are pending.
- Verified: source and existing mirror hashes for core runtime skills → current root, plugin, and DSH copies are identical.

Current Handoff Facts:
- Target anchors: validator assertion functions, capability scenario manifest, flow self-test scenarios, feature-ledger Current State/Version History/Known Constraints, and mirror skill directories.
- Nearby convention: scenario evidence is declarative and checker output is evidence, not a live model benchmark; package parity is enforced by hashing.
- Direct path: changed source contract -> validators/self-tests -> package mirror parity -> `verify:all`.
- Current constraints: no changes to unrelated user worktree file; preserve zero-dependency validation and existing distribution boundaries.
- Planned touch set: validators, scenarios, ledger, and changed skill mirror files only.
- Risks / stop conditions: if a checker cannot distinguish a static contract from live behavior, label the boundary instead of adding fake model claims; if mirror hashes differ, stop before completion.
- Read-basis: validators, capability scenarios, self-test scenarios, feature ledger, and current mirror hashes were inspected.
- Live anchors: validator assertion functions; capability scenario entries; changed root `skills/devflow-*` trees.

Remaining Structured Worklist:
- [ ] modify scripts/validate-devflow.js and packaged skill mirrors, then check static evidence with the complete matrix.
  Anchors: `scripts/validate-devflow.js`, `scripts/validate-skill-triggers.js`, `scripts/capability-eval-scenarios.json`, and changed `skills/devflow-*` files.
  Verify: `npm run verify:all` plus recursive SHA-256 comparison for root/plugin/DSH changed skill files.
  Done when: all checks pass, new scenarios have no gaps, and every changed packaged skill file is byte-identical to root source.
