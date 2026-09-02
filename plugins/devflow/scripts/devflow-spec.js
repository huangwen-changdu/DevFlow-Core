const fs = require("node:fs");

const requiredFields = [
  "Goal",
  "Context",
  "Requirements",
  "Non-goals",
  "Approach",
  "Impact",
  "Acceptance",
  "Verification",
  "Code Documentation",
  "Open Questions"
];

const fieldPatterns = Object.fromEntries(
  requiredFields.map((field) => [field, new RegExp(`^\\s*(?:#+\\s*)?${field}\\s*(?::|$)`, "im")])
);

const unresolvedPatterns = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /\bcoming soon\b/i,
  /\?\?\?/,
  /<[^>\n]+>/
];

const vaguePatterns = [
  /\bhandle edge cases\b/i,
  /\bas needed\b/i,
  /\bdefine later\b/i,
  /\bfigure out\b/i,
  /\bmake it work\b/i
];
// 可选生命周期状态字段：缺失视为 legacy（向后兼容），存在时值域受限；checker 只校验格式，不裁决状态转换。
const validStatuses = ["draft", "approved", "in-progress", "done"];
const statusPattern = /^\s*(?:\*\*)?Status(?:\*\*)?\s*:\s*([^\n]+)/im;

function usage() {
  console.log("Usage: node scripts/devflow-spec.js [spec-file] [--self-test] [--json]");
  console.log("Checks whether a DevFlow spec has required sections, clear content, and the right landing path.");
  console.log("--json prints a single-line machine-readable summary; optional Status header values: " + validStatuses.join(" | "));
}

function findMatches(body, patterns) {
  return patterns.flatMap((pattern) => {
    const matches = body.match(pattern);
    return matches ? [matches[0]] : [];
  });
}

function checkSpec(body) {
  const missing = requiredFields.filter((field) => !fieldPatterns[field].test(body));
  const unresolved = findMatches(body, unresolvedPatterns);
  const vague = findMatches(body, vaguePatterns);
  const statusMatch = body.match(statusPattern);
  const status = statusMatch ? statusMatch[1].trim() : "legacy";
  const invalidStatus = statusMatch ? !validStatuses.includes(status) : false;

  return {
    missing,
    unresolved,
    vague,
    status,
    invalidStatus,
    ok: missing.length === 0 && unresolved.length === 0 && vague.length === 0 && !invalidStatus
  };
}

function checkSpecLanding(filePath) {
  if (!filePath) {
    return { ok: true, message: "Spec landing: stdin input, no file path checked" };
  }

  const normalized = filePath.replaceAll("\\", "/");
  const isDocsSpecs = /(^|\/)docs\/specs\/[^/]+\.md$/i.test(normalized);
  const isFeatureLedger = /(^|\/)docs\/features\/[^/]+\.md$/i.test(normalized);
  const isPlanDoc = /(^|\/)docs\/plans\/[^/]+\.md$/i.test(normalized);

  if (isDocsSpecs) {
    return { ok: true, message: "Spec landing: ok docs/specs/YYYY-MM-DD-<short-kebab-name>.md" };
  }

  if (isFeatureLedger) {
    return {
      ok: false,
      message: "Spec landing: docs/features is for feature ledgers; put generated specs under docs/specs/YYYY-MM-DD-<short-kebab-name>.md"
    };
  }

  if (isPlanDoc) {
    return {
      ok: false,
      message: "Spec landing: docs/plans is for implementation plans; put specs under docs/specs/YYYY-MM-DD-<short-kebab-name>.md"
    };
  }

  return {
    ok: true,
    message: "Spec landing: warning expected docs/specs/YYYY-MM-DD-<short-kebab-name>.md unless this project has a documented specs path"
  };
}

