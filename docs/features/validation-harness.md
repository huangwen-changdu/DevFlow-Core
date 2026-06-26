# Validation Harness Feature Ledger

## Current State

- Current Version: v23
- Status: active
- Last Change: spec-document-validation
- Product Area: local validation, evidence commands, coverage reports

## Feature Background

The validation harness is the executable proof layer for DevFlow-Core. It keeps the framework from becoming a set of unverified rules by checking files, prompts, skills, commands, learning cards, trigger surfaces, and self-test coverage.

This ledger exists because validation behavior now changes independently from the core runtime method. Validation history should be easy to inspect without turning `devflow-core` into a catch-all ledger.

## Capability Scope

### Currently Supported

- `npm test` runs `scripts/validate-devflow.js`.
- `npm run learn:verify` validates repeated-correction learning closure.
- `npm run scenario:coverage` reports self-test coverage, weak layers, and suggested next scenarios across agent-engineering layers.
- Scenario self-tests include host adapter contract drift coverage for prompt-surface validation.
- Scenario self-tests include new reusable pitfall card coverage for memory/learning validation.
- Scenario self-tests include target project install check coverage for onboarding and post-install proof.
- `npm run trigger:verify` validates sample prompt-to-route, skill-path, and direct command trigger evidence.
- `npm run trigger:verify` validates `devflow-pua` pressure recovery, hard Brainstorm restart fields, explicit wrong-code signal triggers, and `/devflow-pua` command trigger evidence.
- `npm run host:verify` validates cross-host adapter consistency for shared prompt, platform rules, plugin metadata, and Gemini metadata.
- `npm run host:verify` validates Claude Code hook config and the SessionStart hook payload.
- `npm run host:verify` validates the Claude Code `/devflow-core` command trigger bridge.
- `npm run install:verify` validates installer dry-run, create, target runtime check, skip-existing, force-overwrite, manifest coverage, and installed runtime self-containment against temporary target projects.
- `npm run user:verify` validates user-level installer dry-run, create, check, skip-existing, force-overwrite, and user scope boundaries.
- `npm run debt:verify` validates `devflow:` marker discovery, ceiling detection, and revisit trigger detection.
- `npm run review:verify` validates required review gate detection and missing-gate reporting.
- `npm run spec:verify` validates required section detection, vague spec blocking, and spec landing guidance.
- `npm run plan:verify` validates plan-pack task field detection, missing field reporting, vague plan blocking, and plan landing guidance.
- `npm run audit:verify` validates repo-wide audit scanner candidate detection for reuse, stdlib, native, YAGNI, and delete tags.
- `npm test` validates Skill Activation Check wording and `reuse` tag coverage in skills and scripts.
- `npm run verify:all` runs the full local verification matrix in one command.
- Package validation checks required files, skill anatomy, commands, package scripts, learning cards, feature ledgers, stale paths, and required method terms.

### Non-Goals

- Do not claim benchmark or adoption scores without reproducible methodology.
- Do not add CI, hooks, databases, or external verifier services before a current need exists.
- Do not simulate LLM reasoning as proof of host-specific skill loading.
- Do not mutate learning cards from validation commands.

## Version History

| Version | Change | Type | Date | Status | Summary |
|---|---|---|---|---|---|
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

## Known Constraints

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
- Trigger validation: `scripts/validate-skill-triggers.js`
- Host adapter validation: `scripts/validate-host-adapters.js`
- Installer validation: `scripts/validate-installer.js`
- Claude hook config: `hooks/hooks.json`
- Claude hook script: `hooks/devflow-session-start.js`
- Claude command: `.claude/commands/devflow-core.md`
- User installer validation: `scripts/validate-user-installer.js`
- Spec checker: `scripts/devflow-spec.js`
- Audit scanner: `scripts/devflow-audit.js`
- Scenario source: `skills/devflow-prove/references/flow-self-test.md`
- Package scripts: `package.json`
