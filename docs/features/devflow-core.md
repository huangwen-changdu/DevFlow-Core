# DevFlow Core Runtime Feature Ledger

## Current State

- Current Version: v37
- Status: active
- Last Change: codex-hook-coverage
- Product Area: runtime flow, skill routing, validation, learning loop

## Feature Background

DevFlow Core Runtime is the central product capability of DevFlow-Core. It turns developer requests into a lightweight but verified agent workflow:

```text
Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut -> Build -> Prove -> Learn when needed
```

This ledger exists so future changes do not lose why the runtime is shaped this way, which reference-project ideas were absorbed, and which boundaries must not drift.

## Capability Scope

### Currently Supported

- Prompt-sized `AGENTS.md` with route and trigger words.
- Codex and Claude Code `SessionStart` hook artifacts for project-level activation reminders, plus Claude plugin-style activation.
- Claude Code `/devflow-core` command under `.claude/commands/` that explicitly bridges requirements, UI/page ambiguity, prompt distinction issues, and server-backed implementation requests to `devflow-brainstorm`.
- `devflow-core` route selection for Fast, Problem, Design-lite, Design, Build, and Recovery.
- `devflow-pua` pressure recovery for user challenge, explicit wrong-code signals, repeated missing-piece complaints such as "少了这个/少个那个", changed-wrong results, repeated misses, quality complaints, local PUA methodology assets, compact `METHOD: {flavor} / {method}` display, concise method switch line, hard `devflow-brainstorm` restart, user-view miss diagnosis, method switching after failed methods, opposite-method recovery when a method still misses, wrong-context quarantine, pointed goal/result questions, changed approach, proof, and learning handoff.
- `devflow-prove` Skill Activation Chain Check for rule, command, prompt, entry, and skill changes.
- Small Request Boundary gates for Fast and Design-lite: impact, risk, uncertainty, and proof.
- Method Lens selection for Design, Recovery, problem solving (问题解决), bug fixing, architecture design (架构设计), and high-risk proof: Root Cause, Working Backwards, First Principles Cut (第一性原理), Data/Proof, and Operational Owner.
- `devflow-prove` adversarial review (对抗式审查) before completion for development work, checking whether the result is still wrong, incomplete, unreachable, over-broad, or under-verified before any done/fixed/ready claim.
- `devflow-brainstorm`, `devflow-spec`, `devflow-cut`, `devflow-build`, `devflow-prove`, `devflow-pua`, `devflow-learn`, and `devflow-audit` as focused runtime skills.
- `devflow-brainstorm` interview discipline as core behavior: one question at a time, recommended answers, fact reads before asking, and documentation landing decisions through `devflow-spec`, feature ledgers, or ADRs when needed.
- `devflow-brainstorm` Depth Selection Gate: three design depths (A: Full Spec with 3 confirmations, B: Simplified Spec with 2 confirmations, C: Dialogue Confirmation with 1 confirmation). Depth is user-chosen based on Small Request Boundary gates.
- Commands for route, spec, plan, review, debt, prove, pua, learn, and audit; `/devflow-spec` can use the bundled `scripts/devflow-spec.js` checker, `/devflow-plan` can use the bundled `scripts/devflow-plan.js` plan-pack checker, `/devflow-review` can use the bundled `scripts/devflow-review.js` gate scanner, `/devflow-debt` can use the bundled `scripts/devflow-debt.js` scanner, and `/devflow-audit` can use the bundled `scripts/devflow-audit.js` repo-wide audit scanner.
- Saved specs default to `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`; saved plans default to `docs/plans/YYYY-MM-DD-<short-kebab-name>.md` and must cite `Source:` plus `Spec coverage:`.
- `npm test` validation for required files, skills, commands, PRD, learning cards, and stale paths.
- Learning cards under `.copilot/` for repeatable corrections.
- `/devflow-learn` command and `npm run learn:verify` for executable learning-loop closure checks.
- `npm run scenario:coverage` for architecture-layer visibility across self-test scenarios.
- `npm run trigger:verify` for prompt-to-route and skill-path trigger checks.
- README copyable workflows for problem investigation, requirement implementation, bug fixes, and target install verification.
- `npm run install:target -- <path> [--write] [--force] [--check]` installs self-contained runtime entries into a target project with dry-run and overwrite safety, then can verify whether installed runtime files still match the package.
- `npm run install:user -- [--write] [--force] [--check]` installs user-level `skills/`, `commands/`, and `scripts/devflow-*.js` into `CODEX_HOME` or `~/.codex` with dry-run and overwrite safety.
- Separate validation harness feature ledger for validation/report history.
- Product PRD under `docs/PRD.md`.

