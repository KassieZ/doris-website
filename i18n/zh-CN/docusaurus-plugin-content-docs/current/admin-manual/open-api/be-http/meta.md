---
{
    "title": "查询元信息",
    "language": "zh-CN"
}
---

<!-- 
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->



## 请求路径

`GET /api/meta/header/{tablet_id}?byte_to_base64={bool}`

## 描述

查询 tablet 元信息

## Path parameters

* `tablet_id`
    table 的 id

## 请求参数

* `byte_to_base64`
    是否按 base64 编码，选填，默认`false`。

## 请求体

无

## 响应

    ```json
    {
        "table_id": 148107,
        "partition_id": 148104,
        "tablet_id": 148193,
        "schema_hash": 2090621954,
        "shard_id": 38,
        "creation_time": 1673253868,
        "cumulative_layer_point": -1,
        "tablet_state": "PB_RUNNING",
        ...
    }
    ```
## 示例


    ```shell
    curl "http://127.0.0.1:8040/api/meta/header/148193&byte_to_base64=true"

    ```

