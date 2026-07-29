# Validation Harness Feature Ledger

## Current State

- Current Version: v33
- Status: active
- Last Change: core-exclusive-lifecycle-routing-validation
- Product Area: local validation, evidence commands, coverage reports

## Feature Background

The validation harness is the executable proof layer for DevFlow-Core. It keeps the framework from becoming a set of unverified rules by checking files, prompts, skills, commands, learning cards, trigger surfaces, and self-test coverage.

This ledger exists because validation behavior now changes independently from the core runtime method. Validation history should be easy to inspect without turning `devflow-core` into a catch-all ledger.

## Capability Scope

### Currently Supported

- `npm test` runs `scripts/validate-devflow.js`.
- `npm run learn:verify` validates repeated-correction learning closure.
- `npm run scenario:coverage` reports self-test coverage, weak layers, and suggested next scenarios across agent-engineering layers.
- `npm run capability:eval` evaluates a versioned scenario contract against exact self-test evidence and de-duplicated local npm commands; it reports per-scenario `PASS`/`FAIL`/`BLOCKED`, routes, layer coverage, gaps, and reproduction commands.
- `npm run capability:verify` self-tests contract success, missing fields, negative constraints, command failures, duplicate IDs, and command de-duplication.
- Scenario self-tests include host adapter contract drift coverage for prompt-surface validation.
- Scenario self-tests include new reusable pitfall card coverage for memory/learning validation.
- Scenario self-tests include target project install check coverage for onboarding and post-install proof.
- `npm run trigger:verify` validates sample prompt-to-route, skill-path, and direct command trigger evidence.
- `npm run trigger:verify` validates `devflow-pua` pressure recovery, local methodology references, compact `METHOD: {flavor} / {method}` output, hard Brainstorm restart fields, explicit wrong-code signal triggers, repeated missing-piece triggers, opposite-method switching, and `/devflow-pua` command trigger evidence.
- `npm run host:verify` validates cross-host adapter consistency for shared prompt, pressure recovery triggers, local methodology references, compact methodology display, opposite-method switching, platform rules, plugin metadata, and Gemini metadata.
- `npm run host:verify` validates Claude Code hook config and the SessionStart hook payload.
- `npm run host:verify` validates the Claude Code `/devflow-core` command trigger bridge.
- `npm run install:verify` validates installer dry-run, create, target runtime check, skip-existing, force-overwrite, manifest coverage, and installed runtime self-containment against temporary target projects.
- `npm run user:verify` validates user-level installer dry-run, create, check, skip-existing, force-overwrite, and user scope boundaries.
- `npm run debt:verify` validates `devflow:` marker discovery, ceiling detection, and revisit trigger detection.
- `npm run review:verify` validates required review gate detection and missing-gate reporting.
- `npm run spec:verify` validates required section detection, vague spec blocking, and spec landing guidance.
- `npm run plan:verify` validates executable plan headers, categorized file operations, `Consumes`/`Produces` interface contracts, concrete checkbox steps, retained task fields, and plan landing guidance; it does not generate plans, judge architecture, or prove lifecycle state.
- Package, trigger, host, target-installer, and user-installer validation assert Brainstorm's Understanding Revision Rule, fixed `Confirmed request` summary, and absence of removed design/lifecycle responsibilities; they also assert Spec option comparison/design confirmation plus Core's exclusive routing after confirmed requests, confirmed Specs, Cut Decisions, confirmed Plans, and PUA recovery facts.
- Plan validation remains limited to static Plan Pack structure after `devflow-cut` returns `CUT_PASS`; Core decides whether planning is needed and receives the confirmed Plan plus scope-drift facts after review.
- `npm run audit:verify` validates repo-wide audit scanner candidate detection for reuse, stdlib, native, YAGNI, and delete tags.
- `npm test` validates Skill Activation Check wording and `reuse` tag coverage in skills and scripts.
- `npm run verify:all` runs the full local verification matrix in one command.
- Package validation checks required files, skill anatomy, commands, package scripts, learning cards, feature ledgers, stale paths, and required method terms.
- Package, trigger, host, and installer validation cover the Brainstorm interview discipline reference file, the optional `devflow-spec` branch, plugin and Gemini manifest entries, target installer entries, user installer entries, and installed-runtime self-containment.

