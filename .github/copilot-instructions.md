# DevFlow Core

Use [AGENTS.md](../AGENTS.md) as the startup contract. Load `skills/devflow-core/SKILL.md` for development work, then load only the lifecycle reference selected by Core.

Keep this adapter limited to Copilot entry behavior: route requests to Core; for creative work — creating features, building components, adding functionality, modifying behavior, or defining an unapproved problem-directed change — Core selects `devflow-brainstorm` before implementation. Pure Q&A, lookup, verification, investigation-only reports, and already approved changes are exceptions. Send explicit independent reviews to `devflow-adversarial` or `devflow-find-fault`, preserve no-skill fallback from `AGENTS.md`, and require Prove before a completion claim.
