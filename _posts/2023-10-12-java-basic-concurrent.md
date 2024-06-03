---
layout: default
title: Java 基础 —— 并发包
description: 并发下的竞争和协作。
categories: 
   - 技术积累
   - Java 基础
tags: 
   - Java
   - JUC
---

> 多线程并发有两个核心问题：一个是竞争，一个是协作。竞争会出现线程安全问题，我们先讨论竞争的机制，然后讨论协作的机制。

<!-- more -->
* TOC
{:toc}

## 线程安全的机制

线程表示一条单独的执行流，每个线程都有自己的执行计数器和栈，但是可以共享内存。内存共享是竞争的根本原因，也是实现线程协作的基础。共享内存有两个问题：竞态条件和内存可见性。在`Java`中解决这两个问题，可以使用以下思路：

* 使用 `synchronized` 关键字
* 使用显式锁
* 使用 `volatile`
* 使用原子变量和 CAS
* 使用写时复制
* 使用 `ThreadLocal`

### `synchronized`

`synchronized` 简单易用，大部分情况下，放在方法声明前面就可以，既能解决竞态条件问题，又能解决可见性问题。

需要理解的是，他保护的是对象而不是代码，只有对同一个对象的 `synchronized` 方法调用，才能保证顺序调用。对于实例方法，保护的对象是 `this`；对于静态方法，保护的对象是类对象；而对于代码块，需要指定保护对象。

另外，`synchronized` 不能尝试获得锁，它要么获得锁，要么阻塞等待；也不响应中断，还可能会死锁。

### 显式锁

显式锁时相对于 `synchronized` 这种隐式锁而言的，它可以实现 `synchronized` 同样的功能，但需要程序员自己创建和释放锁。显式锁的主要接口是 `Lock`，主要实现类是 `ReentrantLock`。

相比 `synchronized` 显式锁支持以非阻塞的方式获得锁，可以响应中断，可以限时，可以指定公平性，这使得它灵活得多。

在读多写少、读操作完全可以并行的场景中，可以使用读写锁提供并发效率。读写锁的接口是 `ReadWiteLock`，实现类是 `ReentrantReadWriteLock`。

### `volatile`

`synchronized` 和 显式锁都是锁，使用锁可以实现安全，但使用锁是有成本的，获取不到锁的线程需要等待，会有线程上下文切换的开销等。有时候不一定需要锁，如果共享的对象只有一个，操作也只是进行简单的 get、set，且 set 也不依赖于之前的值，那就不存在竞态条件的问题而只有内存可见性的问题。这时，在需要共享的变量上加上 `volatile` 关键字既可以了。

### 原子变量和 CAS

使用 `volatile`，`set` 的新值不能依赖于旧值。但很多时候，新值是与原来的值有关的，这时也不一定就需要锁。如果需要同步的代码比较简单，可以考虑原子变量，他们包含了一些以原子方式实现组合操作的方法，对于并发环境中计数、产生序列号等需求，应该首选原子变量而非锁。

原子变量的基础是 CAS，一般的计算机系统都在硬件层次上直接支持 CAS 指令。通过循环 CAS 的方式实现原子更新是一种重要的思维。相比 `synchronized`，它是乐观的，而 `synchronized` 是悲观的；它是非阻塞的，而 `synchronized` 是阻塞的式的。

CAS 是 Java 并发包的基础，基于它可以实现高效的、乐观、非阻塞式数据结构和算法，它也是并发包中锁、同步工具和各种容器的基础。

### 写时复制

之所以会有线程安全的问题，是因为多个线程并发读写同一个对象，如果每个线程读写的对象都是不同的，或者共享访问的对象是只读的，不能修改的，那也就不存在线程安全问题了。

写时复制就是将共享访问的对象变为只读的，写的时候再使用锁，保证只有一个线程写，写的线程不是直接修改原对象，而是新创建一个对象，对该对象修改完毕后，再原子性的修改共享访问的变量，让它执行新的对象。

