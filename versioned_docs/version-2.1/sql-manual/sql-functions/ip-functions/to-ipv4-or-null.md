---
{
"title": "TO_IPV4_OR_NULL",
"language": "en"
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

## TO_IPV4_OR_NULL

TO_IPV4_OR_NULL

### Description

#### Syntax

`IPV4 TO_IPV4_OR_NULL(STRING ipv4_str)`

Same as to_ipv4, but if the IPv4 address has an invalid format, it returns NULL.

#### Notice

`If input is NULL, return NULL.`

### Example

```sql
mysql> select to_ipv4_or_null('.');
+----------------------+
| to_ipv4_or_null('.') |
+----------------------+
| NULL                 |
+----------------------+

mysql> select to_ipv4_or_null(NULL);
+-----------------------+
| to_ipv4_or_null(NULL) |
+-----------------------+
| NULL                  |
+-----------------------+
```

### Keywords

TO_IPV4_OR_NULL, IP
