from flask import Flask
from .index import index as index_blueprint
from .student import student as student_blueprint

def create_app():
    # 在这里定义路由
    app = Flask(__name__)
    app.register_blueprint(index_blueprint)
    app.register_blueprint(student_blueprint, url_prefix="/student")
    return app
