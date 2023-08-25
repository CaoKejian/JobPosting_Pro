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
title "删除远端数据库"
# collections=$(mongo $db_name --quiet --eval "db.getCollectionNames()")
# for collection in $collections; do
#   sudo mongo $db_name --eval "db.${collection}.deleteMany({})"
# done
mongo $db_name --eval "
    db.getCollectionNames().forEach(function(collectionName) {
        if (!collectionName.startsWith('system.')) {
            db[collectionName].deleteMany({});
        }
    });
"
title "迁移数据库"
cd $deploy_dir/db && sudo rm -rf *.json
mongorestore -d $db_name $db_folder
title "服务端开始执行脚本"
title "重启Nginx服务"
sudo service nginx restart
title "下载依赖"
sudo npm install
title "启动服务"
killall node
export NODE_ENV=production && npm run dev:pro
title '执行完毕！请访问:"http://43.139.142.203:3000/api"'
