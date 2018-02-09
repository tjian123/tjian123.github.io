---
layout: post
title: ubuntu下搭建本地邮件服务器
categories: [Coding]
tags: [Mail]
---

> 我们平时使用邮件服务特别简单，但Internet上的邮件系统是几个复杂的部分连接而成的，对于最终用户而言，我们熟悉的outlook，foxmail等都是用来收发信的，称之为MUA(Mail User Agent)。MUA并不能直接将邮件传递至收件人手中，而是通过MTA(Mail Transfer Agent)，SendMail和Postfix就是扮演MTA的角色。

> 一封邮件从MUA发出以后，可能通过一个或多个MTA传递，最终才能到达MDA(Mail Delivery Agent)。邮件到达MDA后，就存放在某个文件或者数据库里，我们将这个长期保存邮件的地方称之为邮箱。之后邮件再被MUA取走。

> 所以一封邮件的的流程是：

	(发件人)MUA => MTA => ... => MTA => MDA <= MUA(收件人)

MUA到MTA、MTA到MDA，以及MTA之间使用的就是SMTP协议(Simple Mail Transfer Protocol)；而MUD到MDA则使用的是POP3(Post Office Protocol - version 3)或者IMAP协议(Internet Mail Access Protocol)。

需要注意的是，专业的邮件服务商都用大量的服务器来为用户服务，所以通常MDA和MTA不会是同一个服务器。

## postfix

	sudo apt install postfix

安装过程中选择`Internet Server`，需要配置服务器域名，可以选择使用主机名。
	telnet <server.com> 25

使用`telnet`测试域名服务器。

	EHLO <server.com>

给邮件服务器发消息，收到回复则成功。

*注：* `^]`用于终止telnet不识别的输入，`quit`用于退出。

PIPELINING 允许多个命令流式发出，而不必对每个命令作出响应。
SIZE 表示服务器可接收的最大消息大小。
VRFY 可以告诉客户端某一个特定的邮箱地址是否存在，这通常应该被取消，因为这是一个安全漏洞。
ETRN 适用于非持久互联网连接的服务器。这样的站点可以使用 ETRN 从上游服务器请求邮件投递，Postfix 可以配置成延迟投递邮件到 ETRN 客户端。
STARTTLS （详情见上述说明）。
ENHANCEDSTATUSCODES，服务器支撑增强型的状态码和错误码。
8BITMIME，支持 8 位 MIME，这意味着完整的 ASCII 字符集。最初，原始的 ASCII 是 7 位。
DSN，投递状态通知，用于通知你投递时的错误。

Postfix 的主配置文件是： /etc/postfix/main.cf，这个文件是安装程序创建的。

## dovecot

	sudo apt-get install dovecot-imapd dovecot-pop3d



参考链接：

<http://wiki.ubuntu.org.cn/Postfix_%E5%9F%BA%E6%9C%AC%E8%AE%BE%E7%BD%AE%E6%8C%87%E5%8D%97>
<http://wiki.ubuntu.org.cn/Postfix_%E5%AE%8C%E6%95%B4%E8%99%9A%E6%8B%9F%E9%82%AE%E4%BB%B6%E7%B3%BB%E7%BB%9F%E6%8C%87%E5%8D%97>这篇非常重要
<https://www.liaoxuefeng.com/article/00137387674890099a71c0400504765b89a5fac65728976000>