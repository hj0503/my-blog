### vue-router 原理

1. 路由注册

Vue.use(VueRouter)，当安装 VueRouter VueRouter 对象中会有 install 方法供 Vue 安装该插件，install 方法中就是 VueRouter 初始化过程
利⽤ Vue.mixin 去把 beforeCreate 和 destroyed 钩⼦函数注⼊到每⼀个组件中，并且给 Vue 原型上定义了 $router 和 $route 2 个属性的 get ⽅法，这就是为什么我们可以在组件实例上可以访问 this.$router 以及 this.$route

2. 几种路由模式

- hash 路由，通过监听 hashchange 实现路由变化。改变hash值不会重新加载页面
- history 路由，通过监听 onpopstate 实现路由变化，pushState 向历史记录中追加一条记录，replaceState 替换当前页在历史记录中的信息。对历史记录修改，虽然改变了当前URL，但是浏览器不会向服务器发送请求
