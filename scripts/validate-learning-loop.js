const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseLearningCards(indexBody) {
  return [...indexBody.matchAll(/\| \[([^\]]+)\]\((cards\/[^)]+\.md)\) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|/g)].map(
    (match) => ({
      title: match[1],
      rel: `.copilot/${match[2]}`,
      trigger: match[3].trim(),
      scope: match[4].trim(),
      confidence: match[5].trim()
    })
  );
}

const scenario = {
  input: "Not again: AGENTS.md is a runtime prompt. You put README-style explanation in the wrong place.",
  signals: ["Not again", "AGENTS.md", "wrong place", "README-style explanation"]
};

const core = read("skills/devflow-core/SKILL.md");
const learn = read("skills/devflow-learn/SKILL.md");
const prove = read("skills/devflow-prove/SKILL.md");
const selfTest = read("skills/devflow-prove/references/flow-self-test.md");
const index = read(".copilot/LEARNING_INDEX.md");
const command = read("commands/devflow-learn.toml");

for (const signal of scenario.signals) {
  assert(scenario.input.includes(signal), `Scenario is missing signal: ${signal}`);
}

assert(core.includes("Learning Capture"), "devflow-core must route reusable corrections to Learning Capture");
assert(core.includes("update `.copilot/LEARNING_INDEX.md` and one focused card"), "devflow-core must name the learning-card write path");

assert(prove.includes("## Learning Check"), "devflow-prove must have a Learning Check section");
assert(prove.includes("load `devflow-learn`"), "devflow-prove must hand off corrections to devflow-learn");

for (const term of [
  "Detect the learning signal",
  "Read `.copilot/LEARNING_INDEX.md`",
  "Read only matched cards",
  "Create or update one focused card",
  "Update `.copilot/LEARNING_INDEX.md`",
  "Report learning closure before completion",
  "Repeated correction is not optional learning"
]) {
  assert(learn.includes(term), `devflow-learn missing closure step: ${term}`);
}

const cards = parseLearningCards(index);
assert(cards.length > 0, "Learning index must contain at least one card");

const matched = cards.find((card) =>
  card.trigger.includes("AGENTS.md") &&
  card.trigger.includes("misplaced content") &&
  card.trigger.includes("repeated correction")
);

assert(matched, "Repeated AGENTS.md placement correction must recall a matched learning card");

const cardBody = read(matched.rel);
for (const field of ["- Trigger:", "- Lesson:", "- Next action:", "- Scope:", "- Related:"]) {
  assert(cardBody.includes(field), `${matched.rel} missing field: ${field}`);
}

assert(cardBody.includes("Next time editing AGENTS.md"), `${matched.rel} must state the next-time AGENTS.md intercept`);
assert(cardBody.includes("runtime prompt"), `${matched.rel} must preserve the runtime-prompt lesson`);

assert(selfTest.includes("Scenario 6A: Repeated Correction Learning Closure"), "Self-test must include Scenario 6A");
assert(selfTest.includes(scenario.input), "Scenario 6A must contain the repeated-correction input");
assert(selfTest.includes("Read `.copilot/LEARNING_INDEX.md`"), "Scenario 6A must require reading the learning index");
assert(selfTest.includes("Read only the matched card"), "Scenario 6A must require matched-card recall");
assert(selfTest.includes("Report learning closure before claiming completion"), "Scenario 6A must require closure output");

assert(command.includes("Run DevFlow Learn"), "devflow-learn command must invoke DevFlow Learn");
assert(command.includes("Learning closure:"), "devflow-learn command must require closure output");
assert(command.includes(".copilot/LEARNING_INDEX.md"), "devflow-learn command must mention the learning index");

console.log("Learning loop validation passed");
console.log(`Scenario: ${scenario.input}`);
console.log(`Matched card: ${matched.rel}`);
console.log("Closure: core route -> prove learning check -> learn storage -> next-time recall card");
