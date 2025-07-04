---
{
    "title": "Release 2.0.8",
    "language": "en"
}
---

Thanks to our community users and developers, about 65 improvements and bug fixes have been made in Doris 2.0.8 version.

- **Quick Download** : [https://doris.apache.org/download/](https://doris.apache.org/download/)

- **GitHub** : [https://github.com/apache/doris/releases](https://github.com/apache/doris/releases)



## 1 Behavior change

The `ADMIN SHOW` statement can not be executed with high version of MySQL 8.x jdbc driver. So rename these statement, remove the `ADMIN` keywords. 

- https://github.com/apache/doris/pull/29492

```sql
ADMIN SHOW CONFIG -> SHOW CONFIG
ADMIN SHOW REPLICA -> SHOW REPLICA
ADMIN DIAGNOSE TABLET -> SHOW TABLET DIAGNOSIS
ADMIN SHOW TABLET -> SHOW TABLET
```


## 2 New features

N/A



## 3 Improvement and optimizations

- Make Inverted Index work with TopN opt in Nereids

- Limit the max string length to 1024 while collecting column stats to control BE memory usage

- JDBC Catalog close when JDBC client is not empty

- Accept all Iceberg database and do not check the name format of database

- Refresh external table's rowcount async to avoid cache miss and unstable query plan

- Simplify the isSplitable method of hive external table to avoid too many hadoop metrics

See the complete list of improvements and bug fixes on [GitHub](https://github.com/apache/doris/compare/2.0.7...2.0.8) .

## 4 Credits

Thanks all who contribute to this release:

924060929,  AcKing-Sam, amorynan, AshinGau, BePPPower, BiteTheDDDDt, ByteYue, cambyzju,  dongsilun, eldenmoon, feiniaofeiafei, gnehil, Jibing-Li, liaoxin01, luwei16,  morningman, morrySnow, mrhhsg, Mryange, nextdreamblue, platoneko,  starocean999, SWJTU-ZhangLei, wuwenchi, xiaokang, xinyiZzz, Yukang-Lian,  Yulei-Yang, zclllyybb, zddr, zhangstar333, zhiqiang-hhhh, ziyanTOP, zy-kkk,  zzzxl1993