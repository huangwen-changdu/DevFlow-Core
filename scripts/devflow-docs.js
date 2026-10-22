#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

// 文档地图与项目骨架：`--init` 生成 docs/INDEX.md、PROGRESS.md、标准命令入口和就近的层文档；
// `--check` 保证每个根文档与 spec 已登记、每条登记路径真实存在。
// 所有生成内容都是骨架：能确定的写事实，不能确定的写 [待确认]，从不覆盖已有文件。
const MAP_REL = path.join("docs", "INDEX.md");
const MAP_BASENAME = "INDEX.md";
const FILE_EXT = /\.(cs|ts|tsx|js|jsx|py|go|java|kt|rb|php|fs)$/;

function usage() {
  console.log("Usage: node scripts/devflow-docs.js [--status] [--init] [--check] [--refresh] [--root <dir>] [--force] [--dry-run] [--preview] [--json] [--self-test]");
  console.log("  --status   report which project artifacts exist and the next command for each missing one (read-only)");
  console.log("  --init     create the docs map plus PROGRESS.md, a command entry, docs/ARCHITECTURE.md, and the spec index");
  console.log("  --check    verify the map routes, the spec index covers every spec, and the map stays within 90 lines");
  console.log("  --refresh  rebuild docs/specs/INDEX.md from the filesystem (derived, safe to rerun)");
  console.log("  --preview  with --init, print the generated file bodies without writing");
  console.log("  --root     project root, default current directory");
  console.log("  --force    regenerate docs/INDEX.md; other generated files are never overwritten");
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Derived index: one row per spec, newest first, grouped by year. Never hand-edited. */
function specsIndexContent(root) {
  const dir = path.join(root, "docs", "specs");
  const files = listMarkdown(dir).filter((name) => name !== "INDEX.md");
  if (files.length === 0) return null;
  const rows = files
    .map((name) => {
      const dateMatch = name.match(/^(\d{4}-\d{2}-\d{2})/);
      const text = fs.readFileSync(path.join(dir, name), "utf8");
      const heading = text.match(/^#\s+(.+)$/m);
      const title = (heading ? heading[1].trim() : path.basename(name, ".md")).replaceAll("|", "/").slice(0, 90);
      return { name, date: dateMatch ? dateMatch[1] : "—", title };
    })
    .sort((a, b) => (a.date === b.date ? a.name.localeCompare(b.name) : b.date.localeCompare(a.date)));
  const years = [...new Set(rows.map((row) => row.date.slice(0, 4)).filter((year) => /^\d{4}$/.test(year)))].sort().reverse();
  const lines = [
    "# 设计契约索引",
    "",
    "> 派生索引：`node scripts/devflow-docs.js --refresh` 生成，不手工编辑。",
    "> 机检：`node scripts/devflow-docs.js --check`。",
    ""
  ];
  for (const year of years) {
    const group = rows.filter((row) => row.date.startsWith(year));
    lines.push(`## ${year}（${group.length}）`, "", "| 日期 | 标题 | 文件 |", "|---|---|---|");
    for (const row of group) lines.push(`| ${row.date} | ${row.title} | \`docs/specs/${row.name}\` |`);
    lines.push("");
  }
  const undated = rows.filter((row) => row.date === "—");
  if (undated.length) {
    lines.push("## 未标日期", "", "| 日期 | 标题 | 文件 |", "|---|---|---|");
    for (const row of undated) lines.push(`| — | ${row.title} | \`docs/specs/${row.name}\` |`);
    lines.push("");
  }
  return lines.join("\n");
}

const LAYER_RULES = [
  {
    kind: "architecture",
    file: "ARCHITECTURE.md",
    title: "API 层",
    pattern: /(^|[.\-_])(api|apis|controllers?|handlers?|endpoints?|routes?)$/i
  },
  {
    kind: "architecture",
    file: "ARCHITECTURE.md",
    title: "服务层",
    pattern: /(^|[.\-_])services?$/i
  },
  {
    kind: "constraints",
    file: "CONSTRAINTS.md",
    title: "数据层",
    pattern: /(^|[.\-_])(db|database|data|repositories?|repository|dao)$/i
  }
];

function detectLayers(root) {
  const ignore = new Set([
    "node_modules", ".git", "bin", "obj", "dist", "build", "out", "target", "vendor", ".next", "coverage",
    "docs", "graphify-out", "openspec", "skills", "commands", "hooks", "scripts", "lib"
  ]);
  const bases = [root];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || ignore.has(entry.name) || entry.name === "src") continue;
    bases.push(path.join(root, entry.name));
  }
  if (fs.existsSync(path.join(root, "src"))) bases.push(path.join(root, "src"));
  const found = [];
  for (const base of bases) {
    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) continue;
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      if (!entry.isDirectory() || ignore.has(entry.name)) continue;
      const rule = LAYER_RULES.find((item) => item.pattern.test(entry.name));
      if (!rule) continue;
      const rel = path.relative(root, path.join(base, entry.name)).replaceAll("\\", "/");
      if (found.some((item) => item.rel === rel)) continue;
      found.push({ rel, kind: rule.kind, file: rule.file, title: rule.title });
      if (found.length >= 4) return found;
    }
  }
  return found;
}

