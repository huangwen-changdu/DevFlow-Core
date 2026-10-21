#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

// 一键上车：安装运行时装、初始化文档地图、校验地图与索引。
// 只做增量写入：install 跳过已存在文件，地图只在缺失时创建，从不覆盖。
const repo = path.resolve(__dirname, "..");

function usage() {
  console.log("Usage: npm run onboard:target -- <target-project> [--dry-run]");
  console.log("Installs the runtime pack, creates docs/INDEX.md when missing, then verifies the map and indexes.");
  console.log("Existing files are never overwritten; --dry-run prints the plan without writing.");
}

const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));
const wantsHelp = args.includes("--help") || args.includes("-h");
if (!targetArg || wantsHelp) {
  usage();
  process.exit(wantsHelp ? 0 : 1);
}

const dryRun = args.includes("--dry-run");
const target = path.resolve(process.cwd(), targetArg);
if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
  console.error(`Target project directory does not exist: ${target}`);
  process.exit(1);
}

function run(script, argv, options = {}) {
  return spawnSync(process.execPath, [script, ...argv], { cwd: target, encoding: "utf8", ...options });
}

function tail(text, lines = 6) {
  return (text || "").trim().split(/\r?\n/).slice(-lines).join("\n");
}

function fail(stage, result) {
  console.error(`Onboard failed at ${stage}.`);
  if (result?.stdout) console.error(tail(result.stdout));
  if (result?.stderr) console.error(tail(result.stderr, 4));
  process.exit(1);
}

// 1. Runtime pack. Without --write this is the installer's dry-run.
const installArgs = [path.join(repo, "scripts", "install-devflow.js"), target];
if (!dryRun) installArgs.push("--write");
const install = spawnSync(process.execPath, installArgs, { cwd: repo, encoding: "utf8" });
if (install.status !== 0) fail("install", install);

const actions = { created: 0, overwrote: 0, skipped: 0, merged: 0, preview: 0 };
for (const line of (install.stdout || "").split(/\r?\n/)) {
  if (line.startsWith("created:")) actions.created += 1;
  else if (line.startsWith("overwrote:")) actions.overwrote += 1;
  else if (line.startsWith("skipped existing:")) actions.skipped += 1;
  else if (line.startsWith("merged existing:")) actions.merged += 1;
  else if (line.startsWith("would ")) actions.preview += 1;
}

// 2. Docs map. Run this repository's checker against the target so behavior stays current.
const docsScript = path.join(repo, "scripts", "devflow-docs.js");
const mapPath = path.join(target, "docs", "INDEX.md");
let mapAction = "existing";
if (!fs.existsSync(mapPath)) {
  if (dryRun) {
    mapAction = "would create";
  } else {
    const init = run(docsScript, ["--init", "--root", target]);
    if (init.status !== 0) fail("docs init", init);
    mapAction = "created";
  }
}

// 3. Verify the map.
const check = run(docsScript, ["--check", "--json", "--root", target]);
let mapCheck = { judgment: "FAIL", reason: "unreadable checker output" };
try {
  mapCheck = JSON.parse(check.stdout.trim());
} catch {
  mapCheck.reason = tail(check.stdout) || tail(check.stderr);
}

// 4. Verify requirement, feature, and plan indexes with the installed checker.
const planScript = path.join(target, "scripts", "devflow-plan.js");
let indexCheck = { status: "skipped", detail: "installed plan checker not found" };
if (fs.existsSync(planScript)) {
  const index = spawnSync(process.execPath, [planScript, "--index"], { cwd: target, encoding: "utf8" });
  const problem = (index.stdout || "")
    .split(/\r?\n/)
    .find((line) => line.startsWith("Problem:") || line.startsWith("Problems:"));
  indexCheck = {
    status: index.status === 0 ? "PASS" : "FINDINGS",
    detail: problem || tail(index.stderr, 2)
  };
}

const mapJudgment = dryRun && mapAction === "would create" ? "PREVIEW" : mapCheck.judgment;
const judgment = mapJudgment === "FAIL" ? "FAIL" : "PASS";

console.log(`DevFlow onboard: ${target}${dryRun ? " (dry-run)" : ""}`);
console.log(`install: ${actions.created} created, ${actions.merged} merged, ${actions.skipped} skipped${dryRun ? `, ${actions.preview} preview` : ""}`);
console.log(`docs map: ${mapAction}`);
console.log(`docs check: ${mapJudgment}${mapCheck.required ? ` (${mapCheck.registered}/${mapCheck.required})` : ""}`);
console.log(`index check: ${indexCheck.status}${indexCheck.detail ? ` - ${indexCheck.detail}` : ""}`);
if (mapCheck.missing?.length) console.log(`missing registrations: ${mapCheck.missing.join(", ")}`);
if (mapCheck.dangling?.length) console.log(`dangling references: ${mapCheck.dangling.join(", ")}`);
if (mapCheck.reason) console.log(`docs check note: ${mapCheck.reason}`);
if (indexCheck.status === "FINDINGS") {
  console.log("index note: existing docs do not match the DevFlow schema; onboard does not rewrite them.");
}
console.log(`Judgment: ${judgment}`);

process.exit(judgment === "FAIL" ? 1 : 0);
