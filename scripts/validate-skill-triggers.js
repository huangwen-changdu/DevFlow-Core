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

const scenarios = [
  {
    name: "problem investigation",
    route: "Problem",
    input: "Problem report: check what is wrong without fixing it.",
    evidence: [
      ["AGENTS.md", "problem report"],
      ["skills/devflow-core/SKILL.md", "Problem"],
      ["skills/devflow-prove/SKILL.md", "Process"]
    ]
  },
  {
    name: "requirement clarification",
    route: "Design",
    input: "Requirement: add an order export feature.",
    evidence: [
      ["AGENTS.md", "requirement"],
      ["skills/devflow-core/SKILL.md", "devflow-brainstorm"],
      ["skills/devflow-brainstorm/SKILL.md", "Confirmed request"],
      ["skills/devflow-brainstorm/references/interview-discipline.md", "One-Question Discipline"]
    ]
  },
  {
    name: "implementation with Cut",
    route: "Build",
    input: "Implement the approved export change.",
    evidence: [
      ["AGENTS.md", "implement"],
      ["skills/devflow-core/SKILL.md", "devflow-cut"],
      ["skills/devflow-cut/SKILL.md", "cut-methods.md"],
      ["skills/devflow-cut/references/cut-methods.md", "Minimal Solution Ladder"],
      ["skills/devflow-build/SKILL.md", "build-methods.md"]
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
      ["skills/devflow-plan/SKILL.md", "confirmed Plan"],
      ["skills/devflow-plan/SKILL.md", "spec-plan-methods.md"],
      ["skills/devflow-spec/references/spec-plan-methods.md", "Plan Pack"]
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

console.log("Skill Trigger Verification Report");
console.log(`Scenario cases: ${scenarios.length}`);
console.log("Command cases: 5");
for (const scenario of scenarios) console.log(`- ${scenario.name}: ${scenario.route}`);
console.log("Judgment: PASS");
