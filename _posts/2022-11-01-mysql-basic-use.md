---
layout: default
title: MySQL 基础知识
description: MySQL 核心知识梳理
categories: 
   - 数据存储
tags: 
   - MySQL
---

> 本文主要包括 MySQL 数据库的创建、数据表的创建、数据类型和运算符、MySQL 函数、查询数据、数据表的操作（CURD）、索引、存储过程和函数、视图、触发器、用户管理、数据备份和还原、MySQL 日志，以及 MySQL 性能优化等。

<!-- more -->
* TOC
{:toc}

## 第一章 数据库基本概念及 MySQL 简介

### 1.1 数据库基本概念

* **数据库**，是一个长期存储在计算机系统内的、有组织的、有共享的、统一管理的数据集合。包含保存数据的仓库，以及数据管理的方法和技术。
* **数据表**，是一系列二维数组的集合，用来存储和操作数据的逻辑结构。它由纵向的列和横向的行组成，行称为记录，列称为字段。
* **数据类型**，决定了数据在计算机中存储格式，代表不同的信息类型。
* **主键**，用于唯一标识数据表中的每一条记录

### 1.2 数据库技术

#### 1.2.1 数据库系统

主要是指数据管理软件。

#### 1.2.2 SQL 语言

SQL 语言主要包括一下 4 部分：

* **DDL，数据定义语言**，包括 CREATE、DROP、ALTER 等语句。
* **DML，数据管理语言**，包括 INSERT、UPDATE、DELETE 等语句。
* **DQL，数据查询语言**，包括 SELECT 语句。
* **DCL，数据控制语言**，包括 GRANT、REVOKE、COMMIT、ROLLBACK 等语句。

#### 1.2.3 数据库访问接口

主要的数据库访问接口有以下四种：

1. **ODBC**，开放数据库连接技术。
2. **JDBC**，Java 数据库连接技术，是用于 Java 应用程序连接数据库的标准方法。
3. **ADO.net**，是微软在 .net 框架下开发设计的一组用于和数据源进行交互的面向对象类库。
4. **PDO**，是为PHP访问 数据库定义的轻量级的、一致性的接口。

### 1.3 MySQL 简介

MySQL 是一款小型开源免费的数据库管理软件，基于主从式架构设计。

MySQL 服务端工具：

* mysqld：后台服务器进程
* mysqld_safe：服务器启动脚本，增加了一些安全特性
* mysql.server：服务器启动脚本，用于使用包含特定级别的、运行启动服务的脚本，调用 mysqld_safe
* mysql_multi：服务器启动脚本，可以启动或停止系统上多个服务器
* myisamchk：用来描述、检查、优化和维护 MyISAM 表
* mysqlbug：缺陷报告脚本
* mysql_install_db：使用默认权限创建授权表

MySQL 客户端工具：

* mysql：交互式输入 SQL 语句或从文件以批处理模式执行 SQL 的命令行工具
* mysqlaccess：检查访问主机名、用户名和数据库组合的权限的脚本
* mysqladmin：执行管理操作的工具
* mysqlbinlog：从二进制日志读取语句的工具
* mysqlcheck：检查、修复、分析以及优化表的表维护工具
* mysqldump：将 MySQL 数据库转储到一个文件的工具
* mysqlhotcopy：在服务器运行时，快速备份 MyISAM或ISAM表的工具
* mysqlimport：使用 LOAD DATA INFILE 将文本文件导入相关表的客户端程序
* mysqlshow：显示数据库、表、列以及索引相关信息的工具

## 第二章 MySQL 安装配置

## 第三章 MySQL 数据库基本操作

## 第四章 MySQL 数据表基本操作

## 第五章 MySQL 中的数据类型和运算符

### 整数类型

|类型|说明|
|----|-----|
|tinyint|1 个字节|
|smallint|2 个字节|
|mediumint|3 个字节|
|int|4 个字节|
|bigint|8 个字节|

### 小数类型

|类型|说明|
|----|-----|
|float|单精度浮点型，4 个字节|
|double|双精度浮点型，8 个字节|
|decimal|定点型，如 decimal(m,n) m表示位数，n表示小数位数|

### 日期时间类型

