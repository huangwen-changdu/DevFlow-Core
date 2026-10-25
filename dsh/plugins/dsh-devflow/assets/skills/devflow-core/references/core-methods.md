# DevFlow Core Methods

This is the shared method source loaded by `devflow-core` before route selection. It contains only the invariants needed by every route. Load the selected owner reference from the map below before applying lifecycle-specific rules.

## Method 0: Architect Mindset

Apply these principles to every route:

1. Read the affected system and blast radius before changing it.
2. Preserve contracts unless the accepted goal requires a contract change.
3. Prefer the smallest necessary coupling and mechanism.
4. Trace data and callers before diagnosing a bug.
5. Scale ceremony to reversibility and failure modes.
6. Treat complexity as a limited budget.
7. Use fresh evidence, not intuition, for completion claims.
8. Prefer the nearest established project convention before introducing a new pattern; a deliberate deviation states its reason, impact, and proof.
9. Give each type or module one dominant responsibility; split, merge, or abstract only when responsibilities, dependencies, lifecycle, or likely change reasons materially differ.
10. Evaluate caching, optimization, and concurrency against demonstrated workload or a concrete failure mode; add them only with measurable benefit plus clear ownership, invalidation, and consistency behavior.
11. Optimize for local understanding: a maintainer familiar with the project should be able to identify business intent, key rules, failure paths, and side effects from nearby names and structure.
12. Apply SOLID and platform best practices as decision lenses, not mandatory patterns. A simpler solution is preferred when it preserves correctness, readability, maintainability, contracts, and required performance.

## Capability Map

| Need | Runtime owner | Load when |
|---|---|---|
| Context, route choice, clarification, small-boundary, method lens, skill contract | this file | every `devflow-core` route |
| Reuse, root cause, native, overbuild, debt | `skills/devflow-cut/references/cut-methods.md` | user-selected A/B/C direct entry or Core exception selection |
| Spec or Plan | `skills/devflow-spec/references/spec-plan-methods.md` | A direct Spec / A/B direct Plan or Core exception selection |
| Build minimal change and implementation slices | `skills/devflow-build/references/build-methods.md` | C `CUT_PASS`, approved A/B Plan, or Core exception selection |
| Proof and recovery | `skills/devflow-prove/references/proof-recovery-methods.md` | completed Build direct Prove or Core exception selection |
| Learning-card lifecycle | `skills/devflow-learn/SKILL.md` | Prove PASS review or reusable correction |

## Method 1: Context Map

Declare a read budget before reading, and widen it only by naming why. Every task opens with one line:

```text
Read plan: route pending | <route>; budget <n> files; reading <file — reason>; skipping <file — reason>
```

Budget by route, counted in files read before `Change`:

| Route | Reads before Change | Widen when |
|---|---:|---|
| Problem | 8 | the symptom has more than one candidate entry point, or the fact chain crosses a module boundary |
| Fast | the file the question names, or the one file that answers it | the answer spans more than one file |
| Design-lite | 3 | the touched flow crosses a module boundary |
| Design | 8 | a contract, schema, or caller graph is involved |
| Build | 8 | an approved plan names more anchors than the budget |
| Recovery | 5 | the failure spans more than one module |

Count a read whenever file content enters the context, whichever tool produced it: a direct read, a `cat`/`grep`/`sed`/`awk` that prints file bodies, a script that dumps files, or a subagent's read. Count each file once; re-reading the same file is free. Output that carries no file content does not count: a command's exit code and summary line, or a checker's PASS/FAIL verdict.

The first read happens before the route is known, so that line uses `route pending` and a cap of 3. After the route is selected, re-emit the line only when the cap changes, naming the route it came from.

When the budget is exhausted, stop and report instead of reading on:

```text
Read budget: <n>/<cap> files used; stopping. Known: <established facts>. Missing: <what one more read would settle>. Continue or narrow the request?
```

Read the narrowest useful facts:

1. Project rules and relevant source, tests, commands, and current docs. Locate runnable commands in the project's own manifests, scripts, README, CI config, or knowledge-pack playbook; a command you cannot locate is a named unknown, never an invented verification command.
2. `docs/features/INDEX.md` and `docs/plans/INDEX.md` when present: match the task keywords against the index rows and read only the matched row's entry file or ledger section; an index over 40 rows is filtered with `node scripts/devflow-plan.js --index --query 关键词`. Do not bulk-read capability documents. Missing indexes are non-blocking.
3. `.copilot/LEARNING_INDEX.md`: match `Scope: global` preference cards first (few, cross-project), then `project` cards whose Trigger and Scope match. Apply known preferences and report the count in Activation Evidence.
4. `docs/project-knowledge/AI-START-HERE.md` or `index.md`, then only navigation-selected documents.
5. `graphify-out/GRAPH_REPORT.md` when architecture impact is in scope.
6. Available environment skills; record a matching specialist skill without widening DevFlow scope. For a matched specialist, record the bounded-work contract:

```text
Owner: current DevFlow node
Role: bounded specialist work
Expected evidence: result needed by that node
Return: result / not-applicable / failure facts

The current owner evaluates the return using its existing gate.
```

A specialist result cannot alter depth, approval, direct-success, or Core-return rules; DevFlow remains the lifecycle meta-skill.

Missing indexes or references are non-blocking and must not create storage.

```text
Facts: read/confirmed <files or commands>
Methods: read/confirmed core-methods.md; selected owner references <paths or none>
Knowledge recall: none / learning index + matched card / project knowledge entry + matched docs
Skill Discovery: none / <skill-name> (matched: <why>)
Unknowns: <none or specific unknown>
```

On DeepSeek Harness (DSH), a long autonomous node — a multi-command Problem or Fast investigation, or Prove evidence gathering with no user gate — may persist its objective with the `create_goal` / `update_goal` tools so it survives context compaction. Never use a goal to span the gated creative lifecycle (Brainstorm clarification, Spec or Plan approval stops): those remain explicit user gates.

On DeepSeek Harness code mode (PTC, `run_code`), batch the independent Sense reads above into one program with `Promise.all` (read-only calls may overlap) and `print` only the needed fields instead of dumping full text, so the summary lands in the compaction head. Split into multiple calls when a later read depends on an earlier result. Wrap optional reads — missing indexes or matched cards — in `try/catch` around `ToolCallError` so a missing source stays non-blocking.

## Method 2: Route Precedence And Risk Gate

Evaluate in this order: explicit independent review or explicit grill/stress-test request -> investigation/pure inquiry -> approved scope -> risk gate -> route owner. An explicit grill/stress-test request counts as user-selected Brainstorm clarification and still runs every clarification duty. Keywords are signals, not decisions.

Brainstorm is required for new behavior, ambiguity, cross-module or externally visible impact, irreversible work, security/data-loss/permission/contract risk, or any missing fact that could change the plan. A clear existing-feature change may enter Cut directly only when every low-risk condition holds: clear goal, existing local behavior, one plausible path, local impact, reversible change, no security/data-loss/permission/contract risk, and quick proof. The absence of one condition is enough to keep Brainstorm controlled.

Unapproved edits never use Fast. A skip records `Brainstorm required: no` and `Depth hint: skip`, writes a Design-lite contract (goal, acceptance, exclusions), and enters Cut at Depth C. Compact is only for a Core-sent hint where goal, scope, and acceptance are already clear and one named residual risk remains that is not security, data-loss, permission, contract, or irreversible work. Core never lets Brainstorm choose skip or depth.

Low-risk autonomy compresses clarification; it does not authorize implementation. Cut still checks reuse, native options, overbuild, diff, and scope, and Prove still requires fresh evidence and adversarial review.

## Method 2A: Brainstorm Clarification

When Core selects Brainstorm for creative work — creating features, building components, adding functionality, modifying behavior, or defining an unapproved problem-directed change — load it before implementation. Clear low-risk existing behavior is the only creative-work bypass. Pure Q&A, lookup, verification, investigation-only reports, and already approved changes remain outside this entry gate.

Read minimum facts, send a Semantic Echo-Back, resolve one real uncertainty at a time, and stop after this fixed artifact:

```text
Confirmed request:
- Goal: ...
- Scope: ...
- Out of scope: ...
- Constraints: ...
- Acceptance: ...
- Open questions: ...
- Status: clarified
```

After the fixed summary, Brainstorm presents A/B/C for an explicit user selection. A directly enters Spec; B and C directly enter Cut. Brainstorm never selects the depth itself. All non-success or non-unique artifacts return facts to Core for routing.

