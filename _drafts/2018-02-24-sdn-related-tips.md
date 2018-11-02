---
layout: post
title: SDN 开发中常见问题
categories: 
- 积累
tags: 
- SDN
- ONOS
---

> 可能经常遇到的一些小问题。

<!--more-->

[TOC]

#### 1. 如何查看 mininet 所使用的 openflow 版本？

mininet 中使用 Open vSwitch 来支持 OpenFlow 协议，因此可以使用 Open vSwitch 提供的工具。查看支持的 OpenFlow 协议，使用如下命令：

```
ovs-ofctl --version
```

得到类似如下的输出：

```
ovs-appctl (Open vSwitch) 2.5.4
Compiled Oct 30 2017 10:38:01
onos3@onos3:~$ ovs-ofctl --version
ovs-ofctl (Open vSwitch) 2.5.4
Compiled Oct 30 2017 10:38:01
OpenFlow versions 0x1:0x4
```

以上最后一行表示，支持 OpenFlow 1.0 (0x1) - 1.3 (0x4)。

#### 2. Ubuntu 配置好代理以后，Buck 编译时依然无法连外网？

使用`buck`编译`ONOS`时无法联网，是因为需要还添加一个`download`配置项，内容为：

```
[download]
	proxy_host=some.proxy.com
	proxy_port=80
	proxy_type=HTTP
```

这个配置项可以写在`.buckconfig`文件中，但通常更多的是另建一个`.buckconfig.local`文件，在其中放本地`buck`编译相关的配置项。

#### 3. dns 导致的联网失败问题

有时候连代理都无法`ping`通，提示：'Could not resolve proxy: xxx'的时候，通常就是`dns`异常导致。在`linux`系统中，可以通过手动编辑`/etc/resolve.conf`文件来修复。

#### 4. `onos-install`安装失败问题

使用`onos-install`方式将 ONOS 作为服务安装时总是不成功，原因：使用了手动配置的 jdk，可能存在权限等方面的问题。解决：使用`apt install`的方式重新安装`jdk`即可。

#### 5. `onos`编译时代理问题

如果配置好本页第二个问题以后（BUCK 代理），还是无法编译成功，提示 `npm ERROR`，可以尝试在用户目录下新建一个 `.bowerrc`，内容如下：

```
{
	"proxy": "http://some.proxy.com:port/",
	"https-proxy": "http://some.proxy.com:port/",
	"strict-ssl": false
}
```