### Non-Goals

- Do not recreate a 20+ skill lifecycle by default.
- Do not require full OpenSpec for every change.
- Do not place runtime method source under `docs/`.
- Do not add heavy Stop-loop automation, benchmark scoreboards, or external verifier services before a current need exists.

## Version History

| Version | Change | Type | Date | Status | Summary |
|---|---|---|---|---|---|
| v37 | codex-hook-coverage | host activation | 2026-07-14 | active | Kept the existing Codex `SessionStart` registration minimal, added dated spec/plan landing guidance to its shared context payload, and covered `.codex/hooks.json` in runtime and host-adapter validation. |
| v36 | dated-spec-plan-landing | documentation convention | 2026-07-14 | active | Changed default saved spec and plan names to `YYYY-MM-DD-<short-kebab-name>.md`, resolved from the current target project root, across skills, command prompts, checker guidance, and documentation. |
| v35 | sync-scope-merge-guidance | adoption documentation | 2026-07-14 | active | Documented user-level versus target-project sync scope, required target-project confirmation for project-scoped files, and the rule/`AGENTS.md` merge policy; clarified that only Claude SessionStart settings merge automatically today. |
| v34 | cross-surface-contract-sync | prompt/skill contract sync | 2026-07-14 | active | Synchronized First Principles Cut and adversarial review across Core routing, `/devflow`, Claude, Copilot, VS Code, CodeBuddy, SessionStart, and completion output contracts; validators now assert the same method/proof surface across these entries. |
| v33 | method-proof-rule-surface | prompt/skill hardening | 2026-07-14 | active | Added concise First Principles Cut and adversarial review gates to `AGENTS.md` and primary host rules, exposed adversarial review in the `devflow-prove` description and required output, and hardened validators so short-context hosts cannot silently fall back to generic proof behavior. |
| v32 | method-proof-activation-coverage | validation hardening | 2026-07-13 | active | Closed the v31 activation gap: `/devflow-prove` now requires a visible adversarial challenge and fails or continues when it finds a real gap; self-tests cover First Principles Cut outputs and adversarial rejection of premature completion; core, trigger, and host validators assert these concrete actions. |
| v31 | first-principles-and-adversarial-proof | method/proof hardening | 2026-07-08 | active | Added explicit First Principles Cut (第一性原理) behavior to `devflow-brainstorm` and core routing/method coverage for problem solving (问题解决), 修 bug, and architecture design (架构设计). Added mandatory `devflow-prove` adversarial review (对抗式审查) before completion for development work. |
| v30 | brainstorm-depth-selection-gate | design flow | 2026-07-02 | active | Added Depth Selection Gate (A/B/C) to `devflow-brainstorm`: A (Full Spec: Feature Ledger → Design Contract → devflow-spec → /devflow-plan, 3 confirmations), B (Simplified Spec: Feature Ledger → Design Contract → /devflow-plan, 2 confirmations), C (Dialogue Confirmation: Core Clarification → devflow-cut, 1 confirmation). Depth is user-chosen, not LLM-asserted. |
| v29 | brainstorm-interview-discipline | reference absorption | 2026-07-01 | active | Absorbed Matt Pocock's interview behavior into core `devflow-brainstorm` interview discipline and docs landing decisions instead of keeping separate runtime concepts. |
| v28 | pua-compact-method-display | recovery usability | 2026-06-27 | active | Simplified visible PUA methodology output to `METHOD: {flavor} / {method}` plus a concise switch line while keeping local methodology assets as the runtime source. |
| v27 | pua-local-methodology-assets | recovery hardening | 2026-06-27 | active | Added local `devflow-pua` methodology router, method library, flavor display protocol, and required method display output. |
| v26 | pua-repeated-missing-opposite-method | recovery hardening | 2026-06-27 | active | Added repeated "少了这个/少个那个" trigger handling and opposite-method recovery when a prior guiding method still fails. |
| v25 | pua-user-view-method-switch | recovery hardening | 2026-06-27 | active | Added user-view miss taxonomy, satisfaction-gap output, missing-piece complaint triggers, and method switching when a prior recovery method still fails. |
| v24 | spec-document-runtime | Superpowers absorption | 2026-06-26 | active | Added `devflow-spec`, `/devflow-spec`, a spec checker, default `docs/specs/` landing, and plan `Source` / `Spec coverage` tracing without requiring full specs for every task. |
| v23 | code-quality-activation-chain | proof hardening | 2026-06-26 | active | Absorbed the useful parts of `code-quality-check-pua`: lightweight completion quality gate, Skill Activation Chain Check, and a `reuse` overengineering tag without adding a large quality-check skill. |
| v22 | devflow-pua-hard-brainstorm-restart | recovery hardening | 2026-06-26 | active | Made repeated challenges and explicit wrong-code signals restart `devflow-brainstorm`, quarantine old wrong context, and ask what is wrong and what result is wanted before more edits. |
| v21 | devflow-audit-repo-scan | command hardening | 2026-06-26 | active | Added a separate `devflow-audit` skill, command, and script for repo-wide overengineering candidate scans without turning ordinary review or bug handling into an audit. |
| v20 | devflow-pua-pressure-recovery | recovery hardening | 2026-06-25 | active | Added a dedicated `devflow-pua` skill and command for user challenge, changed-wrong, repeated miss, and quality complaint recovery. |
| v19 | claude-devflow-core-command | host activation | 2026-06-25 | active | Added a Claude Code `/devflow-core` command that explicitly loads DevFlow Core and Brainstorm for ambiguous UI/product/server-backed requests. |
| v18 | claude-code-sessionstart-hook | host activation | 2026-06-25 | active | Added lightweight Claude Code SessionStart hook files so DevFlow Core can be injected at session start without adding Stop-loop enforcement. |
| v17 | small-request-boundary-routing | route hardening | 2026-06-24 | active | Defined small request and small feature boundaries and added user route choice when Fast, Design-lite, and full Design are ambiguous. |
| v16 | method-lens-runtime | methodology absorption | 2026-06-24 | active | Added native Method Lens selection so PUA method routing becomes lightweight DevFlow working strategy instead of a separate methodology stack. |
| v15 | user-level-runtime-installer | adoption | 2026-06-24 | active | Added a dry-run-first installer for user-level DevFlow skills, commands, and scripts under Codex home. |
| v14 | executable-plan-pack-checker | command hardening | 2026-06-24 | active | Added a zero-dependency checker for `/devflow-plan` to verify executable task fields before implementation. |
| v13 | executable-review-gate-scanner | command hardening | 2026-06-24 | active | Added a zero-dependency gate scanner for `/devflow-review` to check required anti-overengineering review gates. |
| v12 | executable-debt-scanner | command hardening | 2026-06-24 | active | Added a zero-dependency scanner for `devflow:` intentional-simplification markers and installed it into target projects. |
| v11 | target-install-verification-workflow | adoption polish | 2026-06-24 | active | Added a copyable workflow and self-test scenario for proving a target project install with `--check`. |
| v10 | installer-target-runtime-check | adoption safety | 2026-06-24 | active | Added `--check` mode so developers can verify installed target runtime files are present and unchanged from the package. |
| v9 | installer-runtime-self-containment | packaging | 2026-06-24 | active | Removed source-package reference docs from the target installer and made installed runtime references self-contained. |
| v8 | installer-overwrite-safety | safety | 2026-06-24 | active | Changed installer write mode to skip existing files unless `--force` is passed. |
| v7 | target-project-installer | adoption | 2026-06-24 | active | Added a dry-run-first installer for copying runtime entries into target projects. |
| v6 | validation-harness-ledger | product memory | 2026-06-24 | active | Split validation and report history into `docs/features/validation-harness.md`. |
| v5 | onboarding-workflows | adoption polish | 2026-06-24 | active | Added three copyable README workflows for first-use developer scenarios. |
| v4 | skill-trigger-verification | trigger hardening | 2026-06-24 | active | Added sample prompt trigger verification for Problem, Build, bug, completion, and learning paths. |
| v3 | scenario-coverage-report | harness visibility | 2026-06-24 | active | Added scenario coverage report across prompt, loop, harness, context, memory, verifier, and orchestration layers. |
| v2 | learning-loop-verifier | capability hardening | 2026-06-24 | active | Added manual learning command and executable repeated-correction validation. |
| v1 | product-prd-and-feature-ledger | new capability | 2026-06-24 | active | Added PRD and first feature ledger to make product iteration explicit. |

