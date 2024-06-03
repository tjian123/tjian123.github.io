---
layout: default
title: 样式思考
description: 介绍关于本篇 Blog 样式设计的思路和框架。
categories: 
  - 技术积累
tags: 
  - Web
  - SCSS
  - Jekyll
---

> 个人 Blog 当然最好是有个人风格的，然而非设计出身的人做出来的 Blog，大多都不是太好看。

<!-- more -->

* TOC
{:toc}

Jekyll 提供了很多漂亮的模板，网上也有不少同学共享了优秀的案例。当然我自己比较爱折腾，希望掌握自己页面上的所有代码[^know_erery_bytes]，所以我参考了一些个人很喜欢的页面模板后，准备基于 Jekyll 提供的基础功能实现自己的页面定义。

先说说思路，我打算从下面两点来实现自定义风格。

* **布局**：规定页面中内容的分布
  1. 要灵活，便于组装、变化和扩展
  2. 要可继承
  3. 要自适应各种屏幕
* **组件**：定义具体的内容
  1. 组件式，以最少的代码定义功能
  2. 尺寸和色彩分离  

*参考：*

* *Jekyll 默认生成的站点 [^jekyll_default_site]*
* *grpc 官网 [^grpc_site_url]*

## 1. 概要

样式基于 `scss` 语法定义，主要包括定义在 `_sass` 目录下的样式文件，和定义在 `css` 目录下的作为最终入口 `mian.scss` 文件。

总体目录结构：

```yml
-scss
  -base
    _common.scss
    _reset.scss
    _text.scss
  -component
    _offset-left.scss
    ...
  -const
    _const.scss
    ...
  -layout
    _default.scss
    _page.scss
    _post.scss
    ...
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

**注**：*以连接线 '-' 起头的是文件夹名称。*

下面按照从 main.scss 中加载的顺序依次说明。

### 1.1 `main.scss` 文件

`main.scss` 中使用 `sass` 的 `@import` 指令聚合了所有的样式定义，其内容如下：

```scss
---
# Only the main Sass file needs front matter (the dashes are enough)
---

@charset "utf-8";

// Import partials from `sass_dir` (defaults to `_sass`)

@import 
        "third-party/index",
        "const/index",
        "tools/index",
        "base/index",
        "component/index",
        "markdown/index",
        "layout/index",
        "theme/index";
