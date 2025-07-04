---
{
    "title": "ALTER-VIEW",
    "language": "en"
}
---

## ALTER-VIEW

### Name

ALTER VIEW

### Description

This statement is used to modify the definition of a view

grammar:

```sql
ALTER VIEW
[db_name.]view_name
(column1[ COMMENT "col comment"][, column2, ...])
AS query_stmt
```

illustrate:

- Views are all logical, and the data in them will not be stored on physical media. When querying, the view will be used as a subquery in the statement. Therefore, modifying the definition of the view is equivalent to modifying query_stmt.
- query_stmt is any supported SQL

### Example

1. Modify the view example_view on example_db

```sql
ALTER VIEW example_db.example_view
(
c1 COMMENT "column 1",
c2 COMMENT "column 2",
c3 COMMENT "column 3"
)
AS SELECT k1, k2, SUM(v1) FROM example_table
GROUP BY k1, k2
```

### Keywords

```text
ALTER, VIEW
```

### Best Practice

