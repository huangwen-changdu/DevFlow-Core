#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const pluginRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
const skillRoot = path.join(pluginRoot, "skills");
const checkers = ["devflow-spec.js", "devflow-plan.js", "devflow-review.js", "devflow-debt.js", "devflow-audit.js"];

function fail(message) {
  console.error(`Plugin verification failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) fail("missing .codex-plugin/plugin.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.name !== "devflow" || manifest.skills !== "./skills/") {
  fail("manifest must declare devflow and ./skills/");
}

const skillDirs = fs.readdirSync(skillRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith("devflow-"))
  .map((entry) => entry.name)
  .sort();
if (skillDirs.length !== 14) fail(`expected 14 devflow skill trees, found ${skillDirs.length}`);
for (const name of skillDirs) {
  if (!fs.existsSync(path.join(skillRoot, name, "SKILL.md"))) fail(`${name} is missing SKILL.md`);
}

for (const checker of checkers) {
  const result = spawnSync(process.execPath, [path.join(__dirname, checker), "--self-test"], {
    cwd: pluginRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) fail(`${checker} --self-test failed\n${result.stdout}${result.stderr}`);
}

console.log(`Plugin verification passed: ${skillDirs.length} skills, ${checkers.length} checker self-tests`);
