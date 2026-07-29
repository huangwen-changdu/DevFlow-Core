---
name: devflow-cut
description: "Use before adding code, dependencies, abstractions, configs, folders, framework layers, generic engines, reusable capabilities, or when checking YAGNI, Ponytail ladder reuse, root-cause fixes, platform-native options, scope creep, bloat, and simplification. Cuts unnecessary work before writing it. Also use when the user says 'review for over-engineering', 'is this over-engineered', 'simplify review', 'review this diff/PR for cuts', or '/devflow-cut'."
---

# DevFlow Cut

Cut unnecessary work before writing it.

**Violating the letter of the rules is violating the spirit of the rules.**

## Context

Receives a `devflow-core`-selected, approved design or confirmed Spec. Cut decides the smallest implementation boundary before any construction plan; do not use a future plan as evidence for these gates.

- `CUT_PASS` produces a Cut Decision and returns it to `devflow-core`.
- Core alone decides whether the Cut Decision needs `devflow-plan`, `devflow-build`, `devflow-prove`, or no further lifecycle work.
- A user-approved Plan Pack receives only a lightweight Cut-consistency review. If it adds scope, dependencies, abstractions, or file responsibilities outside the Cut Decision, return the affected-gate facts to Core before any further lifecycle choice.

## Cut Intensity

Choose the lightest level that fits the risk:

| Level | Use when | Behavior |
|---|---|---|
| `lite` | User asks for a normal feature and the requested path is plausible. | Build the requested path, but name the smaller alternative in one line. |
| `full` | Default for coding, fixes, dependencies, abstractions, and framework work. | Enforce the ladder and block avoidable new structure. |
| `ultra` | User asks to simplify, remove bloat, avoid overengineering, or review a diff/repo for cuts. | Prefer deletion before addition and challenge the requirement when a smaller outcome covers it. |

## Minimal Solution Ladder

After reading the touched flow, stop at the first rung that works:

1. Does this need to exist?
2. Can the user goal be met by not changing code?
3. Does it already exist in this codebase?
4. Does an available skill in the environment handle this without writing new code? (e.g., `pdf` for reading a PDF, `understand` for codebase analysis. If a skill like `frontend-design` guides how to implement, load it alongside the devflow route — it complements, not replaces, the devflow chain. Produce `CUT_REUSE` only when the skill fully handles the task with no new code needed.)
5. Does the standard library do it?
6. Does the native platform do it?
7. Does an already-installed dependency do it?
8. Can it be one line or direct configuration?
9. Only then write the minimum new code.

If two rungs both work, take the earlier rung and move on. The ladder is not permission to skip reading; first trace the real flow the change touches.

External guidance skills complement the chain but never widen it. Under conflict the priority is: Cut Decision > Plan Pack > external skill guidance. When a matched skill (e.g., `frontend-design`) recommends structure outside the allowed scope, keep the Cut scope and return the broader recommendation as scope-drift facts to `devflow-core`.

## Root-Cause Fix Check

For bug fixes, do not patch only the reported symptom. Before editing a function, component, route, command, or rule:

1. Search callers/references of the touched unit.
2. Decide whether one shared guard/fix solves all callers with less code than per-caller patches.
3. If the shared fix would change unrelated behavior, name that risk and keep the narrower fix.

Output:

```text
Root-Cause Check: searched <callers/references>; fix location <shared/narrow>; reason <why>
```

## Native Capability Check

Before adding a dependency or wrapper, scan `skills/devflow-cut/references/native-capability-checklist.md` for the relevant layer.

Output:

```text
Native Check: checked <layer>; native option <used/not enough>; reason <why>
```

If the native option is not enough, name the current limitation and evidence.

## Required Gates

Missing answers block Build:

```text
Reuse Check: what existing capability was searched/confirmed? Include available environment skills that match the task.
Ponytail Rung: where did the ladder stop, and why were lower rungs insufficient?
Root-Cause Check: for bug fixes, were callers/shared entry points searched? shared or narrow fix, and why?
Native Check: is platform or standard-library capability enough?
Overbuild Check: any new dependency/abstraction/config/directory/framework layer/generic engine? why needed now?
Diff Check: how does each planned change trace to the goal?
Scope Check: what unrequested behavior was cut?
External Skills: <skill-name> (role: guides execution) / none — matched at Sense via Skill Discovery; inherited by the Plan Pack and loaded by Build.
```

## Overengineering Review Tags

When reviewing a diff or plan, output one line per finding:

```text
<file>:L<line>: <tag>: <what to cut>. <replacement>.
```

Tags:

