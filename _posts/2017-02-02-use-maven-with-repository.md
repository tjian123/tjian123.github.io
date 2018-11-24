---
layout: post
title: Maven 中 repository 实践
categories: 
  - 构建编译
tags: 
  - Maven
  - Java
---

> Maven 仓库是按照 `maven` 坐标组织 jar 包的位置，根据存放位置不同，分为本地仓库和远程仓库。

<!-- more -->
* TOC
{:toc}

## 本地仓库

1. 本地仓库必须在至少执行了一次 `mvn` 命令以后才会自动创建；
2. 可以通过命令行指定本地仓库的位置（但不推荐这种方式），如：`mvn install -Pmaven.repo.local=/home/user/repo`;
3. 可以修改 `conf\setting.xml` 文件中的 `localRepository` 配置项来更改本地仓库的位置。

## 远程仓库

根据功能不同，远程仓库又可以分为：中央仓库、镜像仓库和私有仓库等。

- 中央仓库

中央仓库是指 `maven` 官方提供的远程仓库，默认情况下，本地仓库不存在的构建会从中央仓库下载。

- 镜像仓库

镜像仓库是指对中央仓库的镜像，通常也是公共仓库，为了提供更好的访问服务，或者提供一些中央仓库不存在的构建而取代中央仓库。

- 私有仓库

私有仓库则是为了某个局域网内的私有构建共享、共有构建查询提供服务。

## 仓库相关的操作

### 修改本地仓库位置

上文已经提过，修改maven安装目录下的 `conf\setting.xml` 文件中的 `localRepository` 属性，使其指向修改的仓库位置。

### 添加远程仓库

远程仓库可以直接在项目的 `pom.xml` 文件中添加，格式如下：

```xml
<repositories>
	<repository>
		<id>jboss-repo</id>
		<url>http://repository.jboss.com/maven2/</url>
		<releases>
			<enabled>true</enabled>
		</releases>
		<snapshots>
			<enabled>false</enabled>
		<snapshots>
	</repository>
</repositories>
```

也可以借助于 `profile` 在 `setting.xml` 文件中添加，格式如下：

```xml
<profiles>
	<profile>
		<id>dev-repository</id>
		<repositories>
			...
		</repositories>
		<pluginRepositories>
			...
		</pluginRepositories>
	</profile>
</profiles>
<activeProfiles>
	<activeProfile>dev-repository</activeProfile>
</activeProfiles>
```

### 添加镜像仓库

如果一个远程仓库不好用，或者我们需要屏蔽这个仓库以避免某些插件，可以使用镜像仓库达到效果。镜像仓库在 `setting.xml` 中配置，格式如下：

```xml
<mirrors>
	<mirror>
		<id>china-repository</id>
		<name>China Repository mirror of Maven central.</name>
		<url>http://maven.net.cn/content/groups/public/</url>
		<morrorOf>central</mirrorOf>
	</mirror>
</mirrors>
```

*注：*
+ `<mirrorOf>*</mirrorOf>`：匹配所有仓库;
+ `<mirrorOf>external:*</mirrorOf>`：匹配不在本机上的所有远程仓库;
+ `<mirrorOf>repo1,repo2</mirrorOf>`：匹配repo1和repo2;
+ `<mirrorOf>*, !repo1</mirrorOf>`：匹配除了repo1的远程仓库。


### 配置私人仓库认证信息

一些私人仓库是需要认证的，认证信息在 `setting.xml` 中配置，格式如下：

```xml
<servers>
	<server>
		<id>dev-repository</id>
		<username>admin</username>
		<password>admin</password>
	</server>
</servers>
```

### 部署至远程仓库

如果需要将自己的构建发布到远程仓库供他人使用，则需要通过在 `pom.xml` 文件中配置，格式如下：

```xml
<distributionManagement>
	<repository>
		<id>proj-release</id>
		<name></name>
		<url></url>
	</repository>
	<snapshotRepository>
		<id>proj-snapshot</id>
		<name></name>
		<url></url>
	</snapshotRepository>
</distributionManagement>
```

使用 `mvn clean deploy` 命令发布。