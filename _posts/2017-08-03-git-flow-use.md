---
layout: post
title: Git工作流
categories: [Git, Tools]
---

git-flow工具提供了很好的git工作流服务，ubuntu系统安装该工具的方式为：

	sudo apt-get install git-flow

其他OS安装方式请参考[这里] [git-flow-install]。

[git-flow-install]: <https://github.com/nvie/gitflow/wiki/Installation>

新建一个git项目：

	mkdir -p ~/git-flow-demo
	cd ~/git-flow-demo
	git init

在`git-flow-demo`项目中初始化git工作流：

	git flow init

该过程会提问一些默认项，我们可以直接使用默认值。

## git-flow为我们创建了两个分支：

### master分支：

> 存放生产就绪的代码。

- 所有的提交都不应该直接提交到master分支上。
- master分支上的代码一直是可以发布为产品的。

### devlop分支：

> 大部分工作在devlop分支上完成。

- 这个分支上包含所有已完成的特性，和已经修改的bug。
- 每日构建和持续集成服务器应该从该分支拉取代码。

## git-flow还为我们创建了5个分支组：

### feature分支：

> 特性分支从devlop分支创建出来。他们可以是对下一个发布的增强或修改。

使用以下命令创建一个新的feature分支：

	git flow feature start <feature name>

通常会在该分支完成开发，当准备好的时候，使用下面的命令合入devlop分支：

	git flow feature finish <feature name>

该命令还会自动删除<feature name>分支。

`git flow feature`支持以下命令：

`git flow feature [list]`: 列出所有的feature分支，其中list可选
`git flow feature start <feature name>`：从devlop新建一个feature分支，并切换到该分支。
`git flow feature finish <feature name>`：将一个feature分支合并到devlop分支，并删除该分支。
`git flow feature publish`：将一个feature分支推送到远程仓库
`git flow feature track <feature name>`：跟踪一个远程feature分支
`git flow feature diff`：比较feature分支当前改动
`git flow feature rebase`：rebase一个feature分支
`git flow feature checkout`：从远程下载一个feature分支
`git flow feature pull`：从远程更新一个feature分支
`git flow feature delete <feature name>`：删除一个feature分支

### release分支：

>发布分支也是从devlop分支创建而来，主要用来修改一些小bug。

使用以下命令创建一个新的release分支：

	git flow release start <release number>

即将发布新版本时创建该分支，当准备好的时候，使用下面的命令合入：

	git flow release finish <release number>

该命令会自动将当前代码合入master分支和devlop分支，并且创建一个tag，最后删除该release分支。

`git flow release`支持以下命令：

`git flow release [list]`：
`git flow release start <release number>`：
`git flow release finish <release number>`：
`git flow release publish`：
`git flow release track`：
`git flow release delete`：

### hotfix分支：

> 热修改分支有些类似于release分支，用来更新一些紧急的bug修复。

使用以下命令创建一个新的hotfix分支：

	git flow hotfix start <release number>

即将发布新版本时创建该分支，当准备好的时候，使用下面的命令合入：

	git flow hotfix finish <release number>

该命令会自动将当前代码合入master分支和devlop分支，并且创建一个tag，最后删除该hotfix分支。

`git flow hotfix`支持以下命令：

`git flow hotfix [list]`：
`git flow hotfix start <release number> <base>`：
`git flow hotfix finish <release number>`：
`git flow hotfix publish`：
`git flow hotfix delete`：

hotfix分支通常使用较少。

### bugfix分支：

`git flow bugfix`支持以下命令：

`git flow bugfix [list]`：
`git flow bugfix start <bugfix name> <base>`：
`git flow bugfix finish <bugfix name>`：
`git flow bugfix publish`：
`git flow bugfix track`：
`git flow bugfix delete`：

### support分支：

`git flow support`支持以下命令：

`git flow support [list]`：
`git flow support start <support name> <base>`：