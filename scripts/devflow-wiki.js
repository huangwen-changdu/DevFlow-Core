#!/usr/bin/env node
// DevFlow-Core wiki publisher (maintainer tool, not shipped to target projects).
//
// The repository docs are the single source of truth; the GitHub wiki is a
// generated, read-only view for humans. This tool never writes into the
// repository docs — it renders wiki pages from the current index and ledger
// files, then compares, writes, or pushes them into a local clone of
// <repo>.wiki.git. Skills never read the wiki, so the derived view cannot
// become a second source of truth.
//
// Usage: node scripts/devflow-wiki.js [--check] [--write] [--push] [--self-test] [--json]
// Env:   DEVFLOW_WIKI_DIR  local wiki clone (default ../DevFlow-Core.wiki)
// Exit:  0 ok, no-op, or nothing to compare; 1 drift; 2 missing source file

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const wikiDir = process.env.DEVFLOW_WIKI_DIR || path.resolve(root, "..", "DevFlow-Core.wiki");
const wikiRemote = "git@github.com:huangwen-changdu/DevFlow-Core.wiki.git";
const repoUrl = "https://github.com/huangwen-changdu/DevFlow-Core";

// 页面映射：源文件是唯一事实源，wiki 页面只做渲染与导航。
const pages = [
  {
    page: "功能索引",
    source: "docs/features/INDEX.md",
    title: "功能索引",
    intro: "一行一路由：有什么功能、触发词是什么、入口在哪、怎么验证。"
  },
  {
    page: "需求台账",
    source: "docs/requirements.md",
    title: "需求台账",
    intro: "一条需求从确认到落地的记录，含显式跳过文档的留痕。"
  },
  {
    page: "计划索引",
    source: "docs/plans/INDEX.md",
    title: "计划索引",
    intro: "每份计划的状态与落地证据。"
  },
  {
    page: "项目导航",
    source: "docs/project-knowledge/AI-START-HERE.md",
    title: "项目导航",
    intro: "进入仓库的阅读顺序、目录职责与生命周期速览。"
  }
];

const generatedNotice =
  "> 本页由 `scripts/devflow-wiki.js` 从仓库文档生成，请勿在 wiki 上直接修改；改动请提到 `docs/` 后重新发布。";

/** Print the command contract. */
function usage() {
  console.log("Usage: node scripts/devflow-wiki.js [--check] [--write] [--push] [--self-test] [--json]");
  console.log("Renders wiki pages from docs/features/INDEX.md, docs/requirements.md, docs/plans/INDEX.md, and docs/project-knowledge/AI-START-HERE.md.");
  console.log("--check compares a local wiki clone with the generated pages; a missing clone prints setup steps and exits 0.");
  console.log("--write writes the pages into the clone; --push additionally commits and pushes them.");
  console.log("Env DEVFLOW_WIKI_DIR sets the clone location (default ../DevFlow-Core.wiki).");
}

/** Render one wiki page: generated notice, source path, intro, then the source body. */
function renderPage(entry, body) {
  return [
    `# ${entry.title}`,
    "",
    generatedNotice,
    `> 源文件：\`${entry.source}\``,
    "",
    entry.intro,
    "",
    "---",
    "",
    body.trim(),
    ""
  ].join("\n");
}

/** Return the content of one markdown section, without its heading. */
function sectionOf(body, heading) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^#{1,6}\\s+${heading}\\s*$`).test(line));
  if (start < 0) return "";
  const end = lines.findIndex((line, index) => index > start && /^#{1,6}\s+/.test(line));
  return lines.slice(start + 1, end < 0 ? lines.length : end).join("\n").trim();
}

/** Render the sidebar navigation shared by every page. */
function renderSidebar() {
  return [
    "**DevFlow-Core**",
    "",
    ...pages.map((entry) => `- [${entry.title}](${entry.page})`),
    `- [仓库首页](${repoUrl})`,
    ""
  ].join("\n");
}

/** Render the landing page: generated notice, quick links, and the capability table. */
function renderHome(bodies) {
  const featureBody = bodies.get("功能索引") || "";
  const table = sectionOf(featureBody, "索引");
  return [
    "# DevFlow-Core",
    "",
    generatedNotice,
    "",
    "把开发请求变成小步、验证过的改动：Sense 路由 → 澄清 → Cut 收敛 → Plan 施工单 → Build → Prove → Learn 沉淀。",
    "",
    "## 快速入口",
    "",
    ...pages.map((entry) => `- [${entry.title}](${entry.page})`),
    `- [知识包导航](${repoUrl}/blob/master/docs/project-knowledge/AI-START-HERE.md)`,
    "",
    "## 功能一览",
    "",
    table || "_功能索引尚未生成_",
    "",
    "## 闭环",
    "",
    "需求台账记状态，计划索引记落地证据，功能索引记能力与入口；三者都由仓库文件生成，wiki 只做展示。",
    ""
  ].join("\n");
}

