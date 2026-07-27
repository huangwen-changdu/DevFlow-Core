---
name: devflow-brainstorm
description: "Use when a request involves a genuine new requirement, feature design, behavior/product/architecture change, ambiguous ask with multiple plausible interpretations, multi-solution decision, documentation capture within feature design, or a user challenge requiring re-asking the goal/result before rebuilding. Do NOT use for documentation writing, config tuning, trivial code changes, or clear bug fixes with known root cause — those go through Fast or Design-lite. Turns a request into the smallest useful design through collaborative dialogue. Always opens with a semantic echo-back confirmed by the user before any depth or process question. When Fast Exit conditions are met (small change to existing feature, all boundary gates pass, single plausible path), Fast Exit is offered as a recommended option alongside A/B/C — the user chooses, not the LLM."
---

# DevFlow Brainstorm

Turn a request into the smallest useful design before implementation, through progressive collaborative dialogue with the user.

**Violating the letter of the rules is violating the spirit of the rules.**

<HARD-GATE>
Do NOT hand off to `devflow-cut`, `devflow-build`, write any code, or take any implementation action until you have presented a design contract and the user has approved it. This applies to every request that enters the Brainstorm flow. Exception: when the user explicitly chooses Depth C, the choice itself is the approval — produce a minimal design contract inline from the echo-back and hand off directly to `devflow-cut` without a STOP gate. Semantic understanding must be echoed back and confirmed by the user before the Path Selection Gate is presented. The user chooses the path (Fast Exit or A/B/C) and depth (A/B/C) — not the LLM. The LLM must not auto-select Fast Exit or auto-skip A/B/C.
</HARD-GATE>

<ENTRY-GATE>
Before entering the Brainstorm flow, verify that the task genuinely needs design dialogue. Brainstorm is for: new requirements, feature design, behavior/architecture changes, ambiguous asks with multiple plausible interpretations, or multi-solution decisions. Brainstorm is NOT for: documentation writing, config tuning, trivial code changes, clear bug fixes with known root cause, or small changes to existing features with clear behavior — those should be routed to Fast or Design-lite by `devflow-core` before reaching this skill.

**Hard exit**: If the task does not involve actual code development or behavior change (e.g., pure Q&A, consultation, opinion, explanation, fact lookup), do NOT enter Brainstorm. Exit immediately and recommend Fast route. If the task is a small change to an existing feature with clear behavior and single plausible path, do NOT enter Brainstorm. Exit and recommend Design-lite route.

Only enter Brainstorm when the task involves genuine design decisions: new features, architecture changes, ambiguous requirements, or multi-solution trade-offs that need collaborative dialogue before implementation.
</ENTRY-GATE>

## Anti-Pattern: "This Is Too Simple To Need A Design"

Once a request enters the Brainstorm flow, it goes through the full process — even if it seems simple. The design can be short (a few sentences for truly simple work), but you MUST present it and get approval. Design-lite shortens the design — it does not skip the dialogue. However, not every request should enter Brainstorm in the first place: documentation writing, config tuning, trivial code changes, and clear bug fixes with known root cause should be routed to Fast or Design-lite by `devflow-core` before reaching this skill.

**However, once inside Brainstorm, not every task needs the full A/B/C depth ceremony.** When Fast Exit conditions are met (small change to existing feature, all boundary gates pass, single plausible path), Fast Exit is offered as a recommended option at the Path Selection Gate — but the user chooses whether to take it or go through full A/B/C. The LLM must not auto-select Fast Exit.

## Process

1. **Read facts first**: inspect relevant files, docs, configs, tests, existing behavior, commit history, and patterns. Do not ask the user what you can discover by reading.
2. **Frame the goal** as a one-sentence problem statement.
3. **STOP — Confirm understanding**: Echo your understanding back to the user before any process question (see Semantic Echo-Back section). The echo-back must include `My assumptions` and `Understanding gaps` — not just a paraphrase. Scan for Ambiguity Detection Patterns before writing the echo-back. The echo-back doubles as the first clarification question — it does not add a round trip. If the request allows two or more plausible interpretations, the echo-back must be a disambiguation multiple-choice between those interpretations. Do not check the Small Request Boundary or present the Depth Selection Gate until the user confirms or corrects the understanding.
4. **Check the Small Request Boundary**: evaluate whether Fast Exit conditions are met (see Fast Exit Path section).
5. **STOP — Path Selection Gate**: Present path options to the user based on the boundary check. The user chooses, not the LLM.
   - **If Fast Exit conditions are met**: present both Fast Exit (recommended) and full A/B/C options. Wait for user choice.
   - **If Fast Exit conditions are NOT met**: present A/B/C depth options only. Wait for user choice.
