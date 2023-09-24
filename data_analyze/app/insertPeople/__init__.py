from flask import Blueprint

insertPeople = Blueprint("insertPeople", __name__)
import app.insertPeople.views
