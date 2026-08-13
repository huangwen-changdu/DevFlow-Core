# DevFlow Self-Test Scenarios

Use these scenarios to verify the framework from request to landing. A scenario passes only when the expected skill behavior, output contract, and proof are visible.

## Scenario 1: Vague Feature Request

Input:

```text
Add search to the dashboard.
```

Expected behavior:

- Route: Design.
- Skill path: `devflow-core -> devflow-brainstorm -> Confirmed request -> user-selected A/B/C direct branch`.
- Brainstorm must read current project context before clarifying.
- Brainstorm must send a Semantic Echo-Back, apply the Understanding Revision Rule when a correction changes the request, then ask or infer only goal, scope, exclusions, constraints, acceptance, and open questions.
- Brainstorm must output the fixed `Confirmed request` summary with `Status: clarified`, present A/B/C, and wait for explicit user selection.
- Brainstorm must not choose an approach, route, depth, design contract, or handoff; it starts only the user-selected direct branch.
- A directly follows Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove; B directly follows Brainstorm -> Cut -> Plan -> Build -> Prove; C directly follows Brainstorm -> Cut -> Build -> Prove.
- An approved A-branch Spec directly enters Cut, A/B `CUT_PASS` directly enters Plan, C `CUT_PASS` directly enters Build, and an approved A/B Plan directly enters Build.
- `devflow-core` alone selects after non-unique facts: missing or changed depth, `CUT_REDUCE`, `CUT_REUSE`, `CUT_BLOCKED`, scope drift, `BUILD_BLOCKED`, Proof `FAIL`/`BLOCKED`, changed intent, or PUA recovery.
- PUA returns recovery facts to Core before lifecycle selection.

Pass check:

```text
Confirmed request:
- Goal:
- Scope:
- Out of scope:
- Constraints:
- Acceptance:
- Open questions:
- Status: clarified
```

## Scenario 1A: Problem Investigation

Input:

```text
Problem report: the login flow looks wrong. Check what is wrong, do not fix yet.
```

Expected behavior:

- Route: Problem
- Skill path: `devflow-core -> devflow-prove`
- Must read relevant project facts before naming the problem.
- Must prove the symptom, absence of evidence, or unknowns before editing.
- Must not silently implement a fix.
- If a change is needed, re-route to Design or Build with a clear target.

Pass check:

```text
Route: Problem
Facts: read/confirmed ...
Command/scenario: <actual investigation command or scenario>
Result: <symptom / no evidence / unknowns>
Judgment: PASS / FAIL / BLOCKED
Next step: no change needed / re-route Design / re-route Build
```

## Scenario 1B: Requirement To Implementation

Input:

```text
Requirement: implement CSV export for orders.
```

Expected behavior:

- Route: Build because implementation is requested.
- Skill path: `devflow-core -> devflow-brainstorm -> Confirmed request -> user selects C -> devflow-cut -> CUT_PASS -> devflow-build -> devflow-prove`.
- Brainstorm confirms the request at `Status: clarified`, then presents A/B/C and starts Cut only after the user selects C.
- Cut checks existing export helpers, standard library/platform CSV support, dependency need, scope drift, and smallest useful path.
- Build uses slices if the change spans API/UI/tests.
- Prove runs the targeted test/build/manual scenario.

Pass check:

```text
Confirmed request: ...
Core route: ...
Reuse Check: ...
Ponytail Rung: ...
Implementation Slices: ...
Command: <actual verification>
Result: <key output>
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 1C: Bug Report

Input:

```text
Bug report: order totals sometimes render as NaN. Fix the bug.
```

Expected behavior:

- Route: Build
- Skill path: `devflow-core -> devflow-brainstorm -> Confirmed request -> devflow-core -> devflow-cut -> Cut Decision -> devflow-core -> devflow-build -> devflow-prove`
- Brainstorm confirms only the request and stops at `Status: clarified`.
- Core chooses the lifecycle path after reading the confirmed request; when no reviewable design contract is needed, it can proceed to Cut.
- Must identify likely touched formatter/calculation flow from facts.
- `devflow-cut` must run Root-Cause Check before editing.
- Must search callers/references and choose shared vs narrow fix intentionally.
- Must prove the original symptom or a regression check.

Pass check:

```text
Root-Cause Check: searched <callers/references>; fix location <shared/narrow>; reason <why>
Diff Check: ...
Command: <regression test or reproduction command>
Result: <NaN reproduced then fixed, or BLOCKED with missing repro>
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 1C-A: First Principles Cut

