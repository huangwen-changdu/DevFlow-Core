# Codex DevFlow Observability

## Goal

Give a developer using Codex in a project a trustworthy, local view of the current DevFlow phase, the most recent compatible verification result, and the update time without turning lifecycle hooks into workflow enforcement.

## Context

DevFlow currently injects route guidance at Codex `SessionStart`, while Ponytail demonstrates lifecycle state tracking, host-specific output, and status visibility. DevFlow differs materially: its route is selected per task, and `devflow-prove` remains the only authority for a completion claim. Prompt text shows intent rather than successful execution, so it must not be stored as proof.

The existing `docs/features/devflow-core.md` ledger excludes generic hook lifecycle automation. This feature changes that boundary only for Codex developer observability and must leave the execution route, proof gate, and user-level installer scope intact.

## Requirements

1. Support Codex project-level hooks only in the first release; do not add Claude, Copilot, or user-level behavior.
2. Keep a versioned, ignored state file at `.codex/devflow-observability.json` containing only `schemaVersion`, `phase`, `lastVerification`, `updatedAt`, and `source`.
3. Permit phases `route`, `brainstorm`, `spec`, `plan`, `cut`, `build`, `prove`, `recovery`, and `idle`.
4. A Codex prompt hook may inspect the current prompt in memory only to recognize anchored explicit DevFlow commands. It must not persist prompt text, arguments, command output, source code, or credentials.
5. Recognized commands update the matching phase. Unrelated prompts leave the state unchanged.
6. Compatible DevFlow checker scripts record `pass` or `fail` from their actual exit result. A hook or command must never record a verification pass merely because a user requested verification.
7. Add a read-only status command or script that prints phase, latest compatible verification result, and update time. It must be silent or report no state cleanly when the state file is absent or malformed.
8. Session-start output may show the compact state to the developer, but it must not tell the agent to resume a phase or change the active route.
9. The Hook scripts must fail closed with a zero process exit on malformed input or unavailable state storage so they do not block Codex use.
10. Add fixtures covering command recognition, unrelated prompts, state-file corruption, compatible checker success and failure, and absent state.

## Non-goals

- Do not persist user prompts, task content, tool inputs, code, credentials, or telemetry.
- Do not restore a route, force a phase transition, block tools, or replace `devflow-prove`.
- Do not provide a cross-host abstraction, Ponytail-style mode control, global configuration, performance scoreboard, daemon, watcher, or network service.
- Do not claim native Codex status-bar support. The first release uses the read-only status output and supported hook messages only.

## Approach

Add one small state helper shared by the Codex prompt hook, session-start hook, compatible checker scripts, and status reader. The helper owns state parsing, schema validation, atomic write, and compact display formatting. Each writer supplies an explicit source and can update only the fields it has real evidence for.

Extend `.codex/hooks.json` with the Codex-supported prompt event after verifying its accepted event name and payload shape in the installed runtime. Keep the existing `SessionStart` registration and use it only for a compact developer-facing snapshot. Add a project-local ignore entry for the state file.

The status reader is the reliable developer interface. Hook output is a convenience surface, not the source of truth. Compatible checker scripts call the helper only after their current result has been determined, preserving their existing stdout, exit code, and self-test behavior.

## Impact

- `.codex/hooks.json` registers the narrow Codex prompt event alongside the existing session-start event.
- `hooks/` gains the state helper and prompt tracker, while `devflow-session-start.js` reads state only for compact display.
- `scripts/devflow-spec.js`, `scripts/devflow-plan.js`, `scripts/devflow-review.js`, `scripts/devflow-debt.js`, and `scripts/devflow-audit.js` report verified results through the helper without changing their checker contracts.
- `commands/` gains a read-only status command.
- `.gitignore`, runtime validators, host-adapter validation, installer validation, README, and the DevFlow feature ledger document and prove the new boundary.

## Acceptance

1. A recognized explicit DevFlow command updates the phase and timestamp, with no prompt content in the state file.
2. An unrelated prompt leaves the state file unchanged.
3. Each compatible checker records `pass` only when its own existing check succeeds and `fail` only when it fails.
4. The status command reports phase, latest verification result, and update time; absent or malformed state does not crash or block the command.
5. A fresh Codex session may show a compact snapshot but does not direct an agent to resume or complete a saved phase.
6. Existing command behavior, checker output, exit codes, user-level installation, and non-Codex host configurations remain unchanged.

## Verification

- Add Node fixture tests for the state helper and prompt tracker.
- Run each compatible checker in a passing and failing fixture scenario and assert the persisted result.
- Run `npm test`, `npm run host:verify`, `npm run install:verify`, and the new focused observability test.
- In Codex, verify the registered prompt event with a harmless explicit DevFlow command and verify that the status reader changes while an unrelated prompt does not.
- Inspect the persisted state fixture to confirm it contains no prompt content.

## Open Questions

None. The implementation must verify the installed Codex prompt-event schema before registering it. If the host does not support that event, the feature is blocked rather than substituting prompt-content parsing or unsupported status-bar behavior.
