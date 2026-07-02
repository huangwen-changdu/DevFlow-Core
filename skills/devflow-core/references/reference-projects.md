# Reference Project Extraction

This file records what the local reference projects actually provide and what DevFlow-Core absorbed as native capabilities. It is an implementation audit, not a dependency map.

## Ponytail

What it does:

- Enforces a smallest-working-solution ladder.
- Prioritizes existing code, standard library, native platform, installed dependencies, one-line/config, then minimum new code.
- Runs the ladder after reading and tracing the touched flow.
- For bug fixes, searches callers and prefers the shared root-cause fix when it is the smaller correct fix.
- Provides overengineering review and whole-repo audit tags: `delete`, `reuse`, `stdlib`, `native`, `yagni`, `shrink`.
- Tracks deliberate simplifications with debt markers.
- Provides `lite`, `full`, and `ultra` intensity modes.
- Ships multi-host adapters and command entries.

Absorbed into DevFlow-Core:

- `devflow-cut` now owns the Minimal Solution Ladder and overengineering review tags.
- `devflow-cut` now includes cut intensity levels and the bug-fix Root-Cause Check.
- `skills/devflow-cut/references/native-capability-checklist.md` provides platform and standard-library alternatives.
- `devflow-build` allows intentional simplification markers with explicit ceiling and revisit trigger.
- `commands/devflow-debt.toml` harvests `devflow:` markers into a shortcut ledger.
- `commands/devflow-review.toml` exposes a delete-list style review.
- `commands/devflow-audit.toml`, `skills/devflow-audit/SKILL.md`, and `scripts/devflow-audit.js` expose a repo-wide overengineering audit without applying fixes.
- `reuse` is a first-class overengineering tag for repeated helpers, utilities, types, or patterns that should use existing project code.

Not absorbed:

- Benchmark scoreboard and hook-based mode persistence. They are useful product features, but not required for the first practical DevFlow release.

## Agent Skills

What it does:

- Organizes development into lifecycle commands: define, plan, build, verify, review, ship.
- Defines a consistent skill anatomy: frontmatter, process, rationalizations, red flags, verification.
- Uses context engineering, source-driven development, incremental implementation, test-driven development, code simplification, and launch checklists.
- Provides commands and persona-style reviewers.

Absorbed into DevFlow-Core:

- `skills/devflow-core/references/skill-guide.md` and all `SKILL.md` files now require executable skill contracts, anti-rationalization checks, and verification.
- `devflow-core` maps work to route and next skill.
- `devflow-build` includes plan-pack, source-check, and slice execution.
- `devflow-prove` includes rules/skills/references validation and verifier lens.
- `commands/*.toml` expose practical lifecycle entry points.

Not absorbed:

- Full 24-skill lifecycle. DevFlow-Core keeps 5 skills to stay lightweight.

## Superpowers

What it does:

- Makes brainstorming mandatory before creative/build work.
- Writes design docs and implementation plans with hard handoffs.
- Executes plans through small tasks with verification.
- Uses subagent-driven development, code review gates, TDD, and verification-before-completion.
- Tests skills through real pressure scenarios.

Absorbed into DevFlow-Core:

- `Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut -> Build -> Prove` remains the default chain.
- `devflow-brainstorm` includes design approval shape, assumption challenges, and approach comparison.
- `devflow-spec`, `commands/devflow-spec.toml`, and `scripts/devflow-spec.js` add a saved requirements source for larger or explicitly spec-requested work.
- Generated specs default to `docs/specs/<short-kebab-name>.md`; `docs/features/` remains feature ledger memory and `docs/plans/` remains implementation planning.
- `devflow-plan` and Plan Pack now require `Source:` and `Spec coverage:` so tasks trace to a spec or approved design.
- `devflow-build` includes implementation slices and exact verification per slice.
- `skills/devflow-prove/references/flow-self-test.md` defines pressure scenarios for the framework itself.

Not absorbed:

- Mandatory worktree/subagent/full TDD or full design-doc approval for every task. DevFlow-Core uses saved specs only when they reduce ambiguity.

## PUA-Driven Spec Engineering

What it does:

- Adds Fast / Design / Escalate routing.
- Requires project fact checks, Graphify, project knowledge, learning index, and coding rules before conclusions.
- Enforces skill activation evidence and completion proof.
- Maintains cross-platform rule consistency.
- Defines Codex-compatible proof contracts where local verification is candidate evidence, not final external verifier status.

Absorbed into DevFlow-Core:

- `devflow-core` now includes Fast / Design / Recovery routing.
- `skills/devflow-core/references/core-methods.md` includes Method Lens so Design, Recovery, and high-risk proof can choose a task-specific working strategy.
- `devflow-pua` now owns a local pressure-recovery methodology stack under `skills/devflow-pua/references/`: router, method library, and flavor display protocol.
- `devflow-brainstorm` now requires Method Lens selection or an explicit "standard route is enough" decision before the design contract.
- `devflow-learn` preserves the learning/pitfall card loop with `.copilot/LEARNING_INDEX.md` and matched cards.
- `AGENTS.md`, `.github/copilot-instructions.md`, and CodeBuddy rules stay semantically aligned.
- `devflow-prove` requires command/result/judgment and separates `candidate_pass` from external final approval when relevant.
- `devflow-prove` includes a Skill Activation Chain Check after rule, command, prompt, entry, or skill changes.
- `skills/devflow-prove/references/flow-self-test.md` includes correction and learning scenarios.

Not absorbed:

- Heavy pressure rhetoric and full OpenSpec default. DevFlow-Core keeps the recovery mechanics without making every task high-pressure.

## PUA

What it does:

- Packages one core behavior across many platforms.
- Provides explicit commands, submodes, multi-language entry points, verifier/policy/action/self-review roles, and high-agency recovery.
- Uses method routing and failure-pattern switching.
- Emphasizes proactive follow-through, evidence, and independent verification.

Absorbed into DevFlow-Core:

- `plugin.json`, `gemini-extension.json`, commands, Copilot, and CodeBuddy entries make the framework installable/adaptable.
- Method Lens absorbs PUA method routing as native DevFlow behavior for normal work: Root Cause, Working Backwards, First Principles Cut, Data/Proof, and Operational Owner are selectable lenses.
- `devflow-pua/references/methodology-router.md`, `methodology-library.md`, and `flavor-display.md` absorb the practical PUA flavor-method routing for pressure recovery, including the compact visible output `METHOD: {flavor} / {method}` plus a concise `SWITCH:` line when the method changes.
- `devflow-prove` includes a verifier lens and forbids self-certifying final status when an external verifier is required.
- `devflow-core` includes Recovery route and 3-hypothesis approach switching.

Not absorbed:

- Full PUA persona theater, pressure rhetoric, leaderboard, network feedback, agent lifecycle accounting, hook automation, and default full OpenSpec. DevFlow-Core only keeps the lightweight flavor-method display needed for pressure recovery.

## Resulting Product Shape

DevFlow-Core is intentionally smaller than the reference projects:

- A small focused skill set, not 20+ lifecycle skills.
- One native method reference, not multiple competing method systems.
- Commands and platform entry files are thin adapters.
- Verification is runnable with `npm test`.
- Heavy flows are optional escalation, not the default developer experience.
