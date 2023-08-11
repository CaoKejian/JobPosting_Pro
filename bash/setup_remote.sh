#!/bin/bash

user=ubuntu
host=43.139.142.203
deploy_dir=jobpro
db_name="jobpost"
db_folder="/home/ubuntu/jobpro/db"

function title {
  echo 
  echo "###############################################################################"
  echo "## 👉$1👈"
  echo "###############################################################################" 
  echo 
}
title "迁移数据库"
cd $deploy_dir/db/ && sudo rm -rf *.json
mongorestore -d $db_name $db_folder
echo "迁移完成！"
title "服务端开始执行脚本"
title "进入目录"
cd $deploy_dir/
title "下载依赖"
sudo npm install --progress
title "启动服务"
killall node
npm run dev > /dev/null 2>&1 &
title '执行完毕！请访问:"http://43.139.142.203:3000/api"'
