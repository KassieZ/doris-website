---
{
    "title": "procs_priv",
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

## 概述

此表仅用于兼容 MySQL 行为。永远为空。

## 所属数据库


`mysql`


## 表信息

| 列名         | 类型     | 说明 |
| :----------- | :------- | :--- |
| host         | char(60) |      |
| db           | char(64) |      |
| user         | char(32) |      |
| routine_name | char(64) |      |
| routine_type | char(9)  |      |
| grantor      | char(93) |      |
| proc_priv    | char(16) |      |
| timestamp    | char(1)  |      |