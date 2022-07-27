### jsonp

#### 原理

`script` 标签不受同源策略的影响
使用 `Jsonp` 进行跨域时，请求的 `url` 地址后面会自动带上一个 `callback=xxx` 传给后端，后端需要对返回给前端的 `json` `数据做处理，callback` 是回调函数参数，`xxx` 即是回调函数名称，回调函数名传到后端后，会被拿来包裹住要返回给前端的 `json` 数据，最终返回给前端的数据是 `xxx(json)`的形式。而前端将会用 `script` 的方式处理返回数据，来对 `json` 数据做处理，以此完成一个有效的 `Jsonp` 请求。
此处的 `callback` 可通过 `jsonp` 来自定义，`xxx` 可通过 `jsonpCallback` 来自定义。

jsonp: 回调函数的参数，是与后端约定好的参数，必须与后端保持一致。不另外定义 `jsonp` 的话，一般默认为 `jsonp:'callback'`。

jsonpCallback: 回调函数名，用来包裹住 `json` 数据，不另外定义的话，这个参数的值往往是随机生成的。

#### 实现

```js
function jsonp(url, params, callbackName) {
  const generatorUrl = () => {
    let dataStr = '';
    for (let key in params) {
      dataStr += `${key}=${params[key]}&`;
    }
    dataStr += `callback=${callbackName}`;
    return `${url}?${dataStr}`;
  };
  return new Promise(resolve => {
    const scriptEle = document.createElement('script');
    scriptEle.src = generatorUrl();
    document.body.appendChild(scriptEle);
    window[callbackName] = data => {
      resolve(data);
      document.removeChild(scriptEle);
    };
  });
}
```
