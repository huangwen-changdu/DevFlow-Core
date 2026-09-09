---
name: devflow-brainstorm
description: "Use when devflow-core sends ambiguous or materially risky creative work for clarification — creating features, building components, adding functionality, modifying behavior, or defining a problem-directed change. Clarifies intent through a semantic echo-back, runs risk-relevant problem-space exploration, and stops after a fixed Confirmed request summary and explicit A/B/C depth gate. Do NOT use it for clear low-risk existing behavior, pure Q&A, lookup, verification, or an already approved change; do NOT select a route or depth, produce implementation designs, or hand off except through the user-selected predefined direct branch."
---

# DevFlow Brainstorm

Explore **what** the user wants as a true brainstorming partner. Do not decide **how** DevFlow should proceed or **how** the solution should be built. Liveliness comes from depth of thinking — proactive analysis, gap-finding, and recommendations — never from loosening the process discipline.

## Responsibility Boundary

This skill owns only:

- minimal fact reading needed to understand the request;
- Semantic Echo-Back and understanding correction;
- Core-selected, risk-relevant problem exploration: surfacing gaps, risks, blind spots, and unstated assumptions in the user's request;
- ideas, suggestions, and direction recommendations inside the problem space;
- one-at-a-time clarification of goal, scope, exclusions, constraints, acceptance, and real open questions;
- the fixed `Confirmed request` summary.
- an explicit A/B/C depth gate after the summary, followed only by the user-selected direct branch.

Use `references/interview-discipline.md` for the Semantic Echo-Back, multi-angle checklist, recommendation boundary, one-question discipline, and fixed-summary forms.

`devflow-core` owns routing for missing depth, exceptions, and non-unique artifacts. `devflow-spec` owns solution-space design contracts. `devflow-cut`, `devflow-plan`, `devflow-build`, `devflow-prove`, `devflow-pua`, and `devflow-docs-followup` retain their own responsibilities.

## Entry And Stop Condition

Enter only when `devflow-core` has identified ambiguity or material risk that needs clarification. Core may bypass this skill for a clear, reversible, local existing-feature change with one plausible path, no security/data-loss/permission/contract risk, and quick proof.

After producing the fixed summary, present the A/B/C gate and wait for user selection. Start A at `devflow-spec` and B/C at `devflow-cut` only after the user chooses. Do not select Fast, Design-lite, a depth, an approach, or a method on the user's behalf. Do not create design sections, a design contract, documentation, or a visual artifact.

## Clarification Depth

Core supplies a depth hint after selecting this skill. Depth governs **analysis breadth only**. It never skips the echo-back, the confirm gates, the question discipline, or the recommendation duty. Compact mode is analysis compression, not permission to skip confirmation.

| Tier | Use when | Behavior |
|---|---|---|
| `compact` | Core has established clear goal, scope, constraints, acceptance, and a bounded material-risk reason. | Echo-back, risk/edge/acceptance check, only decision-impact questions, and fixed summary; record non-blocking angles as `none`. |
| `standard` | Core identifies several relevant uncertainties or interacting impacts without full architecture ambiguity. | Run fitting angles with trade-offs and recommendation; every other duty unchanged. |
| `deep` | Ambiguous, high-risk, cross-module, externally visible, irreversible, security-sensitive, data-loss-sensitive, or contract-changing work. | Full multi-angle checklist with per-angle findings, gap/risk surfacing, direction options with trade-offs, and recommendation. |

If no decision-impact gap remains after the supplied facts and echo-back, ask no clarification question. Still produce the fixed summary and wait for confirmation and A/B/C.

## Clarification Process

1. **Read facts first.** Inspect the smallest useful project files, documentation, configuration, tests, and existing behavior. State facts instead of asking questions that those facts answer.
2. **Semantic Echo-Back.** The first user-facing message confirms the current understanding and ends with one explicit confirm-or-correct question. Include all fields below, even when a field is `none`.

   ```text
   My understanding:
   - Problem to solve: <one sentence in the user's language>
   - Known facts/constraints: <facts read, or none>
   - NOT what you want: <likely misreading ruled out, or none>
   - My assumptions (that could be wrong): <inferences, or none>
   - Understanding gaps: <specific ambiguity, or none>
   Is this right? (correct me / confirm)
   ```

