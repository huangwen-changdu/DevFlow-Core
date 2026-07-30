# DevFlow Brainstorm Interview Discipline

Use this reference only while `devflow-brainstorm` clarifies and explores a request. It is not a route, design, planning, recovery, or documentation workflow.

## Clarification Loop

```text
User request
-> read minimum relevant facts
-> select clarification depth (light / standard / deep)
-> Semantic Echo-Back
-> wait for confirm or correction
-> one theme at a time, always with a recommended answer
-> multi-angle exploration and problem-space recommendation (standard/deep)
-> tiered revision: major correction -> corrected echo-back; minor -> acknowledge
-> fixed Confirmed request summary
-> stop
```

`devflow-core` consumes the summary and chooses any later lifecycle work. This reference must not select or describe that later work.

## Clarification Depth

| Tier | Signals | Moves |
|---|---|---|
| `light` | Request nearly clear; narrow or no ambiguity; facts cover most fields. | Echo-Back -> confirm -> summary. |
| `standard` | Normal requirement; several real gaps. | Echo-Back -> themed questions -> fitting multi-angle checks -> summary. |
| `deep` | Vague goal, high stakes, multiple actors, conflicting constraints, or the user asks for ideas. | Echo-Back -> themed questions -> full multi-angle checklist -> directions with trade-offs + recommendation -> summary. |

Depth governs how thoroughly the request is explored, never which lifecycle step follows. Escalate when new facts raise complexity; de-escalate when gaps close early.

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
- Every field is required content; when a field has no content, write `none` inline and move on — do not pad empty fields into filler sentences.
- If multiple interpretations are plausible, present the alternatives in the echo-back; do not choose one.
- Facts from code, configuration, tests, or documentation are stated rather than asked.
- Business intent and user-visible boundaries are confirmed rather than inferred.
- If the user corrects the understanding, apply the tiered revision rule below.

## Multi-Angle Checklist

At `standard`, run the angles that fit the request. At `deep`, walk every angle and report what each found, including "nothing found here":

| Angle | Ask yourself |
|---|---|
| User value | Who benefits, from what pain? Is the outcome observable? |
| Edges and exceptions | What inputs, actors, or states break the happy path? |
| Impact surface | Who or what else is affected — other features, data, users not named in the request? |
| Reverse thinking | What happens if we do nothing, or do the opposite? |
| Proportionality | Is the ask sized to the value? Over- or under-scoped? |
| Hidden assumptions | What must be true for this request to make sense? Is any of it doubtful? |

Findings feed the summary: gaps and risks go to `Identified gaps/risks`; direction thinking goes to `Directions considered` and `Recommended direction`.

## Problem-Space Recommendation

Allowed and expected here:

- naming gaps, contradictions, risks, and missing stakeholders in the user's request;
- offering directions the user has not considered, each with trade-offs;
- recommending one direction with its rationale;
- recording rejected directions and why they were dropped.

Out of bounds — record the need in the summary and leave it to `devflow-spec`:

- technical selection, architecture, structure, interface contracts, implementation steps.

Boundary test: "what to do / why / what not to do / what could go wrong" stays; "how to implement" goes. In-bounds example: "方向 A 覆盖边界场景但流程更长，方向 B 简单但留下重发风险——推荐 A，因为漏洞主要出在重发。" Out-of-bounds example: "用 Redis 做缓存层，表加两个字段。"

Recommendations are disposable conversation material that helps the user decide what they want; they never commit the project to a design.

## Understanding Revision Rule

A **major correction** changes the goal, scope, exclusions, constraints, acceptance, terminology, actor, or a load-bearing assumption. It interrupts the current clarification chain:

1. stop the pending question;
2. update facts, assumptions, and understanding gaps;
3. send a complete corrected Semantic Echo-Back; and
4. wait for confirmation before asking another question or producing `Confirmed request`.

A **minor correction** changes none of those: acknowledge it in one line, fold it into the understanding, and continue.

Either way, do not silently absorb a correction into a later question or the summary. An acknowledged minor correction is not by itself a confirmed request.

## One-Question Discipline

Ask one theme at a time, only when a real gap remains. Resolve gaps in this order:

1. goal ambiguity;
2. scope boundary;
3. out-of-scope boundary;
4. constraint;
5. acceptance;
6. remaining open question.

Rules:

- One theme per message; wait for the answer before the next theme. Tightly coupled sub-questions of the same theme may share one message when splitting them would force artificial back-and-forth.
- Always attach a recommended answer and why it matters. Phrase them naturally inside the conversation; a rigid `Question / Recommended answer / Why now` block is available when precision needs it, not mandatory attire.
- Do not ask for an answer that project facts establish. Do not ask a later-category question while an earlier category remains unclear.
- Use the user's language; avoid unexplained technical terms.

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
| "Ask everything at once." | One theme per message, then wait. |
| "The codebase answers user intent." | Code answers current facts, not desired behavior. |
| "Clarification should pick the next skill." | The summary stops here; Core owns routing. |
| "A design or document belongs in the summary." | Record the request and exploration findings only. |
| "Templates must be filled verbatim." | Fields are required, filler is not; conversation beats form. |
| "Recommending is spec's job." | Problem-space recommendation is this skill's duty; spec owns how-to-build. |

## Verification

- [ ] A clarification tier was selected and was not treated as lifecycle routing.
- [ ] Semantic Echo-Back included facts, assumptions, and gaps where they exist, with `none` where they do not.
- [ ] Questions were one theme at a time, fact-backed, and each carried a recommended answer.
- [ ] Multi-angle exploration ran at `standard`/`deep` and its findings reached the summary.
- [ ] Recommendations stayed inside the problem space.
- [ ] Major corrections were re-echoed; minor corrections were acknowledged explicitly.
- [ ] `Confirmed request` includes every fixed field.
- [ ] The summary contains no design, route, handoff, documentation, recovery, or implementation instruction.
