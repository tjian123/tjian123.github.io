---
layout: default
title: 使用 Cookiecutter 创建项目
description: Cookiecutter 是一个用于快速创建标准 python 开源项目的工具。
categories:
  - 构建编译
tags: 
  - Python
---

> Cookiecutter 是一个用于快速创建标准 python 开源项目的工具。

<!-- more -->
* TOC
{:toc}

## `cookiecutter-pypackage` 项目

[译]cookiecutter-pypackage指南

> 注：如果你对本文有任何疑问，请编辑[这个文件](https://github.com/audreyr/cookiecutter-pypackage/blob/master/docs/tutorial.rst)并提交描述了你的改善意见的合并请求。

在开始前，请确认你在[github](https://github.com)和[PyPI](https://pypi.python.org/pypi)上拥有账号，如果没有请先创建。如果你对 git 和 github 还不是很熟悉，你可能需要先花一点儿时间学习一下相关[教程](https://help.github.com)。

### Step 1: 安装 `cookiecutter`

首先为你的项目创建一个 `virtualenv`，你可以使用任何你喜欢的方式，比如：

	virtualenv ~/.virtualenv/myproject

这里 `myproject` 就是你将要创建的项目的名称，这个名称也可以不一致，但保持一致性会更加便于维护。

启动这个虚拟 Python 环境：

	cd ~/.virtualenv/myproject
	source ./bin/activate

**注：以下所有操作都应该在该虚拟环境下开启的情况执行**

安装 `cookiecutter`：

	pip install cookiecutter

### Step 2: 创建项目

直接使用 `cookiecutter` 的项目模板来生成：

	cd ~/workspace
	cookiecutter https://github.com/audreyr/cookiecutter-pypackage.git

创建过程中，你需要输入一些确认信息。

### Step 3: 创建 Github 仓库

登录 Github，并创建一个名为 `mypackage`(这里的 `mypackage` 与上一步创建过程中的`[project_slug]`需要保持一致)的 `repo`。

将上一步生成的本地项目与 Github 仓库关联：

```
cd ~/workspace
git init .
git add .
git commit -m "Initial commit."
git remote add origin https://github.com:<username>/mypackage.git
git push -u origin maser
```

这里会将本地代码上传至 Github。

### Step 4: 安装依赖

`myproject` 项目下有一个 `requirements_dev.txt` 的文件，描述了项目的依赖包。

可以通过 `pip` 命令安装，注意请在之前创建的虚拟环境 `myproject` 下执行：

	pip install -r requirements_dev.txt

### Step 5: 配置持续集成

[Travis CI](https://travis-ci.org)是一个用于持续集成的工具，可以与 `github` 无缝结合。每一个提交到 `master` 分支的 `commit` 都会触发项目的自动构建流程。

使用你的 Github 账号登陆 Travis CI 后，会发现你的 github 仓库已经同步显示在其上，其中没有和 Travis CI 关联的项目会有一个 `x` 标记。

将 `mypackage` 切换到 `on` 状态，暂时先不要做其他设置。配置 `myproject` 目录下的 `.travis.ymal` 文件，修改密码。回到控制台，执行以下指令：

	python travis-pypi_setup.py

### Step 6: 设置 `ReadTheDocs`

[`ReadTheDocs`](https://readthedocs.org)提供文档自动生成和管理服务。你需要注册一个账号，如果没有的话。

登陆以后在你的用户名下有一个 `My project` 的选项，选择以后导入 `mypackage` 项目。

同时在Github仓库下开启 `ReadTheDocs` 钩子：`Settings > Webhooks & services`，启动 ReadTheDocs

这样文档就会自动生成和同步。

### Step 7: 设置 pyup.io

[`pyup.io`](pyup.io)是一个用来保持你的项目的 `requirements.txt` 始终为最新的工具。使用你的Github账号登陆，并点击 `Add Repo` 添加你的项目。

### Step 8： 在 Pypi 上发布

[`Pypi`(Python Package Index)](https://pypi.python.org/pypi)是一个官方的第三方python包发布库。可以参考其[帮助文档](http://peterdowns.com/posts/first-time-with-pypi.html)。

在发布自己的包以前，可以查看已存在的[项目列表](https://gist.github.com/audreyr/5990987)

## cookiecutter-python-app 项目

module 的名字必须遵照 python 命名规范，即使用下划线连接单词。

编译项目：

	python setup.py build

安装项目：

	python setup.py install

单元测试：

	pytest test/