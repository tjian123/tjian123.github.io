---
layout: post
title: Shell 脚本中获取路径
categories: [编码]
tags: [Linux, Shell]
---

> 本文归纳 `shell` 中常用的获取当前路径的方式。

<!--more-->

## 1. 方式一：最常用的方式

```
THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
```

> **TIPS:** Shell字符串中`$()`中的命令会被预处理。