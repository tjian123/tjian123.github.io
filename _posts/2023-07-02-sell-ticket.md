---
layout: default
title: 一个售票流程的进化之路
description: 基于 Java 语言介绍多线程环境下实现无错售票的各种方式。
categories: 
   - 技术积累
tags: 
   - Java
---

> abstract

<!-- more -->
* TOC
{:toc}

## 单票多卖

在这个场景下，我们做以下假设：

* 只售卖一种票，总票数为 100 万张
* 多个售票窗口同时售票
* 每一次请求卖一张票
* 每个窗口都可以卖所有票

### `synchronized` 版本

```java
package com.tjian.juc.lock;

import java.util.ArrayList;
import java.util.List;

public class VolatileDemo {
    private static Long TOTAL_TICKET = 1000000L;

    public static void main(String[] args) {
        Object lock = new Object();
        Runnable consumer = () -> {
            for (int i = 0; i < 10000; i++) {
                synchronized(lock) {
                    TOTAL_TICKET --;
                }
            }
        };

        List<Thread> tasks = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            tasks.add(new Thread(consumer));
        }

        long startTime = System.currentTimeMillis();
        try {
            tasks.forEach(Thread::start);
            for (Thread task : tasks) {
                task.join();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Thread was interrupted: " + e.getMessage());
        }

        System.out.println("最终的票数：" + TOTAL_TICKET + "耗时：" + (System.currentTimeMillis() - startTime) + "ms");
    }
}
```

输出：

```console
最终的票数：0耗时：120ms
```

这种使用同步锁的方式，必然会涉及竞态条件，效率低也就不可避免了。

### 原子类版本

```java
package com.tjian.juc.lock;

import java.util.ArrayList;
import java.util.List;

public class VolatileDemo {
    private static final AtomicLong TOTAL_TICKET = new AtomicLong(1000000L);

    public static void main(String[] args) throws IOException, InterruptedException {
        Runnable consumer = () -> {
            for (int i = 0; i < 10000; i++) {
                TOTAL_TICKET.getAndDecrement();
            }
        };

        List<Thread> tasks = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            tasks.add(new Thread(consumer));
        }

        long startTime = System.currentTimeMillis();
        try {
            tasks.forEach(Thread::start);
            for (Thread task : tasks) {
                task.join();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Thread was interrupted: " + e.getMessage());
        }

        System.out.println("最终的票数：" + TOTAL_TICKET.get() + "耗时：" + (System.currentTimeMillis() - startTime) + "ms");
    }
}
```

输出：

```concole
最终的票数：0耗时：23ms
```

在这个场景下，原子类的方式比同步锁的方式性能提高了 `83.3%`，这是因为原子类的内部基于 `CAS`，性能要比同步锁好。

### 显式锁版本

```java
package com.tjian.juc.lock;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class VolatileDemo {
    private static Long TOTAL_TICKET = 1000000L;

    public static void main(String[] args) {
        Lock lock = new ReentrantLock();

        Runnable consumer = () -> {
            for (int i = 0; i < 10000; i++) {
                try {
                    lock.lock();
                    TOTAL_TICKET --;
                } finally {
                    lock.unlock();
                }
            }
        };

        List<Thread> tasks = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            tasks.add(new Thread(consumer));
        }

        long startTime = System.currentTimeMillis();
        try {
            tasks.forEach(Thread::start);
            for (Thread task : tasks) {
                task.join();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Thread was interrupted: " + e.getMessage());
        }

        System.out.println("最终的票数：" + TOTAL_TICKET + "耗时：" + (System.currentTimeMillis() - startTime) + "ms");
    }
}
```

公平锁模式下，显式锁的最终输出：

```console
最终的票数：0耗时：73ms
```

将 `Lock lock = new ReentrantLock();` 改为 `Lock lock = new ReentrantLock(false);`，采用非公平锁，输出为：

```console
最终的票数：0耗时：68ms
```

即在这个用例下，公平锁和非公平锁差别并不大。

### 信号量 `Semaphore`

信号量用于在保持给定最大请求数范围内的并行，`acquire()`方法是一个阻塞操作。

