### 面试-响应式原理

1. 把 data 中的数据变成响应式，主要是 observe 方法

在 Vue 的初始化阶段，执行 initState(vm)中的 initData(vm)，initData 最后会执行 observe(data)，observe 中执行 new Observe(data)，Observer 是⼀个类，它的作⽤是给对象的属性添加 getter 和 setter，⽤于依赖收集和派发更新。

Observer 中会对 value 做判断，对于数组会调⽤ observeArray ⽅法，否则对纯对象调⽤ walk ⽅法。可以看到 observeArray 是遍历数组再次调⽤ observe ⽅法，⽽ walk ⽅法是遍历对象的 key 调⽤ defineReactive ⽅法

defineReactive 的功能就是定义⼀个响应式对象，使用 Object.defineProperty 给对象动态添加 getter 和 setter；首先会有闭包 const dep = new Dep()，然后对⼦对象递归调⽤ observe ⽅法，让整个 data 对象中的所有属性都变成响应式

> 注意：数组的元素为基本类型时不会被变成响应式数据(性能原因 vue 没有这样做)，并且 vue 重写了数组的几个方法使其可以响应式

2. 依赖收集，Dep 类进行依赖收集，收集的是 Watcher

访问数据时（组件初始化时会实例化⼀个渲染 watcher，把 Dep.target 赋值为当前的渲染 watcher，然后会先执⾏ vm.\_render() ⽅法，因为之前分析过这个⽅法会⽣成 渲染 VNode，并且在这个过程中会对 vm 上的数据访问，这个时候就触发了数据对象的 getter），会触发 getter，

getter 中进行依赖收集(dep.depend())，Dep 是⼀个 Class，它定义了⼀些属性和⽅法，这⾥需要特别注意的是它有⼀个静态属性 target ，这是⼀个全局唯⼀ Watcher ，这是⼀个⾮常巧妙的设计，因为在同⼀时间只能有⼀个全局的 Watcher 被计算，所以 dep.depend 方法可以直接收集到当前的 Watcher，Dep 实际上就是对 Watcher 的⼀种管理

3. 派发更新

当数据发⽣变化的时候，触发 setter 逻辑，把在依赖过程中订阅的的所有观察者，也就是 watcher ，都触发它们的 update 过程，这个过程⼜利⽤了队列做了进⼀步优化，在 nextTick 后执⾏所有 watcher 的 run ，最后执⾏它们的回调函数

4. 监听数组的变化

4.1 Object.defineProperty 可以监听数组的 index 变化，但是因为性能没这么做，需要像对象添加新属性一样用 this.$set

```js
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto); // 继承数组Array
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
];
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {  // 新增元素的几个方法需要给新的元素变成响应是数据
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // 手动通知更新
    ob.dep.notify();
    return result;
  });
});
```

5. $set 原理

```js
export function set(target: Array<any> | Object, key: any, val: any): any {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    //  target 是数组且 key 是⼀个合法的下标，则直接通过 splice 去添加进数组然后返回
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  const ob = target.__ob__;
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val); // 新添加的属性变成响应式对象
  ob.dep.notify(); // 手动通知更新
  return val;
}
```

#### 其他注意点

1. [在 observer/index.js 中 Observer 的 new Dep 和 defineReactive 中的 dep 有啥差异](https://www.jb51.net/article/266357.htm)

- defineReactive 中的 dep 用于由对象本身修改而触发 setter 函数导致闭包中的 Dep 通知所有的 Watcher 对象。
- Observer 的 dep 则是在对象本身增删属性或者数组变化的时候被触发的 dep，手动调用 ob.dep.notify()，因为会给 a 添加一个\_\_ob\_\_对象，并且我们在 Observer 构造函数定义了 this.dep = new Dep()，我们就可以执行 childOb.dep.depend() 做依赖收集
