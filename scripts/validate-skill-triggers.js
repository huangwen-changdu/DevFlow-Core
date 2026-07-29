const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function description(body) {
  return body.match(/^description:\s*(.+)$/m)?.[1] || "";
}

const files = {
  agents: read("AGENTS.md"),
  core: read("skills/devflow-core/SKILL.md"),
  brainstorm: read("skills/devflow-brainstorm/SKILL.md"),
  interviewDiscipline: read("skills/devflow-brainstorm/references/interview-discipline.md"),
  spec: read("skills/devflow-spec/SKILL.md"),
  plan: read("skills/devflow-plan/SKILL.md"),
  cut: read("skills/devflow-cut/SKILL.md"),
  build: read("skills/devflow-build/SKILL.md"),
  prove: read("skills/devflow-prove/SKILL.md"),
  flowSelfTest: read("skills/devflow-prove/references/flow-self-test.md"),
  pua: read("skills/devflow-pua/SKILL.md"),
  puaRouter: read("skills/devflow-pua/references/methodology-router.md"),
  puaLibrary: read("skills/devflow-pua/references/methodology-library.md"),
  puaDisplay: read("skills/devflow-pua/references/flavor-display.md"),
  learn: read("skills/devflow-learn/SKILL.md"),
  docsFollowup: read("skills/devflow-docs-followup/SKILL.md"),
  adversarial: read("skills/devflow-adversarial/SKILL.md"),
  findFault: read("skills/devflow-find-fault/SKILL.md"),
  projectKnowledge: read("skills/devflow-project-knowledge/SKILL.md"),
  audit: read("skills/devflow-audit/SKILL.md"),
  devflowCommand: read("commands/devflow.toml"),
  specCommand: read("commands/devflow-spec.toml"),
  planCommand: read("commands/devflow-plan.toml"),
  reviewCommand: read("commands/devflow-review.toml"),
  debtCommand: read("commands/devflow-debt.toml"),
  proveCommand: read("commands/devflow-prove.toml"),
  puaCommand: read("commands/devflow-pua.toml"),
  learnCommand: read("commands/devflow-learn.toml"),
  adversarialCommand: read("commands/devflow-adversarial.toml"),
  findFaultCommand: read("commands/devflow-find-fault.toml"),
  auditCommand: read("commands/devflow-audit.toml")
};

