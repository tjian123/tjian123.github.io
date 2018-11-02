---
layout: post
title: Python语言使用gRPC的hello说明
categories: [Coding]
tags: [python, gRPC]
---

还是以`helloworld`为例，步骤如下：

1. 准备grpc python环境
2. 编写`protobuf`文件
3. 将`protobuf`文件编译为python源码
4. 编写基于python的服务器端和客户端
5. 测试和验证

## 准备环境

这里的环境主要是指两个方面：用于python代码运行时的`grpc`库，和将`protobuf`文件编译为python源码的工具。

```
sudo python -m pip install grpcio
```

```
sudo python -m pip install grpcio-tools
```

## 编写`protobuf`文件

```
syntax = "proto3";

message HelloRequest {
	string name = 1;
}

message HelloReply {
	string msg = 1;
}

service Hello {
	rpc sayHello (HelloRequest) returns (HelloReply);
}
```

## 将`protobuf`文件编译为python源码

```
python -m grpc_tools.protoc -I./proto --python_out=. --grpc_python_out=. ./proto/hello.proto
```

生成`hello_pb2.py`和`hello_pb2_grpc.py`文件。

## 编写服务器端和客户端

服务器端：`hello_server.py`

{% highlight python %}
from concurrent import futures

import time
import grpc
import hello_pb2
import hello_pb2_grpc

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class Greeter(hello_pb2_grpc.HelloServicer):
  def sayHello(self, request, context):
    return hello_pb2.helloReply(msg='Hello, %s' % request.name)

def run_server():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  hello_pb2_grpc.add_HelloServicer_to_server(Greeter(), server)
  server.add_insecure_port('[::]:66666')
  server.start()
  try:
    while True:
      time.sleep(_ONE_DAY_IN_SECONDS)
  except KeyboardInterrupt:
      server.stop(0)

if __name__ == '__main__':
  run_server()
{% endhighlight %}

客户端：`hello_client.py`

{% highlight python %}
from __future__ import print_function

import hello_pb2
import hello_pb2_grpc

def run_client():
  channel = grpc.insecure_channel('localhost:66666')
  stub = hello_pb2_grpc.HelloStub(channel)
  response = stub.sayHello(hello_pb2.HelloRequest(name='John'))
  print("Received from server: " + response.msg)
{% endhighlight %}

## 测试和验证

```
python hello_server.py
```

另起终端，启动客户端:

```
python hello_client.py
```