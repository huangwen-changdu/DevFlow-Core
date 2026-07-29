const fs = require("node:fs");

const requiredGlobalFields = ["Goal", "Architecture", "Tech Stack", "Source", "Spec coverage", "External Skills"];
const requiredTaskFields = ["Task", "Task type", "Files", "Interfaces", "Steps", "Acceptance", "Verify", "Comments", "Not doing"];
const codeChangeFields = ["Current behavior", "Target behavior", "Change mechanics", "Call impact"];
const allFields = [...requiredGlobalFields, ...requiredTaskFields, ...codeChangeFields];
const taskTypes = ["Code change", "Documentation-only"];

const fieldPatterns = Object.fromEntries(
  allFields.map((field) => [field, new RegExp(`^\\s*(?:\\*\\*)?${field}(?:\\*\\*)?\\s*:`, "im")])
);

const unresolvedPatterns = [/\bTODO\b/i, /\bTBD\b/i, /\bcoming soon\b/i, /\?\?\?/, /<[^>\n]+>/];
const vaguePatterns = [/\badd tests\b/i, /\bhandle edge cases\b/i, /\bmake it work\b/i, /\bclean up\b/i, /\brefactor as needed\b/i, /\bsimilar to Task\b/i];
const fileOperationPattern = /^\s*-\s*(Create|Modify|Test):\s+([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|\s*(\S.*)$/i;
const checkboxPattern = /^\s*-\s*\[ \]\s+(.+)$/gim;
const concreteStepPattern = /(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+|`[^`]+`|\b(?:node|npm|git)\b|\b(?:function|class|method|API|command|behavior|symbol|anchor)\b/i;
const locationPattern = /^(?:(?:symbol|symbols|anchor|anchors)\s*:\s*)?(?:`[^`]{3,}`(?:\s*,\s*`[^`]{3,}`)*|(?:function|class|method|const|let|var|export|interface|type|enum|heading|section|key|keys)\s+[`#A-Za-z_$][\w.$#:/ -]*|#{1,6}\s+\S.+)$/i;
const implementationVerbPattern = /\b(?:parse|validate|require|reject|map|filter|return|add|remove|replace|insert|delete|set|check|compare|append)\b|(?:增加|添加|解析|验证|拒绝|替换|输出|收集|要求|检查)/;
const genericMechanicsPattern = /^\s*(?:pseudocode|exact replacement)\s*:\s*(?:update|change|modify)\s+(?:it|this|implementation|code)\s*$/i;
const codeActionStepPattern = /\b(?:modify|create|update|replace|insert|delete|remove|add|change|refactor)\b/i;
const mechanicsPattern = /```[\s\S]*?```|\b(?:pseudocode|exact replacement|replace .* with|insert .* before|delete .* after)\b/i;
const verificationCommandPattern = /`[^`]+`|\b(?:node|npm|npx|pnpm|yarn|git)\b/i;
const verificationExpectationPattern = /\b(?:expect|expected|passes|pass|fails|fail|returns|result)\b/i;
const documentationPathPattern = /\.(?:md|mdc|toml|txt)$/i;

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

/** Parse file-operation rows so location and documentation-only rules can be checked consistently. */
function parseFileEntries(files) {
  return files
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => ({ line, match: line.match(fileOperationPattern) }));
}

/** Require code-change file rows to identify a new file or a meaningful stable source location. */
function findUnlocatedCodeFiles(entries) {
  return entries
    .filter(({ match }) => match)
    .filter(({ match }) => {
      const [, operation, , location] = match;
      return operation === "Create" ? location.trim().toLowerCase() !== "new file" : !locationPattern.test(location.trim());
    })
    .map(({ line }) => line);
}

/** Require mechanics markers to contain an executable operation instead of only a label. */
function hasImplementationMechanics(changeMechanics) {
  return (
    mechanicsPattern.test(changeMechanics) &&
    implementationVerbPattern.test(changeMechanics) &&
    !genericMechanicsPattern.test(changeMechanics)
  );
}

/** Require every code-editing checklist item to state its smallest implementation mechanism. */
function findCodeStepsWithoutMechanics(steps) {
  return steps.filter((step) => codeActionStepPattern.test(step) && !mechanicsPattern.test(step));
}

/** Keep the documentation-only exception from bypassing runtime-code plan requirements. */
function findRuntimeFilesInDocumentationTask(entries) {
  return entries
    .filter(({ match }) => match && !documentationPathPattern.test(match[2].trim()))
    .map(({ line }) => line);
}

/** Verify that a static plan states how code changes and how the result will be proven. */
function hasVerificationExpectation(verify) {
  return verificationCommandPattern.test(verify) && verificationExpectationPattern.test(verify);
}

/** Validate one task's file operations, task type, code-level contract, and verification evidence. */
function checkTask(task) {
  const missing = requiredTaskFields.filter((field) => !fieldPatterns[field].test(task.body));
  const files = fieldBlock(task.body, "Files");
  const interfaces = fieldBlock(task.body, "Interfaces");
  const taskType = fieldBlock(task.body, "Task type");
  const changeMechanics = fieldBlock(task.body, "Change mechanics");
  const verify = fieldBlock(task.body, "Verify");
  const steps = [...fieldBlock(task.body, "Steps").matchAll(checkboxPattern)].map((match) => match[1]);
  const unresolved = findMatches(task.body, unresolvedPatterns);
  const actionableText = [fieldBlock(task.body, "Task"), fieldBlock(task.body, "Acceptance"), verify, ...steps].join("\n");
  const vague = findMatches(actionableText, vaguePatterns);
  const fileEntries = parseFileEntries(files);
  const invalidFiles = fileEntries.filter(({ match }) => !match).map(({ line }) => line);
  const missingInterfaces = ["Consumes", "Produces"].filter(
    (name) => !new RegExp(`^\\s*-\\s*${name}:\\s+\\S`, "im").test(interfaces)
  );
  const vagueSteps = steps.filter((step) => !concreteStepPattern.test(step));
  const isCodeChange = taskType === "Code change";
  const isDocumentationOnly = taskType === "Documentation-only";
  const invalidTaskType = !taskTypes.includes(taskType);
  const missingCodeFields = isCodeChange
    ? codeChangeFields.filter((field) => !fieldPatterns[field].test(task.body))
    : [];
  const unlocatedCodeFiles = isCodeChange ? findUnlocatedCodeFiles(fileEntries) : [];
  const codeStepsWithoutMechanics = isCodeChange ? findCodeStepsWithoutMechanics(steps) : [];
  const runtimeFilesInDocumentationTask = isDocumentationOnly ? findRuntimeFilesInDocumentationTask(fileEntries) : [];
  // Documentation-only must declare both interfaces so it cannot silently bypass runtime-code requirements.
  const documentationOnlyInterfaces = isDocumentationOnly && ["Consumes", "Produces"].some(
    (name) => !new RegExp(`^\\s*-\\s*${name}:\\s*documentation-only\\s*$`, "im").test(interfaces)
  );
  // Require substantive mechanics because labels alone leave the implementation decision to Build.
  const missingMechanics = isCodeChange && !hasImplementationMechanics(changeMechanics);
  const incompleteVerification = !hasVerificationExpectation(verify);

  return {
    number: task.number,
    missing,
    unresolved,
    vague,
    invalidFiles,
    missingInterfaces,
    invalidTaskType,
    missingCodeFields,
    unlocatedCodeFiles,
    codeStepsWithoutMechanics,
    runtimeFilesInDocumentationTask,
    documentationOnlyInterfaces,
    missingMechanics,
    incompleteVerification,
    insufficientSteps: steps.length < 2,
    vagueSteps,
    ok:
      missing.length === 0 &&
      unresolved.length === 0 &&
      vague.length === 0 &&
      invalidFiles.length === 0 &&
      missingInterfaces.length === 0 &&
      !invalidTaskType &&
      missingCodeFields.length === 0 &&
      unlocatedCodeFiles.length === 0 &&
      codeStepsWithoutMechanics.length === 0 &&
      runtimeFilesInDocumentationTask.length === 0 &&
      !documentationOnlyInterfaces &&
      !missingMechanics &&
      !incompleteVerification &&
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
      ...(task.invalidTaskType ? ["Task type must be Code change or Documentation-only"] : []),
      ...task.missingCodeFields.map((field) => `missing code-change field ${field}`),
      ...task.unlocatedCodeFiles.map((line) => `missing file symbol/anchor ${line}`),
      ...task.codeStepsWithoutMechanics.map((step) => `code step needs snippet, pseudocode, or exact replacement ${step}`),
      ...task.runtimeFilesInDocumentationTask.map((line) => `documentation-only task has runtime file ${line}`),
      ...(task.documentationOnlyInterfaces ? ["documentation-only task must declare documentation-only interfaces"] : []),
      ...(task.missingMechanics ? ["code change needs code snippet, pseudocode, or exact replacement"] : []),
      ...(task.incompleteVerification ? ["Verify needs command/scenario and expected result"] : []),
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

/** Exercise accepted and rejected forms of the code-level static plan contract without fixture files. */
function selfTest() {
  const validPlan = [
    "Goal: Validate a code-level plan contract",
    "Architecture: Static Node checker",
    "Tech Stack: Node.js",
    "Source: docs/specs/2026-07-14-add-plan-scanner.md",
    "Spec coverage: Requirements map to Task 1",
    "External Skills: none",
    "Task: Add plan scanner",
    "Task type: Code change",
    "Files:",
    "- Modify: scripts/devflow-plan.js | function checkTask | validate code-level task contracts",
    "Interfaces:",
    "- Consumes: checkTask(task: { body: string })",
    "- Produces: { ok: boolean, missing: string[] }",
    "Current behavior: only legacy structural fields are checked",
    "Target behavior: code tasks require location, mechanics, and proof",
    "Change mechanics: pseudocode: parse task type, validate required code fields, report failures",
    "Call impact: node scripts/devflow-plan.js keeps the same CLI contract",
    "Steps:",
    "- [ ] Modify `scripts/devflow-plan.js` function checkTask using pseudocode: require code fields and precise file locations",
    "- [ ] Run `node scripts/devflow-plan.js --self-test` with the valid task and expect DevFlow plan self-test passed",
    "Acceptance: reports PASS for a complete code-level task",
    "Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed",
    "Comments: checkTask has a function comment explaining task-boundary validation.",
    "Not doing: generating plans or judging architecture"
  ].join("\n");
  const validDocumentationPlan = [
    "Goal: Document a plan contract",
    "Architecture: Markdown-only change",
    "Tech Stack: Markdown",
    "Source: approved design",
    "Spec coverage: Documentation requirement maps to Task 1",
    "External Skills: none",
    "Task: Document plan fields",
    "Task type: Documentation-only",
    "Files:",
    "- Modify: README.md | Plan Pack section | describe code-level fields",
    "Interfaces:",
    "- Consumes: documentation-only",
    "- Produces: documentation-only",
    "Steps:",
    "- [ ] Modify `README.md` at Plan Pack section to list the code-level contract",
    "- [ ] Run `node scripts/devflow-plan.js --self-test` and expect the static self-test to pass",
    "Acceptance: README explains the code-level plan fields",
    "Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed",
    "Comments: none — trivial documentation change",
    "Not doing: changing runtime code"
  ].join("\n");
  const genericLocationPlan = validPlan.replace("function checkTask", "abc");
  const missingCurrentBehaviorPlan = validPlan.replace("Current behavior: only legacy structural fields are checked\n", "");
  const missingTargetBehaviorPlan = validPlan.replace("Target behavior: code tasks require location, mechanics, and proof\n", "");
  const missingMechanicsPlan = validPlan.replace("Change mechanics: pseudocode: parse task type, validate required code fields, report failures\n", "");
  const missingCallImpactPlan = validPlan.replace("Call impact: node scripts/devflow-plan.js keeps the same CLI contract\n", "");
  const genericMechanicsPlan = validPlan.replace("pseudocode: parse task type, validate required code fields, report failures", "pseudocode: update it");
  const codeStepWithoutMechanicsPlan = validPlan.replace(
    "- [ ] Modify `scripts/devflow-plan.js` function checkTask using pseudocode: require code fields and precise file locations",
    "- [ ] Modify `scripts/devflow-plan.js` function checkTask"
  );
  const incompleteVerificationPlan = validPlan.replace("Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed", "Verify: run a check");
  const invalidDocumentationTaskPlan = validDocumentationPlan.replace("README.md", "scripts/devflow-plan.js");
  const missingDocumentationInterfacePlan = validDocumentationPlan.replace("- Produces: documentation-only\n", "- Produces: plan documentation\n");
  const missingTaskTypePlan = validPlan.replace("Task type: Code change\n", "");
  const unclassifiedFilePlan = validPlan.replace(
    "- Modify: scripts/devflow-plan.js | function checkTask | validate code-level task contracts",
    "- scripts/devflow-plan.js"
  );
  const insufficientStepsPlan = validPlan.replace(
    "- [ ] Run `node scripts/devflow-plan.js --self-test` with the valid task and expect DevFlow plan self-test passed\n",
    ""
  );
  const vagueStepPlan = validPlan.replace(
    "- [ ] Modify `scripts/devflow-plan.js` function checkTask using pseudocode: require code fields and precise file locations",
    "- [ ] Make it work"
  );
  const missingFieldPlan = validPlan.replace("Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed\n", "");
  const missingSourcePlan = validPlan.replace("Source: docs/specs/2026-07-14-add-plan-scanner.md\n", "");
  const missingExternalSkillsPlan = validPlan.replace("External Skills: none\n", "");

  if (!checkPlan(validPlan).ok) throw new Error("Self-test expected complete code-level plan to pass");
  if (!checkPlan(validDocumentationPlan).ok) throw new Error("Self-test expected documentation-only plan to pass");
  if (checkPlan(genericLocationPlan).ok) throw new Error("Self-test expected generic location to fail");
  if (checkPlan(missingCurrentBehaviorPlan).ok) throw new Error("Self-test expected missing Current behavior to fail");
  if (checkPlan(missingTargetBehaviorPlan).ok) throw new Error("Self-test expected missing Target behavior to fail");
  if (checkPlan(missingMechanicsPlan).ok) throw new Error("Self-test expected missing Change mechanics to fail");
  if (checkPlan(missingCallImpactPlan).ok) throw new Error("Self-test expected missing Call impact to fail");
  if (checkPlan(genericMechanicsPlan).ok) throw new Error("Self-test expected generic mechanics to fail");
  if (checkPlan(codeStepWithoutMechanicsPlan).ok) throw new Error("Self-test expected code step without mechanics to fail");
  if (checkPlan(incompleteVerificationPlan).ok) throw new Error("Self-test expected incomplete verification to fail");
  if (checkPlan(invalidDocumentationTaskPlan).ok) throw new Error("Self-test expected runtime file in documentation-only task to fail");
  if (checkPlan(missingDocumentationInterfacePlan).ok) throw new Error("Self-test expected documentation-only interface to fail");
  if (checkPlan(missingTaskTypePlan).ok) throw new Error("Self-test expected missing Task type to fail");
  if (checkPlan(unclassifiedFilePlan).ok) throw new Error("Self-test expected unclassified file to fail");
  if (checkPlan(insufficientStepsPlan).ok) throw new Error("Self-test expected insufficient steps to fail");
  if (checkPlan(vagueStepPlan).ok) throw new Error("Self-test expected vague step to fail");
  if (checkPlan(missingFieldPlan).ok) throw new Error("Self-test expected missing Verify to fail");
  if (checkPlan(missingSourcePlan).ok) throw new Error("Self-test expected missing Source to fail");
  if (checkPlan(missingExternalSkillsPlan).ok) throw new Error("Self-test expected missing External Skills to fail");
  if (!checkPlanLanding("docs/plans/2026-07-14-add-plan-scanner.md").ok) throw new Error("Self-test expected docs/plans landing to pass");
  if (checkPlanLanding("docs/features/add-plan-scanner.md").ok) throw new Error("Self-test expected docs/features plan landing to fail");

  console.log("DevFlow plan self-test passed");
  console.log("Checked code-level fields, precise file locations, mechanics evidence, verification expectations, documentation-only exception, external-skill declaration, and plan landing guidance");
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
