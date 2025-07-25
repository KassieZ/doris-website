---
{
    "title": "服务自动拉起",
    "language": "zh-CN"
}
---

本文档主要介绍如何配置 Doris 集群的自动拉起，保证生产环境中出现特殊情况导致服务宕机后未及时拉起服务从而影响到业务的正常运行。

Doris 集群必须完全搭建完成后再配置 FE 和 BE 的自动拉起服务。

## Systemd 配置 Doris 服务

systemd 具体使用以及参数解析可以参考[这里](https://systemd.io/) 

### sudo 权限控制

在使用 systemd 控制 doris 服务时，需要有 sudo 权限。为了保证最小粒度的 sudo 权限分配，可以将 doris-fe 与 doris-be 服务的 systemd 控制权限分配给指定的非 root 用户。在 visudo 来配置 doris-fe 与 doris-be 的 systemctl 管理权限。

```
Cmnd_Alias DORISCTL=/usr/bin/systemctl start doris-fe,/usr/bin/systemctl stop doris-fe,/usr/bin/systemctl start doris-be,/usr/bin/systemctl stop doris-be

## Allow root to run any commands anywhere
root    ALL=(ALL)       ALL
doris   ALL=(ALL)       NOPASSWD:DORISCTL
```

### 配置步骤
1. 分别在 fe.conf 和 be.conf 中添加 JAVA_HOME 变量配置，否则使用 systemctl start 将无法启动服务
    ```
    echo "JAVA_HOME=your_java_home" >> /home/doris/fe/conf/fe.conf
    echo "JAVA_HOME=your_java_home" >> /home/doris/be/conf/be.conf
    ```
2. 下载 doris-fe.service 文件：[doris-fe.service](https://github.com/apache/doris/blob/master/tools/systemd/doris-fe.service)

3. doris-fe.service 具体内容如下：

    ```
    # Licensed to the Apache Software Foundation (ASF) under one
    # or more contributor license agreements.  See the NOTICE file
    # distributed with this work for additional information
    # regarding copyright ownership.  The ASF licenses this file
    # to you under the Apache License, Version 2.0 (the
    # "License"); you may not use this file except in compliance
    # with the License.  You may obtain a copy of the License at
    #
    #   http://www.apache.org/licenses/LICENSE-2.0
    #
    # Unless required by applicable law or agreed to in writing,
    # software distributed under the License is distributed on an
    # "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    # KIND, either express or implied.  See the License for the
    # specific language governing permissions and limitations
    # under the License.

    [Unit]
    Description=Doris FE
    After=network-online.target
    Wants=network-online.target

    [Service]
    Type=forking
    User=root
    Group=root
    LimitCORE=infinity
    LimitNOFILE=200000
    Restart=on-failure
    RestartSec=30
    StartLimitInterval=120
    StartLimitBurst=3
    KillMode=none
    ExecStart=/home/doris/fe/bin/start_fe.sh --daemon 
    ExecStop=/home/doris/fe/bin/stop_fe.sh

    [Install]
    WantedBy=multi-user.target
    ```

    :::caution
    **注意事项**

    - ExecStart、ExecStop 根据实际部署的 fe 的路径进行配置
    :::

4. 下载 doris-be.service 文件：[doris-be.service](https://github.com/apache/doris/blob/master/tools/systemd/doris-be.service)

5. doris-be.service 具体内容如下：

    ```shell
    # Licensed to the Apache Software Foundation (ASF) under one
    # or more contributor license agreements.  See the NOTICE file
    # distributed with this work for additional information
    # regarding copyright ownership.  The ASF licenses this file
    # to you under the Apache License, Version 2.0 (the
    # "License"); you may not use this file except in compliance
    # with the License.  You may obtain a copy of the License at
    #
    #   http://www.apache.org/licenses/LICENSE-2.0
    #
    # Unless required by applicable law or agreed to in writing,
    # software distributed under the License is distributed on an
    # "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    # KIND, either express or implied.  See the License for the
    # specific language governing permissions and limitations
    # under the License.

    [Unit]
    Description=Doris BE
    After=network-online.target
    Wants=network-online.target

    [Service]
    Type=forking
    User=root
    Group=root
    LimitCORE=infinity
    LimitNOFILE=200000
    Restart=on-failure
    RestartSec=30
    StartLimitInterval=120
    StartLimitBurst=3
    KillMode=none
    ExecStart=/home/doris/be/bin/start_be.sh --daemon
    ExecStop=/home/doris/be/bin/stop_be.sh

    [Install]
    WantedBy=multi-user.target
    ```

    :::caution
    **注意事项**

    - ExecStart、ExecStop 根据实际部署的 be 的路径进行配置
    :::

6. 服务配置

   将 doris-fe.service、doris-be.service 两个文件放到 /usr/lib/systemd/system 目录下

7. 设置自启动

    添加或修改配置文件后，需要重新加载

    ```shell
    systemctl daemon-reload
    ```

    设置自启动，实质就是在 /etc/systemd/system/multi-user.target.wants/ 添加服务文件的链接

    ```shell
    systemctl enable doris-fe
    systemctl enable doris-be
    ```

8. 服务启动

    ```shell
    systemctl start doris-fe
    systemctl start doris-be
    ```

## Supervisor 配置 Doris 服务

Supervisor 具体使用以及参数解析可以参考[这里](http://supervisord.org/)

Supervisor 配置自动拉起可以使用 yum 命令直接安装，也可以通过 pip 手工安装，pip 手工安装流程比较复杂，只展示 yum 方式部署，手工部署请参考[这里](http://supervisord.org/installing.html)进行安装部署。

### 配置步骤

1. yum 安装 supervisor
    
    ```shell
    yum install epel-release
    yum install -y supervisor
    ```

2. 启动服务并查看状态

    ```shell
    systemctl enable supervisord # 开机自启动
    systemctl start supervisord # 启动 supervisord 服务
    systemctl status supervisord # 查看 supervisord 服务状态
    ps -ef|grep supervisord # 查看是否存在 supervisord 进程
    ```

3. 配置 BE 进程管理

    ```shell
    修改 start_be.sh 脚本，去掉最后的 & 符号

    vim /path/doris/be/bin/start_be.sh
    将 nohup $LIMIT ${DORIS_HOME}/lib/palo_be "$@" >> $LOG_DIR/be.out 2>&1 </dev/null &
    修改为 nohup $LIMIT ${DORIS_HOME}/lib/palo_be "$@" >> $LOG_DIR/be.out 2>&1 </dev/null
    ```

    创建 BE 的 supervisor 进程管理配置文件

    ```shell
    vim /etc/supervisord.d/doris-be.ini

    [program:doris_be]      
    process_name=%(program_name)s      
    directory=/path/doris/be/be
    command=sh /path/doris/be/bin/start_be.sh
    autostart=true
    autorestart=true
    user=root
    numprocs=1
    startretries=3
    stopasgroup=true
    killasgroup=true
    startsecs=5
    #redirect_stderr = true
    #stdout_logfile_maxbytes = 20MB
    #stdout_logfile_backups = 10
    #stdout_logfile=/var/log/supervisor-palo_be.log
    ```

4. 配置 FE 进程管理

    ```shell
    修改 start_fe.sh 脚本，去掉最后的 & 符号

    vim /path/doris/fe/bin/start_fe.sh 
    将 nohup $LIMIT $JAVA $final_java_opt org.apache.doris.PaloFe ${HELPER} "$@" >> $LOG_DIR/fe.out 2>&1 </dev/null &
    修改为 nohup $LIMIT $JAVA $final_java_opt org.apache.doris.PaloFe ${HELPER} "$@" >> $LOG_DIR/fe.out 2>&1 </dev/null
    ```

    创建 FE 的 supervisor 进程管理配置文件

    ```shell
    vim /etc/supervisord.d/doris-fe.ini

    [program:PaloFe]
    environment = JAVA_HOME="/path/jdk8"
    process_name=PaloFe
    directory=/path/doris/fe
    command=sh /path/doris/fe/bin/start_fe.sh
    autostart=true
    autorestart=true
    user=root
    numprocs=1
    startretries=3
    stopasgroup=true
    killasgroup=true
    startsecs=10
    #redirect_stderr=true
    #stdout_logfile_maxbytes=20MB
    #stdout_logfile_backups=10
    #stdout_logfile=/var/log/supervisor-PaloFe.log
    ```

5. 配置 Broker 进程管理

    ```shell
    修改 start_broker.sh 脚本，去掉最后的 & 符号

    vim /path/apache_hdfs_broker/bin/start_broker.sh
    将 nohup $LIMIT $JAVA $JAVA_OPTS org.apache.doris.broker.hdfs.BrokerBootstrap "$@" >> $BROKER_LOG_DIR/apache_hdfs_broker.out 2>&1 </dev/null &
    修改为 nohup $LIMIT $JAVA $JAVA_OPTS org.apache.doris.broker.hdfs.BrokerBootstrap "$@" >> $BROKER_LOG_DIR/apache_hdfs_broker.out 2>&1 </dev/null
    ```

    创建 Broker 的 supervisor 进程管理配置文件

    ```shell
    vim /etc/supervisord.d/doris-broker.ini

    [program:BrokerBootstrap]
    environment = JAVA_HOME="/usr/local/java"
    process_name=%(program_name)s
    directory=/path/apache_hdfs_broker
    command=sh /path/apache_hdfs_broker/bin/start_broker.sh
    autostart=true
    autorestart=true
    user=root
    numprocs=1
    startretries=3
    stopasgroup=true
    killasgroup=true
    startsecs=5
    #redirect_stderr=true
    #stdout_logfile_maxbytes=20MB
    #stdout_logfile_backups=10
    #stdout_logfile=/var/log/supervisor-BrokerBootstrap.log
    ```

6. 首先确定 Doris 服务是停止状态，然后使用 supervisor 将 Doris 自动拉起，然后确定进程是否正常启动
    
    ```shell
    supervisorctl reload # 重新加载 Supervisor 中的所有配置文件
    supervisorctl status # 查看 supervisor 状态，验证 Doris 服务进程是否正常启动

    其他命令 : 
    supervisorctl start all # supervisorctl start 可以开启进程
    supervisorctl stop doris-be # 通过 supervisorctl stop，停止进程
    ```

:::caution
注意事项：

- 如果使用 yum 安装的 supervisor 启动报错 :  pkg_resources.DistributionNotFound: The 'supervisor==3.4.0' distribution was not found

    ```shell
    这个是 python 版本不兼容问题，通过 yum 命令直接安装的 supervisor 只支持 python2 版本，所以需要将 /usr/bin/supervisord 和 /usr/bin/supervisorctl 中文件内容开头 #!/usr/bin/python 改为 #!/usr/bin/python2，前提是要装 python2 版本
    ```

- 如果配置了 supervisor 对 Doris 进程进行自动拉起，此时如果 Doris 出现非正常因素导致 BE 节点宕机，那么此时本来应该输出到 be.out 中的错误堆栈信息会被 supervisor 拦截，需要在 supervisor 的 log 中查找来进一步分析。
:::













