# DevFlow Brainstorm Superpowers-Style Interaction Plan

Source: docs/specs/2026-07-17-devflow-brainstorm-superpowers-interaction.md

Spec coverage: Requirements 1 through 7 map to Task 1. Requirement 8 maps to Task 2. Requirement 9 maps to Task 3. Acceptance criteria 1 through 9 map to Task 4.

Task: Rebuild the Brainstorm conversation workflow
Files: skills/devflow-brainstorm/SKILL.md
Acceptance: The skill has one authoritative flow: read context, frame goal and Small Request Boundary, stop for user-selected A/B/C depth, ask one progressive question at a time with a recommendation, compare approaches when multiple paths exist, present confirmed design sections, collect final design-contract approval, then use the existing depth handoff. It preserves the hard gate, Core Clarification coverage, Feature Ledger recall, Method Lens, First Principles Cut, recovery behavior, A/B self-review, anti-rationalization checks, and the required `Goal`, `Smallest useful plan`, `Not doing`, `Impact`, and `Verification` contract.
Verify: Inspect the rewritten workflow and output contracts; run a manual A multi-path, B clear-scope, and C low-risk conversation trace; run the applicable skill validation.
Not doing: Changing A/B/C meanings, entering implementation from Brainstorm, changing other DevFlow skill responsibilities, or importing Superpowers infrastructure.

Task: Add visual-expression decision guidance
Files: skills/devflow-brainstorm/SKILL.md
Acceptance: The skill directs agents to use or offer visual expression only for a question whose answer is clearer as a mockup, diagram, layout, or visual comparison, while keeping conceptual questions and tradeoff lists in text. The guidance explicitly prohibits adding a visual companion, browser server, scripts, state, or `.superpowers/` artifacts.
Verify: Inspect the visual-expression section and search the changed Brainstorm files for browser-service, script, and `.superpowers/` references; expect no implementation artifacts.
Not doing: Building, invoking, copying, or documenting an executable visual companion.

Task: Align the interview discipline reference
Files: skills/devflow-brainstorm/references/interview-discipline.md
Acceptance: The reference retains one-question-at-a-time, recommended answers, dependency ordering, fact-first discovery, and DevFlow handoff behavior. It adds concise guidance and output shapes for progressively confirmed design sections without restating the entire Brainstorm workflow.
Verify: Compare the reference with `SKILL.md`; confirm the section-confirmation guidance is present, the full workflow is not duplicated, and A/B/C handoff remains consistent.
Not doing: Creating a second routing flow, changing documentation landing rules, or duplicating the primary skill's safeguard tables.

Task: Validate interaction and skill contract
Files: skills/devflow-brainstorm/SKILL.md, skills/devflow-brainstorm/references/interview-discipline.md
Acceptance: Static inspection proves context-first behavior, pre-clarification A/B/C selection, progressive one-question output, approach comparison, section-by-section confirmation, final design contract, correct A/B/C handoffs, and preserved safeguards. Scenario traces prove no depth handoff enters Build directly and no new visual runtime surface exists.
Verify: Run `node scripts/devflow-plan.js docs/plans/2026-07-17-devflow-brainstorm-superpowers-interaction.md`, `npm test`, `git diff --check`, the three-scenario checklist, and targeted searches for `.superpowers/` and visual-service artifacts.
Not doing: Claiming behavior outside the skill contract or changing unrelated runtime prompts, commands, scripts, or skills.
