---
name: devflow-core
description: "Use when starting coding work, routing a request, choosing Problem/Fast/Design/Build/Recovery, investigating issues, handling requirements or bugs, applying Sense/Brainstorm/Cut/Shape/Build/Prove, implementing, fixing, debugging, reviewing plans, validating completion, handling user challenge or quality complaint recovery, or deciding which devflow skill should handle the task."
---

# DevFlow Core

Use the smallest reliable method set that fits the task.

## Activation Evidence

At the start of non-trivial work, record:

```text
Skill Activation: devflow-core
Trigger: <user words or task shape>
Route: Fast / Design-lite / Design / Build / Recovery
Next skill: <skill name>
```

This prevents "mentioned the skill" from pretending to be "used the skill".

## Context Map

Before deciding, read the narrowest useful project facts:

1. Rules: `AGENTS.md`, `CLAUDE.md`, `.github/*`, `.codebuddy/*` when present.
2. Framework source: `skills/devflow-core/references/core-methods.md` for method/rule/skill questions.
3. Current code, generated plan docs, config, tests, and references relevant to the task.
4. Existing helpers, patterns, commands, and installed dependencies.
5. Feature ledger: when present for an existing target-project capability, read the matched `docs/features/*.md` ledger before planning; if no ledger exists, mark it missing.
6. Project memory: `.copilot/LEARNING_INDEX.md` if present.
7. Maps: `graphify-out/GRAPH_REPORT.md` for architecture/impact questions when present.

Output:

```text
Facts: read/confirmed <files or commands>
Unknowns: <none or specific unknown>
```

Do not claim understanding without facts.

## Routes

| Route | Use when | Do |
|---|---|---|
| Fast | Pure Q&A, fact lookup, verification, or approved tiny execution with clear goal, low risk, local impact, and quick proof. | Sense -> Prove |
| Problem | User reports "something is wrong" or asks to inspect without asking for a fix. | Sense -> Prove facts; re-route only after the needed change is known |
| Design-lite | Small feature with clear behavior, one plausible path, low risk, local impact, and quick proof. | Short goal -> acceptance -> not-doing -> Cut -> Build/Prove if requested |
| Design | Requirement, behavior change, feature, architecture change, ambiguity, multi-solution decision, or unclear small-feature boundary. | Sense -> Brainstorm -> Cut -> Shape |
| Build | User asks to implement, fix, land, or execute an approved change. | Sense -> Brainstorm -> Cut -> Shape -> Build -> Prove |
| Recovery | Repeated failure, user correction, user challenge, missing-piece complaint, repeated "少了这个/少个那个" feedback, quality complaint, changed-wrong result, unexpected verification failure, or giving-up impulse. | Load `devflow-pua` when pressure recovery is needed; diagnose user-view miss -> re-read facts -> 3 hypotheses -> different/opposite method -> changed approach -> Prove |

If the user asks to implement, build, fix, or land a change, do not stop at Shape. Continue through Build and Prove.

After two corrected or failed attempts in one task lifecycle, stop editing and use `devflow-pua` to re-ask the goal/result unless the answer is directly inferable from facts.

## Small Request Boundary

Fast is allowed only when impact, risk, uncertainty, and proof are all small:

- Impact: one local behavior, file, setting, doc section, or display field.
- Risk: no auth, money, permissions, data migration, deletion, external API contract, release flow, or security boundary.
- Uncertainty: goal, expected behavior, and acceptance proof are already clear.
- Proof: a narrow command, search check, focused test, or manual scenario can verify it quickly.

A small feature is still a requirement. Use Design-lite only when it passes the same four gates and has one plausible implementation path after facts are read. If any gate is uncertain, ask the user to choose Fast, Design-lite, or full Design.

## Issue Triage

Before routing, classify the incoming work:

| Incoming word shape | Treat as | Skill path |
|---|---|---|
| "problem report", "check what is wrong", "why broken", "investigate" | Problem investigation | `devflow-core -> devflow-prove` for facts; if a change is needed, re-route to Design or Build. |
| "requirement", "feature request", "add support", "implement" | Requirement | `devflow-core -> devflow-brainstorm -> devflow-cut`, or Design-lite when the Small Request Boundary passes; continue to Build only when implementation is requested. |
| "bug report", "error", "failing test", "fix bug", "broken" | Bug fix | `devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove`, with Root-Cause Check before editing. |
| "wrong", "not like that", "changed wrong", "your code is wrong", "you wrote it wrong", "has a problem", "not right", "missing", "incomplete", "still missing", "quality complaint", "user dissatisfied", "有问题", "不对", "写错了", "改歪了", "没改对", "不是我要的", "理解错了", "改了几次", "少了", "少个", "缺少", "缺漏", "遗漏", "漏了" | Pressure recovery | `devflow-core -> devflow-pua -> devflow-brainstorm`; quarantine prior wrong assumptions, diagnose user-view miss, ask what is wrong and what result is wanted, then switch method/approach before more edits. |

Problem investigation must not silently become implementation. First prove what is wrong, what is unknown, and whether a change is actually needed.

## Capability Dispatch

