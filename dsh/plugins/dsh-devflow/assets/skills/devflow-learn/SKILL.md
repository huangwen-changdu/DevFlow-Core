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
- a user-visible capability or interface-contract change that must appear in `docs/features/INDEX.md`
- a developer preference about how to work — language, documentation depth, design-first, verify-command habits, review style — confirmed by a repeated correction

`PASS` requires the review, not a new record. If no useful reusable knowledge remains after classification, report that result and create nothing.

| Review result | Action | Store |
|---|---|---|
| Reusable execution experience or proven work pattern | Create or update one focused card | `.copilot/cards/` |
| User-visible capability or interface contract changed | Add or update one row: what it does, its trigger words, its entry point, its verify command, and its source plan | `docs/features/INDEX.md` |
| The same how-to preference was corrected twice | Create or update one `Scope: global` preference card | `.copilot/cards/` |
| Code-evidenced structure changed | Refresh the pack structure through `devflow-project-knowledge` without waiting for confirmation | `docs/project-knowledge/` |
| Business semantics changed | Report a project-knowledge candidate and wait for user confirmation | `docs/project-knowledge/` after confirmation via `devflow-project-knowledge` |
| Ordinary detail, one-off fact, already-covered lesson, or pure refactor without insight | Report no useful record | none |

The capability row is a mechanical duty, not a documentation inquiry: a verified change that alters what a user can do, or an interface contract others depend on, must be findable from one index on the next session. Writing a longer document still needs explicit user confirmation through `devflow-docs-followup`.

Project-knowledge candidates include changed domain semantics, rules, boundaries, entity/DTO/enum meaning, API or table boundaries, module responsibility, job behavior, and task entry points. Structural facts — paths, module responsibility, runnable commands — may be refreshed from code evidence; `devflow-learn` must not infer business facts without evidence or update them without confirmation.

## Process

1. Detect the learning signal:
   - `devflow-prove` `PASS` completion review, user correction, repeated user correction, repeated user challenge, repeated missing-piece complaint, changed-wrong result, wrong assumption, repeated failure, skipped validation, missed project convention, misplaced content, or non-obvious pitfall
2. Probe `.copilot/LEARNING_INDEX.md`. Read `.copilot/LEARNING_INDEX.md` when it exists; otherwise record that learning recall is absent.
3. Match the current task against card Trigger and Scope. Read only matched cards; do not load all `.copilot/cards/**`.
4. Extract a candidate from the task's implementation, decisions, proof, and business impact.
5. Decide whether to record:
   - record if the candidate is cross-task reusable and proven useful, costly if missed, counterintuitive, non-obvious, repeated, or project-wide
   - add or update one capability row in `docs/features/INDEX.md` with trigger words if the verified change altered user-visible behavior or an interface contract; report `no-change` otherwise
   - refresh code-evidenced structure through `devflow-project-knowledge` without waiting for confirmation; report business-semantic candidates and wait for user confirmation
   - skip if it is ordinary narration, a one-off fact, already covered, or too context-specific
6. Create `.copilot/LEARNING_INDEX.md`, `.copilot/cards/`, and one focused card only when the result belongs in project learning; do not create empty learning storage after a no-record review.
7. Update `.copilot/LEARNING_INDEX.md` when a card changed.
8. Report learning closure before completion.

## Repeat Correction Gate

🔴 CHECKPOINT — repeated correction is not optional learning. If the user corrects the same boundary, placement, workflow, or wording rule twice in one task lifecycle, create or update a learning card before claiming completion.

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
| `docs/features/INDEX.md` | The capability routing index: what a feature does, its trigger words, its entry point, its verify command, and its source plan | Execution lessons, business reference docs, version history, feature bodies |
| `docs/project-knowledge/` | Curated, code-backed business facts, boundaries, and task entry points | Agent mistakes or raw implementation history |

Handoff: `devflow-prove PASS` -> `devflow-learn` review -> capability row in `docs/features/INDEX.md` and/or a structure refresh through `devflow-project-knowledge` -> business-semantic candidate -> user confirmation -> `devflow-project-knowledge` maintenance of `docs/project-knowledge/`. Only after a verified feature implementation with an actual source-behavior or interface-contract change may `devflow-learn` hand off to `devflow-docs-followup` for an optional documentation inquiry. Do not automatically hand off validation-only, documentation-only, rule-only, skill-only, or no-diff `PASS` results.

## Card Format

