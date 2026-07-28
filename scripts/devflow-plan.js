const fs = require("node:fs");

const requiredGlobalFields = ["Goal", "Architecture", "Tech Stack", "Source", "Spec coverage"];
const requiredTaskFields = ["Task", "Files", "Interfaces", "Steps", "Acceptance", "Verify", "Comments", "Not doing"];
const allFields = [...requiredGlobalFields, ...requiredTaskFields];

const fieldPatterns = Object.fromEntries(
  allFields.map((field) => [field, new RegExp(`^\\s*(?:\\*\\*)?${field}(?:\\*\\*)?\\s*:`, "im")])
);

const unresolvedPatterns = [/\bTODO\b/i, /\bTBD\b/i, /\bcoming soon\b/i, /\?\?\?/, /<[^>\n]+>/];
const vaguePatterns = [/\badd tests\b/i, /\bhandle edge cases\b/i, /\bmake it work\b/i, /\bclean up\b/i, /\brefactor as needed\b/i, /\bsimilar to Task\b/i];
const fileOperationPattern = /^\s*-\s*(Create|Modify|Test):\s+([^|\n]+?)\s*\|\s*(\S.*)$/im;
const checkboxPattern = /^\s*-\s*\[ \]\s+(.+)$/gim;
const concreteStepPattern = /(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+|`[^`]+`|\b(?:node|npm|git)\b|\b(?:function|class|method|API|command|behavior|symbol)\b/i;

/** Print the checker command contract and default plan landing. */
function usage() {
  console.log("Usage: node scripts/devflow-plan.js [plan-file] [--self-test]");
  console.log("Checks whether a DevFlow Plan Pack has an executable header, task contracts, and plan landing.");
  console.log("Default plan landing is docs/plans/YYYY-MM-DD-<short-kebab-name>.md unless the project documents another plan path.");
}

/** Split a plan at Task fields so each task can be validated independently. */
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
    return { number: index + 1, body: lines.slice(start, end).join("\n") };
  });
}

/** Return matches that indicate an unresolved plan placeholder or vague executable instruction. */
function findMatches(body, patterns) {
  return patterns.flatMap((pattern) => {
    const matches = body.match(pattern);
    return matches ? [matches[0]] : [];
  });
}

/** Extract the text between one structural field and the next structural field. */
function fieldBlock(body, field) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => fieldPatterns[field].test(line));
  if (start < 0) return "";

  const value = lines[start].replace(fieldPatterns[field], "").trim();
  const end = lines.findIndex((line, index) => index > start && allFields.some((name) => fieldPatterns[name].test(line)));
  return [value, ...lines.slice(start + 1, end < 0 ? lines.length : end)].join("\n").trim();
}

/** Validate one task's file operations, interface contract, executable steps, and retained DevFlow fields. */
function checkTask(task) {
  const missing = requiredTaskFields.filter((field) => !fieldPatterns[field].test(task.body));
  const files = fieldBlock(task.body, "Files");
  const interfaces = fieldBlock(task.body, "Interfaces");
  const steps = [...fieldBlock(task.body, "Steps").matchAll(checkboxPattern)].map((match) => match[1]);
  const unresolved = findMatches(task.body, unresolvedPatterns);
  const actionableText = [fieldBlock(task.body, "Task"), fieldBlock(task.body, "Acceptance"), fieldBlock(task.body, "Verify"), ...steps].join("\n");
  const vague = findMatches(actionableText, vaguePatterns);
  const invalidFiles = files
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .filter((line) => !fileOperationPattern.test(line));
  const missingInterfaces = ["Consumes", "Produces"].filter(
    (name) => !new RegExp(`^\\s*-\\s*${name}:\\s+\\S`, "im").test(interfaces)
  );
  const vagueSteps = steps.filter((step) => !concreteStepPattern.test(step));

  return {
    number: task.number,
    missing,
    unresolved,
    vague,
    invalidFiles,
    missingInterfaces,
    insufficientSteps: steps.length < 2,
    vagueSteps,
    ok:
      missing.length === 0 &&
      unresolved.length === 0 &&
      vague.length === 0 &&
      invalidFiles.length === 0 &&
      missingInterfaces.length === 0 &&
      steps.length >= 2 &&
      vagueSteps.length === 0
  };
}

/** Validate global plan headers and all independently scoped task contracts. */
function checkPlan(body) {
  const tasks = splitTasks(body);
  const taskResults = tasks.map(checkTask);
  const missingGlobal = requiredGlobalFields.filter((field) => !fieldPatterns[field].test(body));
  const globalUnresolved = findMatches(body.split(/\r?\nTask:/i)[0], unresolvedPatterns);

  return {
    missingGlobal,
    globalUnresolved,
    tasks: taskResults,
    ok: missingGlobal.length === 0 && globalUnresolved.length === 0 && tasks.length > 0 && taskResults.every((task) => task.ok)
  };
}

/** Keep generated implementation plans out of feature-ledger storage. */
function checkPlanLanding(filePath) {
  if (!filePath) return { ok: true, message: "Plan landing: stdin input, no file path checked" };

  const normalized = filePath.replaceAll("\\", "/");
  const isDocsPlans = /(^|\/)docs\/plans\/[^/]+\.md$/i.test(normalized);
  const isFeatureLedger = /(^|\/)docs\/features\/[^/]+\.md$/i.test(normalized);

  if (isDocsPlans) return { ok: true, message: "Plan landing: ok docs/plans/YYYY-MM-DD-<short-kebab-name>.md" };
  if (isFeatureLedger) {
    return { ok: false, message: "Plan landing: docs/features is for feature ledgers; put implementation plans under docs/plans/YYYY-MM-DD-<short-kebab-name>.md" };
  }
  return { ok: true, message: "Plan landing: warning expected docs/plans/YYYY-MM-DD-<short-kebab-name>.md unless this project has a documented plan path" };
}

/** Print actionable field-level failures rather than a generic plan rejection. */
function report(body, filePath) {
  const result = checkPlan(body);
  const landing = checkPlanLanding(filePath);

  console.log("DevFlow plan pack report");
  console.log(landing.message);
  for (const field of requiredGlobalFields) console.log(`${field}: ${result.missingGlobal.includes(field) ? "missing" : "ok"}`);
  console.log(`Global unresolved markers: ${result.globalUnresolved.join(", ") || "none"}`);
  console.log(`Tasks: ${result.tasks.length}`);
  if (result.tasks.length === 0) console.log("Missing: at least one Task field");

  for (const task of result.tasks) {
    const issues = [
      ...task.missing.map((field) => `missing ${field}`),
      ...task.unresolved.map((match) => `unresolved ${match}`),
      ...task.vague.map((match) => `vague ${match}`),
      ...task.invalidFiles.map((line) => `unclassified file ${line}`),
      ...task.missingInterfaces.map((field) => `missing interface ${field}`),
      ...(task.insufficientSteps ? ["fewer than two checkbox Steps"] : []),
      ...task.vagueSteps.map((step) => `vague step ${step}`)
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

/** Read a named plan file or allow pipeline input for ad-hoc validation. */
function readInput(args) {
  const targetArg = args.find((arg) => !arg.startsWith("-"));
  return targetArg ? fs.readFileSync(targetArg, "utf8") : fs.readFileSync(0, "utf8");
}

/** Exercise accepted and rejected forms of the static plan contract without fixture files. */
function selfTest() {
  const validPlan = [
    "Goal: Validate a plan contract",
    "Architecture: Static Node checker",
    "Tech Stack: Node.js",
    "Source: docs/specs/2026-07-14-add-plan-scanner.md",
    "Spec coverage: Requirements map to Task 1",
    "Task: Add plan scanner",
    "Files:",
    "- Modify: scripts/devflow-plan.js | parse executable task contracts",
    "Interfaces:",
    "- Consumes: Plan Markdown",
    "- Produces: PASS or named structural failures",
    "Steps:",
    "- [ ] Modify `scripts/devflow-plan.js` checkTask so complete contracts pass",
    "- [ ] Run `node scripts/devflow-plan.js --self-test` and expect a pass banner",
    "Acceptance: reports PASS for complete task fields",
    "Verify: node scripts/devflow-plan.js --self-test",
    "Comments: checkTask has a function comment explaining task-boundary validation.",
    "Not doing: generating plans or judging architecture"
  ].join("\n");
  const missingInterfacePlan = validPlan.replace("- Produces: PASS or named structural failures\n", "");
  const unclassifiedFilePlan = validPlan.replace("- Modify: scripts/devflow-plan.js | parse executable task contracts", "- scripts/devflow-plan.js");
  const insufficientStepsPlan = validPlan.replace("- [ ] Run `node scripts/devflow-plan.js --self-test` and expect a pass banner\n", "");
  const vagueStepPlan = validPlan.replace("- [ ] Modify `scripts/devflow-plan.js` checkTask so complete contracts pass", "- [ ] Make it work");
  const missingFieldPlan = validPlan.replace("Verify: node scripts/devflow-plan.js --self-test\n", "");
  const missingSourcePlan = validPlan.replace("Source: docs/specs/2026-07-14-add-plan-scanner.md\n", "");

  if (!checkPlan(validPlan).ok) throw new Error("Self-test expected valid plan to pass");
  if (checkPlan(missingInterfacePlan).ok) throw new Error("Self-test expected missing interface to fail");
  if (checkPlan(unclassifiedFilePlan).ok) throw new Error("Self-test expected unclassified file to fail");
  if (checkPlan(insufficientStepsPlan).ok) throw new Error("Self-test expected insufficient steps to fail");
  if (checkPlan(vagueStepPlan).ok) throw new Error("Self-test expected vague step to fail");
  if (checkPlan(missingFieldPlan).ok) throw new Error("Self-test expected missing Verify to fail");
  if (checkPlan(missingSourcePlan).ok) throw new Error("Self-test expected missing Source to fail");
  if (!checkPlanLanding("docs/plans/2026-07-14-add-plan-scanner.md").ok) throw new Error("Self-test expected docs/plans landing to pass");
  if (checkPlanLanding("docs/features/add-plan-scanner.md").ok) throw new Error("Self-test expected docs/features plan landing to fail");

  console.log("DevFlow plan self-test passed");
  console.log("Checked executable headers, file-operation categories, interfaces, concrete checkbox steps, retained fields, and plan landing guidance");
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
process.exitCode = report(readInput(args), targetArg);
