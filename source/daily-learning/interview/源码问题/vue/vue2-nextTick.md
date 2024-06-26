### vue2-nextTick

在执行 vm.message = 'new message'时，会触发 Watcher 更新，watcher 会把自己放到一个队列：Watcher 的 update 方法执行 queueWatcher(this)

```js
export function queueWatcher (watcher: Watcher) {
  ...
  // 因为每次派发更新都会引起渲染，所以把所有 watcher 都放到 nextTick 里调用
  if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
}
```

这里参数 flushSchedulerQueue 方法就会被放入事件循环，主线程任务的行完后就会执行这个函数，对 watcher 队列排序、遍历、执行 watcher 对应的 run 方法，然后 render，更新视图

执行到 this.$nextTick(fn) 的时候，添加一个异步任务，这时的任务队列可以简单理解成这样 [flushSchedulerQueue, fn]
然后同步任务就执行完了，接着按顺序执行任务队列里的任务，第一个任务执行就会更新视图，后面自然能得到更新后的视图了

##### nextTick

1. 环境判断

主要是判断用哪个宏任务或微任务，因为宏任务耗费的时间是大于微任务的，所以成先使用微任务，判断顺序如下

- Promise
- MutationObserver
- setImmediate
- setTimeout

2. 代码执行

- 把传入的回调函数放进回调队列 callbacks
- 执行保存的异步任务 timeFunc，就会遍历 callbacks 执行相应的回调函数了

```js
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  callbacks.push(() => {
    cb();
  });
  if (!pending) {
    // 只有第一进入才会执行下面的timeFunc，因为pending变成true了，只有在异步执行完成后才会pending变成false
    pending = true;
    timerFunc(); // 异步执行callbacks里面的函数
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}
```

##### 其他问题

1. vue 的 nextTick 原理，为什么是先用 promise，mutationObserver 再用 setTimeout 和 setInterval

nextTick 优先使用微任务是因为如果使用宏任务，vue 的 batch（一个一个执行 nextTick 内部维护数组中的函数）这个操作会放在下一个宏任务中执行，当调用 nextTick 的 script 解析完之后马上要开始执行微任务，微任务后又是宏任务微任务，（这个中间可能执行了很多个其他宏任务）直到要执行的那个宏任务进行 batch，最后到 ui 渲染，batch 过程中 dom 元素变更的数据才最后体现在界面上。在真实浏览器环境中这个中间可能会做很多操作，而且真实环境很复杂，浏览器甚至可能有多个 task queue，这个间隔时间可能会很长。
如果使用微任务，vue 的 batch 操作会在 script 解析完后立即执行（因为 script 是一个宏任务），那么距离下一个 ui 渲染的时间会相对很短，避免了一些边界情况。

参考文献：
[https://www.cnblogs.com/burc/p/17267130.html]
[https://blog.csdn.net/vgub158/article/details/122690592]
