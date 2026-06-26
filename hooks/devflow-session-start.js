#!/usr/bin/env node
"use strict";

const context = [
  "[DevFlow Core active]",
  "Use the lightest safe route: Problem, Fast, Design-lite, Design, Build, or Recovery.",
  "Start normal development work with devflow-core when skills are available.",
  "For requirements or ambiguity, use Brainstorm before coding; before adding structure, run Cut; before claiming done, run Prove.",
  "Problem reports without an explicit fix request need Sense -> Prove facts before edits.",
  "If the user challenges the result, says the code is wrong/has a problem/not right/有问题/不对/写错了, or repeated edits miss, stop, use devflow-pua, quarantine old context, restart devflow-brainstorm, ask the desired result, switch approach, then prove.",
  "Completion proof must include Command, Result, and Judgment: PASS / FAIL / BLOCKED."
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context
  }
}));