### `ThreadLocal`

`ThreadLocal` 就是让每个线程对同一个变量都有自己的独有副本，每个线程实际访问的对象都是自己的，自然就不存在线程安全问题了。

## 线程的协作机制

多线程之间的核心问题，除了竞争就是协作。协作场景通常是生产者/消费者模式，主从模式，同时开始，集合点等，实现协作的机制包括：

* `wait/notify`
* 显式条件
* 线程的中断
* 协作工具类
* 阻塞队列
* `Future、FutureTask`

### `wait/notify/notifyAll`

`wait/notify` 与 `synchronized` 配合一起使用，是线程的基本协作机制。每个对象都有一个锁和两个等待队列，一个是锁等待队列，一个是条件等待队列。锁等待队列放的是等待获取锁的线程，条件等待队列放的是等待条件的线程。`wait` 时将自己放入条件等待队列，`notify` 时从条件等待队列是哪个移除一个线程并唤醒，`notidfyAll` 移除条件等待队列的所有线程并唤醒。

需要注意的是，`wait/notify` 方法只能在 `synchronized` 代码块内被调用，调用 `wait` 时，线程会释放对象锁，被 `notify/notifyAll` 唤醒后线程需要重新竞争对象锁，获得锁后才能从 `wait` 调用中返回。

`wait/notify` 方法看上去很简单，但往往难以理解 `wait` 等待的是什么，而 `notify` 通知的又是什么，且只有一个条件等待队列，这使得 `wait/notify` 机制存在局限性。

### 显式条件

显式条件与显式锁配合使用，由显式锁创建。与 `wait/notify` 相比，可以支持多个条件队列，代码更为易读，效率更高。使用时需要主要，不要将 `await/signal/sinalAll` 误用为 `wait/notify/notifyAll`。

### 线程的中断

Java 中取消、关闭一个线程的机制是中断。中断并不是强迫终止一个线程，它是一种协作机制，是给线程传递一个取消信号，但是由线程自身来决定如何以及何时退出。线程在不同状态和IO操作时对中断有不同的反应。作为线程的实现者，应该提供清晰的线程关闭方法，而避免使用中断取消。

### 协作工具类

除了使用显式锁和条件，针对常见的协作场景，Java 并发包提供了多个用于协作的工具类。

* `Semaphore` 信号量用于限制对资源的并发访问量
* `CountDownLatch` 倒计时门栓用于不同角色线程之间的同步，它是一次性的
* `CyclicBarrier` 循环栅栏用于同一角色线程间的协调一致，它可以重复摄影

### 阻塞队列

常见的生产者/消费者模式，可以使用阻塞队列实现。最阻塞队列封装了锁和条件，生产者和消费者只需要调用队列的入队和出队方法就可以了，不需要考虑同步和协作问题。

### `Future/FututreTask`

在常见的主从协作模式中，主线程往往是让子线程异步执行一项任务，获取其结果。手工创建子线程的写法往往比较繁琐，常见的模式是使用异步任务执行服务，不再手工创建线程，而只是提交任务。提交后马上得到一个结果，但这个结果并不是最终结果，而是一个 `Future`。`Future` 是一个接口，封装了线程执行过程和结果，主要实现类是 `FutureTask`。

## 容器类

线程安全的容器有两类：一类是同步容器，另一类是并发容器。

### 同步容器

`Collections` 类中有一些静态方法，可以基于普通容器返回线程安全的同步容器，比如：

```java
public static <T> Collection<T> synchronizedCollection(Collection<T> c)
public static <T> List<T> synchronizedList(List<T> list)
public static <K, V> Map<K, V> synchronizedMap(Map<K, V> map)
```

他们是通过给所有容器的方法都加上 `synchronized` 关键字实现的，是对整个同步容器加锁，性能比较低。

另外这些同步容器在使用时还存在复合操作问题、迭代问题。

