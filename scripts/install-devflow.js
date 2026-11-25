const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");

const root = path.resolve(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
// 安装 manifest：记录上游包名、版本与每个运行时文件的 sha256，供 --check 检测上游升级。
const manifestRel = ".devflow-manifest.json";

const runtimeEntries = [
  "AGENTS.md",
  "CLAUDE.md",
  ".github/copilot-instructions.md",
  ".github/instructions/devflow.instructions.md",
  ".github/prompts/devflow.prompt.md",
  ".codebuddy/rules/devflow-core/RULE.mdc",
  ".claude/settings.json",
  ".claude/commands/devflow-core.md",
  "hooks/hooks.json",
  "hooks/devflow-session-start.js",
  "commands/devflow.toml",
  "commands/devflow-spec.toml",
  "commands/devflow-plan.toml",
  "commands/devflow-review.toml",
  "commands/devflow-debt.toml",
  "commands/devflow-prove.toml",
  "commands/devflow-pua.toml",
  "commands/devflow-learn.toml",
  "commands/devflow-adversarial.toml",
  "commands/devflow-find-fault.toml",
  "commands/devflow-audit.toml",
  "commands/devflow-grill.toml",
  "commands/devflow-simplify.toml",
  "scripts/devflow-debt.js",
  "scripts/devflow-review.js",
  "scripts/devflow-spec.js",
  "scripts/devflow-plan.js",
  "scripts/devflow-audit.js",
  "scripts/devflow-docs.js",
  "scripts/devflow-smallfix.js",
  "scripts/devflow-skills.js",
  "skills/devflow-core/SKILL.md",
  "skills/devflow-core/references/core-methods.md",
  "skills/devflow-core/references/depth-ledger.md",
  "skills/devflow-core/references/skill-guide.md",
  "skills/devflow-cut/references/cut-methods.md",
  "skills/devflow-spec/references/spec-plan-methods.md",
  "skills/devflow-build/references/build-methods.md",
  "skills/devflow-prove/references/proof-recovery-methods.md",
  "skills/devflow-prove/references/code-review-checklist.md",
  "skills/devflow-prove/references/simplify-pass.md",
  "skills/devflow-prove/references/prose-quality-checklist.md",
  "skills/devflow-prove/references/code-readability-checklist.md",
  "skills/devflow-prove/references/ui-slop-checklist.md",
  "skills/devflow-brainstorm/SKILL.md",
  "skills/devflow-spec/SKILL.md",
  "skills/devflow-plan/SKILL.md",
  "skills/devflow-plan/references/plan-methods.md",
  "skills/devflow-cut/SKILL.md",
  "skills/devflow-cut/references/native-capability-checklist.md",
  "skills/devflow-build/SKILL.md",
  "skills/devflow-prove/SKILL.md",
  "skills/devflow-prove/references/flow-self-test.md",
  "skills/devflow-pua/SKILL.md",
  "skills/devflow-pua/references/methodology-router.md",
  "skills/devflow-pua/references/methodology-library.md",
    "skills/devflow-pua/references/flavor-display.md",
    "skills/devflow-learn/SKILL.md",
    "skills/devflow-docs-followup/SKILL.md",
    "skills/devflow-docs-followup/agents/openai.yaml",
    "skills/devflow-adversarial/SKILL.md",
    "skills/devflow-find-fault/SKILL.md",
    "skills/devflow-project-knowledge/SKILL.md",
    "skills/devflow-project-knowledge/references/auto-loop.md",
    "skills/devflow-audit/SKILL.md",
    "skills/devflow-audit/references/full-quality-audit.md",
  "skills/devflow-brainstorm/references/interview-discipline.md",
  "skills/skill-call-diagram.md"
];

// Skills install under `.agents/skills/` so skill-scanning hosts discover them in the target project.
// The source tree keeps `skills/` because plugin metadata, DSH assets, and the validators read it there.
const skillsPrefix = "skills/";
const installedSkillsPrefix = ".agents/skills/";

/** Maps a source-relative runtime entry to the path the installer writes in a target project. */
function destRel(rel) {
  return rel.startsWith(skillsPrefix) ? `${installedSkillsPrefix}${rel.slice(skillsPrefix.length)}` : rel;
}

/** Reports shipped skill files an older installer left under `<target>/skills/`; it never deletes them. */
function staleSkills(targetRoot) {
  return runtimeEntries
    .filter((rel) => rel.startsWith(skillsPrefix))
    .map((rel) => rel.slice(skillsPrefix.length))
    .filter((rest) => fs.existsSync(path.join(targetRoot, "skills", rest)))
    .map((rest) => `skills/${rest}`);
}

/**
 * Removes legacy `<target>/skills/` copies when they are provably package copies: identical to the
 * installed file, or matching the hash the previous manifest recorded. Line endings are normalised
 * first, because a CRLF checkout still represents the LF package copy. Anything else stays for review.
 */
function migrateLegacySkills(targetRoot, previousManifest) {
  const legacyRoot = path.join(targetRoot, "skills");
  const normalize = (body) => body.toString("utf8").replace(/\r\n/g, "\n");
  const migrated = [];
  const kept = [];
  const shippedDirs = new Set();

  for (const rel of runtimeEntries) {
    if (!rel.startsWith(skillsPrefix)) continue;
    const rest = rel.slice(skillsPrefix.length);
    const legacy = path.join(legacyRoot, rest);
    const installed = path.join(targetRoot, installedSkillsPrefix, rest);
    shippedDirs.add(path.dirname(legacy));
    if (!fs.existsSync(legacy)) continue;
    const legacyBody = normalize(fs.readFileSync(legacy));
    const installedMatches = fs.existsSync(installed) && normalize(fs.readFileSync(installed)) === legacyBody;
    const previousHash =
      previousManifest?.files?.[`skills/${rest}`] || previousManifest?.files?.[`${installedSkillsPrefix}${rest}`];
    const hashMatches = previousHash === createHash("sha256").update(legacyBody).digest("hex");
    if (installedMatches || hashMatches) {
      fs.rmSync(legacy);
      migrated.push(`skills/${rest}`);
    } else {
      kept.push(`skills/${rest}`);
    }
  }

  // Prune only empty directories inside the shipped skill trees, deepest first.
  for (const dir of [...shippedDirs].sort((a, b) => b.length - a.length)) {
    let current = dir;
    while (current.startsWith(legacyRoot) && current !== legacyRoot) {
      if (!fs.existsSync(current) || fs.readdirSync(current).length > 0) break;
      fs.rmdirSync(current);
      current = path.dirname(current);
    }
  }
  if (fs.existsSync(legacyRoot) && fs.readdirSync(legacyRoot).length === 0) fs.rmdirSync(legacyRoot);

  return { migrated, kept };
}

const args = process.argv.slice(2);
const migrate = args.includes("--migrate");
const write = args.includes("--write") || migrate;
const force = args.includes("--force");
const check = args.includes("--check");
const targetArg = args.find(
  (arg) => arg !== "--write" && arg !== "--dry-run" && arg !== "--force" && arg !== "--check" && arg !== "--migrate"
);
const claudeSettingsRel = ".claude/settings.json";

function usage() {
  console.log("Usage: npm run install:target -- <target-project> [--write] [--force] [--check] [--migrate]");
  console.log("Default mode is dry-run. Add --write to copy files.");
  console.log("Existing files are skipped unless --force is passed.");
  console.log("Skills install to .agents/skills/; --check also reports stale legacy skills/ files.");
  console.log("Add --migrate to install missing files and remove legacy skills/ copies that match this package byte-for-byte.");
  console.log("--migrate implies --write; it stops without deleting when an installed file is missing or differs (review, then use --force).");
  console.log("A legacy file with different bytes stays and is listed for review.");
  console.log("Add --check to verify the target runtime files match this package.");
  console.log("Write mode records .devflow-manifest.json (version + sha256); --check reports upstream version changes.");
}

function readJsonFile(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** Reads the target manifest before an upgrade overwrites it; a missing or broken file counts as absent. */
function readManifest(targetRoot) {
  const file = path.join(targetRoot, manifestRel);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function devflowSessionStartEntries() {
  const sourceSettings = readJsonFile(path.join(root, claudeSettingsRel));
  return sourceSettings.hooks?.SessionStart || [];
}

function hasDevflowSessionStart(settings) {
  return JSON.stringify(settings.hooks?.SessionStart || []).includes("node hooks/devflow-session-start.js");
}

function mergeClaudeSettings(target) {
  const settings = fs.existsSync(target) ? readJsonFile(target) : {};
  const entries = devflowSessionStartEntries();

  settings.hooks = settings.hooks || {};
  settings.hooks.SessionStart = settings.hooks.SessionStart || [];

  if (hasDevflowSessionStart(settings)) {
    return "ok existing";
  }

  settings.hooks.SessionStart.push(...entries);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  return "merged existing";
}

function copyFile(rel, targetRoot) {
  const dest = destRel(rel);
  const source = path.join(root, rel);
  const target = path.join(targetRoot, dest);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing source file: ${rel}`);
  }

  const exists = fs.existsSync(target);

  if (!write) {
    if (rel === claudeSettingsRel && exists && !force) {
      return { rel: dest, action: "would merge" };
    }
    if (exists && force) {
      return { rel: dest, action: "would overwrite" };
    }
    return { rel: dest, action: exists ? "would skip" : "would create" };
  }

  if (rel === claudeSettingsRel && exists && !force) {
    return { rel: dest, action: mergeClaudeSettings(target) };
  }

  if (exists && !force) {
    return { rel: dest, action: "skipped existing" };
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return { rel: dest, action: exists ? "overwrote" : "created" };
}

function checkFile(rel, targetRoot) {
  const dest = destRel(rel);
  const source = path.join(root, rel);
  const target = path.join(targetRoot, dest);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing source file: ${rel}`);
  }

  if (!fs.existsSync(target)) {
    return { rel: dest, action: "missing" };
  }

  if (rel === claudeSettingsRel) {
    try {
      const targetSettings = readJsonFile(target);
      return { rel: dest, action: hasDevflowSessionStart(targetSettings) ? "ok" : "changed" };
    } catch {
      return { rel: dest, action: "changed" };
    }
  }

  const sourceBody = fs.readFileSync(source);
  const targetBody = fs.readFileSync(target);
  return { rel: dest, action: Buffer.compare(sourceBody, targetBody) === 0 ? "ok" : "changed" };
}

if (!targetArg) {
  usage();
  process.exit(1);
}

if (check && write) {
  throw new Error("--check cannot be combined with --write or --migrate");
}

const targetRoot = path.resolve(process.cwd(), targetArg);
if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
  throw new Error(`Target project directory does not exist: ${targetRoot}`);
}

