---
title: 元素resize
categories: web-api
tags: web-api
date: 2020-06-27 23:38:44
banner:
---


# 监听元素尺寸的变化

## 传统的，通过resize来监听尺寸大的变化（以高度变化为例）

由于resize事件仅在某些元素和window上触发，对于其他元素需要借助这些元素来监听尺寸的变化。

首先保持<code>iframe</code>的高度与变化元素的高度一致，当元素的高度变化时，`iframe`内的窗口大小也变化，会触发`iframe`内window的resize事件，以此来监听元素尺寸的变化。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <button>change div's height</button>
    <div class="size-div" style="height:100px;">
        <iframe></iframe>
        the div can change size
    </div>
</body>

</html>
```

```javascript
document.querySelector("button").addEventListener("click", function () {
  var target = document.querySelector(".size-div");
  var rand = Math.floor(Math.random() * 200 + 50);
  target.setAttribute("style", "height:" + rand + "px;border:1px solid;");
});
document
  .querySelector("iframe")
  .contentWindow.addEventListener("resize", function () {
    console.log("div changed size");
  });

```

```css
.size-div {
  border: 1px solid;
  position: relative;
}
iframe {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  border:0;
}
```

<!-- more -->

## 通过ResizeObserver Api来监听元素大小的变化

通过借助其他元素来实现监听元素尺寸变化比较繁琐，web api中提供了ResizeObserver来监听任何元素的尺寸变化

> `resizeObserver.observe`执行后会异步(`macrotask`)触发1次`ResizeObserver`的回调函数

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <button>change div's height</button>
    <div class="size-div" style="height:100px;">
        the div can change size
    </div>
</body>

</html>
```

```javascript
document.querySelector("button").addEventListener("click", function () {
  var target = document.querySelector(".size-div");
  var rand = Math.floor(Math.random() * 200 + 50);
  target.setAttribute("style", "height:" + rand + "px;border:1px solid;");
});
var resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    console.log(entry);
  }
});
resizeObserver.observe(document.querySelector(".size-div"));
```

```css
.size-div {
  border: 1px solid;
  position: relative;
}
iframe {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  border:0;
}
```