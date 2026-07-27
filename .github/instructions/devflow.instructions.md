---
description: "Use when editing DevFlow docs, rules, commands, prompts, or skills. Enforces method contracts, trigger quality, and proof-before-done validation."
name: "DevFlow Authoring"
applyTo: ["AGENTS.md", "CLAUDE.md", "README.md", "skills/**/SKILL.md", "skills/**/references/**", "commands/**", ".github/**", ".codebuddy/**"]
---

# DevFlow Authoring Instructions

- Keep DevFlow native: update local rules, docs, skills, commands, prompts, or validation instead of pointing users to another project as the runtime source.
- Every skill must have trigger-rich frontmatter, executable steps, anti-rationalization checks, handoff or stop criteria, and verification.
- Every platform entry must preserve the same core contract: Sense, Brainstorm, [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut, Build, Prove. Skills enforce their own gates (e.g., brainstorming has a HARD-GATE). STOP gates are mandatory wait points at brainstorm (depth selection, design contract [A/B only]), spec (1), /devflow-plan (1), and cut (CUT_REDUCE/CUT_REUSE). Depth option semantics live only in `skills/devflow-brainstorm/SKILL.md`; other surfaces link to it instead of restating it.
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
- For user challenge, changed-wrong result, explicit wrong-code signals such as your code is wrong/有问题/不对/写错了, missing-piece complaints such as missing/incomplete/少了/少个/缺漏, repeated miss, or quality complaint, require `devflow-pua`: stop the current approach, read local methodology-router/methodology-library/flavor-display references, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `METHOD: {flavor} / {method}`, restart `devflow-brainstorm`, ask what is wrong and what result is wanted when not inferable, switch to a different/opposite method when the prior method failed, then prove. If the miss is reusable, load `devflow-learn`.
- For an explicit independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load `devflow-adversarial` directly. For an explicit find-fault, biggest omission, blind spot, least-certain, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握 request, load `devflow-find-fault` directly. Both are manual at any stage and do not read, require, modify, or hand off to lifecycle skills or completion state.
- For problem solving, bug fixing, and architecture design, require First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.
- Before completing development work, require adversarial review against acceptance criteria, touched files, likely regressions, activation paths, and proof coverage. A real gap must produce `FAIL` or continued work before completion.
- If a deliberate simplification has a ceiling, require `devflow: <ceiling>, revisit when <trigger>`.
- Validate changes with the narrowest relevant command before claiming completion; use `npm test` for broad package validation.
