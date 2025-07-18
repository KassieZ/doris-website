---
{
    "title": "Compaction",
    "language": "en"
}
---

# Compaction

Doris writes data through a structure similar to LSM-Tree, and continuously merges small files into large ordered files through compaction in the background. Compaction handles operations such as deletion and updating. 

Appropriately adjusting the compaction strategy can greatly improve load and query efficiency. Doris provides the following compaction strategies for tuning:


## Vertical compaction

Vertical compaction is a new compaction algorithm implemented in Doris 1.2.2, which is used to optimize compaction execution efficiency and resource overhead in large-scale and wide table scenarios. It can effectively reduce the memory overhead of compaction and improve the execution speed of compaction. The test results show that the memory consumption by vertical compaction is only 1/10 of the original compaction algorithm, and the compaction rate is increased by 15%.

In vertical compaction, merging by row is changed to merging by column group. The granularity of each merge is changed to column group, which reduces the amount of data involved in single compaction and reduces the memory usage during compaction.

BE configuration:
- `enable_vertical_compaction = true` will turn on vertical compaction
- `vertical_compaction_num_columns_per_group = 5` The number of columns contained in each column group, by testing, the efficiency and memory usage of a group of 5 columns by default is more friendly
- `vertical_compaction_max_segment_size` is used to configure the size of the disk file after vertical compaction, the default value is 268435456 (bytes)


## Segment compaction

Segment compaction mainly deals with the large-scale data load. Segment compaction operates during the load process and compact segments inside the job, which is different from normal compaction and vertical compaction. This mechanism can effectively reduce the number of generated segments and avoid the -238 (OLAP_ERR_TOO_MANY_SEGMENTS) errors.

The following features are provided by segment compaction:
- reduce the number of segments generated by load
- the compacting process is parallel to the load process, which will not increase the load time
- memory consumption and computing resources will increase during loading, but the increase is relatively low because it is evenly distributed throughout the long load process.
- data after segment compaction will have resource and performance advantages in subsequent queries and normal compaction.

BE configuration:
- `enable_segcompaction=true` turn it on.
- `segcompaction_batch_size` is used to configure the interval for merging. The default value 10 means that every 10 segment files will trigger a segment compaction. It is recommended to set between 10 - 30. The larger value will increase the memory usage of segment compaction.

Situations where segment compaction is recommended:

- Loading large amounts of data fails at OLAP_ ERR_ TOO_ MANY_ SEGMENTS (errcode - 238) error. Then it is recommended to turn on segment compaction to reduce the quantity of segments during the load process.
- Too many small files are generated during the load process: although the amount of loading data is reasonable, the generation of a large number of small segment files may also fail the load job because of low cardinality or memory constraints that trigger memtable to be flushed in advance. Then it is recommended to turn on this function.
- Query immediately after loading. When the load is just finished and the standard compaction has not finished, large number of segment files will affect the efficiency of subsequent queries. If the user needs to query immediately after loading, it is recommended to turn on this function.
- The pressure of normal compaction is high after loading: segment compaction evenly puts part of the pressure of normal compaction on the loading process. At this time, it is recommended to enable this function.

Situations where segment compaction is not recommended:
- When the load operation itself has exhausted memory resources, it is not recommended to use the segment compaction to avoid further increasing memory pressure and causing the load job to fail.

Refer to this [link](https://github.com/apache/doris/pull/12866) for more information about implementation and test results.

## Single replica compaction

By default, compaction for multiple replicas is performed independently, with each replica consuming CPU and IO resources. When single replica compaction is enabled, only one replica performs the compaction. Afterward, the other replicas pull the compacted files from this replica, resulting in CPU resources being consumed only once, saving N - 1 times CPU usage (where N is the number of replicas).

Single replica compaction is specified in the table's PROPERTIES via the parameter `enable_single_replica_compaction`, which is false by default (disabled). To enable it, set the parameter to true.

This parameter can be specified when creating the table or modified later using:
```sql
ALTER TABLE table_name SET("enable_single_replica_compaction" = "true");
```

## Compaction strategy

The compaction strategy determines when and which small files are merged into larger files. Doris currently offers two compaction strategies, specified by the `compaction_policy` parameter in the table properties.

### Size-based compaction strategy

The size-based compaction strategy is the default strategy and is suitable for most scenarios.
```
"compaction_policy" = "size_based"
```

### Time series compaction strategy

The time series compaction strategy is optimized for scenarios like logs and time-series data. It leverages the time locality of time-series data, merging small files written in adjacent times into larger files. Each file participates in compaction only once, reducing write amplification from repeated compaction.

```
"compaction_policy" = "time_series"
```

The time series compaction strategy is triggered when any of the following conditions are met:
- The size of unmerged files exceeds `time_series_compaction_goal_size_mbytes` (default 1 GB).
- The number of unmerged files exceeds `time_series_compaction_file_count_threshold` (default 2000).
- The time since the last compaction exceeds `time_series_compaction_time_threshold_seconds` (default 1 hour).

These parameters are set in the table's PROPERTIES and can be specified when creating the table or modified later using:
```
ALTER TABLE table_name SET("name" = "value");
```

## Compaction concurrency control

Compaction runs in the background and consumes CPU and IO resources. The resource consumption can be controlled by adjusting the number of concurrent compaction threads.

The number of concurrent compaction threads is configured in the BE configuration file, including the following parameters:
- `max_base_compaction_threads`: Number of base compaction threads, default is 4.
- `max_cumu_compaction_threads`: Number of cumulative compaction threads, default is -1, which mean that 1 thread per disk.
- `max_single_replica_compaction_threads`: Number of threads for fetching data files during single replica compaction, default is 10.
