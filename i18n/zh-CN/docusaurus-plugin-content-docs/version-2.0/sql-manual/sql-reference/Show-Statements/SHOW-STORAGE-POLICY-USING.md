---
{
"title": "SHOW-STORAGE-POLICY-USING",
"language": "zh-CN"
}
---

## SHOW-STORAGE-POLICY-USING

### Name

SHOW STORAGE POLICY USING

## 描述

查看所有/指定存储策略关联的表和分区

语法：

```sql
SHOW STORAGE POLICY USING [FOR some_policy]
```

## 举例

1. 查看所有启用了存储策略的对象
   ```sql
   mysql> show storage policy using;
   +-----------------------+-----------------------------------------+----------------------------------------+------------+
   | PolicyName            | Database                                | Table                                  | Partitions |
   +-----------------------+-----------------------------------------+----------------------------------------+------------+
   | test_storage_policy   | regression_test_cold_heat_separation_p2 | table_with_storage_policy_1            | ALL        |
   | test_storage_policy   | regression_test_cold_heat_separation_p2 | partition_with_multiple_storage_policy | p201701    |
   | test_storage_policy_2 | regression_test_cold_heat_separation_p2 | partition_with_multiple_storage_policy | p201702    |
   | test_storage_policy_2 | regression_test_cold_heat_separation_p2 | table_with_storage_policy_2            | ALL        |
   | test_policy           | db2                                     | db2_test_1                             | ALL        |
   +-----------------------+-----------------------------------------+----------------------------------------+------------+
   ```
2. 查看使用存储策略test_storage_policy的对象

    ```sql
    mysql> show storage policy using for test_storage_policy;
    +---------------------+-----------+---------------------------------+------------+
    | PolicyName          | Database  | Table                           | Partitions |
    +---------------------+-----------+---------------------------------+------------+
    | test_storage_policy | db_1      | partition_with_storage_policy_1 | p201701    |
    | test_storage_policy | db_1      | table_with_storage_policy_1     | ALL        |
    +---------------------+-----------+---------------------------------+------------+
   ```

### Keywords

    SHOW, STORAGE, POLICY, USING

### Best Practice
