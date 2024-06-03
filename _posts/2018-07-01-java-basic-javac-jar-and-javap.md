---
layout: default
title: Java 基础 —— 4个命令：java、javac、jar 和 javap
description: Java 的4个基础命令行
categories: 
  - 技术积累
  - Java 基础
tags: 
  - Java
---

> Java 编译、运行、打包、反编译基本命令行。

<!-- more -->

* TOC
{:toc}

## 1. 单文件代码编译

从一个最简单的、甚至连 `package` 也没有的单文件程序 `HelloWorld.java` 开始

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("HelloWorld!");
    }
}
```

1. 使用 `javac HelloWorld.java` 编译为字节码，生成字节码文件 `HelloWorld.class`
2. 使用 `java HelloWorld` 启动 JVM 虚拟机运行
3. 使用 `jar cvf hello.jar HelloWorld.class` 打包为 .jar 文件[^no_main_in_manifest]
4. 使用 `javap HelloWorld.class` 对字节码进行反编译，查看类信息

## 2. 带包路径的单文件代码编译

上述 `HelloWord.java` 文件放置于包 `com/tjian` 目录下，增加 package

```java
package com.tjian;

...
```

如上增加了 package，需要切到 `com` 目录的父目录

1. 使用 `javac com/tjian/HelloWorld.java` 将源文件编译为 class 文件[^single_javac]
2. 使用 `java com.tjian.HelloWorld` 启动虚拟机运行（注意，启动运行时，这里的类路径已经是包的形式）
3. 使用 `jar cvf hello.jar .` 打包当前目录下的所有文件为单一的 jar 包[^list_jar]
4. 使用 `javap -cp hello.jar com.tjian.HelloWorld` 对字节码进行反编译，查看类信息

## 3. 多源文件相互引用

新增文件 `Person.java`

```java
package com.tjian.model;

public class Person {
    private int id;
    private String name;

    public Person(int id, String name) {
        this.id = id;
        this.name  = name;
    }

    public String toString() {
        return "Person{id="+ this.id + ",name=" + this.name"}";
    }
}
```

原始 `HelloWorld.java` 引用 Person 类

```java
package com.tjian;

import com.tjian.model.Person;

public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("HelloWorld!");
        System.out.println(new Person(10, "lisi"));
    }
}
```

在 `com` 父目录下执行命令：

1. 使用 `javac com/tjian/HelloWorld.java` 将源文件编译为 class 文件，编译 HelloWorld.java 时会自动将引用的 `com/tjian/model/Person.java` 编译完成
2. 使用 `java com.tjian.HelloWorld` 启动虚拟机执行程序
3. 使用 `jar cvf hello.jar .` 将当前目录下所有文件打包为单一的 jar 包[^auto_manifest]
4. 如需打包时指定 main 函数入口类，则需要添加一个 manifest 属性文件，使用 `jar cvfm hello.jar manifest .`，指定使用清单文件 manifest 将当前目录下的所有文件打包为一个 jar
5. 使用 `jar cfe hello.jar com.tjian.HelloWorld` 与第4条等价，会在生成的 manifest 文件中写入 Main-Class 信息

```property
Main-Class: com.tjian.HelloWorld
```

配置了 Main-Class 的 jar ，就可以直接使用 `java -jar hello.jar` 来启动了。

## 4. 命令说明

### 4.1 `jar` 命令

jar 命令用于打包和解压 jar 包，参考[CSDN](https://blog.csdn.net/u013126379/article/details/96106995)

```shell
用法： jar {ctxui}[vfmn0PMe] [jar-file] [manifest-file] [entry-point] [-C dir] files ...

选项：
    -c 创建新的归档文件
    -t 列出归档目录
    -x 从归档中提取指定货所有的文件
    -u 更新现有的归档
    -i 为指定的jar 文件生成索引信息
    -v 在标准输出中生成详细信息
    -f 指定归档文件名
    -m 包含指定清单文件的信息
    -n 创建新归档后执行 Pack200 规范化
    -e 为绑定到可执行 jar 文件的独立应用程序，指定程序入口点
    -0 仅存储，不压缩
    -P 保留文件名中的前导"/"和".."
    -M 不创建条目的清单文件
    -C 更改打包目录

    注：manifest 文件名、归档文件名与程序入口点名称的顺序，需要与 'm'、'f'和'e'的出现顺序保持一致
```

jar 常用命令：

* `jar tf hello.jar` 屏幕输出 hello.jar 中文件及目录结构
* `jar cf hello.jar .` 将当前目录及其下内容打包为 jar
* `jar xf hello.jar` 将 hello.jar 解压至当前目录下

### 4.2 `javac` 命令

```shell
用法：javac <options> <source_files>

选项：
用法: javac <options> <source files>

