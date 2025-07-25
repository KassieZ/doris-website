---
{
    "title": "BACKENDS",
    "language": "en"
}
---

## `backends`

### Name

backends

### description

Table-Value-Function, generate a temporary table named `backends`. This tvf is used to view the information of BE nodes in the doris cluster.

This function is used in `FROM` clauses.

#### syntax

`backends()`

The table schema of `backends()` tvf：
```
mysql> desc function backends();
+-------------------------+---------+------+-------+---------+-------+
| Field                   | Type    | Null | Key   | Default | Extra |
+-------------------------+---------+------+-------+---------+-------+
| BackendId               | BIGINT  | No   | false | NULL    | NONE  |
| Host                    | TEXT    | No   | false | NULL    | NONE  |
| HeartbeatPort           | INT     | No   | false | NULL    | NONE  |
| BePort                  | INT     | No   | false | NULL    | NONE  |
| HttpPort                | INT     | No   | false | NULL    | NONE  |
| BrpcPort                | INT     | No   | false | NULL    | NONE  |
| LastStartTime           | TEXT    | No   | false | NULL    | NONE  |
| LastHeartbeat           | TEXT    | No   | false | NULL    | NONE  |
| Alive                   | BOOLEAN | No   | false | NULL    | NONE  |
| SystemDecommissioned    | BOOLEAN | No   | false | NULL    | NONE  |
| TabletNum               | BIGINT  | No   | false | NULL    | NONE  |
| DataUsedCapacity        | BIGINT  | No   | false | NULL    | NONE  |
| AvailCapacity           | BIGINT  | No   | false | NULL    | NONE  |
| TotalCapacity           | BIGINT  | No   | false | NULL    | NONE  |
| UsedPct                 | DOUBLE  | No   | false | NULL    | NONE  |
| MaxDiskUsedPct          | DOUBLE  | No   | false | NULL    | NONE  |
| RemoteUsedCapacity      | BIGINT  | No   | false | NULL    | NONE  |
| Tag                     | TEXT    | No   | false | NULL    | NONE  |
| ErrMsg                  | TEXT    | No   | false | NULL    | NONE  |
| Version                 | TEXT    | No   | false | NULL    | NONE  |
| Status                  | TEXT    | No   | false | NULL    | NONE  |
| HeartbeatFailureCounter | INT     | No   | false | NULL    | NONE  |
| NodeRole                | TEXT    | No   | false | NULL    | NONE  |
+-------------------------+---------+------+-------+---------+-------+
23 rows in set (0.002 sec)
```

The information displayed by the `backends` tvf is basically consistent with the information displayed by the `show backends` statement. However, the types of each field in the `backends` tvf are more specific, and you can use the `backends` tvf to perform operations such as filtering and joining.

The information displayed by the `backends` tvf is authenticated, which is consistent with the behavior of `show backends`, user must have ADMIN/OPERATOR privelege.

### example
```
mysql> select * from backends()\G
*************************** 1. row ***************************
              BackendId: 10002
                   Host: 10.xx.xx.90
          HeartbeatPort: 9053
                 BePort: 9063
               HttpPort: 8043
               BrpcPort: 8069
          LastStartTime: 2023-06-15 16:51:02
          LastHeartbeat: 2023-06-15 17:09:58
                  Alive: 1
   SystemDecommissioned: 0
              TabletNum: 21
       DataUsedCapacity: 0
          AvailCapacity: 5187141550081
          TotalCapacity: 7750977622016
                UsedPct: 33.077583202570978
         MaxDiskUsedPct: 33.077583202583881
     RemoteUsedCapacity: 0
                    Tag: {"location" : "default"}
                 ErrMsg: 
                Version: doris-0.0.0-trunk-4b18cde0c7
                 Status: {"lastSuccessReportTabletsTime":"2023-06-15 17:09:02","lastStreamLoadTime":-1,"isQueryDisabled":false,"isLoadDisabled":false}
HeartbeatFailureCounter: 0
               NodeRole: mix
1 row in set (0.038 sec)
```

### keywords

    backends