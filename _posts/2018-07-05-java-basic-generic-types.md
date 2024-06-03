---
layout: default
title: Java 基础 —— 泛型
description: 泛型的基本用法和实现原理，以及使用细节
categories: 
  - 技术积累
  - Java 基础
tags: 
   - Java
---

> 泛型的基本用法和实现原理。

<!-- more -->

* TOC
{:toc}

## 泛型是什么

泛型，即广泛的、通用的类型。Java 中使用泛型来做模型抽象和数据封装，可以实现算法和数据结构与数据类型分离，能够有效减少重复代码。

Java 中的泛型有以下两种：

* 类型参数，通常使用单一大写字母表示（但并不强制）
  * 限定上界类型参数，使用关键字 `extends`，如 `<K extends Number>` 表示可使用 `Number` 及其子类
  * 无限定类型参数，即单一的类型表示
* 通配符，使用 '?' 表示
  * 有限定通配符，使用了 '?' 和 `extends` 或 `super` 关键字
    * 限定上界通配符，使用关键字 `extends`，如 `<? extends Number>` 表示适用 `Number` 及其子类
    * 超类型通配符，使用关键字 `super`，如 `<? super Numer>` 表示适用 `Number` 及其父类，至少可以是 `Number` 类
  * 无限定通配符，即仅使用 '?'

## 泛型的基本用法

泛型可以用于定义泛型类、接口和静态方法。

### 定义泛型类

泛型类即在类的定义中加入泛型参数，但不支持通配符，泛型类中本身是需要使用泛型自身的类型的。
但是基于泛型类声明变量或定义方法参数时，可以使用通配符。

jdk 中的常用泛型类

* `ArrayList<E>`，通用的数组容器
* `ThreadLocal<T>`，用于定义一个线程本地变量
* `Class<T>`，

### 定义泛型接口

泛型接口类似于泛型类，其泛型参数通常作为接口方法的参数或返回值使用。

jdk 中常用的泛型接口

* `Comparable<T>`，定义比较器

### 定义泛型静态方法

泛型静态方法中可以独立声明泛型参数或者泛型通配符（在不需要使用大泛型本身类型时即可使用通配符表示）。

## 为什么使用泛型

泛型的好处是编译时类型安全检查，这样隐去了强制类型转换，提高代码重用率。

### 保证类型安全

没有泛型之前，从集合中取出元素需要进行强制类型转换，一旦插入了错误的类型，运行时的强制类型转换就会报错。
有泛型以后，使用时指定泛型类型，错误的类型编译时就会识别出来。  

### 消除强制转换

没有泛型，取出元素默认为 Object 类型，需要进行类型转换；使用泛型编译时就知道了类型，由编译器自动进行类型转换。

### 提高代码可重用性

## 泛型实现原理

Java 中泛型是编译器在编译时通过类型擦除实现的，JVM 运行时并不能感知到泛型的存在。
泛型参数是通过 Object 来替代，而限定上界的泛型类型则使用父类替代。

## 使用泛型的注意事项

1. 不能通过 `new` 来实例化一个泛型类型，即不能使用 `T t = new T()`
2. 泛型类的类型参数不能用于声明静态变量和静态方法
3. 不支持创建泛型数组
4. 通配符形式(除了限定下界通配符，即使用'super'关键字的）都可以用类型参数替代，通配符能做的，类型参数都可以做
5. 使用通配符的泛型，可以减少类型参数，可读性更好，应该尽可能使用通配符
6. 如果返回参数需要用到泛型类型，或者多个类型参数之间有依赖，或者需要写操作，则只能使用类型参数
7. <? super E> 用于灵活写入或比较，使得对象可以写入父类型的容器，使得父类型的比较方法可以应用于子类对象，不能使用类型参数替代
8. <?> 和 <? extends E> 用于灵活读取，使得方法可以读取 E 或 E 的任意子类型的对象，可以使用类型参数替代，但是通配符更简洁