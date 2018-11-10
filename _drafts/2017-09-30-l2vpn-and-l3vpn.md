---
layout: post
title: L2VPN和L3VPN的基本理解
categories: [Coding]
tags: [Network]
---

## L2VPN

L2VPN，也称作PWE3(Pseudu Wire Emulation edge-to-edge，其中'3'指的是3个e)，即端到端伪线仿真。

其原理是在两个PE之间建立一条虚拟线路，透传二层数据包。

```
-------------------------------------------------------------
| L2 Header | LSP label | PW label | L2 Header | L2 Payload |
-------------------------------------------------------------
```

L2VPN 对于点到点、点到多点业务都比较容易维护；但对于多点对多点的业务，一旦节点数量变多，维护量为o(n^2)。



## L3VPN

L3VPN，透传的是三层数据包。

```
----------------------------------------------------------------
| L2 Header | LSP label | L3vpn label | L3 Header | L3 Payload |
----------------------------------------------------------------
```

距离矢量路由算法

BGP