---
name: devflow-find-fault
description: "Use when a user explicitly asks to find faults, identify the biggest omission, surface blind spots, name uncertainty, 找茬, 最大遗漏是什么, 我没有意识到什么, or 眼下你最没有把握的事情是什么. It can run at any task stage and does not read, require, modify, or hand off to devflow-prove, PUA, Build, Learn, or any completion state."
---

# DevFlow Find Fault

Run an independent, user-requested critique of the current task materials. This skill identifies gaps and uncertainty without declaring global task status.

## Entry Gate

1. Confirm the user explicitly requested find-fault review.
2. Identify the target materials from the user's request, current files, diff, requirements, tests, or supplied evidence.
3. Ask one smallest question when the target is unclear.
4. As an independent manual review, do not read, require, or alter `devflow-prove`, PUA, Build, Learn, or any lifecycle state.

## Questions

Always answer these questions:

1. What is the biggest omission in the current situation?
2. What might the user or agent not have recognized?
3. What is currently least certain?

Also answer every additional question the user explicitly supplies.

For each answer, distinguish:

- **Facts**: directly supported by inspected material.
- **Inference**: a reasoned conclusion that needs confirmation.
- **Unknowns**: missing material that prevents a reliable conclusion.
- **Next step**: the smallest manual action that would reduce the uncertainty.

## Required Output

```text
Find-fault target: <scope reviewed>
Questions and answers:
- Biggest omission: <answer>; facts: <facts>; inference: <inference or none>; unknowns: <unknowns or none>; confidence: high/medium/low; next step: <smallest manual action>
- Unrecognized blind spot: <answer>; facts: <facts>; inference: <inference or none>; unknowns: <unknowns or none>; confidence: high/medium/low; next step: <smallest manual action>
- Least certain point: <answer>; facts: <facts>; inference: <inference or none>; unknowns: <unknowns or none>; confidence: high/medium/low; next step: <smallest manual action>
- User question: <question>; answer: <answer>; facts: <facts>; inference: <inference or none>; unknowns: <unknowns or none>; confidence: high/medium/low; next step: <smallest manual action>
Findings:
- Critical: <finding or none>; evidence: <facts>; confidence: high/medium/low
- Important: <finding or none>; evidence: <facts>; confidence: high/medium/low
- Observation: <finding or none>; evidence: <facts>; confidence: high/medium/low
Context limitations: <unavailable material or none>
Suggested next action: <manual action for the user, or none>
```

`Suggested next action` is advice only. Do not automatically edit files, create tasks, invoke another skill, or change lifecycle state.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "There is no proof of a problem." | Name the uncertainty instead of inventing certainty. |
| "A hypothesis is enough." | Label hypotheses as inference and show their evidence gap. |
| "The default questions are enough." | Answer each explicit user question too. |
| "Another skill has a status." | Do not read or change that status. |

## Verification

Before leaving this skill, confirm:

- [ ] The user explicitly requested find-fault review.
- [ ] All three default questions were answered.
- [ ] Each user-supplied question was answered.
- [ ] Facts, inference, unknowns, confidence, next steps, and limitations are visible.
- [ ] No lifecycle state, code, or other skill was changed or invoked.
