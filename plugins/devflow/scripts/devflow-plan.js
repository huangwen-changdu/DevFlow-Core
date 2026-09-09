const fs = require("node:fs");
const path = require("node:path");

const requiredGlobalFields = ["Goal", "Architecture", "Tech Stack", "Source", "Spec coverage", "External Skills"];
const requiredTaskFields = ["Task", "Task type", "Files", "Interfaces", "Steps", "Acceptance", "Verify", "Comments", "Not doing"];
const codeChangeFields = ["Current behavior", "Target behavior", "Change mechanics", "Call impact"];
const allFields = [...requiredGlobalFields, ...requiredTaskFields, ...codeChangeFields];
const taskTypes = ["Code change", "Documentation-only"];
// 可选生命周期状态字段：缺失视为 legacy（向后兼容），存在时值域受限；checker 只校验格式，不裁决状态转换。
const validStatuses = ["draft", "approved", "in-progress", "done"];
const statusPattern = /^\s*(?:\*\*)?Status(?:\*\*)?\s*:\s*([^\n]+)/im;

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
// Read-basis / Live anchors：接力执行减少重读的必需交接字段；文档型任务经 checkTask 豁免（仅 Code change 调用 checkPrewalk）。
const handoffExtraFactNames = ["Read-basis", "Live anchors"];
const traceEntryPattern = /^\s*-\s*(Read|Traced|Ran|Edited|Verified):\s*(.+?)\s*→\s*(.+?)\.?\s*$/im;
const futureTracePattern = /\b(?:will|should|need to|plan to|to be done)\b|(?:将|需要|计划|待完成)/i;
const worklistItemPattern = /^\s*-\s*\[ \]\s+(.+)$/gim;
const worklistDetailNames = ["Anchors", "Verify", "Done when"];
const maximumWorklistItems = 12;

// v2 契约（2026-09-10 可用性重构）：计划只保留排序与验收字段；实现改法归 Build。
// 判定：含 `## Progress` 且不含 `Prewalk` 视为 v2；否则走 legacy 分支，旧计划无需迁移。
const v2GlobalFields = ["Goal", "Not doing", "Cut"];
const v2TaskFields = ["Task", "Files", "Change", "Acceptance", "Verify", "Not doing"];
const v2AllFields = [...v2GlobalFields, ...v2TaskFields];
const v2FieldPatterns = Object.fromEntries(
  v2AllFields.map((field) => [field, new RegExp(`^(?:\\*\\*)?${field}(?:\\*\\*)?\\s*:`, "im")])
);
const progressHeadingPattern = /^##\s+Progress\s*$/im;
const progressRowPattern = /^\s*\|\s*(\d+)\s*\|\s*([^|]*)\|\s*(todo|doing|done)\s*\|\s*([^|]*)\|/gim;
const indexStatuses = ["active", "planned", "legacy", "retired"];
const indexPaths = { plans: "docs/plans/INDEX.md", features: "docs/features/INDEX.md" };
// 需求台账：一条需求从确认到落地的唯一记录；opt-out 表示用户显式跳过文档（仍必须有验证证据与原因）。
const requirementPath = "docs/requirements.md";
const requirementStatuses = ["open", "designed", "planned", "built", "landed", "opt-out", "dropped"];
const terminalRequirementStatuses = ["landed", "opt-out", "dropped"];
const promotionConfidence = 0.7;

