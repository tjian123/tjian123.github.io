---
layout: default
title: 搭建 k8s 集群环境
description: description
categories: 
   - category
tags: 
   - tag
---

> abstract

<!-- more -->
* TOC
{:toc}

## 安装和配置虚拟机节点

`hostnamectl set-hostname node` 配置主机名并持久化
`hostname` 查看主机名

### 安装 VirtualBox

### 下载和安装 CentOS 7 镜像

### 配置节点

配置 yum 源

配置静态 ip

```shell
cat /etc/sysconfig/network-scripts/ifcfg-enp0s3

TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=enp0s3
UUID=3b64d320-c3fe-4b71-858b-8c8a3e0a34fb
DEVICE=enp0s3
ONBOOT=yes
IPADDR=192.168.56.10
```

通过命令 `systemctl restart network` 重启网络生效

配置 hosts

```shell
192.168.56.10 node
192.168.56.11 node1
192.168.56.12 node2
```

## 配置 k8s 主从节点

### 配置主节点

安装 etcd 服务

```shell
yum install -y etcd.x86_64
```

`/etc/etcd/etcd.conf`

```shell
# 非 etcd 集群环境修改这一行即可
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"
```

* `systemctl start etcd` 启动 etcd 服务
* `systemctl enable etcd` 将 etcd 加入开机启动

`netstat -lntup` 查看到 etcd 监听服务

安装 kubernetes-master 服务

```shell
yum install -y kubernetes-master.x86_64
```

修改 apiserver 配置 `/etc/kubernetes/apiserver`

```shell
# 127.0.0.1 改为 0.0.0.0 支持
KUBE_API_ADDRESS="--insecure-bind-address=0.0.0.0"
```

修改 controller-manager 和 scheduler 的公共配置 `/etc/kubernetes/config`

依次启动 apiserver、controller-manager 和 scheduler 服务，并设置为开机自启动

```shell
systemctl start kube-apiserver.service
systemctl enable kube-apiserver.service

systemctl start kube-controller-manager.service
systemctl enable kube-controller-manager.service

systemctl start kube-scheduler.service
systemctl enable kube-scheduler.service
```

查看 master 节点配置状态 `kubectl get componentstatus`

```shell
NAME                 STATUS    MESSAGE             ERROR
scheduler            Healthy   ok
etcd-0               Healthy   {"health":"true"}
controller-manager   Healthy   ok
```

### 配置从节点

安装 kubernetes-node 服务

```shell
yum install -y kubernetes-node.x86_64
```

配置 config 服务 `/etc/kubernetes/config`

```shell
KUBE_MASTER="--master=http://192.168.56.10:8080"
```

配置 kubelet 服务 `/etc/kubernetes/kubelet`

```shell
KUBELET_ADDRESS="--address=192.168.56.11"

# 配置节点名称
KUBELET_HOSTNAME="--hostname-override=node1"

# 修改 apiserver 地址 
KUBELET_API_SERVER="--api-servers=http://192.168.56.10:8080"
```

重启 kubelet 和 kube-proxy 服务，并设置为开机自启动

```shell
systemctl start kubelet.service
systemctl enable kubelet.service

systemctl start kube-proxy.service
systemctl enable kube-proxy.service
```

出现错误 " dial tcp 192.168.56.10:8080: getsockopt: no route to host"，导致 kubectl get nodes 无法查看到从节点，原因是防火墙未关闭

```shell
systemctl stop firewalld.service  ## 关闭firewall防火墙
systemctl disable firewalld.service  ## 禁止开机启动
```

安装 flannel，实现跨 docker 宿主机的容器间通信

```shell
yum install flannel -y
```

修改 flannel 配置文件 `/etc/sysconfig/flanneld`

```shell
指定 etcd 服务地址
FLANNEL_ETCD_ENDPOINTS="http://192.168.56.10:2379"
```

在 master 节点使用 etcd 配置 flannel 网段

```shell
etcdctl set /atomic.io/network/config '{ "Network": "172.16.0.0/16" }'
```

启动 flannel 服务

```shell
systemctl start flannel
systemctl enable flannel
```

可以使用 ipconfig 查看，会发现多了一块 flannel0 网卡

重启 docker 服务，发现 docker0 网卡和 flannel0 网卡在同一个网段

/usr/lib/systemd/system/docker.service

