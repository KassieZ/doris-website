---
{
    "title": "ADMIN-CHECK-TABLET",
    "language": "zh-CN"
}
---

## ADMIN-CHECK-TABLET

### Name

ADMIN CHECK TABLET

## 描述

该语句用于对一组 tablet 执行指定的检查操作

语法：

```sql
ADMIN CHECK TABLET (tablet_id1, tablet_id2, ...)
PROPERTIES("type" = "...");
```

说明：

1. 必须指定 tablet id 列表以及 PROPERTIES 中的 type 属性。
2. 目前 type 仅支持：

    * consistency: 对tablet的副本数据一致性进行检查。该命令为异步命令，发送后，Doris 会开始执行对应 tablet 的一致性检查作业。最终的结果，将体现在 `SHOW PROC "/cluster_health/tablet_health";` 结果中的 InconsistentTabletNum 列。

## 举例

1. 对指定的一组 tablet 进行副本数据一致性检查

    ```
    ADMIN CHECK TABLET (10000, 10001)
    PROPERTIES("type" = "consistency");

### Keywords

    ADMIN, CHECK, TABLET

### Best Practice

