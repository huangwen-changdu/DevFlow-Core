# DevFlow-Core

DevFlow-Core is a practical AI development workflow framework. It turns the strongest usable methods from Ponytail, Agent Skills, Superpowers, PUA-Driven Spec Engineering, and PUA into one native, lightweight flow developers can install and use every day.

It is not a link collection. The useful parts are built into this repo as rules, skills, commands, checklists, platform entries, and validation.

## What It Gives Developers

- A default flow that stays light: `Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut -> Build -> Prove`
- A Fast / Design-lite / Design / Build / Recovery router with clear small-request gates and user route choice when the boundary is unclear
- A Method Lens selector for choosing Root Cause, Working Backwards, First Principles Cut, Data/Proof, or Operational Owner strategy when the route needs more than generic process
- A Ponytail-style ladder that prefers no-change, reuse, standard library, native platform, installed dependency, one-line/config, then minimum new code
- Brainstorming that produces 2-3 real options when needed, while Design-lite uses short goal, acceptance proof, and not-doing for clear small features
- Anti-overengineering gates before dependencies, abstractions, config, folders, framework layers, and generic engines
- Karpathy-style minimal change rules so every changed line traces to the user goal
- Implementation slices with per-slice verification when work spans multiple steps
- Completion proof with actual command output and `PASS / FAIL / BLOCKED`
- Recovery rules for failures: re-read facts, list 3 hypotheses, switch approach, verify again
- Multi-platform entry files for Codex, Claude, Copilot, CodeBuddy, Gemini-style extension metadata, and command-capable hosts

## Quick Start

Use this repo as a project-level rules pack:

```text
AGENTS.md                         Codex / general agents
CLAUDE.md                         Claude Code pointer
.github/copilot-instructions.md   GitHub Copilot repo rules
.github/instructions/*.md         VS Code task instructions
.github/prompts/*.md              Manual prompt entry
.codebuddy/rules/*/RULE.mdc       CodeBuddy always-on rule
.claude/settings.json             Claude Code project hook registration
.claude/commands/devflow-core.md  Claude Code /devflow-core command
hooks/hooks.json                  Claude plugin hook registration
hooks/devflow-session-start.js    Claude SessionStart context injection
skills/devflow-*/SKILL.md         Skill-capable agents
skills/devflow-*/references/*.md  Skill-local reference material
commands/*.toml                   Slash-command capable agents
```

Start most work with `devflow-core`.

Install into a target project with a dry-run first:

```bash
npm run install:target -- ../my-project
npm run install:target -- ../my-project --write
npm run install:target -- ../my-project --check
npm run install:target -- ../my-project --write --force
```

The installer copies runtime entry files, Claude Code hook files, skills, and commands. It does not copy product docs or validation harness files into the target project. Existing files are skipped unless `--force` is passed.

Use `--check` after install to verify the target project's runtime files still match this package. It reports `ok`, `missing`, or `changed` per runtime file, prints `Check passed` when the installed runtime matches, and exits non-zero when the installed pack is incomplete or drifted.

Install user-level skills, commands, and scripts for Codex with a dry-run first:

```bash
npm run install:user
npm run install:user -- --write
npm run install:user -- --check
npm run install:user -- --write --force
```

The user installer targets `CODEX_HOME` or `~/.codex` by default. It copies only `skills/`, `commands/`, and `scripts/devflow-*.js`; it does not install `AGENTS.md`, `CLAUDE.md`, or project-specific host rule files. Existing user files are skipped unless `--force` is passed.

For Claude Code user-level files, point the same installer at `~/.claude`:

```bash
npm run install:user -- --home ~/.claude
npm run install:user -- --home ~/.claude --write
npm run install:user -- --home ~/.claude --check
```

This installs user-level `skills/`, `commands/`, and `scripts/devflow-*.js` under `~/.claude`. Project rules such as `AGENTS.md` and `CLAUDE.md` still belong in the target repository.

Hard boundary: install `AGENTS.md` and `CLAUDE.md` only with `npm run install:target -- <project> --write`. Do not install them into `~/.codex`, `~/.claude`, or another user-level runtime directory.

If a host supports slash commands, use:

