---
layout: post
title: python项目中一些常见的文件
categories: [Coding]
tags: [Python]
---

### __init__.py

如果一个目录作为`package`使用，那么必须放置一个`__init__.py`文件，即使该文件中什么内容也没有。

### __main__.py

如果一个`package`需要被作为可执行`package`，即可以使用`python -m <package name>`，那么该目录下必须存在一个`__main__.py`文件，用来指定运行顺序。

*注：如果使用`python <package name>`，则只是执行文件夹，执行`__main__.py`中的代码；而执行`python -m <package name>`则是作为模块执行，会先执行`__init__.py`中的代码，然后执行`__main__.py`中的代码。*

### __version__.py

一些项目用`__version__.py`来指示项目版本，但是这并不是必须的。

另：Python中常用双下划线开头的变量

### __all__

在模块（普通的*.py文件）中，用来导出变量、函数和接口，如果指定，将暴露出所有不以下划线开头的变量、函数和接口。模块中使用`__all__`可以避免命名冲突。

在包（一个包的`__init.py__`文件）中，用来指定导出的模块，如果不指定将导出所有的模块。

这里的导出，指的是使用`from [package [module]] import *`语句时引入的变量。

