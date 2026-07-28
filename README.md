# DevFlow-Core

DevFlow-Core is a practical AI development workflow framework. It turns the strongest usable methods from Ponytail, Agent Skills, Superpowers, PUA-Driven Spec Engineering, and PUA into one native, lightweight flow developers can install and use every day.

It is not a link collection. The useful parts are built into this repo as rules, skills, commands, checklists, platform entries, and validation.

## What It Gives Developers

- A default flow that stays light: `Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> devflow-cut -> /devflow-plan | B: devflow-cut -> /devflow-plan | C: direct -> devflow-cut) -> devflow-build -> devflow-prove`
- A Fast / Design-lite / Design / Build / Recovery router with clear small-request gates and user route choice when the boundary is unclear
- A Method Lens selector for choosing Root Cause, Working Backwards, First Principles Cut, Data/Proof, or Operational Owner strategy when the route needs more than generic process
- A Ponytail-style ladder that prefers no-change, reuse existing code, available environment skill, standard library, native platform, installed dependency, one-line/config, then minimum new code
- Brainstorming that produces 2-3 real options when needed, while Design-lite uses short goal, acceptance proof, and not-doing for clear small features
- Anti-overengineering gates before dependencies, abstractions, config, folders, framework layers, and generic engines
- Karpathy-style minimal change rules so every changed line traces to the user goal
- Implementation slices with per-slice verification when work spans multiple steps
- Completion proof with actual command output and `PASS / FAIL / BLOCKED`
- Recovery rules for failures: re-read facts, list 3 hypotheses, switch approach, verify again
- Multi-platform entry files for Codex, Claude Code, opencode, CodeBuddy, WorkBuddy, Copilot, Gemini-style extension metadata, and command-capable hosts — per-platform setup in [docs/platform-setup.md](docs/platform-setup.md)

## Quick Start

One runtime pack, every platform reads its own entry:

| Platform | Entry it reads |
|---|---|
| Codex / opencode / shared agents | `AGENTS.md` |
| Claude Code | `CLAUDE.md` + `.claude/settings.json` (SessionStart hook) |
| CodeBuddy IDE | `.codebuddy/rules/devflow-core/RULE.mdc` |
| GitHub Copilot / VS Code | `.github/copilot-instructions.md` + `.github/instructions/` |
| WorkBuddy | GUI project instructions + imported `skills/` (manual, see guide) |
| Skill-capable hosts | `skills/devflow-*/SKILL.md` |
| Command-capable hosts | `commands/*.toml` |

Install the pack into a target project (dry-run first):

```bash
npm run install:target -- ../my-project
npm run install:target -- ../my-project --write
npm run install:target -- ../my-project --check
```

The installer copies runtime entry files, hook files, skills, commands, and the target-runtime checkers. It does not copy product docs or validation harness files. Existing files are skipped unless `--force` is passed; use `--check` later to detect drift.

For personal global access, install user-level skills, commands, and scripts:

```bash
npm run install:user -- --write                 # ~/.codex by default
npm run install:user -- --home ~/.claude --write
npm run install:user -- --home ~/.codebuddy --write
```

The user installer never installs `AGENTS.md`, `CLAUDE.md`, or project-specific host rule files — those stay project-level.

**Per-platform setup, sync scope, and daily usage: [docs/platform-setup.md](docs/platform-setup.md).**

### Sync Scope And Merge Policy

Use user-level sync for reusable agent capabilities and project sync for repository rules. The agent must ask which target project to use before syncing project-scoped files; do not infer a project from the current shell directory.

| Surface | Scope | Sync policy |
|---|---|---|
| `skills/`, generic `commands/`, and `scripts/devflow-*.js` | User level: `~/.codex`; optionally `~/.claude` | Run the user installer with a dry-run first. Existing files are skipped by default; use `--write --force` only when replacing the user-level runtime is intentional. |
| `.github/`, `.claude/`, `.codebuddy/`, and `.codex/` rule surfaces | Target project | Merge the DevFlow rule block into the target's existing host rule. Preserve local rules and host-specific configuration; do not copy these directories into a global user home. |
| `commands/`, `scripts/`, `hooks/`, `AGENTS.md`, and `CLAUDE.md` | Target project selected by the user | Run `npm run install:target -- <project>` first. Merge existing rule files and `AGENTS.md` manually before write mode; use `--write --force` only when the target explicitly intends to replace the file. |

