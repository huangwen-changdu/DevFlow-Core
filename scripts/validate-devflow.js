const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Runs a focused sibling verifier so package validation proves cross-file contracts. */
function runVerifier(rel) {
  const result = spawnSync(process.execPath, [path.join(root, rel)], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${rel} failed:\n${result.stdout}\n${result.stderr}`);
}

/** Returns cards linked by the index; card bodies are checked only after index selection. */
function linkedCards(index) {
  return [...index.matchAll(/\]\((cards\/[^)]+\.md)\)/g)].map((match) => `.copilot/${match[1]}`);
}

const requiredFiles = [
  "AGENTS.md",
  "CLAUDE.md",
  "README.md",
  "docs/PRD.md",
  "package.json",
  "plugin.json",
  "gemini-extension.json",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-core/references/core-methods.md",
  "skills/devflow-cut/references/cut-methods.md",
  "skills/devflow-spec/references/spec-plan-methods.md",
  "skills/devflow-build/references/build-methods.md",
  "skills/devflow-prove/references/proof-recovery-methods.md",
  "scripts/validate-host-adapters.js",
  "scripts/validate-skill-triggers.js",
  "scripts/validate-learning-loop.js",
  "scripts/install-devflow.js",
  "scripts/install-devflow-user.js"
];

for (const rel of requiredFiles) assert(fs.existsSync(path.join(root, rel)), `missing required runtime file: ${rel}`);

const agents = read("AGENTS.md");
assert(Buffer.byteLength(agents, "utf8") <= 8 * 1024, `AGENTS.md must be 8 KiB or smaller, found ${Buffer.byteLength(agents, "utf8")} bytes`);
assert(agents.toLowerCase().includes("runtime prompt"), "AGENTS.md must identify its startup-only boundary");
assert(agents.includes("When skills are unavailable"), "AGENTS.md must retain portable fallback");
assert(!agents.includes("Method 0 (Architect Mindset) through Method 15"), "AGENTS.md must not require every lifecycle method");

const core = read("skills/devflow-core/SKILL.md");
for (const reference of [
  "cut-methods.md",
  "spec-plan-methods.md",
  "build-methods.md",
  "proof-recovery-methods.md"
]) {
  assert(core.includes(reference), `Core loading map missing ${reference}`);
}
assert(!core.includes("Method 0-15 + Capability Matrix"), "Core must not require full lifecycle methods at route start");

for (const directory of fs.readdirSync(path.join(root, "skills"), { withFileTypes: true })) {
  if (!directory.isDirectory() || !directory.name.startsWith("devflow-")) continue;
  const rel = `skills/${directory.name}/SKILL.md`;
  const body = read(rel);
  assert(body.startsWith("---"), `${rel} missing frontmatter`);
  assert(body.includes("description:"), `${rel} missing trigger description`);
  assert(body.includes("Verification"), `${rel} missing verification boundary`);
}

const packageJson = JSON.parse(read("package.json"));
for (const script of ["test", "learn:verify", "trigger:verify", "host:verify", "install:verify", "user:verify", "verify:all"]) {
  assert(packageJson.scripts?.[script], `package.json missing ${script} script`);
}

const plugin = JSON.parse(read("plugin.json"));
for (const entry of Object.values(plugin.entrypoints || {})) {
  assert(fs.existsSync(path.join(root, entry)), `plugin entrypoint missing: ${entry}`);
}

for (const installer of ["scripts/install-devflow.js", "scripts/install-devflow-user.js"]) {
  const body = read(installer);
  for (const reference of [
    "skills/devflow-cut/references/cut-methods.md",
    "skills/devflow-spec/references/spec-plan-methods.md",
    "skills/devflow-build/references/build-methods.md",
    "skills/devflow-prove/references/proof-recovery-methods.md"
  ]) {
    assert(body.includes(reference), `${installer} must install ${reference}`);
  }
}

const index = read(".copilot/LEARNING_INDEX.md");
const cards = linkedCards(index);
assert(cards.length > 0, "learning index must link at least one card");
for (const card of cards) {
  const body = read(card);
  for (const field of ["- Trigger:", "- Lesson:", "- Next action:", "- Scope:", "- Related:", "- Evidence:", "- Invalidation:"]) {
    assert(body.includes(field), `${card} missing learning-card field ${field}`);
  }
}

runVerifier("scripts/validate-host-adapters.js");
runVerifier("scripts/validate-skill-triggers.js");

console.log("DevFlow validation passed");
console.log(`Checked ${requiredFiles.length} runtime files, ${cards.length} learning cards, and selected host and trigger contracts`);
