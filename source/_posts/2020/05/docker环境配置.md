---
title: docker环境配置
tags: docker
categories: 运维
banner: http://blog.cloudmantra.net/wp-content/uploads/2018/04/docker-cloudmantra-aws.png
banner_mode: contain
date: 2020-05-31 13:52:28
---


# 宿主机配置

1. [docker-ce 国内镜像下载](https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/)

2. [设置Ubuntu软件源为清华镜像](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

3. 设置docker hub国内镜像

   ```json
   // /etc/docker/daemon.json
   {
     "registry-mirrors" : [
       // 网易
       "https://hub-mirror.c.163.com",
     ]
   }
   ```

   或者[使用阿里的镜像](https://yq.aliyun.com/articles/29941)