6. **If user chose Fast Exit**: present a short design contract directly (see Fast Exit Path section). Get user approval, then hand off to `devflow-cut`. Skip progressive clarification, approach comparison, and spec/plan handoff.
7. **If user chose C**: produce a minimal design contract inline from the echo-back (Goal, Not doing, Impact, Verification) — no STOP gate, no progressive clarification, no approach comparison. The user's choice of C is the approval. Hand off directly to `devflow-cut`. Skip steps 8-17. **If user chose A/B**: continue with progressive clarification and the full design flow (steps 8-17 below).
8. **Progressive clarification**: Ask one question at a time, in priority order (goal ambiguity → scope boundary → actor/recipient → constraint → acceptance → implementation detail). Each message resolves exactly one blocking decision — goal, motivation, constraint, or acceptance. Include a recommended answer. Wait for the user's response before continuing. Prefer multiple choice when possible. Only infer from project facts when the question is purely technical and evidence is unambiguous. If it is a business decision, ask. If a user's answer reveals your echo-back understanding was partially wrong, re-echo the corrected understanding before continuing.
9. **Define success criteria** the user or agent can verify.
10. **Challenge hidden assumptions**:
   - Does this need to exist?
   - What remains true from first principles (第一性原理) if the requested implementation, current abstraction, or preferred solution is removed?
   - Is the user asking for an implementation when a smaller outcome works?
   - What current system behavior may already satisfy the goal?
   - What would make this design unacceptable?
11. **Compare approaches**: Diverge with 2-3 genuinely different approaches unless Design-lite applies (Step 4 gates passed). Each option must include what it does, what it does not do, tradeoff, impact size, and verification.
12. **Apply a Method Lens** when the design, risk, or ambiguity needs a specific working strategy.
13. **Present design in sections**: Present the proposed design in small sections scaled to the work. Default sections cover, as applicable: scope and goals; interaction or implementation design; error handling and verification. Wait for confirmation after each section before presenting the next.
14. **Converge into design contract**: Summarize the approved sections as the existing DevFlow design contract (`Goal`, `Smallest useful plan`, `Not doing`, `Impact`, `Verification`).
15. **STOP — Present design contract**: Present the design contract to the user. Ask whether it looks right. If the user requests changes, go back to the relevant step. Only proceed once the user approves.
    - **Depth A/B**: this is confirmation 1 of 3/2. Continue to step 16.
16. **Design contract self-review** (Depth A/B only): Before handing off, check the design contract for unresolved filler text, internal contradictions, scope creep, and ambiguity. Fix inline. If a fundamental issue is found (scope needs decomposition, approach contradicts goal), go back to the relevant step instead of patching inline.
17. **Depth-based handoff** (Depth A/B only):
    - **Depth A**: **STOP — Confirm spec** → hand off to `devflow-spec` to land `docs/specs/YYYY-MM-DD-<short-kebab-name>.md` (confirmation 2 of 3). After spec, hand off to `/devflow-plan` (confirmation 3 of 3).
    - **Depth B**: **STOP — Confirm plan** → hand off to `/devflow-plan` to create a Plan Pack (confirmation 2 of 2).
    - Recommend one based on project size and cross-module impact, but let the user decide. Wait for their response.

The terminal state depends on the path taken:
- **Fast Exit**: `devflow-cut` → `devflow-build` → `devflow-prove` (no spec/plan documents)
- **Depth A**: `devflow-spec` → `/devflow-plan` → `devflow-cut` → `devflow-build` → `devflow-prove`
- **Depth B**: `/devflow-plan` → `devflow-cut` → `devflow-build` → `devflow-prove`
- **Depth C**: `devflow-cut` → `devflow-build` → `devflow-prove`

Do NOT hand off to `devflow-build` or any other implementation skill directly.

## Semantic Echo-Back

Before any process question (depth A/B/C, spec, plan), confirm you understood what the user actually wants. This is the first user-facing interaction and doubles as the first clarification question — it does not add a round trip.

The echo-back is not a paraphrase — it is an understanding check. Paraphrasing repeats the user's words; understanding means you can name what you are unsure about and what assumptions you are making.

```text
My understanding:
- Problem to solve: <one sentence, in the user's domain language>
- Known facts/constraints: <read from code, docs, commits>
- NOT what you want: <the misreading being ruled out>
- My assumptions (that could be wrong): <what you inferred that the user did not say>
- Understanding gaps: <what you are unsure about — vague terms, implicit scope, missing context>
Is this right? (correct me / confirm)
```