## Key Decisions

- 2026-06-24: Keep runtime source in `skills/*/references/*`; allow `docs/` for PRD, feature ledgers, plans, and specs. Reason: product artifacts should guide iteration without becoming agent runtime source.
- 2026-06-24: Start with one ledger for DevFlow Core Runtime before splitting per skill. Reason: the current product has one tightly coupled runtime capability and splitting too early would add ceremony.
- 2026-06-24: Validate ledger structure through `npm test`. Reason: feature memory is only useful if it is enforced like other product contracts.
- 2026-06-24: Add `npm run learn:verify` instead of a hook-based learning engine. Reason: it proves the learning closure path without adding platform automation before adoption needs it.
- 2026-06-24: Add `npm run scenario:coverage` as a text report instead of a benchmark scoreboard. Reason: maintainers need visible coverage first; benchmark claims need reproducible methodology later.
- 2026-06-24: Add `npm run trigger:verify` with fixed sample prompts instead of LLM simulation. Reason: trigger surfaces must be testable from local files without pretending to predict model behavior.
- 2026-06-24: Put first-use workflows in README instead of a new docs page. Reason: onboarding should be visible in the install/read-first path without adding another artifact.
- 2026-06-24: Split validation harness history into its own ledger. Reason: validation/report behavior now evolves independently from runtime routing and should not be buried in the core ledger.
- 2026-06-24: Add a dry-run-first Node installer instead of an interactive wizard. Reason: developers need a real copy path now, while merge policy and host-specific setup can stay out until there is adoption evidence.
- 2026-06-24: Make installer writes skip existing files unless `--force` is passed. Reason: target projects may already have local agent rules, and a first-use installer must preserve trust before convenience.
- 2026-06-24: Do not install source-package reference docs such as `reference-projects.md` and `project-structure.md`. Reason: target projects need runtime methods, not DevFlow-Core source-package explanations that point to uninstalled docs and scripts.
- 2026-06-24: Add target runtime `--check` to the installer instead of a separate verifier command. Reason: the installer already owns the runtime file list, so reusing it is the smallest reliable drift check.
- 2026-06-24: Add target install verification as a README workflow and self-test scenario instead of a new command. Reason: the existing installer and `install:verify` already provide the executable proof path.
- 2026-06-24: Add a small `scripts/devflow-debt.js` scanner instead of leaving `/devflow-debt` as prompt-only behavior. Reason: debt marker harvest is a core runtime capability and should work after target install without a new dependency.
- 2026-06-24: Add a small `scripts/devflow-review.js` scanner instead of trying to automate full code review. Reason: gate presence is locally checkable and useful, while full review still belongs to the agent/human.
- 2026-06-24: Add a small `scripts/devflow-plan.js` checker instead of building a plan generator. Reason: executable task-field checks harden `/devflow-plan` while keeping planning judgment with the agent/human.
- 2026-06-24: Add a user-level installer separate from the target-project installer. Reason: developers need global Codex skills/commands/scripts, while project rules like `AGENTS.md` must remain project-versioned.
- 2026-06-24: Absorb PUA method routing as Method Lens inside DevFlow Core instead of adding a new `pua` skill. Reason: DevFlow-Core needs the working-strategy "soul" while preserving lightweight routes, prompt-sized entries, and native validation.
- 2026-06-24: Define small request and small feature by impact, risk, uncertainty, and proof instead of line count or intuition. Reason: agents should not guess whether a feature deserves Fast, Design-lite, or full Design when the boundary is unclear.
- 2026-06-25: Add Claude Code SessionStart activation as a lightweight hook instead of a Stop-loop or PreToolUse gate. Reason: reference projects use hooks to inject runtime context, and DevFlow needs better Claude Code activation without turning every task into forced automation.
- 2026-06-25: Add `.claude/commands/devflow-core.md` instead of relying on `commands/devflow.toml` for Claude Code slash-command activation. Reason: Claude Code needs a native command surface for `/devflow-core`, and UI/product ambiguity should explicitly bridge to `devflow-brainstorm`.
- 2026-06-25: Add `devflow-pua` as a dedicated skill instead of hiding pressure recovery inside `devflow-core`. Reason: user challenge and repeated wrong-path edits need strong trigger words, a separate output contract, and installable skill/command artifacts without making the core router bulky.
- 2026-06-26: Add `devflow-audit` as a separate skill and command instead of expanding `devflow-review`. Reason: plan/diff gate review and repo-wide overengineering audits have different scopes, and ordinary problem handling should not silently execute a whole-repo audit.
- 2026-06-26: Make explicit wrong-code signals restart Brainstorm instead of continuing the old patch path. Reason: when the user says "你写的有问题 / 不对 / 写错了", the previous context is suspect and should be used as failure evidence only until the desired result is re-asked or re-inferred.

