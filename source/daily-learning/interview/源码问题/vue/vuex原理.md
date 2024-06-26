### Vuex 原理

1. 将 store 挂注入到组件中

```js
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {},
  // ....
});
new Vue({
  el: '#app',
  router,
  store, // 把store对象添加到vue实例上，就可以通过$options.store访问到
});
```

Vue.use(Vuex)，当安装 Vuex 插件时，Vuex 对象中会有 install 方法供 Vue 安装该插件，install 方法中就是 Vuex 初始化过程，首先会拿到 Vue，接下来通过全局 mixin 混入 vuexInit，往每一个组件实例上混入 beforeCreate 钩子函数：Vue.mixin({ beforeCreate: vuexInit })，然后往组件实例上添加一个 .$store 的实例，它指向的就是我们实例化的 store，因此我们可以在组件中访问到 store 的任何属性和方法

2. Vuex 的 state 和 getters 映射到各个组件实例中变成响应式数据

```js
// 利用vue的能力，做响应式
// 使用Vue实例来存储Vuex的state状态树，并利用computed去缓存getters返回的值
store._vm = new Vue({
  data: {
    $$state: state,
  },
  computed,
});
```

data 选项里定义了 $$state 属性，而我们访问 store.state 的时候，实际上会访问 Store 类上定义的 state 的 get 方法

```js
get state () {
   return this._vm._data.$$state
 }
```

参考文献：
[vuex源码解析](https://zhuanlan.zhihu.com/p/481358879)
