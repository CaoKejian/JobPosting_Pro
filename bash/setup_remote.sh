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
cd $deploy_dir/db && rm *.json
mongorestore -d $db_name $db_folder
# for file in $db_folder/*.bson; do
#   filename=$(basename "$file")
#   collection_name="${filename%.*}"  # 去掉文件扩展名的部分作为集合名

#   echo "导入文件: $file 到集合: $collection_name"
#   mongoimport --db $db_name --collection $collection_name --file $file
# done
echo "迁移完成！"
title "服务端开始执行脚本"
title "进入目录"
cd $deploy_dir
title "下载依赖"
sudo npm install 
title "启动服务"
npm run dev &
title '执行完毕！请访问:"http://43.139.142.203:3000/api" '
