---
title: vue3.0使用篇
date: 2020-12-05 21:02:06
tags:
  - vue
  - 前端
categories: vue
cover: https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHq6k6758eEZYHtrA3PDWKrhOr7JDjuVxdic6Pia3Aa5BSglRDlDFPLJM00tvkN1N565e2j3c4hjQib7Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1
---

## 一、vue3.0 重要的优化

- 模板编译速度的提升，对静态数据的跳过处理
- 对数组的监控
- 对 ts 有了很好的支持
- 对 2.x 版本的完全兼容

## 二、Composition API

### 为什么需要 Composition API

> 1. 更好的逻辑复用以及代码组织
> 2. 更好的类型推断

### Composition API 几大要点

- setup
- ref
- reactive
- watch & watchEffect
- computed
- 生命周期钩子
- 模块化

#### 1、setup

- 调用动机
  创建组件实例，然后初始化`props`，紧接着就调用`setup`函数。从生命周期钩子的视角来看，它会在`beforeCreate`钩子之前被调用
- 有两个可选参数
  - props - 属性
  - context - 上下文对象，用于代替以前的 this

#### 2、reactive

接收一个普通对象然后返回该普通对象的响应式代理

```javascript
setup() {
  const obj = reactive({
    name: "张三",
    age: 24,
  });
  function addAge() {
    obj.age++;
  }
  return {
    obj, // 在template中需要obj来获取来调取 {{ obj.name }}
    ...obj, // 不能使用扩展运算符，会失去响应式
    ...toRefs(obj), // 将响应式数据对象转换为单一响应式对象
    addAge
  };
},
```

#### 3、ref

接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性`.value`

```javascript
setup() {
  const count = ref(0);
  function addCount() {
    count.value++;
  }
  return { count, addCount } // 在模板中使用不需要.value，会自动解构
},
```

> 如果传入 ref 的是一个对象，将调用 reactive 方法进行深层响应转换

#### 4、选择 reactive 还是 ref

与我们所习惯的编码风格密切相关，可以两者都尝试

```javascript
setup() {
  // 单个对象
  const pos = reactive({ x: 0, y: 0 })
  function mousePosition(e) {
    pos.x = e.pageX
    pos.y = e.pageY
  }
  // 将变量分离
  const xRef = ref(0)
  const yRef = ref(0)
  function mousePosition(e) {
    xRef.value = e.pageX
    xRef.value = e.pageY
  }
}
```

> 使用`reactive`时，使用组合函数必须始终保持对这个所返回对象的引用以保持响应性。这个对象不能被解构或展开

#### 5、computed

与 vue2.x 类似，可以定义可更改的计算属性

```javascript
setup() {
  const count = ref(1);
  // 传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象
  const plusOne = computed(() => {
    return count + 1
  })

  // 传入一个拥有 get 和 set 函数的对象，创建一个可手动修改的计算状态
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1;
    },
  });
  plusOne.value = 1;
  return { plusOne }
},
```

#### 6、watch & watchEffect

```javascript
setup() {
  const count = ref(0);
  const count1 = ref(1);

  // watchEffect传入的函数中所依赖的响应式对象监听
  watchEffect(() => {
    console.log(count.value);
  });

  // 指定响应式对象监听，第一次绑定时不会执行
  watch(count, (newVal, oldVal) =>
    console.log("watch count", newVal, oldVal)
  ); // 打印0

  // 指定响应式对象监听，第一次绑定时执行
  watch(
    count,
    (newVal, oldVal) => {
      console.log("watch count:", newVal, oldVal);
    },
    {
      immediate: true,
    }
  );

  // 多响应式对象监听
  watch([count, count1], ([newCount, newCount1], [oldCount, oldCount1]) => {
    console.log("watch count:", newCount, newCount1, oldCount, oldCount1);
  });

  setTimeout(() => {
    count.value++; // 打印1
  }, 3000);
},
```

> 当 watch 函数不传指定的响应式对象时，效果和 watchEffect 一样

#### 7、生命周期钩子

- 与 2.x 版本生命周期相对应的组合式 API
  | Vue2 | Vue3 |
  | ---- | ---- |
  | ~~beforeCreate~~ | setup |
  | ~~created~~ | setup |
  | beforeMount | onBeforeMount |
  | mounted | onMounted |
  | beforeUpdate | onBeforeUpdate |
  | updated | onUpdated |
  | beforeDestroy | onBeforeUnmount |
  | destroyed | onUnmounted |
  | errorCaptured | onErrorCaptured |
  | | onRenderTracked |
  | | onRenderTriggered |
