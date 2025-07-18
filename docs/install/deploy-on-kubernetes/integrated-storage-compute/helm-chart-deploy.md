---
{
  "title": "Deploy Doris on Helm Chart",
  "language": "en"
}
---

[Helm](https://helm.sh/) is the best way to find, share, and use software built for Kubernetes. Helm Charts help to define, install, and upgrade even the most complex Kubernetes application.
Helm Chart makes it easy to deploy Doris clusters and skip difficult configuration steps.

## Add Helm repository of Doris-Operator

This [Doris repository](https://artifacthub.io/packages/search?ts_query_web=doris&sort=relevance&page=1) have resources about RBAC , deployment ...etc for doris-operator running.
1. Add the Doris repository
  ```shell
  $ helm repo add doris-repo https://charts.selectdb.com
  ```
2. Update the Chart to the latest version
  ```shell
  $ helm repo update doris-repo
  ```
3. Check the Helm Chart Repo is the latest version
  ```shell
  $ helm search repo doris-repo
  NAME                          CHART VERSION    APP VERSION   DESCRIPTION
  doris-repo/doris-operator     1.3.1            1.3.1         Doris-operator for doris creat ...
  doris-repo/doris              1.3.1            2.0.3         Apache Doris is an easy-to-use ...
  ```

## Install doris-operator

### 1. Install
- Install [doris-operator](https://artifacthub.io/packages/helm/doris/doris-operator)，with default config  in a namespace named `doris`
  ```shell
  $ helm install operator doris-repo/doris-operator
  ```
- The repo defines the basic function for running doris-operator, Please use next command to deploy operator, when you have completed customization of [values.yaml](https://artifacthub.io/packages/helm/doris/doris-operator?modal=values)
  ```shell
  $ helm install -f values.yaml operator doris-repo/doris-operator 
  ```
### 2. Validate installation Status
Check the deployment status of Pods through the `kubectl get pods` command.
Observe that the Pod of doris-operator is in the Running state and all containers in the Pod are ready, that means, the deployment is successful.
```shell
$ kubectl get pod --namespace doris
NAME                              READY   STATUS    RESTARTS   AGE
doris-operator-866bd449bb-zl5mr   1/1     Running   0          18m
```

## Install doriscluster

### 1. Install
- Use default config for deploying [doriscluster](https://artifacthub.io/packages/helm/doris/doris). This only deploys 3 FE and 3 BE components and using default `storageClass` for providing persistent volume.
  ```shell
  $ helm install doriscluster doris-repo/doris
  ```
- Custom Doris deploying, specify resources or different deployment type, please customize the resource configuration according to the annotations of each resource configuration in [values.yaml](https://artifacthub.io/packages/helm/doris/doris?modal=values) and use next command for deploying.
  ```shell
  $ helm install -f values.yaml doriscluster doris-repo/doris 
  ```
### 2. Validate installation Status
After executing the installation command, deployment and distribution, service deployment scheduling and startup will take a certain amount of time.
Check the deployment status of Pods through the `kubectl get pods` command.

Observe that the Pod of `doriscluster` is in the `Running` state and all containers in the Pod are ready, that means, the deployment is successful.
```shell
$  kubectl get pod --namespace doris
NAME                     READY   STATUS    RESTARTS   AGE
doriscluster-helm-fe-0   1/1     Running   0          1m39s
doriscluster-helm-fe-1   1/1     Running   0          1m39s
doriscluster-helm-fe-2   1/1     Running   0          1m39s
doriscluster-helm-be-0   1/1     Running   0          16s
doriscluster-helm-be-1   1/1     Running   0          16s
doriscluster-helm-be-2   1/1     Running   0          16s
```

## Uninstall Doris by Helm

### Uninstall doriscluster
Please confirm the Doris is not used, when using next command to uninstall `doriscluster`.
```shell
$ helm uninstall doriscluster
```
### Uninstall doris-operator
Please confirm that Doris is not running in Kubernetes, use next command to uninstall `doris-operator`.
```shell
$ helm uninstall operator
```
