##### 常见问题

1. css 沙箱不完美

qiankun 提供了两种样式隔离方案：shadow dom(strictStyleIsolation: true) 和自己实现的 scoped(experimentalStyleIsolation: true)

shadow dom：内部的样式不影响外部的样式，外部的样式不影响内部的样式。造成 dialog 组件样式失效，因为 dialog 组件是在 body 里面没在 shadow dom 里

scoped：借鉴 scoped css 的思路，给所有样式加一层 data-qiankun="应用名"的选择器，并且在子应用最外层 div 上加上 data-qiankun="应用名"。

解决方案：各个应用的全局样式加应用名称隔离，各个应用内的组件使用 scoped css，组件库换前缀

组件库换前缀方案：

html 换前缀：使用 config-provider 组件传 props，然后通过 vue 中的 provide 和 inject 传入到各个子组件中；Vue.use(Element, options)的形式把 namespace 传入 options 中，然后通过 provide 和 inject 传入子组件中
css 换前缀: @forward "index.scss" with ( $namespace: 'el' )修改 scss 变量

2. 应用之间的跳转

子应用路由实例跳转都基于路由的 base

- 主应用 router 通过 props 下发给子应用，通过主应用的 router 跳转(无法鼠标右键跳转)
- 主应用把路由实例挂载到 window 上
- history.pushState() 要求子应用是 history 路由模式
- a 标签完整 url 路径跳转(页面会重新刷新)

3. 抽取公共依赖

- [微前端（乾坤）项目下，如何使用 dllplugin 打包抽取公共依赖](https://blog.csdn.net/weixin_43589827/article/details/118632092)
- 将公共依赖配置成 external，然后在主应用中导入公共依赖，通过 cdn 的方式

----------- 问题 end -----------

##### 原理

1. 隔离 js 环境，主要是隔离 window 对象

- snapshotSandbox 生成代理对象的快照，主要用于不支持 proxy 的浏览器

三个变量 window、windowSnapshot、modifyPropsMap

首次：首先通过遍历 window 把上面的属性值全部复制一份给 windowSnapshot 生成快照。此时在子应用中对 window 上面的属性做了修改，在离开子应用时，再次遍历 window 对象和快照 windowSnapshot 中的属性进行对比，不同的属性值说明是修改了，记录在 modifyPropsMap 中，并且通过 windowSnapshot 还原 window 就避免了全局污染
再次：遍历 window 的同时也遍历 modifyPropsMap，把变更的内容复制进 window 对象就恢复了之前的变更

- legacySandbox

类似 snapshotSandbox 方案，只是不用频繁遍历 window，因为通过 proxy 代理 window 属性的 set 操作来记录变更

- proxySandbox

定义一个 fakeWindow，绑定在子应用的 window 上，通过 proxy 代理 fakeWindow，取值和修改值操作的是 fakeWindow。
拿到子应用的 js 代码后，包裹在立即执行函数中，通过参数传递给每个子应用

2. url 变换加载子应用

```js
singleSpa.registerApplication({ //注册微前端服务
    name: 'singleDemo',
    app: async () => {
        ...
        return ...;
    },
    activeWhen: () => location.pathname.startsWith('xxx') // 配置微前端模块
});
```

执行注册微前端服务时，调用 reroute 函数。reroute 作用是负责改变 app.status。和执行在子应用中注册的生命周期函数。具体：

- 需要对于子应用的代码进行加载，加载的写法不限。你可以通过插入<script>标签引用你的子应用代码，或者像 qiankun 一样通过 window.fetch 去请求子应用的文件资源。从这里加载函数的自定义我们可以看出为什么 single-spa 这个可以支持不同的前端框架例如 vue，react 接入，原因在于我们的前端框架最终打包都会变成 app.js, vendor-chunk.js 等 js 文件，变回原生的操作。我们从微前端的主应用去引入这些 js 文件去渲染出我们的子应用，本质上最终都是转为原生 dom 操作，所以说无论你的子应用用框架东西写的，其实都一样。所以加载函数就是 single-spa 对应子应用资源引入的入口地方
- 第二个目的就是需要在加载函数中我们要返回出子应用中导出的生命周期函数提供给主应用

路由控制：

//增加了两个监听，监听 url 的变化，如果你用的 hash 模式改变#后面的值或者在浏览器中后退，那么就重新执行 reroute。

```js
function urlReroute() {
  reroute([], arguments);
}
window.addEventListener('hashchange', urlReroute);
window.addEventListener('popstate', urlReroute);

// pushState、replaceState不会触发popstate事件，复写的目的是在url发生变化时，触发popstate事件
```

single-spa 和 qiankun 的关系:

qiankun 的编写是基于 single-spa 和 import-html-entry 两个库，single-spa 帮助 qiankun 如何调度子应用，import-html-entry 提供了一种 window.fetch 方案去加载子应用的代码。

qiankun 在 start 启动应用之后不久，就会进入到加载函数，通过 import-html-entry 中的 importEntry 方法加载子应用资源，里面通过 window.fetch 请求子应用资源获取 html 资源信息，然后进行 html 模版解析
html 模版解析：

- 删除 html 上的注释。
- 找到 link 标签中有效的外部 css 引用的路径，并且把他变为绝对路径存入 styles 数组，提供给后面资源统一引入作为入口
- 找到 script 标签处理和 link css 类似。
- 最后把处理过后的模板，css 引用的入口数组，js 引用的入口数组进行返回

这里总结一下整个 importEntry 做了什么：

- 请求 html 模板，进行修改处理
- 请求 css 资源注入到 html 中
- 返回一个对象，对象的内容含有处理过后的 html 模板，通过提供获取 js 资源的方法 getExternalScripts，和执行获取到的 js 脚本的方法 execScripts。

------------ 原理 end ------------

##### 其他

1. qiankun 为什么需要将子应用输出为 umd

qiankun 架构下的子应用通过 webpack 的 umd 输出格式来做，让父应用在执行子应用的 js 资源时可以通过 eval，将 window 绑定到一个 Proxy 对象上，以此来防止污染全局变量，方便对脚本的 window 相关操作做劫持处理，达到子应用之间的脚本隔离。

2. single-spa 为什么需要重写 pushState 和 replaceState

因为 single-spa 是监听 popstate 和 hashchange 来加载子应用代码的，但是 pushState 和 replaceState 不会触发 popstate，Vue 框架是使用这两个 api 进行路由修改

##### 参考文献

[三大微前端框架，谁是你的理想型](https://juejin.cn/post/7309477710523269174?searchId=20240322153251168D5A7AB1AB4A0831DB#heading-4)
[微前端 qiankun 原理学习](https://www.cnblogs.com/synY/p/13969785.html?ivk_sa=1024320u)
[微前端 single-spa 原理学习](https://www.cnblogs.com/synY/p/13958963.html)
[legacySandbox 沙箱方案](https://zhuanlan.zhihu.com/p/658452336)
[hashchange 和 popstate 事件触发条件](https://blog.csdn.net/weixin_43856422/article/details/128287051)
[深入调研了微前端，还是 iframe 最香](https://juejin.cn/post/7244070072788287544?searchId=202412021438521D8E7092AB7DA3D2BD8D)
