# DevFlow Core

Follow [AGENTS.md](AGENTS.md) as the portable startup contract.

For development work, load `skills/devflow-core/SKILL.md`, then its shared `core-methods.md` reference. Let Core load only the selected lifecycle reference. Claude-specific SessionStart context may remind the agent of this entry, but never replaces the owner skill.

Use `devflow-adversarial` or `devflow-find-fault` directly only for their explicitly requested independent reviews. Completion requires `devflow-prove` evidence and its adversarial review.
