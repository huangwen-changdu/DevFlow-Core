---
name: devflow-audit
description: "Use when auditing a repository or scope for overengineering, bloat, unnecessary abstraction, missed reuse, stdlib/native replacements, or asking what code can be deleted or simplified."
---

# DevFlow Audit

Audit code for unnecessary complexity across a repository or named scope.

This is repo-wide `devflow-cut`, not correctness review and not implementation.

## Process

1. Define scope: whole repo, directory, file set, or user-provided focus.
2. Read project rules and obvious ignore paths before scanning.
3. Inspect files with `rg --files`, then read representative code in the chosen scope.
4. Hunt for delete-list findings:
   - `delete`: dead code, speculative feature, unused flexibility.
   - `reuse`: duplicate code or helper that should use an existing project helper, utility, type, or pattern.
   - `stdlib`: hand-rolled behavior the language standard library covers.
   - `native`: dependency or custom code doing what the platform already does.
   - `yagni`: abstraction, config, factory, wrapper, or layer with no current second use.
   - `shrink`: same behavior with fewer moving parts.
5. Rank biggest useful cut first.
6. Do not apply fixes unless the user explicitly asks for a follow-up implementation.

When `scripts/devflow-audit.js` exists, use it as a first-pass candidate scan. The script output is evidence, not final judgment; confirm important findings by reading the referenced code.

## Output

One finding per line:

```text
<file>:L<line>: <delete|reuse|stdlib|native|yagni|shrink>: <what to cut>. <replacement>.
```

End with:

```text
net: -<N> lines, -<M> deps possible.
```

If nothing material should be cut:

```text
Lean already. Ship.
```

## Boundaries

- Do not report correctness bugs, security issues, performance issues, or style preferences as audit findings.
- Do not flag tests, small assertions, validation, accessibility, auth, permission, data-loss protection, or rollback safeguards as bloat.
- Do not infer unused code only from one grep result when dynamic entry points or exports may exist; mark it as "candidate" or skip.
- Do not change files during audit.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The scanner found it, so it is removable." | The scanner only finds candidates. Read the code before reporting a real finding. |
| "This abstraction looks big." | Size is not enough. Flag only avoidable complexity with a smaller current replacement. |
| "This is a bug too." | Correctness, security, performance, and style belong to review or debugging, not audit. |
| "I can just clean it up now." | Audit reports findings only. Fixes require a separate Build route. |

## Handoff

If the user wants fixes after the audit, hand off to `devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove` with selected findings as the design input.

## Verification

Before leaving this skill, confirm:

- [ ] Scope was named.
- [ ] Code was read or script output was confirmed with code reads.
- [ ] Findings use the audit tags.
- [ ] Boundaries were respected.
- [ ] No files were changed.
