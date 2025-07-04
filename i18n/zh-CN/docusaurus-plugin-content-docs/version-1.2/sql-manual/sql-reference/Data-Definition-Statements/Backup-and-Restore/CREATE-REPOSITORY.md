---
{
    "title": "CREATE-REPOSITORY",
    "language": "zh-CN"
}
---

## CREATE-REPOSITORY

### Name

CREATE REPOSITORY

## 描述

该语句用于创建仓库。仓库用于属于备份或恢复。仅 root 或 superuser 用户可以创建仓库。

语法：

```sql
CREATE [READ ONLY] REPOSITORY `repo_name`
WITH [BROKER `broker_name`|S3|hdfs]
ON LOCATION `repo_location`
PROPERTIES ("key"="value", ...);
```

说明：

- 仓库的创建，依赖于已存在的 broker 或者直接通过 AWS s3 协议访问云存储，或者直接访问 HDFS
- 如果是只读仓库，则只能在仓库上进行恢复。如果不是，则可以进行备份和恢复操作。
- 根据 broker 或者 S3、hdfs 的不同类型，PROPERTIES 有所不同，具体见示例。
- ON LOCATION ,如果是 S3 , 这里后面跟的是 Bucket Name。

## 举例

1. 创建名为 bos_repo 的仓库，依赖 BOS broker "bos_broker"，数据根目录为：bos://palo_backup

```sql
CREATE REPOSITORY `bos_repo`
WITH BROKER `bos_broker`
ON LOCATION "bos://palo_backup"
PROPERTIES
(
    "bos_endpoint" = "http://gz.bcebos.com",
    "bos_accesskey" = "bos_accesskey",
    "bos_secret_accesskey"="bos_secret_accesskey"
);
```

2. 创建和示例 1 相同的仓库，但属性为只读：

```sql
CREATE READ ONLY REPOSITORY `bos_repo`
WITH BROKER `bos_broker`
ON LOCATION "bos://palo_backup"
PROPERTIES
(
    "bos_endpoint" = "http://gz.bcebos.com",
    "bos_accesskey" = "bos_accesskey",
    "bos_secret_accesskey"="bos_accesskey"
);
```

3. 创建名为 hdfs_repo 的仓库，依赖 Baidu hdfs broker "hdfs_broker"，数据根目录为：hdfs://hadoop-name-node:54310/path/to/repo/

```sql
CREATE REPOSITORY `hdfs_repo`
WITH BROKER `hdfs_broker`
ON LOCATION "hdfs://hadoop-name-node:54310/path/to/repo/"
PROPERTIES
(
    "username" = "user",
    "password" = "password"
);
```

4. 创建名为 s3_repo 的仓库，直接链接云存储，而不通过 broker.

```sql
CREATE REPOSITORY `s3_repo`
WITH S3
ON LOCATION "s3://s3-repo"
PROPERTIES
(
    "AWS_ENDPOINT" = "http://s3-REGION.amazonaws.com",
    "AWS_ACCESS_KEY" = "AWS_ACCESS_KEY",
    "AWS_SECRET_KEY"="AWS_SECRET_KEY",
    "AWS_REGION" = "REGION"
);
```

5. 创建名为 hdfs_repo 的仓库，直接链接 HDFS，而不通过 broker.

```sql
CREATE REPOSITORY `hdfs_repo`
WITH hdfs
ON LOCATION "hdfs://hadoop-name-node:54310/path/to/repo/"
PROPERTIES
(
    "fs.defaultFS"="hdfs://hadoop-name-node:54310",
    "hadoop.username"="user"
);
```

6. 创建名为 minio_repo 的仓库，直接通过 s3 协议链接 minio.

```sql
CREATE REPOSITORY `minio_repo`
WITH S3
ON LOCATION "s3://minio_repo"
PROPERTIES
(
    "AWS_ENDPOINT" = "http://minio.com",
    "AWS_ACCESS_KEY" = "MINIO_USER",
    "AWS_SECRET_KEY"="MINIO_PASSWORD",
    "AWS_REGION" = "REGION",
    "use_path_style" = "true"
);
```

7. 使用临时秘钥创建名为 minio_repo 的仓库


```sql
CREATE REPOSITORY `minio_repo`
WITH S3
ON LOCATION "s3://minio_repo"
PROPERTIES
(
    "AWS_ENDPOINT" = "AWS_ENDPOINT",
    "AWS_ACCESS_KEY" = "AWS_TEMP_ACCESS_KEY",
    "AWS_SECRET_KEY" = "AWS_TEMP_SECRET_KEY",
    "AWS_TOKEN" = "AWS_TEMP_TOKEN",
    "AWS_REGION" = "AWS_REGION"
)
```

8. 使用腾讯云 COS 创建仓库

```sql
CREATE REPOSITORY `cos_repo`
WITH S3
ON LOCATION "s3://backet1/"
PROPERTIES
(
    "AWS_ACCESS_KEY" = "ak",
    "AWS_SECRET_KEY" = "sk",
    "AWS_ENDPOINT" = "http://cos.ap-beijing.myqcloud.com",
    "AWS_REGION" = "ap-beijing"
);
```

### Keywords

    CREATE, REPOSITORY

### Best Practice

1. 一个集群可以创建过多个仓库。只有拥有 ADMIN 权限的用户才能创建仓库。
2. 任何用户都可以通过 [SHOW REPOSITORIES](../../Show-Statements/SHOW-REPOSITORIES.md) 命令查看已经创建的仓库。
3. 在做数据迁移操作时，需要在源集群和目的集群创建完全相同的仓库，以便目的集群可以通过这个仓库，查看到源集群备份的数据快照。
