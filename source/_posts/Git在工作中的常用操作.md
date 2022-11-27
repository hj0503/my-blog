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

回退具体操作流程以及场景

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

变基时有六个命令可用：

- pick: 只是意味着包括提交。重新进行命令时，重新安排pick命令的顺序会更改提交的顺序。如果选择不包括提交，则应删除整行。
- reword: 该reword命令与相似pick，但是使用后，重新设置过程将暂停并为您提供更改提交消息的机会。提交所做的任何更改均不受影响。
- edit: 修改提交，这意味着您可以完全添加或更改提交。您还可以进行更多提交，然后再继续进行变基。这使您可以将大型提交拆分为较小的提交，或者删除在提交中所做的错误更改
- squash: 该命令使您可以将两个或多个提交合并为一个提交。提交被压缩到其上方的提交中。Git使您有机会编写描述这两个更改的新提交消息。
- fixup: 这类似于squash，但是要合并的提交已丢弃其消息。提交仅合并到其上方的提交中，并且较早提交的消息用于描述这两个更改
- exec: 这使您可以对提交运行任意的Shell命令。