#!/usr/bin/env node
"use strict";

const context = [
  "[DevFlow Core active]",
  "Use the lightest safe route: Problem, Fast, Design-lite, Design, Build, or Recovery.",
  "Start normal development work with devflow-core when skills are available.",
  "At Sense, probe existing .copilot/LEARNING_INDEX.md and docs/project-knowledge/; progressively load only matched cards or navigation-selected knowledge documents. Missing locations are non-blocking and do not create storage.",
  "For requirements or ambiguity, use Brainstorm only to clarify before coding: apply its Understanding Revision Rule when a correction changes the request; after its Confirmed request summary, devflow-core decides whether Spec design work is needed. Spec compares approaches, writes and confirms the design contract, then returns the confirmed Spec to Core; Cut and Plan likewise return their decisions to Core; Core alone selects any required Cut, Plan, Build, or Prove work; before claiming done, run Prove.",
  "Saved specs default to docs/specs/YYYY-MM-DD-<short-kebab-name>.md and plans to docs/plans/YYYY-MM-DD-<short-kebab-name>.md from the current target project root.",
  "Problem reports without an explicit fix request need Sense -> Prove facts before edits.",
  "For problem solving, bug fixing, and architecture design, use First Principles Cut when the cause, constraint, invariant, abstraction, or smallest correct mechanism is unclear; reduce to facts, constraints, and invariants before selecting a solution.",
  "Before completing development work, run adversarial review against acceptance criteria, touched files, likely regressions, activation paths, and proof coverage; a real gap means FAIL or continued work before completion.",
  "When the user explicitly requests independent deep adversarial review, red-team review, 对抗审查, or 升级版对抗审查, load devflow-adversarial directly. When the user explicitly requests find-fault review, biggest omission, blind spot, least-certain point, 找茬, 最大遗漏, 没有意识到什么, or 最没有把握, load devflow-find-fault directly. Both are manual at any stage and do not read, require, modify, or hand off to lifecycle skills or completion state.",
  "When the user repeatedly points out that the same function, result, or requested capability has a problem in one task lifecycle, stop, use devflow-pua, read its local methodology-router/methodology-library/flavor-display references, classify the user-view miss, show `METHOD: {flavor} / {method}`, quarantine old context, return recovery facts to Core, and switch to a different/opposite method after method failure. Core decides whether Brainstorm must re-confirm the request and selects later lifecycle work.",
  "Completion proof must include Command, Result, Adversarial review, and Judgment: PASS / FAIL / BLOCKED."
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context
  }
}));
