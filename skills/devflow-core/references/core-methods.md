# DevFlow Core Methods

This document is DevFlow Core's source of truth. It defines the native methods agents must apply directly. Do not outsource behavior to other projects or describe ideas without turning them into actions, gates, and proof.

## Method 0: Architect Mindset

Purpose: give every DevFlow route engineering judgment, not just process compliance.

This method is always active. It shapes how every other method is applied.

### Thinking Principles

1. System Awareness — Before any change, understand: what module am I in, what depends on it, what breaks if I'm wrong, what's the blast radius?

2. Contract Thinking — Every function, API, and component is a contract. Changing the contract costs more than changing the implementation. Prefer contract-preserving changes.

3. Coupling Lens — Tight coupling makes changes expensive. When adding code, ask: am I creating a new dependency? Can the caller be simpler? Is this coupling necessary now?

4. Data Flow First — For bugs, trace data from input to output. The bug lives where the data is wrong, not where the symptom appears.

5. Failure Mode Analysis — For risky changes, enumerate: what fails if this is wrong? What's the rollback? What's the blast radius? Spend ceremony proportional to the answer.

6. Simplicity Budget — Every system has a complexity budget. Spending it on abstractions, config surfaces, or framework layers means less budget for the actual problem. Spend deliberately.

7. Evidence Over Intuition — "I think it works" is not proof. "The test passed" is proof. "The build succeeded" is proof. Demand evidence at every gate.

8. Reversibility Awareness — Some decisions are easy to reverse (code), some are hard (data migration, API contract, schema). Spend more ceremony on hard-to-reverse decisions.

### Decision Heuristics

| Situation | Engineering instinct |
|---|---|
| "Should I add an abstraction?" | Only if there are 2+ callers with different needs today. |
| "Should I add a dependency?" | Only if the stdlib/platform can't do it and the cost of the dependency < cost of writing it. |
| "Should I refactor this?" | Only if the current code blocks the user goal. Not "while I'm here". |
| "Should I add a config option?" | Only if there are 2+ valid values now. Not for future flexibility. |
| "Should I fix the symptom or the cause?" | Cause, always. Search callers before editing. |
| "Is this done?" | Only with proof. Run the command, show the output. |
| "The user said it's wrong" | Stop. Re-read facts. Quarantine assumptions. Switch approach. |

## Capability Matrix

