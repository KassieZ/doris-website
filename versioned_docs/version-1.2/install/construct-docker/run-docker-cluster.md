---
{
    "title": "Deploy Docker cluster",
    "language": "en"
}
---

# Deploy the Docker cluster

## Background description

This article will briefly describe how to quickly build a complete Doris test cluster through `docker run` or `docker-compose up` commands.

## Applicable scene

It is recommended to use Doris Docker in SIT or DEV environment to simplify the deployment process.

If you want to test a certain function point in the new version, you can use Doris Docker to deploy a Playground environment. Or when you want to reproduce a certain problem during debugging, you can also use the docker environment to simulate.

In the production environment, currently try to avoid using containerized solutions for Doris deployment.

## Software Environment

| Software | Version |
| -------------- | ----------- |
| Docker | 20.0 and above |
| docker-compose | 2.10 and above |

## Hardware environment

| Configuration Type | Hardware Information | Maximum Running Cluster Size |
| -------- | -------- | ---------------- |
| Minimum configuration | 2C 4G | 1FE 1BE |
| Recommended configuration | 4C 16G | 3FE 3BE |

## Pre-environment preparation

The following command needs to be executed on the host machine

```shell
sysctl -w vm.max_map_count=2000000
```

## Docker Compose

Different platforms need to use different Image images. This article takes the `X86_64` platform as an example.

### Network Mode Description

There are two network modes applicable to Doris Docker.

1. HOST mode suitable for deployment across multiple nodes, this mode is suitable for deploying 1FE 1BE on each node.
2. The subnet bridge mode is suitable for deploying multiple Doris processes on a single node. This mode is suitable for single-node deployment (recommended). If you want to deploy multiple nodes, you need to deploy more components (not recommended).

For the sake of presentation, this chapter only demonstrates scripts written in subnet bridge mode.

### Interface Description

From the version of `Apache Doris 1.2.1 Docker Image`, the interface list of each process image is as follows:

| process name | interface name | interface definition | interface example |
| -------------- |-------------| ------------------- | -------------------------------------------------------------- |
| `FE\BE\BROKER`    | FE_SERVERS | FE node main information | fe1:172.20.80.2:9010,fe2:172.20.80.3:9010,fe3:172.20.80.4:9010 |
| FE | FE_ID       | FE node ID | 1 |
| BE | BE_ADDR     | BE node main information | 172.20.80.5:9050 |
| BE | NODE_ROLE | BE node type | computation |
| BROKER | BROKER_ADDR | Main information of BROKER node | 172.20.80.6:8000 |

Note that the above interface must fill in the information, otherwise the process cannot be started.

> FE_SERVERS interface rules are: `FE_NAME:FE_HOST:FE_EDIT_LOG_PORT[,FE_NAME:FE_HOST:FE_EDIT_LOG_PORT]`
>
> The FE_ID interface rule is: an integer of `1-9`, where the FE number `1` is the Master node.
>
> BE_ADDR interface rule is: `BE_HOST:BE_HEARTBEAT_SERVICE_PORT`
>
> The NODE_ROLE interface rule is: `computation` or empty, where empty or other values indicate that the node type is `mix` type
>
> BROKER_ADDR interface rule is: `BROKER_HOST:BROKER_IPC_PORT`

### Script Template

#### Docker Run command

Create a subnet bridge

``` shell
docker network create --driver bridge --subnet=172.20.80.0/24 doris-network
```

1FE & 1BE Command Templates

```shell
docker run -itd \
--name=fe \
--env FE_SERVERS="fe1:172.20.80.2:9010" \
--env FE_ID=1 \
-p 8030:8030 \
-p 9030:9030 \
-v /data/fe/doris-meta:/opt/apache-doris/fe/doris-meta \
-v /data/fe/conf:/opt/apache-doris/fe/conf \
-v /data/fe/log:/opt/apache-doris/fe/log \
--network=doris-network \
--ip=172.20.80.2 \
apache/doris:1.2.1-fe-x86_64

docker run -itd \
--name=be \
--env FE_SERVERS="fe1:172.20.80.2:9010" \
--env BE_ADDR="172.20.80.3:9050" \
-p 8040:8040 \
-v /data/be/storage:/opt/apache-doris/be/storage \
-v /data/be/conf:/opt/apache-doris/be/conf \
-v /data/be/log:/opt/apache-doris/be/log \
--network=doris-network \
--ip=172.20.80.3 \
apache/doris:1.2.1-be-x86_64  # if CPU does not support AVX2, use
                              # apache/doris:1.2.1-be-x86_64-noavx2
```

> Note: if you CPU does not support AVX2, the backend will fail to start. 
> If this is the case, use the `apache/doris:X.X.X-be-x86_64-noavx2` backend image.
> Use `docker logs -f be` to check the backend for error messages.

3FE & 3BE run command template can be downloaded [here](https://github.com/apache/doris/tree/master/docker/runtime/docker-compose-demo/build-cluster/rum-command/3fe_3be.sh).

#### Docker Compose script

1FE & 1BE template

```yaml
version: '3'
services:
   docker-fe:
     image: "apache/doris:1.2.1-fe-x86_64"
     container_name: "doris-fe"
     hostname: "fe"
     environment:
       - FE_SERVERS=fe1:172.20.80.2:9010
       - FE_ID=1
     ports:
       - 8030:8030
       - 9030:9030
     volumes:
       - /data/fe/doris-meta:/opt/apache-doris/fe/doris-meta
       - /data/fe/conf:/opt/apache-doris/fe/conf
       - /data/fe/log:/opt/apache-doris/fe/log
     networks:
       doris_net:
         ipv4_address: 172.20.80.2
   docker-be:
     image: "apache/doris:1.2.1-be-x86_64"  # use apache/doris:1.2.1-be-x86_64-noavx2, if CPU does not support AVX2
     container_name: "doris-be"
     hostname: "be"
     depends_on:
       - docker-fe
     environment:
       - FE_SERVERS=fe1:172.20.80.2:9010
       - BE_ADDR=172.20.80.3:9050
     ports:
       - 8040:8040
     volumes:
       - /data/be/storage:/opt/apache-doris/be/storage
       - /data/be/conf:/opt/apache-doris/be/conf
       - /data/be/script:/docker-entrypoint-initdb.d
       - /data/be/log:/opt/apache-doris/be/log
     networks:
       doris_net:
         ipv4_address: 172.20.80.3
networks:
   doris_net:
     ipam:
       config:
         - subnet: 172.20.80.0/16
```

3FE & 3BE Docker Compose file can be downloaded [here](https://github.com/apache/doris/tree/master/docker/runtime/docker-compose-demo/build-cluster/docker-compose/3fe_3be/docker-compose.yaml).

## Deploy Doris Docker

You can choose one of the two deployment methods:

1. Execute the `docker run` command to create a cluster
2. Save the `docker-compose.yaml` script and execute the `docker-compose up -d` command in the same directory to create a cluster

### Special case description

Due to the different ways of implementing containers internally on MacOS, it may not be possible to directly modify the value of `max_map_count` on the host during deployment. You need to create the following containers first:

```shel
docker run -it --privileged --pid=host --name=change_count debian nsenter -t 1 -m -u -n -i sh
```

The container was created successfully executing the following command:

```shell
sysctl -w vm.max_map_count=2000000
```

Then `exit` exits and creates the Doris Docker cluster.

## Unfinished business

1. Compose Demo List
