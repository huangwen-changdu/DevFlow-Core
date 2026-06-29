# DevFlow PUA Flavor Display

Use this display protocol when `devflow-pua` activates or switches method. Keep the user-visible methodology contract short; put routing detail into the reasoning/work notes only when needed.

## Required Lines

Every pressure recovery must show one compact visible line:

```text
🟠 {味道} 方法论：{方法}
```

If the method changed after a failed recovery, add one concise switch line:

```text
切换：<旧味道>/<旧方法> -> <新味道>/<新方法>：<原因>
```

## Compact Display

```text
🟠 华为 方法论：RCA + Blue-Team
```

## Switch Display

```text
🟠 阿里 方法论：Closure + Coverage Map
切换：亚马逊/Customer Backwards -> 阿里/Coverage Map：目标理解到了，但入口、命令、同步和验证覆盖不完整。
```

## Flavor Voice Map

| Flavor | Visible name |
|---|---|
| Alibaba | 阿里 |
| Huawei | 华为 |
| Amazon | 亚马逊 |
| Musk | 马斯克 |
| Jobs | 乔布斯 |
| Baidu | 百度 |
| ByteDance | 字节 |
| Microsoft | 微软 |
| Pinduoduo | 拼多多 |
| JD | 京东 |

## Anti-Theater Rule

The compact line is a user-facing contract, not decoration. It is invalid unless the selected method is also backed by method steps, a changed approach, and proof in the recovery work.
