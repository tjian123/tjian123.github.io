# 狐狸哒黍.小馒头

越努力，越幸运！

Much efforts, much prosperity!

## 特色

- 自定义的样式结构
- 支持 mermaid 绘图（UML）

## 更新日志

> 2021-08-11

- 优化 Mermaid 显示
- 使用空格缩进替代所有 TAB

> 2018-04-28

- 导航链接 active 状态判断支持
- 404 页面支持，需要在 page 列表中过滤

> 2017-08-22

- 基础框架搭建
- jekyll 编译环境
- github 同步

## 原则

- 命令规范
  - 文件名：使用全小写字母
    - post 文件，使用连接线 `-` 连接，如：`2017-01-01-git-flow-usage.md`
    - sass 文件，使用下划线 `_` 开始，如：`_code-hightlight.scss`
    - js 文件：使用连接线 `-` 连接，如：`dropdown-menu.js`
  - liquid 变量名（包括每个页面开头的配置项和 assign 赋值项）：采用小驼峰命名方式
  - js 变量名：类变量大驼峰，其他变量小驼峰方式
  - scss 变量名：全小写，定义使用连接线 `-` 连接
    - 如有归类分级，则分级定义部分使用双连接线 `--` 隔开，如：`font-size--xxl`
- 文件位置规范
  - data 文件
  - layout 文件
    - 页面的继承关系通过布局文件来定义
    - 页面通用元素定义在 `_include` 目录下
      - `_include/base` 目录
        - `html-header.html`，定义 SEO 等元素，引入 CSS 样式文件
        - `html-footer.html`，引入 Js 脚本文件
      - `_include/common` 目录
        - `site-banner.html`，通用 `banner` 元素
        - `site-header.html`，通用 `header` 元素，定义了 LOGO 和菜单栏
        - `site-footer.html`，通用 `footer` 元素，定义了 CopyRight 等
        - `site-profile.html`，定义作者简介等
        - `site-slide.html`，用于 slide 展示，暂不可用
        - `page-social-icons.html` 用于展示 APP 图标
      - `_include/config` 目录
        - `post-meta.html`，通用页面简介展示元素
        - `post-warnings.html`，通用提示页面
      - `_include/option` 目录
        - `page-category-list.html` 分类展示页
        - `page-list.html` 默认展示页
        - `page-tag-list.html` 基于 TAG 展示页
        - `page-list-nav.html` 导航上一页，下一页
    - `_layouts` 目录
      - `base.html` 是根布局，其包含站点收尾导入设置，以及全局的是否使用背景设置
      - `page.html` 和 `post.html` 是两类基本大布局，直接继承于 `base` 布局
      - `bannerPage.html` 继承自 `page`，提供带 `banner` 的单页面根布局
      - `bannerPost.html` 继承自 `post`，提供带 `banner` 的带内容展示页根布局
      - `default.html` 提供所有内容展示页的默认布局，继承自 `bannerPost`
      - `home.html` 提供主页专属的布局，继承自 `bannerPage`
      - `single.html` 提供单页面自适应的布局，继承自 `page`
  - post 文件
    - 已经归档可发布的，放在 `_posts/` 目录下
    - 尚未评审不可发布的，放在 `_drafts/` 目录下
  - scss 文件
    - `_scss/base` 目录
      - 提供最基本原始的样式定义，即不附加其他主题设置时的样式
    - `_scss/component` 目录：自定义组件定义，应该尽量避免使用
    - `_scss/const` 目录：规范如宽度、高度等常量
    - `_scss/layout` 目录：规范布局
    - `_scss/markdown` 目录：`markdown` 相关样式专用，如高亮代码、TOC 样式
    - `_scss/theme` 目录：站点主题
    - `_scss/third-party` 目录：第三方样式引用
    - `_scss/tools` 目录：自定义 scss Mixin 工具函数
  - js 文件:
    - `js/component` 目录：
    - `js/third-party` 目录：
- 颜色定义规范：
  - 基调配色在 `_scss/theme` 中通过变量配置
  - 如果有局部的颜色（或颜色 + 形变）变更，应另起 sass 文件
- 尺寸定义规范：
  - 基调尺寸在 `_scss/layout` 中通过变量配置
  - 如果有局部尺寸变更，应另起 sass 文件
- 其他规范：
  - 能用 CSS 实现的不用 Js 实现
  - 尽量使用原生 Js 实现，除非第三方 Js 库能节约极大的生产

## 感受

- 使用 jekyll 写 blog 并不好玩，具体来说以下的缺点让我非常纠结：
  - 文章只能写在 `_post` 目录下，一旦文章数量多起来，就会很难管理，点开目录一下子弹好长出来，根本不知道哪是哪（除非你写了东西再也不打算看第二遍）；
- 但是我还是会坚持把这个 blog 完成，毕竟有始无终更不好玩；
- 我希望完结的时候，这个 blog 能够成为一个很好的 jekyll 教程，里面应该包含了 jekyll 涉及到的绝大多数东西；

## 代码环境

Ubuntu:16.10
