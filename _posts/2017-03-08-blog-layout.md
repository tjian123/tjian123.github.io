---
layout: default
title: 布局思考
description: 搭好框架好干活。
categories: 
  - 博客探索
tags: 
  - Blog
  - Web
---

> 这里的布局是指，页面所需要的展示类型，如单页展示、上中下分栏等。

<!-- more -->
* TOC
{:toc}

## 基本思路

按照所需要的布局层次来描述：

* 最顶层自然是**空白页**，无任何布局，随意描述 —— 通过 `base.html` 给定，新建布局只需要继承 `base` 即可。
* 用的最多的**三分**布局，采用上中下分栏设计，分别对应显示 `header`,`content` 和 `footer` -- 通过 `default.html` 限定。
* **单页**面显示的时候，需要对整个窗口加以利用 —— 通过 `single.html` 限定，目前是等同于 `base.html` 的。
* **固定**显示的页面，如个人简介等，通常布局类似 —— 通过 `page.html` 限定，可以继承自 `base` 来规划布局，目前直接继承自 `default.html`。
* 显示文章的页面，采用**分段**式布局 —— 继承自 `default.html`，给出了导航至上一篇下一篇的链接按钮。

*注：*

* *所有的 css 文件最终被聚合在一个大文件中，在 `base` 中引入。*
* *在 `default` 中，引入了对 `header` 和 `footer` 的定义，统一导航和底部链接。*

图示如下：

```shell
                            base
                            |
                    --------------------
                    |         |        |
                triple   single   (else if needed)
                    |         |
                bannerTriple  home
                    |
                ---------
                |       |
            page        post  
              |           |
            default
```

## `base` 布局

顶层：

* 统一 SEO 配置
* 统一 CSS 导入
* 统一 JS 导入

```shell
html-header —— 统一 SEO 配置，CSS 导入
  ...
   content 
  ...
html-footer —— 统一 JS 导入

```

## `triple` 布局

继承 `base`：

* 统一导航栏导入
* 统一底部链接，以及 copyright 配置导入

```shell
header —— 统一导航栏
site-banner —— 统一导入 banner
  ...
   content 
  ...
footer —— 统一底部链接，以及 copyright
```

### `bannerTriple` 布局

继承 `triple`：

* 统一 banner 导入

```shell
site-banner —— 统一导入 banner
  ...
   content 
  ...
```

### `page` 布局

继承 `bannerTriple`:

* 引入 page 入口

```html
<!-- page —— page 框架 -->
<main class="page">
  ...
   content 
  ...
</main>

```

### `post` 布局

继承 `bannerTriple`:

* 引入 post 入口

```html
<!-- post —— post 框架 -->
<main class="post">
  ...
   content 
  ...
</main>
```

### `default` 布局

继承 `post`:
