---
layout: post
title: Ubuntu 16.04中使用nginx反向代理gerrit服务器
categories: [Coding]
tags: [Gerrit, Nginx]
---

> 这里使用的测试机器，因为之前安装过其他软件，故已经具备了本文安装的一些基本前提，如jdk1.8、libtool等等。故本文只记录相关gerrit和nginx配置部分。

### 1. 安装nginx

	sudo apt install nginx

这里直接使用软件源中nginx。

基本的命令：

	sudo service nginx start   # 启动
	sudo service nginx stop    # 停止
	sudo service nginx restart # 重启

也可以使用systemctl工具，

	sudo systemctl start nginx.service   # 启动
	sudo systemctl stop nginx.service    # 停止
	sudo systemctl restart nginx.service # 重启
	sudo systemctl status nginx.service  # 查看当前状态

### 2. 安装apache-utils

	sudo apt install apache-utils

这里主要使用`htpasswd`工具，产生密码。

命令：

	htpasswd -c <file-path> <username>

这里新建一个`admin`用户，

	htpasswd -c /home/demo/Server/gerrit-server/gerrit.password admin

随后会要求输入密码并确认。

### 3. 安装gerrit

	cd ~/Downloads
	wget https://www.gerritcodereview.com/download/gerrit-2.14.2.war
	java -jar gerrit-2.14.2.war init --batch -d <path-to-install-gerrit>

一路回车，使用默认方式安装。

验证：

	netstat -lpn | grep -i gerrit

gerrit会监听两个端口。

gerrit命令：

	${path-to-install-gerrit}/bin/gerrit.sh start   # 启动
	${path-to-install-gerrit}/bin/gerrit.sh restart # 重启

### 4. 配置gerrit

修改配置文件`${path-to-install-gerrit}/etc/gerrit.config`，保存后重启gerrit。

主要是：
- 配置使用http方式认证，`auth.type`
- 配置gerrit访问地址，`gerrit.canonicalWebUrl`
- 更改监听地址，`httpd.listenUrl`

```
[gerrit]                                                                   
        basePath = git                                                     
        serverId = 6db05f8c-90ce-42c0-ab15-5763c2617f3d                    
        canonicalWebUrl = http://10.0.0.7:8089/                        
[database]                                                                 
        type = h2                                                          
        database = /home/demo/Application/gerrit-2.14.2/db/ReviewDB       
[index]                                                                    
        type = LUCENE                                                      
[auth]                                                                     
        type = HTTP                                                        
[receive]                                                                  
        enableSignedPush = false                                           
[sendemail]                                                                
        smtpServer = localhost                                             
[container]                                                                
        user = demo                                                       
        javaHome = /home/demo/Application/jdk1.8.0_102/jre                
[sshd]                                                                     
        listenAddress = *:29418                                            
[httpd]                                                                    
        listenUrl = http://*:8089/                                         
[cache]                                                                    
        directory = cache                                                  
```

> 修改保存后，要重启！！！

### 5. 配置nginx

添加配置文件`/etc/nginx/conf.d/gerrit.conf`，保存修改后重启nginx。

这里为`gerrit`配置了反向代理，并指定密码存放位置为`/home/demo/Server/gerrit-server/gerrit.password`。

```
server {
    listen *:8981;
    server_name 10.0.0.7;
    allow all;
    deny all;

    auth_basic "Welcome to OpenSDN Gerrit Code Review Site.";
    auth_basic_user_file /home/demo/Server/gerrit-server/gerrit.password;

    location / {
        proxy_pass http://127.0.0.1:8089;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $host;
    }
}
```

### 6. 添加项目