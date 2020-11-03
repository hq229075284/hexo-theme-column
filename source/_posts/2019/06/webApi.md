---
title: webApi
date: 2019-06-06 15:46:24
tags:
---

<toc>

## [IntersectionObserver](<https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver>)

> 定义的视口和目标元素之间相交的关系

```javascript
var observer = new IntersectionObserver(callback[, options])
```

当目标元素在定义的视口中的可见百分比超过阈值时，**callback**会被调用，入参有两个：

1. entries：由IntersectionObserverEntry对象构成的数组，仅包含触发阈值的目标元素的IntersectionObserverEntry对象，每个IntersectionObserverEntry对象对应一个目标元素，顺序和目标元素被监听的先后一致
2. observer：当前的IntersectionObserver实例



**options**包含3个属性：

1. root：定义视口元素，当options未指定或者root为null时，默认未document

2. rootMargin：值的语法与css的margin一样，正值为在root视口的边缘向外扩展，即视口变大，反之则变小

3. threshold：值为数组，数组中的每个元素的取值范围为[0,1]，当目标元素在视口中的可见百分比越过数组中某个元素的值时，则callback会被调用。比如：

| 原来目标元素可见百分比 | 滚动之后目标元素可见百分比 | 数组中的某一阈值 | 结果           |
| ---------------------- | -------------------------- | ---------------- | -------------- |
| 0.45                   | 0.51                       | 0.5              | callback被触发 |
| 0.51                   | 0.45                       | 0.5              | callback被触发 |

**observer**实例对象上含有4个函数：

1. disconnect：停止此observer对象中监听的所有目标元素
2. observer：用于指定observer需要监听的目标元素，入参为1个目标元素，且为root的子孙元素
3. takeRecords：获取observer内部保存的由IntersectionObserverEntry对象构成的数组
4. unobserver：用于停止监听某一目标元素，入参为1个对应需要停止监听的目标元素，



附：[`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)