Scale it: 1-2 lines for a clear small request, the full shape when the request is ambiguous. For a truly trivial request, `My assumptions` and `Understanding gaps` may be `none` — but you must still check and state that explicitly, not skip the fields.

Rules:

- If the request allows two or more plausible interpretations, do not guess — make the echo-back a multiple-choice between the interpretations and wait for the user's pick.
- Facts read from the codebase are stated, not asked. Business intent is confirmed, not inferred.
- Only after the user confirms or corrects the understanding do you check the Small Request Boundary and present the Depth Selection Gate.
- `My assumptions` must surface inferences the LLM made that the user did not explicitly state — this is where most misreadings originate.
- `Understanding gaps` must name specific unclear points, not generic "I might be wrong". If you genuinely have no gaps, state `none` and move on.

### Echo-Back Examples

Good echo-back (surfaces assumptions and gaps):

```text
User: "给搜索加个高亮"
My understanding:
- Problem: 在搜索结果中高亮匹配的关键词
- Known facts: 当前搜索在 SearchResults.tsx, 使用 fuse.js 做模糊匹配
- NOT what you want: 不是整行背景色变化, 不是搜索框输入高亮
- My assumptions: "高亮" = 标记匹配文本(如黄色背景); 这是给用户端, 不是管理后台
- Understanding gaps: 不确定是前端渲染高亮还是搜索API返回高亮位置数据
Is this right?
```

Bad echo-back (paraphrase, no understanding):

```text
User: "给搜索加个高亮"
My understanding:
- Problem: 给搜索加高亮功能
Is this right?
```

The bad version adds zero understanding — it repeats the request. The good version shows the LLM read the code, made assumptions visible, and named a specific gap.

### User Language Calibration

Match the user's communication level and terminology:

- Detect the user's technical level from their request vocabulary and prior messages.
- Use their terminology: if they say "页面", do not say "component render"; if they say "接口", do not say "REST endpoint" unless they used that term.
- If the user uses business terms, echo in business terms. If technical, echo technical.
- Never introduce terms the user did not use unless necessary for precision. When you must, flag the introduction: "I'll call this 'X' — is that the right term?"
- If the user's language is ambiguous (e.g., "那个东西", "之前的那个"), ask for the concrete referent before proceeding.

### Understanding Revision Rule

Understanding is iterative, not linear. If a user's answer to a clarification question reveals that your echo-back understanding was partially wrong:

1. Stop the current question chain.
2. Re-echo the corrected understanding with updated `My assumptions` and `Understanding gaps`.
3. Wait for the user to confirm the correction before continuing to the next question.

Do not silently update your mental model and continue — the user needs to see the corrected understanding. A silent correction is the same as no echo-back.

### Ambiguity Detection Patterns

Before writing the echo-back, scan the user's request for these ambiguity patterns. If any match, the echo-back must address them:

| Pattern | Signal | Action |
|---|---|---|
| Vague quantifier | "some", "better", "faster", "more", "优化" | Ask for a concrete target: "faster" = <100ms? <1s? |
| Implicit scope | "add search", "加个搜索" | Ask: search what? where? full-text or keyword? |
| Pronoun reference | "it should also...", "它也要..." | Ask: what is "it"? Name the referent. |
| Missing actor | "should notify", "需要通知" | Ask: notify whom? user? admin? system? |
| Unstated constraint | "make it fast", "弄快一点" | Ask: fast = what metric? what threshold? |
| Solution-as-goal | "add Redis cache", "加个Redis" | Ask: is the goal "faster response" or "use Redis specifically"? |
| Missing context | "like before", "跟之前一样" | Ask: which "before"? which feature/version? |
| Ambiguous boundary | "and related stuff", "相关的也改下" | Ask: what counts as "related"? list candidates. |

If none of these patterns match and the request is clear, state `Understanding gaps: none` and proceed.

[CRITICAL] Hard constraints:

- The echo-back MUST be its own message, ending with an explicit confirm-or-correct question. Stating your understanding and moving on within the same message is a violation.
- Never combine the echo-back with any other question — one question per message applies here too.
- No user confirmation means no progress: do not check the Small Request Boundary, present the Depth Selection Gate, or ask any clarification question until the user responds.
- The echo-back never replaces the Path Selection Gate — after confirmation, the path options (Fast Exit + A/B/C, or A/B/C only) are presented and the user chooses.
- `My assumptions` and `Understanding gaps` are not optional fields — they must be present (even if `none`) to prove the LLM checked for hidden assumptions.