|类型|格式|说明|
|----|----|----|
|year|YYYY|1 个字节|
|time|HH:MM:SS|3 个字节|
|date|YYYY-MM-DD|3 个字节|
|datetime|YYYY-MM-DD HH:MM:SS|8 个字节|
|timestamp|YYYY-MM-DD HH:MM:SS|4 个字节|

### 文本字符串类型

|类型|格式|说明|
|----|----|----|
|char|char(m)|固定长度非二进制字符串，m 个字节，1 <= m <= 255|
|varchar|varchar(m)|非定长非二进制字符串，l + 1 个字节，l <= m，1 <= m <= 255|
|tinytext|--|非常小的非二进制字符串，l + 1 个字节，l < 2^8|
|text|--|小的非二进制字符串，l + 2 个字节, l < 2^16|
|mediumtext|--|中等大小的非二进制字符串，l + 3 个字节，l < 2^24|
|longtext|--|大的非二进制字符串，l + 4 个字节，l < 2^32|
|enum|--|枚举类型，1到2个字节|
|set|--|值集|

**注**，上述类型中：

* varchar 实际是 tinytext、text、mediumtext、longtext 的统称，m 在[1, 255]时等价于 tinytext，在[256, 2^16 - 1]时等价于 text
* 表示实际占用字节的 l + k 中，k 实际表示存储长度需要的字节数
* varchar(m)，限定了最多只能存储 m 个字符，实际存储 [0,m] 个字符
* enum 和 set 都需要在定义时声明值范围，enum 只能取一个值，set 可以放一个或多个不重复的值

### 二进制字符串类型

|类型|说明|
|----|----|
|bit(m)|位字段类型，大约 (m+7)/8 个字节|
|binary(m)|固定长度二进制字符串，m 个字节|
|varbinary(m)|可变长度二进制字符串，m + 1 个字节|
|tinyblob(m)|非常小的blob，l + 1 个字节，l < 2^8|
|blob(m)|小blob，l + 2 个字节，l < 2^16|
|mediunblob(m)|中等大小的 blo, l + 3 个字节，l < 2^24|
|longblob(m)|非常大的 blob，l + 4 个字节，l < 2^32|

## 第六章 MySQL 函数

### 6.1 数学函数

|名称|说明|
|----|----|
|abs(x)|求绝对值|
|sqrt(x)|求平方根|
|mod(x)|取模|
|ceil(x)|返回不小于 x 的最小整数值|
|ceiling(x)|同 ceil(x)|
|floor(x)|返回不大于 x 的最大整数值|
|rand()|返回 [0,1] 之间的随机数|
|rand(x)|以 x 为种子返回 [0,1]之间的随机数，x 相同时返回值相同|
|round(x)|返回最接近 x 的整数，对 x 值四舍五入|
|round(x,y)|返回最接近 x 的数，其值小数部分保留 y 位，如果 y 为负数则保留到小数点左边 y 位|
|truncate(x,y)| 返回被舍去至小数点后 y 位的数字 x，如果 y 为负数则保留到小数点左边 y 位|
|pow(x,y)|返回 x 的 y 次方|
|power(x,y)|同 pow|
|exp(x)|返回常数 e 的 x 次方|
|log(x)|返回 x 的自然对数，即以 e 为底的 x 的对数|
|log10(x)|返回以 10 为底的 x 的对数|
|radians(x)|将参数 x 由角度转化为弧度|
|degrees(x)|将参数 x 由弧度转化为角度|
|sin(x)|正弦|
|cos(x)|余弦|
|asin(x)|反正弦函数|
|acos(x)|反余弦函数|
|tan(x)|正切函数|
|atan(x)|反正切函数|
|cot(x)|余切函数|

**注**，y 为负数时，round(x,y) 和 truncate(x,y) 效果相同，y 为正数时，round 会进行四舍五入而 truncate 不会。

### 6.2 字符串函数