systemctl daemon-reload

## POD: k8s 管理的最小资源

```yaml
cat nginx_pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: web
spec:
  containers:
    - name: nginx
      image: nginx:1.13
      ports:
        - containerPort: 80
```

创建 POD，kubectl create -f nginx_pod.yaml

报错：Error from server (ServerTimeout): error when creating "nginx_pod.yaml": No API token found for service account "default", retry after the token is automatically created and added to the service account

因为 apiserver 使用了一个 account 插件，在 apiserver 的配置文件中将其删除即可

KUBE_ADMISSION_CONTROL="--admission-control=NamespaceLifecycle,NamespaceExists,LimitRanger,SecurityContextDeny,ServiceAccount,ResourceQuota"

改为

KUBE_ADMISSION_CONTROL="--admission-control=NamespaceLifecycle,NamespaceExists,LimitRanger,SecurityContextDeny,ResourceQuota"

改完重启 kube-apiserver 服务

使用 kubectl get pods 查看 POD 列表，-o wide 可以查看到节点
使用 kubectl get pod nginx 查看指定 POD
使用 kubectl describe pod nginx 查看 POD 详情

创建 POD 报错，Error syncing pod, skipping: failed to "StartContainer" for "POD" with ErrImagePull: "image pull failed for registry.access.redhat.com/rhel7/pod-infrastructure:latest, this may be because there are no credentials on this request.  details: (open /etc/docker/certs.d/registry.access.redhat.com/redhat-ca.crt: no such file or directory)"

原因是无法从 registry.access.redhat.com/rhel7 拉取 pod-infrastructure:latest 镜像，需要修改 /etc/kubernete/kubelet 配置，不从红帽仓库拉取

KUBELET_POD_INFRA_CONTAINER="--pod-infra-container-image=docker.io/tianyebj/pod-infrastructure:latest"

同时可以配置 docker 加速，加快拉取镜像速度

/etc/sysconfig/docker

OPTIONS='--selinux-enabled --log-driver=journald --signature-verification=false --registry-mirror=https://registry.docker-cn.com --insecure-registry=192.168.56.10:5000'

systemctl docker restart

起一个本地私有 docker 仓库

docker run -d -p 5000:5000 --restart=always --name registry -v /opt/myregistry:/var/lib/registry --privileged=true registry

向本地私有仓库传镜像

```shell
docker tag docker.io/tianyebj/pod-infrastructure:latest 192.168.56.10:5000/pod-infrastructure:latest
docker push 192.168.56.10:5000/pod-infrastructure:latest
```

push 到私有仓库报错：err.detail="filesystem: mkdir /var/lib/registry/docker: permission denied"

解决办法，启动 docker 时提权 --privileged=true

使用  kubectl delete pod nginx 可以删除指定的 pod

## RC: Replication Controller 副本控制器

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: myweb
spec:
  replicas: 2
  selector:
    app: myweb
  template:
    metadata:
      labels:
        app: myweb
    spec:
      containers:
        - name: myweb
          image: 192.168.56.10:5000/nginx:1.13
          ports:
            containerPort: 80
```

使用副本滚动升级

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: myweb2
spec:
  replicas: 2
  selector:
    app: myweb2
  template:
    metadata:
      labels:
        app: myweb2
    spec:
      containers:
        - name: myweb2
          image: 192.168.56.10:5000/nginx:1.15
          ports:
            - containerPort: 80
```

使用升级指令 `kubectl rolling-update myweb -f nginx-update-rc.yaml --update-period=5s`

回滚也是使用 rolling-update，相当于升级到旧版本

升级途中中断，可以使用 kubectl rolling-update myweb myweb2 --rollback 可以指定回滚

## Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: webservice
spec:
  type: NodePort
  ports:
    - port: 80
      nodePort: 3000
      targetPort: 80
  selector:
    app: webservice
