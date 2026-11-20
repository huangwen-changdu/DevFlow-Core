const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
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

/** Ensures an installed runtime resolves owner references and preserves hybrid direct/Core boundaries. */
function assertInstalledRuntimeContract(target) {
  const installedSkills = ".agents/skills/";
  const core = fs.readFileSync(path.join(target, `${installedSkills}devflow-core/SKILL.md`), "utf8");
  for (const reference of ownerReferences) {
    const installedReference = reference.replace(/^skills\//, installedSkills);
    assert(fs.existsSync(path.join(target, installedReference)), `Installed runtime missing owner reference: ${installedReference}`);
    assert(core.includes(path.basename(reference)), `Installed Core loading map missing ${path.basename(reference)}`);
  }

  assert(!fs.existsSync(path.join(target, "skills")), "Fresh install must not create a legacy skills/ directory");

  for (const edge of [
    "A direct success: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove",
    "B direct success: Brainstorm -> Cut -> Plan -> Build -> Prove",
    "C direct success: Brainstorm -> Cut -> Build -> Prove"
  ]) {
    assert(core.includes(edge), `Installed Core missing direct success edge: ${edge}`);
  }
  for (const exception of ["CUT_REDUCE", "CUT_REUSE", "CUT_BLOCKED", "scope drift", "BUILD_BLOCKED", "Proof FAIL or BLOCKED", "PUA recovery"]) {
    assert(core.includes(exception), `Installed Core missing Core-return exception: ${exception}`);
  }

  const agents = fs.readFileSync(path.join(target, "AGENTS.md"), "utf8");
  assert(Buffer.byteLength(agents, "utf8") <= 8 * 1024, "Installed AGENTS.md exceeds the 8 KiB startup budget");
  assert(agents.includes("When skills are unavailable"), "Installed AGENTS.md missing portable fallback");
  assert(agents.includes(".agents/skills/devflow-core/SKILL.md"), "Installed AGENTS.md must name the installed skill path");
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
assert(!fs.existsSync(path.join(dryTarget, ".agents")), "Dry-run must not write .agents/");

const createTarget = makeTarget("create");
const createOutput = runInstaller([createTarget, "--write"]);
assert(createOutput.includes("created: AGENTS.md"), "Write mode must create AGENTS.md");
assert(createOutput.includes("created: .agents/skills/devflow-core/SKILL.md"), "Write mode must report the installed skill path");
assertInstalledRuntimeContract(createTarget);
assert(runInstaller([createTarget, "--check"]).includes("Check passed"), "Check mode must accept matching target runtime");

const installedSkillsChecker = spawnSync(
  process.execPath,
  [path.join(createTarget, "scripts/devflow-skills.js"), "--json"],
  { cwd: createTarget, encoding: "utf8" }
);
assert(
  installedSkillsChecker.status === 0,
  `Installed skills checker must pass on a clean target:\n${installedSkillsChecker.stdout}${installedSkillsChecker.stderr}`
);
assert(
  installedSkillsChecker.stdout.includes('"ok":true'),
  "Installed skills checker must report ok on a clean target"
);

const installedManifest = JSON.parse(fs.readFileSync(path.join(createTarget, ".devflow-manifest.json"), "utf8"));
assert(installedManifest.files[".agents/skills/devflow-core/SKILL.md"], "Manifest must record the installed skill path");
assert(
  !Object.keys(installedManifest.files).some((key) => key.startsWith("skills/")),
  "Manifest must not record the legacy skills/ layout"
);

const staleTarget = makeTarget("stale");
runInstaller([staleTarget, "--write"]);
fs.mkdirSync(path.join(staleTarget, "skills/devflow-core"), { recursive: true });
fs.writeFileSync(path.join(staleTarget, "skills/devflow-core/SKILL.md"), "legacy", "utf8");
const stale = spawnSync(process.execPath, [installer, staleTarget, "--check"], { cwd: root, encoding: "utf8" });
const staleOutput = `${stale.stdout}${stale.stderr}`;
assert(stale.status !== 0, "Check mode must fail on a stale legacy skills/ file");
assert(staleOutput.includes("stale: skills/devflow-core/SKILL.md"), "Check mode must name the stale legacy path");
assert(staleOutput.includes("Stale legacy skills/"), "Check mode must explain that legacy skills/ files are no longer read");

const staleWriteOutput = runInstaller([staleTarget, "--write", "--force"]);
assert(
  fs.existsSync(path.join(staleTarget, "skills/devflow-core/SKILL.md")),
  "Write mode must not delete a stale legacy skills/ tree"
);
assert(staleWriteOutput.includes("Stale legacy skills/"), "Write mode must report the stale legacy tree");

const migrateTarget = makeTarget("migrate");
runInstaller([migrateTarget, "--write"]);
fs.mkdirSync(path.join(migrateTarget, "skills/devflow-core/references"), { recursive: true });
fs.copyFileSync(
  path.join(root, "skills/devflow-core/SKILL.md"),
  path.join(migrateTarget, "skills/devflow-core/SKILL.md")
);
fs.writeFileSync(path.join(migrateTarget, "skills/devflow-core/references/core-methods.md"), "local edit", "utf8");
fs.mkdirSync(path.join(migrateTarget, "skills/page-capability-fras"), { recursive: true });
fs.writeFileSync(path.join(migrateTarget, "skills/page-capability-fras/SKILL.md"), "project skill", "utf8");

const migrateOutput = runInstaller([migrateTarget, "--migrate"]);
assert(
  migrateOutput.includes("Migrated legacy skills/: 1 removed, 1 kept."),
  "Migrate must report one removed and one kept legacy file"
);
assert(!fs.existsSync(path.join(migrateTarget, "skills/devflow-core/SKILL.md")), "Migrate must remove a byte-identical legacy file");
assert(
  fs.existsSync(path.join(migrateTarget, "skills/devflow-core/references/core-methods.md")),
  "Migrate must keep a legacy file whose bytes differ"
);
assert(
  fs.existsSync(path.join(migrateTarget, "skills/page-capability-fras/SKILL.md")),
  "Migrate must keep a project-owned skill"
);

const keptCheck = spawnSync(process.execPath, [installer, migrateTarget, "--check"], { cwd: root, encoding: "utf8" });
const keptOutput = `${keptCheck.stdout}${keptCheck.stderr}`;
assert(keptCheck.status !== 0, "Check must fail while a differing legacy file remains");
assert(
  keptOutput.includes("stale: skills/devflow-core/references/core-methods.md"),
  "Check must name the differing legacy file"
);

fs.rmSync(path.join(migrateTarget, "skills/devflow-core/references/core-methods.md"));
runInstaller([migrateTarget, "--migrate"]);
assert(
  !fs.existsSync(path.join(migrateTarget, "skills/devflow-core")),
  "Migrate must prune empty legacy skill directories"
);
assert(
  runInstaller([migrateTarget, "--check"]).includes("Check passed"),
  "Migrate must leave the project check passing"
);

const blockedTarget = makeTarget("migrate-blocked");
runInstaller([blockedTarget, "--write"]);
fs.writeFileSync(path.join(blockedTarget, "AGENTS.md"), "local merge", "utf8");
fs.mkdirSync(path.join(blockedTarget, "skills/devflow-core"), { recursive: true });
fs.copyFileSync(
  path.join(root, "skills/devflow-core/SKILL.md"),
  path.join(blockedTarget, "skills/devflow-core/SKILL.md")
);
const blocked = spawnSync(process.execPath, [installer, blockedTarget, "--migrate"], { cwd: root, encoding: "utf8" });
const blockedOutput = `${blocked.stdout}${blocked.stderr}`;
assert(blocked.status !== 0, "Migrate must fail while an installed file differs");
assert(blockedOutput.includes("Migration skipped"), "Migrate must explain why it skipped");
assert(
  fs.existsSync(path.join(blockedTarget, "skills/devflow-core/SKILL.md")),
  "Blocked migration must not delete legacy files"
);

const noLegacyTarget = makeTarget("migrate-no-legacy");
runInstaller([noLegacyTarget, "--write"]);
fs.writeFileSync(path.join(noLegacyTarget, "AGENTS.md"), "local merge", "utf8");
const noLegacyOutput = runInstaller([noLegacyTarget, "--write", "--migrate"]);
assert(
  !noLegacyOutput.includes("Migration skipped"),
  "Migrate must not fail a target that has no legacy copies"
);

const legacyVersionTarget = makeTarget("migrate-old-manifest");
runInstaller([legacyVersionTarget, "--write"]);
const oldBody = "older package copy\r\nsecond line\r\n";
fs.mkdirSync(path.join(legacyVersionTarget, "skills/devflow-core"), { recursive: true });
fs.writeFileSync(path.join(legacyVersionTarget, "skills/devflow-core/SKILL.md"), oldBody, "utf8");
const legacyManifestPath = path.join(legacyVersionTarget, ".devflow-manifest.json");
const legacyManifest = JSON.parse(fs.readFileSync(legacyManifestPath, "utf8"));
legacyManifest.version = "0.8.1";
legacyManifest.files["skills/devflow-core/SKILL.md"] = createHash("sha256")
  .update(oldBody.replace(/\r\n/g, "\n"))
  .digest("hex");
fs.writeFileSync(legacyManifestPath, `${JSON.stringify(legacyManifest, null, 2)}\n`, "utf8");
const oldMigrateOutput = runInstaller([legacyVersionTarget, "--migrate"]);
assert(
  oldMigrateOutput.includes("Migrated legacy skills/: 1 removed, 0 kept."),
  "Migrate must remove an older package copy recorded by the previous manifest"
);
assert(
  !fs.existsSync(path.join(legacyVersionTarget, "skills/devflow-core/SKILL.md")),
  "Manifest-verified legacy copy must be removed"
);
assert(
  runInstaller([legacyVersionTarget, "--check"]).includes("Check passed"),
  "Manifest-verified migration must leave the check passing"
);

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
console.log("Checked manifest coverage, owner-reference installation, dry-run, create, check, skip-existing, force-overwrite, legacy stale reporting, and byte-identical or manifest-verified migration");
