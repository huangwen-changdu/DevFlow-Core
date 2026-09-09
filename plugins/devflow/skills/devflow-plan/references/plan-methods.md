# Plan Methods

Use this reference after `skills/devflow-spec/references/spec-plan-methods.md` and before writing a Plan Pack. It defines the smallest handoff that lets another executor continue approved work without repeating broad repository discovery.

## Touch Set

State the intended touch set once, before tasks: the files and the responsibility each one carries. Reuse the nearest owner when it already has the responsibility. If no target can hold the responsibility without a materially different concern, return the fact to Core instead of inventing a generic abstraction.

The v2 Plan Pack has no `File Structure` table. The per-task `Files` rows are the touch set; a global table would only restate them.

## Task Rows

Each task carries exactly six fields:

```text
Task: <short, independently understandable title>
Files: <Create / Modify / Test rows with path and symbol or stable anchor>
Change: <what changes and its boundary>
Acceptance: <specific observable condition>
Verify: <command or manual scenario with trigger, input, and expected result>
Not doing: <scope excluded by this task>
```

`Change` states the executable intent. Add exact mechanics only when the change crosses a module contract, is irreversible, or touches security or data boundaries. Otherwise the executor chooses the smallest implementation inside the task boundary. This is the deliberate trade: the plan stops pre-deciding every edit, and Build regains bounded implementation authority. That trade is the fix for the bloated-plan problem, not a relaxation of proof.

Investigation evidence does not belong in the plan. Keep it in the conversation, or in a `.copilot/cards/` learning card when it is reusable across tasks.

## Progress Table

Close the plan with one row per task:

```text
| # | Task | Status | Evidence |
|---|---|---|---|
| 1 | <task title> | todo | - |
```

Status values are `todo`, `doing`, and `done`. Build flips the row it is working on and fills the evidence with the command and key result. Prove writes `Status: done` and `Landed:` on `PASS`. A `done` row without evidence fails the checker, and a plan whose header `Status` is `done` requires every row to be `done`. The table is why an interrupted session can resume: the next reader sees exactly what landed and what did not.

## Execution Handoff

An executor — the main agent itself, one delegated subagent, or one fan-out subagent — receives the current task's six fields. It may read the task's named anchors and one directly changed neighbor to choose the smallest implementation; it must not broadly rediscover the repository, redesign outside the task boundary, silently repair the plan, or expand the touch set.

When an edit cannot be applied, a `Verify` fails, or a bounded read finds changed contract behavior, the executor returns the observed difference — affected file/anchor, actual behavior, blocked verification, and the smallest replan decision — as facts to `devflow-core`. It never guesses past a mismatch.

### Fan-out

When the plan's `Execution mode` is `fan-out`, one Build orchestrator partitions tasks into parallel groups and dispatches each task to a subagent. Every subagent receives only its own task's six fields, reads its anchors, edits its task's `Files`, runs its task's `Verify`, flips its Progress row, and returns evidence or failure facts. Two tasks may run in parallel only when their `Files` touch disjoint file/symbol sets and neither task's `Change` consumes what the other produces; tasks sharing a file/symbol or with a dependency run in sequence. The orchestrator merges returned results, reconciles cross-task overlap, and enters Prove once with merged evidence.

### Single-subagent

When the plan's `Execution mode` is `single-subagent`, the main agent only schedules: it dispatches one task's six fields at a time to one executor subagent, waits for the return, then merges the returned evidence and enters Prove once. The subagent reads its anchors, edits, verifies, flips its Progress row, and returns the task result and evidence or `BUILD_BLOCKED` facts. The next task continues the same subagent conversation through `send_message`. On DeepSeek Harness (DSH), subagent turns are time-bounded, so one task per round is the norm; a timeout or truncated return retries that one task once with a narrower instruction. Nothing runs in parallel; prefer this mode for small to medium plans or plans whose tasks are strongly dependent, and keep `fan-out` for large parallel plans.