## Method 3: Small Request Boundary

Use Fast only for inquiry, verification, or already approved trivial changes; unapproved edits are not Fast. Design-lite is the skip-Brainstorm path for an existing feature after the seven-factor gate passes. Choose full Design when behavior, options, contracts, modules, compatibility, or rollback are unclear. Ask the user to choose when facts cannot distinguish the route.

## Method 4: Method Lens

Select one lens only when it changes execution judgment:

| Lens | Use when | Action |
|---|---|---|
| Root Cause | Bug or regression | Search callers and shared cause before proposing a fix. |
| Working Backwards | Product or workflow ambiguity | Start from a user-visible acceptance result. |
| First Principles Cut | Problem solving, bug fixing, architecture, scope, or abstraction pressure | Reduce to facts, constraints, invariants, and smallest mechanism. |
| Data/Proof | Metrics or verifier-sensitive work | Define evidence and owner before implementation. |
| Operational Owner | Cross-file or release work | Name responsible surface and rollback or follow-through evidence. |

A lens is selected only where it changes judgment, and its result belongs to the node that owns the work: Core records route-level lens reasoning in its activation evidence, and `devflow-cut` runs the First Principles Cut output (facts, constraints, invariants, smallest mechanism) when cause, invariant, or the smallest mechanism is unclear. Naming or selecting a lens without the owning node's result is 已加载, not 已执行 — the receipt carries the lens's actual output.

## Method 15: Skill As Executable Contract

Every skill must state when it applies, concrete actions, artifact or output, stop or return boundary, and verification. Put trigger language in its description. Do not duplicate the full framework in every skill or entry file.

## Shared Output Contracts

Design:

```text
Goal: ...
Motivation: ...
Smallest useful plan: ...
Not doing: ...
Impact: ...
Verification: ...
```

Completion:

```text
Command: ...
Result: ...
Adversarial review: ...
Judgment: PASS / FAIL / BLOCKED
```

Execution receipt (执行回执), the shared per-node visibility contract that every owner references — it adds no gate, no verdict power, and no second form:

```text
执行回执: <节点/适用方法> | <已加载/已执行/不适用/受阻/未执行>
依据与动作: <触发依据；本次具体动作>
结果与证据: <发现/修正/无发现/待验证；实际命令结果、diff、产物片段或人工检查观察>
交接: <既有直接后继，或交 Core 的原因；相关结果的既有载体>
```

Receipt rules:

- Reading a file or loading a skill is only 已加载; 已执行 requires an actual action with a result. Execution完成 is not business acceptance; judgment stays with the original owner.
- 不适用 must name the trigger condition that was not met. When a trigger condition was met but the action did not run, record 未执行 or 受阻 — never relabel it 不适用.
- With a command, record that run's output and exit code; a manual check records the inspected object, the observation, and its basis, marked as human judgment rather than mechanical proof.
- A node may show only the first line plus the trigger basis at start and complete the receipt at handoff, on exceptions, or at key decisions; ordinary intermediate reads are not re-announced. Small tasks run 1-3 receipt lines per relevant node, never a full per-capability checklist.
- Fully existing outputs — the Cut Decision, `METHOD`/`SWITCH`, the Code Review Report, a Learning closure, the six-axis UI scores in proof evidence — are themselves receipts: the summary cites them instead of duplicating a form.
- Receipt content stays in the session receipt, existing `## Progress`, or proof evidence; commit text, product UI, and document bodies keep describing the final result. The receipt itself has no verdict power over approvals, depth, or lifecycle routing.
- In the completion summary, list the applicable capabilities that materially acted with their evidence, plus blocked or not-executed items; request-driven reviews, Audit, and Loop are not re-listed as untriggered.

## Script Path Resolution

Resolve DevFlow checker scripts in this order: `scripts/devflow-<name>.js` in the target project, `~/.codex/scripts/devflow-<name>.js`, then `~/.claude/scripts/devflow-<name>.js`. A missing checker is noted as unavailable; do not search `skills/scripts/`. On DeepSeek Harness (DSH), run the target-project checker through the DSH shell tool as `node scripts/devflow-<name>.js` and resolve a user-level checker at `~/.dsh/scripts/devflow-<name>.js`; DSH has no `~/.codex` or `~/.claude` home.
