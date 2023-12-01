---
layout: default
title: 使用 Spring Data
description: Spring Data 简介及基本用法
categories: 
   - 技术积累
tags: 
   - Java
   - Spring
   - Spring Data
---

> Spring Data 简介及基本用法

<!-- more -->
* TOC
{:toc}

Spring Data 致力于为数据访问提供熟悉且一致的基于 Spring 的编程模板，其目的是统一和简化对不同类型持久化存储的访问。

* Spring Data common - 用于支持每个 Spring Data 子模块的公共模块
* Spring Data JDBC - 对 JDBC 的 Spring Data 存储库支持
* Spring Data JPA - 对 JPA 的 Spring Data 存储库支持
* Spring Data MongoDB - 基于 Spring 的对象文档支持和 MongoDB 存储库支持
* Spring Data Redis - 从 Spring 应用程序轻松配置和访问 Redis
* Spring Data REST - 将 Spring Data 存储库导出为 RESTful 资源

主要特点：

* 模板：jdbcTemplate
* 对象/数据存储映射
* Repository 支持

## Spring Data JPA

### 什么是 JPA

JPA，Java Persistence Api（2019年重新命名为 Jakarta Persistence Api），和 JDBC 一样是一种数据库操作规范。

相同点：

1. 都是 JAVA 操作数据库的规范
2. 都是 SUN 提出的

不同点：

1. JDBC 是给数据库厂商规定的规范，由数据库厂商实现；而 JPA 是给 ORM 框架规定的规范，由 ORM 框架实现
2. JDBC 直接使用 SQL 语句和数据库通信；JPA 采用面向对象的方式，通过 ORM 框架生成 SQL 语句与数据库交互
3. JPA 是基于 JDBC 的

JPA 隔离了用户与 SQL 语句，在 ORM 加持下能够屏蔽与不同数据库的交互差异，使用面向对象的方式与数据库打交道。

JPA 规范主要提供了：

1. ORM 元数据映射，元数据描述对象与表结构之间的映射关系，有 xml 文件和注解两种描述方式
2. JPA 的 API，用来操作实体对象，执行 CRUD 操作
3. JPQL 查询语言，通过面向对象而非数据库的查询语言

### Hibernate 与 JPA

JPA 实际上定义了一系列接口，接口是需要有实现才能工作；而实现 JPA 接口的工作就是在 ORM 框架中完成的。

Hibernate 就是一种实现了 JPA 规范的 ORM 框架。

|VS|特点|
|---|----|
|Mybatis|国内流行，小巧，简单，方便|
|Hibernate|国外流程，强大，复杂，方便|

#### Hibernate 示例

第一步，添加依赖，写实体类

pom.xml 中依赖部分如下：

```xml

<dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.28</version>
        </dependency>
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-entitymanager</artifactId>
            <version>5.6.15.Final</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.0.33</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
</dependencies>
```

实例类 User.java

```java
package com.tjian.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tb_user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;
}
```

* 使用了 lombok 省去 setter、getter
* 使用 JPA 标准注解，配置 ORM

第二步，hibernate 配置文件

```xml
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-configuration xmlns="http://www.hibernate.org/xsd/orm/cfg">
    <session-factory>
        <property name="connection.driver_class">com.mysql.cj.jdbc.Driver</property>
        <property name="connection.url">jdbc:mysql://localhost:3306/test_db?createDatabaseIfNotExist=true&amp;characterEncoding=utf-8</property>
        <property name="connection.username">root</property>
        <property name="connection.password"> </property>

        <property name="show_sql">true</property>
        <property name="format_sql">true</property>
        <!--   表生成策略  -->
        <property name="hbm2ddl.auto">update</property>

        <!--    方言：指定数据库类型    -->
        <property name="dialect">org.hibernate.dialect.MariaDB106Dialect</property>

        <mapping class="com.tjian.entity.User" />
    </session-factory>
</hibernate-configuration>
```

* `url` 字段中不能直接使用 `&`
* 配置了数据库和表不存在就创建，以及数据库连接信息
* 配置需要映射的实例类

第三步，测试

