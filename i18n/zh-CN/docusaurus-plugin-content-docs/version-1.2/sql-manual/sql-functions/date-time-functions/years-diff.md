---
{
    "title": "YEARS_DIFF",
    "language": "zh-CN"
}
---

## years_diff
## 描述
## 语法

`INT years_diff(DATETIME enddate, DATETIME startdate)`

开始时间到结束时间相差几年

## 举例

```
mysql> select years_diff('2020-12-25','2019-10-25');
+----------------------------------------------------------+
| years_diff('2020-12-25 00:00:00', '2019-10-25 00:00:00') |
+----------------------------------------------------------+
|                                                        1 |
+----------------------------------------------------------+
```

### keywords

    years_diff