/** Print the checker command contract and default plan landing. */
function usage() {
  console.log("Usage: node scripts/devflow-plan.js [plan-file] [--index] [--self-test] [--json]");
  console.log("Checks whether a DevFlow Plan Pack has an executable header, task contracts, and plan landing.");
  console.log("v2 plans carry a slim header, per-task Files/Change/Acceptance/Verify/Not doing, and a ## Progress table; legacy plans keep the old contract.");
  console.log("--index checks docs/plans/INDEX.md and docs/features/INDEX.md against the filesystem.");
  console.log("--index --query <keyword> prints only matching index rows for progressive loading; an empty result still exits 0.");
  console.log("--loop prints a read-only loop report: requirement status counts, plan landing rate, feature rows, and promotion candidates.");
  console.log("Default plan landing is docs/plans/YYYY-MM-DD-<short-kebab-name>.md unless the project documents another plan path.");
  console.log("--json prints a single-line machine-readable summary; optional Status header values: " + validStatuses.join(" | "));
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
  const missingFacts = handoffFactNames.concat(handoffExtraFactNames).filter(
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

/** v2 计划判定：新格式带 Progress 表且不含 Prewalk；旧格式继续走 legacy 校验。 */
function detectV2(body) {
  return progressHeadingPattern.test(body) && !/^\s*Prewalk\s*:\s*$/im.test(body);
}

/** Extract one v2 field block; ends at the next v1 or v2 field line. */
function v2FieldBlock(body, field) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => v2FieldPatterns[field].test(line));
  if (start < 0) return "";

  const value = lines[start].replace(v2FieldPatterns[field], "").trim();
  const end = lines.findIndex(
    (line, index) =>
      index > start && (v2AllFields.some((name) => v2FieldPatterns[name].test(line)) || /^#{1,6}\s+\S/.test(line))
  );
  return [value, ...lines.slice(start + 1, end < 0 ? lines.length : end)].join("\n").trim();
}

/** Split a v2 plan at Task fields; the Progress table is not part of any task body. */
function splitTasksV2(body) {
  const lines = body.split(/\r?\n/);
  const progressIndex = lines.findIndex((line) => progressHeadingPattern.test(line));
  const limit = progressIndex < 0 ? lines.length : progressIndex;
  const taskStarts = [];
  lines.forEach((line, index) => {
    if (index < limit && v2FieldPatterns.Task.test(line)) taskStarts.push(index);
  });
  return taskStarts.map((start, index) => {
    const end = taskStarts[index + 1] ?? limit;
    return { number: index + 1, body: lines.slice(start, end).join("\n") };
  });
}

/** Validate one v2 task: files, change intent, acceptance, proof, and exclusion. */
function checkTaskV2(task) {
  const missing = v2TaskFields.filter((field) => !v2FieldPatterns[field].test(task.body));
  const files = v2FieldBlock(task.body, "Files");
  const change = v2FieldBlock(task.body, "Change");
  const verify = v2FieldBlock(task.body, "Verify");
  const notDoing = v2FieldBlock(task.body, "Not doing");
  const fileEntries = parseFileEntries(files);
  const invalidFiles = fileEntries.filter(({ match }) => !match).map(({ line }) => line);
  const unlocatedCodeFiles = findUnlocatedCodeFiles(fileEntries);
  const unresolved = findMatches(task.body, unresolvedPatterns);
  const vague = findMatches([change, v2FieldBlock(task.body, "Acceptance"), verify].join("\n"), vaguePatterns);
  // v2 不强制精确改法；只要求 Change 说出可执行意图，具体实现归 Build。
  const missingChange = !implementationVerbPattern.test(change) || genericMechanicsPattern.test(change);
  const incompleteVerification = !hasVerificationExpectation(verify);

  return {
    number: task.number,
    missing,
    unresolved,
    vague,
    invalidFiles,
    unlocatedCodeFiles,
    missingChange,
    incompleteVerification,
    missingNotDoing: !notDoing,
    ok:
      missing.length === 0 &&
      unresolved.length === 0 &&
      vague.length === 0 &&
      invalidFiles.length === 0 &&
      unlocatedCodeFiles.length === 0 &&
      !missingChange &&
      !incompleteVerification &&
      Boolean(notDoing)
  };
}

/** Validate the v2 plan contract: slim header, task rows, Progress table, and Cut subtraction. */
function checkPlanV2(body) {
  const tasks = splitTasksV2(body);
  const taskResults = tasks.map(checkTaskV2);
  const missingGlobal = v2GlobalFields.filter((field) => !v2FieldPatterns[field].test(body));
  const cutBlock = v2FieldBlock(body, "Cut");
  const missingRejected = !/Rejected\s*:\s*\S/im.test(cutBlock);
  const statusMatch = body.match(statusPattern);
  const status = statusMatch ? statusMatch[1].trim() : "legacy";
  const invalidStatus = statusMatch ? !validStatuses.includes(status) : false;
  const progress = [...body.matchAll(progressRowPattern)].map((match) => ({
    number: Number(match[1]),
    state: match[3],
    evidence: match[4].trim()
  }));
  const missingEvidence = progress.filter((row) => row.state === "done" && (!row.evidence || row.evidence === "-"));
  const progressMismatch = progress.length !== tasks.length;
  const doneStatusNeedsAllDone = status === "done" && progress.some((row) => row.state !== "done");

  return {
    v2: true,
    status,
    invalidStatus,
    missingGlobal,
    cut: { missingRejected },
    tasks: taskResults,
    progress: { count: progress.length, mismatch: progressMismatch, missingEvidence },
    doneStatusNeedsAllDone,
    ok:
      missingGlobal.length === 0 &&
      !missingRejected &&
      !invalidStatus &&
      tasks.length > 0 &&
      taskResults.every((task) => task.ok) &&
      !progressMismatch &&
      missingEvidence.length === 0 &&
      !doneStatusNeedsAllDone
  };
}

/** Read every markdown table in a file as header cells plus data rows, skipping separator rows. */
function readMarkdownTables(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const tables = [];
  let current = [];
  for (const line of lines) {
    if (/^\s*\|/.test(line)) {
      current.push(line.split("|").slice(1, -1).map((cell) => cell.trim()));
      continue;
    }
    if (current.length) {
      tables.push(current);
      current = [];
    }
  }
  if (current.length) tables.push(current);
  return tables
    .map((cells) => cells.filter((row) => !row.every((cell) => /^:?-{2,}:?$/.test(cell))))
    .filter((cells) => cells.length > 1)
    .map((cells) => ({ header: cells[0], rows: cells.slice(1) }));
}

/** Read the first markdown table into its header cells and data rows. */
function readMarkdownTable(filePath) {
  return readMarkdownTables(filePath)[0] || { header: [], rows: [] };
}

/** Resolve named column positions from the table header so a new column cannot shift the checks. */
function columnIndexes(header, names) {
  return Object.fromEntries(names.map((name) => [name, header.findIndex((cell) => cell.includes(name))]));
}

/** Read one index file's data rows, returning an empty list when the index does not exist yet. */
function readIndexRows(root, kind) {
  const filePath = path.join(root, ...indexPaths[kind].split("/"));
  return fs.existsSync(filePath) ? readMarkdownTable(filePath).rows : [];
}

/** Return index rows whose text contains the query, for progressive index loading. */
function matchIndexRows(rows, query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return [];
  return rows.filter((cells) => cells.join(" ").toLowerCase().includes(needle));
}

/** Read the value after a flag, or an empty string when it is absent or looks like another flag. */
function argValue(args, flag) {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] && !args[index + 1].startsWith("-") ? args[index + 1] : "";
}

