const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const installer = path.join(root, "scripts/install-devflow-user.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function makeHome(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `DevFlow-Core-user-${name}-`));
}

function runInstaller(home, args) {
  const result = spawnSync(process.execPath, [installer, "--home", home, ...args], {
    cwd: root,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`User installer failed:\n${result.stdout}\n${result.stderr}`);
  }

  return `${result.stdout}${result.stderr}`;
}

function readInstallerEntries() {
  const body = fs.readFileSync(installer, "utf8");
  const match = body.match(/const userEntries = \[([\s\S]*?)\];/);
  assert(match, "User installer must define userEntries");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

const userEntries = readInstallerEntries();

for (const entry of userEntries) {
  assert(
    entry.startsWith("skills/") || entry.startsWith("commands/") || entry.startsWith("scripts/devflow-"),
    `User installer entry is outside skills/commands/scripts: ${entry}`
  );
}

assert(!userEntries.includes("AGENTS.md"), "User installer must not install AGENTS.md");
assert(userEntries.includes("skills/devflow-core/SKILL.md"), "User installer missing core skill");
assert(userEntries.includes("skills/devflow-spec/SKILL.md"), "User installer missing spec skill");
assert(userEntries.includes("skills/devflow-pua/SKILL.md"), "User installer missing pua skill");
assert(userEntries.includes("skills/devflow-project-knowledge/SKILL.md"), "User installer missing project-knowledge skill");
assert(userEntries.includes("skills/devflow-docs-followup/SKILL.md"), "User installer missing completion document follow-up skill");
assert(userEntries.includes("skills/devflow-docs-followup/agents/openai.yaml"), "User installer missing completion document follow-up UI metadata");
assert(userEntries.includes("skills/devflow-adversarial/SKILL.md"), "User installer missing independent adversarial skill");
assert(userEntries.includes("skills/devflow-find-fault/SKILL.md"), "User installer missing independent find-fault skill");
assert(userEntries.includes("skills/devflow-pua/references/methodology-router.md"), "User installer missing pua methodology router");
assert(userEntries.includes("skills/devflow-pua/references/methodology-library.md"), "User installer missing pua methodology library");
assert(userEntries.includes("skills/devflow-pua/references/flavor-display.md"), "User installer missing pua flavor display");
assert(userEntries.includes("skills/devflow-audit/SKILL.md"), "User installer missing audit skill");
assert(userEntries.includes("skills/devflow-brainstorm/references/interview-discipline.md"), "User installer missing interview discipline reference");
assert(userEntries.includes("commands/devflow.toml"), "User installer missing devflow command");
assert(userEntries.includes("commands/devflow-spec.toml"), "User installer missing spec command");
assert(userEntries.includes("commands/devflow-pua.toml"), "User installer missing pua command");
assert(userEntries.includes("commands/devflow-adversarial.toml"), "User installer missing independent adversarial command");
assert(userEntries.includes("commands/devflow-find-fault.toml"), "User installer missing independent find-fault command");
assert(userEntries.includes("commands/devflow-audit.toml"), "User installer missing audit command");
assert(userEntries.includes("scripts/devflow-plan.js"), "User installer missing plan script");
assert(userEntries.includes("scripts/devflow-spec.js"), "User installer missing spec script");
assert(userEntries.includes("scripts/devflow-audit.js"), "User installer missing audit script");

const dryHome = makeHome("dry");
const dryOutput = runInstaller(dryHome, []);
assert(dryOutput.includes("DevFlow user install dry-run"), "Dry-run output must identify user dry-run mode");
assert(dryOutput.includes("would create: skills/devflow-core/SKILL.md"), "Dry-run must report user skill creation");
assert(!fs.existsSync(path.join(dryHome, "skills/devflow-core/SKILL.md")), "Dry-run must not create user skill");

const createHome = makeHome("create");
const createOutput = runInstaller(createHome, ["--write"]);
assert(createOutput.includes("created: skills/devflow-core/SKILL.md"), "Write mode must create user skill");
assert(fs.existsSync(path.join(createHome, "skills/devflow-core/SKILL.md")), "Write mode must create skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-spec/SKILL.md")), "Write mode must create spec skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-pua/SKILL.md")), "Write mode must create pua skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-project-knowledge/SKILL.md")), "Write mode must create project-knowledge skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-docs-followup/SKILL.md")), "Write mode must create completion document follow-up skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-docs-followup/agents/openai.yaml")), "Write mode must create completion document follow-up UI metadata");
assert(fs.existsSync(path.join(createHome, "skills/devflow-adversarial/SKILL.md")), "Write mode must create independent adversarial skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-find-fault/SKILL.md")), "Write mode must create independent find-fault skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-pua/references/methodology-router.md")), "Write mode must create pua methodology router");
assert(fs.existsSync(path.join(createHome, "skills/devflow-pua/references/methodology-library.md")), "Write mode must create pua methodology library");
assert(fs.existsSync(path.join(createHome, "skills/devflow-pua/references/flavor-display.md")), "Write mode must create pua flavor display");
assert(fs.existsSync(path.join(createHome, "skills/devflow-audit/SKILL.md")), "Write mode must create audit skill file");
assert(fs.existsSync(path.join(createHome, "skills/devflow-brainstorm/references/interview-discipline.md")), "Write mode must create interview discipline reference");
assert(fs.existsSync(path.join(createHome, "commands/devflow.toml")), "Write mode must create command file");
assert(fs.existsSync(path.join(createHome, "commands/devflow-spec.toml")), "Write mode must create spec command file");
assert(fs.existsSync(path.join(createHome, "commands/devflow-pua.toml")), "Write mode must create pua command file");
assert(fs.existsSync(path.join(createHome, "commands/devflow-adversarial.toml")), "Write mode must create independent adversarial command file");
assert(fs.existsSync(path.join(createHome, "commands/devflow-find-fault.toml")), "Write mode must create independent find-fault command file");
assert(fs.existsSync(path.join(createHome, "commands/devflow-audit.toml")), "Write mode must create audit command file");
assert(fs.existsSync(path.join(createHome, "scripts/devflow-plan.js")), "Write mode must create script file");
assert(fs.existsSync(path.join(createHome, "scripts/devflow-spec.js")), "Write mode must create spec script file");
assert(fs.existsSync(path.join(createHome, "scripts/devflow-audit.js")), "Write mode must create audit script file");

