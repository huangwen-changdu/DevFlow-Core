# Plan Methods

Use this reference after `skills/devflow-spec/references/spec-plan-methods.md` and before writing a Plan Pack. It defines the smallest handoff that lets another executor continue approved work without repeating broad repository discovery.

## File Structure

Write one `## File Structure` table before tasks:

```text
| File / symbol | Operation | Responsibility | Why here | Not responsible for |
|---|---|---|---|---|
| [path and stable anchor] | Create / Modify / Test | [one responsibility] | [placement rationale] | [explicit boundary] |
```

The table states where approved responsibility belongs. It does not mandate a class count, layer, pattern, or automatic file split. Reuse the nearest owner when it already has the responsibility. If no target can hold the responsibility without a materially different concern, return the fact to Core rather than inventing a generic abstraction.

## Prewalk

Every non-trivial Code change task ends with `Prewalk`. It is an append-only handoff with three parts:

```text
Prewalk:

Execution Trace:
- Read: [actual file/symbol/range] → [observed fact].
- Traced: [actual caller, entry point, collaborator, contract, or test] → [observed path or constraint].
- Ran: [actual command or scenario] → [relevant result].
- Edited: [actual file/symbol and change] → [reason; or "none yet"].
- Verified: [actual check] → [observed result; or "none yet"].

Current Handoff Facts:
- Target anchors: [minimum current anchors for the next executor].
- Nearby convention: [inspected comparable code and observed convention; or "no comparable code found"].
- Direct path: [traced callers, collaborators, boundaries, affected tests; or "none"].
- Current constraints: [observed contract, ordering, error behavior, compatibility; or "none"].
- Planned touch set: [remaining expected files/symbols and reason].
- Risks / stop conditions: [facts that require Core replan; or "none beyond ordinary Plan drift"].
- Read-basis: [已读文件清单——执行者无需重读].
- Live anchors: [仅需现场确认的锚点——执行者只读这些].

Remaining Structured Worklist:
- [ ] [one independently completable remaining action with file/symbol and expected outcome].
  Anchors: [minimum current anchors].
  Verify: [command, test, call-path check, or observable result].
  Done when: [fact proving completion].
```

### Trace Rules

- Record only work actually performed and what it observed. Do not write future-tense discovery instructions as trace evidence.
- `Read`, `Traced`, `Ran`, `Edited`, and `Verified` may say `none yet` only where that action truly has not happened. At least one actual read or trace result is required for a Code change handoff.
- A failed command is valid evidence when its relevant failure is recorded. Do not rewrite it as success.
- The executor appends real evidence after completing each remaining work item; it does not erase prior trace facts.

### Worklist Rules

- Include only unfinished work. Completed work belongs in `Execution Trace`.
- Order work by dependency. Keep every item independently verifiable.
- Require `Anchors`, `Verify`, and `Done when` for each item. Generic phrases such as “check the code” do not prove completion.
- Limit one task to 12 remaining items. Group mechanical substeps under one verified result or return a scope-splitting fact to Core.

## Delegated Execution

A delegated executor reads the latest trace, then minimally re-reads the current work item's anchors and directly changed neighbor. It does not repeat File Structure decisions or broadly reread the repository by default. The executor determines its read set from `Current Handoff Facts`: it must not re-read the `Read-basis` list and only live-verifies the `Live anchors`; anchor contradiction still returns facts to `devflow-core`.

Stop and return facts to `devflow-core` when the minimal reread shows a contradiction in any target anchor, direct caller, contract, local convention, dependency, side effect, affected test, responsibility, or directly necessary touch set. The return identifies the observed mismatch, affected anchor, invalidated handoff fact, blocked verification, and smallest replan decision. An obvious stale line reference may be corrected without returning only when the symbol, contract, responsibility, and intended outcome are unchanged.

### Fan-out

When the plan's `Execution mode` is `fan-out`, one Build orchestrator partitions tasks into parallel groups and dispatches each task to a subagent. Every subagent follows the same per-task read discipline above: read the latest trace, minimally re-read only its task's anchors (`Read-basis` / `Live anchors`), execute only its task's `Files`, and return evidence or contradiction facts. Two tasks may run in parallel only when their `Files` touch disjoint file/symbol sets and neither `Interfaces` consumes a symbol the other `Produces`; tasks sharing a file/symbol or with a consume/produce dependency run in sequence. The orchestrator merges returned results, reconciles cross-task overlap, and enters Prove once with merged evidence.

### Single-subagent

When the plan's `Execution mode` is `single-subagent`, the main agent only schedules: it dispatches the whole approved Plan Pack to one executor subagent, waits for the return, then merges the returned evidence and enters Prove once. The subagent runs all tasks in dependency order inside one context under the same per-task read discipline above: read the latest trace, minimally re-read only the current item's `Anchors` / `Live anchors`, execute only the task's `Files`, append actual evidence to the plan trace, and return merged results and evidence, or `BUILD_BLOCKED` facts. Nothing runs in parallel; prefer this mode for small to medium plans or plans whose tasks are strongly dependent, and keep `fan-out` for large parallel plans.
