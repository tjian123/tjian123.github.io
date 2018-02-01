---
layout: post
title: Windows7查看端口占用
categories: [Tool]
---

首先查看端口被那个程序使用

	netstat -aon | findstr "8080"

最后一列的数字时程序PID，接着根据PID进行查找

	tasklist | findstr "6230"

获得PID以后也可以在任务管理器中直接查找。在任务管理器的窗口中可以设置显示选项，包括命令名等信息，可以进一步帮我们确认是哪个程序占用了端口。