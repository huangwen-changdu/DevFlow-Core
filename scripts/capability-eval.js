// Evaluates versioned local capability contracts and command evidence; it is not a model-quality, cost, latency, or live-host benchmark.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const manifestRel = "scripts/capability-eval-scenarios.json";
const scenarioSourceRel = "skills/devflow-prove/references/flow-self-test.md";
const packageRel = "package.json";
const requiredScenarioFields = [
  "id",
  "scenario",
  "layers",
  "expectedRoute",
  "command",
  "scenarioEvidence",
  "commandEvidence",
  "negativeConstraints"
];
const architectureLayers = [
  "Prompt Surface",
  "Loop/Recovery",
  "Harness/Validation",
  "Context",
  "Memory/Learning",
  "Eval/Verifier",
  "Orchestration/Slices"
];

const commandPattern = /^[a-zA-Z0-9][a-zA-Z0-9:_-]*$/;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Extracts exact self-test heading-to-body mappings; unmatched manifest titles fail contract validation.
function parseScenarios(body) {
  const headingPattern = /^## (Scenario [^\n]+)$/gm;
  const matches = [...body.matchAll(headingPattern)];

  return new Map(
    matches.map((match, index) => [
      match[1].trim(),
      body.slice(match.index, matches[index + 1]?.index ?? body.length)
    ])
  );
}

function hasStrings(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.length > 0);
}

// Validates one manifest entry and returns scenario-local contract failures without stopping other scenarios.
function validateEntry(entry, entries, scenarioBodies, scripts) {
  const issues = [];
  const missingFields = requiredScenarioFields.filter((field) => entry?.[field] === undefined || entry[field] === null || entry[field] === "");

  if (missingFields.length > 0) {
    issues.push(`missing fields: ${missingFields.join(", ")}`);
  }

  for (const field of ["id", "scenario", "expectedRoute", "command"]) {
    if (entry?.[field] !== undefined && (typeof entry[field] !== "string" || entry[field].length === 0)) {
      issues.push(`${field} must be a non-empty string`);
    }
  }

  for (const field of ["layers", "scenarioEvidence", "commandEvidence", "negativeConstraints"]) {
    if (entry?.[field] !== undefined && !hasStrings(entry[field])) {
      issues.push(`${field} must be a non-empty string array`);
    }
  }

  if (typeof entry?.id === "string" && entries.filter((candidate) => candidate?.id === entry.id).length > 1) {
    issues.push(`duplicate id: ${entry.id}`);
  }

  const scenarioBody = typeof entry?.scenario === "string" ? scenarioBodies.get(entry.scenario) : undefined;
  if (typeof entry?.scenario === "string" && !scenarioBody) {
    issues.push(`unknown self-test scenario: ${entry.scenario}`);
  }

  if (typeof entry?.command === "string" && !commandPattern.test(entry.command)) {
    issues.push(`invalid npm command: ${entry.command}`);
  }

  if (typeof entry?.command === "string" && !scripts?.[entry.command]) {
    issues.push(`unregistered npm command: ${entry.command}`);
  }

  if (Array.isArray(entry?.layers)) {
    for (const layer of entry.layers) {
      if (!architectureLayers.includes(layer)) {
        issues.push(`unknown architecture layer: ${layer}`);
      }
    }
  }

  if (scenarioBody && hasStrings(entry?.scenarioEvidence)) {
    for (const evidence of entry.scenarioEvidence) {
      if (!scenarioBody.includes(evidence)) {
        issues.push(`missing scenario evidence: ${evidence}`);
      }
    }
  }

  if (scenarioBody && hasStrings(entry?.negativeConstraints)) {
    for (const constraint of entry.negativeConstraints) {
      if (!scenarioBody.includes(constraint)) {
        issues.push(`negative constraint not declared: ${constraint}`);
      }
    }
  }

  return { issues, scenarioBody };
}

// Runs one npm script once per evaluation and returns the exit status plus compact diagnostic output.
function runNpmScript(command) {
  const result = process.platform === "win32"
    ? spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `npm run ${command}`], {
        cwd: root,
        encoding: "utf8"
      })
    : spawnSync("npm", ["run", command], {
        cwd: root,
        encoding: "utf8"
      });
  if (result.error) {
    throw new Error(`cannot run npm command ${command}: ${result.error.message}`);
  }

  const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();

  return {
    status: Number.isInteger(result.status) ? result.status : 1,
    output: output || "no command output",
    error: null
  };
}

function summarize(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.slice(-8).join(" | ");
}

// Aggregates manifest, scenario, and cached command results into one independently reportable scenario status.
function evaluate({ entries, flowSelfTest, scripts, runCommand = runNpmScript }) {
  const scenarioBodies = parseScenarios(flowSelfTest);
  const commands = new Map();

  for (const entry of entries) {
    if (typeof entry?.command === "string" && commandPattern.test(entry.command) && scripts?.[entry.command] && !commands.has(entry.command)) {
      commands.set(entry.command, runCommand(entry.command));
    }
  }

  const results = entries.map((entry, index) => {
    const validation = validateEntry(entry, entries, scenarioBodies, scripts);
    const commandResult = typeof entry?.command === "string" ? commands.get(entry.command) : undefined;
    const issues = [...validation.issues];

    if (commandResult && commandResult.status !== 0) {
      issues.push(`command failed: npm run ${entry.command} (exit ${commandResult.status})`);
    }

    if (commandResult && hasStrings(entry?.commandEvidence)) {
      for (const evidence of entry.commandEvidence) {
        if (!commandResult.output.includes(evidence)) {
          issues.push(`missing command evidence: ${evidence}`);
        }
      }
    }

    return {
      id: typeof entry?.id === "string" && entry.id ? entry.id : `invalid-entry-${index + 1}`,
      scenario: entry?.scenario || "missing scenario",
      expectedRoute: entry?.expectedRoute || "missing route",
      layers: Array.isArray(entry?.layers) ? entry.layers : [],
      command: entry?.command || "missing command",
      status: issues.length === 0 ? "PASS" : "FAIL",
      issues,
      commandResult
    };
  });

  return { results, commands };
}

