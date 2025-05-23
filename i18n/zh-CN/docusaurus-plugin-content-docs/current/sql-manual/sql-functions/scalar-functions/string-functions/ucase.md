---
{
    "title": "UCASE",
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


## 描述

用于将字符串转换为大写字母

## 别名

- UPPER

## 语法

```sql
UCASE( <str> )
```
## 必选参数

| 参数 | 描述 |
|------|------|
| `<str>` | 需转换为大写字母的字符串 |

## 返回值

转换大写字母后的值

### 示例

```sql
SELECT ucase("aBc123");
```
```sql
+-----------------+
| ucase('aBc123') |
+-----------------+
| ABC123          |
+-----------------+
```
