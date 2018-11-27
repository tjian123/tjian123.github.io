---
layout: default
description: 用于打包 OSGi bundle 的 maven 插件。
categories: 
  - 构建编译
tags: 
  - Karaf
  - OSGi
  - Maven
---

> 用于打包 OSGi bundle 的 maven 插件。

<!-- more -->
* TOC
{:toc}


介绍 `karaf-maven-plugin` 插件的用法：包括编译 `feature`、`kar`，以及生成自定义 `distribution`。

```xml
<plugin>
	<groupId>org.apache.karaf.tooling</groupId>
	<artifactId>karaf-maven-plugin</artifactId>
	<version>4.0.8</version>
</plugin>
```

## 目标：`karaf:features-generate-descriptor`

```xml
<plugin>
	<groupId>org.apache.karaf.tooling</groupId>
	<artifactId>karaf-maven-plugin</artifactId>
	<version>4.0.8</version>
	<extensions>true</extensions>
	<executions>
		<execution>
			<id>generate-features</id>
			<!-- <phase>compile</phase> -->
			<goals>
				<goal>features-generate-descriptor</goal>
			</goals>
			<configuration>
				<inputFile>${project.build.directory}/classes/features.xml</inputFile>
			</configuration>
		</execution>
	</executions>
</plugin>
```

## 目标：`karaf:kar`

```xml
<packaging>kar</packaging>
<build>
	<plugins>
		<plugin>
			<groupId>org.apache.karaf.tooling</groupId>
			<artifactId>karaf-maven-plugin</artifactId>
			<version>4.0.8</version>
		</plugin>
	</plugins>
</build>
```

## 目标：`karaf:karaf-assembly`

```xml
<plugin>
	<groupId>org.apache.karaf.tooling</groupId>
	<artifactId>karaf-maven-plugin</artifactId>
	<version>4.0.8</version>
	<extensions>true</extensions>
</plugin>
```