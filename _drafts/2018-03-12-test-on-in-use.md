---
layout: post
title: TestON 结构
categories: [积累]
tags: [ONOS, SDN, TestON]
---

> TestON 结构及运行流程分析。

<!--more-->

```
- bin 可执行文件，提供了一些便捷的工具
- config 一些配置文件
- core 核心 python 类定义文件
- Documentation 生成的文档的输出目录
- drivers 驱动类定义文件
- examples 测试框架可以使用的测试类用法示例
- lib 第三方依赖
- logs 框架运行以及测试日志
- tests 测试用例定义
- TAI  不详
- JenkinsFile jenkins 相关
install.sh TestON 安装脚本
requirements.txt 安装依赖定义
setup.cfg 不详
generate-docs.sh 文档生成脚本
```

### bin 目录

- `cli.py`：启动 `TestON`
- `cleanup.sh`: 清理 `mininet`，等价于 `sudo mn -c`
- `codecheck`: 源码检测
- `copy-key-to-cells`：将本地 `id_rsa.pub` 拷贝至 `cell` 指定的靶机上，以实现免密 ssh 登录
- `test-summary`：测试汇总
- `unpep8`：用处不详

### 运行流程

> 以 `./cli.py run SAMPstartTemplate_1node` 为例分析测试框架运行原理。

1. 实例化一个 `CLI`，执行 `onecmd` 方法；
2. 解析参数，执行 `CLI` 的 `do_run` 方法；
3. 开启一个 `TestThread`，执行测试用例；
4. 测试线程内，构造一个 `TestON` 实例；
5. 初始化中加载当前测试用例代码；
6. 按步骤执行每个测试用例的每一步。

### tests 目录

#### 1. CHOTestMonkey

#### 2. FUNC

#### 3. HA

#### 4. MISC

#### 5. PLAT

#### 6. SAMP

#### 7. SCPF

#### 8. USECASE
