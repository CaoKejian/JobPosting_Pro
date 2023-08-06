#!/bin/bash

user=ubuntu
host=43.139.142.203
deploy_dir=jobpro
function title {
  echo 
  echo "###############################################################################"
  echo "## $1"
  echo "###############################################################################" 
  echo 
}
title "下载依赖"
ssh -t $user@$host "
      title \"进入目录"\
      cd $deploy_dir
      title \"下载依赖"\
      sudo npm install
      title \"启动服务"\
      npm run dev
      title \"执行完毕！请访问:"http://43.139.142.203:3000/api" "\
      "