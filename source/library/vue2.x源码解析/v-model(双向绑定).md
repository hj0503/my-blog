### v-model(双向绑定)

#### 一、对 v-model 指令进行编译

##### input、textarea、radio等元素

例如：

```js
<input v-model="message" />
```

编译成:

```js
<input v-bind:value="message" v-on:input="message=$event.target.value">

with(this) {
  return _c('div',[_c('input',{
    directives:[{
      name:"model", rawName:"v-model", value:(message), expression:"message"
    }],
    attrs:{"placeholder":"edit me"},
    domProps:{"value":(message)},
    on:{"input":function($event){
      if($event.target.composing) return;
      message=$event.target.value
    }}}),_c('p',[_v("Message is: "+_s(message))])
    ])
}
```

##### 组件

给 data.props 添加 data.model.value ，并且给 data.on 添加 data.model.callback

```js
data.props = { value: message };
data.on = {
  input: function ($$v) {
    message = $$v;
  },
};
```

参考:
[v-model 源码解析](https://segmentfault.com/a/1190000015848976)
