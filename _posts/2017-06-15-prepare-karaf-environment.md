---
layout: default
title: Karaf 容器学习（一）
categories: 
  - 技术积累
tags: 
  - Karaf
  - Java
---

> [Karaf][karaf] 是 `apache` 出品的一款二次封装了的 `OSGi` 容器。

<!-- more -->
* TOC
{:toc}

## 1 下载和解压

下载 [karaf-3.0.8.zip](http://archive.apache.org/dist/karaf/3.0.8/apache-karaf-3.0.8.zip) 并解压，目录结构如下：

```
-
  -bin
  -data
  -demos
  -deploy
  -etc
  -lib
  -system
  LICENSE
  NOTICE
  README
  RELEASE-NOTES 
```

**注： 这里以 `3.0.8` 版本解释基本功能。也可以最新的 `karaf` 版本上进行验证。**

1. `bin` 目录
  - 包含 `start`,`stop`,`status`,`client`,`setenv`,`instance`,`shell`,`karaf` 等脚本。
2. `data` 目录
  - 存放运行时数据。如果要重新启动一个干净的 `karaf` 运行环境，可以直接删除该目录。
3. `demos` 目录
  - 提供一些使用 `karaf` 基本特性的简单案例。比如自定义 `brand`，控制台 `bundle` 等。
4. `deploy` 目录
  - 热部署，如果需要在运行时部署一些 `bundle` ，则需要在该目录下操作。
5. `etc` 目录
  - 配置文件，包括 `karaf` 的启动参数设置
6. `lib` 目录
  - 依赖的库文件目录，包括 `karaf` 可执行 `jar` 包，依赖的 `felix` 包等。

## 2 运行
  
执行 `bin` 目录下的 `karaf` 脚本（`windows` 系统下对应的是 `karaf.bat`），即可启动。

如下是默认启动界面。

```
bin/karaf
        __ __                  ____
       / //_/____ __________ _/ __/
      / ,<  / __ `/ ___/ __ `/ /_
     / /| |/ /_/ / /  / /_/ / __/
    /_/ |_|\__,_/_/   \__,_/_/

  Apache Karaf (3.0.8)

Hit '<tab>' for a list of available commands
and '[cmd] --help' for help on a specific command.
Hit '<ctrl-d>' or type 'system:shutdown' or 'logout' to shutdown Karaf.

karaf@root()>
```

**注： 退出控制台，使用 `halt` 命令（或者使用 `logout` 命令）。**

## 3 基本命令

`karaf` 提供了一系列控制台交互命令，这些命令的格式为：

	<[scope:]command-name> [options]

其中，`scope` 指定命令的作用空间，或者称为前缀，避免命令名称冲突；同一个 `scope` 下的 `command-name` 必须是唯一的；每一个 `command` 可以有其独特的命令选项，即 `option`。

- 查看命令帮助信息:
  - `help`：直接使用，显示所有可用命令
  - `help <command-name>`: 显示与指定 `command` 相关的帮助信息。
  - `<command-name> --help`: 显示相关命令的用法，同 `help <command-name>`。
- 容器相关的命令：
  - `info`: 显示与当前启动的 `karaf` 容器相关的信息，包括版本号，运行环境，线程数，内存使用等。
  - `headers`: 显示头信息
  - `imports`: 列出所有导入的包
  - `exports`: 列出所有导出的包
  - `start-level`: 设置或显示容器启动级别
  - `bundle-level`: 设置或获取某个特定 `bundle` 的启动级别
  - `framework`: 设置使用的 `OSGi` 框架，默认是 `apache felix`，也可以使用 `Equinox`。
  - `tree-show`: 以树状显示 `Bundle` 的依赖包
  - `create-dump`: 输出诊断信息至一个目录
  - `dynamic-import`: 动态导入一个指定 `bundle`
  - `watch`: 动态监测 `bundle`，可以实现 `bundle` 自动更新
  - `print-stack-traces`: 打印完整的堆栈信息
  - `restart`: 重启karaf容器
  - `grep|tail|cat|Pipes`: 提供类 `linux` 工具
  - `shutdown`: 停止容器
- 用于管理 `bundle` 生命周期的命令：
  - `install`: 安装一个或者多个 `bundle`，安装成功后会返回一个 `bundleId`。
    - `-s` 参数指定安装完成尝试 `start`
  - `uninstall`: 根据 `bundleId` 卸载一个 `bundle`。
  - `start`: 启动
  - `stop`: 停止
  - `resolve`: 检测依赖，准备启动一个 `bundle`
  - `update`: 本地更新一个 `bundle`
  - `list`: 列出所有的 `bundle`

**注： `OSGi bundle` 生命周期: `installed`,`uninstalled`,`resolved`,`starting`,`active`,`stoping`**

[karaf]: http://karaf.apache.org 