| Capability | Action | Blocks |
|---|---|---|
| Architect Mindset | Apply engineering judgment: system awareness, contract thinking, coupling lens, data flow first, failure mode analysis, simplicity budget, evidence over intuition, reversibility awareness. | Process compliance without judgment, symptom-level fixes, speculative structure. |
| Context Map | Read project rules, docs, relevant files, tests, commands, memory, and maps before deciding. | Guessing, stale assumptions, hallucinated project facts. |
| Lifecycle Router | Choose Fast, Design-lite, Design, Build, or Recovery by task shape and risk. | One-size-fits-all ceremony and silent risk escalation. |
| Small Request Boundary | Classify tiny work by risk, impact, uncertainty, and proof before choosing Fast or Design-lite. | Treating every "small" feature as Fast Path or forcing heavy Design on trivial work. |
| Method Lens | Select the working strategy for Design, Recovery, problem solving (问题解决), bug fixing, architecture design (架构设计), or high-risk proof before choosing artifacts. | Generic process with no task-specific brain. |
| Brainstorm First | Clarify goal, constraints, success criteria, assumptions, and 2-3 approaches. When Fast Exit conditions are met (small change to existing feature, all boundary gates pass, single plausible path), offer Fast Exit as a recommended option at the Path Selection Gate — the user chooses, not the LLM. | Building the first suggested implementation without checking the real goal. Auto-selecting Fast Exit without user confirmation. |
| Minimal Solution Ladder | Prefer no-change, reuse, available environment skill, stdlib, platform, installed dependency, one-line/config, then minimum new code. | Rewriting existing capability, ignoring available skills, adding dependencies too early. |
| Native Capability Check | Scan platform and standard-library alternatives before adding libraries or custom code. | Wrapper packages for things the runtime already provides. |
| Anti-Overengineering Gate | Require a current reason for abstractions, dependencies, config, folders, framework layers, or generic engines. | Future-proofing, one-caller abstractions, speculative extension points. |
| Root-Cause Fix Check | For bugs, search callers and fix the shared entry when that is the smaller correct change. | Per-caller symptom patches that leave sibling paths broken. |
| Intentional Simplification Ledger | Mark accepted shortcuts with a ceiling and revisit trigger, then harvest them with a debt command. | "Later" shortcuts that silently become permanent. |
| Spec Document | Write a saved requirements source for larger or explicitly spec-requested work before planning tasks. | Requirements drift across plans and implementation without a reviewable source. |
| Plan Pack | Convert approved design or spec into small tasks with source coverage, files, acceptance, and verification. | Big-bang patches and task lists with no proof. |
| Surgical Build Discipline | Touch only files required by the goal and match project style. | Opportunistic cleanup, broad refactors, unrelated formatting churn. |
| Implementation Slices | Build one verifiable slice at a time. | Late testing and unreviewable patches. |
| Proof Gate | Run fresh command or scenario evidence before completion claims. | "Looks good", old output, or partial checks presented as full proof. |
| Recovery Switch | After failure or correction, re-read facts, list 3 hypotheses, and try a materially different approach. | Retrying the same idea, blaming environment without evidence. |
| Pressure Recovery Gate | When the user challenges a result or repeated edits miss, load `devflow-pua`, stop the current path, restate the goal/result, ask pointed questions if blocked, switch approach, then prove. | Continuing the same wrong approach under pressure. |
| Skill Activation Evidence | Record which skill triggered, why, and what artifact/check it requires. | Saying a skill was used when it was only mentioned. |
| Skill Activation Chain Check | After rule, command, prompt, entry, or skill changes, verify trigger wording, runtime load action, and downstream evidence. | Editing skill text while the skill is still unreachable. |
| Knowledge Recall | Probe existing learning and business knowledge indexes, then read only task-matched records. | Context bloat, stale bulk reads, and knowledge that is written but never used. |
| Learning Capture | When user correction or repeat failure happens, load `devflow-learn` and capture the next-time intercept rule. | Repeating the same preventable mistake. |
| Skill Discovery | Scan available skills in the environment (platform skill registry, `use_skill` listing, local skill directories) before and during the devflow route. External skills are complementary: devflow manages scope and risk; external skills guide execution quality. Suggest loading matched skills alongside the devflow route. `CUT_REUSE` applies only when a skill fully handles the task with no new code needed. | Ignoring available skills that could assist execution. Forcing devflow-only routing when an external skill could guide implementation quality. Treating external skills as replacements for the devflow chain when they are complementary. |

## Method 1: Context Map

Purpose: ground decisions in current project facts.

Before deciding, inspect the narrowest useful context:

1. Read rules entry points: `AGENTS.md`, `CLAUDE.md`, `.github/*`, `.codebuddy/*` when present.
2. Read relevant docs and source files.
3. Search for existing helpers, patterns, tests, and commands.
4. Probe `.copilot/LEARNING_INDEX.md`. When present, read the index, match the task against Trigger and Scope, then read only matched cards.
5. Probe `docs/project-knowledge/`. When present, read `AI-START-HERE.md`; fall back to `index.md`; then use `registry.json` when present to select only task-relevant domain, module, risk, or entry-point documents.
6. If either location, index, entry, or registry is absent, record the absence and continue. Recall alone must not create `.copilot/` or `docs/project-knowledge/`.
7. If architecture or impact is involved, read `graphify-out/GRAPH_REPORT.md` when present.
8. Scan available skills in the current environment — platform skill registry (e.g., `use_skill` tool listing), local skill directories (`~/.claude/skills/`, `~/.codex/skills/`, `.github/skills/`, `.codebuddy/skills/`), or any other skill source the platform exposes. Match by description keywords against the task. External skills are complementary to the devflow route: devflow manages scope and risk; external skills guide execution quality. Record matched skills for alongside-route loading. Missing or unavailable skills are non-blocking.

Output evidence:

```text
Facts: read/confirmed <files or commands>
Knowledge recall: none / learning index + matched card / project knowledge entry + matched docs
Skill Discovery: none / <skill-name> (matched: <why>)
Unknowns: <still unknown, or none>
```

