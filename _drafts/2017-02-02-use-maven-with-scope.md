---
layout: post
title: Maven 中 scope 实践
categories: [编码]
tags: [Maven, Java]
---

> Maven 中使用 `scope` 来定义依赖的作用范围。

<!--more-->

Maven的Dependency scope提供5个可选值：

>compile: 

默认值，所有阶段都会使用，会随着项目一起发布。Maven会将其打包到最终的artifact中。

>provided:

期望jdk、容器或使用者提供该依赖jar包。Maven不会将其打包到最终的artifact中。

>runtime:

只会在运行时依赖的jar包，如JDBC，适用于运行和测试阶段。构建中并不需要该jar包，但是会打包到最终的artifact中。

>test:

只会在测试阶段依赖的jar包，如junit。不会被打包到最终artifact中

>system:

需要显式给出依赖的jar包，maven不会去仓库中查找。通常不推荐使用。