|名称|说明|
|----|----|
|char_length(str)|返回 str 中字符个数|
|length(str)|返回 str 的长度|
|concat(s1,s2,...)|拼接字符串, s1、s2等任有一个为 NULL 则返回 NULL|
|concat(x,s1,s2,...)|以 x 做分隔符拼接字符串, 忽略 NULL 值|
|insert(s1, x, len, s2)|将 s1 字符串自 x 位置开始的 len 个字符替换为 s2|
|lower(str)|将 str 转为小写|
|lcase(str)|同 lower(str)|
|upper(str)|将 str 转为大写|
|ucase(str)|同 upper(str)|
|left(str, n)|返回 str 左边的 5 个字符|
|right(str, n)|返回 str 右边的 5 个字符|
|lpad(s1,len,s2)|如果 s1 长度小于 len，就使用 s2 填充左边以达到 len|
|rpad(s1,len,s2)|如果 s1 长度小于 len，就使用 s2 填充右边以达到 len|
|ltrim(str)|删除 str 左侧的空格|
|rtrim(str)|删除 str 右侧的空格|
|trim(str)|删除 str 两侧的空格|
|trim(s1 from s)|删除 s 两侧的字符串 s1|
|repeat(str, n)|将 str 重复 n 次的字符串|
|space(n)|返回由 n 个空格组成的字符串|
|replace(s, s1, s2)|将字符串 s 中 s1 替换为 s2|
|strcmp(s1, s2)|比较两个字符串 s1 和 s2|
|substring(s,n,len)|返回 s 从 n 位置开始长度为 len 的字符|
|mid(s,n,len)|同 substring(s,n,len)|
|locate(str1, str)|返回 str1 在 str 的开始位置|
|position(str1 in str)|同 locate|
|instr(str, str1)|同 locate(str1, str)|
|reverse(str)|返回str 的逆序|
|elt(n, s1, s2,...)|返回 s1、s2等中的第 n 个|
|filed(s, s1, s2, ...)|返回 s 在 s1、sw等中第一次出现的位置|
|find_in_set(s1,s2)|返回字符串 s1 在字符串列表 s2 中出现的位置，字符串列表是由 ',' 拼接的字符串|
|make_set(x,s1,s2,...)|按x的二进制位在 s1、s2等中选取字符串|

```sql
select char_length("abc"), char_length("中国"), length("abc"), length("中国");
+--------------------+-----------------------+---------------+------------------+
| char_length("abc") | char_length("中国")   | length("abc") | length("中国")   |
+--------------------+-----------------------+---------------+------------------+
|                  3 |                     2 |             3 |                6 |
+--------------------+-----------------------+---------------+------------------+

select insert("1234567890", 3, 1, "WWWWW");
+-------------------------------------+
| insert("1234567890", 3, 1, "WWWWW") |
+-------------------------------------+
| 12WWWWW4567890                      |
+-------------------------------------+
```

### 6.3 时间和日期函数

|名称|说明|
|----|----|
|curdate()|将当前日期按照 "YYYY-MM-DD" 格式返回|
|current_date()| 同 curdate() |
|curtime()|将当前时间以 "HH:MM:SS" 格式返回|
|current_time()|同 curtime() |
|current_timestamp()|将当期日期时间以 "YYYY-MM-DD HH:MM:SS" 返回|
|localtime()|同 current_timestamp()|
|now()|同 current_timestamp()|
|sysdate()|同 current_timestamp()|
|unix_timestamp()|unix 时间戳，返回 "1970-01-01 00:00:00 GMT" 至当前时间的秒数|
|unix_timestamp(date)|unix 时间戳，返回 "1970-01-01 00:00:00 GMT" 至 date 的秒数|
|from_unixtime(date)|把 unix 时间戳转为 "YYYY-MM-DD HH:MM:SS" 格式的时间|
|utc_date()|返回 UTC 格式的日期|
|utc_time()|返回 UTC 格式的时间|
|month(date)|返回date对应的月份|
|monthname(date)|返回date对应月份的英文|
|dayname(date)|返回date对应的工作日的英文名称|
|dayofweek(date)|返回对应一周中的第几天，1表示周日|
|weekday(date)|返回工作日索引，0表示周一|
|week(date,m)|返回当前是一年的第几周, m 默认为0，表示以周日为一周的第一天|
|weekofyear(date)|返回当前是一年的第几周|
|dayofyear(date)|返回当前是一年的第几天|
|dayofmonth(date)|返回当前是当月的第几天|
|year(date)|返回年份|
|quarter(date)|返回当前是一年的第几季度|
|minute(time)|返回对应的分钟|
|second(time)|返回对应的秒数|
|extract(tyoe from date)|从 date 中提取年、月、日等|
|time_to_sec(time)|返回转化为秒数的时间|
|sec_to_time|将秒数以时分秒形式返回|
|date_add(date,interval expr type)|将给定时间加上间隔时间|
|adddate(date,interval expr type)|同 date_add|
|date_sub(date,interval expr type)|将给定时间减去间隔时间|
|subdate(date,interval expr type)|同 date_sub|
|addtime(date,interval expr type)|加上指定时间|
|subtime(date,interval expr type)|减去指定时间|
|date_diff(date1,date2)|计算两个日期之间的间隔天数|
|date_format(date,format)|将日期时间格式化|
|time_format(time,format)|将时间格式化|
|get_format(val_type, format_type)|返回容器时间字符串的显式格式|

