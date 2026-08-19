---
name: devflow-adversarial
description: "Use when a user explicitly asks for an independent deep adversarial review, upgraded adversarial review, red-team review, 对抗审查, 升级版对抗审查, or a five-angle challenge of current work. It can run at any task stage and does not read, require, modify, or hand off to devflow-prove, PUA, Build, Learn, or any completion state."
---

# DevFlow Adversarial Review

Run an independent, user-requested challenge of the current task materials. This skill does not declare global task status or perform work beyond review.

## Entry Gate

1. Confirm the user explicitly requested this review.
2. Immediately identify the review target from the user's request, current files, diff, requirements, tests, or supplied evidence.
3. If the target is unclear, ask one smallest question to identify it.
4. As an independent manual review, do not read, require, or alter `devflow-prove`, PUA, Build, Learn, or any lifecycle state.

On DeepSeek Harness (DSH), run this review as a fresh `subagent` with no conversation seed so the challenge is genuinely independent of the main agent's reasoning; the subagent returns findings only and never declares lifecycle status, edits files, or invokes another skill.

## Five-Angle Review

Challenge the target from each angle:

1. **Requirement coverage**: What stated requirement, constraint, or non-goal may be missing or contradicted?
2. **Reachability**: Can the intended user, command, route, or runtime path actually reach the result?
3. **Boundaries and regressions**: Which edge, sibling path, compatibility boundary, or affected surface may fail?
4. **Evidence strength**: Which claim lacks direct evidence, uses stale output, or has inadequate verification?
5. **User-visible outcome**: What would make the result technically plausible but still wrong, unclear, incomplete, or unusable for the user?

Use facts from inspected material. Label unsupported possibilities as hypotheses, not facts.

## Required Output

```text
Review confirmation: explicit request received
Adversarial review target: <scope reviewed>
Findings:
- Critical: <finding or none>; evidence: <facts>; confidence: high/medium/low
- Important: <finding or none>; evidence: <facts>; confidence: high/medium/low
- Observation: <finding or none>; evidence: <facts>; confidence: high/medium/low
Five-angle coverage:
- Requirement coverage: <challenge and result>
- Reachability: <challenge and result>
- Boundaries and regressions: <challenge and result>
- Evidence strength: <challenge and result>
- User-visible outcome: <challenge and result>
Context limitations: <unavailable material or none>
Suggested next action: <manual action for the user, or none>
```

`Suggested next action` is advice only. Do not automatically edit files, create tasks, invoke another skill, or change lifecycle state.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The task is already complete." | This skill is independent and may inspect any current task state. |
| "The review is lengthy." | An explicit review request authorizes the review; do not add a second confirmation gate. |
| "A likely issue is a fact." | Separate observed evidence from a hypothesis. |
| "A Critical finding should trigger a fix." | Report it; the user decides whether to request follow-up work. |
| "Another skill has a status." | Do not read or change that status. |

## Verification

Before leaving this skill, confirm:

- [ ] The user explicitly requested adversarial review.
- [ ] The review started without a second confirmation gate.
- [ ] The review covers all five angles.
- [ ] Findings have level, evidence, and confidence.
- [ ] Context limitations are visible.
- [ ] No lifecycle state, code, or other skill was changed or invoked.