```

服务发现

kubectl scale rc myweb --replicas=4 扩容后使用 kubectl describe svc myweb 发现扩容的 pod 自动加入了服务

负载均衡

自带简单的负载均衡

**关于映射的端口 30000 的问题** ，默认只能使用大于 30000 的端口，可以修改 apiserver 的配置 /etc/kubernates/apiserver

```shell
--service-node-port-range=30000-50000
```

**解决多个虚拟机节点的 flanneld 子网一致的问题**，原因：读取了同一个默认的网卡，这个网卡的 ip 地址有一样，导致每个节点上初始化时子网段变成了一样，修改 flanneld 配置文件，指定我们绑定了不同静态 ip 的网卡，即可解决问题

```shell
# 增加启动参数，指定网卡
FLANNEL_OPTIONS="-iface=enp0s3"
```

**解决跨节点 docker 容器间网络互通问题**，原因：iptables 默认 FORWARD 规则为 DROP，需要修改为 ACCEPT

```shell
iptables -P FORWARD ACCEPT
```

## Deployment 资源

使用 rc 升级版本，升级后标签发生变化，导致 svc 无法关联升级后的 pod，这样 svc 短时间内就会无法访问需要手动修复。

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mydeploy
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: 192.168.56.10:5000/nginx:1.13
        ports:
        - containerPort: 80
```

deployment 实际是通过 rs 创建的 POD

```shell
[root@node deply]# kubectl get all -o wide
NAME              DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/mydeploy   3         3         3            3           8s

NAME             CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE       SELECTOR
svc/kubernetes   10.254.0.1   <none>        443/TCP   17h       <none>

NAME                     DESIRED   CURRENT   READY     AGE       CONTAINER(S)   IMAGE(S)                        SELECTOR
rs/mydeploy-4024287422   3         3         3         8s        nginx          192.168.56.10:5000/nginx:1.13   app=nginx,pod-template-hash=4024287422

NAME                           READY     STATUS    RESTARTS   AGE       IP            NODE
po/mydeploy-4024287422-7dr84   1/1       Running   0          8s        172.16.84.2   node1
po/mydeploy-4024287422-8fn0g   1/1       Running   0          8s        172.16.61.2   node2
po/mydeploy-4024287422-c24j4   1/1       Running   0          8s        172.16.82.3   node

```

deployment 实际没有部署 svc，外界不能访问服务，需要来关联一个 svc

```shell
kubectl expose deployment mydeploy --port=80 --type=NodePort 
```

### 升级

升级不需要另写配置文件，只需要通过 kubectl edit deployment mydeploy 即可

### 回滚

kubectl rollout undo deployment mydeploy

```shell
[root@node deply]# curl -I 192.168.56.10:30099
HTTP/1.1 200 OK
Server: nginx/1.15.12
Date: Thu, 19 Oct 2023 06:23:23 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Tue, 16 Apr 2019 13:08:19 GMT
Connection: keep-alive
ETag: "5cb5d3c3-264"
Accept-Ranges: bytes

[root@node deply]# kubectl rollout undo deployment mydeploy
deployment "mydeploy" rolled back
[root@node deply]#
[root@node deply]#
[root@node deply]#
[root@node deply]# curl -I 192.168.56.10:30099
HTTP/1.1 200 OK
Server: nginx/1.13.12
Date: Thu, 19 Oct 2023 06:23:33 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Mon, 09 Apr 2018 16:01:09 GMT
Connection: keep-alive
ETag: "5acb8e45-264"
Accept-Ranges: bytes
```

### 查看历史版本

kubectl rollout history deployment mydeploy

```shell
[root@node deply]# kubectl rollout history deployment mydeploy
deployments "mydeploy"
REVISION        CHANGE-CAUSE
2               <none>
3               <none>
```

### 最佳实践

1. deploy

kubectl run nginx --image=192.168.10:5000/nginx:1.13 --replicas=3 --record

```shell
[root@node deply]# kubectl rollout history deployment nginx
deployments "nginx"
REVISION        CHANGE-CAUSE
1               kubectl run nginx --image=192.168.56.10:5000/nginx:1.13 --replicas=3 --record
```

2. update

kubectl set image deploy nginx nginx=192.168.56.10:5000/nginx:1.15

```shell
[root@node deply]# kubectl rollout history deployment nginx
deployments "nginx"
REVISION        CHANGE-CAUSE
1               kubectl run nginx --image=192.168.56.10:5000/nginx:1.13 --replicas=3 --record
2               kubectl set image deploy nginx nginx=192.168.56.10:5000/nginx:1.15
```

3. 回滚

kubectl rollout undo deployment nginx --to-revision=1

