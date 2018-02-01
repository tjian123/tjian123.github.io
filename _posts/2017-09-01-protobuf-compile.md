---
layout: post
title: 编译protobuf
categories: [Protobuf]
---

假定我们有一个`hello.proto`的文件，现在要将其编译为程序代码。

如果只是使用`protoc`来编译，指令很简单：

	protoc --python_out=. hello.proto

该命令在当前目录下生成一个`hello_pb2.py`的文件。

如果我们的`hello.proto`文件在'proto'目录下，我们需要将源码生成在`gen`目录下，需要这样做：

	protoc --python_out=gen proto/hello.proto

问题：如何不指定全路径就可以编译`proto`文件?无解？

在linux下可以借助find命令来完成：

	protoc --python_out=gen $(find . -name *.proto)

此命令支持批量编译，即如果proto下存在多个proto文件，可以同时编译。

注意区别使用了参数`--proto_path`后的区别：

	protoc --proto_path=./proto --python_out=gen $(find . -name *.proto)

使用该参数后，不会再gen目录下再创建一个proto目录。

现在考虑`hello.proto`中引用了其他的`proto`文件的情况，如引用了`test.proto`中的`message`：

	protoc --python_out=gen $(find . -name *.proto)

该指令会报错，提示找不到`test.proto`文件，但是加上`--proto_path`参数就可以了。

接下来的情况中，proto文件分布于多级目录下，如`hello.proto`在`hello`目录下，`test.proto`在`test`目录下，直接考虑`hello.proto`中引用了`test.proto`的情况：

protoc仍然可以正常工作，并且帮我们保留了原始的文件夹结构。

> 使用@FileName从一个文件中读出所有源文件列表并编译是所有标准编译器支持的，并不是Make通用的。

