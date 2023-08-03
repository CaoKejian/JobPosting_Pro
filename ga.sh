#!/bin/bash

# 提取传递的 commit message 参数
message="$1"

# 执行 git add .
git add .

# 执行 git commit -m
git commit -m "$message"
