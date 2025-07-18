---
{
    "title": "ARRAY_FIRST_INDEX",
    "language": "zh-CN"
}
---

## array_first_index

array_first_index

## 描述

## 语法

`ARRAY<T> array_first_index(lambda, ARRAY<T> array1, ...)`

使用 lambda 表达式作为输入参数，对其他输入 ARRAY 参数的内部数据进行相应的表达式计算。返回第一个使得 `lambda(array1[i], ...)` 返回值不为 0 的索引。如果没找到满足此条件的索引，则返回 0。

在 lambda 表达式中输入的参数为 1 个或多个，所有输入的 array 的元素数量必须一致。在 lambda 中可以执行合法的标量函数，不支持聚合函数等。

```
array_first_index(x->x>1, array1);
array_first_index(x->(x%2 = 0), array1);
array_first_index(x->(abs(x)-1), array1);
array_first_index((x,y)->(x = y), array1, array2);
```

## 举例

```
mysql> select array_first_index(x->x+1>3, [2, 3, 4]);
+-------------------------------------------------------------------+
| array_first_index(array_map([x] -> x(0) + 1 > 3, ARRAY(2, 3, 4))) |
+-------------------------------------------------------------------+
|                                                                 2 |
+-------------------------------------------------------------------+

mysql> select array_first_index(x -> x is null, [null, 1, 2]);
+----------------------------------------------------------------------+
| array_first_index(array_map([x] -> x(0) IS NULL, ARRAY(NULL, 1, 2))) |
+----------------------------------------------------------------------+
|                                                                    1 |
+----------------------------------------------------------------------+

mysql> select array_first_index(x->power(x,2)>10, [1, 2, 3, 4]);
+---------------------------------------------------------------------------------+
| array_first_index(array_map([x] -> power(x(0), 2.0) > 10.0, ARRAY(1, 2, 3, 4))) |
+---------------------------------------------------------------------------------+
|                                                                               4 |
+---------------------------------------------------------------------------------+

mysql> select col2, col3, array_first_index((x,y)->x>y, col2, col3) from array_test;
+--------------+--------------+---------------------------------------------------------------------+
| col2         | col3         | array_first_index(array_map([x, y] -> x(0) > y(1), `col2`, `col3`)) |
+--------------+--------------+---------------------------------------------------------------------+
| [1, 2, 3]    | [3, 4, 5]    |                                                                   0 |
| [1, NULL, 2] | [NULL, 3, 1] |                                                                   3 |
| [1, 2, 3]    | [9, 8, 7]    |                                                                   0 |
| NULL         | NULL         |                                                                   0 |
+--------------+--------------+---------------------------------------------------------------------+
```

### keywords

ARRAY,FIRST_INDEX,ARRAY_FIRST_INDEX