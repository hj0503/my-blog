### diff 算法

- 比较只会在同层级进行, 不会跨层级比较
- 在 `diff` 比较的过程中，循环从两边向中间比较(双端比较)

#### 触发节点更新

当数据发生改变时，会调用`patch`进行打补丁，更新响应的试图

#### patch

- 没有新节点，直接触发旧节点的`destory`钩子删除该节点
- 没有旧节点，说明是页面刚开始初始化的时候，此时，根本不需要比较了，直接创建新节点，所以只调用 `createElm`
- 旧节点和新节点自身一样，通过 `sameVnode` 判断节点是否一样，一样时，直接调用 `patchVnode`去处理这两个节点
- 旧节点和新节点自身不一样，当两个节点不一样的时候，直接创建新节点，删除旧节点

#### patchVnode

- 新节点是否是文本节点，如果是，则直接更新 `DOM` 的文本内容为新节点的文本内容
- 新节点和旧节点如果都有子节点，则处理比较更新子节点
- 只有新节点有子节点，旧节点没有，那么不用比较了，所有节点都是全新的，所以直接全部新建就好了，新建是指创建出所有新 `DOM`，并且添加进父节点
- 只有旧节点有子节点而新节点没有，说明更新后的页面，旧节点全部都不见了，那么要做的，就是把所有的旧节点删除，也就是直接把 `DOM` 删除
- 新旧子节点都存在，并且子节点不完全一致，则调用 `updateChildren`，这个里面就是`diff`算法的核心

#### updateChildren

while 循环进行判断:

- 当新老 `VNode` 节点的 `start` 相同时，直接 `patchVnode` ，同时新老 `VNode` 节点的开始索引都加 1
- 当新老 `VNode` 节点的 `end` 相同时，同样直接 `patchVnode` ，同时新老 `VNode` 节点的结束索引都减 1
- 当老 `VNode` 节点的 `start` 和新 `VNode` 节点的 `end` 相同时，这时候在 `patchVnode` 后，还需要将当前真实 `dom` 节点移动到 - `oldEndVnode` 的后面，同时老 `VNode` 节点开始索引加 1，新 `VNode` 节点的结束索引减 1
- 当老 `VNode` 节点的 `end` 和新 `VNode` 节点的 start 相同时，这时候在 `patchVnode` 后，还需要将当前真实 `dom` 节点移动到 - `oldStartVnode` 的前面，同时老 `VNode` 节点结束索引减 1，新 `VNode` 节点的开始索引加 1

如果都不满足以上四种情形，那说明没有相同的节点可以复用，则会进行下面的步骤

- 遍历旧的一组子节点，尝试找出与新的一组子节点的头部节点具有相同`key`值的节点(`idxInOld`)
- 如果 `idxInOld`不存在，说明`newStartVnode`为新节点，新建
- 如果 `idxInOld`存在，比较具有相同`key`新旧节点是否为相同节点，如果相同则进行`patch`和移动，如果`key`相同节点不同则新建节点

循环结束后发现还有节点进行新增或者删除节点多余节点操作

```js
if (oldStartIdx > oldEndIdx) {
  refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
  addVnodes(
    parentElm,
    refElm,
    newCh,
    newStartIdx,
    newEndIdx,
    insertedVnodeQueue
  );
} else if (newStartIdx > newEndIdx) {
  removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
}
```

#### 参考文献

[Vue2.0 和 Vue3.0 Dom Diff 对比](https://blog.csdn.net/qq_34629352/article/details/122163072)
[vue 中的 diff 算法](https://blog.csdn.net/weixin_43638968/article/details/112686317)
[为什么 Vue 中不要用 index 作为 key](https://juejin.cn/post/6844904113587634184#heading-9)
