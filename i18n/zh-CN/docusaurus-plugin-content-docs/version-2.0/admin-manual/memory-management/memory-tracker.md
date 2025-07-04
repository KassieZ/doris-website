---
{
    "title": "内存跟踪器",
    "language": "zh-CN"
}
---

内存跟踪器（Memory Tracker）记录了 Doris BE 进程内存使用，包括查询、导入、Compaction、Schema Change 等任务生命周期中使用的内存，以及各项缓存，用于内存控制和分析。

:::note
自 Doris 1.2 版本开始支持内存跟踪器（Memory Tracker）
:::

## 原理

系统中每个查询、导入等任务初始化时都会创建自己的 Memory Tracker，在执行过程中将 Memory Tracker 放入 TLS（Thread Local Storage）中，BE 进程的每次内存申请和释放，都将在 Mem Hook 中消费 Memory Tracker，并最终汇总后展示。

详细设计实现可以参阅：
https://cwiki.apache.org/confluence/display/DORIS/DSIP-002%3A+Refactor+memory+tracker+on+BE
https://shimo.im/docs/DT6JXDRkdTvdyV3G

有关 Memory Tracker 更多介绍参考文档：[Say-Goodbye-to-OOM-Crashes-en](https://doris.apache.org/blog/Say-Goodbye-to-OOM-Crashes/)， [Say-Goodbye-to-OOM-Crashes-zh-CN](https://mp.weixin.qq.com/s/Z5N-uZrFE3Qhn5zTyEDomQ)

## 查看统计结果

实时的内存统计结果通过 Doris BE 的 Web 页面查看 http://{be_host}:{be_web_server_port}/mem_tracker。（webserver_port默认8040）
历史查询的内存统计结果可以查看`fe/log/fe.audit.log`中每个查询的`peakMemoryBytes`，或者在`be/log/be.INFO`中搜索`Deregister query/load memory tracker, queryId`查看单个 BE 上每个查询的内存峰值。

### 首页 `/mem_tracker`

![image](https://user-images.githubusercontent.com/13197424/202889634-fbfdd2a1-e272-4101-8744-baf05c15c2dc.png)

**1. Type: 将 Doris BE 使用的内存分为如下几类**

- process: 进程总内存，所有其他 type 的总和。

- global: 生命周期和进程相同的全局 Memory Tracker，例如各个 Cache、Tablet Manager、Storage Engine 等。

- query: 所有查询的内存总和。

- load: 所有导入的内存总和。

- tc/jemalloc_cache: 通用内存分配器 TCMalloc 或 Jemalloc 的缓存，在 http://{be_host}:{be_web_server_port}/memz 可以实时查看到内存分配器原始的 profile。

- compaction、schema_change、consistency、batch_load、clone: 分别对应所有 Compaction、Schema Change、Consistency、Batch Load、Clone 任务的内存总和。

**2. Current Consumption(Bytes): 当前内存值，单位 B。**

**3. Current Consumption(Normalize): 当前内存值的 .G.M.K 格式化输出。**

**4. Peak Consumption(Bytes): BE 进程启动后的内存峰值，单位 B，BE 重启后重置。**

**5. Peak Consumption(Normalize): BE 进程启动后内存峰值的 .G.M.K 格式化输出，BE 重启后重置。**

### Global Type `/mem_tracker?type=global`

![image](https://user-images.githubusercontent.com/13197424/202910945-7ee2bb56-c0a3-4ccb-9422-841c64c65bad.png)

**1. Label: Memory Tracker 名称**

**2. Parent Label:**

用于表明两个 Memory Tracker 的父子关系，Child Tracker 记录的内存是 Parent Tracker 的子集，Parent 相同的不同 Tracker 记录的内存可能存在交集。

- Orphan: 默认消费的 Tracker，没有单独指定 Tracker 的内存将默认记录到 Orphan，Orphan 中除了下述细分的 Child Tracker 外，还包括 BRPC 在内的一些不方便准确细分统计的内存。

  - LoadChannelMgr: 所有导入的 Load Channel 阶段内存总和，用于将 Scan 后的数据写入到磁盘的 Segment 文件中，Orphan 的子集。

  - StorageEngine:，存储引擎加载数据目录过程中消耗的内存，Orphan 的子集。

  - SegCompaction: 所有 SegCompaction 任务的内存总和，Orphan 的子集。

  - SegmentMeta: memory use by segment meta data such as footer or index page，Orphan 的子集。

  - TabletManager: 存储引擎 get、add、delete Tablet 过程中消耗的内存，Orphan 的子集。

  - BufferAllocator: 仅用于非向量化 Partitioned Agg 过程中的内存复用，Orphan 的子集。


- DataPageCache: 用于缓存数据 Page，用于加速 Scan。

- IndexPageCache: 用于缓存数据 Page 的索引，用于加速 Scan。

- SegmentCache: 用于缓存已打开的 Segment，如索引信息。


- ChunkAllocator: 用于缓存 2 的幂大小的内存块，在应用层内存复用。

- LastestSuccessChannelCache: 用于缓存导入接收端的 LoadChannel。

- DeleteBitmap AggCache: Gets aggregated delete_bitmap on rowset_id and version。

### Query Type `/mem_tracker?type=query`

![image](https://user-images.githubusercontent.com/13197424/202924569-c4f3c556-2f92-4375-962c-c71147704a27.png)

1. Limit: 单个查询使用的内存上限，`show session variables`查看和修改`exec_mem_limit`。

2. Label: 单个查询的 Tracker 的 Label 命名规则为`Query#Id=xxx`。

3. Parent Label: Parent 是 `Query#Id=xxx` 的 Tracker 记录查询不同算子执行过程使用的内存。

### Load Type `/mem_tracker?type=load`

![image](https://user-images.githubusercontent.com/13197424/202925855-936889e3-c910-4ca5-bc12-1b9849a09c33.png)

1. Limit: 导入分为 Fragment Scan 和 Load Channel 写 Segment 到磁盘两个阶段。Scan 阶段的内存上限通过`show session variables`查看和修改`load_mem_limit`；Segment 写磁盘阶段每个导入没有单独的内存上限，而是所有导入的总上限，对应 be.conf 中的 `load_process_max_memory_limit_percent`。

2. Label: 单个导入 Scan 阶段 Tracker 的 Label 命名规则为`Load#Id=xxx`；单个导入 Segment 写磁盘阶段 Tracker 的 Label 命名规则为`LoadChannel#senderIp=xxx#loadID=xxx`。

3. Parent Label: Parent 是 `Load#Id=xxx` 的 Tracker 记录导入 Scan 阶段不同算子执行过程使用的内存；Parent 是 `LoadChannelMgrTrackerSet` 的 Tracker 记录 Segment 写磁盘阶段每个中间数据结构 MemTable 的 Insert 和 Flush 磁盘过程使用的内存，用 Label 最后的 `loadID` 关联 Segment 写磁盘阶段 Tracker。