### 写时复制的 `List` 和 `Set`

`CopyOnWriteArrayList` 基于数组实现了 `List` 接口，`CopyOnWriteArraySet` 基于 `CopyOnWriteArrayList` 实现了 Set 接口，他们采用了写时复制，适用于读远远多于写，且集合数量不太大的场景。

### `ConcurrentHashMap`

`HashMap` 不是线程安全的，在并发更新的情况下，`HashMap` 的链表结构可能形成环，出现死循环，占满 CPU。`ConcurrentHashMap` 是并发版的 `HashMap`，通过细粒度锁和其他技术实现了高并发，读操作完全并行，写操作支持一定程度的并行，以原子方式支持一些复合操作。

### 基于 `SkipList` 的 `Map` 和 `Set`

`ConcurrentHashMap` 不支持排序，容器中可以排序的 `Map` 和 `Set` 是 `TreeMap` 和 `TreeSet`，但他们不是线程安全的。Java 并发包中与 `TreeMap` 和 `TreeSet` 对应的并发版本是 `ConcurrentSkipListMap` 和 `ConcurrentSkipListSet`。

`ConcurrentSkipListMap` 是基于跳表实现的，并发版本采用跳表而不是树结构，是因为跳表更容易实现高效的并发算法。

`ConcurrentSkipListMap` 没有使用锁，所有操作都是无阻塞的，所有操作都可以并行。

### 各种队列

各种阻塞队列主要用于协作，非阻塞队列适用于对个线程并发使用一个队列的场合。

有两个非阻塞队列：`ConcurrentLinkedQueue` 和 `ConcurrentLinkedDeque`，他们都是基于链表实现的，都没有限制大小，实现的基础原理是: 循环 CAS，没有使用锁。

## 任务执行服务

任务执行服务大大简化了执行异步任务所需要的开发，它引入了一个执行服务的概念，将任务的提交和任务的执行相分离，执行服务封装了任务执行的细节，对于任务提交者而言，它可以关注于任务本身，如提交任务、获取结果、取消任务，而不需要关注任务执行的细节，如线程创建、任务调度、线程关闭等。

### 基本概念

任务执行服务主要涉及以下接口：

* `Runnable` 和 `Callable`，表示需要提交的任务
* `Executor` 和 `ExecutorService` 表示执行服务
* `Future` 表示异步任务的结果

使用者只需要通过 `ExecutorService` 提交任务，通过 `Future` 操作任务和结果即可，不需要关注线程创建和协作的细节。

### 线程池

任务执行服务的主要实现机制是线程池，实现类是 `ThreadPoolExecutor`。线程池主要由两个概念组成：任务队列和工作者线程。任务队列是一个阻塞队列，保存待执行的任务。工作者线程主题就是一个循环，循环从队列中接收任务并执行。

### 定时任务

异步任务中，常见的任务是定时任务，在 Java 中 有两种方式用于实现定时任务：

1. 使用 `java.util` 包中 `Timer` 和 `TimerTask`
2. 使用 java 并发包中的 `ScheduledExecutorService`

`Timer` 有一些注意事项：

* 一个 `Timer` 背后只有一个工作线程，这意味着定时任务不能耗时太长，更不能是无限循环
* 在执行一个 `run` 方法时一旦抛出异常，`Timer` 线程就会退出，从而所有定时任务都会取消

`ScheduledExecutorService` 的主要实现类是 `ScheduledThreadPoolExecutor`，他没有 `Timer` 的问题，它的背后是线程池，每个任务执行时捕获了异常。

实践中建议使用 `ScheduledExecutorService`。

## 组合式并发编程

* 普通的内存可见性并发问题，只需要通过 `volatile` 关键字就可以解决，甚至不需要锁
* 使用 `synchronized` 的关键字，可以解决大部分普通低并发场景下的竞态条件和内存可见性问题
* 简单的单一高并发资源读写也可以通过原子变量实现线程安全
* 对于简单的并发协作场景，可以结合并发容器和并发协作类去完成
* 如果并发任务比较复杂，难以估计任务结果，可以使用异步任务执行服务去隔离并发关注点

