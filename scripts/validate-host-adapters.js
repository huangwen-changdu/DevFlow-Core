const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Verifies that one host can route, locate an owner, load or fall back, and prove completion. */
function assertHostContract(contract) {
  const body = read(contract.file);
  for (const [capability, terms] of Object.entries(contract.capabilities)) {
    assert(
      terms.some((term) => body.includes(term)),
      `${contract.name} is missing ${capability}; expected one of: ${terms.join(", ")}`
    );
  }
}

const hosts = [
  {
    name: "Codex/shared fallback",
    file: "AGENTS.md",
    capabilities: {
      route: ["any creative work"],
      brainstorm: ["Brainstorm"],
      owner: ["skills/devflow-core/SKILL.md"],
      loadOrFallback: ["When skills are unavailable"],
      directSuccess: ["A/B/C", "direct success"],
      coreReturn: ["return facts to Core", "return Core"],
      proof: ["devflow-prove", "Judgment: PASS / FAIL / BLOCKED"]
    }
  },
  {
    name: "Claude Code",
    file: "CLAUDE.md",
    capabilities: {
      route: ["AGENTS.md"],
      brainstorm: ["creative work", "devflow-brainstorm"],
      owner: ["skills/devflow-core/SKILL.md"],
      loadOrFallback: ["selected lifecycle reference"],
      directSuccess: ["A/B/C", "directly"],
      coreReturn: ["return to Core"],
      proof: ["devflow-prove"]
    }
  },
  {
    name: "Claude command",
    file: ".claude/commands/devflow-core.md",
    capabilities: {
      route: ["Core routes request entry"],
      brainstorm: ["Before creative work", "devflow-brainstorm"],
      owner: ["skills/devflow-core/SKILL.md"],
      loadOrFallback: ["AGENTS.md"],
      directSuccess: ["A/B/C", "directly"],
      coreReturn: ["return to Core"],
      proof: ["devflow-prove"]
    }
  },
  {
    name: "Claude SessionStart",
    file: "hooks/devflow-session-start.js",
    capabilities: {
      route: ["Core selects only non-unique lifecycle work"],
      brainstorm: ["Creative work", "Brainstorm"],
      owner: ["devflow-core"],
      loadOrFallback: ["selected lifecycle reference"],
      directSuccess: ["A/B/C", "direct"],
      coreReturn: ["return Core"],
      proof: ["Prove evidence"]
    }
  },
  {
    name: "GitHub Copilot",
    file: ".github/copilot-instructions.md",
    capabilities: {
      route: ["AGENTS.md"],
      brainstorm: ["creative work", "devflow-brainstorm"],
      owner: ["skills/devflow-core/SKILL.md"],
      loadOrFallback: ["no-skill fallback"],
      directSuccess: ["A/B/C", "directly"],
      coreReturn: ["return to Core"],
      proof: ["Prove"]
    }
  },
  {
    name: "VS Code instruction",
    file: ".github/instructions/devflow.instructions.md",
    capabilities: {
      route: ["AGENTS.md"],
      brainstorm: ["creative work", "devflow-brainstorm"],
      owner: ["skills/devflow-core/SKILL.md"],
      loadOrFallback: ["host capability"],
      directSuccess: ["A/B/C", "direct"],
      coreReturn: ["return to Core"],
      proof: ["Prove before completion"]
    }
  },
  {
    name: "VS Code prompt",
    file: ".github/prompts/devflow.prompt.md",
    capabilities: {
      route: ["Problem, Fast, Design-lite, Design, Build, or Recovery"],
      brainstorm: ["Before creative work", "devflow-brainstorm"],
      owner: ["skills/devflow-core/SKILL.md"],
      loadOrFallback: ["load `skills/devflow-core/SKILL.md`"],
      directSuccess: ["A/B/C", "direct successes"],
      coreReturn: ["return to Core"],
      proof: ["devflow-prove"]
    }
  },
  {
    name: "CodeBuddy",
    file: ".codebuddy/rules/devflow-core/RULE.mdc",
    capabilities: {
      route: ["AGENTS.md"],
      brainstorm: ["creative work", "devflow-brainstorm"],
      owner: ["skills/devflow-core/SKILL.md"],
      loadOrFallback: ["Without skills"],
      directSuccess: ["A/B/C", "directly"],
      coreReturn: ["return Core"],
      proof: ["Prove before completion"]
    }
  }
];

for (const host of hosts) assertHostContract(host);

const core = read("skills/devflow-core/SKILL.md");
for (const boundary of [
  "A direct success",
  "B direct success",
  "C direct success",
  "CUT_REDUCE",
  "scope drift",
  "BUILD_BLOCKED",
  "recovery facts",
  "Core selects only after"
]) {
  assert(core.includes(boundary), `Core is missing return boundary: ${boundary}`);
}

for (const file of [
  "AGENTS.md",
  ".claude/commands/devflow-core.md",
  ".github/copilot-instructions.md",
  ".github/prompts/devflow.prompt.md"
]) {
  const body = read(file);
  assert(
    body.includes("devflow-adversarial") || body.includes("independent reviews") || body.includes("independent-review"),
    `${file} must expose or delegate independent review routing`
  );
}

const plugin = JSON.parse(read("plugin.json"));
assert(plugin.entrypoints?.agents === "AGENTS.md", "plugin must expose the shared startup prompt");
assert(plugin.entrypoints?.claude === "CLAUDE.md", "plugin must expose Claude startup prompt");
assert(read("hooks/hooks.json").includes("SessionStart"), "plugin hook config must register SessionStart");
assert(read(".codex/hooks.json").includes("node hooks/devflow-session-start.js"), "Codex must register SessionStart");
assert(read(".claude/settings.json").includes("node hooks/devflow-session-start.js"), "Claude must register SessionStart");

console.log("Host Adapter Verification Report");
console.log(`Adapters checked: ${hosts.length}`);
console.log("Capabilities: route, brainstorm, owner, load-or-fallback, proof");
console.log("Judgment: PASS");
