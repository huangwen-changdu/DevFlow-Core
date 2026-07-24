const fs = require("node:fs");

const requiredGlobalFields = ["Source", "Spec coverage"];
const requiredTaskFields = ["Task", "Files", "Acceptance", "Verify", "Comments", "Not doing"];

const fieldPatterns = Object.fromEntries(
  [...requiredGlobalFields, ...requiredTaskFields].map((field) => [field, new RegExp(`^\\s*${field}\\s*:`, "im")])
);

const unresolvedPatterns = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /\bcoming soon\b/i,
  /\?\?\?/,
  /<[^>\n]+>/
];

const vaguePatterns = [
  /\badd tests\b/i,
  /\bhandle edge cases\b/i,
  /\bmake it work\b/i,
  /\bclean up\b/i,
  /\brefactor as needed\b/i,
  /\bsimilar to Task\b/i
];

function usage() {
  console.log("Usage: node scripts/devflow-plan.js [plan-file] [--self-test]");
  console.log("Checks whether a DevFlow Plan Pack has source tracing and executable task fields.");
  console.log("Default plan landing is docs/plans/YYYY-MM-DD-<short-kebab-name>.md unless the project documents another plan path.");
}

function splitTasks(body) {
  const lines = body.split(/\r?\n/);
  const taskStarts = [];

  lines.forEach((line, index) => {
    if (fieldPatterns.Task.test(line)) {
      taskStarts.push(index);
    }
  });

  return taskStarts.map((start, index) => {
    const end = taskStarts[index + 1] ?? lines.length;
    return {
      number: index + 1,
      body: lines.slice(start, end).join("\n")
    };
  });
}

function findMatches(body, patterns) {
  return patterns.flatMap((pattern) => {
    const matches = body.match(pattern);
    return matches ? [matches[0]] : [];
  });
}

function checkTask(task) {
  const missing = requiredTaskFields.filter((field) => !fieldPatterns[field].test(task.body));
  const unresolved = findMatches(task.body, unresolvedPatterns);
  const vague = findMatches(task.body, vaguePatterns);

  return {
    number: task.number,
    missing,
    unresolved,
    vague,
    ok: missing.length === 0 && unresolved.length === 0 && vague.length === 0
  };
}

function checkPlan(body) {
  const tasks = splitTasks(body);
  const taskResults = tasks.map(checkTask);
  const missingGlobal = requiredGlobalFields.filter((field) => !fieldPatterns[field].test(body));
  const globalUnresolved = findMatches(body, unresolvedPatterns);
  const globalVague = findMatches(body, vaguePatterns);

  return {
    missingGlobal,
    globalUnresolved,
    globalVague,
    tasks: taskResults,
    ok:
      missingGlobal.length === 0 &&
      globalUnresolved.length === 0 &&
      globalVague.length === 0 &&
      tasks.length > 0 &&
      taskResults.every((task) => task.ok)
  };
}

function checkPlanLanding(filePath) {
  if (!filePath) {
    return { ok: true, message: "Plan landing: stdin input, no file path checked" };
  }

  const normalized = filePath.replaceAll("\\", "/");
  const isDocsPlans = /(^|\/)docs\/plans\/[^/]+\.md$/i.test(normalized);
  const isFeatureLedger = /(^|\/)docs\/features\/[^/]+\.md$/i.test(normalized);

  if (isDocsPlans) {
    return { ok: true, message: "Plan landing: ok docs/plans/YYYY-MM-DD-<short-kebab-name>.md" };
  }

  if (isFeatureLedger) {
    return {
      ok: false,
      message: "Plan landing: docs/features is for feature ledgers; put implementation plans under docs/plans/YYYY-MM-DD-<short-kebab-name>.md"
    };
  }

  return {
    ok: true,
    message: "Plan landing: warning expected docs/plans/YYYY-MM-DD-<short-kebab-name>.md unless this project has a documented plan path"
  };
}

