# Code Review Checklist

Two-layer review: general engineering dimensions (all languages) + language-specific best practices.

## How to Use

1. Read the approved File Structure/Plan boundary, latest Prewalk Execution Trace, Current Handoff Facts, remaining-work completion evidence, actual changed diff, and nearest comparable code.
2. Run the **General Engineering Review** first — applies to all code changes regardless of language.
3. Detect the language(s) from changed file extensions.
4. Apply the matching **Language-Specific Checklist** below.
5. For full-stack changes, apply all relevant language checklists.
6. Classify findings only from actual changed-code evidence and concrete risk: unmet approved requirement, active security/data/authorization risk, correctness regression, or demonstrated operational failure is a `Blocker`; an evidence-backed boundary, contract, local-convention, side-effect, or verification issue requiring closure is a `Warning`; other contextual guidance is a `Recommendation`. Unresolved Blockers and Warnings prevent `PASS`.

> **Note**: Functional correctness, regression, activation path, scope creep, and proof coverage are already covered by the adversarial review checklist in `SKILL.md`. The General Engineering Review below covers the remaining dimensions that the adversarial review does not.

> **Applicability**: Treat the following design, framework, and language items as context checks, not universal prescriptions. Apply one when the approved scope, existing project convention, measured workload, public contract, or concrete failure mode makes it relevant. Security, authorization, data protection, injection prevention, resource safety, and an explicit project rule remain hard checks.

> **Non-blocking by itself**: a pattern preference, function or class size, dependency count, absent cache, or fixed architecture shape is not a Blocker or Warning without changed-code evidence and concrete risk.

## General Engineering Review

Applies to all code changes. Review the items proportionately to the changed behavior and classify them with the rules above; do not fail a small change merely because it omits a speculative abstraction or style preference.

### 1. Requirements Understanding

- [ ] Business goal is clear: what does this code achieve?
- [ ] Inputs, outputs, and boundary conditions are identified.
- [ ] Non-functional requirements are addressed (performance, security, availability).

### 2. Code Quality

#### 2.1 Readability

- [ ] A maintainer can identify business intent, key rules, failure paths, and side effects from local names and structure.
- [ ] Types and functions have one dominant, coherent responsibility; boundaries are changed only when dependencies, lifecycle, or change reasons justify it.
- [ ] Important conditions use domain language; code avoids unexplained flags, magic values, and opaque control flow where a clearer local expression is warranted.
- [ ] Comments explain WHY, not WHAT; names and structure carry ordinary explanation.

#### 2.2 Maintainability

- [ ] The nearest applicable project convention for naming, layering, errors, logging, caching, and tests is followed, or a deliberate deviation has reason, impact, and proof.
- [ ] Dependencies, configuration, and extension points are introduced only when current scope or evidence makes them useful.
- [ ] Meaningful duplication is consolidated only when shared code improves local understanding, correctness, or a demonstrated reuse need.
- [ ] New abstraction preserves a current boundary, replacement need, test need, or multiple real implementations; it is not added only to satisfy a design principle.

#### 2.3 Testability

- [ ] State and side effects have an appropriate test seam for the changed behavior; use interfaces, dependency injection, pure functions, or existing project mechanisms only when they improve that seam.
- [ ] Side effects are controlled and isolated where the current risk or project convention requires it.
- [ ] Tests cover changed main paths, edge cases, and boundary conditions proportionately to risk.

### 3. Performance

- [ ] Time and space complexity fit the expected data volume or measured workload.
- [ ] No N+1 query problems or repeated expensive work on an identified hot path.
- [ ] Caching, optimization, and concurrency are assessed when workload or a concrete failure mode makes them relevant; any chosen cache has measurable benefit, ownership, invalidation, and consistency behavior.
- [ ] Performance techniques are not added speculatively where the simpler path is sufficient.

### 4. Security

- [ ] Input validation prevents injection (SQL, XSS, command, path traversal).
- [ ] Output encoding prevents XSS.
- [ ] Sensitive data is encrypted (at rest and in transit).
- [ ] Authorization and permission checks are in place.
- [ ] Logs do not leak sensitive data (passwords, tokens, PII).

