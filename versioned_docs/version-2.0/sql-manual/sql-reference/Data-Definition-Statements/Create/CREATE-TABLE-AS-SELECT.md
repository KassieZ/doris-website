---
{
    "title": "CREATE-TABLE-AS-SELECT",
    "language": "en"
}
---

## CREATE-TABLE-AS-SELECT

### Name

CREATE TABLE AS SELECT

### Description

This statement creates the table structure by returning the results from the Select statement and imports the data at the same time

grammar：

```sql
CREATE TABLE table_name [( column_name_list )]
    opt_engine:engineName
    opt_keys:keys
    opt_comment:tableComment
    opt_partition:partition
    opt_distribution:distribution
    opt_rollup:index
    opt_properties:tblProperties
    opt_ext_properties:extProperties
    KW_AS query_stmt:query_def
 ```

illustrate: 

- The user needs to have`SELECT`permission for the source table and`CREATE`permission for the target database
- After a table is created, data is imported. If the import fails, the table is deleted
- You can specify the key type. The default key type is `Duplicate Key`

:::tip Tips
This feature is supported since the Apache Doris 1.2 version
:::

- All columns of type string (varchar/var/string) are created as type "string".
- If the created source is an external table and the first column is of type String, the first column is automatically set to VARCHAR(65533). Because of Doris internal table, String column is not allowed as first column.



### Example

1. Using the field names in the SELECT statement

    ```sql
    create table `test`.`select_varchar` 
    PROPERTIES("replication_num" = "1") 
    as select * from `test`.`varchar_table`
    ```

2. Custom field names (need to match the number of fields returned)
    ```sql
    create table `test`.`select_name`(user, testname, userstatus) 
    PROPERTIES("replication_num" = "1") 
    as select vt.userId, vt.username, jt.status 
    from `test`.`varchar_table` vt join 
    `test`.`join_table` jt on vt.userId=jt.userId
    ```

3. Specify table model, partitions, and buckets
    ```sql
    CREATE TABLE t_user(dt, id, name)
    ENGINE=OLAP
    UNIQUE KEY(dt, id)
    COMMENT "OLAP"
    PARTITION BY RANGE(dt)
    (
       FROM ("2020-01-01") TO ("2021-12-31") INTERVAL 1 YEAR
    )
    DISTRIBUTED BY HASH(id) BUCKETS 1
    PROPERTIES("replication_num"="1")
    AS SELECT cast('2020-05-20' as date) as dt, 1 as id, 'Tom' as name;
    ```
   
### Keywords

    CREATE, TABLE, AS, SELECT

### Best Practice

