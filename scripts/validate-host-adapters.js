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
  "skills/devflow-cut/SKILL.md",
  "skills/devflow-build/SKILL.md",
  "skills/devflow-prove/SKILL.md",
  "skills/devflow-pua/SKILL.md",
  "skills/devflow-learn/SKILL.md",
  "skills/devflow-audit/SKILL.md"
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
  "commands/devflow-audit.toml"
];

const expectedHooks = [
  "hooks/hooks.json",
  "hooks/devflow-session-start.js",
  ".claude/settings.json",
  ".claude/commands/devflow-core.md"
];

const adapters = [
  {
    name: "Codex / shared agents",
    file: "AGENTS.md",
    terms: ["Sense -> Brainstorm -> Cut -> Shape -> Build -> Prove", "problem report", "devflow-pua", "Completion proof"]
  },
  {
    name: "Claude Code",
    file: "CLAUDE.md",
    terms: ["devflow-core", "devflow-pua", "AGENTS.md", "Required completion proof"]
  },
  {
    name: "Claude Code hooks",
    file: "hooks/hooks.json",
    terms: ["SessionStart", "devflow-session-start.js", "CLAUDE_PLUGIN_ROOT"]
  },
  {
    name: "Claude project hook settings",
    file: ".claude/settings.json",
    terms: ["SessionStart", "node hooks/devflow-session-start.js"]
  },
  {
    name: "Claude DevFlow command",
    file: ".claude/commands/devflow-core.md",
    terms: ["skills/devflow-core/SKILL.md", "skills/devflow-brainstorm/SKILL.md", "skills/devflow-pua/SKILL.md", "methodology-router.md", "methodology-library.md", "flavor-display.md", "restart `skills/devflow-brainstorm/SKILL.md`", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "different/opposite method", "缺漏", "少了", "少个", "有问题", "不对", "写错了", "Ask exactly one smallest blocking question"]
  },
  {
    name: "GitHub Copilot",
    file: ".github/copilot-instructions.md",
    terms: ["AGENTS.md", "Sense", "Brainstorm", "Cut", "Prove", "changed wrong", "restart devflow-brainstorm", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "缺漏", "少了", "少个", "有问题", "不对", "写错了", "Never claim done without proof"]
  },
  {
    name: "VS Code instruction",
    file: ".github/instructions/devflow.instructions.md",
    terms: ["Every platform entry must preserve the same core contract", "Sense", "Brainstorm", "Cut", "Prove", "devflow-pua", "restart `devflow-brainstorm`", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "缺漏", "少了", "少个", "有问题", "不对", "写错了", "npm test"]
  },
  {
    name: "VS Code prompt",
    file: ".github/prompts/devflow.prompt.md",
    terms: ["Select route: Fast, Design-lite, Design, Build, or Recovery", "Problem: Sense -> Prove facts", "devflow-pua", "restart `devflow-brainstorm`", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "缺漏", "少了", "少个", "有问题", "不对", "写错了", "Root-Cause Check"]
  },
  {
    name: "CodeBuddy",
    file: ".codebuddy/rules/devflow-core/RULE.mdc",
    terms: ["Sense -> Brainstorm -> Cut -> Shape -> Build -> Prove", "devflow-pua", "restart `devflow-brainstorm`", "User-view miss", "Satisfaction gap", "METHOD: {flavor} / {method}", "methodology-library", "different/opposite method", "缺漏", "少了", "少个", "有问题", "不对", "写错了", "Authoritative method source", "PASS / FAIL / BLOCKED"]
  }
];

for (const adapter of adapters) {
  assertTerms(adapter.name, read(adapter.file), adapter.terms);
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
const projectHookConfig = JSON.parse(read(".claude/settings.json"));
assert(hookConfig.hooks?.SessionStart?.length > 0, "hooks/hooks.json must register SessionStart");
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
  hookPayload.hookSpecificOutput?.additionalContext?.includes("devflow-pua"),
  "devflow-session-start.js must inject pressure recovery context"
);

const gemini = JSON.parse(read("gemini-extension.json"));
assert(gemini.contextFileName === "AGENTS.md", "gemini-extension.json must point to AGENTS.md");

for (const skill of expectedSkills) {
  assert(gemini.skills?.includes(skill), `gemini-extension.json missing skill: ${skill}`);
}

console.log("Host Adapter Verification Report");
console.log(`Adapters checked: ${adapters.length + 2}`);
console.log("Entrypoints: AGENTS, CLAUDE, Claude hooks, Copilot, VS Code instruction, VS Code prompt, CodeBuddy, plugin manifest, Gemini metadata");
console.log(`Skills checked: ${expectedSkills.length}`);
console.log(`Commands checked: ${expectedCommands.length}`);
console.log(`Hooks checked: ${expectedHooks.length}`);
