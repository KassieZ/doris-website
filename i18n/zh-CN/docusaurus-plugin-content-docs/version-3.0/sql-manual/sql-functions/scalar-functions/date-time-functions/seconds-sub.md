---
{
    "title": "SECONDS_SUB",
    "language": "zh-CN"
}
---

## 描述
函数用于在指定的日期时间值上减少或增加指定的秒数，并返回计算后的日期时间值

## 语法

```sql
SECONDS_SUB(<datetime>, <seconds>)
```
## 参数

| 参数           | 说明                                          |
|--------------|---------------------------------------------|
| `<datetime>` | 必填，输入的日期时间值，支持 DATETIME 或 DATE 类型           |
| `<seconds>`  | 必填，要减少或增加的秒数，支持整数类型（INT）。正数表示增加秒数，负数表示减少秒数。 |

## 返回值
- 返回一个日期时间值，类型与输入的 `<datetime>` 类型一致。
- 如果 `<datetime>` 为 NULL，函数返回 NULL。
- 如果 `<datetime>` 为非法日期（如 0000-00-00T00:00:00），函数返回 NULL。


## 举例
```
SELECT SECONDS_SUB('2025-01-23 12:34:56', 30),SECONDS_SUB('2025-01-23 12:34:56', -30);
```
```text
+---------------------------------------------------------------+----------------------------------------------------------------+
| seconds_sub(cast('2025-01-23 12:34:56' as DATETIMEV2(0)), 30) | seconds_sub(cast('2025-01-23 12:34:56' as DATETIMEV2(0)), -30) |
+---------------------------------------------------------------+----------------------------------------------------------------+
| 2025-01-23 12:34:26                                           | 2025-01-23 12:35:26                                            |
+---------------------------------------------------------------+----------------------------------------------------------------+
```