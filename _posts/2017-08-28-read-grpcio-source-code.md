---
layout: post
title: grpcio源码阅读
categories: [Coding]
tags: [gRPC, Python]
---

问题：

1、grpc Python库的基本架构原理
2、grpc库的基本api
3、如何创建安装一个python库

### grpc python库的基本用法

在`ubuntu`系统上，我们使用`sudo pip install groio`来安装python grpc库（需要先安装好python和pip），然后基于该库开发python grpc项目。

同时，还需要使用`sudo pip install grpcio-tools`来安装用来将protobuf文件转换为python源码的工具。

一个python grpc项目的基本开发顺序是这样的：

1、根据需求定义protobuf文件，包括message和rpc service
2、将protobuf文件编译为python源码
3、编写python server端程序（或者client端程序）

编写server端程序的要点：

1、导入grpc模块`import grpc`，使用`grpc.server`方法创建server
2、导入编译protobuf文件生成的`*_pb`模块，实现定义的service接口
3、导入编译protobuf文件生成的`*_pb2_rpc`模块，将接口实现类加入server
4、配置服务地址，启动

由此可见，grpc库提供了一个核心的server类。

[gRPC Python库源码](https://github.com/grpc/grpc/tree/master/src/python/grpcio)

`__init__.py`定义了接口和公共方法