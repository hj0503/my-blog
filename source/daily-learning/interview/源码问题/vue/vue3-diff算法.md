### 面试-diff 算法

1. 同步头部节点

头部索引 i、旧子节点尾部索引 e1、新子节点尾部索引 e2

从头开始，依次对比新节点和旧节点：如果它们相同，则执行 patch 更新节点；如果不同或者索引 i 大于索引 e1 或者 e2，则同步过程结束

2. 同步尾部节点

从尾部开始，依次对比新节点和旧节点：如果相同，则执行 patch 更新节点；如果不同或者索引 i 大于索引 e1 或者 e2，则同步过程结束

3. 新子节点有多余，要添加新节点

如果索引 i 大于尾部索引 e1 且小于 e2，那么直接挂载新子树从索引 i 开始到索引 e2 部分的节点

4. 旧子节点有多余，要删除多余节点

如果索引 i 大于尾部索引 e2，那么直接删除旧子树从索引 i 开始到索引 e1 部分的节点

5. 处理未知子序列(乱序下的情况)

进行了上面四步后，新旧子节点都还有剩余，这个时候就需要移动、新增和删除节点了

> 源码中对于第五步分成了三小步：1：建立新子节点的索引表{key(新节点列表中节点的 key): index(新节点列表中节点的 index)}；2：循环旧子节点列表，并且尝试打补丁或者删除的操作

5.1. 找出所有新子节点在旧子节点的位置

粗暴方式是进行两层循环，先循环旧子节点再循环新子节点，Vue 中为了性能使用了通过空间换时间的方法，首先给新子节点建立索引表 keyToIndexMap { key: index }的 Map 结构，然后遍历旧子节点得到新子节点在旧子节点的位置的数组

5.2. 循环旧子节点列表，并且尝试打补丁或者删除的操作

新增变量 patched(更新过的节点数)、newIndexToOldIndexMap(新节点在旧节点中的位置，需要配合 keyToIndexMap 找)，maxNewIndexSoFar(最大的 newIndex)

循环过程中，patched 大于需要更新的节点数，说明需要删除当前节点；如果没找到新节点在旧节点的位置(旧节点没有对应新节点：newIndex = keyToIndexMap[oldChild.key])，说明当且旧节点需要删除；如果当前 newIndex < maxNewIndexSoFar 说明需要移动(因为正常是递增的)，moved = true;

> 整个循环过程中都需要 patch 打补丁，移动情况在下一步进行

5.3. 移动节点和挂载新节点

首先获取最长递增子序列(const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap)保存的是 index, j = increasingNewIndexSequence.length - 1)。接下来倒序循环新子节点列表，如果 newIndexToOldIndexMap[i] === 0 说明当前子节点为新的节点，需要挂载；如果 j < 0(没有最长递增子序列) || i !== increasingNewIndexSequence[i] (当前节点不在最长递增子序列中)，说明需要移动(因为遍历的新节点所以，当前节点需要移动的位置就是当前的 index+1: c2[nextIndex + 1].el)，否则 j--;

> 倒序为了方便使用最后更新的节点作为锚点

#### getSequence

参考：https://blog.csdn.net/hefeng6500/article/details/123907708

```js
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, start, end, middle;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      start = 0;
      end = result.length - 1;
      while (start < end) {
        middle = (start + end) >> 1;
        if (arr[result[middle]] < arrI) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      if (arrI < arr[result[start]]) {
        if (start > 0) {
          p[i] = result[start - 1];
        }
        result[start] = i;
      }
    }
  }
  let nI = result.length;
  let last = result[nI - 1];
  while (nI-- > 0) {
    result[nI] = last;
    last = p[last];
  }
  return result;
}
```
