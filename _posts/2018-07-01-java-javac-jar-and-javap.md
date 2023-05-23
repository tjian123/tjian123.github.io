---
layout: default
title: Java 基础 —— 4个基础命令：java、javac、jar和javap
description: Java 的4个基础命令行
categories: 
  - 学习积累
tags: 
  - Java
---

> 使用 `profile` 可以定义一些配置信息，并指定这些配置信息的激活条件。

<!-- more -->
* TOC
{:toc}

一个简单的单文件程序 `HelloWorld.java`
使用 `javac HelloWorld.java` 编译
使用 `java HelloWorld` 运行

上述 `HelloWord.java` 文件放置于 `com/tjian` 目录下
切到 `com` 目录的父目录，使用 `javac com/tjian/HelloWorld.java` 将源文件编译为 class 文件[^single_javac]

[^single_javac]: 单一源文件时，在源文件所在目录执行编译和在包路径父目录下执行编译，效果一样。