```text
# <Short Name>

- Trigger: <next time signal>
- Lesson: <what this work taught>
- Rejected: <the alternative that was tried or seriously considered, and why it lost; write not-recorded only when no alternative faced a real decision>
- Next action: Next time encountering <X>, first do <Y>, do not do <Z>.
- Scope: session | project | global | skill | module
- Related: <files or commands>
- Evidence: <checked source, command, or verified correction that supports this card>
- Evidence Level: L1 | L2 | L3 | L4
- Invalidation: <changed contract, failed proof, or review trigger that requires this card to be revised or retired>
```

`Lesson` answers what happened; `Rejected` answers why the other path lost. A card without `Rejected` records a rule, not a decision, and cannot explain itself six months later.

## Evidence Level

Grade a card by the form of its `Evidence`, never by the conviction of its wording:

| Level | Evidence form | Confidence cap |
|---|---|---|
| L1 | a rerunnable command quoted with its actual output or exit code | 0.9 |
| L2 | mechanically copyable from an existing artifact: hash, byte parity, row count, diff | 0.8 |
| L3 | a path, symbol, or contract that must exist, with no observed result | 0.5 |
| L4 | free-form self-report such as "inspected during implementation" | 0.4 |

`Promotion Rules` cannot push a card above its level's cap. A card at L3 or L4 that needs more authority first upgrades its evidence form, not its confidence number.

## Index Format

```text
# Learning Index

Read this index first. Only read a card when its trigger matches the current task.

| Card | Trigger | Scope | Confidence | Evidence Level |
|---|---|---|---:|---|
| [Card Name](cards/card-name.md) | trigger words | project | 0.5 | L1 |
```

`Evidence Level` makes a rule-restatement card visible beside a real lesson: a high-confidence L4 row is the signal that the number is unsupported.

## Promotion Rules

| Signal count | Action |
|---:|---|
| 1 | Create/update card, confidence 0.3-0.5 |
| 2 | Raise confidence and force recall before acting |
| 3 | Propose `AGENTS.md` or platform rule update |
| Card confidence reaches 0.7 within its `Evidence Level` cap | Propose the rule or skill change and create one `docs/requirements.md` row for the proposal, so learning returns to the requirement loop |
| 4+ | Propose skill or command automation |
| User explicitly says remember/learn/沉淀 | Promote immediately if scope is clear |

## Completion Output

Always report:

```text
Learning closure:
- Learning signal: PASS review/correction/pitfall/none
- Recall record: none/index/card
- Knowledge recall: none/learning index + matched card/project knowledge candidate
- Review result: learning card/capability row/project-knowledge candidate/no useful record
- Capability entry: added/updated/no-change
- Docs follow-up branch: applicable — pending user selection / not applicable — <reason>
- Project-knowledge branch: structure refreshed automatically / business candidate awaiting user confirmation / not applicable — <reason>
- New sediment: none/learning card/rule/skill
- Next intercept: next time <X>, first do <Y>, do not do <Z>
```

The two branch lines are the closure receipt for the conditional post-PASS handoffs: a no-record review still reports 已复盘 with both branches, silence or an ambiguous answer stays pending user selection (never opt-out), and an unconfirmed business candidate stays candidate — nothing is auto-maintained.

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
| "The other option was obviously worse." | An obvious alternative still needs one line in `Rejected`, or the next reader re-litigates it. |
| "This card is proven, so confidence 0.8 is fair." | Confidence follows evidence form. An L4 card claiming 0.8 is unsupported no matter how true it sounds. |

## Verification

Before leaving this skill, confirm:

- [ ] Learning signal was classified.
- [ ] Every `PASS` ran a proactive completion review before final completion reporting.
- [ ] `LEARNING_INDEX.md` was checked or created.
- [ ] Only matched cards were read.
- [ ] Repeated user corrections, repeated user challenges, and misplaced content were recorded or explicitly classified as already covered.
- [ ] New or updated card has trigger, lesson, rejected alternative, next action, scope, related files, evidence, evidence level, and invalidation condition.
- [ ] Card confidence does not exceed its `Evidence Level` cap, and the index row carries the same level.
- [ ] A user-visible capability or interface-contract change added or updated one `docs/features/INDEX.md` row with trigger words, or was reported as `no-change`.
- [ ] Business-semantic changes were reported as candidates and await user confirmation before knowledge-package maintenance.
- [ ] Completion output includes learning closure.
