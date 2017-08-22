---
layout: post
title: 布局思考与样式定义
categories: [Jekyll, Web]
---

> 个人Blog当然最好是有个人风格的，然而非设计出身的人做出来的Blog，总归不是太好看。Jekyll提供了很多漂亮的模板可选，网上也有不少同学共享了优秀的案例。
> 当然我自己比较爱折腾，希望掌握自己页面上的所有代码[^know_erery_bytes]，所以我参考了一些个人很喜欢的页面模板后，准备动手实现自己的布局和页面定义。

先说说思路，我打算从下面两点：布局(layout)和样式(style)，来实现自定义风格。

*	**布局**
	1. 要灵活，便于组装、变化和扩展
	2. 要可继承
	3. 自适应
*	**样式**
	1. 组件式，以最少的代码定义功能
	2. 尺寸和色彩分离	

> 参考一：Jekyll默认生成的站点 [^jekyll_default_site]

> 参考二：grpc官网 [^grpc_site_url]

## 概览

目录结构：

```
-scss
	-base
		_normalize.scss
		_reset.scss
		_text.scss
		_variables.scss
	-layout
		_default.scss
		_page.scss
		_post.scss
	-markdown
		_code-highlight.scss
	-theme
		_dark.scss
		_default.scss
		_light.scss
	-third-party
		-font-awesome
		_font-awesome.scss
	-tools
		_response.scss
-css
	main.scss
```

`main.scss`中使用`sass`的`@import`指令聚合了所有的样式定义，其内容如下：

{% highlight scss %}
---
# Only the main Sass file needs front matter (the dashes are enough)
---
@charset "utf-8";

// Import partials from `sass_dir` (defaults to `_sass`)
@import
        "base/_normalize",
        "base/_variables",
        "base/_text",
        "base/_reset";

@import 
		"third-party/_font-awesome";

@import
		"tools/_response";

@import
		"markdown/_code-highlight";

@import 
		"layout/_page",
		"layout/_post",
		"layout/_default";

@import 
		"theme/_light",
		"theme/_dack",
		"theme/_default";

{% endhighlight %}

## 基本参考

在`base`目录下的文件，这部分不直接影响具体的页面内容，但是从整体上限制了页面风格等内容。

### 1. `normalize`：统一浏览器默认外观

这一部分直接引用`normalize`项目了，直接从github上下载源码。

重命名为`_normalize.scss`，放在`_sass/base`[^_sass]目录下。

### 2. `variables`：常量定义

这里定义一些全局常量，主要包括颜色和尺寸两方面的内容。

在`_sass/base`目录下创建`_variables.scss`文件。

### 3. `text`：标题及段落文本

定义各级标题的字体大小，段落字体大小。

在`_sass/base`目录下创建`_text.scss`文件。

### 4. `reset`：自定义的风格重置

如默认字体、字体大小，超链接颜色等信息。

## 第三方依赖

在`third-party`目录下的文件，引用一些比较著名的第三方库。

## 自定义工具库

在`tools`目录下，自定义一些`mixins`，用来提高`scss`编码效率。

## `Markdown`风格

在`markdown`目录下，定义一些`markdown`转`html`时用到的样式定义。

## 基本布局

### 1. 站点`site`相关的定义：

```
// 1. header
.site-header {
	...
}
// 2. profile
.site-profile {
	...
}
// 3. footer
.site-footer {
	...
}
// 4. nav
.site-nav {
	...
}
```

### 2. 页面`page`相关的定义：

```
// page
```

### 3. 博客`post`相关的定义：

```
// title
.post-title {
	...
}
// meta
.post-meta {
	...
}
// content 
.post-content {
	...
}
```

## 风格

在`theme`目录下的文件，主要是定义颜色搭配、动画之类的定义。

### 1. 默认风格

`default`文件给出了默认的搭配，应保证不至于太冲突。

### 2. 深色调

`dark`定义以黑色为主色调的搭配。

### 3. 浅色调

`light`定义以白色为主色调的搭配。

[^know_erery_bytes]: 记得曾有一位伟大的同行说过，优秀的程序员应该了解他程序中的每一个字节。
[^jekyll_default_site]: 使用`jekyll new [site_name]`创建的初始状态站点。
[^grpc_site_url]: 可访问[grpc官网](http://www.grpc.io) 。
[^_sass]: `scss`源文件存放于此目录。
[^_drafts]: 还没有编写完成的，以及还没有确定要发布的文章，暂时存放在`_drafts`目录下。
[^support]: for test