Input:

```text
The service layer is too complicated. Redesign the architecture and fix the timeout issue.
```

Expected behavior:

- `devflow-core` selects First Principles Cut because inherited abstractions may hide the real constraint.
- `devflow-brainstorm` confirms the requested outcome, scope, constraints, acceptance, and open questions without proposing an architecture.
- After `Confirmed request`, Core separates verified facts, constraints, invariants, and assumptions before selecting the smallest necessary mechanism.
- `devflow-cut` still runs Reuse, Native, Overbuild, Diff, and Scope gates before implementation.

Pass check:

```text
Method Lens: primary First Principles Cut; secondary <lens/none>; why <hidden constraint>
Facts: ...
Constraints: ...
Invariants: ...
Assumptions removed: ...
Smallest necessary mechanism: ...
Not doing: ...
```

## Scenario 1D: Codex Trigger Surface

Input:

```text
Codex sees only AGENTS.md, skill descriptions, and command prompts.
```

Expected behavior:

- `AGENTS.md` contains trigger words for problem reports, requirements, bug reports, user challenge recovery, and completion claims.
- `devflow-core` description includes investigating issues, requirements, bugs, and user challenge recovery.
- `devflow-brainstorm` description includes requirement/feature/behavior/architecture triggers.
- `devflow-pua` description includes changed-wrong and quality complaint triggers.
- `devflow-prove` description includes done/fixed/complete/ready/passed triggers.
- Command prompts repeat Problem, Root-Cause, Pressure Recovery, and proof routing for hosts that use slash commands instead of skill bodies.

Pass check:

```text
Codex Trigger Contract
problem report / requirement / bug report / changed wrong / done
Issue Triage
Pressure Recovery Gate
Root-Cause Check
```

## Scenario 1E: Host Adapter Contract Drift

Input:

```text
Check whether the host adapter files still point to the same DevFlow contract.
```

Expected behavior:

- Route: Fast verification
- Skill path: `devflow-core -> devflow-prove`
- Must check `AGENTS.md`, `CLAUDE.md`, Copilot instructions, VS Code instruction/prompt, CodeBuddy rule, plugin metadata, and Gemini metadata.
- Must confirm platform adapters preserve `Sense -> Brainstorm clarification -> user-selected A/B/C -> direct success edges -> devflow-prove`, with Core routing non-unique exceptions.
- Must confirm plugin metadata includes all shipped skills and commands.
- Must not rewrite adapter rules unless drift is proven.

Pass check:

```text
Host Adapter Verification Report
AGENTS / CLAUDE / Copilot / VS Code / CodeBuddy / plugin manifest / Gemini metadata
Command: npm run host:verify
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 1F: Independent Manual Adversarial Review

Input:

```text
Run an upgraded adversarial review of this current change without using completion status.
```

Expected behavior:

- Route: Independent manual.
- Skill path: explicit user request -> `devflow-adversarial`.
- Must run only because the user explicitly requested it; it may inspect materials from any task stage.
- Must begin after the explicit review request without a separate confirmation prompt.
- Must ask one smallest question only when the review target is unclear.
- Must cover all five fixed dimensions: requirement coverage, reachability, boundaries and regressions, evidence strength, and user-visible outcome.
- Findings must use `Critical`, `Important`, or `Observation` and include evidence, confidence, and context limitations.
- Must not read, require, modify, or hand off to `devflow-prove`, PUA, Build, Learn, or any completion state.
- Must not edit code, create a task, invoke another skill, or declare global task status.

Pass check:

```text
Review confirmation: explicit request received
Adversarial review target: ...
Findings: Critical / Important / Observation
Five-angle coverage: requirement coverage / reachability / boundaries and regressions / evidence strength / user-visible outcome
Context limitations: ...
Suggested next action: manual only
```

## Scenario 1G: Independent Manual Find-Fault Review

Input:

```text
Find faults in this change: what is the biggest omission, what have we not recognized, and what is least certain?
```

Expected behavior:

- Route: Independent manual.
- Skill path: explicit user request -> `devflow-find-fault`.
- Must run only because the user explicitly requested it; it may inspect materials from any task stage.
- Must answer biggest omission, unrecognized blind spot, and least certain point, plus every explicit user follow-up question.
- When target material contains implemented work, a diff, or a completion-ready result, must also run the post-implementation unease check: find materially unconfirmed business decisions, show the encoded assumption and alternatives, then classify high/medium/low risk with rationale, a user confirmation question, and temporary recommendation.
- High-risk unease decisions must prevent a claim that the feature fully meets requirements; medium-risk decisions must be marked `pending confirmation`.
- Each answer must separate facts, inference, and unknowns, then state confidence and a next step; findings must use `Critical`, `Important`, or `Observation` with evidence and context limitations.
- Must not read, require, modify, or hand off to `devflow-prove`, PUA, Build, Learn, or any completion state.
- Must not edit code, create a task, invoke another skill, or declare global task status.

Pass check:

```text
Find-fault target: ...
Questions and answers: biggest omission / unrecognized blind spot / least certain point / user questions
Facts / inference / unknowns / confidence / next step
Unease check: run / not applicable — <why>
Decision: current implementation / assumption / alternative interpretations / risk / evidence / confirmation needed / temporary recommendation
Findings: Critical / Important / Observation
Context limitations: ...
Suggested next action: manual only
```

## Scenario 2: Small Clear Change

Input:

```text
In README, rename "Proof Gate" to "Proof Before Done".
```

Expected behavior:

- Route: Build because implementation is requested and scope is clear.
- Still run a lightweight Sense and Cut.
- Touch only the requested file.
- Verify with text search.

Pass check:

```text
Reuse Check: ...
Diff Check: README only
Command: <search command>
Result: old phrase absent/new phrase present
Judgment: PASS
```

## Scenario 3: Dependency Proposal

Input:

```text
Install a date picker package for a basic birthday field.
```

Expected behavior:

- `devflow-cut` blocks the new dependency unless a current limitation is proven.
- Native Check considers `<input type="date">`.
- Output says what was cut.

Pass check:

```text
Native Check: checked Browser And HTML; native option used
Overbuild Check: new dependency rejected
CUT_REDUCE or CUT_REUSE
```

## Scenario 4: Existing Capability

Input:

```text
Add a UUID helper.
```

Expected behavior:

- Search existing helpers.
- Check runtime standard library.
- Prefer `crypto.randomUUID()` where available.
- Do not create a helper unless a current compatibility reason exists.

Pass check:

```text
Ponytail Rung: stdlib/native
Not doing: new helper wrapper
```

## Scenario 5: Multi-File Feature

Input:

```text
Implement the approved notification preference feature.
```

Expected behavior:

- Route: Build
- `devflow-build` creates Implementation Slices.
- Each slice has files, change, and verification.
- `devflow-prove` runs final verification.

Pass check:

```text
Implementation Slices:
- Slice 1: files / change / per-slice verification
- Slice 2: files / change / per-slice verification
Command: ...
Result: ...
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 5B: Contextual Engineering Quality

Input:

```text
Implement an approved order-history change. Match project conventions, keep the code readable, and add caching only if it is justified.
```

Expected behavior:

- Route: Build through Cut and Prove.
- Cut compares nearest order-history patterns and records convention, responsibility, performance, and readability checks.
- It must not require a Service split, interface, cache, or fixed function length without current evidence.
- Build makes business intent, key rules, failure paths, and side effects locally understandable, then records a Readability Check.
- Prove reviews the actual diff against File Structure, Prewalk evidence, project-convention alignment, local understandability, responsibility boundaries, and any cache benefit/invalidation/consistency claim.
- A coherent orchestration change passes when its responsibility, side effects, and direct contracts remain evidenced in the diff.
- A changed responsibility or unrecorded side effect is a Blocker or Warning only when the diff shows concrete risk; a justified local convention deviation remains non-blocking.

Pass check:

