### diff 算法

#### 源码地址

`packages/runtime-core/src/renderer.ts`里面的`patchKeyedChildren`函数

#### diff 算法分成几个步骤

1. 同步头部节点
2. 同步尾部节点
3. 添加新的节点
4. 删除多余节点
5. 处理未知子序列
   1. 移动子节点
   2. 建立索引图
   3. 更新和移除旧节点
   4. 移动和挂载新节点
6. 最长递增子序列
