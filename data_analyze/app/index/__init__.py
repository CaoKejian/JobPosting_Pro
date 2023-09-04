from flask import Blueprint

index = Blueprint("index", __name__)
import app.index.views