3. **Wait.** Do not ask a process question or make a lifecycle decision before the user confirms or corrects the echo-back.
4. **Clarify one decision-impact gap at a time.** Ask only the smallest unresolved question whose answer could change scope, a constraint, acceptance, or a subsequent problem-space decision. Resolve qualifying gaps in this order: goal ambiguity, scope boundary, exclusion, constraint, acceptance, then any remaining open question. Do not ask merely because a category is unfilled: record a fact-backed `none` or non-blocking unknown instead. Every question carries a recommended answer and why the answer matters.

   ```text
   Question: <one question>
   Recommended answer: <answer and rationale>
   Why now: <risk or dependency resolved>
   ```

5. **Revalidate every answer.** Before asking the next question, compare the answer with confirmed facts and the current request. If it introduces a load-bearing assumption, exposes a contradiction, or changes goal, scope, exclusion, constraint, acceptance, terminology, or actor, apply the Understanding Revision Rule. Otherwise record the answer and continue only when another decision-impact gap remains.
6. **Explore the problem.** In `compact`, run only risk, edge, impact, and acceptance checks; in `standard`, run fitting angles; in `deep`, walk the full checklist from the reference. Report negative findings, name gaps and risks, offer directions with trade-offs, and recommend one inside the problem space. If exploration exposes a new decision-impact gap, return to step 4 and resolve it one question at a time before finishing.
7. **Finish.** When no decision-impact gap remains and every non-blocking unknown is recorded, output the fixed summary, present the A/B/C gate, and wait. On user selection, follow only the corresponding predefined direct branch.

## Problem-Space Recommendation

Brainstorming is active, not passive recording. Inside the problem space this skill must:

- point out gaps, contradictions, risks, and missing stakeholders in the request;
- lay out directions the user has not considered, with trade-offs;
- recommend a direction and explain why;
- record considered-and-rejected directions with their reasons.

Stop line: when the discussion turns to **how to build** — technical selection, structure, contracts, or steps — record the need and hand it to `devflow-spec` through the summary. Test: a statement answering "what to do / why / what not to do / what could go wrong" belongs here; a statement answering "how to implement" belongs to spec.

Brainstorm suggestions are disposable conversation material that helps the user decide what they want; a spec design contract commits to how it gets built.

## Understanding Revision Rule

A user correction is not permission to continue from the previous question chain. If the correction changes the goal, scope, exclusion, constraint, acceptance, terminology, actor, or any assumption that affects the request:

1. stop the current clarification question;
2. replace superseded facts and assumptions with the corrected understanding;
3. send a complete updated Semantic Echo-Back, including any new gaps;
4. wait for explicit confirmation or another correction; and
5. only then resume one-at-a-time clarification or produce `Confirmed request`.

A correction that changes nothing above may receive a direct one-line acknowledgement, but it must not be treated as a confirmed request. Do not silently merge a correction into the next question or the fixed summary.

## Clarification Rules

- One user question per message; wait for the answer before the next question.
- Treat business intent, user-visible scope, and ambiguous terms as questions; do not infer them from code.
- Ask no question whose answer is unambiguous in project facts.
- Match the user's language and terminology. Name a new technical term only when precision needs it.
- For vague quantifiers, implicit scope, pronouns, missing actors, unstated constraints, solution-as-goal language, missing context, and ambiguous boundaries, name the specific ambiguity in the echo-back or next question.
- A request already clear after the echo-back needs no additional questions; the multi-angle exploration still runs and its findings still reach the summary.
- Required formats (echo-back fields, question block, fixed summary) are mandatory. Wording inside them may be natural and conversational; the structures may not be skipped or abbreviated.

## Fixed Output Contract

