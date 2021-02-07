---
title: Vue3.0UI组件库对比
date: 2021-02-06 21:32:04
tags:
  - Vue
  - Vue3.0
  - 前端
categories: Vue3.0
cover: ../images/Vue.jpeg
---

## 前言

本篇文章主要是对 pc 端的各大组件库进行分析比较，目前支持 Vue3.0 版本的 UI 组件库有`Element Plus`、`Element3`、`Ant Design Vue`

## Element Plus

**介绍：**饿了么前端团队开发一套为开发者、设计师和产品经理准备的基于 Vue 3.0 的桌面端组件库
**Star：**8.4k
**项目特点：**

> - 团队维护
> - 支持 TypeScript
> - 常规支持：多语言、自定义主题、按需引入、内置过渡动画
> - 文档详细，组件齐全
> - 支持响应式布局，提供基于断点的隐藏类
> - 适合常规 pc 端项目

## Ant Design Vue(Vue3.0 版本)

**Star：**13.6(和 Vue2.x 版本一起的 Star 数)

> - 个人维护，挂着 ant design 头衔
> - 支持 TypeScript
> - 常规支持：多语言、自定义主题、按需引入
> - 文档详细，组件齐全
> - 支持响应式布局
> - 适合常规 pc 端项目

## Element3

fork的elementui代码改写，教育行业团队学习项目，不够稳定，随时可能停止维护

## 其他

|        | Element Plus  | Ant Design Vue | ps                                                                          |
| ------ | ------------- | -------------- | --------------------------------------------------------------------------- |
| 写法   | 模板 template | jsx            | 对使用上来说没有影响，阅读源码上来说，对于不熟悉 jsx 语法的人来说会有点吃力 |
| 组件数 | 61            | 62             | 都覆盖了当前常用组件                                                        |
| 样式   | sass          | less           | 都支持自定义主题，使用 modifyVars 的方式进行覆盖变量                        |
| 日期   | dayjs         | moment         | dayjs 拥有比 moment 体积小 100 倍，拥有同样强大的 API                       |

## 从目前项目使用上考虑

**UI 风格：**目前项目中使用的`ElementUI`，从 UI 风格上更加倾向`Element Plus`，为了保持 UI 上的一致性，使用`Ant Design Vue`的话势必会增加更多的工作量来修改样式，而且对于目前项目中使用到的主题切换方案来说，也需要另外维护一套`Ant Design Vue`样式变量
**稳定性：**`Element Plus`是饿了么前端团队维护，对于 bug 解决上来说响应更快，更加稳定，对于 Vue2.x 版本的用法兼容性好，所以在使用上来说和以前的版本不大，目前一些兼容性不太好的组件团队也在持续改进中

## 结论

Element Plus
