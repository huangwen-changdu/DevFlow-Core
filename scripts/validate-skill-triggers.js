const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Checks that a scenario remains discoverable from a startup signal to its runtime owner. */
function assertScenario(scenario) {
  for (const [file, term] of scenario.evidence) {
    assert(read(file).includes(term), `${scenario.name}: ${file} missing ${term}`);
  }
}

/** Recursively returns absolute file paths under dir. */
function filesUnder(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(full));
    else out.push(full);
  }
  return out;
}

/** Fails loudly when a packaged dsh skill or command asset drifts from its repo-root source. */
function assertPackagedAssetParity() {
  const assetRoot = path.join(root, "dsh", "plugins", "dsh-devflow", "assets");
  const skillDirs = fs.readdirSync(path.join(root, "skills")).filter((name) => name.startsWith("devflow-"));
  for (const dir of skillDirs) {
    const srcDir = path.join(root, "skills", dir);
    for (const full of filesUnder(srcDir)) {
      const rel = path.relative(srcDir, full);
      const dst = path.join(assetRoot, "skills", dir, rel);
      assert(fs.existsSync(dst) && fs.readFileSync(dst).equals(fs.readFileSync(full)),
        `dsh packaged asset drifted from source: skills/${dir}/${rel} — re-run node dsh/plugins/dsh-devflow/scripts/sync-assets.js`);
    }
  }
  for (const name of fs.readdirSync(path.join(root, "commands")).filter((n) => n.startsWith("devflow") && n.endsWith(".toml"))) {
    const src = path.join(root, "commands", name);
    const dst = path.join(assetRoot, "commands", name);
    assert(fs.existsSync(dst) && fs.readFileSync(dst).equals(fs.readFileSync(src)),
      `dsh packaged asset drifted from source: commands/${name} — re-run node dsh/plugins/dsh-devflow/scripts/sync-assets.js`);
  }
}