/** Check docs/plans/INDEX.md and docs/features/INDEX.md against the filesystem. */
function checkIndexes(root) {
  const problems = [];
  const plansDir = path.join(root, "docs", "plans");
  const featuresDir = path.join(root, "docs", "features");
  const plansIndex = path.join(root, ...indexPaths.plans.split("/"));
  const featuresIndex = path.join(root, ...indexPaths.features.split("/"));
  const planFiles = fs.existsSync(plansDir)
    ? fs.readdirSync(plansDir).filter((name) => name.endsWith(".md") && name !== "INDEX.md")
    : [];
  const planRows = readIndexRows(root, "plans");
  const featureRows = readIndexRows(root, "features");
  const plansTable = fs.existsSync(plansIndex) ? readMarkdownTable(plansIndex) : { header: [] };
  const featuresTable = fs.existsSync(featuresIndex) ? readMarkdownTable(featuresIndex) : { header: [] };
  const planCols = columnIndexes(plansTable.header, ["计划", "Status", "落地证据", "功能条目"]);
  const featureCols = columnIndexes(featuresTable.header, ["功能", "Status", "关键文件", "来源计划"]);

  if (planFiles.length > 0 && !fs.existsSync(plansIndex)) {
    problems.push("docs/plans/INDEX.md missing while plan files exist");
  }
  for (const file of planFiles) {
    const rows = planRows.filter((cells) => cells.some((cell) => cell.includes(file)));
    if (rows.length === 0) problems.push(`plan not listed in docs/plans/INDEX.md: ${file}`);
    if (rows.length > 1) problems.push(`plan listed more than once in docs/plans/INDEX.md: ${file}`);
  }
  for (const cells of planRows) {
    const link = cells.find((cell) => cell.includes(".md"));
    const file = link ? (link.match(/([^()/]+\.md)/) || [])[1] : null;
    if (!file) continue;
    if (!planFiles.includes(file)) problems.push(`docs/plans/INDEX.md lists unknown plan: ${file}`);
    const filePath = path.join(plansDir, file);
    if (!fs.existsSync(filePath)) continue;
    const body = fs.readFileSync(filePath, "utf8");
    const statusMatch = body.match(statusPattern);
    const expected = statusMatch ? statusMatch[1].trim() : "legacy";
    const rowStatus = (cells[planCols.Status] || "").trim();
    if (rowStatus && rowStatus !== expected) {
      problems.push(`status mismatch for ${file}: index ${rowStatus} vs file ${expected}`);
    }
    const evidence = (cells[planCols["落地证据"]] || "").trim();
    if (rowStatus === "done" && (!evidence || evidence === "-")) {
      problems.push(`done plan needs landing evidence in docs/plans/INDEX.md: ${file}`);
    }
    const featureCell = (cells[planCols["功能条目"]] || "").trim();
    if (featureCell && featureCell !== "-" && !featureRows.some((row) => (row[featureCols["功能"]] || "").includes(featureCell))) {
      problems.push(`feature entry not found in docs/features/INDEX.md: ${featureCell}`);
    }
  }
  for (const cells of featureRows) {
    const status = (cells[featureCols.Status] || "").trim();
    if (status && !indexStatuses.includes(status)) {
      problems.push(`invalid feature status in docs/features/INDEX.md: ${status}`);
    }
    const files = (cells[featureCols["关键文件"]] || "").split(",").map((value) => value.replaceAll("`", "").trim()).filter((value) => value && value !== "-");
    for (const rel of files) {
      if (!fs.existsSync(path.join(root, rel))) problems.push(`feature file missing: ${rel}`);
    }
    const plan = (cells[featureCols["来源计划"]] || "").replaceAll("`", "").trim();
    if (plan && plan !== "-" && !fs.existsSync(path.join(root, "docs", "plans", plan))) {
      problems.push(`feature source plan missing: ${plan}`);
    }
  }
  const requirementTable = readRequirementTable(root);
  problems.push(
    ...checkRequirementTable(requirementTable.header, requirementTable.rows, (rel) => fs.existsSync(path.join(root, rel)))
  );
  return problems;
}

