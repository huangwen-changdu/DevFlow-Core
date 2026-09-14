# Skill Sync After Update

- Trigger: skills updated, commands updated, runtime scripts updated, SKILL.md changed, update complete, sync latest skills, user-level skills directories, .claude skills, .codebuddy skills, .codex skills, .workbuddy skills.
- Lesson: After updating a reusable runtime surface, skills alone are not enough. User-level sync also needs `commands/` and the runtime checker scripts matching `scripts/devflow-*.js`.
- Next action: Next time completing a skills, commands, or runtime-script update, overlay-sync `skills/`, `commands/`, and `scripts/devflow-*.js` to `C:\Users\huangwen\.claude`, `C:\Users\huangwen\.codebuddy`, `C:\Users\huangwen\.codex`, `C:\Users\huangwen\.workbuddy`, and `C:\Users\huangwen\.zcode`; do not delete target-only files or copy maintainer-only scripts. Sync rules only to targets with an established `rules/` entry point. Also run `node dsh/plugins/dsh-devflow/scripts/sync-assets.js` to refresh the packaged DSH assets (parity is asserted by validate-skill-triggers.js since 2026-08-20); when the skill behavior changed, add the matching evidence line to both the flow-self-test scenario and capability-eval-scenarios.json scenarioEvidence.
- Scope: project
- Related: `skills/`, `commands/`, `scripts/devflow-*.js`, `scripts/install-devflow-user.js`, `npm run install:user -- --home <target>`
- Evidence: user installer entry list and user-install verification command. 2026-09-11：六个 home（.codex/.claude/.codebuddy/.workbuddy/.zcode/.dsh）先 --check 报 5 家 8 changed（含 1e30afd 未同步的 4 个 preset 文件）、.dsh 4 changed（本次 4 个运行时文件）；--write --force 每家 54 文件覆盖；复审 6/6 Check passed exit 0。安装器 overlay 不 prune，目标独有文件保留。
- Invalidation: Revise when user-level runtime scope or installer behavior changes.
