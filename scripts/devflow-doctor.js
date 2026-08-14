#!/usr/bin/env node
"use strict";

// DevFlow doctor: post-install integrity check for the user-level runtime.
// Deliberately thin: it reuses `install-devflow-user.js --check` per home
// instead of duplicating the runtime file lists, so list drift stays in one place.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const installer = path.join(root, "scripts", "install-devflow-user.js");

// User-level runtime homes the doctor knows about. Only homes that exist are
// checked, so a clean machine reports "nothing installed" instead of six failures.
const homes = ["~/.dsh", "~/.codex", "~/.claude", "~/.codebuddy", "~/.workbuddy", "~/.zcode"].map(
  (home) => path.join(os.homedir(), home.slice(2))
);

function checkHome(home) {
  const result = spawnSync(process.execPath, [installer, "--check", "--home", home], {
    cwd: root,
    encoding: "utf8"
  });
  return { home, ok: result.status === 0, output: result.stdout.trim() };
}

function runChecks() {
  const existing = homes.filter((home) => fs.existsSync(home));
  if (existing.length === 0) {
    console.log("DevFlow doctor: no user-level runtime found.");
    console.log("Install it with: npm run install:user -- --home ~/.dsh --write --force");
    return 1;
  }

  const results = existing.map(checkHome);
  for (const { home, ok, output } of results) {
    console.log(`${ok ? "pass" : "fail"}: ${home}`);
    if (!ok) {
      // Surface the installer's own verdict lines so a failing home names its
      // missing/changed files instead of forcing a manual --check rerun.
      for (const line of output.split("\n")) {
        if (line.startsWith("missing:") || line.startsWith("changed:")) console.log(`  ${line}`);
      }
    }
  }
  const failed = results.filter((result) => !result.ok).length;
  console.log(`DevFlow doctor: ${results.length} homes checked, ${failed} failed.`);
  return failed > 0 ? 1 : 0;
}

// Self-test: a temp home prepared by the installer must pass, and one deleted
// runtime file must flip the verdict to fail — proving the doctor detects both
// the clean and the missing state, not just that it runs.
function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-doctor-"));
  try {
    const install = spawnSync(process.execPath, [installer, "--write", "--home", tmp], {
      cwd: root,
      encoding: "utf8"
    });
    if (install.status !== 0) throw new Error(`install into temp home failed:\n${install.stdout}`);

    const clean = checkHome(tmp);
    if (!clean.ok) throw new Error(`clean temp home must pass, got:\n${clean.output}`);

    fs.rmSync(path.join(tmp, "skills", "devflow-core", "SKILL.md"));
    const degraded = checkHome(tmp);
    if (degraded.ok) throw new Error("home with a deleted runtime file must fail");

    console.log("DevFlow doctor self-test passed");
    return 0;
  } catch (error) {
    console.error(error.message);
    return 1;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log("Usage: node scripts/devflow-doctor.js [--self-test]");
  console.log("Checks every existing user-level runtime home for missing or changed DevFlow files.");
  console.log("--self-test verifies the clean and missing detection states against a temp home.");
  process.exit(0);
}

process.exit(args.includes("--self-test") ? selfTest() : runChecks());
