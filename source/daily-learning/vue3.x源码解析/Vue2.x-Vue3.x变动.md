### Vue2.x-Vue3.x 变动

##### v-for 和 v-if 优先级变动

Vue2.x: `v-for`优先级高于`v-if`，写在一起会造成资源浪费，虽然有`v-if`，但是还是先渲染出来了
Vue3.x: `v-if`优先级高于`v-for`，写在一起会抛出异常，因为此时并没有当前循环的值

#### v-model 和.sync

`.sync`在 Vue3.x 中被废除，可以使用`v-model`实现`.sync`功能，可以在组件上使用多个`v-model`

```js
<custom-component
  v-model:attrName1="value1"
  v-model:attrName2="value2"
></custom-component>
```

#### v-for的ref数组

vue3不再在$ref中创建数组。要从单个绑定获取多个ref，需要给ref绑定到函数上，在函数中给数组添加值

#### 新增emits选项

vue3 目前提供一个emits选项，和现有的props选项类似，这个选项可以用来定义组件可以向其父组件触发的事件，需要知道的是，任何没有声明emits的事件监听器都会被算入组件的$attrs并绑定在组件的根节点上面。




