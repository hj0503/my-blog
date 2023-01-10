---
title: html2canvas+file-saver下载图片
date: 2022-12-1 23:01:01
tags:
  - 解决方案
categories: 前端
cover: ../images/Vite.jpeg
---

### 所用技术

html2canvas + file-saver

- html2canvas: 将 html 转成 canvas
- file-saver: 文件下载

### 需求

下载洞察报告，最多 200 个字段，200 个 echarts 图表，原页面由于性能问题使用了虚拟滚动
一个洞察任务结果生成一张图片
支持下载多个洞察报告

### 实现

- 不能使用虚拟滚动
- 全量展示下载卡顿严重
- g-empty 图片无法正确下载
- canvas 过大无法生成下载

##### 全量展示下载卡顿问题

按字段分页，一页一个 `canvas`，然后合并所有 `canvans` 生产一个 `canvans` 再下载

```js
mergeCanvas(canvasList) {
  let width = document.body.clientWidth;
  let allHeight = 0;
  canvasList.forEach(canvas => {
    width = Math.max(width, canvas.width);
    allHeight += canvas.height;
  });
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = allHeight;
  const ctx = canvas.getContext('2d');

  let top = 0;
  canvasList.forEach(canvas => {
    ctx.drawImage(canvas, 0, top, canvas.width, canvas.height);
    top += canvas.height;
  });
  return canvas;
}
```

首先合并所有字段的 canvas，再合并整个页面的 canvas

##### g-empty 图片无法下载(未完全解决)

图片截取不完整(好像是只能下载原始图片大小)，需要等待图片加载完成后再截取
先转成 base64 后再生成 canvas

##### canvas 过大无法生成下载

google 浏览器:

最大宽度: 65535
最大高度：65535
最大面积：65535 \* 4096

##### 其他注意地方

1. 开启了 canvas 动画需要等待动画结束后再开始生成 canvans

```js
// 任何动画结束都会调用该方法 考虑其他办法判断是否完成绘制echarts
chart.on('finished', function () {
  // ...
});
```

2. 最大 canvas 大小限制判断，超出部分生成多个 canvas

```js
if (
  canvas.width > 65535 ||
  canvas.height > 65535 ||
  canvas.width * canvas.height > 65535 * 4096
) {
  // 超出部分生成另外一个canvas
}
```
