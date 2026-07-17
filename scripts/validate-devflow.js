const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  ".github/copilot-instructions.md",
  ".github/instructions/devflow.instructions.md",
  ".github/prompts/devflow.prompt.md",
  ".codebuddy/rules/devflow-core/RULE.mdc",
  ".codex/hooks.json",
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
  "plugin.json",
  "gemini-extension.json",
  "docs/PRD.md",
  "docs/features/README.md",
  "docs/features/devflow-core.md",
  "docs/features/validation-harness.md",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-core/references/core-methods.md",
  "skills/devflow-core/references/decision-tree.md",
  "skills/devflow-core/references/project-structure.md",
  "skills/devflow-core/references/reference-projects.md",
  "skills/devflow-core/references/skill-guide.md",
  "skills/devflow-brainstorm/SKILL.md",
  "skills/devflow-spec/SKILL.md",
  "skills/devflow-cut/SKILL.md",
  "skills/devflow-cut/references/native-capability-checklist.md",
  "skills/devflow-build/SKILL.md",
  "skills/devflow-prove/SKILL.md",
  "skills/devflow-pua/SKILL.md",
  "skills/devflow-pua/references/methodology-router.md",
  "skills/devflow-pua/references/methodology-library.md",
  "skills/devflow-pua/references/flavor-display.md",
  "skills/devflow-learn/SKILL.md",
  "skills/devflow-project-knowledge/SKILL.md",
  "skills/devflow-audit/SKILL.md",
  "skills/devflow-brainstorm/references/interview-discipline.md",
  "skills/devflow-prove/references/flow-self-test.md",
  "skills/skill-call-diagram.md",
  "scripts/validate-learning-loop.js",
  "scripts/report-scenario-coverage.js",
  "scripts/validate-skill-triggers.js",
  "scripts/validate-host-adapters.js",
  "scripts/install-devflow.js",
  "scripts/validate-installer.js",
  "scripts/install-devflow-user.js",
  "scripts/validate-user-installer.js",
  "scripts/devflow-debt.js",
  "scripts/devflow-review.js",
  "scripts/devflow-spec.js",
  "scripts/devflow-plan.js",
  "scripts/devflow-audit.js",
  ".copilot/LEARNING_INDEX.md",
  ".copilot/cards/agents-runtime-prompt-boundary.md"
];

