const fs = require("node:fs");

const requiredGlobalFields = ["Goal", "Architecture", "Tech Stack", "Source", "Spec coverage", "External Skills"];
const requiredTaskFields = ["Task", "Task type", "Files", "Interfaces", "Steps", "Acceptance", "Verify", "Comments", "Not doing"];
const codeChangeFields = ["Current behavior", "Target behavior", "Change mechanics", "Call impact"];
const allFields = [...requiredGlobalFields, ...requiredTaskFields, ...codeChangeFields];
const taskTypes = ["Code change", "Documentation-only"];

const fieldPatterns = Object.fromEntries(
  allFields.map((field) => [field, new RegExp(`^(?:\\*\\*)?${field}(?:\\*\\*)?\\s*:`, "im")])
);

const unresolvedPatterns = [/\bTODO\b/i, /\bTBD\b/i, /\bcoming soon\b/i, /\?\?\?/, /<[^>\n]+>/];
const vaguePatterns = [/\badd tests\b/i, /\bhandle edge cases\b/i, /\bmake it work\b/i, /\bclean up\b/i, /\brefactor as needed\b/i, /\bsimilar to Task\b/i];
const fileOperationPattern = /^\s*-\s*(Create|Modify|Test):\s+([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|\s*(\S.*)$/i;
const checkboxPattern = /^\s*-\s*\[ \]\s+(.+)$/gim;
const concreteStepPattern = /(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+|`[^`]+`|\b(?:node|npm|git)\b|\b(?:function|class|method|API|command|behavior|symbol|anchor)\b/i;
const locationPattern = /^(?:(?:symbol|symbols|anchor|anchors)\s*:\s*)?(?:`[^`]{3,}`(?:\s*,\s*`[^`]{3,}`)*|(?:function|class|method|const|let|var|export|interface|type|enum|heading|section|key|keys)\s+[`#A-Za-z_$][\w.$#:/ -]*|#{1,6}\s+\S.+)$/i;
const implementationVerbPattern = /\b(?:parse|validate|require|reject|map|filter|return|add|remove|replace|insert|delete|set|check|compare|append|emit)\b|(?:增加|添加|解析|验证|拒绝|替换|输出|收集|要求|检查)/;
const genericMechanicsPattern = /^\s*(?:pseudocode|exact replacement)\s*:\s*(?:update|change|modify)\s+(?:it|this|implementation|code)\s*$/i;
const codeActionStepPattern = /\b(?:modify|create|update|replace|insert|delete|remove|add|change|refactor)\b/i;
const mechanicsPattern = /```[\s\S]*?```|\b(?:pseudocode|exact replacement|replace .* with|insert .* before|delete .* after)\b/i;
const verificationCommandPattern = /`[^`]+`|\b(?:node|npm|npx|pnpm|yarn|git)\b/i;
const verificationExpectationPattern = /\b(?:expect|expected|passes|pass|fails|fail|returns|result)\b/i;
const documentationPathPattern = /\.(?:md|mdc|toml|txt)$/i;
const fileStructureHeadingPattern = /^##\s+File Structure\s*$/im;
const prewalkPattern = /^\s*Prewalk\s*:\s*$/im;
const prewalkSections = ["Execution Trace", "Current Handoff Facts", "Remaining Structured Worklist"];
const handoffFactNames = ["Target anchors", "Nearby convention", "Direct path", "Current constraints", "Planned touch set", "Risks / stop conditions"];
const traceEntryPattern = /^\s*-\s*(Read|Traced|Ran|Edited|Verified):\s*(.+?)\s*→\s*(.+?)\.?\s*$/im;
const futureTracePattern = /\b(?:will|should|need to|plan to|to be done)\b|(?:将|需要|计划|待完成)/i;
const worklistItemPattern = /^\s*-\s*\[ \]\s+(.+)$/gim;
const worklistDetailNames = ["Anchors", "Verify", "Done when"];
const maximumWorklistItems = 12;

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

/** Extract a Markdown section until the next heading at the same or higher level. */
function headingBlock(body, heading) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^#{1,6}\\s+${heading}\\s*$`, "i").test(line));
  if (start < 0) return "";

  const end = lines.findIndex((line, index) => index > start && /^#{1,6}\s+/.test(line));
  return lines.slice(start + 1, end < 0 ? lines.length : end).join("\n").trim();
}

