### 面试-diff 算法

1. 双端比较

双端比较中，每一轮都分为四个步骤：

newStartIdx = 0
newEndIdx = newChildren.length - 1
oldStartIdx = 0
oldEndIdx = oldChildren.length - 1
newStartVNode = newChildren[newStartIdx]
newEndVNode = newChildren[newEndIdx]
oldStartVNode = newChildren[oldStartIdx]
oldEndVNode = newChildren[oldEndIdx]

- 第一步: 比较新的一组节点中的第一个节点和旧的一组节点中的第一个节点，相同的话复用，并且 newStartIdx++、oldStartIdx++，不同的话进入下一步
- 第二步: 比较新的一组节点中的最后一个节点和旧的一组节点中的最后一个节点，相同的话复用，并且 newEndIdx--、oldEndIdx--，不同的话进入下一步
- 第三步: 比较新的一组节点中的最后一个节点和旧的一组节点中的第一个节点，相同的话复用，并且移动旧节点中的第一个到最后面(oldStartVNode.el 移动到 oldEndVNode.el 后面)，并且 newEndIdx--、oldStartIdx++，
- 第四步: 比较新的一组节点中的第一个节点和旧的一组节点中的最后一个节点，相同的话复用，并且移动旧节点中的最后一个到最前面(oldEndVNode.el 移动到 oldStartVNode.el 前面)，并且 newStartIdx++、oldEndIdx--

2. 非理想情况下

如果上面四步都没命中，则遍历旧的一组节点，找到与新的一组节点中的第一个节点 newStartVNode 相同的节点的索引(idxInOld)，如果 idxInOld 大于 0 说明找到了，此时移动 oldChildren[idxInOld].el 到 oldStartVNode.el 前面，如果 idxInOld 为-1，说明没找到，此时这个节点为新增节点，并且这两种情况都要 newStartIdx++。

3. 其他需要新增节点和删除节点的情况

上面几种情况完成后(循环结束后)，还有可能有新增节点或者删除节点的情况:

```js
if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
  // 说明有新的节点遗留，需要挂载
  for (let i = newStartIdx; i <= newEndIdx; i++) {
    patch();
  }
} else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
  // 说明有旧的节点遗留，需要删除
  for (let i = oldStartIdx; i <= oldEndIdx; i++) {
    unmount();
  }
}
```

> 注意: 每次 newStartIdx、newEndIdx 等这些修改时也要更新对应的 newStartVNode 这些

#### 参考文献

[Vue2.0 和 Vue3.0 Dom Diff 对比](https://blog.csdn.net/qq_34629352/article/details/122163072)
[vue 中的 diff 算法](https://blog.csdn.net/weixin_43638968/article/details/112686317)
[为什么 Vue 中不要用 index 作为 key](https://juejin.cn/post/6844904113587634184#heading-9)
[在 Vue 中为什么不推荐用 index 做 key](https://juejin.cn/post/7026119446162997261#heading-8)