const scenarios = [
  {
    name: "creative-work clarification",
    route: "Design",
    input: "Add an order export feature and modify its delivery behavior.",
    evidence: [
      ["AGENTS.md", "any creative work"],
      ["skills/devflow-core/SKILL.md", "Before any creative work"],
      ["skills/devflow-core/references/core-methods.md", "Before any creative work"],
      ["skills/devflow-brainstorm/SKILL.md", "You MUST use this before any creative work"],
      ["skills/devflow-brainstorm/SKILL.md", "Confirmed request"],
      ["commands/devflow.toml", "Before creative work"]
    ]
  },
  {
    name: "problem-directed creative change clarification",
    route: "Design",
    input: "The export delivery behavior is wrong; define the needed change.",
    evidence: [
      ["AGENTS.md", "unapproved problem-directed change"],
      ["skills/devflow-core/SKILL.md", "unapproved problem-directed change"],
      ["skills/devflow-brainstorm/SKILL.md", "problem-directed change"],
      ["commands/devflow.toml", "unapproved problem-directed change"]
    ]
  },
  {
    name: "investigation-only problem exception",
    route: "Problem",
    input: "Problem report: check what is wrong without fixing it.",
    evidence: [
      ["AGENTS.md", "investigation-only problem report"],
      ["skills/devflow-core/SKILL.md", "investigation-only reports"],
      ["skills/devflow-prove/SKILL.md", "Process"],
      ["commands/devflow.toml", "investigation-only problem report"]
    ]
  },
  {
    name: "implementation with Cut",
    route: "Build",
    input: "Implement the approved export change.",
    evidence: [
      ["AGENTS.md", "approved scope"],
      ["skills/devflow-core/SKILL.md", "devflow-cut"],
      ["skills/devflow-cut/SKILL.md", "cut-methods.md"],
      ["skills/devflow-cut/references/cut-methods.md", "Minimal Solution Ladder"],
      ["skills/devflow-build/SKILL.md", "build-methods.md"],
      ["commands/devflow.toml", "already approved scope"]
    ]
  },
  {
    name: "A/B/C direct-success branches",
    route: "Design",
    input: "Confirm the request, then I choose A, B, or C.",
    evidence: [
      ["skills/devflow-brainstorm/SKILL.md", "A/B/C Gate"],
      ["skills/devflow-brainstorm/SKILL.md", "only by the user-selected direct branch"],
      ["skills/devflow-spec/SKILL.md", "approved A-branch Spec directly enters `devflow-cut`"],
      ["skills/devflow-cut/SKILL.md", "A/B directly enter `devflow-plan`; C directly enters `devflow-build`"],
      ["skills/devflow-plan/SKILL.md", "approved A/B Plan directly enters `devflow-build`"],
      ["skills/devflow-build/SKILL.md", "completed Build directly enters `devflow-prove`"]
    ]
  },
  {
    name: "hybrid exception return",
    route: "Recovery",
    input: "Cut reduces scope, the plan drifts, Build blocks, or Proof fails.",
    evidence: [
      ["skills/devflow-core/SKILL.md", "Core Return Boundaries"],
      ["skills/devflow-cut/SKILL.md", "CUT_REDUCE`, `CUT_REUSE`, and `CUT_BLOCKED` return facts to `devflow-core`"],
      ["skills/devflow-plan/SKILL.md", "scope-drift facts return to `devflow-core`"],
      ["skills/devflow-build/SKILL.md", "return `BUILD_BLOCKED` with the facts to `devflow-core`"],
      ["skills/devflow-prove/SKILL.md", "Exception Return Boundary"],
      ["skills/devflow-pua/SKILL.md", "PUA never selects the replacement execution skill"]
    ]
  },
  {
    name: "contextual engineering quality",
    route: "Build",
    input: "Implement an approved order-history change that matches project conventions and uses caching only when justified.",
    evidence: [
      ["skills/devflow-core/references/core-methods.md", "Optimize for local understanding"],
      ["skills/devflow-cut/references/cut-methods.md", "Contextual Design Quality Check"],
      ["skills/devflow-build/references/build-methods.md", "Readability Outcome Check"],
      ["skills/devflow-prove/references/code-review-checklist.md", "A maintainer can identify business intent"],
      ["skills/devflow-prove/references/flow-self-test.md", "Scenario 5B: Contextual Engineering Quality"]
    ]
  },
  {
    name: "first principles architecture problem",
    route: "Build",
    input: "The service layer is too complicated. Redesign the architecture and fix the timeout issue.",
    evidence: [
      ["skills/devflow-core/references/core-methods.md", "First Principles Cut"],
      ["skills/devflow-core/SKILL.md", "devflow-cut"],
      ["skills/devflow-prove/references/flow-self-test.md", "Scenario 1C-A: First Principles Cut"]
    ]
  },
  {
    name: "saved spec",
    route: "Design",
    input: "Write a spec doc for the export change.",
    evidence: [
      ["AGENTS.md", "spec doc"],
      ["skills/devflow-spec/SKILL.md", "spec-plan-methods.md"],
      ["skills/devflow-spec/references/spec-plan-methods.md", "Spec Document And Plan Pack"]
    ]
  },
  {
    name: "plan construction after Cut",
    route: "Build",
    input: "Create implementation slices from this approved design after Cut passes.",
    evidence: [
      ["skills/devflow-core/SKILL.md", "Spec or Plan"],
      ["skills/devflow-plan/SKILL.md", "approved A/B Plan"],
      ["skills/devflow-plan/SKILL.md", "spec-plan-methods.md"],
      ["skills/devflow-spec/references/spec-plan-methods.md", "Plan Pack"]
    ]
  },
  {
    name: "plan-owned handoff and diff-first proof",
    route: "Build -> Prove",
    input: "Implement the approved export plan, then verify the actual change before calling it ready.",
    evidence: [
      ["skills/devflow-plan/SKILL.md", "## File Structure"],
      ["skills/devflow-plan/SKILL.md", "Execution Trace"],
      ["skills/devflow-plan/SKILL.md", "Remaining Structured Worklist"],
      ["scripts/devflow-plan.js", "maximumWorklistItems"],
      ["skills/devflow-prove/SKILL.md", "actual implementation diff"],
      ["skills/devflow-prove/SKILL.md", "unresolved Blocker or Warning"],
      ["skills/devflow-prove/references/flow-self-test.md", "Scenario 5C: Diff-First Prove Quality Gate"]
    ]
  },
  {
    name: "completion claim",
    route: "Fast",
    input: "Is this ready?",
    evidence: [
      ["AGENTS.md", "ready"],
      ["skills/devflow-core/SKILL.md", "devflow-prove"],
      ["skills/devflow-prove/SKILL.md", "proof-recovery-methods.md"],
      ["skills/devflow-prove/references/proof-recovery-methods.md", "Proof Before Done"]
    ]
  },
  {
    name: "same-target recovery",
    route: "Recovery",
    input: "The same export remains wrong after the correction.",
    evidence: [
      ["AGENTS.md", "repeated same-target miss"],
      ["skills/devflow-core/SKILL.md", "devflow-pua"],
      ["skills/devflow-pua/SKILL.md", "proof-recovery-methods.md"],
      ["skills/devflow-pua/references/methodology-router.md", "Starting Route"]
    ]
  },
  {
    name: "repeated same-function problem pressure recovery",
    route: "Recovery",
    input: "The same export remains wrong after prior correction.",
    evidence: [
      ["AGENTS.md", "repeated same-target miss"],
      ["skills/devflow-core/SKILL.md", "devflow-pua"],
      ["skills/devflow-pua/SKILL.md", "Changed approach"]
    ]
  },
  {
    name: "docs follow-up only after implementation change",
    route: "Learn -> Docs",
    input: "A feature implementation with a source-behavior or interface-contract change passes proof.",
    evidence: [
      ["skills/devflow-learn/SKILL.md", "Do not automatically hand off validation-only, documentation-only, rule-only, skill-only, or no-diff `PASS` results."],
      ["skills/devflow-docs-followup/SKILL.md", "Do not automatically ask about documentation for validation-only, documentation-only, rule-only, skill-only, or no-diff `PASS` results."],
      ["skills/skill-call-diagram.md", "verified feature implementation with source-behavior or interface-contract change"]
    ]
  },
  {
    name: "post-implementation unease check",
    route: "Independent manual",
    input: "Run an unease check on the completed feature: which requirements details remain unconfirmed?",
    evidence: [
      ["skills/devflow-find-fault/SKILL.md", "不安感检查"],
      ["skills/devflow-find-fault/SKILL.md", "Unease Risk Classification"],
      ["commands/devflow-find-fault.toml", "post-implementation unease check"],
      ["skills/devflow-prove/references/flow-self-test.md", "post-implementation unease check"]
    ]
  },
  {
    name: "independent manual review",
    route: "Independent review",
    input: "Run a deep adversarial review without lifecycle completion.",
    evidence: [
      ["AGENTS.md", "devflow-adversarial"],
      ["skills/devflow-adversarial/SKILL.md", "do not read, require, or alter `devflow-prove`"],
      ["skills/devflow-find-fault/SKILL.md", "do not read, require, or alter `devflow-prove`"]
    ]
  }
];

for (const scenario of scenarios) assertScenario(scenario);

for (const [command, owner] of [
  ["commands/devflow.toml", "DevFlow Core"],
  ["commands/devflow-spec.toml", "DevFlow spec"],
  ["commands/devflow-plan.toml", "devflow-plan"],
  ["commands/devflow-prove.toml", "Run DevFlow Prove"],
  ["commands/devflow-pua.toml", "Run DevFlow PUA"]
]) {
  assert(read(command).includes(owner), `${command} must identify ${owner}`);
}

assertPackagedAssetParity();

console.log("Skill Trigger Verification Report");
console.log(`Scenario cases: ${scenarios.length}`);
console.log("Command cases: 5");
for (const scenario of scenarios) console.log(`- ${scenario.name}: ${scenario.route}`);
console.log("Packaged asset parity: PASS");
console.log("Judgment: PASS");
