# Constraint Rule Calibration

- Trigger: hard rule, absolute prohibition, `Do not`, `Never`, `Always`, mandatory comment, code-review gate, or duplicated lifecycle boundary in a DevFlow runtime skill.
- Lesson: Keep a hard rule only when violating it has a concrete high-cost consequence or protects an executable boundary: security, authorization, data loss, irreversible action, confirmed business fact, user confirmation, lifecycle ownership, or fresh completion evidence. Treat style and framework preferences as conditional guidance tied to approved scope, local convention, or demonstrated risk. Put detailed behavior with one runtime owner; other skills retain only their trigger and fixed return contract.
- Next action: Next time calibrating a rule, first name the protected risk, state transition, or verifier; preserve it when concrete. Otherwise replace the absolute wording with `condition -> judgment -> evidence`, remove equivalent duplicate wording, and run skill, trigger, host, learning, aggregate, and whitespace verification.
- Scope: project
- Related: `skills/devflow-build/SKILL.md`, `skills/devflow-prove/SKILL.md`, `skills/devflow-core/references/core-methods.md`, `docs/specs/2026-07-30-constraint-rule-calibration.md`
- Evidence: User clarified that valid hard requirements must remain; approved Spec and Plan; `npm test`, `npm run trigger:verify`, `npm run host:verify`, `npm run learn:verify`, `npm run verify:all`, and `git diff --check` passed on 2026-07-30.
- Invalidation: Revise when a changed runtime rule demonstrates a missing high-cost boundary, when owner/return contracts change, or when a validator exposes a rule that needs a stronger executable guard.
