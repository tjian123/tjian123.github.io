---
layout: post
title: Python 虚拟运行环境
categories: [Python]
---

> 如果你的一台机器有很多python项目，每个都有不同的依赖（可能相同的包，但不同的版本），仅仅在一个Python安装环境中管理这些依赖几乎不可能。

`virtualenv`和`virtualenvwrapper`

`virtualenv`可以创建虚拟的Python安装环境，而且这些安装环境相互隔离，只需要一个命令就可以完成这些虚拟环境之间的切换。
`virtualenvwrapper`则是用来创建和管理这些虚拟环境的工具。

*docker难道不是更好的方式么？或许virtualenv更适合开发使用，而docker适合部署使用。*

创建一个虚拟环境：

	virtualenv <env name>

该命令会在~目录下创建一个`<env name>`的文件夹，其中放置了python执行包，lib和include

激活虚拟环境：

	cd ~/<env name>
	source ./bin/activate

激活后，终端字符提示发生改变，显示当前虚拟环境名称`<env name>`。

关闭该虚拟环境：

	deactivate

关闭后，终端字符恢复原样。

显示当前所有依赖：

	pip freeze

生成依赖文件：

	pip freeze > requirement.txt

根据依赖文件安装依赖：

	pip install -r requirement.txt

可以使用`-p PYTHON_EXE`来指定Python的版本：

创建2.7的环境：

	virtualenv -p /usr/bin/python2.7 ENV2.7

创建3.5的环境：

	virtualenv -p /usr/local/bin/python3.5 ENV3.5

虚拟环境迁移：

	virtualenv --relocatable <path>

参考链接：

1 [Python--Virtualenv简明教程](http://www.jianshu.com/p/08c657bd34f1)
2 [Virtualenv参考文档](http://virtualenv.readthedocs.io/)