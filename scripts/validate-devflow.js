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

/** Protects the hybrid boundary: only deterministic A/B/C successes bypass Core. */
function assertHybridLifecycleContract(core) {
  for (const edge of [
    "Skip-Brainstorm Design-lite success: Cut -> Build -> Prove",
    "A direct success: Brainstorm -> Spec -> Cut -> Plan -> Build -> Prove",
    "B direct success: Brainstorm -> Cut -> Plan -> Build -> Prove",
    "C direct success: Brainstorm -> Cut -> Build -> Prove"
  ]) {
    assert(core.includes(edge), `Core flow map missing direct success edge: ${edge}`);
  }

  for (const exception of ["CUT_REDUCE", "CUT_REUSE", "CUT_BLOCKED", "scope drift", "BUILD_BLOCKED", "Proof FAIL or BLOCKED", "PUA recovery"]) {
    assert(core.includes(exception), `Core flow map missing exception return: ${exception}`);
  }
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
assertHybridLifecycleContract(core);
for (const evidence of [
  "explicit independent review -> investigation or pure inquiry -> approved scope -> risk gate",
  "clear goal, existing local behavior, one plausible path, local impact, reversible change",
  "no security/data-loss/permission/contract risk, and quick proof",
  "Skipping Brainstorm compresses analysis only; it never skips Cut or Prove",
  "Unapproved edits never use Fast",
  "Brainstorm required:",
  "Depth hint:",
  "Design-lite contract and Depth C"
]) {
  assert(core.includes(evidence), `Core risk-adaptive contract missing: ${evidence}`);
}
assert(!read("commands/devflow.toml").includes("Use Design-lite only after Brainstorm"), "Design-lite must not wait for Brainstorm after a risk-gate skip");
assert(read("skills/devflow-cut/SKILL.md").includes("Design-lite contract"), "Cut must accept a Core-selected Design-lite skip contract");
assert(read("commands/devflow.toml").includes("Unapproved edits are not Fast"), "Generic /devflow must keep unapproved edits out of Fast");

/** Guards the meta-skill capability contract: specialist roles stay bounded and result-bearing, never guidance-only. */
function assertCapabilityContract(coreMethods, handoffSurfaces) {
  assert(coreMethods.includes("Owner: current DevFlow node"), "core-methods.md must own the capability-call record");
  assert(coreMethods.includes("Role: bounded specialist work"), "core-methods.md must define the bounded specialist role");
  assert(coreMethods.includes("Return: result / not-applicable / failure facts"), "core-methods.md must define specialist return facts");
  for (const [rel, body] of handoffSurfaces) {
    assert(!body.includes("(role: guides execution)"), `${rel} must not fix External Skills to guidance-only`);
  }
}

const coreMethods = read("skills/devflow-core/references/core-methods.md");
assertCapabilityContract(coreMethods, [
  ["skills/devflow-cut/SKILL.md", read("skills/devflow-cut/SKILL.md")],
  ["skills/devflow-plan/SKILL.md", read("skills/devflow-plan/SKILL.md")],
  ["commands/devflow-plan.toml", read("commands/devflow-plan.toml")],
  ["skills/devflow-build/SKILL.md", read("skills/devflow-build/SKILL.md")]
]);

/** Protects Brainstorm from regressing to either premature completion or category-by-category interrogation. */
function assertBrainstormFollowUpContract(skill, discipline) {
  for (const body of [skill, discipline]) {
    for (const evidence of [
      "decision-impact gap",
      "could change scope, a constraint, acceptance, or a subsequent problem-space decision",
      "introduces a load-bearing assumption, exposes a contradiction",
      "no decision-impact gap remains"
    ]) {
      assert(body.includes(evidence), `Brainstorm follow-up contract missing: ${evidence}`);
    }
  }

  assert(skill.includes("If exploration exposes a new decision-impact gap, return to step 4"), "Brainstorm must return multi-angle gaps to one-question clarification");
  assert(discipline.includes("If an angle exposes a new decision-impact gap, return to One-Question Discipline"), "Interview discipline must return multi-angle gaps to one-question clarification");
}

/** Ensures Brainstorm never chooses depth but can follow its predefined success edge after explicit selection. */
function assertBrainstormSelectionContract(skill) {
  const frontmatter = skill.slice(0, skill.indexOf("---", 3) + 3);
  assert(frontmatter.includes("explicit A/B/C depth gate"), "Brainstorm frontmatter must expose the A/B/C gate");
  assert(frontmatter.includes("user-selected predefined direct branch"), "Brainstorm frontmatter must preserve user-selected direct branching");
  assert(skill.includes("Do not select Fast, Design-lite, a depth, an approach, or a method on the user's behalf."), "Brainstorm must not select depth for the user");
  assert(skill.indexOf("## A/B/C Gate") > skill.indexOf("## Fixed Output Contract"), "Brainstorm must present A/B/C after the fixed summary");
}

const brainstorm = read("skills/devflow-brainstorm/SKILL.md");
const interviewDiscipline = read("skills/devflow-brainstorm/references/interview-discipline.md");
assert(brainstorm.includes("Core supplies a depth hint"), "Brainstorm must consume Core-selected depth");
assert(brainstorm.includes("`compact`"), "Brainstorm must define compact clarification");
assert(brainstorm.includes("ask no clarification question"), "Brainstorm must avoid questions when no decision-impact gap remains");
assert(!brainstorm.includes("There is no fast lane"), "Brainstorm must not prohibit adaptive clarification");
assertBrainstormFollowUpContract(brainstorm, interviewDiscipline);
assertBrainstormSelectionContract(brainstorm);

const prove = read("skills/devflow-prove/SKILL.md");
const proofMethods = read("skills/devflow-prove/references/proof-recovery-methods.md");
assert(prove.includes("Context loading is conditional"), "Prove must define conditional context loading");
assert(prove.includes("only when the change touches DevFlow runtime rules"), "Prove must limit framework self-test loading");
assert(proofMethods.includes("## Proof Context Selection"), "Proof methods must define context selection");
assert(proofMethods.includes("Narrow context does not weaken diff review"), "Proof methods must retain proof safeguards");

const planSkill = read("skills/devflow-plan/SKILL.md");
const planMethods = read("skills/devflow-plan/references/plan-methods.md");
const buildSkill = read("skills/devflow-build/SKILL.md");
for (const [rel, body] of [
  ["skills/devflow-plan/SKILL.md", planSkill],
  ["skills/devflow-plan/references/plan-methods.md", planMethods],
  ["skills/devflow-build/SKILL.md", buildSkill]
]) {
  assert(body.includes("directly changed neighbor"), `${rel} must allow bounded anchor and neighbor reads`);
  assert(body.includes("broad"), `${rel} must prohibit broad rediscovery`);
}

for (const [rel, evidence] of [
  ["skills/devflow-brainstorm/SKILL.md", "only by the user-selected direct branch"],
  ["skills/devflow-spec/SKILL.md", "approved A-branch Spec directly enters `devflow-cut`"],
  ["skills/devflow-cut/SKILL.md", "A/B directly enter `devflow-plan`; C directly enters `devflow-build`"],
  ["skills/devflow-plan/SKILL.md", "approved A/B Plan directly enters `devflow-build`"],
  ["skills/devflow-build/SKILL.md", "completed Build directly enters `devflow-prove`"],
  ["skills/devflow-prove/SKILL.md", "Exception Return Boundary"]
]) {
  assert(read(rel).includes(evidence), `${rel} missing hybrid lifecycle evidence: ${evidence}`);
}

/** Guards the single-source ladder: SKILL.md owns the rungs and the Ponytail term; cut-methods.md points at it. */
const cutSkill = read("skills/devflow-cut/SKILL.md");
const cutMethods = read("skills/devflow-cut/references/cut-methods.md");
assert(cutSkill.includes("canonical ladder"), "cut SKILL.md must own the canonical Minimal Solution Ladder");
assert(cutSkill.includes("Ponytail"), "cut SKILL.md must define the Ponytail term used by the Required Gates");
assert(cutMethods.includes("canonical Minimal Solution Ladder lives in `skills/devflow-cut/SKILL.md`"), "cut-methods.md must point at the canonical ladder");
assert(!cutMethods.includes("1. No change."), "cut-methods.md must not define a second ladder");

/** Guards the lifecycle status-line rule on both always-visible surfaces. */
assert(agents.includes("end each user-facing message with one status line"), "AGENTS.md must require the lifecycle status line");
assert(core.includes("end each user-facing message with one status line"), "devflow-core must require the lifecycle status line");
assert(agents.includes("maintain a `todo_write` list with one item per active work unit"), "AGENTS.md must require todo/goal status visibility");
assert(core.includes("maintain a `todo_write` list with one item per active work unit"), "devflow-core must require todo/goal status visibility");

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
    "skills/devflow-prove/references/proof-recovery-methods.md",
    "skills/devflow-plan/references/plan-methods.md",
    "skills/devflow-prove/references/code-review-checklist.md"
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
runVerifier("scripts/devflow-budget.js");
runVerifier("scripts/validate-route-consistency.js");

// v2 计划契约与双索引：契约文本、机检入口与索引文件必须同时存在，否则规则会与实现漂移。
const usabilityPlanSkill = read("skills/devflow-plan/SKILL.md");
for (const marker of ["## Progress", "Rejected", "Six fields per task", "Landed:"]) {
  assert(usabilityPlanSkill.includes(marker), `devflow-plan must publish the v2 contract marker ${marker}`);
}
const usabilityPlanChecker = read("scripts/devflow-plan.js");
for (const marker of ["v2TaskFields", "detectV2", "checkIndexes", "--index"]) {
  assert(usabilityPlanChecker.includes(marker), `devflow-plan.js must implement the v2/index marker ${marker}`);
}
for (const indexFile of ["docs/plans/INDEX.md", "docs/features/INDEX.md"]) {
  assert(fs.existsSync(path.join(root, indexFile)), `capability index missing: ${indexFile}`);
}
assert(read("AGENTS.md").includes("docs/features/INDEX.md"), "AGENTS.md must point Sense at the capability index");
assert(read("AGENTS.md").includes("--index --query"), "AGENTS.md must document the progressive index query mode");
assert(read("docs/features/INDEX.md").includes("触发词"), "docs/features/INDEX.md must publish a trigger-word column for progressive routing");
assert(read("skills/devflow-learn/SKILL.md").includes("docs/features/INDEX.md"), "devflow-learn must own the capability index row");
assert(read("skills/devflow-prove/SKILL.md").includes("Landed:"), "devflow-prove must write the landing record on PASS");

console.log("DevFlow validation passed");
console.log(`Checked ${requiredFiles.length} runtime files, ${cards.length} learning cards, and selected host and trigger contracts`);