### Non-Goals

- Do not claim benchmark or adoption scores without reproducible methodology.
- Capability evaluation proves local scenario contracts and evidence commands, not model quality, token use, latency, cost, or live host loading.
- Do not commit generated capability evaluation reports.
- Do not add CI, hooks, databases, or external verifier services before a current need exists.
- Do not simulate LLM reasoning as proof of host-specific skill loading.
- Do not mutate learning cards from validation commands.

## Version History

| Version | Change | Type | Date | Status | Summary |
|---|---|---|---|---|---|
| v33 | core-exclusive-lifecycle-routing-validation | boundary regression | 2026-07-28 | active | Extended package, trigger, host, target-install, and user-install regression coverage to require Cut Decisions, confirmed Plans, and PUA recovery facts to return to Core. Self-tests and capability scenarios now reject direct Cut/Plan/PUA lifecycle handoffs. |
| v32 | brainstorm-spec-responsibility-split-validation | boundary regression | 2026-07-28 | active | Added positive checks for Brainstorm's Understanding Revision Rule, Spec real-option comparison/design confirmation, and both Core routing boundaries; negative checks reject Brainstorm design/lifecycle recovery and Spec direct Cut handoff. Extended self-test, capability, host, target-install, and user-install evidence. |
| v31 | brainstorm-clarification-boundary-validation | boundary regression | 2026-07-28 | active | Added positive checks for Semantic Echo-Back, one-at-a-time questions, and the fixed `Confirmed request` summary; negative checks reject former Brainstorm design, lifecycle, recovery, documentation, and visual-expression responsibilities. Updated trigger, host, scenario, target-install, and user-install evidence for Core-owned routing. |
| v30 | cut-before-plan-lifecycle-validation | lifecycle validation | 2026-07-28 | active | Added validation that Depth A/B run Cut before Plan and that the plan checker remains limited to static Plan Pack structure rather than lifecycle state. |
| v29 | unified-plan-contract-validation | plan contract hardening | 2026-07-28 | active | Added package, trigger, host-adapter, target-installer, and user-installer coverage for the sole `devflow-plan` skill. Expanded the plan checker self-test from basic task fields to executable headers, categorized file operations, interface contracts, and concrete checkbox steps while preserving source tracing and landing checks. |
| v28 | local-capability-evaluation | capability regression | 2026-07-24 | active | Added versioned scenario contracts and a zero-dependency evaluator that maps fixed self-test evidence to deduplicated local command results, with per-scenario reporting and explicit non-benchmark boundaries. |
| v27 | brainstorm-interview-discipline-validation | trigger and installer coverage | 2026-07-01 | active | Added package, trigger, host, target-installer, user-installer, plugin manifest, and Gemini manifest coverage proving `devflow-brainstorm` interview discipline and `devflow-spec` handoff are installed and reachable. |
| v26 | pua-compact-method-display-validation | trigger hardening | 2026-06-27 | active | Updated trigger, host, and package validation to require the compact `METHOD: {flavor} / {method}` contract instead of verbose methodology output fields. |
| v25 | pua-methodology-assets-validation | trigger hardening | 2026-06-27 | active | Added validation that `devflow-pua` ships local methodology router/library/display references and requires visible method output. |
| v24 | pua-repeated-missing-validation | trigger hardening | 2026-06-27 | active | Added validation coverage for "少个" missing-piece triggers and different/opposite method switching across trigger and host surfaces. |
| v23 | spec-document-validation | command hardening | 2026-06-26 | active | Added validation coverage for `devflow-spec`, `/devflow-spec`, `scripts/devflow-spec.js`, `spec:verify`, manifests, installers, and trigger/host checks. |
| v22 | activation-chain-and-reuse-validation | proof hardening | 2026-06-26 | active | Added validation for Skill Activation Chain Check wording and `reuse` audit scanner detection. |
| v21 | pua-hard-restart-validation | trigger hardening | 2026-06-26 | active | Added trigger and host-adapter validation for explicit wrong-code signals, `Restart Brainstorm`, discarded context, and verified-facts output fields. |
| v20 | devflow-audit-validation | command hardening | 2026-06-26 | active | Added validation coverage for `devflow-audit`, `/devflow-audit`, installer entries, host manifests, and the audit scanner self-test. |
| v19 | devflow-pua-and-plan-landing-validation | trigger and plan hardening | 2026-06-25 | active | Added validation coverage for `devflow-pua`, `/devflow-pua`, and default plan landing under `docs/plans/`. |
| v18 | claude-command-validation | host smoke test | 2026-06-25 | active | Added validation that `.claude/commands/devflow-core.md` exists and bridges `/devflow-core` to DevFlow Core plus Brainstorm triggers. |
| v17 | claude-hook-validation | host smoke test | 2026-06-25 | active | Added host and installer validation for Claude Code SessionStart hook artifacts and payload shape. |
| v16 | user-installer-self-test | installer hardening | 2026-06-24 | active | Added `npm run user:verify` for user-level skills, commands, and scripts installation behavior. |
| v15 | plan-pack-self-test | command hardening | 2026-06-24 | active | Added `npm run plan:verify` and included the plan-pack checker self-test in the full verification matrix. |
| v14 | review-gate-self-test | command hardening | 2026-06-24 | active | Added `npm run review:verify` and included the review gate scanner self-test in the full verification matrix. |
| v13 | debt-scanner-self-test | command hardening | 2026-06-24 | active | Added `npm run debt:verify` and included the debt scanner self-test in the full verification matrix. |
| v12 | direct-command-trigger-coverage | trigger hardening | 2026-06-24 | active | Added trigger verification coverage for `/devflow-plan`, `/devflow-review`, and `/devflow-debt` command paths. |
| v11 | target-install-scenario-coverage | coverage improvement | 2026-06-24 | active | Added a self-test scenario for target project install verification using installer `--check` mode. |
| v10 | installer-target-check-validation | drift prevention | 2026-06-24 | active | Added regression coverage for installer `--check` mode across matching, missing, and changed target runtime files. |
| v9 | installer-self-containment | drift prevention | 2026-06-24 | active | Added checks that installed runtime files do not hard-reference non-installed package files unless the reference is explicitly optional or structural. |
| v8 | installer-manifest-coverage | drift prevention | 2026-06-24 | active | Added checks that installer runtime entries include plugin and Gemini manifest entrypoints, skills, and commands. |
| v7 | installer-regression-verifier | safety regression | 2026-06-24 | active | Added installer behavior regression checks to the full verification matrix. |
| v6 | verify-all-command | usability improvement | 2026-06-24 | active | Added one command for the full local verification matrix. |
| v5 | memory-learning-scenario | coverage improvement | 2026-06-24 | active | Added a new reusable pitfall card scenario to strengthen Memory/Learning coverage. |
| v4 | prompt-surface-scenario | coverage improvement | 2026-06-24 | active | Added a host adapter contract drift scenario to strengthen Prompt Surface coverage. |
| v3 | scenario-weak-layer-report | report hardening | 2026-06-24 | active | Added weak-layer and suggested-next-scenario output to scenario coverage. |
| v2 | host-adapter-verification | host smoke test | 2026-06-24 | active | Added local smoke test for Codex/shared, Claude, Copilot, VS Code, CodeBuddy, plugin, and Gemini entry consistency. |
| v1 | validation-harness-ledger | product memory | 2026-06-24 | active | Split validation harness history into its own feature ledger. |

