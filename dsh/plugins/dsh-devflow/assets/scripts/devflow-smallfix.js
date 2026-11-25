#!/usr/bin/env node
"use strict";

// Mechanically decides whether a Fast Small-fix may stay narrow. The agent
// supplies the verification command; this script counts the actual diff,
// blocks protected paths and structural changes, and runs the command itself.
// Exit 0 = NARROW_OK, exit 1 = PROMOTE (or a checker error).

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { spawnSync } = require("node:child_process");

const DEFAULT_MAX_FILES = 2;
const DEFAULT_MAX_LINES = 20;
const PROTECTED_TOKENS = new Set([
  "auth", "authentication", "authorization", "permission", "permissions", "rbac", "acl",
  "payment", "payments", "billing", "invoice", "checkout",
  "migration", "migrations", "schema", "schemas",
  "secret", "secrets", "credential", "credentials",
  "openapi", "swagger", "proto", "graphql"
]);
const MANIFESTS = new Set([
  "package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock",
  "pyproject.toml", "requirements.txt", "go.mod", "go.sum",
  "cargo.toml", "cargo.lock", "dockerfile", "docker-compose.yml", "docker-compose.yaml"
]);

function usage() {
  console.log("Usage: node scripts/devflow-smallfix.js --check --verify \"<command>\" [--root <dir>] [--declared-files <n>] [--declared-lines <n>] [--audit] [--json]");
  console.log("  --check            count the actual git diff and decide narrow vs promote");
  console.log("  --verify           command the checker runs itself; its exit code is the narrow proof");
  console.log("  --declared-files   optional pre-edit declaration; exceeding it promotes");
  console.log("  --declared-lines   optional pre-edit declaration; exceeding it promotes");
  console.log("  --audit            force PROMOTE so this Small-fix gets standard proof");
  console.log("  --self-test        run reverse tests for oversized/protected/manifest/verify cases");
}

function git(root, args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  if (result.error) return { ok: false, output: result.error.message, status: null };
  return {
    ok: result.status === 0,
    status: result.status,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim()
  };
}

function isGitRepo(root) {
  const result = git(root, ["rev-parse", "--is-inside-work-tree"]);
  return result.ok && result.output === "true";
}

function hasHead(root) {
  return git(root, ["rev-parse", "--verify", "HEAD"]).ok;
}

function readPolicy(root) {
  const file = path.join(root, ".devflow", "smallfix.json");
  if (!fs.existsSync(file)) {
    return { maxFiles: DEFAULT_MAX_FILES, maxLines: DEFAULT_MAX_LINES, protected: [] };
  }
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return {
      maxFiles: Number.isInteger(data.maxFiles) && data.maxFiles > 0 ? data.maxFiles : DEFAULT_MAX_FILES,
      maxLines: Number.isInteger(data.maxLines) && data.maxLines > 0 ? data.maxLines : DEFAULT_MAX_LINES,
      protected: Array.isArray(data.protected) ? data.protected.filter((item) => typeof item === "string" && item.trim()) : []
    };
  } catch {
    return { error: "invalid .devflow/smallfix.json; fix it or remove it" };
  }
}

function normalize(rel) {
  return rel.replaceAll("\\", "/").toLowerCase();
}

/** Splits path segments so `author.ts` does not match `auth`, but `auth/login.ts` does. */
function protectedByPolicy(rel, policy) {
  const lower = normalize(rel);
  const base = path.posix.basename(lower);
  // Hard protections cannot be weakened by editing the project policy.
  if (lower.startsWith(".devflow/")) return "devflow-policy";
  if (base === "agents.md" || base === "claude.md" || base === "rule-health.md") return "process-contract";
  if (lower.startsWith("skills/") || lower.startsWith("commands/") || lower.startsWith("hooks/") || lower.startsWith("plugins/") || lower.startsWith("dsh/")) return "devflow-runtime";
  if (lower.startsWith("scripts/devflow-")) return "devflow-checker";
  for (const extra of policy.protected) {
    if (lower.includes(extra.toLowerCase())) return extra;
  }
  if (MANIFESTS.has(base)) return `manifest:${base}`;
  if (lower.includes(".env") || lower.includes(".github/workflows/") || lower.includes("/secrets/") || lower.startsWith("secrets/")) {
    return "secret-or-ci";
  }
  const tokens = lower.split(/[/._-]+/).filter(Boolean);
  for (const token of tokens) {
    if (PROTECTED_TOKENS.has(token)) return token;
  }
  return null;
}

