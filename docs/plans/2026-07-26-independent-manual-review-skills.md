# Independent Manual Review Skills Plan

Source: docs/specs/2026-07-26-independent-manual-review-skills.md

Spec coverage: Requirements 1 through 6 map to Tasks 1 and 2. Requirement 7 maps to Task 3. Requirement 8 maps to Tasks 3 and 4. Acceptance criteria map across Tasks 1 through 5.

Task: Define independent manual review contracts
Files: skills/devflow-adversarial/SKILL.md, skills/devflow-find-fault/SKILL.md
Acceptance: Both skills are explicitly user-invoked, independent of lifecycle state and other skills, and never modify code or invoke another skill. Adversarial review covers all five attack dimensions. Find-fault review covers its three default questions and user-supplied questions, with facts, inference, unknowns, confidence, and a next step for every answer. Both classify findings, evidence, confidence, and limitations without a global verdict.
Verify: Inspect both frontmatter descriptions and required output sections, then run npm run trigger:verify.
Comments: none - Markdown contracts use explicit headings and output fields.
Not doing: Reading or changing devflow-prove, devflow-learn, devflow-pua, Build, or completion state.

Task: Add explicit manual commands
Files: commands/devflow-adversarial.toml, commands/devflow-find-fault.toml
Acceptance: Each slash command loads only its matching manual skill, preserves the no-automatic-action boundary, and exposes its required output contract.
Verify: Run npm run trigger:verify and inspect both TOML prompts.
Comments: none - TOML prompt text is the executable command contract.
Not doing: Adding a hook, scheduled execution, or command-side code mutation.

Task: Route explicit natural-language requests
Files: AGENTS.md, CLAUDE.md, skills/devflow-core/SKILL.md, commands/devflow.toml, .github/copilot-instructions.md, .github/instructions/devflow.instructions.md, .github/prompts/devflow.prompt.md, .codebuddy/rules/devflow-core/RULE.mdc, .claude/commands/devflow-core.md, hooks/devflow-session-start.js
Acceptance: Explicit Chinese and English requests for adversarial review or find-fault load the matching independent skill directly. Ambiguous review requests retain existing routing. No route introduces a lifecycle prerequisite or automatic handoff.
Verify: Run npm run trigger:verify and npm run host:verify.
Comments: none - prompt entries remain concise runtime routing rules.
Not doing: Rewriting existing completion, recovery, or documentation-follow-up rules.

Task: Package independent runtime files
Files: plugin.json, gemini-extension.json, scripts/install-devflow.js, scripts/install-devflow-user.js, scripts/validate-devflow.js, scripts/validate-installer.js, scripts/validate-user-installer.js, scripts/validate-host-adapters.js
Acceptance: Plugin manifests and both installers contain all four new runtime files. Static validators assert the new skills, commands, host reachability, and installed file presence.
Verify: Run npm test, npm run host:verify, npm run install:verify, and npm run user:verify.
Comments: none - follow existing list and assertion patterns.
Not doing: Adding installers, package dependencies, or user-level project rules.

Task: Record scenarios and capability history
Files: skills/devflow-prove/references/flow-self-test.md, scripts/validate-skill-triggers.js, scripts/capability-eval-scenarios.json, docs/features/devflow-core.md
Acceptance: Framework scenarios prove independent invocation, fixed review coverage, no lifecycle dependency, and no automatic actions. The feature ledger records the new capability and its boundary.
Verify: Run npm run trigger:verify, npm run capability:verify, npm run capability:eval, npm run verify:all, and git diff --check.
Comments: none - scenarios and ledger entries are declarative evidence.
Not doing: Treating static validation as proof of live host skill loading.
