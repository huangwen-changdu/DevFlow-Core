const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ignoreDirs = new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache"
]);

const markerPattern = /^\s*(?:(?:\/\/|#|--|;|\*)\s*|<!--\s*)?devflow:\s*(.+?)(?:\s*-->)?\s*$/i;

function usage() {
  console.log("Usage: node scripts/devflow-debt.js [target-directory] [--self-test]");
  console.log("Scans for devflow: intentional-simplification markers and reports ceiling/revisit gaps.");
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoreDirs.has(entry.name)) {
      return [];
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return [fullPath];
  });
}

function isTextFile(file) {
  const ext = path.extname(file).toLowerCase();
  return [
    ".c",
    ".cc",
    ".cpp",
    ".cs",
    ".css",
    ".go",
    ".html",
    ".java",
    ".js",
    ".json",
    ".jsx",
    ".kt",
    ".md",
    ".mdc",
    ".mjs",
    ".py",
    ".rb",
    ".rs",
    ".sh",
    ".swift",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml"
  ].includes(ext);
}

function classifyMarker(text) {
  const normalized = text.toLowerCase();
  const hasCeiling = normalized.includes("ceiling:") || normalized.includes("ceiling ");
  const hasRevisit = normalized.includes("revisit:") || normalized.includes("revisit when");

  if (hasCeiling && hasRevisit) {
    return "ok";
  }
  if (!hasCeiling && !hasRevisit) {
    return "no-ceiling,no-trigger";
  }
  if (!hasCeiling) {
    return "no-ceiling";
  }
  return "no-trigger";
}

function scan(root) {
  const markers = [];

  for (const file of walk(root)) {
    if (!isTextFile(file)) {
      continue;
    }

    const rel = path.relative(root, file).replaceAll(path.sep, "/");
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      const match = line.match(markerPattern);
      if (!match) {
        return;
      }

      const detail = match[1].trim();
      if (detail.includes("<") && detail.includes(">")) {
        return;
      }
      markers.push({
        rel,
        line: index + 1,
        detail,
        status: classifyMarker(detail)
      });
    });
  }

  return markers;
}

function report(root) {
  const markers = scan(root);
  const invalid = markers.filter((marker) => marker.status !== "ok");

  if (markers.length === 0) {
    console.log("No devflow debt markers found.");
    return 0;
  }

  for (const marker of markers) {
    console.log(`${marker.rel}:${marker.line} - ${marker.detail}. status: ${marker.status}`);
  }

  console.log(`${markers.length} markers, ${invalid.length} no-trigger`);
  return invalid.length === 0 ? 0 : 1;
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "devflow-debt-"));
  fs.writeFileSync(
    path.join(tmp, "sample.js"),
    [
      "// devflow: ceiling: temporary direct parser, revisit when marker syntax expands",
      "// devflow: missing structured fields",
      "// devflow: <ceiling>, revisit when <trigger>"
    ].join("\n"),
    "utf8"
  );

  const markers = scan(tmp);
  if (markers.length !== 2) {
    throw new Error(`Self-test expected 2 markers, found ${markers.length}`);
  }
  if (markers[0].status !== "ok") {
    throw new Error(`Self-test expected first marker ok, found ${markers[0].status}`);
  }
  if (markers[1].status !== "no-ceiling,no-trigger") {
    throw new Error(`Self-test expected second marker invalid, found ${markers[1].status}`);
  }

  console.log("DevFlow debt self-test passed");
  console.log("Checked marker discovery, ceiling detection, revisit trigger detection, and placeholder filtering");
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

const targetArg = args.find((arg) => !arg.startsWith("-")) || ".";
const targetRoot = path.resolve(process.cwd(), targetArg);
if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
  throw new Error(`Target directory does not exist: ${targetRoot}`);
}

process.exitCode = report(targetRoot);