但是如果多个并发任务之间存在依赖关系时，上述机制都不能很好完成，至少无法简单实现。Java 8 中提供了组合式并发编程工具类 `CompletableFuture` 正是解决这种存在依赖关系的并发场景的利器。

### `CompletableFuture`

`CompletableFuture` 实现了 `Future<T>` 和 `CompletionStaget<T>` 接口：

* `Future<T>` 封装了异步执行的结果，连接任务提交线程和任务执行线程
* `CompletionStaget<T>` 主要提供了组合式执行异步任务的 API

`CompletionStaget<T>` 提供的组合式 API 包括(14 * 3 = 42 个)：

* `thenApply` 类，接收一个 `Function`，将上一个输出 T 处理为 U
  * `<U> CompletionStage<U> thenApply(Function<? super T, ? extends U> fn)`
  * `<U> CompletionStage<U> thenApplyAsync(Function<? super T, ? extends U> fn)`
  * `<U> CompletionStage<U> thenApplyAsync(Function<? super T, ? extends U> fn, Executor executor)`
* `thenAccept` 类，接收一个 `Comsumer`，处理输出 U，无返回值
  * `CompletionStage<Void> thenAccept(Consumer<? super T> action)`
  * `CompletionStage<Void> thenAcceptAsync(Consumer<? super T> action)`
  * `CompletionStage<Void> thenAcceptAsync(Consumer<? super T> action, Executor executor)`
* `thenRun` 类，接收一个 `Runnable`，不对结果处理也不返回值
  * `CompletionStage<Void> thenRun(Runnable action)`
  * `CompletionStage<Void> thenRunAsync(Runnable action)`
  * `CompletionStage<Void> thenRunAsync(Runnable action, Executor exector)`
* `thenCombine` 类，接收另一个 `CompletionStage`，在两个 `CompletionStage` 都执行成功后，将结果应用于 `BiFunction` 输出，返回值是一个新的 `CompletionStage`
  * `<U, V> CompletionStage<V> thenCombine(CompletionStage<? extends U> other, BiFunction<? super T, ? super U, ? extends V> fn)`
  * `<U, V> CompletionStage<V> thenCombineAsync(CompletionStage<? extends U> other, BiFunction<? super T, ? super U, ? extends V> fn)`
  * `<U, V> CompletionStage<V> thenCombineAsync(CompletionStage<? extends U> other, BiFunction<? super T, ? super U, ? extends V> fn, Executor exector)`
* `thenAcceptBoth` 类，接收另一个 `CompletionStage`，在两个`CompletionStage` 都执行成功后，将结果应用于 `BiConsumer`，不返回具体值
  * `<U> CompletionStage<Void> thenAcceptBoth(CompletionStage<? extends U> other, BiConsumer<? super T, ? super U> action)`
  * `<U> CompletionStage<Void> thenAcceptBothAsync(CompletionStage<? extends U> other, BiConsumer<? super T, ? super U> action)`
  * `<U> CompletionStage<Void> thenAcceptBothAsync(CompletionStage<? extends U> other, BiConsumer<? super T, ? super U> action, Executor exector)`
* `runAfterBoth` 类，接收一个 `CompletionStage`，在两个 `CompletionStage` 都执行成功后，调用 `Runnable`
  * `CompletionStage<Void> runAfterBoth(CompletionStage<?> other, Runnable action)`
  * `CompletionStage<Void> runAfterBothAsync(CompletionStage<?> other, Runnable action)`
  * `CompletionStage<Void> runAfterBothAsync(CompletionStage<?> other, Runnable action, Executor exector)`
