// demo/calc.js — Loop Engine demo task target.
// 故意 bug：subtract 返回 a + b（减法写成加法）。这是 demo 循环的修复目标，
// 修复后应返回 a - b。请勿在本文件之外预置修复答案。
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; } // 已修复：减法返回 a - b
function multiply(a, b) { return a * b; } // 实现：乘法返回 a * b
module.exports = { add, subtract, multiply };
