# AGENTS Runtime Prompt Boundary

- Trigger: AGENTS.md, runtime prompt, prompt file, unrelated explanation, README-like content, long method details, wrong place, misplaced content, repeated correction.
- Lesson: AGENTS.md is an execution prompt for agents, not a README, audit report, or method reference document. An ordered procedure — stages with exit artifacts, gates, stop points, and output contracts — belongs there; method depth, examples, and long explanations do not.
- Rejected: not-recorded (legacy card; the rejected alternative was never captured before this field existed)
- Next action: Next time editing AGENTS.md, first check that the content belongs in a runtime prompt, keep only directive behavior rules, and move long explanations to README or `skills/*/references/*`, not AGENTS.md.
- Scope: project
- Related: `AGENTS.md`, `scripts/validate-devflow.js`, `skills/devflow-core/references/core-methods.md`
- Evidence: `AGENTS.md` startup contract and `node scripts/validate-devflow.js` prompt-size assertion; the 2026-10-21 restructure moved the lifecycle into seven ordered stages, added the receipt and specialist-return contracts, and kept the prompt at 7951/8192 bytes.
- Evidence Level: L2
- Invalidation: Revise when the startup contract or prompt-size validation changes.
