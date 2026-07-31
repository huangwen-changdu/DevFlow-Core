#!/usr/bin/env node
"use strict";

// Keep session injection small; skills own execution, Core owns only non-unique routing.
const context = [
  "[DevFlow Core active]",
  "Read AGENTS.md, then load devflow-core for development work.",
  "Core selects only non-unique lifecycle work and loads the selected lifecycle reference.",
  "Creative work enters Brainstorm for a Confirmed request and user-selected A/B/C. Defined success edges are direct; other artifacts return Core. Investigation-only reports, pure Q&A, lookup, verification, and approved changes are exceptions.",
  "Use independent adversarial or find-fault review only when explicitly requested. Completion requires Prove evidence and adversarial review.",
  "At Sense, recall only index-matched learning or project-knowledge records; missing stores are non-blocking."
].join("\n");

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: context
  }
}));
