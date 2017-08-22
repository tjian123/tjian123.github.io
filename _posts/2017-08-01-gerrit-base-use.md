---
layout: post
title: Gerrit基本用法
categories: [Gerrit, Tools]
---

## 新建一个项目

	ssh admin@<domain> -p 29418 gerrit create-project --name <project>

## 新增一个用户

> 1. 管理员新建一个gerrit账号

	htpasswd <passwd-file> <user>

输入密码并确认密码。

将该账号添加至对应的用户组中。

> 2. 用户在web端登录，并注册自己的邮箱

直接在web页面上操作即可。

*注：注册邮箱以后会收到确认链接，需要反馈。*

> 3. 用户添加个人公钥至gerrit

通常在`~/.ssh`目录下存在`id_rsa.pub`文件，如果不存在，通过以下命令生成：

	ssh-keygen

> 4. 用户下载项目

	git clone ssh://<user>@<domain>:29418/<project>

> 5. 提交更改

	git review