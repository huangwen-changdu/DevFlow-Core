---
name: devflow-spec
description: "Use after devflow-core selects a saved spec for a confirmed request that needs approach comparison, a reviewable design contract, and a requirements document before implementation."
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

1. Consume the `Confirmed request` that `devflow-core` selected for Spec work, then read the relevant project facts. Do not re-confirm settled request fields or route the lifecycle.
2. Compare the smallest real options before writing: no change/reuse when it can meet the request, direct implementation, and any existing project pattern that materially changes the decision. State trade-offs and why the selected approach is the smallest useful one.
3. Write the design contract and saved spec under `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`, resolved from the current target project's root, unless that project already documents another specs path.
4. Include the required sections with English headers:
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

   In `Approach`, record the compared options, trade-offs, chosen design, boundaries, and why rejected options do not meet the current request. Section content should be written in the user's language, but section headers must remain in English so `scripts/devflow-spec.js` can validate them.

   The **Code Documentation** section specifies what code comments are required for this feature:
   - Which modules/files need file-level comments (what the file does, key exports)
   - Which functions/classes need function-level comments (params, return value, purpose, side effects)
   - Which non-obvious logic needs inline comments (explain WHY, not WHAT)
   - Reference to existing project comment conventions if any
   - For trivial changes (one-line fix, config tweak), state "none — trivial change" explicitly
5. Run the design/spec self-review:
   - Unresolved-marker scan: no draft markers, unresolved question marks, or unresolved angle values.
   - Consistency: requirements, chosen approach, impact, acceptance, and verification do not contradict.
   - Scope: if multiple independent subsystems appear, split into separate specs.
   - Design: the comparison names the real alternatives and the selected approach has an explicit trade-off.
6. Run `node scripts/devflow-spec.js <spec-file>` when the script exists. If not found at `scripts/devflow-spec.js` (project-level), try `~/.codex/scripts/devflow-spec.js` or `~/.claude/scripts/devflow-spec.js` (user-level). Do NOT look under `skills/scripts/`. See `core-methods.md` Script Path Resolution.
7. **STOP — Wait for user approval of the design contract and spec.** Tell the user the spec path and review result. If they request changes, revise the comparison/design contract and re-run self-review. After approval, Spec returns the confirmed Spec to `devflow-core` and stops; only Core selects Cut, Plan, Build, Prove, Recovery, or no further lifecycle work.

## Output

```text
Spec: docs/specs/YYYY-MM-DD-<short-kebab-name>.md
Source: <Confirmed request selected by devflow-core>
Design: options compared <pass/fail>; selected approach and trade-off <pass/fail>
Review: unresolved-marker scan <pass/fail>; consistency <pass/fail>; scope <pass/fail>; design <pass/fail>
Next: confirmed Spec -> `devflow-core` selects any needed Cut, Plan, Build, Prove, Recovery, or no further lifecycle work
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "A plan is enough." | If requirements can drift across tasks, write the spec first. |
| "The spec can be vague; the plan will decide." | Vague specs create wrong plans. Resolve or mark the question before planning. |
| "Brainstorm already chose the approach." | Brainstorm confirms what the user wants; Spec compares how to satisfy it and records the design contract. |
| "The user approved the spec, so hand off directly to Cut." | Approval returns the confirmed Spec to Core; only Core chooses the next lifecycle skill. |
| "This belongs in docs/features." | `docs/features/` is product ledger memory, not a generated implementation spec. |
| "The user said implement, so skip approval." | Implementation requests still need the lightest useful design/spec source before Build. |
| "Code Documentation is unnecessary, the code is self-explanatory." | Code tells you WHAT it does. Comments tell you WHY it does it. Future developers (and LLMs) need the WHY. |
| "Comments will get stale." | Stale comments are a maintenance issue, not a reason to skip documentation. Undocumented code is worse than stale comments. |
| "I'll add comments later." | Later never comes. Comments are part of the implementation, not an afterthought. |

## Verification

Before leaving this skill, confirm:

- [ ] Spec scope was named.
- [ ] Real options, trade-offs, and the chosen approach are recorded in the design contract.
- [ ] Required sections exist, including Code Documentation.
- [ ] Spec landed under the current project's `docs/specs/YYYY-MM-DD-<short-kebab-name>.md` path or a documented target-project specs path.
- [ ] Unresolved-marker, consistency, scope, and design checks ran.
- [ ] Code Documentation section specifies what needs comments (or explicitly states "none — trivial change").
- [ ] `scripts/devflow-spec.js` ran when available.
- [ ] User reviewed and approved the design contract and written spec.
- [ ] The confirmed Spec was returned to `devflow-core`; Spec did not select or hand off to Cut, Plan, Build, Prove, or Recovery.