Do not claim understanding unless the understanding cites facts that were read or checked.

## Method 2: Brainstorm First

Purpose: prevent building the wrong thing.

Use for new requirements, behavior changes, features, architecture changes, ambiguous requests, and multi-solution decisions. Do NOT use for documentation writing, config tuning, trivial code changes, or clear bug fixes with known root cause — those go through Fast or Design-lite.

**Fast Exit**: When a task enters Brainstorm but is a small change to an existing feature (not a new requirement), all four Small Request Boundary gates pass, and only one plausible implementation path exists, offer Fast Exit as a recommended option at the Path Selection Gate. The user chooses Fast Exit or full A/B/C — the LLM does not auto-select. If the user chooses Fast Exit, present a short design contract directly, get approval, and hand off to `devflow-cut`. This prevents forcing spec/plan ceremony on simple tasks while keeping the user in control.

Actions:

1. Restate the goal in one sentence.
2. Name constraints: compatibility, data, security, UX, performance, platform, deadline.
3. Define visible success criteria.
4. Challenge hidden assumptions.
5. Generate 2-3 approaches with tradeoffs.
6. Recommend one approach and explain why it is the smallest useful path.
7. Produce the design output contract.

Required output:

```text
Goal: ...
Motivation: why now, what triggered this need
Facts: read/confirmed ...
Constraints: ...
Acceptance: ...
Hidden assumptions: 1 / 2 / 3
Approaches:
- A: does / does not / cost / verification
- B: does / does not / cost / verification
- C: does / does not / cost / verification, optional
Recommendation: ...
```

Do not ask five vague questions at once. Ask the smallest question that unlocks the next decision.

## Method 3: Small Request Boundary

Purpose: make "small request" and "small feature" routing explicit instead of subjective.

A small request may use Fast only when all four gates pass:

| Gate | Must be true |
|---|---|
| Impact | Touches one local behavior, file, setting, doc section, or display field. |
| Risk | No auth, money, permissions, data migration, deletion, external API contract, release flow, or security boundary. |
| Uncertainty | Goal, expected behavior, and acceptance proof are already clear from user words or current project facts. |
| Proof | A narrow command, search check, focused test, or manual scenario can verify it quickly. |

A small feature is still a requirement. It can use Design-lite only when it passes the same four gates and has at most one plausible implementation path after facts are read. Design-lite means: one-sentence goal, acceptance proof, not-doing list, Method Lens if useful, Cut check, then Build/Prove when implementation is requested.

Use full Design when any of these are true:

- more than one user-visible behavior may change
- multiple implementation paths are plausible
- product/API/architecture semantics are unclear
- the change crosses modules, packages, platforms, roles, or persistence boundaries
- rollback, migration, compatibility, or release risk matters
- the user asks for a plan, proposal, comparison, or architecture judgment

If the route is unclear after reading facts, ask the user to choose:

```text
Route Choice Needed:
- Fast: small factual/tiny execution; minimal design; quickest proof.
- Design-lite: small feature; short goal/acceptance/not-doing; then build if requested.
- Full Design: ambiguous or higher-risk feature; compare approaches before build.
```

Do not decide by estimated line count. A one-line auth, billing, deletion, migration, or API-contract change is not small.

## Method 4: Method Lens

Purpose: give DevFlow a task-specific working strategy without importing a separate methodology system.

Use when the route is Design or Recovery, when proof risk is high, or when a normal route feels too generic for the problem.

Pick one primary lens, and at most one secondary lens when it materially reduces risk:

| Lens | Use when | Action |
|---|---|---|
| Root Cause | Bug, regression, failing proof, repeated symptom. | Search causes and callers before proposing the fix. |
| Working Backwards | Product, UX, API, workflow, or ambiguous value. | Start from user-visible outcome and acceptance proof. |
| First Principles Cut (第一性原理) | Problem solving (问题解决), bug fixing, 修 bug, architecture design (架构设计), scope, dependency, abstraction, or architecture pressure. | Reduce to facts, constraints, invariants, and the smallest necessary mechanism before proposing or building. |
| Data/Proof | Metrics, validation, benchmark, release, or verifier-sensitive work. | Define evidence and status owner before implementation. |
| Operational Owner | Cross-file, cross-agent, install, release, or handoff work. | Name owner, affected surfaces, rollback or follow-through proof. |

