---
{
    "title": "BITMAP_HAS_ANY",
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

Determines whether two Bitmaps share any common elements.

## Syntax

```sql
BITMAP_HAS_ANY(<bitmap1>, <bitmap2>)
```

## Parameters

| Parameter   | Description          |
|-------------|----------------------|
| `<bitmap1>` | The first Bitmap     |
| `<bitmap2>` | The second Bitmap    |

## Return Value

Returns true if the two Bitmaps have any common elements;  
Returns false if the two Bitmaps do not have any common elements.

## Examples

```sql
mysql> select bitmap_has_any(to_bitmap(1), to_bitmap(2));
```

```text
+--------------------------------------------+
| bitmap_has_any(to_bitmap(1), to_bitmap(2)) |
+--------------------------------------------+
|                                          0 |
+--------------------------------------------+
```

```sql
mysql> select bitmap_has_any(to_bitmap(1), to_bitmap(1));
```

```text
+--------------------------------------------+
| bitmap_has_any(to_bitmap(1), to_bitmap(1)) |
+--------------------------------------------+
|                                          1 |
+--------------------------------------------+
```
