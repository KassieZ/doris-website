---
{
    "title": "DATE_SUB",
    "language": "zh-CN"
}
---

## date_sub
## 描述
## 语法

`DATETIME DATE_SUB(DATETIME date, INTERVAL expr type)`


从日期减去指定的时间间隔

date 参数是合法的日期表达式。

expr 参数是您希望添加的时间间隔。

type 参数可以是下列值：YEAR, MONTH, DAY, HOUR, MINUTE, SECOND

## 举例

```
mysql> select date_sub('2010-11-30 23:59:59', INTERVAL 2 DAY);
+-------------------------------------------------+
| date_sub('2010-11-30 23:59:59', INTERVAL 2 DAY) |
+-------------------------------------------------+
| 2010-11-28 23:59:59                             |
+-------------------------------------------------+
```

### keywords

    DATE_SUB,DATE,SUB
