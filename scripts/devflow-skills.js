#!/usr/bin/env node
"use strict";

// DevFlow skill-layout checker that ships with the project runtime.
// Verifies project skills live under `.agents/skills/`, reports legacy `<project>/skills/`
// copies, and can remove them. No dependency on the DevFlow-Core package: other users run it
// inside their own project from `scripts/devflow-skills.js`.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createHash } = require("node:crypto");

const SKILLS = ".agents/skills";
const LEGACY = "skills";
const MANIFEST = ".devflow-manifest.json";

const normalize = (body) => body.toString("utf8").replace(/\r\n/g, "\n");
const hashOf = (body) => createHash("sha256").update(normalize(body)).digest("hex");

function readManifest(root) {
  const file = path.join(root, MANIFEST);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function walk(root, relDir) {
  const dir = path.join(root, SKILLS, relDir);
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const child = `${relDir}/${entry.name}`;
    return entry.isDirectory() ? walk(root, child) : [child];
  });
}

/** Expected skill files: the manifest's own list, else a scan of what is currently installed. */
function expectedSkills(root, manifest) {
  const keys = Object.keys(manifest?.files || {});
  const fromManifest = keys.filter((key) => key.startsWith(`${SKILLS}/`)).map((key) => key.slice(SKILLS.length + 1));
  if (fromManifest.length > 0) return fromManifest;
  const dir = path.join(root, SKILLS);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return entry.name.startsWith("devflow-") ? walk(root, entry.name) : [];
    return entry.name === "skill-call-diagram.md" ? [entry.name] : [];
  });
}

/** Legacy candidates: shipped paths under `skills/`, or the pre-0.9.0 manifest's own `skills/...` keys. */
function legacySkills(root, manifest, expected) {
  const keys = Object.keys(manifest?.files || {});
  const fromManifest = keys.filter((key) => key.startsWith(`${LEGACY}/`));
  const candidates = fromManifest.length > 0 ? fromManifest : expected.map((rel) => `${LEGACY}/${rel}`);
  return candidates.filter((rel) => fs.existsSync(path.join(root, rel)));
}

function inspect(root, manifest) {
  const expected = expectedSkills(root, manifest);
  const missing = expected.filter((rel) => !fs.existsSync(path.join(root, SKILLS, rel)));
  const legacy = legacySkills(root, manifest, expected);
  const agentsPath = path.join(root, "AGENTS.md");
  const agentsRoot = fs.existsSync(agentsPath) && fs.readFileSync(agentsPath, "utf8").includes(SKILLS);
  const core = fs.existsSync(path.join(root, SKILLS, "devflow-core", "SKILL.md"));
  const layout = core ? "installed" : legacy.length > 0 ? "legacy" : "absent";
  return { expected, missing, legacy, agentsRoot, core, layout };
}

