from flask import Blueprint

teacher = Blueprint("teacher", __name__)
import app.teacher.views
