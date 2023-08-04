#!/bin/bash

function title {
  echo 
  echo "###############################################################################"
  echo "## $1"
  echo "###############################################################################" 
  echo 
}

title '👉开始上传👈'

# 提取传递的 commit message 参数
message="$1"

# 执行 git add .
git add .

# 执行 git commit -m
git commit -m "$message"

#开启代理

git push 

title '👉提交成功👈
