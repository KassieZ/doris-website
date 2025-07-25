---
{
    "title": "HOURS_DIFF",
    "language": "zh-CN"
}
---

## 描述

开始时间到结束时间相差几小时。

## 语法

```sql
HOURS_DIFF(<end_date>, <start_date>)
```

## 参数

| 参数 | 说明 |
| ---- | ---- |
| `<end_date>` | 结束时间，类型为 DATETIME 或 DATE |
| `<start_date>` | 开始时间，类型为 DATETIME 或 DATE |

## 返回值

返回类型为 INT，返回开始时间到结束时间相差的小时数。

## 举例

```sql
SELECT HOURS_DIFF('2020-12-25 22:00:00', '2020-12-25 21:00:00');
```

```text
+--------------------------------------------------------------------------------------------------------+
| hours_diff(cast('2020-12-25 22:00:00' as DATETIMEV2(0)), cast('2020-12-25 21:00:00' as DATETIMEV2(0))) |
+--------------------------------------------------------------------------------------------------------+
|                                                                                                      1 |
+--------------------------------------------------------------------------------------------------------+
```
