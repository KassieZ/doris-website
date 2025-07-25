---
{
   "title": "FQDN",
   "language": "en"
}
---

# FQDN

This article introduces how to enable the use of Apache Doris based on FQDN (Fully Qualified Domain Name). FQDN is the complete domain name of a specific computer or host on the Internet.

After Doris supports FQDN, communication between nodes is entirely based on FQDN. When adding various types of nodes, the FQDN should be directly specified. For example, the command to add a BE node is' ALTER SYSTEM ADD BACKEND "be_host:heartbeat_service_port",

'be_host' was previously the IP address of the BE node. After starting the FQDN, be_host should specify the FQDN of the BE node.

## Preconditions

1. fe.conf file set `enable_fqdn_mode = true`.
2. All machines in the cluster must be configured with a host name.
3. The IP address and FQDN corresponding to other machines in the cluster must be specified in the '/etc/hosts' file for each machine in the cluster.
4. /The etc/hosts file cannot have duplicate IP addresses.

## Best Practices

### Enable FQDN for new cluster

1. Prepare machines, for example, if you want to deploy a cluster of 3FE 3BE, you can prepare 6 machines.
2. Each machine returns unique results when executing 'host'. Assuming that the execution results of six machines are fe1, fe2, fe3, be1, be2, and be3, respectively.
3. Configure the real IPs corresponding to 6 FQDNs in the '/etc/hosts' of 6 machines, for example:
   ```
   172.22.0.1 fe1
   172.22.0.2 fe2
   172.22.0.3 fe3
   172.22.0.4 be1
   172.22.0.5 be2
   172.22.0.6 be3
   ```
4. Verification: It can 'ping fe2' on FE1, and can resolve the correct IP address and ping it, indicating that the network environment is available.
5. fe.conf settings for each FE node ` enable_ fqdn_ mode = true`.
6. Refer to[Standard deployment](../../install/cluster-deployment/standard-deployment)
7. Select several machines to deploy broker on six machines as needed, and execute `ALTER SYSTEM ADD BROKER broker_name "fe1:8000","be1:8000",...;`.

### Deployment of Doris for K8S

After an unexpected restart of the Pod, K8s cannot guarantee that the Pod's IP will not change, but it can ensure that the domain name remains unchanged. Based on this feature, when Doris enables FQDN, it can ensure that the Pod can still provide services normally after an unexpected restart.

Please refer to the method for deploying Doris in K8s[Kubernetes Deployment](../../install/cluster-deployment/k8s-deploy/operator-deploy)

### Server change IP

After deploying the cluster according to 'Enable FQDN for new cluster', if you want to change the IP of the machine, whether it is switching network cards or replacing the machine, you only need to change the '/etc/hosts' of each machine.

### Enable FQDN for old cluster

Precondition: The current program supports the syntax 'Alter SYSTEM MODIFY FRONTEND'<fe_ip>:<edit_log_port>'HOSTNAME'<fe_hostname>',
If not, upgrade to a version that supports the syntax

>Note that.
>
> At least three followers are required to perform the following operations, otherwise the cluster may not start properly

Next, follow the steps below:

1. Perform the following operations on the Follower and Observer nodes one by one (and finally on the Master node):

   1. Stop the node.
   2. Check if the node has stopped. Execute 'show frontends' through the MySQL client to view the Alive status of the FE node until it becomes false
   3. set FQDN for node: `ALTER SYSTEM MODIFY FRONTEND "<fe_ip>:<edit_log_port>" HOSTNAME "<fe_hostname>"`(After stopping the master, a new master node will be selected and used to execute SQL statements)
   4. Modify node configuration. Modify the 'conf/fe.conf' file in the FE root directory and add the configuration: `enable_fqdn_mode = true`. If the newly stopped node cannot be started properly after adding the configuration to the corresponding fe.config, please add the configuration 'enable_fqdn_mode=true' to all fe.config before starting the just stopped fe node.
   5. Start the node.

2. Enabling FQDN for BE nodes only requires executing the following commands through MySQL, and there is no need to restart BE.

   `ALTER SYSTEM MODIFY BACKEND "<backend_ip>:<HeartbeatPort>" HOSTNAME "<be_hostname>"`,If you don't know the number of HeartbeatPort, please use the command `show backends` to help find this port.


## Common problem

- Configuration item enable_ fqdn_ Can the mode be changed freely?

  Cannot be changed arbitrarily. To change this configuration, follow the 'Enable FQDN for old cluster' procedure.