The current installer merges only the DevFlow SessionStart entry into an existing `.claude/settings.json`. It intentionally skips other existing rule files instead of attempting a generic text merge. When merging `AGENTS.md`, preserve the target project's existing constraints and add the DevFlow route, Cut, Prove, and recovery rules without duplicating or contradicting local instructions.

If a host supports slash commands, use:

```text
/devflow          route a task through Fast / Design / Build / Recovery
/devflow-spec     create and validate a requirements spec before planning
/devflow-plan     create one reviewed, executable plan from a `CUT_PASS`-bounded approved design or spec
/devflow-review   review a diff or plan for overengineering and scope drift
/devflow-debt     harvest intentional devflow: simplification markers
/devflow-prove    verify before claiming done
/devflow-pua      recover when a result is wrong, challenged, or repeatedly misses the target
/devflow-learn    capture reusable corrections and pitfalls
/devflow-audit    audit a repository or scope for overengineering candidates
```

When installed into a target project, only the target-runtime scripts are copied. These are the scripts a developer runs inside the target project:

| Script | Use inside target project |
|---|---|
| `node scripts/devflow-spec.js <spec-file>` | Check that a DevFlow spec has required sections, clear content, and the right `docs/specs/` landing path before planning. |
| `node scripts/devflow-plan.js <plan-file>` | Check that a Plan Pack has executable header fields, categorized `Files`, `Interfaces`, concrete checkbox `Steps`, `Acceptance`, `Verify`, `Comments`, and `Not doing` fields before implementation; it validates structure rather than generating plans or judging architecture. |
| `node scripts/devflow-review.js <plan-or-diff-file>` | Check whether a plan or diff includes the required reuse, native, overbuild, diff, and scope gates before detailed review. |
| `node scripts/devflow-debt.js .` | Harvest intentional `devflow:` simplification markers into a debt report. |
| `node scripts/devflow-audit.js <target-directory>` | Run a repo-wide audit candidate scan for overengineering, missed reuse, stdlib/native replacements, and YAGNI abstractions. |

Saved specs should land in the current target project's `docs/specs/YYYY-MM-DD-<short-kebab-name>.md` unless that project already documents another specs path. Saved implementation plans should land in the current target project's `docs/plans/YYYY-MM-DD-<short-kebab-name>.md`. `docs/features/` is for feature ledgers, not generated specs or task plans.

Other `.js` files under `scripts/` are DevFlow-Core maintainer checks, installer tests, and coverage reports. They stay in this package and are not the daily runtime surface for target projects.

## Runtime Flow

| Route | Use When | Flow |
|---|---|---|
| Fast | Pure Q&A, fact lookup, verification, or trivial code change (one line, no logic change, no risk). | Sense -> Prove |
| Design | Requirement, behavior change, feature, architecture change, unclear ask, or multi-solution decision | Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> devflow-cut -> /devflow-plan | B: devflow-cut -> /devflow-plan | C: direct -> devflow-cut) -> devflow-build -> devflow-prove |
| Build | User asks to implement, fix, land, or execute a change | Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> devflow-cut -> /devflow-plan | B: devflow-cut -> /devflow-plan | C: direct -> devflow-cut) -> devflow-build -> devflow-prove (skip Brainstorm/Plan if already done) |
| Recovery | Failure repeats, user corrects or challenges the result, tests fail unexpectedly, edits go wrong, or the agent is about to give up | devflow-pua when pressure recovery is needed -> re-read facts -> restate goal/result -> 3 hypotheses -> different approach -> Prove |

## Copyable Workflows

### Problem Investigation Workflow

Use this when you want facts before any edit:

```text
Problem report: the login flow looks wrong. Check what is wrong, do not fix yet.
```

Expected route: `Problem -> Sense -> Prove facts`.

Local proof:

```bash
npm run trigger:verify
```

### Requirement Implementation Workflow

Use this when you want the agent to land a feature without skipping design or cut gates:

```text
Requirement: implement CSV export for orders.
```

Expected route: `Build -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> devflow-cut -> /devflow-plan | B: devflow-cut -> /devflow-plan | C: direct -> devflow-cut) -> devflow-build -> devflow-prove`.

Local proof:

```bash
npm run trigger:verify
npm run scenario:coverage
```

### Bug Fix Workflow

Use this when a defect needs a root-cause fix:

```text
Bug report: order totals sometimes render as NaN. Fix the bug.
```

Expected route: `Build with Root-Cause Check -> Prove`.

Local proof:

```bash
npm run trigger:verify
npm test
```

