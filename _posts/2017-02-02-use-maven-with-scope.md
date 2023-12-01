---
layout: default
title: Maven 中 scope 实践
categories: 
  - 构建编译
tags: 
  - Maven
  - Java
---

> Maven 中使用 `scope` 来定义依赖的作用范围。

<!-- more -->

* TOC
{:toc}

Maven 的 Dependency scope 提供5个可选值：

* **compile**

默认值，所有阶段都会使用，会随着项目一起发布。Maven 会将其打包到最终的 artifact 中。

* **provided**

期望 jdk、容器或使用者提供该依赖 jar 包。Maven 不会将其打包到最终的 artifact 中。

* **runtime**

只会在运行时依赖的 jar 包，如 JDBC，适用于运行和测试阶段。构建中并不需要该 jar 包，但是会打包到最终的 artifact 中。

* **test**

只会在测试阶段依赖的 jar 包，如 junit。不会被打包到最终 artifact 中

* **system:**

需要显式给出依赖的 jar 包，maven 不会去仓库中查找。通常不推荐使用。
