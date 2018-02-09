---
layout: post
title: karaf-maven-plugin 用法实践
categories: [Coding]
tags: [Karaf, OSGi, Maven]
---

本文记录`karaf-maven-plugin`插件的用法：包括编译`feature`、`kar`，以及生成自定义`distribution`。

```
<plugin>
	<groupId>org.apache.karaf.tooling</groupId>
	<artifactId>karaf-maven-plugin</artifactId>
	<version>4.0.8</version>
</plugin>
```

## 目标：`karaf:features-generate-descriptor`

```
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

```
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

```
<plugin>
	<groupId>org.apache.karaf.tooling</groupId>
	<artifactId>karaf-maven-plugin</artifactId>
	<version>4.0.8</version>
	<extensions>true</extensions>
</plugin>
```