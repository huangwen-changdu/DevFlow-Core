// demo/calc.js — Loop Engine demo task target.
// subtract 曾为故意 bug（减法写成加法），已在本循环修复为 a - b；
// divide 为本循环新增：除数非零正常除、除零抛出 Error。
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; } // 已修复：减法返回 a - b
function multiply(a, b) { return a * b; } // 实现：乘法返回 a * b
function divide(a, b) {
  if (b === 0) { throw new Error('Cannot divide by zero'); }
  return a / b;
}
module.exports = { add, subtract, multiply, divide };