```text
/devflow          route a task through Fast / Design / Build / Recovery
/devflow-spec     create and validate a requirements spec before planning
/devflow-plan     create the smallest usable plan from a design
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
| `node scripts/devflow-plan.js <plan-file>` | Check that a Plan Pack has executable `Task`, `Files`, `Acceptance`, `Verify`, and `Not doing` fields before implementation. |
| `node scripts/devflow-review.js <plan-or-diff-file>` | Check whether a plan or diff includes the required reuse, native, overbuild, diff, and scope gates before detailed review. |
| `node scripts/devflow-debt.js .` | Harvest intentional `devflow:` simplification markers into a debt report. |
| `node scripts/devflow-audit.js <target-directory>` | Run a repo-wide audit candidate scan for overengineering, missed reuse, stdlib/native replacements, and YAGNI abstractions. |

Saved specs should land in `docs/specs/<short-kebab-name>.md` unless the target project already documents another specs path. Saved implementation plans should land in `docs/plans/<short-kebab-name>.md`. `docs/features/` is for feature ledgers, not generated specs or task plans.

Other `.js` files under `scripts/` are DevFlow-Core maintainer checks, installer tests, and coverage reports. They stay in this package and are not the daily runtime surface for target projects.

## Use With Codex

Use DevFlow-Core as a runtime pack inside the project Codex should work on. The target project is the source of truth; this repository is only the pack source.

1. Install the runtime pack into the target project:

```bash
cd D:/Project/Github/DevFlow-Core
npm run install:target -- D:/Project/YourProject
npm run install:target -- D:/Project/YourProject --write
npm run install:target -- D:/Project/YourProject --check
```

Installed file map:

| Target path | Purpose |
|---|---|
| `AGENTS.md` | Codex and shared-agent runtime prompt. This is the main Codex entry. |
| `CLAUDE.md` | Claude Code adapter that points to the same DevFlow contract. |
| `.github/copilot-instructions.md` | GitHub Copilot repository-level rules. |
| `.github/instructions/devflow.instructions.md` | VS Code instruction file for DevFlow authoring and rule edits. |
| `.github/prompts/devflow.prompt.md` | VS Code prompt entry for manual DevFlow invocation. |
| `.codebuddy/rules/devflow-core/RULE.mdc` | CodeBuddy always-on rule entry. |
| `.claude/settings.json` | Claude Code project hook registration for DevFlow SessionStart injection. |
| `.claude/commands/devflow-core.md` | Claude Code `/devflow-core` command that loads core routing and Brainstorm triggers. |
| `hooks/hooks.json` | Claude plugin hook registration for plugin-style installs. |
| `hooks/devflow-session-start.js` | Lightweight SessionStart hook that injects DevFlow routing reminders. |
| `commands/devflow*.toml` | Slash-command entries for hosts that support command files. |
| `skills/devflow-*/SKILL.md` | Skill definitions for skill-capable agents. |
| `skills/devflow-brainstorm/references/interview-discipline.md` | Interview discipline reference used by DevFlow Brainstorm. |
| `skills/*/references/*.md` or skill-local reference files | Runtime reference material used by the installed skills. |
| `skills/skill-call-diagram.md` | Skill chain map for humans and agents. |
| `scripts/devflow-spec.js`, `scripts/devflow-plan.js`, `scripts/devflow-review.js`, `scripts/devflow-debt.js`, `scripts/devflow-audit.js` | Target-runtime checkers available inside the target project. |

Global Codex config vs project runtime pack:

| Scope | Put there | Why |
|---|---|---|
| Codex global config | Personal defaults such as "read the repo `AGENTS.md` first", proof-before-done preference, minimal-change habits, and user-level DevFlow `skills/`, `commands/`, and `scripts/`. | Good for one developer's baseline behavior and global slash/skill access, but not versioned with a project and not shared with teammates automatically. |
| Target project runtime pack | `AGENTS.md`, host rule files, `commands/`, `skills/`, skill references, and `scripts/devflow-*.js`. | Project-specific, reviewable, install-checkable, and available to any agent or teammate opening the repo. |

Use both when possible: global Codex config can bootstrap the habit, but the target project should still carry the DevFlow runtime files that define and verify how that project is worked on.

2. If the target project already has `AGENTS.md`, `CLAUDE.md`, Copilot rules, or CodeBuddy rules, do not overwrite them blindly. The installer skips existing files by default. Merge the DevFlow rules into the target project's existing rules, or use `--write --force` only when replacing them is intentional.

3. Open the target project root in Codex. Codex should read the installed `AGENTS.md` from that project. Do not keep Codex pointed at `DevFlow-Core` when the real task belongs to another repository.

4. Start work with route-friendly wording:

```text
Problem report: the login flow looks wrong. Check what is wrong, do not fix yet.
Requirement: implement CSV export for orders.
Bug report: order totals sometimes render as NaN. Fix the bug.
/devflow review this request before coding
```

5. Treat `AGENTS.md` as the stable Codex contract. Codex may not reliably auto-load every `SKILL.md`, so the installed prompt, command files, and local scripts must carry the workflow. Skill-capable hosts can still use `devflow-core` and the focused `devflow-*` skills.

6. Use the installed runtime scripts when files are available:

```bash
node scripts/devflow-plan.js <plan-file>
node scripts/devflow-spec.js <spec-file>
node scripts/devflow-review.js <plan-or-diff-file>
node scripts/devflow-debt.js .
node scripts/devflow-audit.js <target-directory>
```

Execution model:

- These scripts do not run by themselves after installation.
- They are local checkers that Codex or another agent runs when the task route calls for them, or when the user invokes a matching command such as `/devflow-spec`, `/devflow-plan`, `/devflow-review`, `/devflow-debt`, or `/devflow-audit`.
- `commands/devflow*.toml` tells command-capable hosts what to do; the command prompt can instruct the agent to run the matching `node scripts/devflow-*.js` command.
- `AGENTS.md` gives Codex the always-visible workflow contract. If Codex does not auto-load `SKILL.md`, it can still follow `AGENTS.md`, read command files, and run the installed scripts as shell commands.
- No git hook, daemon, file watcher, or CI job is installed by default. Automatic enforcement would require a separate hook or CI integration, which this pack intentionally does not add yet.

7. Before claiming completion, run the target project's real proof command, then report command, result, and judgment. DevFlow-Core package checks prove the framework pack; they do not prove a target project's business feature.

```text
Command: <target project test/build/manual scenario>
Result: <key output>
Judgment: PASS / FAIL / BLOCKED
```

8. When updating an installed target project after this pack changes, run:

```bash
npm run install:target -- D:/Project/YourProject --check
```

If check mode reports `changed`, review the target-local edits before replacing anything.

## Use With Claude Code

Use project-level install for a repository Claude Code should work on:

```bash
cd D:/Project/Github/DevFlow-Core
npm run install:target -- D:/Project/YourProject
npm run install:target -- D:/Project/YourProject --write
npm run install:target -- D:/Project/YourProject --check
```

Claude Code reads the target project's `CLAUDE.md`. In this pack, `CLAUDE.md` points back to the shared DevFlow contract in `AGENTS.md` and names the `devflow-*` skills to use when skills are available.

Claude Code can also trigger DevFlow at session start through the installed hook files:

- Project install: `.claude/settings.json` runs `node hooks/devflow-session-start.js`.
- Slash command: `.claude/commands/devflow-core.md` provides `/devflow-core` for Claude Code.
- Plugin install: `hooks/hooks.json` registers the same script through `SessionStart`.
- The hook only injects a short DevFlow Core reminder. It does not run tests, edit files, block tools, or start a Stop-loop.
- If a target project already has `.claude/settings.json`, the installer preserves existing fields and appends the DevFlow `SessionStart` entry. Use `--force` only when replacing the whole file is intentional.

Installed Claude-relevant project files:

| Target path | Purpose |
|---|---|
| `CLAUDE.md` | Claude Code project entry point. | 
| `AGENTS.md` | Shared DevFlow runtime rules referenced by `CLAUDE.md`. | 
| `.claude/settings.json` | Project-level Claude Code hook registration. |
| `.claude/commands/devflow-core.md` | Claude Code `/devflow-core` command and Brainstorm trigger bridge. |
| `hooks/hooks.json` | Plugin-style Claude hook registration. |
| `hooks/devflow-session-start.js` | SessionStart hook that injects a short DevFlow Core activation reminder. |
| `skills/devflow-*/SKILL.md` | Skill-capable runtime workflows. |
| `skills/devflow-brainstorm/references/interview-discipline.md` | Interview discipline reference used by DevFlow Brainstorm. |
| `skills/*/references/*.md` or skill-local reference files | Runtime reference material for the installed skills. |
| `commands/devflow*.toml` | Command metadata for hosts that can use it. |
| `scripts/devflow-spec.js`, `scripts/devflow-plan.js`, `scripts/devflow-review.js`, `scripts/devflow-debt.js`, `scripts/devflow-audit.js` | Local checkers Claude can run from the target project. |

Optional user-level Claude Code install:

```bash
cd D:/Project/Github/DevFlow-Core
npm run install:user -- --home ~/.claude
npm run install:user -- --home ~/.claude --write
npm run install:user -- --home ~/.claude --check
```

Use user-level install only for personal global access to DevFlow skills, commands, and scripts. It does not install `AGENTS.md`, `CLAUDE.md`, or project-specific rules. For team use and project-specific behavior, keep the project-level runtime pack installed in the repository.

## Runtime Flow

| Route | Use When | Flow |
|---|---|---|
| Fast | Pure Q&A, fact lookup, verification, or trivial code change (one line, no logic change, no risk). | Sense -> Prove |
| Design | Requirement, behavior change, feature, architecture change, unclear ask, or multi-solution decision | Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut |
| Build | User asks to implement, fix, land, or execute a change | Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut -> Build -> Prove (skip Brainstorm/Plan if already done) |
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

Expected route: `Build -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut -> Build -> Prove`.

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
Judgment: PASS / FAIL / BLOCKED
```

If verification is partial, say what is not covered. If verification cannot run, report `BLOCKED` and name the missing condition.

## Native Capabilities Integrated

| Source Strength | DevFlow-Core Native Capability |
|---|---|
| Ponytail | Minimal Solution Ladder, platform-native checklist, root-cause fix check, overengineering review tags, cut intensity, debt markers, ledger command, and repo-wide audit. |
| Agent Skills | Skill anatomy, lifecycle commands, anti-rationalization tables, context/source discipline. |
| Superpowers | Brainstorm-to-spec-to-plan-to-build handoff, `devflow-spec`, `docs/specs/<short-kebab-name>.md`, bite-sized tasks, `Source` / `Spec coverage` tracing, and verification-before-completion gate. |
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

`npm run plan:verify` runs `scripts/devflow-plan.js --self-test` and checks task field detection, missing field reporting, vague plan blocking, and plan landing guidance. It prints `DevFlow plan self-test passed` when the checker contract works.

`npm run audit:verify` runs `scripts/devflow-audit.js --self-test` and checks reuse, stdlib, native, YAGNI, and delete candidate detection. It prints `DevFlow audit self-test passed` when the scanner contract works.

## Reference Map

Runtime reference material lives beside the skill that uses it:

- [skills/devflow-core/references/core-methods.md](skills/devflow-core/references/core-methods.md): authoritative method rules
- [skills/devflow-core/references/decision-tree.md](skills/devflow-core/references/decision-tree.md): route and gate quick reference
- [skills/devflow-cut/references/native-capability-checklist.md](skills/devflow-cut/references/native-capability-checklist.md): platform/stdlib alternatives before new code
- [skills/devflow-prove/references/flow-self-test.md](skills/devflow-prove/references/flow-self-test.md): end-to-end scenario tests
- [skills/devflow-core/references/skill-guide.md](skills/devflow-core/references/skill-guide.md): how skills are structured

Product and generated project artifacts live under `docs/`, including [docs/PRD.md](docs/PRD.md). Runtime method source must stay in `skills/*/references/*`.

Source-package reference material such as `skills/devflow-core/references/reference-projects.md` and `skills/devflow-core/references/project-structure.md` is validated in this repository, but is not copied by `npm run install:target`.
