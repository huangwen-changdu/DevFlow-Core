// demo/test.js — demo 循环的停止条件判据。
// 断言 subtract(2,1) === 1：修复前（bug 返回 2）失败、退出码 1；
// 修复后通过、退出码 0。
const assert = require('assert');
const { subtract, multiply } = require('./calc.js');
assert.strictEqual(subtract(2, 1), 1); // 修复前失败，修复后通过
assert.strictEqual(multiply(3, 4), 12); // multiply 断言：修复前失败（函数不存在），实现后通过
console.log('demo test passed');
