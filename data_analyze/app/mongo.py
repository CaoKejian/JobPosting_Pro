from flask_pymongo import PyMongo

# 创建一个 PyMongo 实例
mongo = PyMongo()

def init_mongo(app):
    # 初始化 MongoDB 连接
    mongo.init_app(app)
