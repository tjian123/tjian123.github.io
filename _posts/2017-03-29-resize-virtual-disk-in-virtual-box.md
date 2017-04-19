---
layout: post
title: Virtual Box 虚拟机重新分配虚拟硬盘大小
---

使用VirtualBox安装虚拟机，在安装时需要设置虚拟硬盘大小（通常考虑到合理利用物理硬盘空间，我们都不会设置的特别大）。随着使用积累，会出现硬盘空间不够用的情况。这时如果重装虚拟机，可能需要面临重新配置使用环境和迁移文件等问题。本文介绍了一种在windows宿主机中动态扩展ubuntu虚拟机虚拟硬盘大小的方法：利用VBoxManage命令重分配虚拟硬盘大小，然后在虚拟机中使用gparted工具识别新增加的区域。

### 工具

- VBoxMange VirtualBox自带命令
- gparted linux硬盘分区工具

### 步骤

#### 1. 宿主机中的操作

安装了VirtualBox的宿主机中，同时提供了一系列用于操作虚拟机的便捷工具，如VBoxManage和VBoxDTrace等。为方便在控制台直接应用这些工具，我们需要将VirtualBox的安装路径添加至系统环境变量中去。

![设置环境变量]({{ site.baseurl }}/images/windows_env_setting.png)

设置好环境变量以后，打开控制台，输入`VBoxManage -h`命令，可以看到帮助提示。
在控制台切换到我们的虚拟机安装目录，找到`.vdi`文件，比如`ubuntu-virtualbox.vdi`，执行以下命令更改虚拟硬盘大小(M为单位，以下更改为40G):

    VBoxManage modifyhd ubuntu-virtualbox.vdi --resize 40960

更改成功后，控制台打印出：

    0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%


#### 2. 虚拟机中的操作

打开ubuntu虚拟机，安装gparted工具，命令:

    sudo apt install gparted

安装完成，执行命令：

    sudo gparted

在打开的图形界面中，可以看到已经在使用硬盘分区，和新增加未分配的硬盘分区。选择正常使用的硬盘分区，右键选择`Resize/Move`，拖动鼠标扩展至最大。保存后退出即完成。

### 验证
输入`df -h`命令，即可看到硬盘已经增大至40G。
