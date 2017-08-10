---
layout: post
title: 设计模式——建造者模式
categories: [Pattern]
---



## 使用建造者模式构建简单java类的思考

最开始接触java类时，我们的代码是这样的：

{% highlight java %}
public class Person {
	public int age;
	public String name;
}
{% endhighlight %}

很快我们就会发现，这样写确实太粗糙，`age`和`name`可以接收任何整型和`string`赋值。显然年龄不能为负数，超过120或者保守点超过200岁的年龄值毫无意义，而一个人的名字显然也不会比一本书的内容长。

于是，第二版是这样：

{% highlight java %}
public class Person {
	private int age;
	private String name;

	public Person() {

	}

	public Person(int age, String name) {
		this.setAge(age);
		this.setName(name);
	}

	public void setAge(int age) {
		if (age <= 0 || age >= 200) return;
		this.age = age;
	}

	public int getAge() {
		return age;
	}

	public void setName(String name) {
		if (name.length() > 20) return;
		this.name = name;
	}

	public void getName() {
		return name;
	}
}
{% endhighlight %}

这样，我们通过`setter`对成员变量进行了很好的控制，这便是经典的POJO做法。

有时，我们存在这样的需求：我们只想设置`age`或者只想设置`name`，或者都不设置，但是我们期望仍然能够得到一个可用的有默认值得`Person`实例。可以将以上代码修改为：

{% highlight java %}
public class Person {
	private int age;
	private String name;

	public Person() {
		age = 10;
		name = "XiaoMing";
	}

	public Person(int age) {
		this.setAge(age);
		name = "XiaoMing";
	}

	public Person(String name) {
		this.setName(name);
		age = 10;
	}

	public Person(int age, String name) {
		this.setAge(age);
		this.setName(name);
	}

	......
	// 省略相同的setter和getter
	......
}
{% endhighlight %}

这种方式下，我们有多少种需求，便需要多少种构造方法；当然也可以不添加构造方法，但是需要对变量初始化以后重复赋值。

接下来看看，基于建造者模式的实现：
{% highlight java %}
public class Person {
	private int _age;
	private String _name;

	private Person(int age, String name) {
		_age = age;
		_name = name;
	}

	public Builder builder() {
		return new Builder();
	}

	public int age() {
		return _age;
	}

	public String name() {
		return _name;
	}

	public final class Builder {

		public Builder setAge(int age){

			return this;
		}

		public Builder setName(String name){
			
			return this;
		}

		public Person build() {
			return new Person()
		}
	}
}
{% endhighlight %}