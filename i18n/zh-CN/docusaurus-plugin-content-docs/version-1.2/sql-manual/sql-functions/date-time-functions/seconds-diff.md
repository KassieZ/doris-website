---
{
    "title": "SECONDS_DIFF",
    "language": "zh-CN"
}
---

## seconds_diff
## 描述
## 语法

`INT seconds_diff(DATETIME enddate, DATETIME startdate)`

开始时间到结束时间相差几秒

## 举例

```
mysql> select seconds_diff('2020-12-25 22:00:00','2020-12-25 21:00:00');
+------------------------------------------------------------+
| seconds_diff('2020-12-25 22:00:00', '2020-12-25 21:00:00') |
+------------------------------------------------------------+
|                                                       3600 |
+------------------------------------------------------------+
```

### keywords

    seconds_diff
