---
{
    "title": "FROM_UNIXTIME",
    "language": "en"
}
---

## from_unixtime
### description
#### syntax

`DATETIME FROM UNIXTIME (BIGINT unix timestamp [, VARCHAR string format]`

Convert the UNIX timestamp to the corresponding time format of bits, and the format returned is specified by `string_format`

Input is an big integer and return is a string type

Support `date_format`'s format, and default is `%Y-%m-%d %H:%i:%s`

The current supported range for `unix_timestamp` is `[0, 32536771199]`. `unix_timestamp` values that fall outside of this range will be returned as NULL

### example

```
mysql> select from_unixtime(1196440219);
+---------------------------+
| from_unixtime(1196440219) |
+---------------------------+
| 2007-12-01 00:30:19       |
+---------------------------+

mysql> select from_unixtime(1196440219, '%Y-%m-%d');
+-----------------------------------------+
| from_unixtime(1196440219, '%Y-%m-%d')   |
+-----------------------------------------+
| 2007-12-01                              |
+-----------------------------------------+

mysql> select from_unixtime(1196440219, '%Y-%m-%d %H:%i:%s');
+--------------------------------------------------+
|From unixtime (1196440219,'%Y-%m-%d %H:%i:%s')    |
+--------------------------------------------------+
| 2007-12-01 00:30:19                              |
+--------------------------------------------------+
```

For timestamps that exceed the range, you can use the "from_second" function.
`DATETIME FROM_SECOND(BIGINT unix_timestamp)`
```
mysql> select from_second(21474836470);
+--------------------------+
| from_second(21474836470) |
+--------------------------+
| 2650-07-06 16:21:10      |
+--------------------------+
```

### keywords

    FROM_UNIXTIME,FROM,UNIXTIME
