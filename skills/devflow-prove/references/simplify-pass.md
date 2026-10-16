# Prove Simplify Pass

Distilled from everyinc's `ce-simplify-code` (MIT) and Anthropic's `code-simplifier` agent, narrowed to Prove's gate: simplify only the approved change, never its behavior, and re-prove after every applied edit.

## When It Runs

| Mode | Trigger | Behavior |
|---|---|---|
| Pipeline | Code change under Prove (default) | Run on the approved diff before the adversarial and quality reviews. |
| Standalone | The user asks to simplify / 精简 / 清理 the current change, or runs `/devflow-simplify` | Same lenses and rules on the user-named scope; report findings before applying them unless the request says to apply. |
| Not applicable | No human-authored code in scope: documentation, generated or vendored files, lockfiles, mechanical churn | Record 不适用 with the observed scope. Never use it to skip a real code change. |

## Scope

- The approved diff — the same files the **Code Review Report** reviews (plan `Files` rows, or the current branch against its base).
- Tests and comments this change added or changed are the only pruning candidates; untouched code stays out of scope.
- This is not a second Cut and not a refactor ticket: no new abstraction, dependency, configuration surface, or drive-by cleanup. Cut already decided what may exist; the pass only makes that change clearer.

## Keep List

Never simplify these away:

- Behavior, outputs, side effects, public contracts, error semantics, ordering, and resource handling.
- Guards that look redundant but hold a line: permission and validation checks, retries, fallbacks, exit-code propagation, feature-flag branches, compatibility shims.
- Comments required by the Spec, the Plan, project convention, or a non-obvious boundary; intentional `devflow:` markers keep their ceiling and revisit trigger.
- Tests that pin a boundary, a regression, or a documented failure mode.

## Lenses

Apply in order; every finding cites changed-code evidence.

1. **Clarity and reuse** — nesting, redundant indirection, duplicated logic, misleading names; reuse the nearest existing helper, standard-library call, or native platform feature before introducing anything new. Apply the **Naming and Readability** gates below.
2. **Quality** — one dominant responsibility per unit, explicit over clever, project convention over personal style; never trade a clear flow for a dense one-liner.
3. **Efficiency** — avoidable repeated work or needless allocation on the changed path; no speculative caching or micro-optimization.
4. **Test value** — tests that assert nothing observable, duplicate an existing case, or pin an implementation detail instead of behavior; keep the boundary and regression cases.
5. **Comment value** — narration that restates the code; keep WHY, delete WHAT, keep every comment a contract requires.

Structure-level fix candidates come from `code-readability-checklist.md` — flow (R1), decision locality (R2), types and values (R4), failure and side-effect visibility (R5). Apply them under this pass's scope, keep-list, and behavior-preservation rules, and tie every readability claim to a changed line.

## Naming and Readability

AI-drafted code over-names: identifiers that restate their module, their type, and their whole responsibility, plus remarks that narrate the body. A name is read once and understood; when it needs a second read, the fix is a shorter name plus clearer structure — not a longer name.

Gates for names this change adds or edits:

- **Name economy** — as long as the reader needs, and no longer. Drop context the call site already shows (module, class, parameter type, surrounding type) instead of repeating it inside the identifier.
- **Qualifier stacking** — three or more qualifiers in one identifier (`DailyRefundAdjustmentSettlementDetailHandler`) means one concept is doing several jobs: split it, or move a qualifier into the type.
- **Verb-object methods** — method names stay verb + object, getters keep the property name; a name that reads like a sentence means the boundary is wrong, not that the name is short.
- **Predicates** — boolean names read as `is` / `has` / `can` / `should…` and drop a subject the type already implies.
- **Type names** — name the concept, not the layer, the mechanism, or the list of handled cases. `Helper` / `Manager` / `Util` / `Processor` / `Impl` suffixes stay only where the nearest comparable code uses them for that layer.
- **Scope symmetry** — short scopes get short names (loop indices, two-line locals, tiny lambdas); length grows only with distance and real ambiguity.

