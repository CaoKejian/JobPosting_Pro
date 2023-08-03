#!/bin/bash
echo '#####👉开始上传👈#####'
source ~/.zshrc

# 提取传递的 commit message 参数
message="$1"

# 执行 git add .
git add .

# 执行 git commit -m
git commit -m "$message"

#开启代理
proxy

git pull

echo '#####👉提交成功👈#####'
