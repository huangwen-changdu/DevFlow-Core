const fs = require("node:fs");
const path = require("node:path");

const ignoreDirs = new Set([
  ".git",
  ".hg",
  ".svn",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out"
]);

const textExtensions = new Set([
  ".c",
  ".cc",
  ".cpp",
  ".cs",
  ".css",
  ".go",
  ".html",
  ".java",
  ".js",
  ".jsx",
  ".kt",
  ".mjs",
  ".py",
  ".rb",
  ".rs",
  ".sh",
  ".swift",
  ".ts",
  ".tsx",
  ".vue"
]);

const patternChecks = [
  {
    tag: "stdlib",
    pattern: /\b(?:import|require)\s*(?:\(|).*["']lodash(?:\/[^"']*)?["']/,
    message: "lodash dependency candidate",
    replacement: "Prefer standard Array/Object/String helpers when the call site is simple."
  },
  {
    tag: "native",
    pattern: /\b(?:import|require)\s*(?:\(|).*["'](?:moment|date-fns)["']/,
    message: "date library candidate",
    replacement: "Prefer Intl.DateTimeFormat or native Date for simple formatting."
  },
  {
    tag: "yagni",
    pattern: /\b(?:abstract\s+class|interface\s+I[A-Z]\w+|class\s+\w*(?:Factory|Manager|Provider|Registry)\b)/,
    message: "abstraction candidate",
    replacement: "Keep only if there is a real second implementation or caller."
  },
  {
    tag: "delete",
    pattern: /\b(?:enableExperimental|futureProof|placeholder|unusedFlag)\b/,
    message: "speculative flag candidate",
    replacement: "Delete until a current requirement needs it."
  }
];

function usage() {
  console.log("Usage: node scripts/devflow-audit.js [target-directory] [--self-test] [--json]");
  console.log("Scans code for overengineering candidates. Findings are candidates; confirm by reading code before editing.");
}

function isTextFile(file) {
  return textExtensions.has(path.extname(file).toLowerCase());
}

function declarationName(line) {
  const functionMatch = line.match(/\b(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
  if (functionMatch) {
    return functionMatch[1];
  }

  const arrowMatch = line.match(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/);
  if (arrowMatch) {
    return arrowMatch[1];
  }

  const classMatch = line.match(/\bclass\s+([A-Za-z_$][\w$]*)\b/);
  return classMatch?.[1] || null;
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

function scan(root) {
  const findings = [];
  const declarations = new Map();

  for (const file of walk(root)) {
    if (!isTextFile(file)) {
      continue;
    }

    const rel = path.relative(root, file).replaceAll(path.sep, "/");
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    const fullText = lines.join("\n");

    // 文件级结构候选：仅启发式提示，人工确认后编辑，不构成缺失证据（judgment 恒 PASS）。
    const hasController = /\bclass\s+\w*Controller\b/.test(fullText);
    const hasEntity = /\bclass\s+\w*(?:Entity|Model|Dto|DTO)\b/.test(fullText);
    if (hasController && hasEntity) {
      findings.push({
        rel,
        line: 1,
        tag: "layering",
        message: "Controller 与实体同文件候选",
        replacement: "检查 Controller 是否直接持有实体/模型定义；建议分层。"
      });
    }
    if (lines.length > 400) {
      findings.push({
        rel,
        line: 1,
        tag: "megaclass",
        message: "单文件超长候选",
        replacement: "检查是否需要拆分。"
      });
    }
    // no-cache：仅提示读路径是否应查缓存，不宣称一定缺失（数据流无法静态证明）。
    if (/\b(?:get|fetch|find|list|query)\w*\s*\(/.test(fullText) && !/\bcache\b/i.test(fullText)) {
      findings.push({
        rel,
        line: 1,
        tag: "no-cache",
        message: "读路径无缓存候选（启发式）",
        replacement: "检查高频读路径是否应查缓存；仅提示不构成缺失证据。"
      });
    }

    lines.forEach((line, index) => {
      const declaredName = declarationName(line);
      if (declaredName) {
        const entries = declarations.get(declaredName) || [];
        entries.push({ rel, line: index + 1 });
        declarations.set(declaredName, entries);
      }

      for (const check of patternChecks) {
        if (!check.pattern.test(line)) {
          continue;
        }

        findings.push({
          rel,
          line: index + 1,
          tag: check.tag,
          message: check.message,
          replacement: check.replacement
        });
      }
    });
  }

  for (const [name, entries] of declarations) {
    const files = new Set(entries.map((entry) => entry.rel));
    if (files.size < 2) {
      continue;
    }

    for (const entry of entries.slice(1)) {
      findings.push({
        rel: entry.rel,
        line: entry.line,
        tag: "reuse",
        message: `duplicate declaration candidate: ${name}`,
        replacement: "Check whether the existing project helper, type, or pattern can be reused."
      });
    }
  }

  return findings;
}

function report(root, json) {
  const findings = scan(root);
  const judgment = "PASS";

  if (json) {
    console.log(JSON.stringify({ checker: "audit", findings, count: findings.length, judgment }));
    return 0;
  }

  if (findings.length === 0) {
    console.log("Lean already. Ship.");
    return 0;
  }

  console.log("DevFlow audit report");
  console.log("Scope: overengineering candidates only; confirm findings by reading code before editing.");
  for (const finding of findings) {
    console.log(`${finding.rel}:L${finding.line}: ${finding.tag}: ${finding.message}. ${finding.replacement}`);
  }
  console.log(`net: ${findings.length} candidates, 0 deps confirmed removable without code review.`);
  return 0;
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "devflow-audit-"));
  fs.writeFileSync(
    path.join(tmp, "sample.ts"),
    [
      "import _ from 'lodash';",
      "import moment from 'moment';",
      "interface IReportFactory {}",
      "const enableExperimental = false;",
      "function formatTotal(value) { return String(value); }",
      "class ReportController { entityId = 1; }",
      "class OrderEntity {}",
      "function getOrderData() { return String(value); }"
    ].join("\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(tmp, "other.ts"),
    "function formatTotal(value) { return value.toString(); }",
    "utf8"
  );
  fs.writeFileSync(
    path.join(tmp, "megaclass.ts"),
    Array.from({ length: 401 }, (_, index) => `// line ${index + 1}`).join("\n"),
    "utf8"
  );

  const findings = scan(tmp);
  const tags = new Set(findings.map((finding) => finding.tag));
  for (const tag of ["reuse", "stdlib", "native", "yagni", "delete", "layering", "megaclass", "no-cache"]) {
    if (!tags.has(tag)) {
      throw new Error(`Self-test expected ${tag} finding`);
    }
  }

  console.log("DevFlow audit self-test passed");
  console.log("Checked reuse, stdlib, native, yagni, delete, layering, megaclass, and no-cache candidate detection");
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

process.exitCode = report(targetRoot, args.includes("--json"));
