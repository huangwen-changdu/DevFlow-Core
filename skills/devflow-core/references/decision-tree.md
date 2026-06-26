# DevFlow Core Decision Tree

## Route Selection

```text
User asks something
  |
  +-- Problem report or "check what is wrong" without explicit fix request?
  |     -> Problem: Sense -> Prove facts
  |        If change is needed: -> Design or Build
  |
  +-- Bug report, failing test, error log, broken behavior, or fix request?
  |     -> Build: Sense -> Brainstorm -> Cut with Root-Cause Check -> Shape -> Build -> Prove
  |
  +-- Pure Q&A, fact lookup, verification, approved tiny step?
  |     -> Fast: Sense -> Prove
  |
  +-- Requirement, feature, behavior change, architecture, ambiguous ask?
  |     -> Design: Sense -> Brainstorm -> Cut -> Shape
  |        If implementation is requested: -> Build -> Prove
  |
  +-- User asks to implement, fix, build, land, or execute an approved change?
  |     -> Build: Sense -> Brainstorm -> Cut -> Shape -> Build -> Prove
  |
  +-- User challenge, changed-wrong result, repeated miss, quality complaint, repeated failure, unexpected test failure, giving up?
        -> Recovery: devflow-pua when pressure is needed -> Re-read facts -> restate goal/result -> 3 hypotheses -> new approach -> Prove
```

## Design Depth

| Situation | Depth |
|---|---|
| Small local behavior change | Short design contract only. |
| Cross-module or public interface change | Add explicit impact and compatibility notes. |
| Data, auth, payments, migrations, production risk | Use full spec documents before build. |
| User asks only for design | Stop at Shape and name the verification plan. |
| User asks to implement | Continue through Build and Prove. |

## Delivery Rule

If the user asks to implement, build, fix, or land a change, do not stop at Shape. Continue through Build and Prove. Stop at Shape only for design-only requests.

## Gates

| Gate | Question |
|---|---|
| Reuse Check | Did we search existing code, standard library, native platform, installed dependencies? |
| Ponytail Rung | Which smallest rung solved the user goal, and why did lower rungs fail? |
| Root-Cause Check | For bugs, did we search callers/references and choose shared vs narrow fix intentionally? |
| Native Check | Did platform or standard-library capability cover this? |
| Overbuild Check | Are we adding more structure than the task needs? |
| Diff Check | Does each changed line trace to the goal? |
| Scope Check | Did we add unrequested features? |
| Proof Check | Is there a real command or scenario proving the claim? |
| Pressure Check | Did a user challenge or repeated miss require stopping the current approach and loading `devflow-pua`? |

## Cut Intensity

| Level | Use when | Behavior |
|---|---|---|
| lite | Normal feature, plausible requested path. | Build requested path and name the smaller alternative. |
| full | Default coding/fix/design work. | Enforce ladder and gates before Build. |
| ultra | Simplification, bloat, unnecessary dependency, review/audit. | Prefer deletion before addition and challenge the requirement. |

## Method Source

For exact method rules, use `skills/devflow-core/references/core-methods.md`. If a proposal sounds like a slogan, convert it into: trigger, action, do-not-do, and proof.
