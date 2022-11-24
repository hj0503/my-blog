---
title: Git在工作中的常用操作
date: 2022-11-18 17:45:15
tags:
  - Git
categories: Git
---

### 记录Git在工作中的常用操作

1. 回退操作

回退提交
```js
git log  // 查看commit
git reset --soft commitId  // 保留代码
git reset --hard commitId  // 不保留代码
```

回退操作
```js
git reflog // 查看操作id
git reset --soft refId  // 保留代码
git reset --hard refId  // 不保留代码
```

2. 修改某个commit的内容

```js
git rebase -i commit-id
```