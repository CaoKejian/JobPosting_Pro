#!/bin/bash

user=ubuntu
host=43.139.142.203
deploy_dir=jobpro
file_name=JobPosting_Pro
home_dir=/Users/duibagroup/Desktop/myself
dist=$home_dir/jobposting_pro.tar.gz
bash_dist=$home_dir/bash.tar.gz
function title {
  echo 
  echo "###############################################################################"
  echo "## $1"
  echo "###############################################################################" 
  echo 
}
title "打包源代码"
tar --exclude="node_modules/*" --exclude="bash/*" -czf $dist *

title "打包本地依赖"
tar -czf $bash_dist *

title "创建远程目录"
ssh $user@$host "sudo rm -rf $deploy_dir/ && sudo mkdir -p $deploy_dir/render"

title "上传源代码"
ssh $user@$host "sudo chmod 777 $deploy_dir/"
scp -r $dist $user@$host:$deploy_dir

title "上传本地依赖"
scp -r $bash_dist $user@$host:$deploy_dir

title "解压源代码"
ssh $user@$host "cd $deploy_dir && tar -xzf jobposting_pro.tar.gz &&  tar -xzf bash.tar.gz"


# 在远程服务器上执行 setup.sh 脚本
title "执行 setup_remote.sh 脚本"
ssh $user@$host "cd $deploy_dir && chmod +x bash/setup_remote.sh && ./bash/setup_remote.sh"

