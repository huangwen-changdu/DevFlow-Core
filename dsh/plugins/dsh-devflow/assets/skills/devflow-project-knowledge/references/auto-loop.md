# Project Knowledge Auto Loop

The pack stays current without a user request. This reference owns the triggers; the write procedures stay in `../SKILL.md`.

## Loop

```text
Sense: read the pack when present; a missing pack is a non-blocking fact and writes nothing.
First landed change with no pack: create the minimal pack (three files).
Every landed change: refresh code-evidenced structure, append the change log, bump last_updated.
Business semantics: report a candidate, write only after user confirmation.
Next Sense: the fresher entry is the recall source.
```

## Create: Minimal Pack

A missing pack is created once, at the first verified change in that project — not at read time, not on a pure Q&A, lookup, or read-only investigation turn. Create only these three files:

| File | Required content |
|---|---|
| `AI-START-HERE.md` | What the project is; tech stack; build, test, and verify commands with working directory and preconditions; reading order; at least three misjudgment risks; the Metadata block below |
| `index.md` | Reading order plus high-risk boundaries |
| `registry.json` | `repo`, `lastUpdated`, `docs`, `modules`, `commands`, `openQuestions`; empty maps are valid, invented entries are not |

Do not generate the full fifteen-file scaffold, deep dives, or business domains from inference. A deep dive is added later, when a real domain task touches it.

Metadata block, required in `AI-START-HERE.md`, `index.md`, and every deep-dive file:

```text
Metadata:
- repo: <path>
- last_updated: <YYYY-MM-DD>
- updated_from: <landed change / code scan / user confirmation>
- confidence: low / medium / high
- coverage: <what this file covers>
- stale_risk: low / medium / high
- next_review_hint: <condition that forces a refresh>
```

## Update: Every Landed Change

After `devflow-prove` returns PASS and `devflow-learn` reports the sediment:

1. Append one entry to `11-change-log.md` with the date, change summary, touched modules, and source.
2. Refresh `Metadata.last_updated` and `updated_from` in `AI-START-HERE.md`.
3. Update `registry.json`: `lastUpdated`, `docs`, and the modules or paths the change actually touched. Record a command only after it ran successfully.
4. Update a deep-dive file only when the change altered a fact that file already covers.

Structural facts — file paths, module responsibility, public entry points, runnable commands — may be written from code evidence with `confidence: medium`. Business semantics — rules, boundaries, terminology, entity meaning — stay candidates until the user confirms them, then carry `confidence: high`.

Do not write: agent lessons (they belong in `.copilot/cards/`), raw implementation history, rename-only refactor details, or facts without code or command evidence.

## Freshness

At Sense, compare `Metadata.last_updated` with the newest source commit date. A file without a Metadata block is `unverified`: mark it, and add the block during the next update. If `last_updated` is older than the source commit, mark the pack `stale` in `Facts` and refresh its structural parts after this change lands.

## Documentation Map

The same loop keeps the docs map honest. When a project's state is unknown, run `node scripts/devflow-docs.js --status` first: it lists which artifacts exist and the next command for each missing one. When a project has no `docs/INDEX.md`, create it with `node scripts/devflow-docs.js --init` at the first landed change; the same command also scaffolds `PROGRESS.md`, a `Makefile` command entry, one layered `docs/ARCHITECTURE.md` built from the detected layer directories, and the derived spec index. Review every `[待确认]` row before relying on those files. The master map stays a router (90-line limit): leaf specs are covered by `docs/specs/INDEX.md`, rebuilt with `--refresh`, so new specs never enlarge the map. After that, run `node scripts/devflow-docs.js --check` on every landed change that adds, moves, or deletes a document, and refresh `PROGRESS.md` after each landed change. A missing checker or map is a non-blocking fact; never hand-invent a map the checker cannot verify.

## Guardrails

- Scan only what the change and the entry need; never re-read the whole repository.
- Never create the directory during a read attempt, a pure Q&A turn, or a read-only investigation.
- Never commit. Report the written files and any pending candidate at handoff.
- A missing pack, entry, or registry stays non-blocking for the current task.
