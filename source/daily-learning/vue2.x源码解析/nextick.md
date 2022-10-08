### nextTick

nextTick 中申明了 microTimerFunc 和 macroTimerFunc 2 个变量，它们分别对应的是 micro task 的函数和 macro task 的函数。对于 macro task 的实现，优先检测是否⽀持原⽣ setImmediate ， 这是⼀个⾼版本 IE 和 Edge 才⽀持的特性，不⽀持的话再去检测是否⽀持原⽣的 MessageChannel ， 如果也不⽀持的话就会降级为 setTimeout 0 ；⽽对于 micro task 的实现，则检测浏览器是否原⽣⽀ 持 Promise，不⽀持的话直接指向 macro task 的实现。

next-tick.js 对外暴露了 2 个函数，先来看 nextTick ，这就是我们在上⼀节执⾏ nextTick(flushSchedulerQueue) 所⽤到的函数。它的逻辑也很简单，把传⼊的回调函数 cb 压⼊ callbacks 数组，最后⼀次性地根据 useMacroTask 条件执⾏ macroTimerFunc 或者是 microTimerFunc ，⽽它们都会在下⼀个 tick 执⾏ flushCallbacks ， flushCallbacks 的逻辑⾮ 常简单，对 callbacks 遍历，然后执⾏相应的回调函数。

这⾥使⽤ callbacks ⽽不是直接在 nextTick 中执⾏回调函数的原因是保证在同⼀个 tick 内多次执 ⾏ nextTick ，不会开启多个异步任务，⽽把这些异步任务都压成⼀个同步任务，在下⼀个 tick 执⾏ 完毕。

nextTick 函数最后还有⼀段逻辑：

```javascript
if (!cb && typeof Promise !== 'undefined') {
  return new Promise(resolve => {
    _resolve = resolve;
  });
}
```

这是当 nextTick 不传 cb 参数的时候，提供⼀个 Promise 化的调⽤，⽐如：

```javascript
nextTick().then(() => {});
```

当 \_resolve 函数执⾏，就会跳到 then 的逻辑中。

next-tick.js 还对外暴露了 withMacroTask 函数，它是对函数做⼀层包装，确保函数执⾏过程中 对数据任意的修改，触发变化执⾏ nextTick 的时候强制⾛ macroTimerFunc 。⽐如对于⼀些 DOM 交互事件，如 v-on 绑定的事件回调函数的处理，会强制⾛ macro task。