```java
package com.tjian.juc.lock;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Semaphore;

public class VolatileDemo {
    private static Long TOTAL_TICKET = 1000000L;

    public static void main(String[] args) {
        Semaphore flag = new Semaphore(1);

        Runnable consumer = () -> {
            for (int i = 0; i < 10000; i++) {
                try {
                    flag.acquire();
                    TOTAL_TICKET --;
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } finally {
                    flag.release();
                }
            }
        };

        List<Thread> tasks = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            tasks.add(new Thread(consumer));
        }

        long startTime = System.currentTimeMillis();
        try {
            tasks.forEach(Thread::start);
            for (Thread task : tasks) {
                task.join();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Thread was interrupted: " + e.getMessage());
        }

        System.out.println("最终的票数：" + TOTAL_TICKET + "耗时：" + (System.currentTimeMillis() - startTime) + "ms");
    }
}
```

输出为：

```console
最终的票数：0耗时：68ms
```

这里如果把信号量改为任何大于 1 的允许值，结果就大概率不正确了。

### 小结

单票多卖的场景，最主要的就是保证总票数可控售卖，不能出现超卖和重卖。

上面 4 种实现方式都可以保证不重卖、超卖 —— 实际上通过严格的控制每个窗口最多售卖 1 万张票就实现了避免超卖，而加锁只是保证售卖的顺序性和重卖。

## 多票多卖

在这个场景下，我们假设：

* 有 `ticketA`、`ticketB` 和 `ticketC` 三种票，分别 1 万张、5000 张和 5000 张
* 有 10 个窗口同时售卖，每个窗口都可以卖 3 种票
* 需要保证每种票按照次序售卖
* 有 2 万个购票请求，最终购完所有的票

### 同步锁版本

一个简单的实现是这样的：

```java
package com.tjian.ticket;

public class TicketDemoSync {

    // 定义三种票的总数
    private static int ticket1 = 10000;
    private static int ticket2 = 5000;
    private static int ticket3 = 5000;
    // 总请求次数
    private static int totalRequests = 20000;
    // 锁对象
    private static final Object lock1 = new Object();
    private static final Object lock2 = new Object();
    private static final Object lock3 = new Object();

    public static void main(String[] args) {
        // 创建10个售票窗口线程
        Thread[] windows = new Thread[10];
        for (int i = 0; i < windows.length; i++) {
            windows[i] = new Thread(TicketDemoSync::sellTickets);
            windows[i].start();
        }

        // 等待所有窗口完成售票
        for (Thread window : windows) {
            try {
                window.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        System.out.println("所有票已售完，总请求次数: " + (20000 - totalRequests));
        System.out.println("ticket:1 " + ticket1 + ", 2 " + ticket2 + ", 3 " + ticket3);
    }

    private static void sellTickets() {
        // 如果请求次数用完，退出循环
        while (totalRequests > 0) {
            System.out.println("进入循环");
            int choice = (int) (Math.random() * 3) + 1;
            switch (choice) {
                case 1:
                    synchronized (lock1) {
                        if (ticket1 > 0 && totalRequests > 0) {
                            ticket1--;
                            totalRequests--;
                            System.out.println("售出一张票1，剩余: " + ticket1);
                        }
                    }
                    break;
                case 2:
                    synchronized (lock2) {
                        if (ticket2 > 0 && totalRequests > 0) {
                            ticket2--;
                            totalRequests--;
                            System.out.println("售出一张票2，剩余: " + ticket2);
                        }
                    }
                    break;
                case 3:
                    synchronized (lock3) {
                        if (ticket3 > 0 && totalRequests > 0) {
                            ticket3--;
                            totalRequests--;
                            System.out.println("售出一张票3，剩余: " + ticket3);
                        }
                    }
                    break;
            }

            try {
                Thread.sleep(20L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

**但是**，这段代码是有问题的，`totalRequests` 变量可以同时被多个线程非原子性的操作，可能导致所有票都售完了，购票请求却没有用完。

如果还是采用同步锁的方式，就需要为 `totalRequests` 配置一个锁了。

```java
package com.tjian.ticket;

public class TicketDemoSync {

    // 定义三种票的总数
    private static int ticket1 = 10000;
    private static int ticket2 = 5000;
    private static int ticket3 = 5000;
    // 总请求次数
    private static int totalRequests = 20000;
    // 锁对象
    private static final Object lock1 = new Object();
    private static final Object lock2 = new Object();
    private static final Object lock3 = new Object();

    private static final Object lock = new Object();

