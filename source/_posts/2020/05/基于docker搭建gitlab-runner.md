---
title: 基于docker搭建gitlab-runner
date: 2020-05-31 14:13:25
tags: 
    - docker
categories: 
    - 运维
banner: http://img0.imgtn.bdimg.com/it/u=1699744843,363136547&fm=26&gp=0.jpg
banner_mode: contain
---

# 基于docker搭建gitlab-runner

1. 下载gitlab镜像
   ```bash
   docker pull gitlab/gitlab-runner
   ```

2. 注册runner
   ```bash
   # ps:在注册过程中直接以人机交互的方式一步一步进行注册的话，可能会出现ssl验证不通过的问题，所以在这种情况下直接用命令行参数进行注册
   
   # --rm 临时创建一个容器，用来运行gitlab/gitlab-runner镜像
   sudo docker run --rm \
   # 挂载宿主的文件目录到容器内,用以存储注册之后生成的config.toml文件
   # 当以root用户运行gitlab-runner时，/etc/gitlab-runner为默认存储配置文件的地方
   -v /home/dcxx/gitlab-runner:/etc/gitlab-runner \
   # 指定镜像
   gitlab/gitlab-runner \
   # 执行gitlab-runner register命令
   register \
   # 不需要交互式
   --non-interactive \
   # gitlab web服务的https的证书
   --tls-ca-file '/etc/gitlab-runner/git.dcyun.com.crt' \
   # gitlab web服务地址
   --url "https://git.dcyun.com/" \
   # gitlab网站上添加runner时提供的token
   --registration-token "T3V4vNvQrAMZDyNVFrg7" \
   # 指定在什么环节跑构建脚本
   --executor "docker" \
   # 指定跑构建脚本时的docker环境，即镜像
   --docker-image ubuntu:latest \
   # runner的名称，主要显示在job详情中pipeline选择runner时的下拉项中
   --name '前端自动部署' \
   # 运行没有配置tag的任务执行
   --run-untagged="true" \
   # runner的tag
   --tag-list 'docker,font-end,common'
   ```

<!-- more -->
1. gitlab-runner注册完之后会产生config.toml文件

2. ```bash
   # 用gitlab/gitlab-runner镜像，跑起一个gitlab-runner的容器
   # 启动之后，之前注册的runner就会处于在线且启用状态
   docker run -it --name gitlab-runner --restart always \
   -v /home/dcxx/gitlab-runner:/etc/gitlab-runner \
   -v /var/run/docker.sock:/var/run/docker.sock \
   gitlab/gitlab-runner
   ```

3. gitlab-runner拉取代码时，会存在ssl验证不通过的问题，需要在config.toml中添加配置：

   ```toml
   # """用于包裹多行
   pre_clone_script = """
   	# 关闭git的ssl验证
     git config --global http.sslverify false
   """
   ```

4. 从宿主机上挂载node环境和软件源配置文件到容器中，方便容器中的脚步执行和软件源配置

   ```toml
   [runners.docker]
     volumes = ["/cache","/home/dcxx/gitlab-runner/node:/node","/etc/apt/sources.http.list:/sources.list"]
   ```

5. 在项目中创建.gitlab-ci.yml

6. ```yml
   before_script:
   	# 添加node到环境中
     - PATH=/node/bin:$PATH
     # 由于Ubuntu官方的软件源部分被墙
     # 需要更改Ubuntu的软件源
     - cat /sources.list
     - cp -f /sources.list /etc/apt/sources.list
     # 安装ssh相关的依赖，用于scp发布
     - 'which ssh-agent || ( apt update -y && apt install openssh-client -y )'
     # 创建.ssh文件夹用于存储id_rsa私钥
     - mkdir -p ~/.ssh
     # 读取gitlab设置下Variables中配置的SSH_PRIVATE_KEY变量，将其写入id_rsa中
     - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
     # 设置仅当前用户可用（ssh硬性要求）
     - chmod -R 700 ~/.ssh
     - eval $(ssh-agent -s)
     # 用于解决
     - ssh-agent bash
     # 添加密钥
     - ssh-add ~/.ssh/id_rsa
     # 当ssh第一次连接远程服务器的时候，会先询问是否连接这台主机，因为是在ci中跑，无法进行人机交互，所以设置成不检查host key，否则会报`host key verification failed`的错误
     - echo -e "Host *\\n\\tStrictHostKeyChecking no\\n" > ~/.ssh/config
   
   dev:
     script:
       # 跑构建代码的脚本
       - npm run serve
     after_script:
       # 将构建后的代码发布到项目服务器
       - scp -r ./dist dcxx@192.168.2.130:~/web/dist
   
   ```
> OpenSSH将访问过计算机的公钥(public key)都记录在~/.ssh/known_hosts中。当下次访问相同计算机时，OpenSSH会核对公钥。如果公钥不同，OpenSSH会发出警告，避免你受到DNS Hijack之类的攻击。
>
> SSH对主机的public_key的检查等级是根据StrictHostKeyChecking变量来配置的。默认情况下，StrictHostKeyChecking=ask。简单所下它的三种配置值：
>
> 1. StrictHostKeyChecking=no  
>
>    最不安全的级别，当然也没有那么多烦人的提示了，相对安全的内网时建议使用。如果连接server的key在本地不存在，那么就自动添加到文件中（默认是known_hosts），并且给出一个警告。
>
>  2. StrictHostKeyChecking=ask 
>
>     默认的级别，就是出现刚才的提示了。如果连接和key不匹配，给出提示，并拒绝登录。
>
> 3. StrictHostKeyChecking=yes  
>
>    最安全的级别，如果连接与key不匹配，就拒绝连接，不会提示详细信息。
8. 之后提交代码就可以看到runner的效果了

   > 在gitlab-runner执行过程中，config.toml的pre_clone_script和.gitlab-ci.yml的before_script、script、after_script是在相互隔离的环境下运行的（大概猜测是在不同的docker容器下）

```toml
# config.toml大致的结构
concurrent = 2
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "test"
  url = "https://git.dcyun.com/"
  token = "q7pn15zhaZyJQzuHxyCC"
  tls-ca-file = "/etc/gitlab-runner/certs/git.dcyun.com.crt"
  pre_clone_script = """
    git config --global http.sslverify false
  """
  executor = "docker"
  [runners.custom_build_dir]
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
  [runners.docker]
    tls_verify = false
    image = "ubuntu"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache","/home/dcxx/gitlab-runner/node:/node","/etc/apt/sources.http.list:/sources.list"]
    shm_size = 0
```

