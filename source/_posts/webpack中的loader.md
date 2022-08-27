---
title: webpack中的loader
date: 2022-08-27 21:33:22
tags:
  - webpack
---

### webpack 中的 loader

#### 一、loader 是什么

`loader`用于对模块中的源代码进行转换。使你在`import`或者“加载”模块时预处理文件。可以将文件从不同语言转换成`javascript`。因为`webpack`只支持`js`文件打包，像`css`、`scss`、`png`等这些类型的文件无法处理，这个时候就需要配置不同的`loader`对这些文件内容进行解析在加载模块的时候。