## Core Questions

Ask the smallest missing question, one at a time:

```text
Goal: Who is this for, and what problem is solved?
Motivation: Why now? What triggered this need? (ask if not inferable from context)
Constraints: What cannot move?
Acceptance: What visible proof means this worked?
```

`Motivation` prevents building the right thing for the wrong reason. A user who says "add search" might need it because of a customer complaint (do it well), a demo next week (do it fast), or a competitor has it (do it matching). The motivation shapes the design.

If one answer is missing but can be inferred from project facts, state the inference and evidence. If it is a business decision, **ask the user and wait** — do not infer.

## Interview Discipline

For any non-trivial Brainstorm pass:

1. Read `skills/devflow-brainstorm/references/interview-discipline.md`.
2. Use Brainstorm's one-question-at-a-time interview discipline.
3. Include a recommended answer with each question.
4. If code, docs, config, or tests can answer the question, read those facts instead of asking.
5. When documentation capture is requested or needed, choose the right DevFlow docs surface: `devflow-spec` for saved requirements, ADR for hard-to-reverse trade-offs.
6. End with the normal DevFlow design contract and hand off to `devflow-cut`, `devflow-spec`, or the user.

This is core `devflow-brainstorm` behavior, not a separate workflow.

### Question Rules

- **One question per message.** If a topic needs more exploration, break it into multiple questions.
- **Prefer multiple choice** when possible — easier for the user to answer than open-ended.
- **Wait for the user's response** before continuing to the next step.
- **Only infer from facts** when the question is purely technical and evidence is unambiguous.
- **Never infer business decisions** — always ask the user.

## Progressive Question Output

While clarifying, each message uses this shape:

```text
Question: <one question>
Recommended answer: <answer and rationale>
Why now: <dependency or risk this resolves>
```

Scale the question to the work. For Design-lite, a single question-answer pair may suffice. For full Design, walk the dependency tree: do not ask a downstream question before the upstream decision is resolved.

### Question Priority

Ask questions in this priority order. Resolve level N before asking level N+1:

| Priority | Question type | When to ask | Example |
|---|---|---|---|
| 1 | Goal ambiguity | When the goal itself could mean two different things | "By 'search' do you mean full-text search or field filtering?" |
| 2 | Scope boundary | When scope could explode or shrink | "Should this cover archived items or only active ones?" |
| 3 | Actor/recipient | When the subject or object is missing | "Who receives the notification — the admin or the end user?" |
| 4 | Constraint | When constraints affect the approach choice | "Must this work offline, or is online-only acceptable?" |
| 5 | Acceptance | When success criteria are vague | "What would you see that proves this works?" |
| 6 | Implementation detail | Only after 1-5 are resolved | "Prefer Redis or in-memory cache?" |

Do not ask an implementation question (priority 6) before goal, scope, actor, constraint, and acceptance are resolved. An implementation question asked too early locks in a path before the goal is clear.

## Design Section Output

After approach comparison, present the design in small sections. Each section uses this shape:

```text
Section: <section name>
Proposed decision: <what this section decides>
Key tradeoff: <what was considered and why this choice>
Confirm? <wait for user response>
```

Default sections (scale to the work — skip sections that do not apply):

1. **Scope and goals**: what changes, what stays, what the user sees.
2. **Interaction or implementation design**: the approach, key files, and behavior.
3. **Error handling and verification**: failure modes, edge cases, and proof.

For Design-lite, a single section may cover all three. For full Design, present each separately and wait for confirmation.

## Visual Expression Principle

Use visual expression only when a specific question or design section is genuinely clearer as a mockup, diagram, layout, or visual comparison. Keep conceptual questions, tradeoff lists, and approach comparisons in text.

- **When visual helps**: layout decisions, UI flow, architecture diagrams, data flow, component relationships.
- **When text suffices**: goal framing, constraint listing, approach tradeoffs, acceptance criteria, configuration.

## Re-Ask After Challenge

When `devflow-pua` hands off after user challenge, changed-wrong result, repeated missing-piece feedback, or repeated miss:

