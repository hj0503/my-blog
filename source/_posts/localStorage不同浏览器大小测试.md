---
title: localStorage不同浏览器大小测试
date: 2021-02-25 15:26:56
tags:
  - javascript
category: javascript
---

> 本篇文章不针对`localStorage`用法进行讲解了

### 我们可以通过以下方法进行统计

```javascript
if (!window.localStorage) {
  console.log('当前浏览器不支持localStorage!');
}
let test = '0123456789';
const add = function (num) {
  num += num;
  if (num.length == 10240) {
    test = num;
    return;
  }
  add(num);
};
add(test);
let sum = test;
const show = setInterval(function () {
  sum += test;
  try {
    window.localStorage.removeItem('test');
    window.localStorage.setItem('test', sum);
    console.log(sum.length / 1024 + 'KB');
  } catch (e) {
    alert(sum.length / 1024 + 'KB超出最大限制');
    clearInterval(show);
  }
}, 0.1);
```

### 统计结果

| 浏览器  | size | 设备  |
| ------- | ---- | ----- |
| google  | 5120KB   | pc 端 |
| firefox | 2560KB   | pc 端 |
| safari  | 5120KB   | pc 端 |
