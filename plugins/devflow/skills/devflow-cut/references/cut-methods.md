# DevFlow Cut Methods

Owner: `devflow-cut`. Load this reference after a user-selected A/B/C direct Cut entry or when Core selects Cut for a non-unique artifact.

## Method 5: Minimal Solution Ladder

The canonical Minimal Solution Ladder lives in `skills/devflow-cut/SKILL.md` (nine rungs, plus the `Ponytail` definition). Do not redefine the ladder here: read the SKILL.md ladder, stop at the first rung that meets the accepted goal, and record the selected rung.

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
Rejected: what candidate scope, dependency, abstraction, or config was cut — or none plus the evidence that ruled each candidate out?
```

`Rejected` is not optional. A gate that answers only "what is included" cannot show whether any subtraction happened, which is how a Cut degrades into a stamp. Name the cut candidate, or name the evidence that closed each candidate out.

## Method 8A: Contextual Design Quality Check

For changes that introduce or relocate code, alter module responsibilities, or add performance behavior, inspect the nearest comparable project code before selecting a shape. Record the decision without requiring a fixed layer, class count, interface, or cache:

```text
Convention Check: compared <nearby files/patterns>; followed <convention> / deviated because <current reason>; impact <none or specific>
Responsibility Check: <type/module> owns <dominant responsibility>; split/merge/abstraction <not needed or reason tied to dependencies/lifecycle/change reason>
Performance Check: workload/failure evidence <facts or none>; cache/optimization/concurrency <not needed or chosen>; benefit, ownership, invalidation, consistency <when chosen>
Readability Check: local names/structure expose <intent, key rules, failure paths, side effects>; remaining trade-off <none or specific>
```

A simpler solution may replace a nearby pattern when it improves correctness, readability, maintainability, or measured performance without breaking an accepted contract. Do not add a structure merely to satisfy a principle name.

## Method 9: Change Review, Cut Dimension

Load this section when the subject is a change — uncommitted diff, branch, commit, PR, or file set — and the question is what should not exist or should be smaller.

Correctness, security, load behavior, test coverage, and speed belong to `devflow-prove` and its Code Review Report. Do not rebuild that report here. Report the cut findings, and name the dimensions left to Prove.

- Read wider than the diff: callers of every changed function, the functions it calls, the tests, and the nearest convention.
- Every finding needs a concrete case and a smaller current replacement. Size alone is not a finding.
- Search the whole tree — tests, fixtures, config, string and dynamic references — before calling code unused.
- A `devflow: <ceiling>, revisit when <trigger>` marker inside the change is a recorded decision, not a finding, unless the assumed load already crosses the ceiling.
- Tags: the eight in `SKILL.md` — `delete`, `reuse`, `stdlib`, `native`, `yagni`, `shrink`, `merge`, `split`.

Output stays the one-line form:

```text
<file>:L<line>: <tag>: <what to cut>. <replacement>.
net: -<N> lines, -<M> deps possible.
```



When a safe, deliberate shortcut has a known ceiling, mark it near the choice:

```text
devflow: <ceiling>, revisit when <trigger>
```

Never use a marker to excuse missing security, data safety, accessibility, or requested behavior.
