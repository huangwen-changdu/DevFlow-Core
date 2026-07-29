# DevFlow Brainstorm Interview Discipline

Use this reference only while `devflow-brainstorm` clarifies a request. It is not a route, design, planning, recovery, or documentation workflow.

## Clarification Loop

```text
User request
-> read minimum relevant facts
-> Semantic Echo-Back
-> wait for confirm or correction
-> one smallest missing clarification question at a time
-> corrected echo-back when understanding changes
-> fixed Confirmed request summary
-> stop
```

`devflow-core` consumes the summary and chooses any later lifecycle work. This reference must not select or describe that later work.

## Semantic Echo-Back

Start every Brainstorm pass with this understanding check:

```text
My understanding:
- Problem to solve: <one sentence in the user's domain language>
- Known facts/constraints: <facts read, or none>
- NOT what you want: <likely misreading ruled out, or none>
- My assumptions (that could be wrong): <inferences not stated by the user, or none>
- Understanding gaps: <specific unclear points, or none>
Is this right? (correct me / confirm)
```

Rules:

- It is its own message and ends with the confirm-or-correct question.
- If multiple interpretations are plausible, present the alternatives in the echo-back; do not choose one.
- Facts from code, configuration, tests, or documentation are stated rather than asked.
- Business intent and user-visible boundaries are confirmed rather than inferred.
- If the user corrects the understanding, repeat the updated echo-back before another clarification question.

## Understanding Revision Rule

When a user correction changes the current understanding, it interrupts the current clarification chain:

1. stop the pending question;
2. update facts, assumptions, and understanding gaps;
3. send a complete corrected Semantic Echo-Back; and
4. wait for confirmation before asking another question or producing `Confirmed request`.

Do not silently absorb a correction into a later question or summary. A correction that does not change understanding may receive a direct acknowledgement, but it must not be treated as a confirmed request.

## One-Question Discipline

Ask exactly one question at a time only when a real gap remains. Resolve gaps in this order:

1. goal ambiguity;
2. scope boundary;
3. out-of-scope boundary;
4. constraint;
5. acceptance;
6. remaining open question.

Use this shape:

```text
Question: <one question>
Recommended answer: <answer and rationale>
Why now: <risk or dependency this resolves>
```

Do not ask for an answer that project facts establish. Do not ask a later question while an earlier category remains unclear. Use the user's language; avoid unexplained technical terms.

## Ambiguity Signals

Treat these as a need to clarify rather than infer:

| Signal | Clarify |
|---|---|
| Vague quantifier: "better", "faster", "more" | Observable target or threshold |
| Implicit scope: "add search" | What and where it applies |
| Pronoun or missing context: "it", "like before" | Exact referent or precedent |
| Missing actor: "notify" | Sender and recipient |
| Unstated constraint: "make it fast" | Required metric or limit |
| Solution-as-goal: "use Redis" | Desired outcome versus mandated tool |
| Ambiguous boundary: "related changes" | Included and excluded surfaces |

## Fixed Summary

When no clarification blocker remains, output exactly this request record and stop:

```text
Confirmed request:
- Goal: <user outcome>
- Scope: <included behavior and surfaces>
- Out of scope: <explicit exclusions>
- Constraints: <must-not-change conditions, or none>
- Acceptance: <observable proof of success>
- Open questions: <none or unresolved blocker>
- Status: clarified
```

This summary has no implementation plan, design recommendation, lifecycle route, or handoff.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "A paraphrase is enough." | Surface assumptions and specific gaps. |
| "Ask everything at once." | Ask one question, then wait. |
| "The codebase answers user intent." | Code answers current facts, not desired behavior. |
| "Clarification should pick the next skill." | The summary stops here; Core owns routing. |
| "A design or document belongs in the summary." | Record only the confirmed request. |

## Verification

- [ ] Semantic Echo-Back included facts, assumptions, and gaps.
- [ ] Questions were one at a time and fact-backed where possible.
- [ ] Corrected understanding was re-echoed when needed.
- [ ] `Confirmed request` includes every fixed field.
- [ ] The summary contains no design, route, handoff, documentation, recovery, or implementation instruction.