### Target Install Verification Workflow

Use this when you want to prove a target project received the runtime pack:

```text
Install DevFlow into a target project and verify the installed runtime did not drift.
```

Expected route: `Fast -> Prove`.

Local proof:

```bash
npm run install:target -- ../my-project --check
npm run install:verify
```

## Core Skills

| Skill | Responsibility |
|---|---|
| `devflow-core` | Route the work, load the right next skill, preserve the output contract. |
| `devflow-brainstorm` | Clarify goal, constraints, success criteria, assumptions, and 2-3 approaches. |
| `devflow-spec` | Write and validate saved requirements specs for larger or explicitly spec-requested work. |
| `devflow-plan` | Write one `CUT_PASS`-bounded, reviewed construction Plan Pack with file operations, interface contracts, concrete steps, source tracing, and a `devflow-build` handoff. |
| `devflow-cut` | Apply reuse ladder, root-cause check, platform-native checklist, overbuild gate, cut intensity, and delete-list review. |
| `devflow-build` | Execute the smallest approved change in verifiable slices. |
| `devflow-prove` | Run the proof command or scenario, including Skill Activation Check for rule/skill changes, and report command/result/judgment. |
| `devflow-pua` | Stop wrong-path recovery, re-ask or infer the desired result, switch approach, and hand back to Prove/Learn. |
| `devflow-learn` | Capture reusable corrections and pitfalls into `.copilot` learning cards. |
| `devflow-audit` | Run a repo-wide audit for overengineering candidates without applying fixes. |

## DevFlow Brainstorm Interview Discipline

Development requests still start at `devflow-core`. The one-question interview behavior is core `devflow-brainstorm`, not a separate concept.

| Need | DevFlow behavior |
|---|---|
| Clarify a design | `devflow-brainstorm` asks one question at a time, includes a recommended answer, and ends with the normal design contract. |
| Preserve requirements | Use `devflow-spec` when the approved design needs a saved requirements source before planning. |
| Preserve decisions/history | Use feature ledgers for capability history or ADRs for hard-to-reverse trade-offs. |

## Design Output Contract

Every design or plan must include:

```text
Goal: what to solve
Smallest useful plan: why this is the smallest useful solution now
Not doing: what is explicitly cut
Impact: modules/files/behavior involved
Verification: command or scenario that proves it
```

## Completion Output Contract

Every completion claim must include:

```text
Command: <actual command run>
Result: <key output summary>
Adversarial review: <acceptance criteria, regressions, activation paths, and proof coverage checked>
Judgment: PASS / FAIL / BLOCKED
```

If verification is partial, say what is not covered. If verification cannot run, report `BLOCKED` and name the missing condition.

## Native Capabilities Integrated

| Source Strength | DevFlow-Core Native Capability |
|---|---|
| Ponytail | Minimal Solution Ladder, platform-native checklist, root-cause fix check, overengineering review tags, cut intensity, debt markers, ledger command, and repo-wide audit. |
| Agent Skills | Skill anatomy, lifecycle commands, anti-rationalization tables, context/source discipline. |
| Superpowers | Brainstorm-to-spec-to-plan-to-build handoff, `devflow-spec`, date-prefixed specs under `docs/specs/`, bite-sized tasks, `Source` / `Spec coverage` tracing, and verification-before-completion gate. |
| PUA-Driven Spec Engineering | Fast/Design/Recovery gating, project memory checks, skill activation evidence, Codex proof contract, and Method Lens routing. |
| PUA | `devflow-pua` pressure recovery, verifier role, multi-platform packaging, explicit command routing, and lightweight local flavor-method routing without full persona theater. |

## Product Direction

The product and iteration PRD lives in [docs/PRD.md](docs/PRD.md). It defines the developer audience, architecture model, requirements, roadmap, release gates, and immediate backlog for making DevFlow-Core easier to adopt and iterate.

The PRD is a product artifact. Runtime method source still lives in `skills/*/references/*`.

Feature iteration ledgers live in [docs/features/](docs/features/). Start with [docs/features/devflow-core.md](docs/features/devflow-core.md) before changing existing DevFlow Core runtime behavior.

## Verify The Pack

Run the built-in zero-dependency validation:

```bash
npm run verify:all
```

Or run the individual checks:

```bash
npm test
npm run learn:verify
npm run scenario:coverage
npm run trigger:verify
npm run host:verify
npm run install:verify
npm run user:verify
npm run debt:verify
npm run review:verify
npm run spec:verify
npm run plan:verify
npm run audit:verify
```