### 6.4 条件判断函数

|名称|说明|
|----|----|
|if(expr,v1,v2)| expr 为 true 返回 v1，否则返回 v2|
|ifnull(v1, v2)| v1 为 null 返回 v2，否则返回 v1|
|case expr when v1 then r1 [when v2 then r2]... [else re] end| 如果 expr 与 v1 匹配则返回 r1，如果都不匹配且存在 else 则返回 re|

### 6.5 系统信息函数

|名称|说明|
|----|----|
|version()|查看版本|
|connection_id()|查看当前连接的次数|
|databse()|返回当前正在使用的数据库名|
|user()|返回当前的用户名|
|charset(str)|返回 str 所使用的字符集|
|last_insert_id()|返回最后一个自动的ID值|

### 6.6 加密函数

|名称|说明|
|----|----|
|md5(str)|使用 md5 算法加密字符串 str，返回32位十六进制数字的二进制字符串形式|
|sha(str)|以 sha 算法加密字符串 str，sha 比 md5 更安全|
|sha2(str,hash_length)| hash_length 可以取值 224、256、384、512、0，其中 0 和 224 等价|

### 6.7 其他函数

|名称|说明|
|----|----|
|format(x,n)|将x格式化，保留小数点后面 n 位|
|conv(n, from_base, to_base)|将数字从 from_base 进制转化到 to_base 进制|
|inet_aton(str)|将 ip 地址转为数字|
|inet_ntoa(n)|将数值转为 ip 地址|
|get_lock(str,timeout)|使用 str 为名称获取锁，超时时间为 timeout 秒|
|release_lock(str)|释放以 str 为名称的锁|
|is_free_lock(str)|检查以 str 为名称的锁是否可用|
|is_used_lock(str)|检查以 str 为名称的锁是否在用|
|convert(str using charset)|将 str 以 charset 指定的字符集转化|
|cast(x, as type)|类型转换|
|convert(x, type)|类型转换|

## 第七章 查询数据表中的数据

### 7.4 连接查询

> 内连接语法：`<table1> INNER JOIN <table2> ON <condition>`

内连接显示同时符合左右表条件的数据。

> 左外连接语法：`<table1> LEFT OUTER JOIN <table2> ON <condition>`

左外连接显示左表的完整数据以及右表符合条件的部分数据。

> 右连接语法：`<table1> RIGHT OUTER JOIN <table> on <condition>`

右外连接显示左表符合条件的数据以及右表符合条件的完整数据。

### 7.5 子查询

子查询是指一个查询语句嵌套在另一个查询语句中查询。

子查询的常用操作符有 ANY、ALL、IN、EXISTS。

子查询可以添加到 UPDATE、SELECT 和 DELETE 中，而且可以多层嵌套。

### 7.6 合并查询结果

利用 `UNION` 关键字，将多个 SELECT 语句的结果组合成单个结果集；合并时两个查询结果的列数和数据类型必须相同。

`UNION` 不使用关键字 `ALL` 执行的时候删除重复的记录，所有返回的行都是唯一的；使用关键字 `ALL` 则不删除重复行也不对结果进行自动排序。

### 7.7 通用表表达式

通用表表达式简称为 CTE(common table expression)。CTE 是命名的临时结果集，作用范围是当前语句。

## 第八章 插入、更新和删除数据表中的数据

### 8.1 插入数据

### 8.2 更新数据

### 8.3 删除数据

## 第九章 MySQL 索引

### 9.1 索引分类

### 9.2 创建索引

### 9.3 删除索引

## 第十章 MySQL 存储过程和存储函数

### 10.1 创建存储过程

