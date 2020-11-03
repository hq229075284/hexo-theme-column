---
title: CSRF
categories: web安全
banner: /blog/2020/05/CSRF/csrf.png
date: 2020-05-31 13:50:03
tags:
---


# CSRF

防范措施：
<!-- + 使用非`get`的请求方式，避免在dom中调接口（比如：`img`和`script`的`src`属性值为后端接口调用地址时），可以一定程度上减少风险 -->
+ 检测请求头中的Referer字段，判断请求的来源是否是来自合法（意料之中）的网站
+ <u>**在token无法被他人窃取的情况下**</u>，客户端和服务端对同一用户在两端都保留一个相同的token，通过检测token是否一致来确定是否为同一用户
  + token不可以放在cookie中，防止在访问服务端时浏览器自动给请求带上cookie（浏览器cookie设置的行为）
  + JWT（含有少量信息的token，在一定程度上后端代码可以减少与数据库的交互）
  + 将token放在页面的url上有时是不安全的，因为跳转后的页面也可能会获取到上一个页面的url内容