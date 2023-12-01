---
layout: default
title: 基于 Karaf 搭建后端服务（一）
categories:
  - 架构积累
tags:
  - Backend
  - Java
  - OSGi
  - Maven
---

> 本文介绍基于 [`Karaf`][karaf] 搭建大型后端服务系统的一般规则。理解本文需要一定的 [`OSGi`][osgi] 知识和 [`Maven`][maven] 技术积累。


<!-- more -->
* TOC
{:toc}

## 项目构成

一个大型的项目，通常需要分成以下模块：

- lib: 用于管理加载第三方依赖 `jar`
- artifacts: 用于管理本项目中的 `bundle`
- core: 项目的核心 `bundle`，每次启动都会自动加载的内容
- features: 以 `features` 形式组织和管理 `bundle` 的 `bundle`
- apps: 基于核心 `bundle` 开发的可选启用的业务功能
- runtime: 用于打包最终的项目

假定我们的项目名为 `shopping-hall`，那么按照以上说明，我们的目录结构应如下：

```shell
--shopping-hall
	--artifacts
	--apps
	--core
	--lib
	--features
	--runtime
	pom.xml
```

其中：

- `lib` 依赖 `artifacts`
- `shopping-hall` 继承 `lib`，同时聚合所有项目，提供统一编译入口
- 除了 `lib` 和 `artifacts` 以外的其他 `bundle` 都直接依赖 `shopping-hall` （通过继承间接依赖 `lib` 和 `artifacts`）

## `artifacts` 模块

`artifacts` 模块本身并没有需要编译的内容，打包方式为 `pom`。`artifacts` 模块的主要作用为：

- 将可能被其他模块依赖的 `bundle` 聚合于 `dependencyManagement` 中
- 统一内部被依赖 `bundle` 的版本管理和依赖范围（如 `runtime`、`test` 等），减少重复

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <version>0.0.1</version>
    <artifactId>shopping-mall-artifacts</artifactId>

    <packaging>pom</packaging>
    <name>Shopping Mall :: Artifacts</name>
    <description>modules 汇总, 用于提供便捷的内部依赖。</description>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>${project.groupId}</groupId>
                <artifactId>shopping-mall-core-api</artifactId>
                <version>${project.version}</version>
            </dependency>
			<!-- other dependencies -->
            <dependency>
                <groupId>${project.groupId}</groupId>
                <artifactId>shopping-mall-features</artifactId>
                <version>${project.version}</version>
                <classifier>features</classifier>
                <type>xml</type>
                <scope>runtime</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```

## `lib` 模块

`lib` 模块提供三个主要功能：

1. 统一管理整个项目的第三方依赖
2. 统一提供 `bundle` 编译配置（`plugin` 配置）
3. 引入 `artifacts` 中声明的可能被其他模块依赖的内部项目（通常是 `api` 相关的 `bundle`）

引入 `artifacts` 相关的配置为：

```xml
<dependency>
    <groupId>${project.groupId}</groupId>
    <artifactId>shopping-mall-artifacts</artifactId>
    <version>${project.version}</version>
    <scope>import</scope>
    <type>pom</type>
