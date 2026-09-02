---
name: devflow-find-fault
description: "Use when a user explicitly asks to find faults, identify the biggest omission, surface blind spots, name uncertainty, run an unease check, 不安感检查, 找茬, 最大遗漏是什么, 我没有意识到什么, 需求细节是否确认, or 眼下你最没有把握的事情是什么. It can run at any task stage and does not read, require, modify, or hand off to devflow-prove, PUA, Build, Learn, or any completion state."
---

# DevFlow Find Fault

Run an independent, user-requested critique of the current task materials. This skill identifies gaps and uncertainty without declaring global task status.

Use this skill when the user asks what is missing, unrecognized, or uncertain. When the user asks a five-angle challenge of whether the result holds instead, use `devflow-adversarial`.

## Entry Gate

1. Confirm the user explicitly requested find-fault review.
2. Identify the target materials from the user's request, current files, diff, requirements, tests, or supplied evidence.
3. Ask one smallest question when the target is unclear.
4. As an independent manual review, do not read, require, or alter `devflow-prove`, PUA, Build, Learn, or any lifecycle state.

On DeepSeek Harness (DSH), dispatch a fresh `subagent` so the critique stays independent of the main agent's reasoning. Call the `subagent` tool once with `run_in_background: false` and a complete standalone prompt that names the review target and the material paths, and instructs the subagent to read those materials and return evidence-backed findings (the subagent has no conversation seed and cannot see this conversation). Then run the review in bounded rounds, one review unit per round: after each round the subagent returns that unit's findings, you aggregate them and report progress, then continue the same subagent conversation with the `send_message` tool. After the final unit, assemble the complete `Required Output` below from the aggregated findings. The subagent returns findings only — it never declares lifecycle status, edits files, or invokes another skill. If a round returns nothing usable (timeout, truncation, or failure), record it under `Context limitations`, retry that unit once with a narrower instruction, and continue with the remaining units; never silently drop a unit.

Review units: one question per round — the three default questions and every user-supplied question — plus one final round for the unease check when the target contains implementation material.

## Post-Implementation Unease Check

When target materials include an implemented feature, diff, or completion-ready result, also inspect whether the implementation has silently decided business behavior the user never confirmed. This check is for requirement-confidence gaps, not code quality or test coverage.

When the target contains no implementation material (no diff, no new code, no completion-ready result), skip the unease check and report `Unease check: not applicable` with the reason; do not invent business decisions from requirements text alone.

1. Compare explicit requirements, conversation evidence, acceptance criteria, and current behavior against the implementation.
2. List every material decision with no direct confirmation, especially: ordering, filtering, defaults, empty states, pagination, permissions, state transitions, exceptions, retries, boundary inputs, and conflicting actor outcomes.
3. For each decision, state the encoded behavior or implicit assumption, plausible alternative interpretations, impact if wrong, the confirmation question, and a temporary recommendation.
4. Do not invent a missing requirement. Mark the item as an inference or unknown until the user confirms it.

### Unease Risk Classification

| Level | Meaning | Typical signals | Completion constraint |
|---|---|---|---|
| **High** | A missing decision could materially change the business result, user rights, data correctness, security, money/inventory, irreversible state, or produce clearly different outcomes under reasonable interpretations. | Permission boundary, settlement rule, destructive transition, ownership, data visibility, compliance, or mutually exclusive workflow result. | Do not state that the feature fully meets requirements. Request user confirmation before that claim. |
| **Medium** | A missing decision changes primary-path experience or rule consistency, but is reversible and does not directly threaten protected rights or correctness. | Sort priority, filter composition, default value, pagination, empty state, retry, or normal error path. | Label the implementation `pending confirmation`; explicitly surface it before delivery. |
| **Low** | A missing decision does not change business semantics, is easy to reverse, and has a clear ordinary convention. | Non-core wording, visual spacing, or a presentational detail with no rule impact. | Record it; it does not block a completion claim. |

If context is too sparse to classify safely, use the highest plausible level and explain the missing evidence. Risk level expresses impact if the assumption is wrong, not confidence in the finding.

### Unease Decision Format

```text
- Decision: <unconfirmed business detail>
  Current implementation / assumption: <observed behavior or inference>
  Alternative interpretations: <plausible alternatives>
  Risk: high / medium / low — <impact rationale>
  Evidence: <explicit requirement, code/diff behavior, or none>
  Confirmation needed: <one user-facing question>
  Temporary recommendation: <reversible default, or do not proceed for high risk>
```


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
Unease check: run / not applicable — <why>
- Decision: <unconfirmed business detail>; current implementation / assumption: <observed behavior or inference>; alternative interpretations: <plausible alternatives>; risk: high/medium/low — <impact rationale>; evidence: <facts or none>; confirmation needed: <one user-facing question>; temporary recommendation: <reversible default, or do not proceed for high risk>
Findings:
- Critical: <finding or none>; evidence: <facts>; confidence: high/medium/low
- Important: <finding or none>; evidence: <facts>; confidence: high/medium/low
- Observation: <finding or none>; evidence: <facts>; confidence: high/medium/low
Repeat one bullet per finding; order findings by severity, then confidence; write none when a level has no finding.
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
| "The implementation is reasonable." | Reasonable defaults are still unconfirmed decisions; run the unease check. |
| "Tests pass, so requirements are met." | Tests prove encoded behavior, not that the user confirmed its business rule. |
| "It is only a UI detail." | Classify impact first; ordering, filters, defaults, and empty states can change user outcomes. |

## Verification

Before leaving this skill, confirm:

- [ ] The user explicitly requested find-fault review.
- [ ] All three default questions were answered.
- [ ] Each user-supplied question was answered.
- [ ] Facts, inference, unknowns, confidence, next steps, and limitations are visible.
- [ ] For implemented targets, the unease check ran and every material unconfirmed decision has risk, rationale, confirmation question, and temporary recommendation.
- [ ] High-risk unease decisions are not presented as fully requirement-complete; medium-risk decisions are marked `pending confirmation`.
- [ ] No lifecycle state, code, or other skill was changed or invoked.
