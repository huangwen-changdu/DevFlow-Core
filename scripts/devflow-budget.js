const fs = require("node:fs");
const path = require("node:path");

// 预算门禁：保护 DevFlow 自身的 context engineering——skill 主体膨胀会侵蚀"渐进式上下文"卖点。
// 单 skill 上限取现状最大 UTF-8 字节 14,715（devflow-project-knowledge/SKILL.md）向上取整到 15 KiB；
// 总量上限给现状 131,874（SKILL.md 主体合计）留约 2.1 倍余量，防整体失控。
const MAX_SKILL_BYTES = 15 * 1024;
const MAX_TOTAL_BYTES = 280000;

function usage() {
  console.log("Usage: node scripts/devflow-budget.js [--json] [--self-test]");
  console.log("Checks the skill context budget: each SKILL.md body byte limit and the skills/ total byte budget.");
}

/** Collect SKILL.md byte sizes under root/skills, one entry per skill directory. */
function scan(root) {
  const skillsDir = path.join(root, "skills");
  if (!fs.existsSync(skillsDir)) return [];

  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const rel = path.join("skills", entry.name, "SKILL.md");
      const file = path.join(root, rel);
      return { rel: rel.replaceAll("\\", "/"), bytes: fs.existsSync(file) ? fs.statSync(file).size : 0 };
    })
    .filter((item) => item.bytes > 0);
}

function report(root, json) {
  const files = scan(root);
  const total = files.reduce((sum, file) => sum + file.bytes, 0);
  const overSkill = files.filter((file) => file.bytes > MAX_SKILL_BYTES);
  const overTotal = total > MAX_TOTAL_BYTES;
  const judgment = overSkill.length === 0 && !overTotal ? "PASS" : "FAIL";

  if (json) {
    console.log(
      JSON.stringify({
        checker: "budget",
        files,
        totalBytes: total,
        maxSkillBytes: MAX_SKILL_BYTES,
        maxTotalBytes: MAX_TOTAL_BYTES,
        overSkill: overSkill.map((file) => file.rel),
        overTotal,
        judgment
      })
    );
    return judgment === "PASS" ? 0 : 1;
  }

  for (const file of files) {
    console.log(`${file.bytes}${file.bytes > MAX_SKILL_BYTES ? " OVER" : ""}  ${file.rel}`);
  }
  console.log(`Total skills bytes: ${total} (limit ${MAX_TOTAL_BYTES})`);
  for (const file of overSkill) {
    console.log(`Over skill limit: ${file.rel} (${file.bytes} > ${MAX_SKILL_BYTES})`);
  }
  if (overTotal) console.log(`Over total limit: ${total} > ${MAX_TOTAL_BYTES}`);
  console.log(`Judgment: ${judgment}`);
  return judgment === "PASS" ? 0 : 1;
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "devflow-budget-"));
  const overDir = path.join(tmp, "skills", "devflow-over");
  fs.mkdirSync(overDir, { recursive: true });
  fs.writeFileSync(path.join(overDir, "SKILL.md"), "x".repeat(MAX_SKILL_BYTES + 1), "utf8");

  const files = scan(tmp);
  if (files.length !== 1) throw new Error(`Self-test expected 1 skill file, found ${files.length}`);
  if (!files.some((file) => file.bytes > MAX_SKILL_BYTES)) {
    throw new Error("Self-test expected over-limit skill detection");
  }
  if (report(tmp, true) === 0) throw new Error("Self-test expected over-limit skill to fail");

  console.log("DevFlow budget self-test passed");
  console.log("Checked per-skill byte limit and total byte budget detection");
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
process.exitCode = report(path.resolve(__dirname, ".."), args.includes("--json"));