1. Restate the current understanding of the user's goal.
2. Treat the prior approach as failure evidence only; do not reuse the old plan, target, or proof claim unless the user or fresh facts explicitly confirm it.
3. Name what was likely misread: target, artifact, behavior, UI distinction, file placement, or proof.
4. Carry forward the compact methodology line `METHOD: {flavor} / {method}`, any `SWITCH:` line, `User-view miss`, `Satisfaction gap`, and `New success contract` from `devflow-pua`.
5. Ask where the result is wrong, what result is wanted, what must stay unchanged, and what proof would count as corrected when those answers cannot be inferred from facts.
6. If the user repeatedly says pieces are missing, build a Coverage Map of required surfaces before proposing changes.
7. If the prior guiding method failed, use the switched different/opposite method from `devflow-pua` and do not propose another variation of the old method.
8. Compare a corrected direct approach with at least one materially different approach or no-change/reuse option.

Question shapes:

```text
What exact result should the user see?
What is wrong with the current output?
What is missing or incomplete?
Which expected surface is missing: file, command, skill, docs, install sync, UI, backend behavior, or proof?
What must stay unchanged?
What proof would count as corrected?
```

Do not keep the previous plan unless facts prove it still matches the user's desired result. Do not treat repeated "missing this/missing that" or "少了这个/少个那个" as normal incremental scope until `devflow-pua` has classified whether it is a coverage gap or a new requirement.

## Small Request Boundary

Design-lite is allowed only when all four gates pass:

- Impact: one local behavior, file, setting, doc section, or display field.
- Risk: no auth, money, permissions, data migration, deletion, external API contract, release flow, or security boundary.
- Uncertainty: goal, expected behavior, and acceptance proof are already clear.
- Proof: a narrow command, search check, focused test, or manual scenario can verify it quickly.

**Design-lite shortens the design, not the dialogue.** Even when all gates pass, you MUST still confirm the goal and acceptance criteria with the user before producing the design contract. If the gates pass and only one implementation path is plausible, do not force 2-3 approaches. Output:

```text
Small Boundary: impact <small>; risk <small>; uncertainty <small>; proof <quick>
```

If the gates do not decide the route, ask the user to choose Fast, Design-lite, or full Design. Route Choice Needed: present the options and wait.

## Fast Exit Path

Fast Exit is a **user-chosen** path, not an LLM auto-decision. When the conditions below are met, Fast Exit is presented as a **recommended option** at the Path Selection Gate, but the user must explicitly choose it.

**All conditions required to offer Fast Exit**:
1. All four Small Request Boundary gates pass (low impact, low risk, clear, quick proof).
2. The task is a change to an **existing feature** (not a new requirement, not a new feature, not an architecture change).
3. Only **one plausible implementation path** exists after reading facts.
4. No cross-module impact, no API contract change, no data migration, no security boundary.
5. The user has not explicitly requested a spec or plan document.

When all conditions are met, present at the Path Selection Gate:

```text
📋 Select path for this task:

Fast Exit (recommended): all boundary gates pass; existing feature; single path.
   → Short design contract → devflow-cut → devflow-build
   → 1 confirmation: design contract
   → No spec/plan document

Full A/B/C: spec/plan documents with depth selection.
   → A/B/C depth → progressive clarification → design contract → spec/plan → devflow-cut
   → 2-3 confirmations depending on depth

Select: Fast Exit / Full A/B/C
```

**When the user chooses Fast Exit**: present a short design contract (Goal, Smallest useful plan, Not doing, Impact, Verification), get user approval, and hand off directly to `devflow-cut`.

**When the user chooses Full A/B/C**: proceed to the Depth Selection Gate (A/B/C) as normal.

**When any condition fails**: Fast Exit is not offered. Proceed directly to the Depth Selection Gate (A/B/C).

**Prohibited**: Auto-selecting Fast Exit without user confirmation. Using Fast Exit for new features, architecture changes, cross-module impact, multi-solution decisions, or when the user explicitly asked for a spec/plan document.

## Depth Selection Gate

[CRITICAL] **The LLM must not decide to skip any stage or document. Path and depth are chosen by the user, not asserted by the LLM.**

The Path Selection Gate (step 5) always presents options to the user:
- When Fast Exit conditions are met: present both Fast Exit (recommended) and Full A/B/C. User chooses.
- When Fast Exit conditions are NOT met: present A/B/C depth options only.

If the user chose Full A/B/C (or Fast Exit conditions were not met), present the depth options and **wait for their choice before continuing**:

```text
📋 Enter design flow. Select design depth for this task:

A. Full Spec (recommended for cross-module / new feature / architecture change)
   → Design Contract → devflow-spec → /devflow-plan → devflow-cut → devflow-build
   → 3 confirmations: design contract, spec doc, plan

B. Simplified Spec (for clear-scope changes)
   → Design Contract → /devflow-plan → devflow-cut → devflow-build
   → 2 confirmations: design contract, plan

C. Direct (only for single-file / low-risk / user-explicit)
   → devflow-cut → devflow-build
   → 0 additional confirmations: echo-back already confirmed
   → No spec document, no core clarification questions, no design contract STOP gate

Select A / B / C:
```

**Selection constraints** (based on Small Request Boundary gates):

| Boundary Result | Allowed Depths |
|----------------|----------------|
| All 4 gates pass (low impact, low risk, clear, quick proof) | A / B / C |
| 1-2 gates fail (moderate complexity or risk) | A / B |
| 3+ gates fail or new feature / architecture change | A only |
| New feature or architecture change | A only (C not allowed) |

**Additional constraints**:
- User selects C: no additional confirmation needed. The echo-back was already confirmed and the user's choice of C is the approval. Hand off directly to `devflow-cut`.

[CRITICAL] **Prohibited behaviors**:
- LLM self-decides "low risk, skip design"
- LLM says "nearly zero risk, start coding"
- LLM proceeds without presenting depth options
- LLM uses "simple / zero-risk / trivial" language to steer user toward C

### Depth Flow Table

| User Choice | Flow Path | Confirmations |
|----------|---------|---------|
| **A. Full Spec** | Design Contract → devflow-spec → /devflow-plan | 3 |
| **B. Simplified Spec** | Design Contract → /devflow-plan | 2 |
| **C. Direct** | devflow-cut | 0 (echo-back only) |

## Large Project Decomposition

If the request describes multiple independent subsystems (e.g., "build a platform with chat, file storage, billing, and analytics"), flag this immediately. Do not spend questions refining details of a project that needs to be decomposed first.

Help the user decompose into sub-projects: what are the independent pieces, how do they relate, what order should they be built? Then brainstorm the first sub-project through the normal design flow. Each sub-project gets its own design → cut → build cycle.

## Working in Existing Codebases

