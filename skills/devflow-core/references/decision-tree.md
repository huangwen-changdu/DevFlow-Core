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
  |     -> Build: Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut with Root-Cause Check -> Build -> Prove
  |
  +-- Pure Q&A, fact lookup, verification, or trivial code change (one line, no logic change, no risk)?
  |     -> Fast: Sense -> Prove
  |
  +-- Requirement, feature, behavior change, architecture, ambiguous ask?
  |     -> Design: Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut
  |        If implementation is requested: -> Build -> Prove
  |
  +-- User asks to implement, fix, build, land, or execute a change?
  |     -> Build: Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> Cut -> Build -> Prove
  |        (skip Brainstorm/Plan if already done)
  |
  +-- User challenge, changed-wrong result, repeated miss, quality complaint, repeated failure, unexpected test failure, giving up?
        -> Recovery: devflow-pua when pressure is needed -> Re-read facts -> restate goal/result -> 3 hypotheses -> new approach -> Prove
```

## Design Depth

The Depth Selection Gate in `devflow-brainstorm` lets the user choose:

| Choice | Flow | Confirmations | Use when |
|---|---|---|---|
| A (Full Spec) | Feature Ledger → Design Contract → devflow-spec → /devflow-plan | 3 | Cross-module, new feature, architecture change |
| B (Simplified Spec) | Feature Ledger → Design Contract → /devflow-plan | 2 | Clear-scope change, moderate complexity |
| C (Dialogue Confirmation) | Core Clarification → Design Contract → devflow-cut | 1 | Single-file, low-risk, user-explicit |

Selection constraints: new feature or architecture change → A only. Depth is user-chosen, not LLM-asserted.

## Delivery Rule

If the user asks to implement, build, fix, or land a change, continue through Build and Prove. Steps scale to task size — Cut and Prove are never skipped, but Brainstorm/Plan may be skipped when already completed or when the task is trivial enough for Fast/Design-lite. Stop at the design contract only for design-only requests.

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
