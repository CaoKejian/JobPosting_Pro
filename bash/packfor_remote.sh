#!/bin/bash

user=jobpost
host=124.70.188.74
deploy_dir=jobpro
file_name=JobPosting_Pro
home_dir=/Users/duibagroup/Desktop/myself
dist=$home_dir/jobposting_pro.tar.gz
db_dist=$home_dir/jobpost.tar.gz
bash_dist=$home_dir/bash.tar.gz
port_rspec=$home_dir/port.tar.gz
modules_dist=$home_dir/node_modules.tar.gz
function title {
  echo 
  echo "###############################################################################"
  echo "## 👉$1👈"
  echo "###############################################################################" 
  echo 
}
title "更新代码"
read -p "是否要更新本地代码？ (y/n): " choice
# 判断用户的选择
if [ "$choice" = "y" ]; then
  title "执行更新"
  bash/ga.sh "更新本地代码"
elif [ "$choice" = "n" ]; then
  title "取消更新"
  echo "用户选择不更新代码。"
else
  title "无效选择"
  echo "无效的选择。请输入 'yes' 或 'no'。"
fi

title "执行测试用例"
mocha rspec/test --reporter dot
title "clear tar*"
rm -rf $dist $bash_dist $db_dist $port_rspec $modules_dist

title "打包源代码"
tar --exclude="node_modules/*" --exclude="bash/*" --exclude="portDocument/*" -czf $dist *
tar -czf $bash_dist -C ./bash . 

title "正在打包node_modules<<<请稍后..."
modules_total_size=$(du -sk ./node_modules | cut -f 1)
tar --exclude="portDocument/*" -cf - -C ./node_modules . | pv -s ${modules_total_size}k | gzip > $modules_dist
# tar --exclude="portDocument/*" -czf $modules_dist -C ./node_modules .

title "打包接口文档"
cd portDocument
npm run build
cd .. && tar -czf $port_rspec -C ./portDocument/dist .

title "导出数据库并打包"
mongodump --host localhost --port 27017 -o $home_dir -d jobpost
tar -czf $db_dist -C ../jobpost .

title "创建远程目录"
ssh $user@$host "rm -rf $deploy_dir/ && 
   mkdir -p $deploy_dir && 
   mkdir -p $deploy_dir/db && 
   mkdir -p $deploy_dir/node_modules && 
   mkdir -p $deploy_dir/portDocument"

title "上传源代码"
ssh $user@$host "chmod -R 777 $deploy_dir/"
scp -r $dist $user@$host:$deploy_dir

title "上传本地依赖"
scp -r $bash_dist $user@$host:$deploy_dir
scp -r $modules_dist $user@$host:$deploy_dir

title "上传接口文档"
scp -r $port_rspec $user@$host:$deploy_dir/portDocument

title "上传数据库"
scp -r $db_dist $user@$host:$deploy_dir/db

title "解压源代码"
ssh $user@$host "cd $deploy_dir && 
   tar -xzf jobposting_pro.tar.gz && 
   tar -xzf bash.tar.gz &&  
   tar -xzf node_modules.tar.gz -C ./node_modules && 
  cd portDocument &&  tar -xzf port.tar.gz"

title "解压数据表"
ssh $user@$host "cd $deploy_dir/db &&  tar -xzf jobpost.tar.gz"

title "删除gz文件"
ssh $user@$host "cd $deploy_dir && 
   rm -rf jobposting_pro.tar.gz bash.tar.gz node_modules.tar.gz&& 
   rm -rf ./db/jobpost.tar.gz &&
   rm -rf ./portDocument/port.tar.gz"

# 在远程服务器上执行 setup.sh 脚本
title "执行 setup_remote.sh 脚本"
ssh $user@$host "cd $deploy_dir && chmod +x setup_remote.sh && ./setup_remote.sh"