function layerEntries(root, rel) {
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && FILE_EXT.test(entry.name) && !/^(usings|globalusings|assemblyinfo|program|startup)\./i.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .slice(0, 6);
}

function detectCommands(root, detected) {
  const packageFile = path.join(root, "package.json");
  if (fs.existsSync(packageFile)) {
    try {
      const scripts = JSON.parse(fs.readFileSync(packageFile, "utf8")).scripts || {};
      return {
        setup: "npm install",
        test: scripts.test ? "npm test" : "",
        lint: scripts.lint ? "npm run lint" : "",
        check: scripts["verify:all"] ? "npm run verify:all" : scripts.test ? "npm test" : ""
      };
    } catch {
      return { setup: "npm install", test: "", lint: "", check: "" };
    }
  }
  if (detected.solutions.length > 0) {
    return { setup: "dotnet restore", test: "dotnet test", lint: "dotnet format --verify-no-changes", check: "dotnet test" };
  }
  if (fs.existsSync(path.join(root, "go.mod"))) {
    return { setup: "go mod download", test: "go test ./...", lint: "go vet ./...", check: "go test ./..." };
  }
  if (fs.existsSync(path.join(root, "pyproject.toml"))) {
    return { setup: "pip install -e .", test: "pytest", lint: "ruff check .", check: "pytest && ruff check ." };
  }
  if (fs.existsSync(path.join(root, "Cargo.toml"))) {
    return { setup: "cargo build", test: "cargo test", lint: "cargo clippy", check: "cargo test && cargo clippy" };
  }
  return null;
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
  const layers = detectLayers(root);
  return { topDocs, specDocs, dirs, rootEntries, manifests, solutions, layers };
}

const STATUSES = ["open", "designed", "planned", "built", "landed", "opt-out", "dropped"];

function ledgerRows(root) {
  const ledger = path.join(root, "docs", "requirements.md");
  if (!fs.existsSync(ledger)) return { landed: [], active: [] };
  const rows = fs
    .readFileSync(ledger, "utf8")
    .split(/\r?\n/)
    .filter((line) => /^\|\s*20\d\d-\d\d-\d\d\s*\|/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 4);
  const landed = [];
  const active = [];
  for (const cells of rows) {
    const status = cells.find((cell) => STATUSES.includes(cell));
    if (!status) continue;
    const record = { date: cells[0], name: cells[1] || "", status };
    if (status === "landed") landed.push(record);
    else if (status === "open" || status === "designed" || status === "planned" || status === "built") active.push(record);
  }
  return { landed: landed.slice(-3).reverse(), active };
}