```java
package com.tjian;

import com.tjian.entity.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.junit.Before;
import org.junit.Test;

public class HibernateTest {

    public static final String configFile = "hibernate.cfg.xml";
    private SessionFactory sessionFactory;

    @Before
    public void init() {
        StandardServiceRegistry registry = new StandardServiceRegistryBuilder().configure(configFile).build();

        sessionFactory = new MetadataSources(registry).buildMetadata().buildSessionFactory();
    }

    @Test
    public void test() {
        Session session = sessionFactory.openSession();

        Transaction transaction = session.beginTransaction();
        for (int i = 0; i < 10000; i++) {
            session.save(new User(Integer.toUnsignedLong(i), "test" + i));
        }
        transaction.commit();
    }

    @Test
    public void testDelete() {
        try (Session session = sessionFactory.openSession()) {

            Transaction transaction = session.beginTransaction();
            for (int i = 0; i < 100; i++) {
                session.delete(new User(Integer.toUnsignedLong(i), "test" + i));
            }
            transaction.commit();
        }
    }

    @Test
    public void testSelect() {
        try (Session session = sessionFactory.openSession()){
            Transaction transaction = session.beginTransaction();

            String hql = "FROM User WHERE id=:id";
            session.createQuery(hql, User.class).setParameter("id", 100L).getResultStream().forEach(System.out::println);

            transaction.commit();
        }
    }
}

```

#### JPA 示例

JPA 中定义了实体的4种状态：

* 临时态，实体未与数据库关联
* 持久态，实体已经与数据库关联
* 删除态
* 游离态

JPA 是在 JDBC 之上的一层封装，其用法与直接使用 JDBC 相似

```java
package com.tjian;

import com.tjian.entity.User;
import org.junit.Before;
import org.junit.Test;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class JPATest {

    private EntityManagerFactory factory;

    @Before
    public void init() {
        factory = Persistence.createEntityManagerFactory("hibernateJPA");
    }

    @Test
    public void testInsert() {
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();
        for (int i = 1; i < 200; i++) {
            entityManager.persist(new User(null, "JPA" + i));
        }
        transaction.commit();
    }

    @Test
    public void testSelect() {
        // 立即查询
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();
        User user = entityManager.find(User.class, 10120L);
        transaction.commit();

        System.out.println("======这一行会在 SQL 后打印=====");
        System.out.println(user);
    }

    @Test
    public void testSelect_lazy() {
        // 立即查询
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();
        User user = entityManager.getReference(User.class, 10120L);
        transaction.commit();

        System.out.println("======这一行会在 SQL 前打印=====");
        System.out.println(user);
    }

    @Test
    public void testUpdate() {
        // 会先查询，然后更新，查询后发现无变化就不更新
        // 无主键时会插入
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();
        entityManager.merge(new User(10120L, "TESTER"));
        transaction.commit();
    }

    @Test
    public void testUpdateNoQuery() {
        EntityManager entityManager = factory.createEntityManager();
        EntityTransaction transaction = entityManager.getTransaction();
        transaction.begin();
        String jql = "UPDATE User SET name=:name WHERE id=:id";
        entityManager.createQuery(jql).setParameter("name", "VAR").setParameter("id", 10119L).executeUpdate();
        transaction.commit();
    }
}

```

**报错**：org.hibernate.PersistentObjectException: detached entity passed to persist

原因：主键 id 设置了值，JPA 中使用自增主键时冲突

### 什么是 Spring Data JPA

Spring Data JPA 是一套简化 JPA 开发的框架，可以按照约定好的规则进行方法命名去写 dao 层接口，这样就能在不写接口实现的情况下实现对数据库的访问和操作。

#### Spring Data JPA 示例

第一步，添加依赖

```xml
    <dependencies>
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-core</artifactId>
            <version>6.3.1.Final</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.data</groupId>
            <artifactId>spring-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.0.33</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.2.16</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.28</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-framework-bom</artifactId>
                <version>6.0.12</version>
                <scope>import</scope>
                <type>pom</type>
            </dependency>
            <dependency>
                <groupId>org.springframework.data</groupId>
                <artifactId>spring-data-bom</artifactId>
                <version>2023.0.4</version>
                <scope>import</scope>
                <type>pom</type>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

**注**：这里的版本号非常重要，版本不兼容会导致各种各样的问题

第二步，编写配置类（或者配置文件）

```java
package com.tjian.config;

