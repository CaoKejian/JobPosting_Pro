#!/bin/bash

user=jobpost
host=124.70.188.74
deploy_dir=jobpro
db_name=jobpost
db_folder="/home/jobpost/jobpro/db"

function title {
  echo 
  echo "###############################################################################"
  echo "## 👉$1👈"
  echo "###############################################################################" 
  echo 
}
echo "是否更新数据库？(y/n): "
read answer
if [ "$answer" == "y" ]; then
  echo -e "\e[1;34m正在更新数据库...\e[0m"
  mongo $db_name --eval "
      db.getCollectionNames().forEach(function(collectionName) {
          if (!collectionName.startsWith('system.')) {
              db[collectionName].deleteMany({});
          }
      });
  "
  cd db && rm -rf *.json
  mongorestore -d $db_name $db_folder
  echo -e "\e[1;34m所有文档名称：\e[0m"
  mongo $db_name --eval "db.getCollectionNames().forEach(printjson)"
  table_count=$(mongo $db_name --quiet --eval "db.getCollectionNames().filter(function(name) { return !name.startsWith('system.'); }).length")
  echo -e "\e[1;34m共迁移成功 $table_count 张表！\e[0m"
  title "数据库更新完成"
else
  echo ''
fi
echo "服务端开始执行脚本>>>..."
# title "重启Nginx服务"
# sudo service nginx restart
title "结束PM2进程--->"
pm2 delete all
pm2 list

title "设置环境变量"
export NODE_ENV=production
export PORT=80
title "启动服务"
kill all node
# pm2 start "npm" --name 'jobpro' -- run dev:pro --watch
npm run dev:pro
title "全部执行完毕！"
echo -e "\e[1;34m⭐️请访问后端地址->:"http://124.70.188.74/api"\e[0m"
echo -e "\e[1;34m⭐️请访问接口文档->:"http://124.70.188.74:8080/"\e[0m"