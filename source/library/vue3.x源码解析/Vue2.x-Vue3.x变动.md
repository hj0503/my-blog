### Vue2.x-Vue3.x变动

##### v-for和v-if优先级变动

Vue2.x: `v-for`优先级高于`v-if`，写在一起会造成资源浪费，虽然有`v-if`，但是还是先渲染出来了
Vue3.x: `v-if`优先级高于`v-for`，写在一起会抛出异常，因为此时并没有当前循环的值

#### v-model和.sync

`.sync`在Vue3.x中被废除，可以使用`v-model`实现`.sync`功能，可以在组件上使用多个`v-model`
```js
<custom-component v-model:attrName1="value1" v-model:attrName2="value2"></custom-component>
```