/** Run the plan and feature index consistency check, or answer a single query. */
function runIndexCheck(json, query) {
  const root = path.resolve(__dirname, "..");
  if (query) {
    const featureMatches = matchIndexRows(readIndexRows(root, "features"), query);
    const planMatches = matchIndexRows(readIndexRows(root, "plans"), query);
    if (json) {
      console.log(JSON.stringify({ checker: "plan-index-query", query, features: featureMatches, plans: planMatches, judgment: "PASS" }));
    } else {
      console.log(`DevFlow index query: ${query}`);
      for (const cells of featureMatches) console.log(`功能行: ${cells.join(" | ")}`);
      for (const cells of planMatches) console.log(`计划行: ${cells.join(" | ")}`);
      console.log(`Matches: ${featureMatches.length + planMatches.length}`);
    }
    return 0;
  }
  const problems = checkIndexes(root);
  if (json) {
    console.log(JSON.stringify({ checker: "plan-index", problems, judgment: problems.length === 0 ? "PASS" : "FAIL" }));
  } else {
    console.log("DevFlow plan and feature index report");
    console.log(`Index files: ${indexPaths.plans} | ${indexPaths.features}`);
    if (problems.length === 0) console.log("Problems: none");
    for (const problem of problems) console.log(`Problem: ${problem}`);
    console.log(`Judgment: ${problems.length === 0 ? "PASS" : "FAIL"}`);
  }
  return problems.length === 0 ? 0 : 1;
}

