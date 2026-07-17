# Knowledge Recall Chain

## Goal

Make DevFlow learning cards and project knowledge recallable in later tasks through a fixed, installable, progressively disclosed data path.

## Context

DevFlow currently stores reusable execution experience in `.copilot/LEARNING_INDEX.md` and `.copilot/cards/`, while confirmed, code-backed business facts belong in `docs/project-knowledge/`. The skills describe these locations, but the normal task-start path does not consistently require selective recall of both layers. `devflow-project-knowledge` is also absent from the published plugin and installer runtime manifests, so an installed runtime cannot complete a confirmed business-knowledge handoff.

## Requirements

1. Define one recall contract for normal DevFlow task startup:
   - Probe `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/` without creating either location.
   - Read the learning index when present, match the current task against card trigger and scope, and read only matched cards.
   - Read `docs/project-knowledge/AI-START-HERE.md` when present; otherwise read `docs/project-knowledge/index.md`.
   - Use the project-knowledge navigation and `registry.json`, when present, to select only task-relevant domain, module, risk, or entry-point documents.
   - Do not bulk-load either knowledge store.
2. Keep storage ownership unambiguous:
   - `.copilot/` owns reusable execution experience, intercept rules, and proven work patterns.
   - `docs/project-knowledge/` owns user-confirmed, code-backed business semantics, boundaries, and task entry points.
   - `graphify-out/` remains structural graph data and is not changed by this work.
3. Keep missing knowledge non-blocking:
   - Missing indexes, navigation files, registries, or directories are recorded as absent facts and do not block the task.
   - No empty directory or index is created by recall alone.
4. Create records only when their owner has a qualifying signal:
   - `devflow-learn` lazily creates `.copilot/LEARNING_INDEX.md`, `.copilot/cards/`, and one focused card only for a reusable execution lesson.
   - `devflow-project-knowledge` creates or maintains `docs/project-knowledge/` only after the user confirms a code-backed business-knowledge candidate.
5. Make the recall and handoff path reachable from runtime rules, skills, commands, published manifests, target installation, and user-level installation.
6. Preserve recall evidence in `Facts` and learning/knowledge closure output so later proof can show whether knowledge affected the task.
7. Extend existing validation to prove rule presence, progressive-disclosure behavior, lazy-creation boundaries, handoff reachability, and installer delivery of `devflow-project-knowledge`.

## Non-goals

- Do not add a global knowledge-retrieval service, vector store, automatic code scanner, telemetry, or new runtime dependency.
- Do not load all learning cards or all project-knowledge documents.
- Do not create empty knowledge locations for ordinary tasks or missing recall sources.
- Do not store execution lessons in the business knowledge package or unconfirmed business facts in learning cards.
- Do not modify graphify output or turn project knowledge into runtime method documentation.

## Approach

Use existing files and indexes instead of adding a retrieval mechanism:

```text
Task start
-> probe existing knowledge locations
-> learning recall: LEARNING_INDEX.md -> matched cards only
-> business recall: AI-START-HERE.md or index.md -> registry.json -> matched documents only
-> Sense / Brainstorm / Cut / Build / Prove
-> PASS review: devflow-learn
-> user-confirmed business candidate: devflow-project-knowledge
```

Put detailed retrieval steps in `devflow-core` methods and the two knowledge-owning skills. Keep entry rules concise but explicit that progressive recall occurs at task start. Add `devflow-project-knowledge` to all shipped skill and installer manifests. Extend existing validation scripts and self-test scenarios rather than introducing a new checker.

## Impact

- Runtime entry rules and prompts, including `AGENTS.md`, `CLAUDE.md`, command prompts, host adapters, and session-start context.
- `skills/devflow-core/SKILL.md` and `skills/devflow-core/references/core-methods.md`.
- `skills/devflow-learn/SKILL.md`, `skills/devflow-project-knowledge/SKILL.md`, and `commands/devflow-learn.toml`.
- `plugin.json`, target and user installer manifests, and installer validation.
- Learning-loop, trigger, package, and scenario validation.
- `docs/features/devflow-core.md` capability history.

## Acceptance

1. A normal task can trace a selective recall chain from runtime entry through `devflow-core` to either no knowledge, matched learning cards, or matched project-knowledge documents.
2. The stated read order is learning index before matching cards, and project-knowledge entry before registry-directed documents.
3. Rules prohibit bulk loading and recall-driven directory creation.
4. `devflow-learn` is the only lazy creator of learning records; `devflow-project-knowledge` is the only lazy creator or maintainer of business knowledge after explicit user confirmation.
5. A verified, confirmed business-knowledge candidate can reach `devflow-project-knowledge` in source-package, target-installed, and user-installed runtimes.
6. Existing validation commands fail if the recall contract, progressive-disclosure terms, or installed project-knowledge skill delivery drift.

## Verification

```text
npm test
npm run learn:verify
npm run trigger:verify
npm run install:verify
npm run user:verify
npm run verify:all
```

Run the narrowest checks during implementation, then run the full matrix before completion.

## Open Questions

None.