使用 `CREATE PROCEDURE` 语句创建存储过程，语法格式为：

```sql
CREATE PROCEDURE name ([proc_parameter]) [characteristics ...] routine_body
```

其中 ,

* name 为存储过程的名字
* proc_parameter 为指定存储过程的参数列表，形式为 `[ IN | OUT | INOUT ] param_name type`
* characteristics 指定存储过程的特性，可取值为：
  * LANGUAGE SQL，表示 routine_body 部分是由 SQL 语句组成的
  * [NOT] DETERMINISTIC，用来指示存储过程对相同的输入是否结果确定
  * {CNTAINS SQL| NO SQL | READS SQL DATA | MODIFIES SQL DATA} 分别用来指明子程序1)只有不包含读写数据的SQL 2）不包含SQL 3)只包含读数据的SQL 4)包含会更改数据的 SQL，默认是情况1
  * SQL SECURITY{DEFINER | INVOKER}，指明谁有权限执行
  * COMMENT 'str'，注释信息
* routine_body 是 SQL 代码的内容，使用 BEGIN ... END 来标记

案例一：简单存储过程

```sql
CREATE PROCEDURE listFruits()
BEGIN
    SELECT * FROM fruits;
END;
```

案例二：带输出参数的存储过程

```sql
CREATE PROCEDURE total(OUT num INT)
BEGIN
    SELECT COUNT(*) INTO num FROM fruits;
END;
```

### 10.2 创建存储函数

使用 `CREATE FUNCTION` 语句创建存储函数，基本语法格式是：

```sql
CREATE FUNCTION func_name ([func_parameter])
RETURNS type
[characteristic ...] routine_body
```

其中,

* func_name 表示存储函数的名称
* func_parameter 表示存储函数的参数列表，其形式为 `[ IN | OUT | INOUT ] param_name type`
* RETURN type 表示函数返回数据的类型
* characteristics 与存储过程类似

### 10.3 变量的使用

定义变量使用 `DECLARE` 语句，其语法格式为：

```sql
DECLARE var_name[,var_name_1]... type [DEFAULT value];
```

变量定义以后，使用 `SET` 为变量赋值，如 `SET var_name = expr`

### 10.4 定义条件和条件处理

使用 `DECLARE` 定义条件，其语法格式为：

```sql
DECLARE condition_name CONDITION FOR (condition_type)
```

其中，

* condition_name 表示条件的名称
* condition_type 表示条件的类型，有两种形式：
  * SQLSTATE [sqlstate_value]，使用长度为5的字符串形式
  * [mysql_error_code]，使用整数形式

定义处理程序也是使用 `DECLARE` 语句，其语法格式为：

```sql
DECLARE handler_type HANDLER FOR condition_value[,...] sp_statement
```

其中，

* handler_type 表示错误处理方式，有 3 个取值
  * CONTINUE，表示不处理，继续执行
  * EXIT，表示遇到错误马上退出
  * UNDO，表示遇到错误撤回之前的操作
* condition_vale 表示错误类型，可以有以下取值
  *

### 10.5 光标

### 10.6 流程控制

### 10.7 调用存储过程

### 10.8 查看存储过程和存储函数

### 10.9 修改存储过程和存储函数

### 10.10 删除存储过程和存储函数

## 第十一章 MySQL 视图

### 11.1 视图的含义

视图是一个虚拟表，是从数据库中一个或者多个表中导出来的表。

视图还可以从已经存在的视图的基础上定义。

对视图的操作与对表的操作一样，可以查询、修改和删除。对视图数据的修改会反应到原数据表，基础表中数据变化也会提现在视图上。

视图有以下作用：

* 视图可以简化用户对数据的理解
* 通过视图用户只能查询和修改他们所能见到的数据
* 视图可以帮助用户屏蔽真是表结构变化带来的影响

### 11.2 创建视图

使用 `CREATE VIEW` 语句创建视图，其基本语法格式为：

```sql
CREATE [OR REPLACE] [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
VIEW view_name [(column_list)]
AS SELECT_statement
[WITH [CASCADED | LOCAL] CHECK OPTION]
```

其中，

* `CREATE` 表示新创建视图，REPLACE 表示替换已有的视图
* `ALGORITHM` 表示视图选择的算法，有3个取值：
  1. `UNDEFINED` 表示 MySQL 将自动选择算法
  2. `MERGE` 表示将使用的视图与视图定义合并
  3. `TEMPTABLE` 表示将视图的结果存入临时表
