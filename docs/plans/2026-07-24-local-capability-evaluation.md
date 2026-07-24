# Local Capability Evaluation Plan

Source: docs/specs/2026-07-24-local-capability-evaluation.md

Spec coverage: Requirements 1 and 2 map to Task 1. Requirements 2 through 8 map to Task 2. Requirement 9 maps to Task 3. Requirement 10 maps to Task 4. Acceptance criteria 1 through 7 map across Tasks 1 through 5.

Task: Define versioned capability evaluation contracts
Files: scripts/capability-eval-scenarios.json
Acceptance: The JSON manifest declares a fixed set of existing `flow-self-test.md` scenarios spanning Design, Build, Recovery, host-adapter, learning, installer, and completion-proof behavior. Every entry has a unique ID, exact self-test scenario title, architecture layers, expected route, registered npm evidence command, required scenario evidence strings, required command-output strings, and negative-constraint strings. Entries reference existing scenario headings only; no generated report artifact is stored.
Verify: Run `node scripts/capability-eval.js --self-test` after Task 2, then `npm run capability:eval`; inspect that each manifest entry appears once with its route, layers, command, evidence result, and reproduction command.
Comments: none — the JSON field names express the contract; do not add prose comments inside JSON.
Not doing: Adding new self-test scenarios, changing existing workflow semantics, estimating model quality, or committing a generated report.

Task: Implement the zero-dependency capability evaluator
Files: scripts/capability-eval.js
Acceptance: The Node script reads the manifest, `flow-self-test.md`, and `package.json`; validates required fields, duplicate IDs, exact scenario-title resolution, npm command registration, required evidence, and negative constraints; executes each unique npm command once through a platform-safe child process; caches command result by command name; and prints a Markdown report containing per-scenario status, expected route, layers, evidence command, evidence or failure details, coverage, gaps, and copyable reproduction commands. A scenario is `FAIL` for contract or command failure. A read or unexpected runtime failure creates a top-level `BLOCKED` report and non-zero exit. The script maintains the explicit boundary that it verifies local capability contracts and command evidence only.
Verify: Run `node scripts/capability-eval.js --self-test` and confirm its in-memory cases cover complete success, missing field, negative-constraint failure, command failure, and duplicate-command execution once. Run `npm run capability:eval` and confirm it produces the capability evaluation report with scenario statuses and exits zero only when all scenarios pass.
Comments: Add a file-level comment defining the local-contract rather than model-benchmark boundary. Add concise function-level comments for manifest validation, scenario-title extraction, command-result caching, and scenario-status aggregation, including each function's failure semantics.
Not doing: Introducing third-party packages, network calls, persistent caches, CI, external model evaluation, or host-runtime launching.

Task: Register and package-validate evaluation commands
Files: package.json, scripts/validate-devflow.js
Acceptance: `package.json` adds `capability:eval` for the report and `capability:verify` for the evaluator self-test. `verify:all` runs both after the pre-existing validation matrix without removing or reordering unrelated checks. Package validation requires the evaluator and manifest, validates both script mappings, and requires visible evaluator contract terms so the new capability cannot silently disappear from the package.
Verify: Run `npm test`, `npm run capability:verify`, and inspect `package.json` to confirm `verify:all` includes both capability commands exactly once.
Comments: In `scripts/validate-devflow.js`, add short local comments only if a new grouped assertion is not self-explanatory; otherwise follow existing assertion style.
Not doing: Changing installer manifests, host adapters, skill triggers, or the existing purpose of `scenario:coverage`.

Task: Record the feature-ledger capability and boundary
Files: docs/features/validation-harness.md
Acceptance: The validation-harness ledger increments its version and records the new capability commands, scenario-contract evidence model, per-scenario result states, command de-duplication, no-report-commit policy, and local-only boundary. Version history and related artifacts point to the evaluator and manifest. Known constraints explicitly exclude model quality, token, latency, cost, and live host-loading claims.
Verify: Read the ledger after the change and confirm it distinguishes `scenario:coverage` coverage mapping from `capability:eval` contract evidence, with no contradiction against existing non-goals or known constraints.
Comments: none — this is product ledger documentation, not executable code.
Not doing: Revising the PRD, README, or runtime prompts for a maintainer-only local validation command.

Task: Prove the integrated evaluation path
Files: scripts/capability-eval.js, scripts/capability-eval-scenarios.json, package.json, scripts/validate-devflow.js, docs/features/validation-harness.md
Acceptance: The capability self-test passes, the real report executes all referenced unique commands once per report run, package validation recognizes the new assets, and the full local verification matrix succeeds. Failure output identifies the failed scenario, command, exit code when present, and evidence gap; no failure is labeled `PASS`.
Verify: Run `npm run capability:verify`, `npm run capability:eval`, `npm test`, `npm run verify:all`, and `git diff --check`. Review the final report against the spec acceptance and inspect changed files for report files, dependencies, external calls, host-launch logic, or unrelated edits; expect none.
Comments: none — proof task changes no additional code.
Not doing: Claiming live agent behavior, benchmark superiority, external release approval, or performance measurements.
