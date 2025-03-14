---
{
    "title": "外表统计信息",
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



外表统计信息的收集方式和收集内容与内表基本一致，目前支持对 Hive，Iceberg 和 Hudi 等外部表的收集。

自 2.0.3 版本之后，Hive 外表支持了自动和采样收集。

## 注意事项

1. HMS 类型的 Iceberg 和 Hudi 外表，以及 JDBC 外表只支持手动全量收集。其他类型的外表暂不支持统计信息收集。

2. 外表默认关闭自动统计信息收集功能，需要在创建 Catalog 的时候添加属性来打开，或者通过设置 Catalog 属性来开启或关闭。

### 创建 Catalog 时打开自动收集的属性 (默认是 false）：

```SQL
'enable.auto.analyze' = 'true'
```

### 通过修改 Catalog 属性控制是否开启自动收集：

```sql
ALTER CATALOG external_catalog SET PROPERTIES ('enable.auto.analyze'='true'); // 打开自动收集
ALTER CATALOG external_catalog SET PROPERTIES ('enable.auto.analyze'='false'); // 关闭自动收集
```