function architectureContent(root, layers) {
  const rows = layers.map((layer) => ({ ...layer, entries: layerEntries(root, layer.rel) }));
  const lines = [
    `# 架构与分层（${path.basename(root)}）`,
    "",
    "Metadata:",
    `- repo: ${root}`,
    `- last_updated: ${today()}`,
    "- updated_from: devflow-docs --init (directory scan)",
    "- confidence: low",
    "- coverage: 分层目录、入口文件、职责与约束骨架",
    "- stale_risk: medium",
    "- next_review_hint: 新增或移动分层目录、跨层依赖或公开入口变化时",
    "",
    "> 本文件由 `devflow-docs --init` 生成，内容为待确认骨架；确认后再作为架构约束使用。",
    "",
    "## 分层总览",
    "",
    "| 层 | 目录 | 主要入口 | 职责 | 硬约束 |",
    "|---|---|---|---|---|"
  ];
  for (const row of rows) {
    const entries = row.entries.length ? row.entries.map((name) => `\`${name}\``).join("、") : "`[待确认]`";
    lines.push(`| ${row.title} | \`${row.rel}\` | ${entries} | \`[待确认]\` | \`[待确认]\` |`);
  }
  lines.push("");
  for (const row of rows) {
    const entryLines = row.entries.length ? row.entries.map((name) => `- \`${name}\``) : ["- `[待确认]`"];
    lines.push(`## ${row.title}（\`${row.rel}\`）`, "");
    if (row.kind === "architecture") {
      lines.push("### 职责", "- `[待确认]` 本层负责什么，不负责什么。", "");
      lines.push("### 公开入口", ...entryLines, "");
      lines.push("### 已确认约束", "- `[待确认]` 允许依赖哪些层，禁止依赖哪些层。", "");
      lines.push("### 待确认问题", "- 哪些调用必须经过本层？", "- 哪些错误、重试或副作用必须在本层显式处理？", "");
    } else {
      lines.push("### 职责", "- `[待确认]` 本层负责哪些数据读写与一致性。", "");
      lines.push("### 主要入口", ...entryLines, "");
      lines.push("### 硬约束", "- `[待确认]` 事务边界。", "- `[待确认]` 迁移与回滚方式。", "- `[待确认]` 禁止直接读写的表或字段。", "");
      lines.push("### 待确认问题", "- 哪些写操作必须走事务？", "- 哪些查询必须限制范围或走索引？", "");
    }
  }
  return lines.join("\n");
}

function progressContent(root) {
  const rows = ledgerRows(root);
  const lines = [
    "# PROGRESS",
    "",
    "> 当前进度：做了什么、在做什么、被什么阻塞。",
    "> 进度真相是 `docs/requirements.md`；本文件只做摘要，随每次落地更新。",
    "",
    "## 现在",
    "- `[待确认]` 当前阶段目标。",
    ""
  ];
  lines.push("## 最近落地", "");
  if (rows.landed.length) {
    for (const row of rows.landed) lines.push(`- ${row.date} — ${row.name.slice(0, 80)}`);
  } else {
    lines.push("- 暂无（或需求台账尚未建立）");
  }
  lines.push("", "## 进行中", "");
  if (rows.active.length) {
    for (const row of rows.active.slice(0, 5)) lines.push(`- ${row.date} — ${row.name.slice(0, 80)} (${row.status})`);
  } else {
    lines.push("- 无");
  }
  lines.push("", "## 阻塞", "", "- `[待确认]`", "", "## 下一步", "", "- `[待确认]`", "");
  return lines.join("\n");
}

function makefileContent(commands) {
  const targets = ["setup", "test", "lint", "check"].filter((name) => commands[name]);
  if (targets.length === 0) return null;
  const lines = ["# Generated by devflow-docs --init. Adjust targets to the real project commands.", `.PHONY: ${targets.join(" ")}`, ""];
  for (const name of targets) lines.push(`${name}:`, `\t${commands[name]}`, "");
  return lines.join("\n");
}

