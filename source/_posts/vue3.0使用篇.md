---
title: vue3.0使用篇
date: 2020-12-05 21:02:06
tags:
  - vue
  - 前端
categories: vue
cover: https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHq6k6758eEZYHtrA3PDWKrhOr7JDjuVxdic6Pia3Aa5BSglRDlDFPLJM00tvkN1N565e2j3c4hjQib7Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1
---

### 一、vue3.0 重要的优化

- 模板编译速度的提升，对静态数据的跳过处理
- 对数组的监控
- 对 ts 有了很好的支持
- 对 2.x 版本的完全兼容

### 二、值得注意的新特性

- 组合式(Composition) API
- Teleport
- 可以有多个根节点(Fragments)
- 片段
- 触发组件选项
- `createRenderer`API 创建自定义渲染器
- 单文件组合式 API 语法糖`<script setup>`
- 单文件组件状态驱动的 css 变量`<script vars>`
- 单文件组件`<style scoped>`现在可以包含全局规则或只针对插槽内容的规则

### 破坏性变化

- Global API 改为应用程序实例调用
- Global and internal APIs重构为可做摇树优化
- `model`选项和`v-bind`的`sync`修饰符被移除，统一为`v-model`参数形式
- 渲染函数API修改
- 函数式组件仅能通过简单函数方式创建
- 废弃在SFC的template上使用functional或者添加functional选项的方式声明函数式组件
- 异步组件要求使用`defineAsyncComponent`方法创建
- 组件data选项应该总是声明为函数
- 自定义组件白名单执行于编译时
- `is`属性仅限于用在`component`标签上
- `$scopedSlots`属性被移除，都用`$slots`代替
- 特性强制策略变更
- 自定义指令API和组件一致
- `watch`选项和`$watch`不再支持点分隔符字符串路径, 使用计算函数作为其参数

### Composition API