    public static void main(String[] args) {
        // 创建10个售票窗口线程
        Thread[] windows = new Thread[10];
        for (int i = 0; i < windows.length; i++) {
            windows[i] = new Thread(TicketDemoSync::sellTickets);
            windows[i].start();
        }

        // 等待所有窗口完成售票
        for (Thread window : windows) {
            try {
                window.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        System.out.println("所有票已售完，总请求次数: " + (20000 - totalRequests));
        System.out.println("ticket:1 " + ticket1 + ", 2 " + ticket2 + ", 3 " + ticket3);
    }

    private static void sellTickets() {
        // 如果请求次数用完，退出循环
        while (totalRequests > 0) {
            // System.out.println("进入循环");
            int choice = (int) (Math.random() * 3) + 1;
            switch (choice) {
                case 1:
                    synchronized (lock1) {
                        if (ticket1 > 0) {
                            synchronized (lock) {
                                if (totalRequests > 0) {
                                    ticket1--;
                                    totalRequests--;
                                }
                            }
                        }
                    }
                    break;
                case 2:
                    synchronized (lock2) {
                        if (ticket2 > 0) {
                            synchronized (lock) {
                                if (totalRequests > 0) {
                                    ticket2--;
                                    totalRequests--;
                                }
                            }
                        }
                    }
                    break;
                case 3:
                    synchronized (lock3) {
                        if (ticket3 > 0) {
                            synchronized (lock) {
                                if (totalRequests > 0) {
                                    ticket3--;
                                    totalRequests--;
                                }
                            }
                        }
                    }
                    break;
            }
        }
    }
}
```

### 原子类版本

如果采用原子类版本，代码逻辑就简单多了。不过一样也是有坑的。

先看有问题的实现：

```java
package com.tjian.ticket;

import java.util.concurrent.atomic.AtomicInteger;

public class TicketDemoSync {

    // 定义三种票的总数
    private static final AtomicInteger ticket1 = new AtomicInteger(10000);
    private static final AtomicInteger ticket2 = new AtomicInteger(5000);
    private static final AtomicInteger ticket3 = new AtomicInteger(5000);
    // 总请求次数
    private static final AtomicInteger totalRequests = new AtomicInteger(20000);

    public static void main(String[] args) {
        // 创建10个售票窗口线程
        Thread[] windows = new Thread[10];
        for (int i = 0; i < windows.length; i++) {
            windows[i] = new Thread(TicketDemoSync::sellTickets);
            windows[i].start();
        }

        // 等待所有窗口完成售票
        for (Thread window : windows) {
            try {
                window.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        System.out.println("所有票已售完，总请求次数: " + (20000 - totalRequests.get()));
        System.out.println("ticket:1 " + ticket1.get() + ", 2 " + ticket2.get() + ", 3 " + ticket3.get());
    }

    private static void sellTickets() {
        // 如果请求次数用完，退出循环
        while (totalRequests.get() > 0) {
            // System.out.println("进入循环");
            int choice = (int) (Math.random() * 3) + 1;
            switch (choice) {
                case 1:
                    sellTicket(ticket1, totalRequests);
                    break;
                case 2:
                    sellTicket(ticket2, totalRequests);
                    break;
                case 3:
                    sellTicket(ticket3, totalRequests);
                    break;
            }
        }
    }

    private static void sellTicket(AtomicInteger ticket, AtomicInteger request) {
        if (ticket.get() > 0 && request.get() > 0) {
            if (ticket.decrementAndGet() >= 0 && request.decrementAndGet() >= 0) {
                // DO NOTHING
            } else {
                // 回退
                ticket.getAndIncrement();
                request.getAndIncrement();
            }
        }
    }
}
```

这里，`ticket1`、`ticket1`、`ticket1` 和 `totalRequests` 是原子类，但 `get()` 和 `decrementAndGet()` 两个方法之间还是存在非原子性。

假定同一个时刻，有两个线程在对 `ticket1` 操作，此时 `ticket1` 值为 0，`totalRequests` 值为 3，执行 `ticket.decrementAndGet() >= 0 && request.decrementAndGet() >= 0` 这段代码时，前半部分就会失败，但回滚操作却对两部分都进行了回滚。

正确的做法是这样的：

```java
package com.tjian.ticket;

import java.util.concurrent.atomic.AtomicInteger;

public class TicketDemoSync {

    // 定义三种票的总数
    private static final AtomicInteger ticket1 = new AtomicInteger(10000);
    private static final AtomicInteger ticket2 = new AtomicInteger(5000);
    private static final AtomicInteger ticket3 = new AtomicInteger(5000);
    // 总请求次数
    private static final AtomicInteger totalRequests = new AtomicInteger(20000);

    public static void main(String[] args) {
        // 创建10个售票窗口线程
        Thread[] windows = new Thread[10];
        for (int i = 0; i < windows.length; i++) {
            windows[i] = new Thread(TicketDemoSync::sellTickets);
            windows[i].start();
        }

        // 等待所有窗口完成售票
        for (Thread window : windows) {
            try {
                window.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        System.out.println("所有票已售完，总请求次数: " + (20000 - totalRequests.get()));
        System.out.println("ticket:1 " + ticket1.get() + ", 2 " + ticket2.get() + ", 3 " + ticket3.get());
    }

    private static void sellTickets() {
        // 如果请求次数用完，退出循环
        while (totalRequests.get() > 0) {
            // System.out.println("进入循环");
            int choice = (int) (Math.random() * 3) + 1;
            switch (choice) {
                case 1:
                    sellTicket("A", ticket1, totalRequests);
                    break;
                case 2:
                    sellTicket("B", ticket2, totalRequests);
                    break;
                case 3:
                    sellTicket("C", ticket3, totalRequests);
                    break;
            }
        }
    }

    private static void sellTicket(String label, AtomicInteger ticket, AtomicInteger request) {
        if (ticket.get() > 0 && request.get() > 0) {
            if (ticket.decrementAndGet() >= 0) {
                if (request.decrementAndGet() < 0) {
                    ticket.getAndIncrement();
                    request.getAndIncrement();
                }
            } else {
                ticket.getAndIncrement();
            }
        } else {
            System.out.println(label + ": " + ticket.get() + " ----:---- " + request.get());
        }
    }
}
```

### 显式锁版本

```java
package com.tjian.ticket;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class TicketDemoSync {

    // 定义三种票的总数
    private static final AtomicInteger ticket1 = new AtomicInteger(10000);
    private static final AtomicInteger ticket2 = new AtomicInteger(5000);
    private static final AtomicInteger ticket3 = new AtomicInteger(5000);
    // 总请求次数
    private static final AtomicInteger totalRequests = new AtomicInteger(20000);

    private static final Lock lock1 = new ReentrantLock();
    private static final Lock lock2 = new ReentrantLock();
    private static final Lock lock3 = new ReentrantLock();

    public static void main(String[] args) {
        // 创建10个售票窗口线程
        Thread[] windows = new Thread[10];
        for (int i = 0; i < windows.length; i++) {
            windows[i] = new Thread(TicketDemoSync::sellTickets);
            windows[i].start();
        }

        // 等待所有窗口完成售票
        for (Thread window : windows) {
            try {
                window.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        System.out.println("所有票已售完，总请求次数: " + (20000 - totalRequests.get()));
        System.out.println("ticket:1 " + ticket1.get() + ", 2 " + ticket2.get() + ", 3 " + ticket3.get());
    }

    private static void sellTickets() {
        // 如果请求次数用完，退出循环
        while (totalRequests.get() > 0) {
            // System.out.println("进入循环");
            int choice = (int) (Math.random() * 3) + 1;
            switch (choice) {
                case 1:
                    sellTicket(ticket1, totalRequests, lock1);
                    break;
                case 2:
                    sellTicket(ticket2, totalRequests, lock2);
                    break;
                case 3:
                    sellTicket(ticket3, totalRequests, lock3);
                    break;
            }
        }
    }

    private static void sellTicket(AtomicInteger ticket, AtomicInteger request, Lock lock) {
        lock.lock();
        try {
            if (ticket.get() > 0) {
                if (request.get() > 0) {
                    request.getAndDecrement();
                    ticket.getAndDecrement();
                }
            }
        } finally {
            lock.unlock();
        }
    }
}
```

使用显式锁，为每种票分配一个锁，减小锁的粒度，可以实现不同票的并行售卖。

### 信号量版本

信号量版本和显式锁类似，需要为每一种票定义一下 `permits` 为 1 的信号量，以保证单一种类的票一次只有一个线程（窗口）售卖。

### 小结

多票多卖的场景对于单票多卖，增加了可能得回退流程。

## 预留余量

接下来在多票多卖场景的基础上，我们增加一个需求：

- 要求 `ticket1` 保留 200 张票，`ticket2` 和 `ticket3` 分别保留 50 张票，其余用于售卖。



## 定时放票

新增一个需求：

- 增加两个票 `ticket4` 和 `ticket5`，在指定时间到达后才允许售票。