/** Validate the requirement ledger table: status whitelist, terminal evidence, opt-out reason, artifact paths. */
function checkRequirementTable(header, rows, exists) {
  const problems = [];
  const cols = columnIndexes(header, ["需求", "日期", "落地物", "状态", "证据或跳过"]);
  if (cols["状态"] < 0 || cols["证据或跳过"] < 0) {
    problems.push("docs/requirements.md header must contain 状态 and 证据或跳过 columns");
    return problems;
  }
  for (const cells of rows) {
    const requirement = (cells[cols["需求"]] || "").trim();
    const date = cols["日期"] >= 0 ? (cells[cols["日期"]] || "").trim() : "";
    const status = (cells[cols["状态"]] || "").trim();
    const evidence = (cells[cols["证据或跳过"]] || "").trim();
    if (!requirement) problems.push("requirement row missing 需求 text");
    if (!date) problems.push(`requirement row missing 日期: ${requirement}`);
    if (!requirementStatuses.includes(status)) problems.push(`invalid requirement status: ${status}`);
    if (terminalRequirementStatuses.includes(status) && (!evidence || evidence === "-")) {
      problems.push(`terminal requirement needs evidence: ${requirement}`);
    }
    if (status === "opt-out" && !/原因|reason|skip/i.test(evidence)) {
      problems.push(`opt-out needs a recorded reason: ${requirement}`);
    }
    const artifacts = (cells[cols["落地物"]] || "")
      .split(",")
      .map((value) => value.replaceAll("`", "").trim())
      .filter((value) => value && value !== "-");
    for (const rel of artifacts) {
      if (!exists(rel)) problems.push(`requirement artifact missing: ${rel}`);
    }
  }
  return problems;
}

/** Read the requirement ledger table, selecting the table that carries the ledger columns. */
function readRequirementTable(root) {
  const filePath = path.join(root, ...requirementPath.split("/"));
  if (!fs.existsSync(filePath)) return { header: [], rows: [] };
  const tables = readMarkdownTables(filePath);
  const ledger = tables.find(
    (table) => table.header.some((cell) => cell.includes("状态")) && table.header.some((cell) => cell.includes("证据或跳过"))
  );
  return ledger || tables[0] || { header: [], rows: [] };
}

/** Count requirement statuses and promotion candidates for the read-only loop report. */
function summarizeLoop(root) {
  const { header, rows } = readRequirementTable(root);
  const cols = columnIndexes(header, ["状态", "需求"]);
  const counts = Object.fromEntries(requirementStatuses.map((status) => [status, 0]));
  for (const cells of rows) {
    const status = cols["状态"] >= 0 ? (cells[cols["状态"]] || "").trim() : "";
    if (Object.prototype.hasOwnProperty.call(counts, status)) counts[status] += 1;
  }
  const planRows = readIndexRows(root, "plans");
  const plansWithStatus = planRows.filter((cells) => validStatuses.includes((cells[2] || "").trim()));
  const plansDone = plansWithStatus.filter((cells) => (cells[2] || "").trim() === "done");
  const learningIndex = path.join(root, ".copilot", "LEARNING_INDEX.md");
  const learningTable = fs.existsSync(learningIndex) ? readMarkdownTable(learningIndex) : { header: [], rows: [] };
  const cardCols = columnIndexes(learningTable.header, ["Card", "Confidence"]);
  const candidates = learningTable.rows
    .map((cells) => ({
      name: ((cells[cardCols.Card] || "").match(/\[([^\]]+)\]/) || [])[1] || "",
      confidence: Number((cells[cardCols.Confidence] || "").trim())
    }))
    .filter((card) => card.name && Number.isFinite(card.confidence) && card.confidence >= promotionConfidence);

  return {
    requirements: { total: rows.length, counts },
    plans: { withStatus: plansWithStatus.length, done: plansDone.length },
    features: readIndexRows(root, "features").length,
    candidates
  };
}

