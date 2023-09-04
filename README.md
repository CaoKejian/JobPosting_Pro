# 交作业啦——后端

## 技术栈

- API 服务：
  - 框架 express、mongoDB
  - 引用技术 express-validator、jwt、nodemailer、mocha、chai、supertest、mongodb-memory-server、腾讯云 COS
- 数据分析(.py):
  - 框架 Flask
  - 引用技术 
- 接口文档:
  - 框架 React、vite
  - 引用技术 react-router、sass-loader、svgPlugin
- 技术脚本：
  - Bash（shell）脚本——一键部署至远程机器  
    1、packfor_remote 本地打包脚本  
    2、setup_remote 远端脚本

## 当前目录下有三个架构：后端服务(node.js) 和 数据分析服务(python) 和 接口文档(React)

> Express

- 采用 node 的 Express 框架,项目结构：

<pre>

├─ bash                                     /* 自动化脚本 */
│  ├─ ga.sh                                 // 生产环境打包入口
│  ├─ packfor_remote.sh                     // 构建脚本配置
│  ├─ setup_remote.sh                       // 构建入口配置
├─ bin
│  └─ www                                   // 启动文件
├─ config                                   /* 配置文件 */      
│  ├─ db.config.js                          // 数据库连接
├── mailer                                  /* 邮件功能 */
│   │   ├── ...
│   │   └── utils.js                        // 限制请求次数
├─ middleware                               /* 中间件文件 */
│  ├─ verifyJWT.js                          //校验jwt  
├─ model                                    /* 设置模型 */
│  ├─ ...                         
│  ├─ user.js                               // 定义user模型 
├─ public                                   /* 一些与业务代码无关的纯静态文件，如favicon.ico, 
├─ portDocumment                            /* 接口文档(React) */ 
├─ routes                                   /* api服务入口 */
│  ├─ ...                         
│  ├─ user.js                               // 关于user的api服务
├─ rspec                                    /* 单元测试 */ 
│  ├─ test                                  // 测试文件目录
│  │   ├── ...
│  │   └── user.js                          // user的测试文件
│  ├─ authMiddleware.js                     // jwt模拟中间件
│  ├─ mongodb.setup.js                      // mongodb测试启动文件

</pre>

> React

> 数据分析
- 采用Python的Flask框架，因为python做API服务效率低，故整体项目服务使用node.js架构
  - 数据分析
## Mocha 单元测试

```bash
mocha rspec/test --reporter dot // 执行测试用例
```

## Bash 自动化部署脚本

| packfor_remote.sh (本地)            | setup_remote.sh (远端) |
| :---------------------------------- | :--------------------- |
| 1、更新本地代码                     | 1、选择是否更新数据库  |
| 2、执行测试用例                     | 2、重启 Nginx 服务     |
| 3、删除以前的 tar 包                | 3、设置环境变量        |
| 4、打包源代码                       | 4、杀掉进程            |
| 5、打包依赖                         | 5、启动服务            |
| 6、打包前端（React 接口文档）       | 6、部署成功            |
| 7、导出数据库并打包                 | <空>                   |
| 8、创建远程目录                     | <空>                   |
| 9、上传源代码和依赖                 | <空>                   |
| 10、上传前端接口文档                | <空>                   |
| 11、上传数据库                      | <空>                   |
| 12、解压所有文件                    | <空>                   |
| 13、删除多余的 gz 文件              | <空>                   |
| 14、执行远端的 setup_remote.sh 脚本 | <空>                   |
| setup_remote.sh (远端)              | <空>                   |