/** Extract one named handoff subsection before the next named handoff subsection. */
function handoffBlock(prewalk, heading) {
  const lines = prewalk.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^\\s*${heading}\\s*:\\s*$`, "i").test(line));
  if (start < 0) return "";

  const end = lines.findIndex((line, index) =>
    index > start && prewalkSections.some((name) => new RegExp(`^\\s*${name}\\s*:\\s*$`, "i").test(line))
  );
  return lines.slice(start + 1, end < 0 ? lines.length : end).join("\n").trim();
}

/** Validate the global responsibility map without inferring whether its design is correct. */
function checkFileStructure(body) {
  const structure = headingBlock(body, "File Structure");
  const rows = structure
    .split(/\r?\n/)
    .filter((line) => /^\s*\|/.test(line))
    .filter((line) => !/^\s*\|\s*-/.test(line));
  const dataRows = rows.slice(1).filter((line) => line.split("|").length >= 7);
  const invalidRows = dataRows.filter((line) => {
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    return cells.length !== 5 || cells.some((cell) => !cell || /\[|\]/.test(cell));
  });

  return {
    present: fileStructureHeadingPattern.test(body),
    dataRows,
    invalidRows,
    paths: dataRows.map((line) => line.split("|")[1].replaceAll("`", "").trim()),
    ok: fileStructureHeadingPattern.test(body) && dataRows.length > 0 && invalidRows.length === 0
  };
}

function hasHandoffSection(prewalk, heading) {
  return new RegExp(`^\\s*${heading}\\s*:\\s*$`, "im").test(prewalk);
}

/** Validate actual trace evidence, current facts, and bounded unfinished work. */
function checkPrewalk(task) {
  const start = task.body.search(prewalkPattern);
  const prewalk = start < 0 ? "" : task.body.slice(start);
  const trace = handoffBlock(prewalk, "Execution Trace");
  const facts = handoffBlock(prewalk, "Current Handoff Facts");
  const worklist = handoffBlock(prewalk, "Remaining Structured Worklist");
  const traceLines = trace.split(/\r?\n/).filter((line) => line.trim().startsWith("-"));
  const traceEntries = traceLines.map((line) => ({ line, match: line.match(traceEntryPattern) }));
  const invalidTrace = traceEntries
    .filter(({ line, match }) => !match || futureTracePattern.test(line))
    .map(({ line }) => line);
  const actualReadOrTrace = traceEntries.some(({ match }) => match && ["Read", "Traced"].includes(match[1]) && !/^none\b/i.test(match[2]));
  const actualEdit = traceEntries.some(({ match }) => match && match[1] === "Edited" && !/^none\b/i.test(match[2]));
  const actualVerification = traceEntries.some(({ match }) => match && match[1] === "Verified" && !/^none\b/i.test(match[2]));
  const completed = actualEdit && actualVerification;
  const missingFacts = handoffFactNames.filter(
    (name) => !new RegExp(`^\\s*-\\s*${name}:\\s+\\S`, "im").test(facts)
  );
  const items = [...worklist.matchAll(worklistItemPattern)];
  const incompleteWorklist = items
    .map((item, index) => {
      const next = items[index + 1];
      const details = worklist.slice(item.index + item[0].length, next ? next.index : worklist.length);
      const missing = worklistDetailNames.filter(
        (name) => !new RegExp(`^\\s*${name}:\\s+\\S`, "im").test(details)
      );
      const actionable = concreteStepPattern.test(item[1]) && implementationVerbPattern.test(item[1]);
      return { text: item[1], missing, actionable };
    })
    .filter((item) => item.missing.length > 0 || !item.actionable);

  return {
    present: prewalkPattern.test(task.body),
    missingSections: prewalkSections.filter((name) => !hasHandoffSection(prewalk, name)),
    invalidTrace,
    lacksActualReadOrTrace: !actualReadOrTrace,
    missingFacts,
    completed,
    worklistCount: items.length,
    incompleteWorklist,
    ok:
      prewalkPattern.test(task.body) &&
      prewalkSections.every((name) => hasHandoffSection(prewalk, name)) &&
      invalidTrace.length === 0 &&
      actualReadOrTrace &&
      missingFacts.length === 0 &&
      (completed || (items.length > 0 && items.length <= maximumWorklistItems && incompleteWorklist.length === 0))
  };
}

