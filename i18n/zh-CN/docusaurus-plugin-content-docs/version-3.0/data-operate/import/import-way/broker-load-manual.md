---
{
    "title": "Broker Load",
    "language": "zh-CN"
}
---

Broker Load 通过 MySQL API 发起，Doris 会根据 LOAD 语句中的信息，主动从数据源拉取数据。Broker Load 是一个异步导入方式，需要通过 SHOW LOAD 语句查看导入进度和导入结果。

Broker Load 适合源数据存储在远程存储系统，比如对象存储或 HDFS，且数据量比较大的场景。 
从 HDFS 或者 S3 直接读取，也可以通过 [湖仓一体/TVF](../../../data-operate/import/file-format/csv#TVF 导入) 中的 HDFS TVF 或者 S3 TVF 进行导入。基于 TVF 的 Insert Into 当前为同步导入，Broker Load 是一个异步的导入方式。

在 Doris 早期版本中，S3 Load 和 HDFS Load 都是通过 `WITH BROKER` 连接到具体的 Broker 进程实现的。
随着版本的更新，S3 Load 和 HDFS Load 作为最常用的导入方式得到了优化，现在它们不再依赖额外的 Broker 进程，但仍然使用与 Broker Load 类似的语法。
由于历史原因以及语法上的相似，S3 Load、HDFS Load 和 Broker Load 这三种导入方式被统称为 Broker Load。

## 使用限制

支持的存储后端：

- S3 协议
- HDFS 协议
- 其他协议（需要相应的 Broker 进程）

支持的数据类型：

- CSV
- JSON
- PARQUET
- ORC

支持的压缩类型：

- PLAIN
- GZ
- LZO
- BZ2
- LZ4FRAME
- DEFLATE
- LZOP
- LZ4BLOCK
- SNAPPYBLOCK
- ZLIB
- ZSTD

## 基本原理

用户在提交导入任务后，FE 会生成对应的 Plan 并根据目前 BE 的个数和文件的大小，将 Plan 分给 多个 BE 执行，每个 BE 执行一部分导入数据。

BE 在执行的过程中会从 Broker 拉取数据，在对数据转换之后将数据导入系统。所有 BE 均完成导入，由 FE 最终决定导入是否成功。

![Broker Load 基本原理](/images/broker-load.png)

从上图中可以看到，BE 会依赖 Broker 进程来读取相应远程存储系统的数据。之所以引入 Broker 进程，主要是用来针对不同的远程存储系统，用户可以按照 Broker 进程的标准开发其相应的 Broker 进程，Broker 进程可以使用 Java 程序开发，更好的兼容大数据生态中的各类存储系统。由于 broker 进程和 BE 进程的分离，也确保了两个进程的错误隔离，提升 BE 的稳定性。

当前 BE 内置了对 HDFS 和 S3 两个 Broker 的支持，所以如果从 HDFS 和 S3 中导入数据，则不需要额外启动 Broker 进程。如果有自己定制的 Broker 实现，则需要部署相应的 Broker 进程。

## 快速上手

本节演示了一个 S3 Load 示例。具体的使用语法，请参考 SQL 手册中的 [Broker Load](../../../sql-manual/sql-statements/data-modification/load-and-export/BROKER-LOAD)。

### 前置检查

1. Doris 表权限

Broker Load 需要对目标表的 INSERT 权限。如果没有 INSERT 权限，可以通过 [GRANT](../../../sql-manual/sql-statements/account-management/GRANT-TO) 命令给用户授权。

2. S3 认证和连接信息

这里以 AWS S3 为例，从其他对象存储系统导入也可以作为参考。

- AK 和 SK：首先需要找到或者重新生成 AWS `Access keys`，可以在 AWS console 的 `My Security Credentials` 找到生成方式。

- REGION 和 ENDPOINT：REGION 可以在创建桶的时候选择也可以在桶列表中查看到。每个 REGION 的 S3 ENDPOINT 可以通过如下页面查到 [AWS 文档](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region)。

### 创建导入作业

1. 创建 CSV 文件 brokerload_example.csv 文件存储在 S3 上，其内容如下：

```
1,Emily,25
2,Benjamin,35
3,Olivia,28
4,Alexander,60
5,Ava,17
6,William,69
7,Sophia,32
8,James,64
9,Emma,37
10,Liam,64
```

2. 创建导入 Doris 表

在 Doris 中创建被导入的表，具体语法如下：

```sql
CREATE TABLE testdb.test_brokerload(
    user_id            BIGINT       NOT NULL COMMENT "user id",
    name               VARCHAR(20)           COMMENT "name",
    age                INT                   COMMENT "age"
)
DUPLICATE KEY(user_id)
DISTRIBUTED BY HASH(user_id) BUCKETS 10;
```

3. 使用 Broker Load 从 S3 导入数据。其中 bucket 名称和 S3 认证信息要根据实际填写：

```sql
    LOAD LABEL broker_load_2022_04_01
    (
        DATA INFILE("s3://your_bucket_name/brokerload_example.csv")
        INTO TABLE test_brokerload
        COLUMNS TERMINATED BY ","
        FORMAT AS "CSV"
        (user_id, name, age)
    )
    WITH S3
    (
        "provider" = "S3",
        "AWS_ENDPOINT" = "s3.us-west-2.amazonaws.com",
        "AWS_ACCESS_KEY" = "<your-ak>",
        "AWS_SECRET_KEY"="<your-sk>",
        "AWS_REGION" = "us-west-2",
        "compress_type" = "PLAIN"
    )
    PROPERTIES
    (
        "timeout" = "3600"
    );
```

其中 `provider` 字段需要根据实际的对象存储服务商填写。
Doris 支持的 provider 列表：

- "S3" (亚马逊 AWS)
- "AZURE" (微软 Azure)
- "GCP" (谷歌 GCP)
- "OSS" (阿里云)
- "COS" (腾讯云)
- "OBS" (华为云)
- "BOS" (百度云)

如不在列表中 (例如 MinIO)，可以尝试使用 "S3" (兼容 AWS 模式)

### 查看导入作业

Broker Load 是一个异步的导入方式，具体导入结果可以通过 [SHOW LOAD](../../../sql-manual/sql-statements/data-modification/load-and-export/SHOW-LOAD) 命令查看

```sql
mysql> show load order by createtime desc limit 1\G;
*************************** 1. row ***************************
         JobId: 41326624
         Label: broker_load_2022_04_01
         State: FINISHED
      Progress: ETL:100%; LOAD:100%
          Type: BROKER
       EtlInfo: unselected.rows=0; dpp.abnorm.ALL=0; dpp.norm.ALL=27
      TaskInfo: cluster:N/A; timeout(s):1200; max_filter_ratio:0.1
      ErrorMsg: NULL
    CreateTime: 2022-04-01 18:59:06
  EtlStartTime: 2022-04-01 18:59:11
 EtlFinishTime: 2022-04-01 18:59:11
 LoadStartTime: 2022-04-01 18:59:11
LoadFinishTime: 2022-04-01 18:59:11
           URL: NULL
    JobDetails: {"Unfinished backends":{"5072bde59b74b65-8d2c0ee5b029adc0":[]},"ScannedRows":27,"TaskNumber":1,"All backends":{"5072bde59b74b65-8d2c0ee5b029adc0":[36728051]},"FileNumber":1,"FileSize":5540}
1 row in set (0.01 sec)
```

### 取消导入作业

当 Broker load 作业状态不为 CANCELLED 或 FINISHED 时，可以被用户手动取消。取消时需要指定待取消导入任务的 Label。取消导入命令语法可参考 [CANCEL LOAD](../../../sql-manual/sql-statements/data-modification/load-and-export/CANCEL-LOAD) 查看。

例如：取消数据库 demo 上，label 为 broker_load_2022_04_01 的导入作业

```SQL
CANCEL LOAD FROM demo WHERE LABEL = "broker_load_2022_04_01";
```

## 参考手册

### 导入命令

```sql
LOAD LABEL load_label
(
data_desc1[, data_desc2, ...]
[format_properties]
)
WITH [S3|HDFS|BROKER broker_name] 
[broker_properties]
[load_properties]
[COMMENT "comments"];
```

其中 WITH 子句指定了如何访问存储系统，`broker_properties` 是该访问方式的配置参数：

- `S3`: 使用 S3 协议的存储系统
- `HDFS`: 使用 HDFS 协议的存储系统
- `BROKER broker_name`: 其他协议的存储系统。可以通过 `SHOW BROKER` 查看目前可选的 broker_name 列表。更多信息见常见问题中的 "其他 Broker 导入"

### 导入配置参数

**导入参数（Load Properties）**

| Property 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| "timeout" | Long | 14400 | 导入的超时时间，单位秒。范围是 1 秒 ~ 259200 秒。 |
| "max_filter_ratio" | Float | 0.0 | 最大容忍可过滤（数据不规范等原因）的数据比例，默认零容忍。取值范围是 0~1。当导入的错误率超过该值，则导入失败。数据不规范不包括通过 where 条件过滤掉的行。 |
| "strict_mode" | Boolean | false | 是否开启严格模式。 |
| "partial_columns" | Boolean | false | 是否使用部分列更新，只在表模型为 Unique Key 且采用 Merge on Write 时有效。 |
| "timezone" | String | "Asia/Shanghai" | 本次导入所使用的时区。该参数会影响所有导入涉及的和时区有关的函数结果。 |
| "load_parallelism" | Integer | 8 | 每个 BE 上并发 instance 数量的上限。 |
| "send_batch_parallelism" | Integer | 1 | sink 节点发送数据的并发度，仅在关闭 memtable 前移时生效。 |
| "load_to_single_tablet" | Boolean | "false" | 是否每个分区只导入一个 tablet，默认值为 false。该参数只允许在对带有 random 分桶的 OLAP 表导数的时候设置。 |
| "priority" | "HIGH" 或 "NORMAL" 或 "LOW" | "NORMAL" | 导入任务的优先级。 |

**格式参数（Format Properties）**

| 参数名 | 类型 | 默认值 | 描述 |
|---------------------|----------|----------------|-------------|
| `skip_lines` | Integer | `0` | 跳过 CSV 文件开头的若干行。当格式为 `csv_with_names` 或 `csv_with_names_and_types` 时，此参数无效。 |
| `trim_double_quotes` | Boolean | `false` | 是否去除字段外层的双引号。 |
| `enclose` | String | `""` | 字段包含换行符或分隔符时的包裹字符。例如，分隔符为 `,`，包裹字符为 `'` 时，`'b,c'` 会被解析为一个字段。 |
| `escape` | String | `""` | 用于转义包裹字符的转义字符。例如转义字符为 `\`，包裹字符为 `'`，字段 `'b,\'c'` 会被正确解析为 `'b,'c'`。 |

**注意：**格式参数用于定义如何解析源文件（如分隔符、引号处理），应在 `LOAD` 语句内部的 `PROPERTIES` 中设置。导入参数用于控制导入行为（如超时、重试），应在 `LOAD` 语句外部的最外层 `PROPERTIES` 块中设置。

```sql
LOAD LABEL s3_load_example (
    DATA INFILE("s3://bucket/path/file.csv")
    INTO TABLE users
    COLUMNS TERMINATED BY ","
    FORMAT AS "CSV"
    (user_id, name, age)
    PROPERTIES (
        "trim_double_quotes" = "true"  -- 格式参数
    )
)
WITH S3 (
    ...
)
PROPERTIES (
    "timeout" = "3600"  -- 导入参数
);
```

**fe.conf**

下面几个配置属于 Broker load 的系统级别配置，也就是作用于所有 Broker load 导入任务的配置。主要通过修改 `fe.conf`来调整配置值。

| Session Variable | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| min_bytes_per_broker_scanner | Long | 67108864 (64 MB) | 一个 Broker Load 作业中单 BE 处理的数据量的最小值，单位：字节。 |
| max_bytes_per_broker_scanner | Long | 536870912000 (500 GB) | 一个 Broker Load 作业中单 BE 处理的数据量的最大值，单位：字节。通常一个导入作业支持的最大数据量为 `max_bytes_per_broker_scanner * BE 节点数`。如果需要导入更大数据量，则需要适当调整 `max_bytes_per_broker_scanner` 参数的大小。 |
| max_broker_concurrency | Integer | 10 | 限制了一个作业的最大的导入并发数。 |
| default_load_parallelism | Integer | 8 | 每个 BE 节点最大并发 instance 数 |
| broker_load_default_timeout_second | 14400 | Broker Load 导入的默认超时时间，单位：秒。 |

注：最小处理的数据量，最大并发数，源文件的大小和当前集群 BE 的数量共同决定了本次导入的并发数。

```Plain
本次导入并发数 = Math.min(源文件大小/min_bytes_per_broker_scanner，max_broker_concurrency，当前BE节点个数 * load_parallelism)
本次导入单个BE的处理量 = 源文件大小/本次导入的并发数
```

**session variable**

| Session Variable | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| time_zone | String | "Asia/Shanghai" | 默认时区，会影响导入中时区相关的函数结果。 |
| send_batch_parallelism | Integer | 1 | sink 节点发送数据的并发度，仅在关闭 memtable 前移时生效。 |


## 常见问题

### 常见报错

**1. 导入报错：`Scan bytes per broker scanner exceed limit:xxx`**

请参考文档中最佳实践部分，修改 FE 配置项 `max_bytes_per_broker_scanner` 和 `max_broker_concurrency`

**2. 导入报错：`failed to send batch` 或 `TabletWriter add batch with unknown id`**

适当修改 `query_timeout` 和 `streaming_load_rpc_max_alive_time_sec`。

**3. 导入报错：`LOAD_RUN_FAIL; msg:Invalid Column Name:xxx`**

如果是 PARQUET 或者 ORC 格式的数据，则文件头的列名需要与 Doris 表中的列名保持一致，如：

```sql
(tmp_c1,tmp_c2)
SET
(
    id=tmp_c2,
    name=tmp_c1
)
```

代表获取在 parquet 或 orc 中以 (tmp_c1, tmp_c2) 为列名的列，映射到 doris 表中的 (id, name) 列。如果没有设置 set, 则以 column 中的列作为映射。

注：如果使用某些 hive 版本直接生成的 orc 文件，orc 文件中的表头并非 hive meta 数据，而是（_col0, _col1, _col2, ...）, 可能导致 Invalid Column Name 错误，那么则需要使用 set 进行映射

**4. 导入报错：`Failed to get S3 FileSystem for bucket is null/empty`**

Bucket 信息填写不正确或者不存在。或者 bucket 的格式不受支持。使用 GCS 创建带`_`的桶名时，比如：`s3://gs_bucket/load_tbl`，S3 Client 访问 GCS 会报错，建议创建 bucket 路径时不使用`_`。

**5. 导入超时**

导入的 timeout 默认超时时间为 4 小时。如果超时，不推荐用户将导入最大超时时间直接改大来解决问题。单个导入时间如果超过默认的导入超时时间 4 小时，最好是通过切分待导入文件并且分多次导入来解决问题。因为超时时间设置过大，那么单次导入失败后重试的时间成本很高。

可以通过如下公式计算出 Doris 集群期望最大导入文件数据量：

```Plain
期望最大导入文件数据量 = 14400s * 10M/s * BE 个数
比如：集群的 BE 个数为 10个
期望最大导入文件数据量 = 14400s * 10M/s * 10 = 1440000M ≈ 1440G

注意：一般用户的环境可能达不到 10M/s 的速度，所以建议超过 500G 的文件都进行文件切分，再导入。
```

### S3 Load URL 访问方式

- S3 SDK 默认使用 virtual-hosted-style 方式。但某些对象存储系统可能没开启或没支持 virtual-hosted-style 方式的访问，此时我们可以添加 `use_path_style` 参数来强制使用 path-style 方式：

  ```sql
    WITH S3
    (
          "AWS_ENDPOINT" = "AWS_ENDPOINT",
          "AWS_ACCESS_KEY" = "AWS_ACCESS_KEY",
          "AWS_SECRET_KEY"="AWS_SECRET_KEY",
          "AWS_REGION" = "AWS_REGION",
          "use_path_style" = "true"
    )
  ```

### S3 Load 临时密钥

- 支持使用临时密钥 (TOKEN) 访问所有支持 S3 协议的对象存储，用法如下：

  ```sql
    WITH S3
    (
        "AWS_ENDPOINT" = "AWS_ENDPOINT",
        "AWS_ACCESS_KEY" = "AWS_TEMP_ACCESS_KEY",
        "AWS_SECRET_KEY" = "AWS_TEMP_SECRET_KEY",
        "AWS_TOKEN" = "AWS_TEMP_TOKEN",
        "AWS_REGION" = "AWS_REGION"
    )
  ```

### HDFS 认证方式

1. 简单认证

简单认证即 Hadoop 配置 `hadoop.security.authentication` 为 `simple`。

```Plain
(
    "username" = "user",
    "password" = ""
);
```

username 配置为要访问的用户，密码置空即可。

2. Kerberos 认证

该认证方式需提供以下信息：

- `hadoop.security.authentication`：指定认证方式为 Kerberos。

- `hadoop.kerberos.principal`：指定 Kerberos 的 principal。

- `hadoop.kerberos.keytab`：指定 Kerberos 的 keytab 文件路径。该文件必须为 Broker 进程所在服务器上的文件的绝对路径。并且可以被 Broker 进程访问。

- `kerberos_keytab_content`：指定 Kerberos 中 keytab 文件内容经过 base64 编码之后的内容。这个跟 `kerberos_keytab` 配置二选一即可。

示例如下：

```Plain
(
    "hadoop.security.authentication" = "kerberos",
    "hadoop.kerberos.principal" = "doris@YOUR.COM",
    "hadoop.kerberos.keytab" = "/home/doris/my.keytab"
)
(
    "hadoop.security.authentication" = "kerberos",
    "hadoop.kerberos.principal" = "doris@YOUR.COM",
    "kerberos_keytab_content" = "ASDOWHDLAWIDJHWLDKSALDJSDIWALD"
)
```

采用 Kerberos 认证方式，需要 [krb5.conf (opens new window)](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/conf_files/krb5_conf.html) 文件，krb5.conf 文件包含 Kerberos 的配置信息，通常，应该将 krb5.conf 文件安装在目录/etc 中。可以通过设置环境变量 KRB5_CONFIG 覆盖默认位置。krb5.conf 文件的内容示例如下：

```Plain
[libdefaults]
    default_realm = DORIS.HADOOP
    default_tkt_enctypes = des3-hmac-sha1 des-cbc-crc
    default_tgs_enctypes = des3-hmac-sha1 des-cbc-crc
    dns_lookup_kdc = true
    dns_lookup_realm = false

[realms]
    DORIS.HADOOP = {
        kdc = kerberos-doris.hadoop.service:7005
    }
```

### HDFS HA 模式

这个配置用于访问以 HA 模式部署的 HDFS 集群。

- `dfs.nameservices`：指定 HDFS 服务的名字，自定义，如："dfs.nameservices" = "my_ha"。

- `dfs.ha.namenodes.xxx`：自定义 namenode 的名字，多个名字以逗号分隔。其中 xxx 为 `dfs.nameservices` 中自定义的名字，如： "dfs.ha.namenodes.my_ha" = "my_nn"。

- `dfs.namenode.rpc-address.xxx.nn`：指定 namenode 的 rpc 地址信息。其中 nn 表示 `dfs.ha.namenodes.xxx` 中配置的 namenode 的名字，如："dfs.namenode.rpc-address.my_ha.my_nn" = "host:port"。

- `dfs.client.failover.proxy.provider.[nameservice ID]`：指定 client 连接 namenode 的 provider，默认为：org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider。

示例如下：

```sql
(
    "fs.defaultFS" = "hdfs://my_ha",
    "dfs.nameservices" = "my_ha",
    "dfs.ha.namenodes.my_ha" = "my_namenode1, my_namenode2",
    "dfs.namenode.rpc-address.my_ha.my_namenode1" = "nn1_host:rpc_port",
    "dfs.namenode.rpc-address.my_ha.my_namenode2" = "nn2_host:rpc_port",
    "dfs.client.failover.proxy.provider.my_ha" = "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider"
)
```

HA 模式可以和前面两种认证方式组合，进行集群访问。如通过简单认证访问 HA HDFS：

```sql
(
    "username"="user",
    "password"="passwd",
    "fs.defaultFS" = "hdfs://my_ha",
    "dfs.nameservices" = "my_ha",
    "dfs.ha.namenodes.my_ha" = "my_namenode1, my_namenode2",
    "dfs.namenode.rpc-address.my_ha.my_namenode1" = "nn1_host:rpc_port",
    "dfs.namenode.rpc-address.my_ha.my_namenode2" = "nn2_host:rpc_port",
    "dfs.client.failover.proxy.provider.my_ha" = "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider"
)
```

### 其他 Broker 导入

其他远端存储系统的 Broker 是 Doris 集群中的可选进程，主要用于支持 Doris 对远端存储中文件和目录的读写。目前，Doris 提供了多种远端存储系统的 Broker 实现。
历史版本中，Doris 还支持过各种对象存储的 Broker，但现在更推荐使用 `WITH S3` 方式来导入对象存储中的数据，而不再推荐使用 `WITH BROKER`。

- 腾讯云 CHDFS
- 腾讯云 GFS
- JuiceFS 

Broker 通过提供一个 RPC 服务端口来提供服务，是一个无状态的 Java 进程，负责为远端存储的读写操作封装一些类 POSIX 的文件操作，如 open，pread，pwrite 等等。除此之外，Broker 不记录任何其他信息，所以包括远端存储的连接信息、文件信息、权限信息等等，都需要通过参数在 RPC 调用中传递给 Broker 进程，才能使得 Broker 能够正确读写文件。

Broker 仅作为一个数据通路，并不参与任何计算，因此仅需占用较少的内存。通常一个 Doris 系统中会部署一个或多个 Broker 进程。并且相同类型的 Broker 会组成一个组，并设定一个 名称（Broker name）。

这里主要介绍 Broker 在访问不同远端存储时需要的参数，如连接信息、权限认证信息等等。

**Broker 信息**

Broker 的信息包括 名称（Broker name）和 认证信息 两部分。通常的语法格式如下：

```sql
WITH BROKER "broker_name" 
(
    "username" = "xxx",
    "password" = "yyy",
    "other_prop" = "prop_value",
    ...
);
```

- 名称

通常用户需要通过操作命令中的 `WITH BROKER "broker_name"` 子句来指定一个已经存在的 Broker Name。Broker Name 是用户在通过 `ALTER SYSTEM ADD BROKER` 命令添加 Broker 进程时指定的一个名称。一个名称通常对应一个或多个 Broker 进程。Doris 会根据名称选择可用的 Broker 进程。用户可以通过 `SHOW BROKER` 命令查看当前集群中已经存在的 Broker。

:::info 备注
Broker Name 只是一个用户自定义名称，不代表 Broker 的类型。
:::

- 认证信息

不同的 Broker 类型，以及不同的访问方式需要提供不同的认证信息。认证信息通常在 `WITH BROKER "broker_name"` 之后的 Property Map 中以 Key-Value 的方式提供。

## 导入示例

### 导入 HDFS 上的 TXT 文件

  ```sql
  LOAD LABEL demo.label_20220402
  (
      DATA INFILE("hdfs://host:port/tmp/test_hdfs.txt")
      INTO TABLE `load_hdfs_file_test`
      COLUMNS TERMINATED BY "\t"            
      (id,age,name)
  ) 
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username" = "user"
  )
  PROPERTIES
  (
      "timeout"="1200",
      "max_filter_ratio"="0.1"
  );
  ```

###  HDFS 需要配置 NameNode HA 的情况

  ```sql
  LOAD LABEL demo.label_20220402
  (
      DATA INFILE("hdfs://hafs/tmp/test_hdfs.txt")
      INTO TABLE `load_hdfs_file_test`
      COLUMNS TERMINATED BY "\t"            
      (id,age,name)
  ) 
  with HDFS
  (
      "hadoop.username" = "user",
      "fs.defaultFS"="hdfs://hafs"，
      "dfs.nameservices" = "hafs",
      "dfs.ha.namenodes.hafs" = "my_namenode1, my_namenode2",
      "dfs.namenode.rpc-address.hafs.my_namenode1" = "nn1_host:rpc_port",
      "dfs.namenode.rpc-address.hafs.my_namenode2" = "nn2_host:rpc_port",
      "dfs.client.failover.proxy.provider.hafs" = "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider"
  )
  PROPERTIES
  (
      "timeout"="1200",
      "max_filter_ratio"="0.1"
  );
  ```

### 从 HDFS 导入数据，使用通配符匹配两批文件，分别导入到两个表中

  ```sql
  LOAD LABEL example_db.label2
  (
      DATA INFILE("hdfs://host:port/input/file-10*")
      INTO TABLE `my_table1`
      PARTITION (p1)
      COLUMNS TERMINATED BY ","
      (k1, tmp_k2, tmp_k3)
      SET (
          k2 = tmp_k2 + 1,
          k3 = tmp_k3 + 1
      ),
      DATA INFILE("hdfs://host:port/input/file-20*")
      INTO TABLE `my_table2`
      COLUMNS TERMINATED BY ","
      (k1, k2, k3)
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username" = "user"
  );
  ```

  使用通配符匹配导入两批文件 `file-10*` 和 `file-20*`。分别导入到 `my_table1` 和 `my_table2` 两张表中。其中 `my_table1` 指定导入到分区 `p1` 中，并且将导入源文件中第二列和第三列的值 +1 后导入。

### 使用通配符从 HDFS 导入一批数据

  ```sql
  LOAD LABEL example_db.label3
  (
      DATA INFILE("hdfs://host:port/user/doris/data/*/*")
      INTO TABLE `my_table`
      COLUMNS TERMINATED BY "\\x01"
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username" = "user"
  );
  ```

  指定分隔符为 Hive 经常用的默认分隔符 `\\x01`，并使用通配符 * 指定 `data` 目录下所有目录的所有文件。

### 导入 Parquet 格式数据，指定 FORMAT 为 `parquet`

    ```SQL
    LOAD LABEL example_db.label4
    (
        DATA INFILE("hdfs://host:port/input/file")
        INTO TABLE `my_table`
        FORMAT AS "parquet"
        (k1, k2, k3)
    )
    with HDFS
    (
      "fs.defaultFS"="hdfs://host:port",
      "hadoop.username" = "user"
    );
    ```

  默认是通过文件后缀判断。

### 导入数据，并提取文件路径中的分区字段

  ```sql
  LOAD LABEL example_db.label5
  (
      DATA INFILE("hdfs://host:port/input/city=beijing/*/*")
      INTO TABLE `my_table`
      FORMAT AS "csv"
      (k1, k2, k3)
      COLUMNS FROM PATH AS (city, utc_date)
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username" = "user"
  );
  ```

  `my_table` 表中的列为 `k1, k2, k3, city, utc_date`。

  其中 `hdfs://hdfs_host:hdfs_port/user/doris/data/input/dir/city=beijing` 目录下包括如下文件：

  ```Plain
  hdfs://hdfs_host:hdfs_port/input/city=beijing/utc_date=2020-10-01/0000.csv
  hdfs://hdfs_host:hdfs_port/input/city=beijing/utc_date=2020-10-02/0000.csv
  hdfs://hdfs_host:hdfs_port/input/city=tianji/utc_date=2020-10-03/0000.csv
  hdfs://hdfs_host:hdfs_port/input/city=tianji/utc_date=2020-10-04/0000.csv
  ```

  文件中只包含 `k1, k2, k3` 三列数据，`city, utc_date` 这两列数据会从文件路径中提取。

### 对导入数据进行过滤

  ```sql
  LOAD LABEL example_db.label6
  (
      DATA INFILE("hdfs://host:port/input/file")
      INTO TABLE `my_table`
      (k1, k2, k3)
      SET (
          k2 = k2 + 1
      )
      PRECEDING FILTER k1 = 1
      WHERE k1 > k2
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username" = "user"
  );
  ```

  只有原始数据中，k1 = 1，并且转换后，k1 > k2 的行才会被导入。

### 导入数据，提取文件路径中的时间分区字段

  ```sql
  LOAD LABEL example_db.label7
  (
      DATA INFILE("hdfs://host:port/user/data/*/test.txt") 
      INTO TABLE `tbl12`
      COLUMNS TERMINATED BY ","
      (k2,k3)
      COLUMNS FROM PATH AS (data_time)
      SET (
          data_time=str_to_date(data_time, '%Y-%m-%d %H%%3A%i%%3A%s')
      )
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username" = "user"
  );
  ```

  :::tip
  时间包含 %3A。在 hdfs 路径中，不允许有 ':'，所有 ':' 会由 %3A 替换。
  :::

  路径下有如下文件：

  ```Plain
  /user/data/data_time=2020-02-17 00%3A00%3A00/test.txt
  /user/data/data_time=2020-02-18 00%3A00%3A00/test.txt
  ```

  表结构为：

  ```sql
  CREATE TABLE IF NOT EXISTS tbl12 (
      data_time DATETIME,
      k2        INT,
      k3        INT
  ) DISTRIBUTED BY HASH(data_time) BUCKETS 10
  PROPERTIES (
      "replication_num" = "3"
  );
  ```

### 使用 Merge 方式导入

  ```sql
  LOAD LABEL example_db.label8
  (
      MERGE DATA INFILE("hdfs://host:port/input/file")
      INTO TABLE `my_table`
      (k1, k2, k3, v2, v1)
      DELETE ON v2 > 100
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username"="user"
  )
  PROPERTIES
  (
      "timeout" = "3600",
      "max_filter_ratio" = "0.1"
  );
  ```

  使用 Merge 方式导入。`my_table` 必须是一张 Unique Key 的表。当导入数据中的 v2 列的值大于 100 时，该行会被认为是一个删除行。导入任务的超时时间是 3600 秒，并且允许错误率在 10% 以内。

### 导入时指定 source_sequence 列，保证替换顺序

  ```sql
  LOAD LABEL example_db.label9
  (
      DATA INFILE("hdfs://host:port/input/file")
      INTO TABLE `my_table`
      COLUMNS TERMINATED BY ","
      (k1,k2,source_sequence,v1,v2)
      ORDER BY source_sequence
  ) 
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username"="user"
  );
  ```

  `my_table` 必须是 Unique Key 模型表，并且指定了 Sequence 列。数据会按照源数据中 `source_sequence` 列的值来保证顺序性。

- 导入指定文件格式为 `json`，并指定 `json_root`、`jsonpaths` 属性：

  ```sql
  LOAD LABEL example_db.label10
  (
      DATA INFILE("hdfs://host:port/input/file.json")
      INTO TABLE `my_table`
      FORMAT AS "json"
      PROPERTIES(
        "json_root" = "$.item",
        "jsonpaths" = "[\"$.id\", \"$.city\", \"$.code\"]"
      )       
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username"="user"
  );
  ```

  `jsonpaths` 也可以与 `column list` 及 `SET (column_mapping)`配合使用：

  ```sql
  LOAD LABEL example_db.label10
  (
      DATA INFILE("hdfs://host:port/input/file.json")
      INTO TABLE `my_table`
      FORMAT AS "json"
      (id, code, city)
      SET (id = id * 10)
      PROPERTIES(
        "json_root" = "$.item",
        "jsonpaths" = "[\"$.id\", \"$.city\", \"$.code\"]"
      )       
  )
  with HDFS
  (
    "fs.defaultFS"="hdfs://host:port",
    "hadoop.username"="user"
  );
  ```
:::info 备注
如果需要将 JSON 文件中根节点的 JSON 对象导入，jsonpaths 需要指定为$.，如：`PROPERTIES("jsonpaths"="$.")`
:::

### 从其他 Broker 导入

- 阿里云 OSS

```sql
(
    "fs.oss.accessKeyId" = "",
    "fs.oss.accessKeySecret" = "",
    "fs.oss.endpoint" = ""
)
```

- 百度云 BOS

当前使用 BOS 时需要下载相应的 SDK 包，具体配置与使用，可以参考 [BOS HDFS 官方文档](https://cloud.baidu.com/doc/BOS/s/fk53rav99)。在下载完成并解压后将 jar 包放到 broker 的 lib 目录下。

```sql
(
    "fs.bos.access.key" = "xx",
    "fs.bos.secret.access.key" = "xx",
    "fs.bos.endpoint" = "xx"
)
```

- 华为云 OBS

```sql
(
    "fs.obs.access.key" = "xx",
    "fs.obs.secret.key" = "xx",
    "fs.obs.endpoint" = "xx"
)
```

- JuiceFS

```sql
(
    "fs.defaultFS" = "jfs://xxx/",
    "fs.jfs.impl" = "io.juicefs.JuiceFileSystem",
    "fs.AbstractFileSystem.jfs.impl" = "io.juicefs.JuiceFS",
    "juicefs.meta" = "xxx",
    "juicefs.access-log" = "xxx"
)
```

- GCS

在使用 Broker 访问 GCS 时，Project ID 是必须的，其他参数可选，所有参数配置请参考 [GCS Config](https://github.com/GoogleCloudDataproc/hadoop-connectors/blob/branch-2.2.x/gcs/CONFIGURATION)

```sql
(
    "fs.gs.project.id" = "Your Project ID",
    "fs.AbstractFileSystem.gs.impl" = "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFS",
    "fs.gs.impl" = "com.google.cloud.hadoop.fs.gcs.GoogleHadoopFileSystem",
)
```

## 更多帮助

关于 Broker Load 使用的更多详细语法及最佳实践，请参阅 [Broker Load](../../../sql-manual/sql-statements/data-modification/load-and-export/BROKER-LOAD) 命令手册，你也可以在 MySQL 客户端命令行中输入 `HELP BROKER LOAD` 获取更多帮助信息。
