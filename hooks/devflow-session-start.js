#!/usr/bin/env node
"use strict";

// Keep session injection small; the runtime contract lives in the selected owner skill.
const context = [
  "[DevFlow Core active]",
  "Read AGENTS.md, then load devflow-core for development work.",
  "Core selects Problem, Fast, Design-lite, Design, Build, or Recovery and loads only the selected lifecycle reference.",
  "Problem reports prove facts first. Brainstorm, Spec, Cut, Plan, Build, and PUA return artifacts or facts to Core.",
  "Use independent adversarial or find-fault review only when explicitly requested. Completion requires Prove evidence and adversarial review.",
  "At Sense, recall only index-matched learning or project-knowledge records; missing stores are non-blocking."
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context
  }
}));