Output:

```text
Method Lens: primary <lens>; secondary <lens/none>; why <risk or decision it handles>
```

Rules:

- The lens changes how the existing DevFlow route is executed; it does not replace Sense, Brainstorm, Cut, Build, or Prove.
- Use First Principles Cut (第一性原理) for problem solving (问题解决), 修 bug, and architecture design (架构设计) when assumptions, inherited abstractions, or the apparent solution may hide the real constraint.
- Do not add PUA flavor, pressure rhetoric, leaderboard, hook lifecycle, or default full spec-heavy process to use a normal Method Lens. Pressure recovery is the exception: `devflow-pua` may use its local methodology router/library/display references to show flavor-method routing.
- If no lens changes the decision, say `Method Lens: none; why standard route is enough`.

## Method 5: Minimal Solution Ladder

Purpose: choose the smallest useful solution after understanding the problem.

Run this before writing new code:

1. Does this need to exist?
2. Can the user goal be met without changing code?
3. Does this already exist in the codebase?
4. Does an available skill in the environment handle this without writing new code? (e.g., `pdf` for reading a PDF, `understand` for codebase analysis. If a skill like `frontend-design` guides how to implement, load it alongside the devflow route — it complements, not replaces, the devflow chain.)
5. Does the standard library do it?
6. Does the native platform do it?
7. Does an already-installed dependency do it?
8. Can it be one line or direct configuration?
9. Only then write the minimum new code.

Required evidence:

```text
Reuse Check: searched <files/helpers/patterns/skills>; selected rung <N>; reason <why lower rungs failed>
```

Do not cut trust-boundary validation, auth, permission, data-loss protection, security, accessibility, explicitly requested behavior, or the smallest useful verification.

## Method 6: Root-Cause Fix Check

Purpose: keep bug fixes small by fixing the shared cause, not only the reported path.

Use for bug reports, failing tests, regressions, or any task that says fix/debug/broken.

Actions:

1. Identify the function, component, route, command, rule, or helper likely to change.
2. Search callers/references before editing.
3. Prefer one shared guard/fix when it covers sibling callers and stays within the requested behavior.
4. Use a narrow fix only when the shared fix would change unrelated behavior or broaden risk.

Output:

```text
Root-Cause Check: searched <callers/references>; fix location <shared/narrow>; reason <why>
```

## Method 7: Native Capability Check

Purpose: make platform and standard-library solutions easy to choose.

Before adding dependencies or custom wrappers, scan [native-capability-checklist.md](../../devflow-cut/references/native-capability-checklist.md) for the relevant layer:

- HTML / CSS / browser APIs
- JavaScript / Node.js standard library
- Python standard library
- database constraints and queries
- shell/platform primitives

Output:

```text
Native Check: checked <layer>; platform option <used/not enough>; reason <why>
```

If a platform option is not enough, name the current limitation, not a hypothetical future limitation.

## Method 8: Anti-Overengineering Gate

Purpose: block unnecessary structure before it becomes code.

Before adding any of these, answer "why now?":

- dependency
- abstraction
- config surface
- directory
- framework layer
- generic reusable engine
- future-proof extension point

Gate output:

```text
Overbuild Check: what new structure is being added? Why is it needed now?
Reuse Check: what existing capability was checked first?
Trace Check: what design contract, spec, or accepted user request does each key change trace to?
Scope Check: what tempting but unrequested feature was removed?
Diff Check: which user goal does each changed file serve?
```

Default answer:

- If the need is hypothetical, do not add it.
- If there is one caller, prefer direct code.
- If a platform primitive exists, use it.
- If the code is already minimal, leave it alone.

## Method 9: Intentional Simplification Ledger

Purpose: keep accepted shortcuts visible instead of pretending they are perfect forever.

When choosing a deliberate simplification with a known ceiling, mark it near the code or rule:

```text
devflow: <ceiling>, revisit when <trigger>
```

Rules:

1. The marker must include both the ceiling and the revisit trigger.
2. Do not use it for missing security, validation, data safety, accessibility, or explicitly requested behavior.
3. Harvest markers with `/devflow-debt` or equivalent search before planning cleanup.

Output:

```text
Debt Marker: <none/added>; reason <why>
```