function render(root, detected, planned = new Set()) {
  const has = (rel) => fs.existsSync(path.join(root, rel)) || planned.has(rel);
  const project = path.basename(root);
  const lines = [];
  const table = [];

  table.push(["这是什么产品", detected.rootEntries.includes("README.md") ? "`README.md`" : "`[待确认]`", "活"]);
  const organization = [
    has("docs/ARCHITECTURE.md") ? "`docs/ARCHITECTURE.md`" : "",
    detected.rootEntries.includes("AGENTS.md") ? "`AGENTS.md`" : "",
    detected.dirs.some(([name]) => name === "project-knowledge") ? "`docs/project-knowledge/AI-START-HERE.md`" : ""
  ].filter(Boolean);
  table.push(["怎么组织", organization.length ? organization.join("、") : "`[待确认]`", "活"]);
  const runTargets = [detected.rootEntries.includes("README.md") ? "`README.md`" : "", detected.manifests.length ? `\`${detected.manifests[0]}\`` : ""].filter(Boolean);
  table.push(["怎么跑、怎么验证", runTargets.length ? `${runTargets.join(" + ")} 中的命令` : "`[待确认]`", "活"]);
  const progressTargets = [
    has("PROGRESS.md") ? "`PROGRESS.md`" : "",
    detected.topDocs.includes("requirements.md") ? "`docs/requirements.md`" : ""
  ].filter(Boolean);
  table.push(["现在做到哪", progressTargets.length ? progressTargets.join(" + ") : "`[待确认]`", "活"]);
  table.push([
    "某个能力现状",
    detected.dirs.some(([name]) => name === "features") && fs.existsSync(path.join(root, "docs", "features", "INDEX.md"))
      ? "`docs/features/INDEX.md`"
      : "`[待确认]`",
    "活"
  ]);
  table.push(["某项设计为什么这样", has("docs/specs/INDEX.md") ? "`docs/specs/INDEX.md`" : "`[待确认]`", "快照"]);

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

  const rootDocs = [
    has("PROGRESS.md") ? "PROGRESS.md" : "",
    has("Makefile") ? "Makefile" : ""
  ].filter(Boolean);
  if (rootDocs.length) {
    lines.push("## 仓库根文件", "");
    for (const name of rootDocs) lines.push(`- \`${name}\``);
    lines.push("");
  }

  const plannedDocs = [...planned].filter((rel) => /^docs\/[^/]+\.md$/.test(rel)).map((rel) => rel.slice(5));
  const topDocs = [...new Set([...detected.topDocs, ...plannedDocs])].sort();
  if (topDocs.length) {
    lines.push("## 根文档", "");
    for (const name of topDocs) lines.push(`- \`docs/${name}\``);
    lines.push("");
  }

  const categoryIndexes = [
    ["设计契约", "docs/specs/INDEX.md"],
    ["实施计划", "docs/plans/INDEX.md"],
    ["能力现状", "docs/features/INDEX.md"]
  ].filter(([, rel]) => has(rel));
  if (categoryIndexes.length) {
    lines.push("## 分类索引", "");
    for (const [label, rel] of categoryIndexes) lines.push(`- ${label}：\`${rel}\``);
    lines.push("");
  }

  lines.push("## 快照规则", "");
  lines.push("- `docs/specs/`、`docs/plans/` 与带日期的评审文档是历史快照，不是当前事实。");
  lines.push("- 当前事实只看活文档：需求台账看进度，能力索引看现状，入口规则看根目录的 agent 入口文件。", "");
  lines.push("## 更新契约", "");
  lines.push("- 新增任意根文档：在本页登记；漏登记会让 `--check` 失败。");
  lines.push("- 新增 spec：运行 `--refresh` 重建 `docs/specs/INDEX.md`；主地图不逐条登记。");
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
  const rootDocs = listMarkdown(docs).filter((name) => name !== MAP_BASENAME).map((name) => `docs/${name}`);
  const specDocs = listMarkdown(path.join(docs, "specs")).filter((name) => name !== MAP_BASENAME).map((name) => `docs/specs/${name}`);
  const categoryIndexes = ["docs/features/INDEX.md", "docs/plans/INDEX.md", "docs/specs/INDEX.md"].filter((rel) =>
    fs.existsSync(path.join(root, rel))
  );
  const specsIndexRel = "docs/specs/INDEX.md";
  const hasSpecsIndex = fs.existsSync(path.join(root, specsIndexRel));
  const required = [...rootDocs, ...categoryIndexes, ...(hasSpecsIndex ? [] : specDocs)];
  const missing = required.filter((rel) => {
    if (body.includes(rel)) return false;
    const isRootDoc = !rel.startsWith("docs/specs/") && !rel.endsWith("/INDEX.md");
    return !(isRootDoc && body.includes(path.basename(rel)));
  });
  const dangling = [];
  for (const match of body.matchAll(/`([^`]+\.md)`/g)) {
    const rel = match[1];
    if (rel.includes("*") || rel.includes("[待确认]")) continue;
    if (!resolveCandidate(root, rel)) dangling.push(rel);
  }

  // Derived spec index: when present it owns leaf coverage, so the master map stays a router.
  let specMissing = [];
  let specDangling = [];
  if (hasSpecsIndex) {
    const indexBody = fs.readFileSync(path.join(root, specsIndexRel), "utf8");
    specMissing = specDocs.filter((rel) => !indexBody.includes(rel));
    for (const match of indexBody.matchAll(/`([^`]+\.md)`/g)) {
      if (!fs.existsSync(path.join(root, match[1]))) specDangling.push(match[1]);
    }
  }

  const lines = body.split(/\r?\n/).length;
  const oversize = lines > 90;
  const judgment =
    missing.length === 0 && dangling.length === 0 && specMissing.length === 0 && specDangling.length === 0 && !oversize
      ? "PASS"
      : "FAIL";
  return {
    map: MAP_REL,
    required: required.length,
    registered: required.length - missing.length,
    missing,
    dangling,
    specMissing,
    specDangling,
    lines,
    oversize,
    judgment
  };
}

