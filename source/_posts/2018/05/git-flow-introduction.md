---
title: git-flow-introduction
date: 2018-05-23 01:44:24
tags:
---

Git 开发流程

开始一个新功能的开发 (Work on a Feature)

## 1. 建立新的分支

 $ git checkout -b feature/<your initial>-<feature name>

> 例如: feature/chb-add-wishlist 如果是bugfix, branch命名以bugfix开始 例如: bugfix/chb-some-user-cannot-login

## 2. 开发功能并测试

## 3. 提交修改

$ git push origin <feature branch name>

## 4.在github上创建pull request, 找人做代码审核（可跳过）

特别提醒：创建的pull request应是功能分支到develop分支

## 5. 审核（或自审）通过后，清理提交记录
```shell
  git checkout develop 
  git pull origin develop 
  git checkout <feature branch name> 
  git rebase -i develop 
  git push origin <feature branch name> -f
```
目标：将所有的commits整理成一个或者几个比较重要的commit，并确保新的代码会出现在develop分支现有代码之后，以保持提交历史的整洁性

在这一步可能会出现conflicts, 需要人工解决

注：前三步操作可以用git alias来简化, 需要在~/.gitconfig配置一下git的alias
```shell
 $ ~/.gitconfig [alias]   sync = "!f() { echo Syncing $1 with develop && git checkout develop && git pull origin develop && git checkout $1 && git rebase -i develop; }; f"
 $ git sync <feature branch name>
```
## 6. 在github上merge pull request并删除分支

## 7. 终结这个功能分支

 $ git checkout develop **&&** git pull origin develop **&&** git branch -d <feature branch name>