- 2026-06-26: Absorb `code-quality-check-pua` as targeted gates instead of a monolithic code-quality skill. Reason: DevFlow-Core already has Build, Cut, Audit, and Prove; the missing value was skill activation proof and missed-reuse reporting, not another broad review layer.
- 2026-06-26: Add `devflow-spec` as the Superpowers-style requirements source instead of forcing every task through a full design document. Reason: larger work needs a traceable spec before planning, while Design-lite should remain lightweight.
- 2026-06-26: Require `Source:` and `Spec coverage:` in Plan Pack instead of relying on plan text alone. Reason: implementation tasks should prove which spec requirements or approved design decisions they cover.
- 2026-06-27: Treat repeated "missing this/missing that" feedback as pressure recovery instead of ordinary incremental scope. Reason: repeated missing-piece feedback usually means the agent failed coverage, success-contract, or user-view diagnosis, so continuing the old method repeats the miss.
- 2026-06-27: Switch to a different/opposite recovery method when the first method still fails. Reason: after a user says the fix is still wrong or still missing pieces, another tweak with the same method usually repeats the failure pattern; the runtime must restart checks from facts with a different lens.
- 2026-06-27: Add local PUA methodology assets instead of only naming methods. Reason: pressure recovery must expose which method is active, why it was chosen, what flavor is displayed, and what method steps will be executed without requiring runtime links to another project.
- 2026-07-01: Absorb the source interview behavior into `devflow-brainstorm` instead of copying source skills or keeping separate runtime concepts. Reason: the useful behavior is one-question interview discipline plus docs landing decisions; `devflow-spec` remains the saved-requirements node before plan/cut/build when needed.
- 2026-07-02: Add Depth Selection Gate (A/B/C) to `devflow-brainstorm` instead of only offering spec-vs-plan at the end. Reason: users need to choose design depth early so the flow and confirmation count are determined upfront; C path allows lightweight dialogue-only confirmation for small low-risk changes while still requiring Core Clarification.
- 2026-07-08: Make First Principles Cut explicit as 第一性原理 in Brainstorm/Core and add adversarial review (对抗式审查) to Prove before completion. Reason: problem solving (问题解决), 修 bug, and architecture design (架构设计) need a visible way to reduce assumptions to facts and invariants, and completion proof needs a required disproof pass before done/fixed/ready claims.
- 2026-07-13: Bind First Principles Cut and adversarial review to executable command and validation contracts instead of relying on skill text alone. Reason: v31 documented the behavior, but `/devflow-prove`, flow self-tests, trigger verification, and host verification could still pass without proving the required actions were reachable or capable of rejecting completion.
- 2026-07-14: Surface First Principles Cut and adversarial review in `AGENTS.md`, primary host rules, and the `devflow-prove` description/output contract. Reason: some hosts may only see the runtime rule file or skill description; generic “Prove” wording was insufficient to guarantee the stronger method and completion gates were loaded.
- 2026-07-14: Synchronize the method/proof contract across every route and host entry instead of only primary rules. Reason: `/devflow`, Claude, Copilot, VS Code, CodeBuddy, and SessionStart had completion blocks that could omit adversarial review even when `devflow-prove` required it.
- 2026-07-14: Document sync scope and merge guidance instead of adding speculative automatic text merges. Reason: user-level skills/commands/scripts and target-project host rules have different ownership; generic merging of `AGENTS.md` or host rules can silently discard project constraints, while the current installer only safely merges Claude SessionStart settings.
- 2026-07-14: Prefix saved specs and plans with their creation date and resolve the default paths from the current target project root. Reason: date-prefixed artifacts are easier to scan and avoid ambiguous repeated names across project history without introducing a new artifact directory or generator.

