# Skill Description Trigger Surface

- Trigger: skill description, SKILL.md frontmatter, trigger wording, brand text in description, DevFlow-Core in description, generic summary descriptions.
- Lesson: Skill descriptions are the activation surface. Write them as task-trigger phrases, not project branding or summary copy. In DevFlow-Core the description layer is the real routing: the host AI self-discovers and loads skills by descriptions. `devflow-core` route tables and `commands/*.toml` are the pseudo-workflow declaration (ownership, return contracts, stop conditions), not the dispatcher. Trigger signals belong in the owning skill's description; declaration layers only stay consistent with them.
- Next action: Next time a skill description is edited, first write a `Use when` / `Use before` trigger phrase, and do not write `DevFlow-Core` or generic brand-summary copy in the description. Next time asked to strengthen routing to a skill, first add the trigger signal to that skill's own description, keep core/toml as declaration-only sync, and do not pile trigger words into core route tables. Do not add trigger signals for scenarios already covered by a declared lifecycle path (e.g., PUA -> Core -> Brainstorm); duplicating coverage creates double routing.
- Scope: project
- Related: `skills/*/SKILL.md`, `scripts/validate-devflow.js`
- Evidence: skill frontmatter convention and package validation of skill descriptions.
- Invalidation: Revise when the host activation mechanism no longer reads descriptions.
