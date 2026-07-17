# DevFlow Brainstorm Superpowers-Style Interaction

## Goal

Make `devflow-brainstorm` guide requirements and design conversations in a progressive, natural interaction style modeled on Superpowers brainstorming, while retaining DevFlow's A/B/C depth-selection gate and its existing `devflow-spec`, `/devflow-plan`, and `devflow-cut` handoffs.

## Context

`skills/devflow-brainstorm/SKILL.md` already requires context discovery, a user-selected A/B/C depth, one-question-at-a-time clarification, approach comparison, a design contract, and a depth-based handoff. Its current ordering and extensive duplicated gate language make the interaction feel procedural rather than a progressive design dialogue.

Superpowers `skills/brainstorming/SKILL.md` provides a useful interaction shape: explore the current project, clarify one decision at a time, compare alternatives, present the design in confirmed sections, then review a written specification before planning. Its browser-based visual companion, scripts, and `.superpowers/` state are out of scope for DevFlow.

## Requirements

1. Reorganize `devflow-brainstorm` around this interaction sequence:
   1. Read the relevant project context, including rules, related source/docs/tests, and a matching Feature Ledger when it exists.
   2. Frame the goal and evaluate the Small Request Boundary.
   3. Present the A/B/C Depth Selection Gate before clarification; wait for the user's explicit selection and do not select a depth on the user's behalf.
   4. Run progressive clarification: ask exactly one smallest blocking question per message, include a recommended answer, and prefer repository facts over questions when facts answer the point.
   5. Compare two or three materially different approaches when the selected scope has multiple plausible paths; for a genuinely single-path low-risk case, state why divergence is unnecessary.
   6. Present the proposed design in small sections scaled to the work, and wait for confirmation after each section before presenting the next.
   7. Summarize the approved sections as the existing DevFlow design contract and wait for final approval.
   8. Apply the existing depth-based handoff without directly entering implementation.
2. Preserve the current depth meanings and downstream chain exactly:
   - A: approved design → `devflow-spec` → `/devflow-plan` → `devflow-cut`.
   - B: approved design → `/devflow-plan` → `devflow-cut`.
   - C: approved design → `devflow-cut`.
3. Preserve the mandatory Core Clarification coverage of goal, constraints, and acceptance for every depth, including C. Ask only the smallest unresolved question; do not ask questions that project facts answer.
4. Define a concise progressive-question output that includes the question, recommended answer, and why the decision is needed now.
5. Define a design-section output that names the section, describes the proposed decision, and asks for confirmation before continuing. The default sections must cover, as applicable: scope and goals; interaction or implementation design; error handling and verification.
6. Preserve the existing required final design contract fields: `Goal`, `Smallest useful plan`, `Not doing`, `Impact`, and `Verification`.
7. Preserve existing DevFlow safeguards: the hard gate against implementation before design approval, Feature Ledger recall, First Principles Cut where applicable, Method Lens, recovery re-ask behavior, design self-review for A/B, and anti-rationalization checks.
8. Add a visual-interaction principle only: offer or use a visual expression when a specific question is genuinely clearer as a mockup, diagram, layout, or visual comparison; use text for conceptual questions and tradeoff lists. Do not add a browser companion, server, scripts, state directories, or any `.superpowers/` artifacts.
9. Update `references/interview-discipline.md` only where needed to align it with progressive design-section confirmation and the revised output shapes. Do not duplicate the full workflow between the reference and `SKILL.md`.

## Non-goals

- Do not copy or invoke Superpowers browser companion infrastructure, including server scripts, browser tabs, event files, or `.superpowers/` directories.
- Do not change the responsibilities or output contracts of `devflow-spec`, `/devflow-plan`, `devflow-cut`, `devflow-build`, or `devflow-prove`.
- Do not remove the A/B/C gate, reduce its confirmation requirements, or permit Brainstorm to choose a depth itself.
- Do not add dependencies, commands, generated files, or generic interaction frameworks.
- Do not refactor unrelated DevFlow skills or runtime prompts.

## Approach

Update the existing `devflow-brainstorm` skill in place rather than copying Superpowers wholesale.

1. Replace duplicated linear flow and repeated handoff descriptions with one authoritative progressive conversation workflow.
2. Make the A/B/C gate an early, explicit stop point, then retain the selected depth as state for the remainder of the conversation.
3. Use progressive section confirmation after the approach comparison, then consolidate those approved decisions into the current final design contract.
4. Keep detailed interviewing mechanics in `references/interview-discipline.md`; keep `SKILL.md` focused on the executable workflow, stop gates, output contracts, safeguards, and depth handoff.
5. Add only the principle for deciding text versus a visual representation; no implementation of a visual companion is needed.

## Impact

- `skills/devflow-brainstorm/SKILL.md`: primary interaction workflow, stop gates, outputs, visual-expression principle, and final verification checklist.
- `skills/devflow-brainstorm/references/interview-discipline.md`: focused interview and section-confirmation guidance aligned with the primary workflow.

## Acceptance

1. The skill directs an agent to read project context before design decisions and to offer A/B/C before any clarification question.
2. A simulated requirement conversation asks one question per message, contains a recommended answer, and uses facts instead of asking fact-answerable questions.
3. A multi-path request yields two or three approaches with tradeoffs and a recommendation before design sections are proposed.
4. The proposed design is presented incrementally and requires confirmation after each relevant section, then requires final design-contract approval before handoff.
5. The final design contract still has `Goal`, `Smallest useful plan`, `Not doing`, `Impact`, and `Verification`.
6. The depth handoffs are explicitly correct and preserve A → Spec → Plan → Cut, B → Plan → Cut, and C → Cut.
7. The skill still forbids implementation before final design approval and preserves Feature Ledger, Method Lens, First Principles Cut, recovery, and A/B self-review safeguards.
8. `references/interview-discipline.md` supports section-by-section confirmation without duplicating the entire `SKILL.md` workflow.
9. The changed files do not introduce a visual service, script, `.superpowers/` directory, dependency, command, or browser-state mechanism.

## Verification

- Run `node scripts/devflow-spec.js docs/specs/2026-07-17-devflow-brainstorm-superpowers-interaction.md`.
- Inspect `skills/devflow-brainstorm/SKILL.md` and `skills/devflow-brainstorm/references/interview-discipline.md` for the required interaction sequence, one-question contract, section-confirmation contract, A/B/C handoff chain, and preserved safeguards.
- Run a focused scenario checklist for a multi-path A request, a clear B request, and a low-risk C request; verify all three produce the expected handoff and no implementation action.
- Search the changed paths for Superpowers browser-service references, `.superpowers/`, or newly added script references; expect no implementation artifacts.
- Run the repository's relevant skill validation after implementation.

## Open Questions

None.
