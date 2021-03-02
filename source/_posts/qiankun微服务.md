---
title: qiankun微服务
date: 2021-01-10 10:20:21
tags:
  - 微服务
categories: 前端
cover: ../images/qiankun.png
---

### 一、qiankun 介绍

#### 1.1 主应用中注册子应用

```javascript
import { registerMicroApps, start } from 'qiankun';
registerMicroApps([
  {
    name: 'react app', // 微应用名称，必须确保唯一
    entry: '//localhost:7100', // 微应用的入口（微应用项目地址）
    container: '#yourContainer', // 微应用容器节点选择器或者Element实例
    activeRule: '/yourActiveRule', // 微应用激活规则
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);
start(); // 启动qiankun
```

#### 1.2 导出相应的生命周期钩子

```javascript
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}
/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(
    <App />,
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root')
  );
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root')
  );
}
/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
```

### 数据中台 Vue 中使用 qiankun

#### 1.1 使用流程

1. 通过接口获取所有微应用信息（本地开发时通过配置覆盖接口中拿到的微应用信息），动态生成路由，所有的子应用都挂载在`src/micro-apps/component.vue`的组件中，

2. 通过`registerMicroApps`注册子应用， 在`component.vue`中的`beforeCreate`生命周期中启动`qiankun`

3. 子应用注册完成后，当浏览器 url 发生变化时，会触发匹配规则`activeRule`，所有匹配上的子应用都会被挂载到指定的`container`中

4. 子应用中的`main.js`(入口文件)中导出 bootstrap、mount、unmount 三个生命周期

   1. bootstrap，全局变量初始化，只调用一次（以 gtag 为例子）

      ```javascript
      export async function bootstrap(props = {} as any) {
        const { data, methods, lifeCycles } = props;
        // 数据注入
        if (data) {
          Object.keys(data).forEach(key => (Vue.prototype[key] = Vue.prototype["$" + key] = data[key]));
        }
        // 方法注入
        if (methods && Array.isArray(methods)) {
          methods.forEach(method => (Vue.prototype[method.name] = method[method.name]));
        }
        // 通过 bootstrap 告知父应用路由
        if (lifeCycles && lifeCycles.bootstrap) {
          lifeCycles.bootstrap({ routerList });
        }
      }
      ```

   2. mount，子应用挂载时，qiankun 每次都会调用（以 gtag 为例子）

      ```javascript
      // 子应用挂载时，qiankun 会调用
      export async function mount(props) {
        const { data = {} } = props;
        const router = createRouter(props);

        new VueInstance(() => {
          return new Vue({
            router,
            store,
            data: () => ({ ...data }),
            render: h => h(App),
          }).$mount('#app');
        });
      }
      ```

   3. unmount，子应用卸载时，qiankun 每次都会调用（以 gtag 为例子）

      ```javascript
      export async function unmount() {
        const instance = new VueInstance();
        instance.destroy();
        // TODO destroy Message Instance
      }
      ```
## 是否有性能问题
