### diff 算法

#### 源码地址

`packages/runtime-core/src/renderer.ts`里面的`patchKeyedChildren`函数

#### diff 算法分成几个步骤

- 同步头部节点
- 同步尾部节点
- 添加新的节点
- 删除多余节点
- 处理未知子序列
- 移动子节点
- 建立索引图
- 更新和移除旧节点
- 移动和挂载新节点
- 最长递增子序列
