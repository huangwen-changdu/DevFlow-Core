# DevFlow Runtime References

- Trigger: DevFlow-Core structure, skill framework layout, docs vs references, runtime method source, generated plan docs, Codex onboarding, install file map, target runtime files, user-level runtime files, script execution model, hooks, global config vs project runtime, project-only AGENTS and CLAUDE.
- Lesson: Runtime framework methods should live beside the skills that use them, not under `docs/`; onboarding docs must show which rules, skills, commands, references, and runtime scripts are installed into the target project, which skills/commands/scripts can install to the user level, whether scripts run automatically or require agent/user/command triggering, how personal Codex defaults differ from project-versioned runtime files, and that `AGENTS.md` plus `CLAUDE.md` are project-level files only.
- Next action: Next time encountering DevFlow-Core/skill framework structure or Codex onboarding docs, first check `scripts/install-devflow.js` and `scripts/install-devflow-user.js`, list both target and user install maps, explain the execution model, and explicitly state that `AGENTS.md` and `CLAUDE.md` install only through `install:target`; do not document only commands or only scripts.
- Scope: project
- Related: `skills/devflow-core/references/project-structure.md`, `scripts/install-devflow.js`, `scripts/validate-devflow.js`
