---
layout: default
title: Maven 中 profile 实践
categories: 
  - 构建编译
tags: 
  - Maven
  - Java
---

> 使用 `profile` 可以定义一些配置信息，并指定这些配置信息的激活条件。

<!-- more -->

* TOC
{:toc}

比如我们的项目可能在 `windows` 系统和 `linux` 系统下有不同的配置需求，那么就可以通过 `profile` 定义两套信息，在 `maven` 检测到系统环境时使相应的 `profile` 自动生效。

## 作用范围

**`profile` 定义在不同的位置，生效的范围也不一样。**

通常来说，`profile` 可以定义在以下三个位置：

1. 属于某个 `maven` 项目的 `pom.xml` 文件中：用于定义特定项目所需要的配置信息。
2. 用户目录下的 `.m2` 目录下的 `settings.xml` 文件中: 用于定义特定用户所需要的配置信息。
3. `MAVEN_HOME` 的 `conf` 目录下的 `settings.xml` 文件中： 用于定义一个 `maven` 环境的全局配置信息（可以为一个系统上的多个用户服务）。

## 配置内容

**配置在 `settings.xml` 中的内容，因为是全局的，通常比较宽泛，比如远程仓库、插件仓库等；配置在 `pom.xml` 中的信息，与项目相关，更为具体。**

能够定义在 `settings.xml` 中信息通常为：

* `repositories`: 定义远程仓库信息。
* `pluginRepositories`: 定义插件仓库信息。
* `properties`: 定义键值对（可以在 `pom.xml` 文件中使用）。

能够定义在 `pom.xml` 中的信息，除了以上可以定义在 `settings.xml` 中的，通常还有：

* `dependencies`: 定义依赖。
* `plugins`: 定义需要使用的插件。
* `dependencyManagement`: 声明可能需要的依赖。
* `distributionManagement`: 声明可能需要的发布信息。
* `defaultGoal`: 配合 `plugin` 使用。
* `resources`: 声明资源文件。
* `testResources`: 声明测试资源文件。
* `finalName`:

## 激活方式

**`profile` 定义以后，必须激活才能生效。**

有以下几种激活 `profile` 的方式：

* 控制台命令激活：`mvn <cmd> -P <profile-name>`
* 也可以指定不激活某个 `profile`：`mvn <cmd> -P !<profile-name>`。
* 在配置文件中使用 `activateByDefault` 激活，如：

```xml
<profiles>
    <profile>
        <id>default-name</id>
        <properties>
            <name>Jack</name>
        </properties>
        <activation>
            <activateByDefault />
        </activation>
    </profile>

    <profile>
        <id>name</id>
        <properties>
            <name>Rose</name>
        </properties>
    </profile>
</profiles>
```

默认情况下，`default-name` 会生效，如果通过 `-P` 指定了 `name` 生效则默认项失效。

* 在 `settings.xml` 中使用 `activeProfiles` 来激活，如：

```xml
<activeProfile>
    <activeProfile>name</activeProfile>
</activeProfiles>
```

* 根据环境自动激活 `profile`，如：

**根据 `jdk` 版本激活：**

```xml
<profiles>  
    <profile>  
        <id>test1</id>  
        <jdk>1.4</jdk>  
    </profile>

    <profile>  
        <id>test2</id>  
        <jdk>[1.5,1.7)</jdk>  
    </profile>  
<profiles>  
```

以上识别 `jdk` 版本为 1.4 时激活 `test1`，版本为 1.5 到 1.7 时激活 `test2`。

**根据系统信息自动激活：**

```xml
<profiles>  
    <profile>  
        <id>test3</id>  
        <activation>  
            <os>  
                <name>Windows XP</name>  
                <family>Windows</family>  
                <arch>x86</arch>  
                <version>5.1.2600</version>  
            </os>  
        </activation>  
    </profile>  
</profiles>  
```

以上在 `windows xp` 32位系统环境下激活 `test3`。

**根据是否定义了某个变量来激活:**

```xml
<profiles>  
    <profile>  
        <id>profileTest1</id>  
        <activation>  
            <property>  
               <name>hello</name>  
            </property>  
        </activation>  
    </profile>  
</profiles>  
```

以上检查是否有值为 `hello` 的 `name` 变量，有则激活；也可以通过命令行定义变量：`mvn <cmd> -Dname=hello`

**根据某个文件或文件夹是否存在激活：**

```xml
<profiles>  
    <profile>  
        <id>profileTest1</id>  
        <activation>  
            <file>  
                <exists>target</exists>  
            </file>  
        </activation>  
    </profile>  
</profiles>  
```

以上存在 `target` 文件时激活。

```xml
<profiles>  
    <profile>  
        <id>profileTest1</id>  
        <activation>  
            <file>  
                <missing>target</missing>  
            </file>  
        </activation>  
    </profile>  
</profiles>  
```

以上在不存在 `target` 文件时激活。

## 查看所有将被激活的 `profile`

```shell
mvn help:active-profiles
```

## 实用 `profile`

```xml
<profile>
    <!-- q = http://memory-alpha.wikia.com/wiki/Q

         The Quick profile is used during incremental local development, when you want to "just get that JAR built",
         which is very handy e.g. for fast hot reloading cycles in Karaf with bundle watch.  It (intentionally!) skips
         tests, quality checks etc. which are great and useful to run before finally submitting changes to Gerrit, and
         which all must run on Gerrit, but which are overhead during ongoing fast iterative local development.

         Note that the idea here is that your IDE will already have run quality checks such as e.g. Checkstyle
         while you typed the code anyway.  Similarly, if you wrote a test, you'll probably already have compiled and run it
         from your IDE, so when you want the OSGi bundle JAR for Karaf, ASAP, you typically don't want all that to run again.
      -->
    <id>q</id>
    <properties>
        <skipTests>true</skipTests>
        <!-- But NOT <maven.test.skip>true, as that's for compiling, not running, tests;
             and that's usually quick.  Skipping test compilation with -Pq with maven.test.skip would be
             particularly confusing when used in a project with maven-jar-plugin <goal>test-jar, so don't.)  -->
        <skipIT>true</skipIT>
        <skipITs>true</skipITs>
        <skip.karaf.featureTest>true</skip.karaf.featureTest>
        <jacoco.skip>true</jacoco.skip>
        <maven.javadoc.skip>true</maven.javadoc.skip>
        <maven.source.skip>true</maven.source.skip>
        <checkstyle.skip>true</checkstyle.skip>
        <findbugs.skip>true</findbugs.skip>
        <maven.site.skip>true</maven.site.skip>
        <invoker.skip>true</invoker.skip>
        <enforcer.skip>true</enforcer.skip>
    </properties>
</profile>
```

定义以上内容，使用 `mvn clean install -Pq` 命令时，实现跳过测试，快速编译。
