# DevFlow Cut Methods

Owner: `devflow-cut`. Load this reference after a user-selected A/B/C direct Cut entry or when Core selects Cut for a non-unique artifact.

## Method 5: Minimal Solution Ladder

Before new code, stop at the first rung that meets the accepted goal:

1. No change.
2. Reuse an existing project capability.
3. Use an available skill that fully completes the task without code.
4. Use standard library or native platform capability.
5. Use an installed dependency.
6. Use direct configuration or one local change.
7. Write the minimum new code.

Record:

```text
Reuse Check: searched <files/helpers/patterns/skills>; selected rung <N>; reason <why lower rungs failed>
```

Do not cut explicit behavior, accessibility, security, data protection, or the smallest useful verification.

## Method 6: Root-Cause Fix Check

For bugs, search the likely function, route, command, helper, and callers before editing. Prefer a shared correction when it covers sibling callers without changing unrelated behavior; otherwise record why the narrow correction is safer.

```text
Root-Cause Check: searched <callers/references>; fix location <shared/narrow>; reason <why>
```

## Method 7: Native Capability Check

Read `native-capability-checklist.md` before adding a dependency or wrapper. Name the current platform limitation when native capability is insufficient.

```text
Native Check: checked <layer>; platform option <used/not enough>; reason <why>
```

## Method 8: Anti-Overengineering Gate

Before adding a dependency, abstraction, configuration surface, directory, framework layer, or generic engine, answer why it is needed now. One caller favors direct code. Hypothetical reuse does not justify a new structure.

```text
Overbuild Check: what new structure is being added? Why is it needed now?
Reuse Check: what existing capability was checked first?
Trace Check: what accepted request does each key change trace to?
Scope Check: what tempting but unrequested feature was removed?
Diff Check: which user goal does each changed file serve?
```

## Method 8A: Contextual Design Quality Check

For changes that introduce or relocate code, alter module responsibilities, or add performance behavior, inspect the nearest comparable project code before selecting a shape. Record the decision without requiring a fixed layer, class count, interface, or cache:

```text
Convention Check: compared <nearby files/patterns>; followed <convention> / deviated because <current reason>; impact <none or specific>
Responsibility Check: <type/module> owns <dominant responsibility>; split/merge/abstraction <not needed or reason tied to dependencies/lifecycle/change reason>
Performance Check: workload/failure evidence <facts or none>; cache/optimization/concurrency <not needed or chosen>; benefit, ownership, invalidation, consistency <when chosen>
Readability Check: local names/structure expose <intent, key rules, failure paths, side effects>; remaining trade-off <none or specific>
```

A simpler solution may replace a nearby pattern when it improves correctness, readability, maintainability, or measured performance without breaking an accepted contract. Do not add a structure merely to satisfy a principle name.


When a safe, deliberate shortcut has a known ceiling, mark it near the choice:

```text
devflow: <ceiling>, revisit when <trigger>
```

Never use a marker to excuse missing security, data safety, accessibility, or requested behavior.