* `applyToEither` 类，接收一个 `CompletionStage`，两个 `CompletionStage` 中任意一个成功就将结果 T 应用 `Function`，返回一个新的 `CompletionStage`
  * `<U> CompletionStage<U> applyToEither(CompletionStage<? extends T> other, Function<? super T, U> fn)`
  * `<U> CompletionStage<U> applyToEitherAsync(CompletionStage<? extends T> other, Function<? super T, U> fn)`
  * `<U> CompletionStage<U> applyToEitherAsync(CompletionStage<? extends T> other, Function<? super T, U> fn, Executor exector)`
* `acceptEither` 类，接收一个 `CompletionStage`，两个 `CompletionStage` 中任意一个成功就将结果 T 应用 `Comsumer`，返回一个不带结果的新的 `CompletionStage`
  * `CompletionStage<Void> acceptEither(CompletionStage<? extends T> other, Comsumer<? super T> action)`
  * `CompletionStage<Void> acceptEitherAsync(CompletionStage<? extends T> other, Comsumer<? super T> action)`
  * `CompletionStage<Void> acceptEitherAsync(CompletionStage<? extends T> other, Comsumer<? super T> action, Executor exector)`
* `runAfterEither` 类，接收一个 `CompletionStage`，两个 `CompletionStage` 中任意一个成功就执行 `Runnable`，返回一个不带具体结果的新的 `CompletionStage`
  * `CompletionStage<Void> runAfterEither(CompletionStage<?> other, Runnable action)`
  * `CompletionStage<Void> runAfterEitherAsync(CompletionStage<?> other, Runnable action)`
  * `CompletionStage<Void> runAfterEitherAsync(CompletionStage<?> other, Runnable action, Executor exector)`
* `thenCompose` 类，接收一个 `Function`，将结果应用于 `Function`，返回一个基于前结果的 `CompletionStage`
  * `<U> CompletionStage<U> thenCompose(Function<? super T, ? extends Completion<U>> fn)`
  * `<U> CompletionStage<U> thenComposeAsync(Function<? super T, ? extends Completion<U>> fn)`
  * `<U> CompletionStage<U> thenComposeAsync(Function<? super T, ? extends Completion<U>> fn, Executor exector)`
* `handle` 类，在当前 `CompletionStage` 正常执行完成或者抛异常是调用 `BiFunction`，改变原结果
  * `<U> CompletionStage<U> handle(BiFunction<? super T, Throwable, ? extends U> fn)`
  * `<U> CompletionStage<U> handleAsync(BiFunction<? super T, Throwable, ? extends U> fn)`
  * `<U> CompletionStage<U> handleAsync(BiFunction<? super T, Throwable, ? extends U> fn, Executor exector)`
* `whenComplete` 类，在当前 `CompletionStage` 正常执行完成或者抛异常是调用 `BiComsumer`，不改变原结果
  * `CompletionStage<T> whenComplete(BiComsumer<? super T, ? super Throwable> action)`
  * `CompletionStage<T> whenCompleteAsync(BiComsumer<? super T, ? super Throwable> action)`
  * `CompletionStage<T> whenCompleteAsync(BiComsumer<? super T, ? super Throwable> action, Executor exector)`
* `exceptionally` 类，只在异常发生时处理，将异常装换为 T
  * `CompletionStage<T> exceptionally(Function<Throwable, ? extends T> fn)`
  * `CompletionStage<T> exceptionallyAsync(Function<Throwable, ? extends T> fn)`
  * `CompletionStage<T> exceptionallyAsync(Function<Throwable, ? extends T> fn, Executor exector)`
* `exceptionallyCompose` 类
  * `CompletionStage<T> exceptionallyCompose(Function<Throwable, ? extends CompletionStage<T>> fn)`
  * `CompletionStage<T> exceptionallyComposeAsync(Function<Throwable, ? extends CompletionStage<T>> fn)`
  * `CompletionStage<T> exceptionallyComposeAsync(Function<Throwable, ? extends CompletionStage<T>> fn, Executor exector)`
