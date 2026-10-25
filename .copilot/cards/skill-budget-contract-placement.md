# Skill Budget Forces Contract Placement

- Trigger: editing a `skills/*/SKILL.md` pushes it over the 15360-byte budget cap, npm test fails with "Over skill limit", or a new contract sentence must be added to a near-cap SKILL.md
- Lesson: the per-SKILL budget gate only scans `skills/*/SKILL.md` files, not their `references/`; a node's references file is the already-mandated detail owner (loaded via the SKILL loading map), so the cap is a placement signal, not a reason to weaken or drop a contract
- Rejected: not-recorded (legacy card; the rejected alternative was never captured before this field existed)
- Next action: Next time a SKILL.md addition trips the budget, first move the full contract wording into the owning node's references file and keep only a one-line anchor plus a pointer in SKILL.md, do not raise the budget cap or delete the contract.
- Scope: project
- Related: scripts/devflow-budget.js, skills/devflow-build/references/build-methods.md, skills/devflow-prove/references/proof-recovery-methods.md, npm test
- Evidence: 2026-10-10 orchestration-visibility implementation — build/plan/prove SKILL.md tripped the cap three times; relocating receipt and blocked-dispatch detail into build-methods.md and proof-recovery-methods.md (with short SKILL anchors) brought all files back under 15360 while validate-skill-triggers fixtures kept passing (npm run verify:all exit 0)
- Evidence Level: L1
- Invalidation: if the budget checker starts scanning references files too, or a SKILL.md anchor is required by a validator fixture that the reference cannot satisfy, this placement rule must be re-derived