/** Run the read-only loop report: requirement counts, plan landing rate, feature rows, promotion candidates. */
function runLoopReport(json) {
  const summary = summarizeLoop(path.resolve(__dirname, ".."));
  const counts = summary.requirements.counts;
  const landingRate = summary.plans.withStatus
    ? Math.round((summary.plans.done / summary.plans.withStatus) * 100)
    : 0;
  if (json) {
    console.log(JSON.stringify({ checker: "devflow-loop", ...summary, landingRate, judgment: "PASS" }));
    return 0;
  }
  console.log("DevFlow loop report");
  console.log(`Requirements: total ${summary.requirements.total} | ${requirementStatuses.map((status) => `${status} ${counts[status]}`).join(" | ")}`);
  console.log(`Plan landing: ${summary.plans.done}/${summary.plans.withStatus} with status (${landingRate}%)`);
  console.log(`Feature rows: ${summary.features}`);
  console.log(`Promotion candidates (confidence >= ${promotionConfidence}): ${summary.candidates.length}`);
  for (const card of summary.candidates) console.log(`  - ${card.name} (${card.confidence})`);
  console.log("Judgment: PASS");
  return 0;
}

/** Dispatch the v2 and legacy plan contracts so old plans keep validating. */
function checkPlan(body) {
  return detectV2(body) ? checkPlanV2(body) : checkPlanLegacy(body);
}