- `delete`: dead code, unused flexibility, speculative feature
- `reuse`: duplicate code or helper that should use an existing project helper, utility, type, or pattern
- `stdlib`: hand-rolled thing the standard library ships
- `native`: dependency or code doing what the platform already does
- `yagni`: abstraction/config/layer with no current need
- `shrink`: same behavior with fewer moving parts

End with:

```text
net: <N> lines/deps/steps possible
```

If nothing should be cut, say:

```text
Lean already. Ship.
```

## Examples

✅ `src/validator.js:L12-38: stdlib: 27-line EmailValidator class. "@" in email, 1 line; real validation is the confirmation mail.`

✅ `utils/time.js:L4: native: moment.js imported for one format call. Intl.DateTimeFormat, 0 deps.`

✅ `repo.py:L88: yagni: AbstractRepository with one implementation. Inline it until a second one exists.`

✅ `api/retry.js:L52-71: delete: retry wrapper around an idempotent local call. Nothing replaces it.`

✅ `build.js:L30-44: shrink: manual loop builds dict. dict(zip(keys, values)), 1 line.`

✅ `helpers/format.js:L9: reuse: duplicate date formatter. Use utils/time.js:formatDate, already in project.`

❌ "This EmailValidator class might be more complex than necessary, have you considered whether all these validation rules are needed at this stage?" — 太软，无定位、无替换方案、无量化。

## Intentional Simplification Marker

If you intentionally choose a shortcut with a real ceiling, mark it in code or docs:

```text
devflow: <ceiling>, revisit when <trigger>
```

Use the marker only for deliberate, accepted simplifications. The marker must name both the ceiling and the revisit trigger so `/devflow-debt` can harvest it later.

Never use a marker to excuse missing security, data safety, accessibility, or required validation.

## Do Not Cut

Do not remove:

- trust-boundary validation
- auth, permission, or data-loss protection
- security and accessibility
- explicitly requested behavior
- the smallest useful verification for non-trivial logic

## Cut Result

Output one of:

```text
CUT_PASS: smallest scope holds; return the Cut Decision to `devflow-core`
CUT_REDUCE: proposed scope is too heavy; reduce to <smaller option>
CUT_REUSE: existing capability can be reused; do not write new implementation
CUT_BLOCKED: missing facts or risk too high; return the blocking facts to `devflow-core`
```

When `CUT_REDUCE` or `CUT_REUSE` occurs, **STOP — present the reduction or reuse finding to the user**. Explain what was cut, what existing capability replaces it, and why the smaller option is sufficient. After confirmation, return the confirmed result to `devflow-core`; only Core selects any further lifecycle work.

When `CUT_BLOCKED` occurs, return the blocking facts to `devflow-core`. Core decides whether it must restart `devflow-brainstorm` to re-explore the goal and constraints.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This abstraction will help later." | Later can add it when there is a second real use. |
| "A dependency is cleaner." | Cleaner than platform/native only when a current limitation proves it. |
| "It's just a tiny wrapper." | Wrappers become owned API. Check if they add real value. |
| "Tests are bloat." | The smallest useful verification is not bloat. |
| "This is only the ticketed path." | For bugs, check callers first; the shared root cause may be the smaller fix. |
| "We can add the upgrade later." | If a shortcut has a known ceiling, record the trigger with `devflow:` now. |

## Red Flags — STOP

- About to write new code without running the ladder
- "This abstraction will help later" without a second real use today
- Adding a dependency when native/stdlib covers it
- Skipping Root-Cause Check for a bug fix
- Cutting trust-boundary validation, security, or data-loss protection
- Proceeding to Build with `CUT_REDUCE` or `CUT_REUSE` without user confirmation

**All of these mean: stop and run the gates.**

## Handoff

After `CUT_PASS`, record a Cut Decision containing the allowed scope, reuse conclusion, exclusions, required verification, and the `External Skills` declaration, then return it to `devflow-core`.

Core alone selects whether the result needs `devflow-plan`, `devflow-build`, `devflow-prove`, or no further lifecycle work. Do not hand a `CUT_REDUCE` or `CUT_REUSE` result forward until the user confirms it. Do not let a Plan Pack broaden the Cut Decision without returning the affected-gate facts to Core.

## Verification

Before leaving this skill, confirm:

- [ ] Reuse, Root-Cause when relevant, Native, Overbuild, Diff, and Scope checks were answered.
- [ ] Any new structure has a current need.
- [ ] Removed scope is explicitly named.
- [ ] Intentional simplifications have `devflow:` ceiling and revisit trigger markers.
- [ ] Cut result is one of the four allowed statuses.
