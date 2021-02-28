---
title: Hello Vite
date: 2021-02-04 22:53:20
tags:
  - 前端
  - Vite
categories: 构建工具
cover: ../images/Vite.svg
---

> 在学习 Vite 之前，可以先了解下[基于浏览器 native 的 ES module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)、[esbuild](https://esbuild.github.io/)、[Rollup](https://www.rollupjs.com/)、

## 什么是 Vite

借用作者的原话：

> Vite，一个基于浏览器原生 ES module 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 rollup 打包。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。
> [英文文档](https://vitejs.dev/)，[中文文档](https://cn.vitejs.dev/)

## Vite 特性介绍

Vite 主打特点就是轻快冷服务启动。冷服务的意思是，在开发预览中，它是不进行打包的。
开发中可以实现热更新，也就是说在你开发的时候，只要一保存，结果就会更新。
按需进行更新编译，不会刷新全部 DOM 节点。这功能会加快我们的开发流程度。

## Vite vs Vue Cli

![Vite vs VueCli](/images/Vite/ViteVueCli.png)

## Vite 开发服务器使用原生 ES module

在开发服务器，Vite 利用浏览器原生的 ES 模块支持，在 script 标签里设置`type="module"`，然后使用模块内容

- 传统的“bundlers”需要在开发服务器能够显示任何内容之前完全构建整个应用程序
- 这包括对每个文件的导入/导出关系的全面解析!
- 应用程序越大，开发服务器启动越慢
- 代码分割有助于生成性能，但不能帮助开发性能

### Vite 是怎么利用 ES module 做的

- `<script type="module">`
- 浏览器解析`ES module`的 imports
- 开发服务器接收针对各个模块的 HTTP 请求

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

webpack 之类的打包工具会将各模块提前打包进 bundle 里，但打包的过程是静态的，不管某个模块的代码是否执行到，这个模块都要打包到 bundle 里，这样的坏处就是随着项目越来越大打包后的 bundle 也越来越大。为了减小 bundle 大小，一般会使用动态引入的方式异步加载模块，或者使用 tree shaking 等方式尽量去掉未引入的模块
vite 可以只在需要某个模块的时候动态的引入它，而不需要提前打包，虽然只能用在开发环境
![Native ESM based dev server](/images/Vite/ESMBasedDevServer.png)

#### ES module 带来的问题

当模块数很大时，页面加载比`bundled`更慢，有许多内部模块的依赖尤为突出，不如`lodash`

- 优化 1：依赖预构建（esbuld）
  - 确保一个文件一个请求
- 优化 2：code split

原生`ESM`不支持裸导入，`import { createApp } from 'vue'`

- 使用[es-module-lexer](https://github.com/guybedford/es-module-lexer) + magic-string(https://github.com/Rich-Harris/magic-string)重写轻量级模块
- 没有完整的AST解析/转换，非常快(对于大多数文件<1ms)
```javascript
Source
import { createApp } from 'vue'

Rewritten
import { createApp } from '/@modules/vue'
```

### 热更新
### 基于`Rollup`的生成环境构建
- Rollup是在构建速度、tree-shaking和输出大小方面表现最好的基于js的模块打包器
- 它也围绕ES模块构建，这与Vite的前提一致
