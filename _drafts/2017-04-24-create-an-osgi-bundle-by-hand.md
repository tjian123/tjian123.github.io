---
layout: post
title: 手动创建一个 OSGi bundle
categories: [Coding]
tags: [Java, OSGi]
---

### 前言
本节介绍如何纯手动方式创建一个可运行于任意 OSGi 框架的`OSGi Bundle`。

*注：一个`OSGi Bundle`本质上就是一个在`Manifest`文件添加一些特定字段的jar包。*

### 概要

我们将创建一个监听了 OSGi 服务和 Bundle 事件的`OSGi Bundle`，该`Bundle`启动后会监听其启动后的 OSGi 服务变化和 `Bundle`事件，如安装、卸载等，并在变化或事件发生时打印出发生了服务名称或事件的`Bundle`名称。

监听服务变化，需要实现`ServiceListener`接口，我们定义`InternalServiceListener`；监听`Bundle`变化，需要实现`BundleListener`接口，我们定义`InternalBundleListener`。

### 目录结构

    --bundle-service
        --simple
            Activator.java
        Manifest.mf

### 代码内容

> Activator.java

```
package simple;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleEvent;
import org.osgi.framework.BundleListener;
import org.osgi.framework.ServiceEvent;
import org.osgi.framework.ServiceListener;

public class Activator implements BundleActivator {

    private ServiceListener serviceListener = null;
    private BundleListener bundleListener = null;

    public Activator() {
        serviceListener = new InternalServiceListener();
        bundleListener = new InternalBundleListener();
			        }

    public void start(BundleContext context) throws Exception {
        context.addServiceListener(serviceListener);
        context.addBundleListener(bundleListener);
        System.out.println("Starting bundle listener......");
    }

    public void stop(BundleContext context) throws Exception {
        context.removeServiceListener(serviceListener);
        context.removeBundleListener(bundleListener);
        System.out.println("Stopping bundle listener......");
    }

    public final class InternalServiceListener implements  ServiceListener {
        public void serviceChanged(ServiceEvent event) {
            String[] objectClass = (String[]) event.getServiceReference()
						.getProperty("objectClass");
            if (event.getType() == ServiceEvent.REGISTERED) {
                System.out.println("[Service Registered] : " + objectClass[0]);
            } else if (event.getType() == ServiceEvent.UNREGISTERING) {
                System.out.println("[Service Unregistered] : " + objectClass[0]);
            } else if (event.getType() == ServiceEvent.MODIFIED) {
                System.out.println("[Service Modified] : " + objectClass[0]);
            }
        }
    }

    public final class InternalBundleListener implements BundleListener {
        public void bundleChanged(BundleEvent event) {
            Bundle bundle = event.getBundle();
            String bundleName = bundle.getSymbolicName();
            if (event.getType() == BundleEvent.INSTALLED) {
                System.out.println("[Bundle installed] : " + bundleName);
            } else if (event.getType() == BundleEvent.RESOLVED) {
                System.out.println("[Bundle Resolved] : " + bundleName);
            } else if (event.getType() == BundleEvent.LAZY_ACTIVATION) {
                System.out.println("[Bundle lazy Activated] : " + bundleName);
            } else if (event.getType() == BundleEvent.STARTED) {
                System.out.println("[Bundle Started] : " + bundleName);
            } else if (event.getType() == BundleEvent.UNINSTALLED) {
                System.out.println("[Bundle Uninstalled] : " + bundleName);
            } else if (event.getType() == BundleEvent.UPDATED) {
                System.out.println("[Bundle Updated] : " + bundleName);
            } else if (event.getType() == BundleEvent.STOPPED) {
                System.out.println("[Bundle Stopped] : " + bundleName);
            }
        }
    }
}
```

> Manifest.mf

```
Manifest-Version: 1.0
Bundle-Activator: simple.Activator
Bundle-ManifestVersion: 2
Bundle-Name: common-bundle-listener
Bundle-SymbolicName: common-bundle-listener
Bundle-Version: 0.0.1
```

### 编译为 OSGi Bundle

> 参考一篇介绍 [javac 和 java 命令] [intro_of_java_and_javac] 的文章。

[intro_of_java_and_javac]: http://blog.csdn.net/huagong_adu/article/details/6929817

1. 将 java 源文件编译为 class 文件：

    `javac -d target *.java`

2. 将 class 文件和 Manifest.mf 文件打包为 jar 文件。

    `jar cfm simple-service.jar Manifest.mf -C target`