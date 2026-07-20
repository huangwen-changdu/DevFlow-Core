const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const runtimeEntries = [
  "AGENTS.md",
  "CLAUDE.md",
  ".github/copilot-instructions.md",
  ".github/instructions/devflow.instructions.md",
  ".github/prompts/devflow.prompt.md",
  ".codebuddy/rules/devflow-core/RULE.mdc",
  ".claude/settings.json",
  ".claude/commands/devflow-core.md",
  "hooks/hooks.json",
  "hooks/devflow-session-start.js",
  "commands/devflow.toml",
  "commands/devflow-spec.toml",
  "commands/devflow-plan.toml",
  "commands/devflow-review.toml",
  "commands/devflow-debt.toml",
  "commands/devflow-prove.toml",
  "commands/devflow-pua.toml",
  "commands/devflow-learn.toml",
  "commands/devflow-audit.toml",
  "scripts/devflow-debt.js",
  "scripts/devflow-review.js",
  "scripts/devflow-spec.js",
  "scripts/devflow-plan.js",
  "scripts/devflow-audit.js",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-core/references/core-methods.md",
  "skills/devflow-core/references/skill-guide.md",
  "skills/devflow-brainstorm/SKILL.md",
  "skills/devflow-spec/SKILL.md",
  "skills/devflow-cut/SKILL.md",
  "skills/devflow-cut/references/native-capability-checklist.md",
  "skills/devflow-build/SKILL.md",
  "skills/devflow-prove/SKILL.md",
  "skills/devflow-prove/references/flow-self-test.md",
  "skills/devflow-pua/SKILL.md",
  "skills/devflow-pua/references/methodology-router.md",
  "skills/devflow-pua/references/methodology-library.md",
    "skills/devflow-pua/references/flavor-display.md",
    "skills/devflow-learn/SKILL.md",
    "skills/devflow-project-knowledge/SKILL.md",
    "skills/devflow-audit/SKILL.md",
  "skills/devflow-brainstorm/references/interview-discipline.md",
  "skills/skill-call-diagram.md"
];

const args = process.argv.slice(2);
const write = args.includes("--write");
const force = args.includes("--force");
const check = args.includes("--check");
const targetArg = args.find((arg) => arg !== "--write" && arg !== "--dry-run" && arg !== "--force" && arg !== "--check");
const claudeSettingsRel = ".claude/settings.json";

function usage() {
  console.log("Usage: npm run install:target -- <target-project> [--write] [--force] [--check]");
  console.log("Default mode is dry-run. Add --write to copy files.");
  console.log("Existing files are skipped unless --force is passed.");
  console.log("Add --check to verify the target runtime files match this package.");
}

function readJsonFile(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function devflowSessionStartEntries() {
  const sourceSettings = readJsonFile(path.join(root, claudeSettingsRel));
  return sourceSettings.hooks?.SessionStart || [];
}

function hasDevflowSessionStart(settings) {
  return JSON.stringify(settings.hooks?.SessionStart || []).includes("node hooks/devflow-session-start.js");
}

function mergeClaudeSettings(target) {
  const settings = fs.existsSync(target) ? readJsonFile(target) : {};
  const entries = devflowSessionStartEntries();

  settings.hooks = settings.hooks || {};
  settings.hooks.SessionStart = settings.hooks.SessionStart || [];

  if (hasDevflowSessionStart(settings)) {
    return "ok existing";
  }

  settings.hooks.SessionStart.push(...entries);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  return "merged existing";
}

function copyFile(rel, targetRoot) {
  const source = path.join(root, rel);
  const target = path.join(targetRoot, rel);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing source file: ${rel}`);
  }

  const exists = fs.existsSync(target);

  if (!write) {
    if (rel === claudeSettingsRel && exists && !force) {
      return { rel, action: "would merge" };
    }
    if (exists && force) {
      return { rel, action: "would overwrite" };
    }
    return { rel, action: exists ? "would skip" : "would create" };
  }

  if (rel === claudeSettingsRel && exists && !force) {
    return { rel, action: mergeClaudeSettings(target) };
  }

  if (exists && !force) {
    return { rel, action: "skipped existing" };
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return { rel, action: exists ? "overwrote" : "created" };
}

function checkFile(rel, targetRoot) {
  const source = path.join(root, rel);
  const target = path.join(targetRoot, rel);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing source file: ${rel}`);
  }

  if (!fs.existsSync(target)) {
    return { rel, action: "missing" };
  }

  if (rel === claudeSettingsRel) {
    try {
      const targetSettings = readJsonFile(target);
      return { rel, action: hasDevflowSessionStart(targetSettings) ? "ok" : "changed" };
    } catch {
      return { rel, action: "changed" };
    }
  }

  const sourceBody = fs.readFileSync(source);
  const targetBody = fs.readFileSync(target);
  return { rel, action: Buffer.compare(sourceBody, targetBody) === 0 ? "ok" : "changed" };
}

if (!targetArg) {
  usage();
  process.exit(1);
}

if (check && write) {
  throw new Error("--check cannot be combined with --write");
}

const targetRoot = path.resolve(process.cwd(), targetArg);
if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
  throw new Error(`Target project directory does not exist: ${targetRoot}`);
}

if (check) {
  const results = runtimeEntries.map((rel) => checkFile(rel, targetRoot));
  const missing = results.filter((result) => result.action === "missing");
  const changed = results.filter((result) => result.action === "changed");

  console.log(`DevFlow install check: ${targetRoot}`);
  for (const result of results) {
    console.log(`${result.action}: ${result.rel}`);
  }
  console.log(`Total files: ${results.length}`);

  if (missing.length > 0 || changed.length > 0) {
    console.log(`Check failed: ${missing.length} missing, ${changed.length} changed`);
    process.exit(1);
  }

  console.log("Check passed: installed runtime matches this package.");
  process.exit(0);
}

const results = runtimeEntries.map((rel) => copyFile(rel, targetRoot));

console.log(`DevFlow install ${write ? "write" : "dry-run"}: ${targetRoot}`);
for (const result of results) {
  console.log(`${result.action}: ${result.rel}`);
}
console.log(`Total files: ${results.length}`);

const skippedExisting = results.some((result) => result.action === "skipped existing");

if (!write) {
  console.log("No files were changed. Re-run with --write to install.");
} else if (!force && skippedExisting) {
  console.log("Existing files were skipped. Re-run with --write --force to overwrite.");
}
