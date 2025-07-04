---
{
    "title": "CANCEL-EXPORT",
    "language": "zh-CN"
}
---

## CANCEL-EXPORT

### Name



CANCEL EXPORT

## 描述

该语句用于撤销指定 label 的 EXPORT 作业，或者通过模糊匹配批量撤销 EXPORT 作业

```sql
CANCEL EXPORT
[FROM db_name]
WHERE [LABEL = "export_label" | LABEL like "label_pattern" | STATE = "PENDING/IN_QUEUE/EXPORTING"]
```

## 举例

1. 撤销数据库 example_db 上，label 为 `example_db_test_export_label` 的 EXPORT 作业

   ```sql
   CANCEL EXPORT
   FROM example_db
   WHERE LABEL = "example_db_test_export_label" and STATE = "EXPORTING";
   ```

2. 撤销数据库 example*db 上，所有包含 example* 的 EXPORT 作业。

   ```sql
   CANCEL EXPORT
   FROM example_db
   WHERE LABEL like "%example%";
   ```

3. 取消状态为 PENDING 的导入作业。

   ```sql
   CANCEL EXPORT
   FROM example_db
   WHERE STATE = "PENDING";
   ```

### Keywords

    CANCEL, EXPORT

### Best Practice

1. 只能取消处于 PENDING、IN_QUEUE、EXPORTING 状态的未完成的导出作业。
2. 当执行批量撤销时，Doris 不会保证所有对应的 EXPORT 作业原子的撤销。即有可能仅有部分 EXPORT 作业撤销成功。用户可以通过 SHOW EXPORT 语句查看作业状态，并尝试重复执行 CANCEL EXPORT 语句。
3. 当撤销`EXPORTING`状态的作业时，有可能作业已经导出部分数据到存储系统上，用户需要自行处理 (删除) 该部分导出数据。