/** Build every wiki page from the repository sources. */
function buildPages(repoRoot) {
  const bodies = new Map();
  const missing = [];
  for (const entry of pages) {
    const filePath = path.join(repoRoot, entry.source);
    if (!fs.existsSync(filePath)) {
      missing.push(entry.source);
      continue;
    }
    bodies.set(entry.page, fs.readFileSync(filePath, "utf8"));
  }
  const files = new Map();
  for (const entry of pages) {
    if (!bodies.has(entry.page)) continue;
    files.set(`${entry.page}.md`, renderPage(entry, bodies.get(entry.page)));
  }
  files.set("Home.md", renderHome(bodies));
  files.set("_Sidebar.md", renderSidebar());
  return { files, missing };
}

/** Compare generated pages with a wiki clone, using injectable readers for self-test. */
function checkWiki(dir, files, readFile, exists) {
  const problems = [];
  for (const [name, content] of files) {
    const target = path.join(dir, name);
    if (!exists(target)) {
      problems.push(`missing wiki page: ${name}`);
      continue;
    }
    if (readFile(target) !== content) problems.push(`wiki page out of date: ${name}`);
  }
  return problems;
}

/** Write pages into the wiki clone. */
function writePages(dir, files) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, content] of files) {
    fs.writeFileSync(path.join(dir, name), content);
  }
}

/** Exercise rendering and drift detection without touching a wiki clone. */
function selfTest() {
  const entry = pages[0];
  const page = renderPage(entry, "## 索引\n\n| 功能 |\n|---|\n| A |\n");
  if (!page.includes(generatedNotice)) throw new Error("Self-test expected the generated notice on every page");
  if (!page.includes(entry.source)) throw new Error("Self-test expected the source path on every page");
  const sidebar = renderSidebar();
  for (const item of pages) {
    if (!sidebar.includes(`(${item.page})`)) throw new Error(`Self-test expected sidebar link to ${item.page}`);
  }
  if (sectionOf(page, "索引") !== "| 功能 |\n|---|\n| A |") throw new Error("Self-test expected sectionOf to extract the table");
  if (sectionOf(page, "不存在") !== "") throw new Error("Self-test expected a missing section to be empty");
  const files = new Map([["Home.md", "home"]]);
  const same = checkWiki("dir", files, () => "home", () => true);
  if (same.length !== 0) throw new Error("Self-test expected identical pages to pass");
  if (checkWiki("dir", files, () => "other", () => true).length === 0) throw new Error("Self-test expected drift to fail");
  if (checkWiki("dir", files, () => "home", () => false).length === 0) throw new Error("Self-test expected a missing page to fail");
  console.log("DevFlow wiki self-test passed");
  console.log("Checked page rendering, generated notice, sidebar links, section extraction, and drift detection");
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}
if (args.includes("--self-test")) {
  selfTest();
  process.exit(0);
}

const json = args.includes("--json");
const { files, missing } = buildPages(root);
if (missing.length) {
  console.error(`Wiki publish aborted: missing source file(s): ${missing.join(", ")}`);
  process.exit(2);
}
if (!fs.existsSync(wikiDir)) {
  console.log(`Wiki clone not found: ${wikiDir}`);
  console.log("First-time setup: create any page in the GitHub wiki UI, then clone it:");
  console.log(`  git clone ${wikiRemote} "${wikiDir}"`);
  console.log("Then re-run this command with --check, --write, or --push.");
  process.exit(0);
}

const shouldWrite = args.includes("--write") || args.includes("--push");
if (shouldWrite) writePages(wikiDir, files);

const problems = checkWiki(wikiDir, files, (file) => fs.readFileSync(file, "utf8"), (file) => fs.existsSync(file));
if (json) {
  console.log(JSON.stringify({ checker: "devflow-wiki", wikiDir, pages: [...files.keys()], problems, judgment: problems.length ? "FAIL" : "PASS" }));
} else {
  console.log("DevFlow wiki report");
  console.log(`Wiki dir: ${wikiDir}`);
  console.log(`Generated pages: ${[...files.keys()].join(", ")}`);
  if (shouldWrite) console.log("Wrote generated pages into the wiki clone");
  if (problems.length === 0) console.log("Problems: none");
  for (const problem of problems) console.log(`Problem: ${problem}`);
  console.log(`Judgment: ${problems.length ? "FAIL" : "PASS"}`);
}
if (problems.length) process.exit(1);

if (args.includes("--push")) {
  const git = (gitArgs) => spawnSync("git", gitArgs, { cwd: wikiDir, stdio: "inherit" });
  git(["add", "--all"]);
  const committed = git(["commit", "-m", "docs: sync wiki pages from repository indexes"]);
  if (committed.status !== 0) {
    console.log("Nothing to commit; skipping push.");
    process.exit(0);
  }
  const pushed = git(["push"]);
  process.exit(pushed.status === 0 ? 0 : 1);
}
