---
name: devflow-core
description: "Use when starting coding work, routing a request, choosing Problem/Fast/Design/Build/Recovery, investigating issues, handling requirements or bugs, applying Sense/Brainstorm/Cut/Build/Prove, implementing, fixing, debugging, reviewing plans, validating completion, handling user challenge or quality complaint recovery, or deciding which devflow skill should handle the task. Entry point for the DevFlow skill chain."
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
2. Framework source: `skills/devflow-core/references/core-methods.md` — MANDATORY read, not optional. This file defines Method 0 (Architect Mindset) through Method 15 and the Capability Matrix. You must read it before route selection, engineering decisions, or code changes. Do not skip even for "simple" tasks — Method 0 shapes how every other method is applied.
3. Current code, generated plan docs, config, tests, and references relevant to the task.
4. Existing helpers, patterns, commands, and installed dependencies.
5. Execution recall: probe `.copilot/LEARNING_INDEX.md`; when present, read the index, match the task against card trigger and scope, then read only matched cards.
6. Business recall: probe `docs/project-knowledge/`; when present, read `AI-START-HERE.md`, falling back to `index.md`, then use `registry.json` when present to select only task-relevant domain, module, risk, or entry-point documents.
7. Maps: `graphify-out/GRAPH_REPORT.md` for architecture/impact questions when present.
8. Skill Discovery: scan available skills in the current environment — platform skill registry (e.g., `use_skill` tool listing), local skill directories (`~/.claude/skills/`, `~/.codex/skills/`, `.github/skills/`, `.codebuddy/skills/`), or any other skill source the platform exposes. Match task-relevant skills by description keywords. External skills are complementary to the devflow route: devflow manages scope and risk (what to change, how much); external skills guide execution quality (how to do it well). Record matched skills for alongside-route loading. Missing or unavailable skills are non-blocking.

Recall is progressively disclosed: do not bulk-load `.copilot/cards/` or `docs/project-knowledge/`. Missing locations, indexes, entries, or registries are non-blocking facts and must not create storage. Record `Knowledge recall: none / learning index + matched card / project knowledge entry + matched docs` with the Context Map facts. Record `Skill Discovery: none / <skill-name> (matched: <why>)` with the Context Map facts.

Output:

```text
Facts: read/confirmed <files or commands>
Methods: read/confirmed core-methods.md (Method 0-15 + Capability Matrix)
Knowledge recall: none / learning index + matched card / project knowledge entry + matched docs
Skill Discovery: none / <skill-name> (matched: <why>)
Unknowns: <none or specific unknown>
```

Do not claim understanding unless the understanding cites facts that were read or checked. The `Methods` line is mandatory — if core-methods.md was not read, state `Methods: not yet read` and read it before proceeding.

## Routes

| Route | Use when | Do |
|---|---|---|
| Fast | Pure Q&A, fact lookup, verification, or trivial code change (one line, no logic change, no risk). | Sense -> Prove |
| Problem | User reports "something is wrong" or asks to inspect without asking for a fix. | Sense -> Prove facts; re-route only after the needed change is known |
| Design-lite | Small change to an existing feature with clear behavior, one plausible path, low risk, local impact, and quick proof. Not for new requirements. | Short goal -> acceptance -> not-doing -> devflow-cut -> devflow-build/devflow-prove if requested |
| Design | New requirement, behavior change, feature, architecture change, ambiguity, multi-solution decision, or unclear small-feature boundary. Not for documentation writing, config tuning, or clear small changes to existing features. | Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> devflow-cut; continue to devflow-build/devflow-prove when implementation is requested. Skip Brainstorm for doc/config/clear-fix tasks — use Design-lite or Fast |
| Build | User asks to implement, fix, land, or execute a change. | Sense -> Brainstorm -> [STOP: Depth A/B/C] -> (A: devflow-spec -> /devflow-plan | B: /devflow-plan | C: direct) -> devflow-cut -> devflow-build -> devflow-prove. Skip Brainstorm/Plan if already completed, if root cause is clear and fix is trivial, or for doc/config work — use Design-lite or Fast |
| Recovery | Repeated failure, user correction, user challenge, missing-piece complaint, repeated "少了这个/少个那个" feedback, quality complaint, changed-wrong result, unexpected verification failure, or giving-up impulse. | Load `devflow-pua` when pressure recovery is needed; diagnose user-view miss -> re-read facts -> 3 hypotheses -> different/opposite method -> changed approach -> Prove |

If the user asks to implement, build, fix, or land a change, continue through Build and Prove. Steps scale to task size — Cut and Prove are never skipped, but Brainstorm/Plan may be skipped when already completed or when the task is trivial enough for Fast/Design-lite.

After two corrected or failed attempts in one task lifecycle, stop editing and use `devflow-pua` to re-ask the goal/result unless the answer is directly inferable from facts.

