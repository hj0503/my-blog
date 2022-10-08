### v-model(双向绑定)

##### 总体流程

- Vue初始化组件时通过genDirectives(el, state)进行指令解析
- Vue通过state找到model指令对应的方法model(el, dir, _warn)
- model()根据表单元素的tag标签以及type属性的值，调用不同的方法也就验证了官网所说的“随表单控件类型不同而不同
- 通过genAssignmentCode()方法生成v-model value值的代码。例如："message=$event.target.value"

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
- [v-model 源码解析](https://segmentfault.com/a/1190000015848976)
