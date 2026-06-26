const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const userEntries = [
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
  "skills/devflow-core/references/decision-tree.md",
  "skills/devflow-core/references/skill-guide.md",
  "skills/devflow-brainstorm/SKILL.md",
  "skills/devflow-spec/SKILL.md",
  "skills/devflow-cut/SKILL.md",
  "skills/devflow-cut/references/native-capability-checklist.md",
  "skills/devflow-build/SKILL.md",
  "skills/devflow-prove/SKILL.md",
  "skills/devflow-prove/references/flow-self-test.md",
  "skills/devflow-pua/SKILL.md",
  "skills/devflow-learn/SKILL.md",
  "skills/devflow-audit/SKILL.md",
  "skills/skill-call-diagram.md"
];

const args = process.argv.slice(2);
const write = args.includes("--write");
const force = args.includes("--force");
const check = args.includes("--check");
const homeFlagIndex = args.findIndex((arg) => arg === "--home" || arg === "--codex-home");
const explicitHome = homeFlagIndex >= 0 ? args[homeFlagIndex + 1] : null;

function usage() {
  console.log("Usage: npm run install:user -- [--write] [--force] [--check] [--home <user-runtime-home>]");
  console.log("Default target is CODEX_HOME or ~/.codex.");
  console.log("For Claude Code user-level install, pass --home ~/.claude.");
  console.log("Default mode is dry-run. Add --write to copy files.");
  console.log("Existing user files are skipped unless --force is passed.");
  console.log("Add --check to verify user-level skills, commands, and scripts match this package.");
}

function userHome() {
  return path.resolve(explicitHome || process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
}

function copyFile(rel, targetRoot) {
  const source = path.join(root, rel);
  const target = path.join(targetRoot, rel);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing source file: ${rel}`);
  }

  const exists = fs.existsSync(target);

  if (!write) {
    if (exists && force) {
      return { rel, action: "would overwrite" };
    }
    return { rel, action: exists ? "would skip" : "would create" };
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

  const sourceBody = fs.readFileSync(source);
  const targetBody = fs.readFileSync(target);
  return { rel, action: Buffer.compare(sourceBody, targetBody) === 0 ? "ok" : "changed" };
}

if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

if (homeFlagIndex >= 0 && !explicitHome) {
  throw new Error("--home requires a path");
}

if (check && write) {
  throw new Error("--check cannot be combined with --write");
}

const targetRoot = userHome();

if (check) {
  const results = userEntries.map((rel) => checkFile(rel, targetRoot));
  const missing = results.filter((result) => result.action === "missing");
  const changed = results.filter((result) => result.action === "changed");

  console.log(`DevFlow user install check: ${targetRoot}`);
  for (const result of results) {
    console.log(`${result.action}: ${result.rel}`);
  }
  console.log(`Total files: ${results.length}`);

  if (missing.length > 0 || changed.length > 0) {
    console.log(`Check failed: ${missing.length} missing, ${changed.length} changed`);
    process.exit(1);
  }

  console.log("Check passed: user-level runtime matches this package.");
  process.exit(0);
}

const results = userEntries.map((rel) => copyFile(rel, targetRoot));

console.log(`DevFlow user install ${write ? "write" : "dry-run"}: ${targetRoot}`);
for (const result of results) {
  console.log(`${result.action}: ${result.rel}`);
}
console.log(`Total files: ${results.length}`);

const skippedExisting = results.some((result) => result.action === "skipped existing");

if (!write) {
  console.log("No files were changed. Re-run with --write to install user-level runtime.");
} else if (!force && skippedExisting) {
  console.log("Existing user files were skipped. Re-run with --write --force to overwrite.");
}
