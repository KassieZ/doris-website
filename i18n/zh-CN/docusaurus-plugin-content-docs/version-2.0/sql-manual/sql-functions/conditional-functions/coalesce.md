---
{
    "title": "COALESCE",
    "language": "zh-CN"
}
---

## 描述

返回参数列表中从左到右第一个非空表达式。如果所有参数都为 NULL，则返回 NULL。

## 语法

```sql
COALESCE(<expr> [, ...])
```

## 参数

| 参数          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| `<expr>` | 需要逐个检查的表达式序列，所有表达式必须具有兼容的数据类型。 |

## 返回值

参数列表中第一个非空表达式。如果所有参数都为 NULL，则返回 NULL。

## 示例

```sql
SELECT COALESCE(NULL, '1111', '0000');
```

```text
+--------------------------------+
| coalesce(NULL, '1111', '0000') |
+--------------------------------+
| 1111                           |
+--------------------------------+
```