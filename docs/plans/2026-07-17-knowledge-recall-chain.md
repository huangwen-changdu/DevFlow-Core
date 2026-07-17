# Knowledge Recall Chain Plan

Source: `docs/specs/2026-07-17-knowledge-recall-chain.md`

Spec coverage: Requirements 1-7 establish selective recall, storage ownership, lazy creation, reachable handoff, evidence, and validation.

Task: Define progressive recall at runtime entry

Files: `AGENTS.md`, `CLAUDE.md`, `commands/devflow.toml`, `.github/copilot-instructions.md`, `.github/instructions/devflow.instructions.md`, `.github/prompts/devflow.prompt.md`, `.codebuddy/rules/devflow-core/RULE.mdc`, `.claude/commands/devflow-core.md`, `hooks/devflow-session-start.js`

Acceptance: Every shipped task entry directs normal DevFlow work to probe existing learning and project-knowledge locations before routing; it states selective recall and non-blocking absence without duplicating detailed retrieval algorithms.

Verify: `npm test` and `npm run trigger:verify`

Not doing: Adding automatic directory creation, scanning knowledge stores, or copying long retrieval procedure text into every host adapter.

Task: Establish detailed recall and ownership contracts

Files: `skills/devflow-core/SKILL.md`, `skills/devflow-core/references/core-methods.md`, `skills/devflow-learn/SKILL.md`, `skills/devflow-project-knowledge/SKILL.md`, `commands/devflow-learn.toml`

Acceptance: Core context mapping reads learning index then matched cards and business navigation then registry-directed documents only. The two knowledge skills define lazy creation, ownership, candidate confirmation, evidence outputs, and no bulk-load behavior consistently.

Verify: `npm test`, `npm run learn:verify`, and `npm run trigger:verify`

Not doing: New retrieval scripts, vector search, automatic business-fact promotion, or moving graphify data into either knowledge layer.

Task: Ship project-knowledge maintenance with installed runtimes

Files: `plugin.json`, `gemini-extension.json`, `scripts/install-devflow.js`, `scripts/install-devflow-user.js`, `scripts/validate-installer.js`, `scripts/validate-user-installer.js`

Acceptance: Plugin metadata and both installers include `skills/devflow-project-knowledge/SKILL.md`; installer regression checks prove it is present in target and user installation outputs.

Verify: `npm run install:verify` and `npm run user:verify`

Not doing: Installing target-project knowledge records, creating target knowledge directories, or changing installer overwrite and merge policy.

Task: Prove recall and handoff behavior

Files: `scripts/validate-learning-loop.js`, `scripts/validate-skill-triggers.js`, `scripts/validate-devflow.js`, `skills/devflow-prove/references/flow-self-test.md`, `docs/features/devflow-core.md`

Acceptance: Existing checks prove progressive disclosure, lazy-creation boundaries, `devflow-learn` to user-confirmed `devflow-project-knowledge` handoff, and published runtime coverage. The feature ledger records this capability only after validation passes.

Verify: `npm test`, `npm run learn:verify`, `npm run trigger:verify`, `npm run install:verify`, `npm run user:verify`, and `npm run verify:all`

Not doing: Claiming live agent adherence from static validation or introducing runtime telemetry.