- 新增的`onRenderTracked`、`onRenderTriggered`生命周期函数都会接收一个参数`DebuggerEvent`，返回组件更新的信息
- 进行`Vue2.x`和`Vue3.x`混用时，生命周期函数执行顺序

  ```javascript
  1. setup
  2. beforeCreate
  3. data
  4. created
  5. onBeforeMount
  6. beforeMount
  7. onMounted
  8. mounted
  9. onBeforeUpdate
  10. beforeUpdate
  11. onUpdated
  12. updated
  13. onBeforeUnmount
  14. beforeDestroy
  15. onUnmounted
  16. destroyed
  ```

  > `Vue3.x`的生命周期函数会比相对应的`Vue2.x`的先执行
  > `Vue2.x`中，写多个同样的生命周期函数，后面的会覆盖前面的，`Vue3.x`中，写多个同样的生命周期函数，会依次执行

### Composition API 实战

以最常见的请求后端接口为例子。这个例子中会包含请求的 api 函数、返回结果（请求结果以及状态）

1. 创建一个`use`的文件，编写一个公共函数`usePromise`

```javascript
import { ref, reactive, toRefs } from "vue";

export default function usePromise(fn) {
  const results = ref(null); // 请求返回的结果
  const loading = ref(false); // 执行的状态
  const error = ref(null); // 错误信息

  const createPromise = async (...args) => {
    loading.value = true;
    error.value = null;
    results.value = null;
    try {
      results.value = await fn(...args);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };
  return { results, loading, error, createPromise };
}
```

2. 创建一个`api`文件，编写一个请求函数`getEventCount`

```javascript
export default function getEventCount() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = Math.floor(Math.random() * 10);
      if (data > 5) {
        reject("error info");
      }
      resolve(data);
    }, 1000);
  });
}
```

3. 在组件中使用
   使用 watch 监听 input 中值的变化，当 input 中值变化时发送请求，拿到请求结果以及请求状态进行展示

```javascript
<template>
  <div>
    <input type="text" v-model="searchInput">
    <div>
      <p>Loading: {{ loading }}</p>
      <p>Error: {{ error }}</p>
      <p>results: {{ results }}</p>
    </div>
  </div>
</template>

<script>
import usePromise from '../use/usePromise'
import getEventCount from '../api/getEventCount'
import { watch, ref } from 'vue'
export default {
  name: "ModuleDemo",
  setup() {
    const searchInput = ref("");
    const getEvents = usePromise(getEventCount);
    watch(searchInput, () => {
      if (searchInput.value !== "") {
        getEvents.createPromise(searchInput);
      } else {
        getEvents.results.value = null;
      }
    });

    return { searchInput, ...getEvents };
  },
};
</script>
```

## 三、Teleport - 传送门

将指定的模板节点渲染到特定的容器上，非常有助于实现 modal、toast 等全局模块
`Teleport`具有一个必需的属性`to`,可以是：

- 元素的 ID `<teleport to="#id">`
- 元素的 class `<teleport to=".class">`
- data 选择器 `<teleport to="[data-modal]">`
- 响应式查询字符串 `<teleport :to="reactiveProperty">`

## 四、Suspense - 悬念

Loading 效果实现，当我们加载后端数据时，通常在等待接口返回结果时显示 loading，一般我们会使用`v-if`和`v-else`来控制。还会有这样的场景，在一个组件树中，其中几个子组件需要加载后端数据，当加载完成前父组件应该处于 loading 状态，这时就需要借助全局状态管理来管理 loading 状态
在`Vue3.0`中我们可以通过`Suspense`解决这个问题

- 将异步组件包装在`<template #default>`标签中
- 将 loading 组件包装在`<template #fallback>`标签中
- 这里的异步组件说的是将`setup`设置成异步

1. 父组件

```javascript
<template>
  <Suspense>
    <template #default>
      <article-info></article-info>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import ArticleInfo from './ArticleInfo.vue'
export default {
  name: 'ArticlePost',
  components: { ArticleInfo }
};
</script>
```

2. 子组件

```javascript
<script>
import { ref } from "vue";
async function getArticleInfo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([1, 2, 3, 4]);
    }, 1000);
  });
}
export default {
  name: "ArticleInfo",
  async setup() {
    const data = ref([]);
    data.value = await getArticleInfo();
    return { data };
  },
};
</script>
```
