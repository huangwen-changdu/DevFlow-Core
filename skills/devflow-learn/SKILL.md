---
name: devflow-learn
description: "Use when the user says wrong, not like that, changed wrong, remember, learn, 沉淀, 下次不要, 放错位置, 改歪了, 没改对, 不是我要的, 少了, 少个, 缺漏, 遗漏, or when a repeated user correction, repeated user challenge, repeated missing-piece complaint, misplaced content, reusable pitfall, wrong assumption, skipped validation, project convention, or .copilot learning-card update appears."
---

# DevFlow Learn

Turn corrections and pitfalls into reusable intercept rules without bloating context.

## Process

1. Detect the learning signal:
   - user correction, repeated user correction, repeated user challenge, repeated missing-piece complaint, changed-wrong result, wrong assumption, repeated failure, skipped validation, missed project convention, misplaced content, or non-obvious pitfall
2. Read `.copilot/LEARNING_INDEX.md` if it exists.
3. Read only matched cards; do not load all `.copilot/cards/**`.
4. Decide whether to record:
   - record if the mistake is likely to repeat, costly, counterintuitive, or project-wide
   - skip if it is a one-off fact, already covered, or too context-specific
5. Create or update one focused card.
6. Update `.copilot/LEARNING_INDEX.md`.
7. Report learning closure before completion.

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

## Card Format

```text
# <Short Name>

- Trigger: <next time signal>
- Lesson: <what this pitfall taught>
- Next action: Next time encountering <X>, first do <Y>, do not do <Z>.
- Scope: session | project | global | skill | module
- Related: <files or commands>
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
- Learning signal: none/yes
- Recall record: none/index/card
- New sediment: none/learning card/rule/skill
- Next intercept: next time <X>, first do <Y>, do not do <Z>
```

## Anti-Rationalization

| Excuse | Reality |
|---|---|
| "This was just a correction." | Corrections reveal future intercepts. Check if reusable. |
| "The user already told me where it goes." | Repeated placement corrections must become a card so the next run recalls them before acting. |
| "The user only complained about quality." | Repeated challenge is a reusable signal when the miss pattern can repeat. |
| "I'll remember it." | Memory without an index is not recallable. |
| "Let's store everything." | Too many cards become noise; record only repeatable or costly lessons. |
| "Read all cards just in case." | Index first, matched card only. |

## Verification

Before leaving this skill, confirm:

- [ ] Learning signal was classified.
- [ ] `LEARNING_INDEX.md` was checked or created.
- [ ] Only matched cards were read.
- [ ] Repeated user corrections, repeated user challenges, and misplaced content were recorded or explicitly classified as already covered.
- [ ] New or updated card has trigger, lesson, next action, scope, and related files.
- [ ] Completion output includes learning closure.