const requiredTerms = [
  "Sense -> Brainstorm -> [STOP: Depth A/B/C]",
  "Depth Selection Gate",
  "Ponytail",
  "Karpathy",
  "Proof Before Done",
  "Skill Activation Check",
  "Issue Triage",
  "Problem Investigation",
  "Requirement To Implementation",
  "Bug Report",
  "Codex Trigger Surface",
  "Host Adapter Contract Drift",
  "Codex Trigger Contract",
  "problem report",
  "requirement",
  "bug report",
  "Root-Cause Check",
  "devflow:",
  "Overbuild Check",
  "Reuse Check",
  "Diff Check",
  "Scope Check",
  "Pressure Recovery Gate",
  "Restart Brainstorm",
  "Discarded context",
  "Keep only verified facts",
  "User-view miss",
  "Satisfaction gap",
  "Guiding Principles",
  "Blue-team attack",
  "New success contract",
  "METHOD: {flavor} / {method}",
  "SWITCH:",
  "methodology-router.md",
  "methodology-library.md",
  "flavor-display.md",
  "Repeated Missing-Piece Trigger",
  "Opposite method switching",
  "different/opposite method",
  "少个",
  "Repeat Correction Gate",
  "Scenario 6A: Repeated Correction Learning Closure",
  "Scenario 6B: New Reusable Pitfall Card",
  "Scenario 6C: User Challenge Pressure Recovery",
  "Scenario 6D: Progressive Knowledge Recall",
  "Scenario 9: Target Project Install Check",
  "devflow-pua",
  "/devflow-pua",
  "docs/plans/YYYY-MM-DD-<short-kebab-name>.md",
  "docs/specs/YYYY-MM-DD-<short-kebab-name>.md",
  "Plan landing",
  "Spec landing",
  "Spec coverage",
  "misplaced content",
  "repeated user correction",
  "Learning closure",
  "Learning loop validation passed",
  "learn:verify",
  "Knowledge recall",
  "docs/project-knowledge/",
  "Scenario Coverage Report",
  "scenario:coverage",
  "report-scenario-coverage",
  "Weak layers",
  "Suggested next scenarios",
  "Skill Trigger Verification Report",
  "trigger:verify",
  "validate-skill-triggers",
  "Host Adapter Verification Report",
  "host:verify",
  "validate-host-adapters",
  "debt:verify",
  "DevFlow debt self-test passed",
  "review:verify",
  "DevFlow review self-test passed",
  "plan:verify",
  "DevFlow plan self-test passed",
  "spec:verify",
  "DevFlow spec self-test passed",
  "devflow-spec",
  "/devflow-spec",
  "audit:verify",
  "devflow-audit",
  "/devflow-audit",
  "repo-wide audit",
  "reuse",
  "install:target",
  "install-devflow",
  "install:verify",
  "Installer validation passed",
  "install:user",
  "user:verify",
  "User installer validation passed",
  "manifest coverage",
  "installed runtime self-containment",
  "Target Project Install Check",
  "--check",
  "Check passed",
  "dry-run",
  "--force",
  "Copyable Workflows",
  "Problem Investigation Workflow",
  "Requirement Implementation Workflow",
  "Bug Fix Workflow",
  "DevFlow-Core PRD",
  "Agent Engineering Architecture",
  "Product Iteration Ledger",
  "PRD Is Not Runtime Source",
  "Immediate Iteration Backlog",
  "Feature Ledger Recall",
  "Small Request Boundary",
  "Design-lite",
  "Route Choice Needed",
  "impact, risk, uncertainty, and proof",
  "Interview Discipline",
  "documentation capture",
  "interview-discipline.md",
  "small-request-boundary-routing",
  "Method Lens",
  "Root Cause",
  "Working Backwards",
  "First Principles Cut",
  "adversarial review",
  "Data/Proof",
  "Operational Owner",
  "method-lens-runtime",
  "spec-document-runtime",
  "DevFlow Core Runtime Feature Ledger",
  "Validation Harness Feature Ledger",
  "Version History",
  "Known Constraints",
  "Goal:",
  "Smallest useful plan:",
  "Command:",
  "Result:",
  "Judgment: PASS / FAIL / BLOCKED",
  "Skills enforce their own gates",
  "Not for new requirements",
  "Violating the letter of the rules is violating the spirit of the rules",
  "Red Flags"
];

const skillNames = [
  "devflow-core",
  "devflow-brainstorm",
  "devflow-spec",
  "devflow-cut",
  "devflow-build",
  "devflow-prove",
  "devflow-pua",
  "devflow-learn",
  "devflow-project-knowledge",
  "devflow-audit"
];

const commandFiles = [
  "commands/devflow.toml",
  "commands/devflow-spec.toml",
  "commands/devflow-plan.toml",
  "commands/devflow-review.toml",
  "commands/devflow-debt.toml",
  "commands/devflow-prove.toml",
  "commands/devflow-pua.toml",
  "commands/devflow-learn.toml",
  "commands/devflow-audit.toml"
];

