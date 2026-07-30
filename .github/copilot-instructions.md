# DevFlow Core

Use [AGENTS.md](../AGENTS.md) as the startup contract. Load `skills/devflow-core/SKILL.md` for development work, then load only the lifecycle reference selected by Core.

Keep this adapter limited to Copilot entry behavior: route requests to Core, send explicit independent reviews to `devflow-adversarial` or `devflow-find-fault`, preserve no-skill fallback from `AGENTS.md`, and require Prove before a completion claim.
