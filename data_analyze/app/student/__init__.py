from flask import Blueprint

student = Blueprint("student", __name__)
import app.student.views