const checkOutput = runInstaller(createHome, ["--check"]);
assert(checkOutput.includes("DevFlow user install check"), "Check mode must identify user check mode");
assert(checkOutput.includes("ok: skills/devflow-core/SKILL.md"), "Check mode must report matching user skill");
assert(checkOutput.includes("Check passed"), "Check mode must pass when user runtime matches");

const missingHome = makeHome("missing");
const missingCheck = spawnSync(process.execPath, [installer, "--home", missingHome, "--check"], {
  cwd: root,
  encoding: "utf8"
});
assert(missingCheck.status !== 0, "Check mode must fail when user files are missing");
assert(`${missingCheck.stdout}${missingCheck.stderr}`.includes("Check failed"), "Missing check must report failure");

const skipHome = makeHome("skip");
const skipTarget = path.join(skipHome, "commands/devflow.toml");
fs.mkdirSync(path.dirname(skipTarget), { recursive: true });
fs.writeFileSync(skipTarget, "KEEP_ME", "utf8");
const skipOutput = runInstaller(skipHome, ["--write"]);
assert(skipOutput.includes("skipped existing: commands/devflow.toml"), "Write mode must skip existing user command");
assert(fs.readFileSync(skipTarget, "utf8") === "KEEP_ME", "Write mode must preserve existing user command");

const forceHome = makeHome("force");
const forceTarget = path.join(forceHome, "commands/devflow.toml");
fs.mkdirSync(path.dirname(forceTarget), { recursive: true });
fs.writeFileSync(forceTarget, "REPLACE_ME", "utf8");
const forceOutput = runInstaller(forceHome, ["--write", "--force"]);
assert(forceOutput.includes("overwrote: commands/devflow.toml"), "Force mode must report overwriting user command");
assert(fs.readFileSync(forceTarget, "utf8") !== "REPLACE_ME", "Force mode must replace user command");

console.log("User installer validation passed");
console.log("Checked dry-run, create, check, skip-existing, force-overwrite, and user scope boundaries");