## Known Constraints

- Codex may only reliably see `AGENTS.md`, skill descriptions, and command text unless local files are read explicitly.
- `docs/features/*` is product memory; agents must still read current files and tests before making conclusions.
- Feature ledgers do not replace `.copilot` learning cards. Ledgers track product capability evolution; learning cards track recurring mistakes and user corrections.
- A ledger update can only claim a capability change after the relevant validation command passes.
- `npm run learn:verify` is a no-mutation closure check; live agents still create or update learning cards through `devflow-learn`.
- `npm run scenario:coverage` maps scenarios by keywords; it is a visibility report, not proof that every behavior is fully automated.
- `npm run trigger:verify` validates visible trigger evidence, not actual host-specific skill loading.
- README workflows are copyable examples; they do not replace project-specific Sense and verification.
- The installer overwrites files only when both `--write` and `--force` are passed; it does not merge with existing project-specific rules.
- The installer copies the runtime pack, not all source-package references; source-only references stay validated in this repository.
- `--check` compares installed runtime files byte-for-byte against this package; it reports intentional target-local edits as changed rather than trying to merge or judge them.
- The user-level installer does not install `AGENTS.md`, `CLAUDE.md`, or host rule files; it only installs `skills/`, `commands/`, and `scripts/devflow-*.js`.
- `scripts/devflow-debt.js` reports marker gaps; it does not rewrite source files or persist a debt ledger unless a user explicitly asks for that later.
- `scripts/devflow-review.js` checks gate presence only; it does not judge code correctness or replace detailed review findings.
- `scripts/devflow-plan.js` checks whether a plan pack has executable task fields; it does not generate plans or judge architecture correctness.
- `scripts/devflow-spec.js` checks required sections, vague terms, and landing path; it does not generate requirements or replace human/agent design judgment.
- `scripts/devflow-audit.js` reports heuristic overengineering candidates only; important findings still require code reads before editing or claiming removable code.
- Skill Activation Chain Check validates visible trigger and handoff evidence; it does not prove live host skill loading.
- Validation harness details are tracked in `docs/features/validation-harness.md`; this ledger stays focused on runtime flow boundaries.
- Method Lens is a strategy selector for existing routes; First Principles Cut (第一性原理) may guide problem solving (问题解决), 修 bug, and architecture design (架构设计), but it must not reintroduce PUA flavor personas, pressure rhetoric, hook lifecycle, leaderboard mechanics, or full OpenSpec as defaults.
- Design-lite is not a bypass for requirements. It is only for small features with clear behavior, one plausible path, low risk, local impact, and quick proof; ambiguous boundaries require user route choice.
- Claude Code hooks only inject route reminders at SessionStart. The installer merges the project hook into existing `.claude/settings.json` instead of replacing project permissions. Hooks do not prove a target project feature, run tests automatically, or replace `devflow-prove`.
- `/devflow-core` is the Claude Code command bridge; `commands/devflow.toml` remains the generic command metadata for other command-capable hosts.
- Saved implementation plans default to `docs/plans/YYYY-MM-DD-<short-kebab-name>.md`; `docs/features/` remains reserved for feature ledgers.
- Saved specs default to `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`; specs are optional for Design-lite and required only when the request asks for a spec or the work is too large for a short design contract.

