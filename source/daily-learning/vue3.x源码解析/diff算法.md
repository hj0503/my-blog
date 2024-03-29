### diff 算法

diff 算法：通过对比新旧节点进行`添加`、`删除`、`打补丁`、`移动`四个行为来完成节点的更新

#### 源码地址

`packages/runtime-core/src/renderer.ts`里面的`patchKeyedChildren`函数

#### diff 算法分成几个步骤

1. 同步头部节点
2. 同步尾部节点
3. 添加新的节点
4. 删除多余节点
5. 处理未知节点(通过上面 4 个步骤后剩余的节点)
   1. 移动子节点
   2. 建立索引图
   3. 更新和移除旧节点
   4. 移动和挂载新节点

我们知道 `DOM` 更新的性能优劣关系大致为：`属性更新` > `位置移动` > `增删节点`。所以，我们需要尽可能地复用老节点，做属性更新，减少移动次数和增删节点的次数。
所以我们首先需要进行同步头部节点和同步尾部节点进行节点的更新，并且保证顺序不变。然后判断是否有新增和删除的节点。最后处理未知节点。

##### 1. 同步头部节点

旧节点:
```js
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="b">e</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>
```
新节点:
```js
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>
```

##### 2. 同步尾部节点

##### 3. 添加新的节点

##### 4. 删除多余节点

##### 5. 处理未知节点(通过上面 4 个步骤后剩余的节点)

###### 5.1 获取最长递增子序列
