#!/bin/bash

user=ubuntu
host=43.139.142.203
deploy_dir=jobpro
file_name=JobPosting_Pro
home_dir=/Users/duibagroup/Desktop/myself
dist=$home_dir/jobposting_pro.tar.gz
db_dist=$home_dir/jobpost.tar.gz
bash_dist=$home_dir/bash.tar.gz
function title {
  echo 
  echo "###############################################################################"
  echo "## $1"
  echo "###############################################################################" 
  echo 
}
title "更新代码"
bash/ga.sh "更新本地代码"

title "打包源代码"
tar --exclude="node_modules/*" --exclude="bash/*" -czf $dist *

title "打包本地依赖"
tar -czf $bash_dist -C ./bash . 

title "导出数据库并打包"
# cd $home_dir/
mongodump --host localhost --port 27017 -o $home_dir -d jobpost
tar -czf $db_dist -C ../jobpost .

title "创建远程目录"
ssh $user@$host "sudo rm -rf $deploy_dir/ && sudo mkdir -p $deploy_dir/db"

title "上传源代码"
ssh $user@$host "sudo chmod -R 777 $deploy_dir/"
scp -r $dist $user@$host:$deploy_dir

title "上传本地依赖"
scp -r $bash_dist $user@$host:$deploy_dir

title "上传数据库"
scp -r $db_dist $user@$host:$deploy_dir/db

title "解压源代码"
ssh $user@$host "cd $deploy_dir && sudo tar -xzf jobposting_pro.tar.gz && sudo tar -xzf bash.tar.gz"

title "解压数据表"
ssh $user@$host "cd $deploy_dir/db && sudo tar -xzf jobpost.tar.gz"

title "删除gz文件"
ssh $user@$host "cd $deploy_dir && sudo rm -rf jobposting_pro.tar.gz bash.tar.gz && sudo rm -rf ./db/jobpost.tar.gz"

# 在远程服务器上执行 setup.sh 脚本
title "执行 setup_remote.sh 脚本"
ssh $user@$host "cd $deploy_dir && sudo  chmod +x setup_remote.sh && ./setup_remote.sh"

