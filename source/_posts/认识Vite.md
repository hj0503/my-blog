---
title: Hello Vite
date: 2021-02-04 22:53:20
tags:
  - 前端
  - Vite
categories: Vite
cover: ../images/Vite.svg
---

> 在学习 Vite 之前，可以先了解下[基于浏览器 native 的 ES module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)、[esbuild](https://esbuild.github.io/)、[Rollup](https://www.rollupjs.com/)、

## 什么是 v、Vite

借用作者的原话：

> Vite，一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 rollup 打包。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。
> [英文文档](https://vitejs.dev/)，[中文文档](https://cn.vitejs.dev/)

## Vite 特性介绍

Vite 主打特点就是轻快冷服务启动。冷服务的意思是，在开发预览中，它是不进行打包的。
开发中可以实现热更新，也就是说在你开发的时候，只要一保存，结果就会更新。
按需进行更新编译，不会刷新全部 DOM 节点。这功能会加快我们的开发流程度。

## Vite 插件

当我们遇到当前 vite 不支持的功能时，可以通过 vite 插件来解决

## Vite 使用
