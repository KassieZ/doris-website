---
{
    "title": "BITMAP_AND_COUNT",
    "language": "zh-CN"
}
---

## 描述

计算两个及以上输入 BITMAP 的交集，返回交集的个数。

## 语法

```sql
BITMAP_AND_COUNT(<bitmap>, <bitmap>,[, <bitmap>...])
```

## 参数

| 参数         | 说明               |
|------------|------------------|
| `<bitmap>` | 被求交集的原 BITMAP 之一 |

## 返回值

返回整数
- 当参数存在空值时，返回 NULL

## 举例

```sql
select bitmap_and_count(bitmap_from_string('1,2,3'),bitmap_from_string('3,4,5'));
```

```text
+----------------------------------------------------------------------------+
| bitmap_and_count(bitmap_from_string('1,2,3'), bitmap_from_string('3,4,5')) |
+----------------------------------------------------------------------------+
|                                                                          1 |
+----------------------------------------------------------------------------+
```

```sql
select bitmap_and_count(bitmap_from_string('1,2,3'), bitmap_from_string('1,2'), bitmap_from_string('1,2,3,4,5'));
```

```text
+-------------------------------------------------------------------------------------------------------------+
| (bitmap_and_count(bitmap_from_string('1,2,3'), bitmap_from_string('1,2'), bitmap_from_string('1,2,3,4,5'))) |
+-------------------------------------------------------------------------------------------------------------+
|                                                                                                           2 |
+-------------------------------------------------------------------------------------------------------------+
```

```sql
select bitmap_and_count(bitmap_from_string('1,2,3'), bitmap_from_string('1,2'), bitmap_from_string('1,2,3,4,5'),bitmap_empty());
```

```text
+-----------------------------------------------------------------------------------------------------------------------------+
| (bitmap_and_count(bitmap_from_string('1,2,3'), bitmap_from_string('1,2'), bitmap_from_string('1,2,3,4,5'), bitmap_empty())) |
+-----------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                           0 |
+-----------------------------------------------------------------------------------------------------------------------------+
```

```sql
select bitmap_and_count(bitmap_from_string('1,2,3'), bitmap_from_string('1,2'), bitmap_from_string('1,2,3,4,5'), NULL);
```

```text
+-------------------------------------------------------------------------------------------------------------------+
| (bitmap_and_count(bitmap_from_string('1,2,3'), bitmap_from_string('1,2'), bitmap_from_string('1,2,3,4,5'), NULL)) |
+-------------------------------------------------------------------------------------------------------------------+
|                                                                                                              NULL |
+-------------------------------------------------------------------------------------------------------------------+
```

