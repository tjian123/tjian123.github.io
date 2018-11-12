---
layout: post
title: 居中布局
description: 居中布局在 banner，以及单页面中应用非常多，用于保证布局对象在容器发生变化（宽高）的时候，始终都能处于容器中心。
categories: 
  - 技术积累
tags: 
  - Web
  - Css3
---

> 居中布局在 banner，以及单页面中应用非常多，用于保证布局对象在容器发生变化（宽高）的时候，始终都能处于容器中心。

<!-- more -->
* TOC
{:toc}

## 绝对定位 + 2D 变换

### 主要属性

- `position`
- `top`
- `left`
- `transform`

### 示例代码

- `demo.html`：

```html
<!DOCTYPE html>
<html>
<head>
<title>测试整页居中显示</title>
<style type="text/css">
.container {
	height: 100vh;
}

.wrapper {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	border: 1px solid #333;
	padding: 10px 20px;
}


</style>
</head>
<body>
<div class="container">
	<div class="wrapper">
		<p> 短：这是一个居中测试 </p>
		<p> 长：这是一个居中测试 这是一个居中测试 这是一个居中测试 这是一个居中测试 
		这是一个居中测试 这是一个居中测试 这是一个居中测试 
		这是一个居中测试 这是一个居中测试 这是一个居中测试 
		这是一个居中测试 这是一个居中测试 这是一个居中测试</p>
	</div>
</div>
</body>
</html>
```