```shell
[root@node deply]# kubectl rollout history deployment nginx
deployments "nginx"
REVISION        CHANGE-CAUSE
2               kubectl set image deploy nginx nginx=192.168.56.10:5000/nginx:1.15
3               kubectl run nginx --image=192.168.56.10:5000/nginx:1.13 --replicas=3 --record
```

这种方式会保留每次操作记录的命令

## 服务间互通

使用 virtual ip

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: 192.168.56.10:5000/mysql:5.7
          ports:
          - containerPort: 3306
          env:
          - name: MYSQL_ROOT_PASSWORD
            value: '123456'
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  ports:
    - port: 3306
      targetPort: 3306
  selector:
    app: mysql

```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  ports:
    - port: 3306
      targetPort: 3306
  selector:
    app: mysql
[root@node tomcat_demo]# cat tomcat-rc.yml
apiVersion: v1
kind: ReplicationController
metadata:
  name: myweb
spec:
  replicas: 1
  selector:
    app: myweb
  template:
    metadata:
      labels:
        app: myweb
    spec:
      containers:
        - name: myweb
          image: 192.168.56.10:5000/tomcat-app:v2
          ports:
          - containerPort: 8080
          env:
          - name: MYSQL_SERVICE_HOST
            value: '10.254.208.227'
          - name: MYSQL_SERVICE_PORT
            value: '3306'
```

**注**：`10.254.208.227` 是通过 `kubectl get pods -o wide` 查询 mysql 服务实际的 vip 得到

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myweb
spec:
  type: NodePort
  ports:
    - port: 8080
      nodePort: 30008
  selector:
    app: myweb

```

## 附加组件 DNS 服务

k8s 有一个很重要的特性：服务发现。一旦一个 service 被创建，该 servcie 的 ip 和 port 信息就可以被注入到 pod 中供 pod 使用。

k8s 主要支持两种 service 发现机制：环境变量和 DNS。

没有 DNS 服务的时候，k8s 会采用环境变量的形式。但是一旦服务数量多起来，环境变量就会很复杂，为了解决这个问题，就需要使用 DNS 服务。

skydns crondns

```yaml
# Copyright 2016 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# TODO - At some point, we need to rename all skydns-*.yaml.* files to kubedns-*.yaml.*
# Should keep target in cluster/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml
# in sync with this file.

# __MACHINE_GENERATED_WARNING__

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: kube-dns
  namespace: kube-system
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
spec:
  replicas: 1
  # replicas: not specified here:
  # 1. In order to make Addon Manager do not reconcile this replicas parameter.
  # 2. Default is 1.
  # 3. Will be tuned in real time if DNS horizontal auto-scaling is turned on.
  strategy:
    rollingUpdate:
      maxSurge: 10%
      maxUnavailable: 0
  selector:
    matchLabels:
      k8s-app: kube-dns
  template:
    metadata:
      labels:
        k8s-app: kube-dns
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ''
        scheduler.alpha.kubernetes.io/tolerations: '[{"key":"CriticalAddonsOnly", "operator":"Exists"}]'
    spec:
      containers:
      - name: kubedns
        image: myhub.fdccloud.com/library/kubedns-amd64:1.9
        resources:
          # TODO: Set memory limits when we've profiled the container for large
          # clusters, then set request = limit to keep this container in
          # guaranteed class. Currently, this container falls into the
          # "burstable" category so the kubelet doesn't backoff from restarting it.
          limits:
            memory: 170Mi
          requests:
            cpu: 100m
            memory: 70Mi
        livenessProbe:
          httpGet:
            path: /healthz-kubedns
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 60
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 5
        readinessProbe:
          httpGet:
            path: /readiness
            port: 8081
            scheme: HTTP
          # we poll on pod startup for the Kubernetes master service and
          # only setup the /readiness HTTP server once that's available.
          initialDelaySeconds: 3
          timeoutSeconds: 5
        args:
        - --domain=cluster.local.
        - --dns-port=10053
        - --config-map=kube-dns
        - --kube-master-url=http://192.168.56.10:8080
        # This should be set to v=2 only after the new image (cut from 1.5) has
        # been released, otherwise we will flood the logs.
        - --v=0
        #__PILLAR__FEDERATIONS__DOMAIN__MAP__
        env:
        - name: PROMETHEUS_PORT
          value: "10055"
        ports:
        - containerPort: 10053
          name: dns-local
          protocol: UDP
        - containerPort: 10053
          name: dns-tcp-local
          protocol: TCP
        - containerPort: 10055
          name: metrics
          protocol: TCP
      - name: dnsmasq
        image: myhub.fdccloud.com/library/kube-dnsmasq-amd64:1.4
        livenessProbe:
          httpGet:
            path: /healthz-dnsmasq
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 60
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 5
        args:
        - --cache-size=1000
        - --no-resolv
        - --server=127.0.0.1#10053
        #- --log-facility=-
        ports:
        - containerPort: 53
          name: dns
          protocol: UDP
        - containerPort: 53
          name: dns-tcp
          protocol: TCP
        # see: https://github.com/kubernetes/kubernetes/issues/29055 for details
        resources:
          requests:
            cpu: 150m
            memory: 10Mi
      - name: dnsmasq-metrics
        image: myhub.fdccloud.com/library/dnsmasq-metrics-amd64:1.0
        livenessProbe:
          httpGet:
            path: /metrics
            port: 10054
            scheme: HTTP
          initialDelaySeconds: 60
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 5
        args:
        - --v=2
        - --logtostderr
        ports:
        - containerPort: 10054
          name: metrics
          protocol: TCP
        resources:
          requests:
            memory: 10Mi
      - name: healthz
        image: myhub.fdccloud.com/library/exechealthz-amd64:1.2
        resources:
          limits:
            memory: 50Mi
          requests:
            cpu: 10m
            # Note that this container shouldn't really need 50Mi of memory. The
            # limits are set higher than expected pending investigation on #29688.
            # The extra memory was stolen from the kubedns container to keep the
            # net memory requested by the pod constant.
            memory: 50Mi
        args:
        - --cmd=nslookup kubernetes.default.svc.cluster.local 127.0.0.1 >/dev/null
        - --url=/healthz-dnsmasq
        - --cmd=nslookup kubernetes.default.svc.cluster.local 127.0.0.1:10053 >/dev/null
        - --url=/healthz-kubedns
        - --port=8080
        - --quiet
        ports:
        - containerPort: 8080
          protocol: TCP
      dnsPolicy: Default  # Don't use cluster DNS.

