---
layout: post
title: Shell脚本中获取当前路径的几种方式
categories: [Linux, Shell]
---

## 1. 方式一：最常用的方式

```
THIS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
```

> **TIPS:** Shell字符串中`$()`中的命令会被预处理。