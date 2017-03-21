## Sass(Syntactically Awesome StyleSheets)

Sass 是对 CSS 的扩展，让 CSS 语言更强大、优雅。它允许你使用变量、嵌套规则、 mixins、导入等众多功能，并且完全兼容 CSS 语法。Sass 有助于保持大型样式表结构良好，同时也让你能够快速开始小型项目，特别是在搭配 Compass 样式库一同使用时。

*注：Less提供类似功能。*

### 特色
- 完全兼容 CSS3
- 在 CSS3 基础上添加了扩展功能
- 提供了对颜色等值的操作函数
- 有函数库控制指令等高级功能
- 可以对输出格式进行控制
- 支持 Firebug

### 语法
Sass 有两种语法：第一种被称为 SCSS(Sassy CSS)，是一个 CSS3 语法的扩充版本，样式表文件需要以 `.scss` 作为扩展名；第二种比较老的语法。称为缩排语法，提供了一种简洁的 CSS 书写方式 —— 不适用花括号，而使用缩进表示层级，样式表文件需要以 `.sass` 作为扩展名。
两种语法之间可以通过 `sass-convert` 工具转换。

    # 将 Sass 转换为 Scss
    $ sass-convert style.sass style.scss
    # 将 Scss 转换为 Sass
    $ sass-convert style.scss style.sass

#### 字符集
Sass可以指定字符集

#### 嵌套语法
Sass 支持嵌套写法，如：

    #main p {
        color: #00ff00;
        width: 97%;

        .redbox {
            backgroud-color: #ff0000;
            color: #000000;
        }
    }

将被编译为：

    #main p {
        color: #00ff00;
        width: 97%;     
    }
    #main p .redbox {
        backgroud-color: #ff0000;
        color: #000000;      
    }

### 引用父选择符：&
在嵌套中有时需要用到父选择符，如

    a {

    }
