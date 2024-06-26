---
{
    "title": "TRUNCATE",
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

## truncate

### description
#### Syntax
`DOUBLE truncate(DOUBLE x, INT d)`  

Numerically truncate `x` according to the number of decimal places `d`.  

The rules are as follows:  

If `d` is literal:  
When `d > 0`: keep `d` decimal places of `x`  
When `d = 0`: remove the fractional part of `x` and keep only the integer part  
When `d < 0`: Remove the fractional part of `x`, and replace the integer part with the number `0` according to the number of digits specified by `d`  

Else if `d` is a column, and `x` has Decimal type, scale of result Decimal will always be same with input Decimal.

### example

```
mysql> select truncate(124.3867, 2);
+-----------------------+
| truncate(124.3867, 2) |
+-----------------------+
|                124.38 |
+-----------------------+
mysql> select truncate(124.3867, 0);
+-----------------------+
| truncate(124.3867, 0) |
+-----------------------+
|                   124 |
+-----------------------+
mysql> select truncate(-124.3867, -2);
+-------------------------+
| truncate(-124.3867, -2) |
+-------------------------+
|                    -100 |
+-------------------------+
mysql> select cast("123.123456" as Decimal(9,6)), number, truncate(cast ("123.123456" as Decimal(9,6)), number) from numbers("number"="5");
--------------
+---------------------------------------+--------+----------------------------------------------------------------------+
| cast('123.123456' as DECIMALV3(9, 6)) | number | truncate(cast('123.123456' as DECIMALV3(9, 6)), cast(number as INT)) |
+---------------------------------------+--------+----------------------------------------------------------------------+
|                            123.123456 |      0 |                                                           123.000000 |
|                            123.123456 |      1 |                                                           123.100000 |
|                            123.123456 |      2 |                                                           123.120000 |
|                            123.123456 |      3 |                                                           123.123000 |
|                            123.123456 |      4 |                                                           123.123400 |
+---------------------------------------+--------+----------------------------------------------------------------------+
```

### keywords
	TRUNCATE