### 5. Error Handling

- [ ] Exceptions are classified appropriately (business vs system vs validation).
- [ ] Error messages are user-friendly and actionable.
- [ ] Resources are properly released (connections, files, streams).
- [ ] Fail-fast principle applied where appropriate.

## Language-Specific Checklists

## C# / .NET

- Use enums for fixed value sets; no magic strings/numbers.
- Use `const` or `static readonly` for true constants; not `static` instance fields.
- Prefer LINQ over manual loops when it improves readability without hurting performance.
- Use `var` when the type is obvious from the right side; use explicit type when it aids readability.
- Use `StringBuilder` for string concatenation in loops; not `+=`.
- Use `string.IsNullOrEmpty()` / `string.IsNullOrWhiteSpace()`; not `== ""` or `== null`.
- Prefer `async/await` over `.Result` / `.Wait()`; avoid sync-over-async.
- Use `ConfigureAwait(false)` in library code.
- Use collection initializers: `new List<T> { a, b, c }`.
- Use null-conditional operators (`?.`) and null-coalescing (`??`) appropriately.
- Use `record` for immutable data; `class` for mutable.
- Use pattern matching (`is`, `switch` expressions) over type checks + casts.
- Use `nameof()` for parameter/property references in exceptions and notifications.
- Prefer dependency injection over static service locators.
- Use `using` statements/declarations for IDisposable.
- Check for: `==` vs `.Equals()`, mutable structs, enum underlying type mismatches, missing `ConfigureAwait(false)` in library code.

## Java

- Use enums for fixed value sets; no magic strings/numbers.
- Use `Optional<T>` for nullable return values; not `null` returns with `@Nullable`.
- Prefer `Stream` API over manual loops when it improves readability.
- Use `StringBuilder` for string concatenation in loops.
- Use `Objects.requireNonNull()` for null checks.
- Prefer `List.of()` / `Map.of()` (Java 9+) for immutable collections.
- Use `try-with-resources` for AutoCloseable.
- Prefer interfaces as types: `List<String>` not `ArrayList<String>`.
- Use `@Override` when implementing interface methods or overriding superclass methods.
- Use `final` for variables that should not be reassigned.
- Prefer records (Java 16+) for immutable data carriers.
- Use `instanceof` pattern matching (Java 16+) over type checks + casts.
- Use `switch` expressions with `->` and `yield`.
- Check for: `==` for string comparison, `Integer` cache range, unchecked exceptions, raw types.

## TypeScript / JavaScript

- Use `enum` or union types for fixed value sets; no magic strings/numbers.
- Use `const` by default; `let` only when reassignment is needed; never `var`.
- Prefer `interface` for object shapes; `type` for unions and intersections.
- Use optional chaining (`?.`) and nullish coalescing (`??`).
- Use `readonly` for immutable properties and `Readonly<T>` / `ReadonlyArray<T>` for immutable collections.
- Prefer `unknown` over `any`; use type guards to narrow.
- Use discriminated unions for state machines; not boolean flags.
- Use `as const` for literal type inference.
- Prefer `import type` for type-only imports.
- Use `Promise` with `async/await`; not `.then()` chains when possible.
- Use `Map`/`Set` for key-value/unique collections; not plain objects when keys are non-string.
- Check for: `==` vs `===`, `null` vs `undefined`, mutable default parameters, `any` overuse.

## Vue

- Use `<script setup>` with Composition API; not Options API for new code.
- Use `ref()` / `reactive()` for state; `computed()` for derived values.
- Use `defineProps()` / `defineEmits()` with TypeScript types.
- Use `watch()` / `watchEffect()` for side effects; clean up in `onUnmounted()`.
- Prefer `v-model` with `defineModel()` over manual prop/emit sync.
- Use `provide()` / `inject()` for dependency injection across deep component trees.
- Use `<Suspense>` for async component loading.
- Keep components small and composable; extract reusable logic to composables (`use*` functions).
- Use `v-if` for conditional rendering, `v-show` for frequent toggling.
- Use `:key` with `v-for` for stable identity; not array index.
- Check for: reactive property addition without `reactive()`, missing `key` in `v-for`, `v-if` + `v-for` on same element, missing `onUnmounted` cleanup.

