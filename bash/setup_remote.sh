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
  echo "正在更新数据库..."
  mongo $db_name --eval "
      db.getCollectionNames().forEach(function(collectionName) {
          if (!collectionName.startsWith('system.')) {
              db[collectionName].deleteMany({});
          }
      });
  "
  cd db && rm -rf *.json
  mongorestore -d $db_name $db_folder
  title "数据库更新完成"
else
  echo ''
fi
echo "服务端开始执行脚本>>>..."
# title "重启Nginx服务"
# sudo service nginx restart
title "设置环境变量"
export NODE_ENV=production
export PORT=80
title "启动服务"
sudo killall node
sudo npm run dev &
title "全部执行完毕！"
echo "⭐️请访问后端地址->:"http://124.70.188.74/api""
echo "⭐️请访问接口文档->:"http://124.70.188.74:8080/""