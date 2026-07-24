---
name: devflow-spec
description: "Use when writing a requirements/spec document, turning an approved design into a saved spec, planning from specs, or creating docs/specs artifacts before implementation."
---

# DevFlow Spec

Write the smallest useful spec document before implementation when the request needs more than a short design contract.

This is Superpowers-style spec discipline adapted to DevFlow: write specs only when they reduce ambiguity, review them before planning, and keep plans traceable to specs or approved designs.

## When To Write A Spec

Use a saved spec when any of these are true:

- The user asks for a spec, specs doc, design doc, or requirements document.
- The work crosses modules, roles, persistence, APIs, release flow, or user-visible workflows.
- Several requirements must stay aligned across implementation tasks.
- The plan would be hard to review without a written source of truth.

Do not force a spec for Design-lite work where a short design contract and quick proof are enough.

## Process

1. Read the approved design contract from `devflow-brainstorm` and the relevant project facts. Do not re-confirm goal, constraints, or approaches — those were already settled and user-approved in Brainstorm.
2. Write the spec under `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`, resolved from the current target project's root, unless that project already documents another specs path.
3. Include the required sections with English headers:
   - Goal
   - Context
   - Requirements
   - Non-goals
   - Approach
   - Impact
   - Acceptance
   - Verification
   - Code Documentation
   - Open Questions

   Section content should be written in the user's language (e.g., Chinese for Chinese users), but section headers must remain in English so `scripts/devflow-spec.js` can validate them.

   The **Code Documentation** section specifies what code comments are required for this feature:
   - Which modules/files need file-level comments (what the file does, key exports)
   - Which functions/classes need function-level comments (params, return value, purpose, side effects)
   - Which non-obvious logic needs inline comments (explain WHY, not WHAT)
   - Reference to existing project comment conventions if any
   - For trivial changes (one-line fix, config tweak), state "none — trivial change" explicitly
4. Run the spec self-review:
   - Unresolved-marker scan: no draft markers, unresolved question marks, or unresolved angle values.
   - Consistency: requirements, approach, impact, acceptance, and verification do not contradict.
   - Scope: if multiple independent subsystems appear, split into separate specs.
   - Ambiguity: pick an explicit interpretation or mark the open question before planning.
5. Run `node scripts/devflow-spec.js <spec-file>` when the script exists. If not found at `scripts/devflow-spec.js` (project-level), try `~/.codex/scripts/devflow-spec.js` or `~/.claude/scripts/devflow-spec.js` (user-level). Do NOT look under `skills/scripts/`. See `core-methods.md` Script Path Resolution.
6. **STOP — Ask the user to review the spec**: Tell the user the spec file path and ask them to review it before proceeding. If they request changes, make them and re-run the spec self-review. Only proceed once the user approves.

## Output

```text
Spec: docs/specs/YYYY-MM-DD-<short-kebab-name>.md
Source: <approved design from devflow-brainstorm>
Review: unresolved-marker scan <pass/fail>; consistency <pass/fail>; scope <pass/fail>; ambiguity <pass/fail>
Next: /devflow-plan with Source and Spec coverage, then devflow-cut -> devflow-build
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "A plan is enough." | If requirements can drift across tasks, write the spec first. |
| "The spec can be vague; the plan will decide." | Vague specs create wrong plans. Resolve or mark the question before planning. |
| "This belongs in docs/features." | `docs/features/` is product ledger memory, not a generated implementation spec. |
| "The user said implement, so skip approval." | Implementation requests still need the lightest useful design/spec source before Build. |
| "Code Documentation is unnecessary, the code is self-explanatory." | Code tells you WHAT it does. Comments tell you WHY it does it. Future developers (and LLMs) need the WHY. |
| "Comments will get stale." | Stale comments are a maintenance issue, not a reason to skip documentation. Undocumented code is worse than stale comments. |
| "I'll add comments later." | Later never comes. Comments are part of the implementation, not an afterthought. |

## Verification

Before leaving this skill, confirm:

- [ ] Spec scope was named.
- [ ] Required sections exist, including Code Documentation.
- [ ] Spec landed under the current project's `docs/specs/YYYY-MM-DD-<short-kebab-name>.md` path or a documented target-project specs path.
- [ ] Unresolved-marker, consistency, scope, and ambiguity checks ran.
- [ ] Code Documentation section specifies what needs comments (or explicitly states "none — trivial change").
- [ ] `scripts/devflow-spec.js` ran when available.
- [ ] User reviewed the written spec and approved it.
- [ ] The next plan will cite the spec or approved design as `Source`.
- [ ] Handoff target is `/devflow-plan` (not directly to `devflow-build`).
