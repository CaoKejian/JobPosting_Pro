#!/bin/bash

user=ubuntu
host=43.139.142.203

function title {
  echo 
  echo "###############################################################################"
  echo "## $1"
  echo "###############################################################################" 
  echo 
}
title "我进来了"
# title "连接远程机器"
# ssh -t $user@$host "
#   title \"进入目录\"
#   cd /
#   title \"删除目录\"
#   sudo rm -rf JobPosting_Pro
#   title \"克隆代码\"
#   sudo git clone git@github.com:CaoKejian/JobPosting_Pro.git
#   title \"进入项目目录\"
#   cd JobPosting_Pro
#   title \"安装依赖\"
#   sudo npm install
#   title \"启动开发服务器\"
#   npm run dev
#   title \"执行完毕！\"
# "
