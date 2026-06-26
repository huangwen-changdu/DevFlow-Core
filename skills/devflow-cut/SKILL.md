---
name: devflow-cut
description: "Use before adding code, dependencies, abstractions, configs, folders, framework layers, generic engines, reusable capabilities, or when checking YAGNI, Ponytail ladder reuse, root-cause fixes, platform-native options, scope creep, bloat, and simplification."
---

# DevFlow Cut

Cut unnecessary work before writing it.

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
4. Does the standard library do it?
5. Does the native platform do it?
6. Does an already-installed dependency do it?
7. Can it be one line or direct configuration?
8. Only then write the minimum new code.

If two rungs both work, take the earlier rung and move on. The ladder is not permission to skip reading; first trace the real flow the change touches.

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
Reuse Check: what existing capability was searched/confirmed?
Ponytail Rung: where did the ladder stop, and why were lower rungs insufficient?
Root-Cause Check: for bug fixes, were callers/shared entry points searched? shared or narrow fix, and why?
Native Check: is platform or standard-library capability enough?
Overbuild Check: any new dependency/abstraction/config/directory/framework layer/generic engine? why needed now?
Diff Check: how does each planned change trace to the goal?
Scope Check: what unrequested behavior was cut?
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
CUT_PASS: smallest plan holds; enter devflow-build
CUT_REDUCE: plan is too heavy; reduce to <smaller option>
CUT_REUSE: existing capability can be reused; do not write new implementation
CUT_BLOCKED: missing facts or risk too high; cannot enter Build
```

When `CUT_REDUCE` or `CUT_REUSE` happens, update the design contract before Build.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This abstraction will help later." | Later can add it when there is a second real use. |
| "A dependency is cleaner." | Cleaner than platform/native only when a current limitation proves it. |
| "It's just a tiny wrapper." | Wrappers become owned API. Check if they add real value. |
| "Tests are bloat." | The smallest useful verification is not bloat. |
| "This is only the ticketed path." | For bugs, check callers first; the shared root cause may be the smaller fix. |
| "We can add the upgrade later." | If a shortcut has a known ceiling, record the trigger with `devflow:` now. |

## Handoff

When the cut gate passes, load `devflow-build`.

## Verification

Before leaving this skill, confirm:

- [ ] Reuse, Root-Cause when relevant, Native, Overbuild, Diff, and Scope checks were answered.
- [ ] Any new structure has a current need.
- [ ] Removed scope is explicitly named.
- [ ] Intentional simplifications have `devflow:` ceiling and revisit trigger markers.
- [ ] Cut result is one of the four allowed statuses.