const INVENTORY = [
  ["AGENTS.md", "流程入口", "npm run install:target -- <project> --write"],
  ["scripts/devflow-docs.js", "文档地图检查器", "install:target --write，或 install:user（用户级）"],
  ["skills/devflow-core/SKILL.md", "运行时技能", "install:target --write，或 install:user（用户级）"],
  ["docs/INDEX.md", "文档地图", "node scripts/devflow-docs.js --init"],
  ["PROGRESS.md", "进度摘要（做了什么/在做什么/被什么阻塞）", "node scripts/devflow-docs.js --init"],
  ["Makefile", "标准命令入口（setup/test/lint/check）", "node scripts/devflow-docs.js --init"],
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

function init(root, force, dryRun) {
  const mapPath = path.join(root, MAP_REL);
  const variant = path.join(root, "docs", "index.md");
  if (!fs.existsSync(mapPath) && fs.existsSync(variant) && variant !== mapPath) {
    throw new Error("docs/index.md already exists; rename it or pass a different map path before initializing");
  }
  const detected = detect(root);
  const commands = detectCommands(root, detected);

  const writes = [];
  if (!fs.existsSync(path.join(root, "PROGRESS.md"))) {
    writes.push({ rel: "PROGRESS.md", body: progressContent(root) });
  }
  if (!fs.existsSync(path.join(root, "Makefile"))) {
    const makefile = commands ? makefileContent(commands) : null;
    if (makefile) writes.push({ rel: "Makefile", body: makefile });
  }
  if (detected.layers.length > 0 && !fs.existsSync(path.join(root, "docs", "ARCHITECTURE.md"))) {
    writes.push({ rel: "docs/ARCHITECTURE.md", body: architectureContent(root, detected.layers) });
  }
  if (!fs.existsSync(path.join(root, "docs", "specs", "INDEX.md"))) {
    const specIndex = specsIndexContent(root);
    if (specIndex) writes.push({ rel: "docs/specs/INDEX.md", body: specIndex });
  }

  const mapExists = fs.existsSync(mapPath);
  const writeMap = !mapExists || force;

  if (!dryRun) {
    for (const item of writes) {
      const target = path.join(root, item.rel);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, item.body, "utf8");
    }
  }

  if (writeMap) {
    const planned = new Set(writes.map((item) => item.rel));
    const body = render(root, detected, planned);
    if (!dryRun) {
      fs.mkdirSync(path.dirname(mapPath), { recursive: true });
      fs.writeFileSync(mapPath, body, "utf8");
    }
    writes.push({ rel: MAP_REL, body });
  }

  return {
    map: writeMap ? (mapExists ? "regenerated" : "created") : "existing",
    written: writes.map((item) => item.rel.replaceAll("\\", "/")),
    files: writes.map((item) => ({ rel: item.rel.replaceAll("\\", "/"), body: item.body })),
    skipped: mapExists && !force ? [MAP_REL.replaceAll("\\", "/")] : [],
    dryRun
  };
}