function prune(root, rel) {
  const skillsRoot = path.join(root, LEGACY);
  let dir = path.dirname(path.join(root, rel));
  while (dir !== skillsRoot && dir.startsWith(`${skillsRoot}${path.sep}`)) {
    if (!fs.existsSync(dir) || fs.readdirSync(dir).length > 0) break;
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
  if (fs.existsSync(skillsRoot) && fs.readdirSync(skillsRoot).length === 0) fs.rmdirSync(skillsRoot);
}

function migrateLegacy(root, manifest, state, force) {
  if (!state.core) {
    return { refused: `${SKILLS}/devflow-core/SKILL.md is missing; upgrade the runtime first, then re-run --migrate.` };
  }
  if (state.missing.length > 0) {
    return { refused: `${state.missing.length} installed file(s) are missing; upgrade the runtime first.` };
  }
  const migrated = [];
  const kept = [];
  for (const rel of state.legacy) {
    const rest = rel.slice(LEGACY.length + 1);
    const installed = path.join(root, SKILLS, rest);
    let removable = force;
    if (!removable && fs.existsSync(installed)) {
      removable = normalize(fs.readFileSync(path.join(root, rel))) === normalize(fs.readFileSync(installed));
    }
    if (!removable) {
      const recorded = manifest?.files?.[rel] || manifest?.files?.[`${SKILLS}/${rest}`];
      if (recorded && recorded === hashOf(fs.readFileSync(path.join(root, rel)))) removable = true;
    }
    if (removable) {
      fs.rmSync(path.join(root, rel));
      prune(root, rel);
      migrated.push(rel);
    } else {
      kept.push(rel);
    }
  }
  return { migrated, kept };
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-skills-"));
  const write = (rel, body) => {
    const file = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body, "utf8");
  };
  const install = (body) => {
    write(`${SKILLS}/devflow-core/SKILL.md`, body);
    write("AGENTS.md", `# Test\n\nLoad \`${SKILLS}/devflow-core/SKILL.md\`.\n`);
    write(MANIFEST, `${JSON.stringify({ version: "test", files: { [`${SKILLS}/devflow-core/SKILL.md`]: hashOf(body) } })}\n`);
  };
  try {
    install("core\n");
    let manifest = readManifest(tmp);
    let state = inspect(tmp, manifest);
    if (!state.core || state.missing.length || state.legacy.length || !state.agentsRoot) {
      throw new Error("clean fixture must pass");
    }

    write(`${LEGACY}/devflow-core/SKILL.md`, "core\n");
    state = inspect(tmp, manifest);
    if (state.legacy.length !== 1) throw new Error("legacy copy must be detected");
    let result = migrateLegacy(tmp, manifest, state, false);
    if (result.migrated.length !== 1 || result.kept.length !== 0) throw new Error("identical legacy copy must be removed");
    if (fs.existsSync(path.join(tmp, LEGACY))) throw new Error("empty legacy directory must be pruned");

    write(`${LEGACY}/devflow-core/SKILL.md`, "local edit\n");
    state = inspect(tmp, manifest);
    result = migrateLegacy(tmp, manifest, state, false);
    if (result.kept.length !== 1) throw new Error("differing legacy copy must be kept without --force");
    result = migrateLegacy(tmp, manifest, state, true);
    if (result.migrated.length !== 1 || fs.existsSync(path.join(tmp, LEGACY))) throw new Error("--force must remove the kept copy");

    install("core\n");
    fs.rmSync(path.join(tmp, SKILLS), { recursive: true, force: true });
    write(`${LEGACY}/devflow-core/SKILL.md`, "core\n");
    manifest = readManifest(tmp);
    state = inspect(tmp, manifest);
    result = migrateLegacy(tmp, manifest, state, true);
    if (!result.refused) throw new Error("migration must refuse when the installed tree is missing");

    console.log("DevFlow skills self-test passed");
    return 0;
  } catch (error) {
    console.error(error.message);
    return 1;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node scripts/devflow-skills.js [--root <project>] [--migrate [--force]] [--json] [--self-test]");
    console.log("Default mode checks that project skills live under .agents/skills/ and reports legacy skills/ copies.");
    console.log("--migrate removes legacy copies that match the installed file or the recorded manifest hash.");
    console.log("--migrate --force removes every shipped legacy copy after you review the kept list.");
    console.log("Exit codes: 0 clean, 1 problems remain or migration refused.");
    return 0;
  }
  if (args.includes("--self-test")) return selfTest();

  const rootIndex = args.indexOf("--root");
  if (rootIndex >= 0 && !args[rootIndex + 1]) {
    console.error("--root requires a project path");
    return 1;
  }
  const root = path.resolve(rootIndex >= 0 ? args[rootIndex + 1] : process.cwd());
  const json = args.includes("--json");
  const migrate = args.includes("--migrate");
  const force = args.includes("--force");

  const manifest = readManifest(root);
  const state = inspect(root, manifest);
  const result = migrate ? migrateLegacy(root, manifest, state, force) : null;
  const remaining = result ? legacySkills(root, manifest, state.expected) : state.legacy;
  const ok = !result?.refused && state.missing.length === 0 && remaining.length === 0 && state.agentsRoot;

  if (json) {
    console.log(
      JSON.stringify({
        ok,
        root,
        layout: state.layout,
        agentsRoot: state.agentsRoot,
        missing: state.missing,
        legacy: remaining,
        migrated: result?.migrated || [],
        kept: result?.kept || [],
        refused: result?.refused || null
      })
    );
    return ok ? 0 : 1;
  }

  console.log(`DevFlow skills: ${root}`);
  console.log(`layout: ${state.layout}`);
  console.log(`missing: ${state.missing.length}`);
  for (const rel of state.missing) console.log(`  ${SKILLS}/${rel}`);
  if (result?.refused) {
    console.log(`refused: ${result.refused}`);
  }
  if (result) {
    console.log(`migrated: ${result.migrated.length}`);
    console.log(`kept: ${result.kept.length}`);
    for (const rel of result.kept) console.log(`  ${rel} (content differs; review, then --migrate --force)`);
  }
  console.log(`legacy: ${remaining.length}`);
  for (const rel of remaining) console.log(`  ${rel}`);
  console.log(`agents-root: ${state.agentsRoot ? "ok" : "missing"}`);
  console.log(`verdict: ${ok ? "PASS" : "FAIL"}`);
  return ok ? 0 : 1;
}

process.exit(main());
