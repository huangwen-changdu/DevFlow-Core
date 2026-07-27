# Implementation Plan: Completion Document Follow-Up Skill

Source: approved design contract in the current task
Spec coverage: The approved design maps to Task 1 (completion-time user inquiry and three document types), Task 2 (independent skill distribution), Task 3 (trigger and installer proof), and Task 4 (validated feature-ledger update).

Task: Add the independent completion document follow-up skill
Files: skills/devflow-docs-followup/SKILL.md, skills/devflow-docs-followup/agents/openai.yaml, AGENTS.md, skills/skill-call-diagram.md
Acceptance: A verified feature-completion rule loads devflow-docs-followup without modifying devflow-prove or devflow-learn; the skill asks the current Codex user once to select technical solution, frontend API handoff, feature-flow troubleshooting, or none; it generates only explicitly confirmed document types from evidence and supplies the three approved minimum outlines and fallback paths.
Verify: node scripts/validate-skill-triggers.js
Comments: none - Markdown runtime instructions and declarative rule text only.
Not doing: modifying devflow-prove or devflow-learn; generating documents before a user chooses; adding scripts, dependencies, or a generic document framework.

Task: Register the skill in distributable runtime surfaces
Files: plugin.json, gemini-extension.json, scripts/install-devflow.js, scripts/install-devflow-user.js
Acceptance: Plugin metadata includes skills/devflow-docs-followup/SKILL.md and both installers copy its SKILL.md plus agents/openai.yaml, so target-project and user-level installations receive the same independent skill and UI metadata.
Verify: node scripts/validate-installer.js and node scripts/validate-user-installer.js
Comments: none - existing declarative manifests and entry arrays receive one new path.
Not doing: adding a new command, installer mode, or installation destination.

Task: Add activation and packaging regression coverage
Files: scripts/validate-devflow.js, scripts/validate-skill-triggers.js, scripts/validate-installer.js, scripts/validate-user-installer.js
Acceptance: Static validation requires the new skill file and valid trigger description; trigger validation proves the AGENTS completion handoff and the no-automatic-generation rule; installer tests prove both temporary runtimes receive the new skill.
Verify: npm test and npm run trigger:verify and npm run install:verify and npm run user:verify
Comments: none - extend existing validation fixtures and assertions without adding control flow.
Not doing: weakening existing checks or claiming live host-specific automatic discovery beyond static trigger evidence.

Task: Record the validated capability change
Files: docs/features/devflow-core.md
Acceptance: After the verification suite passes, the feature ledger records the independent completion-document follow-up skill, its explicit-confirmation boundary, and its distribution surfaces.
Verify: npm run verify:all
Comments: none - feature ledger entry only.
Not doing: creating the selected technical, API-handoff, or troubleshooting documents during this framework change.
