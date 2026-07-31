const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

// 关键路由边集合：只断言"边存在"，不做全文比对——各表面存在反引号、缩写与连字符变体。
// 成功边用无前缀正则，兼容 README 的 `Spec -> Cut -> ...` 写法（无 Brainstorm 前缀）。
const successEdges = [
  { name: "A direct success", pattern: /Spec\s*->\s*Cut\s*->\s*Plan\s*->\s*Build\s*->\s*Prove/ },
  { name: "B direct success", pattern: /Cut\s*->\s*Plan\s*->\s*Build\s*->\s*Prove/ },
  { name: "C direct success", pattern: /Cut\s*->\s*Build\s*->\s*Prove/ }
];

// 异常返回边：兼容 AGENTS.md 的 Proof 反引号写法、core SKILL.md 的 scope-drift 连字符与
// "PUA returns recovery facts" 表述。
const returnEdges = [
  { name: "CUT_REDUCE", pattern: /CUT_REDUCE/ },
  { name: "CUT_REUSE", pattern: /CUT_REUSE/ },
  { name: "CUT_BLOCKED", pattern: /CUT_BLOCKED/ },
  { name: "BUILD_BLOCKED", pattern: /BUILD_BLOCKED/ },
  { name: "scope drift", pattern: /scope[- ]drift/i },
  { name: "PUA recovery", pattern: /PUA[^.\n]*recovery/i },
  { name: "Proof FAIL or BLOCKED", pattern: /Proof[^.\n]*FAIL[^.\n]*BLOCKED/ }
];

// 路由边权威文本只存在于 core SKILL.md 的 Core Flow Map；core-methods.md 不含边文本，故不在此列。
// README 是用户文档，用描述性语言（无 CUT_REDUCE 等 token），只要求成功边、CUT_PASS 与 scope drift 防漂移。
const routeSurfaces = [
  {
    rel: "AGENTS.md",
    edges: [...successEdges, ...returnEdges]
  },
  {
    rel: "skills/devflow-core/SKILL.md",
    edges: [...successEdges, ...returnEdges]
  },
  {
    rel: "README.md",
    edges: [...successEdges, { name: "CUT_PASS", pattern: /CUT_PASS/ }, { name: "scope drift", pattern: /scope[- ]drift/i }]
  },
  {
    rel: "skills/skill-call-diagram.md",
    edges: [...successEdges, ...returnEdges]
  }
];

function checkFile(rel, edges) {
  const body = fs.readFileSync(path.join(root, rel), "utf8");
  const missing = edges.filter((edge) => !edge.pattern.test(body)).map((edge) => edge.name);
  return { rel, missing };
}

const results = routeSurfaces.map((surface) => checkFile(surface.rel, surface.edges));
const failures = results.filter((result) => result.missing.length > 0);

for (const result of results) {
  console.log(`${result.missing.length === 0 ? "ok" : "MISSING"}: ${result.rel}`);
  for (const edge of result.missing) {
    console.log(`  missing edge: ${edge}`);
  }
}

if (failures.length > 0) {
  console.log("Route consistency check failed: lifecycle edges drifted between route surfaces.");
  process.exit(1);
}
console.log("Route consistency check passed: all success and return edges present in all route surfaces.");
