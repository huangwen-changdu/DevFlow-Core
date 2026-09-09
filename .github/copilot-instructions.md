# DevFlow Core

Use [AGENTS.md](../AGENTS.md) as the startup contract. Load `skills/devflow-core/SKILL.md` for development work, then load only the lifecycle reference selected by Core.

Keep this adapter limited to Copilot entry behavior: Core applies its risk gate. Clear existing-feature changes with local impact, reversibility, one plausible path, no security/data-loss/permission/contract risk, and quick proof may go directly to `devflow-cut`; ambiguous or materially risky creative requests go to `devflow-brainstorm`. Cut and Prove remain required. After confirmation, the user selects A/B/C and named success edges proceed directly. Non-unique artifacts return to Core. Pure Q&A, lookup, verification, investigation-only reports, approved changes, and explicit independent reviews retain their Core exceptions. Preserve the no-skill fallback from `AGENTS.md`.
