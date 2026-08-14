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
  "commands/devflow-adversarial.toml",
  "commands/devflow-find-fault.toml",
  "commands/devflow-audit.toml",
  "scripts/devflow-debt.js",
  "scripts/devflow-review.js",
  "scripts/devflow-spec.js",
  "scripts/devflow-plan.js",
  "scripts/devflow-audit.js",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-core/references/core-methods.md",
  "skills/devflow-core/references/skill-guide.md",
  "skills/devflow-cut/references/cut-methods.md",
  "skills/devflow-spec/references/spec-plan-methods.md",
  "skills/devflow-build/references/build-methods.md",
  "skills/devflow-prove/references/proof-recovery-methods.md",
  "skills/devflow-prove/references/code-review-checklist.md",
  "skills/devflow-brainstorm/SKILL.md",
  "skills/devflow-spec/SKILL.md",
  "skills/devflow-plan/SKILL.md",
  "skills/devflow-plan/references/plan-methods.md",
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
    "skills/devflow-docs-followup/SKILL.md",
    "skills/devflow-docs-followup/agents/openai.yaml",
    "skills/devflow-adversarial/SKILL.md",
    "skills/devflow-find-fault/SKILL.md",
    "skills/devflow-project-knowledge/SKILL.md",
    "skills/devflow-audit/SKILL.md",
  "skills/devflow-brainstorm/references/interview-discipline.md",
  "skills/skill-call-diagram.md"
];

// DSH agent presets install under <home>/.agent-presets/<id>/. Source lives in
// the repo at dsh/agent-presets/<id>/ so install:user stays the single sync
// path and --check covers both the skills and the preset.
const presetEntries = [
  { src: "dsh/agent-presets/devflow/agent.cordis.yml", dest: ".agent-presets/devflow/agent.cordis.yml" },
  { src: "dsh/agent-presets/devflow/preset.yml", dest: ".agent-presets/devflow/preset.yml" }
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

// Expand a leading `~` to the user home; Node's path.resolve does not do shell tilde expansion,
// so `--home ~/.dsh` on Windows would otherwise resolve to `<cwd>\~\.dsh`.
function expandTilde(p) {
  if (!p) return p;
  if (p === "~") return os.homedir();
  if (p.startsWith("~/") || p.startsWith("~\\")) return path.join(os.homedir(), p.slice(2));
  return p;
}

function userHome() {
  return path.resolve(expandTilde(explicitHome) || process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
}

function copyFile(rel, targetRoot, srcRel) {
  const source = path.join(root, srcRel ?? rel);
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

function checkFile(rel, targetRoot, srcRel) {
  const source = path.join(root, srcRel ?? rel);
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
  for (const { src, dest } of presetEntries) results.push(checkFile(dest, targetRoot, src));
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
for (const { src, dest } of presetEntries) results.push(copyFile(dest, targetRoot, src));

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
