---
{
    "title": "Iceberg Catalog",
    "language": "zh-CN"
}
---

## 使用限制

1. 支持 Iceberg V1/V2 表格式。
2. V2 格式仅支持 Position Delete 方式，不支持 Equality Delete。
3. 支持 Parquet 文件格式。

## 创建 Catalog

### 基于 Hive Metastore 创建 Catalog

和 Hive Catalog 基本一致，这里仅给出简单示例。其他示例可参阅 [Hive Catalog](../../lakehouse/datalake/hive)。

```sql
CREATE CATALOG iceberg PROPERTIES (
    'type'='hms',
    'hive.metastore.uris' = 'thrift://172.21.0.1:7004',
    'hadoop.username' = 'hive',
    'dfs.nameservices'='your-nameservice',
    'dfs.ha.namenodes.your-nameservice'='nn1,nn2',
    'dfs.namenode.rpc-address.your-nameservice.nn1'='172.21.0.2:4007',
    'dfs.namenode.rpc-address.your-nameservice.nn2'='172.21.0.3:4007',
    'dfs.client.failover.proxy.provider.your-nameservice'='org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider'
);
```

### 基于 Iceberg API 创建 Catalog

使用 Iceberg API 访问元数据的方式，支持 Hadoop File System、Hive、REST、Glue、DLF 等服务作为 Iceberg 的 Catalog。

**Hadoop Catalog**

```sql
CREATE CATALOG iceberg_hadoop PROPERTIES (
    'type'='iceberg',
    'iceberg.catalog.type' = 'hadoop',
    'warehouse' = 'hdfs://your-host:8020/dir/key'
);
```

```sql
CREATE CATALOG iceberg_hadoop_ha PROPERTIES (
    'type'='iceberg',
    'iceberg.catalog.type' = 'hadoop',
    'warehouse' = 'hdfs://your-nameservice/dir/key',
    'dfs.nameservices'='your-nameservice',
    'dfs.ha.namenodes.your-nameservice'='nn1,nn2',
    'dfs.namenode.rpc-address.your-nameservice.nn1'='172.21.0.2:4007',
    'dfs.namenode.rpc-address.your-nameservice.nn2'='172.21.0.3:4007',
    'dfs.client.failover.proxy.provider.your-nameservice'='org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider'
);
```

**Hive Metastore**

```sql
CREATE CATALOG iceberg PROPERTIES (
    'type'='iceberg',
    'iceberg.catalog.type'='hms',
    'hive.metastore.uris' = 'thrift://172.21.0.1:7004',
    'hadoop.username' = 'hive',
    'dfs.nameservices'='your-nameservice',
    'dfs.ha.namenodes.your-nameservice'='nn1,nn2',
    'dfs.namenode.rpc-address.your-nameservice.nn1'='172.21.0.2:4007',
    'dfs.namenode.rpc-address.your-nameservice.nn2'='172.21.0.3:4007',
    'dfs.client.failover.proxy.provider.your-nameservice'='org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider'
);
```

**AWS Glue**

```sql
CREATE CATALOG glue PROPERTIES (
    "type"="iceberg",
    "iceberg.catalog.type" = "glue",
    "glue.endpoint" = "https://glue.us-east-1.amazonaws.com",
    "glue.access_key" = "ak",
    "glue.secret_key" = "sk"
);
```

