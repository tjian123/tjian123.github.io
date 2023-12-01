---
layout: default
title: Spring Framework 基础知识
description: Spring Framework 的核心内容及简单实现
categories: 
   - 技术积累
tags: 
   - Spring
   - Java
---

> abstract

<!-- more -->
* TOC
{:toc}

## 1. 什么是 Spring

Spring[^spring] 是一个支持快速开发 JavaEE 程序的框架。

Spring 提供了一些列底层容器和基础设施，并可以与大量常用第三方开源工具无缝集成，为 JavaEE 程序开发带来了很多便利，提高应用开发效率。

Spring 最早是由 `Rob Johnson` 在他的《Expert One-on-One J2EE Development without EJB》一书中提出的，用来取代 EJB 的轻量级框架。后来 `Rob Johnson` 专门开发了这个框架，并命名为 `Spring Framework`。

![Rob Johnson](/images/posts/spring/rob_johnson.jpg)

随着 Spring 越来越受欢迎，在 Spring Framework 的基础上，又诞生了 `Spring Boot`、`Spring Cloud`、`Spring Security`、`Spring Data` 等一系列基于 `Sping Framework` 的项目。

[^spring]: spring 官网](<https://spring.io>)

## 2. Spring Framework

`Spring Framework` 主要包括几个模块：

* 支持 `IoC` 和 `AOP` 的容器
* 支持 JDBC 和 ORM 的数据访问模块
* 支持声明式事务的模块
* 支持基于 Servlet 的 MVC 开发
* 支持基于 Reactive 的 Web 开发
* 集成 JMS、JavaMail、JMX 和缓存等模块

### 2.1 IoC 容器

IoC 容器是 Spring 框架最核心的概念之一。

什么是容器？容器时一种为某种特定组件运行提供支持的软件环境。

容器提供运行环境的基础，通常是实现了许多的底层服务。如 Servlet 容器底层实现了 TCP 协议，解析 HTTP 协议等服务。

Spring 的 IoC 容器可以管理所有轻量级的 JavaBean 组件，提供的底层服务包括组件的声明周期管理、配置和装配服务，AOP 支持，以及建立在 AOP 基础上的声明式事务管理等。

IoC 即控制反转，在 IoC 模式下，组件的创建不再由应用程序自己创建和配置，而是交给 IoC 容器管理。这样，应用程序只需要直接使用已经创建并配置好的组件即可。

IoC 又称为 DI，它解决了一个最主要的问题：将组件的创建配置和组件的使用相分离，由 IoC 容器管理组件的声明周期。

在 Spring 的 IoC 容器中，我们把所有的组件统称为 JavaBean，即配置一个组件就是配置一个 JavaBean。

Spring 中表示 IoC 容器的是 `ApplicationContext`，这是一个接口，Spring 中提供了很多默认实现类，如 `ClassPathXmlApplicationContext` 等。

使用 Spring 的 IoC 容器，实际上就是通过一种配置方式描述各种组件的依赖关系，然后将这些描述交给 IoC 容器来创建和装配组件。

Spring IoC 容器管理 Bean 有以下特点：

1. 使用 `@AutoWired` 注入 Bean 时，既可以注入在属性、setter 方法上，也可以注入在构造方法上
2. 默认使用 Singleton 创建 Bean，即创建单实例 Bean，也可以使用 `@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)` 指定每次调用时创建新的实例
3. 可以将相同类型的 Bean 注入到 `List` 或者数组中
4. 默认使用 `@AutoWired` 在无法注入对应依赖时会报错，使用 `@AutoWired(required=false)` 则允许可选注入
5. 除了使用 `@Component` 声明组件外，也可以在配置类中使用 `@Bean` 注解创建组件
6. 如果同一个类型有多个实现实例交给容器管理时，会出现冲突。可以使用命名组件解决该问题，即 `@Component("name")` 形式，此外也可以使用一个单独的 `@Qualifier("name")` 注解
7. 可以为一个 Bean 加入初始化和清理流程，使用 `@PostConstruct` 和 `@PreDestroy` 注解标注
8. 可以使用 `FactoryBean` 使用工厂方法模式创建 Bean

Spring 框架提供了非常方便的资源访问服务：

1. 可以直接通过 `Resource` 类注入文件
2. 可以通过 `PropertySource` 将一个 Bean 绑定到一个 `.property` 文件，然后通过 `@Value("${key:default_value}")` 注入值，然后在使用值的地方通过 `@Value("#{bean.key}")` 来注入值

Spring 支持根据不同的条件来选择是否装配一个 Bean ：

1. 使用 `@Profile` 注解，配合启动时的选择项 '-Dspring.profiles.active' 来选择是否装配 Bean
2. 使用 `@Conditional` 注解条件选择，Spring Boot 在此基础上提供了更方便的基于值、类等的配置

## AOP

AOP 是指面向切面编程，AOP 思想将业务流程划分为一个个关注点，对多个业务流程中公共的关注点提取出来加以处理，减少了核心业务逻辑的冗余。

在 Java 平台上，对于 AOP 的植入，有 3 种方式：

1. 编译器：在编译时由编译器把切面调用编译进字节码，这种方式需要定义新的关键字并扩展进编译器，AspectJ 就扩展了 Java 编译器使用关键字 aspect 实现植入
2. 类加载器：在目标类被加载到 JVM 时，通过一个特殊的类加载器对目标类的字节码重新增强
3. 运行期：目标对象和切面都是普通 Java 类，通过 JVM 的动态代理功能或者第三方库实现运行期动态植入，Spring 就是采用这种方式

在 AOP 编程中，我们经常会遇到下面的概念：

| 名称 | 说明 |
|---------|-------------|
| Aspect  |切面，即一个横跨多个核心逻辑的功能，或者称为系统关注点|
| Joinpoint | 连接点，即定义在逻辑流程中的哪个位置插入切面 |
| Pointcut | 切入点，即一组连接点的集合 |
| Advice | 增强，指特定连接点上执行的动作 |
| Introdution | 引入，指为一个已有的 Java 对象动态增加新的接口 |
| Weaving | 织入，指将切面整合到执行流程中 |
| Interceptor | 拦截器，是一种实现增强的方式 |
| Target Object | 目标对象，即真正执行业务核心逻辑的对象 |
| AOP Proxy | AOP 代理，即客户端持有的增强的对象引用 |

在 Spring 中使用 AOP 非常简单：

1. 使用 `EnableAspectJAutoProxy` 开启切面控制
2. 使用 `@Aspect` 将一个组件声明为切面
3. 使用 `@Before`、`@After`、`@Around`、`@AfterReturning` 或 `@AfterThrowing` 之一定义拦截器