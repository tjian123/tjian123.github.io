---
layout: post
title: 准备karaf环境
categories: [Karaf]
---

## 1 下载和解压

下载karaf-3.0.8.zip并解压，目录结构如下：

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

1 `bin`目录

包含start\stop\status\client\setenv\instance\shell\karaf执行脚本

2 `data`目录

运行时数据目录，如果要启动一个干净的karaf环境，可以直接删除该目录

3 `demos`目录

提供一些案例。

4 `deploy`目录

热部署目录

5 `etc`目录

配置文件

6 `lib`目录

依赖的库文件目录，包括karaf可执行jar包，依赖的felix包等。

## 2 运行

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

> 退出控制台，使用`halt`命令。

## 3 使用基本命令

karaf提供了一系列控制台交互命令，这些命令的格式为：

	<[scope:]command-name> [options]

其中，`scope`指定命令的作用空间，或者称为前缀，避免命令名称冲突；同一个`scope`下的`command-name`必须是唯一的；每一个`command`可以有其独特的命令选项，即`option`。

查看命令帮助信息:

- `help`：直接使用，显示所有可用命令
	- `help <command-name>`: 显示与指定command相关的帮助信息。
	- `<command-name> --help`: 显示相关命令的用法。

用于管理bundle生命周期的命令：

- `install`: 安装一个或者多个`bundle`，安装成功后会返回一个`bundleId`。
	- `-s`参数指定安装完成尝试`start`
- `uninstall`: 根据`bundleId`卸载一个`bundle`。
- `start`: 启动
- `stop`: 停止
- `resolve`: 检测依赖，准备启动一个bundle
- `update`: 本地更新一个bundle
- `list`: 列出所有的bundle

> OSGi bundle生命周期: installed\uninstalled\resolved\starting\active\stoping\

容器相关：

- `info`: 显示与当前启动的karaf容器相关的信息，包括版本号，运行环境，线程数，内存使用等。
- `headers`: 显示头信息
- `imports`: 列出所有导入的包
- `exports`: 列出所有导出的包
- `start-level`: 设置或显示容器启动级别
- `bundle-level`: 设置或获取某个特定bundle的启动级别
- `framework`: 设置使用的OSGi框架，默认是apache felix，也可以使用Equinox。
- `tree-show`: 以树状显示Bundle的依赖包
- `create-dump`: 输出诊断信息至一个目录
- `dynamic-import`: 动态导入一个指定bundle
- `watch`: 动态监测bundle，可以实现bundle自动更新
- `print-stack-traces`: 打印完整的堆栈信息
- `restart`: 重启karaf容器
- `grep|tail|cat|Pipes`: 提供类linux工具
- `shutdown`: 停止容器