function countLines(file) {
  const body = fs.readFileSync(file);
  if (body.includes(0)) return { binary: true, lines: 0 };
  if (body.length === 0) return { binary: false, lines: 0 };
  let lines = 0;
  for (const byte of body) if (byte === 10) lines += 1;
  if (body[body.length - 1] !== 10) lines += 1;
  return { binary: false, lines };
}

function analyze(root, policy) {
  if (!isGitRepo(root)) return { reasons: ["not-a-git-repo"], files: [], lines: 0, fingerprint: null };
  if (!hasHead(root)) return { reasons: ["no-baseline-commit"], files: [], lines: 0, fingerprint: null };

  const names = git(root, ["diff", "HEAD", "--name-status", "--no-renames"]);
  if (!names.ok) return { reasons: ["git-diff-failed"], files: [], lines: 0, fingerprint: null };
  const stats = git(root, ["diff", "HEAD", "--numstat", "--no-renames"]);
  if (!stats.ok) return { reasons: ["git-diff-failed"], files: [], lines: 0, fingerprint: null };

  const changed = new Map();
  for (const line of names.output.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [code, rel] = line.split("\t");
    if (rel) changed.set(rel, code[0]);
  }

  const reasons = [];
  let lines = 0;
  for (const line of stats.output.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [added, deleted, rel] = line.split("\t");
    if (!rel) continue;
    if (added === "-" || deleted === "-") reasons.push(`binary-file:${rel}`);
    else lines += Number(added) + Number(deleted);
  }

  const untracked = git(root, ["ls-files", "--others", "--exclude-standard"]);
  const untrackedFiles = untracked.ok ? untracked.output.split(/\r?\n/).filter(Boolean) : [];
  for (const rel of untrackedFiles) {
    changed.set(rel, "?");
    try {
      const full = path.join(root, rel);
      if (fs.statSync(full).size > 200 * 1024) reasons.push(`large-file:${rel}`);
      const count = countLines(full);
      if (count.binary) reasons.push(`binary-file:${rel}`);
      else lines += count.lines;
    } catch {
      reasons.push(`unreadable-file:${rel}`);
    }
  }

  for (const [rel, code] of changed) {
    if (code === "D") reasons.push(`deleted-file:${rel}`);
    if (code === "R") reasons.push(`renamed-file:${rel}`);
    const hit = protectedByPolicy(rel, policy);
    if (hit) reasons.push(`protected-path:${rel} (${hit})`);
  }

  const files = [...changed.keys()];
  if (files.length === 0) reasons.push("no-diff");
  if (files.length > policy.maxFiles) reasons.push(`too-many-files:${files.length}>${policy.maxFiles}`);
  if (lines > policy.maxLines) reasons.push(`too-many-lines:${lines}>${policy.maxLines}`);

  // A verify command that rewrites tracked files must not launder the diff.
  const hash = createHash("sha1");
  hash.update(git(root, ["diff", "HEAD"]).output);
  for (const rel of untrackedFiles) {
    hash.update(rel);
    try {
      hash.update(fs.readFileSync(path.join(root, rel)));
    } catch {}
  }

  return { reasons: [...new Set(reasons)], files, lines, fingerprint: hash.digest("hex") };
}

