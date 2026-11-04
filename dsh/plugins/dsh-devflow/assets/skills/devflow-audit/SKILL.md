---
name: devflow-audit
description: "Use when auditing a repository or named scope for quality and bloat: bugs, security holes, data loss, what breaks under real load, risky code without tests, slow paths, and code that should be deleted, merged, or split. Ranked findings in plain English, one-shot report, changes nothing. Trigger phrases: 'audit this codebase', 'review the whole repo', 'audit for over-engineering', 'what can I delete from this repo', 'what will break', 'find bloat', '/devflow-audit'."
---

# DevFlow Audit

Audit a repository or named scope like the senior developer who inherits it and will be paged when it breaks.

Order of importance: correct, safe, holds under load, tested, fast, lean.

This is repo-wide audit, not diff review of a change, not implementation, and not a fix pass. It reports; it changes nothing.

## Process

1. Define scope: whole repo, directory, file set, or user-provided focus.
2. Read project rules, build and deploy config, dependency list, and obvious ignore paths before scanning.
3. Map before judging: entry points (main, routes, handlers, jobs, CLI commands) and tests. Find the expected load — one person running a script, or many users and processes at once — and state which load you assumed. Trace the main flows end to end: where data comes in, what is stored, what goes out. In a large repo, go deep where a mistake costs the most, and name the parts you did not read.
4. Hunt six dimensions, most important first:
   - `bug`: wrong result, crash, missed edge case (empty, zero, last item, rounding, time zones), callers that disagree with what a function returns, one rule applied differently in two places.
   - `risk`: injection, weak randomness, secrets in code, missing checks on user input; data loss from swallowed errors, writes in the wrong order, no transaction.
   - `scale`: check-then-write races, the same work done by every process, lists that only grow, a query per item, O(n²) on big input, per-process state that must be shared.
   - `test`: risky logic (a branch, a parser, money, security, data writes, a bug fix) with no test that fails when it breaks. One good test, not coverage.
   - `speed`: a real slowdown. Work repeated in a hot loop is a suggestion; some software counts every millisecond.
   - `lean`: code that should not exist or should be smaller. Tags: `delete`, `reuse`, `stdlib`, `native`, `yagni`, `shrink`, `merge`, `split`. The tag set is owned by `devflow-cut`.
5. Check before reporting: every finding needs a concrete case — this input or situation produces this wrong result. Search the whole tree before calling code unused. A `devflow:` marker that names its ceiling is a decision unless the expected load already crosses it. Propose the smallest fix that works. No style taste, no "consider", no vague worry.
6. Rank findings: Must fix, Should fix, Nice to have.
7. Do not apply fixes unless the user explicitly asks for a follow-up implementation.

Load `references/full-quality-audit.md` for the per-dimension checklists, the report example, and the full check-before-report rules. When the user asks only what can be cut, report the lean dimension alone.

When `scripts/devflow-audit.js` exists, use it as a first-pass candidate scan. It detects lean candidates only; its output is evidence, not judgment. Confirm important findings by reading the referenced code.

## Output

Start with `What this repo does:` in two or three sentences and `Assumed load:` in one line.

Number findings across three groups, most important first, skipping an empty group:

- **Must fix**: bug, security, data loss, breaks at the expected load.
- **Should fix**: risky code without a test, real slowness, duplication, a unit that mixes jobs, code that should not exist.
- **Nice to have**: small speed-ups, shorter forms.

At most 20 findings. When smaller ones are left out, say how many. Every finding has four parts: What this is, Problem, Fix, If we skip it.

For a lean-only request, one line per finding is enough:

```text
<file>:L<line>: <delete|reuse|stdlib|native|yagni|shrink|merge|split>: <what to cut>. <replacement>.
```

End with:

```text
Verdict: <healthy, or the one thing to fix first>
net: -<N> lines, -<M> deps possible.
Not checked: <the parts you did not read or could not run>
```

If nothing material should be fixed or cut: `What this repo does` and `Assumed load`, then `Healthy. Nothing to fix.` and one line on what was checked.

## Boundaries

- This report is not a completion gate. `devflow-prove` proves a change and returns PASS/FAIL/BLOCKED; `devflow-cut` reviews a plan or diff for cuts. Audit neither replaces them nor blocks completion.
- Do not change files during audit.
- Do not report style preference, "consider", or a vague worry as a finding.
- Do not flag tests, small assertions, validation, accessibility, auth, permission, data-loss protection, or rollback safeguards as bloat.
- Do not infer unused code only from one grep result when dynamic entry points or exports may exist; mark it `candidate` or skip.
- A lean finding needs a smaller current replacement. Size alone is not a finding.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The scanner found it, so it is removable." | The scanner only finds lean candidates. Read the code before reporting a real finding. |
| "Audit is about bloat, so the bug does not count." | Correct, safe, and load come before lean. Report the bug first. |
| "This abstraction looks big." | Size is not enough. Flag only avoidable complexity with a smaller current replacement. |
| "I can just clean it up now." | Audit reports findings only. Fixes require a separate Build route. |

## Handoff

If the user wants fixes after the audit, hand off to `devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove` with selected findings as the design input.

## Verification

Before leaving this skill, confirm:

- [ ] Scope and assumed load were named.
- [ ] Connected code was read or script output was confirmed with code reads.
- [ ] Every finding has a concrete case and a smallest fix.
- [ ] Lean findings use one of the eight tags and name a replacement.
- [ ] Boundaries were respected.
- [ ] No files were changed.
