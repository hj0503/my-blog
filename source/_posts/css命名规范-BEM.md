---
title: css命名规范-BEM
date: 2021-01-28 16:35:15
tags:
  - css
categories: css
cover: ../images/Vite.jpeg
---

## 介绍

BEM（块，元素，修饰符）是基于组件的 Web 开发方法。其背后的想法是将用户界面分为独立的块。即使使用复杂的 UI，这也使界面开发变得容易和快速，并且允许重用现有代码而无需复制和粘贴。

## 使用准则

`Block__Element--Modifier`，可以看到命名规范由`Block`、`Element`、`Modifier`组成，`Block`和`Element`之间用双下划线(`__`)组成，`Element`和`Modifier`之间用双中线(`--`)组成，那么这三个部分分别代表什么呢
**Block**
就像我们的页面，都是由一个一个模块组成，比如说头部`header`、底部`footer`、侧边栏`asider`、内容区域`content`等等，甚至还可以拆分成更小更多的模块，此时 Block 就可以根据当前的模块名称来命名，Block 可以相互嵌套
**Element**
`Element`是描述当前元素的**目的**或者说**这是什么**，而不是状态。`Element`可以互相嵌套，但是`Element`只是`Block`的一部分，而不是另外一个`Element`，也就是说`Element`不能定义层次结构如：`blobk__ele1__ele2`
**Modifier**
`Modifier`是描述当前元素的外观、状态或者行为

> 总结一下用法为：block-name\_\_element-name-\-modifier-name，也就是模块名 + 元素名 + 修饰器名

## 实例

### element-ui中的使用
我们可以看下`ElementUI`中所用到的BEM规范
```css
$namespace: 'el';
$element-separator: '__';
$modifier-separator: '--';
$state-prefix: 'is-';
```
`ElementUI`在其中加了命名空间`el`针对该ui特有的名称，在工作中我们一般都是用公司名称部门
`element`和`modifier`连接都是用的`BEM`规范中的，另外还加了状态标识用`is-`开头