```text
Convention Check: compared ...
Responsibility Check: ...
Performance Check: workload/failure evidence ...; cache/optimization/concurrency ...
Readability Check: intent / rules / failure paths / side effects / convention / trade-off
Code Review Report: ...
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 5A: Plan Pack Check

Input:

```text
Create implementation slices from this approved design and check the plan before coding.
```

Expected behavior:

- Route: Build planning before implementation.
- Skill path: `devflow-core -> devflow-brainstorm -> Confirmed request -> user selects A -> devflow-spec -> approved Spec -> devflow-cut -> CUT_PASS -> /devflow-plan -> approved Plan -> devflow-build -> devflow-prove`.
- Brainstorm presents A/B/C after the confirmed request. User-selected A starts Spec directly; Core routes only missing-depth, changed-intent, or non-success facts.
- Spec must compare real no-change/reuse, direct, and relevant existing-pattern options; it writes the design contract/saved spec, waits for user approval, then an approved A Spec directly enters Cut.
- A/B `CUT_PASS` directly enters Plan; only `CUT_REDUCE`, `CUT_REUSE`, `CUT_BLOCKED`, or other non-success facts return to Core.
- A Code change Plan Pack requires a concrete `File Structure` row per target and task-level `Prewalk`: actual `Execution Trace`, `Current Handoff Facts`, and bounded `Remaining Structured Worklist`.
- A delegated Build agent reads the latest trace, then re-reads only the current work item's anchors and directly changed neighbor. It does not restart broad discovery or re-decide responsibility by default.
- A user-approved Plan Pack receives a lightweight Cut-consistency review; an approved A/B Plan directly enters Build, while scope-drift facts return to Core.
- Saved plan files default to `docs/plans/YYYY-MM-DD-<short-kebab-name>.md`.
- Must not save implementation plans under `docs/features/`; that directory is for feature ledgers.
- Must run `node scripts/devflow-plan.js <plan-file>` when the plan is saved to a file. If not found at `scripts/devflow-plan.js` (project-level), try `~/.codex/scripts/devflow-plan.js` or `~/.claude/scripts/devflow-plan.js` (user-level). Do NOT look under `skills/scripts/`.
- Must fail or revise a plan missing a responsibility map, actual trace evidence, current handoff facts, bounded work items, or concrete verification. The checker does not approve an architecture pattern.

Pass check:

```text
CUT_PASS: allowed scope / reuse conclusion / exclusions / verification constraints
Command: node scripts/devflow-plan.js docs/plans/YYYY-MM-DD-<short-kebab-name>.md
Result: DevFlow plan pack report; File Structure: ok; trace and remaining worklist: ok; Judgment: PASS
Next: lightweight Cut-consistency review -> confirmed Plan and scope-drift facts -> devflow-core
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 5C: Diff-First Prove Quality Gate

Input:

```text
The approved export plan is implemented. Verify it and mark it ready.
```

Expected behavior:

- Route: Prove.
- Prove reads the actual diff before interpreting test output, and compares it with the approved `File Structure`, current `Execution Trace`, `Current Handoff Facts`, remaining-work completion evidence, and nearest comparable code.
- The Code Review Report names the reviewed diff, plan boundary, Prewalk evidence, comparable code, Blockers, Warnings, Recommendations, and boundary verdict.
- An unresolved evidence-backed Blocker or Warning returns `FAIL` facts to Core; Recommendations alone do not prevent PASS.
- A function size, class name, dependency count, cache preference, or fixed architecture shape without changed-code evidence and concrete risk is not a blocking finding.

Pass check:

```text
Diff reviewed: actual changed files/ranges
Plan boundary: File Structure row(s) and verdict
Prewalk evidence: Trace / Handoff Facts / completion evidence
Blockers: 0
Warnings: 0
Recommendations: 0 or documented
Boundary verdict: within approved responsibility/touch set
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 6: Repeated Same-Function Problem

Input:

```text
The CSV export is still wrong. I already pointed out that the same export behavior is missing the required columns.
```

Expected behavior:

- Route: Recovery.
- Trigger because the user repeatedly identifies the same function (`CSV export`) as wrong or incomplete in one task lifecycle.
- Re-read facts.
- List 3 hypotheses.
- Pick a different approach.
- Load `devflow-learn` when the correction or pitfall is reusable.

Pass check:

```text
Failure/correction: repeated report about the same function/result/capability
Repeated target evidence: CSV export + prior feedback or correction attempt
Facts reread: ...
Hypotheses: 1 / 2 / 3
Changed approach: ...
Learning closure: ...
```

## Scenario 6A: Repeated Correction Learning Closure

Input:

```text
Not again: AGENTS.md is a runtime prompt. You put README-style explanation in the wrong place.
```

Expected behavior:

- Route: Recovery
- Load `devflow-learn` because this is a repeated correction and misplaced content signal.
- Read `.copilot/LEARNING_INDEX.md`.
- Read only the matched card, such as `agents-runtime-prompt-boundary.md`.
- Create or update one focused card when the correction is not already covered.
- Update `.copilot/LEARNING_INDEX.md` when trigger words change.
- Report learning closure before claiming completion.

Pass check:

```text
Repeat Correction Gate
wrong place / misplaced content / repeated correction
.copilot/LEARNING_INDEX.md
Read `.copilot/LEARNING_INDEX.md`
Read only the matched card
Report learning closure before claiming completion
Next action: Next time editing AGENTS.md ...
```

## Scenario 6B: New Reusable Pitfall Card

Input:

```text
Remember this: when a validation script only checks file presence, next time make it check executable behavior too.
```

Expected behavior:

- Route: Recovery or Fast learning capture, depending on whether the request follows a failure.
- Skill path: `devflow-core -> devflow-prove -> devflow-learn`
- Read `.copilot/LEARNING_INDEX.md`.
- Read only matched cards; do not load all cards.
- If no matched card already covers the lesson, create one focused card with Trigger, Lesson, Next action, Scope, and Related.
- Update `.copilot/LEARNING_INDEX.md` with the new card and trigger words.
- Report learning closure before claiming completion.
- Use `npm run learn:verify` as no-mutation proof that the learning-loop contract still works.

Pass check:

```text
devflow-learn
LEARNING_INDEX
matched card
Next action
learning closure
Command: npm run learn:verify
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 6D: Progressive Knowledge Recall

Input:

```text
Implement an order export change using existing project conventions.
```

Expected behavior:

- At Sense, probe `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/` without creating either location.
- Read the learning index before matching and reading only relevant cards.
- Read `AI-START-HERE.md`, falling back to `index.md`, then use `registry.json` to select only relevant business knowledge documents.
- Do not bulk-load cards or project knowledge. Missing locations, indexes, or registries are non-blocking facts.
- A reusable execution lesson may lazily create `.copilot/` records. Only a user-confirmed, code-backed business candidate may reach `devflow-project-knowledge` to lazily maintain `docs/project-knowledge/`.

Pass check:

```text
Knowledge recall: none / learning index + matched card / project knowledge entry + matched docs
Read `.copilot/LEARNING_INDEX.md`
Read only the matched card
AI-START-HERE.md / index.md / registry.json
Missing knowledge: recorded, non-blocking, no storage created
devflow-learn -> user confirmation -> devflow-project-knowledge
```

## Scenario 6C: User Challenge Pressure Recovery

Input:

```text
CSV 导出还是不对；我上次已经指出同一个导出缺少必填列。
```

Expected behavior:

- Route: Recovery.
- Skill path: `devflow-core -> devflow-pua -> recovery facts -> devflow-core -> devflow-brainstorm when selected -> Confirmed request -> devflow-core -> devflow-prove -> devflow-learn`.
- Trigger only because the user repeatedly identifies the same function (`CSV export`) as wrong or incomplete in one task lifecycle.
- `devflow-pua` owns the recovery diagnosis, method switch, hypotheses, and new success contract; it returns recovery facts to Core, which alone decides whether Brainstorm re-confirms the request and which lifecycle work follows.
- Must mark `Restart Brainstorm: re-confirmation required; Core selects whether to invoke it` when the repeated same-target trigger applies.
- Must not infer pressure recovery from an isolated keyword or message count alone.
- Must discard the prior wrong assumption/path/proof claim and keep only verified facts.
- Must classify `User-view miss` and `Satisfaction gap` before choosing the next fix.
- Must display the selected recovery method as `METHOD: {flavor} / {method}`.
- Must switch guiding method when the previously used method still failed.
- Must switch to a different/opposite method and restart checks from facts when the first recovery method still misses.
- Must return the Brainstorm re-confirmation need to Core before changing files again.
- Must re-read facts from the repeated same-target feedback, prior edits, proof output, and relevant project files.
- Must ask where it is wrong, what result is wanted, what must stay unchanged, and how to verify when those answers cannot be inferred.
- Must list 3 hypotheses, including that the prior approach solved the wrong problem.
- Must blue-team attack the new plan from the user's point of view.
- Must define a `New success contract` instead of continuing the old context.
- Must choose a materially different approach.
- Must prove with command/result/judgment.
- Must hand off to `devflow-learn` when the repeated miss is reusable.