* `view_name` 表示视图的名称
* `column_list` 为属性列
* `SELECT_statement` 表示 SELECT 语句
* `WITH [CASCADED | LOCAL] CHECK OPTION` 表示视图在更新的时候保证在视图的权限范围内

## 第十二章 MySQL 触发器

## 第十三章 MySQL 用户管理

## 第十四章 MySQL 数据库备份与恢复

### 14.1 数据备份

可以使用 `MYSQLDUMP` 命令备份数据库，其基本语法格式为：

```sql
MYSQLDUMP -u user -h host -p password db_name[tb_name, [tb_name ...]] > file_name.sql
```

其中,

* `user` 指用户名称
* `host` 指登录用户的主机名称
* `password` 为用户密码
* `db_name` 为待备份的数据库名称
* `tb_name` 为待备份的数据库表，不指定时备份所有的表

### 14.2 数据恢复

可以直接使用 `MYSQL` 命令导入已经备份的文本文件，其基本语法格式为：

```sql
MYSQL -u user -p [db_name] < file_name.sql
```

**注**：如果是 `MYSQLDUMP` 导出的 sql 文本文件，不需要指定数据库名，因为导出的文件中会自动携带了数据库名称。

如果已经登录进入 MYSQL，还可以使用 `SOURCE filename` 语句来导入备份文件。

### 14.3 数据库迁移

略。

### 14.4 表的导入导出

略。

## 第十五章 MySQL 日志

MySQL 日志记录了 MySQL 数据库日常操作和错误信息。

### 15.1 日志简介

MySQL 日志主要分为 4 类:

1. **错误日志**，记录 MySQL服务的启动、运行和停止时出现的问题
2. **查询日志**，记录建立的客户端连接和执行的语句
3. **二进制日志**，记录所有更改数据的语句，可以用于数据复制
4. **慢查询日志**，记录执行时间超过 long_query_time 的所有查询或不使用索引的查询

通过刷新日志，可以强制 MySQL 关闭和重新打开日志文件。

刷新日志有以下 3 种方式：

1. 执行 `flush logs`
2. 使用 `mysqladmin flush-logs`
3. 使用 `mysqladmin refresh`

日志系统会占用系统资源，降低数据库的性能，操作频繁时也会占用大量磁盘空间。

### 15.2 二进制日志

二进制日志，是在 my.ini 配置文件中通过 `log_bin` 相关字段开启。

可以通过 `SHOW VARIABLES` 语句查询日志相关设置。

```shell
mysql> show variables like 'log_%';
+----------------------------------------+----------------------------------------+
| Variable_name                          | Value                                  |
+----------------------------------------+----------------------------------------+
| log_bin                                | ON                                     |
| log_bin_basename                       | /var/lib/mysql/binlog                  |
| log_bin_index                          | /var/lib/mysql/binlog.index            |
| log_bin_trust_function_creators        | OFF                                    |
| log_bin_use_v1_row_events              | OFF                                    |
| log_error                              | stderr                                 |
| log_error_services                     | log_filter_internal; log_sink_internal |
| log_error_suppression_list             |                                        |
| log_error_verbosity                    | 2                                      |
| log_output                             | FILE                                   |
| log_queries_not_using_indexes          | OFF                                    |
| log_raw                                | OFF                                    |
| log_replica_updates                    | ON                                     |
| log_slave_updates                      | ON                                     |
| log_slow_admin_statements              | OFF                                    |
| log_slow_extra                         | OFF                                    |
| log_slow_replica_statements            | OFF                                    |
| log_slow_slave_statements              | OFF                                    |
| log_statements_unsafe_for_binlog       | ON                                     |
| log_throttle_queries_not_using_indexes | 0                                      |
| log_timestamps                         | UTC                                    |
+----------------------------------------+----------------------------------------+
21 rows in set (0.00 sec)
```

## 第十六章 MySQL 性能优化

### 16.1 简介

MySQL 性能优化，一方面是找出系统的瓶颈，提高 MySQL 数据库整体的性能；另一方面需要合理的结构设计和参数调整，以提高用户操作响应的速度，同时还尽可能节省系统资源。

