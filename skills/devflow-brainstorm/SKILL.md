---
name: devflow-brainstorm
description: "Use when a request is unclear, a requirement or feature idea appears, behavior/product/architecture may change, assumptions need challenging, 2-3 approaches are needed, implementation should be shaped before coding, or a user challenge requires re-asking the goal/result before rebuilding."
---

# DevFlow Brainstorm

Turn a request into the smallest useful design before implementation.

## Process

1. **Read facts first**: inspect relevant files, docs, configs, tests, existing behavior, and patterns.
2. **Check the Small Request Boundary**: decide whether this is Design-lite, full Design, or needs user route choice.
3. **Frame the goal** as a one-sentence problem statement.
4. **Clarify constraints**: compatibility, security, data, UX, performance, platform, time.
5. **Define success criteria** the user or agent can verify.
6. **Challenge hidden assumptions**:
   - Does this need to exist?
   - Is the user asking for an implementation when a smaller outcome works?
   - What current system behavior may already satisfy the goal?
   - What would make this design unacceptable?
7. **Diverge** with 2-3 genuinely different approaches unless Design-lite applies.
8. **Converge** with a recommendation and a Not Doing list.
9. **Apply a Method Lens** when the design, risk, or ambiguity needs a specific working strategy.
10. **Produce the design contract** below.
11. If the user asks for a spec, or the work is too large for a short design contract, hand off to `devflow-spec`.
12. Otherwise hand off to `devflow-cut`.

## Core Questions

Answer or ask the smallest missing question:

```text
Goal: Who is this for, and what problem is solved?
Constraints: What cannot move?
Acceptance: What visible proof means this worked?
```

If one answer is missing but can be inferred from project facts, state the inference and evidence. If it is a business decision, ask.

## Re-Ask After Challenge

When `devflow-pua` hands off after user challenge, changed-wrong result, repeated missing-piece feedback, or repeated miss:

1. Restate the current understanding of the user's goal.
2. Treat the prior approach as failure evidence only; do not reuse the old plan, target, or proof claim unless the user or fresh facts explicitly confirm it.
3. Name what was likely misread: target, artifact, behavior, UI distinction, file placement, or proof.
4. Carry forward the compact methodology line `🟠 {味道} 方法论：{方法}`, any `切换：` line, `User-view miss`, `Satisfaction gap`, and `New success contract` from `devflow-pua`.
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

Do not ask vague batches. Do not keep the previous plan unless facts prove it still matches the user's desired result. Do not treat repeated "missing this/missing that" or "少了这个/少个那个" as normal incremental scope until `devflow-pua` has classified whether it is a coverage gap or a new requirement.

## Small Request Boundary

Design-lite is allowed only when all four gates pass:

- Impact: one local behavior, file, setting, doc section, or display field.
- Risk: no auth, money, permissions, data migration, deletion, external API contract, release flow, or security boundary.
- Uncertainty: goal, expected behavior, and acceptance proof are already clear.
- Proof: a narrow command, search check, focused test, or manual scenario can verify it quickly.

If these gates pass and only one implementation path is plausible, do not force 2-3 approaches. Output:

```text
Small Boundary: impact <small>; risk <small>; uncertainty <small>; proof <quick>
```

If the gates do not decide the route, ask the user to choose Fast, Design-lite, or full Design.

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
- First Principles Cut: scope, dependency, abstraction, or architecture pressure.
- Data/Proof: metrics, validation, benchmark, release, or verifier-sensitive work.
- Operational Owner: cross-file, cross-agent, install, release, or handoff work.

Output:

```text
Method Lens: primary <lens>; secondary <lens/none>; why <risk or decision it handles>
```

Do not import PUA flavor, pressure rhetoric, or default full OpenSpec to use a lens.

## Required Design Contract

```text
Goal: what to solve
Smallest useful plan: why this is the smallest useful solution now
Not doing: what is explicitly cut
Impact: modules/files/behavior involved
Verification: command or scenario that proves it
```

## Spec Handoff

Use `devflow-spec` before planning when the request needs a written source of truth:

- The user asks for specs, a design doc, or a requirements document.
- Requirements cross modules, APIs, persistence, release flow, or user-visible workflows.
- A future plan needs to map tasks back to stable requirements.

Do not force a saved spec for Design-lite work. A short design contract is enough when impact, risk, uncertainty, and proof are all small.

Handoff shape:

```text
Spec input: approved design + not-doing list + impact scope + acceptance/verification
Default landing: docs/specs/<short-kebab-name>.md
Next: devflow-spec -> devflow-plan
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "The user already gave a solution." | A proposed solution is not the goal. Check the goal. |
| "Only one approach is obvious." | Compare at least a direct option and a reuse/no-change option. |
| "Questions slow us down." | One precise question prevents the wrong build. |
| "We can decide scope during coding." | Scope belongs in the design contract before Build. |

## Quality Bar

- Keep the design short for low-risk work.
- Do not invent future features.
- Do not ask many vague questions at once.
- After a user challenge, do not continue with the old approach unless the goal and desired result are now proven.
- Mark high-risk or irreversible decisions and require explicit approval.
- If the user asked to implement, continue to `devflow-cut` after shaping.

## Handoff Gate

Do not hand off directly to Build. Handoff to `devflow-cut` with:

```text
Cut input: recommendation + Not doing list + impact scope + verification method
```

## Verification

Before leaving this skill, confirm:

- [ ] Facts were read or unknowns were named.
- [ ] Small Request Boundary was checked for tiny requirement or feature work.
- [ ] Goal, constraints, and success criteria exist.
- [ ] 2-3 approaches were compared when plausible, or Design-lite was justified by the boundary gates.
- [ ] Method Lens was selected or explicitly marked unnecessary.
- [ ] Recommended option is the smallest useful path.
- [ ] Spec need was decided: `devflow-spec` for larger/spec-requested work, or design contract only for Design-lite.
- [ ] Design contract is complete.