if (check) {
  const results = runtimeEntries.map((rel) => checkFile(rel, targetRoot));
  const missing = results.filter((result) => result.action === "missing");
  const changed = results.filter((result) => result.action === "changed");
  const stale = staleSkills(targetRoot);

  // 上游版本差检测：manifest 缺失的旧安装视为兼容不失败；版本不一致时给出升级路径并计入失败。
  let versionChanged = false;
  const manifestPath = path.join(targetRoot, manifestRel);
  if (fs.existsSync(manifestPath)) {
    try {
      const installed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      if (installed.version !== packageJson.version) {
        versionChanged = true;
        console.log(
          `Upstream version changed: installed ${installed.version}, current ${packageJson.version}. Re-run install:target --write --force to upgrade.`
        );
      }
    } catch {
      // 损坏的 manifest 不阻断 check；字节比较仍覆盖文件级漂移。
    }
  }

  console.log(`DevFlow install check: ${targetRoot}`);
  for (const result of results) {
    console.log(`${result.action}: ${result.rel}`);
  }
  for (const rel of stale) {
    console.log(`stale: ${rel}`);
  }
  console.log(`Total files: ${results.length}`);

  if (missing.length > 0 || changed.length > 0 || stale.length > 0 || versionChanged) {
    if (stale.length > 0) {
      console.log(
        `Stale legacy skills/: ${stale.length} file(s) were installed under skills/ by an older version; nothing reads them now. Re-run with --write --force to upgrade, then --migrate to remove byte-identical copies.`
      );
    }
    console.log(
      `Check failed: ${missing.length} missing, ${changed.length} changed${stale.length > 0 ? `, ${stale.length} stale legacy` : ""}${versionChanged ? ", upstream version changed" : ""}`
    );
    process.exit(1);
  }

  console.log("Check passed: installed runtime matches this package.");
  process.exit(0);
}

