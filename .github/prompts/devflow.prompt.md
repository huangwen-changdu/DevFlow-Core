---
description: "Run a DevFlow Core pass for a development request."
name: "DevFlow"
argument-hint: "Describe the development request or paste the plan/diff to review"
agent: "agent"
---

Apply DevFlow Core to the request:

1. Select route: Fast, Design-lite, Design, Build, or Recovery.
   If the user reports a problem without explicitly asking for a fix, use Problem: Sense -> Prove facts, then re-route only if a change is needed.
   If the user explicitly requests independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load `skills/devflow-adversarial/SKILL.md` directly. If the user explicitly requests find-fault review, biggest omission, blind spot, least-certain point, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握, load `skills/devflow-find-fault/SKILL.md` directly. Both are manual at any stage and do not read, require, modify, or hand off to lifecycle skills or completion state.
   Use Fast for pure Q&A, fact lookup, verification, or trivial code change (one line, no logic change, no risk). Use Design-lite for a small change to an existing feature with clear behavior, one plausible path, low risk, local impact, and quick proof — not for new requirements. If the boundary is unclear, ask the user to choose Fast, Design-lite, or full Design.
   If the user repeatedly points out that the same function, result, or requested capability has a problem in one task lifecycle, use Recovery through `devflow-pua` before more edits. Read local methodology-router/methodology-library/flavor-display references, return recovery facts to Core, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `METHOD: {flavor} / {method}`, ask what is wrong and what result is wanted, then switch to a different/opposite method when the prior method failed. Core decides whether Brainstorm must re-confirm the request and selects later lifecycle work.
   For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.
2. Sense: read or cite the relevant facts. Probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`; progressively load only matched cards or navigation-selected knowledge documents. Missing knowledge is non-blocking and does not create storage. **Also scan available skills in the current environment** (platform skill registry, `use_skill` listing, local skill directories). When a non-devflow skill (e.g., `frontend-design`, `pdf`, `understand`, `data-analysis`) matches the task, suggest loading it alongside the devflow route — external skills guide execution quality, devflow manages scope and risk.
3. Brainstorm only when requirements, behavior changes, features, architecture changes, ambiguity, or multi-solution decisions need request confirmation. It reads facts, sends a Semantic Echo-Back, applies the Understanding Revision Rule when a correction changes the request, asks one question at a time for real request gaps, outputs `Confirmed request` with `Status: clarified`, and stops. `devflow-core` then decides whether Spec design work is required.
4. When Core selects Spec, `devflow-spec` compares real approaches, writes the design contract/saved spec, waits for user approval, then returns the confirmed Spec to Core. Core selects Cut with Required Gates: Reuse, Ponytail Rung, Root-Cause Check (for bug fixes), Native, Overbuild, Diff, Scope.
   Output CUT_PASS / CUT_REDUCE / CUT_REUSE / CUT_BLOCKED. Every result returns to Core: CUT_REDUCE/CUT_REUSE STOP for user confirmation, then Core routes; CUT_BLOCKED gives Core the facts needed to decide whether Brainstorm is required.
   For deliberate simplifications, add or report `devflow: <ceiling>, revisit when <trigger>`.
5. After `Confirmed request`, `devflow-core` chooses whether the clarified work requires `devflow-spec`; after a confirmed Spec returns to Core, Core chooses Cut, `/devflow-plan`, Build, Prove, or no further work. `devflow-cut` remains required before construction; a Plan Pack is created only after `CUT_PASS` when Core determines file-level planning is needed.

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

6. If implementation is requested, Build the smallest change and Prove it. For development work, Prove must include adversarial review; a real gap means `FAIL` or continued work before completion. If the miss is reusable, load `devflow-learn`.
7. Report completion only with:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```