## Small Request Boundary

Fast is allowed only when impact, risk, uncertainty, and proof are all small:

- Impact: one local behavior, file, setting, doc section, or display field.
- Risk: no auth, money, permissions, data migration, deletion, external API contract, release flow, or security boundary.
- Uncertainty: goal, expected behavior, and acceptance proof are already clear.
- Proof: a narrow command, search check, focused test, or manual scenario can verify it quickly.

A small feature is still a requirement. Design-lite does not bypass Brainstorm for new requirements — it applies only to existing features. Use Design-lite only when it passes the same four gates and has one plausible implementation path after facts are read. If any gate is uncertain, ask the user to choose Fast, Design-lite, or full Design.

## Issue Triage

Before routing, classify the incoming work:

| Incoming word shape | Treat as | Skill path |
|---|---|---|
| "problem report", "check what is wrong", "why broken", "investigate" | Problem investigation | `devflow-core -> devflow-prove` for facts; if a change is needed, re-route to Design or Build. |
| "requirement", "feature request", "add support", "implement" | Requirement | `devflow-core -> devflow-brainstorm -> devflow-cut`; continue to Build only when implementation is requested. For documentation, config, or clear small fixes, use Design-lite or Fast instead of Brainstorm. |
| "bug report", "error", "failing test", "fix bug", "broken" | Bug fix | Root-Cause Check first. If root cause is clear and fix is trivial → Fast or Design-lite. Otherwise `devflow-core -> devflow-brainstorm -> devflow-cut -> devflow-build -> devflow-prove`. |
| "wrong", "not like that", "changed wrong", "your code is wrong", "you wrote it wrong", "has a problem", "not right", "missing", "incomplete", "still missing", "quality complaint", "user dissatisfied", "有问题", "不对", "写错了", "改歪了", "没改对", "不是我要的", "理解错了", "改了几次", "少了", "少个", "缺少", "缺漏", "遗漏", "漏了" | Pressure recovery | `devflow-core -> devflow-pua -> devflow-brainstorm`; quarantine prior wrong assumptions, diagnose user-view miss, ask what is wrong and what result is wanted, then switch method/approach before more edits. |

Problem investigation must not silently become implementation. First prove what is wrong, what is unknown, and whether a change is actually needed.

For problem solving (问题解决), bug fixing, 修 bug, and architecture design (架构设计), use First Principles Cut (第一性原理) when the cause, invariant, abstraction, or smallest correct mechanism is unclear. Reduce the work to facts and constraints before selecting the route, design, or fix.

## Capability Dispatch

| Signal | Capability | Required next action |
|---|---|---|
| unclear ask, new requirement, behavior change, multiple paths, or non-trivial design interview | Brainstorm First | Load `devflow-brainstorm` only when the request involves genuine design decisions, new features, or architecture changes. For documentation, config, trivial code changes, or clear bug fixes with known root cause, use Design-lite or Fast instead. When loading Brainstorm: require goal, constraints, 2-3 approaches. Brainstorm presents a Path Selection Gate: when Fast Exit conditions are met (small change to existing feature, all boundary gates pass, single plausible path), Fast Exit is offered as a recommended option alongside A/B/C — the user chooses, not the LLM. If A/B/C is chosen, Brainstorm ends at the Depth Selection Gate where the user picks A/B/C (option semantics live in `skills/devflow-brainstorm/SKILL.md`). Use Brainstorm Interview Discipline (one question at a time with recommended answer). Pick Method Lens (Root Cause, Working Backwards, First Principles Cut, Data/Proof, Operational Owner) when risk is high. |
| unclear whether work is Fast, Design-lite, or full Design | Route Choice | Ask the user to choose; do not guess from line count or "sounds small". |
| explicit deep adversarial review, red-team review, 对抗审查, 升级版对抗审查 | Independent Manual Review | Load `devflow-adversarial` directly. It may run at any task stage and must not read, require, modify, or hand off to another skill or lifecycle state. |
| explicit find faults, biggest omission, blind spot, least certain, 找茬, 最大遗漏, 没有意识到什么, 最没有把握 | Independent Manual Review | Load `devflow-find-fault` directly. It may run at any task stage and must not read, require, modify, or hand off to another skill or lifecycle state. |
| task matches an available non-devflow skill (e.g., frontend-design, pdf, docx, understand, data-analysis) | External Skill Dispatch | Suggest loading the matched skill alongside the devflow route. External skills and devflow are complementary: devflow manages scope, risk, and minimum change (what to change); external skills guide execution quality (how to do it well). The devflow chain (brainstorm -> cut -> build -> prove) always runs. `CUT_REUSE` applies only when the external skill fully handles the task with no new code needed (e.g., `pdf` for reading a PDF, `understand` for codebase analysis). Record `External Skill: <name> (matched: <why>)`. |
| new code, dependency, abstraction, config, folder, framework layer | Cut Gate | Load `devflow-cut`; require Reuse, Native, Overbuild, Diff, Scope checks. |
| implementation ready | Build Discipline | Load `devflow-build`; require touched files, slices, diff self-check. |
| done/fixed/passed/ready claim | Proof Before Done | Load `devflow-prove`; require command/result/adversarial review/PASS-FAIL-BLOCKED; every PASS then runs `devflow-learn` proactive review. |
| problem report without explicit fix request, bug report, or failing verification | Issue Triage + Root-Cause Fix Check | Prove symptom first; search callers/references; do not edit until root cause is clear. If fix is trivial → Fast/Design-lite. |
| repeated failure, user challenge, changed wrong, missing-piece complaint, quality complaint | Pressure Recovery Gate | Load `devflow-pua`; stop editing, quarantine previous wrong assumptions, list 3 hypotheses, switch method, then Prove. |
| verified PASS | Completion Knowledge Review | Load `devflow-learn`; proactively classify reusable execution knowledge, project-knowledge candidates, or no useful record before final completion reporting. |
| reusable correction, repeated pitfall, project convention | Learning Capture | Load `devflow-learn`; lazily create or update `.copilot/LEARNING_INDEX.md` and one focused card only when the lesson has future-task value. |
| confirmed project-knowledge candidate | Business Knowledge Maintenance | Load `devflow-project-knowledge`; update only code-backed business facts after user confirmation. |

