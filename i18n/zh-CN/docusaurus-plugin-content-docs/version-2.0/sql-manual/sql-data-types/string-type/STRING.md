---
{
    "title": "STRING",
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


## description

STRING
    

变长字符串，默认支持 1048576 字节（1MB），可调大到 2147483643 字节（2G），可通过 be 配置 `string_type_length_soft_limit_bytes`调整。String 类型只能用在 value 列，不能用在 key 列和分区 分桶列
 String 类型只能用在 value 列，不能用在 key 列和分区分桶列。
    

注意：变长字符串是以 UTF-8 编码存储的，因此通常英文字符占 1 个字节，中文字符占 3 个字节。