Gates for remarks this change adds or edits:

- A comment, doc comment, or `Remark` that can be reconstructed from the identifier, signature, and modifiers is narration — delete it.
- Multi-line remarks that restate the body are trimmed to the intent, constraint, or non-obvious reason; contract-required remarks (public API docs, Spec/Plan-required comments, safety and compatibility notes) stay.
- A long name plus a long remark usually means the unit does several jobs: prefer a smaller unit over more prose.

A rename preserves behavior only inside the approved diff and off the public surface. API and DTO fields, serialized names, DB columns, config keys, route segments, log and telemetry keys, DI-by-name or reflection lookups, and test fixtures are contracts — report those renames for a decision instead of applying them.

## Apply Rules

- Apply only when the edit is local, provably behavior-preserving, and inside the approved diff; record each edit as `file:line` plus its reason.
- A finding that needs a behavior, contract, interface, or naming decision is not a simplification: report it as returned facts instead of editing.
- Simplifying away an approved requirement, a required comment, or a guard is a Blocker, not a cleanup.
- If nothing qualifies, report `Applied: 0` and say so; never invent churn to look thorough.

## Required Output

```text
Simplify pass:
- Scope: <files or ranges inspected>
- Applied: <count> — [file:line] <inline|extract|dedupe|rename|delete|prune-tests|prune-comments>: <what changed> -> <why>
- Reported only: <count> — [file:line] <finding that needs a decision>
- Kept deliberately: <guard, contract, or test that must stay, with its reason>
- Not applicable: <scope reason, only when the pass does not run>
- Receipt: 已执行 / 不适用 / 受阻 / 未执行 — <evidence>
- Re-proof: <command or scenario> -> <result>
```

## Re-proof

An applied simplification changes the diff, so any earlier check is stale.

1. Re-run the narrowest sufficient check on the simplified diff.
2. Re-run the adversarial review and the quality review on the new diff, and close or restate every earlier Blocker and Warning.
3. Report 已执行 only with that re-run result. A pass that could not run while code changed is 受阻 with its reason — never 不适用, never a silent skip.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "Fewer lines is simpler." | Readable and explicit beats short; dense one-liners and nested ternaries are not simplifications. |
| "The check passed before the cleanup." | The cleanup changed the diff, so the old evidence no longer covers the current files. |
| "This helper has only one caller." | Removing it can be right, but only when local understanding improves and no approved boundary depended on it. |
| "The comment is obvious to me." | The test is whether a maintainer needs it for intent, a business rule, or a non-obvious decision. |
| "The test still passes." | A test that cannot fail for the changed behavior is test debt; passing proves nothing. |
| "I also noticed other code to clean." | Out of scope. Report it and let Core decide the next step. |

## Red Flags — STOP

- Behavior, a public contract, an error path, or an ordering guarantee changed during a "simplification".
- An approved requirement, a required comment, or a guard was removed.
- A rename touched a contract name: serialized field, column, config key, route segment, log key, or a name resolved by DI, reflection, or a test fixture.
- Edits landed after the last check and the pass still claims PASS.
- The pass widened scope beyond the approved diff.

## Verification

- [ ] Scope was the approved diff, and the touched tests and comments came from this change.
- [ ] Every applied edit is behavior-preserving and recorded with its reason.
- [ ] Findings that need a decision were reported, not applied.
- [ ] Added or edited names scale with their scope, and no contract name was renamed.
- [ ] Added or edited remarks state intent instead of paraphrasing the code.
- [ ] Deterministic readability dimensions (flow, locality, types, failure visibility) were checked against `code-readability-checklist.md`.
- [ ] The narrowest sufficient check was re-run after the last edit.
- [ ] The receipt states 已执行 / 不适用 / 受阻 / 未执行 with evidence.