const cases = [
  {
    name: "problem investigation",
    input: "Problem report: the login flow looks wrong. Check what is wrong, do not fix yet.",
    route: "Problem",
    skillPath: "devflow-core -> devflow-prove",
    checks: [
      ["AGENTS.md", files.agents, "problem report"],
      ["AGENTS.md", files.agents, "check what is wrong"],
      ["devflow-core", files.core, "Issue Triage"],
      ["devflow-core", files.core, "problem report without explicit fix request"],
      ["devflow command", files.devflowCommand, "problem without explicitly asking for a fix"]
    ]
  },
  {
    name: "requirement implementation",
    input: "Requirement: implement CSV export for orders.",
    route: "Build",
    skillPath: "devflow-core -> devflow-brainstorm -> Confirmed request -> devflow-core -> devflow-cut -> Cut Decision -> devflow-core -> devflow-build -> devflow-prove",
    checks: [
      ["AGENTS.md", files.agents, "requirement"],
      ["AGENTS.md", files.agents, "implement"],
      ["devflow-core description", description(files.core), "requirements or bugs"],
      ["devflow-brainstorm description", description(files.brainstorm), "requirement"],
      ["devflow-build description", description(files.build), "implementing an approved plan"]
    ]
  },
  {
    name: "small feature design-lite",
    input: "Small feature: rename one dashboard label. Implement it if the route is lightweight.",
    route: "Design-lite",
    skillPath: "devflow-core -> devflow-cut -> Cut Decision -> devflow-core -> devflow-build -> devflow-prove",
    checks: [
      ["AGENTS.md", files.agents, "Design-lite"],
      ["AGENTS.md", files.agents, "low risk, local impact, and quick proof"],
      ["devflow-core", files.core, "Small Request Boundary"],
      ["devflow-core", files.core, "Route Choice Needed"],
      ["devflow command", files.devflowCommand, "ask the user to choose Fast, Design-lite, or full Design"]
    ]
  },
  {
    name: "interviewed build request with spec",
    input: "Implement CSV export for orders; clarify the design and write a spec before implementation.",
    route: "Build",
    skillPath: "devflow-core -> devflow-brainstorm -> Confirmed request -> devflow-core -> devflow-spec -> confirmed Spec -> devflow-core -> devflow-cut -> Cut Decision -> devflow-core -> /devflow-plan -> confirmed Plan -> devflow-core -> devflow-build -> devflow-prove",
    checks: [
      ["AGENTS.md", files.agents, "interview-discipline.md"],
      ["devflow-core", files.core, "Brainstorm Clarification"],
      ["devflow-brainstorm description", description(files.brainstorm), "Confirmed request"],
      ["devflow-brainstorm", files.brainstorm, "Status: clarified"],
      ["interview discipline reference", files.interviewDiscipline, "One-Question Discipline"],
      ["interview discipline reference", files.interviewDiscipline, "Fixed Summary"],
      ["devflow-core", files.core, "Core decides whether the request needs `devflow-spec`"],
      ["devflow-spec", files.spec, "Compare the smallest real options"],
      ["devflow-spec", files.spec, "returns the confirmed Spec to `devflow-core`"],
      ["devflow command", files.devflowCommand, "confirmed Spec to Core"]
    ]
  },
  {
    name: "bug fix",
    input: "Bug report: order totals sometimes render as NaN. Fix the bug.",
    route: "Build",
    skillPath: "devflow-core -> devflow-brainstorm -> Confirmed request -> devflow-core -> devflow-cut -> Cut Decision -> devflow-core -> devflow-build -> devflow-prove",
    checks: [
      ["AGENTS.md", files.agents, "bug report"],
      ["AGENTS.md", files.agents, "fix bug"],
      ["devflow-core", files.core, "Root-Cause Fix Check"],
      ["devflow-cut description", description(files.cut), "root-cause fixes"],
      ["devflow command", files.devflowCommand, "Root-Cause Check"]
    ]
  },
  {
    name: "first principles architecture problem",
    input: "The service layer is too complicated. Redesign the architecture and fix the timeout issue.",
    route: "Build",
    skillPath: "devflow-core -> devflow-brainstorm -> Confirmed request -> devflow-core -> devflow-cut -> Cut Decision -> devflow-core -> devflow-build -> devflow-prove",
    checks: [
      ["devflow-core", files.core, "use First Principles Cut"],
      ["AGENTS.md", files.agents, "use First Principles Cut"],
      ["devflow-brainstorm", files.brainstorm, "Confirmed request"],
      ["devflow-core", files.core, "First Principles Cut"],
      ["first-principles self-test", files.flowSelfTest, "Scenario 1C-A: First Principles Cut"],
      ["first-principles self-test", files.flowSelfTest, "Smallest necessary mechanism:"]
    ]
  },
  {
    name: "completion claim",
    input: "Are we done?",
    route: "Fast",
    skillPath: "devflow-core -> devflow-prove",
    checks: [
      ["AGENTS.md", files.agents, "done"],
      ["AGENTS.md", files.agents, "Prove with adversarial review before any completion claim"],
      ["devflow-prove description", description(files.prove), "done, fixed, complete"],
      ["devflow-prove description", description(files.prove), "performs adversarial review for development work"],
      ["devflow-prove command", files.proveCommand, "Run DevFlow Prove"],
      ["devflow-prove command", files.proveCommand, "run adversarial review before completion"],
      ["devflow-prove command", files.proveCommand, "Adversarial review:"],
      ["completion self-test", files.flowSelfTest, "Scenario 7A: Adversarial Review Rejects Completion"],
      ["completion self-test", files.flowSelfTest, "Judgment: FAIL"]
    ]
  },
  {
    name: "completion document follow-up",
    input: "The feature is verified and complete. Ask whether technical solution, frontend API handoff, or troubleshooting documentation is needed.",
    route: "Fast",
    skillPath: "devflow-core -> devflow-docs-followup",
    checks: [
      ["AGENTS.md", files.agents, "devflow-docs-followup"],
      ["docs follow-up description", description(files.docsFollowup), "verified feature completion"],
      ["docs follow-up", files.docsFollowup, "Do not create any document until the user explicitly confirms it"],
      ["docs follow-up", files.docsFollowup, "Frontend API Handoff Document"],
      ["docs follow-up", files.docsFollowup, "Feature-Flow Troubleshooting Document"]
    ]
  },
  {
    name: "independent manual adversarial review",
    input: "Run an upgraded adversarial review of this current change without using completion status.",
    route: "Independent manual",
    skillPath: "devflow-core -> devflow-adversarial",
    checks: [
      ["AGENTS.md", files.agents, "devflow-adversarial"],
      ["devflow-core", files.core, "Independent Manual Review"],
      ["adversarial description", description(files.adversarial), "upgraded adversarial review"],
      ["adversarial review", files.adversarial, "Review confirmation"],
      ["adversarial review", files.adversarial, "may take a long time"],
      ["adversarial review", files.adversarial, "Requirement coverage"],
      ["adversarial review", files.adversarial, "User-visible outcome"],
      ["adversarial review", files.adversarial, "do not read, require, or alter `devflow-prove`"]
    ]
  },
  {
    name: "independent manual find-fault review",
    input: "Find faults in this change: identify the biggest omission, blind spot, and least certain point.",
    route: "Independent manual",
    skillPath: "devflow-core -> devflow-find-fault",
    checks: [
      ["AGENTS.md", files.agents, "devflow-find-fault"],
      ["find-fault description", description(files.findFault), "find faults"],
      ["find-fault", files.findFault, "What is the biggest omission"],
      ["find-fault", files.findFault, "What might the user or agent not have recognized"],
      ["find-fault", files.findFault, "What is currently least certain"],
      ["find-fault", files.findFault, "Next step"],
      ["find-fault", files.findFault, "do not read, require, or alter `devflow-prove`"]
    ]
  },
  {
    name: "progressive knowledge recall",
    input: "Implement an order export change using existing project conventions.",
    route: "Build",
    skillPath: "devflow-core -> selective knowledge recall -> devflow-brainstorm -> Confirmed request -> devflow-core -> devflow-cut -> Cut Decision -> devflow-core -> devflow-build -> devflow-prove",
    checks: [
      ["AGENTS.md", files.agents, "probe existing `.copilot/LEARNING_INDEX.md` and `docs/project-knowledge/`"],
      ["devflow-core", files.core, "Execution recall"],
      ["devflow-core", files.core, "Business recall"],
      ["devflow-core", files.core, "do not bulk-load `.copilot/cards/` or `docs/project-knowledge/`"],
      ["devflow-project-knowledge", files.projectKnowledge, "先读 `AI-START-HERE.md`，回退 `index.md`"],
      ["devflow-project-knowledge", files.projectKnowledge, "不得因读取尝试创建目录"]
    ]
  },
  {
    name: "learning correction",
    input: "Not again: AGENTS.md is a runtime prompt. You put README-style explanation in the wrong place.",
    route: "Recovery",
    skillPath: "devflow-core -> devflow-prove -> devflow-learn",
    checks: [
      ["AGENTS.md", files.agents, "repeated user correction"],
      ["AGENTS.md", files.agents, "wrong place"],
      ["devflow-core", files.core, "Learning Capture"],
      ["devflow-learn description", description(files.learn), "repeated user correction"],
      ["devflow-learn command", files.learnCommand, "Learning closure"]
    ]
  },
  {
    name: "confirmed project-knowledge handoff",
    input: "Confirm the code-backed order domain boundary and update project knowledge.",
    route: "Build",
    skillPath: "devflow-core -> devflow-prove -> devflow-learn -> user confirmation -> devflow-project-knowledge",
    checks: [
      ["devflow-core", files.core, "confirmed project-knowledge candidate"],
      ["devflow-learn", files.learn, "user confirmation -> `devflow-project-knowledge` lazy maintenance"],
      ["devflow-project-knowledge", files.projectKnowledge, "用户明确确认维护后，本 Skill 才接手"],
      ["devflow-learn command", files.learnCommand, "wait for user confirmation before loading `devflow-project-knowledge`"]
    ]
  },
  {
    name: "repeated same-function problem pressure recovery",
    input: "CSV 导出还是有问题，我上次已经指出同一个导出缺少必填列。",
    route: "Recovery",
    skillPath: "devflow-core -> devflow-pua -> recovery facts -> devflow-core",
    checks: [
      ["AGENTS.md", files.agents, "same function, result, or requested capability has a problem"],
      ["devflow-core", files.core, "same function, result, or requested capability remains wrong, incomplete, or missing"],
      ["devflow-pua", files.pua, "Repeated Same-Function Trigger"],
      ["devflow-pua", files.pua, "same function, result, or requested capability"],
      ["devflow-pua", files.pua, "repeated dissatisfaction with the same target"],
      ["flow self-test", files.flowSelfTest, "Scenario 6: Repeated Same-Function Problem"],
      ["flow self-test", files.flowSelfTest, "Repeated target evidence: CSV export + prior feedback or correction attempt"]
    ]
  },
];