```

```yaml
# Copyright 2016 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# TODO - At some point, we need to rename all skydns-*.yaml.* files to kubedns-*.yaml.*

# Warning: This is a file generated from the base underscore template file: skydns-svc.yaml.base

apiVersion: v1
kind: Service
metadata:
  name: kube-dns
  namespace: kube-system
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: "KubeDNS"
spec:
  selector:
    k8s-app: kube-dns
  clusterIP: 10.254.230.254
  ports:
  - name: dns
    port: 53
    protocol: UDP
  - name: dns-tcp
    port: 53
    protocol: TCP
```

分别起 deploy 和 service

修改 kubelet 配置文件

```yaml
KUBELET_ARGS="--cluster_dns=10.254.230.254 --cluster_domain=cluster.local"
```

## 探针

livenessProbe：健康状态检查

周期性检查服务是否存活，如果检查失败将重启容器

readinessProbe：可用性检查

周期性检查服务是否可用，不可用将从 service 的 endpoints 移除

检测方法，3种之一：

1. exec：执行一个命令
2. httpGet：检测某个请求是否响应
3. tcpSocket: 检测某个端口是否响应

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test_exec
sec:
  containers:
  - name: nginx
    image: 192.168.56.10:5000/nginx:1.13
    ports:
    - containerPort: 80
    args:
    - /bin/sh
    - -c
    - touch /tmp/healthy; sleep 30; rm -fr /tmp/healthy; sleep 60
    livenessProbe:
      exec:
        command:
          - cat
          - /tmp/healthy
      initialDelaySeconds: 5
      periodSeconds: 3
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test_httpget
sec:
  containers:
  - name: nginx
    image: 192.168.56.10:5000/nginx:1.13
    ports:
    - containerPort: 80
    livenessProbe:
      httpGet:
        path: /index.html
        port: 80
      initialDelaySeconds: 3
      periodSeconds: 3
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test_socket
sec:
  containers:
  - name: nginx
    image: 192.168.56.10:5000/nginx:1.13
    ports:
    - containerPort: 80
    livenessProbe:
      tcpSocket:
        port: 80
      initialDelaySeconds: 3
      periodSeconds: 3
```

## Dashboard

## Namespace

