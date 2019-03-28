---
layout: default
title: 基于 Karaf 搭建后端服务（一）
categories:
  - 技术积累
  - 教程
tags:
  - Backend
  - Java
  - OSGi
  - Maven
---

> 本文介绍基于 [`Karaf`][karaf] 搭建大型后端服务系统的一般规则。理解本文需要一定的 [`OSGi`][osgi] 知识和 [`Maven`][maven] 技术积累。


<!-- more -->
* TOC
{:toc}

## 项目构成

一个大型的项目，通常需要分成以下模块：

- lib: 用于管理加载第三方依赖 `jar`
- artifacts: 用于管理本项目中的 `bundle`
- core: 项目的核心 `bundle`，每次启动都会自动加载的内容
- features: 以 `features` 形式组织和管理 `bundle` 的 `bundle`
- apps: 基于核心 `bundle` 开发的可选启用的业务功能
- runtime: 用于打包最终的项目

假定我们的项目名为 `shopping-hall`，那么按照以上说明，我们的目录结构应如下：

```shell
--shopping-hall
	--artifacts
	--apps
	--core
	--lib
	--features
	--runtime
	pom.xml
```

其中：

- `lib` 依赖 `artifacts`
- `shopping-hall` 依赖 `lib`，同时聚合所有项目，提供统一编译入口
- 除了 `lib` 和 `artifacts` 以外的其他 `bundle` 都直接依赖 `shopping-hall` （通过继承间接依赖 `lib` 和 `artifacts`）




[karaf]:<https://karaf.apache.org>
[osgi]:<https://www.baidu.com>
[maven]:<https://www.baidu.com>