const commandCases = [
  {
    name: "spec command",
    input: "/devflow-spec create a requirements source before the implementation plan",
    command: "/devflow-spec",
    checks: [
      ["devflow-spec command", files.specCommand, "Create a DevFlow spec"],
      ["devflow-spec command", files.specCommand, "scripts/devflow-spec.js"],
      ["devflow-spec command", files.specCommand, "docs/specs/YYYY-MM-DD-<short-kebab-name>.md"],
      ["devflow-spec command", files.specCommand, "Required sections"],
      ["devflow-spec", files.spec, "Compare the smallest real options"],
      ["devflow-spec", files.spec, "returns the confirmed Spec to `devflow-core`"],
      ["devflow-spec command", files.specCommand, "confirmed Spec to `devflow-core`"]
    ]
  },
  {
    name: "plan command",
    input: "/devflow-plan create implementation slices from this approved design",
    command: "/devflow-plan",
    checks: [
      ["devflow-plan command", files.planCommand, "single DevFlow Plan Pack"],
      ["devflow-plan command", files.planCommand, "CUT_PASS"],
      ["devflow-plan command", files.planCommand, "scripts/devflow-plan.js"],
      ["devflow-plan command", files.planCommand, "lightweight Cut-consistency review"],
      ["devflow-plan command", files.planCommand, "Core alone selects `devflow-build` or any other later lifecycle work"],
      ["devflow-plan command", files.planCommand, "docs/plans/YYYY-MM-DD-<short-kebab-name>.md"],
      ["devflow-plan command", files.planCommand, "Interfaces:"],
      ["devflow-plan command", files.planCommand, "Task type: Code change | Documentation-only"],
      ["devflow-plan command", files.planCommand, "Current behavior:"],
      ["devflow-plan command", files.planCommand, "Target behavior:"],
      ["devflow-plan command", files.planCommand, "Change mechanics:"],
      ["devflow-plan command", files.planCommand, "Call impact:"],
      ["devflow-plan command", files.planCommand, "trigger/input, expected result"],
      ["devflow-plan command", files.planCommand, "External Skills:"],
      ["devflow-plan skill", files.plan, "only DevFlow plan-generation skill"],
      ["devflow-plan skill", files.plan, "Documentation-only"],
      ["devflow-plan skill", files.plan, "External Skills: <skill-name> (role: guides execution) / none"],
      ["devflow-build", files.build, "do not re-decide the implementation mechanism in Build"],
      ["devflow-build", files.build, "Plan Review"],
      ["devflow-build", files.build, "BUILD_BLOCKED"]
    ]
  },
  {
    name: "review command",
    input: "/devflow-review check this diff for overengineering and scope drift",
    command: "/devflow-review",
    checks: [
      ["devflow-review command", files.reviewCommand, "Review the provided plan or diff through DevFlow Cut"],
      ["devflow-review command", files.reviewCommand, "scripts/devflow-review.js"],
      ["devflow-review command", files.reviewCommand, "Overbuild Check"],
      ["devflow-cut", files.cut, "Overengineering Review Tags"]
    ]
  },
  {
    name: "debt command",
    input: "/devflow-debt harvest devflow markers",
    command: "/devflow-debt",
    checks: [
      ["devflow-debt command", files.debtCommand, "Harvest every `devflow:` intentional-simplification marker"],
      ["devflow-debt command", files.debtCommand, "scripts/devflow-debt.js"],
      ["devflow-debt command", files.debtCommand, "No devflow debt markers found"],
      ["devflow-cut", files.cut, "Intentional Simplification Marker"]
    ]
  },
  {
    name: "pua command",
    input: "/devflow-pua recover after a changed-wrong result",
    command: "/devflow-pua",
    checks: [
      ["devflow-pua command", files.puaCommand, "Run DevFlow PUA"],
      ["devflow-pua command", files.puaCommand, "methodology-router.md"],
      ["devflow-pua command", files.puaCommand, "methodology-library.md"],
      ["devflow-pua command", files.puaCommand, "flavor-display.md"],
      ["devflow-pua command", files.puaCommand, "Pressure check:"],
      ["devflow-pua command", files.puaCommand, "Restart Brainstorm:"],
      ["devflow-pua command", files.puaCommand, "Discarded context:"],
      ["devflow-pua command", files.puaCommand, "Keep only verified facts:"],
      ["devflow-pua command", files.puaCommand, "METHOD: {flavor} / {method}"],
      ["devflow-pua command", files.puaCommand, "SWITCH:"],
      ["devflow-pua command", files.puaCommand, "User-view miss:"],
      ["devflow-pua command", files.puaCommand, "Satisfaction gap:"],
      ["devflow-pua command", files.puaCommand, "Blue-team attack:"],
      ["devflow-pua command", files.puaCommand, "New success contract:"],
      ["devflow-pua command", files.puaCommand, "different/opposite method"],
      ["devflow-pua command", files.puaCommand, "Judgment: PASS / FAIL / BLOCKED"],
      ["devflow-pua", files.pua, "Changed approach"]
    ]
  },
  {
    name: "independent adversarial command",
    input: "/devflow-adversarial run a deep review of the current change",
    command: "/devflow-adversarial",
    checks: [
      ["devflow-adversarial command", files.adversarialCommand, "Run DevFlow Adversarial Review"],
      ["devflow-adversarial command", files.adversarialCommand, "wait for explicit confirmation"],
      ["devflow-adversarial command", files.adversarialCommand, "does not require, read, modify, or hand off to devflow-prove"],
      ["devflow-adversarial", files.adversarial, "Five-Angle Review"]
    ]
  },
  {
    name: "independent find-fault command",
    input: "/devflow-find-fault identify the biggest omission in this change",
    command: "/devflow-find-fault",
    checks: [
      ["devflow-find-fault command", files.findFaultCommand, "Run DevFlow Find Fault"],
      ["devflow-find-fault command", files.findFaultCommand, "does not require, read, modify, or hand off to devflow-prove"],
      ["devflow-find-fault", files.findFault, "Questions and answers"]
    ]
  },
  {
    name: "audit command",
    input: "/devflow-audit audit this repository for overengineering only",
    command: "/devflow-audit",
    checks: [
      ["devflow-audit command", files.auditCommand, "Audit the repository or named scope"],
      ["devflow-audit command", files.auditCommand, "scripts/devflow-audit.js"],
      ["devflow-audit command", files.auditCommand, "overengineering and complexity only"],
      ["devflow-audit", files.audit, "repo-wide `devflow-cut`"],
      ["devflow-audit", files.audit, "Do not change files during audit"]
    ]
  }
];

for (const testCase of cases) {
  assert(testCase.input.length > 0, `${testCase.name} must have an input`);
  assert(testCase.route.length > 0, `${testCase.name} must name a route`);
  assert(testCase.skillPath.includes("devflow-core"), `${testCase.name} must start from devflow-core`);

  for (const [label, body, term] of testCase.checks) {
    assert(body.includes(term), `${testCase.name}: ${label} missing trigger/evidence term: ${term}`);
  }
}

for (const testCase of commandCases) {
  assert(testCase.input.includes(testCase.command), `${testCase.name} must include its slash command`);

  for (const [label, body, term] of testCase.checks) {
    assert(body.includes(term), `${testCase.name}: ${label} missing command trigger/evidence term: ${term}`);
  }
}

console.log("Skill Trigger Verification Report");
console.log(`Total cases: ${cases.length}`);
console.log(`Command cases: ${commandCases.length}`);

for (const testCase of cases) {
  console.log(`- ${testCase.name}: ${testCase.route}; ${testCase.skillPath}`);
}

for (const testCase of commandCases) {
  console.log(`- ${testCase.name}: ${testCase.command}`);
}