const previousManifest = readManifest(targetRoot);
const results = runtimeEntries.map((rel) => copyFile(rel, targetRoot));

// 安装 manifest：仅 write 模式写入，记录上游版本与目标路径哈希供后续 --check 使用。
if (write) {
  const manifest = {
    package: packageJson.name,
    version: packageJson.version,
    files: Object.fromEntries(
      runtimeEntries.map((rel) => [destRel(rel), createHash("sha256").update(fs.readFileSync(path.join(root, rel))).digest("hex")])
    )
  };
  fs.writeFileSync(path.join(targetRoot, manifestRel), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

const staleBefore = migrate ? staleSkills(targetRoot) : [];
const migrationCheck =
  staleBefore.length > 0 ? runtimeEntries.map((rel) => checkFile(rel, targetRoot)).filter((result) => result.action !== "ok") : [];
const migration =
  !migrate ? null : staleBefore.length > 0 && migrationCheck.length > 0 ? null : migrateLegacySkills(targetRoot, previousManifest);
const stale = staleSkills(targetRoot);

console.log(`DevFlow install ${write ? "write" : "dry-run"}: ${targetRoot}`);
for (const result of results) {
  console.log(`${result.action}: ${result.rel}`);
}
for (const rel of stale) {
  console.log(`stale: ${rel}`);
}
console.log(`Total files: ${results.length}`);

if (staleBefore.length > 0 && migrationCheck.length > 0) {
  console.log(
    `Migration skipped: ${migrationCheck.length} installed file(s) are missing or differ. Review them, then re-run with --write --force --migrate.`
  );
  for (const result of migrationCheck.slice(0, 10)) {
    console.log(`${result.action}: ${result.rel}`);
  }
}

if (migration) {
  console.log(`Migrated legacy skills/: ${migration.migrated.length} removed, ${migration.kept.length} kept.`);
  for (const rel of migration.kept) {
    console.log(`kept legacy (differs): ${rel}`);
  }
}

const skippedExisting = results.some((result) => result.action === "skipped existing");

if (stale.length > 0) {
  if (staleBefore.length > 0 && !migration) {
    console.log(`Stale legacy skills/: ${stale.length} file(s) kept because ${installedSkillsPrefix} is not fully in sync.`);
  } else if (migration) {
    console.log(`Stale legacy skills/: ${stale.length} file(s) kept because their bytes differ from ${installedSkillsPrefix}; review then delete them manually.`);
  } else {
    console.log(`Stale legacy skills/: ${stale.length} file(s) remain under skills/ from an older install; run --migrate to remove byte-identical copies.`);
  }
}

if (staleBefore.length > 0 && migrationCheck.length > 0) {
  process.exitCode = 1;
} else if (!write) {
  console.log("No files were changed. Re-run with --write to install.");
} else if (!force && skippedExisting) {
  console.log("Existing files were skipped. Re-run with --write --force to overwrite.");
}
