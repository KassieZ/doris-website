---
{
    "title": "CREATE DATABASE",
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


### Name

CREATE DATABASE

## 描述

该语句用于新建数据库（database）

语法：

```sql
CREATE DATABASE [IF NOT EXISTS] db_name
    [PROPERTIES ("key"="value", ...)];
```

`PROPERTIES` 该数据库的附加信息，可以缺省。


- 如果要为 db 下的 table 指定默认的副本分布策略，需要指定`replication_allocation`（table 的`replication_allocation`属性优先级会高于 db）

  ```sql
  PROPERTIES (
    "replication_allocation" = "tag.location.default:3"
  )
  ```

## Examples

1. 新建数据库 db_test

   ```sql
   CREATE DATABASE db_test;
   ```

2. 新建数据库并设置默认的副本分布：

   ```sql
   CREATE DATABASE `db_test`
   PROPERTIES (
   	"replication_allocation" = "tag.location.group_1:3"
   );
   ```

:::caution

若建表语句属性 key 带 replication_allocation 或 replication_num，则 db 的默认的副本分布策略不会生效

:::

## 关键词


CREATE, DATABASE


## 最佳实践
