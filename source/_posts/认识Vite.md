---
title: Hello Vite
date: 2021-02-04 22:53:20
tags:
  - 前端
  - Vite
categories: Vite
cover: ../images/Vite.svg
---

> 在学习 Vite 之前，可以先了解下[基于浏览器 native 的 ES module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)、[esbuild](https://esbuild.github.io/)、[Rollup](https://www.rollupjs.com/)、

## 什么是Vite

借用作者的原话：

> Vite，一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 rollup 打包。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。
> [英文文档](https://vitejs.dev/)，[中文文档](https://cn.vitejs.dev/)

## Vite 特性介绍

Vite 主打特点就是轻快冷服务启动。冷服务的意思是，在开发预览中，它是不进行打包的。
开发中可以实现热更新，也就是说在你开发的时候，只要一保存，结果就会更新。
按需进行更新编译，不会刷新全部 DOM 节点。这功能会加快我们的开发流程度。

## Vite 是怎么运行的

### ES module

Vite 利用浏览器原生的 ES 模块支持，在 script 标签里设置`type="module"`，然后使用模块内容

```javascript
<script type="module">import {bar} from './bar.js‘</script>
```

### 在 Vite 中的作用

运行 Vite 项目，可以看到 html 中的一段代码

```javascript
<script type="module">
  import {createApp} from '/@modules/vue' import App from '/App.vue'
  createApp(App).mount('#app')
</script>
```

vite 利用 ES module，把构建 vue 项目直接放在放在浏览器中执行，可以做到以下两点：

#### 去掉打包过程

打包的概念是开发者利用打包工具将应用各个模块集合在一起形成 bundle，以一定规则读取模块的代码——以便在不支持模块化的浏览器里使用。
vite 利用浏览器原生支持模块化导入这一特性，省略了对模块的组装，也就不需要生成 bundle，所以打包这一步就可以省略了。

#### 实现按需加载
webpack 之类的打包工具会将各模块提前打包进 bundle 里，但打包的过程是静态的，不管某个模块的代码是否执行到，这个模块都要打包到 bundle 里，这样的坏处就是随着项目越来越大打包后的 bundle 也越来越大。为了减小bundle大小，一般会使用动态引入的方式异步加载模块，或者使用tree shaking等方式尽量去掉未引入的模块
vite 可以只在需要某个模块的时候动态的引入它，而不需要提前打包，虽然只能用在开发环境
## Vite 插件

当我们遇到当前 vite 不支持的功能时，可以通过 vite 插件来解决

## Vite 使用
