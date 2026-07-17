const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const installer = path.join(root, "scripts/install-devflow.js");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function makeTarget(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `DevFlow-Core-${name}-`));
}

function runInstaller(args) {
  const result = spawnSync(process.execPath, [installer, ...args], {
    cwd: root,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`Installer failed:\n${result.stdout}\n${result.stderr}`);
  }

  return `${result.stdout}${result.stderr}`;
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function readInstallerEntries() {
  const body = fs.readFileSync(installer, "utf8");
  const match = body.match(/const runtimeEntries = \[([\s\S]*?)\];/);
  assert(match, "Installer must define runtimeEntries");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

function walkFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkFiles(fullPath);
    }
    return [fullPath];
  });
}

function assertInstalledRuntimeIsSelfContained(targetRoot) {
  const installed = new Set(runtimeEntries);
  const optionalReferenceHints = [
    "when present",
    "if present",
    "if it exists",
    "if no ledger exists",
    "mark it missing",
    "when configured"
  ];
  const structureReferenceHints = [
    "applyTo:",
    "file layout",
    "public entry points",
    "project structure",
    "reserved for product and generated",
    "Do not place runtime framework methods there",
    "existing `package.json`"
  ];
  const pathPattern = /(?:docs\/[A-Za-z0-9_.*?/-]*(?:\*|\.md|\/)|scripts\/[A-Za-z0-9_.-]+|package\.json|README\.md|plugin\.json|gemini-extension\.json)/g;

  for (const file of walkFiles(targetRoot)) {
    if (!/\.(md|mdc|toml)$/.test(file)) {
      continue;
    }

    const rel = path.relative(targetRoot, file).replaceAll(path.sep, "/");
    const body = fs.readFileSync(file, "utf8");

    for (const match of body.matchAll(pathPattern)) {
      const referencedPath = match[0];
      if (installed.has(referencedPath)) {
        continue;
      }

      if (
        referencedPath === "docs/plans/" ||
         referencedPath === "docs/specs/" ||
         referencedPath === "docs/features/" ||
         referencedPath === "docs/features/*.md" ||
         referencedPath === "docs/project-knowledge/" ||
         referencedPath === "docs/adr/"
      ) {
        continue;
      }

      const lineStart = body.lastIndexOf("\n", match.index) + 1;
      const lineEnd = body.indexOf("\n", match.index);
      const line = body.slice(lineStart, lineEnd === -1 ? body.length : lineEnd);
      const normalizedLine = line.toLowerCase();
      const allowed =
        optionalReferenceHints.some((hint) => normalizedLine.includes(hint.toLowerCase())) ||
        structureReferenceHints.some((hint) => normalizedLine.includes(hint.toLowerCase()));

      assert(
        allowed,
        `Installed runtime file ${rel} references non-installed path ${referencedPath} without optional context`
      );
    }
  }
}

const runtimeEntries = readInstallerEntries();
const plugin = readJson("plugin.json");
const gemini = readJson("gemini-extension.json");

for (const entry of Object.values(plugin.entrypoints || {})) {
  assert(runtimeEntries.includes(entry), `Installer missing plugin entrypoint: ${entry}`);
}

if (plugin.hooks) {
  assert(runtimeEntries.includes(plugin.hooks), `Installer missing plugin hooks: ${plugin.hooks}`);
}

for (const skill of plugin.skills || []) {
  assert(runtimeEntries.includes(skill), `Installer missing plugin skill: ${skill}`);
}

for (const command of plugin.commands || []) {
  assert(runtimeEntries.includes(command), `Installer missing plugin command: ${command}`);
}

assert(runtimeEntries.includes(gemini.contextFileName), `Installer missing Gemini context file: ${gemini.contextFileName}`);

for (const skill of gemini.skills || []) {
  assert(runtimeEntries.includes(skill), `Installer missing Gemini skill: ${skill}`);
}

const dryTarget = makeTarget("dry");
const dryOutput = runInstaller([dryTarget]);
assert(dryOutput.includes("DevFlow install dry-run"), "Dry-run output must identify dry-run mode");
assert(dryOutput.includes("would create: AGENTS.md"), "Dry-run must report files it would create");
assert(!fs.existsSync(path.join(dryTarget, "AGENTS.md")), "Dry-run must not create AGENTS.md");

