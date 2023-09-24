from flask import Flask
from .index import index as index_blueprint
from .student import student as student_blueprint
from .teacher import teacher as teacher_blueprint
from .insertPeople import insertPeople as insertPeople_blueprint
from .mongo import mongo
import logging

def create_app():
    # 在这里定义路由
    app = Flask(__name__)
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/jobpost'
    mongo.init_app(app)
    app.register_blueprint(index_blueprint)
    app.register_blueprint(student_blueprint, url_prefix="/student")
    app.register_blueprint(teacher_blueprint, url_prefix="/teacher")
    app.register_blueprint(insertPeople_blueprint, url_prefix="/insert")
    # log = logging.getLogger('werkzeug')
    # log.setLevel(logging.ERROR)
    return app
