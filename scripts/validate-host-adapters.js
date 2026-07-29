const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertTerms(label, body, terms) {
  for (const term of terms) {
    assert(body.includes(term), `${label} missing term: ${term}`);
  }
}

const expectedSkills = [
  "skills/devflow-core/SKILL.md",
  "skills/devflow-brainstorm/SKILL.md",
  "skills/devflow-spec/SKILL.md",
  "skills/devflow-plan/SKILL.md",
  "skills/devflow-cut/SKILL.md",
  "skills/devflow-build/SKILL.md",
  "skills/devflow-prove/SKILL.md",
  "skills/devflow-pua/SKILL.md",
  "skills/devflow-learn/SKILL.md",
  "skills/devflow-adversarial/SKILL.md",
  "skills/devflow-find-fault/SKILL.md",
  "skills/devflow-audit/SKILL.md",
  "skills/devflow-brainstorm/references/interview-discipline.md"
];

const expectedCommands = [
  "commands/devflow.toml",
  "commands/devflow-spec.toml",
  "commands/devflow-plan.toml",
  "commands/devflow-review.toml",
  "commands/devflow-debt.toml",
  "commands/devflow-prove.toml",
  "commands/devflow-pua.toml",
  "commands/devflow-learn.toml",
  "commands/devflow-adversarial.toml",
  "commands/devflow-find-fault.toml",
  "commands/devflow-audit.toml"
];

const expectedHooks = [
  "hooks/hooks.json",
  "hooks/devflow-session-start.js",
  ".codex/hooks.json",
  ".claude/settings.json",
  ".claude/commands/devflow-core.md"
];

const adapters = [
  {
    name: "Codex / shared agents",
    file: "AGENTS.md",
    terms: ["Brainstorm clarification", "Understanding Revision Rule", "Confirmed request", "confirmed Spec returns to Core", "problem report", "devflow-pua", "Completion proof", "STOP gates are mandatory", "Skills enforce their own gates", "use First Principles Cut", "run adversarial review against acceptance criteria"]
  },
  {
    name: "Claude Code",
    file: "CLAUDE.md",
    terms: ["devflow-core", "devflow-pua", "AGENTS.md", "Understanding Revision Rule", "confirmed Spec", "Required completion proof"]
  },
  {
    name: "Claude Code hooks",
    file: "hooks/hooks.json",
    terms: ["SessionStart", "devflow-session-start.js", "CLAUDE_PLUGIN_ROOT"]
  },
  {
    name: "Codex project hooks",
    file: ".codex/hooks.json",
    terms: ["SessionStart", "node hooks/devflow-session-start.js"]
  },
  {
    name: "Claude project hook settings",
    file: ".claude/settings.json",
    terms: ["SessionStart", "node hooks/devflow-session-start.js"]
  },
  {
    name: "Claude DevFlow command",
    file: ".claude/commands/devflow-core.md",
    terms: ["skills/devflow-core/SKILL.md", "skills/devflow-brainstorm/SKILL.md", "skills/devflow-pua/SKILL.md", "methodology-router.md", "methodology-library.md", "flavor-display.md", "same function, result, or requested capability", "repeatedly points out", "return recovery facts to `devflow-core`", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "different/opposite method", "Understanding Revision Rule", "confirmed Spec returns to Core", "Confirmed request", "Status: clarified"]
  },
  {
    name: "GitHub Copilot",
    file: ".github/copilot-instructions.md",
    terms: ["AGENTS.md", "Sense", "Brainstorm", "Understanding Revision Rule", "confirmed Spec to Core", "Cut", "Prove", "same function, result, or requested capability", "repeatedly points out", "return recovery facts to Core", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "Never claim done without proof", "First Principles Cut", "perform adversarial review against acceptance criteria"]
  },
  {
    name: "VS Code instruction",
    file: ".github/instructions/devflow.instructions.md",
    terms: ["Every platform entry must preserve the same core contract", "Sense", "Brainstorm", "Understanding Revision Rule", "confirmed Spec returning to Core", "Cut", "Prove", "devflow-pua", "same function, result, or requested capability", "repeatedly points out", "return recovery facts to Core", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "npm test", "First Principles Cut", "require adversarial review against acceptance criteria"]
  },
  {
    name: "VS Code prompt",
    file: ".github/prompts/devflow.prompt.md",
    terms: ["Select route: Fast, Design-lite, Design, Build, or Recovery", "Problem: Sense -> Prove facts", "Understanding Revision Rule", "confirmed Spec returns to Core", "devflow-pua", "same function, result, or requested capability", "repeatedly points out", "return recovery facts to Core", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "Root-Cause Check"]
  },
  {
    name: "CodeBuddy",
    file: ".codebuddy/rules/devflow-core/RULE.mdc",
    terms: ["Brainstorm clarification", "Understanding Revision Rule", "Confirmed request", "confirmed Spec -> Core route", "devflow-pua", "same function, result, or requested capability", "repeatedly points out", "return recovery facts to Core", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "Authoritative method source", "PASS / FAIL / BLOCKED", "STOP gates are mandatory", "First Principles Cut", "run verification and adversarial review against acceptance criteria"]
  }
];

