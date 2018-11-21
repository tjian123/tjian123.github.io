# 狐狸哒黍.小馒头
Much efforts, much prosperity!

### 更新日志：

> 2018-04-28

- 导航链接 active 状态判断支持
- 404 页面支持，需要在 page 列表中过滤

> 2017-08-22

- 基础框架搭建
- jekyll 编译环境
- github 同步

### 原则：

- 命令规范：
	- 文件名：使用全小写字母
		- post 文件，使用连接线 '-' 连接，如：'2017-01-01-git-flow-usage.md'
		- sass 文件，使用下划线 `_` 开始，如：`_code-hightlight.scss`
		- js 文件：使用连接线 '-' 连接，如：'dropdown-menu.js'
	- liquid 变量名（包括每个页面开头的配置项和 assign 赋值项）：采用小驼峰命名方式
	- js 变量名：类变量大驼峰，其他变量小驼峰方式
	- scss 变量名：全小写，定义使用连接线 '-' 连接
		- 如有归类分级，则分级定义部分使用双连接线 '--' 隔开，如：'font-size--xxl'
- 文件位置规范：
	- post 文件：
	- scss 文件：
	- js 文件:
- 颜色定义规范：
	- 基调配色在 theme 中通过变量配置
	- 如果有局部的颜色（或颜色 + 形变）变更，应另起 sass 文件
- 尺寸定义规范：
	- 基调尺寸在 layout 中通过变量配置
	- 如果有局部尺寸变更，应另起 sass 文件
- 其他规范：
	- 能用 CSS 实现的不用 Js 实现
	- 尽量使用原生 Js 实现，除非第三方 Js 库能节约极大的生产

### 感受：

- 使用 jekyll 写 blog 并不好玩，具体来说以下的缺点让我非常纠结：
	- 文章只能写在`_post`目录下，一旦文章数量多起来，就会很难管理，点开目录一下子弹好长出来，根本不知道哪是哪（除非你写了东西再也不打算看第二遍）；
- 但是我还是会坚持把这个 blog 完成，毕竟有始无终更不好玩；
- 我希望完结的时候，这个 blog 能够成为一个很好的 jekyll 教程，里面应该包含了 jekyll 涉及到的绝大多数东西；

### 代码环境

Ubuntu:16.10
