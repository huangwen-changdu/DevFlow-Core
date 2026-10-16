# DevFlow Code Readability Checklist

Owners: `devflow-build` and `devflow-prove`. A bounded post-write check for changed executable code, before handoff and before review.

Source: distilled in-repo rubric for the recurring failure modes of AI-drafted code — over-description, ceremony, hidden hops, and prose that repeats the code. It is not a vendored linter or formatter; only the transferable judgments are kept.

Scope: code the change adds or edits. A dimension that cannot observe the change — documentation only, config values, generated files — records 不适用 with that reason instead of a silent pass.

Mapping to the Build Readability Outcome Check: `Intent` ↔ R1 and R3, `Rules` ↔ R2 and R4, `Failure paths` and `Side effects` ↔ R5, `Convention` ↔ R6. R7 covers what that check does not name: tests and diff hygiene.

## First-read test

A maintainer who did not write this change reads the changed files once and can state the entry point, the main path, where each decision is made, how it fails, and what to change to alter the behavior. Needing a second file, a second read, or your explanation means the dimension that forced it is a hit — fix it now instead of arguing taste at review.

## Dimensions

**R1 Flow reads top-down.** Passes when the entry point, the happy path, and each decision appear in reading order, with one level of abstraction per function.

- Signals: three or more nesting levels (arrow code); `else` pyramids pushing the happy path to the bottom; one function mixing framework plumbing with business rules; a long function whose steps have no names; a boolean parameter that picks which half of the body runs.
- Fix: guard clauses and early returns; name each step in the caller's vocabulary; extract the step that has its own reason to exist; keep one abstraction level per function.

**R2 Decisions stay local.** Passes when the rule that decides behavior is visible where the behavior happens.

- Signals: hop chains that add no meaning (`Service` → `Helper` → `Util` with the same arguments renamed); a single-implementation interface or one-line wrapper added for symmetry or imagined reuse; one rule written in three places (a default, a SQL string, an `if`); logic scattered across partial classes or an event chain nothing else needs.
- Fix: inline the hop that adds no meaning; move the rule to the type that owns the behavior; express one rule once.

**R3 Names and remarks carry meaning.** Passes when a name is understood on one read and a remark says why.

- Gates: `simplify-pass.md` → **Naming and Readability** owns the naming and remark rules (name economy, qualifier stacking, predicates, type naming, scope symmetry; remarks state intent, not the body). This dimension verifies those rules were applied to the changed code.

**R4 Types and values carry meaning.** Passes when no reader has to open another file to learn what a parameter accepts or what a value means.

- Signals: primitive obsession (`string status`, `int mode`); boolean parameters that switch behavior inside; magic numbers and string literals repeating a business threshold; `object` / `any` / `dynamic` used to dodge a type; a nullable value with unstated meaning; a transport DTO used as a domain object.
- Fix: a small named type, enum, or named constant at the boundary where the meaning is decided.

**R5 Failure and side effects stay visible.** Passes when invalid input, failed calls, and missing data are handled where a reader sees them, and statements that write, send, charge, or authorize are recognizable.

- Signals: swallowed exceptions and empty `catch` blocks; silent default substitution for invalid input; retries, timeouts, or fallbacks hidden inside a helper; side effects inside getters or mapping code; authorization decided far from the operation; a blanket `catch (Exception)` that only logs.
- Fix: validate at the edge; keep the failure decision next to the operation; name the side effect in the function name.

**R6 Consistent with the nearest neighbor.** Passes when nothing in the file looks alien and one concern keeps one convention.

- Signals: a second logging style, error type, or registration shape beside the existing one; a new layer or folder created for a single function; style-only rewrites far from the change; an abstraction the project never used.
- Fix: copy the closest comparable code; a deliberate deviation is recorded with its reason in the receipt and the plan's stated rationale.

**R7 Tests and diff read as a story.** Passes when tests state behavior in the domain's words and the diff shows the change and nothing else.

- Signals: test names like `test1`, `works`, or names restating the implementation; one test asserting five behaviors; assertion-only tests a reader cannot follow; unrelated reformatting, file moves, or drive-by renames in the same change; commented-out code left behind.
- Fix: name the test after the behavior it protects; one behavior per test; split the unrelated change out or record it as plan scope; delete the commented-out block.

## Exit check

Every observable dimension passes on the changed code, with hits fixed or their facts returned to Core when the fix sits outside the approved scope. Close with the shared execution receipt (`core-methods.md`): the reviewed units, each dimension's result or 不适用 with its reason, the reader's entry point for the change, and any recorded deviation. A dimension claimed as passed without naming the changed unit is 未执行, not a pass.
