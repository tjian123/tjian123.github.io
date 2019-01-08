---
layout: default
title: k8s 的基本用法
categories: 
  - 容器技术
tags: 
  - k8s
---

前置条件：
- 安装 minikube 及 kubectl
- 安装 nodejs
- 安装 docker

假定工作目录为 'k8s-demo'，我们后续的操作都在改，目录下进行。

```shell
mkdir ~/k8s-demo && cd ~/k8s-demo
```

## 物理机上跑起简单 web 服务

### 1. server.js

创建简单的 node 服务端脚本，命名为 'server.js'，其内容如下：

```javascript
var http = require('http');
var httpHandler = function(request, response) {
  console.log('Receive request URL ' + requset.url);
  response.header(200);
  response.end('Hello, K8S');
};
var www = http.createServer(httpHandler);
www.listen(8080);
```

以上脚本监听 '8080' 端口，并对所有 'http' 请求返回 'Hello，K8S'。

### 2. 启动服务

直接使用 `node` 命令启动服务。

```shell
node server.js
```

### 3. 访问服务

可以使用 `curl` 命令来检测服务。（也可以使用浏览器直接访问。）

```shell
curl http://localhost:8080
```

应输出为 'Hello, K8S'。

### 4. 停止服务

直接使用 `CTRL + c` 中断服务即可。

## 构建 Docker 镜像，使用 Docker 镜像跑起简单 web 服务

### 1. Dockerfile

创建简单的 'Dockerfile' 文件，用于构建自定义镜像，其内容如下：

```dockerfile
FROM node:4.4
COPY server.js .
EXPOSE 8080
CMD node server.js
```

以上文件：
- 定义以 'node:4.4' 镜像为基础镜像
- 拷贝之前的 'server.js' 文件
- 暴露 '8080' 端口
- 定义容器启动命令为 `node server.js`

### 2. 构建镜像

假定镜像名称为 'hello-node'，版本为 'v0.1'，构建命令如下：

```shell
docker build -t hello-node:v0.1 .
```

构建成功后，可以通过 `docker images` 命令列出来。

### 3. 启动容器

假定容器的名称为 'hello-node'，启动命令为：

```shell
docker run -d -p 8080:8080 --name hello-node hello-node:v0.1
```

其中 '-d' 选项指定容器以后台方式运行。

### 4. 访问服务

同上，可以使用 `curl` 命令或者浏览器直接访问，略。

### 5. 停止及删除容器

```shell
docker stop hello-node && docker destroy hello-node
```

注：先不要删除镜像，后面 'k8s' 还需要使用。

## 在 'K8S' 上跑起简单 web 服务

'K8S' 是基于容器技术发展起来的，其与 'docker' 天然联系紧密。

可以通过 `kubectl cluster-info` 命令查看集群信息。

### 1. 创建 hello-node POD

一个 k8s POD 实际是一个容器组，一个容器组包含一个或多个容器。

创建 'hello-node' POD，命令如下：

```shell
kubectl run hello-node --image=hello-node:v0.1 --port=8080
```

`kubectl run` 命令实际创建了一个 'deployment'，可以通过 `kubectl get deployments` 命令查看。
也可以通过 `kubectl get pods` 命令查看所有的 POD，只是创建的 POD 名字不只是 'hello-node'。

### 2. 暴露服务

此时，k8s 应该启动并管理了我们 'hello-node' 的 docker 容器，但是还无法直接访问。

运行以下命令来暴露服务，使得集群外可以访问：

```shell
kubectl expose deployment hello-node --type="LoadBalancer"
```

可以通过以下命令查看所有服务：

```shell
kubectl get services
```

### 3. 访问服务

同上，可以使用 `curl` 命令或者浏览器来访问服务。

### 4. 服务扩容

使用 k8s，可以非常方便的实现服务扩容，比如我们需要运行 4 个 'hello-node' 服务，那么只需要运行以下命令：

```shell
kubectl scale deployment hello-node --replicas=4
```

实在是太容易了！

可以通过 `kubectl get pods` 或者 `kubectl get deployments` 来查看扩容后的情况。

### 5. 服务升级

修改 server.js 文件，使其内容如下（只更改了输出）：

```javascript
var http = require('http');
var httpHandler = function(request, response) {
  console.log('Received request URL ' + request.url);
  response.header(200);
  response.end('Hello, K8S world!');
};
var www = http.createServer(httpHandler);
www.listen(8080);
```
重新构建 docker 容器，更新版本为 'v0.2'。

使用如下命令，来升级 'hello-node' 服务：

```shell
kubectl set image deployment/hello-noe hello-node=hello-noe:v0.2
```

重新访问服务，即可发现服务已平滑升级。

超赞！

### 6. 删除集群

不在需要的服务集群需要删除，使用以下命令：

```shell
kubectl delete server,deployment hello-node
```

### 7. 删除不需要的 docker 镜像

使用如下命令：

```shell
docker rmi hello-node:v0.1
```