The scripts check required files, the PRD, skill frontmatter, output contracts, command entries, learning-card schema, Learning closure, learning-loop recall, Scenario Coverage Report, Skill Trigger Verification Report, Host Adapter Verification Report, Installer validation, path consistency, and required method terms.

`npm run verify:all` runs the full local matrix in sequence: package validation, learning-loop validation, scenario coverage, trigger verification, host adapter verification, installer safety verification, debt scanner verification, review gate verification, spec checker verification, plan-pack verification, and audit scanner verification.

`npm run learn:verify` prints `Learning loop validation passed` when the repeated-correction scenario can route from `devflow-core` to `devflow-prove`, recall the matched `.copilot` card, and verify the next-time intercept.

`npm run scenario:coverage` runs `scripts/report-scenario-coverage.js` and reports which self-test scenarios cover Prompt Surface, Loop/Recovery, Harness/Validation, Context, Memory/Learning, Eval/Verifier, and Orchestration/Slices. It also prints Weak layers and Suggested next scenarios so maintainers know what to add next.
The self-tests include a target project install check scenario that exercises post-install `--check` proof.

`npm run trigger:verify` runs `scripts/validate-skill-triggers.js` and checks that common problem, requirement, bug, completion, and learning inputs can be traced to the intended DevFlow route and skill path. It also checks direct command trigger coverage for `/devflow-spec`, `/devflow-plan`, `/devflow-review`, `/devflow-debt`, and `/devflow-audit`.

`npm run host:verify` runs `scripts/validate-host-adapters.js` and checks that Codex/shared agents, Claude, Copilot, VS Code, CodeBuddy, plugin metadata, and Gemini metadata preserve the same DevFlow contract.

`npm run install:verify` runs `scripts/validate-installer.js` and checks dry-run, create, skip-existing, force-overwrite, manifest coverage, and installed runtime self-containment against temporary target projects. It prints `Installer validation passed` when those modes work.
It also checks `--check` mode for matching, missing, and changed target runtime files.

`npm run user:verify` runs `scripts/validate-user-installer.js` and checks user-level dry-run, create, check, skip-existing, force-overwrite, and scope boundaries. It prints `User installer validation passed` when the user installer contract works.

`npm run debt:verify` runs `scripts/devflow-debt.js --self-test` and checks marker discovery, ceiling detection, revisit trigger detection, and example-template filtering. It prints `DevFlow debt self-test passed` when the scanner contract works.

`npm run review:verify` runs `scripts/devflow-review.js --self-test` and checks required gate detection plus missing-gate reporting. It prints `DevFlow review self-test passed` when the scanner contract works.

`npm run spec:verify` runs `scripts/devflow-spec.js --self-test` and checks required section detection, vague spec blocking, and Spec landing guidance. It prints `DevFlow spec self-test passed` when the checker contract works.

`npm run plan:verify` runs `scripts/devflow-plan.js --self-test` and checks executable plan headers, categorized file operations, interface contracts, concrete checkbox steps, retained task fields, and plan landing guidance. It prints `DevFlow plan self-test passed` when the checker contract works. It does not score architecture or generate plans.

`npm run audit:verify` runs `scripts/devflow-audit.js --self-test` and checks reuse, stdlib, native, YAGNI, and delete candidate detection. It prints `DevFlow audit self-test passed` when the scanner contract works.

## Reference Map

Runtime reference material lives beside the skill that uses it:

- [skills/devflow-core/references/core-methods.md](skills/devflow-core/references/core-methods.md): authoritative method rules
- [skills/devflow-core/SKILL.md](skills/devflow-core/SKILL.md): route table, small-request boundary, and capability dispatch
- [skills/devflow-cut/references/native-capability-checklist.md](skills/devflow-cut/references/native-capability-checklist.md): platform/stdlib alternatives before new code
- [skills/devflow-prove/references/flow-self-test.md](skills/devflow-prove/references/flow-self-test.md): end-to-end scenario tests
- [skills/devflow-core/references/skill-guide.md](skills/devflow-core/references/skill-guide.md): how skills are structured

Product and generated project artifacts live under `docs/`, including [docs/PRD.md](docs/PRD.md). Runtime method source must stay in `skills/*/references/*`.

Source-package reference material such as `skills/devflow-core/references/reference-projects.md` and `skills/devflow-core/references/project-structure.md` is validated in this repository, but is not copied by `npm run install:target`.
