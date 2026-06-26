# Skill Sync After Update

- Trigger: skills updated, SKILL.md changed, update complete, sync latest skills, user-level skills directories, .claude skills, .codebuddy skills, .codex skills, .workbuddy skills.
- Lesson: After updating project skills, the latest skills need to be synced to the user's active agent skill directories, not only left in the repository.
- Next action: Next time completing a skills update, first sync the latest `skills/` content to `C:\Users\huangwen\.claude\skills`, `C:\Users\huangwen\.codebuddy\skills`, `C:\Users\huangwen\.codex\skills`, and `C:\Users\huangwen\.workbuddy\skills`; do not stop after repository validation only.
- Scope: project
- Related: `skills/`, `scripts/install-devflow-user.js`, `npm run install:user -- --home <target>`
