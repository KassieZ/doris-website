---
{
    "title": "SHOW-STATUS",
    "language": "zh-CN"
}
---

## SHOW-STATUS

### Name

SHOW STATUS

## 描述

该命令用于查看通过[创建物化视图](../Data-Definition-Statements/Create/CREATE-MATERIALIZED-VIEW.md)语句提交的创建物化视图作业的执行情况。

> 该语句相当于`SHOW ALTER TABLE ROLLUP`；

```sql
SHOW ALTER TABLE MATERIALIZED VIEW
[FROM database]
[WHERE]
[ORDER BY]
[LIMIT OFFSET]
```

- database ：查看指定数据库下的作业。 如果未指定，则使用当前数据库。
- WHERE：您可以过滤结果列，目前仅支持以下列：
   - TableName：仅支持等值过滤。
   - State：仅支持等效过滤。
   - Createtime/FinishTime：支持 =、>=、<=、>、<、!=
- ORDER BY：结果集可以按任何列排序。
- LIMIT：使用 ORDER BY 进行翻页查询。

Return result description:

```sql
mysql> show alter table materialized view\G
**************************** 1. row ******************** ******
          JobId: 11001
      TableName: tbl1
     CreateTime: 2020-12-23 10:41:00
     FinishTime: NULL
  BaseIndexName: tbl1
RollupIndexName: r1
       RollupId: 11002
  TransactionId: 5070
          State: WAITING_TXN
            Msg:
       Progress: NULL
        Timeout: 86400
1 row in set (0.00 sec)
```

- `JobId`：作业唯一 ID。

- `TableName`：基表名称

- `CreateTime/FinishTime`：作业创建时间和结束时间。

- `BaseIndexName/RollupIndexName`：基表名称和物化视图名称。

- `RollupId`：物化视图的唯一 ID。

- `TransactionId`：参见State字段的描述。

- `State`：工作状态。

  - PENDING：工作正在准备中。

  - WAITING_TXN：

    在正式开始生成物化视图数据之前，它会等待当前正在运行的该表上的导入事务完成。而 `TransactionId` 字段是当前等待的交易 ID。当此 ID 的所有先前导入完成后，作业将真正开始。

  - RUNNING：作业正在运行。

  - FINISHED ：作业成功运行。

  - CANCELLED：作业运行失败。

- `Msg`：错误信息

- `Progress`：作业进度。这里的进度是指 `完completed tablets/total tablets`。物化视图以 tablet 粒度创建。

- `Timeout`：作业超时，以秒为单位。

## 举例

### Keywords

    SHOW, STATUS

### Best Practice