/** Ensure each code-task file is represented in the approved responsibility map. */
function findUnmappedCodeFiles(entries, structurePaths) {
  return entries
    .filter(({ match }) => match)
    .filter(({ match }) => !structurePaths.some((path) => path.includes(match[2].trim())))
    .map(({ line }) => line);
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
function checkTask(task, fileStructure) {
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
  const unmappedCodeFiles = isCodeChange ? findUnmappedCodeFiles(fileEntries, fileStructure.paths) : [];
  const prewalk = isCodeChange ? checkPrewalk(task) : null;
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
    unmappedCodeFiles,
    prewalk,
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
      unmappedCodeFiles.length === 0 &&
      (!isCodeChange || prewalk.ok) &&
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
  const fileStructure = checkFileStructure(body);
  const tasks = splitTasks(body);
  const requiresFileStructure = tasks.some((task) => fieldBlock(task.body, "Task type") === "Code change");
  const taskResults = tasks.map((task) => checkTask(task, fileStructure));
  const missingGlobal = requiredGlobalFields.filter((field) => !fieldPatterns[field].test(body));
  const globalUnresolved = findMatches(body.split(/\r?\nTask:/i)[0], unresolvedPatterns);

  return {
    missingGlobal,
    globalUnresolved,
    fileStructure,
    requiresFileStructure,
    tasks: taskResults,
    ok:
      missingGlobal.length === 0 &&
      globalUnresolved.length === 0 &&
      (!requiresFileStructure || fileStructure.ok) &&
      tasks.length > 0 &&
      taskResults.every((task) => task.ok)
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
  console.log(
    `File Structure: ${
      !result.requiresFileStructure ? "documentation-only exception" : result.fileStructure.ok ? "ok" : "missing or invalid"
    }`
  );
  if (result.requiresFileStructure && !result.fileStructure.ok) {
    console.log(`File Structure invalid rows: ${result.fileStructure.invalidRows.join("; ") || "none"}`);
  }
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
      ...task.unmappedCodeFiles.map((line) => `file missing File Structure responsibility ${line}`),
      ...(task.prewalk ? task.prewalk.missingSections.map((name) => `Prewalk missing ${name}`) : []),
      ...(task.prewalk ? task.prewalk.invalidTrace.map((line) => `invalid Execution Trace ${line}`) : []),
      ...(task.prewalk?.lacksActualReadOrTrace ? ["Prewalk needs actual Read or Traced evidence"] : []),
      ...(task.prewalk ? task.prewalk.missingFacts.map((name) => `Prewalk missing handoff fact ${name}`) : []),
      ...(task.prewalk && task.prewalk.worklistCount === 0 && !task.prewalk.completed ? ["Prewalk needs remaining structured work"] : []),
      ...(task.prewalk && task.prewalk.worklistCount > maximumWorklistItems ? [`Prewalk worklist exceeds ${maximumWorklistItems} items`] : []),
      ...(task.prewalk
        ? task.prewalk.incompleteWorklist.map(
            (item) => `Prewalk incomplete work item ${item.text}: ${item.missing.join(", ") || "needs a concrete action"}`
          )
        : []),
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
    "## File Structure",
    "",
    "| File / symbol | Operation | Responsibility | Why here | Not responsible for |",
    "|---|---|---|---|---|",
    "| `scripts/devflow-plan.js` / `checkTask` | Modify | validate code-level task contracts | existing checker owns validation | architecture judgment |",
    "",
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
    "Not doing: generating plans or judging architecture",
    "",
    "Prewalk:",
    "",
    "Execution Trace:",
    "- Read: `scripts/devflow-plan.js` / `checkTask` → existing validation is flat task-field checking.",
    "- Traced: `report` → CLI prints aggregated task issues.",
    "- Ran: `node scripts/devflow-plan.js --self-test` → baseline self-test command is available.",
    "- Edited: none yet → validator change remains pending.",
    "- Verified: `checkPlan` → current valid plan fixture is accepted.",
    "",
    "Current Handoff Facts:",
    "- Target anchors: `scripts/devflow-plan.js` / `checkTask`.",
    "- Nearby convention: `checkPlan` aggregates issue arrays.",
    "- Direct path: CLI invokes `report`.",
    "- Current constraints: documentation-only tasks stay exempt.",
    "- Planned touch set: `scripts/devflow-plan.js` / `checkTask`.",
    "- Risks / stop conditions: parser boundary contradiction returns to Core.",
    "",
    "Remaining Structured Worklist:",
    "- [ ] Modify `scripts/devflow-plan.js` / `checkTask` using pseudocode: validate handoff fields.",
    "  Anchors: `scripts/devflow-plan.js` / `checkTask`.",
    "  Verify: Run `node scripts/devflow-plan.js --self-test`; expect DevFlow plan self-test passed.",
    "  Done when: handoff failures are reported."
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
  const missingFileStructurePlan = validPlan.replace("## File Structure\n\n| File / symbol | Operation | Responsibility | Why here | Not responsible for |\n|---|---|---|---|---|\n| `scripts/devflow-plan.js` / `checkTask` | Modify | validate code-level task contracts | existing checker owns validation | architecture judgment |\n\n", "");
  const futureTracePlan = validPlan.replace(
    "- Read: `scripts/devflow-plan.js` / `checkTask` → existing validation is flat task-field checking.",
    "- Read: `scripts/devflow-plan.js` / `checkTask` → will inspect validation later."
  );
  const missingTraceResultPlan = validPlan.replace(
    "- Traced: `report` → CLI prints aggregated task issues.",
    "- Traced: `report`"
  );
  const incompleteWorklistPlan = validPlan.replace(
    "  Done when: handoff failures are reported.",
    ""
  );
  const overCapWorklistPlan = validPlan.replace(
    "  Done when: handoff failures are reported.",
    Array.from({ length: 12 }, (_, index) =>
      [
        "  Done when: handoff failures are reported.",
        "- [ ] Modify scripts/devflow-plan.js / checkTask" + index + " using pseudocode: validate handoff fields.",
        "  Anchors: scripts/devflow-plan.js / checkTask" + index + ".",
        "  Verify: Run node scripts/devflow-plan.js --self-test; expect DevFlow plan self-test passed.",
        "  Done when: handoff failures are reported."
      ].join("\n")
    ).join("\n")
  );

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
  if (checkPlan(missingFileStructurePlan).ok) throw new Error("Self-test expected missing File Structure to fail");
  if (checkPlan(futureTracePlan).ok) throw new Error("Self-test expected future-tense trace to fail");
  if (checkPlan(missingTraceResultPlan).ok) throw new Error("Self-test expected trace without observed result to fail");
  if (checkPlan(incompleteWorklistPlan).ok) throw new Error("Self-test expected incomplete structured worklist to fail");
  if (checkPlan(overCapWorklistPlan).ok) throw new Error("Self-test expected over-cap structured worklist to fail");
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
