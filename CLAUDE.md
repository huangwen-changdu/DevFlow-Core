# DevFlow Core

Follow [AGENTS.md](AGENTS.md) as the portable startup contract.

For development work, load `skills/devflow-core/SKILL.md`, then its shared `core-methods.md` reference. Let Core load only the selected lifecycle reference. Claude-specific SessionStart context may remind the agent of this entry, but never replaces the owner skill.

Core applies this precedence: explicit independent review -> investigation/pure inquiry -> approved scope -> risk gate. Clear existing-feature changes with local impact, reversibility, one plausible path, no security/data-loss/permission/contract risk, and quick proof may go to `devflow-cut` without Brainstorm at Depth C, then Build; Cut and Prove remain required. Unapproved edits never use Fast. Ambiguous or materially risky creative work goes to `devflow-brainstorm` before implementation. After request confirmation, the user selects A/B/C: named success edges proceed directly while non-unique artifacts return to Core. Keywords alone never choose a route.

Use `devflow-adversarial` or `devflow-find-fault` directly only for their explicitly requested independent reviews. Completion requires `devflow-prove` evidence and its adversarial review.
