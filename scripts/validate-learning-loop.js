const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Parses index rows without loading card bodies, preserving progressive recall. */
function parseLearningCards(indexBody) {
  return [
    ...indexBody.matchAll(
      /\| \[([^\]]+)\]\((cards\/[^)]+\.md)\) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|(?: ([^|]+) \|)?/g
    )
  ].map((match) => ({
    title: match[1],
    rel: `.copilot/${match[2]}`,
    trigger: match[3].trim(),
    scope: match[4].trim(),
    evidenceLevel: (match[6] || "").trim()
  }));
}

/** Returns zero cards for unrelated work so callers never bulk-load card bodies. */
function matchedCards(cards, input) {
  const normalized = input.toLowerCase();
  return cards.filter((card) =>
    card.trigger
      .toLowerCase()
      .split(",")
      .map((term) => term.trim())
      .some((term) => term.length >= 4 && normalized.includes(term))
  );
}

const core = read("skills/devflow-core/SKILL.md");
const learn = read("skills/devflow-learn/SKILL.md");
const prove = read("skills/devflow-prove/SKILL.md");
const index = read(".copilot/LEARNING_INDEX.md");
const command = read("commands/devflow-learn.toml");
const cards = parseLearningCards(index);

assert(core.includes("devflow-learn"), "Core must expose the Learn owner route");
assert(prove.includes("devflow-learn"), "Prove must hand verified work to Learn review");
for (const term of [
  "Match the current task against card Trigger and Scope",
  "Read only matched cards",
  "do not load all `.copilot/cards/**`",
  "do not create empty learning storage after a no-record review",
  "Evidence:",
  "Invalidation:",
  "Rejected:",
  "Evidence Level",
  "Confidence cap"
]) {
  assert(learn.includes(term), `devflow-learn missing recall contract: ${term}`);
}

assert(cards.length > 0, "Learning index must contain at least one card");

const EVIDENCE_LEVELS = ["L1", "L2", "L3", "L4"];
for (const card of cards) {
  assert(
    EVIDENCE_LEVELS.includes(card.evidenceLevel),
    `${card.rel} index row must carry an Evidence Level of L1-L4, got "${card.evidenceLevel}"`
  );
}
// An all-L1 index is a legitimate end state, so it is not asserted here. The
// grade's honesty is guarded by the Anti-Rationalization table in
// skills/devflow-learn/SKILL.md, not by a count that would fail on good data.
const boundaryCard = cards.find((card) => card.rel.endsWith("agents-runtime-prompt-boundary.md"));
assert(boundaryCard, "Runtime prompt boundary card must remain indexed");

const body = read(boundaryCard.rel);
for (const field of ["- Trigger:", "- Lesson:", "- Rejected:", "- Next action:", "- Scope:", "- Related:", "- Evidence:", "- Evidence Level:", "- Invalidation:"]) {
  assert(body.includes(field), `${boundaryCard.rel} missing field: ${field}`);
}

assert(matchedCards(cards, "unrelated database migration").length === 0, "Unmatched work must not select a learning card");
assert(command.includes("Learning closure:"), "Learn command must require a learning closure");
assert(command.includes(".copilot/LEARNING_INDEX.md"), "Learn command must name the index");

console.log("Learning loop validation passed");
console.log(`Indexed cards: ${cards.length}`);
console.log("Recall: index first, matched card only, evidence and invalidation required");
