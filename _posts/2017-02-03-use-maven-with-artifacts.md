---
layout: post
title: 使用 artifacts 构建隔离项目依赖与第三方库
categories: [Maven]
---

> 构建大型 maven 项目时，通常会有很多相互依赖的内部组件，以及大量的第三方依赖库文件。如果使用聚合形式管理，通常很容易造成一些意想不到的失误。使用 artifacts 思想，可以将内部项目于第三方依赖库隔离开来，很好的封装变化。

主要思想：

```
<dependency>
    <groupId>${project.groupId}</groupId>
    <artifactId>opensdn-artifacts</artifactId>
    <version>${project.version}</version>
    <scope>import</scope>
    <type>pom</type>
</dependency>
```
