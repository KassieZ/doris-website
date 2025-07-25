---
{
    "title": "ATANH",
    "language": "zh-CN"
}
---

## 描述

返回`x`的反双曲正切值。如果`x`不在`-1`到`1`之间(不包括`-1`和`1`)，则返回`NULL`。


## 语法

```sql
ATANH(<x>)
```

## 参数

| 参数 | 描述 |  
| -- | -- |  
| `<x>` | 需要计算反双曲正切值的数值 |  

## 返回值

参数`x`的反双曲正切值。

## 示例

```sql
select atanh(1.0);
```

```sql
+------------+
| atanh(1.0) |
+------------+
|       NULL |
+------------+
```

```sql
select atanh(1.0);
```

```sql
+-------------+
| atanh(-1.0) |
+-------------+
|        NULL |
+-------------+
```

```sql
select atanh(1.0);
```

```sql
+------------+
| atanh(0.0) |
+------------+
|          0 |
+------------+
```

```sql
select atanh(1.0);
```

```sql
+--------------------+
| atanh(0.5)         |
+--------------------+
| 0.5493061443340548 |
+--------------------+
```