## Related Artifacts

- PRD: `docs/PRD.md`
- Runtime source: `skills/devflow-core/references/core-methods.md`
- Router skill: `skills/devflow-core/SKILL.md`
- Spec skill: `skills/devflow-spec/SKILL.md`
- Pressure recovery skill: `skills/devflow-pua/SKILL.md`
- PUA methodology router: `skills/devflow-pua/references/methodology-router.md`
- PUA methodology library: `skills/devflow-pua/references/methodology-library.md`
- PUA flavor display: `skills/devflow-pua/references/flavor-display.md`
- Repo audit skill: `skills/devflow-audit/SKILL.md`
- Brainstorm interview discipline reference: `skills/devflow-brainstorm/references/interview-discipline.md`
- Proof skill: `skills/devflow-prove/SKILL.md`
- Self-tests: `skills/devflow-prove/references/flow-self-test.md`
- Validation: `scripts/validate-devflow.js`
- Learning-loop validation: `scripts/validate-learning-loop.js`
- Scenario coverage: `scripts/report-scenario-coverage.js`
- Trigger validation: `scripts/validate-skill-triggers.js`
- Installer: `scripts/install-devflow.js`
- User installer: `scripts/install-devflow-user.js`
- Claude hook config: `hooks/hooks.json`
- Claude hook script: `hooks/devflow-session-start.js`
- Claude project hook settings: `.claude/settings.json`
- Claude command: `.claude/commands/devflow-core.md`
- Plan checker: `scripts/devflow-plan.js`
- Spec checker: `scripts/devflow-spec.js`
- Audit scanner: `scripts/devflow-audit.js`
- Validation harness ledger: `docs/features/validation-harness.md`
- Learning index: `.copilot/LEARNING_INDEX.md`
