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

`VueRouter` 的实现是⼀个类，我们先对它做⼀个简单地分析，它的定义在 `src/index.js` 中：