function report(body, filePath, json) {
  const result = checkSpec(body);
  const landing = checkSpecLanding(filePath);
  const judgment = !result.ok || !landing.ok ? "FAIL" : "PASS";

  if (json) {
    console.log(
      JSON.stringify({
        checker: "spec",
        landing: landing.message,
        status: result.status,
        invalidStatus: result.invalidStatus,
        missing: result.missing,
        unresolved: result.unresolved,
        vague: result.vague,
        judgment
      })
    );
    return judgment === "PASS" ? 0 : 1;
  }

  console.log("DevFlow spec report");
  console.log(landing.message);
  console.log(`Status: ${result.invalidStatus ? "invalid" : result.status}`);
  console.log(`Missing sections: ${result.missing.join(", ") || "none"}`);
  console.log(`Unresolved markers: ${result.unresolved.join(", ") || "none"}`);
  console.log(`Vague terms: ${result.vague.join(", ") || "none"}`);

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
  const validSpec = [
    "Goal: Add spec validation",
    "Context: DevFlow needs a saved requirements source before larger plans.",
    "Requirements: Validate required sections and landing path.",
    "Non-goals: Generate specs automatically.",
    "Approach: Use a zero-dependency Node checker.",
    "Impact: scripts/devflow-spec.js and command metadata.",
    "Acceptance: Complete spec reports PASS.",
    "Verification: node scripts/devflow-spec.js --self-test",
    "Code Documentation: scripts/devflow-spec.js needs file-level comment explaining checker purpose; checkSpec function needs comment explaining validation logic.",
    "Open Questions: none"
  ].join("\n");
  const missingSpec = [
    "Goal: Add spec validation",
    "Context: DevFlow needs a saved requirements source.",
    "Code Documentation: none — trivial change"
  ].join("\n");
  const vagueSpec = [
    "Goal: TODO",
    "Context: define later",
    "Requirements: handle edge cases",
    "Non-goals: none",
    "Approach: make it work",
    "Impact: scripts/devflow-spec.js",
    "Acceptance: ???",
    "Verification: node scripts/devflow-spec.js --self-test",
    "Code Documentation: none — trivial change",
    "Open Questions: <question>"
  ].join("\n");

  if (!checkSpec(validSpec).ok) {
    throw new Error("Self-test expected valid spec to pass");
  }

  const missingResult = checkSpec(missingSpec);
  if (missingResult.ok || !missingResult.missing.includes("Requirements")) {
    throw new Error("Self-test expected missing sections to fail");
  }

  const vagueResult = checkSpec(vagueSpec);
  if (vagueResult.ok || vagueResult.vague.length === 0 || vagueResult.unresolved.length === 0) {
    throw new Error("Self-test expected vague and unresolved terms to fail");
  }

  const validLanding = checkSpecLanding("docs/specs/2026-07-14-add-spec-scanner.md");
  if (!validLanding.ok) {
    throw new Error("Self-test expected docs/specs landing to pass");
  }

  const withValidStatusSpec = validSpec.replace(
    "Goal: Add spec validation",
    "Status: draft\nGoal: Add spec validation"
  );
  const withInvalidStatusSpec = validSpec.replace(
    "Goal: Add spec validation",
    "Status: shipped\nGoal: Add spec validation"
  );
  if (!checkSpec(withValidStatusSpec).ok) throw new Error("Self-test expected valid Status to pass");
  if (checkSpec(withInvalidStatusSpec).ok) throw new Error("Self-test expected invalid Status to fail");
  if (checkSpec(validSpec).status !== "legacy") throw new Error("Self-test expected missing Status to stay legacy");

  const badPlanLanding = checkSpecLanding("docs/plans/2026-07-14-add-spec-scanner.md");
  if (badPlanLanding.ok) {
    throw new Error("Self-test expected docs/plans spec landing to fail");
  }

  const badFeatureLanding = checkSpecLanding("docs/features/add-spec-scanner.md");
  if (badFeatureLanding.ok) {
    throw new Error("Self-test expected docs/features spec landing to fail");
  }

  console.log("DevFlow spec self-test passed");
  console.log("Checked required section detection, vague spec blocking, and spec landing guidance");
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
process.exitCode = report(body, targetArg, args.includes("--json"));
