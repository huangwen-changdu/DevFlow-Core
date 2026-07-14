# Codex DevFlow Observability Plan

Source: docs/specs/2026-07-14-codex-devflow-observability.md

Spec coverage: Requirements 1, 4, 5, 8, and 9 map to Tasks 1 and 3. Requirements 2, 3, and 7 map to Task 2. Requirement 6 maps to Task 3. Requirement 10 and all acceptance criteria map to Task 4.

Task: Verify Codex prompt-hook contract
Files: .codex/hooks.json, hooks/devflow-prompt-tracker.js, scripts/validate-host-adapters.js
Acceptance: The project uses a Codex-supported prompt event and payload shape; a harmless explicit DevFlow command reaches the tracker, while an unrelated prompt does not change state. If the installed Codex runtime does not support the event, implementation stops with a documented BLOCKED result.
Verify: Run the focused Hook fixture and manually invoke the harmless command in a Codex project session.
Not doing: Adding Claude, Copilot, or generic multi-host Hook adapters.

Task: Add local observability state and status reader
Files: hooks/devflow-observability.js, scripts/devflow-status.js, commands/devflow-status.toml, .gitignore
Acceptance: A versioned ignored state file stores only phase, verification result, update time, source, and schema version. The status reader reports those fields and handles absent or malformed state without a nonzero exit.
Verify: Run focused state-reader fixtures for valid, absent, malformed, and no-prompt-content state files.
Not doing: Persisting prompt text, task details, tool input, credentials, global user configuration, or workflow recovery.

Task: Record evidence from existing DevFlow checks
Files: scripts/devflow-spec.js, scripts/devflow-plan.js, scripts/devflow-review.js, scripts/devflow-debt.js, scripts/devflow-audit.js, hooks/devflow-session-start.js
Acceptance: Each existing checker records pass only after its current check succeeds and fail only when its current check fails, without changing existing checker output or exit status. Session-start may show a compact developer snapshot but does not instruct route restoration.
Verify: Run a passing and failing fixture for each checker, then compare stdout and process exit status with the prior checker contract.
Not doing: Treating a requested verification, a prompt event, or a session-start event as proof of completion.

Task: Prove installation, privacy, and documentation boundaries
Files: scripts/validate-devflow.js, scripts/validate-host-adapters.js, scripts/validate-installer.js, README.md, docs/features/devflow-core.md, docs/features/validation-harness.md
Acceptance: Validation proves Hook registration, state schema privacy, prompt filtering, checker result writes, no-state behavior, and no user-level or non-Codex installation expansion. Documentation states the observability boundary and required manual Codex check.
Verify: Run the focused observability test, npm test, npm run host:verify, npm run install:verify, and git diff --check.
Not doing: Installing the status state into user homes, adding telemetry, adding a status-bar API without Codex support, or changing existing host configurations.