可以使用 `SHOW STATUS LIKE 'value'` 语句，查询一些常用的性能参数，如：

* `Connections` 连接 MySQL 服务器的次数
* `Uptime` MySQL 服务器的上线时间
* `Slow_queries` 慢查询的次数
* `Com_select` 查询操作的次数
* `Com_insert` 插入操作的次数
* `Com_update` 更新操作的次数
* `Com_delete` 删除操作的次数

### 16.2 优化查询

查询是数据库中最频繁的操作，提高查询速度可以有效提高数据库的性能。

可以使用 `EXPLAIN` 语句或 `DESCRIBE` 语句分析查询语句。

```sql
EXPLAIN [EXTENDED] SELECT select_options
```

**注**：`DESCRIBE` 用法等同于 `EXPLAIN`，可以简写为 `DESC`。

* 使用 `EXTENDED` 关键字，将产生附加信息
* `select_options` 是 SELECT 语句的查询选项

使用索引可以提高查询的速度，但并不是使用带有索引的字段查询时索引都能生效，有以下几种情况索引无法生效：

* 使用 LIKE 关键字查询语句，'%'放在第一个位置时
* 对于多个字段构成的索引，只有查询条件使用了这些字段的第一个字段时索引才能生效，否则不生效
* 使用 OR 关键字的查询语句，只有OR前后的两个条件中的列都是索引时索引才能生效，否则不生效

### 16.3 优化数据库结构

合理的数据库结构不仅可以使数据库占用更小的磁盘空间，而且能够使查询速度更快。

* 将字段很多的表分解成多个表：如果有些字段的使用频率很低，可以将这些字段分离出来形成新表
* 增加中间表，对于需要经常联合查询的表，可以建立中间表，以提高查询效率
* 增加冗余字段，按照数据库范式应该尽可能减少冗余字段，但少量冗余可以极高提高性能时是可以接受的
* 优化插入速度，包括：
  * 禁用索引，在插入数据前通过 `ALTER TABLE tb_name DISABLE KEYS;` 临时禁用索引，插入完成后再通过 `ALTER TABLE tb_name ENABLE KEYS;`开启
  * 禁用唯一性检查，在插入数据前通过 `SET UNIQUE_CHECKS=0;` 临时禁用唯一性检查，插入完成后再通过 `SET UNIQUE_CHECKS=1;`开启
  * 使用批量插入替代一条条插入
  * 使用 `LOAD DATA INFILE` 批量导入
  * 禁用外键检查，在插入数据前通过 `SET FOREIGN_KEY_CHECK=0;` 临时禁用外键检查，插入完成后再通过 `SET FOREIGN_KEY_CHECK=1;`开启
  * 禁用自动提交，在插入数据前通过 `SET AUTOCOMMIT=0;` 临时禁用自动提交，插入完成后再通过 `SET AUTOCOMMIT=1;`开启

### 16.4 优化 MySQL 服务器

服务器硬件优化，略。

优化 MySQL 的参数，

* `key_buffer_size` 表示索引缓冲区的大小
* `table_cache` 表示同时打开的表的个数，这个值越大，同时打开的表的数量越多
* `query_cache_size` 表示查询缓冲区的大小，该参数需要和 `query_cache_type` 配合使用。当 `query_cache_type` 值为 0 时，表示所有查询都不实用查询缓冲区；当 `query_cache_type` 值为 1 时，所有的查询都是用查询缓冲区；当 `query_cache_type` 值为 2 时，只有在查询语句中使用了 SQL_CACHE 关键字查询才会使用缓冲区
* `sort_buffer_size` 表示排序缓冲区的大小，这个值越大进行排序的速度越快
* `read_buffer_size` 表示每个线程连续扫描时为扫描的每个表分配的缓冲区的大小
* `innodb_buffer_pool_size` 表示 InnoDB 类型的表和索引的最大缓存
* `max_connections` 表示数据库的最大连接数
* `innodb_flush_log_at_trx_commit` 表示何时将缓冲区的数据写入日志文件，并且将日志文件写入磁盘中
* `back_log` 表示在 MySQL 暂时停止回应新请求之前的时间内，允许有多少个请求缓存
* `thread_cache_size` 表示可以复用的线程的数量
* `wait_timeout` 表示服务器在关闭一个连接时等待行动的秒数
