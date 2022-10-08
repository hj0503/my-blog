### new

new 做了什么

- 创建一个新对象
- 将新对象的 `__proto__` 指向构造函数的原型对象 `prototype`
- 构造函数的`this`指向新对象
- 执行构造函数(给新对象添加属性)
- 如果构造函数返回对象，则返回该对象；否则，返回刚创建的新对象(空对象)

```js
function New(fn, ...args) {
  const obj = {};
  obj.__proto__ = fn.prototype;
  const result = fn.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}
```
