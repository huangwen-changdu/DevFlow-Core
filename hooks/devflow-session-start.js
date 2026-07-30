#!/usr/bin/env node
"use strict";

// Keep session injection small; the runtime contract lives in the selected owner skill.
const context = [
  "[DevFlow Core active]",
  "Read AGENTS.md, then load devflow-core for development work.",
  "Core selects Problem, Fast, Design-lite, Design, Build, or Recovery and loads only the selected lifecycle reference.",
  "Creative work — creating features, building components, adding functionality, modifying behavior, or defining an unapproved problem-directed change — enters Brainstorm for a Confirmed request before Core selects later work. Investigation-only reports, pure Q&A, lookup, verification, and approved changes are exceptions.",
  "Use independent adversarial or find-fault review only when explicitly requested. Completion requires Prove evidence and adversarial review.",
  "At Sense, recall only index-matched learning or project-knowledge records; missing stores are non-blocking."
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context
  }
}));
