#!/usr/bin/env node
"use strict";

const context = [
  "[DevFlow Core active]",
  "Use the lightest safe route: Problem, Fast, Design-lite, Design, Build, or Recovery.",
  "Start normal development work with devflow-core when skills are available.",
  "At Sense, probe existing .copilot/LEARNING_INDEX.md and docs/project-knowledge/; progressively load only matched cards or navigation-selected knowledge documents. Missing locations are non-blocking and do not create storage.",
  "For requirements or ambiguity, use Brainstorm before coding; before adding structure, run Cut; before claiming done, run Prove.",
  "Saved specs default to docs/specs/YYYY-MM-DD-<short-kebab-name>.md and plans to docs/plans/YYYY-MM-DD-<short-kebab-name>.md from the current target project root.",
  "Problem reports without an explicit fix request need Sense -> Prove facts before edits.",
  "For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.",
  "Before completing development work, run adversarial review against acceptance criteria, touched files, likely regressions, activation paths, and proof coverage; a real gap means FAIL or continued work before completion.",
  "When the user explicitly requests independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load devflow-adversarial directly. When the user explicitly requests find-fault review, biggest omission, blind spot, least-certain point, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握, load devflow-find-fault directly. Both are manual at any stage and do not read, require, modify, or hand off to lifecycle skills or completion state.",
  "If the user challenges the result, says the code is wrong/has a problem/not right/missing/incomplete/有问题/不对/写错了/少了/少个/缺漏, or repeated edits miss, stop, use devflow-pua, read its local methodology-router/methodology-library/flavor-display references, classify the user-view miss, show `METHOD: {flavor} / {method}`, quarantine old context, restart devflow-brainstorm, switch to a different/opposite method after method failure, then prove.",
  "Completion proof must include Command, Result, Adversarial review, and Judgment: PASS / FAIL / BLOCKED."
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context
  }
}));
