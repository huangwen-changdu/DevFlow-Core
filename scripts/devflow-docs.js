#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

// 文档地图：初始化与机检 `docs/INDEX.md`。
// 地图只做路由，不复述正文；`--check` 保证每个根文档与 spec 已登记、每条登记路径真实存在。
const MAP_REL = path.join("docs", "INDEX.md");
const MAP_BASENAME = "INDEX.md";

function usage() {
  console.log("Usage: node scripts/devflow-docs.js [--status] [--init] [--check] [--root <dir>] [--force] [--json] [--self-test]");
  console.log("  --status  report which project artifacts exist and the next command for each missing one (read-only)");
  console.log("  --init    create docs/INDEX.md from the detected documentation tree (refuses to overwrite without --force)");
  console.log("  --check   verify every docs/*.md and docs/specs/*.md is registered and every registered path exists");
  console.log("  --root    project root, default current directory");
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

function detect(root) {
  const docs = path.join(root, "docs");
  const topDocs = fs.existsSync(docs) ? listMarkdown(docs).filter((name) => name !== MAP_BASENAME) : [];
  const specDocs = fs.existsSync(docs) ? listMarkdown(path.join(docs, "specs")) : [];
  const dirs = [
    ["features", "能力现状与触发词", "活"],
    ["plans", "实施计划快照", "快照"],
    ["specs", "设计契约快照", "快照"],
    ["loop", "循环任务与沉淀", "活"],
    ["project-knowledge", "项目知识包", "活"]
  ].filter(([name]) => fs.existsSync(path.join(docs, name)));
  const rootEntries = ["README.md", "AGENTS.md", "CLAUDE.md", "CONTRIBUTING.md"].filter((name) =>
    fs.existsSync(path.join(root, name))
  );
  const manifests = ["package.json", "pyproject.toml", "go.mod", "Cargo.toml", "pom.xml"].filter((name) =>
    fs.existsSync(path.join(root, name))
  );
  const solutions = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sln"))
    .map((entry) => entry.name);
  return { topDocs, specDocs, dirs, rootEntries, manifests, solutions };
}

function render(root, detected) {
  const project = path.basename(root);
  const lines = [];
  const table = [];

  table.push(["这是什么产品", detected.rootEntries.includes("README.md") ? "`README.md`" : "`[待确认]`", "活"]);
  const organization = [
    detected.rootEntries.includes("AGENTS.md") ? "`AGENTS.md`" : "",
    detected.dirs.some(([name]) => name === "project-knowledge") ? "`docs/project-knowledge/AI-START-HERE.md`" : ""
  ].filter(Boolean);
  table.push(["怎么组织", organization.length ? organization.join("、") : "`[待确认]`", "活"]);
  const runTargets = [detected.rootEntries.includes("README.md") ? "`README.md`" : "", detected.manifests.length ? `\`${detected.manifests[0]}\`` : ""].filter(Boolean);
  table.push(["怎么跑、怎么验证", runTargets.length ? `${runTargets.join(" + ")} 中的命令` : "`[待确认]`", "活"]);
  table.push(["现在做到哪", detected.topDocs.includes("requirements.md") ? "`docs/requirements.md`" : "`[待确认]`", "活"]);
  table.push([
    "某个能力现状",
    detected.dirs.some(([name]) => name === "features") && fs.existsSync(path.join(root, "docs", "features", "INDEX.md"))
      ? "`docs/features/INDEX.md`"
      : "`[待确认]`",
    "活"
  ]);
  table.push(["某项设计为什么这样", detected.specDocs.length ? "`docs/specs/`" : "`[待确认]`", "快照"]);

  lines.push(`# ${project} 文档地图`, "");
  lines.push("> 用途：新会话用最少的读取定位权威文档。只做路由，不复述正文。");
  lines.push("> 机检：`node scripts/devflow-docs.js --check`。", "");
  lines.push("## 五问直达", "");
  lines.push("| 问题 | 权威文件 | 类型 |", "|---|---|---|");
  for (const [question, target, type] of table) lines.push(`| ${question} | ${target} | ${type} |`);
  lines.push("");

  lines.push("## 目录台账", "");
  lines.push("| 路径 | 用途 | 类型 | 更新触发 |", "|---|---|---|---|");
  for (const [name, purpose, type] of detected.dirs) {
    let trigger = type === "快照" ? "新建时在本页登记" : "内容变化时更新";
    if (name === "plans" && fs.existsSync(path.join(root, "docs", "plans", "INDEX.md"))) {
      trigger = "由 `docs/plans/INDEX.md` 维护";
    }
    lines.push(`| \`docs/${name}/\` | ${purpose} | ${type} | ${trigger} |`);
  }
  if (fs.existsSync(path.join(root, ".copilot", "LEARNING_INDEX.md"))) {
    lines.push("| `.copilot/` | 学习卡与开发者偏好 | 活 | 复盘产出 |");
  }
  if (detected.dirs.length === 0 && !fs.existsSync(path.join(root, ".copilot"))) lines.push("| `[待确认]` | 尚无文档目录 | - | - |");
  lines.push("");

  if (detected.topDocs.length) {
    lines.push("## 根文档", "");
    for (const name of detected.topDocs) lines.push(`- \`docs/${name}\``);
    lines.push("");
  }

  if (detected.specDocs.length) {
    lines.push("## 设计契约快照（`docs/specs/`）", "");
    for (const name of detected.specDocs) lines.push(`- \`docs/specs/${name}\``);
    lines.push("");
  }

  lines.push("## 快照规则", "");
  lines.push("- `docs/specs/`、`docs/plans/` 与带日期的评审文档是历史快照，不是当前事实。");
  lines.push("- 当前事实只看活文档：需求台账看进度，能力索引看现状，入口规则看根目录的 agent 入口文件。", "");
  lines.push("## 更新契约", "");
  lines.push("- 新增任意根文档或快照：在本页登记；漏登记会让 `--check` 失败。");
  lines.push("- 能力行为变化：更新能力索引与需求台账。");
  lines.push("- 安装或命令变化：更新根目录 README 与项目知识包的启动就绪清单。", "");

  lines.push("## 启动就绪", "");
  lines.push("- 能启动 / 能验证 / 能看进度 / 能接手：四个问题的答案都应有真实文件承载。");
  lines.push("");

  return lines.join("\n");
}

function resolveCandidate(root, rel) {
  const cleaned = rel.replace(/^\.\.\//, "");
  return [
    path.join(root, cleaned),
    path.join(root, "docs", cleaned),
    path.join(root, "docs", "specs", cleaned),
    path.join(root, "docs", "project-knowledge", cleaned)
  ].some((file) => fs.existsSync(file));
}

function check(root) {
  const mapPath = path.join(root, MAP_REL);
  if (!fs.existsSync(mapPath)) {
    return { map: MAP_REL, missing: [], dangling: [], required: 0, registered: 0, judgment: "FAIL", reason: "missing map; run --init" };
  }
  const body = fs.readFileSync(mapPath, "utf8");
  const docs = path.join(root, "docs");
  const required = [
    ...listMarkdown(docs).filter((name) => name !== MAP_BASENAME).map((name) => `docs/${name}`),
    ...listMarkdown(path.join(docs, "specs")).map((name) => `docs/specs/${name}`)
  ];
  const missing = required.filter((rel) => !body.includes(rel) && !body.includes(path.basename(rel)));
  const dangling = [];
  for (const match of body.matchAll(/`([^`]+\.md)`/g)) {
    const rel = match[1];
    if (rel.includes("*") || rel.includes("[待确认]")) continue;
    if (!resolveCandidate(root, rel)) dangling.push(rel);
  }
  const judgment = missing.length === 0 && dangling.length === 0 ? "PASS" : "FAIL";
  return { map: MAP_REL, required: required.length, registered: required.length - missing.length, missing, dangling, judgment };
}

const INVENTORY = [
  ["AGENTS.md", "流程入口", "npm run install:target -- <project> --write"],
  ["scripts/devflow-docs.js", "文档地图检查器", "install:target --write，或 install:user（用户级）"],
  ["skills/devflow-core/SKILL.md", "运行时技能", "install:target --write，或 install:user（用户级）"],
  ["docs/INDEX.md", "文档地图", "node scripts/devflow-docs.js --init"],
  ["docs/project-knowledge/AI-START-HERE.md", "项目知识包入口", "首次落地时由 devflow-project-knowledge 创建"],
  ["docs/requirements.md", "需求台账", "首次 /devflow 需求时创建"],
  ["docs/features/INDEX.md", "能力索引", "首次 /devflow 需求时创建"],
  ["docs/plans/INDEX.md", "计划索引", "首次批准计划时创建"],
  [".copilot/LEARNING_INDEX.md", "学习卡索引", "devflow-learn 首次复盘时创建"]
];

function status(root) {
  const items = INVENTORY.map(([rel, label, action]) => {
    const present = fs.existsSync(path.join(root, rel));
    return { rel, label, present, action };
  });
  return { root, items, missing: items.filter((item) => !item.present).map((item) => item.rel) };
}

function init(root, force) {  const mapPath = path.join(root, MAP_REL);
  const variant = path.join(root, "docs", "index.md");
  if (!fs.existsSync(mapPath) && fs.existsSync(variant) && variant !== mapPath) {
    throw new Error("docs/index.md already exists; rename it or pass a different map path before initializing");
  }
  if (fs.existsSync(mapPath) && !force) {
    throw new Error("docs/INDEX.md already exists; pass --force to regenerate it");
  }
  const detected = detect(root);
  fs.mkdirSync(path.dirname(mapPath), { recursive: true });
  fs.writeFileSync(mapPath, render(root, detected), "utf8");
  return { map: MAP_REL, created: true, docs: detected.topDocs.length, specs: detected.specDocs.length };
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-docs-"));
  fs.mkdirSync(path.join(tmp, "docs", "specs"), { recursive: true });
  fs.writeFileSync(path.join(tmp, "README.md"), "# Demo\n", "utf8");
  fs.writeFileSync(path.join(tmp, "docs", "PRD.md"), "# PRD\n", "utf8");
  fs.writeFileSync(path.join(tmp, "docs", "specs", "2026-01-01-demo.md"), "# Demo spec\n", "utf8");

  init(tmp, false);
  if (check(tmp).judgment !== "PASS") throw new Error("self-test expected a passing initialized map");
  const mapStatus = status(tmp).items.find((item) => item.rel === "docs/INDEX.md");
  if (!mapStatus || !mapStatus.present) throw new Error("self-test expected status to report the initialized map");

  fs.writeFileSync(path.join(tmp, "docs", "UNREGISTERED.md"), "# new\n", "utf8");
  if (check(tmp).judgment !== "FAIL") throw new Error("self-test expected an unregistered doc to fail");

  fs.unlinkSync(path.join(tmp, "docs", "UNREGISTERED.md"));
  fs.unlinkSync(path.join(tmp, "docs", "PRD.md"));
  const dangling = check(tmp);
  if (dangling.judgment !== "FAIL" || dangling.dangling.length === 0) {
    throw new Error("self-test expected a missing registered file to fail");
  }

  console.log("DevFlow docs self-test passed");
  console.log("Checked init, coverage failure, and dangling-path failure");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) return usage();
  if (args.includes("--self-test")) return selfTest();

  const rootIndex = args.indexOf("--root");
  const root = path.resolve(rootIndex >= 0 && args[rootIndex + 1] ? args[rootIndex + 1] : process.cwd());
  const json = args.includes("--json");

  try {
    if (args.includes("--status")) {
      const result = status(root);
      if (json) console.log(JSON.stringify(result));
      else {
        console.log(`Project artifact status: ${root}`);
        for (const item of result.items) {
          const suffix = item.present ? "" : ` -> ${item.action}`;
          console.log(`${item.present ? "ok     " : "missing"}  ${item.rel} — ${item.label}${suffix}`);
        }
        console.log(`${result.items.length - result.missing.length}/${result.items.length} present`);
      }
      return 0;
    }

    if (args.includes("--init")) {
      const result = init(root, args.includes("--force"));
      if (json) console.log(JSON.stringify(result));
      else {
        console.log(`Created ${result.map} for ${root}`);
        console.log(`Registered ${result.docs} root docs and ${result.specs} specs. Review the [待确认] rows before relying on it.`);
      }
      return 0;
    }

    const result = check(root);
    if (json) console.log(JSON.stringify(result));
    else {
      console.log(`Docs map check: ${root}`);
      console.log(`Registered ${result.registered}/${result.required} required docs`);
      for (const rel of result.missing) console.log(`missing registration: ${rel}`);
      for (const rel of result.dangling) console.log(`dangling reference: ${rel}`);
      if (result.reason) console.log(result.reason);
      console.log(`Judgment: ${result.judgment}`);
    }
    return result.judgment === "PASS" ? 0 : 1;
  } catch (error) {
    console.error(`Docs map error: ${error.message}`);
    return 1;
  }
}

process.exitCode = main();
