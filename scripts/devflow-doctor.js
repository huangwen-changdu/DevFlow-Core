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
const targetInstaller = path.join(root, "scripts", "install-devflow.js");

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

function checkProject(project) {
  const result = spawnSync(process.execPath, [targetInstaller, project, "--check"], {
    cwd: root,
    encoding: "utf8"
  });
  return { project, ok: result.status === 0, output: `${result.stdout}${result.stderr}`.trim() };
}

/** Project-level check reuses the target installer's own --check so the runtime file list stays single-source. */
function runProjectCheck(project) {
  if (!fs.existsSync(targetInstaller)) {
    console.log("DevFlow doctor: project checks require the DevFlow-Core package (scripts/install-devflow.js not found).");
    return 1;
  }
  const result = checkProject(project);
  console.log(`${result.ok ? "pass" : "fail"}: ${project}`);
  if (!result.ok) {
    for (const line of result.output.split("\n")) {
      if (/^(missing|changed|stale): /.test(line)) console.log(`  ${line}`);
    }
    console.log(`  migrate: npm run install:target -- ${project} --write --force --migrate  (review changed files first)`);
  }
  console.log(`DevFlow doctor project check: ${result.ok ? "pass" : "fail"}`);
  return result.ok ? 0 : 1;
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

    if (fs.existsSync(targetInstaller)) {
      const project = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-doctor-project-"));
      try {
        const install = spawnSync(process.execPath, [targetInstaller, project, "--write"], { cwd: root, encoding: "utf8" });
        if (install.status !== 0) throw new Error(`install into temp project failed:\n${install.stdout}`);
        if (!checkProject(project).ok) throw new Error("clean temp project must pass");

        fs.mkdirSync(path.join(project, "skills", "devflow-core"), { recursive: true });
        fs.copyFileSync(
          path.join(project, ".agents", "skills", "devflow-core", "SKILL.md"),
          path.join(project, "skills", "devflow-core", "SKILL.md")
        );
        if (checkProject(project).ok) throw new Error("project with a legacy skills/ copy must fail");

        const migrate = spawnSync(process.execPath, [targetInstaller, project, "--migrate"], { cwd: root, encoding: "utf8" });
        if (migrate.status !== 0) throw new Error(`--migrate failed:\n${migrate.stdout}`);
        if (!checkProject(project).ok) throw new Error("project must pass after --migrate removes the identical legacy copy");
      } finally {
        fs.rmSync(project, { recursive: true, force: true });
      }
    }

    const skillsChecker = path.join(root, "scripts", "devflow-skills.js");
    if (fs.existsSync(skillsChecker)) {
      const skills = spawnSync(process.execPath, [skillsChecker, "--self-test"], { cwd: root, encoding: "utf8" });
      if (skills.status !== 0) throw new Error(`skills checker self-test failed:\n${skills.stdout}${skills.stderr}`);
    }

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
const projectFlag = args.indexOf("--project");
const projectArg = projectFlag >= 0 ? args[projectFlag + 1] : null;
if (projectFlag >= 0 && !projectArg) {
  console.error("--project requires a target project path");
  process.exit(1);
}
if (args.includes("--help") || args.includes("-h")) {
  console.log("Usage: node scripts/devflow-doctor.js [--self-test] [--project <target-project>]");
  console.log("Checks every existing user-level runtime home for missing or changed DevFlow files.");
  console.log("--project checks one project's .agents/skills runtime and reports legacy skills/ copies.");
  console.log("--self-test verifies the clean and missing detection states against a temp home and project.");
  process.exit(0);
}

if (args.includes("--self-test")) process.exit(selfTest());
process.exit(projectArg ? runProjectCheck(path.resolve(process.cwd(), projectArg)) : runChecks());