Namespace 是 k8s 系统中一个非常重要的爱念，很多情况下用于多租户的资源隔离。

* 创建：kubectl create namespace myspace
* 删除：kubectl delete namespace myspace，**注，删除 namespace 会删除该命名空间下所有资源**
* 查看：kubectl get namespace
  * 查看指定 namespace 的资源，kubectl get pods --namespace=myspace
  * 查看所有命名空间下的资源， kubectl get all --all-namespaces

实践中会将同一个业务相关的放在一个 namespace 中

## 通过反向代理访问 k8s 中的应用

```yaml
type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30008

type: ClusterIP
  ports:
  - port: 80
    targetPort: 80

```

通过代理方式访问服务 `http://<ip>:8080/api/v1/proxy/namespaces/<myspace>/services/<myapp>/`，实际上是通过 ClusterIP 的端口方式

## 弹性伸缩

HPA，Horizontal Pod AutoScaler 的操作对象时 RC(Replication Controller)、RS(ReplicaSet)或Deployment对应的 POD，根据观察到 CPU 使用量与用户阈值进行比对，做出是否需要增减实例数的决策。

```yaml
spec:
  containers:
  - name: nginx
    image: 192.168.56.10:5000/nginx:1.13
    ports:
    - containerPort: 80
    resources:
      limits:
        cpu: 100m
        memory: 50Mi
      requests:
        cpu: 100m
        memory: 50Mi
```


验证：

先创建 RC

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: hpademo
spec:
  replicas: 2
  selector:
    app: hpademo
  template:
    metadata:
      labels:
        app: hpademo
    spec:
      containers:
      - name: hpademo
        image: 192.168.56.10:5000/nginx:1.13
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: 100m
            memory: 50Mi
          requests:
            cpu: 100m
            memory: 50Mi
```

然后创建 hpa

`kubectl autoscale replicationcontroller hpademo --max=8 --min=1 --cpu-percent=10`

使用 ab 压测

## k8s 存储

pv，persist volume，由管理员添加一个储存的描述，是一个全局资源，包含存储的类型、存储的大小和访问模式等，它的生命周期独立于 POD，使用它的 Pod 销毁时对它没有影响。

pvc，Persist Volume Claim，是 namespace 里的资源，描述的是对 PV 的一个请求，请求包含存储大小、访问模式等

安装 nfs，`yum install -y nfs-utils`
修改 master 节点配置 /etc/exports 文件 `/data 192.168.0.0/16(rw,async,no_root_squash,no_all_squash)`

创建 pv

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test
  labels:
    type: test
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Recycle
  nfs:
    path: "/data/k8s"
    server: 192.168.56.10
    readOnly: false
```

### 持久化实战

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mysql
  labels:
    type: mysql
spec:
  capacity:
    storage: 500Mi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Recycle
  nfs:
    path: "/data/mysql"
    server: 192.168.56.10
    readOnly: false
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 500Mi
```

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: 192.168.56.10:5000/mysql:5.7
          ports:
          - containerPort: 3306
          env:
          - name: MYSQL_ROOT_PASSWORD
            value: '123456'
          volumeMounts:
          - name: data
            mountPath: /var/lib/mysql
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: mysql
```

删除 mysql POD 后自动新建的 POD 仍然可以保留数据

## 分布式文件系统

nfs
glusterfs 是一个开源分布式文件系统，具有强大的横向扩展能力，可支持 PB 级存储容量和数千客户端连接，通过网络互联成一个并行的网络文件系统。具有可扩展性、高可用性、高性能等特点。

安装 glusterfs

```shell
yum install -y centos-release-gluster
yum install -y glusterfs-server
```

启动

```shell
systemctl start glusterd.service
systemctl enable glusterd.service
```

创建挂载目录

mkdir -p /gfs/test1
mkdir -p /gfs/test2

常用命令

* `gluster pool list` 查看资源池
* `gluster peer probe node1` 添加资源池
* `gluster peer detach node1` 解除资源池

创建分布式复制卷

`gluster volume create mygfs replica 2 node:/gfs/test1 node:/gfs/test2 node1:/gfs/test1 node1:/gfs/test2 force`

启动

`gluster volume start mygfs`

查看状态

`gluster colume info mygfs`

挂载

`mount -f glusterfs 192.168.56.10:/mygfs /mnt`

安装 gitlab
