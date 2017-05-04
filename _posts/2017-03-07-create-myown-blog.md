---
layout: post
title: 布局思考与样式定义
category: Jekyll
---

>	个人Blog当然最好是有个人风格的，然而非设计出身的人做出来的Blog，总归不是太好看。Jekyll提供了很多漂亮的模板可选，网上也有不少同学共享了优秀的案例。
>	当然我自己比较爱折腾，希望掌握自己页面上的所有代码[^know_erery_bytes]，所以我参考了一些个人很喜欢的页面模板后，准备动手实现自己的布局和页面定义。

先说说思路，我打算从下面两点：布局(layout)和样式(style)，来实现自定义风格。

*	**布局**
	1. 要灵活，便于组装、变化和扩展
	2. 要可继承
*	**样式**
	1. 组件式，以最少的代码定义功能
	2. 尺寸和色彩分离
	3. 自适应

参考一：Jekyll默认生成的站点[^jekyll_default_site]

参考二：grpc官网[^grpc_site_url]

### 1. 统一浏览器默认外观

这一部分直接引用`normalize`项目了，直接从github上下载源码。

重命名为`_normalize.scss`，放在`_sass\base`[^_sass]目录下。

### 2. 常量定义

这里定义一些全局常量，主要包括颜色和尺寸两方面。

在`_sass\base`目录下创建`_variables.scss`文件。

### 3. 标题及段落文本

定义各级标题的字体大小，段落字体大小。

在`_sass\base`目录下创建`_text.scss`文件。

### 4. 基本布局

```
.site-header {
	...
}
```

[^know_erery_bytes]: 记得曾有一位伟大的同行说过，优秀的程序员应该了解他程序中的每一个字节。
[^jekyll_default_site]: 使用`jekyll new [site_name]`创建的初始状态站点。
[^grpc_site_url]: 可访问[grpc官网](http://www.grpc.io) 。
[^_sass]: `scss`源文件存放于此目录。
[^_drafts]: 还没有编写完成的，以及还没有确定要发布的文章，暂时存放在`_drafts`目录下。