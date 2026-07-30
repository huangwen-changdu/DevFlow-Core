# DevFlow Core Methods

This is the shared method source loaded by `devflow-core` before route selection. It contains only the invariants needed by every route. Load the selected owner reference from the map below before applying lifecycle-specific rules.

## Method 0: Architect Mindset

Apply these principles to every route:

1. Read the affected system and blast radius before changing it.
2. Preserve contracts unless the accepted goal requires a contract change.
3. Prefer the smallest necessary coupling and mechanism.
4. Trace data and callers before diagnosing a bug.
5. Scale ceremony to reversibility and failure modes.
6. Treat complexity as a limited budget.
7. Use fresh evidence, not intuition, for completion claims.

## Capability Map

| Need | Runtime owner | Load when |
|---|---|---|
| Context, route choice, clarification, small-boundary, method lens, skill contract | this file | every `devflow-core` route |
| Reuse, root cause, native, overbuild, debt | `skills/devflow-cut/references/cut-methods.md` | Core selects Cut |
| Spec, Plan, minimal change, implementation slices | `skills/devflow-spec/references/spec-plan-methods.md` | Core selects Spec or Plan |
| Build minimal change and implementation slices | `skills/devflow-build/references/build-methods.md` | Core selects Build |
| Proof and recovery | `skills/devflow-prove/references/proof-recovery-methods.md` | Core selects Prove or PUA |
| Learning-card lifecycle | `skills/devflow-learn/SKILL.md` | Core selects Learn after a PASS or reusable correction |

## Method 1: Context Map

Read the narrowest useful facts:

1. Project rules and relevant source, tests, commands, and current docs.
2. `.copilot/LEARNING_INDEX.md`, then only cards whose Trigger and Scope match.
3. `docs/project-knowledge/AI-START-HERE.md` or `index.md`, then only navigation-selected documents.
4. `graphify-out/GRAPH_REPORT.md` when architecture impact is in scope.
5. Available environment skills; record a matching guidance skill without widening DevFlow scope.

Missing indexes or references are non-blocking and must not create storage.

```text
Facts: read/confirmed <files or commands>
Methods: read/confirmed core-methods.md; selected owner references <paths or none>
Knowledge recall: none / learning index + matched card / project knowledge entry + matched docs
Skill Discovery: none / <skill-name> (matched: <why>)
Unknowns: <none or specific unknown>
```

## Method 2: Brainstorm Clarification

For a new requirement, behavior change, architecture choice, or genuine ambiguity: read minimum facts, send a Semantic Echo-Back, resolve one real uncertainty at a time, and stop after this fixed artifact:

```text
Confirmed request:
- Goal: ...
- Scope: ...
- Out of scope: ...
- Constraints: ...
- Acceptance: ...
- Open questions: ...
- Status: clarified
```

Brainstorm does not choose downstream lifecycle work. Core consumes the artifact.

## Method 3: Small Request Boundary

Use Fast only when impact, risk, uncertainty, and proof are all small. Design-lite is for an existing feature with one plausible path after facts are read. Choose full Design when behavior, options, contracts, modules, compatibility, or rollback are unclear. Ask the user to choose when facts cannot distinguish the route.

## Method 4: Method Lens

Select one lens only when it changes execution judgment:

| Lens | Use when | Action |
|---|---|---|
| Root Cause | Bug or regression | Search callers and shared cause before proposing a fix. |
| Working Backwards | Product or workflow ambiguity | Start from a user-visible acceptance result. |
| First Principles Cut | Problem solving, bug fixing, architecture, scope, or abstraction pressure | Reduce to facts, constraints, invariants, and smallest mechanism. |
| Data/Proof | Metrics or verifier-sensitive work | Define evidence and owner before implementation. |
| Operational Owner | Cross-file or release work | Name responsible surface and rollback or follow-through evidence. |

## Method 15: Skill As Executable Contract

Every skill must state when it applies, concrete actions, artifact or output, stop or return boundary, and verification. Put trigger language in its description. Do not duplicate the full framework in every skill or entry file.

## Shared Output Contracts

Design:

```text
Goal: ...
Motivation: ...
Smallest useful plan: ...
Not doing: ...
Impact: ...
Verification: ...
```

Completion:

```text
Command: ...
Result: ...
Adversarial review: ...
Judgment: PASS / FAIL / BLOCKED
```

## Script Path Resolution

Resolve DevFlow checker scripts in this order: `scripts/devflow-<name>.js` in the target project, `~/.codex/scripts/devflow-<name>.js`, then `~/.claude/scripts/devflow-<name>.js`. A missing checker is noted as unavailable; do not search `skills/scripts/`.
