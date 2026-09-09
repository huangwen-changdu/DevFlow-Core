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
- Target anchors: [current file/symbol/range the plan author verified; evidence record, not executor re-read instruction].
- Nearby convention: [inspected comparable code and observed convention; or "no comparable code found"].
- Direct path: [traced callers, collaborators, boundaries, affected tests; or "none"].
- Current constraints: [observed contract, ordering, error behavior, compatibility; or "none"].
- Planned touch set: [remaining expected files/symbols and reason].
- Risks / stop conditions: [facts that require Core replan; or "none beyond ordinary Plan drift"].
- Read-basis: [已读文件清单——计划作者的证据簿记，执行者不重读].
- Live anchors: [计划作者已确认的锚点——执行者不重读，仅作失败回报时的定位].

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

A delegated executor — the main agent itself, one delegated subagent, or one fan-out subagent — receives only the current task's execution spec (`Files`, exact replacement rules, `Steps`, `Verify`). Before editing, it must re-read the current task's named anchors. A current task anchor and directly changed neighbor may be reread only when that neighbor is already listed and its contract could invalidate the edit; it must not broadly rediscover the repository, re-plan, or expand scope. `Read-basis` and `Live anchors` stay in the plan as the plan author's evidence record. A detected mismatch returns facts to Core instead of silent repair.

When an edit cannot be applied or a `Verify` fails, or a bounded reread finds changed authorization/contract behavior, the executor returns the observed difference — affected file/anchor, actual behavior, blocked verification, and smallest replan decision — as facts to `devflow-core`; it does not guess past a mismatch. A stale line reference may be corrected only when the symbol, contract, responsibility, and intended outcome are unchanged.

### Fan-out

When the plan's `Execution mode` is `fan-out`, one Build orchestrator partitions tasks into parallel groups and dispatches each task to a subagent. Every subagent receives only its own task's execution spec, must reread named anchors and at most one already-listed neighbor, edits its task's `Files`, runs its task's `Verify`, and returns evidence or failure facts. It does not broadly rediscover or redesign. Two tasks may run in parallel only when their `Files` touch disjoint file/symbol sets and neither `Interfaces` consumes a symbol the other `Produces`; tasks sharing a file/symbol or with a consume/produce dependency run in sequence. The orchestrator merges returned results, reconciles cross-task overlap, and enters Prove once with merged evidence.

### Single-subagent

When the plan's `Execution mode` is `single-subagent`, the main agent only schedules: it dispatches one task's execution spec at a time to one executor subagent, waits for the return, then merges the returned evidence and enters Prove once. The main agent dispatches one task at a time — only that task's execution spec, not the whole plan. The subagent must reread current named anchors and at most one already-listed neighbor for drift, but never broadly rediscover or redesign; it edits, verifies, appends evidence, and returns the task results and evidence or `BUILD_BLOCKED` facts. The next task continues the same subagent conversation through `send_message`. On DeepSeek Harness (DSH), subagent turns are time-bounded, so one task per round is the norm; a timeout or truncated return retries that one task once with a narrower instruction. Nothing runs in parallel; prefer this mode for small to medium plans or plans whose tasks are strongly dependent, and keep `fan-out` for large parallel plans.