| Signal | Capability | Required next action |
|---|---|---|
| unclear ask, behavior change, multiple possible paths | Brainstorm First | Load `devflow-brainstorm`; require goal, constraints, success criteria, assumptions, 2-3 approaches. |
| unclear whether work is Fast, Design-lite, or full Design | Route Choice | Ask the user to choose the route; do not guess from line count or "sounds small". |
| Design, Recovery, or high-risk proof needs a task-specific working strategy | Method Lens | Pick Root Cause, Working Backwards, First Principles Cut, Data/Proof, or Operational Owner before selecting artifacts. |
| new code, dependency, abstraction, config, folder, framework layer | Minimal Solution Ladder + Anti-Overengineering Gate | Load `devflow-cut`; require Reuse, Native, Overbuild, Diff, Scope checks. |
| approved implementation | Surgical Build Discipline | Load `devflow-build`; require touched files, slices, diff self-check. |
| done/fixed/passed/ready claim | Proof Before Done | Load `devflow-prove`; require command/result/PASS-FAIL-BLOCKED. |
| problem report without explicit fix request | Issue Triage | Prove the symptom or absence of evidence first; do not edit until the needed change is clear. |
| bug report or failing verification | Root-Cause Fix Check | Load `devflow-cut`; search callers/references and choose shared vs narrow fix. |
| repeated failure or user correction | Recovery Switch | Re-read facts, list 3 hypotheses, pick a materially different approach, then Prove. |
| user challenge, changed wrong, explicit wrong-code signal, repeated miss, missing-piece complaint, repeated "少了这个/少个那个" feedback, quality complaint | Pressure Recovery Gate | Load `devflow-pua`; stop editing, quarantine previous wrong assumptions, diagnose user-view miss, restart `devflow-brainstorm`, ask what is wrong and what result is wanted when not inferable, switch to a different/opposite method when the prior method failed, then Prove. |
| reusable correction, repeated pitfall, project convention | Learning Capture | Load `devflow-learn`; update `.copilot/LEARNING_INDEX.md` and one focused card. |
| existing target-project capability iteration with a feature ledger | Feature Ledger Recall | When present, read the matched `docs/features/*.md` ledger before planning and update it after a validated capability change. |

## Required Route Outputs

Fast:

```text
Goal: ...
Facts: ...
Verification: ...
```

Design:

```text
Goal: ...
Method Lens: primary <lens>; secondary <lens/none>; why <risk or decision it handles>
Needs Brainstorm: yes
Needs Cut: yes
Implementation requested: yes/no
Next skill: devflow-brainstorm
```

Design-lite:

```text
Goal: ...
Small Boundary: impact <small>; risk <small>; uncertainty <small>; proof <quick>
Acceptance: ...
Not doing: ...
Needs Cut: yes
Next skill: devflow-cut
```

Route choice:

```text
Route Choice Needed:
- Fast: small factual/tiny execution; minimal design; quickest proof.
- Design-lite: small feature; short goal/acceptance/not-doing; then build if requested.
- Full Design: ambiguous or higher-risk feature; compare approaches before build.
```

Recovery:

```text
Failure/correction: ...
Pressure check: <none or user challenge / changed wrong / repeated miss>
Restart Brainstorm: <yes for repeated challenge or explicit wrong-code signal>
Discarded context: <old assumption/path/proof claim not reused>
Keep only verified facts: <facts retained>
User-view miss: <why the user would still say this is wrong or incomplete>
Satisfaction gap: <goal/artifact/behavior/coverage/proof/UX gap>
METHOD: {flavor} / {method}
SWITCH: <none or old flavor/method -> new flavor/method: reason>
Facts reread: ...
User goal restated: ...
Desired result: ...
Blocking questions: <none, inferred, or 2-4 pointed questions>
Method Lens: primary <lens>; secondary <lens/none>; why <risk or decision it handles>
Hypotheses: 1 / 2 / 3
Blue-team attack: ...
New success contract: ...
Changed approach: ...
Verification: ...
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This is too simple for the flow." | Small work gets a short flow, not no flow. |
| "I know the project." | Read the actual files; memory is not evidence. |
| "I'll verify later." | Later verification creates false completion now. |
| "The user asked to implement, so skip design." | Implementation requests still need the shortest useful design and cut gate. |
| "I used the skill because I named it." | Activation requires trigger, steps, artifact/check, and handoff. |

## Handoff

- Design route -> `devflow-brainstorm`
- Before adding structure -> `devflow-cut`
- Approved work -> `devflow-build`
- Before completion -> `devflow-prove`
- User challenge, explicit wrong-code signal, changed-wrong result, repeated miss, repeated "少了这个/少个那个" feedback, missing-piece complaint, or quality complaint -> `devflow-pua -> devflow-brainstorm`
- User correction or reusable pitfall -> `devflow-learn`

## Verification

Before leaving this skill, confirm:

- [ ] Route selected from task facts.
- [ ] Small Request Boundary used for any Fast or Design-lite classification.
- [ ] Relevant project facts were read or explicitly marked missing.
- [ ] Next skill is named.
- [ ] Design or completion output contract is preserved.

Completion still belongs to `devflow-prove`.
