---
{
    "title": "Statement Execution Action",
    "language": "zh-CN"
}
---

## Request

```
POST /api/query/<ns_name>/<db_name>
```

## Description

Statement Execution Action 用于执行语句并返回结果。
    
## Path parameters

* `<db_name>`

    指定数据库名称。该数据库会被视为当前 session 的默认数据库，如果在 SQL 中的表名没有限定数据库名称的话，则使用该数据库。

## Query parameters

无

## Request body

```
{
    "stmt" : "select * from tbl1"
}
```

* sql 字段为具体的 SQL

### Response

* 返回结果集

    ```
    {
        "msg": "success",
        "code": 0,
        "data": {
            "type": "result_set",
            "data": [
                [1],
                [2]
            ],
            "meta": [{
                "name": "k1",
                "type": "INT"
            }],
            "status": {},
            "time": 10
        },
        "count": 0
    }
    ```

    * type 字段为 `result_set` 表示返回结果集。需要根据 meta 和 data 字段获取并展示结果。meta 字段描述返回的列信息。data 字段返回结果行。其中每一行的中的列类型，需要通过 meta 字段内容判断。status 字段返回 MySQL 的一些信息，如告警行数，状态码等。time 字段返回语句执行时间，单位毫秒。

* 返回执行结果

    ```
    {
        "msg": "success",
        "code": 0,
        "data": {
            "type": "exec_status",
            "status": {},
            "time": 10
        },
        "count": 0
    }
    ```

    * type 字段为 `exec_status` 表示返回执行结果。目前收到该返回结果，则都表示语句执行成功。
