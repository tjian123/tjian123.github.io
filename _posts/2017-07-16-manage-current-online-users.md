---
layout: post
title: linux管理当前在线用户
categories: [Linux]
---

> 查看当前登录的用户：

	who

> 查看登录用户的当前行为：

	w

> 查看某个登录用户的行为:

	w <username>

> 踢掉某个用户：

	pkill -u <username>

> 安全的踢掉某个用户：

	ps -ef | grep pts/0 #得到pid
	kill -9 pid