### Vue-Router

#### 简介

⽀持 `hash` 、 `history` 、 `abstract` 3 种路由⽅式，提供了 `<router-link>` 和 `<router-view>` 2 种组件，还提供了简单的路由配置和⼀系列好⽤的 API。

#### Vue.use(VueRouter)

Vue 提供了 Vue.use 的全局 API 来注册这些插件，所以我们先来分析⼀下它的实现原理，定义在 vue/src/core/global-api/use.js 中：

```javascript
Vue.use = function (plugin: Function | Object) {
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = [ ]))
  if (installedPlugins.indexOf(plugin) > -1) {
     return this
  }
  const args = toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin) return this
}
```

`Vue-Router` 其实就是 `Vue` 的一个插件，提供静态的 `install` 方法
`Vue-Router` 的 `install` 方法会给每个组件注入 `beforeCreated` 和 `destroyed` 钩子函数(通过 `Vue.mixins`)，在 `beforeCreated` 做一些私有属性定义和路由初始化工作

```javascript
export let _Vue;
export function install(Vue) {
  if (install.installed && _Vue === Vue) return (install.installed = true);
  _Vue = Vue;
  const isDef = v => v !== undefined;
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode;
    if (
      isDef(i) &&
      isDef((i = i.data)) &&
      isDef((i = i.registerRouteInstance))
    ) {
      i(vm, callVal);
    }
  };
  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed() {
      registerInstance(this);
    },
  });
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router;
    },
  });
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route;
    },
  });
  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);
  const strats = Vue.config.optionMergeStrategies;
  strats.beforeRouteEnter =
    strats.beforeRouteLeave =
    strats.beforeRouteUpdate =
      st;
  rats.created;
}
```

`Vue-Router` 安装最重要的⼀步就是利⽤ `Vue.mixin` 去把 `beforeCreate` 和 `destroyed` 钩⼦函数 注⼊到每⼀个组件中。 `Vue.mixin` 的定义，在 `vue/src/core/global-api/mixin.js` 中：

```javascript
export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
```

#### Vue-Router 对象

`VueRouter` 的实现是⼀个类，我们先对它做⼀个简单地分析，它的定义在 `src/index.js` 中
`VueRouter` 定义了⼀些属性和⽅法，我们先从它的构造函数看，当我们执⾏ `new VueRouter` 的时 候做了哪些事情。

- this.app 表⽰根 Vue 实例
- this.apps 保存所有⼦组件的 Vue 实例
- this.options 保存传⼊的路由配置
- this.beforeHooks 、 this.resolveHooks 、 this.afterHooks 表⽰⼀些钩⼦函数
- this.matcher 表⽰路由匹配器
- this.fallback 表⽰路由创建失败的回调函数
- this.mode 表⽰路由创建的模式
- this.history 表⽰路由历史的具体的实现实例，它是根据 this.mode 的不 同实现不同，它有 History 基类，然后不同的 history 实现都是继承 History

实例化 `VueRouter` 后会返回它的实例 `router` ，我们在 `new Vue` 的时候会把 `router` 作为配置 的属性传⼊，回顾⼀下上⼀节我们讲 `beforeCreated` 混⼊的时候有这么⼀段代码：

```javascript
beforeCreated() {
  if (isDef(this.$options.router)) {
    // ...
    this._router = this.$options.router;
    this._router.init(this);
    // ...
  }
}
```

所以每个组件在执⾏ `beforeCreated` 钩⼦函数的时候，都会执⾏ `router.init` ⽅法
`init` 的逻辑很简单，它传⼊的参数是 `Vue` 实例，然后存储到 `this.apps` 中；只有根 `Vue` 实例 会保存到 `this.app` 中，并且会拿到当前的 `this.history` ，根据它的不同类型来执⾏不同逻辑