/** Validate global plan headers and all independently scoped task contracts. */
function checkPlanLegacy(body) {
  const fileStructure = checkFileStructure(body);
  const tasks = splitTasks(body);
  const requiresFileStructure = tasks.some((task) => fieldBlock(task.body, "Task type") === "Code change");
  const taskResults = tasks.map((task) => checkTask(task, fileStructure));
  const missingGlobal = requiredGlobalFields.filter((field) => !fieldPatterns[field].test(body));
  const globalUnresolved = findMatches(body.split(/\r?\nTask:/i)[0], unresolvedPatterns);
  const statusMatch = body.match(statusPattern);
  const status = statusMatch ? statusMatch[1].trim() : "legacy";
  const invalidStatus = statusMatch ? !validStatuses.includes(status) : false;

  return {
    missingGlobal,
    globalUnresolved,
    fileStructure,
    requiresFileStructure,
    status,
    invalidStatus,
    tasks: taskResults,
    ok:
      missingGlobal.length === 0 &&
      globalUnresolved.length === 0 &&
      !invalidStatus &&
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
function report(body, filePath, json) {
  const result = checkPlan(body);
  const landing = checkPlanLanding(filePath);
  const judgment = !result.ok || !landing.ok ? "FAIL" : "PASS";

  if (json) {
    console.log(
      JSON.stringify({
        checker: "plan",
        format: result.v2 ? "v2" : "legacy",
        landing: landing.message,
        status: result.status,
        invalidStatus: result.invalidStatus,
        missingGlobal: result.missingGlobal,
        globalUnresolved: result.globalUnresolved || [],
        fileStructure: result.v2 ? "v2" : result.fileStructure.ok ? "ok" : "missing or invalid",
        cut: result.v2 ? { missingRejected: result.cut.missingRejected } : null,
        progress: result.v2
          ? {
              count: result.progress.count,
              mismatch: result.progress.mismatch,
              missingEvidence: result.progress.missingEvidence.length
            }
          : null,
        tasks: result.tasks.map((task) => ({ number: task.number, ok: task.ok })),
        judgment
      })
    );
    return judgment === "PASS" ? 0 : 1;
  }

  console.log("DevFlow plan pack report");
  console.log(landing.message);
  console.log(`Format: ${result.v2 ? "v2" : "legacy"}`);
  console.log(`Status: ${result.invalidStatus ? "invalid" : result.status}`);
  for (const field of result.v2 ? v2GlobalFields : requiredGlobalFields) {
    console.log(`${field}: ${result.missingGlobal.includes(field) ? "missing" : "ok"}`);
  }
  if (result.v2) {
    console.log(`Cut Rejected: ${result.cut.missingRejected ? "missing" : "ok"}`);
    console.log(`Progress rows: ${result.progress.count} (tasks ${result.tasks.length})${result.progress.mismatch ? " mismatch" : ""}`);
    for (const row of result.progress.missingEvidence) console.log(`Progress row ${row.number} is done without evidence`);
    if (result.doneStatusNeedsAllDone) console.log("Status done requires every Progress row done");
  } else {
    console.log(`Global unresolved markers: ${result.globalUnresolved.join(", ") || "none"}`);
    console.log(
      `File Structure: ${
        !result.requiresFileStructure ? "documentation-only exception" : result.fileStructure.ok ? "ok" : "missing or invalid"
      }`
    );
    if (result.requiresFileStructure && !result.fileStructure.ok) {
      console.log(`File Structure invalid rows: ${result.fileStructure.invalidRows.join("; ") || "none"}`);
    }
  }
  console.log(`Tasks: ${result.tasks.length}`);
  if (result.tasks.length === 0) console.log("Missing: at least one Task field");

  for (const task of result.tasks) {
    const issues = result.v2
      ? [
          ...task.missing.map((field) => `missing ${field}`),
          ...task.unresolved.map((match) => `unresolved ${match}`),
          ...task.vague.map((match) => `vague ${match}`),
          ...task.invalidFiles.map((line) => `unclassified file ${line}`),
          ...task.unlocatedCodeFiles.map((line) => `missing file symbol/anchor ${line}`),
          ...(task.missingChange ? ["Change needs an executable intent verb"] : []),
          ...(task.missingNotDoing ? ["missing Not doing exclusion"] : []),
          ...(task.incompleteVerification ? ["Verify needs command/scenario and expected result"] : [])
        ]
      : [
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
    "- Read-basis: scripts/devflow-plan.js.",
    "- Live anchors: scripts/devflow-plan.js / checkTask.",
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

  const missingReadBasisPlan = validPlan.replace("- Read-basis: scripts/devflow-plan.js.\n", "");
  const missingLiveAnchorsPlan = validPlan.replace("- Live anchors: scripts/devflow-plan.js / checkTask.\n", "");

  if (!checkPlan(validPlan).ok) throw new Error("Self-test expected complete code-level plan to pass");
  if (!checkPlan(validDocumentationPlan).ok) throw new Error("Self-test expected documentation-only plan to pass");
  const withValidStatusPlan = validPlan.replace(
    "Goal: Validate a code-level plan contract",
    "Status: approved\nGoal: Validate a code-level plan contract"
  );
  const withInvalidStatusPlan = validPlan.replace(
    "Goal: Validate a code-level plan contract",
    "Status: shipped\nGoal: Validate a code-level plan contract"
  );
  if (!checkPlan(withValidStatusPlan).ok) throw new Error("Self-test expected valid Status to pass");
  if (checkPlan(withInvalidStatusPlan).ok) throw new Error("Self-test expected invalid Status to fail");
  if (checkPlan(validPlan).status !== "legacy") throw new Error("Self-test expected missing Status to stay legacy");
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
  if (checkPlan(missingReadBasisPlan).ok) throw new Error("Self-test expected missing Read-basis handoff fact to fail");
  if (checkPlan(missingLiveAnchorsPlan).ok) throw new Error("Self-test expected missing Live anchors handoff fact to fail");
  if (checkPlan(incompleteWorklistPlan).ok) throw new Error("Self-test expected incomplete structured worklist to fail");
  if (checkPlan(overCapWorklistPlan).ok) throw new Error("Self-test expected over-cap structured worklist to fail");
  if (!checkPlanLanding("docs/plans/2026-07-14-add-plan-scanner.md").ok) throw new Error("Self-test expected docs/plans landing to pass");
  if (checkPlanLanding("docs/features/add-plan-scanner.md").ok) throw new Error("Self-test expected docs/features plan landing to fail");

  const validV2Plan = [
    "Status: approved",
    "Goal: validate the slim v2 plan contract",
    "Not doing: architecture review",
    "Cut: 做 checker | 不做 迁移旧计划 | 复用 既有 self-test | 验证 node scripts/devflow-plan.js | Rejected: 新增独立脚本 — 复用既有 checker",
    "## Tasks",
    "",
    "Task: Add v2 validation",
    "Files:",
    "- Modify: scripts/devflow-plan.js | symbol: `checkPlanV2` | validate the slim contract",
    "Change: add v2 field validation and dispatch",
    "Acceptance: v2 plans pass and legacy plans keep passing",
    "Verify: run `node scripts/devflow-plan.js --self-test` expect exit 0",
    "Not doing: changing legacy validation",
    "",
    "## Progress",
    "",
    "| # | Task | Status | Evidence |",
    "|---|---|---|---|",
    "| 1 | Add v2 validation | todo | - |"
  ].join("\n");
  if (!detectV2(validV2Plan)) throw new Error("Self-test expected v2 detection to pass");
  if (!checkPlan(validV2Plan).ok) throw new Error("Self-test expected valid v2 plan to pass");
  if (checkPlan(validV2Plan.replace(/Rejected:[^\n]*/, "Rejected:")).ok) throw new Error("Self-test expected missing Rejected to fail");
  if (checkPlan(validV2Plan.replace("| 1 | Add v2 validation | todo | - |", "| 1 | Add v2 validation | done | - |")).ok) {
    throw new Error("Self-test expected a done Progress row without evidence to fail");
  }
  if (checkPlan(validV2Plan.replace("| 1 | Add v2 validation | todo | - |", "")).ok) {
    throw new Error("Self-test expected a Progress/task count mismatch to fail");
  }
  if (typeof checkIndexes !== "function") throw new Error("Self-test expected the index checker to exist");
  if (matchIndexRows([["功能A", "计划相关", "x"]], "计划").length !== 1) throw new Error("Self-test expected index query to match a row");
  if (matchIndexRows([["功能A", "计划相关", "x"]], "不存在").length !== 0) throw new Error("Self-test expected index query to miss");
  if (matchIndexRows([["功能A"]], "").length !== 0) throw new Error("Self-test expected an empty index query to match nothing");
  if (argValue(["--index", "--query", "计划"], "--query") !== "计划") throw new Error("Self-test expected --query to read its value");
  if (argValue(["--index", "--query", "--json"], "--query") !== "") throw new Error("Self-test expected --query to reject a flag as its value");

  const requirementHeader = ["日期", "需求", "来源", "深度", "落地物", "状态", "证据或跳过", "更新日"];
  const requirementRows = [
    ["2026-09-10", "已落地需求", "用户请求", "A", "docs/specs/x.md", "landed", "npm test 通过", "2026-09-10"],
    ["2026-09-10", "跳过文档需求", "用户请求", "C", "-", "opt-out", "原因：用户显式跳过", "2026-09-10"]
  ];
  const requirementProblems = checkRequirementTable(requirementHeader, requirementRows, () => true);
  if (requirementProblems.length !== 0) throw new Error(`Self-test expected a valid requirement table to pass: ${requirementProblems.join("; ")}`);
  const badStatus = checkRequirementTable(requirementHeader, [["2026-09-10", "状态非法", "用户请求", "A", "-", "shipped", "证据", "2026-09-10"]], () => true);
  if (badStatus.length === 0) throw new Error("Self-test expected an invalid requirement status to fail");
  const missingEvidence = checkRequirementTable(requirementHeader, [["2026-09-10", "终态无证据", "用户请求", "A", "-", "landed", "-", "2026-09-10"]], () => true);
  if (missingEvidence.length === 0) throw new Error("Self-test expected a terminal requirement without evidence to fail");
  const missingReason = checkRequirementTable(requirementHeader, [["2026-09-10", "跳过无原因", "用户请求", "C", "-", "opt-out", "验证通过", "2026-09-10"]], () => true);
  if (missingReason.length === 0) throw new Error("Self-test expected an opt-out without a reason to fail");
  const missingArtifact = checkRequirementTable(requirementHeader, [["2026-09-10", "落地物不存在", "用户请求", "A", "docs/specs/nope.md", "planned", "-", "2026-09-10"]], () => false);
  if (missingArtifact.length === 0) throw new Error("Self-test expected a missing requirement artifact to fail");

  console.log("DevFlow plan self-test passed");
  console.log("Checked v2 and legacy plan contracts, Progress evidence, Cut Rejected, code-level fields, precise file locations, verification expectations, documentation-only exception, external-skill declaration, and plan landing guidance");
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
if (args.includes("--loop")) {
  process.exit(runLoopReport(args.includes("--json")));
}
if (args.includes("--index")) {
  process.exit(runIndexCheck(args.includes("--json"), argValue(args, "--query")));
}
const targetArg = args.find((arg) => !arg.startsWith("-"));
process.exitCode = report(readInput(args), targetArg, args.includes("--json"));
