---
layout: post
title: 巧用 Git 远程仓库解决多环境代码编写和编译问题
categories: [Git, Tool]
---

> 在做 ONOS 项目时，遇到这样一种尴尬的编码环境，ONOS 源码只能在 linux 环境下编译和运行，而我的 linux 环境只能通过 ssh 远程登录使用（远程桌面奇卡无比），本地 window 环境虽然可以秒开 IDE，编译时却只能干瞪眼。手动拷贝粘贴源码确实可以解决问题，但实在是太低级；有同事推荐使用源码比较工具，也总觉得不高明；随着对 Git 使用的增多，发现了一种极其巧妙的方式，嗯，感觉阵痛解决了。

步骤如下：

1. window 和 linux 环境下分别下载 ONOS 源码；
2. 在 linux 环境下搭建一个 ONOS 私有的 Git 仓库，使用 ONOS 源码对仓库进行初始化；
3. 在 window 环境中 ONOS 源码目录下增加一个指向 ONOS 私有仓库的远程仓库地址；
4. 将 linux 环境中 ONOS 源码的远程仓库指向 私有仓库地址；

以上完成准备工作，具体使用时：

1. 在 window 环境的 ONOS 源码中增加一个本地 branch，并在该 branch 做代码修改；
2. 将修改并提交了代码后的 branch 推送到私有仓库；
3. linux 环境下 ONOS 源码 pull 推送后的 branch 代码，执行编译和运行；
4. 将 window 环境下 ONOS 源码的 branch 修改合并到 master 并推送到远程 ONOS 服务器。
