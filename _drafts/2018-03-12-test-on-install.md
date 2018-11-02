---
layout: post
title: TestON 安装
categories: [积累]
tags: [ONOS, SDN, TestON]
---

> TestON —— 用于 ONOS 集成测试的工具。

<!--more-->

TestON 由 Paxterra Solutions 开发，现 ONOS 社区维护。TestON 需要运行在 Linux 平台，使用前系统应以正确安装了 ONOS。

### TestON 的安装步骤

1. 下载，可以从 github 或者 ONOS 的 gerrit 仓库下载，二者是同步的，`cd ~ && git clone https://gerrit.onosproject.org/OnosSystemTest`；
2. 准备，按照 ONOS 官网的介绍，可以使用 `cd OnosSystemTest/TestON && ./install.sh` 来进行安装。但是因为无法直接访问外网，我们需要配置代理。我们需要将 `install.sh` 文件中所有的 `sudo pip install` 更改为 `sudo pip install --proxy=http://<proxy.com>:<port>`，保存；
3. 安装，`cd OnosSystemTest/TestON && ./install.sh`；
4. 说明，安装过程中，首先会使用 `pip` 安装一些必须的依赖库，如 `configobj` 等；安装完成会在用户目录 `~/` 下新建一个软连接 `TestON`；
5. 验证，执行以下命令，出现 `teston>` 则表示安装成功，`cd TestON/bin && ./cli.py`。

```
TestON is the testing framework
Developed by Paxterra Solutions (www.paxterrasolutions.com)
teston>
```

### 参考链接

- [ONOS Wiki：安装 `TestON`](https://wiki.onosproject.org/display/ONOS/Installation)
- [ONOS Wiki: `TestON` 问答](https://wiki.onosproject.org/display/ONOS/TestON+FAQs)