#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

let input = "";
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const probe = {
    receivedAt: new Date().toISOString(),
    receivedInput: input.trim().length > 0
  };

  fs.writeFileSync(
    path.join(process.cwd(), ".codex", "devflow-prompt-probe.json"),
    `${JSON.stringify(probe)}\n`,
    "utf8"
  );
});