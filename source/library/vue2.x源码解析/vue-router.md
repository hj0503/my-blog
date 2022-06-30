### VueRouter

### Vue.use(VueRouter)

Vue-Router 其实就是 Vue 的一个插件，提供静态的 install 方法
Vue-Router 的 install 方法会给每个组件注入 beforeCreated 和 destroyed 钩子函数(通过 Vue.mixins)，在 beforeCreated 做一些私有属性定义和路由初始化工作
