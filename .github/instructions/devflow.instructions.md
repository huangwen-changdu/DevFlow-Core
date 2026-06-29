---
description: "Use when editing DevFlow docs, rules, commands, prompts, or skills. Enforces method contracts, trigger quality, and proof-before-done validation."
name: "DevFlow Authoring"
applyTo: ["AGENTS.md", "CLAUDE.md", "README.md", "skills/**/SKILL.md", "skills/**/references/**", "commands/**", ".github/**", ".codebuddy/**"]
---

# DevFlow Authoring Instructions

- Keep DevFlow native: update local rules, docs, skills, commands, prompts, or validation instead of pointing users to another project as the runtime source.
- Every skill must have trigger-rich frontmatter, executable steps, anti-rationalization checks, handoff or stop criteria, and verification.
- Every platform entry must preserve the same core contract: Sense, Brainstorm, Cut, Shape, Build, Prove.
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
Judgment: PASS / FAIL / BLOCKED
```

- Before adding dependencies, abstractions, config, folders, framework layers, or generic engines, require a current need and a `Reuse Check`.
- For bug fixes, require caller/reference search and a shared-vs-narrow Root-Cause Check.
- For user challenge, changed-wrong result, explicit wrong-code signals such as your code is wrong/有问题/不对/写错了, missing-piece complaints such as missing/incomplete/少了/少个/缺漏, repeated miss, or quality complaint, require `devflow-pua`: stop the current approach, read local methodology-router/methodology-library/flavor-display references, quarantine old wrong context, classify User-view miss and Satisfaction gap, show `🟠 {味道} 方法论：{方法}`, restart `devflow-brainstorm`, ask what is wrong and what result is wanted when not inferable, switch to a different/opposite method when the prior method failed, then prove.
- If a deliberate simplification has a ceiling, require `devflow: <ceiling>, revisit when <trigger>`.
- Validate changes with the narrowest relevant command before claiming completion; use `npm test` for broad package validation.