for (const adapter of adapters) {
  assertTerms(adapter.name, read(adapter.file), adapter.terms);
}

for (const [file, terms] of [
  ["AGENTS.md", ["Cut returns its result to Core", "confirmed Plan and any scope-drift facts to Core", "recovery facts"]],
  ["CLAUDE.md", ["Cut Decision", "confirmed Plan", "recovery facts"]],
  [".github/copilot-instructions.md", ["Every Cut result returns to Core", "returns its reviewed, Cut-consistent Plan to Core", "return recovery facts to Core"]],
  [".github/instructions/devflow.instructions.md", ["Cut returning its result to Core", "optional Plan returning its confirmed Plan to Core", "return recovery facts to Core"]],
  [".github/prompts/devflow.prompt.md", ["Every result returns to Core", "return recovery facts to Core"]],
  [".codebuddy/rules/devflow-core/RULE.mdc", ["Cut and Plan likewise return their decisions to Core", "return recovery facts to Core"]],
  [".claude/commands/devflow-core.md", ["Return all Cut results to Core", "return recovery facts to `devflow-core`"]],
  ["hooks/devflow-session-start.js", ["Cut and Plan likewise return their decisions to Core", "return recovery facts to Core"]]
]) {
  assertTerms(`Core-exclusive routing surface ${file}`, read(file), terms);
}

for (const [file, terms] of Object.entries({
  "AGENTS.md": ["devflow-adversarial", "devflow-find-fault"],
  "CLAUDE.md": ["devflow-adversarial", "devflow-find-fault"],
  ".github/copilot-instructions.md": ["devflow-adversarial", "devflow-find-fault"],
  ".github/instructions/devflow.instructions.md": ["devflow-adversarial", "devflow-find-fault"],
  ".github/prompts/devflow.prompt.md": ["devflow-adversarial", "devflow-find-fault"],
  ".codebuddy/rules/devflow-core/RULE.mdc": ["devflow-adversarial", "devflow-find-fault"],
  ".claude/commands/devflow-core.md": ["skills/devflow-adversarial/SKILL.md", "skills/devflow-find-fault/SKILL.md"],
  "hooks/devflow-session-start.js": ["devflow-adversarial", "devflow-find-fault"]
})) {
  assertTerms(`Independent manual review surface ${file}`, read(file), terms);
}

assert(read("AGENTS.md").includes("interview-discipline.md"), "AGENTS.md missing Brainstorm interview discipline surface");
assert(
  read(".claude/commands/devflow-core.md").includes("skills/devflow-brainstorm/references/interview-discipline.md"),
  "Claude DevFlow command missing interview discipline reference"
);
assertTerms("devflow-prove skill", read("skills/devflow-prove/SKILL.md"), [
  "adversarial review",
  "strongest plausible reason",
  "report `FAIL`"
]);
assertTerms("devflow-prove command", read("commands/devflow-prove.toml"), [
  "run adversarial review before completion",
  "Adversarial review:",
  "report FAIL"
]);
for (const [file, terms] of [
  [".github/copilot-instructions.md", ["First Principles Cut", "Adversarial review:"]],
  [".github/instructions/devflow.instructions.md", ["First Principles Cut", "Adversarial review:"]],
  [".github/prompts/devflow.prompt.md", ["First Principles Cut", "Adversarial review:"]],
  [".codebuddy/rules/devflow-core/RULE.mdc", ["First Principles Cut", "Adversarial review:"]],
  [".claude/commands/devflow-core.md", ["First Principles Cut", "Adversarial review:"]],
  ["hooks/devflow-session-start.js", ["First Principles Cut", "adversarial review", "Command, Result, Adversarial review, and Judgment"]]
]) {
  assertTerms(file, read(file), terms);
}