function refreshSpecs(root) {
  const body = specsIndexContent(root);
  if (!body) return null;
  const target = path.join(root, "docs", "specs", "INDEX.md");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body, "utf8");
  return "docs/specs/INDEX.md";
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-docs-"));
  fs.mkdirSync(path.join(tmp, "docs", "specs"), { recursive: true });
  fs.mkdirSync(path.join(tmp, "src", "api"), { recursive: true });
  fs.mkdirSync(path.join(tmp, "src", "db"), { recursive: true });
  fs.writeFileSync(path.join(tmp, "README.md"), "# Demo\n", "utf8");
  fs.writeFileSync(path.join(tmp, "package.json"), JSON.stringify({ scripts: { test: "node -e 0", lint: "node -e 0" } }), "utf8");
  fs.writeFileSync(path.join(tmp, "docs", "PRD.md"), "# PRD\n", "utf8");
  fs.writeFileSync(path.join(tmp, "docs", "specs", "2026-01-01-demo.md"), "# Demo spec\n", "utf8");
  fs.writeFileSync(path.join(tmp, "src", "api", "controller.ts"), "export {};\n", "utf8");
  fs.writeFileSync(path.join(tmp, "src", "db", "repository.ts"), "export {};\n", "utf8");

  init(tmp, false, false);
  if (check(tmp).judgment !== "PASS") throw new Error("self-test expected a passing initialized map");
  for (const rel of ["PROGRESS.md", "Makefile", "docs/ARCHITECTURE.md", "docs/specs/INDEX.md"]) {
    if (!fs.existsSync(path.join(tmp, rel))) throw new Error(`self-test expected ${rel} to be created`);
  }
  if (fs.existsSync(path.join(tmp, "src", "api", "ARCHITECTURE.md"))) {
    throw new Error("self-test expected no per-directory architecture file");
  }

  // A new spec must fail until the derived index is refreshed.
  fs.writeFileSync(path.join(tmp, "docs", "specs", "2026-02-02-new.md"), "# New spec\n", "utf8");
  if (check(tmp).judgment !== "FAIL") throw new Error("self-test expected a new spec to fail before refresh");
  refreshSpecs(tmp);
  if (check(tmp).judgment !== "PASS") throw new Error("self-test expected --refresh to restore coverage");

  fs.writeFileSync(path.join(tmp, "PROGRESS.md"), "KEEP\n", "utf8");
  init(tmp, false, false);
  if (fs.readFileSync(path.join(tmp, "PROGRESS.md"), "utf8") !== "KEEP\n") {
    throw new Error("self-test expected generated files to stay untouched on rerun");
  }

  const dry = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-docs-dry-"));
  fs.writeFileSync(path.join(dry, "README.md"), "# Demo\n", "utf8");
  const preview = init(dry, false, true);
  if (preview.written.length === 0 || fs.existsSync(path.join(dry, "PROGRESS.md"))) {
    throw new Error("self-test expected --dry-run to report without writing");
  }

  fs.writeFileSync(path.join(tmp, "docs", "UNREGISTERED.md"), "# new\n", "utf8");
  if (check(tmp).judgment !== "FAIL") throw new Error("self-test expected an unregistered doc to fail");

  fs.unlinkSync(path.join(tmp, "docs", "UNREGISTERED.md"));
  fs.unlinkSync(path.join(tmp, "docs", "PRD.md"));
  const dangling = check(tmp);
  if (dangling.judgment !== "FAIL" || dangling.dangling.length === 0) {
    throw new Error("self-test expected a missing registered file to fail");
  }

  console.log("DevFlow docs self-test passed");
  console.log("Checked init, generated skeletons, dry-run, coverage failure, and dangling-path failure");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) return usage();
  if (args.includes("--self-test")) return selfTest();

  const rootIndex = args.indexOf("--root");
  const root = path.resolve(rootIndex >= 0 && args[rootIndex + 1] ? args[rootIndex + 1] : process.cwd());
  const json = args.includes("--json");
  const dryRun = args.includes("--dry-run") || args.includes("--preview");

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

    if (args.includes("--refresh")) {
      if (dryRun) {
        const body = specsIndexContent(root);
        console.log(body || "No specs found; nothing to refresh.");
        return 0;
      }
      const refreshed = refreshSpecs(root);
      console.log(refreshed ? `Refreshed ${refreshed}` : "No specs found; nothing to refresh.");
      return 0;
    }

    if (args.includes("--init")) {
      const preview = args.includes("--preview");
      const result = init(root, args.includes("--force"), dryRun);
      if (preview) {
        for (const file of result.files) console.log(`\n--- ${file.rel} ---\n${file.body}`);
        return 0;
      }
      if (json) console.log(JSON.stringify({ map: result.map, written: result.written, skipped: result.skipped, dryRun: result.dryRun }));
      else {
        console.log(`${result.dryRun ? "Would create" : "Created"} ${result.written.length} file(s) for ${root}:`);
        for (const rel of result.written) console.log(`  ${rel}`);
        if (result.skipped.length) console.log(`Kept existing: ${result.skipped.join(", ")} (pass --force to regenerate the map)`);
        console.log(`Map: ${result.map}`);
        console.log("Review every [待确认] row before relying on the generated files.");
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
      for (const rel of result.specMissing) console.log(`missing from the spec index: ${rel}`);
      for (const rel of result.specDangling) console.log(`dangling spec index entry: ${rel}`);
      if (result.oversize) console.log(`map size: ${result.lines} lines (limit 90); move leaf lists into a category index`);
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
