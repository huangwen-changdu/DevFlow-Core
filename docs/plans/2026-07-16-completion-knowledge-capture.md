# Completion Knowledge Capture Plan

Source: docs/specs/2026-07-16-completion-knowledge-capture.md

Spec coverage: Requirements 1, 2, 10, and 11 map to Task 1. Requirements 3, 4, 5, and 10 map to Task 2. Requirements 6, 7, 8, and 11 map to Task 3. Requirement 10 maps to Task 4. Acceptance criteria 1 through 7 map to Task 5.

Task: Require proactive review after verified completion
Files: skills/devflow-prove/SKILL.md, skills/devflow-core/SKILL.md, AGENTS.md
Acceptance: Every `devflow-prove` `PASS` routes to a lightweight `devflow-learn` review before final completion reporting. The route explicitly distinguishes mandatory review from conditional record creation and names the downstream project-knowledge confirmation handoff.
Verify: Inspect the `PASS` flow in all three files and run the relevant repository skill validation.
Not doing: Changing `devflow-prove` proof authority, triggering review on `FAIL` or `BLOCKED` beyond existing recovery behavior, or adding automation.

Task: Define useful-record extraction in DevFlow Learn
Files: skills/devflow-learn/SKILL.md
Acceptance: The skill requires proactive extraction from successful and failed paths after each `PASS`, covering reusable implementation or reuse patterns, constrained decisions, effective validation methods, repository conventions, invariants, and business-fact candidates. It creates or updates one focused card only when the extracted knowledge has future-task value; it reports an explicit no-record result otherwise.
Verify: Inspect the extraction criteria, decision table, closure format, and checklist against the ordinary-refactor and successful-reusable-pattern scenarios.
Not doing: Logging raw implementation narration, creating a card for every verified task, or replacing correction/recovery learning rules.

Task: Establish project-knowledge candidate handoff
Files: skills/devflow-learn/SKILL.md, skills/devflow-project-knowledge/SKILL.md
Acceptance: Confirmed changes to domain semantics, rules, boundaries, entity/API/table meaning, module responsibility, job behavior, or task entry points are reported as candidates. The knowledge package changes only after explicit user confirmation, then `devflow-project-knowledge` owns code-backed business-fact documentation and existing registry/index/change-log duties.
Verify: Inspect both skills against the business-semantic-change scenario and confirm pure refactors remain excluded.
Not doing: Auto-updating `docs/project-knowledge/`, storing execution lessons in the knowledge package, or changing graphify output.

Task: Publish three-layer responsibility boundary
Files: skills/devflow-learn/SKILL.md, skills/devflow-project-knowledge/SKILL.md, skills/devflow-core/SKILL.md
Acceptance: All relevant skills consistently identify `graphify-out/` as structural graph data, `.copilot/cards/` as execution experience and reusable work patterns, and `docs/project-knowledge/` as curated business facts. No skill creates a circular handoff or assigns the same record type to two stores.
Verify: Search the touched skill files for all three paths and manually trace `devflow-prove -> devflow-learn -> devflow-project-knowledge`.
Not doing: Moving existing records, merging stores, or introducing a new knowledge system.

Task: Validate skill activation and scenarios
Files: skills/devflow-prove/SKILL.md, skills/devflow-learn/SKILL.md, skills/devflow-core/SKILL.md, skills/devflow-project-knowledge/SKILL.md, AGENTS.md
Acceptance: Required wording permits a natural completion claim to reach `devflow-prove`, its `PASS` flow reaches `devflow-learn`, and a confirmed project-knowledge candidate reaches `devflow-project-knowledge`. Scenario review demonstrates: ordinary refactor yields no record; a successful reusable practice yields one card; a pitfall yields one card; and a semantic change waits for confirmation.
Verify: Run applicable repository validation, `node scripts/devflow-plan.js docs/plans/2026-07-16-completion-knowledge-capture.md`, `git diff --check`, and the documented four-scenario checklist.
Not doing: Claiming runtime enforcement beyond the declared skill and prompt contracts.