```

如上，目前一共包含 8 个方面的内容：

|内容|说明|
|----|----|
|`third-party`|第三方组件库，主要是 `font-awesome`，放在最前面是避免自定义样式干扰|
|`const`|样式常量定义，方便统一站点样式和一键切换样式|
|`tools`|基于 `scss` 的 `mixin` 语法定义的工具代码，如重置链接样式等|
|`base`|站点基本样式，即不带任何样式类定义的原始标签的样式|
|`component`|站点组件样式|
|`markdown`|`markdown` 专用样式调整|
|`layout`|定义站点整体布局分布|
|`theme`|一键生成站点配色等|

### 1.2 修改及命名约定

1. `main.scss` 作为入口文件，需要维持其简洁性；除非上述 8 点无法覆盖分类，否则不应变动
2. `main.scss` 引用了各样式目录下的 `_index.scss`，而 `index.scss` 是各样式的汇总
3. 具体的 `scss` 文件需要以 `_` 开头，并指定 `utf-8` 编码格式

## 2. `third-party` —— 第三方组件

第三方组件都来源于 `github`，这里主要使用图标库、浏览器样式统一库以及动画库等。

### 2.1 `font-awesome`：矢量图标库

* [`Font Awesome` 官方网站](https://fontawesome.com/)
* [`Font Awesome` 中文网](https://fontawesome.com.cn/)
* [源码地址](https://github.com/FortAwesome/Font-Awesome)

### 2.2 `animate`：动画库

* [`Animate.css` 官方网站](https://animate.style/)
* [源码地址](https://github.com/animate-css/animate.css)

### 2.2 `normalize`：统一浏览器默认外观

* [`Normalize.css` 官方网站](https://necolas.github.io/normalize.css/)
* [源码地址](https://github.com/necolas/normalize.css/)

这一部分直接引用 `normalize` 项目了，直接从 github 上下载源码。

重命名为 `_normalize.scss`，放在 `_sass/base`[^sass] 目录下。

## 3. `const` —— 全局变量

### 3.1 `const`：常量定义，用于统一样式

这部分常量属于全局可以引用的，与特定场景无关的。

#### 3.1.1 color

定义颜色常量，包括灰色系等

#### 3.1.2 font-family

定义字体常量，目前提供了如下字体：

* `Arial`，对应变量 `$arialFont`
* `Consolas`，对应变量 `$consolasFont`

#### 3.1.3 font-size

定义字体大小常量，字体大小基于 rem 单位指定，包括：

* 基准字体：`$font-size--primary`，默认16px
* 较大字体：`$font-size--l`，值为 `1.85rem`
* 稍大字体：`$font-size--xl`，值为 `2rem`
* 最大字体：`$font-size--xxl`，值为 `2.5rem`
* 中等字体：`$font-size--m`，值为 `1.35rem`
* 较小字体：`$font-size--s`，值为 `1.15rem`
* 稍小字体：`$font-size--xs`，值为 `1rem`
* 最小字体：`$font-size--xxs`，值为 `0.8rem`

**注**：`rem` 全称是根元素字体大小，即 `html` 元素中定义的 `font-size` 大小，例当 `font-size` 为 `16px` 时，`1rem` 即为 `16px`，`2rem` 即为 `32px`。

#### 3.1.4 line-height

定义单行高度的常量，包括：

* 较大行高，`$line-height--xxl`
* 较大行高，`$line-height--xl`
* 中等行高，`$line-height--m`
* 较小行高，`$line-height--s`
* 稍小行高，`$line-height--xs`
* 最小行高，`$line-height--xxs`

#### 3.1.5 spacing

定义间距的常量

* `$spacing--xxxxs`，值为 `0.25rem`
* `$spacing--xxxs`，值为 `0.375rem`
* `$spacing--xxs`，值为 `0.5rem`
* `$spacing--xs`，值为 `0.625rem`
* `$spacing--s`，值为 `0.75rem`
* `$spacing--m`，值为 `1.25rem`
* `$spacing--l`，值为 `1.5rem`
* `$spacing--xl`，值为 `2rem`
* `$spacing--xxl`，值为 `4rem`
* `$spacing--xxxl`，值为 `10rem`
* `$spacing--xxxxl`，值为 `20rem`

#### 3.1.6 height

定义元素高度的常量

* `$element-height--s`，值为 `1rem`
* `$element-height--m`，值为 `1.5rem`
* `$element-height--l`，值为 `4rem`

#### 3.1.7 width

宽度分元素宽度和容器宽度，元素宽度常量为

* `$element-width--s`，值为 `1.5rem`
* `$element-width--m`，值为 `2rem`

容器宽度为

* `$container-width--xxl`，值为 `61.25rem`
* `$container-width--xxxl`，值为 `62.5rem`
* `$container-width--xxxxl`，值为 `75rem`

#### 3.1.8 device

定义媒体查询用宽度常量，这部分的单位是固定像素的

* `$device--xxxs`，值为 `320px`
* `$device--xxs`，值为 `480px`
* `$device--xs`，值为 `512px`
* `$device--s`，值为 `640px`
* `$device`，值为 `768px`
* `$device--l`，值为 `1024px`
* `$device--xl`，值为 `1280px`
* `$device--xxl`，值为 `1440px`

#### 3.1.9 timing

定义用于动画过渡的时间常量

* `$transition--primary`，值为 `.3s ease`
* `$transition--secondary`，值为 `.6s cubic-bezier(0.3, 0.9, 0.2, 1)`
* `$transition--tertiary`，值为 `.3s cubic-bezier(0.93,0.7,0.4,0.57)`
* `$transition--fast`，值为 `.2s ease`
* `$transition--slow`，值为 `1s ease`

#### 3.1.10 zindex

定于元素 z 坐标的常量

* `$z-deep`，值为 `-10`
* `$z-below-bottom`，值为 `-5`
* `$z-bottom`，值为 `-1`
* `$z-base`，值为 `0`
* `$z-top`，值为 `1`
* `$z-above-top`，值为 `5`
* `$z-high`，值为 `10`

### 3.2 变量定义，用于生成主题

这部分定义了特定使用场景相关的常量

## 4. `tools` —— 工具箱

### 4.1 `utils`：通用工具

主要定义以下工具

* `clearfix`，清除浮动
* `reset-list`，重置列表，通常在导航栏等位置使用
* `reset-link`，重置超链接

### 4.2 `spacing`：定义空白距离的

定义用于设置 `padding` 的工具

* `set-v-padding`
* `set-h-padding`

### 4.3 `theme`：生成主题

定义生成主题的工具

* `generate-theme`，统一入口

### 4.4 `response`：响应式相关

定义媒体查询相关工具

* `media-query`

### 4.5 `layout` 布局相关

暂时为空

## 5. `base` —— 基础样式

这里定义了站点全局的基础配置

### `reset` 自定义重置样式

主要包括两项：

1. `body` 默认以 `flex` 布局
2. `table` 显示为三线表

### `text` 站点字体显示控制

包括字体选择和字号大小控制

* 字体：正文字体采用 `Arial`，代码字体采用 `Consolas`

### `common` 站点中自定义通用元素的一致性设置

包括以下内容

* `title`

## 6. `component` —— 站点组件

### 6.1 `profile` 个人展示页组件

## 7. `markdown` —— `Markdown` 专用样式

### 7.1 `code` 代码语法高亮

代码块显式控制，`Markdown` 将代码块自动加了标签，根据标签可以显示配色

### 7.2 `mermaid` 绘图

`Mermaid` 绘图显示控制，这部分可以结合官方内容进一步扩展

### 7.3 `toc` 目录

目录显示控制

### 7.4 `content` 通用内容

脚注等内容显示

## 8. `layout` —— 布局定义

这部分用于控制布局

### 8.1 `page`

### 8.2 `post`

## 9. `theme` —— 主题定义

### 9.1 `default`：默认主题

### 9.2 `light`：浅色主题

### 9.3 `dark`：暗色主题

## 10. 总结

[^know_erery_bytes]: 曾有一位伟大的同行说过，优秀的程序员应该了解他程序中的每一个字节。
[^jekyll_default_site]: 使用 'jekyll new [site_name]' 创建的初始状态站点。
[^grpc_site_url]: 可访问[grpc官网](http://www.grpc.io)。
[^sass]: `scss`源文件存放于此目录。
