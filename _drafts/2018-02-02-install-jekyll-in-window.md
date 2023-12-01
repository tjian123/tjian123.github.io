---
layout: post
title: 在 window 环境下安装 jekyll
description: 在 window 环境下安装 jekyll
categories: 
    - 博客搭建
tags: 
    - Jekyll
---

> 在 window 环境下安装 jekyll

<!-- more -->

* TOC
{:toc}

## Step 1：下载并安装 Ruby

直接在官网下载安装，此步略。

检验，控制台输入`ruby -v`，输出版本信息。

## Step 2: 下载并安装 Ruby-devlop-kit

如果不安装该工具，使用`gem install jekyll`时会报如下错误：

```shell
λ gem install jekyll -v 3.7.2
ERROR:  Error installing jekyll:
        The 'http_parser.rb' native gem requires installed build tools.

Please update your PATH to include build tools or download the DevKit
from 'http://rubyinstaller.org/downloads' and follow the instructions
at 'http://github.com/oneclick/rubyinstaller/wiki/Development-Kit'
```

安装成功不会有提示。

## Step 3: 设置代理

如果需要使用代理才能上网（主要是使用 `gem` 下载安装 ruby 包），则需要此步：`set http_proxy=<some.proxy.com:port>`

## Step 4: 安装 Jekyll

使用`gem`安装：`gem install jekyll -v 3.8.0`

可以不指定版本号。

## Step 5: 验证 Jekyll，创建新站点

打开控制台输入 `jekyll -v`，输出版本信息。可以使用 `-h` 查看更多 `jekyll` 用法：

```shell
λ jekyll -h
jekyll 3.7.2 -- Jekyll is a blog-aware, static site generator in Ruby

Usage:

  jekyll <subcommand> [options]

Options:
        -s, --source [DIR]  Source directory (defaults to ./)
        -d, --destination [DIR]  Destination directory (defaults to ./_site)
            --safe         Safe mode (defaults to false)
        -p, --plugins PLUGINS_DIR1[,PLUGINS_DIR2[,...]]  Plugins directory (defaults to ./_plugins)
            --layouts DIR  Layouts directory (defaults to ./_layouts)
            --profile      Generate a Liquid rendering profile
        -h, --help         Show this message
        -v, --version      Print the name and version
        -t, --trace        Show the full backtrace when an error occurs

Subcommands:
  docs
  import
  build, b              Build your site
  clean                 Clean the site (removes site output and metadata file) without building.
  doctor, hyde          Search site and print specific deprecation warnings
  help                  Show the help message, optionally for a given subcommand.
  new                   Creates a new Jekyll site scaffold in PATH
  new-theme             Creates a new Jekyll theme scaffold
  serve, server, s      Serve your site locally
```

我们可以快速体验一下。先使用 `jekyll new demo` 创建一个名为 demo 的项目，默认在当前目录下创建一个 demo 目录：

```shell
λ jekyll new mydemo
Running bundle install in F:/WorkspaceForTEST/mydemo...
  Bundler: Fetching gem metadata from https://rubygems.org/...........
  Bundler: Fetching gem metadata from https://rubygems.org/.
  Bundler: Resolving dependencies...
  Bundler: Fetching public_suffix 3.0.2
  Bundler: Installing public_suffix 3.0.2
  Bundler: Using addressable 2.5.2
  Bundler: Using bundler 1.16.1
  Bundler: Using colorator 1.1.0
  Bundler: Using concurrent-ruby 1.0.5
  Bundler: Using eventmachine 1.2.5 (x64-mingw32)
  Bundler: Using http_parser.rb 0.6.0
  Bundler: Using em-websocket 0.5.1
  Bundler: Fetching ffi 1.9.23 (x64-mingw32)
  Bundler: Installing ffi 1.9.23 (x64-mingw32)
  Bundler: Using forwardable-extended 2.6.0
  Bundler: Fetching i18n 0.9.5
  Bundler: Installing i18n 0.9.5
  Bundler: Fetching rb-fsevent 0.10.3
  Bundler: Installing rb-fsevent 0.10.3
  Bundler: Using rb-inotify 0.9.10
  Bundler: Fetching sass-listen 4.0.0
  Bundler: Installing sass-listen 4.0.0
  Bundler: Fetching sass 3.5.6
  Bundler: Installing sass 3.5.6
  Bundler: Fetching jekyll-sass-converter 1.5.2
  Bundler: Installing jekyll-sass-converter 1.5.2
  Bundler: Using ruby_dep 1.5.0
  Bundler: Using listen 3.1.5
  Bundler: Using jekyll-watch 2.0.0
  Bundler: Using kramdown 1.16.2
  Bundler: Using liquid 4.0.0
  Bundler: Using mercenary 0.3.6
  Bundler: Using pathutil 0.16.1
  Bundler: Using rouge 3.1.1+-
  Bundler: Using safe_yaml 1.0.4
  Bundler: Using jekyll 3.8.0
  Bundler: Fetching jekyll-feed 0.9.3
  Bundler: Installing jekyll-feed 0.9.3
  Bundler: Fetching jekyll-seo-tag 2.4.0
  Bundler: Installing jekyll-seo-tag 2.4.0
  Bundler: Fetching minima 2.5.0
  Bundler: Installing minima 2.5.0
  Bundler: Fetching thread_safe 0.3.6
  Bundler: Installing thread_safe 0.3.6
  Bundler: Fetching tzinfo 1.2.5
  Bundler: Installing tzinfo 1.2.5
  Bundler: Fetching tzinfo-data 1.2018.4
  Bundler: Installing tzinfo-data 1.2018.4
  Bundler: Fetching wdm 0.1.1
  Bundler: Installing wdm 0.1.1 with native extensions
  Bundler: Bundle complete! 5 Gemfile dependencies, 33 gems now installed.
  Bundler: Use `bundle info [gemname]` to see where a bundled gem is installed.
New jekyll site installed in F:/WorkspaceForTEST/mydemo.
```

进入 mydemo 目录，使用 `bundle exec jekyll serve` 来启动服务器端。（旧版启动 jekyll server 仍然支持）

打开浏览器，输入 `http://127.0.0.1:4000` 即可访问。