function printReport(report) {
  console.log("# DevFlow Capability Evaluation Report");
  console.log("");
  console.log("> Boundary: verifies local capability contracts and evidence commands only; it does not benchmark model quality, token, latency, cost, or live host loading.");
  console.log("");
  console.log("## Scenario results");

  for (const result of report.results) {
    console.log("");
    console.log(`### ${result.status} — ${result.id}`);
    console.log(`- Self-test scenario: ${result.scenario}`);
    console.log(`- Expected route: ${result.expectedRoute}`);
    console.log(`- Layers: ${result.layers.join(", ") || "missing"}`);
    console.log(`- Evidence command: \`npm run ${result.command}\``);
    console.log(`- Reproduce: \`npm run ${result.command}\``);

    if (result.commandResult) {
      console.log(`- Command exit: ${result.commandResult.status}`);
      console.log(`- Command output: ${summarize(result.commandResult.output)}`);
    }

    if (result.issues.length > 0) {
      console.log("- Gaps:");
      for (const issue of result.issues) {
        console.log(`  - ${issue}`);
      }
    } else {
      console.log("- Gaps: none");
    }
  }

  console.log("");
  console.log("## Layer coverage");
  for (const layer of architectureLayers) {
    const covered = report.results.filter((result) => result.layers.includes(layer));
    const passed = covered.filter((result) => result.status === "PASS");
    console.log(`- ${layer}: ${passed.length}/${covered.length} PASS`);
  }

  const failures = report.results.filter((result) => result.status !== "PASS");
  console.log("");
  console.log("## Gaps");
  if (failures.length === 0) {
    console.log("- none");
  } else {
    for (const result of failures) {
      console.log(`- ${result.id}: ${result.issues.join("; ")}`);
    }
  }

  console.log("");
  console.log(`**Judgment:** ${failures.length === 0 ? "PASS" : "FAIL"}`);
}

function createValidEntry(overrides = {}) {
  return {
    id: "valid-entry",
    scenario: "Scenario Alpha",
    layers: ["Harness/Validation"],
    expectedRoute: "Fast",
    command: "alpha",
    scenarioEvidence: ["Route: Fast", "must include proof"],
    commandEvidence: ["alpha passed"],
    negativeConstraints: ["must not claim model quality"],
    ...overrides
  };
}

function selfTest() {
  const flowSelfTest = [
    "## Scenario Alpha",
    "Route: Fast",
    "must include proof",
    "must not claim model quality"
  ].join("\n");
  const scripts = { alpha: "node alpha.js", beta: "node beta.js" };
  const callCount = new Map();
  const successRunner = (command) => {
    callCount.set(command, (callCount.get(command) || 0) + 1);
    return { status: 0, output: `${command} passed`, error: null };
  };

  const success = evaluate({
    entries: [createValidEntry(), createValidEntry({ id: "shared-command-entry" })],
    flowSelfTest,
    scripts,
    runCommand: successRunner
  });
  assert(success.results.every((result) => result.status === "PASS"), "Self-test expected valid entries to pass");
  assert(callCount.get("alpha") === 1, "Self-test expected duplicate command execution to be cached");

  const missingField = evaluate({
    entries: [createValidEntry({ commandEvidence: [] })],
    flowSelfTest,
    scripts,
    runCommand: successRunner
  });
  assert(missingField.results[0].status === "FAIL", "Self-test expected missing field to fail");

  const missingNegativeConstraint = evaluate({
    entries: [createValidEntry({ negativeConstraints: ["must not skip verification"] })],
    flowSelfTest,
    scripts,
    runCommand: successRunner
  });
  assert(missingNegativeConstraint.results[0].status === "FAIL", "Self-test expected missing negative constraint to fail");

  const failedCommand = evaluate({
    entries: [createValidEntry()],
    flowSelfTest,
    scripts,
    runCommand: () => ({ status: 7, output: "alpha exploded", error: null })
  });
  assert(failedCommand.results[0].status === "FAIL", "Self-test expected command failure to fail");

  const duplicateId = evaluate({
    entries: [createValidEntry(), createValidEntry()],
    flowSelfTest,
    scripts,
    runCommand: successRunner
  });
  assert(duplicateId.results.every((result) => result.status === "FAIL"), "Self-test expected duplicate IDs to fail");

  console.log("DevFlow capability evaluation self-test passed");
  console.log("Checked complete success, missing fields, negative-constraint failure, command failure, duplicate IDs, and command de-duplication");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) {
    selfTest();
    return 0;
  }

  const entries = JSON.parse(read(manifestRel));
  assert(Array.isArray(entries), `${manifestRel} must contain a JSON array`);
  const packageJson = JSON.parse(read(packageRel));
  const report = evaluate({
    entries,
    flowSelfTest: read(scenarioSourceRel),
    scripts: packageJson.scripts || {}
  });
  printReport(report);
  return report.results.every((result) => result.status === "PASS") ? 0 : 1;
}

try {
  process.exitCode = main();
} catch (error) {
  console.log("# DevFlow Capability Evaluation Report");
  console.log("");
  console.log("> Boundary: verifies local capability contracts and evidence commands only; it does not benchmark model quality, token, latency, cost, or live host loading.");
  console.log("");
  console.log("## Blocked");
  console.log(`- ${error.message}`);
  console.log("");
  console.log("**Judgment:** BLOCKED");
  process.exitCode = 1;
}
