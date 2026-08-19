const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const installer = path.join(root, "scripts/install-devflow-user.js");
const ownerReferences = [
  "skills/devflow-cut/references/cut-methods.md",
  "skills/devflow-spec/references/spec-plan-methods.md",
  "skills/devflow-build/references/build-methods.md",
  "skills/devflow-prove/references/proof-recovery-methods.md"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function makeHome(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `DevFlow-Core-user-${name}-`));
}

function runInstaller(home, args) {
  const result = spawnSync(process.execPath, [installer, "--home", home, ...args], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`User installer failed:\n${result.stdout}\n${result.stderr}`);
  return `${result.stdout}${result.stderr}`;
}

/** Parses user installer scope to keep project-only entry files out of a personal runtime. */
function userEntries() {
  const body = fs.readFileSync(installer, "utf8");
  const match = body.match(/const userEntries = \[([\s\S]*?)\];/);
  assert(match, "User installer must define userEntries");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

/** Ensures a user-level Core loading map resolves owner references and hybrid lifecycle boundaries. */
function assertInstalledRuntimeContract(home) {
  const core = fs.readFileSync(path.join(home, "skills/devflow-core/SKILL.md"), "utf8");
  for (const reference of ownerReferences) {
    assert(fs.existsSync(path.join(home, reference)), `User runtime missing owner reference: ${reference}`);
    assert(core.includes(path.basename(reference)), `User Core loading map missing ${path.basename(reference)}`);
  }
  for (const edge of ["A direct success", "B direct success", "C direct success"]) {
    assert(core.includes(edge), `User Core missing direct success edge: ${edge}`);
  }
  for (const exception of ["CUT_REDUCE", "CUT_REUSE", "CUT_BLOCKED", "scope drift", "BUILD_BLOCKED", "Proof FAIL or BLOCKED", "PUA recovery"]) {
    assert(core.includes(exception), `User Core missing Core-return exception: ${exception}`);
  }
  assert(!fs.existsSync(path.join(home, "AGENTS.md")), "User runtime must not install project AGENTS.md");
  for (const presetRel of [
    ".agent-presets/devflow/agent.cordis.yml",
    ".agent-presets/devflow/preset.yml",
    ".agent-presets/devflow-2/agent.cordis.yml",
    ".agent-presets/devflow-2/preset.yml",
    ".agent-presets/devflow-2/tool-bootstrap.mjs",
    ".agent-presets/devflow-2/custom-bash.mjs",
    ".agent-presets/devflow-2/NOTICE",
  ]) {
    assert(fs.existsSync(path.join(home, presetRel)), `User runtime missing preset file: ${presetRel}`);
  }
  const devflow2Composition = fs.readFileSync(path.join(root, "dsh/agent-presets/devflow-2/agent.cordis.yml"), "utf8");
  assert(devflow2Composition.includes("name: ./tool-bootstrap.mjs"), "devflow-2 preset must reference its bundled bootstrap plugin");
  assert(devflow2Composition.includes("name: ./custom-bash.mjs"), "devflow-2 preset must reference its bundled custom-bash plugin");
}

const entries = userEntries();
for (const entry of entries) {
  assert(entry.startsWith("skills/") || entry.startsWith("commands/") || entry.startsWith("scripts/devflow-"), `User entry outside supported scope: ${entry}`);
}
assert(!entries.includes("AGENTS.md"), "User installer must not install AGENTS.md");
for (const reference of ownerReferences) assert(entries.includes(reference), `User installer missing ${reference}`);

const dryHome = makeHome("dry");
const dryOutput = runInstaller(dryHome, []);
assert(dryOutput.includes("DevFlow user install dry-run"), "Dry-run must identify user mode");
assert(!fs.existsSync(path.join(dryHome, "skills/devflow-core/SKILL.md")), "User dry-run must not write files");

const createHome = makeHome("create");
const createOutput = runInstaller(createHome, ["--write"]);
assert(createOutput.includes("created: skills/devflow-core/SKILL.md"), "User write mode must create Core skill");
assertInstalledRuntimeContract(createHome);
assert(runInstaller(createHome, ["--check"]).includes("Check passed"), "User check mode must accept matching runtime");

const missingHome = makeHome("missing");
const missing = spawnSync(process.execPath, [installer, "--home", missingHome, "--check"], { cwd: root, encoding: "utf8" });
assert(missing.status !== 0, "User check mode must fail for missing runtime");

const skipHome = makeHome("skip");
const skipFile = path.join(skipHome, "commands/devflow.toml");
fs.mkdirSync(path.dirname(skipFile), { recursive: true });
fs.writeFileSync(skipFile, "KEEP_ME", "utf8");
assert(runInstaller(skipHome, ["--write"]).includes("skipped existing: commands/devflow.toml"), "User write mode must preserve existing files");

const forceHome = makeHome("force");
const forceFile = path.join(forceHome, "commands/devflow.toml");
fs.mkdirSync(path.dirname(forceFile), { recursive: true });
fs.writeFileSync(forceFile, "REPLACE_ME", "utf8");
assert(runInstaller(forceHome, ["--write", "--force"]).includes("overwrote: commands/devflow.toml"), "User force mode must overwrite files");

console.log("User installer validation passed");
console.log("Checked owner-reference installation, user scope, dry-run, create, check, skip-existing, and force-overwrite");
