---
description: "Use when editing DevFlow docs, rules, commands, prompts, or skills. Enforces method contracts, trigger quality, and proof-before-done validation."
name: "DevFlow Authoring"
applyTo: ["AGENTS.md", "CLAUDE.md", "README.md", "skills/**/SKILL.md", "skills/**/references/**", "commands/**", ".github/**", ".codebuddy/**"]
---

# DevFlow Authoring Instructions

- Keep DevFlow native: update local rules, docs, skills, commands, prompts, or validation instead of pointing users to another project as the runtime source.
- Every skill must have trigger-rich frontmatter, executable steps, anti-rationalization checks, handoff or stop criteria, and verification.
- Every platform entry must preserve the same core contract: Sense, Brainstorm clarification with the Understanding Revision Rule, `Confirmed request`, Core lifecycle route, optional Spec approach comparison/design-contract confirmation, confirmed Spec returning to Core, Cut returning its result to Core, optional Plan returning its confirmed Plan to Core, Build, Prove. `devflow-brainstorm` owns Semantic Echo-Back and one-at-a-time clarification only; `devflow-spec` owns real-option comparison and the reviewable design contract; `devflow-core` owns every post-clarification, post-Spec, post-Cut, post-Plan, and recovery lifecycle selection. STOP gates remain at clarification confirmation, spec review, plan review, and `CUT_REDUCE`/`CUT_REUSE`.
- At Sense, preserve progressive knowledge recall: probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`, load only matched cards or navigation-selected knowledge documents, and never create storage merely because recall was attempted. Also scan available skills in the current environment (platform skill registry, `use_skill` listing, local skill directories). When a non-devflow skill matches the task, suggest loading it alongside the devflow route — external skills guide execution quality, devflow manages scope and risk.
- Use the design output contract exactly:

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
```

- Use the completion proof contract exactly:

```text
Command:
Result:
Adversarial review:
Judgment: PASS / FAIL / BLOCKED
```

- Before adding dependencies, abstractions, config, folders, framework layers, or generic engines, require a current need and a `Reuse Check`.
- For bug fixes, require caller/reference search and a shared-vs-narrow Root-Cause Check.
- When the user repeatedly points out that the same function, result, or requested capability has a problem in one task lifecycle, require `devflow-pua`: stop the current approach, read local methodology-router/methodology-library/flavor-display references, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `METHOD: {flavor} / {method}`, return recovery facts to Core, ask what is wrong and what result is wanted when not inferable, and switch to a different/opposite method when the prior method failed. Core decides whether Brainstorm must re-confirm the request and selects later lifecycle work. If the miss is reusable, load `devflow-learn`.
- For an explicit independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load `devflow-adversarial` directly. For an explicit find-fault, biggest omission, blind spot, least-certain, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握 request, load `devflow-find-fault` directly. Both are manual at any stage and do not read, require, modify, or hand off to lifecycle skills or completion state.
- For problem solving, bug fixing, and architecture design, require First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.
- Before completing development work, require adversarial review against acceptance criteria, touched files, likely regressions, activation paths, and proof coverage. A real gap must produce `FAIL` or continued work before completion.
- If a deliberate simplification has a ceiling, require `devflow: <ceiling>, revisit when <trigger>`.
- Validate changes with the narrowest relevant command before claiming completion; use `npm test` for broad package validation.
