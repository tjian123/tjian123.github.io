---
layout: post
title: 在 window 环境下安装 jekyll
categories: [Coding]
tags: [Jekyll]
---

## Step 1：下载并安装 Ruby

直接在官网下载安装，此步略。

检验，控制台输入`ruby -v`，输出版本信息。

## Step 2: 下载并安装 Ruby-devlop-kit

如果不安装该工具，使用`gem install jekyll`时会报如下错误：

```
λ gem install jekyll -v 3.7.2
ERROR:  Error installing jekyll:
        The 'http_parser.rb' native gem requires installed build tools.

Please update your PATH to include build tools or download the DevKit
from 'http://rubyinstaller.org/downloads' and follow the instructions
at 'http://github.com/oneclick/rubyinstaller/wiki/Development-Kit'
```

安装成功不会有提示。

## Step 3: 设置代理

如果需要使用代理才能上网，则需要此步：

	set http_proxy=<some.proxy.com:port>

## Step 4: 安装 Jekyll

使用`gem`安装：

	gem install jekyll -v 3.7.2

可以不指定版本号。