## Method 10: Spec Document and Plan Pack

Purpose: keep requirements and implementation tasks separate, reviewable, and traceable.

Use a saved spec when the user asks for a spec/design document, when the work is too large for a short design contract, or when requirements can drift across multiple tasks.

When saving a spec file, use `docs/specs/YYYY-MM-DD-<short-kebab-name>.md` from the current target project's root by default unless that project already documents another specs path. Do not put generated specs under `docs/features/`; that directory is for feature ledgers. Do not put specs under `docs/plans/`; that directory is for implementation plans.

A spec must include:

```text
Goal:
Context:
Requirements:
Non-goals:
Approach:
Impact:
Acceptance:
Verification:
Code Documentation:
Open Questions:
```

The `Code Documentation` section specifies what code comments are required: which files need file-level comments, which functions need function-level comments, which non-obvious logic needs inline comments explaining WHY. For trivial changes, state "none — trivial change" explicitly.

Run `node scripts/devflow-spec.js <spec-file>` when the checker exists. See Script Path Resolution below for path fallback order.

Use a Plan Pack when work has more than one logical implementation step. `devflow-plan` is the single runtime skill that writes this contract after `devflow-cut` returns `CUT_PASS`.

For Depth A/B, Cut receives the approved design or saved spec first and records the allowed scope, reuse decision, exclusions, and verification constraints. The Plan Pack then turns only that Cut Decision into construction tasks. After plan review, perform a lightweight consistency review; re-run affected Cut gates only when the plan expands scope, dependencies, abstractions, or file responsibilities.

When saving a plan file, use `docs/plans/YYYY-MM-DD-<short-kebab-name>.md` from the current target project's root by default unless that project already documents another plan path. Do not put implementation plans under `docs/features/`.

Each plan header must cite its source and spec coverage:

```text
Goal: <outcome>
Architecture: <smallest design and boundaries>
Tech Stack: <relevant existing stack>
Source: <docs/specs/YYYY-MM-DD-<short-kebab-name>.md or approved design>
Spec coverage: <which requirements map to which tasks, or design-only>
Cut Decision: <CUT_PASS allowed scope, reuse conclusion, exclusions, verification constraints>
```

Each task must include:

```text
Task: <short title>
Files:
- Create: <path> | <responsibility>
- Modify: <path> | <responsibility>
- Test: <path> | <behavior proved>  # only when applicable
Interfaces:
- Consumes: <input/API/module or documentation-only exception>
- Produces: <output/API/module or documentation-only exception>
Steps:
- [ ] <concrete file + symbol/behavior/command + expected result>
- [ ] <concrete file + symbol/behavior/command + expected result>
Acceptance: <specific condition>
Verify: <exact command or manual scenario>
Comments: <what code comments are required — which functions need function-level comments, which non-obvious logic needs inline comments explaining WHY; or "none — trivial change">
Not doing: <scope removed>
```

Task sizing:

- XS: one function or config
- S: one file or one endpoint/component
- M: 3-5 files, one feature slice
- L: 5+ files, split before execution

No unresolved markers, vague "add tests" tasks, "handle edge cases" items without naming the case, or "similar to Task N" shortcuts. The checker validates static task structure; source coverage and architecture judgment remain the author’s review responsibility.

## Method 11: Karpathy Minimal Change

Purpose: keep implementation surgical and reviewable.

Rules:

1. Touch only files required by the user goal.
2. Match existing style.
3. Do not refactor adjacent code unless the current goal cannot be solved without it.
4. Do not add speculative flexibility.
5. Remove only unused code created by the current change.
6. Every changed line must trace to the goal.

Diff test:

```text
For each changed file:
- Goal link:
- Behavior changed:
- Why this file:
- Verification:
```

Stop if the patch starts cleaning unrelated code, a helper has only one caller without local precedent, or a new option/config exists only for future use.

## Method 12: Implementation Slices

Purpose: make Build safe and reviewable.

Use when the selected solution touches more than one file or more than one logical step.

Actions:

1. Split work into 1-5 slices.
2. Each slice names files/modules, behavior change, verification, and required code comments.
3. Prefer slices that produce visible or testable results.
4. Verify each slice before moving on when a focused check exists.
5. Merge slices that cannot be verified separately.
6. Each slice must include code comments as specified in the spec's Code Documentation section and the plan's Comments field.

