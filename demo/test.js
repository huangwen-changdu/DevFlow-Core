// demo/test.js — demo 循环的停止条件判据。
// 覆盖：subtract（曾为故意 bug，本循环修复）、multiply、divide 两态（正常除 + 除零抛错）。
const assert = require('assert');
const { subtract, multiply, divide } = require('./calc.js');
assert.strictEqual(subtract(2, 1), 1); // 减法：2 - 1 === 1
assert.strictEqual(multiply(3, 4), 12); // 乘法：3 * 4 === 12
assert.strictEqual(divide(6, 3), 2); // 除法正常：6 / 3 === 2
assert.throws(() => divide(1, 0), /zero/); // 除零抛出错误
console.log('demo test passed');
