---
title: JS手写题目
date: 2022-03-23 15:25:51
tags:
  - javascript
---

#### 1、如何让 (a == 1 && a == 2 && a == 3) 的值为 true

```javascript
const a = {
  num: 0,
  valueOf: function () {
    return (this.num += 1);
  },
};
```

> `==`会进行隐式转换, object 会先调用 valueOf，这里重写 valueOf 就行了

#### 2、实现两个大数相加

```javascript
function add(a, b) {
  // 字符串倒转相加(从个位开始加)
  a = a.split('').reverse().join('');
  b = b.split('').reverse().join('');

  let maxLen = Math.max(a.length, b.length);
  let carry = 0;
  let sum = '';
  for (let i = 0; i < maxLen; i++) {
    let current =
      parseInt(a[i] != null ? a[i] : 0) +
      parseInt(b[i] != null ? b[i] : 0) +
      carry;
    carry = Math.floor(current / 10);
    sum = (current % 10) + sum;
  }
  if (carry === 1) sum = '1' + sum;
  return sum;
}
a('123456789012345678', '876543210987654321');
```

#### 3、实现深拷贝函数

```javascript
function cloneDeep(data, map = new Map()) {
  if (typeof data !== 'object') return data;
  const cloneData = Array.isArray(data) ? [] : {};
  // 解决循环引用问题
  if (map.get(data)) {
    return map.get(data);
  }
  map.set(data, cloneData);
  for (let key in data) {
    if (typeof data[key] === 'object') {
      cloneData[key] = cloneDeep(data[key], map);
    } else {
      cloneData[key] = data[key];
    }
  }
  return cloneData;
}
```
