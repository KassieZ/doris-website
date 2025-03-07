---
{
    "title": "ARRAYS_OVERLAP",
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


## Description

Determine whether the left and right arrays contain common elements

## Syntax

```sql
ARRAYS_OVERLAP(<left>, <right>)
```

## Parameters

| Parameter | Description |
|--|--|
| `<left>` | The array to be judged |
| `<right>` | The array to be judged |

## Return Value

Returns the judgment result: 1: left and right arrays have common elements; 0: left and right arrays do not have common elements; NULL: left or right array is NULL; or any element in left and right array is NULL

## Example

```sql
SELECT ARRAYS_OVERLAP(['a', 'b', 'c'], [1, 2, 'b']);
```

```text
+--------------------------------------------------+
| arrays_overlap(['a', 'b', 'c'], ['1', '2', 'b']) |
+--------------------------------------------------+
|                                                1 |
+--------------------------------------------------+
```
