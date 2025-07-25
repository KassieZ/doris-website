---
{
    "title": "ARRAY_PRODUCT",
    "language": "zh-CN"
}
---

## 描述

计算数组中所有元素的乘积

## 语法

```sql
ARRAY_PRODUCT(<arr>)
```

## 参数

| 参数 | 说明 |
|--|--|
| `<arr>` | 对应数组 |

## 返回值

返回数组中所有元素的乘积，数组中的 NULL 值会被跳过。空数组以及元素全为 NULL 值的数组，结果返回 NULL 值。

## 举例

```sql
SELECT ARRAY_PRODUCT([1, 2, 3]),ARRAY_PRODUCT([1, NULL, 3]),ARRAY_PRODUCT([NULL]);
```

```text
+--------------------------+-----------------------------+----------------------------------------------+
| array_product([1, 2, 3]) | array_product([1, NULL, 3]) | array_product(cast([NULL] as ARRAY<DOUBLE>)) |
+--------------------------+-----------------------------+----------------------------------------------+
|                        6 |                           3 |                                         NULL |
+--------------------------+-----------------------------+----------------------------------------------+
```
