---
name: devflow-brainstorm
description: "Use when a request needs requirement clarification before the DevFlow Core router selects design, planning, implementation, recovery, or proof work. Clarifies what the user wants through a semantic echo-back and one question at a time; stops after a fixed Confirmed request summary. Do NOT use it to select a route, compare approaches, produce a design, or hand off to another skill."
---

# DevFlow Brainstorm

Clarify **what** the user wants. Do not decide **how** DevFlow should proceed.

## Responsibility Boundary

This skill owns only:

- minimal fact reading needed to understand the request;
- Semantic Echo-Back and understanding correction;
- one-at-a-time clarification of goal, scope, exclusions, constraints, acceptance, and real open questions;
- the fixed `Confirmed request` summary.

Use `references/interview-discipline.md` for the Semantic Echo-Back, one-question discipline, and fixed-summary forms.

`devflow-core` owns post-clarification lifecycle routing. `devflow-spec`, `devflow-cut`, `devflow-plan`, `devflow-build`, `devflow-prove`, `devflow-pua`, and `devflow-docs-followup` retain their own responsibilities.

## Entry And Stop Condition

Enter only when `devflow-core` has identified a requirement, behavior, architecture, or ambiguity that needs clarification.

Stop immediately after producing the fixed summary. Do not select Fast, Design-lite, a path, a depth, an approach, a method, or a downstream skill. Do not create design sections, a design contract, documentation, or a visual artifact.

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
4. **Clarify one real gap at a time.** Ask only the smallest unresolved question, in this order: goal ambiguity, scope boundary, exclusion, constraint, acceptance, then any remaining open question. Include a recommended answer and why the answer matters.

   ```text
   Question: <one question>
   Recommended answer: <answer and rationale>
   Why now: <risk or dependency resolved>
   ```

5. **Apply the Understanding Revision Rule.** When an answer changes the current understanding, stop the current question chain, update facts, assumptions, and understanding gaps, then send a corrected Semantic Echo-Back and wait for confirmation.
6. **Finish.** When the shared request is sufficiently clear, output the fixed summary and stop.

## Understanding Revision Rule

A user correction is not permission to continue from the previous question chain. If the correction changes the goal, scope, exclusion, constraint, acceptance, terminology, actor, or any assumption that affects the request:

1. stop the current clarification question;
2. replace superseded facts and assumptions with the corrected understanding;
3. send a complete updated Semantic Echo-Back, including any new gaps;
4. wait for explicit confirmation or another correction; and
5. only then resume one-at-a-time clarification or produce `Confirmed request`.

Do not silently merge a correction into the next question or the fixed summary.

## Clarification Rules

- One user question per message; wait for the answer before the next question.
- Treat business intent, user-visible scope, and ambiguous terms as questions; do not infer them from code.
- Ask no question whose answer is unambiguous in project facts.
- Match the user's language and terminology. Name a new technical term only when precision needs it.
- For vague quantifiers, implicit scope, pronouns, missing actors, unstated constraints, solution-as-goal language, missing context, and ambiguous boundaries, name the specific ambiguity in the echo-back or next question.
- A request already clear after the echo-back needs no additional questions.

## Fixed Output Contract

```text
Confirmed request:
- Goal: <user outcome>
- Scope: <included behavior and surfaces>
- Out of scope: <explicit exclusions>
- Constraints: <must-not-change conditions, or none>
- Acceptance: <observable proof of success>
- Open questions: <none or unresolved blocker>
- Status: clarified
```

The summary records the agreed request only. It must not contain an implementation plan, approach comparison, route, depth, lifecycle instruction, or handoff.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The request is obvious, so skip the echo-back." | Hidden assumptions cause changed-wrong work. Echo the understanding first. |
| "I can choose the implementation while clarifying." | Clarification defines the request; Core routes after the summary. |
| "Several questions save time." | One question at a time makes the answer unambiguous. |
| "Code reveals business intent." | Code shows current behavior, not the desired outcome. Confirm intent. |
| "A design contract is a better summary." | A design contract decides how; this skill must only record what. |
| "The user corrected one detail, so continue silently." | Re-echo the corrected understanding before proceeding. |
| "A recovery restart means I own recovery." | Recovery remains in `devflow-pua`; perform only the normal clarification process. |

## Red Flags — Stop

- Selecting a route, depth, or downstream skill.
- Comparing implementation approaches or recommending one.
- Creating a design contract, spec, plan, ADR, documentation landing, or visual expression.
- Combining several user questions into one message.
- Continuing after the fixed summary.

## Verification

Before leaving this skill, confirm:

- [ ] Relevant facts were read or explicitly recorded as unknown.
- [ ] The first user-facing message was a Semantic Echo-Back with assumptions and gaps.
- [ ] The echo-back was confirmed or corrected before further clarification.
- [ ] Each additional question resolved one real gap and included a recommendation.
- [ ] Any changed understanding was re-echoed and confirmed.
- [ ] The fixed `Confirmed request` summary contains every required field.
- [ ] The summary contains no route, design, implementation, or handoff instruction.
- [ ] The skill stopped after `Status: clarified`.
