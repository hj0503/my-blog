### instanceof

原理

- 构造函数的 `prototype` 属性是否出现在对象原型链中的任何位置
- 只能检测对象

```js
function instanceOf(left, right) {
  const proto = left.__proto__;
  while (proto) {
    if (proto === right.prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
  return false;
}
```