## Required Route Outputs

Fast:

```text
Goal: ...
Facts: ...
Knowledge recall: ...
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
- Fast: pure Q&A, fact lookup, verification, or trivial code change; quickest proof.
- Design-lite: small change to an existing feature; short goal/acceptance/not-doing; then build if requested.
- Full Design: new requirement or higher-risk feature; compare approaches before build.
```

Recovery:

```text
Failure/correction: ...
User-view miss: <why the user would still say this is wrong or incomplete>
METHOD: {flavor} / {method}
SWITCH: <none or old method -> new method: reason>
Discarded context: <old assumption/path not reused>
Facts reread: ...
Desired result: ...
Changed approach: <3 hypotheses -> picked approach>
Verification: ...
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This is too simple for the flow." | Small work gets a short flow, not no flow. |
| "I know the project." | Read the actual files; memory is not evidence. |
| "I'll verify later." | Later verification creates false completion now. |
| "The user asked to implement, so skip design." | Implementation requests still need the shortest useful design and cut gate. |
| "This is a new feature but it's small, so Design-lite." | New features go through Brainstorm. Design-lite is for existing features only. The brainstorming skill enforces its own HARD-GATE. However, once inside Brainstorm, when Fast Exit conditions are met, Fast Exit is offered as a recommended option — the user chooses whether to take it or go through A/B/C. |
| "Documentation/config work needs Brainstorm." | No — documentation writing, config tuning, and trivial changes go through Fast or Design-lite, not Brainstorm. Brainstorm is for genuine design decisions. |
| "I used the skill because I named it." | Activation requires trigger, steps, artifact/check, and handoff. |
| "DevFlow skills are the only skills." | The environment may have other skills (frontend-design, pdf, understand, etc.). Scan and suggest loading them alongside the devflow route — they guide execution quality while devflow manages scope and risk. |

## Handoff

- Design route -> `devflow-brainstorm`
- Before adding structure -> `devflow-cut`
- Approved work -> `devflow-build`
- Task matches available external skill -> suggest loading that skill alongside the devflow route; devflow manages scope/risk, external skill guides execution quality; devflow chain always runs
- Explicit independent manual adversarial review -> `devflow-adversarial`; explicit independent find-fault review -> `devflow-find-fault`. Both end after reporting findings and do not create a lifecycle handoff.
- Before completion -> `devflow-prove -> devflow-learn` (every PASS reviews useful knowledge; candidate business facts wait for user confirmation before `devflow-project-knowledge`)
- After verified feature completion -> `devflow-docs-followup` (asks user which optional follow-up documents to create; never generates unconfirmed documents)
- User challenge, explicit wrong-code signal, changed-wrong result, repeated miss, repeated "少了这个/少个那个" feedback, missing-piece complaint, or quality complaint -> `devflow-pua -> devflow-brainstorm`
- User correction or reusable pitfall -> `devflow-learn`

## Verification

Before leaving this skill, confirm:

- [ ] `core-methods.md` was read and listed in the `Methods:` output line.
- [ ] Route selected from task facts.
- [ ] Skill Discovery was run: available environment skills were scanned and matched or recorded as none.
- [ ] Small Request Boundary used for any Fast or Design-lite classification.
- [ ] Relevant project facts were read or explicitly marked missing.
- [ ] Next skill is named.
- [ ] Design or completion output contract is preserved.

Completion still belongs to `devflow-prove`.