const createTarget = makeTarget("create");
const createOutput = runInstaller([createTarget, "--write"]);
assert(createOutput.includes("created: AGENTS.md"), "Write mode must create AGENTS.md in an empty target");
assert(fs.existsSync(path.join(createTarget, "AGENTS.md")), "Write mode must create AGENTS.md");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-core/SKILL.md")), "Write mode must create core skill");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-spec/SKILL.md")), "Write mode must create spec skill");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-pua/SKILL.md")), "Write mode must create pua skill");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-project-knowledge/SKILL.md")), "Write mode must create project-knowledge skill");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-pua/references/methodology-router.md")), "Write mode must create pua methodology router");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-pua/references/methodology-library.md")), "Write mode must create pua methodology library");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-pua/references/flavor-display.md")), "Write mode must create pua flavor display");
assert(fs.existsSync(path.join(createTarget, "commands/devflow.toml")), "Write mode must create command files");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-brainstorm/references/interview-discipline.md")), "Write mode must create interview discipline reference");
assert(fs.existsSync(path.join(createTarget, "commands/devflow-spec.toml")), "Write mode must create spec command");
assert(fs.existsSync(path.join(createTarget, "commands/devflow-pua.toml")), "Write mode must create pua command");
assert(fs.existsSync(path.join(createTarget, "commands/devflow-audit.toml")), "Write mode must create audit command");
assert(fs.existsSync(path.join(createTarget, "scripts/devflow-debt.js")), "Write mode must create debt scanner");
assert(fs.existsSync(path.join(createTarget, "scripts/devflow-review.js")), "Write mode must create review scanner");
assert(fs.existsSync(path.join(createTarget, "scripts/devflow-spec.js")), "Write mode must create spec checker");
assert(fs.existsSync(path.join(createTarget, "scripts/devflow-plan.js")), "Write mode must create plan scanner");
assert(fs.existsSync(path.join(createTarget, "scripts/devflow-audit.js")), "Write mode must create audit scanner");
assert(fs.existsSync(path.join(createTarget, "hooks/devflow-session-start.js")), "Write mode must create Claude hook script");
assert(fs.existsSync(path.join(createTarget, ".claude/settings.json")), "Write mode must create Claude project hook settings");
assert(fs.existsSync(path.join(createTarget, ".claude/commands/devflow-core.md")), "Write mode must create Claude DevFlow command");
assert(fs.existsSync(path.join(createTarget, "skills/devflow-audit/SKILL.md")), "Write mode must create audit skill");
assertInstalledRuntimeIsSelfContained(createTarget);

const checkOutput = runInstaller([createTarget, "--check"]);
assert(checkOutput.includes("DevFlow install check"), "Check mode must identify check mode");
assert(checkOutput.includes("ok: AGENTS.md"), "Check mode must report matching files");
assert(checkOutput.includes("Check passed"), "Check mode must pass when installed runtime matches");

const missingCheckTarget = makeTarget("missing-check");
const missingCheck = spawnSync(process.execPath, [installer, missingCheckTarget, "--check"], {
  cwd: root,
  encoding: "utf8"
});
assert(missingCheck.status !== 0, "Check mode must fail when runtime files are missing");
assert(`${missingCheck.stdout}${missingCheck.stderr}`.includes("Check failed"), "Missing check must report failure");

const changedCheckTarget = makeTarget("changed-check");
runInstaller([changedCheckTarget, "--write"]);
fs.writeFileSync(path.join(changedCheckTarget, "AGENTS.md"), "LOCAL_CHANGE", "utf8");
const changedCheck = spawnSync(process.execPath, [installer, changedCheckTarget, "--check"], {
  cwd: root,
  encoding: "utf8"
});
const changedCheckOutput = `${changedCheck.stdout}${changedCheck.stderr}`;
assert(changedCheck.status !== 0, "Check mode must fail when runtime files changed");
assert(changedCheckOutput.includes("changed: AGENTS.md"), "Changed check must report changed files");

const skipTarget = makeTarget("skip");
const skipAgents = path.join(skipTarget, "AGENTS.md");
fs.writeFileSync(skipAgents, "KEEP_ME", "utf8");
const skipClaudeDir = path.join(skipTarget, ".claude");
const skipClaudeSettings = path.join(skipClaudeDir, "settings.json");
fs.mkdirSync(skipClaudeDir, { recursive: true });
fs.writeFileSync(skipClaudeSettings, JSON.stringify({ permissions: { allow: ["Bash(npm test)"] } }, null, 2), "utf8");
const skipOutput = runInstaller([skipTarget, "--write"]);
assert(skipOutput.includes("skipped existing: AGENTS.md"), "Write mode must skip existing AGENTS.md by default");
assert(skipOutput.includes("merged existing: .claude/settings.json"), "Write mode must merge existing Claude settings by default");
assert(skipOutput.includes("Existing files were skipped"), "Write mode must tell users how to overwrite");
assert(fs.readFileSync(skipAgents, "utf8") === "KEEP_ME", "Write mode must preserve existing AGENTS.md");
const mergedClaudeSettings = JSON.parse(fs.readFileSync(skipClaudeSettings, "utf8"));
assert(mergedClaudeSettings.permissions?.allow?.includes("Bash(npm test)"), "Claude settings merge must preserve existing permissions");
assert(
  JSON.stringify(mergedClaudeSettings.hooks?.SessionStart || []).includes("node hooks/devflow-session-start.js"),
  "Claude settings merge must add DevFlow SessionStart hook"
);

const forceTarget = makeTarget("force");
const forceAgents = path.join(forceTarget, "AGENTS.md");
fs.writeFileSync(forceAgents, "REPLACE_ME", "utf8");
const forceOutput = runInstaller([forceTarget, "--write", "--force"]);
const forceBody = fs.readFileSync(forceAgents, "utf8");
assert(forceOutput.includes("overwrote: AGENTS.md"), "Force mode must report overwriting existing AGENTS.md");
assert(forceBody !== "REPLACE_ME", "Force mode must replace existing AGENTS.md");
assert(forceBody.includes("DevFlow Core Agent Prompt"), "Force mode must install the DevFlow AGENTS.md");

console.log("Installer validation passed");
console.log("Checked dry-run, create, check, skip-existing, force-overwrite, manifest coverage, and installed runtime self-containment");
