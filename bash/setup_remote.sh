#!/bin/bash

user=ubuntu
host=43.139.142.203
deploy_dir=jobpro
db_name=jobpost
db_folder="/home/ubuntu/jobpro/db"

function title {
  echo 
  echo "###############################################################################"
  echo "## 👉$1👈"
  echo "###############################################################################" 
  echo 
}
title "删除远端数据库"
# 有用户之后不要删
# mongo $db_name --eval "
#     db.getCollectionNames().forEach(function(collectionName) {
#         if (!collectionName.startsWith('system.')) {
#             db[collectionName].deleteMany({});
#         }
#     });
# "
title "迁移数据库"
cd db && sudo rm -rf *.json
mongorestore -d $db_name $db_folder
title "服务端开始执行脚本"
title "重启Nginx服务"
sudo service nginx restart
# title "下载依赖"
# sudo npm install
title "设置环境变量"
export NODE_ENV=production
title "启动服务"
killall node
npm run start &
title "执行完毕！"
echo "⭐️请访问后端地址->:"http://43.139.142.203:3000/api""
echo "⭐️请访问接口文档->:"http://43.139.142.203""