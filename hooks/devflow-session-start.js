#!/usr/bin/env node
"use strict";

const context = [
  "[DevFlow Core active]",
  "Use the lightest safe route: Problem, Fast, Design-lite, Design, Build, or Recovery.",
  "Start normal development work with devflow-core when skills are available.",
  "For requirements or ambiguity, use Brainstorm before coding; before adding structure, run Cut; before claiming done, run Prove.",
  "Problem reports without an explicit fix request need Sense -> Prove facts before edits.",
  "If the user challenges the result, says the code is wrong/has a problem/not right/missing/incomplete/有问题/不对/写错了/少了/少个/缺漏, or repeated edits miss, stop, use devflow-pua, read its local methodology-router/methodology-library/flavor-display references, classify the user-view miss, show `METHOD: {flavor} / {method}`, quarantine old context, restart devflow-brainstorm, switch to a different/opposite method after method failure, then prove.",
  "Completion proof must include Command, Result, and Judgment: PASS / FAIL / BLOCKED."
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context
  }
}));
