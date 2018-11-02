---
layout: post
title: ONOS 中 grpc 应用跟踪
categories: [调研]
tags: [SDN, ONOS, Grpc]
---

> rpc —— 远程过程调用，是对跨域操作的一种称呼；grpc，其中`g`是`Google`的`g`。grpc 是 Google 公司的一种 rpc 实现。

<!--more-->

ONOS 中与 grpc 相关的 bundle 目前都在 incubator 目录下（表示尚不成熟，孵化阶段）：

```
- grpc: 定义了 maven 形式的 grpc feature，已废弃不用。
- grpc-dependencies: grpc 重编译以支持 osgi，对 grpc 和 P4 都有用。
- protobuf: grpc 组主要工作目录
	- api: api 声明，目前只是定义一个注册 grpc 服务的接口。
	- models: 用于 grpc 的 protobuf 模型定义，以及转换工具类。
	- registry: 实现了 api 中定义的注册接口。
	- services: 实现 protobuf 中的 service。
		- nb: 北向 service 实现。
- protobuf-dependencies: 用于编译 protobuf 文件。
- protobuf-nb: 作用未知，可忽略。
- rpc: rpc 管理服务实现，可忽略。
- rpc-grpc: 需要关注
- rpc-nb: 可以忽略。
```

### 1. ONOS 中引用 grpc 的愿景



### 2. ONOS 中 grpc 功能展示

### 3. ONOS 中 grpc 开发现状