其中, 可能的选项包括:
    -g                         生成所有调试信息
    -g:none                    不生成任何调试信息
    -g:{lines,vars,source}     只生成某些调试信息
    -nowarn                    不生成任何警告
    -verbose                   输出有关编译器正在执行的操作的消息
    -deprecation               输出使用已过时的 API 的源位置
    -classpath <路径>            指定查找用户类文件和注释处理程序的位置
    -cp <路径>                   指定查找用户类文件和注释处理程序的位置
    -sourcepath <路径>           指定查找输入源文件的位置
    -bootclasspath <路径>        覆盖引导类文件的位置
    -extdirs <目录>              覆盖所安装扩展的位置
    -endorseddirs <目录>         覆盖签名的标准路径的位置
    -proc:{none,only}          控制是否执行注释处理和/或编译。
    -processor <class1>[,<class2>,<class3>...] 要运行的注释处理程序的名称
    -processorpath <路径>        指定查找注释处理程序的位置
    -d <目录>                    指定放置生成的类文件的位置
    -s <目录>                    指定放置生成的源文件的位置
    -implicit:{none,class}     指定是否为隐式引用文件生成类文件
    -encoding <编码>             指定源文件使用的字符编码
    -source <发行版>              提供与指定发行版的源兼容性
    -target <发行版>              生成特定 VM 版本的类文件
    -version                   版本信息
    -help                      输出标准选项的提要
    -A关键字[=值]                  传递给注释处理程序的选项
    -X                         输出非标准选项的提要
    -J<标记>                     直接将 <标记> 传递给运行时系统
    -Werror                    出现警告时终止编译
    @<文件名>                     从文件读取选项和文件名
```

javac 常用命令

* `javac com/tjian/HelloWorld.java` 未通过 -d 指定 class 文件存放目录时，默认放置在和 java 源文件同级目录下
* `javac -d target com/tjian/HelloWorld.java` 会按源文件目录结构将 class 文件放置在指定的目录下，但指定的目录必须时存在的
* `javac @javasourcefiles -d target` 在一个指定的 javasourcefiles 中将待编译的 java 文件列在一起，一个文件一行，统一编译

[^no_main_in_manifest]: 这种方式打包的 jar 没有指定 mainClass 入口，没法直接运行，需要指定入口类，命令为 `java -cp hello.jar HelloWorld`

### 4.3 `javap` 命令

javap 命令用于解析字节码文件

```shell
用法: javap <options> <classes>

其中, 可能的选项包括:
    -help  --help  -?        输出此用法消息
    -version                 版本信息
    -v  -verbose             输出附加信息
    -l                       输出行号和本地变量表
    -public                  仅显示公共类和成员
    -protected               显示受保护的/公共类和成员
    -package                 显示程序包/受保护的/公共类和成员 (默认)
    -p  -private             显示所有类和成员
    -c                       对代码进行反汇编
    -s                       输出内部类型签名
    -sysinfo                 显示正在处理的类的系统信息 (路径, 大小, 日期, MD5 散列)
    -constants               显示静态最终常量
    -classpath <path>        指定查找用户类文件的位置
    -bootclasspath <path>    覆盖引导类文件的位置
```

### 4.4 `java` 命令

java 命令用于启动 JVM 虚拟机，执行 java 字节码

```shell
用法：
    java [-options] class [args...]
    或
    java [-options] -jar jarfile [args...]

选项：
    -d32                使用32位数据模型
    -d64                使用64位数据模型
    -server             以server形式启动 JVM
    -cp <目录或jar文件搜索路径>
    -classpath <目录或jar文件搜索路径>
    -D<name>=<value>    设置系统属性
    -verbose[:class|gc|jni] 启用详细输出
    -X                  输出非标准选项的帮助，如 -Xms -Xmx -Xss 等待
    -ea[:<packagename>...|:<classname>]     按照指定粒度启用断言
    -enableassertions[:<packagename>...|:<classname>]     按照指定粒度启用断言
    -da[:<packagename>...|:<classname>]     按照指定粒度禁用断言
    -disableassertions[:<packagename>...|:<classname>]     按照指定粒度禁用断言
    -esa                启用系统断言
    -enablesystemassertions 启用系统断言
    -dsa                禁用系统断言
    -disablesystemassertions 禁用系统断言
```

java 常用命令

* `java -Xms10m -Xmn20m -cp hello.jar com.tjian.HelloWorld` 指定JVM以最小、最大堆内存分别为10m和20m运行程序
* `java -Xloggc:gc.log -cp hello.jar com.tjian.HelloWorld` 指定生成 gc 日志文件
* `java -XX:+HeapDumpOnOutOfMemoryError -cp hello.jar com.tjian.HelloWorld` 自动在堆内存溢出时生成 dump 文件，默认命名 `java_pid<pid>.hprof`[^name_dump_file]

[^single_javac]: 单一源文件时，在源文件所在目录执行编译和在包路径父目录下执行编译，效果一样。
[^list_jar]: 使用 `jar tf hello.jar` 可以查看 jar 包中打包目录结构和打包的目录文件。
[^auto_manifest]: 该过程会自动生成 MANIFEST 文件（只包含最基本的编译器版本信息），但不会主动配置 Main-Class 属性。
[^name_dump_file]: 可以使用 `-XX:HeapDumpPath=/tmp/heapdump.hprof` 来指定 dump 文件的路径和名称；此外可以使用 `-XX:OnOutOfMemoryError="sh test.sh"` 来指定发生 OOM 时自动启动脚本。