```text
Confirmed request:
- Goal: <user outcome>
- Scope: <included behavior and surfaces>
- Out of scope: <explicit exclusions>
- Constraints: <must-not-change conditions, or none>
- Acceptance: <observable proof of success>
- Identified gaps/risks: <holes, risks, and blind spots surfaced during exploration, or none>
- Directions considered: <directions discussed with trade-offs, including rejected ones, or none>
- Recommended direction: <recommendation and rationale within the problem space, or none>
- Open questions: <none or unresolved blocker>
- Status: clarified
```

The summary records the agreed request and the exploration findings only. It must not contain an implementation plan, solution-space design, lifecycle route, or handoff instruction. It is the factual basis that downstream skills — starting with `devflow-spec` — build on, so record findings faithfully rather than trimming them away.

On `Status: clarified`, create or update the requirement row in `docs/requirements.md` with status `open`; depth is recorded when the lifecycle path is chosen. Pure Q&A, lookup, and read-only verification create no row.

## A/B/C Gate

After the fixed summary, present these choices and wait for one explicit user selection:

On DeepSeek Harness (DSH), present the gate through the structured `ask_user_question` tool as one single-select question with options A / B / C.

| Depth | User-selected outcome | Direct start after selection |
|---|---|---|
| A | Full design contract and implementation plan | `devflow-spec` |
| B | Implementation plan without a saved Spec | `devflow-cut` |
| C | Smallest approved change without a Plan Pack | `devflow-cut` |

Record `Depth: A`, `Depth: B`, or `Depth: C` with the selected branch input. Do not infer depth from request size. A missing or changed selection returns the relevant facts to `devflow-core`.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The request is obvious, so skip the echo-back." | Hidden assumptions cause changed-wrong work. Echo the understanding first. |
| "The request looks simple, so skip the analysis." | Simple-looking requests hide the most assumptions. Walk the checklist; reporting "nothing found" is cheap. |
| "I can choose the depth while clarifying." | Recommendations stop at the problem space. The user selects A/B/C; the selected branch starts directly. |
| "Several questions save time." | One question at a time makes the answer unambiguous. |
| "Code reveals business intent." | Code shows current behavior, not the desired outcome. Confirm intent. |
| "A design contract is a better summary." | A design contract decides how; this skill records what plus exploration findings. |
| "The user corrected one detail, so continue silently." | Re-echo the corrected understanding before proceeding. |
| "Formats are optional when the conversation flows." | Optional formats are skipped formats. The structures are mandatory; only the wording is free. |
| "Recommending a direction is route selection." | Problem-space recommendation is this skill's duty; lifecycle routing is Core's. |
| "A recovery restart means I own recovery." | Recovery remains in `devflow-pua`; perform only the normal clarification process. |

## Red Flags — Stop

- Selecting a depth or branch on the user's behalf.
- Recommending implementation approaches, technical selections, or producing solution-space design.
- Creating a design contract, spec, plan, ADR, documentation landing, or visual expression.
- Skipping or abbreviating the multi-angle exploration because the request looks simple.
- Treating clarification depth as permission to skip the echo-back, a confirm gate, or the recommendation duty.
- Combining several user questions into one message.
- Starting a branch before the user selects A/B/C.

## Verification

Before leaving this skill, confirm:

- [ ] Relevant facts were read or explicitly recorded as unknown.
- [ ] The first user-facing message was a Semantic Echo-Back with all fields, including `none` entries.
- [ ] The echo-back was confirmed or corrected before further clarification.
- [ ] Each additional question resolved one real gap and used the `Question / Recommended answer / Why now` block.
- [ ] The multi-angle exploration ran and its per-angle findings reached the summary fields.
- [ ] Recommendations stayed inside the problem space.
- [ ] Any changed understanding was re-echoed and confirmed.
- [ ] The fixed `Confirmed request` summary contains every required field, including gaps/risks, directions, and recommendation.
- [ ] The summary contains no implementation design or user-unselected branch.
- [ ] A/B/C was presented after `Status: clarified`, and only the user-selected branch started.