## Key Decisions

- 2026-07-28: Expand the existing `devflow-plan` checker instead of adding a second writing-plan validator or plan generator. Reason: headers, file operations, interface contracts, and concrete steps are deterministic structural evidence; architecture quality and plan authorship remain agent/human judgment.
- 2026-07-24: Add `npm run capability:eval` plus a versioned JSON scenario contract instead of an external benchmark service. Reason: the harness can now prove which fixed local behavior contracts and evidence commands remain intact without modeling unstable API cost or host-runtime behavior.
- 2026-07-24: Reuse existing npm evidence commands and execute each referenced command once per report. Reason: it preserves the current proof sources, prevents repeated expensive verification, and keeps `scenario:coverage` as an advisory coverage map rather than mislabeling it as a quality benchmark.
- 2026-07-24: Do not commit generated capability reports. Reason: the manifest and script are reproducible source, while report output is time-sensitive evidence that would create stale diffs.
- 2026-06-24: Keep validation commands zero-dependency Node scripts. Reason: maintainers should be able to run proof immediately after installing the pack.
- 2026-06-24: Treat reports as evidence, not final external verifier status. Reason: local scripts can prove artifacts and coverage, but humans or external CI still own final release approval when required.
- 2026-06-24: Keep learning validation no-mutation. Reason: validation should prove the closure path without manufacturing project memory.
- 2026-06-24: Validate host adapters by file evidence instead of launching each host. Reason: this repo can prove packaged entry consistency locally; real host runtime belongs to later integration smoke tests.
- 2026-06-24: Keep weak-layer scenario coverage advisory instead of failing the command. Reason: zero-coverage layers should fail, but weak-layer hints should guide iteration without blocking unrelated releases.
- 2026-06-24: Close Prompt Surface weak-layer warning with a host adapter drift scenario. Reason: the report identified adapter prompt-surface coverage as the next useful scenario, and `host:verify` already provides executable evidence.
- 2026-06-24: Close Memory/Learning weak-layer warning with a new reusable pitfall card scenario. Reason: the report identified card creation and index update as the next useful memory lifecycle gap.
- 2026-06-24: Add `npm run verify:all` as a package script instead of a new orchestrator file. Reason: the existing npm scripts already define the verification matrix, so direct composition is the smallest useful developer entry point.
- 2026-06-24: Add `npm run install:verify` as a local regression script. Reason: installer overwrite safety is a trust boundary and should be automatically checked, not only manually sampled.
- 2026-06-24: Validate installer manifest coverage inside `npm run install:verify` instead of creating a shared manifest file. Reason: this blocks drift now without refactoring the pack format before there is a concrete release need.
- 2026-06-24: Validate installed runtime self-containment instead of copying product docs and validation scripts into target projects. Reason: target projects need a clean runtime pack, while product docs remain source-package material.
- 2026-06-24: Validate installer `--check` using matching, missing, and changed target projects. Reason: adoption safety needs a post-install proof path, not only copy-time checks.
- 2026-06-24: Add target install verification to `flow-self-test.md` instead of creating a separate scenario file. Reason: scenario coverage already reads that source and can report the onboarding proof path without more harness structure.
- 2026-06-24: Extend `validate-skill-triggers.js` for direct command triggers instead of adding a new command verifier. Reason: command trigger coverage is part of the existing trigger surface, and the same zero-dependency script can prove it.
- 2026-06-24: Add `npm run debt:verify` as a scanner self-test instead of using fixture files in the repository. Reason: the scanner can create a temporary marker sample and prove behavior without adding test data churn.
- 2026-06-24: Add `npm run review:verify` as a gate scanner self-test instead of full review automation. Reason: required gate presence is deterministic and enough to harden `/devflow-review` without pretending to grade code quality.
- 2026-06-24: Add `npm run plan:verify` as a plan-pack checker self-test instead of a plan generator. Reason: task-field completeness and vague-plan blocking are deterministic, while plan quality still needs agent/human judgment.
- 2026-06-24: Add `npm run user:verify` for user-level install behavior instead of reusing target installer tests. Reason: user-level installs have different scope boundaries and must not copy project prompt files.
- 2026-06-25: Validate Claude Code hooks in `host:verify` and target installer tests instead of adding a separate hook verifier. Reason: hook activation is part of host adapter consistency, and the installer owns both the runtime file list and safe `.claude/settings.json` merge behavior.
- 2026-06-25: Validate the Claude Code `/devflow-core` command through `host:verify` and installer tests instead of assuming TOML commands are visible to Claude Code. Reason: command trigger failures are prompt-surface defects and need file-level proof.
- 2026-06-25: Validate `devflow-pua` and plan landing with file-level checks instead of relying on agent memory. Reason: user challenge recovery and saved plan placement were unstable in actual use and need visible trigger and checker evidence.
- 2026-06-26: Add `npm run audit:verify` as a scanner self-test instead of relying on manual Ponytail audit behavior. Reason: repo-wide audit should be installable and locally provable, while final cut judgment remains with the agent or human.
- 2026-06-26: Validate explicit wrong-code recovery through trigger and host-adapter checks. Reason: the rule must be visible from `AGENTS.md`, skill descriptions, commands, and host prompts, not only remembered inside one skill body.
- 2026-06-26: Validate Skill Activation Chain Check and `reuse` detection through existing package and audit self-tests. Reason: the behavior must be visible in the runtime skill and executable in the scanner without adding a broad code-quality harness.
- 2026-06-26: Add `npm run spec:verify` and manifest/installer/trigger coverage for `devflow-spec` instead of leaving specs as prompt-only guidance. Reason: Superpowers-style spec discipline must be reachable and locally provable after target install.
- 2026-06-27: Validate repeated missing-piece recovery and opposite-method switching through trigger and host checks. Reason: the behavior is only useful if Codex, Claude, Copilot, and CodeBuddy entry surfaces all make the same recovery path visible.
- 2026-06-27: Validate local methodology assets and compact display output. Reason: naming methods is not enough; the runtime must prove it ships the method files and forces agents to show `METHOD: {flavor} / {method}` plus a switch line when the method changes.
- 2026-07-01: Validate Brainstorm interview discipline through existing trigger, host, manifest, and installer checks instead of adding a separate verifier. Reason: the risk is whether development requests reach `devflow-brainstorm`, preserve the spec handoff branch, and ship the local reference with the runtime.

