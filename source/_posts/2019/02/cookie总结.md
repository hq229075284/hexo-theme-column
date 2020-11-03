---
title: cookie总结
date: 2019-02-15 10:52:59
tags:
---

# Cookie知识点记录
> 参考：
> https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie
> https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

+ **Expires**：cookie 的最长有效时间，形式为符合 HTTP-date 规范的时间戳，比如：[Date: Wed, 21 Oct 2015 07:28:00 GMT](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Date)，如果没有设置这个属性，那么表示这是一个会话期 cookie 。一个会话结束于客户端被关闭时，这意味着会话期 cookie 在彼时会被移除。(https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Session_cookies)
+ **Max-Age**:在 cookie 失效之前需要经过的秒数。一位或多位非零（1-9）数字。假如二者 （指 Expires 和Max-Age） 均存在，那么 Max-Age 优先级更高
+ **Domain**:指定 cookie 可以送达的目标。假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。后端在设置set-Cookie时，不指定Domain，则默认是当前接口地址的主域名+port或者ip+port
+ **Path**:指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送此Cookie。
+ **Secure**:一个带有安全属性的 cookie 只有在请求使用SSL和HTTPS协议的时候才会被发送到服务器
+ **HttpOnly**:设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由  Document.cookie 属性、XMLHttpRequest 和  Request APIs 进行访问，以防范跨站脚本攻击（XSS）。
+ **SameSite(实验属性)**:允许服务器设定一则 cookie 不随着跨域请求一起发送，这样可以在一定程度上防范跨站请求伪造攻击（CSRF）