## React

- Use function components with hooks; not class components for new code.
- Use `useState` for local state; `useReducer` for complex state logic.
- Use `useMemo` / `useCallback` only when profiling shows a need; not by default.
- Use custom hooks (`use*`) to extract reusable logic.
- Use `useEffect` with proper cleanup; not for derived state (use `useMemo` instead).
- Use `React.memo()` only when profiling shows re-render issues.
- Use `key` prop with stable identity in lists; not array index.
- Use `children` prop for composition; not prop drilling when possible.
- Use Context for cross-cutting concerns; not for every piece of state.
- Use `forwardRef` when the component needs to expose a ref.
- Use `useId()` for stable unique IDs.
- Use Suspense + lazy for code splitting.
- Check for: stale closures in `useEffect`, missing dependency arrays, `useEffect` for derived state, unnecessary `useMemo`/`useCallback`.

## Python

- Use `Enum` / `IntEnum` for fixed value sets; no magic strings/numbers.
- Use type hints (`typing` module) for function signatures.
- Use `dataclass` for data containers; `NamedTuple` for immutable records.
- Use `pathlib.Path` for file paths; not `os.path` string concatenation.
- Use `f-strings` for string formatting; not `%` or `.format()`.
- Use `with` statements for resource management.
- Use `collections` module: `defaultdict`, `Counter`, `deque` where appropriate.
- Use list/dict comprehensions over manual loops when readable.
- Use `if __name__ == "__main__":` guard for script entry.
- Use `@dataclass(frozen=True)` for immutable data.
- Use `match` statement (Python 3.10+) for structural pattern matching.
- Use `@property` for computed attributes; not getter methods.
- Use `abc.ABC` / `@abstractmethod` for interfaces.
- Check for: mutable default arguments, `is` vs `==`, bare `except`, `global` overuse.

## Go

- Use `iota` constants or named types for fixed value sets; no magic strings/numbers.
- Use `errors.Is()` / `errors.As()` for error checking; not `==`.
- Use `defer` for cleanup; LIFO order.
- Use `context.Context` for cancellation and timeouts in all I/O functions.
- Use `struct` with methods; not inheritance.
- Use interfaces with small method sets (1-3 methods); define at point of use.
- Use `goroutine` + `channel` for concurrency; not shared state with mutex when possible.
- Use `sync.WaitGroup` for goroutine coordination.
- Use table-driven tests as the default test pattern.
- Use `go fmt` style; tabs not spaces.
- Use `:=` for new variables; `=` for reassignment.
- Use `if err != nil` error handling; not panic/recover for control flow.
- Check for: goroutine leaks, unclosed channels, nil interface values, slice aliasing, unhandled errors.

## SQL

- Use parameterized queries; never string concatenation for SQL.
- Use `COALESCE` / `NULLIF` for null handling; not `ISNULL` or `IFNULL` when portable.
- Use `EXISTS` over `IN` for subqueries on large datasets.
- Use `JOIN` with explicit `ON`; not implicit comma joins.
- Use `WITH` (CTE) for complex queries; not nested subqueries.
- Use `UPSERT` (`ON CONFLICT` / `MERGE`) for insert-or-update; not SELECT-then-INSERT.
- Use `CASE WHEN` for conditional logic; not `IIF` or `DECODE` when portable.
- Use `EXPLAIN` to verify query plans for non-trivial queries.
- Use indexes on columns in `WHERE`, `JOIN`, and `ORDER BY` clauses.
- Use `TRANSACTION` / `BEGIN...COMMIT` for multi-statement atomicity.
- Check for: `SELECT *`, missing `WHERE` in `UPDATE`/`DELETE`, N+1 queries, implicit type conversion, missing index on hot path.