## Known Constraints

- `npm run capability:eval` validates manifest-declared local contracts, scenario text, and command output only; it is not a model quality, token, latency, cost, or live host-loading benchmark.
- Capability evaluator `BLOCKED` means the manifest or evaluation environment could not be read or executed; it must never be presented as a passed scenario.
- Generated capability reports are console evidence and are intentionally not stored in the repository.
- Coverage and trigger scripts inspect visible files, command prompts, and keywords; they do not prove actual host plugin behavior.
- Weak-layer thresholds are heuristic and should guide backlog work, not serve as benchmark scores.
- Host adapter smoke tests validate packaged files and metadata, not live IDE extension loading.
- Installer verification uses temporary local directories, target runtime drift checks, manifest file checks, and installed runtime self-containment scans; it proves file copy safety and package list consistency, not host-specific runtime loading after install.
- User installer verification uses temporary Codex home directories; it proves copy safety for user-level files, not live Codex loading after install.
- Claude hook validation runs the local SessionStart script and checks JSON payload shape; it does not launch Claude Code itself.
- `npm run verify:all` is the easiest release-readiness smoke check, but specific claims should still cite the narrow command that proves them.
- `npm test` is broad package validation, not a substitute for running the specific report tied to a claim.
- `npm run debt:verify` validates scanner parsing behavior, not whether a particular target project has accepted or resolved its debt markers.
- `npm run review:verify` validates gate presence parsing, not whether a plan or diff is actually safe to ship.
- `npm run spec:verify` validates required sections and placement, not whether the spec is the right product decision.
- `npm run plan:verify` validates checker parsing behavior, not whether a plan is the right product or architecture decision.
- `npm run audit:verify` validates scanner candidate detection, including duplicate declaration reuse candidates, not whether a target repository actually contains removable code.
- Benchmark claims remain out of scope until sample selection, scoring, and reproduction steps exist.

