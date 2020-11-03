---
title: webpack针对循环引用以及赋值export的处理注意事项
date: 2018-03-08 22:04:19
banner: https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520601513447&di=f808165460d1a50f4d6e2da81fff2ea5&imgtype=0&src=http%3A%2F%2Fwww.33lc.com%2Farticle%2FUploadPic%2F2012-8%2F2012831461959667.jpg
---

<!-- TOC -->

- [webpack打包相互引用的模块](#webpack打包相互引用的模块)
  - [示例项目](#示例项目)
  - [遇到的问题](#遇到的问题)
  - [为什么会出现这样的问题](#为什么会出现这样的问题)
  - [如何解决](#如何解决)

<!-- /TOC -->

# webpack打包相互引用的模块

## 示例项目

([github](https://github.com/hq229075284/blog-example-assets/tree/master/webpack%E9%92%88%E5%AF%B9%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8%E4%BB%A5%E5%8F%8A%E8%B5%8B%E5%80%BCexport%E7%9A%84%E5%A4%84%E7%90%86%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9))

## 遇到的问题
在有2个或2个以上的文件之间的相互依赖关系构成闭环的时候，有时会出现<code>Can't read Property 'xxx' of undefined</code>或者<code>(0,xxx) is not a function</code>这类的错误，比如：

```
示例项目中的src/index.js引用src/a.js,而src/a.js中也引用了src/index.js
```

## 为什么会出现这样的问题

<!-- more -->

这就跟webpack打包后的代码执行逻辑有关

webpack的头部启动代码中，通过闭包中的installedModules对象，将模块名或者id作为对象的key来缓存各个模块的export的值，通过判断installedModules上是否缓存了对应模块的key来判断是否已经加载了模块

```javascript
// Check if module is in cache
if(installedModules[moduleId]) {
  return installedModules[moduleId].exports;
}
// Create a new module (and put it into the cache)
var module = installedModules[moduleId] = {
  i: moduleId,
  l: false,
  exports: {}
};
// Execute the module function
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
```

但存在一个问题：当模块还处于第一次执行中的状态时，如果碰到相互引用的情况的话，webpack可能会认为一个没有完全加载完成的模块已经加载完了

就拿export function.js中的代码和export const _var.js中的代码为例:

> export function.js

```javascript

/***/ (function(module, exports, __webpack_require__) {

  "use strict";
  
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports._console = _console;// <- 📢注意这里
  
  var _a = __webpack_require__(2);
  
  var _a2 = _interopRequireDefault(_a);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _console() {
    console.log('this is index.js');
  }
  
  /***/ }),
```

> export const _var.js

```javascript

/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._console = undefined;// <- 📢注意这里

var _a = __webpack_require__(2);

var _a2 = _interopRequireDefault(_a);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _console = exports._console = function _console() {
  console.log('this is index.js');
};

/***/ }),
```

从上面两段代码的📢处代码行可以看到，使用赋值语句export的代码打包后，对exports上的属性的赋值将在import(也就是__webpack_require__)后，另一种使用申明函数语句export的代码打包后，对exports上的属性的赋值将在import(也就是__webpack_require__)前。

这点细微的区别在执行相互引用的代码时会导致执行结果和你想的不一样，试想一下以下的代码执行过程：

1. 在installedModules对象上设置index.js的key,加载index.js并执行
2. 遇到import a.js
3. 在installedModules对象上设置a.js的key,加载a.js并执行
4. 遇到import index.js
5. 检查，发现installedModules上已经存在index.js的key,直接读对象上缓存的exports(其实这里可能只在exports声明了属性名，并没有赋值)
6. 执行exports上的_console函数(如果属性还没有被赋值就会出错)

export的方式会影响以上过程的5、6步骤

## 如何解决
1. 打破文件间的依赖关系的闭环
2. 依赖关系闭环的情况下，只使用export function funcName(){}
