---
title: typescript学习记录
tags:
categories:
  - typescript
date: 2020-01-20 16:27:58
banner: https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1579524209973&di=418e20241392574a9e8f678e45dd41cd&imgtype=0&src=http%3A%2F%2Fimage.fundebug.com%2F2018-12-25-ts.jpeg
---

## typescript配置相关的

#### 在vscode中，通过配置typescript，让vscode可以识别css-module，进而提供css-module相关的代码补全

在`tsconfig.json`中配置`typescript-plugin-css-modules`插件

vscode中workaround的setting配置为`"typescript.tsdk": "node_modules\\typescript\\lib"`来使用工作区下的node_modules中的typescript来加载插件。[reference](https://github.com/mrmckeb/typescript-plugin-css-modules#recommended-usage)

#### eslint中行末结束符无法自动修复

`Expected linebreaks to be 'LF' but found 'CRLF'.eslint(linebreak-style)`
[在eslint可识别但由于bug暂不可自动修复](https://github.com/microsoft/vscode-eslint/issues/707)

暂时使用`EditorConfig`这个`vscode`插件来解决行末`IF`和`CRLF`的问题

***

## typescript规定相关的

#### ts中对对象字面量做`参数过多`检测的情况，以如何绕过

ts中对对象字面量做检测的时候，在特定情况下（字面量直接赋值给其它变量、字面量直接作为函数入参）会额外做`参数过多(excess property checking)`的检测
>  However, TypeScript takes the stance that there’s probably a bug in this code. Object literals get special treatment and undergo *excess property checking* when assigning them to other variables, or passing them as arguments. If an object literal has any properties that the “target type” doesn’t have, you’ll get an error: 

绕过*excess property checking*的方法
```
1. use a type assertion（类型断言）
2. add a string index signature（定义string型的索引签名）
3. One final way to get around these checks, which might be a bitsurprising, is to assign the object to another variable
```

#### ts文件中类型的申明作用域如何决定

ts根据该文件是否存在import或者export来决定当前文件是个模块还是运行在全局环境下，以此来推断类型申明是否存在于全局中
  
  > 参考：
  > 1. https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files 
  > 2. [github-issus](https://github.com/microsoft/vscode/issues/22436#issuecomment-319740226)