Pass check:

```text
Pressure check: repeated report about the same function/result/capability
Repeated target evidence: CSV export + prior feedback or correction attempt
Restart Brainstorm: re-confirmation required; Core selects whether to invoke it
Discarded context: ...
Keep only verified facts: ...
User-view miss: ...
Satisfaction gap: ...
METHOD: {flavor} / {method}
SWITCH: none / old flavor/method -> new flavor/method: reason
User goal restated: ...
Desired result: ...
Blocking questions: none / inferred / 2-4 pointed questions
Hypotheses: 1 / 2 / 3
Blue-team attack: ...
New success contract: ...
Changed approach: ...
Command: <actual proof>
Result: <key output>
Judgment: PASS / FAIL / BLOCKED
Learning closure: ...
```

## Scenario 7: Completion Claim

Input:

```text
Are we done?
```

Expected behavior:

- `devflow-prove` runs or cites a fresh verification command.
- For development work, `devflow-prove` runs adversarial review against acceptance criteria, touched files, likely regressions, activation path, and proof coverage.
- The strongest plausible challenge and its disposition are visible before judgment.
- If adversarial review finds a real gap, judgment is `FAIL` or the flow continues before any completion claim.
- If no proof can run, report `BLOCKED`.
- Do not say "done" before command/result/judgment.

Pass check:

```text
Command: <actual command>
Result: <real output summary>
Adversarial review: <strongest challenge and disposition>
Judgment: PASS / FAIL / BLOCKED
```

## Scenario 7A: Adversarial Review Rejects Completion

Input:

```text
The unit test passes. Mark the API change complete.
```

Expected behavior:

- `devflow-prove` checks whether the API entry point, callers, integration behavior, and acceptance criteria were actually covered.
- A passing unit test alone does not override a discovered activation-path or regression gap.
- When the strongest plausible challenge remains unresolved, report `FAIL` and name the missing proof.

Pass check:

```text
Command: <unit test command>
Result: <passing unit test output>
Adversarial review: API activation path or integration behavior remains unverified.
Judgment: FAIL
```

## Scenario 7B: Delegated Continuation and Scope Drift

Input:

```text
A Build subagent receives an approved Plan whose latest Prewalk trace records `OrderHistoryQuery`, its API handler, and current authorization behavior. The first remaining work item anchors the query and handler. A minimal anchor reread discovers a new authorization policy that changes denial behavior and the requested rule's placement.
```

Expected behavior:

- Build reads the latest Execution Trace, re-reads only the current anchors and directly changed neighbor, and does not restart a broad repository review.
- Build stops instead of silently applying the rule to the easiest existing file or expanding the touch set.
- It returns observed policy, affected anchor, invalidated trace/handoff fact, blocked work-item verification, and the smallest replan decision to Core.
- After Core corrects Plan/Prewalk, Build resumes from updated anchors and appends actual verification evidence for every completed remaining item.

Pass check:

```text
Command: minimal anchor reread plus required verification
Result: mismatch and affected anchor recorded; no silent scope expansion or broad rediscovery
Adversarial review: new authorization behavior invalidates planned placement
Judgment: FAIL facts -> devflow-core replan -> resumed Build only after corrected handoff
```

## Scenario 8: Skill Pack Validation

Input:

```text
Validate DevFlow-Core itself.
```

Expected behavior:

- Run `npm test`.
- Validate required files, frontmatter, commands, output contracts, and required method terms.

Pass check:

```text
Command: npm test
Result: DevFlow validation passed
Judgment: PASS
```

## Scenario 9: Target Project Install Check

Input:

```text
Install DevFlow into a target project and verify the installed runtime did not drift.
```

Expected behavior:

- Route: Fast verification after the install target is known.
- Skill path: `devflow-core -> devflow-prove`
- Must run the dry-run before write mode when demonstrating a first install.
- Must use `npm run install:target -- <target> --write` to copy runtime files.
- Must use `npm run install:target -- <target> --check` after install.
- Must report `ok`, `missing`, or `changed` file state from check mode.
- Must not copy product docs, source-only reference docs, or validation harness files into the target project.
- If check mode fails, report `FAIL` and name whether the target has missing or changed runtime files.

Pass check:

```text
Command: npm run install:target -- <target> --check
Result: Check passed: installed runtime matches this package.
Judgment: PASS
```