const prohibitedSkillDescriptionTerms = [
  "DevFlow-Core",
  "Captures learning and pitfall cards"
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasFrontmatter(body) {
  return /^---\r?\n[\s\S]+?\r?\n---\r?\n/.test(body);
}

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`);
}

for (const term of requiredTerms) {
  const found = requiredFiles
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdc"))
    .some((file) => read(file).includes(term));
  assert(found, `Required term not found in references/rules: ${term}`);
}

for (const name of skillNames) {
  const rel = `skills/${name}/SKILL.md`;
  const body = read(rel);
  const descriptionLine = body.match(/^description:\s*(.+)$/m)?.[1] || "";
  assert(hasFrontmatter(body), `${rel} missing YAML frontmatter`);
  assert(body.includes(`name: ${name}`), `${rel} frontmatter name mismatch`);
  assert(/^["']?Use\s+(when|before|after)\b/i.test(descriptionLine), `${rel} description must start with a trigger phrase`);
  for (const term of prohibitedSkillDescriptionTerms) {
    assert(!descriptionLine.includes(term), `${rel} description must not contain brand or generic summary term: ${term}`);
  }
  assert(body.includes("##") || body.includes("# "), `${rel} missing markdown body`);
  assert(body.includes("Verification") || body.includes("Proof"), `${rel} missing verification/proof section`);
  assert(body.includes("Anti-Rationalization"), `${rel} missing anti-rationalization section`);
}

for (const file of commandFiles) {
  const body = read(file);
  assert(body.includes("description ="), `${file} missing description`);
  assert(body.includes("prompt ="), `${file} missing prompt`);
}

const proveCommand = read("commands/devflow-prove.toml");
for (const term of [
  "run adversarial review before completion",
  "strongest plausible reason",
  "Adversarial review:",
  "report FAIL"
]) {
  assert(proveCommand.includes(term), `commands/devflow-prove.toml missing adversarial action: ${term}`);
}

const agentsRuntimeBody = read("AGENTS.md");
for (const term of [
  "use First Principles Cut",
  "reduce the work to facts, constraints, and invariants",
  "run adversarial review against acceptance criteria",
  "report `FAIL` or continue the appropriate route"
]) {
  assert(agentsRuntimeBody.includes(term), `AGENTS.md missing method/proof runtime rule: ${term}`);
}

const proveSkill = read("skills/devflow-prove/SKILL.md");
for (const term of [
  "description:",
  "performs adversarial review for development work",
  "Command/Result/Adversarial review/Judgment",
  "Adversarial review: <strongest challenge and disposition"
]) {
  assert(proveSkill.includes(term), `skills/devflow-prove/SKILL.md missing visible adversarial contract: ${term}`);
}

for (const [file, terms] of [
  ["commands/devflow.toml", ["First Principles Cut", "adversarial review", "Adversarial review:"]],
  [".github/copilot-instructions.md", ["First Principles Cut", "perform adversarial review", "Adversarial review:"]],
  [".github/instructions/devflow.instructions.md", ["First Principles Cut", "require adversarial review", "Adversarial review:"]],
  [".github/prompts/devflow.prompt.md", ["First Principles Cut", "adversarial review", "Adversarial review:"]],
  [".codebuddy/rules/devflow-core/RULE.mdc", ["First Principles Cut", "adversarial review", "Adversarial review:"]],
  [".claude/commands/devflow-core.md", ["First Principles Cut", "Adversarial review:"]],
  ["hooks/devflow-session-start.js", ["First Principles Cut", "adversarial review", "Command, Result, Adversarial review, and Judgment"]]
]) {
  const body = read(file);
  for (const term of terms) {
    assert(body.includes(term), `${file} missing synchronized method/proof surface: ${term}`);
  }
}

const flowSelfTest = read("skills/devflow-prove/references/flow-self-test.md");
for (const term of [
  "Scenario 1C-A: First Principles Cut",
  "Facts:",
  "Constraints:",
  "Invariants:",
  "Smallest necessary mechanism:",
  "Scenario 7A: Adversarial Review Rejects Completion",
  "Adversarial review:",
  "Judgment: FAIL"
]) {
  assert(flowSelfTest.includes(term), `flow-self-test missing method/proof behavior: ${term}`);
}

const packageJson = JSON.parse(read("package.json"));
assert(packageJson.scripts?.test === "node scripts/validate-devflow.js", "package.json test script must run validate-devflow.js");
assert(packageJson.scripts?.["learn:verify"] === "node scripts/validate-learning-loop.js", "package.json learn:verify script must run validate-learning-loop.js");
assert(packageJson.scripts?.["scenario:coverage"] === "node scripts/report-scenario-coverage.js", "package.json scenario:coverage script must run report-scenario-coverage.js");
assert(packageJson.scripts?.["trigger:verify"] === "node scripts/validate-skill-triggers.js", "package.json trigger:verify script must run validate-skill-triggers.js");
assert(packageJson.scripts?.["host:verify"] === "node scripts/validate-host-adapters.js", "package.json host:verify script must run validate-host-adapters.js");
assert(packageJson.scripts?.["install:verify"] === "node scripts/validate-installer.js", "package.json install:verify script must run validate-installer.js");
assert(packageJson.scripts?.["user:verify"] === "node scripts/validate-user-installer.js", "package.json user:verify script must run validate-user-installer.js");
assert(packageJson.scripts?.["debt:verify"] === "node scripts/devflow-debt.js --self-test", "package.json debt:verify script must run devflow-debt self-test");
assert(packageJson.scripts?.["review:verify"] === "node scripts/devflow-review.js --self-test", "package.json review:verify script must run devflow-review self-test");
assert(packageJson.scripts?.["spec:verify"] === "node scripts/devflow-spec.js --self-test", "package.json spec:verify script must run devflow-spec self-test");
assert(packageJson.scripts?.["plan:verify"] === "node scripts/devflow-plan.js --self-test", "package.json plan:verify script must run devflow-plan self-test");
assert(packageJson.scripts?.["audit:verify"] === "node scripts/devflow-audit.js --self-test", "package.json audit:verify script must run devflow-audit self-test");
assert(packageJson.scripts?.["verify:all"] === "npm test && npm run learn:verify && npm run scenario:coverage && npm run trigger:verify && npm run host:verify && npm run install:verify && npm run user:verify && npm run debt:verify && npm run review:verify && npm run spec:verify && npm run plan:verify && npm run audit:verify", "package.json verify:all script must run the full local verification matrix");
assert(packageJson.scripts?.["install:target"] === "node scripts/install-devflow.js", "package.json install:target script must run install-devflow.js");
assert(packageJson.scripts?.["install:user"] === "node scripts/install-devflow-user.js", "package.json install:user script must run install-devflow-user.js");

const installerBody = read("scripts/install-devflow.js");
for (const term of [
  "Default mode is dry-run",
  "--write",
  "--force",
  "--check",
  "Existing files are skipped unless --force is passed.",
  "Check passed",
  "skipped existing",
  "merged existing",
  "overwrote",
  "AGENTS.md",
  ".claude/settings.json",
  ".claude/commands/devflow-core.md",
  "hooks/devflow-session-start.js",
  "commands/devflow.toml",
  "commands/devflow-spec.toml",
  "commands/devflow-pua.toml",
  "commands/devflow-audit.toml",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-brainstorm/references/interview-discipline.md",
  "skills/devflow-spec/SKILL.md",
    "skills/devflow-pua/SKILL.md",
    "skills/devflow-project-knowledge/SKILL.md",
    "skills/devflow-pua/references/methodology-router.md",
  "skills/devflow-pua/references/methodology-library.md",
  "skills/devflow-pua/references/flavor-display.md",
  "skills/devflow-audit/SKILL.md",
  "skills/devflow-brainstorm/references/interview-discipline.md",
  "scripts/devflow-debt.js",
  "scripts/devflow-review.js",
  "scripts/devflow-spec.js",
  "scripts/devflow-plan.js",
  "scripts/devflow-audit.js",
  "No files were changed"
]) {
  assert(installerBody.includes(term), `scripts/install-devflow.js missing installer safety term: ${term}`);
}

const debtScriptBody = read("scripts/devflow-debt.js");
for (const term of [
  "DevFlow debt self-test passed",
  "No devflow debt markers found.",
  "no-ceiling,no-trigger",
  "revisit trigger detection",
  "placeholder filtering"
]) {
  assert(debtScriptBody.includes(term), `scripts/devflow-debt.js missing debt verifier term: ${term}`);
}

const reviewScriptBody = read("scripts/devflow-review.js");
for (const term of [
  "DevFlow review self-test passed",
  "Missing gates",
  "Judgment: FAIL",
  "Overbuild Check"
]) {
  assert(reviewScriptBody.includes(term), `scripts/devflow-review.js missing review verifier term: ${term}`);
}

const planScriptBody = read("scripts/devflow-plan.js");
for (const term of [
  "DevFlow plan self-test passed",
  "Missing: at least one Task field",
  "Judgment: FAIL",
  "Not doing",
  "vague plan blocking",
  "plan landing guidance",
  "Plan landing"
]) {
  assert(planScriptBody.includes(term), `scripts/devflow-plan.js missing plan verifier term: ${term}`);
}

const specScriptBody = read("scripts/devflow-spec.js");
for (const term of [
  "DevFlow spec self-test passed",
  "required section detection",
  "vague spec blocking",
  "spec landing guidance",
  "Spec landing",
  "Judgment: FAIL"
]) {
  assert(specScriptBody.includes(term), `scripts/devflow-spec.js missing spec verifier term: ${term}`);
}

const auditScriptBody = read("scripts/devflow-audit.js");
for (const term of [
  "DevFlow audit self-test passed",
  "DevFlow audit report",
  "reuse",
  "stdlib",
  "native",
  "yagni",
  "delete",
  "duplicate declaration candidate",
  "confirm findings by reading code before editing"
]) {
  assert(auditScriptBody.includes(term), `scripts/devflow-audit.js missing audit verifier term: ${term}`);
}

const installerValidationBody = read("scripts/validate-installer.js");
for (const term of [
  "Installer validation passed",
  "dry-run",
  "created: AGENTS.md",
  "pua methodology router",
  "pua methodology library",
  "pua flavor display",
  "Check passed",
  "changed: AGENTS.md",
  "skipped existing: AGENTS.md",
  "overwrote: AGENTS.md"
]) {
  assert(installerValidationBody.includes(term), `scripts/validate-installer.js missing regression term: ${term}`);
}

const userInstallerBody = read("scripts/install-devflow-user.js");
for (const term of [
  "Default target is CODEX_HOME or ~/.codex.",
  "Existing user files are skipped unless --force is passed.",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-spec/SKILL.md",
    "skills/devflow-pua/SKILL.md",
    "skills/devflow-project-knowledge/SKILL.md",
    "skills/devflow-pua/references/methodology-router.md",
  "skills/devflow-pua/references/methodology-library.md",
  "skills/devflow-pua/references/flavor-display.md",
  "skills/devflow-audit/SKILL.md",
  "skills/devflow-brainstorm/references/interview-discipline.md",
  "commands/devflow.toml",
  "commands/devflow-spec.toml",
  "commands/devflow-pua.toml",
  "commands/devflow-audit.toml",
  "scripts/devflow-plan.js",
  "scripts/devflow-spec.js",
  "scripts/devflow-audit.js",
  "Check passed: user-level runtime matches this package."
]) {
  assert(userInstallerBody.includes(term), `scripts/install-devflow-user.js missing user installer term: ${term}`);
}

const userInstallerValidationBody = read("scripts/validate-user-installer.js");
for (const term of [
  "User installer validation passed",
  "skip-existing",
  "user scope boundaries",
  "User installer must not install AGENTS.md"
]) {
  assert(userInstallerValidationBody.includes(term), `scripts/validate-user-installer.js missing regression term: ${term}`);
}

const hookBody = read("hooks/devflow-session-start.js");
for (const term of [
  "DevFlow Core active",
  "SessionStart",
  "devflow-pua",
  "docs/specs/YYYY-MM-DD-<short-kebab-name>.md",
  "docs/plans/YYYY-MM-DD-<short-kebab-name>.md",
  "Command, Result, Adversarial review, and Judgment: PASS / FAIL / BLOCKED"
]) {
  assert(hookBody.includes(term), `hooks/devflow-session-start.js missing hook term: ${term}`);
}

const hookConfig = read("hooks/hooks.json");
for (const term of [
  "SessionStart",
  "CLAUDE_PLUGIN_ROOT",
  "devflow-session-start.js"
]) {
  assert(hookConfig.includes(term), `hooks/hooks.json missing hook config term: ${term}`);
}

const claudeSettings = read(".claude/settings.json");
for (const term of [
  "SessionStart",
  "node hooks/devflow-session-start.js"
]) {
  assert(claudeSettings.includes(term), `.claude/settings.json missing hook setting term: ${term}`);
}

const codexSettings = read(".codex/hooks.json");
for (const term of [
  "SessionStart",
  "node hooks/devflow-session-start.js"
]) {
  assert(codexSettings.includes(term), `.codex/hooks.json missing hook setting term: ${term}`);
}

const claudeDevflowCommand = read(".claude/commands/devflow-core.md");
for (const term of [
  "skills/devflow-core/SKILL.md",
  "skills/devflow-brainstorm/SKILL.md",
  "skills/devflow-pua/SKILL.md",
  "Ask exactly one smallest blocking question",
  "page cannot clearly distinguish prompts from quick questions"
]) {
  assert(claudeDevflowCommand.includes(term), `.claude/commands/devflow-core.md missing command trigger term: ${term}`);
}

const triggerValidationBody = read("scripts/validate-skill-triggers.js");
for (const term of [
  "Command cases",
  "spec command",
  "plan command",
  "review command",
  "debt command",
  "/devflow-plan",
  "/devflow-spec",
  "/devflow-review",
  "/devflow-debt",
  "/devflow-pua",
  "/devflow-audit",
  "scripts/devflow-debt.js",
  "scripts/devflow-review.js",
  "scripts/devflow-plan.js",
  "scripts/devflow-spec.js",
  "scripts/devflow-audit.js"
]) {
  assert(triggerValidationBody.includes(term), `scripts/validate-skill-triggers.js missing command trigger term: ${term}`);
}

const codexTriggerChecks = [
  ["AGENTS.md", "problem report"],
  ["plugin.json", "problem reports"],
  ["plugin.json", "requirements"],
  ["plugin.json", "bug reports"],
  ["plugin.json", "skills/devflow-brainstorm/references/interview-discipline.md"],
  ["gemini-extension.json", "skills/devflow-brainstorm/references/interview-discipline.md"],
  ["AGENTS.md", "requirement"],
  ["AGENTS.md", "interview-discipline.md"],
  ["AGENTS.md", "bug report"],
  ["AGENTS.md", "changed wrong"],
  ["AGENTS.md", "有问题"],
  ["AGENTS.md", "不对"],
  ["AGENTS.md", "写错了"],
  ["AGENTS.md", "缺漏"],
  ["AGENTS.md", "少个"],
  ["AGENTS.md", "different/opposite method"],
  ["AGENTS.md", "missing-piece complaint"],
  ["AGENTS.md", "done"],
  ["skills/devflow-core/SKILL.md", "investigating issues"],
  ["skills/devflow-core/SKILL.md", "requirements or bugs"],
  ["skills/devflow-core/SKILL.md", "Brainstorm Interview Discipline"],
  ["skills/devflow-brainstorm/SKILL.md", "requirement"],
  ["skills/devflow-brainstorm/SKILL.md", "documentation capture"],
  ["skills/devflow-brainstorm/SKILL.md", "interview-discipline.md"],
  ["skills/devflow-brainstorm/references/interview-discipline.md", "one-question-at-a-time"],
  ["skills/devflow-brainstorm/references/interview-discipline.md", "DevFlow design contract"],
  ["skills/devflow-spec/SKILL.md", "docs/specs"],
  ["commands/devflow-spec.toml", "Create a DevFlow spec"],
  ["commands/devflow-spec.toml", "scripts/devflow-spec.js"],
  ["skills/devflow-cut/SKILL.md", "root-cause fixes"],
  ["skills/devflow-prove/SKILL.md", "done, fixed, complete"],
  ["skills/devflow-prove/SKILL.md", "Skill Activation Chain Check"],
  ["skills/devflow-pua/SKILL.md", "changed wrong"],
  ["skills/devflow-pua/SKILL.md", "Restart Brainstorm"],
  ["skills/devflow-pua/SKILL.md", "Discarded context"],
  ["skills/devflow-pua/SKILL.md", "Keep only verified facts"],
  ["skills/devflow-pua/SKILL.md", "User-view miss"],
  ["skills/devflow-pua/SKILL.md", "Satisfaction gap"],
  ["skills/devflow-pua/SKILL.md", "Guiding Principles"],
  ["skills/devflow-pua/SKILL.md", "Blue-team attack"],
  ["skills/devflow-pua/SKILL.md", "New success contract"],
  ["skills/devflow-pua/SKILL.md", "SWITCH:"],
  ["skills/devflow-pua/SKILL.md", "Methodology Assets"],
  ["skills/devflow-pua/SKILL.md", "METHOD: {flavor} / {method}"],
  ["skills/devflow-pua/SKILL.md", "SWITCH:"],
  ["skills/devflow-pua/references/methodology-router.md", "Starting Route"],
  ["skills/devflow-pua/references/methodology-router.md", "Failure Switch"],
  ["skills/devflow-pua/references/methodology-router.md", "Huawei"],
  ["skills/devflow-pua/references/methodology-router.md", "Amazon"],
  ["skills/devflow-pua/references/methodology-library.md", "Alibaba: Closure Method"],
  ["skills/devflow-pua/references/methodology-library.md", "Huawei: RCA + Blue-Team"],
  ["skills/devflow-pua/references/methodology-library.md", "Amazon: Customer Backwards"],
  ["skills/devflow-pua/references/methodology-library.md", "Microsoft: Learning Loop"],
  ["skills/devflow-pua/references/flavor-display.md", "Required Lines"],
  ["skills/devflow-pua/references/flavor-display.md", "METHOD: {flavor} / {method}"],
  ["skills/devflow-pua/references/flavor-display.md", "SWITCH:"],
  ["skills/devflow-pua/SKILL.md", "Repeated Missing-Piece Trigger"],
  ["skills/devflow-pua/SKILL.md", "Opposite method switching"],
  ["skills/devflow-pua/SKILL.md", "different or opposite method"],
  ["skills/devflow-pua/SKILL.md", "少个"],
  ["skills/devflow-brainstorm/SKILL.md", "Coverage Map"],
  ["skills/devflow-brainstorm/SKILL.md", "METHOD: {flavor} / {method}"],
  ["skills/devflow-learn/SKILL.md", "repeated missing-piece complaint"],
  ["skills/devflow-learn/SKILL.md", "different/opposite method"],
  ["skills/devflow-core/SKILL.md", "Business recall"],
  ["skills/devflow-project-knowledge/SKILL.md", "渐进披露与落地边界"],
  ["skills/devflow-audit/SKILL.md", "overengineering"],
  ["commands/devflow-pua.toml", "Run DevFlow PUA"],
  ["commands/devflow-audit.toml", "Audit the repository or named scope"],
  ["commands/devflow-learn.toml", "repeated correction"],
  ["commands/devflow-learn.toml", "Learning closure"],
  ["commands/devflow.toml", "interview-discipline.md"],
  [".claude/commands/devflow-core.md", "interview-discipline.md"],
  ["commands/devflow.toml", "problem without explicitly asking for a fix"],
  ["commands/devflow.toml", "Root-Cause Check"]
];

for (const [file, term] of codexTriggerChecks) {
  assert(read(file).includes(term), `${file} missing Codex trigger term: ${term}`);
}

const agentsBody = read("AGENTS.md");
const agentsLines = agentsBody.split(/\r?\n/).length;
assert(agentsLines <= 100, `AGENTS.md should stay prompt-sized, found ${agentsLines} lines`);
assert(agentsBody.includes("AGENTS.md is a runtime prompt"), "AGENTS.md must identify itself as a runtime prompt");

const prohibitedAgentsTerms = [
  "Repository Overview",
  "Quick Start",
  "Reference Map",
  "What It Gives",
  "Installation",
  "Benchmark scoreboard",
  "Details are in",
  "Default Skill",
  "Core Methods",
  "DevFlow Stages",
  "Required Design Output",
  "Required Completion Output"
];

for (const term of prohibitedAgentsTerms) {
  assert(!agentsBody.includes(term), `AGENTS.md contains README/reference-style term: ${term}`);
}

const customizationFiles = [
  ".github/instructions/devflow.instructions.md",
  ".github/prompts/devflow.prompt.md",
  ".codebuddy/rules/devflow-core/RULE.mdc"
];

for (const file of customizationFiles) {
  const body = read(file);
  assert(hasFrontmatter(body), `${file} missing YAML frontmatter`);
  assert(body.includes("description:"), `${file} missing description frontmatter`);
}

const learningIndex = read(".copilot/LEARNING_INDEX.md");
const learningCardLinks = [...learningIndex.matchAll(/\]\((cards\/[^)]+\.md)\)/g)]
  .map((match) => `.copilot/${match[1]}`);

assert(learningCardLinks.length > 0, ".copilot/LEARNING_INDEX.md must link at least one learning card");

for (const file of learningCardLinks) {
  assert(fs.existsSync(path.join(root, file)), `Learning card linked from index is missing: ${file}`);
  const body = read(file);
  for (const field of ["- Trigger:", "- Lesson:", "- Next action:", "- Scope:", "- Related:"]) {
    assert(body.includes(field), `${file} missing learning card field: ${field}`);
  }
}

const featureLedgerDir = path.join(root, "docs/features");
const featureLedgers = fs
  .readdirSync(featureLedgerDir)
  .filter((file) => file.endsWith(".md") && file !== "README.md")
  .map((file) => `docs/features/${file}`);

assert(featureLedgers.length > 0, "docs/features must contain at least one feature ledger");

for (const file of featureLedgers) {
  const body = read(file);
  for (const heading of [
    "## Current State",
    "## Feature Background",
    "## Capability Scope",
    "## Version History",
    "## Key Decisions",
    "## Known Constraints",
    "## Related Artifacts"
  ]) {
    assert(body.includes(heading), `${file} missing feature ledger heading: ${heading}`);
  }
}

const textFiles = requiredFiles.filter((file) =>
  file.endsWith(".md") || file.endsWith(".mdc") || file.endsWith(".toml") || file.endsWith(".json") || file.startsWith("hooks/")
);

const placeholderHits = textFiles.flatMap((file) => {
  const matches = read(file).match(/\b(TODO|TBD|coming soon|placeholders?)\b/gi);
  return matches ? [`${file}: ${matches.join(", ")}`] : [];
});

assert(placeholderHits.length === 0, `Placeholder terms found:\n${placeholderHits.join("\n")}`);

const mojibakeHits = textFiles.flatMap((file) => {
  const matches = read(file).match(/[閿涢惄妤犻崨閳拷鐩鍛楠缁瀛浜鏈涓闇鍒绾澶瑕浠鍋浣鏀泞疄灏绐滶旂屾辫穩亢濡涙锛歅欶鈹�]/g);
  return matches ? [`${file}: ${[...new Set(matches)].join("")}`] : [];
});

assert(mojibakeHits.length === 0, `Mojibake characters found:\n${mojibakeHits.join("\n")}`);

const emojiMojibakeHits = textFiles.flatMap((file) => {
  const matches = read(file).match(/🟠|馃煚/g);
  return matches ? [`${file}: ${[...new Set(matches)].join(",")}`] : [];
});

assert(emojiMojibakeHits.length === 0, `Emoji/mojibake-prone method markers found:\n${emojiMojibakeHits.join("\n")}`);

const nonAsciiMethodLabelHits = textFiles.flatMap((file) => {
  const matches = read(file).match(/方法论：|切换：|鏂规硶|鍛抽亾|鍒囨崲/g);
  return matches ? [`${file}: ${[...new Set(matches)].join(",")}`] : [];
});

assert(
  nonAsciiMethodLabelHits.length === 0,
  `Non-ASCII or mojibake-prone PUA method labels found:\n${nonAsciiMethodLabelHits.join("\n")}`
);

const staleDocsHits = textFiles.flatMap((file) => {
  const matches = read(file).match(/docs\/(?:CORE-METHODS|DECISION-TREE|FLOW-SELF-TEST|NATIVE-CAPABILITY-CHECKLIST|REFERENCE-PROJECTS|SKILL-GUIDE|PROJECT-STRUCTURE)\.md/g);
  return matches ? [`${file}: ${matches.join(", ")}`] : [];
});

assert(staleDocsHits.length === 0, `Runtime references must not point to old docs paths:\n${staleDocsHits.join("\n")}`);

console.log("DevFlow validation passed");
console.log(`Checked ${requiredFiles.length} files, ${skillNames.length} skills, ${commandFiles.length} commands`);
