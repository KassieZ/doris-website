---
{
"title": "RESUME JOB",
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

RESUME JOB

## 描述

将处于 PAUSED 状态的 JOB 恢复为 RUNNING 状态。RUNNING 状态的 JOB 将会根据既定的调度周期去执行。

```sql
RESUME JOB where jobName = jobName;
```

## Examples

1. 恢复运行名称为 example 的 JOB。

   ```sql
   RESUME JOB where jobName= 'example';
   ```

## 关键词

        RESUME, JOB

## 最佳实践