function runVerify(root, command) {
  if (!command) return { ok: false, reason: "missing-verification", output: "" };
  const isWindows = process.platform === "win32";
  const shell = isWindows ? process.env.ComSpec || "cmd.exe" : "bash";
  const args = isWindows ? ["/d", "/s", "/c", command] : ["-lc", command];
  const result = spawnSync(shell, args, {
    cwd: root,
    encoding: "utf8",
    timeout: 10 * 60 * 1000,
    maxBuffer: 10 * 1024 * 1024
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  if (result.error) return { ok: false, reason: `verification-error:${result.error.message}`, output };
  if (result.status !== 0) return { ok: false, reason: `verification-failed:exit:${result.status}`, output };
  return { ok: true, reason: "verification-passed", output };
}

function check(root, options = {}) {
  const policy = readPolicy(root);
  if (policy.error) return { judgment: "PROMOTE", reasons: [policy.error], files: [], lines: 0, verify: null };
  if (options.audit) return { judgment: "PROMOTE", reasons: ["audit-required"], files: [], lines: 0, verify: null };

  const first = analyze(root, policy);
  if (first.reasons.length > 0) {
    return { judgment: "PROMOTE", reasons: first.reasons, files: first.files, lines: first.lines, verify: null };
  }
  if (options.declaredFiles && first.files.length > options.declaredFiles) {
    return { judgment: "PROMOTE", reasons: [`exceeds-declared-files:${first.files.length}>${options.declaredFiles}`], files: first.files, lines: first.lines, verify: null };
  }
  if (options.declaredLines && first.lines > options.declaredLines) {
    return { judgment: "PROMOTE", reasons: [`exceeds-declared-lines:${first.lines}>${options.declaredLines}`], files: first.files, lines: first.lines, verify: null };
  }

  const verify = runVerify(root, options.verify);
  if (!verify.ok) {
    return { judgment: "PROMOTE", reasons: [verify.reason], files: first.files, lines: first.lines, verify };
  }

  const second = analyze(root, policy);
  if (second.reasons.length > 0 || second.fingerprint !== first.fingerprint) {
    return {
      judgment: "PROMOTE",
      reasons: ["verification-mutated-worktree", ...second.reasons],
      files: second.files,
      lines: second.lines,
      verify
    };
  }

  return {
    judgment: "NARROW_OK",
    reasons: [],
    files: first.files,
    lines: first.lines,
    verify,
    declared: {
      files: options.declaredFiles || null,
      lines: options.declaredLines || null
    }
  };
}

function report(result, json) {
  if (json) {
    console.log(JSON.stringify(result));
    return;
  }
  if (result.judgment === "NARROW_OK") {
    const declared = result.declared?.files || result.declared?.lines
      ? ` declared=${result.declared.files ?? "?"}/${result.declared.lines ?? "?"}`
      : "";
    console.log(`NARROW_OK files=${result.files.length} lines=${result.lines} protected=none verify=exit:0${declared}`);
    return;
  }
  const brief = (items, limit) => {
    const shown = items.slice(0, limit);
    const rest = items.length - shown.length;
    return `${shown.join("; ")}${rest > 0 ? `; +${rest} more` : ""}`;
  };
  console.log(`PROMOTE reason=${brief(result.reasons, 6)}`);
  if (result.files && result.files.length > 0) console.log(`changed=${brief(result.files, 8).replaceAll("; ", ", ")}`);
  if (result.verify?.output) {
    const tail = result.verify.output.split(/\r?\n/).slice(-6).join(" | ");
    if (tail) console.log(`verify: ${tail}`);
  }
  console.log("next: Design-lite or Build with standard/full proof");
}

function run(root, args) {
  const repo = path.resolve(root);
  const result = check(repo, {
    verify: args.verify,
    declaredFiles: args.declaredFiles,
    declaredLines: args.declaredLines,
    audit: args.audit
  });
  report(result, args.json);
  return result.judgment === "NARROW_OK" ? 0 : 1;
}

function writeRepoFile(root, rel, body) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, body, "utf8");
}

function makeRepo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-smallfix-"));
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "devflow@example.test"]);
  git(root, ["config", "user.name", "DevFlow Test"]);
  for (const [rel, body] of Object.entries(files)) writeRepoFile(root, rel, body);
  git(root, ["add", "."]);
  git(root, ["commit", "-q", "-m", "baseline"]);
  return root;
}

function expect(result, judgment, reasonPart) {
  if (result.judgment !== judgment) {
    throw new Error(`expected ${judgment}, got ${result.judgment}: ${result.reasons.join("; ")}`);
  }
  if (reasonPart && !result.reasons.some((reason) => reason.includes(reasonPart))) {
    throw new Error(`expected reason containing ${reasonPart}, got ${result.reasons.join("; ")}`);
  }
}

