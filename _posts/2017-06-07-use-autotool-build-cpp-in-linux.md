---
layout: post
title: Linux环境下使用Autotool编译C++程序
categories: [Linux, Autotool]
---

使用`AutoTool`构建一个标准GNU项目的步骤：

1. 搭建项目框架，编写程序代码；
2. `autoscan`：项目根目录下执行`autoscan`命令，生成`configure.scan`文件；
3. 将上一步生成的`configure.scan`文件修改为`configure.ac`文件，并修改其中的内容以适应项目实际情况；
4. 创建`Makefile.am`文件，根目录以及各级需要生成目标的子目录都需要创建；
5. `aclocal`: 项目根目录下执行`aclocal`命令，将根据`configure.ac`文件生成`aclocal.m4`文件；
6. `autoconf`：项目根目录下执行`autoconf`命令，根据`aclocal.m4`和`configure.ac`文件生成`configure`可执行文件；
7. `autoheader`: 项目根目录下执行`autoheader`命令，生成`config.h.in`文件；
8. `automake`: 项目根目录下执行`automake --add-missing`命令，根据`configure.ac`和`Makefile.am`生成`Makefile`文件（也可以使用简写命令`automake -a`）；
9. `make`: 执行编译

> 根据项目架构不同，`configure.ac`文件和`Makefile.am`文件会有细节上的差异。

### 1. 所有文件都在同一个目录下

此类情况最为简单，只需要一个编译目标，列出所有需要的源文件即可。

```
bin_PROGRAMS=demo
demo_SOURCES=main.cpp file1.cpp file2.cpp
```

### 2. 入口文件在根目录下，其他组件在子目录下

根目录下的Makefile.am类似，需要添加`SUBDIRS`项:

```
SUBDIRS=src/lib 
```

子目录下应为：

```
noinst_LIBRARIES=libdemo.a
libdemo_a_SOURCES=demo.cpp
libdemo_a_CPPFLAGS=-I$(top_srcdir)/src/include # 如果有引用其他头文件则需要
```

### 3. 所有文件都分布在子目录下

需要修改`configure.ac`文件的`AM_INIT_AUTOMAKE`项，

	AM_INIT_AUTOMAKE([foreign subdir-KBobjects])