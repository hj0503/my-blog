### call

```js
Function.prototype.call = function (obj, ...args) {
  obj = obj || window;
  const fn = Symbol();
  obj[fn] = this;
  const result = obj[fn](...args);
  delete obj[fn];
  return result;
};
```

### apply

和apply唯一的区别是call接受不定量的参数，apply接受一个数组参数

```js
Function.prototype.call = function (obj, args = []) {
  obj = obj || window;
  const fn = Symbol();
  obj[fn] = this;
  const result = obj[fn](...args);
  delete obj[fn];
  return result;
};
```

### bind

bind 返回函数

```js
Function.prototype.bind = function (obj, ...args) {
  obj = obj || window;
  const fn = Symbol();
  function proxyFn(...laterArgs) {
    obj[fn] = this;
    const result = obj[fn](...args, ...laterArgs);
    delete obj[fn];
    return result;
  }
  return proxyFn;
};
```