function selfTest() {
  const baseFiles = { "src/app.js": "module.exports = 1;\n", "README.md": "# demo\n" };
  const roots = [];
  const make = (files = baseFiles) => {
    const root = makeRepo(files);
    roots.push(root);
    return root;
  };
  try {
    const small = make();
    writeRepoFile(small, "src/app.js", "module.exports = 1;\nmodule.exports = 2;\nmodule.exports = 3;\nmodule.exports = 4;\nmodule.exports = 5;\nmodule.exports = 6;\n");
    expect(check(small, { verify: "node -e 0" }), "NARROW_OK");

    const declared = make();
    writeRepoFile(declared, "src/app.js", "module.exports = 1;\nmodule.exports = 2;\nmodule.exports = 3;\n");
    expect(check(declared, { verify: "node -e 0", declaredFiles: 1, declaredLines: 1 }), "PROMOTE", "exceeds-declared-lines");

    const big = make();
    writeRepoFile(big, "src/app.js", `module.exports = 1;\n${"// line\n".repeat(30)}`);
    expect(check(big, { verify: "node -e 0" }), "PROMOTE", "too-many-lines");

    const many = make();
    writeRepoFile(many, "src/a.js", "a\n");
    writeRepoFile(many, "src/b.js", "b\n");
    writeRepoFile(many, "src/c.js", "c\n");
    expect(check(many, { verify: "node -e 0" }), "PROMOTE", "too-many-files");

    const protectedRepo = make({ ...baseFiles, "auth/login.js": "module.exports = true;\n" });
    writeRepoFile(protectedRepo, "auth/login.js", "module.exports = false;\n");
    expect(check(protectedRepo, { verify: "node -e 0" }), "PROMOTE", "protected-path");

    const manifest = make();
    writeRepoFile(manifest, "package.json", JSON.stringify({ name: "demo", version: "1.0.1" }, null, 2));
    expect(check(manifest, { verify: "node -e 0" }), "PROMOTE", "protected-path");

    const deleted = make();
    fs.unlinkSync(path.join(deleted, "README.md"));
    expect(check(deleted, { verify: "node -e 0" }), "PROMOTE", "deleted-file");

    const failed = make();
    writeRepoFile(failed, "src/app.js", "module.exports = 2;\n");
    expect(check(failed, { verify: "node -e \"process.exit(1)\"" }), "PROMOTE", "verification-failed");

    const audit = make();
    writeRepoFile(audit, "src/app.js", "module.exports = 2;\n");
    expect(check(audit, { verify: "node -e 0", audit: true }), "PROMOTE", "audit-required");

    const untracked = make();
    writeRepoFile(untracked, "src/new.js", "module.exports = 3;\n");
    expect(check(untracked, { verify: "node -e 0" }), "NARROW_OK");

    const policy = make({ ...baseFiles, ".devflow/smallfix.json": JSON.stringify({ protected: ["src/"] }) });
    writeRepoFile(policy, "src/app.js", "module.exports = 2;\n");
    expect(check(policy, { verify: "node -e 0" }), "PROMOTE", "protected-path");

    const policyTamper = make({ ...baseFiles, ".devflow/smallfix.json": JSON.stringify({ protected: [] }) });
    writeRepoFile(policyTamper, ".devflow/smallfix.json", JSON.stringify({ protected: [], maxFiles: 99, maxLines: 999 }));
    expect(check(policyTamper, { verify: "node -e 0" }), "PROMOTE", "protected-path");

    const runtime = make({ ...baseFiles, "skills/devflow-core/SKILL.md": "# core\n" });
    writeRepoFile(runtime, "skills/devflow-core/SKILL.md", "# core changed\n");
    expect(check(runtime, { verify: "node -e 0" }), "PROMOTE", "protected-path");

    const checker = make({ ...baseFiles, "scripts/devflow-smallfix.js": "// checker\n" });
    writeRepoFile(checker, "scripts/devflow-smallfix.js", "// weakened checker\n");
    expect(check(checker, { verify: "node -e 0" }), "PROMOTE", "protected-path");

    const noGit = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-smallfix-nogit-"));
    roots.push(noGit);
    expect(check(noGit, { verify: "node -e 0" }), "PROMOTE", "not-a-git-repo");

    console.log("DevFlow small-fix self-test passed");
    console.log("Checked narrow, declared budget, oversized lines, too many files, protected path, manifest, deletion, failed verification, audit, untracked file, project policy, policy tamper, runtime file, checker tamper, and non-git cases");
  } finally {
    for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    usage();
    return 0;
  }
  if (args.includes("--self-test")) {
    selfTest();
    return 0;
  }
  if (!args.includes("--check")) {
    usage();
    return 2;
  }
  const value = (name) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const rootIndex = args.indexOf("--root");
  const root = path.resolve(rootIndex >= 0 && args[rootIndex + 1] ? args[rootIndex + 1] : process.cwd());
  const declaredFiles = Number(value("--declared-files"));
  const declaredLines = Number(value("--declared-lines"));
  return run(root, {
    verify: value("--verify"),
    declaredFiles: Number.isInteger(declaredFiles) && declaredFiles > 0 ? declaredFiles : null,
    declaredLines: Number.isInteger(declaredLines) && declaredLines > 0 ? declaredLines : null,
    audit: args.includes("--audit"),
    json: args.includes("--json")
  });
}

process.exitCode = main();
