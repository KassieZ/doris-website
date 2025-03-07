---
{
    "title": "IPV4_TO_IPV6",
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
接受一个类型为 IPv4 的地址，返回相应 IPv6 的形式。

## 语法
```sql
IPV4_TO_IPV6(<ipv4>)
```

## 参数
| Parameter | Description                                      |
|-----------|--------------------------------------------------|
| `<ipv4>`      | ipv4 类型的地址 |

## 返回值
返回转化后的 ipv6 地址

## 举例
```sql
select ipv6_num_to_string(ipv4_to_ipv6(to_ipv4('192.168.0.1')));
```
```text
+----------------------------------------------------------+
| ipv6_num_to_string(ipv4_to_ipv6(to_ipv4('192.168.0.1'))) |
+----------------------------------------------------------+
| ::ffff:192.168.0.1                                       |
+----------------------------------------------------------+
```