function report(body, filePath) {
  const result = checkPlan(body);
  const landing = checkPlanLanding(filePath);

  console.log("DevFlow plan pack report");
  console.log(landing.message);
  console.log(`Source: ${result.missingGlobal.includes("Source") ? "missing" : "ok"}`);
  console.log(`Spec coverage: ${result.missingGlobal.includes("Spec coverage") ? "missing" : "ok"}`);
  console.log(`Global unresolved markers: ${result.globalUnresolved.join(", ") || "none"}`);
  console.log(`Global vague terms: ${result.globalVague.join(", ") || "none"}`);
  console.log(`Tasks: ${result.tasks.length}`);

  if (result.tasks.length === 0) {
    console.log("Missing: at least one Task field");
  }

  for (const task of result.tasks) {
    const issues = [
      ...task.missing.map((field) => `missing ${field}`),
      ...task.unresolved.map((match) => `unresolved ${match}`),
      ...task.vague.map((match) => `vague ${match}`)
    ];
    console.log(`Task ${task.number}: ${issues.length === 0 ? "ok" : issues.join("; ")}`);
  }

  if (!result.ok || !landing.ok) {
    console.log("Judgment: FAIL");
    return 1;
  }

  console.log("Judgment: PASS");
  return 0;
}

function readInput(args) {
  const targetArg = args.find((arg) => !arg.startsWith("-"));
  if (targetArg) {
    return fs.readFileSync(targetArg, "utf8");
  }
  return fs.readFileSync(0, "utf8");
}

function selfTest() {
  const validPlan = [
    "Source: docs/specs/2026-07-14-add-plan-scanner.md",
    "Spec coverage: Requirements map to Task 1",
    "Task: Add plan scanner",
    "Files: scripts/devflow-plan.js",
    "Acceptance: reports PASS for complete task fields",
    "Verify: node scripts/devflow-plan.js --self-test",
    "Comments: splitTasks needs function-level comment explaining task boundary detection; checkTask needs comment explaining field validation logic.",
    "Not doing: generating plans or judging architecture"
  ].join("\n");
  const missingFieldPlan = [
    "Source: docs/specs/2026-07-14-add-plan-scanner.md",
    "Spec coverage: Requirements map to Task 1",
    "Task: Add plan scanner",
    "Files: scripts/devflow-plan.js",
    "Acceptance: reports PASS for complete task fields",
    "Comments: none — trivial change",
    "Not doing: generating plans"
  ].join("\n");
  const missingSourcePlan = [
    "Task: Add plan scanner",
    "Files: scripts/devflow-plan.js",
    "Acceptance: reports PASS for complete task fields",
    "Verify: node scripts/devflow-plan.js --self-test",
    "Comments: none — trivial change",
    "Not doing: generating plans or judging architecture"
  ].join("\n");
  const vaguePlan = [
    "Source: docs/specs/2026-07-14-add-plan-scanner.md",
    "Spec coverage: similar to Task 1",
    "Task: Clean up later",
    "Files: scripts/devflow-plan.js",
    "Acceptance: make it work",
    "Verify: add tests",
    "Comments: none — trivial change",
    "Not doing: TBD"
  ].join("\n");

  if (!checkPlan(validPlan).ok) {
    throw new Error("Self-test expected valid plan to pass");
  }

  const missingResult = checkPlan(missingFieldPlan);
  if (missingResult.ok || !missingResult.tasks[0].missing.includes("Verify")) {
    throw new Error("Self-test expected missing Verify to fail");
  }

  const missingSourceResult = checkPlan(missingSourcePlan);
  if (missingSourceResult.ok || !missingSourceResult.missingGlobal.includes("Source")) {
    throw new Error("Self-test expected missing Source to fail");
  }

  const vagueResult = checkPlan(vaguePlan);
  if (vagueResult.ok || vagueResult.tasks[0].vague.length === 0 || vagueResult.tasks[0].unresolved.length === 0) {
    throw new Error("Self-test expected vague and unresolved terms to fail");
  }

  const validLanding = checkPlanLanding("docs/plans/2026-07-14-add-plan-scanner.md");
  if (!validLanding.ok) {
    throw new Error("Self-test expected docs/plans landing to pass");
  }

  const badLanding = checkPlanLanding("docs/features/add-plan-scanner.md");
  if (badLanding.ok) {
    throw new Error("Self-test expected docs/features plan landing to fail");
  }

  console.log("DevFlow plan self-test passed");
  console.log("Checked source tracing, spec coverage, task field detection, missing field reporting, vague plan blocking, and plan landing guidance");
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

if (args.includes("--self-test")) {
  selfTest();
  process.exit(0);
}

const targetArg = args.find((arg) => !arg.startsWith("-"));
const body = readInput(args);
process.exitCode = report(body, targetArg);
