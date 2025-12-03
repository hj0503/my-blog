### 面试-响应式原理

#### 组件初始化

组件挂载时会执行 mountComponent 函数，该函数里面会设置并执行带副作用的渲染函数 setupRenderEffect，该函数会触发组件的首次渲染，渲染时如果用到了响应式数据则进行依赖收集: const effect = new ReactiveEffect(componentUpdateFn)

调用 ReactiveEffect 并且执行 effect.run 触发组件的首次渲染，run 函数执行时会把全局 activeEffect = this(当前的 reactiveEffect)。组件渲染时如果用到了响应式数据则进行依赖收集

#### reactive

reactive 函数会返回一个代理对象，当访问代理对象的属性时会触发 get 拦截器，当设置代理对象的属性时会触发 set 拦截器

依赖收集的数据结构为: `targetMap: WeakMap<target, Map<key, Set<effect>>>`，其中 target 是响应式对象，key 是属性名，effect 是副作用函数（组件渲染函数）

1. 派发更新

```js
function triggerEffect(
  effect: ReactiveEffect,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler(); // 调度执行 () => queueJob(update)
    } else {
      effect.run();
    }
  }
}
```

##### 注意项：

1. 分支切换与 cleanup

```js
// 依赖收集时，双向收集
dep.add(activeEffect!)
activeEffect!.deps.push(dep) // 将dep栈添加到effect.deps数组中，让effect知道它被哪些属性依赖了

effect(function effectfn() {
  dcoument.body.innerText = obj.ok ? obj.text : 'not';
});

// 不做处理的话obj.ok为false时，并且obj.text修改时也会被更新组件
// 需要通过cleanup函数，副作用函数执行时，把它从所有与之关联的依赖集合中删除
```

2. 嵌套的 effect 与 effect 栈

effectStack 模拟栈(先进后出)存储所有嵌套的副作用函数，每次 activeEffect 都等于最后一个，执行完当前的 effect 后删除最后一个

#### ref

> 注意：ref 中的依赖直接保存到了 ref 对象上的 dep 属性中，reactive 中保存到了全局的 targetMap；如果 ref 传入的是对象，则处理逻辑变成通过 reactive 实现

3. 数组特殊处理

```js
function createArrayInstrumentations() {
  const instrumentations: Record<string, Function> = {}
  // 这几个方法this是代理对象，有可能会查找不到，所以需要使用原始值再查找一次，比如：
  // const obj = {}; const arr = reactive([obj])
  ;(['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      const arr = toRaw(this) as any
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, TrackOpTypes.GET, i + '')
      }
      // we run the method using the original args first (which may be reactive)
      const res = arr[key](...args)
      if (res === -1 || res === false) {
        // if that didn't work, run it again using raw values.
        return arr[key](...args.map(toRaw))
      } else {
        return res
      }
    }
  })
  // 这几个方法会读取数组的length和设置数组的length属性值，导致两个独立的副作用函数互相影响，无限循环track和trigger
  // 所以就用pauseTracking()禁用依赖收集，触发方法后，再用resetTracking()恢复track
  ;(['push', 'pop', 'shift', 'unshift', 'splice'] as const).forEach(key => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      pauseTracking()
      const res = (toRaw(this) as any)[key].apply(this, args)
      resetTracking()
      return res
    }
  })
  return instrumentations
}
```

#### ref

```js
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value) // value为对象时，需要处理成reactive
  }

  get value() {
    trackRefValue(this) // ref中的相关依赖直接保存到ref中的dep属性上
    return this._value
  }

  set value(newVal) {
    const useDirectValue =
      this.__v_isShallow || isShallow(newVal) || isReadonly(newVal)
    newVal = useDirectValue ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = useDirectValue ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

#### 和 vue2 的响应式原理有什么区别

1. vue2 是基于 Object.defineProperty 实现的响应式，vue3 是基于 Proxy 实现的响应式
2. vue2 只能监听对象的属性，不能监听数组的变化，vue3 可以监听数组的变化
3. vue2 中需要通过 $set 或 $delete 才能监听数组的变化，vue3 中不需要
4. vue3 中只有在在对象属性被访问的时候才会判断子属性的类型，来决定要不要递归执行 reactive

#### 参考

1. [Vue3 源码解析之 reactive](https://juejin.cn/post/7303594200809783359?searchId=2025120311020957A2406079D43559FEB6)
2. [手写简单 vue3 响应式原理](https://juejin.cn/post/7134281691295645732?searchId=202512031054293C24F56C1CA6EB370D05)
