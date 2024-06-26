### vue3-nextTick

```js
const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any>
let currentFlushPromise: Promise<void> | null = null
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
```

主要是看 currentFlushPromise，currentFlushPromise 就是当前渲染组件存储的队列 promise。Dom 更新的任务一定是在 nextTick 创建出来的微任务之前的。

setupRenderEffect: 组件更新的函数，里面在创建 ReactiveEffect 实例的时候除了传入了更新组件的函数之外，还传入了 () => queueJob(update)，update 方法是执行更新，这个时候就开始往队列里面添加更新函数，并且存储在 currentFlushPromise(currentFlushPromise = resolvedPromise.then(flushJobs))中 利用 promise 异步更新

参考文献：
[https://juejin.cn/book/7146465352120008743/section/7156100789889400843]
