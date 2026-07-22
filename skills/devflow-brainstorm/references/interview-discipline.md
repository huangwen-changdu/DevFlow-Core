# DevFlow Brainstorm Interview Discipline

Use this reference during `devflow-brainstorm` for any development request whose goal, constraints, acceptance, trade-offs, or implementation shape are not yet crisp enough to cut or build.

This absorbs the useful behavior from Matt Pocock's interview skills into DevFlow's existing Brainstorm path. It is not a separate skill, route, or mode name.

## Development Flow

```text
User development request
-> devflow-core Sense/routing
-> devflow-brainstorm Semantic Echo-Back (confirm understanding; doubles as first clarification question)
-> devflow-brainstorm Depth Selection Gate (A/B/C)
-> devflow-brainstorm interview discipline (Core Clarification, required for all depths)
-> approved DevFlow design contract
-> depth-based handoff:
   -> A (Full Spec): devflow-spec -> /devflow-plan -> devflow-cut
   -> B (Simplified Spec): /devflow-plan -> devflow-cut
   -> C (Dialogue Confirmation): devflow-cut
-> devflow-build when implementation is requested
-> devflow-prove
-> devflow-learn when the work creates a reusable correction
```

For design-only requests, stop after the approved design contract, `devflow-cut`, or `devflow-spec`, depending on what the user asked for and the selected depth. `devflow-spec` is the node for turning the approved design into `docs/specs/YYYY-MM-DD-<short-kebab-name>.md` before `/devflow-plan` and implementation. Depth C skips spec and plan, going directly to `devflow-cut`.

## Interview Behavior

- Start with the Semantic Echo-Back: confirm what the user wants before any process question. If the request has multiple plausible interpretations, the echo-back is a disambiguation multiple-choice, not a statement.
- Ask exactly one question at a time.
- For each question, include your recommended answer.
- Walk the design tree by dependencies: do not ask a downstream question before the upstream decision is resolved.
- If a question can be answered by reading code, docs, config, tests, or feature ledgers, read those facts instead of asking.
- Preserve DevFlow's Small Request Boundary, Method Lens, Not Doing list, and Cut gate.
- Stop when the shared understanding is strong enough to produce the normal DevFlow design contract.

## Progressive Design-Section Confirmation

After the interview and approach comparison, present the design in small sections and wait for confirmation after each. This is not a second workflow — it is the confirmation phase of the same Brainstorm pass.

- Scale sections to the work: Design-lite may use one section; full Design uses separate sections for scope, implementation, and verification.
- Each section names what it decides, the key tradeoff, and asks for confirmation before continuing.
- If the user rejects a section, revise that section only — do not restart the entire design.
- After all sections are confirmed, consolidate them into the normal DevFlow design contract.

Section output shape:

```text
Section: <section name>
Proposed decision: <what this section decides>
Key tradeoff: <what was considered and why this choice>
Confirm? <wait for user response>
```

Do not duplicate the full Brainstorm workflow, safeguard tables, or Depth Selection Gate here — those live in `SKILL.md`. This reference focuses on interview mechanics and section confirmation.

## Documentation Landing

If the user asks to document the result, capture docs, or preserve decisions:

1. Run the same one-question-at-a-time interview loop.
2. When a project term is clarified, update an existing glossary or domain context only if the target project already has one.
3. When no glossary exists, capture terminology in the relevant DevFlow artifact instead: the design contract, `docs/specs/YYYY-MM-DD-<short-kebab-name>.md`, or a matched `docs/features/*.md` ledger.
4. Use `devflow-spec` when the approved design needs a saved requirements source before `/devflow-plan`.
5. Use a feature ledger for product capability history.
6. Offer an ADR only when the decision is hard to reverse, surprising without context, and the result of a real trade-off.
7. If an ADR is accepted, create it under `docs/adr/` lazily.
8. Update feature ledgers only after validation for a capability change passes.

Do not create `CONTEXT.md`, `CONTEXT-MAP.md`, or `docs/adr/` just because documentation was requested. Create docs only when a term or decision actually crystallizes.

## Output Contract

While interviewing:

```text
Question: <one question>
Recommended answer: <answer and rationale>
Why now: <dependency or risk this resolves>
```

When presenting design sections (between interview and final contract):

```text
Section: <section name>
Proposed decision: <what this section decides>
Key tradeoff: <what was considered and why this choice>
Confirm? <wait for user response>
```

When the interview and section confirmations are complete:

```text
Goal:
Smallest useful plan:
Not doing:
Impact:
Verification:
Depth: A / B / C
Open questions: <none or remaining blockers>
Docs captured: <none or files updated>
Next: devflow-cut / devflow-spec -> /devflow-plan / wait for user
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "Interviewing means ask many questions." | One question at a time is the point. |
| "The answer is probably in the user's head." | If code or docs can answer it, read facts instead. |
| "Docs requested means write every doc type." | Use `devflow-spec` for requirements, feature ledgers for capability history, and ADRs only for hard-to-reverse trade-offs. |
| "This replaces DevFlow Brainstorm." | It is Brainstorm's discipline, not a separate workflow. |