Output:

```text
Implementation Slices:
- Slice 1: files / change / per-slice verification / required comments
- Slice 2: files / change / per-slice verification / required comments
```

## Method 13: Proof Before Done

Purpose: prevent false completion.

Before saying done, run the narrowest sufficient proof:

- rules/skills/references: file presence, frontmatter, required wording, command entries, path consistency
- agent rules/skills/commands/entries: Skill Activation Check covering trigger, surface, runtime load action, and downstream evidence
- code: targeted test, build, lint, typecheck, or manual runtime scenario; plus comment verification — new/changed functions have comments, non-obvious logic has inline comments
- bug fix: reproduce symptom or run regression check; plus fix location has a comment explaining what was broken and what the fix does
- framework design: checklist against agreed output contract

Completion format:

```text
Command: <actual command>
Result: <key output, count, or failure>
Adversarial review: <acceptance criteria, regressions, activation paths, and proof coverage checked>
Judgment: PASS / FAIL / BLOCKED
```

Never use "looks good", "should work", old output, or a tool claim without independent verification as proof.

## Method 14: Recovery By Changing Approach

Purpose: avoid looping on the same failed move.

Trigger when verification fails unexpectedly, the user says the result is wrong or vague, the same command/fix fails twice, or the agent is about to give up.

Use `devflow-pua` when the signal is user challenge, changed-wrong result, repeated miss, quality complaint, or two failed/corrected attempts in one task lifecycle. `devflow-pua` must read its local methodology router/library/display references and display the selected method as `METHOD: {flavor} / {method}` before another patch. If the method changed, add one `SWITCH:` line.

Actions:

1. Re-read the facts.
2. Restate the user goal and desired result.
3. Ask 2-4 pointed questions only when facts cannot answer the desired result.
4. List three different hypotheses.
5. Pick one materially different approach.
6. Run proof again.
7. Load `devflow-learn` and record a learning intercept when the lesson is reusable.

Do not retry the same command with only wording changes. Do not blame the environment without evidence.

## Method 15: Skill As Executable Contract

Purpose: make skills usable, not inspirational.

Every skill must include:

- when to use it in the `description`
- concrete steps
- handoff target or stop condition
- anti-rationalization checks
- proof required before exit

Bad skill content: vague principles only, long background essays, duplicated framework theory, no exit criteria.

Good skill content: "When X, do Y, output Z, verify with command/check C."

## Default Output Contracts

Design output:

```text
Goal: what to solve
Motivation: why now, what triggered this need
Smallest useful plan: why this is the smallest useful solution now
Not doing: what is explicitly cut
Impact: modules/files/behavior involved
Verification: command or scenario that proves it
```

Completion output:

```text
Command: <actual command run>
Result: <key output summary>
Judgment: PASS / FAIL / BLOCKED
```

## Script Path Resolution

DevFlow checker scripts (`devflow-spec.js`, `devflow-plan.js`, `devflow-review.js`, `devflow-debt.js`, `devflow-audit.js`) may be located in different places depending on how DevFlow is installed. Always resolve the script path before running:

1. **Project-level**: `scripts/devflow-<name>.js` — relative to the current target project's root. Use when the target project has DevFlow scripts installed locally.
2. **User-level (Codex)**: `~/.codex/scripts/devflow-<name>.js` — use when only user-level DevFlow is installed.
3. **User-level (Claude Code)**: `~/.claude/scripts/devflow-<name>.js` — alternative user-level location.

Try paths in this order. Use the first path that exists. If none exists, skip the script check and note it as unavailable — do not block the flow on a missing checker.

**Do NOT look for scripts under `skills/scripts/`** — that path does not exist. Scripts are always under `scripts/` (project-level) or `~/.codex/scripts/` / `~/.claude/scripts/` (user-level).

Example resolution for `devflow-spec.js`:

```bash
# 1. Try project-level
node scripts/devflow-spec.js <spec-file>

# 2. If not found, try user-level Codex
node ~/.codex/scripts/devflow-spec.js <spec-file>

# 3. If not found, try user-level Claude Code
node ~/.claude/scripts/devflow-spec.js <spec-file>
```