</dependency>
```

完整 `pom` 如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <version>0.0.1</version>
    <artifactId>shopping-mall-lib</artifactId>

    <name>Shopping Mall :: Lib</name>
    <description>Shopping Mall :: shared dependencies and plugins.</description>

    <packaging>pom</packaging>

    <properties>
        <!-- *************************1. 通用配置**************************** -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <!-- *************************2. 依赖库版本号************************* -->
        <!-- 2.1 osgi, felix and karaf -->
        <osgi.version>6.0.0</osgi.version>
        <karaf.version>4.1.1</karaf.version>
        <felix.scr.version>1.8.4</felix.scr.version>
        <felix.scr.annotations.version>1.12.0</felix.scr.annotations.version>
        <servlet.version>3.1.0</servlet.version>

        <!-- 2.2 log -->
        <slf4j.version>1.7.25</slf4j.version>

        <!-- 2.3 test -->
        <junit.version>4.12</junit.version>

        <netty.version>4.1.8.Final</netty.version>
        <grpc.version>1.8.0</grpc.version>
        <thrift.version>0.10.0</thrift.version>
        <google.auth.version>0.4.0</google.auth.version>
        <jackson.version>2.9.5</jackson.version>

        <!-- *************************3. 插件版本号*************************** -->
        <!-- 3.1 maven 插件 -->
        <plugin.maven.compiler.version>3.6.1</plugin.maven.compiler.version>
        <plugin.maven.resources.version>3.0.2</plugin.maven.resources.version>

        <!-- 3.2 karaf 插件 -->
        <plugin.karaf.features.version>2.4.4</plugin.karaf.features.version>

        <!-- 3.3 felix 插件 -->
        <plugin.felix.bundle.version>3.3.0</plugin.felix.bundle.version>
        <plugin.felix.scr.version>1.24.0</plugin.felix.scr.version>

        <!-- 3.4 其他 -->
        <plugin.build.helper>1.12</plugin.build.helper>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- 1. osgi 库 -->
            <!-- OSGi Core Release 6, Interfaces and Classes for use in compiling bundles. -->
            <dependency>
                <groupId>org.osgi</groupId>
                <artifactId>osgi.core</artifactId>
                <version>${osgi.version}</version>
                <scope>provided</scope>
            </dependency>
            <!-- 纲要 注解支持 -->
            <!-- OSGi Compendium Release 6, Interfaces and Classes for use in compiling bundles. -->
            <dependency>
                <groupId>org.osgi</groupId>
                <artifactId>osgi.cmpn</artifactId>
                <version>${osgi.version}</version>
                <scope>provided</scope>
            </dependency>
            <!-- OSGi Annotation Release 6, Annotations for use in compiling bundles. -->
            <dependency>
                <groupId>org.osgi</groupId>
                <artifactId>osgi.annotation</artifactId>
                <version>${osgi.version}</version>
                <scope>provided</scope>
            </dependency>
            <!-- 和cmpn等价 TODO ::完全？ -->
            <!-- OSGi Enterprise Release 6, Interfaces and Classes for use in compiling bundles. -->
            <dependency>
                <groupId>org.osgi</groupId>
                <artifactId>osgi.enterprise</artifactId>
                <version>${osgi.version}</version>
                <scope>provided</scope>
            </dependency>

            <!-- 2. felix 库 -->
            <dependency>
                <groupId>org.apache.felix</groupId>
                <artifactId>org.apache.felix.scr</artifactId>
                <version>${felix.scr.version}</version>
            </dependency>
            <!-- 在1.12.0版本中推荐使用org.osgi提供的annotations，但是貌似不好使用 -->
            <dependency>
                <groupId>org.apache.felix</groupId>
                <artifactId>org.apache.felix.scr.annotations</artifactId>
                <version>${felix.scr.annotations.version}</version>
                <scope>provided</scope>
            </dependency>

            <!-- 3. karaf 库 -->
            <dependency>
                <groupId>org.apache.karaf.features</groupId>
                <artifactId>framework</artifactId>
                <version>${karaf.version}</version>
                <type>kar</type>
            </dependency>
            <dependency>
                <groupId>org.apache.karaf.features</groupId>
                <artifactId>standard</artifactId>
                <version>${karaf.version}</version>
                <classifier>features</classifier>
                <type>xml</type>
                <scope>runtime</scope>
            </dependency>

            <dependency>
                <groupId>org.apache.karaf.features</groupId>
                <artifactId>org.apache.karaf.features.core</artifactId>
                <version>${karaf.version}</version>
                <scope>provided</scope>
            </dependency>

            <dependency>
                <groupId>org.apache.karaf.system</groupId>
                <artifactId>org.apache.karaf.system.core</artifactId>
                <version>${karaf.version}</version>
                <scope>provided</scope>
            </dependency>

            <dependency>
                <groupId>org.apache.karaf.shell</groupId>
                <artifactId>org.apache.karaf.shell.core</artifactId>
                <version>${karaf.version}</version>
                <scope>provided</scope>
            </dependency>

            <dependency>
                <groupId>org.apache.karaf.shell</groupId>
                <artifactId>org.apache.karaf.shell.console</artifactId>
                <version>${karaf.version}</version>
                <scope>provided</scope>
            </dependency>

            <!-- 4 其他 -->
            <!-- servlet -->
            <dependency>
                <groupId>javax.servlet</groupId>
                <artifactId>javax.servlet-api</artifactId>
                <version>${servlet.version}</version>
                <scope>provided</scope>
            </dependency>

            <!-- 日志 -->
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-api</artifactId>
                <version>${slf4j.version}</version>
            </dependency>

            <!-- 测试 -->
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>${junit.version}</version>
                <scope>test</scope>
            </dependency>

            <!-- 5. 内部依赖 -->
            <dependency>
                <groupId>${project.groupId}</groupId>
                <artifactId>shopping-mall-artifacts</artifactId>
                <version>${project.version}</version>
                <scope>import</scope>
                <type>pom</type>
            </dependency>

        </dependencies>
    </dependencyManagement>

	<!-- 必要的公共依赖 -->
    <dependencies>
        <dependency>
            <groupId>org.osgi</groupId>
            <artifactId>osgi.core</artifactId>
        </dependency>

        <!-- cmpn和enterprise都可以正常工作 -->
        <dependency>
            <groupId>org.osgi</groupId>
            <artifactId>osgi.cmpn</artifactId>
        </dependency>

        <dependency>
            <groupId>org.osgi</groupId>
            <artifactId>osgi.annotation</artifactId>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>
    </dependencies>

    <build>
        <pluginManagement>
            <plugins>
                <!-- 1. maven 插件 -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-resources-plugin</artifactId>
                    <version>${plugin.maven.resources.version}</version>
                </plugin>
                <!-- 使用jdk1.8对项目进行编译 -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>${plugin.maven.compiler.version}</version>
                    <configuration>
                        <source>1.8</source>
                        <target>1.8</target>
                    </configuration>
                </plugin>

                <!-- 2. felix 插件 -->
                <plugin>
                    <groupId>org.apache.felix</groupId>
                    <artifactId>maven-bundle-plugin</artifactId>
                    <version>${plugin.felix.bundle.version}</version>
                    <extensions>true</extensions>
                </plugin>

                <plugin>
                    <groupId>org.apache.felix</groupId>
                    <artifactId>maven-scr-plugin</artifactId>
                    <version>${plugin.felix.scr.version}</version>
                    <executions>
                        <execution>
                            <id>generate-scr-srcdescriptor</id>
                            <goals>
                                <goal>scr</goal>
                            </goals>
                        </execution>
                    </executions>
                    <configuration>
                        <supportedProjectTypes>
                            <supportedProjectType>bundle</supportedProjectType>
                            <supportedProjectType>war</supportedProjectType>
                        </supportedProjectTypes>
                    </configuration>
                </plugin>

                <!-- 3. karaf 插件 -->
                <plugin>
                    <groupId>org.apache.karaf.tooling</groupId>
                    <artifactId>karaf-maven-plugin</artifactId>
                    <version>${karaf.version}</version>
                    <extensions>true</extensions>
                </plugin>
                <plugin>
                    <groupId>org.apache.karaf.tooling</groupId>
                    <artifactId>karaf-services-maven-plugin</artifactId>
                    <version>${karaf.version}</version>
                    <executions>
                        <execution>
                            <id>service-metadata-generate</id>
                            <phase>process-classes</phase>
                            <goals>
                                <goal>service-metadata-generate</goal>
                            </goals>
                        </execution>
                    </executions>
                </plugin>
                <plugin>
                    <groupId>org.apache.karaf.tooling</groupId>
                    <artifactId>features-maven-plugin</artifactId>
                    <version>${plugin.karaf.features.version}</version>
                </plugin>

                <!-- 4. 其他插件 -->
                <plugin>
                    <groupId>org.codehaus.mojo</groupId>
                    <artifactId>build-helper-maven-plugin</artifactId>
                    <version>${plugin.build.helper}</version>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

## 根模块

所谓根模块，指的是聚合所有 `bundle`，提供统一编译入口的模块。显然，至于项目根目录下是最佳选择的。根模块直接继承 `lib` 模块，同时将第三方依赖和本项目可能被依赖的 `bundle` 暴露给所有继承了根模块的子项目。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.demo</groupId>
        <artifactId>shopping-mall-lib</artifactId>
        <version>0.0.1</version>
        <relativePath>./lib</relativePath>
    </parent>

    <artifactId>shopping-mall</artifactId>

    <packaging>pom</packaging>
    <name>Shopping Mall</name>
    <description>Shopping Mall backend.</description>

    <modules>
        <module>artifacts</module>
        <module>lib</module>
        <module>core</module>
        <module>apps</module>
        <module>features</module>
        <module>runtime</module>
    </modules>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

## `core` 聚合模块

`core` 模块中放置项目核心内容，通常是启动时必须存在的功能模块。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>shopping-mall</artifactId>
        <groupId>com.demo</groupId>
        <version>0.0.1</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>shopping-mall-core</artifactId>

    <packaging>pom</packaging>
    <name>Shopping Mall :: Core</name>

    <modules>
        <module>api</module>
        <module>utils</module>
        <module>impl</module>
        <module>cli</module>
    </modules>
</project>
```

