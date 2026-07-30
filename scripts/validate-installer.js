const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const installer = path.join(root, "scripts/install-devflow.js");
const ownerReferences = [
  "skills/devflow-cut/references/cut-methods.md",
  "skills/devflow-spec/references/spec-plan-methods.md",
  "skills/devflow-build/references/build-methods.md",
  "skills/devflow-prove/references/proof-recovery-methods.md"
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function makeTarget(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `DevFlow-Core-${name}-`));
}

function runInstaller(args) {
  const result = spawnSync(process.execPath, [installer, ...args], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Installer failed:\n${result.stdout}\n${result.stderr}`);
  return `${result.stdout}${result.stderr}`;
}

/** Parses the source installer list so packaging checks use the same owned file set as installation. */
function installerEntries() {
  const body = fs.readFileSync(installer, "utf8");
  const match = body.match(/const runtimeEntries = \[([\s\S]*?)\];/);
  assert(match, "Target installer must define runtimeEntries");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

/** Ensures an installed runtime can resolve every owner reference declared by Core. */
function assertInstalledRuntimeContract(target) {
  const core = fs.readFileSync(path.join(target, "skills/devflow-core/SKILL.md"), "utf8");
  for (const reference of ownerReferences) {
    assert(fs.existsSync(path.join(target, reference)), `Installed runtime missing owner reference: ${reference}`);
    assert(core.includes(path.basename(reference)), `Installed Core loading map missing ${path.basename(reference)}`);
  }

  for (const boundary of ["Confirmed request", "confirmed Spec", "Cut returns", "confirmed Plan", "BUILD_BLOCKED", "recovery facts", "Only Core selects"]) {
    assert(core.includes(boundary), `Installed Core missing return boundary: ${boundary}`);
  }

  const agents = fs.readFileSync(path.join(target, "AGENTS.md"), "utf8");
  assert(Buffer.byteLength(agents, "utf8") <= 8 * 1024, "Installed AGENTS.md exceeds the 8 KiB startup budget");
  assert(agents.includes("When skills are unavailable"), "Installed AGENTS.md missing portable fallback");
}

const entries = installerEntries();
const plugin = JSON.parse(fs.readFileSync(path.join(root, "plugin.json"), "utf8"));
const gemini = JSON.parse(fs.readFileSync(path.join(root, "gemini-extension.json"), "utf8"));

for (const entry of [...Object.values(plugin.entrypoints || {}), plugin.hooks, gemini.contextFileName].filter(Boolean)) {
  assert(entries.includes(entry), `Target installer missing manifest entry: ${entry}`);
}
for (const reference of ownerReferences) assert(entries.includes(reference), `Target installer missing ${reference}`);

const dryTarget = makeTarget("dry");
const dryOutput = runInstaller([dryTarget]);
assert(dryOutput.includes("DevFlow install dry-run"), "Dry-run must identify target dry-run mode");
assert(!fs.existsSync(path.join(dryTarget, "AGENTS.md")), "Dry-run must not write AGENTS.md");

const createTarget = makeTarget("create");
const createOutput = runInstaller([createTarget, "--write"]);
assert(createOutput.includes("created: AGENTS.md"), "Write mode must create AGENTS.md");
assertInstalledRuntimeContract(createTarget);
assert(runInstaller([createTarget, "--check"]).includes("Check passed"), "Check mode must accept matching target runtime");

const missingTarget = makeTarget("missing");
const missing = spawnSync(process.execPath, [installer, missingTarget, "--check"], { cwd: root, encoding: "utf8" });
assert(missing.status !== 0, "Check mode must fail for a missing target runtime");

const skipTarget = makeTarget("skip");
fs.writeFileSync(path.join(skipTarget, "AGENTS.md"), "KEEP_ME", "utf8");
const skipOutput = runInstaller([skipTarget, "--write"]);
assert(skipOutput.includes("skipped existing: AGENTS.md"), "Write mode must preserve existing AGENTS.md");

const forceTarget = makeTarget("force");
fs.writeFileSync(path.join(forceTarget, "AGENTS.md"), "REPLACE_ME", "utf8");
const forceOutput = runInstaller([forceTarget, "--write", "--force"]);
assert(forceOutput.includes("overwrote: AGENTS.md"), "Force mode must report AGENTS overwrite");
assert(fs.readFileSync(path.join(forceTarget, "AGENTS.md"), "utf8") !== "REPLACE_ME", "Force mode must replace AGENTS.md");

console.log("Installer validation passed");
console.log("Checked manifest coverage, owner-reference installation, dry-run, create, check, skip-existing, and force-overwrite");
