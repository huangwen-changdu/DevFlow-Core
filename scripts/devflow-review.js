const fs = require("node:fs");

const requiredGates = [
  { name: "Reuse Check", pattern: /Reuse Check/i },
  { name: "Ponytail Rung", pattern: /Ponytail Rung/i },
  { name: "Native Check", pattern: /Native Check/i },
  { name: "Overbuild Check", pattern: /Overbuild Check/i },
  { name: "Diff Check", pattern: /Diff Check/i },
  { name: "Scope Check", pattern: /Scope Check/i }
];

function usage() {
  console.log("Usage: node scripts/devflow-review.js [plan-or-diff-file] [--self-test]");
  console.log("Checks whether a plan or review text includes the DevFlow anti-overengineering gates.");
}

function reviewText(body) {
  const missing = requiredGates.filter((gate) => !gate.pattern.test(body));
  const present = requiredGates.filter((gate) => gate.pattern.test(body));

  return {
    present,
    missing,
    ok: missing.length === 0
  };
}

function report(body) {
  const result = reviewText(body);

  console.log("DevFlow review gate report");
  console.log(`Present gates: ${result.present.map((gate) => gate.name).join(", ") || "none"}`);
  console.log(`Missing gates: ${result.missing.map((gate) => gate.name).join(", ") || "none"}`);

  if (!result.ok) {
    console.log("Judgment: FAIL");
    return 1;
  }

  console.log("Judgment: PASS");
  return 0;
}

function readInput(args) {
  const targetArg = args.find((arg) => !arg.startsWith("-"));
  if (targetArg) {
    return fs.readFileSync(targetArg, "utf8");
  }
  return fs.readFileSync(0, "utf8");
}

function selfTest() {
  const validPlan = [
    "Reuse Check: searched existing helpers",
    "Ponytail Rung: one-line/config",
    "Native Check: standard library not enough",
    "Overbuild Check: no new abstraction",
    "Diff Check: README only",
    "Scope Check: no extra features"
  ].join("\n");
  const invalidPlan = "Reuse Check: searched existing helpers";

  if (!reviewText(validPlan).ok) {
    throw new Error("Self-test expected valid plan to pass");
  }
  const invalidResult = reviewText(invalidPlan);
  if (invalidResult.ok || invalidResult.missing.length !== 5) {
    throw new Error("Self-test expected invalid plan to fail with 5 missing gates");
  }

  console.log("DevFlow review self-test passed");
  console.log("Checked required gate detection and missing gate reporting");
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

const body = readInput(args);
process.exitCode = report(body);