import com.alibaba.druid.pool.DruidDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableJpaRepositories(basePackages = "com.tjian.repositories")
@EnableTransactionManagement
public class JpaConfig {

    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("");
        dataSource.setUrl("jdbc:mysql://localhost:3306/test_db?characterEncoding=utf-8");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(true);
        vendorAdapter.setShowSql(true);

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("com.tjian.entity");
        factory.setDataSource(dataSource);
        return factory;
    }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {

        JpaTransactionManager txManager = new JpaTransactionManager();
        txManager.setEntityManagerFactory(entityManagerFactory);
        return txManager;
    }
}

```

第三步，测试验证

```java
package com.tjian;

import com.tjian.config.JpaConfig;
import com.tjian.entity.User;
import com.tjian.repositories.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

@ContextConfiguration(classes = JpaConfig.class)
@RunWith(SpringRunner.class)
public class JpaTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testInsert() {
        User user = new User();
        user.setName("JPA TEST");
        User saved = userRepository.save(user);
        System.out.println(saved);
    }

    @Test
    public void testSelect() {
        Optional<User> optional = userRepository.findById(5L);
        if (optional.isPresent()) {
            System.out.println(optional.get());
        } else {
            System.out.println("Nothing");
        }
    }
}

```

**报错**：persistence-api 包冲突

原因：persistence-api 更换了维护者，现在由 jakarta 维护，故需要保持版本一致

#### Spring Data JPA 基本用法

通过上面的示例可以看出，Spring Data JPA 封装了基本的增删改查、分页查询和排序等操作，业务代码只需要继承这些接口，就可以实现大部分功能。

##### 核心接口

|接口|说明|
|---|----|
|`Repository`|空接口，主要用作标识|
|`CrudRepository`|封装了基本的 CRUD|
|`PagingAndSortingRepository`|封装了分页查询和排序|
|`ListCrudRepository`|继承自 `CrudRepository`，支持返回集合类型数据|
|`ListPagingAndSor·tingRepository`|继承自 `PagingAndSortingRepository`，支持返回集合类型数据|
|`QueryByExampleExecutor`|动态查询|

##### 自定义实现

1. 通过编写 jpql 实现
   1. 需要通过 @Query 注解写 jpql 语句
   2. 参数有两种指定方式
      1. 具名参数，如 "WHERE id=:id"，传参数时同时通过 @Param("id") 来绑定参数
      2. 索引参数，如 "WHERE id=?1"，这种设置第一个参数
   3. 返回值可以是单个的，也可以是集合
   4. 增删改也是用的 @Query 注解，但增删改还需要通过额外的注解 @Modifying 和 @Transitional 注解表明开启事务
   5. 也可以自定义原生 sql，在 @Query 注解的
2. 通过规定格式的方法命名
   1. 只能通过特定的前缀关键字
   2. 可以字段使用各种查询关键字组合各种搜索条件
3. Query by Example，动态查询，Spring Data JPA 自带的
   1. 只支持查询操作，不支持嵌套或分组的属性约束，且只能支持字符串的模糊匹配，其他类型只能精确匹配
   2. 需要继承 `QueryByExampleExecutor` 接口
   3. 使用时通过 `Example` 和 `ExampleMatcher` 构造匹配条件
      1. 匹配条件可以使某个字段生效，也可以设置针对所有字段的条件
4. Querydsl 第三方的、通用的动态查询框架，Spring Data JPA 提供了适配
   1. 继承 `QuerydslPredicateExecutor` 接口
   2. 支持其他类型的字段
5. Specifications，动态查询
   1. 支持所有类型字段
   2. 继承 `JpaSpecificationExecutor` 接口
   3. 使用步骤
      1. 拿到字段
      2. 构造 CriteriaBuilder
      3. 组合条件

|关键字|描述|
|----|----|
|`find...by...`,`read...by...`,`get...by...`<br />`query...by...`，`search...by...`,`stream...by...`|查询类关键字|
|`existes..by...`|存在投影，通常返回 `boolean` 结果|
|`count...by...`|计数投影，返回数字结果|
|`delete...by...`|`remove...by...`|删除，无返回或者返回计数|
|`first<number>...`，`top<number>...`|限制查询结果|
|`distinct`|排重|

|查询条件关键字|描述|
|-------------|----|
|like|模糊匹配，需要自己指定 % 位置|
|and|并行条件|
|or|或操作|

```java
package com.tjian.repositories;