## Related Artifacts

- Package validation: `scripts/validate-devflow.js`
- Learning-loop validation: `scripts/validate-learning-loop.js`
- Scenario coverage: `scripts/report-scenario-coverage.js`
- Capability evaluator: `scripts/capability-eval.js`
- Capability scenario contract: `scripts/capability-eval-scenarios.json`
- Trigger validation: `scripts/validate-skill-triggers.js`
- PUA methodology router: `skills/devflow-pua/references/methodology-router.md`
- PUA methodology library: `skills/devflow-pua/references/methodology-library.md`
- PUA flavor display: `skills/devflow-pua/references/flavor-display.md`
- Host adapter validation: `scripts/validate-host-adapters.js`
- Installer validation: `scripts/validate-installer.js`
- Claude hook config: `hooks/hooks.json`
- Claude hook script: `hooks/devflow-session-start.js`
- Claude command: `.claude/commands/devflow-core.md`
- User installer validation: `scripts/validate-user-installer.js`
- Spec checker: `scripts/devflow-spec.js`
- Audit scanner: `scripts/devflow-audit.js`
- Brainstorm interview discipline reference: `skills/devflow-brainstorm/references/interview-discipline.md`
- Scenario source: `skills/devflow-prove/references/flow-self-test.md`
- Package scripts: `package.json`
