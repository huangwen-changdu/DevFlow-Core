# DevFlow Core

Follow [AGENTS.md](AGENTS.md) as the portable startup contract.

For development work, load `skills/devflow-core/SKILL.md`, then its shared `core-methods.md` reference. Let Core load only the selected lifecycle reference. Claude-specific SessionStart context may remind the agent of this entry, but never replaces the owner skill.

For creative work — creating features, building components, adding functionality, modifying behavior, or defining an unapproved problem-directed change — Core routes to `devflow-brainstorm` before implementation. After request confirmation, the user selects A/B/C: the named success edges proceed directly while non-unique artifacts return to Core. Pure Q&A, lookup, verification, investigation-only reports, and already approved changes are exceptions.

Use `devflow-adversarial` or `devflow-find-fault` directly only for their explicitly requested independent reviews. Completion requires `devflow-prove` evidence and its adversarial review.
