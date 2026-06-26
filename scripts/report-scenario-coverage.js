const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceRel = "skills/devflow-prove/references/flow-self-test.md";
const sourcePath = path.join(root, sourceRel);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function parseScenarios(body) {
  const headingPattern = /^## Scenario ([^\n]+)$/gm;
  const matches = [...body.matchAll(headingPattern)];

  return matches.map((match, index) => {
    const title = `Scenario ${match[1].trim()}`;
    const start = match.index;
    const end = matches[index + 1]?.index ?? body.length;
    return {
      title,
      body: body.slice(start, end)
    };
  });
}

const layerRules = [
  {
    name: "Prompt Surface",
    minScenarioCount: 3,
    suggestion: "Add a host-specific prompt-surface scenario for Copilot, Claude, or command metadata drift.",
    terms: ["AGENTS.md", "skill descriptions", "command prompts", "Codex Trigger Surface", "Design output"]
  },
  {
    name: "Loop/Recovery",
    minScenarioCount: 3,
    suggestion: "Add a repeated verification failure scenario that requires changing approach after a failed proof.",
    terms: ["Recovery", "re-route", "Repeated Failure", "user correction", "different approach", "do not silently implement"]
  },
  {
    name: "Harness/Validation",
    minScenarioCount: 3,
    suggestion: "Add a failing validation scenario only when the harness starts reporting exit codes by class.",
    terms: ["PASS", "FAIL", "BLOCKED", "npm test", "validation", "command", "Pass check"]
  },
  {
    name: "Context",
    minScenarioCount: 3,
    suggestion: "Add a project-memory or graph/context lookup scenario when those inputs become first-class.",
    terms: ["read current project context", "read relevant project facts", "facts", "Search existing helpers", "callers/references"]
  },
  {
    name: "Memory/Learning",
    minScenarioCount: 3,
    suggestion: "Add a scenario where a new reusable pitfall card must be created and indexed.",
    terms: ["devflow-learn", "LEARNING_INDEX", "learning closure", "matched card", "Next action"]
  },
  {
    name: "Eval/Verifier",
    minScenarioCount: 3,
    suggestion: "Add an external verifier or candidate_pass boundary scenario before publishing verifier claims.",
    terms: ["devflow-prove", "proof", "prove", "Completion Claim", "fresh verification", "self-test"]
  },
  {
    name: "Orchestration/Slices",
    minScenarioCount: 3,
    suggestion: "Add an optional reviewer/subagent handoff scenario when orchestration enters the default pack.",
    terms: ["Skill path", "Implementation Slices", "handoff", "Slice 1", "Multi-File"]
  }
];

function layerMatches(scenario) {
  return layerRules
    .filter((layer) => layer.terms.some((term) => scenario.body.includes(term)))
    .map((layer) => layer.name);
}

assert(fs.existsSync(sourcePath), `Missing scenario source: ${sourceRel}`);

const scenarios = parseScenarios(read(sourceRel)).map((scenario) => ({
  ...scenario,
  layers: layerMatches(scenario)
}));

assert(scenarios.length > 0, "No scenarios found in flow self-test");

for (const scenario of scenarios) {
  assert(scenario.layers.length > 0, `${scenario.title} is not mapped to any architecture layer`);
}

const uncoveredLayers = layerRules
  .filter((layer) => scenarios.every((scenario) => !scenario.layers.includes(layer.name)))
  .map((layer) => layer.name);

assert(uncoveredLayers.length === 0, `Uncovered architecture layers: ${uncoveredLayers.join(", ")}`);

console.log("Scenario Coverage Report");
console.log(`Source: ${sourceRel}`);
console.log(`Total scenarios: ${scenarios.length}`);
console.log("");
console.log("Architecture layers:");

const layerCoverage = layerRules.map((layer) => {
  const covered = scenarios.filter((scenario) => scenario.layers.includes(layer.name));
  return {
    ...layer,
    covered
  };
});

for (const layer of layerCoverage) {
  console.log(`- ${layer.name}: ${layer.covered.length} scenario(s)`);
  console.log(`  ${layer.covered.map((scenario) => scenario.title).join("; ")}`);
}

console.log("");
console.log("Scenario map:");

for (const scenario of scenarios) {
  console.log(`- ${scenario.title}: ${scenario.layers.join(", ")}`);
}

const weakLayers = layerCoverage.filter((layer) => layer.covered.length < layer.minScenarioCount);

console.log("");
console.log("Weak layers:");

if (weakLayers.length === 0) {
  console.log("- none");
} else {
  for (const layer of weakLayers) {
    console.log(`- ${layer.name}: ${layer.covered.length}/${layer.minScenarioCount} scenario(s)`);
  }
}

console.log("");
console.log("Suggested next scenarios:");

if (weakLayers.length === 0) {
  console.log("- none");
} else {
  for (const layer of weakLayers) {
    console.log(`- ${layer.name}: ${layer.suggestion}`);
  }
}