const plugin = JSON.parse(read("plugin.json"));
assert(plugin.entrypoints?.agents === "AGENTS.md", "plugin.json must expose AGENTS.md");
assert(plugin.entrypoints?.claude === "CLAUDE.md", "plugin.json must expose CLAUDE.md");
assert(plugin.entrypoints?.copilot === ".github/copilot-instructions.md", "plugin.json must expose Copilot instructions");
assert(plugin.entrypoints?.codebuddy === ".codebuddy/rules/devflow-core/RULE.mdc", "plugin.json must expose CodeBuddy rule");
assert(plugin.hooks === "hooks/hooks.json", "plugin.json must expose Claude hooks");

for (const skill of expectedSkills) {
  assert(plugin.skills?.includes(skill), `plugin.json missing skill: ${skill}`);
}

for (const command of expectedCommands) {
  assert(plugin.commands?.includes(command), `plugin.json missing command: ${command}`);
}

for (const hook of expectedHooks) {
  assert(fs.existsSync(path.join(root, hook)), `Missing hook artifact: ${hook}`);
}

const hookConfig = JSON.parse(read("hooks/hooks.json"));
const codexHookConfig = JSON.parse(read(".codex/hooks.json"));
const projectHookConfig = JSON.parse(read(".claude/settings.json"));
assert(hookConfig.hooks?.SessionStart?.length > 0, "hooks/hooks.json must register SessionStart");
assert(codexHookConfig.hooks?.SessionStart?.length > 0, ".codex/hooks.json must register SessionStart");
assert(projectHookConfig.hooks?.SessionStart?.length > 0, ".claude/settings.json must register SessionStart");

const hookRun = spawnSync(process.execPath, [path.join(root, "hooks/devflow-session-start.js")], {
  cwd: root,
  encoding: "utf8"
});
assert(hookRun.status === 0, "devflow-session-start.js must run successfully");
const hookPayload = JSON.parse(hookRun.stdout);
assert(
  hookPayload.hookSpecificOutput?.hookEventName === "SessionStart",
  "devflow-session-start.js must emit SessionStart hookSpecificOutput"
);
assert(
  hookPayload.hookSpecificOutput?.additionalContext?.includes("DevFlow Core active"),
  "devflow-session-start.js must inject DevFlow context"
);
assert(
  hookPayload.hookSpecificOutput?.additionalContext?.includes("Spec compares approaches, writes and confirms the design contract, then returns the confirmed Spec to Core"),
  "devflow-session-start.js must inject confirmed-Spec-to-Core routing context"
);
assert(
  hookPayload.hookSpecificOutput?.additionalContext?.includes("devflow-pua"),
  "devflow-session-start.js must inject pressure recovery context"
);

// Drift sentinel: Depth option semantics must live only in the brainstorm skill.
// Other surfaces may mention the Depth Selection Gate, but must not restate the
// full A/B/C option mapping (that duplication is what previously drifted).
const depthSemanticsOwners = [
  "skills/devflow-brainstorm/SKILL.md",
  "skills/skill-call-diagram.md"
];
const depthSemanticsPattern = /3 confirmations/;
for (const file of [
  "AGENTS.md",
  "CLAUDE.md",
  "commands/devflow.toml",
  ".codebuddy/rules/devflow-core/RULE.mdc",
  ".github/copilot-instructions.md",
  ".github/instructions/devflow.instructions.md",
  ".github/prompts/devflow.prompt.md",
  ".claude/commands/devflow-core.md",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-core/references/core-methods.md"
]) {
  if (depthSemanticsOwners.includes(file)) continue;
  assert(
    !depthSemanticsPattern.test(read(file)),
    `${file} restates Depth A/B/C option semantics (e.g. "3 confirmations"); point to skills/devflow-brainstorm/SKILL.md instead`
  );
}

const gemini = JSON.parse(read("gemini-extension.json"));
assert(gemini.contextFileName === "AGENTS.md", "gemini-extension.json must point to AGENTS.md");

for (const skill of expectedSkills) {
  assert(gemini.skills?.includes(skill), `gemini-extension.json missing skill: ${skill}`);
}

console.log("Host Adapter Verification Report");
console.log(`Adapters checked: ${adapters.length + 2}`);
console.log("Entrypoints: AGENTS, CLAUDE, Codex hooks, Claude hooks, Copilot, VS Code instruction, VS Code prompt, CodeBuddy, plugin manifest, Gemini metadata");
console.log(`Skills checked: ${expectedSkills.length}`);
console.log(`Commands checked: ${expectedCommands.length}`);
console.log(`Hooks checked: ${expectedHooks.length}`);
