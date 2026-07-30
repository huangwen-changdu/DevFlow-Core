# DevFlow Brainstorm Interview Discipline

Use this reference only while `devflow-brainstorm` clarifies and explores a request. It is not a route, design, planning, recovery, or documentation workflow.

## Clarification Loop

```text
User request
-> read minimum relevant facts
-> Semantic Echo-Back (all fields, even when none)
-> wait for confirm or correction
-> one question at a time, each with a recommended answer
-> mandatory multi-angle exploration and problem-space recommendation
-> corrected echo-back when understanding changes
-> fixed Confirmed request summary
-> stop
```

`devflow-core` consumes the summary and chooses any later lifecycle work. This reference must not select or describe that later work.

## Clarification Depth

Depth governs **analysis breadth only**. It never skips the echo-back, the confirm gates, the question discipline, or the recommendation duty.

| Tier | Entry condition | Moves |
|---|---|---|
| `deep` (default) | Every request, unless the user explicitly asks for a lighter pass. | Full multi-angle checklist with a per-angle report; directions with trade-offs; recommendation. |
| `standard` | Only on explicit user request for a lighter pass. | Fitting angles instead of the full checklist; every other duty unchanged. |

There is no fast lane. When the user asks for speed, compress wording, never gates.

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
- Include all fields, even when a field is `none`.
- If multiple interpretations are plausible, present the alternatives in the echo-back; do not choose one.
- Facts from code, configuration, tests, or documentation are stated rather than asked.
- Business intent and user-visible boundaries are confirmed rather than inferred.
- If the user corrects the understanding, apply the Understanding Revision Rule below.

## Multi-Angle Checklist

Mandatory on every request (default `deep`). Walk every angle and report what each found, including "nothing found here" — an explicit negative finding is what makes the summary a reliable anti-hallucination basis:

| Angle | Ask yourself |
|---|---|
| User value | Who benefits, from what pain? Is the outcome observable? |
| Edges and exceptions | What inputs, actors, or states break the happy path? |
| Impact surface | Who or what else is affected — other features, data, users not named in the request? |
| Reverse thinking | What happens if we do nothing, or do the opposite? |
| Proportionality | Is the ask sized to the value? Over- or under-scoped? |
| Hidden assumptions | What must be true for this request to make sense? Is any of it doubtful? |

Findings feed the summary: gaps and risks go to `Identified gaps/risks`; direction thinking goes to `Directions considered` and `Recommended direction`. When every angle finds nothing, write `none` in those fields — do not invent findings.

## Problem-Space Recommendation

Expected on every request, not only when asked:

- naming gaps, contradictions, risks, and missing stakeholders in the user's request;
- offering directions the user has not considered, each with trade-offs;
- recommending one direction with its rationale;
- recording rejected directions and why they were dropped.

Out of bounds — record the need in the summary and leave it to `devflow-spec`:

- technical selection, architecture, structure, interface contracts, implementation steps.

Boundary test: "what to do / why / what not to do / what could go wrong" stays; "how to implement" goes. In-bounds example: "方向 A 覆盖边界场景但流程更长，方向 B 简单但留下重发风险——推荐 A，因为漏洞主要出在重发。" Out-of-bounds example: "用 Redis 做缓存层，表加两个字段。"

Recommendations are disposable conversation material that helps the user decide what they want; they never commit the project to a design.

## Understanding Revision Rule

When a user correction changes the goal, scope, exclusions, constraints, acceptance, terminology, actor, or a load-bearing assumption, it interrupts the current clarification chain:

1. stop the pending question;
2. update facts, assumptions, and understanding gaps;
3. send a complete corrected Semantic Echo-Back; and
4. wait for confirmation before asking another question or producing `Confirmed request`.

A correction that changes none of those may receive a direct one-line acknowledgement, but it must not be treated as a confirmed request. Do not silently absorb a correction into a later question or the summary.

## One-Question Discipline

Ask exactly one question at a time only when a real gap remains. Resolve gaps in this order:

1. goal ambiguity;
2. scope boundary;
3. out-of-scope boundary;
4. constraint;
5. acceptance;
6. remaining open question.

Use this shape for every question:

```text
Question: <one question>
Recommended answer: <answer and rationale>
Why now: <risk or dependency this resolves>
```

Do not ask for an answer that project facts establish. Do not ask a later-category question while an earlier category remains unclear. Use the user's language; avoid unexplained technical terms.

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
| Idea request: "有什么办法", "give me options" | Explore directions in the problem space and recommend one |

## Fixed Summary

When no clarification blocker remains, output exactly this request record and stop:

```text
Confirmed request:
- Goal: <user outcome>
- Scope: <included behavior and surfaces>
- Out of scope: <explicit exclusions>
- Constraints: <must-not-change conditions, or none>
- Acceptance: <observable proof of success>
- Identified gaps/risks: <holes, risks, and blind spots surfaced during exploration, or none>
- Directions considered: <directions discussed with trade-offs, including rejected ones, or none>
- Recommended direction: <recommendation and rationale within the problem space, or none>
- Open questions: <none or unresolved blocker>
- Status: clarified
```

This summary is the factual basis downstream skills — starting with `devflow-spec` — build on; record findings faithfully. It carries no implementation plan, solution-space design, lifecycle route, or handoff.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "A paraphrase is enough." | Surface assumptions and specific gaps. |
| "Ask everything at once." | Ask one question, then wait. |
| "The codebase answers user intent." | Code answers current facts, not desired behavior. |
| "Clarification should pick the next skill." | The summary stops here; Core owns routing. |
| "A design or document belongs in the summary." | Record the request and exploration findings only. |
| "The request looks simple, so the checklist can be skipped." | Simple-looking requests hide the most assumptions; report per-angle findings even when they are `none`. |
| "The user wants speed, so skip a gate." | Compress wording, never gates. Speed comes from fewer real gaps, not skipped structure. |

## Verification

- [ ] Semantic Echo-Back included all fields, with `none` where a field had no content.
- [ ] The echo-back was confirmed or corrected before further clarification.
- [ ] Questions were one at a time, fact-backed, and each used the `Question / Recommended answer / Why now` shape.
- [ ] The multi-angle checklist ran with per-angle findings, and those findings reached the summary.
- [ ] Recommendations stayed inside the problem space.
- [ ] Changed understanding was re-echoed and confirmed before proceeding.
- [ ] `Confirmed request` includes every fixed field.
- [ ] The summary contains no design, route, handoff, documentation, recovery, or implementation instruction.