## `apps` 聚合模块

`apps` 模块中放置可选加载的项目模块。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>shopping-mall</artifactId>
        <groupId>com.demo</groupId>
        <version>0.0.1</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>shopping-mall-apps</artifactId>

    <packaging>pom</packaging>
    <name>Shopping Mall :: Apps</name>

    <modules>
        <!-- <module>app1</module> -->
    </modules>
</project>
```

## `features` 模块

`features` 模块中对各类 `bundle` 整合归类，说明哪些 `bundle` 必须先启动，哪些必须作为一个整体启动等。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>shopping-mall</artifactId>
        <groupId>com.demo</groupId>
        <version>0.0.1</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>shopping-mall-features</artifactId>

    <packaging>feature</packaging>

    <name>Shopping Mall :: Features</name>
    <description>Shopping Mall :: features placed here.</description>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.karaf.tooling</groupId>
                <artifactId>karaf-maven-plugin</artifactId>
                <extensions>true</extensions>
                <configuration>
                    <logDependencyChanges>true</logDependencyChanges>
                    <overwriteChangedDependencies>true</overwriteChangedDependencies>
                </configuration>
                <executions>
                    <execution>
                        <id>verify</id>
                        <goals>
                            <goal>verify</goal>
                        </goals>
                        <configuration>
                            <descriptors>
                                <descriptor>mvn:org.apache.karaf.features/framework/${karaf.version}/xml/features</descriptor>
                                <descriptor>file:${project.build.directory}/feature/feature.xml</descriptor>
                            </descriptors>
                            <distribution>org.apache.karaf.features:framework</distribution>
                            <javase>1.8</javase>
                            <framework>
                                <feature>${project.artifactId}</feature>
                            </framework>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

## `runtime` 模块

`runtime` 模块将整个项目打包编译为一个可执行 `jar`。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>shopping-mall</artifactId>
        <groupId>com.demo</groupId>
        <version>0.0.1</version>
    </parent>

    <modelVersion>4.0.0</modelVersion>

    <artifactId>shopping-mall-runtime</artifactId>

    <!-- karaf-assembly 的打包方式，会直接生成 karaf 的可运行打包。 -->
    <packaging>karaf-assembly</packaging>

    <name>Shopping Mall :: Runtime</name>

    <dependencies>
        <!-- 默认scope是compile，用处：编译和运行时都需要依赖的jar -->
        <dependency>
            <groupId>org.apache.karaf.features</groupId>
            <artifactId>framework</artifactId>
            <type>kar</type>
        </dependency>
        <!-- scope为runtime，用处：只在运行时需要依赖的jar -->
        <dependency>
            <groupId>org.apache.karaf.features</groupId>
            <artifactId>standard</artifactId>
            <classifier>features</classifier>
            <type>xml</type>
        </dependency>
        <!-- 加入本项目的features -->
        <dependency>
            <groupId>${project.groupId}</groupId>
            <artifactId>shopping-mall-features</artifactId>
            <classifier>features</classifier>
            <type>xml</type>
        </dependency>
    </dependencies>

    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*</include>
                </includes>
            </resource>
            <resource>
                <directory>src/main/filtered-resources</directory>
                <filtering>true</filtering>
                <includes>
                    <include>**/*</include>
                </includes>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.karaf.tooling</groupId>
                <artifactId>karaf-services-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.karaf.tooling</groupId>
                <artifactId>karaf-maven-plugin</artifactId>
                <configuration>
                    <!-- startupFeatures中列举的feature会写入startup.properties -->
                    <!-- 对应的bundles会在指定的启动级别启动，并将被拷贝至system目录下 -->
                    <!--<startupFeatures>-->
                        <!--<feature></feature>-->
                    <!--</startupFeatures>-->
                    <!--<bootBundles>-->
                        <!--<bundle>mvn:com.demo/shopping-mall-brand/0.0.1</bundle>-->
                    <!--</bootBundles>-->
                    <!-- bootFeatures中的列举的feature会加入boot-features -->
                    <!-- 对应的bundles会在指定的启动级别启动，并将被拷贝至system目录下 -->
                    <bootFeatures>
                        <feature>jaas</feature>
                        <feature>shell</feature>
                        <feature>ssh</feature>
                        <feature>standard</feature>
                        <feature>management</feature>
                        <feature>bundle</feature>
                        <feature>deployer</feature>
                        <feature>diagnostic</feature>
                        <feature>instance</feature>
                        <feature>kar</feature>
                        <feature>log</feature>
                        <feature>package</feature>
                        <feature>service</feature>
                        <feature>system</feature>
                        <feature>scr</feature>
                        <feature>wrap</feature>
                        <feature>war</feature>
                        <feature>shopping-mall-third-party-base-feature</feature>
                        <feature>shopping-mall-utils-feature</feature>
                        <feature>shopping-mall-core-feature</feature>
                    </bootFeatures>
                    <!-- 这里列入的features会直接被安装在system中 -->
                    <installedFeatures>
                        <!--<feature>shopping-mall-web-feature</feature>-->
                    </installedFeatures>
                    <!--<featureRepositories>-->
                        <!--<featureRepository>mvn:com.demo/shopping-mall-features/0.0.1/xml/features</featureRepository>-->
                    <!--</featureRepositories>-->
                    <!--<descriptors>-->
                        <!--<descriptor>mvn:com.demo/shopping-mall-features/0.0.1/xml/features</descriptor>-->
                    <!--</descriptors>-->
                    <libraries>
                        <!-- 将 branding bundle 安装至lib目录下，来改变控制台外观 -->
                        <library>mvn:${project.groupId}/shopping-mall-brand/${project.version}</library>
                    </libraries>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

[karaf]:<https://karaf.apache.org>
[osgi]:<https://www.baidu.com>
[maven]:<https://www.baidu.com>