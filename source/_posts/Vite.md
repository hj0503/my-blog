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

当模块数很大时，页面加载比`bundled`更慢，有许多内部模块的依赖尤为突出，比如`lodash`

- 优化 1：依赖预构建（esbuld）
  - 确保一个文件一个请求
  - CommonJS 和 UMD 兼容性
- 优化 2：code split

原生`ESM`不支持裸导入，`import { createApp } from 'vue'`

- 使用[es-module-lexer](https://github.com/guybedford/es-module-lexer) + [magic-string](https://github.com/Rich-Harris/magic-string)重写轻量级模块
  - `es-module-lexer`分析代码中的模块加载导出关系
- 没有完整的 AST 解析/转换，非常快(对于大多数文件<1ms)

```javascript
Source;
import { createApp } from 'vue';

Rewritten;
import { createApp } from '/@modules/vue';
```

浏览器里使用 ES module 是使用 http 请求拿到模块，所以 vite 必须提供一个 web server 去代理这些模块，vite 通过对请求路径的劫持获取资源的内容返回给浏览器，不过 vite 对于模块导入做了特殊处理。

- 在 koa 中间件里获取请求 body
- 通过 es-module-lexer 解析资源 ast 拿到 import 的内容
- 判断 import 的资源是否是绝对路径，绝对视为 npm 模块
- 返回处理后的资源路径："vue" => "/@modules/vue"，vite 在 plugin 中把文件路径 rewrite 成了`@modules`

### vue 文件编译

在 Vite1 中，会把.vue 文件拆成三个请求，分别是`script`、`template`，`style`，浏览器会先收到包含 script 逻辑的 App.vue 的响应，然后解析到 template、 style 的路径后，会再次发起 HTTP 请求来请求对应的资源，此时 Vite 对其拦截并再次处理后返回相应的内容。

```javascript
import { ref, reactive } from '/@modules/vue.js';
const __script = {
  name: 'HelloWorld',
  setup() {
    console.log(this);
    const count = ref(0);
    const object = reactive({
      foo: 'bar',
    });

    return {
      count,
      object,
    };
  },
};

// 将 style 拆分成 /HelloWorld.vue?type=style 请求，由浏览器继续发起请求获取样式
import '/src/components/HelloWorld.vue?type=style&index=0';
__script.__scopeId = 'data-v-62a9ebed';

// 将 template 拆分成 /HelloWorld.vue?type=template 请求，由浏览器继续发起请求获取 render function
import { render as __render } from '/src/components/HelloWorld.vue?type=template';
__script.render = __render;
__script.__hmrId = '/src/components/HelloWorld.vue';
__script.__file =
  '/Users/admin/huangjun/hjjobs/Vue/hello-vite/src/components/HelloWorld.vue';
export default __script;
```
> 在Vite2中，script和template合并成一起请求

这一步的拆分的核心逻辑是根据 URL 的 query 参数来做不同的处理：
```javascript
// 如果没有 query 的 type，比如直接请求的 /App.vue
if (!query.type) {
  ctx.type = 'js'
  ctx.body = compileSFCMain(descriptor, filePath, publicPath) // 编译 App.vue，编译成上面说的带有 script 内容，以及 template 和 style 链接的形式。
  return etagCacheCheck(ctx) // ETAG 缓存检测相关逻辑
}

// 如果 query 的 type 是 template，比如 /App.vue?type=template&xxx
if (query.type === 'template') {
  ctx.type = 'js'
  ctx.body = compileSFCTemplate( // 编译 template 生成 render function
    // ...
  )
  return etagCacheCheck(ctx)
}

// 如果 query 的 type 是 style，比如 /App.vue?type=style&xxx
if (query.type === 'style') {
  const index = Number(query.index)
  const styleBlock = descriptor.styles[index]
  const result = await compileSFCStyle( // 编译 style
    // ...
  )
  if (query.module != null) { // 如果是 css module
    ctx.type = 'js'
    ctx.body = `export default ${JSON.stringify(result.modules)}`
  } else { // 正常 css
    ctx.type = 'css'
    ctx.body = result.code
  }
}
```

### 热更新
Vite 的是通过 WebSocket 来实现的热更新通信

### 基于`Rollup`的生成环境构建

- Rollup 是在构建速度、tree-shaking 和输出大小方面表现最好的基于 js 的模块打包器
- 它也围绕 ES 模块构建，这与 Vite 的前提一致