Iceberg 属性详情参见 [Iceberg Glue Catalog](https://iceberg.apache.org/docs/latest/aws/#glue-catalog)

**阿里云 DLF**

参见[阿里云 DLF Catalog 配置](../lakehouse/datalake-analytics/dlf.md)

**REST Catalog**

该方式需要预先提供 REST 服务，用户需实现获取 Iceberg 元数据的 REST 接口。

```sql
CREATE CATALOG iceberg PROPERTIES (
    'type'='iceberg',
    'iceberg.catalog.type'='rest',
    'uri' = 'http://172.21.0.1:8181'
);
```

如果使用 HDFS 存储数据，并开启了高可用模式，还需在 Catalog 中增加 HDFS 高可用配置：

```sql
CREATE CATALOG iceberg PROPERTIES (
    'type'='iceberg',
    'iceberg.catalog.type'='rest',
    'uri' = 'http://172.21.0.1:8181',
    'dfs.nameservices'='your-nameservice',
    'dfs.ha.namenodes.your-nameservice'='nn1,nn2',
    'dfs.namenode.rpc-address.your-nameservice.nn1'='172.21.0.1:8020',
    'dfs.namenode.rpc-address.your-nameservice.nn2'='172.21.0.2:8020',
    'dfs.client.failover.proxy.provider.your-nameservice'='org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider'
);
```

**Google Dataproc Metastore**

```sql
CREATE CATALOG iceberg PROPERTIES (
    "type"="iceberg",
    "iceberg.catalog.type"="hms",
    "hive.metastore.uris" = "thrift://172.21.0.1:9083",
    "gs.endpoint" = "https://storage.googleapis.com",
    "gs.region" = "us-east-1",
    "gs.access_key" = "ak",
    "gs.secret_key" = "sk",
    "use_path_style" = "true"
);
```

`hive.metastore.uris`: Dataproc Metastore 服务开放的接口，在 Metastore 管理页面获取：[Dataproc Metastore Services](https://console.cloud.google.com/dataproc/metastore).

### Iceberg On Object Storage

若数据存放在 S3 上，properties 中可以使用以下参数：

```
"s3.access_key" = "ak"
"s3.secret_key" = "sk"
"s3.endpoint" = "s3.us-east-1.amazonaws.com"
"s3.region" = "us-east-1"
```

数据存放在阿里云 OSS 上：

```
"oss.access_key" = "ak"
"oss.secret_key" = "sk"
"oss.endpoint" = "oss-cn-beijing-internal.aliyuncs.com"
"oss.region" = "oss-cn-beijing"
```

数据存放在腾讯云 COS 上：

```
"cos.access_key" = "ak"
"cos.secret_key" = "sk"
"cos.endpoint" = "cos.ap-beijing.myqcloud.com"
"cos.region" = "ap-beijing"
```

数据存放在华为云 OBS 上：

```
"obs.access_key" = "ak"
"obs.secret_key" = "sk"
"obs.endpoint" = "obs.cn-north-4.myhuaweicloud.com"
"obs.region" = "cn-north-4"
```

## 列类型映射

| Iceberg Type                               | Doris Type   |
|--------------------------------------------|--------------|
| boolean                                    | boolean      |
| int                                        | int          |
| long                                       | bigint       |
| float                                      | float        |
| double                                     | double       |
| decimal(p,s)                               | decimal(p,s) |
| date                                       | date         |
| uuid                                       | string       |
| timestamp (Timestamp without timezone)     | datetime(6)  |
| timestamptz (Timestamp with timezone)      | datetime(6)  |
| string                                     | string       |
| fixed(L)                                   | char(L)      |
| binary                                     | string       |
| list                                       | array        |
| struct                                     | 不支持        |
| map                                        | 不支持        |
| time                                       | 不支持        |

## Time Travel

支持读取 Iceberg 表指定的 Snapshot。

每一次对 iceberg 表的写操作都会产生一个新的快照。

默认情况下，读取请求只会读取最新版本的快照。

可以使用 `FOR TIME AS OF` 和 `FOR VERSION AS OF` 语句，根据快照 ID 或者快照产生的时间读取历史版本的数据。示例如下：

`SELECT * FROM iceberg_tbl FOR TIME AS OF "2022-10-07 17:20:37";`

`SELECT * FROM iceberg_tbl FOR VERSION AS OF 868895038966572;`

另外，可以使用 [iceberg_meta](../../sql-manual/sql-functions/table-functions/iceberg-meta) 表函数查询指定表的 snapshot 信息。

