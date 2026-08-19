---
name: devflow-learn
description: "Use after every verified DevFlow PASS to proactively extract useful reusable knowledge, or when the user says wrong, not like that, changed wrong, remember, learn, 沉淀, 下次不要, 放错位置, 改歪了, 没改对, 不是我要的, 少了, 少个, 缺漏, 遗漏, or when a repeated user correction, reusable pitfall, project convention, or .copilot learning-card update appears."
---

# DevFlow Learn

Turn verified work, corrections, and pitfalls into reusable intercept rules without bloating context.

## Completion Review

Every `devflow-prove` judgment of `PASS` must enter this lightweight review before final completion reporting. Review both successful and failed paths from the completed task; do not wait for a correction or pitfall signal.

Extract only knowledge that can help a future task:

- a proven implementation or reuse pattern
- a decision tied to a constraint or tradeoff
- an effective validation method
- a non-obvious repository convention or invariant
- a costly, counterintuitive, repeated, or project-wide lesson
- a confirmed project-business fact that may require knowledge-package maintenance

`PASS` requires the review, not a new record. If no useful reusable knowledge remains after classification, report that result and create nothing.

| Review result | Action | Store |
|---|---|---|
| Reusable execution experience or proven work pattern | Create or update one focused card | `.copilot/cards/` |
| Confirmed business fact changed | Report a project-knowledge candidate and wait for user confirmation | `docs/project-knowledge/` after confirmation via `devflow-project-knowledge` |
| Ordinary detail, one-off fact, already-covered lesson, or pure refactor without insight | Report no useful record | none |

Project-knowledge candidates include changed domain semantics, rules, boundaries, entity/DTO/enum meaning, API or table boundaries, module responsibility, job behavior, and task entry points. `devflow-learn` must not update the package itself or infer business facts without evidence.

## Process

1. Detect the learning signal:
   - `devflow-prove` `PASS` completion review, user correction, repeated user correction, repeated user challenge, repeated missing-piece complaint, changed-wrong result, wrong assumption, repeated failure, skipped validation, missed project convention, misplaced content, or non-obvious pitfall
2. Probe `.copilot/LEARNING_INDEX.md`. Read `.copilot/LEARNING_INDEX.md` when it exists; otherwise record that learning recall is absent.
3. Match the current task against card Trigger and Scope. Read only matched cards; do not load all `.copilot/cards/**`.
4. Extract a candidate from the task's implementation, decisions, proof, and business impact.
5. Decide whether to record:
   - record if the candidate is cross-task reusable and proven useful, costly if missed, counterintuitive, non-obvious, repeated, or project-wide
   - report a project-knowledge candidate if code-backed business semantics changed; wait for user confirmation before calling `devflow-project-knowledge`
   - skip if it is ordinary narration, a one-off fact, already covered, or too context-specific
6. Create `.copilot/LEARNING_INDEX.md`, `.copilot/cards/`, and one focused card only when the result belongs in project learning; do not create empty learning storage after a no-record review.
7. Update `.copilot/LEARNING_INDEX.md` when a card changed.
8. Report learning closure before completion.

## Repeat Correction Gate

Repeated correction is not optional learning. If the user corrects the same boundary, placement, workflow, or wording rule twice in one task lifecycle, create or update a learning card before claiming completion.

Repeated challenge is also not optional learning. If the user says the result was wrong, changed wrong, missed the target, missing pieces, or not what they wanted twice in one task lifecycle, record the next-time intercept after `devflow-pua` identifies the reusable mistake pattern.

Repeated missing-piece feedback is also not optional learning when the same task already went through recovery. If the user says "少了这个/少个那个/缺漏/遗漏/漏了" after a prior attempt or after a method switch, record the missing coverage pattern and the next method switch rule.

Required pressure-recovery card action:

```text
- Trigger: <task signal>, user challenge, changed wrong, repeated miss, repeated missing-piece complaint
- Lesson: <what goal/result was misunderstood>
- Next action: Next time encountering <X>, first stop the current path, classify the user-view miss, build a Coverage Map for missing pieces, restate the desired result, ask or infer the pointed result questions, then switch to a different/opposite method before editing.
```

Misplaced content counts as a reusable pitfall when a rule, prompt, method detail, plan, or explanation was put in the wrong artifact, such as:

- README-style explanation inside `AGENTS.md`
- runtime method details under `docs/` instead of `skills/*/references/*`
- brand/project summaries inside skill `description`
- plan or audit material inside a runtime prompt

Required card action:

```text
- Trigger: <artifact or task signal>, wrong place, misplaced content, repeated correction
- Lesson: <what was placed in the wrong artifact>
- Next action: Next time editing <artifact>, first check the target owner, then put <content type> in <correct place>, not <wrong place>.
```

## Storage Contract

Project learning lives in:

```text
.copilot/
  LEARNING_INDEX.md
  cards/<short-kebab-name>.md
```

Keep cards small. A card must answer what to do next time.

Learning storage is lazily created only by this skill after a qualifying reusable execution lesson. Recall does not create it.

## Knowledge Boundaries

| Store | Owns | Does not own |
|---|---|---|
| `graphify-out/` | Structural code graph, communities, and dependency relationships | Execution lessons or curated business guidance |
| `.copilot/cards/` | Execution experience, intercept rules, and proven work patterns | Business reference documentation |
| `docs/project-knowledge/` | Curated, code-backed business facts, boundaries, and task entry points | Agent mistakes or raw implementation history |

Handoff: `devflow-prove PASS` -> `devflow-learn` review -> project-knowledge candidate -> user confirmation -> `devflow-project-knowledge` lazy maintenance of `docs/project-knowledge/`. Only after a verified feature implementation with an actual source-behavior or interface-contract change may `devflow-learn` hand off to `devflow-docs-followup` for an optional documentation inquiry. Do not automatically hand off validation-only, documentation-only, rule-only, skill-only, or no-diff `PASS` results.

## Card Format

```text
# <Short Name>

- Trigger: <next time signal>
- Lesson: <what this work taught>
- Next action: Next time encountering <X>, first do <Y>, do not do <Z>.
- Scope: session | project | global | skill | module
- Related: <files or commands>
- Evidence: <checked source, command, or verified correction that supports this card>
- Invalidation: <changed contract, failed proof, or review trigger that requires this card to be revised or retired>
```

## Index Format

```text
# Learning Index

Read this index first. Only read a card when its trigger matches the current task.

| Card | Trigger | Scope | Confidence |
|---|---|---|---:|
| [Card Name](cards/card-name.md) | trigger words | project | 0.5 |
```

## Promotion Rules

| Signal count | Action |
|---:|---|
| 1 | Create/update card, confidence 0.3-0.5 |
| 2 | Raise confidence and force recall before acting |
| 3 | Propose `AGENTS.md` or platform rule update |
| 4+ | Propose skill or command automation |
| User explicitly says remember/learn/沉淀 | Promote immediately if scope is clear |

## Completion Output

Always report:

```text
Learning closure:
- Learning signal: PASS review/correction/pitfall/none
- Recall record: none/index/card
- Knowledge recall: none/learning index + matched card/project knowledge candidate
- Review result: learning card/project-knowledge candidate/no useful record
- New sediment: none/learning card/rule/skill
- Next intercept: next time <X>, first do <Y>, do not do <Z>
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This was just a correction." | Corrections reveal future intercepts. Check if reusable. |
| "The task passed, so there is nothing to learn." | PASS proves the work; proactively review its implementation, decision, proof, and business impact. |
| "The user already told me where it goes." | Repeated placement corrections must become a card so the next run recalls them before acting. |
| "The user only complained about quality." | Repeated challenge is a reusable signal when the miss pattern can repeat. |
| "I'll remember it." | Memory without an index is not recallable. |
| "Let's store everything." | Too many cards become noise; record only repeatable or costly lessons. |
| "Read all cards just in case." | Index first, matched card only. |

## Verification

Before leaving this skill, confirm:

- [ ] Learning signal was classified.
- [ ] Every `PASS` ran a proactive completion review before final completion reporting.
- [ ] `LEARNING_INDEX.md` was checked or created.
- [ ] Only matched cards were read.
- [ ] Repeated user corrections, repeated user challenges, and misplaced content were recorded or explicitly classified as already covered.
- [ ] New or updated card has trigger, lesson, next action, scope, related files, evidence, and invalidation condition.
- [ ] Business-semantic changes were reported as candidates and await user confirmation before knowledge-package maintenance.
- [ ] Completion output includes learning closure.