- Explore the current structure before proposing changes. Follow existing patterns.
- Where existing code has problems that affect the work (e.g., a file that's grown too large, unclear boundaries, tangled responsibilities), include targeted improvements as part of the design.
- Do not propose unrelated refactoring. Stay focused on what serves the current goal.

## Approach Comparison

Each option must include:

- what it does
- what it does not do
- tradeoff
- impact size
- verification

Use this shape:

```text
Approach comparison:
- A: does / does not do / tradeoff / verification
- B: does / does not do / tradeoff / verification
- C: does / does not do / tradeoff / verification (optional)
Recommendation: <one option>, because <reason>
```

## Method Lens

For Design work that would otherwise feel generic, choose one primary lens and at most one secondary lens:

- Root Cause: bug, regression, failing proof, repeated symptom.
- Working Backwards: product, UX, API, workflow, or ambiguous value.
- First Principles Cut (第一性原理): problem solving, bug fixes, scope, dependency, abstraction, or architecture pressure; reduce the request to facts, constraints, invariants, and the smallest necessary mechanism before proposing a solution.
- Data/Proof: metrics, validation, benchmark, release, or verifier-sensitive work.
- Operational Owner: cross-file, cross-agent, install, release, or handoff work.

Output:

```text
Method Lens: primary <lens>; secondary <lens/none>; why <risk or decision it handles>
```

Do not import PUA flavor, pressure rhetoric, or default full spec-heavy process to use a lens.

## Required Design Contract

```text
Goal: what to solve
Motivation: why now, what triggered this need
Smallest useful plan: why this is the smallest useful solution now
Not doing: what is explicitly cut
Impact: modules/files/behavior involved
Verification: command or scenario that proves it
```

## Design Contract Self-Review

Before handing off, review the design contract with fresh eyes:

1. **Completion-marker scan**: Any unresolved marker text, incomplete sections, or vague requirements? Fix them.
2. **Internal consistency**: Do any parts contradict each other? Does the approach match the stated goal?
3. **Scope check**: Is this focused enough for a single implementation, or does it need decomposition?
4. **Ambiguity check**: Could any requirement be interpreted two different ways? If so, pick one and make it explicit.

Fix any issues inline. No need to re-review — just fix and move on.

## Depth-Based Handoff

After the design contract is approved and self-reviewed, proceed based on the path the user chose at the Path Selection Gate. The path was already chosen — do not re-ask. Do not hand off directly to `devflow-build`.

### Fast Exit (1 confirmation, user-chosen)

When the user chose Fast Exit at the Path Selection Gate, the design contract is the only confirmation. No spec or plan document is landed. Hand off directly to `devflow-cut`:

```text
Cut input: approved design + not-doing list + impact scope + verification method
Next: devflow-cut -> devflow-build
```

### Depth A: Full Spec (3 confirmations)

Design contract approved (confirmation 1) → hand off to `devflow-spec`:

```text
Spec input: approved design + not-doing list + impact scope + acceptance/verification
Default landing: docs/specs/YYYY-MM-DD-<short-kebab-name>.md
Next: devflow-spec (confirm 2) -> /devflow-plan (confirm 3) -> devflow-cut -> devflow-build
```

Recommend Depth A when:
- The user asks for specs, a design doc, or a requirements document.
- Requirements cross modules, APIs, persistence, release flow, or user-visible workflows.
- A future plan needs to map tasks back to stable requirements.

### Depth B: Simplified Spec (2 confirmations)

Design contract approved (confirmation 1) → hand off to `/devflow-plan`:

```text
Plan input: approved design + not-doing list + impact scope + verification method
Default landing: docs/plans/YYYY-MM-DD-<short-kebab-name>.md
Next: /devflow-plan (confirm 2) -> devflow-cut -> devflow-build
```

Recommend Depth B when:
- Impact is local, risk is low, and a short design contract is enough.
- The user wants to move fast and the design contract captures all needed context.

### Depth C: Direct (0 additional confirmations)

User chose C at the Depth Selection Gate. Echo-back was already confirmed. Produce a minimal design contract inline from the echo-back (Goal, Not doing, Impact, Verification) and hand off directly to `devflow-cut`. No STOP gate, no progressive clarification, no approach comparison. The user's choice of C is the approval.

```text
Cut input: minimal design contract from echo-back (Goal / Not doing / Impact / Verification)
Next: devflow-cut -> devflow-build
```

**Depth C constraint**: The user must have explicitly chosen C at the Depth Selection Gate. The LLM must not auto-select C.

The design must be user-approved, and the depth must be user-selected at the Depth Selection Gate, before any handoff.

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The user already gave a solution." | A proposed solution is not the goal. Check the goal. |
| "The request is clear, skip the echo-back." | Semantic misreading is the top source of changed-wrong results. A one-line echo-back costs far less than a rebuild. |
| "Only one approach is obvious." | Compare at least a direct option and a reuse/no-change option. |
| "Questions slow us down." | One precise question prevents the wrong build. |
| "We can decide scope during coding." | Scope belongs in the design contract before Build. |
| "This is too simple to need a design." | Simple requests are where assumptions hide. Present a short design and get approval. |
| "This is documentation/config work, it doesn't need Brainstorm." | Correct — documentation writing, config tuning, and trivial changes should be routed to Fast or Design-lite by `devflow-core`. If the task reached Brainstorm, verify the route was correct before proceeding. |
| "I can infer the goal from code." | If it involves a business decision, ask the user. Code tells you what exists, not what the user wants. |
| "This is low risk, skip the depth gate." | Path and depth are chosen by the user, not asserted by the LLM. Present the options and let the user decide. |
| "Every task that enters Brainstorm needs A/B/C." | No — when Fast Exit conditions are met, Fast Exit is offered as a recommended option alongside A/B/C. The user chooses. |
| "Fast Exit means no design needed." | Fast Exit still requires echo-back, boundary check, and a short design contract with user approval. It only skips spec/plan documents and the A/B/C ceremony. |
| "I'll auto-select Fast Exit since conditions are met." | No — Fast Exit is always user-chosen. The LLM recommends it but the user must confirm. Auto-selecting Fast Exit is the same as skipping the gate. |
| "I'll present A/B/C just to be safe." | When Fast Exit conditions are met, present both options and let the user choose. Don't withhold the lighter path. |
| "Depth C means no design needed." | Depth C goes directly to `devflow-cut` with a minimal inline design contract from the echo-back. No progressive clarification, no STOP gate. The user's choice of C is the approval. |
| "I can present all design sections at once." | Progressive confirmation prevents scope drift. Present one section, wait, then continue. |
| "The echo-back is just restating the request." | Echo-back must surface `My assumptions` and `Understanding gaps`. A paraphrase adds zero understanding. |
| "I can infer the motivation from the codebase." | Code tells you what exists, not why the user wants a change now. If motivation is unclear, ask. |
| "Implementation questions can come first." | Goal, scope, actor, constraint, and acceptance must be resolved before asking implementation questions. |
| "I understood correctly, no need to re-echo." | If a user's answer reveals your understanding was wrong, re-echo the correction before continuing. |
| "The user used a vague term, I'll just pick the most common meaning." | Vague terms (some, better, faster, related) require a clarifying question, not a guess. Use the Ambiguity Detection Patterns table. |

## Red Flags — STOP

- Entering Brainstorm for documentation writing, config tuning, or trivial code changes that should be Fast or Design-lite
- About to write code before presenting a design contract (Depth A/B and Fast Exit only; Depth C produces a minimal inline design contract without a STOP gate)
- "This is too simple to need a design"
- "The user already described the solution, so I can skip dialogue"
- "I can infer the business decision from the codebase"
- Combining multiple clarifying questions into one message
- Proceeding past a STOP gate without user response
- Handing off directly to `devflow-build` instead of `devflow-spec`, `/devflow-plan`, or `devflow-cut`
- Asking process questions (depth A/B/C, spec, plan) before the user has confirmed your understanding of the request
- Proceeding without presenting the Path Selection Gate (Fast Exit + A/B/C, or A/B/C only)
- LLM self-deciding path or depth instead of letting the user choose
- Auto-selecting Fast Exit without user confirmation
- Entering Brainstorm for tasks with no code development or behavior change (pure Q&A, consultation, opinion)
- Presenting all design sections without waiting for per-section confirmation
- Echo-back that paraphrases the request without surfacing assumptions or gaps
- Asking implementation questions before goal/scope/actor/constraint/acceptance are resolved
- Silently updating your understanding after a user correction without re-echoing
- Using technical jargon the user did not use without flagging the introduction

**All of these mean: stop and return to the design dialogue.**

## Quality Bar

- Keep the design short for low-risk work.
- Do not invent future features.
- **One question at a time.** Do not overwhelm with multiple questions in a single message.
- **Wait for user response** at every STOP point before continuing.
- After a user challenge, do not continue with the old approach unless the goal and desired result are now proven.
- Mark high-risk or irreversible decisions and require explicit approval.
- If the user asked to implement, continue based on user-chosen path: Fast Exit → `devflow-cut`, A → `devflow-spec` → `/devflow-plan`, B → `/devflow-plan`, C → `devflow-cut`.

## Verification

Before leaving this skill, confirm:

- [ ] Facts were read or unknowns were named.
- [ ] Goal was framed before checking Small Request Boundary.
- [ ] Understanding was echoed back and confirmed by the user before the Depth Selection Gate (disambiguation first when multiple interpretations existed).
- [ ] Echo-back included `My assumptions` and `Understanding gaps` (not just a paraphrase).
- [ ] Ambiguity Detection Patterns were checked before writing the echo-back.
- [ ] Small Request Boundary was checked for tiny requirement or feature work.
- [ ] Fast Exit conditions were checked: if all pass, present Fast Exit as recommended option alongside A/B/C at the Path Selection Gate.
- [ ] Path Selection Gate was presented: user chose Fast Exit or A/B/C. If A/B/C, user selected A, B, or C.
- [ ] Goal, motivation, constraints, and success criteria exist — confirmed with the user when unclear, not just inferred. (Depth A/B only; C skips this.)
- [ ] Clarifying questions were asked one at a time, in priority order (goal → scope → actor → constraint → acceptance → implementation). (Depth A/B only; C skips this.)
- [ ] If a user's answer revealed a misunderstanding, the corrected understanding was re-echoed before continuing. (Depth A/B only; C skips this.)
- [ ] 2-3 approaches were compared when plausible, or Design-lite was justified by the boundary gates. (Depth A/B only; C skips this.)
- [ ] First principles (第一性原理) were applied when assumptions, abstractions, bug causes, or architecture choices could hide a smaller solution.
- [ ] Method Lens was selected or explicitly marked unnecessary, before convergence.
- [ ] Design was presented in sections with per-section confirmation. (Depth A/B only; C skips this.)
- [ ] Recommended option is the smallest useful path.
- [ ] Design contract was presented and user approved it. (Depth A/B only; C produces a minimal inline design contract without a STOP gate.)
- [ ] Design contract self-review was run (Depth A/B only): no unresolved filler text, contradictions, or ambiguity.
- [ ] Path-based handoff was executed correctly:
  - Fast Exit (user-chosen): devflow-cut (1 confirmation: design contract)
  - A: devflow-spec → /devflow-plan (3 confirmations)
  - B: /devflow-plan (2 confirmations)
  - C: devflow-cut (0 additional confirmations; echo-back only)
- [ ] Design contract is complete.
