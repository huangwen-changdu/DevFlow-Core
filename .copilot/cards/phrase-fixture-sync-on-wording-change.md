# Phrase Fixture Sync On Wording Change

- Trigger: replacing an exact phrase in AGENTS.md / skills / commands that a validator asserts; trigger:verify or npm test fails with "missing <phrase>"; 文本短语替换, 断言锚点, phrase assertion, validator fixture sync
- Lesson: DevFlow validators pin exact source phrases (validate-skill-triggers scenario evidence, validate-devflow contract asserts). Replacing asserted wording without syncing the fixture breaks the build even though the runtime text is correct — the phrase change is only half-done until every fixture that asserted the old string is updated in the same change.
- Next action: Next time replacing an asserted phrase, first grep the old phrase across scripts/ and docs/; update every fixture anchor (validate-skill-triggers.js, validate-devflow.js, capability-eval-scenarios.json, flow-self-test.md) in the same change, do not wait for the failing check.
- Scope: project
- Related: scripts/validate-skill-triggers.js, scripts/validate-devflow.js, scripts/capability-eval-scenarios.json, skills/devflow-prove/references/flow-self-test.md
- Evidence: 2026-09-23 grill entry build: T1 replaced `creative work with ambiguity or material risk` in AGENTS.md; `trigger:verify` failed `creative-work clarification: AGENTS.md missing ...` until the scenario evidence string was synced.
- Invalidation: if validators stop asserting exact source phrases, or a shared helper resolves phrase anchors automatically.