import com.tjian.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.util.List;

public interface UserRepository extends CrudRepository<User, Long>, PagingAndSortingRepository<User, Long>, QueryByExampleExecutor<User> {

    @Query("FROM User c WHERE c.id=:id")
    List<User> findUsersByName(@Param("id")Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM User c WHERE c.id=?1")
    Integer deleteUserById(Long id);

    @Query(value = "select * from user where name=:name", nativeQuery = true)
    List<User> findByName(@Param("name") String name);

    List<User> findByNameLike(String name);
}

```

上述代码中：

* 使用了自定义的实现
* 使用规定命名格式的方法实现
* 支持动态查询

```java
package com.tjian;

import com.tjian.config.JpaConfig;
import com.tjian.entity.User;
import com.tjian.repositories.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

@ContextConfiguration(classes = JpaConfig.class)
@RunWith(SpringRunner.class)
public class JpaTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testInsert() {
        User user = new User();
        user.setName("JPA TEST");
        User saved = userRepository.save(user);
        System.out.println(saved);
    }

    @Test
    public void testSelect() {
        Optional<User> optional = userRepository.findById(5L);
        if (optional.isPresent()) {
            System.out.println(optional.get());
        } else {
            System.out.println("Nothing");
        }
    }

    @Test
    public void testPage() {
        Page<User> page = userRepository.findAll(PageRequest.of(0, 10));
        System.out.println(page.getTotalPages());
        System.out.println(page.getNumber());
        page.stream().forEach(System.out::println);
    }

    @Test
    public void testQuery() {
        List<User> users = userRepository.findUsersByName(2L);
        users.forEach(System.out::println);
    }

    @Test
    public void testDelete() {
        Integer res = userRepository.deleteUserById(1L);
        System.out.println(res);
    }

    @Test
    public void testSql() {
        List<User> users = userRepository.findByName("JPA TEST");
        users.forEach(System.out::println);
    }

    @Test
    public void testCustomer() {
        List<User> users = userRepository.findByNameLike("JPA%");
        users.forEach(System.out::println);
    }

    @Test
    public void testQueryByExample() {
        User user = new User();
        user.setName("JPA");

        ExampleMatcher matcher = ExampleMatcher.matching().withStringMatcher(ExampleMatcher.StringMatcher.STARTING);
        userRepository.findAll(Example.of(user, matcher)).forEach(System.out::println);
    }
}
```

**报错**：`java.lang.NoClassDefFoundError: org/hibernate/query/BindableType`

原因：版本未对齐，修改：hibernate-core 采用 `6.3.1.Final`

##### 多表关联

1. 一对一，`OneToOne` 
2. 一对多，`OneToMany`
3. 多对多，MoreToMore

###### 一对一

* 使用 `@OneToOne` 注解配置关联关系，并通过 cascade 属性指定关联操作
* 可以单向一对一，也可以双向一对一（一般不做双向关联）
* 使用 `@JoinClomn` 注解关联外键，指定后会在主表中增加一个字段
* 可以在 `@OneToOne` 注解的 `fetch = FetchType.LAZY` 属性配置关联属性懒加载，即在需要的时候才查询
* 删除操作默认不会删除关联数据，需要通过 `@OneToOne` 注解的 `orphanRemoval = true` 属性指定
* `@OneToOne` 注解的 `optional` 属性配置是否允许关联属性为 null
* `@OneToOne` 注解的 `mappedBy` 属性配置双向关联中由谁管理外键约束（自己放弃，另一方维护）

```java
    // 单向一对一

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "info_id")
    private UserInfo userInfo;
```

###### 一对多

* 使用 `@OneToMany` 注解
* 使用 `@JoinColumn` 注解维护外键，外键维护在多的一方，但是在一的一方维护该关系
* 一对多中默认使用的懒加载，需要使用 `@Transitional` 注解

**注**：单元测试中默认不提交，如需提交需要加 `@Commit` 注解

###### 多对多

* 使用 @ManyToMany 注解

**注**：乐观锁防止并发问题，在实体类上添加一个字段，并使用 `@Version` 注解: `private @Version Long version`